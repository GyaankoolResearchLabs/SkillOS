const { z } = require("zod");

const OutlineModuleSchema = z.object({
  title: z.string(),

  summary: z.string(),

  duration: z.string(),
});

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

const CourseOutlineSchema = z.object({
  course: z.object({
    courseTitle: z.string(),

    description: z.string(),

    audience: z.string(),

    category: z.string(),

    difficulty: z.string(),

    estimatedDuration: z.string(),

    prerequisites: z.array(z.string()),

    learningObjectives: z.array(z.string()),

    learningOutcomes: z.array(z.string()),

    modules: z.array(OutlineModuleSchema),

    status: z.string(),
  }),

  aiInsights: AIInsightsSchema,
});

module.exports = CourseOutlineSchema;