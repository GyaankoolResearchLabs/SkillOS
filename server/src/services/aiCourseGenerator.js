const openai = require("./openaiService");

async function generateCourse(text) {
  const prompt = `
You are an expert instructional designer.

Convert the following document into a professional learning course.

Return ONLY valid JSON.

The JSON must contain:

{
  "courseTitle":"",
  "description":"",
  "audience":"Employee",
  "category":"",
  "difficulty":"Beginner",
  "estimatedDuration":"",
  "prerequisites":[],
  "learningObjectives":[],
  "learningOutcomes":[],
  "modules":[
      {
        "title":"",
        "summary":"",
        "content":"",
        "duration":"",
        "learningObjectives":[],
        "keyPoints":[],
        "example":"",
        "tips":[],
        "quiz":[
          {
            "question":"",
            "options":[],
            "answer":"",
            "explanation":"",
            "difficulty":"Easy",
            "marks":2
          }
        ]
      }
  ],
  "finalAssessment":[]
}

Document:

${text}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4.1",
    messages: [
      {
        role: "system",
        content:
          "You are an expert LMS instructional designer.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.5,
  });

  const output = response.choices[0].message.content;

  return JSON.parse(output);
}

module.exports = generateCourse;