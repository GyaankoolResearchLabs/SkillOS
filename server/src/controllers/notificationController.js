const Notification = require("../models/Notification");

// =====================================================
// GET MY NOTIFICATIONS
// =====================================================

const getMyNotifications =
  async (req, res) => {
    try {
      const userId =
        req.user?._id ||
        req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message:
            "Authentication required.",
        });
      }

      const notifications =
        await Notification.find({
          recipient: userId,
        }).sort({
          createdAt: -1,
        });

      const unreadCount =
        notifications.filter(
          (notification) =>
            !notification.read
        ).length;

      return res.status(200).json({
        success: true,

        count:
          notifications.length,

        unreadCount,

        notifications,
      });
    } catch (error) {
      console.error(
        "GET NOTIFICATIONS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

// =====================================================
// MARK ONE AS READ
// =====================================================

const markAsRead =
  async (req, res) => {
    try {
      const userId =
        req.user?._id ||
        req.user?.id;

      const notification =
        await Notification.findOneAndUpdate(
          {
            _id:
              req.params.id,

            recipient:
              userId,
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

      if (!notification) {
        return res.status(404).json({
          success: false,
          message:
            "Notification not found.",
        });
      }

      return res.status(200).json({
        success: true,
        notification,
      });
    } catch (error) {
      console.error(
        "MARK NOTIFICATION READ ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

// =====================================================
// MARK ALL AS READ
// =====================================================

const markAllAsRead =
  async (req, res) => {
    try {
      const userId =
        req.user?._id ||
        req.user?.id;

      await Notification.updateMany(
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

      return res.status(200).json({
        success: true,

        message:
          "All notifications marked as read.",
      });
    } catch (error) {
      console.error(
        "MARK ALL NOTIFICATIONS READ ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

module.exports = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
};