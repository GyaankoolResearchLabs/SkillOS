const AuditLog = require("../models/AuditLog");

// =====================================================
// CREATE AUDIT LOG
// =====================================================

const createAuditLog = async ({
  req = null,
  action,
  description = "",
  targetType = "",
  targetId = null,
  targetName = "",
  status = "Success",
  metadata = {},
}) => {
  try {
    // ---------------------------------------------------
    // USER INFORMATION
    // ---------------------------------------------------

    const user = req?.user || null;

    // ---------------------------------------------------
    // IP ADDRESS
    // ---------------------------------------------------

    let ipAddress = "";

    if (req) {
      ipAddress =
        req.headers?.["x-forwarded-for"] ||
        req.ip ||
        req.socket?.remoteAddress ||
        "";
    }

    if (
      typeof ipAddress === "string" &&
      ipAddress.includes(",")
    ) {
      ipAddress =
        ipAddress.split(",")[0].trim();
    }

    // ---------------------------------------------------
    // USER AGENT
    // ---------------------------------------------------

    const userAgent =
      req?.headers?.["user-agent"] || "";

    // ---------------------------------------------------
    // CREATE LOG
    // ---------------------------------------------------

    const auditLog = await AuditLog.create({
      action,

      description,

      user: user?._id || null,

      userName:
        user?.name ||
        "System",

      userEmail:
        user?.email ||
        "",

      userRole:
        user?.role ||
        "system",

      targetType,

      targetId,

      targetName,

      status,

      ipAddress,

      userAgent,

      metadata,
    });

    console.log(
      "AUDIT LOG CREATED:",
      action
    );

    return auditLog;
  } catch (error) {
    // ---------------------------------------------------
    // IMPORTANT
    // ---------------------------------------------------
    //
    // Audit logging must NEVER break the main operation.
    //
    // Example:
    // Employee creation succeeds
    // Audit log fails
    //
    // We log the failure but do not undo
    // employee creation.
    //
    // ---------------------------------------------------

    console.error(
      "AUDIT LOG ERROR:",
      error.message
    );

    return null;
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createAuditLog,
};