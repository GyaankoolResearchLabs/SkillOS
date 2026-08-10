const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  getAIConfiguration,
  updateAIConfiguration,
} = require("../controllers/aiConfigurationController");

const router = express.Router();

// =====================================================
// GET AI CONFIGURATION
// =====================================================

router.get(
  "/",
  protect,
  getAIConfiguration
);

// =====================================================
// UPDATE AI CONFIGURATION
// =====================================================

router.put(
  "/",
  protect,
  updateAIConfiguration
);

module.exports = router;