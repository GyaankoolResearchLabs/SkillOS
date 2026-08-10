const { z } = require("zod");

// ===============================================
// Topic Schema
// ===============================================

const TopicSchema = z.object({
  name: z.string(),

  description: z.string(),

  priority: z.enum([
    "Critical",
    "Important",
    "Supporting",
  ]),

  concepts: z.array(z.string()),

  procedures: z.array(z.string()),

  roles: z.array(z.string()),

  documents: z.array(z.string()),

  decisionPoints: z.array(z.string()),

  complianceRequirements: z.array(z.string()),

  risks: z.array(z.string()),

  exceptions: z.array(z.string()),
});

// ===============================================
// Topic Extraction Response
// ===============================================

const TopicExtractionSchema = z.object({
  moduleTitle: z.string(),

  topics: z.array(TopicSchema),
});

module.exports = TopicExtractionSchema;