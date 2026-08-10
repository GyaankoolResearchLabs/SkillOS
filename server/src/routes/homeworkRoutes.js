const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createHomework,
  getHomework,
  getHomeworkById,
  updateHomework,
  publishHomework,
  deleteHomework,
} = require("../controllers/homeworkController");

// ==============================
// Create Homework
// ==============================

router.post("/", protect, createHomework);

// ==============================
// Get All Homework
// ==============================

router.get("/", protect, getHomework);

// ==============================
// Get Homework By ID
// ==============================

router.get("/:id", protect, getHomeworkById);

// ==============================
// Update Homework
// ==============================

router.put("/:id", protect, updateHomework);

// ==============================
// Publish Homework
// ==============================

router.patch("/:id/publish", protect, publishHomework);

// ==============================
// Delete Homework
// ==============================

router.delete("/:id", protect, deleteHomework);

module.exports = router;