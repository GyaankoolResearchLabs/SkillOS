const express = require("express");

const {
  createRoleSOP,
  getRoleSOPs,
  getRoleSOPById,
  updateRoleSOP,
  submitRoleSOPForReview,
  publishRoleSOP,
  generateTrainingFromRoleSOP,
  archiveRoleSOP,
  deleteRoleSOP,
  duplicateRoleSOP,
} = require("../controllers/roleSOPController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ======================================================
// ROLE SOP ROUTES
// ======================================================

// Create Role SOP
router.post(
  "/",
  protect,
  createRoleSOP
);

// Get all Role SOPs
router.get(
  "/",
  protect,
  getRoleSOPs
);

// Get single Role SOP
router.get(
  "/:id",
  protect,
  getRoleSOPById
);

// Update Role SOP
router.put(
  "/:id",
  protect,
  updateRoleSOP
);

// Submit Role SOP for review
router.patch(
  "/:id/submit-review",
  protect,
  submitRoleSOPForReview
);

// Publish Role SOP
router.patch(
  "/:id/publish",
  protect,
  publishRoleSOP
);

// Archive Role SOP
router.patch(
  "/:id/archive",
  protect,
  archiveRoleSOP
);
 // Generate Training from Role SOP
router.post(
  "/:id/generate-training",
  protect,
  generateTrainingFromRoleSOP
);
// Duplicate Role SOP
router.post(
  "/:id/duplicate",
  protect,
  duplicateRoleSOP
);

// Delete Role SOP
router.delete(
  "/:id",
  protect,
  deleteRoleSOP
);

module.exports = router;