const mongoose = require("mongoose");

// ======================================================
// Responsibility Schema
// ======================================================

const responsibilitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
  },
  {
    _id: true,
  }
);

// ======================================================
// Process Step Schema
// ======================================================

const processStepSchema = new mongoose.Schema(
  {
    stepNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    instruction: {
      type: String,
      required: true,
      trim: true,
    },

    expectedOutcome: {
      type: String,
      default: "",
      trim: true,
    },

    responsiblePerson: {
      type: String,
      default: "",
      trim: true,
    },

    approver: {
      type: String,
      default: "",
      trim: true,
    },

    tools: {
      type: [String],
      default: [],
    },
  },
  {
    _id: true,
  }
);

// ======================================================
// Process Schema
// ======================================================

const processSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    purpose: {
      type: String,
      default: "",
      trim: true,
    },

    frequency: {
      type: String,
      default: "",
      trim: true,
    },

    trigger: {
      type: String,
      default: "",
      trim: true,
    },

    steps: {
      type: [processStepSchema],
      default: [],
    },

    expectedOutcome: {
      type: String,
      default: "",
      trim: true,
    },

    responsiblePerson: {
      type: String,
      default: "",
      trim: true,
    },

    approver: {
      type: String,
      default: "",
      trim: true,
    },

    tools: {
      type: [String],
      default: [],
    },
  },
  {
    _id: true,
  }
);

// ======================================================
// Tool Schema
// ======================================================

const toolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    purpose: {
      type: String,
      default: "",
      trim: true,
    },

    proficiency: {
      type: String,
      enum: [
        "Basic",
        "Intermediate",
        "Advanced",
        "Expert",
        "Not Specified",
      ],
      default: "Not Specified",
    },

    accessRequired: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: true,
  }
);

// ======================================================
// Policy Schema
// ======================================================

const policySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    rules: {
      type: [String],
      default: [],
    },

    exceptions: {
      type: [String],
      default: [],
    },

    escalation: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: true,
  }
);

// ======================================================
// KPI Schema
// ======================================================

const kpiSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    target: {
      type: String,
      default: "",
      trim: true,
    },

    measurement: {
      type: String,
      default: "",
      trim: true,
    },

    frequency: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: true,
  }
);

// ======================================================
// Role SOP Schema
// ======================================================

const roleSOPSchema = new mongoose.Schema(
  {
    // ==================================================
    // ORGANIZATION ID
    // ==================================================

    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      default: null,
    },

    // ==================================================
    // LEGACY ORGANIZATION CONTEXT
    // ==================================================

    organization: {
      type: String,
      default: "",
      trim: true,
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    team: {
      type: String,
      default: "",
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    seniority: {
      type: String,
      default: "",
      trim: true,
    },

    reportingManager: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    employmentType: {
      type: String,
      default: "",
      trim: true,
    },

    // ==================================================
    // ROLE PURPOSE
    // ==================================================

    rolePurpose: {
      type: String,
      default: "",
      trim: true,
    },

    // ==================================================
    // RESPONSIBILITIES
    // ==================================================

    responsibilities: {
      type: [responsibilitySchema],
      default: [],
    },

    // ==================================================
    // PROCESSES & PROCEDURES
    // ==================================================

    processes: {
      type: [processSchema],
      default: [],
    },

    // ==================================================
    // TOOLS & TECHNOLOGIES
    // ==================================================

    tools: {
      type: [toolSchema],
      default: [],
    },

    // ==================================================
    // POLICIES & GUIDELINES
    // ==================================================

    policies: {
      type: [policySchema],
      default: [],
    },

    // ==================================================
    // KPIs & PERFORMANCE
    // ==================================================

    kpis: {
      type: [kpiSchema],
      default: [],
    },

    // ==================================================
    // ONBOARDING REQUIREMENTS
    // ==================================================

    onboardingRequirements: {
      type: [String],
      default: [],
    },

    // ==================================================
    // KNOWLEDGE REQUIREMENTS
    // ==================================================

    knowledgeRequirements: {
      type: [String],
      default: [],
    },

    // ==================================================
    // SOP LIFECYCLE
    // ==================================================

    status: {
      type: String,
      enum: [
        "Draft",
        "Under Review",
        "Published",
        "Archived",
      ],
      default: "Draft",
    },

    // ==================================================
    // VERSIONING
    // ==================================================

    version: {
      type: String,
      default: "1.0",
      trim: true,
    },

    // ==================================================
    // OWNERSHIP / APPROVAL
    // ==================================================

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    // ==================================================
    // GENERATED TRAINING
    // ==================================================

    generatedCourseIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// ======================================================
// INDEXES
// ======================================================

roleSOPSchema.index({
  organizationId: 1,
});

roleSOPSchema.index({
  organizationId: 1,
  department: 1,
  role: 1,
});

roleSOPSchema.index({
  organizationId: 1,
  status: 1,
});

roleSOPSchema.index({
  createdBy: 1,
});

// ======================================================
// EXPORT
// ======================================================

module.exports = mongoose.model(
  "RoleSOP",
  roleSOPSchema
);