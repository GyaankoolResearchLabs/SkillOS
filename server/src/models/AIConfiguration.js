const mongoose = require("mongoose");

// =====================================================
// AI CONFIGURATION SCHEMA
// =====================================================

const aiConfigurationSchema = new mongoose.Schema(
  {
    // ===================================================
    // OWNER
    // ===================================================

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // ===================================================
    // AI STATUS
    // ===================================================

    enabled: {
      type: Boolean,
      default: true,
    },

    // ===================================================
    // PROVIDER
    // ===================================================

    provider: {
      type: String,
      enum: ["OpenAI", "Claude", "Gemini"],
      default: "OpenAI",
    },

    model: {
      type: String,
      default: "gpt-4.1",
      trim: true,
    },

    // ===================================================
    // AI FEATURES
    // ===================================================

    features: {
      sopCourseGeneration: {
        type: Boolean,
        default: true,
      },

      sopAnalysis: {
        type: Boolean,
        default: true,
      },

      quizGeneration: {
        type: Boolean,
        default: true,
      },

      aiInsights: {
        type: Boolean,
        default: true,
      },

      courseRecommendations: {
        type: Boolean,
        default: true,
      },
    },

    // ===================================================
    // COURSE GENERATION
    // ===================================================

    courseGeneration: {
      difficulty: {
        type: String,
        enum: [
          "Beginner",
          "Intermediate",
          "Advanced",
          "Expert",
        ],
        default: "Intermediate",
      },

      modules: {
        type: Number,
        min: 1,
        max: 20,
        default: 5,
      },

      lessonsPerModule: {
        type: Number,
        min: 1,
        max: 20,
        default: 4,
      },
    },

    // ===================================================
    // QUIZ GENERATION
    // IMPORTANT:
    // Course schema supports Easy / Medium / Hard
    // ===================================================

    quizGeneration: {
      questionsPerQuiz: {
        type: Number,
        min: 1,
        max: 50,
        default: 10,
      },

      passingScore: {
        type: Number,
        min: 1,
        max: 100,
        default: 70,
      },

      difficulty: {
        type: String,
        enum: [
          "Easy",
          "Medium",
          "Hard",
        ],
        default: "Medium",
      },
    },

    // ===================================================
    // RESPONSE STYLE
    // ===================================================

    responseStyle: {
      type: String,
      enum: [
        "Professional",
        "Simple & Beginner Friendly",
        "Detailed & Technical",
        "Concise",
      ],
      default: "Professional",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "AIConfiguration",
  aiConfigurationSchema
);