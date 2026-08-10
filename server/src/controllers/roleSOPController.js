const RoleSOP = require("../models/RoleSOP");
const Course = require("../models/Course");
const generateModule = require("../services/ai/generateModule");

// ======================================================
// HELPERS
// ======================================================

// ======================================================
// Normalize Tool
// ======================================================

const normalizeTool = (tool) => {
  if (typeof tool === "string") {
    const name = tool.trim();

    if (!name) {
      return null;
    }

    return {
      name,
      purpose: "",
      proficiency: "Not Specified",
      accessRequired: false,
    };
  }

  if (tool && typeof tool === "object") {
    const name = String(tool.name || "").trim();

    if (!name) {
      return null;
    }

    return {
      name,
      purpose: String(
        tool.purpose ||
          tool.description ||
          ""
      ).trim(),

      proficiency:
        tool.proficiency || "Not Specified",

      accessRequired:
        Boolean(tool.accessRequired),
    };
  }

  return null;
};

// ======================================================
// Normalize Tools
// ======================================================

const normalizeTools = (tools) => {
  if (!Array.isArray(tools)) {
    return [];
  }

  return tools
    .map(normalizeTool)
    .filter(Boolean);
};

// ======================================================
// Normalize Process Tools
// ======================================================

const normalizeProcessTools = (tools) => {
  if (!Array.isArray(tools)) {
    return [];
  }

  return tools
    .map((tool) => {
      if (typeof tool === "string") {
        return tool.trim();
      }

      if (
        tool &&
        typeof tool === "object"
      ) {
        return String(
          tool.name || ""
        ).trim();
      }

      return "";
    })
    .filter(Boolean);
};

// ======================================================
// Normalize Process Steps
// ======================================================

const normalizeProcessSteps = (steps) => {
  if (!Array.isArray(steps)) {
    return [];
  }

  return steps
    .map((step, index) => {
      if (!step) {
        return null;
      }

      const instruction = String(
        step.instruction ||
          step.description ||
          step.name ||
          ""
      ).trim();

      // Ignore completely empty steps
      if (!instruction) {
        return null;
      }

      return {
        // IMPORTANT:
        // Always provide stepNumber because
        // RoleSOP schema requires it.
        stepNumber:
          Number(step.stepNumber) > 0
            ? Number(step.stepNumber)
            : index + 1,

        instruction,

        expectedOutcome:
          String(
            step.expectedOutcome || ""
          ).trim(),

        responsiblePerson:
          String(
            step.responsiblePerson || ""
          ).trim(),

        approver:
          String(
            step.approver || ""
          ).trim(),

        tools:
          normalizeProcessTools(
            step.tools
          ),
      };
    })
    .filter(Boolean);
};

// ======================================================
// Normalize Processes
// ======================================================

const normalizeProcesses = (
  processes
) => {
  if (!Array.isArray(processes)) {
    return [];
  }

  return processes
    .map((process) => {
      if (!process) {
        return null;
      }

      const name = String(
        process.name || ""
      ).trim();

      if (!name) {
        return null;
      }

      return {
        name,

        purpose:
          String(
            process.purpose || ""
          ).trim(),

        frequency:
          String(
            process.frequency || ""
          ).trim(),

        trigger:
          String(
            process.trigger || ""
          ).trim(),

        steps:
          normalizeProcessSteps(
            process.steps
          ),

        expectedOutcome:
          String(
            process.expectedOutcome ||
              ""
          ).trim(),

        responsiblePerson:
          String(
            process.responsiblePerson ||
              ""
          ).trim(),

        approver:
          String(
            process.approver || ""
          ).trim(),

        tools:
          normalizeProcessTools(
            process.tools
          ),
      };
    })
    .filter(Boolean);
};

// ======================================================
// Normalize Responsibilities
// ======================================================

const normalizeResponsibilities = (
  responsibilities
) => {
  if (!Array.isArray(responsibilities)) {
    return [];
  }

  return responsibilities
    .map((item) => {
      if (!item) {
        return null;
      }

      const title = String(
        item.title || ""
      ).trim();

      if (!title) {
        return null;
      }

      return {
        title,

        description:
          String(
            item.description || ""
          ).trim(),

        priority:
          item.priority || "Medium",
      };
    })
    .filter(Boolean);
};

