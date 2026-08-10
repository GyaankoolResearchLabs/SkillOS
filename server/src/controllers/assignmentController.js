const Assignment = require("../models/Assignment");
const User = require("../models/User");
const Course = require("../models/Course");

// =======================================
// Assign Course
// =======================================

const assignCourse = async (req, res) => {
  try {
    const {
      employeeId,
      studentId,
      courseId,
    } = req.body;

    const userId = studentId || employeeId;

    if (!userId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Student and Course are required.",
      });
    }

    const student = await User.findById(userId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    if (
      student.role !== "student" &&
      student.role !== "employee"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Only students and employees can be assigned courses.",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    const alreadyAssigned =
      await Assignment.findOne({
        employee: userId,
        course: courseId,
      });

    if (alreadyAssigned) {
      return res.status(400).json({
        success: false,
        message: "Course already assigned.",
      });
    }

    const assignment = await Assignment.create({
      employee: userId,
      course: courseId,
      status: "Assigned",
      progress: 0,
      completedModules: [],
      completedLessons: [],
      lessonHistory: [],
      quizAttempts: [],
      quizScores: [],
      assignedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Course assigned successfully.",
      assignment,
    });
  } catch (err) {
    console.error(
      "ASSIGN COURSE ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        err.message ||
        "Failed to assign course.",
    });
  }
};

// =======================================
// Get Assignments
// =======================================

const getAssignments = async (req, res) => {
  try {
    let filter = {};

    if (
      req.user &&
      (
        req.user.role === "student" ||
        req.user.role === "employee"
      )
    ) {
      filter.employee = req.user.id;
    }

    const assignments =
      await Assignment.find(filter)
        .populate("employee")
        .populate("course");

    return res.json({
      success: true,
      assignments,
    });
  } catch (err) {
    console.error(
      "GET ASSIGNMENTS ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        err.message ||
        "Failed to load assignments.",
    });
  }
};

// =======================================
// Get Assignment By ID
// =======================================

const getAssignmentById = async (req, res) => {
  try {
    const assignment =
      await Assignment.findById(req.params.id)
        .populate("employee")
        .populate("course");

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found.",
      });
    }

    return res.json({
      success: true,
      assignment,
    });
  } catch (err) {
    console.error(
      "GET ASSIGNMENT ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        err.message ||
        "Failed to load assignment.",
    });
  }
};

// =======================================
// Course Analytics
// =======================================

const getCourseAnalytics = async (req, res) => {
  try {
    const { courseId } = req.params;

    const assignments =
      await Assignment.find({
        course: courseId,
      })
        .populate("employee")
        .populate("course");

    const totalStudents =
      assignments.length;

    const completed =
      assignments.filter(
        (assignment) =>
          assignment.status === "Completed"
      ).length;

    const inProgress =
      assignments.filter(
        (assignment) =>
          assignment.status === "In Progress"
      ).length;

    const assigned =
      assignments.filter(
        (assignment) =>
          assignment.status === "Assigned"
      ).length;

    const averageProgress =
      totalStudents === 0
        ? 0
        : Math.round(
            assignments.reduce(
              (sum, assignment) =>
                sum +
                (assignment.progress || 0),
              0
            ) / totalStudents
          );

    return res.json({
      success: true,

      analytics: {
        totalStudents,
        completed,
        inProgress,
        assigned,
        averageProgress,
      },

      students: assignments,
    });
  } catch (err) {
    console.error(
      "COURSE ANALYTICS ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        err.message ||
        "Failed to load course analytics.",
    });
  }
};

// =======================================
// Internal Helper
// =======================================

const updateCourseProgress = async (
  assignment
) => {
  // Make sure the arrays exist.
  if (
    !Array.isArray(
      assignment.completedModules
    )
  ) {
    assignment.completedModules = [];
  }

  if (
    !assignment.course ||
    !Array.isArray(
      assignment.course.modules
    )
  ) {
    assignment.progress = 0;
    assignment.status = "In Progress";

    await assignment.save();

    return;
  }

  const totalModules =
    assignment.course.modules.length || 1;

  const completedModules =
    assignment.completedModules.length;

  assignment.progress = Math.round(
    (completedModules /
      totalModules) *
      100
  );

  // Final assessment is still required.
  if (
    completedModules >= totalModules
  ) {
    assignment.progress = 100;
    assignment.status = "In Progress";
  } else {
    assignment.status = "In Progress";
  }

  await assignment.save();
};

// =======================================
// Complete Lesson
// =======================================

