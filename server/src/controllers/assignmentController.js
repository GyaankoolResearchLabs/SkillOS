const Assignment = require("../models/Assignment");
const User = require("../models/User");
const Course = require("../models/Course");

// =====================================================
// HELPERS
// =====================================================

const getOrganizationId = (req) => {
  return req.user?.organizationId || null;
};

const isSameId = (a, b) => {
  if (!a || !b) return false;

  return a.toString() === b.toString();
};

// =====================================================
// VERIFY EMPLOYEE ASSIGNMENT ACCESS
// =====================================================

const getEmployeeAssignment = async (
  assignmentId,
  req
) => {
  const assignment =
    await Assignment.findById(
      assignmentId
    ).populate("course");

  if (!assignment) {
    return null;
  }

  // Employee can only access their own assignment.
  if (req.user?.role === "employee") {
    if (
      !isSameId(
        assignment.employee,
        req.user._id
      )
    ) {
      return null;
    }

    return assignment;
  }

  // Manager / other organization users
  // can only access assignments belonging
  // to their organization.
  const organizationId =
    getOrganizationId(req);

  if (!organizationId) {
    return null;
  }

  if (
    !isSameId(
      assignment.organizationId,
      organizationId
    )
  ) {
    return null;
  }

  return assignment;
};

// =====================================================
// ASSIGN COURSE
// =====================================================

const assignCourse = async (
  req,
  res
) => {
  try {
    console.log(
      "===================================="
    );
    console.log("ASSIGN COURSE");
    console.log(
      "===================================="
    );

    console.log(
      "REQUEST BODY:",
      req.body
    );

    console.log(
      "LOGGED USER:",
      req.user?.email
    );

    console.log(
      "LOGGED USER ORGANIZATION ID:",
      req.user?.organizationId
    );

    const {
      employeeId,
      studentId,
      courseId,
    } = req.body;

    const targetUserId =
      employeeId || studentId;

    // =================================================
    // VALIDATION
    // =================================================

    if (!targetUserId) {
      return res.status(400).json({
        success: false,
        message:
          "Employee ID is required.",
      });
    }

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message:
          "Course ID is required.",
      });
    }

    // =================================================
    // ORGANIZATION
    // =================================================

    const organizationId =
      getOrganizationId(req);

    if (!organizationId) {
      return res.status(403).json({
        success: false,
        message:
          "Authenticated organization context is required.",
      });
    }

    // =================================================
    // FIND TARGET USER
    // =================================================

    const employee =
      await User.findOne({
        _id: targetUserId,
        organizationId,
      });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message:
          "Employee not found in your organization.",
      });
    }

    // =================================================
    // FIND COURSE
    // =================================================

    const course =
      await Course.findOne({
        _id: courseId,
        organizationId,
      });

    if (!course) {
      return res.status(404).json({
        success: false,
        message:
          "Course not found in your organization.",
      });
    }

    // =================================================
    // DUPLICATE CHECK
    // =================================================

    const existingAssignment =
      await Assignment.findOne({
        organizationId,
        employee: targetUserId,
        course: courseId,
      });

    if (existingAssignment) {
      return res.status(409).json({
        success: false,
        message:
          "This course is already assigned to this employee.",
        assignment:
          existingAssignment,
      });
    }

    // =================================================
    // CREATE ASSIGNMENT
    // =================================================

    const assignment =
      await Assignment.create({
        organizationId,
        employee: targetUserId,
        course: courseId,

        status: "Assigned",
        progress: 0,

        completedModules: [],
        completedLessons: [],
        lessonHistory: [],

        quizScores: [],

        finalAssessmentScore:
          null,

        finalAssessmentPassed:
          false,

        finalAssessmentAnswers:
          [],

        certificateIssued:
          false,

        certificateIssuedAt:
          null,

        startedAt: null,
        completedAt: null,

        assignedAt: new Date(),
      });

    console.log(
      "===================================="
    );

    console.log(
      "COURSE ASSIGNED SUCCESSFULLY"
    );

    console.log(
      "ASSIGNMENT ID:",
      assignment._id
    );

    console.log(
      "EMPLOYEE:",
      employee.email
    );

    console.log(
      "COURSE:",
      course.courseTitle
    );

    console.log(
      "ORGANIZATION:",
      organizationId
    );

    console.log(
      "===================================="
    );

    return res.status(201).json({
      success: true,
      message:
        "Course assigned successfully.",
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

// =====================================================
// BULK ASSIGN
// =====================================================

const bulkAssignCourse = async (
  req,
  res
) => {
  try {
    const {
      employeeIds,
      studentIds,
      courseId,
    } = req.body;

    const users = [
      ...(employeeIds || []),
      ...(studentIds || []),
    ];

    if (
      !users.length ||
      !courseId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Employee IDs and course ID are required.",
      });
    }

    const organizationId =
      getOrganizationId(req);

    if (!organizationId) {
      return res.status(403).json({
        success: false,
        message:
          "Authenticated organization context is required.",
      });
    }

    // =================================================
    // COURSE MUST BELONG TO ORGANIZATION
    // =================================================

    const course =
      await Course.findOne({
        _id: courseId,
        organizationId,
      });

    if (!course) {
      return res.status(404).json({
        success: false,
        message:
          "Course not found in your organization.",
      });
    }

    const results = [];

    // =================================================
    // PROCESS USERS
    // =================================================

    for (
      const userId of users
    ) {
      try {
        const employee =
          await User.findOne({
            _id: userId,
            organizationId,
          });

        if (!employee) {
          console.warn(
            "BULK ASSIGN SKIPPED USER:",
            userId
          );

          continue;
        }

        const existing =
          await Assignment.findOne({
            organizationId,
            employee: userId,
            course: courseId,
          });

        if (existing) {
          console.log(
            "BULK ASSIGN DUPLICATE:",
            userId
          );

          continue;
        }

        const assignment =
          await Assignment.create({
            organizationId,
            employee: userId,
            course: courseId,

            status: "Assigned",
            progress: 0,

            completedModules: [],
            completedLessons: [],
            lessonHistory: [],

            quizScores: [],

            finalAssessmentScore:
              null,

            finalAssessmentPassed:
              false,

            finalAssessmentAnswers:
              [],

            certificateIssued:
              false,

            certificateIssuedAt:
              null,

            startedAt: null,
            completedAt: null,

            assignedAt: new Date(),
          });

        results.push(
          assignment
        );

        console.log(
          "BULK ASSIGNMENT CREATED:",
          assignment._id
        );
      } catch (error) {
        console.error(
          "BULK USER ERROR:",
          error.message
        );
      }
    }

    return res.status(201).json({
      success: true,
      message:
        "Courses assigned successfully.",
      assignments: results,
      count: results.length,
    });
  } catch (err) {
    console.error(
      "BULK ASSIGN ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        err.message ||
        "Failed to assign courses.",
    });
  }
};