// ======================================================
// Normalize Policies
// ======================================================

const normalizePolicies = (
  policies
) => {
  if (!Array.isArray(policies)) {
    return [];
  }

  return policies
    .map((policy) => {
      if (!policy) {
        return null;
      }

      const name = String(
        policy.name || ""
      ).trim();

      if (!name) {
        return null;
      }

      return {
        name,

        description:
          String(
            policy.description || ""
          ).trim(),

        rules:
          Array.isArray(policy.rules)
            ? policy.rules.filter(Boolean)
            : [],

        exceptions:
          Array.isArray(
            policy.exceptions
          )
            ? policy.exceptions.filter(Boolean)
            : [],

        escalation:
          String(
            policy.escalation || ""
          ).trim(),
      };
    })
    .filter(Boolean);
};

// ======================================================
// Normalize KPIs
// ======================================================

const normalizeKPIs = (
  kpis
) => {
  if (!Array.isArray(kpis)) {
    return [];
  }

  return kpis
    .map((kpi) => {
      if (!kpi) {
        return null;
      }

      const name = String(
        kpi.name || ""
      ).trim();

      if (!name) {
        return null;
      }

      return {
        name,

        target:
          String(
            kpi.target || ""
          ).trim(),

        measurement:
          String(
            kpi.measurement || ""
          ).trim(),

        frequency:
          String(
            kpi.frequency || ""
          ).trim(),
      };
    })
    .filter(Boolean);
};

// ======================================================
// CREATE ROLE SOP
// ======================================================

const createRoleSOP = async (
  req,
  res
) => {
  try {
    const {
      organization,
      department,
      team,
      role,
      seniority,
      reportingManager,
      location,
      employmentType,
      rolePurpose,
      responsibilities,
      processes,
      tools,
      policies,
      kpis,
      onboardingRequirements,
      knowledgeRequirements,
    } = req.body;

    // ----------------------------------------------
    // Validation
    // ----------------------------------------------

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

    // ----------------------------------------------
    // Create Role SOP
    // ----------------------------------------------

    const roleSOP =
      await RoleSOP.create({
        organization:
          String(
            organization || ""
          ).trim(),

        department:
          department.trim(),

        team:
          String(
            team || ""
          ).trim(),

        role:
          role.trim(),

        seniority:
          String(
            seniority || ""
          ).trim(),

        reportingManager:
          String(
            reportingManager || ""
          ).trim(),

        location:
          String(
            location || ""
          ).trim(),

        employmentType:
          String(
            employmentType || ""
          ).trim(),

        rolePurpose:
          String(
            rolePurpose || ""
          ).trim(),

        responsibilities:
          normalizeResponsibilities(
            responsibilities
          ),

        processes:
          normalizeProcesses(
            processes
          ),

        tools:
          normalizeTools(tools),

        policies:
          normalizePolicies(policies),

        kpis:
          normalizeKPIs(kpis),

        onboardingRequirements:
          Array.isArray(
            onboardingRequirements
          )
            ? onboardingRequirements
                .map((item) =>
                  String(item).trim()
                )
                .filter(Boolean)
            : [],

        knowledgeRequirements:
          Array.isArray(
            knowledgeRequirements
          )
            ? knowledgeRequirements
                .map((item) =>
                  String(item).trim()
                )
                .filter(Boolean)
            : [],

        status: "Draft",

        version: "1.0",

        createdBy:
          req.user._id,
      });

    return res.status(201).json({
      success: true,

      message:
        "Role SOP created successfully.",

      roleSOP,
    });
  } catch (err) {
    console.error(
      "CREATE ROLE SOP ERROR:",
      err
    );

    return res.status(500).json({
      success: false,

      message:
        err.message ||
        "Unable to create Role SOP.",
    });
  }
};

// ======================================================
// GET ALL ROLE SOPS
// ======================================================

