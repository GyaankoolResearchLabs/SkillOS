const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notificationController");

const router = express.Router();

// =====================================================
// GET MY NOTIFICATIONS
// =====================================================

router.get(
  "/",
  protect,
  getMyNotifications
);

// =====================================================
// MARK ALL AS READ
// =====================================================

router.patch(
  "/read-all",
  protect,
  markAllAsRead
);

// =====================================================
// MARK ONE AS READ
// =====================================================

router.patch(
  "/:id/read",
  protect,
  markAsRead
);

module.exports = router;