const mongoose = require("mongoose");

// ======================================================
// SOP TEMPLATE SECTION
// ======================================================

const templateSectionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      enum: [
        "rolePurpose",
        "responsibilities",
        "processes",
        "tools",
        "policies",
        "kpis",
        "onboardingRequirements",
        "knowledgeRequirements",
      ],
      trim: true,
    },

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

    enabled: {
      type: Boolean,
      default: true,
    },

    required: {
      type: Boolean,
      default: false,
    },

    order: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    _id: true,
  }
);

// ======================================================
// SOP TEMPLATE
// ======================================================

const sopTemplateSchema = new mongoose.Schema(
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
    // TEMPLATE INFORMATION
    // ==================================================

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

    // ==================================================
    // ORGANIZATION CONTEXT
    // ==================================================

    department: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    // ==================================================
    // TEMPLATE SECTIONS
    // ==================================================

    sections: {
      type: [templateSectionSchema],
      default: [],
    },

    // ==================================================
    // OWNERSHIP
    // ==================================================

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ==================================================
    // STATUS
    // ==================================================

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ======================================================
// INDEXES
// ======================================================

sopTemplateSchema.index({
  organizationId: 1,
});

sopTemplateSchema.index({
  organizationId: 1,
  department: 1,
  role: 1,
});

sopTemplateSchema.index({
  createdBy: 1,
});

sopTemplateSchema.index({
  active: 1,
});

// ======================================================
// EXPORT
// ======================================================

module.exports = mongoose.model(
  "SOPTemplate",
  sopTemplateSchema
);