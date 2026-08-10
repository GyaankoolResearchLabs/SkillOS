
 // ================================================
// SkillOS AI Course Generator V2
// ================================================

function detectAudience(text) {
  const lower = text.toLowerCase();

  if (
    lower.includes("student") ||
    lower.includes("semester") ||
    lower.includes("college") ||
    lower.includes("exam")
  ) {
    return "Student";
  }

  if (
    lower.includes("teacher") ||
    lower.includes("faculty") ||
    lower.includes("instructor")
  ) {
    return "Teacher";
  }

  return "Employee";
}

function detectDifficulty(text) {
  const words = text.split(/\s+/).length;

  if (words < 500) return "Beginner";
  if (words < 1500) return "Intermediate";

  return "Advanced";
}

function estimateDuration(moduleCount) {
  return `${moduleCount * 15} Minutes`;
}

function generateSummary(topic) {
  return `This module introduces ${topic} and explains its importance in the overall learning process. Learners will understand how the topic fits into the workflow and why following best practices is essential.`;
}

function generateExample(topic) {
  return `Example:

An employee follows the documented process while performing "${topic}" to ensure consistency, quality and compliance with organizational standards.`;
}

function generateTips() {
  return [
    "Read the learning material carefully.",
    "Never skip mandatory steps.",
    "Follow organizational standards.",
    "Review the summary before attempting the quiz.",
    "Practice the workflow regularly."
  ];
}

function generateKeyPoints(topic) {
  return [
    `Definition of ${topic}`,
    `Importance of ${topic}`,
    `Best Practices`,
    `Common Mistakes`,
    `Real-world Applications`
  ];
}

function generateQuiz(topic) {
  return [
    {
      question: `What is the primary objective of "${topic}"?`,
      options: [
        "Improve consistency",
        "Ignore procedures",
        "Increase errors",
        "None of the above"
      ],
      answer: "Improve consistency",
      explanation:
        "Standard procedures improve consistency across the organization.",
      difficulty: "Easy",
      marks: 2,
    },

    {
      question: `Which practice should be followed while performing "${topic}"?`,
      options: [
        "Follow documented procedures",
        "Skip important steps",
        "Guess the workflow",
        "Ignore instructions"
      ],
      answer: "Follow documented procedures",
      explanation:
        "Documented procedures reduce mistakes and improve quality.",
      difficulty: "Medium",
      marks: 2,
    },

    {
      question: `Why is "${topic}" important?`,
      options: [
        "Maintains quality",
        "Creates confusion",
        "Slows work",
        "Has no benefit"
      ],
      answer: "Maintains quality",
      explanation:
        "Standardized processes improve productivity and quality.",
      difficulty: "Medium",
      marks: 2,
    },

    {
      question: `Which statement is correct?`,
      options: [
        "Best practices improve efficiency",
        "Documentation should be ignored",
        "Rules never matter",
        "Procedures reduce quality"
      ],
      answer: "Best practices improve efficiency",
      explanation:
        "Following best practices improves productivity.",
      difficulty: "Hard",
      marks: 2,
    },

    {
      question: `After learning "${topic}", what should the learner do?`,
      options: [
        "Apply it practically",
        "Forget it",
        "Ignore the SOP",
        "Skip implementation"
      ],
      answer: "Apply it practically",
      explanation:
        "Training should always be followed by practical application.",
      difficulty: "Easy",
      marks: 2,
    },
  ];
}

function generateModule(title) {
  return {
    title,

    summary: generateSummary(title),

    content: `
${title}

This lesson provides a detailed explanation of ${title}.

The learner will understand:

• The purpose of this topic

• Standard workflow

• Best practices

• Common mistakes

• Practical implementation

• Compliance requirements

• Real-world applications

By the end of this lesson, learners should confidently apply the knowledge while following organizational standards.
`,

    duration: "15 mins",

    learningObjectives: [
      `Understand ${title}`,
      `Explain ${title}`,
      `Apply ${title}`,
    ],

    keyPoints: generateKeyPoints(title),

    example: generateExample(title),

    tips: generateTips(),

    quiz: generateQuiz(title),
  };
}
// ================================================
// Generate Course
// ================================================

