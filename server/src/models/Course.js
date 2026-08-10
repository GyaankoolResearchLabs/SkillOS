const mongoose = require("mongoose");

// ======================================================
// QUIZ SCHEMA
// ======================================================

const QuizSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length >= 2,
        message: "Quiz must contain at least 2 options.",
      },
    },

    answer: {
      type: String,
      required: true,
    },

    explanation: {
      type: String,
      default: "",
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
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
// MODULE SCHEMA
// ======================================================

const ModuleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    summary: {
      type: String,
      default: "",
    },

    generated: {
      type: Boolean,
      default: false,
    },

    generatedAt: {
      type: Date,
      default: null,
    },

    content: {
      type: String,
      default: "",
    },

    duration: {
      type: String,
      default: "15 mins",
    },

    learningObjectives: {
      type: [String],
      default: [],
    },

    keyPoints: {
      type: [String],
      default: [],
    },

    example: {
      type: String,
      default: "",
    },

    tips: {
      type: [String],
      default: [],
    },

    pdfUrl: {
      type: String,
      default: "",
    },

    videoUrl: {
      type: String,
      default: "",
    },

    imageUrl: {
      type: String,
      default: "",
    },

    quiz: {
      type: [QuizSchema],
      default: [],
    },
  },
  {
    _id: true,
  }
);

// ======================================================
// ONBOARDING ASSESSMENT SCHEMA
// ======================================================

const OnboardingAssessmentSchema = new mongoose.Schema(
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

    studyContent: {
      type: String,
      default: "",
    },

    estimatedDuration: {
      type: String,
      default: "5 minutes",
    },

    questions: {
      type: [QuizSchema],
      default: [],
    },

    passingScore: {
      type: Number,
      default: 80,
      min: 0,
      max: 100,
    },
  },
  {
    _id: true,
  }
);

// ======================================================
// COURSE SCHEMA
// ======================================================

const CourseSchema = new mongoose.Schema(
  {
    // ==================================================
    // ORGANIZATION
    // ==================================================

    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      default: null,
    },

    // ==================================================
    // BASIC COURSE INFORMATION
    // ==================================================

    courseTitle: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    audience: {
      type: String,
      enum: ["Employee", "Student", "Teacher"],
      default: "Employee",
    },

    category: {
      type: String,
      default: "Training",
    },

    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    estimatedDuration: {
      type: String,
      default: "",
    },

    // ==================================================
    // COURSE STATUS
    // ==================================================

    status: {
      type: String,
      enum: ["Draft", "Published", "Archived"],
      default: "Draft",
    },

    // ==================================================
    // COURSE CONTENT
    // ==================================================

    prerequisites: {
      type: [String],
      default: [],
    },

    learningObjectives: {
      type: [String],
      default: [],
    },

    learningOutcomes: {
      type: [String],
      default: [],
    },

    modules: {
      type: [ModuleSchema],
      default: [],
    },

    assignment: {
      type: String,
      default: "",
    },

    finalAssessment: {
      type: [QuizSchema],
      default: [],
    },

    // ==================================================
    // ONBOARDING ASSESSMENTS
    // ==================================================

    onboardingAssessments: {
      type: [OnboardingAssessmentSchema],
      default: [],
    },

    // ==================================================
    // AI INSIGHTS
    // ==================================================

    aiInsights: {
      executiveSummary: {
        type: String,
        default: "Not Found",
      },

      department: {
        type: String,
        default: "Not Found",
      },

      processType: {
        type: String,
        default: "Not Found",
      },

      complexity: {
        type: String,
        enum: ["Low", "Medium", "High", "Not Found"],
        default: "Not Found",
      },

      estimatedCompletionTime: {
        type: String,
        default: "Not Found",
      },

      keyRoles: {
        type: [String],
        default: [],
      },

      requiredDocuments: {
        type: [String],
        default: [],
      },

      risks: {
        type: [String],
        default: [],
      },

      complianceRequirements: {
        type: [String],
        default: [],
      },

      automationOpportunities: {
        type: [String],
        default: [],
      },

      suggestedImprovements: {
        type: [String],
        default: [],
      },
    },

    // ==================================================
    // CREATOR
    // ==================================================

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ==================================================
    // TOTALS
    // ==================================================

    totalModules: {
      type: Number,
      default: 0,
    },

    totalQuizQuestions: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ======================================================
// INDEXES
// ======================================================

CourseSchema.index({
  organizationId: 1,
});

CourseSchema.index({
  organizationId: 1,
  status: 1,
});

CourseSchema.index({
  organizationId: 1,
  createdBy: 1,
});

// ======================================================
// AUTO CALCULATE TOTALS
// ======================================================

CourseSchema.pre("save", function () {
  this.totalModules = this.modules.length;

  this.totalQuizQuestions = this.modules.reduce(
    (total, module) => {
      return total + (module.quiz?.length || 0);
    },
    0
  );
});

// ======================================================
// EXPORT
// ======================================================

module.exports = mongoose.model("Course", CourseSchema);