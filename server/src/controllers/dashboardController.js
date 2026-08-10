const Course = require("../models/Course");
const Employee = require("../models/Employee");
const Assignment = require("../models/Assignment");
const Onboarding = require("../models/Onboarding");

console.log("Dashboard Controller Loaded");

// =======================================
// Manager Dashboard
// =======================================

const getDashboardStats = async (req, res) => {
  try {
    // Fetch all required data in parallel
    const [courses, employees, assignments] =
      await Promise.all([
        Course.find().sort({ createdAt: -1 }),
        Employee.find().sort({ createdAt: -1 }),
        Assignment.find()
          .populate("course")
          .populate("employee"),
      ]);

    // =====================================
    // Basic Counts
    // =====================================

    const totalCourses = courses.length;
    const totalEmployees = employees.length;
    const totalAssignments = assignments.length;

    const activeAssignments = assignments.filter(
      (a) => a.status === "In Progress"
    ).length;

    const completedAssignments = assignments.filter(
      (a) => a.status === "Completed"
    ).length;

    // =====================================
    // Completion Rate
    // =====================================

    const completionRate =
      totalAssignments === 0
        ? 0
        : Math.round(
            (completedAssignments /
              totalAssignments) *
              100
          );

    // =====================================
    // Average Progress
    // =====================================

    const averageProgress =
      totalAssignments === 0
        ? 0
        : Math.round(
            assignments.reduce(
              (sum, assignment) =>
                sum +
                (assignment.progress || 0),
              0
            ) / totalAssignments
          );

    // =====================================
    // Certificates
    // =====================================

    const certificatesIssued =
      assignments.filter(
        (assignment) =>
          assignment.certificateIssued
      ).length;

    // =====================================
    // Recent Activity
    // =====================================

    const recentActivity = [];

    assignments.forEach((assignment) => {
      if (assignment.completedAt) {
        recentActivity.push({
          type: "course-completed",
          title: `${
            assignment.employee?.name ||
            "Employee"
          } completed ${
            assignment.course?.courseTitle ||
            "a course"
          }`,
          date: assignment.completedAt,
        });
      }

      assignment.quizScores?.forEach((quiz) => {
        recentActivity.push({
          type: quiz.passed
            ? "quiz-pass"
            : "quiz-fail",
          title: `${
            assignment.employee?.name ||
            "Employee"
          } ${
            quiz.passed
              ? "passed"
              : "failed"
          } a quiz`,
          date: quiz.attemptedAt,
        });
      });
    });

    recentActivity.sort(
      (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    );

    // =====================================
    // Top Courses
    // =====================================

    const courseMap = {};

    assignments.forEach((assignment) => {
      if (!assignment.course) return;

      const courseId =
        assignment.course._id
          ? assignment.course._id.toString()
          : assignment.course.toString();

      if (!courseMap[courseId]) {
        courseMap[courseId] = {
          learners: 0,
          progress: 0,
        };
      }

      courseMap[courseId].learners += 1;

      courseMap[courseId].progress +=
        assignment.progress || 0;
    });

    const topCourses = courses
      .map((course) => {
        const stats =
          courseMap[
            course._id.toString()
          ] || {
            learners: 0,
            progress: 0,
          };

        return {
          courseId: course._id,
          courseTitle:
            course.courseTitle,
          learners:
            stats.learners,
          progress:
            stats.learners === 0
              ? 0
              : Math.round(
                  stats.progress /
                    stats.learners
                ),
        };
      })
      .sort(
        (a, b) =>
          b.learners - a.learners
      )
      .slice(0, 5);

    // =====================================
    // Top Employees
    // =====================================

    const employeeMap = {};

    assignments.forEach((assignment) => {
      if (!assignment.employee) return;

      const employeeId =
        assignment.employee._id.toString();

      if (!employeeMap[employeeId]) {
        employeeMap[employeeId] = {
          name:
            assignment.employee.name,
          completed: 0,
          progress: 0,
          courses: 0,
        };
      }

      employeeMap[employeeId].courses += 1;

      employeeMap[employeeId].progress +=
        assignment.progress || 0;

      if (
        assignment.status ===
        "Completed"
      ) {
        employeeMap[
          employeeId
        ].completed += 1;
      }
    });

    const topEmployees =
      Object.values(employeeMap)
        .map((employee) => ({
          ...employee,

          averageProgress:
            employee.courses === 0
              ? 0
              : Math.round(
                  employee.progress /
                    employee.courses
                ),
        }))
        .sort(
          (a, b) =>
            b.averageProgress -
            a.averageProgress
        )
        .slice(0, 5);

    // =====================================
    // Training Status
    // =====================================

    const trainingStatus = {
      assigned: assignments.filter(
        (a) =>
          a.status === "Assigned"
      ).length,

      inProgress: assignments.filter(
        (a) =>
          a.status ===
          "In Progress"
      ).length,

      completed: assignments.filter(
        (a) =>
          a.status ===
          "Completed"
      ).length,
    };

    // =====================================
    // Dashboard Response
    // =====================================

    return res.status(200).json({
      success: true,

      dashboard: {
        totalEmployees,
        totalCourses,
        totalAssignments,
        activeAssignments,
        completedAssignments,
        completionRate,
        averageProgress,
        certificatesIssued,

        trainingStatus,

        recentActivity:
          recentActivity.slice(0, 10),

        topCourses,

        topEmployees,

        recentEmployees:
          employees.slice(0, 5),

        recentCourses:
          courses.slice(0, 5),
      },
    });
  } catch (err) {
    console.error(
      "GET DASHBOARD STATS ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================================
// Employee Dashboard
// =======================================

const getEmployeeDashboard = async (
  req,
  res
) => {
  try {
    const [
      assignments,
      onboarding,
    ] = await Promise.all([
      Assignment.find({
        employee: req.user.id,
      }).populate("course"),

      Onboarding.findOne({
        employee: req.user.id,
      }).populate("courses.course"),
    ]);

    const assignedCourses =
      assignments.length;

    const inProgressCourses =
      assignments.filter(
        (assignment) =>
          assignment.status ===
          "In Progress"
      ).length;

    const completedCourses =
      assignments.filter(
        (assignment) =>
          assignment.status ===
          "Completed"
      ).length;

    const certificatesEarned =
      assignments.filter(
        (assignment) =>
          assignment.certificateIssued
      ).length;

    const overallProgress =
      assignedCourses === 0
        ? 0
        : Math.round(
            assignments.reduce(
              (sum, assignment) =>
                sum +
                (assignment.progress ||
                  0),
              0
            ) / assignedCourses
          );

    const modulesCompleted =
      assignments.reduce(
        (sum, assignment) =>
          sum +
          (assignment
            .completedModules
            ?.length || 0),
        0
      );

    const quizzesPassed =
      assignments.reduce(
        (sum, assignment) =>
          sum +
          (assignment.quizScores?.filter(
            (quiz) =>
              quiz.passed
          ).length || 0),
        0
      );

    const continueCourse =
      assignments.find(
        (assignment) =>
          assignment.status ===
          "In Progress"
      ) || null;

    // =====================================
    // Recent Activity
    // =====================================

    const recentActivity = [];

    assignments.forEach((assignment) => {
      if (
        assignment.completedAt &&
        assignment.course
      ) {
        recentActivity.push({
          type: "course",

          title: `${assignment.course.courseTitle} completed`,

          date:
            assignment.completedAt,
        });
      }

      (
        assignment.quizScores || []
      ).forEach((quiz) => {
        if (!assignment.course)
          return;

        recentActivity.push({
          type: quiz.passed
            ? "quiz-pass"
            : "quiz-fail",

          title: `${
            quiz.passed
              ? "Passed"
              : "Failed"
          } quiz in ${
            assignment.course
              .courseTitle
          }`,

          date:
            quiz.completedAt ||
            quiz.date ||
            quiz.attemptedAt ||
            new Date(),
        });
      });
    });

    recentActivity.sort(
      (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    );

    return res.status(200).json({
      success: true,

      dashboard: {
        assignedCourses,
        inProgressCourses,
        completedCourses,
        certificatesEarned,
        overallProgress,
        modulesCompleted,
        onboarding,
        quizzesPassed,
        continueCourse,
        recentActivity:
          recentActivity.slice(0, 5),
      },
    });
  } catch (err) {
    console.error(
      "GET EMPLOYEE DASHBOARD ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================================
// Complete Employee Onboarding Induction
// =======================================

const completeInductionItem = async (
  req,
  res
) => {
  try {
    const { inductionId } =
      req.params;

    const { answers } = req.body;

    // =====================================
    // Validate Request
    // =====================================

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message:
          "Assessment answers are required.",
      });
    }

    // =====================================
    // Get Employee Onboarding
    // =====================================

    const onboarding =
      await Onboarding.findOne({
        employee: req.user.id,
      }).populate(
        "courses.course"
      );

    if (!onboarding) {
      return res.status(404).json({
        success: false,
        message:
          "Onboarding record not found",
      });
    }

    // =====================================
    // Find Induction Item
    // =====================================

    const inductionItem =
      onboarding.induction.id(
        inductionId
      );

    if (!inductionItem) {
      return res.status(404).json({
        success: false,
        message:
          "Induction item not found",
      });
    }

    // =====================================
    // Already Completed
    // =====================================

    if (inductionItem.completed) {
      return res.status(400).json({
        success: false,
        message:
          "This induction item is already completed.",
      });
    }

    // =====================================
    // Find Assessment
    // =====================================

    let assessment = null;

    for (
      const onboardingCourse
      of onboarding.courses
    ) {
      const course =
        onboardingCourse.course;

      if (
        !course ||
        !course.onboardingAssessments
      ) {
        continue;
      }

      const foundAssessment =
        course.onboardingAssessments.find(
          (item) =>
            item.title
              .trim()
              .toLowerCase() ===
            inductionItem.title
              .trim()
              .toLowerCase()
        );

      if (foundAssessment) {
        assessment =
          foundAssessment;
        break;
      }
    }

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message:
          "Assessment for this induction item was not found.",
      });
    }

    // =====================================
    // Validate Questions
    // =====================================

    if (
      !assessment.questions ||
      assessment.questions.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This assessment has no questions.",
      });
    }

    // =====================================
    // Calculate Score
    // =====================================

    let correctAnswers = 0;

    assessment.questions.forEach(
      (question, index) => {
        const selectedAnswer =
          answers[index];

        if (
          selectedAnswer &&
          selectedAnswer ===
            question.answer
        ) {
          correctAnswers++;
        }
      }
    );

    const totalQuestions =
      assessment.questions.length;

    const score = Math.round(
      (correctAnswers /
        totalQuestions) *
        100
    );

    const passingScore =
      assessment.passingScore ||
      80;

    const passed =
      score >= passingScore;

    // =====================================
    // Save Assessment Result
    // =====================================

    const existingResult =
      onboarding.assessmentResults.find(
        (result) =>
          result.assessmentId.toString() ===
          assessment._id.toString()
      );

    const formattedAnswers =
      assessment.questions.map(
        (question, index) => ({
          question:
            question.question,

          selectedAnswer:
            answers[index] || "",

          correctAnswer:
            question.answer,

          isCorrect:
            answers[index] ===
            question.answer,
        })
      );

    if (existingResult) {
      existingResult.score =
        score;

      existingResult.passed =
        passed;

      existingResult.passingScore =
        passingScore;

      existingResult.answers =
        formattedAnswers;

      existingResult.attempts += 1;

      if (passed) {
        existingResult.completedAt =
          new Date();
      }
    } else {
      onboarding.assessmentResults.push(
        {
          assessmentId:
            assessment._id,

          title:
            assessment.title,

          score,

          passingScore,

          passed,

          answers:
            formattedAnswers,

          attempts: 1,

          completedAt: passed
            ? new Date()
            : null,
        }
      );
    }

    // =====================================
    // Complete Only After Passing
    // =====================================

    if (passed) {
      inductionItem.completed =
        true;

      inductionItem.completedAt =
        new Date();
    }

    // =====================================
    // Calculate Progress
    // =====================================

    const totalInduction =
      onboarding.induction.length;

    const completedInduction =
      onboarding.induction.filter(
        (item) =>
          item.completed
      ).length;

    const progress =
      totalInduction > 0
        ? Math.round(
            (completedInduction /
              totalInduction) *
              100
          )
        : 0;

    onboarding.progress =
      progress;

    // =====================================
    // Update Status
    // =====================================

    if (progress === 100) {
      onboarding.status =
        "Completed";

      onboarding.completedAt =
        new Date();
    } else if (progress > 0) {
      onboarding.status =
        "In Progress";

      onboarding.completedAt =
        null;
    } else {
      onboarding.status =
        "Not Started";

      onboarding.completedAt =
        null;
    }

    await onboarding.save();

    // =====================================
    // Response
    // =====================================

    return res.status(200).json({
      success: true,

      passed,

      score,

      passingScore,

      correctAnswers,

      totalQuestions,

      message: passed
        ? "Assessment passed. Induction item completed."
        : "Assessment failed. Please review the material and try again.",

      onboarding,
    });
  } catch (err) {
    console.error(
      "COMPLETE INDUCTION ERROR"
    );

    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// =======================================
// Submit Induction Assessment
// =======================================

const submitInductionAssessment = async (req, res) => {
  try {
    const { inductionId } = req.params;
    const { answers } = req.body;

    // ---------------------------------------
    // Validate Answers
    // ---------------------------------------

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Assessment answers are required.",
      });
    }

    // ---------------------------------------
    // Find Employee Onboarding
    // ---------------------------------------

    const onboarding = await Onboarding.findOne({
      employee: req.user.id,
    });

    if (!onboarding) {
      return res.status(404).json({
        success: false,
        message: "Onboarding record not found.",
      });
    }

    // ---------------------------------------
    // Find Induction Item
    // ---------------------------------------

    const inductionItem =
      onboarding.induction.id(inductionId);

    if (!inductionItem) {
      return res.status(404).json({
        success: false,
        message: "Induction item not found.",
      });
    }

    // ---------------------------------------
    // Prevent Retaking Passed Assessment
    // ---------------------------------------

    if (inductionItem.passed) {
      return res.status(400).json({
        success: false,
        message:
          "This induction assessment has already been passed.",
        passed: true,
        score: inductionItem.bestScore,
      });
    }

    // ---------------------------------------
    // Validate Questions
    // ---------------------------------------

    const questions = inductionItem.questions || [];

    if (questions.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "No assessment questions are available.",
      });
    }

    // ---------------------------------------
    // Calculate Score
    // ---------------------------------------

    let correctAnswers = 0;

    questions.forEach((question, index) => {
      const selectedAnswer = answers[index];

      if (
        selectedAnswer &&
        selectedAnswer === question.answer
      ) {
        correctAnswers++;
      }
    });

    const totalQuestions = questions.length;

    const score = Math.round(
      (correctAnswers / totalQuestions) * 100
    );

    const passingScore =
      inductionItem.passingScore || 80;

    const passed = score >= passingScore;

    // ---------------------------------------
    // Save Attempt
    // ---------------------------------------

    inductionItem.attempts.push({
      score,
      totalQuestions,
      correctAnswers,
      passed,
      attemptedAt: new Date(),
    });

    // ---------------------------------------
    // Save Latest Score
    // ---------------------------------------

    inductionItem.lastScore = score;

    // ---------------------------------------
    // Save Best Score
    // ---------------------------------------

    if (score > inductionItem.bestScore) {
      inductionItem.bestScore = score;
    }

    // ---------------------------------------
    // Mark Induction Complete ONLY if Passed
    // ---------------------------------------

    if (passed) {
      inductionItem.passed = true;
      inductionItem.completed = true;
      inductionItem.completedAt = new Date();
    }

    // ---------------------------------------
    // Calculate Overall Induction Progress
    // ---------------------------------------

    const totalInduction =
      onboarding.induction.length;

    const completedInduction =
      onboarding.induction.filter(
        (item) => item.completed
      ).length;

    const progress =
      totalInduction > 0
        ? Math.round(
            (completedInduction /
              totalInduction) *
              100
          )
        : 0;

    onboarding.progress = progress;

    // ---------------------------------------
    // Update Onboarding Status
    // ---------------------------------------

    if (progress === 100) {
      onboarding.status = "Completed";
      onboarding.completedAt = new Date();
    } else if (progress > 0) {
      onboarding.status = "In Progress";
      onboarding.completedAt = null;
    } else {
      onboarding.status = "Not Started";
      onboarding.completedAt = null;
    }

    // ---------------------------------------
    // Save
    // ---------------------------------------

    await onboarding.save();

    // ---------------------------------------
    // Return Result
    // ---------------------------------------

    return res.status(200).json({
      success: true,
      message: passed
        ? "Assessment passed successfully."
        : "Assessment failed. Please review the study material and try again.",

      passed,

      score,

      passingScore,

      correctAnswers,

      totalQuestions,

      attempts: inductionItem.attempts.length,

      inductionCompleted:
        inductionItem.completed,

      onboardingProgress:
        onboarding.progress,

      onboardingStatus:
        onboarding.status,
    });
  } catch (err) {
    console.error(
      "SUBMIT INDUCTION ASSESSMENT ERROR"
    );

    console.error(err);

    return res.status(500).json({
      success: false,
      message:
        err.message ||
        "Failed to submit assessment.",
    });
  }
};
// =======================================
// Export Controllers
// =======================================

module.exports = {
  getDashboardStats,
  getEmployeeDashboard,
  completeInductionItem,
  submitInductionAssessment,
};