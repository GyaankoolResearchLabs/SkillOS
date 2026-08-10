function buildModulePrompt({
  courseTitle,
  courseDescription,
  audience,
  difficulty,
  moduleTitle,
  moduleSummary,
}) {
  return `
You are a senior corporate trainer and instructional designer.

Generate ONE complete learning module.

Return ONLY valid JSON.

Do not use markdown.
Do not use code fences.
Do not explain anything.

Return this exact structure:

{
  "content": "",
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

Rules:

Generate:

• 800–1200 words of lesson content

• 5 learning objectives

• 5–10 key points

• One realistic business example

• 5 practical tips

Generate EXACTLY FIVE multiple-choice questions.

Every quiz question must contain:

• question

• exactly four options

• answer

• explanation

• difficulty

• marks = 1

Course

Title:
${courseTitle}

Description:
${courseDescription}

Audience:
${audience}

Difficulty:
${difficulty}

Module

Title:
${moduleTitle}

Summary:
${moduleSummary}

Everything must be based ONLY on this module.
`;
}

module.exports = buildModulePrompt;