const completeLesson = async (
  req,
  res
) => {
  try {
    const {
      assignmentId,
      moduleId,
    } = req.params;

    const assignment =
      await Assignment.findById(
        assignmentId
      ).populate("course");

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found.",
      });
    }

    // =======================================
    // Initialize Arrays
    // =======================================

    if (
      !Array.isArray(
        assignment.completedLessons
      )
    ) {
      assignment.completedLessons = [];
    }

    if (
      !Array.isArray(
        assignment.lessonHistory
      )
    ) {
      assignment.lessonHistory = [];
    }

    // =======================================
    // Start Course
    // =======================================

    if (!assignment.startedAt) {
      assignment.startedAt = new Date();
    }

    // =======================================
    // Complete Lesson
    // =======================================

    const alreadyCompleted =
      assignment.completedLessons.some(
        (id) =>
          id?.toString() ===
          moduleId.toString()
      );

    if (!alreadyCompleted) {
      assignment.completedLessons.push(
        moduleId
      );

      assignment.lessonHistory.push({
        moduleId,
        completedAt: new Date(),
      });
    }

    assignment.status = "In Progress";

    await assignment.save();

    return res.json({
      success: true,
      assignment,
    });
  } catch (err) {
    console.error(
      "COMPLETE LESSON ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        err.message ||
        "Failed to complete lesson.",
    });
  }
};

// =======================================
// Complete Course
// =======================================

const completeCourse = async (
  req,
  res
) => {
  try {
    const assignment =
      await Assignment.findById(
        req.params.id
      );

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found.",
      });
    }

    assignment.status = "Completed";
    assignment.progress = 100;
    assignment.completedAt =
      new Date();

    await assignment.save();

    return res.json({
      success: true,
      assignment,
    });
  } catch (err) {
    console.error(
      "COMPLETE COURSE ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        err.message ||
        "Failed to complete course.",
    });
  }
};

// =======================================
// Submit Module Quiz
// =======================================

const submitModuleQuiz = async (
  req,
  res
) => {
  try {
    console.log(
      "======================================"
    );

    console.log(
      "SUBMIT MODULE QUIZ"
    );

    console.log(
      "======================================"
    );

    const {
      assignmentId,
      moduleId,
    } = req.params;

    const { answers } = req.body;

    console.log(
      "Assignment ID:",
      assignmentId
    );

    console.log(
      "Module ID:",
      moduleId
    );

    console.log(
      "Answers:",
      answers
    );

    // =======================================
    // Validate Request
    // =======================================

    if (!assignmentId) {
      return res.status(400).json({
        success: false,
        message:
          "Assignment ID is required.",
      });
    }

    if (!moduleId) {
      return res.status(400).json({
        success: false,
        message:
          "Module ID is required.",
      });
    }

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message:
          "Quiz answers must be an array.",
      });
    }

    // =======================================
    // Find Assignment
    // =======================================

    const assignment =
      await Assignment.findById(
        assignmentId
      ).populate("course");

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message:
          "Assignment not found.",
      });
    }

    // =======================================
    // Check Course
    // =======================================

    if (!assignment.course) {
      return res.status(404).json({
        success: false,
        message:
          "Course not found for this assignment.",
      });
    }

    // =======================================
    // Check Modules
    // =======================================

    if (
      !Array.isArray(
        assignment.course.modules
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Course modules are not available.",
      });
    }

    // =======================================
    // Find Module
    // =======================================

    const module =
      assignment.course.modules.find(
        (item) =>
          item?._id?.toString() ===
          moduleId.toString()
      );

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found.",
      });
    }

    // =======================================
    // Check Quiz
    // =======================================

    if (
      !Array.isArray(module.quiz) ||
      module.quiz.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "No quiz questions found for this module.",
      });
    }

    const quiz = module.quiz;

    // =======================================
    // Calculate Score
    // =======================================

    let correctAnswers = 0;

    quiz.forEach(
      (question, index) => {
        const selectedAnswer =
          answers[index] || "";

        if (
          selectedAnswer ===
          question.answer
        ) {
          correctAnswers++;
        }
      }
    );

    const totalQuestions =
      quiz.length;

    const score = Math.round(
      (correctAnswers /
        totalQuestions) *
        100
    );

    const passingScore = 70;

    const passed =
      score >= passingScore;

    console.log(
      "Correct:",
      correctAnswers
    );

    console.log(
      "Total:",
      totalQuestions
    );

    console.log(
      "Score:",
      score
    );

    console.log(
      "Passed:",
      passed
    );

    // =======================================
    // CRITICAL FIX
    // Initialize Arrays
    // =======================================

    if (
      !Array.isArray(
        assignment.quizAttempts
      )
    ) {
      assignment.quizAttempts = [];
    }

    if (
      !Array.isArray(
        assignment.quizScores
      )
    ) {
      assignment.quizScores = [];
    }

    if (
      !Array.isArray(
        assignment.completedModules
      )
    ) {
      assignment.completedModules = [];
    }

    // =======================================
    // Save Quiz Attempt
    // =======================================

    assignment.quizAttempts.push({
      moduleId,
      score,
      passed,
      attemptedAt: new Date(),
    });

    // =======================================
    // Remove Previous Score
    // =======================================

    assignment.quizScores =
      assignment.quizScores.filter(
        (item) =>
          item?.moduleId?.toString() !==
          moduleId.toString()
      );

    // =======================================
    // Save Latest Score
    // =======================================

    assignment.quizScores.push({
      moduleId,
      score,
      totalQuestions,
      correctAnswers,
      passed,
      attemptedAt: new Date(),
    });

    // =======================================
    // If Quiz Passed
    // =======================================

    if (passed) {
      const alreadyCompleted =
        assignment.completedModules.some(
          (id) =>
            id?.toString() ===
            moduleId.toString()
        );

      if (!alreadyCompleted) {
        assignment.completedModules.push(
          moduleId
        );
      }

      await updateCourseProgress(
        assignment
      );
    } else {
      assignment.status =
        "In Progress";

      await assignment.save();
    }

    // =======================================
    // Response
    // =======================================

    console.log(
      "QUIZ SUBMISSION SUCCESSFUL"
    );

    return res.status(200).json({
      success: true,
      passed,
      score,
      passingScore,
      correctAnswers,
      totalQuestions,
      message: passed
        ? "Quiz passed successfully."
        : "Quiz failed. Please try again.",
      assignment,
    });
  } catch (err) {
    console.error(
      "======================================"
    );

    console.error(
      "SUBMIT MODULE QUIZ ERROR"
    );

    console.error(
      "======================================"
    );

    console.error(err);

    return res.status(500).json({
      success: false,
      message:
        err.message ||
        "Failed to submit quiz.",
    });
  }
};

