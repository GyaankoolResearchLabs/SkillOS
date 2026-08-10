const Submission = require("../models/Submission");
const Homework = require("../models/Homework");

// =============================================
// Submit Homework
// =============================================

const submitHomework = async (req, res) => {
  try {
    const { homeworkId } = req.params;
    const { answerText } = req.body;

    const homework = await Homework.findById(homeworkId);

    if (!homework) {
      return res.status(404).json({
        success: false,
        message: "Homework not found.",
      });
    }

    let submission = await Submission.findOne({
      homework: homeworkId,
      student: req.user._id,
    });

    if (submission) {
      return res.status(400).json({
        success: false,
        message: "Homework already submitted.",
      });
    }

    submission = await Submission.create({
      homework: homeworkId,
      student: req.user._id,
      answerText,
      status: "Submitted",
      submittedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      submission,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

// =============================================
// Update Submission
// =============================================

const updateSubmission = async (req, res) => {

  try {

    const submission = await Submission.findById(req.params.id)
      .populate("homework");

    if (!submission) {

      return res.status(404).json({
        success: false,
        message: "Submission not found.",
      });

    }

    if (
      submission.homework.dueDate &&
      new Date() > submission.homework.dueDate &&
      !submission.homework.allowLateSubmission
    ) {
      return res.status(400).json({
        success: false,
        message: "Submission deadline has passed.",
      });
    }

    submission.answerText =
      req.body.answerText || submission.answerText;

    await submission.save();

    res.json({
      success: true,
      submission,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};

// =============================================
// Get Student Submissions
// =============================================

const getMySubmissions = async (req, res) => {

  try {

    const submissions = await Submission.find({
      student: req.user._id,
    })
      .populate("homework");

    res.json({
      success: true,
      submissions,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};

// =============================================
// Teacher View Homework Submissions
// =============================================

const getHomeworkSubmissions = async (req, res) => {

  try {

    const submissions = await Submission.find({
      homework: req.params.homeworkId,
    })
      .populate("student")
      .populate("homework");

    res.json({
      success: true,
      submissions,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};

// =============================================
// Grade Submission
// =============================================

const gradeSubmission = async (req, res) => {

  try {

    const {
      marks,
      feedback,
    } = req.body;

    const submission =
      await Submission.findById(req.params.id);

    if (!submission) {

      return res.status(404).json({
        success: false,
        message: "Submission not found.",
      });

    }

    submission.marks = marks;

    submission.feedback = feedback;

    submission.status = "Graded";

    submission.gradedBy = req.user._id;

    submission.gradedAt = new Date();

    await submission.save();

    res.json({
      success: true,
      submission,
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
  submitHomework,
  updateSubmission,
  getMySubmissions,
  getHomeworkSubmissions,
  gradeSubmission,
};