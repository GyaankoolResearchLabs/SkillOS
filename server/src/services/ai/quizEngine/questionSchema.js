const { z } = require("zod");

// ===============================================
// Individual Question Schema
// ===============================================

const QuestionSchema = z.object({
  // Question
  question: z.string(),

  // Four options
  options: z.array(z.string()).length(4),

  // Correct answer (must exactly match one option)
  answer: z.string(),

  // Explanation shown after submission
  explanation: z.string(),

  // Topic this question belongs to
  topic: z.string(),

  // Question category
  type: z.enum([
    "Knowledge",
    "Understanding",
    "Application",
    "Scenario",
    "Compliance",
    "Exception",
  ]),

  // Bloom's Taxonomy Level
  bloomsLevel: z.enum([
    "Remember",
    "Understand",
    "Apply",
    "Analyze",
  ]),

  // Difficulty
  difficulty: z.enum([
    "Easy",
    "Medium",
    "Hard",
  ]),

  // Marks
  marks: z.number(),

  // Learning Objective
  learningObjective: z.string(),

  // Source section inside the lesson
  sourceSection: z.string(),

  // Supporting lesson excerpt
  sourceExcerpt: z.string(),
});

// ===============================================
// Question Bank Schema
// ===============================================

const QuestionBankSchema = z.object({
  topic: z.string(),

  priority: z.enum([
    "Critical",
    "Important",
    "Supporting",
  ]),

  questions: z.array(QuestionSchema).min(3).max(5),
});

module.exports = {
  QuestionSchema,
  QuestionBankSchema,
};