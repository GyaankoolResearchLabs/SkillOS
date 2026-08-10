const openai = require("./openaiService");
const repairJSON = require("./jsonRepair");

// ======================================================
// Generate Onboarding Study Material + Assessments
// ======================================================

const generateOnboardingAssessments = async (course) => {
  if (!course) {
    throw new Error(
      "Course is required to generate onboarding assessments."
    );
  }

  // ======================================================
  // Build Source Material
  // ======================================================

  const sourceMaterial = [
    `COURSE TITLE:
${course.courseTitle || ""}`,

    `DESCRIPTION:
${course.description || ""}`,

    `LEARNING OBJECTIVES:
${(course.learningObjectives || []).join("\n")}`,

    `LEARNING OUTCOMES:
${(course.learningOutcomes || []).join("\n")}`,

    ...(course.modules || []).map(
      (module, index) => `
MODULE ${index + 1}

TITLE:
${module.title || ""}

SUMMARY:
${module.summary || ""}

CONTENT:
${module.content || ""}

LEARNING OBJECTIVES:
${(module.learningObjectives || []).join("\n")}

KEY POINTS:
${(module.keyPoints || []).join("\n")}

EXAMPLE:
${module.example || ""}
`
    ),
  ].join("\n");

  // ======================================================
  // AI Prompt
  // ======================================================

  const prompt = `
You are an expert enterprise instructional designer and assessment designer.

Your task is to create employee onboarding STUDY MATERIAL and an
ASSESSMENT for five onboarding categories.

The employee must first STUDY the material.

Only after the employee confirms that they have completed studying
will the employee take the assessment.

The assessment must test understanding of the study material.

======================================================
STRICT SOURCE RULES
======================================================

1. Use ONLY information contained in the supplied training material.

2. NEVER invent:
   - company policies
   - procedures
   - dates
   - numbers
   - names
   - benefits
   - responsibilities
   - rules
   - compliance requirements
   - organizational facts

3. Do NOT use outside knowledge.

4. Do NOT assume information that is not explicitly supported.

5. The study material must be educational and easy for an employee
   to understand.

6. Every assessment question must be answerable from the supplied
   training material and the generated study material.

7. Do not create questions about information that was not taught.

8. Do not reveal the correct answers in the study material in a way
   that makes the assessment meaningless.

9. If the supplied material does not contain enough information for
   a specific category, use only the relevant information that is
   available. Never fabricate company-specific information.

======================================================
ONBOARDING CATEGORIES
======================================================

Generate EXACTLY these five categories:

1. Company Introduction
2. HR Policies
3. Organization Guidelines
4. Department Introduction
5. Role & Responsibilities

The titles MUST match exactly.

======================================================
STUDY MATERIAL
======================================================

For EACH category generate:

- title
- description
- studyContent
- estimatedDuration

The studyContent should:

- be written for employees
- use clear headings
- use short paragraphs
- use bullet points where useful
- explain the important concepts from the supplied material
- be practical and easy to study
- contain enough information for the employee to prepare for
  the assessment
- remain strictly grounded in the supplied material

Do NOT write generic corporate information that is not present
in the supplied material.

The studyContent should NOT contain assessment answers such as:

"Question 1 answer is..."

or:

"The correct answer is..."

======================================================
ASSESSMENT
======================================================

For EACH category generate EXACTLY 5 multiple-choice questions.

Each question must have:

- question
- exactly 4 options
- exactly 1 correct answer
- explanation
- difficulty

Difficulty must be one of:

- Easy
- Medium
- Hard

Rules:

1. Exactly 5 questions per category.
2. Exactly 4 options per question.
3. Exactly ONE correct answer.
4. The correct answer must exactly match one option.
5. Questions must test understanding.
6. Avoid simple word-matching questions when possible.
7. Avoid ambiguous questions.
8. Avoid "all of the above".
9. Avoid "none of the above".
10. Do not reveal answers before the assessment.
11. Explanations should explain why the correct answer is correct.
12. Questions must be answerable from the supplied material.
13. Mix Easy, Medium, and Hard questions.
14. Passing score is 80%.

======================================================
IMPORTANT EMPLOYEE FLOW
======================================================

The generated data will be used in this flow:

STUDY MATERIAL
      ↓
Employee clicks "I Have Completed Studying"
      ↓
ASSESSMENT
      ↓
Score >= 80%
      ↓
Induction item becomes completed

If score < 80%:

The induction item MUST remain incomplete.

The employee can review the study material and retry.

======================================================
OUTPUT FORMAT
======================================================

Return ONLY valid JSON.

Return EXACTLY this structure:

{
  "assessments": [
    {
      "title": "Company Introduction",
      "description": "",
      "studyContent": "",
      "estimatedDuration": "5 minutes",
      "questions": [
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
          "difficulty": "Easy"
        }
      ],
      "passingScore": 80
    },

    {
      "title": "HR Policies",
      "description": "",
      "studyContent": "",
      "estimatedDuration": "5 minutes",
      "questions": [],
      "passingScore": 80
    },

    {
      "title": "Organization Guidelines",
      "description": "",
      "studyContent": "",
      "estimatedDuration": "5 minutes",
      "questions": [],
      "passingScore": 80
    },

    {
      "title": "Department Introduction",
      "description": "",
      "studyContent": "",
      "estimatedDuration": "5 minutes",
      "questions": [],
      "passingScore": 80
    },

    {
      "title": "Role & Responsibilities",
      "description": "",
      "studyContent": "",
      "estimatedDuration": "5 minutes",
      "questions": [],
      "passingScore": 80
    }
  ]
}

======================================================
VALIDATION REQUIREMENTS
======================================================

The response MUST contain exactly 5 assessments.

Each assessment MUST contain exactly 5 questions.

Each question MUST contain exactly 4 options.

Every answer MUST exactly match one of the options.

Every assessment MUST contain:

- title
- description
- studyContent
- estimatedDuration
- questions
- passingScore

Passing score MUST be 80.

======================================================
SUPPLIED TRAINING MATERIAL
======================================================

${sourceMaterial}
`;

  // ======================================================
  // OpenAI Request
  // ======================================================

  const response =
    await openai.chat.completions.create({
      model: "gpt-4.1",

      messages: [
        {
          role: "system",
          content:
            "You are a strict enterprise instructional designer and assessment designer. Never hallucinate information. Use only the supplied training material.",
        },

        {
          role: "user",
          content: prompt,
        },
      ],

      response_format: {
        type: "json_object",
      },
    });

  // ======================================================
  // Parse AI Response
  // ======================================================

  let raw =
    response.choices[0].message.content;

  let parsed;

  try {
    parsed = JSON.parse(raw);
  } catch {
    console.log(
      "Repairing onboarding assessment JSON..."
    );

    raw = await repairJSON(raw);

    parsed = JSON.parse(raw);
  }

  // ======================================================
  // Basic Validation
  // ======================================================

  if (
    !parsed ||
    !Array.isArray(parsed.assessments) ||
    parsed.assessments.length !== 5
  ) {
    throw new Error(
      "AI onboarding assessment response must contain exactly 5 assessments."
    );
  }

  // ======================================================
  // Required Titles
  // ======================================================

  const requiredTitles = [
    "Company Introduction",
    "HR Policies",
    "Organization Guidelines",
    "Department Introduction",
    "Role & Responsibilities",
  ];

  // ======================================================
  // Validate Each Assessment
  // ======================================================

  for (const title of requiredTitles) {
    const assessment =
      parsed.assessments.find(
        (item) => item.title === title
      );

    if (!assessment) {
      throw new Error(
        `AI assessment missing required category: ${title}`
      );
    }

    // ----------------------------------------------
    // Study Material
    // ----------------------------------------------

    if (
      typeof assessment.studyContent !==
        "string" ||
      assessment.studyContent.trim()
        .length === 0
    ) {
      throw new Error(
        `Assessment "${title}" is missing study material.`
      );
    }

    if (
      typeof assessment.description !==
        "string"
    ) {
      assessment.description = "";
    }

    if (
      typeof assessment.estimatedDuration !==
        "string"
    ) {
      assessment.estimatedDuration =
        "5 minutes";
    }

    // ----------------------------------------------
    // Passing Score
    // ----------------------------------------------

    assessment.passingScore = 80;

    // ----------------------------------------------
    // Questions
    // ----------------------------------------------

    if (
      !Array.isArray(
        assessment.questions
      ) ||
      assessment.questions.length !== 5
    ) {
      throw new Error(
        `AI assessment "${title}" must contain exactly 5 questions.`
      );
    }

    // ----------------------------------------------
    // Validate Questions
    // ----------------------------------------------

    for (const question of assessment.questions) {
      if (
        !question.question ||
        typeof question.question !==
          "string"
      ) {
        throw new Error(
          `Assessment "${title}" contains a question without question text.`
        );
      }

      if (
        !Array.isArray(
          question.options
        ) ||
        question.options.length !== 4
      ) {
        throw new Error(
          `Assessment "${title}" must have exactly 4 options per question.`
        );
      }

      if (
        question.options.some(
          (option) =>
            typeof option !== "string" ||
            option.trim() === ""
        )
      ) {
        throw new Error(
          `Assessment "${title}" contains an empty option.`
        );
      }

      if (!question.answer) {
        throw new Error(
          `Assessment "${title}" contains a question without an answer.`
        );
      }

      if (
        !question.options.includes(
          question.answer
        )
      ) {
        throw new Error(
          `Assessment "${title}" contains an answer that does not match its options.`
        );
      }

      // --------------------------------------------
      // Difficulty
      // --------------------------------------------

      if (
        !["Easy", "Medium", "Hard"].includes(
          question.difficulty
        )
      ) {
        question.difficulty = "Medium";
      }

      // --------------------------------------------
      // Explanation
      // --------------------------------------------

      if (
        typeof question.explanation !==
        "string"
      ) {
        question.explanation = "";
      }
    }
  }

  // ======================================================
  // Final Logging
  // ======================================================

  console.log(
    "================================"
  );

  console.log(
    "AI ONBOARDING STUDY MATERIAL + ASSESSMENTS"
  );

  console.log(
    JSON.stringify(parsed, null, 2)
  );

  console.log(
    "================================"
  );

  return parsed;
};

module.exports =
  generateOnboardingAssessments;