// =====================================================
// GET ASSIGNMENTS
// =====================================================

const getAssignments = async (
  req,
  res
) => {
  try {
    console.log(
      "===================================="
    );

    console.log(
      "GET ASSIGNMENTS"
    );

    console.log(
      "===================================="
    );

    console.log(
      "USER:",
      req.user?.email
    );

    console.log(
      "USER ROLE:",
      req.user?.role
    );

    console.log(
      "USER ORGANIZATION ID:",
      req.user?.organizationId
    );

    // =================================================
    // EMPLOYEE
    // =================================================

    if (
      req.user?.role ===
      "employee"
    ) {
      const assignments =
        await Assignment.find({
          employee:
            req.user._id,
        })
          .populate({
            path: "course",
          })
          .sort({
            assignedAt: -1,
          });

      console.log(
        "EMPLOYEE ASSIGNMENTS FOUND:",
        assignments.length
      );

      return res.status(200).json({
        success: true,
        assignments,
      });
    }

    // =================================================
    // MANAGER / ORGANIZATION
    // =================================================

    const organizationId =
      getOrganizationId(req);

    if (!organizationId) {
      return res.status(403).json({
        success: false,
        message:
          "Authenticated organization context is required.",
        assignments: [],
      });
    }

    const assignments =
      await Assignment.find({
        organizationId,
      })
        .populate({
          path: "employee",
          select:
            "name email role department designation organizationId",
        })
        .populate({
          path: "course",
        })
        .sort({
          assignedAt: -1,
        });

    console.log(
      "ORGANIZATION ASSIGNMENTS FOUND:",
      assignments.length
    );

    return res.status(200).json({
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
      assignments: [],
    });
  }
};

// =====================================================
// GET ASSIGNMENT BY ID
// =====================================================

