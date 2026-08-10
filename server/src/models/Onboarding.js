const mongoose = require("mongoose");

// ======================================================
// Assessment Question Schema
// ======================================================

const assessmentQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [String],
      default: [],
    },

    // Correct answer
    // Never expose this field to the employee frontend.
    answer: {
      type: String,
      required: true,
    },

    explanation: {
      type: String,
      default: "",
    },

    marks: {
      type: Number,
      default: 1,
    },
  },
  {
    _id: true,
  }
);

// ======================================================
// Assessment Attempt Schema
// ======================================================

const assessmentAttemptSchema = new mongoose.Schema(
  {
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
    _id: true,
  }
);

// ======================================================
// Induction Item Schema
// ======================================================

const inductionItemSchema = new mongoose.Schema(
  {
    // ==========================================
    // Basic Information
    // ==========================================

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    // ==========================================
    // Study Material
    // ==========================================

    studyContent: {
      type: String,
      default: "",
    },

    estimatedDuration: {
      type: String,
      default: "5 minutes",
    },

    // ==========================================
    // Assessment
    // ==========================================

    questions: {
      type: [assessmentQuestionSchema],
      default: [],
    },

    passingScore: {
      type: Number,
      default: 80,
      min: 0,
      max: 100,
    },

    // ==========================================
    // Assessment Attempts
    // ==========================================

    attempts: {
      type: [assessmentAttemptSchema],
      default: [],
    },

    bestScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    lastScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    passed: {
      type: Boolean,
      default: false,
    },

    // ==========================================
    // Completion
    // ==========================================

    completed: {
      type: Boolean,
      default: false,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    _id: true,
  }
);

// ======================================================
// Onboarding Course Schema
// ======================================================

const onboardingCourseSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    _id: true,
  }
);

// ======================================================
// Main Onboarding Schema
// ======================================================

const onboardingSchema = new mongoose.Schema(
  {
    // ==========================================
    // Employee
    // ==========================================

    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // ==========================================
    // Joining Information
    // ==========================================

    joiningDate: {
      type: Date,
      default: Date.now,
    },

    // ==========================================
    // Overall Onboarding Status
    // ==========================================

    status: {
      type: String,
      enum: [
        "Not Started",
        "In Progress",
        "Completed",
      ],
      default: "Not Started",
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // ==========================================
    // Induction Checklist
    // ==========================================

    induction: {
      type: [inductionItemSchema],
      default: [],
    },

    // ==========================================
    // Onboarding Courses
    // ==========================================

    courses: {
      type: [onboardingCourseSchema],
      default: [],
    },

    // ==========================================
    // Overall Completion
    // ==========================================

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ======================================================
// Export Model
// ======================================================

module.exports = mongoose.model(
  "Onboarding",
  onboardingSchema
);