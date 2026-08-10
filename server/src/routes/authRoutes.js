const express = require("express");

const router = express.Router();

const {
  login,
  registerOrganization,
  seedManager,
} = require("../controllers/authController");

// =====================================================
// REGISTER ORGANIZATION
// =====================================================

router.post(
  "/register-organization",
  registerOrganization
);

// =====================================================
// CREATE DEMO USERS
// =====================================================

router.get(
  "/seed",
  seedManager
);

// =====================================================
// LOGIN
// =====================================================

router.post(
  "/login",
  login
);

module.exports = router;