const getRoleSOPs = async (
  req,
  res
) => {
  try {
    const {
      status,
      department,
      role,
    } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (department) {
      filter.department =
        department;
    }

    if (role) {
      filter.role = role;
    }

    const roleSOPs =
      await RoleSOP.find(filter)
        .populate(
          "createdBy",
          "name email role"
        )
        .populate(
          "approvedBy",
          "name email role"
        )
        .populate(
          "generatedCourseIds",
          "courseTitle status category modules"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,

      count:
        roleSOPs.length,

      roleSOPs,
    });
  } catch (err) {
    console.error(
      "GET ROLE SOPS ERROR:",
      err
    );

    return res.status(500).json({
      success: false,

      message:
        err.message ||
        "Unable to fetch Role SOPs.",
    });
  }
};

// ======================================================
// GET SINGLE ROLE SOP
// ======================================================

const getRoleSOPById = async (
  req,
  res
) => {
  try {
    const roleSOP =
      await RoleSOP.findById(
        req.params.id
      )
        .populate(
          "createdBy",
          "name email role"
        )
        .populate(
          "approvedBy",
          "name email role"
        )
        .populate(
          "generatedCourseIds",
          "courseTitle status category modules"
        );

    if (!roleSOP) {
      return res.status(404).json({
        success: false,

        message:
          "Role SOP not found.",
      });
    }

    return res.status(200).json({
      success: true,

      roleSOP,
    });
  } catch (err) {
    console.error(
      "GET ROLE SOP BY ID ERROR:",
      err
    );

    return res.status(500).json({
      success: false,

      message:
        err.message ||
        "Unable to fetch Role SOP.",
    });
  }
};

// ======================================================
// UPDATE ROLE SOP
// ======================================================

const updateRoleSOP = async (
  req,
  res
) => {
  try {
    const roleSOP =
      await RoleSOP.findById(
        req.params.id
      );

    if (!roleSOP) {
      return res.status(404).json({
        success: false,

        message:
          "Role SOP not found.",
      });
    }

    // Published SOP cannot be directly edited
    if (
      roleSOP.status ===
      "Published"
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Published SOPs cannot be edited directly. Create a new version instead.",
      });
    }

    // ----------------------------------------------
    // Simple Fields
    // ----------------------------------------------

    const simpleFields = [
      "organization",
      "department",
      "team",
      "role",
      "seniority",
      "reportingManager",
      "location",
      "employmentType",
      "rolePurpose",
    ];

    simpleFields.forEach(
      (field) => {
        if (
          Object.prototype.hasOwnProperty.call(
            req.body,
            field
          )
        ) {
          roleSOP[field] =
            req.body[field];
        }
      }
    );

    // ----------------------------------------------
    // Responsibilities
    // ----------------------------------------------

    if (
      Object.prototype.hasOwnProperty.call(
        req.body,
        "responsibilities"
      )
    ) {
      roleSOP.responsibilities =
        normalizeResponsibilities(
          req.body
            .responsibilities
        );
    }

    // ----------------------------------------------
    // Processes
    // ----------------------------------------------

    if (
      Object.prototype.hasOwnProperty.call(
        req.body,
        "processes"
      )
    ) {
      roleSOP.processes =
        normalizeProcesses(
          req.body.processes
        );
    }

    // ----------------------------------------------
    // Tools
    // ----------------------------------------------

    if (
      Object.prototype.hasOwnProperty.call(
        req.body,
        "tools"
      )
    ) {
      roleSOP.tools =
        normalizeTools(
          req.body.tools
        );
    }

    // ----------------------------------------------
    // Policies
    // ----------------------------------------------

    if (
      Object.prototype.hasOwnProperty.call(
        req.body,
        "policies"
      )
    ) {
      roleSOP.policies =
        normalizePolicies(
          req.body.policies
        );
    }

    // ----------------------------------------------
    // KPIs
    // ----------------------------------------------

    if (
      Object.prototype.hasOwnProperty.call(
        req.body,
        "kpis"
      )
    ) {
      roleSOP.kpis =
        normalizeKPIs(
          req.body.kpis
        );
    }

    // ----------------------------------------------
    // Onboarding Requirements
    // ----------------------------------------------

    if (
      Object.prototype.hasOwnProperty.call(
        req.body,
        "onboardingRequirements"
      )
    ) {
      roleSOP.onboardingRequirements =
        Array.isArray(
          req.body
            .onboardingRequirements
        )
          ? req.body
              .onboardingRequirements
              .map((item) =>
                String(item).trim()
              )
              .filter(Boolean)
          : [];
    }

    // ----------------------------------------------
    // Knowledge Requirements
    // ----------------------------------------------

    if (
      Object.prototype.hasOwnProperty.call(
        req.body,
        "knowledgeRequirements"
      )
    ) {
      roleSOP.knowledgeRequirements =
        Array.isArray(
          req.body
            .knowledgeRequirements
        )
          ? req.body
              .knowledgeRequirements
              .map((item) =>
                String(item).trim()
              )
              .filter(Boolean)
          : [];
    }

    // ----------------------------------------------
    // Validate Required Fields
    // ----------------------------------------------

    if (
      !roleSOP.department?.trim()
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Department is required.",
      });
    }

    if (
      !roleSOP.role?.trim()
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Role is required.",
      });
    }

    await roleSOP.save();

    return res.status(200).json({
      success: true,

      message:
        "Role SOP updated successfully.",

      roleSOP,
    });
  } catch (err) {
    console.error(
      "UPDATE ROLE SOP ERROR:",
      err
    );

    return res.status(500).json({
      success: false,

      message:
        err.message ||
        "Unable to update Role SOP.",
    });
  }
};

