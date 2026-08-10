// ===============================================
// Validate Question Bank
// ===============================================

function validateQuestionBank(questionBank) {
  const errors = [];

  if (!questionBank.questions?.length) {
    errors.push("No questions generated.");
    return {
      valid: false,
      errors,
    };
  }

  const seenQuestions = new Set();

  questionBank.questions.forEach((question, index) => {
    // ==========================
    // Question exists
    // ==========================

    if (!question.question?.trim()) {
      errors.push(
        `Question ${index + 1} has no question text.`
      );
    }

    // ==========================
    // Four options
    // ==========================

    if (
      !Array.isArray(question.options) ||
      question.options.length !== 4
    ) {
      errors.push(
        `Question ${index + 1} must contain exactly 4 options.`
      );
    }

    // ==========================
    // Duplicate options
    // ==========================

    if (
      new Set(question.options).size !==
      question.options.length
    ) {
      errors.push(
        `Question ${index + 1} contains duplicate options.`
      );
    }

    // ==========================
    // Answer exists
    // ==========================

    if (
      !question.options.includes(question.answer)
    ) {
      errors.push(
        `Question ${index + 1} answer is not inside options.`
      );
    }

    // ==========================
    // Duplicate question
    // ==========================

    if (
      seenQuestions.has(question.question)
    ) {
      errors.push(
        `Duplicate question detected: "${question.question}".`
      );
    }

    seenQuestions.add(question.question);

    // ==========================
    // Explanation
    // ==========================

    if (
      !question.explanation ||
      question.explanation.length < 20
    ) {
      errors.push(
        `Question ${index + 1} explanation is too short.`
      );
    }

    // ==========================
    // Topic Match
    // ==========================

    if (
      question.topic !== questionBank.topic
    ) {
      errors.push(
        `Question ${index + 1} belongs to the wrong topic.`
      );
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

module.exports = validateQuestionBank;