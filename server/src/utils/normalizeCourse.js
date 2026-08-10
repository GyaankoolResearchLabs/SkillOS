const VALID_AUDIENCE = [
  "Employee",
  "Student",
  "Teacher",
];

const VALID_DIFFICULTY = [
  "Beginner",
  "Intermediate",
  "Advanced",
];

const VALID_STATUS = [
  "Draft",
  "Published",
  "Archived",
];

function normalizeCourse(course) {
  const normalized = { ...course };

  // -----------------------------
  // Audience
  // -----------------------------
  if (!VALID_AUDIENCE.includes(normalized.audience)) {
    normalized.targetAudience = normalized.audience || "";
    normalized.audience = "Employee";
  }

  // -----------------------------
  // Difficulty
  // -----------------------------
  if (!VALID_DIFFICULTY.includes(normalized.difficulty)) {
    normalized.difficulty = "Beginner";
  }

  // -----------------------------
  // Status
  // -----------------------------
  if (!VALID_STATUS.includes(normalized.status)) {
    normalized.status = "Published";
  }

  // -----------------------------
  // Arrays
  // -----------------------------
  normalized.learningObjectives ??= [];
  normalized.learningOutcomes ??= [];
  normalized.prerequisites ??= [];
  normalized.modules ??= [];
  normalized.tags ??= [];

  // -----------------------------
  // Strings
  // -----------------------------
  normalized.courseTitle ??= "Untitled Course";
  normalized.description ??= "";
  normalized.category ??= "Training";
  normalized.estimatedDuration ??= "";

  return normalized;
}

module.exports = normalizeCourse;