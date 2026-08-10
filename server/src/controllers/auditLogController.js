const AuditLog = require("../models/AuditLog");

// =====================================================
// GET AUDIT LOGS
// =====================================================

const getAuditLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 25,
      action,
      status,
      userRole,
      search,
    } = req.query;

    const currentPage =
      Math.max(Number(page) || 1, 1);

    const perPage =
      Math.min(
        Math.max(Number(limit) || 25, 1),
        100
      );

    // =================================================
    // BUILD FILTER
    // =================================================

    const filter = {};

    if (action && action !== "all") {
      filter.action = action;
    }

    if (status && status !== "all") {
      filter.status = status;
    }

    if (userRole && userRole !== "all") {
      filter.userRole = userRole;
    }

    // =================================================
    // SEARCH
    // =================================================

    if (search && search.trim()) {
      const searchRegex =
        new RegExp(
          search.trim(),
          "i"
        );

      filter.$or = [
        {
          action: searchRegex,
        },
        {
          description: searchRegex,
        },
        {
          userName: searchRegex,
        },
        {
          userEmail: searchRegex,
        },
        {
          targetName: searchRegex,
        },
      ];
    }

    // =================================================
    // COUNT
    // =================================================

    const total =
      await AuditLog.countDocuments(
        filter
      );

    // =================================================
    // FETCH
    // =================================================

    const logs =
      await AuditLog.find(filter)
        .sort({
          createdAt: -1,
        })
        .skip(
          (currentPage - 1) *
            perPage
        )
        .limit(perPage)
        .lean();

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,

      count: logs.length,

      total,

      page: currentPage,

      limit: perPage,

      totalPages:
        Math.ceil(
          total / perPage
        ),

      logs,
    });
  } catch (err) {
    console.error(
      "GET AUDIT LOGS ERROR:",
      err
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch audit logs.",
    });
  }
};

// =====================================================
// GET AUDIT LOG BY ID
// =====================================================

const getAuditLogById = async (
  req,
  res
) => {
  try {
    const log =
      await AuditLog.findById(
        req.params.id
      ).lean();

    if (!log) {
      return res.status(404).json({
        success: false,

        message:
          "Audit log not found.",
      });
    }

    return res.status(200).json({
      success: true,

      log,
    });
  } catch (err) {
    console.error(
      "GET AUDIT LOG ERROR:",
      err
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch audit log.",
    });
  }
};

// =====================================================
// GET AUDIT LOG SUMMARY
// =====================================================

const getAuditLogSummary = async (
  req,
  res
) => {
  try {
    const [
      total,
      successful,
      failed,
    ] = await Promise.all([
      AuditLog.countDocuments(),

      AuditLog.countDocuments({
        status: "Success",
      }),

      AuditLog.countDocuments({
        status: "Failed",
      }),
    ]);

    // -------------------------------------------------
    // ACTION COUNTS
    // -------------------------------------------------

    const actionCounts =
      await AuditLog.aggregate([
        {
          $group: {
            _id: "$action",

            count: {
              $sum: 1,
            },
          },
        },

        {
          $sort: {
            count: -1,
          },
        },

        {
          $limit: 20,
        },
      ]);

    // -------------------------------------------------
    // USER ACTIVITY
    // -------------------------------------------------

    const userActivity =
      await AuditLog.aggregate([
        {
          $match: {
            userRole: {
              $ne: "system",
            },
          },
        },

        {
          $group: {
            _id: {
              user: "$userName",
              email: "$userEmail",
            },

            count: {
              $sum: 1,
            },
          },
        },

        {
          $sort: {
            count: -1,
          },
        },

        {
          $limit: 10,
        },
      ]);

    return res.status(200).json({
      success: true,

      summary: {
        total,

        successful,

        failed,

        actionCounts,

        userActivity,
      },
    });
  } catch (err) {
    console.error(
      "GET AUDIT SUMMARY ERROR:",
      err
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch audit summary.",
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getAuditLogs,
  getAuditLogById,
  getAuditLogSummary,
};