// ======================================================
// SUBMIT FOR REVIEW
// ======================================================

const submitRoleSOPForReview =
  async (req, res) => {
    try {
      const roleSOP =
        await RoleSOP.findById(
          req.params.id
        );

      if (!roleSOP) {
        return res.status(404).json({
          success: false,

          message:
            "Role SOP not found.",
        });
      }

      if (
        roleSOP.status ===
        "Published"
      ) {
        return res.status(400).json({
          success: false,

          message:
            "This Role SOP is already published.",
        });
      }

      if (
        roleSOP.status ===
        "Archived"
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Archived Role SOPs cannot be submitted for review.",
        });
      }

      if (
        !roleSOP.department ||
        !roleSOP.role
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Department and role are required before review.",
        });
      }

      roleSOP.status =
        "Under Review";

      await roleSOP.save();

      return res.status(200).json({
        success: true,

        message:
          "Role SOP submitted for review.",

        roleSOP,
      });
    } catch (err) {
      console.error(
        "SUBMIT ROLE SOP REVIEW ERROR:",
        err
      );

      return res.status(500).json({
        success: false,

        message:
          err.message ||
          "Unable to submit Role SOP for review.",
      });
    }
  };

// ======================================================
// PUBLISH ROLE SOP
// ======================================================

const publishRoleSOP = async (
  req,
  res
) => {
  try {
    const roleSOP =
      await RoleSOP.findById(
        req.params.id
      );

    if (!roleSOP) {
      return res.status(404).json({
        success: false,

        message:
          "Role SOP not found.",
      });
    }

    if (
      roleSOP.status !==
      "Under Review"
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Only Role SOPs under review can be published.",
      });
    }

    roleSOP.status =
      "Published";

    roleSOP.approvedBy =
      req.user._id;

    roleSOP.publishedAt =
      new Date();

    await roleSOP.save();

    return res.status(200).json({
      success: true,

      message:
        "Role SOP published successfully.",

      roleSOP,
    });
  } catch (err) {
    console.error(
      "PUBLISH ROLE SOP ERROR:",
      err
    );

    return res.status(500).json({
      success: false,

      message:
        err.message ||
        "Unable to publish Role SOP.",
    });
  }
};

// ======================================================
// GENERATE TRAINING FROM ROLE SOP
// ======================================================