const getAssignmentById = async (
  req,
  res
) => {
  try {
    const { id } =
      req.params;

    console.log(
      "GET ASSIGNMENT:",
      id
    );

    const assignment =
      await Assignment.findById(
        id
      )
        .populate({
          path: "course",
        })
        .populate({
          path: "employee",
          select:
            "name email role department designation organizationId",
        });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message:
          "Assignment not found.",
      });
    }

    // =================================================
    // EMPLOYEE SECURITY
    // =================================================

    if (
      req.user?.role ===
      "employee"
    ) {
      if (
        !assignment.employee ||
        !isSameId(
          assignment.employee._id,
          req.user._id
        )
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You are not authorized to view this assignment.",
        });
      }
    }

    // =================================================
    // ORGANIZATION SECURITY
    // =================================================

    if (
      req.user?.role !==
      "employee"
    ) {
      const organizationId =
        getOrganizationId(req);

      if (!organizationId) {
        return res.status(403).json({
          success: false,
          message:
            "Authenticated organization context is required.",
        });
      }

      if (
        !isSameId(
          assignment.organizationId,
          organizationId
        )
      ) {
        return res.status(404).json({
          success: false,
          message:
            "Assignment not found.",
        });
      }
    }

    return res.status(200).json({
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

// =====================================================
// COMPLETE LESSON / MODULE
// =====================================================

const completeLesson = async (
  req,
  res
) => {
  try {
    const {
      assignmentId,
      moduleId,
    } = req.params;

    console.log(
      "===================================="
    );

    console.log(
      "COMPLETE LESSON"
    );

    console.log(
      "ASSIGNMENT ID:",
      assignmentId
    );

    console.log(
      "MODULE ID:",
      moduleId
    );

    console.log(
      "USER:",
      req.user?.email
    );

    // =================================================
    // GET AND AUTHORIZE ASSIGNMENT
    // =================================================

    const assignment =
      await getEmployeeAssignment(
        assignmentId,
        req
      );

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message:
          "Assignment not found.",
      });
    }

    // =================================================
    // COURSE
    // =================================================

    const course =
      assignment.course;

    if (!course) {
      return res.status(404).json({
        success: false,
        message:
          "Course associated with this assignment was not found.",
      });
    }

    // =================================================
    // VERIFY MODULE
    // =================================================

    const module =
      course.modules?.find(
        (item) =>
          item._id &&
          item._id.toString() ===
            moduleId
      );

    if (!module) {
      return res.status(404).json({
        success: false,
        message:
          "Module not found in this course.",
      });
    }

    // =================================================
    // DUPLICATE PROTECTION
    // =================================================

    if (
      !assignment.completedModules.some(
        (id) =>
          id.toString() ===
          moduleId
      )
    ) {
      assignment.completedModules.push(
        moduleId
      );
    }

    if (
      !assignment.completedLessons.some(
        (id) =>
          id.toString() ===
          moduleId
      )
    ) {
      assignment.completedLessons.push(
        moduleId
      );
    }

    // =================================================
    // LESSON HISTORY
    // =================================================

    const alreadyInHistory =
      assignment.lessonHistory.some(
        (item) =>
          item.moduleId ===
          moduleId
      );

    if (!alreadyInHistory) {
      assignment.lessonHistory.push({
        moduleId,
        completedAt:
          new Date(),
      });
    }

    // =================================================
    // START COURSE
    // =================================================

    if (!assignment.startedAt) {
      assignment.startedAt =
        new Date();
    }

    // =================================================
    // CALCULATE PROGRESS
    // =================================================

    const totalModules =
      course.modules?.length || 0;

    const completedModules =
      assignment
        .completedModules
        .length;

    if (totalModules > 0) {
      assignment.progress =
        Math.min(
          100,
          Math.round(
            (completedModules /
              totalModules) *
              100
          )
        );
    } else {
      assignment.progress = 100;
    }

    if (
      assignment.status ===
      "Assigned"
    ) {
      assignment.status =
        "In Progress";
    }

    await assignment.save();

    console.log(
      "LESSON COMPLETED SUCCESSFULLY"
    );

    console.log(
      "PROGRESS:",
      assignment.progress
    );

    return res.status(200).json({
      success: true,
      message:
        "Lesson completed successfully.",
      assignment,
      progress:
        assignment.progress,
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

// =====================================================
// SUBMIT MODULE QUIZ
// =====================================================

const submitModuleQuiz = async (
  req,
  res
) => {
  try {
    const {
      assignmentId,
      moduleId,
    } = req.params;

    const {
      answers = [],
    } = req.body;

    console.log(
      "===================================="
    );

    console.log(
      "SUBMIT MODULE QUIZ"
    );

    console.log(
      "ASSIGNMENT ID:",
      assignmentId
    );

    console.log(
      "MODULE ID:",
      moduleId
    );

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message:
          "Answers must be an array.",
      });
    }

    const assignment =
      await getEmployeeAssignment(
        assignmentId,
        req
      );

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message:
          "Assignment not found.",
      });
    }

    const course =
      assignment.course;

    if (!course) {
      return res.status(404).json({
        success: false,
        message:
          "Course associated with this assignment was not found.",
      });
    }

    const module =
      course.modules?.find(
        (item) =>
          item._id &&
          item._id.toString() ===
            moduleId
      );

    if (!module) {
      return res.status(404).json({
        success: false,
        message:
          "Module not found in this course.",
      });
    }

    const questions =
      module.quiz || [];

    if (!questions.length) {
      return res.status(400).json({
        success: false,
        message:
          "This module does not contain a quiz.",
      });
    }

    let correctAnswers = 0;

    const answerDetails =
      questions.map(
        (question, index) => {
          const submitted =
            answers[index];

          let selectedAnswer = "";

          if (
            typeof submitted ===
            "string"
          ) {
            selectedAnswer =
              submitted;
          } else if (
            submitted &&
            typeof submitted ===
              "object"
          ) {
            if (
              submitted.question ===
              question.question
            ) {
              selectedAnswer =
                submitted.answer ||
                submitted.selectedAnswer ||
                "";
            }
          }

          const isCorrect =
            selectedAnswer
              .trim()
              .toLowerCase() ===
            question.answer
              .trim()
              .toLowerCase();

          if (isCorrect) {
            correctAnswers++;
          }

          return {
            question:
              question.question,

            selectedAnswer,

            correctAnswer:
              question.answer,

            isCorrect,
          };
        }
      );

    const totalQuestions =
      questions.length;

    const score =
      totalQuestions > 0
        ? Math.round(
            (correctAnswers /
              totalQuestions) *
              100
          )
        : 0;

    const passed =
      score >= 70;

    assignment.quizScores =
      assignment.quizScores.filter(
        (item) =>
          item.moduleId !==
          moduleId
      );

    assignment.quizScores.push({
      moduleId,

      score,

      totalQuestions,

      correctAnswers,

      passed,

      attemptedAt:
        new Date(),
    });

    if (!assignment.startedAt) {
      assignment.startedAt =
        new Date();
    }

    if (
      assignment.status ===
      "Assigned"
    ) {
      assignment.status =
        "In Progress";
    }

    await assignment.save();

    console.log(
      "MODULE QUIZ RESULT:",
      {
        moduleId,
        score,
        passed,
        correctAnswers,
        totalQuestions,
      }
    );

    return res.status(200).json({
      success: true,

      message: passed
        ? "Quiz passed successfully."
        : "Quiz submitted. Please review the material and try again.",

      result: {
        moduleId,
        score,
        passed,
        correctAnswers,
        totalQuestions,
        answers:
          answerDetails,
      },

      assignment,
    });
  } catch (err) {
    console.error(
      "SUBMIT MODULE QUIZ ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        err.message ||
        "Failed to submit module quiz.",
    });
  }
};

