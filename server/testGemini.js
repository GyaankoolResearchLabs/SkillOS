require("dotenv").config();
const axios = require("axios");

async function test() {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: "Say Hello."
              }
            ]
          }
        ]
      }
    );

    console.log(response.data);
  } catch (err) {
    console.log("STATUS:", err.response?.status);
    console.log(err.response?.data);
  }
}

test();