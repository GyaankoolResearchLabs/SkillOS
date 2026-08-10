const mongoose = require("mongoose");

// ==========================================
// Homework Schema
// ==========================================

const HomeworkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    instructions: {
      type: String,
      default: "",
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    attachments: [
      {
        fileName: String,
        fileUrl: String,
      },
    ],

    dueDate: {
      type: Date,
      required: true,
    },

    totalMarks: {
      type: Number,
      default: 100,
    },

    passingMarks: {
      type: Number,
      default: 40,
    },

    allowLateSubmission: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["Draft", "Published", "Closed"],
      default: "Draft",
    },

    createdByAI: {
      type: Boolean,
      default: false,
    },

    aiPrompt: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Homework", HomeworkSchema);