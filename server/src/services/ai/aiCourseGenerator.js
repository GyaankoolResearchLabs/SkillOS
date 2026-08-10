const openai = require("../../services/openaiService");
const AIConfiguration = require("../../models/AIConfiguration");

// =====================================================
// DEFAULT AI CONFIGURATION
// =====================================================

const DEFAULT_CONFIG = {
  enabled: true,

  provider: "OpenAI",

  model: "gpt-4.1",

  features: {
    sopCourseGeneration: true,
    sopAnalysis: true,
    quizGeneration: true,
    aiInsights: true,
    courseRecommendations: true,
  },

  courseGeneration: {
    difficulty: "Intermediate",
    modules: 5,
    lessonsPerModule: 4,
  },

  quizGeneration: {
    questionsPerQuiz: 10,
    passingScore: 70,

    // IMPORTANT
    // Must match Course schema enum
    difficulty: "Medium",
  },

  responseStyle: "Professional",
};

// =====================================================
// GET AI CONFIGURATION
// =====================================================

const getConfiguration = async (userId) => {
  if (!userId) {
    return DEFAULT_CONFIG;
  }

  const configuration =
    await AIConfiguration.findOne({
      createdBy: userId,
    }).lean();

  if (!configuration) {
    return DEFAULT_CONFIG;
  }

  return {
    ...DEFAULT_CONFIG,

    ...configuration,

    features: {
      ...DEFAULT_CONFIG.features,
      ...(configuration.features || {}),
    },

    courseGeneration: {
      ...DEFAULT_CONFIG.courseGeneration,
      ...(configuration.courseGeneration || {}),
    },

    quizGeneration: {
      ...DEFAULT_CONFIG.quizGeneration,
      ...(configuration.quizGeneration || {}),
    },
  };
};

// =====================================================
// NORMALIZE QUIZ DIFFICULTY
// =====================================================

const normalizeQuizDifficulty = (
  difficulty
) => {
  if (!difficulty) {
    return "Medium";
  }

  const value =
    String(difficulty)
      .trim()
      .toLowerCase();

  if (
    value === "easy" ||
    value === "beginner"
  ) {
    return "Easy";
  }

  if (
    value === "hard" ||
    value === "advanced" ||
    value === "expert"
  ) {
    return "Hard";
  }

  return "Medium";
};

// =====================================================
// NORMALIZE COURSE OUTPUT
// =====================================================

const normalizeGeneratedCourse = (
  course,
  configuration
) => {
  if (!course || typeof course !== "object") {
    throw new Error(
      "AI returned an invalid course object."
    );
  }

  // ---------------------------------------------------
  // Modules
  // ---------------------------------------------------

  if (!Array.isArray(course.modules)) {
    course.modules = [];
  }

  course.modules =
    course.modules.map((module) => {
      if (!module || typeof module !== "object") {
        return module;
      }

      // -----------------------------------------------
      // Quiz
      // -----------------------------------------------

      if (!Array.isArray(module.quiz)) {
        module.quiz = [];
      }

      module.quiz =
        module.quiz.map((question) => {
          if (
            !question ||
            typeof question !== "object"
          ) {
            return question;
          }

          return {
            ...question,

            difficulty:
              normalizeQuizDifficulty(
                question.difficulty ||
                  configuration
                    .quizGeneration
                    .difficulty
              ),
          };
        });

      return module;
    });

  // ---------------------------------------------------
  // Final Assessment
  // ---------------------------------------------------

  if (
    !Array.isArray(course.finalAssessment)
  ) {
    course.finalAssessment = [];
  }

  course.finalAssessment =
    course.finalAssessment.map(
      (question) => {
        if (
          !question ||
          typeof question !== "object"
        ) {
          return question;
        }

        return {
          ...question,

          difficulty:
            normalizeQuizDifficulty(
              question.difficulty
            ),
        };
      }
    );

  return course;
};

// =====================================================
// BUILD PROMPT
// =====================================================

const buildPrompt = ({
  text,
  audience,
  category,
  difficulty,
  configuration,
}) => {
  const courseSettings =
    configuration.courseGeneration;

  const quizSettings =
    configuration.quizGeneration;

  const finalDifficulty =
    difficulty &&
    difficulty !== "Auto"
      ? difficulty
      : courseSettings.difficulty;

  return `
You are an expert instructional designer
working for an enterprise Learning Management
System called SkillOS.

Convert the supplied SOP/document into a
professional employee training course.

====================================================
COURSE SETTINGS
====================================================

Audience:
${audience || "Employee"}

Category:
${category || "Professional Training"}

Course difficulty:
${finalDifficulty}

Target number of modules:
${courseSettings.modules}

Target lessons per module:
${courseSettings.lessonsPerModule}

Response style:
${configuration.responseStyle}

Quiz questions per module:
${quizSettings.questionsPerQuiz}

Quiz difficulty:
${quizSettings.difficulty}

Quiz passing score:
${quizSettings.passingScore}%

====================================================
IMPORTANT QUIZ RULE
====================================================

Quiz difficulty MUST use ONLY one of:

"Easy"
"Medium"
"Hard"

NEVER return:

"Beginner"
"Intermediate"
"Advanced"
"Expert"

for quiz difficulty.

====================================================
IMPORTANT INSTRUCTIONS
====================================================

1. Base the course primarily on the supplied
   document.

2. Do not invent company policies, procedures,
   regulations, or facts unsupported by the
   document.

3. Create approximately the requested number
   of modules.

4. Make the content practical for employees.

5. Use clear professional language.

6. Include meaningful learning objectives.

7. Generate useful quiz questions based on
   the actual training content.

8. Do not create repetitive modules.

9. Do not return markdown.

10. Return ONLY valid JSON.

====================================================
JSON FORMAT
====================================================

{
  "courseTitle": "",
  "description": "",
  "audience": "${audience || "Employee"}",
  "category": "${category || "Professional Training"}",
  "difficulty": "${finalDifficulty}",
  "estimatedDuration": "",
  "prerequisites": [],
  "learningObjectives": [],
  "learningOutcomes": [],

  "modules": [
    {
      "title": "",
      "summary": "",
      "content": "",
      "duration": "",
      "learningObjectives": [],
      "keyPoints": [],
      "example": "",
      "tips": [],

      "quiz": [
        {
          "question": "",
          "options": [
            "",
            "",
            "",
            ""
          ],
          "answer": "",
          "explanation": "",
          "difficulty": "Medium",
          "marks": 2
        }
      ]
    }
  ],

  "finalAssessment": [
    {
      "question": "",
      "options": [
        "",
        "",
        "",
        ""
      ],
      "answer": "",
      "explanation": "",
      "difficulty": "Medium",
      "marks": 2
    }
  ]
}

====================================================
SOURCE DOCUMENT
====================================================

${text}
`;
};

