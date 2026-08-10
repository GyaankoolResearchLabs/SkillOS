const Homework = require("../models/Homework");
const User = require("../models/User");
const Course = require("../models/Course");

// ==============================================
// Create Homework
// ==============================================

const createHomework = async (req, res) => {
  try {
    const {
      title,
      description,
      instructions,
      course,
      students,
      dueDate,
      totalMarks,
      passingMarks,
      allowLateSubmission,
    } = req.body;

    if (!title || !course || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "Title, Course and Due Date are required.",
      });
    }

    const courseExists = await Course.findById(course);

    if (!courseExists) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    const homework = await Homework.create({
      title,
      description,
      instructions,
      teacher: req.user._id,
      course,
      students: students || [],
      dueDate,
      totalMarks: totalMarks || 100,
      passingMarks: passingMarks || 40,
      allowLateSubmission: allowLateSubmission || false,
      status: "Draft",
    });

    res.status(201).json({
      success: true,
      homework,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

// ==============================================
// Get Teacher Homework
// ==============================================

const getHomework = async (req, res) => {

  try {

    const homework = await Homework.find({
      teacher: req.user._id,
    })
      .populate("course")
      .populate("students");

    res.json({
      success: true,
      homework,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};

// ==============================================
// Get Homework By ID
// ==============================================

const getHomeworkById = async (req, res) => {

  try {

    const homework = await Homework.findById(req.params.id)
      .populate("course")
      .populate("students");

    if (!homework) {

      return res.status(404).json({
        success: false,
        message: "Homework not found.",
      });

    }

    res.json({
      success: true,
      homework,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};

// ==============================================
// Update Homework
// ==============================================

const updateHomework = async (req, res) => {

  try {

    const homework = await Homework.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!homework) {

      return res.status(404).json({
        success: false,
        message: "Homework not found.",
      });

    }

    res.json({
      success: true,
      homework,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};

// ==============================================
// Publish Homework
// ==============================================

const publishHomework = async (req, res) => {

  try {

    const homework = await Homework.findById(req.params.id);

    if (!homework) {

      return res.status(404).json({
        success: false,
        message: "Homework not found.",
      });

    }

    homework.status = "Published";

    await homework.save();

    res.json({
      success: true,
      message: "Homework Published",
      homework,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};

// ==============================================
// Delete Homework
// ==============================================

const deleteHomework = async (req, res) => {

  try {

    const homework = await Homework.findByIdAndDelete(
      req.params.id
    );

    if (!homework) {

      return res.status(404).json({
        success: false,
        message: "Homework not found.",
      });

    }

    res.json({
      success: true,
      message: "Homework deleted successfully.",
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};

module.exports = {
  createHomework,
  getHomework,
  getHomeworkById,
  updateHomework,
  publishHomework,
  deleteHomework,
};