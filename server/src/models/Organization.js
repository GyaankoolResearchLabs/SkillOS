const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema(
  {
    // =====================================================
    // ORGANIZATION INFORMATION
    // =====================================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    tagline: {
      type: String,
      default: "",
      trim: true,
    },

    website: {
      type: String,
      default: "",
      trim: true,
    },

    supportEmail: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },

    // =====================================================
    // BRANDING
    // =====================================================

    logo: {
      type: String,
      default: null,
    },

    favicon: {
      type: String,
      default: null,
    },

    loginBackground: {
      type: String,
      default: null,
    },

    dashboardBanner: {
      type: String,
      default: null,
    },

    primaryColor: {
      type: String,
      default: "#19D68C",
    },

    secondaryColor: {
      type: String,
      default: "#07152B",
    },

    accentColor: {
      type: String,
      default: "#3B82F6",
    },

    headingFont: {
      type: String,
      default: "Inter",
    },

    bodyFont: {
      type: String,
      default: "Inter",
    },

    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "light",
    },

    // =====================================================
    // SUBSCRIPTION
    // =====================================================

    plan: {
      type: String,
      enum: ["trial", "starter", "business", "enterprise"],
      default: "trial",
    },

    status: {
      type: String,
      enum: ["trial", "active", "suspended", "cancelled"],
      default: "trial",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Organization",
  organizationSchema
);