const generateTrainingFromRoleSOP =
  async (req, res) => {
    try {
      // ==================================================
      // 1. FIND ROLE SOP
      // ==================================================

      const roleSOP =
        await RoleSOP.findById(
          req.params.id
        );

      if (!roleSOP) {
        return res.status(404).json({
          success: false,

          message:
            "Role SOP not found.",
        });
      }

      console.log(
        "\n=============================================="
      );

      console.log(
        `GENERATING TRAINING FOR: ${roleSOP.role}`
      );

      console.log(
        `DEPARTMENT: ${roleSOP.department}`
      );

      console.log(
        "==============================================\n"
      );

      // ==================================================
      // 2. PREVENT DUPLICATE GENERATION
      // ==================================================

      if (
        Array.isArray(
          roleSOP.generatedCourseIds
        ) &&
        roleSOP
          .generatedCourseIds
          .length > 0
      ) {
        const existingCourse =
          await Course.findById(
            roleSOP
              .generatedCourseIds[0]
          );

        if (existingCourse) {
          return res.status(200).json({
            success: true,

            alreadyGenerated: true,

            message:
              "Training has already been generated for this Role SOP.",

            course:
              existingCourse,

            roleSOP,
          });
        }
      }

      // ==================================================
      // 3. BUILD MODULE TITLES
      // ==================================================

      const moduleTitles = [];

      // ----------------------------------------------
      // Role Introduction
      // ----------------------------------------------

      if (
        roleSOP.rolePurpose
      ) {
        moduleTitles.push(
          `Introduction to ${roleSOP.role}`
        );
      }

      // ----------------------------------------------
      // Responsibilities
      // ----------------------------------------------

      if (
        Array.isArray(
          roleSOP.responsibilities
        )
      ) {
        roleSOP.responsibilities.forEach(
          (item) => {
            if (item?.title) {
              moduleTitles.push(
                item.title
              );
            }
          }
        );
      }

      // ----------------------------------------------
      // Processes
      // ----------------------------------------------

      if (
        Array.isArray(
          roleSOP.processes
        )
      ) {
        roleSOP.processes.forEach(
          (process) => {
            if (process?.name) {
              moduleTitles.push(
                process.name
              );
            }
          }
        );
      }

      // ----------------------------------------------
      // Knowledge
      // ----------------------------------------------

      if (
        Array.isArray(
          roleSOP.knowledgeRequirements
        )
      ) {
        roleSOP.knowledgeRequirements.forEach(
          (item) => {
            if (item) {
              moduleTitles.push(
                `Knowledge: ${item}`
              );
            }
          }
        );
      }

      // ----------------------------------------------
      // Tools
      // ----------------------------------------------

      if (
        Array.isArray(
          roleSOP.tools
        )
      ) {
        roleSOP.tools.forEach(
          (tool) => {
            if (tool?.name) {
              moduleTitles.push(
                `Using ${tool.name}`
              );
            }
          }
        );
      }

      // ==================================================
      // 4. REMOVE DUPLICATES
      // ==================================================

      const uniqueTitles = [
        ...new Set(
          moduleTitles
            .map((title) =>
              String(title).trim()
            )
            .filter(Boolean)
        ),
      ];

      // Always create at least one module
      if (
        uniqueTitles.length === 0
      ) {
        uniqueTitles.push(
          `Introduction to ${roleSOP.role}`
        );
      }

      // Maximum 12 modules
      const finalTitles =
        uniqueTitles.slice(
          0,
          12
        );

      console.log(
        `TOTAL MODULES: ${finalTitles.length}`
      );

      // ==================================================
      // 5. CREATE BASE COURSE
      // ==================================================

      const course =
        new Course({
          courseTitle:
            `${roleSOP.role} Training`,

          description:
            roleSOP.rolePurpose ||
            `Role-specific training for ${roleSOP.role} in ${roleSOP.department}.`,

          audience:
            "Employee",

          category:
            `${roleSOP.department} Training`,

          difficulty:
            "Beginner",

          estimatedDuration:
            `${finalTitles.length * 30} minutes`,

          prerequisites: [],

          learningObjectives: [
            `Understand the responsibilities of a ${roleSOP.role}.`,

            `Follow the processes and procedures defined for the role.`,

            `Use the required tools and technologies.`,

            `Understand the knowledge requirements for the role.`,
          ],

          learningOutcomes: [
            `Perform the responsibilities of the ${roleSOP.role} role.`,

            `Follow role-specific processes correctly.`,

            `Apply required tools and procedures.`,
          ],

          modules:
            finalTitles.map(
              (title) => ({
                title,

                summary:
                  `Training module for ${title}.`,

                generated:
                  false,

                generatedAt:
                  null,

                duration:
                  "30 mins",

                content: "",

                learningObjectives:
                  [],

                keyPoints: [],

                example: "",

                tips: [],

                pdfUrl: "",

                videoUrl: "",

                imageUrl: "",

                quiz: [],
              })
            ),

          assignment:
            `Complete all training modules and assessments for the ${roleSOP.role} role.`,

          finalAssessment: [],

          createdBy:
            roleSOP.createdBy,
        });

      // Save base course
      await course.save();

      console.log(
        `COURSE CREATED: ${course._id}`
      );

      // ==================================================
      // 6. GENERATE MODULES IN PARALLEL
      // ==================================================

      console.log(
        "\nSTARTING PARALLEL AI GENERATION..."
      );

      const moduleResults =
        await Promise.allSettled(
          course.modules.map(
            async (
              module,
              index
            ) => {
              console.log(
                `Generating module ${index + 1}/${course.modules.length}: ${module.title}`
              );

              const generated =
                await generateModule({
                  courseTitle:
                    course.courseTitle,

                  courseDescription:
                    course.description,

                  audience:
                    course.audience,

                  difficulty:
                    course.difficulty,

                  moduleTitle:
                    module.title,

                  moduleSummary:
                    module.summary,
                });

              return {
                index,
                generated,
              };
            }
          )
        );

      // ==================================================
      // 7. APPLY GENERATED DATA
      // ==================================================

      let successfulModules =
        0;

      let failedModules =
        0;

      moduleResults.forEach(
        (result) => {
          if (
            result.status !==
            "fulfilled"
          ) {
            failedModules++;

            console.error(
              "MODULE GENERATION FAILED:",
              result.reason
            );

            return;
          }

          const {
            index,
            generated,
          } = result.value;

          const module =
            course.modules[index];

          if (
            !module ||
            !generated
          ) {
            failedModules++;
            return;
          }

          module.content =
            generated.content ||
            "";

          module.learningObjectives =
            Array.isArray(
              generated.learningObjectives
            )
              ? generated.learningObjectives
              : [];

          module.keyPoints =
            Array.isArray(
              generated.keyPoints
            )
              ? generated.keyPoints
              : [];

          module.example =
            generated.example ||
            "";

          module.tips =
            Array.isArray(
              generated.tips
            )
              ? generated.tips
              : [];

          module.quiz =
            Array.isArray(
              generated.quiz
            )
              ? generated.quiz
              : [];

          module.generated =
            true;

          module.generatedAt =
            new Date();

          successfulModules++;

          console.log(
            `MODULE GENERATED: ${module.title}`
          );
        }
      );

      console.log(
        `SUCCESSFUL MODULES: ${successfulModules}`
      );

      console.log(
        `FAILED MODULES: ${failedModules}`
      );

      // ==================================================
      // 8. CREATE FINAL ASSESSMENT
      // ==================================================

      const finalQuestions =
        course.modules
          .filter(
            (module) =>
              module.generated
          )
          .flatMap(
            (module) =>
              Array.isArray(
                module.quiz
              )
                ? module.quiz
                : []
          )
          .slice(0, 10);

      course.finalAssessment =
        finalQuestions.map(
          (question) => ({
            question:
              question.question ||
              "",

            options:
              Array.isArray(
                question.options
              )
                ? question.options
                : [],

            answer:
              question.answer ||
              "",

            explanation:
              question.explanation ||
              "",

            difficulty:
              question.difficulty ||
              "Easy",

            marks:
              question.marks ||
              1,
          })
        );

      // ==================================================
      // 9. SAVE COURSE ONCE
      // ==================================================

      await course.save();

      console.log(
        `COURSE CONTENT SAVED: ${course._id}`
      );

      // ==================================================
      // 10. LINK COURSE TO ROLE SOP
      // ==================================================

      if (
        !Array.isArray(
          roleSOP.generatedCourseIds
        )
      ) {
        roleSOP.generatedCourseIds =
          [];
      }

      roleSOP.generatedCourseIds.push(
        course._id
      );

      await roleSOP.save();

      console.log(
        "ROLE SOP LINKED TO GENERATED COURSE"
      );

      // ==================================================
      // 11. POPULATE RESULT
      // ==================================================

      const populatedRoleSOP =
        await RoleSOP.findById(
          roleSOP._id
        ).populate(
          "generatedCourseIds",
          "courseTitle status category modules"
        );

      // ==================================================
      // 12. SUCCESS RESPONSE
      // ==================================================

      return res.status(201).json({
        success: true,

        message:
          "Training generated successfully from Role SOP.",

        course,

        roleSOP:
          populatedRoleSOP,

        generation: {
          totalModules:
            course.modules.length,

          successfulModules,

          failedModules,

          totalQuizQuestions:
            course.totalQuizQuestions,

          finalAssessmentQuestions:
            course
              .finalAssessment
              .length,
        },
      });
    } catch (err) {
      console.error(
        "\n=============================================="
      );

      console.error(
        "GENERATE ROLE SOP TRAINING ERROR:"
      );

      console.error(err);

      console.error(
        "==============================================\n"
      );

      return res.status(500).json({
        success: false,

        message:
          err.message ||
          "Failed to generate training from Role SOP.",

        error:
          process.env.NODE_ENV ===
          "development"
            ? err.message
            : undefined,
      });
    }
  };

