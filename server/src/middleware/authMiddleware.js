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
        message: "Authentication token missing",
      });
    }

    // ==================================================
    // VERIFY TOKEN
    // ==================================================

    if (!process.env.JWT_SECRET) {
      console.error(
        "JWT_SECRET is missing from environment variables."
      );

      return res.status(500).json({
        success: false,
        message: "Server authentication configuration error.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // ==================================================
    // VALIDATE TOKEN PAYLOAD
    // ==================================================

    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    // ==================================================
    // GET USER
    // ==================================================

    const user = await User.findById(
      decoded.id
    ).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    console.log(
      "=========================================="
    );

    console.log(
      "AUTHENTICATED USER"
    );

    console.log(
      "USER ID:",
      user._id
    );

    console.log(
      "USER EMAIL:",
      user.email
    );

    console.log(
      "USER ROLE:",
      user.role
    );

    console.log(
      "USER ORGANIZATION:",
      user.organization
    );

    console.log(
      "USER ORGANIZATION ID:",
      user.organizationId
    );

    console.log(
      "=========================================="
    );

    // ==================================================
    // ORGANIZATION RESOLUTION
    // ==================================================
    //
    // Priority:
    //
    // 1. Existing organizationId
    // 2. organization field containing ObjectId
    // 3. organization name
    // 4. organizationName field
    //
    // This also repairs legacy users.
    // ==================================================

    let organization = null;

    // ==================================================
    // CASE 1
    // USER ALREADY HAS organizationId
    // ==================================================

    if (user.organizationId) {
      try {
        organization =
          await Organization.findById(
            user.organizationId
          );
      } catch (err) {
        console.log(
          "Existing organizationId is not valid:",
          err.message
        );
      }
    }

    // ==================================================
    // CASE 2
    // organization FIELD MAY CONTAIN OBJECTID
    // ==================================================

    if (
      !organization &&
      user.organization
    ) {
      const organizationValue =
        user.organization;

      if (
        typeof organizationValue === "string" &&
        /^[0-9a-fA-F]{24}$/.test(
          organizationValue
        )
      ) {
        try {
          organization =
            await Organization.findById(
              organizationValue
            );
        } catch (err) {
          console.log(
            "Organization ID lookup failed."
          );
        }
      }
    }

    // ==================================================
    // CASE 3
    // RESOLVE USING ORGANIZATION NAME
    // ==================================================

    if (!organization) {
      let organizationName = "";

      // Normal String field
      if (
        typeof user.organization === "string"
      ) {
        organizationName =
          user.organization.trim();
      }

      // Object containing name
      if (
        !organizationName &&
        user.organization &&
        typeof user.organization === "object"
      ) {
        organizationName =
          user.organization.name?.trim() ||
          "";
      }

      // Fallback field
      if (
        !organizationName &&
        typeof user.organizationName === "string"
      ) {
        organizationName =
          user.organizationName.trim();
      }

      console.log(
        "ORGANIZATION NAME FOR RESOLUTION:",
        organizationName
      );

      if (organizationName) {
        // ----------------------------------------------
        // Exact match first
        // ----------------------------------------------

        organization =
          await Organization.findOne({
            name: organizationName,
          });

        // ----------------------------------------------
        // Case-insensitive fallback
        // ----------------------------------------------

        if (!organization) {
          organization =
            await Organization.findOne({
              name: {
                $regex:
                  `^${organizationName.replace(
                    /[.*+?^${}()|[\]\\]/g,
                    "\\$&"
                  )}$`,
                $options: "i",
              },
            });
        }

        // ----------------------------------------------
        // Trimmed regex fallback
        // ----------------------------------------------

        if (!organization) {
          organization =
            await Organization.findOne({
              name: {
                $regex:
                  organizationName.replace(
                    /[.*+?^${}()|[\]\\]/g,
                    "\\$&"
                  ),
                $options: "i",
              },
            });
        }
      }
    }

    // ==================================================
    // ORGANIZATION FOUND
    // ==================================================

    if (organization) {
      console.log(
        "=========================================="
      );

      console.log(
        "ORGANIZATION RESOLVED SUCCESSFULLY"
      );

      console.log(
        "ORGANIZATION:",
        organization.name
      );

      console.log(
        "ORGANIZATION ID:",
        organization._id
      );

      console.log(
        "=========================================="
      );

      // ==================================================
      // REPAIR USER
      // ==================================================

      const needsRepair =
        !user.organizationId ||
        user.organizationId.toString() !==
          organization._id.toString();

      if (needsRepair) {
        user.organizationId =
          organization._id;

        // Keep organization name synchronized
        if (organization.name) {
          user.organization =
            organization.name;
        }

        await user.save();

        console.log(
          "USER ORGANIZATION LINK REPAIRED:",
          {
            userId: user._id,
            email: user.email,
            organization:
              organization.name,
            organizationId:
              organization._id,
          }
        );
      }
    }

    // ==================================================
    // FINAL ORGANIZATION CHECK
    // ==================================================

    if (!organization) {
      console.error(
        "=========================================="
      );

      console.error(
        "ORGANIZATION RESOLUTION FAILED"
      );

      console.error(
        "USER:",
        user.email
      );

      console.error(
        "USER ORGANIZATION:",
        user.organization
      );

      console.error(
        "USER ORGANIZATION ID:",
        user.organizationId
      );

      console.error(
        "=========================================="
      );

      return res.status(403).json({
        success: false,
        message:
          "User is not associated with an organization.",
      });
    }

    // ==================================================
    // ATTACH ORGANIZATION TO REQUEST
    // ==================================================

    req.user = user;

    // Make organization explicitly available
    // to every protected controller.

    req.organization = organization;

    req.organizationId =
      organization._id;

    // ==================================================
    // CONTINUE
    // ==================================================

    next();
  } catch (err) {
    console.error(
      "=========================================="
    );

    console.error(
      "AUTH MIDDLEWARE ERROR"
    );

    console.error(err);

    console.error(
      "=========================================="
    );

    if (
      err.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication token expired. Please login again.",
      });
    }

    if (
      err.name === "JsonWebTokenError"
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid authentication token.",
      });
    }

    return res.status(401).json({
      success: false,
      message:
        "Authentication failed.",
    });
  }
};

module.exports = protect;