// =====================================================
// SUBMIT FINAL ASSESSMENT
// =====================================================
//
// POST
// /api/assignments/:assignmentId/final-assessment
//
// Body:
// {
//   answers: [
//     "answer 1",
//     "answer 2",
//     "answer 3"
//   ]
// }
//
// =====================================================

const submitFinalAssessment = async (
  req,
  res
) => {
  try {
    const {
      assignmentId,
    } = req.params;

    const {
      answers = [],
    } = req.body;

    console.log(
      "===================================="
    );

    console.log(
      "SUBMIT FINAL ASSESSMENT"
    );

    console.log(
      "ASSIGNMENT ID:",
      assignmentId
    );

    console.log(
      "SUBMITTED ANSWERS:",
      answers
    );

    // =================================================
    // VALIDATION
    // =================================================

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message:
          "Answers must be an array.",
      });
    }

    // =================================================
    // AUTHORIZATION
    // =================================================

    const assignment =
      await getEmployeeAssignment(
        assignmentId,
        req
      );

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message:
          "Assignment not found.",
      });
    }

    const course =
      assignment.course;

    if (!course) {
      return res.status(404).json({
        success: false,
        message:
          "Course associated with this assignment was not found.",
      });
    }

    const questions =
      course.finalAssessment ||
      [];

    if (!questions.length) {
      return res.status(400).json({
        success: false,
        message:
          "This course does not contain a final assessment.",
      });
    }

    // =================================================
    // SCORE FINAL ASSESSMENT
    // =================================================

    let correctAnswers = 0;

    const answerDetails =
      questions.map(
        (question, index) => {
          const submitted =
            answers[index];

          let selectedAnswer = "";

          // =============================================
          // FRONTEND CURRENT FORMAT
          // =============================================
          //
          // FinalAssessment.jsx sends:
          //
          // [
          //   "Option A",
          //   "Option C",
          //   "Option B"
          // ]
          //
          // =============================================

          if (
            typeof submitted ===
            "string"
          ) {
            selectedAnswer =
              submitted;
          }

          // =============================================
          // ALSO SUPPORT OBJECT FORMAT
          // =============================================
          //
          // This keeps the backend compatible with
          // any future frontend changes.
          //
          // =============================================

          else if (
            submitted &&
            typeof submitted ===
              "object"
          ) {
            if (
              submitted.question ===
              question.question
            ) {
              selectedAnswer =
                submitted.answer ||
                submitted.selectedAnswer ||
                "";
            }
          }

          // =============================================
          // COMPARE ANSWER
          // =============================================

          const correctAnswer =
            String(
              question.answer || ""
            )
              .trim()
              .toLowerCase();

          const normalizedSelectedAnswer =
            String(
              selectedAnswer || ""
            )
              .trim()
              .toLowerCase();

          const isCorrect =
            normalizedSelectedAnswer ===
            correctAnswer;

          if (isCorrect) {
            correctAnswers++;
          }

          return {
            question:
              question.question,

            selectedAnswer,

            correctAnswer:
              question.answer,

            isCorrect,
          };
        }
      );

    // =================================================
    // CALCULATE SCORE
    // =================================================

    const totalQuestions =
      questions.length;

    const score =
      totalQuestions > 0
        ? Math.round(
            (correctAnswers /
              totalQuestions) *
              100
          )
        : 0;

    // =================================================
    // PASSING SCORE
    // =================================================

    const passed =
      score >= 70;

    // =================================================
    // SAVE RESULT
    // =================================================

    assignment.finalAssessmentScore =
      score;

    assignment.finalAssessmentPassed =
      passed;

    assignment.finalAssessmentAnswers =
      answerDetails;

    if (!assignment.startedAt) {
      assignment.startedAt =
        new Date();
    }

    if (
      assignment.status ===
      "Assigned"
    ) {
      assignment.status =
        "In Progress";
    }

    await assignment.save();

    // =================================================
    // LOG RESULT
    // =================================================

    console.log(
      "FINAL ASSESSMENT RESULT:",
      {
        score,
        passed,
        correctAnswers,
        totalQuestions,
      }
    );

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,

      message: passed
        ? "Final assessment passed successfully."
        : "Final assessment submitted. Please review the material and try again.",

      result: {
        score,
        passed,
        correctAnswers,
        totalQuestions,
        answers:
          answerDetails,
      },

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

