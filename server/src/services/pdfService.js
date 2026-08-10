const fs = require("fs");
const pdf = require("pdf-parse");

console.log("typeof pdf inside service:", typeof pdf);

async function extractPDFText(filePath) {
  console.log("Reading:", filePath);

  const buffer = fs.readFileSync(filePath);

  console.log("Buffer Length:", buffer.length);

  try {
    const data = await pdf(buffer);

    console.log("PDF Parsed Successfully");

    return data.text;
  } catch (err) {
    console.error("PDF PARSE ERROR:");
    console.error(err);

    throw err;
  }
}

module.exports = {
  extractPDFText,
};