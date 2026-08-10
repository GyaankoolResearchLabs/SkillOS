const mongoose = require("mongoose");

// =====================================================
// CONDITION SCHEMA
// =====================================================

const conditionSchema = new mongoose.Schema(
  {
    field: {
      type: String,
      required: true,
    },

    operator: {
      type: String,
      enum: [
        "equals",
        "not_equals",
        "contains",
        "not_contains",
        "starts_with",
        "ends_with",
        "in",
        "not_in",
        "exists",
        "not_exists",
      ],
      default: "equals",
    },

    value: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    _id: false,
  }
);

// =====================================================
// ACTION SCHEMA
// =====================================================

const actionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "send_notification",
        "assign_course",
      ],
      required: true,
    },

    recipient: {
      type: String,
      enum: [
        "employee",
        "manager",
        "hr",
      ],
      default: "employee",
    },

    title: {
      type: String,
      default: "",
    },

    message: {
      type: String,
      default: "",
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },
  },
  {
    _id: false,
  }
);

// =====================================================
// TRIGGER SCHEMA
// =====================================================

const triggerSchema = new mongoose.Schema(
  {
    event: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

// =====================================================
// WORKFLOW SCHEMA
// =====================================================

const workflowSchema = new mongoose.Schema(
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

    trigger: {
      type: triggerSchema,
      required: true,
    },

    conditions: {
      type: [conditionSchema],
      default: [],
    },

    actions: {
      type: [actionSchema],
      default: [],
    },

    active: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// =====================================================
// INDEX
// =====================================================

workflowSchema.index({
  "trigger.event": 1,
  active: 1,
});

// =====================================================
// EXPORT
// =====================================================

module.exports = mongoose.model(
  "Workflow",
  workflowSchema
);