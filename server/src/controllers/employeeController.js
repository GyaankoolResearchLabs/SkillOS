const User = require("../models/User");
const Onboarding = require("../models/Onboarding");
const SecuritySettings = require("../models/SecuritySettings");
const bcrypt = require("bcryptjs");
const Assignment = require("../models/Assignment");
const Course = require("../models/Course");

// =====================================================
// WORKFLOW ENGINE
// =====================================================

const {
  createAuditLog,
} = require("../services/auditLogService");

const {
  triggerWorkflow,
} = require("../services/workflowService");

// =====================================================
// DEFAULT SECURITY SETTINGS
// =====================================================

const DEFAULT_SECURITY_SETTINGS = {
  minimumPasswordLength: 8,
  requireUppercase: true,
  requireNumber: true,
  requireSpecialCharacter: true,
  passwordExpiryDays: 90,
  maxFailedLoginAttempts: 5,
  lockoutDurationMinutes: 15,
  sessionDurationHours: 24,
};

// =====================================================
// GET SECURITY SETTINGS FOR USER
// =====================================================

const getSecuritySettingsForUser = async (user) => {
  const organization =
    user?.organization?.trim() || "default";

  let settings = await SecuritySettings.findOne({
    organization,
  });

  if (!settings) {
    settings = await SecuritySettings.create({
      organization,
      ...DEFAULT_SECURITY_SETTINGS,
    });
  }

  return settings;
};

// =====================================================
// VALIDATE PASSWORD AGAINST SECURITY POLICY
// =====================================================

const validatePasswordPolicy = (
  password,
  settings
) => {
  if (!password) {
    return {
      valid: false,
      message: "Password is required.",
    };
  }

  // ---------------------------------------------------
  // Minimum Length
  // ---------------------------------------------------

  if (
    password.length <
    settings.minimumPasswordLength
  ) {
    return {
      valid: false,
      message:
        `Password must contain at least ${settings.minimumPasswordLength} characters.`,
    };
  }

  // ---------------------------------------------------
  // Uppercase
  // ---------------------------------------------------

  if (
    settings.requireUppercase &&
    !/[A-Z]/.test(password)
  ) {
    return {
      valid: false,
      message:
        "Password must contain at least one uppercase letter.",
    };
  }

  // ---------------------------------------------------
  // Number
  // ---------------------------------------------------

  if (
    settings.requireNumber &&
    !/[0-9]/.test(password)
  ) {
    return {
      valid: false,
      message:
        "Password must contain at least one number.",
    };
  }

  // ---------------------------------------------------
  // Special Character
  // ---------------------------------------------------

  if (
    settings.requireSpecialCharacter &&
    !/[^A-Za-z0-9]/.test(password)
  ) {
    return {
      valid: false,
      message:
        "Password must contain at least one special character.",
    };
  }

  return {
    valid: true,
    message:
      "Password meets security requirements.",
  };
};

// =======================================
// Get All Employees
// =======================================

