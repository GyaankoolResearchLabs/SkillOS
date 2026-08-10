const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  submitHomework,
  updateSubmission,
  getMySubmissions,
  getHomeworkSubmissions,
  gradeSubmission,
} = require("../controllers/submissionController");

// =======================================
// Student Submit Homework
// =======================================

router.post(
  "/homework/:homeworkId",
  protect,
  submitHomework
);

// =======================================
// Student Update Submission
// =======================================

router.put(
  "/:id",
  protect,
  updateSubmission
);

// =======================================
// Student My Submissions
// =======================================

router.get(
  "/my",
  protect,
  getMySubmissions
);

// =======================================
// Teacher View Homework Submissions
// =======================================

router.get(
  "/homework/:homeworkId",
  protect,
  getHomeworkSubmissions
);

// =======================================
// Teacher Grade Submission
// =======================================

router.patch(
  "/:id/grade",
  protect,
  gradeSubmission
);

module.exports = router;