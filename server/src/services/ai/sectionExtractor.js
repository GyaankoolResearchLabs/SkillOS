const headings = [
  "introduction",
  "purpose",
  "scope",
  "objective",
  "responsibility",
  "procedure",
  "process",
  "steps",
  "workflow",
  "guidelines",
  "policy",
  "safety",
  "conclusion",
];

function extractImportantSections(text) {
  const lines = text.split("\n");

  const selected = [];

  for (const line of lines) {
    const lower = line.toLowerCase();

    if (
      headings.some((h) => lower.includes(h))
    ) {
      selected.push(line);
    }
  }

  return selected.join("\n");
}

module.exports = extractImportantSections;