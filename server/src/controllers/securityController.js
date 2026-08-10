const SecuritySettings = require("../models/SecuritySettings");

const {
  createAuditLog,
} = require("../services/auditLogService");

// =====================================================
// DEFAULT SETTINGS
// =====================================================

const DEFAULT_SETTINGS = {
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
// ORGANIZATION KEY
// =====================================================

const getOrganizationKey = (user) => {
  return user?.organization?.trim() || "default";
};

// =====================================================
// GET SECURITY SETTINGS
// =====================================================

const getSecuritySettings = async (req, res) => {
  try {
    const organization =
      getOrganizationKey(req.user);

    let settings =
      await SecuritySettings.findOne({
        organization,
      });

    if (!settings) {
      settings =
        await SecuritySettings.create({
          organization,
          ...DEFAULT_SETTINGS,
        });
    }

    return res.status(200).json({
      success: true,
      settings,
    });
  } catch (err) {
    console.error(
      "GET SECURITY SETTINGS ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load security settings.",
    });
  }
};

// =====================================================
// UPDATE SECURITY SETTINGS
// =====================================================

const updateSecuritySettings = async (
  req,
  res
) => {
  try {
    const organization =
      getOrganizationKey(req.user);

    // =================================================
    // GET CURRENT SETTINGS
    // =================================================

    let currentSettings =
      await SecuritySettings.findOne({
        organization,
      });

    if (!currentSettings) {
      currentSettings =
        await SecuritySettings.create({
          organization,
          ...DEFAULT_SETTINGS,
        });
    }

    // =================================================
    // REQUEST VALUES
    // =================================================

    const {
      minimumPasswordLength,
      requireUppercase,
      requireNumber,
      requireSpecialCharacter,
      passwordExpiryDays,
      maxFailedLoginAttempts,
      lockoutDurationMinutes,
      sessionDurationHours,
    } = req.body;

    // =================================================
    // VALIDATE NUMERIC SETTINGS
    // =================================================

    if (
      minimumPasswordLength !==
        undefined &&
      (
        Number(
          minimumPasswordLength
        ) < 6 ||
        Number(
          minimumPasswordLength
        ) > 32
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Minimum password length must be between 6 and 32.",
      });
    }

    if (
      maxFailedLoginAttempts !==
        undefined &&
      (
        Number(
          maxFailedLoginAttempts
        ) < 1 ||
        Number(
          maxFailedLoginAttempts
        ) > 20
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Maximum failed login attempts must be between 1 and 20.",
      });
    }

    if (
      lockoutDurationMinutes !==
        undefined &&
      (
        Number(
          lockoutDurationMinutes
        ) < 1 ||
        Number(
          lockoutDurationMinutes
        ) > 1440
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Lockout duration must be between 1 and 1440 minutes.",
      });
    }

    if (
      sessionDurationHours !==
        undefined &&
      (
        Number(
          sessionDurationHours
        ) < 1 ||
        Number(
          sessionDurationHours
        ) > 720
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Session duration must be between 1 and 720 hours.",
      });
    }

    if (
      passwordExpiryDays !==
        undefined &&
      (
        Number(
          passwordExpiryDays
        ) < 0 ||
        Number(
          passwordExpiryDays
        ) > 3650
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Password expiry must be between 0 and 3650 days.",
      });
    }

    // =================================================
    // BUILD UPDATE
    // =================================================

    const update = {
      updatedBy: req.user._id,
    };

    if (
      minimumPasswordLength !==
      undefined
    ) {
      update.minimumPasswordLength =
        Number(
          minimumPasswordLength
        );
    }

    if (
      requireUppercase !==
      undefined
    ) {
      update.requireUppercase =
        Boolean(
          requireUppercase
        );
    }

    if (
      requireNumber !==
      undefined
    ) {
      update.requireNumber =
        Boolean(
          requireNumber
        );
    }

    if (
      requireSpecialCharacter !==
      undefined
    ) {
      update.requireSpecialCharacter =
        Boolean(
          requireSpecialCharacter
        );
    }

    if (
      passwordExpiryDays !==
      undefined
    ) {
      update.passwordExpiryDays =
        Number(
          passwordExpiryDays
        );
    }

    if (
      maxFailedLoginAttempts !==
      undefined
    ) {
      update.maxFailedLoginAttempts =
        Number(
          maxFailedLoginAttempts
        );
    }

    if (
      lockoutDurationMinutes !==
      undefined
    ) {
      update.lockoutDurationMinutes =
        Number(
          lockoutDurationMinutes
        );
    }

    if (
      sessionDurationHours !==
      undefined
    ) {
      update.sessionDurationHours =
        Number(
          sessionDurationHours
        );
    }

    // =================================================
    // SAVE SETTINGS
    // =================================================

    const settings =
      await SecuritySettings.findOneAndUpdate(
        {
          organization,
        },
        {
          $set: update,

          $setOnInsert: {
            organization,
          },
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
        }
      );

    // =================================================
    // AUDIT LOG
    // =================================================

    await createAuditLog({
      req,

      action:
        "SECURITY_SETTINGS_UPDATED",

      description:
        "Organization security settings were updated.",

      targetType:
        "SecuritySettings",

      targetId:
        settings._id,

      targetName:
        `${organization} Security Settings`,

      status:
        "Success",

      metadata: {
        organization,

        previousSettings: {
          minimumPasswordLength:
            currentSettings.minimumPasswordLength,

          requireUppercase:
            currentSettings.requireUppercase,

          requireNumber:
            currentSettings.requireNumber,

          requireSpecialCharacter:
            currentSettings.requireSpecialCharacter,

          passwordExpiryDays:
            currentSettings.passwordExpiryDays,

          maxFailedLoginAttempts:
            currentSettings.maxFailedLoginAttempts,

          lockoutDurationMinutes:
            currentSettings.lockoutDurationMinutes,

          sessionDurationHours:
            currentSettings.sessionDurationHours,
        },

        newSettings: {
          minimumPasswordLength:
            settings.minimumPasswordLength,

          requireUppercase:
            settings.requireUppercase,

          requireNumber:
            settings.requireNumber,

          requireSpecialCharacter:
            settings.requireSpecialCharacter,

          passwordExpiryDays:
            settings.passwordExpiryDays,

          maxFailedLoginAttempts:
            settings.maxFailedLoginAttempts,

          lockoutDurationMinutes:
            settings.lockoutDurationMinutes,

          sessionDurationHours:
            settings.sessionDurationHours,
        },
      },
    });

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,

      message:
        "Security settings saved successfully.",

      settings,
    });
  } catch (err) {
    console.error(
      "UPDATE SECURITY SETTINGS ERROR:",
      err
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to save security settings.",
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getSecuritySettings,
  updateSecuritySettings,
};