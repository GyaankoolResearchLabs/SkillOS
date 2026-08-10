const mongoose = require("mongoose");

// =====================================================
// WORKFLOW EXECUTION
// =====================================================

const workflowExecutionSchema =
  new mongoose.Schema(
    {
      workflow: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workflow",
        required: true,
      },

      event: {
        type: String,
        required: true,
      },

      entityType: {
        type: String,
        default: "",
      },

      entityId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },

      status: {
        type: String,
        enum: [
          "SUCCESS",
          "FAILED",
          "SKIPPED",
        ],
        required: true,
      },

      conditionsPassed: {
        type: Boolean,
        default: false,
      },

      actionResults: {
        type: [mongoose.Schema.Types.Mixed],
        default: [],
      },

      error: {
        type: String,
        default: null,
      },

      executedAt: {
        type: Date,
        default: Date.now,
      },
    },
    {
      timestamps: true,
    }
  );

workflowExecutionSchema.index({
  workflow: 1,
  executedAt: -1,
});

module.exports = mongoose.model(
  "WorkflowExecution",
  workflowExecutionSchema
);