function buildQuizPrompt({
  moduleTitle,
  moduleContent,
  topics,
  audience,
  difficulty,
}) {
  return `

You are an Enterprise Corporate Trainer and Instructional Designer.

Your task is to generate a HIGH QUALITY QUESTION BANK based ONLY on the lesson provided.

==========================
COURSE INFORMATION
==========================

Audience:
${audience}

Difficulty:
${difficulty}

Module:
${moduleTitle}

==========================
LESSON
==========================

${moduleContent}

==========================
TOPICS
==========================

${JSON.stringify(topics, null, 2)}

==========================
STRICT RULES
==========================

1. Every Critical topic MUST generate 5 questions.

2. Every Important topic MUST generate 5 questions.

3. Every Supporting topic MUST generate 3 questions.

4. Questions MUST be directly related to their topic.

5. Never generate generic questions.

6. Never ask:
- What is the purpose...
- Why is documentation important...
- Which statement is true...
- What is an SOP...

7. Every question MUST reference information that exists inside the lesson.

8. Incorrect answers must be realistic workplace mistakes.

9. Never use:
- All of the above
- None of the above

10. Every explanation should teach the learner.

==========================
QUESTION DISTRIBUTION
==========================

For every Critical topic:

Question 1
Knowledge

Question 2
Understanding

Question 3
Application

Question 4
Scenario

Question 5
Compliance OR Exception

----------------------------

For every Important topic:

Question 1
Knowledge

Question 2
Application

Question 3
Scenario

Question 4
Understanding

Question 5
Compliance OR Exception

----------------------------

For every Supporting topic:

Question 1
Knowledge

Question 2
Understanding

Question 3
Scenario

==========================
SCENARIO QUESTIONS
==========================

Scenario questions must describe realistic workplace situations.

Example:

An employee skipped manager approval and HR continued processing.

According to the SOP, what should happen next?

==========================
EXPLANATIONS
==========================

Every explanation must explain WHY the answer is correct.

Do not simply repeat the answer.

==========================
OUTPUT
==========================

Return ONLY valid JSON.

Do not include markdown.

Do not include comments.

Do not include extra text.

`;
}

module.exports = buildQuizPrompt;