// ======================================================
// ARCHIVE ROLE SOP
// ======================================================

const archiveRoleSOP = async (
  req,
  res
) => {
  try {
    const roleSOP =
      await RoleSOP.findById(
        req.params.id
      );

    if (!roleSOP) {
      return res.status(404).json({
        success: false,

        message:
          "Role SOP not found.",
      });
    }

    roleSOP.status =
      "Archived";

    await roleSOP.save();

    return res.status(200).json({
      success: true,

      message:
        "Role SOP archived successfully.",

      roleSOP,
    });
  } catch (err) {
    console.error(
      "ARCHIVE ROLE SOP ERROR:",
      err
    );

    return res.status(500).json({
      success: false,

      message:
        err.message ||
        "Unable to archive Role SOP.",
    });
  }
};

// ======================================================
// DELETE ROLE SOP
// ======================================================

const deleteRoleSOP = async (
  req,
  res
) => {
  try {
    const roleSOP =
      await RoleSOP.findById(
        req.params.id
      );

    if (!roleSOP) {
      return res.status(404).json({
        success: false,

        message:
          "Role SOP not found.",
      });
    }

    // Published SOPs must be archived
    if (
      roleSOP.status ===
      "Published"
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Published Role SOPs cannot be deleted. Archive them instead.",
      });
    }

    await RoleSOP.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      success: true,

      message:
        "Role SOP deleted successfully.",
    });
  } catch (err) {
    console.error(
      "DELETE ROLE SOP ERROR:",
      err
    );

    return res.status(500).json({
      success: false,

      message:
        err.message ||
        "Unable to delete Role SOP.",
    });
  }
};

