const Notification = require("../models/Notification");

// =====================================================
// CREATE NOTIFICATION
// =====================================================

const createNotification = async ({
  recipient,
  title,
  message,
  type = "workflow",
  metadata = {},
}) => {
  if (!recipient) {
    throw new Error(
      "Notification recipient is required."
    );
  }

  if (!title) {
    throw new Error(
      "Notification title is required."
    );
  }

  if (!message) {
    throw new Error(
      "Notification message is required."
    );
  }

  const notification =
    await Notification.create({
      recipient,
      title,
      message,
      type,
      metadata,
    });

  console.log(
    "NOTIFICATION CREATED:",
    notification._id
  );

  return notification;
};

// =====================================================
// GET USER NOTIFICATIONS
// =====================================================

const getUserNotifications =
  async (userId) => {
    return Notification.find({
      recipient: userId,
    }).sort({
      createdAt: -1,
    });
  };

// =====================================================
// MARK AS READ
// =====================================================

const markNotificationAsRead =
  async (
    notificationId,
    userId
  ) => {
    return Notification.findOneAndUpdate(
      {
        _id: notificationId,
        recipient: userId,
      },
      {
        $set: {
          read: true,
        },
      },
      {
        new: true,
      }
    );
  };

// =====================================================
// MARK ALL AS READ
// =====================================================

const markAllNotificationsAsRead =
  async (userId) => {
    return Notification.updateMany(
      {
        recipient: userId,
        read: false,
      },
      {
        $set: {
          read: true,
        },
      }
    );
  };

module.exports = {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};