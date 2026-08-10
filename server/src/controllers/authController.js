const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Organization = require("../models/Organization");
const SecuritySettings = require("../models/SecuritySettings");

const generateToken = require("../utils/generateToken");

// =====================================================
// DEFAULT SECURITY SETTINGS
// =====================================================

const DEFAULT_SECURITY = {
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
// GET SECURITY SETTINGS
// =====================================================

const getSettingsForUser = async (user) => {
  const organization =
    user?.organization?.trim() || "default";

  let settings = await SecuritySettings.findOne({
    organization,
  });

  if (!settings) {
    settings = await SecuritySettings.create({
      organization,
      ...DEFAULT_SECURITY,
    });
  }

  return settings;
};

// =====================================================
// REGISTER ORGANIZATION + MANAGER
// =====================================================

const registerOrganization = async (req, res) => {
  let createdOrganization = null;

  try {
    const {
      organizationName,
      managerName,
      email,
      password,
    } = req.body;

    // =================================================
    // VALIDATION
    // =================================================

    if (
      !organizationName ||
      !managerName ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Organization name, manager name, email and password are required.",
      });
    }

    const cleanOrganizationName =
      organizationName.trim();

    const cleanManagerName =
      managerName.trim();

    const cleanEmail =
      email.trim().toLowerCase();

    // =================================================
    // BASIC VALIDATION
    // =================================================

    if (cleanOrganizationName.length < 2) {
      return res.status(400).json({
        success: false,
        message:
          "Organization name must contain at least 2 characters.",
      });
    }

    if (cleanManagerName.length < 2) {
      return res.status(400).json({
        success: false,
        message:
          "Manager name must contain at least 2 characters.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 8 characters.",
      });
    }

    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least one uppercase letter.",
      });
    }

    if (!/[0-9]/.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least one number.",
      });
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least one special character.",
      });
    }

    // =================================================
    // CHECK EXISTING EMAIL
    // =================================================

    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists.",
      });
    }

    // =================================================
    // CREATE ORGANIZATION
    // =================================================

    createdOrganization =
      await Organization.create({
        name: cleanOrganizationName,
        status: "trial",
        plan: "trial",
      });

    // =================================================
    // HASH PASSWORD
    // =================================================

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // =================================================
    // CREATE MANAGER
    // =================================================

    const manager = await User.create({
      name: cleanManagerName,

      email: cleanEmail,

      password: hashedPassword,

      role: "manager",

      organization:
        createdOrganization.name,

      organizationId:
        createdOrganization._id,

      passwordChangedAt: new Date(),
    });

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(201).json({
      success: true,

      message:
        "Organization and manager account created successfully.",

      organization: {
        id: createdOrganization._id,
        name: createdOrganization.name,
        status: createdOrganization.status,
        plan: createdOrganization.plan,
      },

      user: {
        id: manager._id,
        name: manager.name,
        email: manager.email,
        role: manager.role,
        organization:
          manager.organization,
        organizationId:
          manager.organizationId,
      },
    });
  } catch (err) {
    console.error(
      "REGISTER ORGANIZATION ERROR:",
      err
    );

    // =================================================
    // CLEANUP
    // =================================================

    if (createdOrganization) {
      try {
        await Organization.findByIdAndDelete(
          createdOrganization._id
        );
      } catch (cleanupError) {
        console.error(
          "ORGANIZATION CLEANUP ERROR:",
          cleanupError
        );
      }
    }

    return res.status(500).json({
      success: false,
      message:
        "Unable to create organization. Please try again.",
    });
  }
};

// =====================================================
// LOGIN
// =====================================================

const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    email = email.trim().toLowerCase();

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    const settings =
      await getSettingsForUser(user);

    // =================================================
    // CHECK ACCOUNT LOCK
    // =================================================

    if (
      user.lockedUntil &&
      user.lockedUntil > new Date()
    ) {
      const remainingMinutes =
        Math.ceil(
          (user.lockedUntil.getTime() -
            Date.now()) /
            60000
        );

      return res.status(423).json({
        success: false,
        message:
          `Account temporarily locked. Try again in ${remainingMinutes} minute(s).`,
      });
    }

    // =================================================
    // CLEAR EXPIRED LOCK
    // =================================================

    if (
      user.lockedUntil &&
      user.lockedUntil <= new Date()
    ) {
      user.lockedUntil = null;
      user.failedLoginAttempts = 0;

      await user.save();
    }

    // =================================================
    // PASSWORD CHECK
    // =================================================

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      user.failedLoginAttempts =
        (user.failedLoginAttempts || 0) +
        1;

      if (
        user.failedLoginAttempts >=
        settings.maxFailedLoginAttempts
      ) {
        user.lockedUntil =
          new Date(
            Date.now() +
              settings.lockoutDurationMinutes *
                60 *
                1000
          );

        user.failedLoginAttempts = 0;

        await user.save();

        return res.status(423).json({
          success: false,
          message:
            `Too many failed login attempts. Account locked for ${settings.lockoutDurationMinutes} minute(s).`,
        });
      }

      await user.save();

      const remainingAttempts =
        settings.maxFailedLoginAttempts -
        user.failedLoginAttempts;

      return res.status(401).json({
        success: false,
        message:
          `Invalid email or password. ${remainingAttempts} attempt(s) remaining.`,
      });
    }

    // =================================================
    // SUCCESSFUL LOGIN
    // =================================================

    user.failedLoginAttempts = 0;
    user.lockedUntil = null;

    await user.save();

    // =================================================
    // TOKEN
    // =================================================

    const token =
      generateToken(
        user._id,
        settings.sessionDurationHours
      );

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,

      message:
        "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department:
          user.department,
        organization:
          user.organization,
        organizationId:
          user.organizationId || null,
      },

      security: {
        sessionDurationHours:
          settings.sessionDurationHours,

        passwordExpiryDays:
          settings.passwordExpiryDays,
      },
    });
  } catch (err) {
    console.error(
      "LOGIN ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        "Internal server error",
    });
  }
};

// =====================================================
// SEED DEMO USERS
// =====================================================

const seedManager = async (req, res) => {
  try {
    const users = [
      {
        name: "SkillOS Manager",
        email: "manager@skillos.com",
        password: "admin123",
        role: "manager",
      },

      {
        name: "John Employee",
        email: "employee@skillos.com",
        password: "employee123",
        role: "employee",
      },

      {
        name: "Emily Teacher",
        email: "teacher@skillos.com",
        password: "teacher123",
        role: "teacher",
      },

      {
        name: "Alex Student",
        email: "student@skillos.com",
        password: "student123",
        role: "student",
      },
    ];

    for (const u of users) {
      const existingUser =
        await User.findOne({
          email:
            u.email.toLowerCase(),
        });

      if (existingUser) {
        continue;
      }

      const hashedPassword =
        await bcrypt.hash(
          u.password,
          10
        );

      await User.create({
        name: u.name,

        email:
          u.email.toLowerCase(),

        password:
          hashedPassword,

        role: u.role,

        passwordChangedAt:
          new Date(),
      });

      console.log(
        `Created ${u.role}: ${u.email}`
      );
    }

    return res.status(200).json({
      success: true,
      message:
        "Demo users created successfully.",
    });
  } catch (err) {
    console.error(
      "SEED ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to seed demo users.",
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  login,
  registerOrganization,
  seedManager,
};