function generateCourse(text) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  // ==========================================
  // Course Title
  // ==========================================

  let courseTitle = "AI Generated Training";

  for (const line of lines) {
    if (
      line.length > 5 &&
      line.length < 70 &&
      !/page|prepared|sample|www|http|phone|copyright|^\d+$/i.test(line)
    ) {
      courseTitle = line;
      break;
    }
  }

  if (
    !courseTitle.toLowerCase().includes("training") &&
    !courseTitle.toLowerCase().includes("course")
  ) {
    courseTitle += " Training";
  }

  // ==========================================
  // Detect Module Titles
  // ==========================================

  const keywords = [
    "Introduction",
    "Objective",
    "Objectives",
    "Purpose",
    "Scope",
    "Overview",
    "Process",
    "Procedure",
    "Workflow",
    "Responsibilities",
    "Safety",
    "Execution",
    "Implementation",
    "Policy",
    "Compliance",
    "Guidelines",
    "Quality",
    "Conclusion",
    "Summary",
    "Next Steps",
    "Risk",
    "Monitoring",
  ];

  let modules = [];

  lines.forEach((line) => {
    if (
      keywords.some((keyword) =>
        line.toLowerCase().includes(keyword.toLowerCase())
      )
    ) {
      modules.push(generateModule(line));
    }
  });

  // ==========================================
  // Remove Duplicate Modules
  // ==========================================

  modules = modules.filter(
    (module, index, self) =>
      index ===
      self.findIndex(
        (m) =>
          m.title.toLowerCase() ===
          module.title.toLowerCase()
      )
  );

  // ==========================================
  // Default Modules
  // ==========================================

  if (modules.length === 0) {
    modules = [
      generateModule("Introduction"),
      generateModule("Standard Operating Procedure"),
      generateModule("Workflow"),
      generateModule("Responsibilities"),
      generateModule("Best Practices"),
      generateModule("Safety Guidelines"),
      generateModule("Quality Assurance"),
      generateModule("Conclusion"),
    ];
  }

  // ==========================================
  // Final Assessment
  // ==========================================

  const finalAssessment = [
    {
      question:
        "Why should employees follow Standard Operating Procedures?",
      options: [
        "To improve consistency",
        "To ignore company policies",
        "To increase errors",
        "None of the above",
      ],
      answer: "To improve consistency",
      explanation:
        "Standard Operating Procedures improve quality and consistency.",
      difficulty: "Easy",
      marks: 2,
    },

    {
      question:
        "What should be done before performing a new process?",
      options: [
        "Understand the documented workflow",
        "Guess the process",
        "Skip instructions",
        "Ignore safety",
      ],
      answer: "Understand the documented workflow",
      explanation:
        "Understanding the workflow reduces operational mistakes.",
      difficulty: "Medium",
      marks: 2,
    },

    {
      question:
        "Which practice improves operational efficiency?",
      options: [
        "Following best practices",
        "Skipping quality checks",
        "Ignoring documentation",
        "Working without procedures",
      ],
      answer: "Following best practices",
      explanation:
        "Following best practices ensures efficiency and compliance.",
      difficulty: "Medium",
      marks: 2,
    },

    {
      question:
        "Why is documentation important?",
      options: [
        "It provides consistency",
        "It wastes time",
        "It increases confusion",
        "It has no value",
      ],
      answer: "It provides consistency",
      explanation:
        "Documentation ensures everyone follows the same process.",
      difficulty: "Hard",
      marks: 2,
    },

    {
      question:
        "What should a learner do after completing the training?",
      options: [
        "Apply the learning practically",
        "Ignore the SOP",
        "Delete the documentation",
        "Skip implementation",
      ],
      answer: "Apply the learning practically",
      explanation:
        "Knowledge becomes valuable only after practical implementation.",
      difficulty: "Easy",
      marks: 2,
    },
  ];

  // ==========================================
  // Return Course
  // ==========================================

  return {
    courseTitle,

    description:
      "AI-generated learning course created automatically from the uploaded document.",

    audience: detectAudience(text),

    category: "Professional Training",

    difficulty: detectDifficulty(text),

    estimatedDuration: estimateDuration(
      modules.length
    ),

    prerequisites: [
      "Basic understanding of organizational workflows",
      "Willingness to learn company procedures",
    ],

    learningObjectives: [
      "Understand the uploaded document",
      "Identify standard workflows",
      "Follow organizational procedures",
      "Apply best practices confidently",
    ],

    learningOutcomes: [
      "Perform tasks independently",
      "Reduce operational errors",
      "Improve compliance",
      "Increase productivity",
    ],

    modules,

    finalAssessment,

    thumbnail: "",

    tags: [
      "AI Generated",
      "SkillOS",
      "Training",
      "Learning",
      "Compliance",
    ],

    status: "Published",
  };
}

// ================================================
// Export
// ================================================

module.exports = generateCourse;