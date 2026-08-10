const mongoose = require("mongoose");

const securitySettingsSchema = new mongoose.Schema(
  {
    // =====================================================
    // ORGANIZATION
    // =====================================================

    organization: {
      type: String,
      default: "default",
      unique: true,
      trim: true,
    },

    // =====================================================
    // PASSWORD POLICY
    // =====================================================

    minimumPasswordLength: {
      type: Number,
      default: 8,
      min: 6,
      max: 32,
    },

    requireUppercase: {
      type: Boolean,
      default: true,
    },

    requireNumber: {
      type: Boolean,
      default: true,
    },

    requireSpecialCharacter: {
      type: Boolean,
      default: true,
    },

    passwordExpiryDays: {
      type: Number,
      default: 90,
      min: 0,
      max: 3650,
    },

    // =====================================================
    // LOGIN PROTECTION
    // =====================================================

    maxFailedLoginAttempts: {
      type: Number,
      default: 5,
      min: 1,
      max: 20,
    },

    lockoutDurationMinutes: {
      type: Number,
      default: 15,
      min: 1,
      max: 1440,
    },

    // =====================================================
    // SESSION SECURITY
    // =====================================================

    sessionDurationHours: {
      type: Number,
      default: 24,
      min: 1,
      max: 720,
    },

    // =====================================================
    // METADATA
    // =====================================================

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "SecuritySettings",
  securitySettingsSchema
);