// ===============================================
// Fisher-Yates Shuffle
// ===============================================

function shuffle(array) {
  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

// ===============================================
// Select Questions Based On Priority
// ===============================================

function selectQuestions(questionBank) {
  switch (questionBank.priority) {
    case "Critical":
      return 2;

    case "Important":
      return 2;

    case "Supporting":
      return 1;

    default:
      return 1;
  }
}

// ===============================================
// Build Employee Quiz
// ===============================================

function buildQuiz(questionBanks) {
  let quiz = [];

  questionBanks.forEach((bank) => {
    const shuffled = shuffle(bank.questions);

    const count = Math.min(
      selectQuestions(bank),
      shuffled.length
    );

    quiz.push(...shuffled.slice(0, count));
  });

  return shuffle(quiz);
}

module.exports = buildQuiz;