const Organization = require("../models/Organization");

// =====================================================
// GET CURRENT ORGANIZATION
// =====================================================

const getOrganization = async (req, res) => {
  try {
    if (!req.user?.organizationId) {
      return res.status(404).json({
        success: false,
        message: "Organization not associated with this user.",
      });
    }

    const organization = await Organization.findById(
      req.user.organizationId
    );

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found.",
      });
    }

    return res.status(200).json({
      success: true,
      organization,
    });
  } catch (err) {
    console.error("GET ORGANIZATION ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Unable to load organization.",
    });
  }
};

// =====================================================
// GET CURRENT ORGANIZATION BRANDING
// =====================================================

const getBranding = async (req, res) => {
  try {
    if (!req.user?.organizationId) {
      return res.status(404).json({
        success: false,
        message: "Organization not associated with this user.",
      });
    }

    const organization = await Organization.findById(
      req.user.organizationId
    ).select(
      "name tagline website supportEmail logo favicon loginBackground dashboardBanner primaryColor secondaryColor accentColor headingFont bodyFont theme"
    );

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found.",
      });
    }

    return res.status(200).json({
      success: true,

      branding: {
        organizationName: organization.name,
        tagline: organization.tagline,
        website: organization.website,
        supportEmail: organization.supportEmail,

        primaryColor: organization.primaryColor,
        secondaryColor: organization.secondaryColor,
        accentColor: organization.accentColor,

        headingFont: organization.headingFont,
        bodyFont: organization.bodyFont,
        theme: organization.theme,

        logo: organization.logo,
        favicon: organization.favicon,
        loginBackground: organization.loginBackground,
        dashboardBanner: organization.dashboardBanner,
      },
    });
  } catch (err) {
    console.error("GET BRANDING ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Unable to load organization branding.",
    });
  }
};

// =====================================================
// UPDATE CURRENT ORGANIZATION BRANDING
// =====================================================

const updateBranding = async (req, res) => {
  try {
    if (!req.user?.organizationId) {
      return res.status(404).json({
        success: false,
        message: "Organization not associated with this user.",
      });
    }

    const organization = await Organization.findById(
      req.user.organizationId
    );

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found.",
      });
    }

    const {
      organizationName,
      tagline,
      website,
      supportEmail,

      primaryColor,
      secondaryColor,
      accentColor,

      headingFont,
      bodyFont,
      theme,

      logo,
      favicon,
      loginBackground,
      dashboardBanner,
    } = req.body;

    // =================================================
    // UPDATE ONLY PROVIDED VALUES
    // =================================================

    if (
      typeof organizationName === "string" &&
      organizationName.trim()
    ) {
      organization.name =
        organizationName.trim();
    }

    if (typeof tagline === "string") {
      organization.tagline =
        tagline.trim();
    }

    if (typeof website === "string") {
      organization.website =
        website.trim();
    }

    if (typeof supportEmail === "string") {
      organization.supportEmail =
        supportEmail.trim().toLowerCase();
    }

    if (typeof primaryColor === "string") {
      organization.primaryColor =
        primaryColor;
    }

    if (typeof secondaryColor === "string") {
      organization.secondaryColor =
        secondaryColor;
    }

    if (typeof accentColor === "string") {
      organization.accentColor =
        accentColor;
    }

    if (typeof headingFont === "string") {
      organization.headingFont =
        headingFont;
    }

    if (typeof bodyFont === "string") {
      organization.bodyFont =
        bodyFont;
    }

    if (
      ["light", "dark", "system"].includes(theme)
    ) {
      organization.theme = theme;
    }

    // =================================================
    // BRANDING ASSETS
    // =================================================

    if (
      logo !== undefined
    ) {
      organization.logo = logo || null;
    }

    if (
      favicon !== undefined
    ) {
      organization.favicon =
        favicon || null;
    }

    if (
      loginBackground !== undefined
    ) {
      organization.loginBackground =
        loginBackground || null;
    }

    if (
      dashboardBanner !== undefined
    ) {
      organization.dashboardBanner =
        dashboardBanner || null;
    }

    await organization.save();

    // =================================================
    // KEEP LEGACY USER ORGANIZATION NAME IN SYNC
    // =================================================

    await require("../models/User").updateMany(
      {
        organizationId:
          organization._id,
      },
      {
        $set: {
          organization:
            organization.name,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "Organization branding updated successfully.",

      branding: {
        organizationName:
          organization.name,

        tagline:
          organization.tagline,

        website:
          organization.website,

        supportEmail:
          organization.supportEmail,

        primaryColor:
          organization.primaryColor,

        secondaryColor:
          organization.secondaryColor,

        accentColor:
          organization.accentColor,

        headingFont:
          organization.headingFont,

        bodyFont:
          organization.bodyFont,

        theme:
          organization.theme,

        logo:
          organization.logo,

        favicon:
          organization.favicon,

        loginBackground:
          organization.loginBackground,

        dashboardBanner:
          organization.dashboardBanner,
      },
    });
  } catch (err) {
    console.error(
      "UPDATE BRANDING ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update organization branding.",
    });
  }
};

module.exports = {
  getOrganization,
  getBranding,
  updateBranding,
};