const { generateObject } = require("ai");
const { google } = require("@ai-sdk/google");

const TopicExtractionSchema = require("./topicSchema");

// ===============================================
// Extract Topics From Lesson
// ===============================================

async function extractTopics({
  moduleTitle,
  moduleContent,
}) {
  const result = await generateObject({
    model: google("gemini-2.5-flash"),

    schema: TopicExtractionSchema,

    prompt: `
You are an expert Corporate Trainer.

Your task is to analyze the lesson and extract ALL important training topics.

=========================
MODULE TITLE
=========================

${moduleTitle}

=========================
LESSON
=========================

${moduleContent}

=========================
YOUR TASK
=========================

Read the lesson carefully.

Identify:

• Main Topics

• Procedures

• Roles

• Documents

• Decision Points

• Compliance Rules

• Risks

• Exceptions

=========================
TOPIC PRIORITY
=========================

Critical

Topics that employees MUST know to correctly perform their job.

Examples

• Approval Workflow

• Safety Procedure

• Compliance Requirement

-------------------------

Important

Topics that improve understanding but are less critical.

Examples

• Best Practices

• Documentation

• Communication

-------------------------

Supporting

Helpful information.

Examples

• Background

• Definitions

• History

=========================
IMPORTANT
=========================

Do NOT invent topics.

Everything must come directly from the lesson.

Return ALL important topics.

Never skip a workflow.

Never skip a department.

Never skip a compliance rule.

Return ONLY JSON.
`,
  });

  return result.object;
}

module.exports = extractTopics;