const getEmployees = async (req, res) => {
  try {
    if (!req.organizationId) {
      return res.status(403).json({
        success: false,
        message:
          "Organization context is required.",
      });
    }

    const employees = await User.find({
      role: "employee",
      organizationId: req.organizationId,
    })
      .select("-password")
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: employees.length,
      employees,
    });
  } catch (err) {
    console.error(
      "GET EMPLOYEES ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================================
// Get All Students
// =======================================

const getStudents = async (req, res) => {
  try {
    if (!req.organizationId) {
      return res.status(403).json({
        success: false,
        message:
          "Organization context is required.",
      });
    }

    const students = await User.find({
      role: "student",
      organizationId: req.organizationId,
    })
      .select("-password")
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (err) {
    console.error(
      "GET STUDENTS ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================================
// Get All Teachers
// =======================================

const getTeachers = async (req, res) => {
  try {
    if (!req.organizationId) {
      return res.status(403).json({
        success: false,
        message:
          "Organization context is required.",
      });
    }

    const teachers = await User.find({
      role: "teacher",
      organizationId: req.organizationId,
    })
      .select("-password")
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: teachers.length,
      teachers,
    });
  } catch (err) {
    console.error(
      "GET TEACHERS ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================================
// Create Employee
// =======================================

const createEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      department,
      designation,
      role,
    } = req.body;

    // ---------------------------------------
    // Validate organization context
    // ---------------------------------------

    if (
      !req.user ||
      !req.organization ||
      !req.organizationId
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Authenticated organization context is required.",
      });
    }

    // ---------------------------------------
    // Validate required fields
    // ---------------------------------------

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Name, Email and Password are required.",
      });
    }

    // ---------------------------------------
    // Normalize email
    // ---------------------------------------

    const normalizedEmail =
      email.trim().toLowerCase();

    // ---------------------------------------
    // Check existing user
    // ---------------------------------------

    const existingUser =
      await User.findOne({
        email: normalizedEmail,
      });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "User already exists.",
      });
    }

    // =======================================
    // SECURITY POLICY
    // =======================================

    const securitySettings =
      await getSecuritySettingsForUser(
        req.user
      );

    console.log(
      "SECURITY SETTINGS USED:",
      {
        organization:
          securitySettings.organization,

        minimumPasswordLength:
          securitySettings.minimumPasswordLength,

        requireUppercase:
          securitySettings.requireUppercase,

        requireNumber:
          securitySettings.requireNumber,

        requireSpecialCharacter:
          securitySettings.requireSpecialCharacter,
      }
    );

    // ---------------------------------------
    // Validate Password
    // ---------------------------------------

    const passwordValidation =
      validatePasswordPolicy(
        password,
        securitySettings
      );

    if (!passwordValidation.valid) {
      return res.status(400).json({
        success: false,
        message:
          passwordValidation.message,
      });
    }

    // ---------------------------------------
    // Hash password
    // ---------------------------------------

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // ---------------------------------------
    // Create Employee/User
    // ---------------------------------------

    const user = await User.create({
      name: name.trim(),

      email: normalizedEmail,

      password: hashedPassword,

      role: role || "employee",

      department:
        department?.trim() || "",

      designation:
        designation?.trim() || "",

      // Legacy organization name
      organization:
        req.organization.name,

      // Authoritative organization link
      organizationId:
        req.organizationId,

      passwordChangedAt:
        new Date(),

      failedLoginAttempts: 0,

      lockedUntil: null,
    });

    console.log(
      "EMPLOYEE CREATED:",
      user._id
    );

    console.log(
      "EMPLOYEE ORGANIZATION:",
      user.organization
    );

    console.log(
      "EMPLOYEE ORGANIZATION ID:",
      user.organizationId
    );

    // =======================================
    // FIND ONBOARDING COURSES
    // =======================================

    const onboardingCourses =
      await Course.find({
        organizationId:
          req.organizationId,

        audience: "Employee",

        status: "Published",

        $or: [
          {
            category: "Onboarding",
          },

          {
            category: "Induction",
          },

          {
            tags: {
              $in: ["onboarding"],
            },
          },

          {
            tags: {
              $in: ["induction"],
            },
          },
        ],
      }).select(
        "_id onboardingAssessments"
      );

    console.log(
      "ONBOARDING COURSES FOUND:",
      onboardingCourses.length
    );

    // =======================================
    // BUILD INDUCTION ITEMS
    // =======================================

    const inductionTitles = [
      "Company Introduction",
      "HR Policies",
      "Organization Guidelines",
      "Department Introduction",
      "Role & Responsibilities",
    ];

    const inductionItems =
      inductionTitles.map(
        (title) => {
          let assessment = null;

          for (
            const course of onboardingCourses
          ) {
            const found =
              course.onboardingAssessments?.find(
                (item) =>
                  item.title &&
                  item.title
                    .trim()
                    .toLowerCase() ===
                  title
                    .trim()
                    .toLowerCase()
              );

            if (found) {
              assessment = found;
              break;
            }
          }

          console.log(
            `INDUCTION ASSESSMENT: ${title}`,
            assessment
              ? "FOUND"
              : "NOT FOUND"
          );

          return {
            title,

            description:
              assessment?.description ||
              "",

            studyContent:
              assessment?.studyContent ||
              "",

            estimatedDuration:
              assessment?.estimatedDuration ||
              "5 minutes",

            questions:
              Array.isArray(
                assessment?.questions
              )
                ? assessment.questions
                : [],

            passingScore:
              assessment?.passingScore ||
              80,

            attempts: [],

            bestScore: 0,

            lastScore: 0,

            passed: false,

            completed: false,

            completedAt: null,
          };
        }
      );

    // =======================================
    // CREATE COURSE ASSIGNMENTS
    // =======================================

    const assignments = [];

    for (
      const course of onboardingCourses
    ) {
      const assignment =
        await Assignment.create({
          organizationId:
            req.organizationId,

          employee:
            user._id,

          course:
            course._id,

          status:
            "Assigned",

          progress:
            0,

          completedModules:
            [],

          completedLessons:
            [],

          lessonHistory:
            [],

          quizScores:
            [],

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

          startedAt:
            null,

          completedAt:
            null,

          assignedAt:
            new Date(),
        });

      console.log(
        "ASSIGNMENT CREATED:",
        assignment._id
      );

      console.log(
        "ASSIGNMENT ORGANIZATION ID:",
        assignment.organizationId
      );

      console.log(
        "ASSIGNMENT EMPLOYEE:",
        assignment.employee
      );

      console.log(
        "ASSIGNMENT COURSE:",
        assignment.course
      );

      assignments.push(
        assignment
      );
    }

    // =======================================
    // CREATE ONBOARDING
    // =======================================

    const onboarding =
      await Onboarding.create({
        employee: user._id,

        induction: inductionItems,

        courses:
          assignments.map(
            (assignment) => ({
              course:
                assignment.course,

              completed: false,

              completedAt: null,
            })
          ),

        status:
          "Not Started",

        progress:
          0,

        completedAt:
          null,
      });

    console.log(
      "ONBOARDING CREATED:",
      onboarding._id
    );

    // =======================================
    // WORKFLOW ENGINE TRIGGER
    // =======================================

    try {
      await triggerWorkflow(
        "employee.created",
        {
          employee: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            department:
              user.department,
            designation:
              user.designation,
          },

          onboarding: {
            _id: onboarding._id,

            status:
              onboarding.status,

            courseCount:
              onboarding.courses.length,

            inductionCount:
              onboarding.induction.length,
          },

          assignments:
            assignments.map(
              (assignment) => ({
                _id:
                  assignment._id,

                course:
                  assignment.course,

                status:
                  assignment.status,
              })
            ),
        }
      );

      console.log(
        "WORKFLOW EVENT TRIGGERED:",
        "employee.created"
      );

      // =======================================
      // AUDIT LOG
      // =======================================

      await createAuditLog({
        req,

        action:
          "EMPLOYEE_CREATED",

        description:
          `Employee ${user.name} was created successfully.`,

        targetType:
          "Employee",

        targetId:
          user._id,

        targetName:
          user.name,

        status:
          "Success",

        metadata: {
          email:
            user.email,

          role:
            user.role,

          department:
            user.department,

          designation:
            user.designation,

          organizationId:
            req.organizationId,

          onboardingId:
            onboarding._id,

          courseCount:
            assignments.length,
        },
      });
    } catch (workflowError) {
      console.error(
        "WORKFLOW TRIGGER ERROR:",
        workflowError
      );
    }

    // =======================================
    // RESPONSE
    // =======================================

    return res.status(201).json({
      success: true,

      message:
        `${user.role} created successfully.`,

      user: {
        _id:
          user._id,

        name:
          user.name,

        email:
          user.email,

        role:
          user.role,

        department:
          user.department,

        designation:
          user.designation,

        organization:
          user.organization,

        organizationId:
          user.organizationId,
      },

      onboarding: {
        _id:
          onboarding._id,

        status:
          onboarding.status,

        inductionCount:
          onboarding.induction.length,

        courseCount:
          onboarding.courses.length,
      },
    });
  } catch (err) {
    console.error(
      "CREATE EMPLOYEE ERROR:"
    );

    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================================
// Update User
// =======================================

const updateEmployee = async (
  req,
  res
) => {
  try {
    if (
      !req.user ||
      !req.organizationId
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Authenticated organization context is required.",
      });
    }

    const user =
      await User.findOne({
        _id:
          req.params.id,

        organizationId:
          req.organizationId,
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found in your organization.",
      });
    }

    user.name =
      req.body.name ||
      user.name;

    user.email =
      req.body.email ||
      user.email;

    user.department =
      req.body.department ||
      user.department;

    user.designation =
      req.body.designation ||
      user.designation;

    if (req.body.role) {
      user.role =
        req.body.role;
    }

    // =======================================
    // PASSWORD UPDATE
    // =======================================

    if (
      req.body.password &&
      req.body.password.trim() !== ""
    ) {
      const securitySettings =
        await getSecuritySettingsForUser(
          req.user
        );

      const passwordValidation =
        validatePasswordPolicy(
          req.body.password,
          securitySettings
        );

      if (!passwordValidation.valid) {
        return res.status(400).json({
          success: false,
          message:
            passwordValidation.message,
        });
      }

      user.password =
        await bcrypt.hash(
          req.body.password,
          10
        );

      user.passwordChangedAt =
        new Date();

      user.failedLoginAttempts = 0;
      user.lockedUntil = null;
    }

    await user.save();

    return res.status(200).json({
      success: true,

      message:
        "User updated successfully.",

      user: {
        _id:
          user._id,

        name:
          user.name,

        email:
          user.email,

        role:
          user.role,

        department:
          user.department,

        designation:
          user.designation,

        organization:
          user.organization,

        organizationId:
          user.organizationId,
      },
    });
  } catch (err) {
    console.error(
      "UPDATE EMPLOYEE ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================================
// Delete User
// =======================================

const deleteEmployee = async (
  req,
  res
) => {
  try {
    if (
      !req.user ||
      !req.organizationId
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Authenticated organization context is required.",
      });
    }

    const user =
      await User.findOne({
        _id:
          req.params.id,

        organizationId:
          req.organizationId,
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found in your organization.",
      });
    }

    await User.findOneAndDelete({
      _id:
        req.params.id,

      organizationId:
        req.organizationId,
    });

    return res.status(200).json({
      success: true,

      message:
        "User deleted successfully.",
    });
  } catch (err) {
    console.error(
      "DELETE EMPLOYEE ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================================
// Sync Existing Employee Onboarding
// =======================================

const syncEmployeeOnboarding = async (
  req,
  res
) => {
  try {
    console.log(
      "=========================================="
    );

    console.log(
      "SYNC EMPLOYEE ONBOARDING"
    );

    console.log(
      "=========================================="
    );

    // ---------------------------------------
    // Resolve Employee ID
    // ---------------------------------------

    const employeeId =
      req.user?._id ||
      req.user?.id;

    if (!employeeId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    // ---------------------------------------
    // Resolve Organization
    // ---------------------------------------

    const organizationId =
      req.organizationId ||
      req.user?.organizationId;

    if (!organizationId) {
      return res.status(403).json({
        success: false,
        message:
          "Organization context is required.",
      });
    }

    console.log(
      "EMPLOYEE ID:",
      employeeId
    );

    console.log(
      "ORGANIZATION ID:",
      organizationId
    );

    // ---------------------------------------
    // Find Employee
    // ---------------------------------------

    const employee =
      await User.findOne({
        _id:
          employeeId,

        organizationId:
          organizationId,
      });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message:
          "Employee not found.",
      });
    }

    console.log(
      "EMPLOYEE FOUND:",
      employee.email
    );

    // ---------------------------------------
    // Find Existing Onboarding
    // ---------------------------------------

    const onboarding =
      await Onboarding.findOne({
        employee:
          employeeId,
      });

    if (!onboarding) {
      return res.status(404).json({
        success: false,
        message:
          "Onboarding record not found.",
      });
    }

    console.log(
      "ONBOARDING FOUND:",
      onboarding._id
    );

    // ---------------------------------------
    // Find Published Onboarding Courses
    // ---------------------------------------

    let onboardingCourses =
      await Course.find({
        organizationId:
          organizationId,

        audience:
          "Employee",

        status:
          "Published",

        $or: [
          {
            category:
              "Onboarding",
          },

          {
            category:
              "Induction",
          },

          {
            tags: {
              $in: [
                "onboarding",
              ],
            },
          },

          {
            tags: {
              $in: [
                "induction",
              ],
            },
          },
        ],
      }).select(
        "_id courseTitle organizationId audience category status onboardingAssessments"
      );

    console.log(
      "ONBOARDING COURSES FOUND:",
      onboardingCourses.length
    );

    // ---------------------------------------
    // FALLBACK
    //
    // If the course has generated
    // onboardingAssessments but does not
    // have the expected category/tag,
    // find it directly within the same
    // organization.
    // ---------------------------------------

    if (!onboardingCourses.length) {
      console.log(
        "NO STANDARD ONBOARDING COURSE FOUND."
      );

      console.log(
        "SEARCHING FOR COURSES WITH GENERATED ONBOARDING ASSESSMENTS..."
      );

      onboardingCourses =
        await Course.find({
          organizationId:
            organizationId,

          audience:
            "Employee",

          status:
            "Published",

          "onboardingAssessments.0":
            {
              $exists: true,
            },
        }).select(
          "_id courseTitle organizationId audience category status onboardingAssessments"
        );

      console.log(
        "ASSESSMENT-BASED COURSES FOUND:",
        onboardingCourses.length
      );
    }

    // ---------------------------------------
    // No Courses Found
    // ---------------------------------------

    if (!onboardingCourses.length) {
      return res.status(404).json({
        success: false,
        message:
          "No published onboarding course with generated assessments was found for this organization.",
      });
    }

    // ---------------------------------------
    // Debug Courses
    // ---------------------------------------

    onboardingCourses.forEach(
      (course) => {
        console.log(
          "------------------------------------------"
        );

        console.log(
          "COURSE:",
          course.courseTitle
        );

        console.log(
          "COURSE ID:",
          course._id
        );

        console.log(
          "COURSE ORGANIZATION:",
          course.organizationId
        );

        console.log(
          "COURSE AUDIENCE:",
          course.audience
        );

        console.log(
          "COURSE CATEGORY:",
          course.category
        );

        console.log(
          "COURSE STATUS:",
          course.status
        );

        console.log(
          "ONBOARDING ASSESSMENTS:",
          course
            .onboardingAssessments
            ?.length || 0
        );

        console.log(
          "------------------------------------------"
        );
      }
    );

    // ---------------------------------------
    // Required Induction Titles
    // ---------------------------------------

    const inductionTitles = [
      "Company Introduction",
      "HR Policies",
      "Organization Guidelines",
      "Department Introduction",
      "Role & Responsibilities",
    ];

    // ---------------------------------------
    // Preserve Existing Progress
    // ---------------------------------------

    const existingInduction =
      Array.isArray(
        onboarding.induction
      )
        ? onboarding.induction
        : [];

    // ---------------------------------------
    // Rebuild Induction Items
    // ---------------------------------------

    const inductionItems =
      inductionTitles.map(
        (title) => {
          let assessment = null;

          // Search all available courses
          for (
            const course of onboardingCourses
          ) {
            const found =
              course
                .onboardingAssessments
                ?.find(
                  (item) => {
                    if (
                      !item?.title
                    ) {
                      return false;
                    }

                    return (
                      item.title
                        .trim()
                        .toLowerCase() ===
                      title
                        .trim()
                        .toLowerCase()
                    );
                  }
                );

            if (found) {
              assessment =
                found;

              break;
            }
          }

          console.log(
            `INDUCTION ASSESSMENT: ${title}`,
            assessment
              ? "FOUND"
              : "NOT FOUND"
          );

          // -----------------------------------
          // Existing Employee Progress
          // -----------------------------------

          const existing =
            existingInduction.find(
              (item) =>
                item?.title
                  ?.trim()
                  .toLowerCase() ===
                title
                  .trim()
                  .toLowerCase()
            );

          // -----------------------------------
          // Return Updated Induction
          // -----------------------------------

          return {
            title,

            description:
              assessment?.description ||
              existing?.description ||
              "",

            studyContent:
              assessment?.studyContent ||
              existing?.studyContent ||
              "",

            estimatedDuration:
              assessment?.estimatedDuration ||
              existing?.estimatedDuration ||
              "5 minutes",

            questions:
              Array.isArray(
                assessment?.questions
              )
                ? assessment.questions
                : Array.isArray(
                    existing?.questions
                  )
                  ? existing.questions
                  : [],

            passingScore:
              assessment?.passingScore ||
              existing?.passingScore ||
              80,

            // Preserve existing progress
            attempts:
              existing?.attempts ||
              [],

            bestScore:
              existing?.bestScore ||
              0,

            lastScore:
              existing?.lastScore ||
              0,

            passed:
              existing?.passed ||
              false,

            completed:
              existing?.completed ||
              false,

            completedAt:
              existing?.completedAt ||
              null,
          };
        }
      );

    // ---------------------------------------
    // Update Induction
    // ---------------------------------------

    onboarding.induction =
      inductionItems;

    // ---------------------------------------
    // Add Missing Course References
    // ---------------------------------------

    const existingCourseIds =
      Array.isArray(
        onboarding.courses
      )
        ? onboarding.courses.map(
            (item) =>
              String(
                item.course
              )
          )
        : [];

    const updatedCourses =
      Array.isArray(
        onboarding.courses
      )
        ? [...onboarding.courses]
        : [];

    for (
      const course of onboardingCourses
    ) {
      const courseId =
        String(course._id);

      const alreadyExists =
        existingCourseIds.includes(
          courseId
        );

      if (!alreadyExists) {
        updatedCourses.push({
          course:
            course._id,

          completed:
            false,

          completedAt:
            null,
        });
      }
    }

    onboarding.courses =
      updatedCourses;

    // ---------------------------------------
    // Save
    // ---------------------------------------

    await onboarding.save();

    // ---------------------------------------
    // Diagnostics
    // ---------------------------------------

    console.log(
      "=========================================="
    );

    console.log(
      "ONBOARDING SYNC SUCCESSFUL"
    );

    console.log(
      "ONBOARDING ID:",
      onboarding._id
    );

    console.log(
      "COURSES:",
      onboarding.courses.length
    );

    console.log(
      "INDUCTION ITEMS:",
      onboarding.induction.length
    );

    console.log(
      "SYNCED INDUCTION:"
    );

    onboarding.induction.forEach(
      (item) => {
        console.log(
          `${item.title} -> Study: ${
            item.studyContent
              ?.length || 0
          } chars | Questions: ${
            item.questions
              ?.length || 0
          } | Passing Score: ${
            item.passingScore
          }`
        );
      }
    );

    console.log(
      "=========================================="
    );

    // ---------------------------------------
    // Response
    // ---------------------------------------

    return res.status(200).json({
      success: true,

      message:
        "Employee onboarding synchronized successfully.",

      onboarding,
    });
  } catch (err) {
    console.error(
      "=========================================="
    );

    console.error(
      "SYNC EMPLOYEE ONBOARDING ERROR:"
    );

    console.error(err);

    console.error(
      "=========================================="
    );

    return res.status(500).json({
      success: false,

      message:
        err.message ||
        "Failed to sync employee onboarding.",
    });
  }
};

// =======================================
// EXPORTS
// =======================================

module.exports = {
  getEmployees,
  getStudents,
  getTeachers,
  createEmployee,
  updateEmployee,
  syncEmployeeOnboarding,
  deleteEmployee,
};