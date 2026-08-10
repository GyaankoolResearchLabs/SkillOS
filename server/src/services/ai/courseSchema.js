const { z } = require("zod");

// ===============================================
// Quiz Schema
// ===============================================

const QuizSchema = z.object({
  question: z.string(),

  options: z.array(z.string()).length(4),

  answer: z.string(),

  explanation: z.string().default(""),

  difficulty: z.enum([
    "Easy",
    "Medium",
    "Hard",
  ]),

  marks: z.number(),
});

// ===============================================
// Module Schema
// ===============================================

const ModuleSchema = z.object({
  title: z.string(),

  summary: z.string(),

  content: z.string(),

  duration: z.string(),

  learningObjectives: z.array(z.string()),

  keyPoints: z.array(z.string()),

  example: z.string(),

  tips: z.array(z.string()),

  pdfUrl: z.string().optional().default(""),

  videoUrl: z.string().optional().default(""),

  imageUrl: z.string().optional().default(""),

  quiz: z.array(QuizSchema),
});

// ===============================================
// Course Schema
// ===============================================

const CourseSchema = z.object({
  courseTitle: z.string(),

  description: z.string(),

  audience: z.string(),

  category: z.string(),

  difficulty: z.string(),

  estimatedDuration: z.string(),

  prerequisites: z.array(z.string()),

  learningObjectives: z.array(z.string()),

  learningOutcomes: z.array(z.string()),

  modules: z.array(ModuleSchema),

  assignment: z.string(),

  finalAssessment: z.array(QuizSchema),

  thumbnail: z.string().optional().default(""),

  tags: z.array(z.string()).optional().default([]),

  status: z.enum([
    "Draft",
    "Published",
    "Archived",
  ]),
});

// ===============================================
// AI Insights Schema
// ===============================================

const AIInsightsSchema = z.object({
  executiveSummary: z.string(),

  department: z.string(),

  processType: z.string(),

  complexity: z.string(),

  estimatedCompletionTime: z.string(),

  keyRoles: z.array(z.string()),

  requiredDocuments: z.array(z.string()),

  risks: z.array(z.string()),

  complianceRequirements: z.array(z.string()),

  automationOpportunities: z.array(z.string()),

  suggestedImprovements: z.array(z.string()),
});

// ===============================================
// Complete AI Response Schema
// ===============================================

const AIResponseSchema = z.object({
  course: CourseSchema,

  aiInsights: AIInsightsSchema,
});

// ===============================================
// Exports
// ===============================================

module.exports = {
  CourseSchema,
  AIResponseSchema,
};