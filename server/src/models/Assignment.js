const mongoose = require("mongoose");

// ==========================================
// Quiz Score Schema
// ==========================================

const QuizScoreSchema = new mongoose.Schema(
  {
    moduleId: {
      type: String,
      required: true,
    },

    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    totalQuestions: {
      type: Number,
      default: 0,
    },

    correctAnswers: {
      type: Number,
      default: 0,
    },

    passed: {
      type: Boolean,
      default: false,
    },

    attemptedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

// ==========================================
// Assignment Schema
// ==========================================

const assignmentSchema = new mongoose.Schema(
  {
    // ==========================================
    // ORGANIZATION
    // ==========================================

    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      default: null,
    },

    // ==========================================
    // EMPLOYEE
    // ==========================================

    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ==========================================
    // COURSE
    // ==========================================

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    // ==========================================
    // STATUS
    // ==========================================

    status: {
      type: String,
      enum: ["Assigned", "In Progress", "Completed"],
      default: "Assigned",
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // ==========================================
    // COMPLETED MODULES
    // ==========================================

    completedModules: {
      type: [String],
      default: [],
    },

    // ==========================================
    // COMPLETED LESSONS
    // ==========================================

    completedLessons: {
      type: [String],
      default: [],
    },

    // ==========================================
    // LESSON HISTORY
    // ==========================================

    lessonHistory: {
      type: [
        {
          moduleId: String,
          completedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },

    // ==========================================
    // QUIZ SCORES
    // ==========================================

    quizScores: {
      type: [QuizScoreSchema],
      default: [],
    },

    // ==========================================
    // FINAL ASSESSMENT
    // ==========================================

    finalAssessmentScore: {
      type: Number,
      default: null,
    },

    finalAssessmentPassed: {
      type: Boolean,
      default: false,
    },

    finalAssessmentAnswers: {
      type: [
        {
          question: String,
          selectedAnswer: String,
          correctAnswer: String,
          isCorrect: Boolean,
        },
      ],
      default: [],
    },

    // ==========================================
    // CERTIFICATE
    // ==========================================

    certificateIssued: {
      type: Boolean,
      default: false,
    },

    certificateIssuedAt: {
      type: Date,
      default: null,
    },

    // ==========================================
    // DATES
    // ==========================================

    startedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    assignedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// INDEXES
// ==========================================

assignmentSchema.index({
  organizationId: 1,
});

assignmentSchema.index({
  organizationId: 1,
  employee: 1,
});

assignmentSchema.index({
  organizationId: 1,
  course: 1,
});

// ==========================================
// Remove Duplicate Module IDs
// ==========================================

assignmentSchema.pre("save", function () {
  this.completedModules = [
    ...new Set(this.completedModules),
  ];
});

// ==========================================
// EXPORT
// ==========================================

module.exports = mongoose.model(
  "Assignment",
  assignmentSchema
);