// ======================================================
// DUPLICATE ROLE SOP
// ======================================================

const duplicateRoleSOP = async (
  req,
  res
) => {
  try {
    const existingSOP =
      await RoleSOP.findById(
        req.params.id
      );

    if (!existingSOP) {
      return res.status(404).json({
        success: false,

        message:
          "Role SOP not found.",
      });
    }

    // Convert mongoose document
    // into normal object
    const data =
      existingSOP.toObject();

    // Remove database fields
    delete data._id;
    delete data.createdAt;
    delete data.updatedAt;

    // Reset lifecycle
    data.status =
      "Draft";

    data.version =
      "1.0";

    data.createdBy =
      req.user._id;

    data.approvedBy =
      null;

    data.publishedAt =
      null;

    data.generatedCourseIds =
      [];

    // Normalize nested data
    data.responsibilities =
      normalizeResponsibilities(
        data.responsibilities
      );

    data.processes =
      normalizeProcesses(
        data.processes
      );

    data.tools =
      normalizeTools(
        data.tools
      );

    data.policies =
      normalizePolicies(
        data.policies
      );

    data.kpis =
      normalizeKPIs(
        data.kpis
      );

    const duplicated =
      await RoleSOP.create(
        data
      );

    return res.status(201).json({
      success: true,

      message:
        "Role SOP duplicated successfully.",

      roleSOP:
        duplicated,
    });
  } catch (err) {
    console.error(
      "DUPLICATE ROLE SOP ERROR:",
      err
    );

    return res.status(500).json({
      success: false,

      message:
        err.message ||
        "Unable to duplicate Role SOP.",
    });
  }
};

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  createRoleSOP,

  getRoleSOPs,

  getRoleSOPById,

  updateRoleSOP,

  submitRoleSOPForReview,

  publishRoleSOP,

  generateTrainingFromRoleSOP,

  archiveRoleSOP,

  deleteRoleSOP,

  duplicateRoleSOP,
};