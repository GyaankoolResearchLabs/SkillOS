const openai = require("./openaiService");

async function summarizeChunk(chunk) {
  const response =
    await openai.chat.completions.create({
      model: "gpt-4.1-mini",

      messages: [
        {
          role: "system",
          content:
            "You summarize corporate SOP documents.",
        },

        {
          role: "user",
          content: `
Summarize this SOP.

Keep only:

• Purpose
• Scope
• Responsibilities
• Procedure
• Safety
• Important Rules
• Best Practices

Ignore repeated text.

Document:

${chunk}
`,
        },
      ],

      temperature: 0.2,
    });

  return response.choices[0].message.content;
}

module.exports = summarizeChunk;