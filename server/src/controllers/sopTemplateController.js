const SOPTemplate = require("../models/SOPTemplate");

// ======================================================
// VALID SECTION KEYS
// ======================================================

const VALID_SECTION_KEYS = [
  "rolePurpose",
  "responsibilities",
  "processes",
  "tools",
  "policies",
  "kpis",
  "onboardingRequirements",
  "knowledgeRequirements",
];

// ======================================================
// NORMALIZE SECTIONS
// ======================================================

const normalizeSections = (sections) => {
  if (!Array.isArray(sections)) {
    return [];
  }

  return sections
    .map((section, index) => {
      if (!section) {
        return null;
      }

      const key = String(
        section.key || ""
      ).trim();

      const title = String(
        section.title || ""
      ).trim();

      if (!key || !title) {
        return null;
      }

      if (!VALID_SECTION_KEYS.includes(key)) {
        return null;
      }

      return {
        key,

        title,

        description: String(
          section.description || ""
        ).trim(),

        enabled:
          section.enabled !== false,

        required:
          section.required === true,

        order:
          Number(section.order) > 0
            ? Number(section.order)
            : index + 1,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.order - b.order)
    .map((section, index) => ({
      ...section,
      order: index + 1,
    }));
};

// ======================================================
// CREATE SOP TEMPLATE
// ======================================================

const createSOPTemplate = async (
  req,
  res
) => {
  try {
    const {
      name,
      description,
      department,
      role,
      sections,
    } = req.body;

    // ----------------------------------------------
    // Validation
    // ----------------------------------------------

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Template name is required.",
      });
    }

    if (!department?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Department is required.",
      });
    }

    if (!role?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Role is required.",
      });
    }

    const normalizedSections =
      normalizeSections(sections);

    if (normalizedSections.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "At least one valid template section is required.",
      });
    }

    // ----------------------------------------------
    // Create
    // ----------------------------------------------

    const template =
      await SOPTemplate.create({
        name: name.trim(),

        description:
          String(
            description || ""
          ).trim(),

        department:
          department.trim(),

        role:
          role.trim(),

        sections:
          normalizedSections,

        createdBy:
          req.user._id,

        active: true,
      });

    // ----------------------------------------------
    // Response
    // ----------------------------------------------

    return res.status(201).json({
      success: true,

      message:
        "SOP template created successfully.",

      template,
    });
  } catch (err) {
    console.error(
      "CREATE SOP TEMPLATE ERROR:",
      err
    );

    return res.status(500).json({
      success: false,

      message:
        err.message ||
        "Unable to create SOP template.",
    });
  }
};

// ======================================================
// GET ALL SOP TEMPLATES
// ======================================================

const getSOPTemplates = async (
  req,
  res
) => {
  try {
    const {
      department,
      role,
      active,
    } = req.query;

    const filter = {};

    // ----------------------------------------------
    // Department filter
    // ----------------------------------------------

    if (department?.trim()) {
      filter.department =
        department.trim();
    }

    // ----------------------------------------------
    // Role filter
    // ----------------------------------------------

    if (role?.trim()) {
      filter.role =
        role.trim();
    }

    // ----------------------------------------------
    // Active filter
    // ----------------------------------------------

    if (
      active === "true" ||
      active === "false"
    ) {
      filter.active =
        active === "true";
    }

    const templates =
      await SOPTemplate.find(filter)
        .populate(
          "createdBy",
          "name email role"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,

      count:
        templates.length,

      templates,
    });
  } catch (err) {
    console.error(
      "GET SOP TEMPLATES ERROR:",
      err
    );

    return res.status(500).json({
      success: false,

      message:
        err.message ||
        "Unable to fetch SOP templates.",
    });
  }
};

// ======================================================
// GET SINGLE SOP TEMPLATE
// ======================================================

const getSOPTemplateById = async (
  req,
  res
) => {
  try {
    const template =
      await SOPTemplate.findById(
        req.params.id
      ).populate(
        "createdBy",
        "name email role"
      );

    if (!template) {
      return res.status(404).json({
        success: false,

        message:
          "SOP template not found.",
      });
    }

    return res.status(200).json({
      success: true,

      template,
    });
  } catch (err) {
    console.error(
      "GET SOP TEMPLATE BY ID ERROR:",
      err
    );

    return res.status(500).json({
      success: false,

      message:
        err.message ||
        "Unable to fetch SOP template.",
    });
  }
};

// ======================================================
// UPDATE SOP TEMPLATE
// ======================================================