// =====================================================
// COMPLETE COURSE
// =====================================================

const completeCourse = async (
  req,
  res
) => {
  try {
    const { id } =
      req.params;

    console.log(
      "===================================="
    );

    console.log(
      "COMPLETE COURSE"
    );

    console.log(
      "ASSIGNMENT ID:",
      id
    );

    // =================================================
    // AUTHORIZATION
    // =================================================

    const assignment =
      await getEmployeeAssignment(
        id,
        req
      );

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message:
          "Assignment not found.",
      });
    }

    const course =
      assignment.course;

    if (!course) {
      return res.status(404).json({
        success: false,
        message:
          "Course associated with this assignment was not found.",
      });
    }

    // =================================================
    // CHECK MODULE COMPLETION
    // =================================================

    const totalModules =
      course.modules?.length || 0;

    const completedModules =
      assignment.completedModules
        ?.length || 0;

    if (
      totalModules > 0 &&
      completedModules <
        totalModules
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Complete all course modules before completing the course.",
        progress:
          assignment.progress,
      });
    }

    // =================================================
    // FINAL ASSESSMENT CHECK
    // =================================================

    const hasFinalAssessment =
      Array.isArray(
        course.finalAssessment
      ) &&
      course.finalAssessment.length >
        0;

    if (
      hasFinalAssessment &&
      !assignment.finalAssessmentPassed
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Pass the final assessment before completing the course.",
      });
    }

    // =================================================
    // COMPLETE
    // =================================================

    assignment.progress = 100;

    assignment.status =
      "Completed";

    assignment.completedAt =
      new Date();

    // =================================================
    // CERTIFICATE
    // =================================================

    if (
      !assignment.certificateIssued
    ) {
      assignment.certificateIssued =
        true;

      assignment.certificateIssuedAt =
        new Date();
    }

    await assignment.save();

    console.log(
      "COURSE COMPLETED SUCCESSFULLY"
    );

    return res.status(200).json({
      success: true,

      message:
        "Course completed successfully.",

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

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  assignCourse,
  bulkAssignCourse,
  getAssignments,
  getAssignmentById,
  completeLesson,
  submitModuleQuiz,
  submitFinalAssessment,
  completeCourse,
};