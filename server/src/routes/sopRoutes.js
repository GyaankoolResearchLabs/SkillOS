const express = require("express");

const router = express.Router();

// =====================================================
// MIDDLEWARE
// =====================================================

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// =====================================================
// CONTROLLERS
// =====================================================

const {
  uploadSOP,
  getCourses,
  getCourseById,
  deleteCourse,
} = require("../controllers/sopController");

// =====================================================
// AUTHENTICATION
// =====================================================
//
// IMPORTANT:
//
// Every SOP operation belongs to an organization.
//
// Therefore every request MUST be authenticated
// before reaching the controller.
//
// This provides:
//
// req.user
// req.user.organizationId
//
// =====================================================

router.use(protect);

// =====================================================
// UPLOAD SOP & GENERATE AI COURSE
// =====================================================

router.post(
  "/",
  upload.single("pdf"),
  uploadSOP
);

// =====================================================
// GET ALL COURSES
// =====================================================

router.get(
  "/",
  getCourses
);

// =====================================================
// GET SINGLE COURSE
// =====================================================

router.get(
  "/:id",
  getCourseById
);

// =====================================================
// DELETE COURSE
// =====================================================

router.delete(
  "/:id",
  deleteCourse
);

// =====================================================
// EXPORT
// =====================================================

module.exports = router;