const updateSOPTemplate = async (
  req,
  res
) => {
  try {
    const template =
      await SOPTemplate.findById(
        req.params.id
      );

    if (!template) {
      return res.status(404).json({
        success: false,

        message:
          "SOP template not found.",
      });
    }

    // ----------------------------------------------
    // Simple fields
    // ----------------------------------------------

    const simpleFields = [
      "name",
      "description",
      "department",
      "role",
    ];

    simpleFields.forEach(
      (field) => {
        if (
          Object.prototype.hasOwnProperty.call(
            req.body,
            field
          )
        ) {
          template[field] =
            String(
              req.body[field] || ""
            ).trim();
        }
      }
    );

    // ----------------------------------------------
    // Validate required fields
    // ----------------------------------------------

    if (!template.name?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Template name is required.",
      });
    }

    if (!template.department?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Department is required.",
      });
    }

    if (!template.role?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Role is required.",
      });
    }

    // ----------------------------------------------
    // Sections
    // ----------------------------------------------

    if (
      Object.prototype.hasOwnProperty.call(
        req.body,
        "sections"
      )
    ) {
      const normalizedSections =
        normalizeSections(
          req.body.sections
        );

      if (
        normalizedSections.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "At least one valid template section is required.",
        });
      }

      template.sections =
        normalizedSections;
    }

    // ----------------------------------------------
    // Active
    // ----------------------------------------------

    if (
      Object.prototype.hasOwnProperty.call(
        req.body,
        "active"
      )
    ) {
      template.active =
        req.body.active === true;
    }

    await template.save();

    return res.status(200).json({
      success: true,

      message:
        "SOP template updated successfully.",

      template,
    });
  } catch (err) {
    console.error(
      "UPDATE SOP TEMPLATE ERROR:",
      err
    );

    return res.status(500).json({
      success: false,

      message:
        err.message ||
        "Unable to update SOP template.",
    });
  }
};

// ======================================================
// TOGGLE SOP TEMPLATE
// ======================================================

const toggleSOPTemplate = async (
  req,
  res
) => {
  try {
    const template =
      await SOPTemplate.findById(
        req.params.id
      );

    if (!template) {
      return res.status(404).json({
        success: false,

        message:
          "SOP template not found.",
      });
    }

    template.active =
      !template.active;

    await template.save();

    return res.status(200).json({
      success: true,

      message: template.active
        ? "SOP template activated successfully."
        : "SOP template deactivated successfully.",

      template,
    });
  } catch (err) {
    console.error(
      "TOGGLE SOP TEMPLATE ERROR:",
      err
    );

    return res.status(500).json({
      success: false,

      message:
        err.message ||
        "Unable to update SOP template status.",
    });
  }
};

// ======================================================
// DUPLICATE SOP TEMPLATE
// ======================================================

const duplicateSOPTemplate = async (
  req,
  res
) => {
  try {
    const existingTemplate =
      await SOPTemplate.findById(
        req.params.id
      );

    if (!existingTemplate) {
      return res.status(404).json({
        success: false,

        message:
          "SOP template not found.",
      });
    }

    const data =
      existingTemplate.toObject();

    delete data._id;
    delete data.createdAt;
    delete data.updatedAt;

    data.name =
      `${data.name} Copy`;

    data.createdBy =
      req.user._id;

    data.active = true;

    data.sections =
      normalizeSections(
        data.sections
      );

    const duplicated =
      await SOPTemplate.create(
        data
      );

    return res.status(201).json({
      success: true,

      message:
        "SOP template duplicated successfully.",

      template:
        duplicated,
    });
  } catch (err) {
    console.error(
      "DUPLICATE SOP TEMPLATE ERROR:",
      err
    );

    return res.status(500).json({
      success: false,

      message:
        err.message ||
        "Unable to duplicate SOP template.",
    });
  }
};

// ======================================================
// DELETE SOP TEMPLATE
// ======================================================

const deleteSOPTemplate = async (
  req,
  res
) => {
  try {
    const template =
      await SOPTemplate.findById(
        req.params.id
      );

    if (!template) {
      return res.status(404).json({
        success: false,

        message:
          "SOP template not found.",
      });
    }

    await SOPTemplate.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      success: true,

      message:
        "SOP template deleted successfully.",
    });
  } catch (err) {
    console.error(
      "DELETE SOP TEMPLATE ERROR:",
      err
    );

    return res.status(500).json({
      success: false,

      message:
        err.message ||
        "Unable to delete SOP template.",
    });
  }
};

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  createSOPTemplate,
  getSOPTemplates,
  getSOPTemplateById,
  updateSOPTemplate,
  toggleSOPTemplate,
  duplicateSOPTemplate,
  deleteSOPTemplate,
};