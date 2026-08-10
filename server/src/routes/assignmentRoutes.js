const express = require("express");

const router = express.Router();

console.log("Assignment routes loaded");

const protect = require("../middleware/authMiddleware");

const {
  assignCourse,
  getAssignments,
  getAssignmentById,
  getCourseAnalytics,
  completeCourse,
  completeLesson,
  submitModuleQuiz,
  submitFinalAssessment,
} = require("../controllers/assignmentController");

// ======================================
// Assign Course
// ======================================

router.post(
  "/",
  protect,
  assignCourse
);

// ======================================
// Get All Assignments
// ======================================

router.get(
  "/",
  protect,
  getAssignments
);

// ======================================
// Get Assignment By ID
// ======================================

router.get(
  "/:id",
  protect,
  getAssignmentById
);

// ======================================
// Course Analytics
// ======================================

router.get(
  "/analytics/:courseId",
  protect,
  getCourseAnalytics
);

// ======================================
// Complete Entire Course
// ======================================

router.patch(
  "/:id/complete",
  protect,
  completeCourse
);

// ======================================
// Complete One Lesson
// ======================================

router.patch(
  "/:assignmentId/module/:moduleId",
  protect,
  completeLesson
);

// ======================================
// Submit Module Quiz
// ======================================

router.post(
  "/:assignmentId/module/:moduleId/quiz",
  protect,
  submitModuleQuiz
);

// ======================================
// Submit Final Assessment
// ======================================

router.post(
  "/:assignmentId/final-assessment",
  protect,
  submitFinalAssessment
);

console.log("Final assessment route registered");

module.exports = router;