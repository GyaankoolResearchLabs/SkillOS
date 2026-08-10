const openai = require("./openaiService");
const buildPrompt = require("./modulePromptBuilder");
const ModuleSchema = require("./moduleSchema");
const repairJSON = require("./jsonRepair");

async function generateModule({
  courseTitle,
  courseDescription,
  audience,
  difficulty,
  moduleTitle,
  moduleSummary,
}) {
  const prompt = buildPrompt({
    courseTitle,
    courseDescription,
    audience,
    difficulty,
    moduleTitle,
    moduleSummary,
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",

    messages: [
      {
        role: "system",
        content:
          "You are an expert instructional designer and corporate trainer.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],

    response_format: {
      type: "json_object",
    },
  });

  let raw = response.choices[0].message.content;

  let parsed;

  try {
    parsed = JSON.parse(raw);
  } catch {
    console.log("Repairing Module JSON...");

    raw = await repairJSON(raw);

    parsed = JSON.parse(raw);
  }

  const validated = ModuleSchema.parse(parsed);

  return validated;
}

module.exports = generateModule;