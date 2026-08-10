const jwt = require("jsonwebtoken");

// =====================================================
// GENERATE JWT TOKEN
// =====================================================

const generateToken = (id, sessionDurationHours = 168) => {
  const hours = Number(sessionDurationHours);

  // ---------------------------------------------------
  // Safety validation
  // ---------------------------------------------------

  const validHours =
    Number.isFinite(hours) && hours > 0
      ? hours
      : 168;

  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: `${validHours}h`,
    }
  );
};

module.exports = generateToken;