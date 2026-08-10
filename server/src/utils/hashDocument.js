const crypto = require("crypto");

function generateDocumentHash(text) {
  return crypto
    .createHash("sha256")
    .update(text)
    .digest("hex");
}

module.exports = generateDocumentHash;