function splitIntoChunks(text, maxLength = 12000) {
  const chunks = [];

  let start = 0;

  while (start < text.length) {
    let end = start + maxLength;

    if (end < text.length) {
      const lastSpace = text.lastIndexOf(" ", end);

      if (lastSpace > start) {
        end = lastSpace;
      }
    }

    chunks.push(text.slice(start, end));

    start = end;
  }

  return chunks;
}

module.exports = splitIntoChunks;