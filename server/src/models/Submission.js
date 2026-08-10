const mongoose = require("mongoose");

// ==========================================
// Submission Schema
// ==========================================

const SubmissionSchema = new mongoose.Schema(
  {
    homework: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Homework",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    answerText: {
      type: String,
      default: "",
    },

    attachments: [
      {
        fileName: String,
        fileUrl: String,
      },
    ],

    submittedAt: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Submitted",
        "Graded",
        "Late",
      ],
      default: "Submitted",
    },

    marks: {
      type: Number,
      default: null,
    },

    feedback: {
      type: String,
      default: "",
    },

    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    gradedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Submission",
  SubmissionSchema
);