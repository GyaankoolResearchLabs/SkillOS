const { z } = require("zod");

const QuizSchema = z.object({
  question: z.string(),

  options: z.array(z.string()).length(4),

  answer: z.string(),

  explanation: z.string(),

  difficulty: z.enum([
    "Easy",
    "Medium",
    "Hard",
  ]),

  marks: z.number(),
});

const ModuleSchema = z.object({
  content: z.string(),

  learningObjectives: z.array(z.string()).min(5),

  keyPoints: z.array(z.string()).min(5),

  example: z.string(),

  tips: z.array(z.string()).min(3),

  quiz: z.array(QuizSchema).length(5),
});

module.exports = ModuleSchema;