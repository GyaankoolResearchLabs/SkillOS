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

  let settings =
    await SecuritySettings.findOne({
      organization,
    });

  if (!settings) {
    settings =
      await SecuritySettings.create({
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
    message: "Password meets security requirements.",
  };
};

// =======================================
// Get All Employees
// =======================================

const getEmployees = async (req, res) => {
  try {
    const employees = await User.find({
      role: "employee",
    })
      .select("-password")
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: employees.length,
      employees,
    });
  } catch (err) {
    console.error(
      "GET EMPLOYEES ERROR:",
      err
    );

    res.status(500).json({
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
    const students = await User.find({
      role: "student",
    })
      .select("-password")
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (err) {
    console.error(
      "GET STUDENTS ERROR:",
      err
    );

    res.status(500).json({
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
    const teachers = await User.find({
      role: "teacher",
    })
      .select("-password")
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: teachers.length,
      teachers,
    });
  } catch (err) {
    console.error(
      "GET TEACHERS ERROR:",
      err
    );

    res.status(500).json({
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
        message: "User already exists.",
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
    // Create Employee
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

      organization:
        req.user?.organization?.trim() ||
        "default",

      passwordChangedAt:
        new Date(),

      failedLoginAttempts: 0,

      lockedUntil: null,
    });

    console.log(
      "EMPLOYEE CREATED:",
      user._id
    );

    // =======================================
    // FIND ONBOARDING COURSES
    // =======================================

    const onboardingCourses =
      await Course.find({
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
                  item.title === title
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
              assessment?.questions ||
              [],

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
          employee: user._id,

          course: course._id,

          status: "Assigned",

          progress: 0,

          completedModules: [],

          completedLessons: [],

          assignedAt: new Date(),
        });

      console.log(
        "ASSIGNMENT CREATED:",
        assignment._id
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

        status: "Not Started",

        progress: 0,

        completedAt: null,
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

  action: "EMPLOYEE_CREATED",

  description:
    `Employee ${user.name} was created successfully.`,

  targetType: "Employee",

  targetId: user._id,

  targetName: user.name,

  status: "Success",

  metadata: {
    email: user.email,

    role: user.role,

    department:
      user.department,

    designation:
      user.designation,

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
    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found.",
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

      // Reset security state after
      // administrator password reset.

      user.failedLoginAttempts = 0;
      user.lockedUntil = null;
    }

    await user.save();

    res.status(200).json({
      success: true,

      message:
        "User updated successfully.",

      user: {
        _id: user._id,

        name: user.name,

        email: user.email,

        role: user.role,

        department:
          user.department,

        designation:
          user.designation,
      },
    });
  } catch (err) {
    console.error(
      "UPDATE EMPLOYEE ERROR:",
      err
    );

    res.status(500).json({
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
    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found.",
      });
    }

    await User.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,

      message:
        "User deleted successfully.",
    });
  } catch (err) {
    console.error(
      "DELETE EMPLOYEE ERROR:",
      err
    );

    res.status(500).json({
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
    // ---------------------------------------
    // Find Employee
    // ---------------------------------------

    const employeeId =
      req.user.id;

    const employee =
      await User.findById(
        employeeId
      );

    if (!employee) {
      return res.status(404).json({
        success: false,

        message:
          "Employee not found.",
      });
    }

    // ---------------------------------------
    // Find Existing Onboarding
    // ---------------------------------------

    const onboarding =
      await Onboarding.findOne({
        employee: employeeId,
      });

    if (!onboarding) {
      return res.status(404).json({
        success: false,

        message:
          "Onboarding record not found.",
      });
    }

    // ---------------------------------------
    // Find Onboarding Courses
    // ---------------------------------------

    const courses =
      await Course.find({
        audience: "Employee",

        status: "Published",

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
        "_id onboardingAssessments"
      );

    if (!courses.length) {
      return res.status(404).json({
        success: false,

        message:
          "No onboarding courses found.",
      });
    }

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
    // Rebuild Induction Items
    // ---------------------------------------

    onboarding.induction =
      inductionTitles.map(
        (title) => {
          let assessment = null;

          for (
            const course of courses
          ) {
            const found =
              course.onboardingAssessments?.find(
                (item) =>
                  item.title ===
                  title
              );

            if (found) {
              assessment =
                found;

              break;
            }
          }

          console.log(
            `SYNC ${title}:`,
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
              assessment?.questions ||
              [],

            passingScore:
              assessment?.passingScore ||
              80,

            attempts: [],

            bestScore: 0,

            lastScore: 0,

            passed: false,

            completed: false,

            completedAt:
              null,
          };
        }
      );

    // ---------------------------------------
    // Save
    // ---------------------------------------

    await onboarding.save();

    // ---------------------------------------
    // Debug Information
    // ---------------------------------------

    console.log(
      "ONBOARDING SYNCED:",
      onboarding._id
    );

    console.log(
      "SYNCED INDUCTION:",
      onboarding.induction.map(
        (item) => ({
          title:
            item.title,

          studyContentLength:
            item.studyContent
              ?.length || 0,

          questionCount:
            item.questions
              ?.length || 0,

          passingScore:
            item.passingScore,
        })
      )
    );

    // ---------------------------------------
    // Response
    // ---------------------------------------

    return res.status(200).json({
      success: true,

      message:
        "Employee onboarding synced successfully.",

      onboarding,
    });
  } catch (err) {
    console.error(
      "SYNC EMPLOYEE ONBOARDING ERROR:"
    );

    console.error(err);

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