const openai = require("./openaiService");

async function repairJSON(brokenJSON) {
  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",

    messages: [
      {
        role: "system",
        content:
          "Fix invalid JSON. Return ONLY valid JSON. Do not explain anything.",
      },
      {
        role: "user",
        content: brokenJSON,
      },
    ],

    response_format: {
      type: "json_object",
    },
  });

  return response.choices[0].message.content;
}

module.exports = repairJSON;