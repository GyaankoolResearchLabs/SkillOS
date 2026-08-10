const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // =====================================================
    // BASIC USER INFORMATION
    // =====================================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    // =====================================================
    // ROLE
    // =====================================================

    role: {
      type: String,
      enum: ["manager", "employee", "teacher", "student"],
      default: "employee",
      required: true,
    },

    // =====================================================
    // ORGANIZATION
    // =====================================================

    department: {
      type: String,
      default: "",
      trim: true,
    },

    designation: {
      type: String,
      default: "",
      trim: true,
    },

    organization: {
      type: String,
      default: "",
      trim: true,
    },
    organizationId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Organization",
  default: null,
  index: true,
},

    // =====================================================
    // PROFILE
    // =====================================================

    avatar: {
      type: String,
      default: "",
    },

    // =====================================================
    // COURSES
    // =====================================================

    assignedCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],

    completedCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    certificateCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // =====================================================
    // SECURITY
    // =====================================================

    failedLoginAttempts: {
      type: Number,
      default: 0,
      min: 0,
    },

    lockedUntil: {
      type: Date,
      default: null,
    },

    passwordChangedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);