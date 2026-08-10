const { generateObject } = require("ai");
const { google } = require("@ai-sdk/google");

const {
  QuestionBankSchema,
} = require("./questionSchema");

const buildQuizPrompt = require("./quizPromptBuilder");

// ===============================================
// Generate Question Bank For One Topic
// ===============================================

async function generateQuestionBank({
  moduleTitle,
  moduleContent,
  topic,
  audience,
  difficulty,
}) {
  const prompt = buildQuizPrompt({
    moduleTitle,
    moduleContent,
    audience,
    difficulty,
    topics: [topic], // ONLY ONE TOPIC
  });

  const result = await generateObject({
    model: google("gemini-2.5-flash"),

    schema: QuestionBankSchema,

    prompt,
  });

  return result.object;
}

module.exports = generateQuestionBank;