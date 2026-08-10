const { generateCourse } = require("../services/geminiService");

const testAI = async (req, res) => {
  try {
    const course = await generateCourse(`
Password Policy

Employees must use strong passwords.

Passwords must contain uppercase letters.

Passwords must be changed every 90 days.

Passwords must never be shared.
`);

    res.status(200).json({
      success: true,
      course,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  testAI,
};