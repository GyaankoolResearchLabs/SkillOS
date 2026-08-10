const summarizeChunk = require("./summaryGenerator");

async function createMasterSummary(chunks) {
  let summaries = [];

  for (const chunk of chunks) {
    const summary = await summarizeChunk(chunk);

    summaries.push(summary);
  }

  return summaries.join("\n\n");
}

module.exports = createMasterSummary;