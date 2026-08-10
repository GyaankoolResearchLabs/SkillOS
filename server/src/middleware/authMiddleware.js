const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Organization = require("../models/Organization");

// ======================================================
// AUTHENTICATION + ORGANIZATION RESOLUTION
// ======================================================

const protect = async (req, res, next) => {
  try {
    let token;

    // ==================================================
    // GET TOKEN
    // ==================================================

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token =
        req.headers.authorization.split(" ")[1];
    }

    // ==================================================
    // TOKEN MISSING
    // ==================================================

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication token missing",
      });
    }

    // ==================================================
    // VERIFY TOKEN
    // ==================================================

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // ==================================================
    // GET USER
    // ==================================================

    const user =
      await User.findById(
        decoded.id
      ).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "User not found",
      });
    }

    // ==================================================
    // ORGANIZATION RESOLUTION
    // ==================================================
    //
    // New users:
    //   organizationId already exists.
    //
    // Legacy users:
    //   organizationId may be null,
    //   but organization may contain
    //   the organization name.
    //
    // We repair those users here.
    // ==================================================

    if (!user.organizationId) {
      const organizationName =
        user.organization?.trim();

      if (organizationName) {
        const organization =
          await Organization.findOne({
            name: organizationName,
          });

        if (organization) {
          user.organizationId =
            organization._id;

          await user.save();

          console.log(
            "LEGACY USER ORGANIZATION LINKED:",
            {
              userId: user._id,
              user: user.email,
              organizationId:
                organization._id,
              organization:
                organization.name,
            }
          );
        }
      }
    }

    // ==================================================
    // ORGANIZATION REQUIRED
    // ==================================================

    if (!user.organizationId) {
      return res.status(403).json({
        success: false,
        message:
          "User is not associated with an organization.",
      });
    }

    // ==================================================
    // ATTACH USER TO REQUEST
    // ==================================================

    req.user = user;

    next();
  } catch (err) {
    console.error(
      "Auth Middleware:",
      err.message
    );

    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired token",
    });
  }
};

module.exports = protect;