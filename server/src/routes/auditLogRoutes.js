const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  getAuditLogs,
  getAuditLogById,
  getAuditLogSummary,
} = require("../controllers/auditLogController");

const router = express.Router();

// =====================================================
// MANAGER ONLY
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
// AUDIT LOG SUMMARY
// =====================================================

router.get(
  "/summary",
  protect,
  managerOnly,
  getAuditLogSummary
);

// =====================================================
// GET ALL AUDIT LOGS
// =====================================================

router.get(
  "/",
  protect,
  managerOnly,
  getAuditLogs
);

// =====================================================
// GET SINGLE AUDIT LOG
// =====================================================

router.get(
  "/:id",
  protect,
  managerOnly,
  getAuditLogById
);

module.exports = router;