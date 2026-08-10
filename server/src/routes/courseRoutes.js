const express = require("express");

const router = express.Router();

// =====================================================
// AUTHENTICATION
// =====================================================

const protect = require("../middleware/authMiddleware");

// =====================================================
// CONTROLLERS
// =====================================================

const {
  getCourses,
  getCourseById,
  generateCourseModule,
  createCourse,
  updateCourse,
  deleteCourse,
  publishCourse,
} = require("../controllers/courseController");

// =====================================================
// PROTECT ALL COURSE ROUTES
// =====================================================
//
// Every request under /api/courses must have
// a valid JWT.
//
// This also ensures:
//
// req.user
// req.user.organizationId
//
// are available inside courseController.
// =====================================================

router.use(protect);

// =====================================================
// GET ALL COURSES
// =====================================================

router.get(
  "/",
  getCourses
);

// =====================================================
// GENERATE SINGLE MODULE
// IMPORTANT:
// Keep this BEFORE "/:id"
// =====================================================

router.post(
  "/:courseId/modules/:moduleId/generate",
  generateCourseModule
);

// =====================================================
// GET SINGLE COURSE
// =====================================================

router.get(
  "/:id",
  getCourseById
);

// =====================================================
// CREATE COURSE
// =====================================================

router.post(
  "/",
  createCourse
);

// =====================================================
// UPDATE COURSE
// =====================================================

router.put(
  "/:id",
  updateCourse
);

// =====================================================
// PUBLISH COURSE
// =====================================================

router.patch(
  "/:id/publish",
  publishCourse
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