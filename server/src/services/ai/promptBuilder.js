function buildPrompt({
  text,
  audience,
  category,
  difficulty,
  options,
}) {
  return `
You are a senior instructional designer, corporate trainer, university professor and LMS content creator.

Your task is to convert the following document into a COMPLETE learning course.

Return ONLY valid JSON.
Do not include markdown.
Do not include explanations.
Do not include code fences.

The JSON MUST match this structure exactly.
The JSON MUST match this structure exactly.

{
  "course": {
    "courseTitle": "",
    "description": "",
    "audience": "",
    "category": "",
    "difficulty": "",
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
            "difficulty": "Easy",
            "marks": 1
          }
        ]
      }
    ],
    "assignment": "",
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
        "marks": 1
      }
    ],
    "status": "Published"
  },

  "aiInsights": {

    "executiveSummary": "",

    "department": "",

    "processType": "",

    "complexity": "",

    "estimatedCompletionTime": "",

    "keyRoles": [],

    "requiredDocuments": [],

    "risks": [],

    "complianceRequirements": [],

    "automationOpportunities": [],

    "suggestedImprovements": []

  }
}
Course Requirements

Audience:
${audience}

Category:
${category}

Difficulty:
${difficulty}

AI Features:
${JSON.stringify(options, null, 2)}

----------------------------------------

Generate:

• Professional course title

• Professional description

• Estimated duration

• 5-10 learning objectives

• 5-10 learning outcomes

• Prerequisites

----------------------------------------

Generate between 5 and 10 modules.

Each module MUST contain:

• title

• summary

• content (minimum 500 words)

• duration

• learningObjectives

• keyPoints (5-10)

• example

• tips (3-5)

----------------------------------------

Every module MUST contain EXACTLY FIVE multiple-choice questions.

Every question MUST have:

• question

• exactly four options

• answer (must match one option)

• explanation

• difficulty

• marks = 1

----------------------------------------

Generate ONE practical assignment for the whole course.

----------------------------------------

Generate EXACTLY TWENTY final assessment questions.

Requirements:

• four options

• one correct answer

• explanation

• medium difficulty

----------------------------------------

Rules

Never leave any array empty.

Never leave any field blank.

Do not invent unrelated topics.

Base everything ONLY on the supplied document.

Return JSON ONLY.

----------------------------------------

DOCUMENT
---

AI Insights Requirements

Analyze the SOP and populate the aiInsights object.

Do not fabricate information.

If the SOP does not explicitly contain information, return:

"Not Found"

Generate:

• Executive Summary

• Department

• Process Type

• Complexity (Low / Medium / High)

• Estimated Completion Time

• Key Roles

• Required Documents

• Risks

• Compliance Requirements

• Automation Opportunities

• Suggested Improvements

The AI Insights must be derived ONLY from the supplied SOP.
${text}
`;
}

module.exports = buildPrompt;