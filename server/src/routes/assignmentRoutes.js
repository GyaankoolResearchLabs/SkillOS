const express = require("express");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const {
  assignCourse,
  bulkAssignCourse,
  getAssignments,
  getAssignmentById,
  completeLesson,
  submitModuleQuiz,
  submitFinalAssessment,
  completeCourse,
} = require("../controllers/assignmentController");

const router = express.Router();

// =====================================================
// AUTHENTICATION
// =====================================================
// Temporary authentication middleware.
// We are keeping this here for now because the previous
// project structure was using this implementation.
//
// Later, once the complete authentication flow is stable,
// we can move this back into the shared middleware.
// =====================================================

const protect = async (req, res, next) => {
  try {
    let token;

    // =================================================
    // GET TOKEN
    // =================================================

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing.",
      });
    }

    // =================================================
    // VERIFY TOKEN
    // =================================================

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // =================================================
    // FIND USER
    // =================================================

    const user = await User.findById(
      decoded.id
    ).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    // =================================================
    // ATTACH USER
    // =================================================

    req.user = user;

    console.log(
      "=========================================="
    );

    console.log(
      "ASSIGNMENT AUTH USER:",
      user.email
    );

    console.log(
      "ASSIGNMENT AUTH ROLE:",
      user.role
    );

    console.log(
      "ASSIGNMENT AUTH ORGANIZATION:",
      user.organization
    );

    console.log(
      "ASSIGNMENT AUTH ORGANIZATION ID:",
      user.organizationId
    );

    console.log(
      "=========================================="
    );

    next();
  } catch (err) {
    console.error(
      "ASSIGNMENT AUTH ERROR:",
      err.message
    );

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

// =====================================================
// APPLY AUTHENTICATION TO ALL ASSIGNMENT ROUTES
// =====================================================

router.use(protect);

// =====================================================
// GET ALL ASSIGNMENTS
// =====================================================
//
// Employee:
// GET /api/assignments
//
// Manager:
// GET /api/assignments
//
// =====================================================

router.get(
  "/",
  getAssignments
);

// =====================================================
// BULK ASSIGN COURSE
// =====================================================
//
// POST /api/assignments/bulk
//
// IMPORTANT:
// Keep this before /:id
//
// =====================================================

router.post(
  "/bulk",
  bulkAssignCourse
);

// =====================================================
// ASSIGN ONE COURSE
// =====================================================
//
// POST /api/assignments
//
// =====================================================

router.post(
  "/",
  assignCourse
);

// =====================================================
// COMPLETE LESSON / MODULE
// =====================================================
//
// PATCH
// /api/assignments/:assignmentId/module/:moduleId
//
// =====================================================

router.patch(
  "/:assignmentId/module/:moduleId",
  completeLesson
);

// =====================================================
// SUBMIT MODULE QUIZ
// =====================================================
//
// POST
// /api/assignments/:assignmentId/module/:moduleId/quiz
//
// =====================================================

router.post(
  "/:assignmentId/module/:moduleId/quiz",
  submitModuleQuiz
);

// =====================================================
// SUBMIT FINAL ASSESSMENT
// =====================================================
//
// POST
// /api/assignments/:assignmentId/final-assessment
//
// =====================================================

router.post(
  "/:assignmentId/final-assessment",
  submitFinalAssessment
);

// =====================================================
// COMPLETE COURSE
// =====================================================
//
// PATCH
// /api/assignments/:id/complete
//
// This route is responsible for:
// - Setting progress to 100
// - Setting status to Completed
// - Setting completedAt
// - Issuing certificate
// - Setting certificateIssuedAt
//
// =====================================================

router.patch(
  "/:id/complete",
  completeCourse
);

// =====================================================
// GET ASSIGNMENT BY ID
// =====================================================
//
// GET /api/assignments/:id
//
// IMPORTANT:
// Keep this AFTER the specific routes above.
// =====================================================

router.get(
  "/:id",
  getAssignmentById
);

// =====================================================
// EXPORT
// =====================================================

module.exports = router;