// =======================================
// Submit Final Assessment
// =======================================

const submitFinalAssessment = async (
  req,
  res
) => {
  try {
    const { assignmentId } =
      req.params;

    const { answers } = req.body;

    // =======================================
    // Validate Answers
    // =======================================

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message:
          "Assessment answers must be an array.",
      });
    }

    // =======================================
    // Find Assignment
    // =======================================

    const assignment =
      await Assignment.findById(
        assignmentId
      ).populate("course");

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message:
          "Assignment not found.",
      });
    }

    if (!assignment.course) {
      return res.status(404).json({
        success: false,
        message:
          "Course not found.",
      });
    }

    // =======================================
    // Get Final Assessment
    // =======================================

    const questions =
      Array.isArray(
        assignment.course
          .finalAssessment
      )
        ? assignment.course
            .finalAssessment
        : [];

    if (questions.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Final assessment not found.",
      });
    }

    // =======================================
    // Calculate Score
    // =======================================

    let correctAnswers = 0;

    const submittedAnswers = [];

    questions.forEach(
      (question, index) => {
        const selected =
          answers[index] || "";

        const isCorrect =
          selected ===
          question.answer;

        if (isCorrect) {
          correctAnswers++;
        }

        submittedAnswers.push({
          question:
            question.question,
          selectedAnswer:
            selected,
          correctAnswer:
            question.answer,
          isCorrect,
        });
      }
    );

    const score = Math.round(
      (correctAnswers /
        questions.length) *
        100
    );

    const passed =
      score >= 70;

    // =======================================
    // Save Final Assessment
    // =======================================

    assignment.finalAssessmentScore =
      score;

    assignment.finalAssessmentPassed =
      passed;

    assignment.finalAssessmentAnswers =
      submittedAnswers;

    // =======================================
    // Complete Course If Passed
    // =======================================

    if (passed) {
      assignment.status =
        "Completed";

      assignment.progress = 100;

      assignment.completedAt =
        new Date();

      assignment.certificateIssued =
        true;

      assignment.certificateIssuedAt =
        new Date();
    }

    await assignment.save();

    return res.json({
      success: true,
      passed,
      score,
      correctAnswers,
      totalQuestions:
        questions.length,
      assignment,
    });
  } catch (err) {
    console.error(
      "SUBMIT FINAL ASSESSMENT ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        err.message ||
        "Failed to submit final assessment.",
    });
  }
};

// =======================================
// Export
// =======================================

module.exports = {
  assignCourse,
  getAssignments,
  getAssignmentById,
  getCourseAnalytics,
  completeLesson,
  completeCourse,
  submitModuleQuiz,
  submitFinalAssessment,
};