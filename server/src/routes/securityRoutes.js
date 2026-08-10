const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  getSecuritySettings,
  updateSecuritySettings,
} = require("../controllers/securityController");

const router = express.Router();

// =====================================================
// MANAGER CHECK
// =====================================================

const managerOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "manager") {
    return res.status(403).json({
      success: false,
      message: "Manager access required.",
    });
  }

  next();
};

// =====================================================
// SECURITY SETTINGS
// =====================================================

router.get(
  "/settings",
  protect,
  managerOnly,
  getSecuritySettings
);

router.put(
  "/settings",
  protect,
  managerOnly,
  updateSecuritySettings
);

module.exports = router;