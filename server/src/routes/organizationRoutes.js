const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  getOrganization,
  getBranding,
  updateBranding,
} = require("../controllers/organizationController");

const router = express.Router();

// =====================================================
// CURRENT ORGANIZATION
// =====================================================

router.get(
  "/current",
  protect,
  getOrganization
);

// =====================================================
// BRANDING
// =====================================================

router.get(
  "/branding",
  protect,
  getBranding
);

router.put(
  "/branding",
  protect,
  updateBranding
);

module.exports = router;