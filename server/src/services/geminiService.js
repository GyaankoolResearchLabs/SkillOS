const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateWithModel(model, prompt) {
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  let text = "";

  if (response.text) {
    text = response.text;
  } else if (response.output_text) {
    text = response.output_text;
  } else if (
    response.candidates &&
    response.candidates.length > 0 &&
    response.candidates[0].content &&
    response.candidates[0].content.parts &&
    response.candidates[0].content.parts.length > 0
  ) {
    text = response.candidates[0].content.parts[0].text;
  }

  if (!text) {
    throw new Error(`No response returned from ${model}`);
  }

  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned);
}

async function generateCourse(sopText) {
  const prompt = `
You are an expert Instructional Designer.

Convert the following SOP into a complete employee training course.

Return ONLY valid JSON.

Schema:

{
  "courseTitle": "",
  "description": "",
  "difficulty": "",
  "estimatedDuration": "",
  "learningObjectives": [],
  "modules": [
    {
      "title": "",
      "content": "",
      "duration": "",
      "learningObjectives": [],
      "quiz": [
        {
          "question": "",
          "options": [
            "",
            "",
            "",
            ""
          ],
          "answer": ""
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
      "answer": ""
    }
  ]
}

SOP:

${sopText}
`;

  const models = [
    "gemini-2.0-flash",
    "gemini-flash-latest",
    "gemini-2.5-flash",
    "gemini-pro-latest",
  ];

  let lastError = null;

  for (const model of models) {
    try {
      console.log(`Trying model: ${model}`);

      const result = await generateWithModel(model, prompt);

      console.log(`Success using ${model}`);

      return result;

    } catch (err) {
      console.log(`Failed: ${model}`);
      console.error(err.message);

      lastError = err;
    }
  }

  throw lastError || new Error("All Gemini models failed.");
}

module.exports = {
  generateCourse,
};