const mongoose = require("mongoose");

// =====================================================
// NOTIFICATION
// =====================================================

const notificationSchema =
  new mongoose.Schema(
    {
      recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      title: {
        type: String,
        required: true,
        trim: true,
      },

      message: {
        type: String,
        required: true,
        trim: true,
      },

      type: {
        type: String,
        enum: [
          "workflow",
          "system",
          "training",
          "compliance",
          "announcement",
        ],
        default: "workflow",
      },

      read: {
        type: Boolean,
        default: false,
      },

      metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },

      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    {
      timestamps: true,
    }
  );

notificationSchema.index({
  recipient: 1,
  read: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);