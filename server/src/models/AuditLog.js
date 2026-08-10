const mongoose = require("mongoose");

// =====================================================
// AUDIT LOG SCHEMA
// =====================================================

const auditLogSchema = new mongoose.Schema(
  {
    // ===================================================
    // ACTION
    // ===================================================

    action: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    // ===================================================
    // USER WHO PERFORMED THE ACTION
    // ===================================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    userName: {
      type: String,
      default: "",
      trim: true,
    },

    userEmail: {
      type: String,
      default: "",
      trim: true,
    },

    userRole: {
      type: String,
      default: "system",
      trim: true,
      index: true,
    },

    // ===================================================
    // TARGET
    // ===================================================

    targetType: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    targetName: {
      type: String,
      default: "",
      trim: true,
    },

    // ===================================================
    // STATUS
    // ===================================================

    status: {
      type: String,
      enum: ["Success", "Failed"],
      default: "Success",
      index: true,
    },

    // ===================================================
    // REQUEST INFORMATION
    // ===================================================

    ipAddress: {
      type: String,
      default: "",
      trim: true,
    },

    userAgent: {
      type: String,
      default: "",
      trim: true,
    },

    // ===================================================
    // EXTRA INFORMATION
    // ===================================================

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// =====================================================
// INDEXES
// =====================================================

auditLogSchema.index({
  createdAt: -1,
});

auditLogSchema.index({
  action: 1,
  createdAt: -1,
});

auditLogSchema.index({
  user: 1,
  createdAt: -1,
});

auditLogSchema.index({
  targetType: 1,
  targetId: 1,
});

// =====================================================
// EXPORT MODEL
// =====================================================

module.exports = mongoose.model(
  "AuditLog",
  auditLogSchema
);