// =====================================================
// GENERATE COURSE
// =====================================================

async function generateCourse({
  text,
  audience,
  category,
  difficulty,
  options = {},
  userId,
}) {
  if (!text || !text.trim()) {
    throw new Error(
      "No SOP content was provided for AI generation."
    );
  }

  // ===================================================
  // LOAD CONFIGURATION
  // ===================================================

  const configuration =
    await getConfiguration(userId);

  console.log(
    "=========================================="
  );

  console.log(
    "AI CONFIGURATION USED:"
  );

  console.log({
    enabled: configuration.enabled,
    provider: configuration.provider,
    model: configuration.model,

    courseDifficulty:
      configuration.courseGeneration
        .difficulty,

    modules:
      configuration.courseGeneration
        .modules,

    lessonsPerModule:
      configuration.courseGeneration
        .lessonsPerModule,

    quizDifficulty:
      configuration.quizGeneration
        .difficulty,

    questionsPerQuiz:
      configuration.quizGeneration
        .questionsPerQuiz,

    passingScore:
      configuration.quizGeneration
        .passingScore,
  });

  console.log(
    "=========================================="
  );

  // ===================================================
  // AI DISABLED
  // ===================================================

  if (!configuration.enabled) {
    throw new Error(
      "AI services are currently disabled by the organization administrator."
    );
  }

  // ===================================================
  // COURSE GENERATION DISABLED
  // ===================================================

  if (
    configuration.features &&
    configuration.features
      .sopCourseGeneration === false
  ) {
    throw new Error(
      "AI SOP course generation is disabled in AI Configuration."
    );
  }

  // ===================================================
  // PROVIDER
  // ===================================================

  if (
    configuration.provider !==
    "OpenAI"
  ) {
    throw new Error(
      `The selected AI provider "${configuration.provider}" is not currently connected to the SkillOS course generator. Please select OpenAI.`
    );
  }

  // ===================================================
  // BUILD PROMPT
  // ===================================================

  const prompt = buildPrompt({
    text,
    audience,
    category,
    difficulty,
    configuration,
  });

  // ===================================================
  // OPENAI
  // ===================================================

  const response =
    await openai.chat.completions.create({
      model:
        configuration.model ||
        "gpt-4.1",

      messages: [
        {
          role: "system",
          content:
            "You are an expert enterprise LMS instructional designer. Return only valid JSON.",
        },

        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.5,
    });

  // ===================================================
  // EXTRACT OUTPUT
  // ===================================================

  let output =
    response?.choices?.[0]?.message?.content;

  if (!output) {
    throw new Error(
      "AI provider returned an empty response."
    );
  }

  // ===================================================
  // CLEAN MARKDOWN
  // ===================================================

  output = output
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  // ===================================================
  // PARSE JSON
  // ===================================================

  let course;

  try {
    course = JSON.parse(output);
  } catch (error) {
    console.error(
      "AI COURSE JSON PARSE ERROR:",
      error
    );

    console.error(
      "RAW AI OUTPUT:",
      output
    );

    throw new Error(
      "AI returned invalid course JSON."
    );
  }

  // ===================================================
  // NORMALIZE AGAIN BEFORE DATABASE
  // ===================================================

  course =
    normalizeGeneratedCourse(
      course,
      configuration
    );

  // ===================================================
  // AI INSIGHTS
  // ===================================================

  const aiInsights = {
    generatedBy:
      configuration.provider,

    model:
      configuration.model,

    difficulty:
      course.difficulty ||
      configuration.courseGeneration
        .difficulty,

    modulesGenerated:
      course.modules?.length || 0,

    configuredModules:
      configuration.courseGeneration
        .modules,

    configuredLessonsPerModule:
      configuration.courseGeneration
        .lessonsPerModule,

    quizDifficulty:
      configuration.quizGeneration
        .difficulty,

    generatedAt: new Date(),
  };

  // ===================================================
  // RETURN
  // ===================================================

  return {
    course,
    aiInsights,
  };
};

module.exports = generateCourse;