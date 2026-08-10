function cleanText(text) {
  if (!text) return "";

  return text
    .replace(/\r/g, "")
    .replace(/\t/g, " ")
    .replace(/\s{2,}/g, " ")
    .replace(/Page\s+\d+/gi, "")
    .replace(/\b\d+\b/g, (num) => {
      if (num.length > 5) return "";
      return num;
    })
    .replace(/www\.[^\s]+/gi, "")
    .replace(/https?:\/\/[^\s]+/gi, "")
    .replace(/[ ]{2,}/g, " ")
    .trim();
}

module.exports = cleanText;