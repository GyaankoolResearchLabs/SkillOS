const Workflow = require("../models/Workflow");
const WorkflowExecution = require("../models/WorkflowExecution");

const {
  createAuditLog,
} = require("../services/auditLogService");

// =====================================================
// GET WORKFLOWS
// =====================================================

const getWorkflows = async (
  req,
  res
) => {
  try {
    const workflows =
      await Workflow.find()
        .populate(
          "createdBy",
          "name email"
        )
        .populate(
          "actions.course",
          "title"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: workflows.length,
      workflows,
    });
  } catch (error) {
    console.error(
      "GET WORKFLOWS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// CREATE WORKFLOW
// =====================================================

const createWorkflow = async (
  req,
  res
) => {
  try {
    const {
      name,
      description,
      trigger,
      conditions,
      actions,
      active,
    } = req.body;

    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (!name) {
      return res.status(400).json({
        success: false,
        message:
          "Workflow name is required.",
      });
    }

    if (!trigger?.event) {
      return res.status(400).json({
        success: false,
        message:
          "Workflow trigger event is required.",
      });
    }

    if (
      !actions ||
      !actions.length
    ) {
      return res.status(400).json({
        success: false,
        message:
          "At least one workflow action is required.",
      });
    }

    // -------------------------------------------------
    // CREATE WORKFLOW
    // -------------------------------------------------

    const workflow =
      await Workflow.create({
        name,

        description:
          description || "",

        trigger,

        conditions:
          conditions || [],

        actions,

        active:
          active !== undefined
            ? active
            : true,

        createdBy:
          req.user?._id ||
          req.user?.id ||
          null,
      });

    // =================================================
    // AUDIT LOG
    // =================================================

    await createAuditLog({
      req,

      action:
        "WORKFLOW_CREATED",

      description:
        `Workflow "${workflow.name}" was created.`,

      targetType:
        "Workflow",

      targetId:
        workflow._id,

      targetName:
        workflow.name,

      status:
        "Success",

      metadata: {
        trigger:
          workflow.trigger,

        conditions:
          workflow.conditions,

        actionCount:
          workflow.actions?.length ||
          0,

        active:
          workflow.active,
      },
    });

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    return res.status(201).json({
      success: true,

      message:
        "Workflow created successfully.",

      workflow,
    });
  } catch (error) {
    console.error(
      "CREATE WORKFLOW ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// UPDATE WORKFLOW
// =====================================================

const updateWorkflow = async (
  req,
  res
) => {
  try {
    const workflow =
      await Workflow.findById(
        req.params.id
      );

    if (!workflow) {
      return res.status(404).json({
        success: false,
        message:
          "Workflow not found.",
      });
    }

    // -------------------------------------------------
    // SAVE PREVIOUS VALUES
    // -------------------------------------------------

    const previousWorkflow = {
      name:
        workflow.name,

      description:
        workflow.description,

      trigger:
        workflow.trigger,

      conditions:
        workflow.conditions,

      actions:
        workflow.actions,

      active:
        workflow.active,
    };

    // -------------------------------------------------
    // REQUEST DATA
    // -------------------------------------------------

    const {
      name,
      description,
      trigger,
      conditions,
      actions,
      active,
    } = req.body;

    // -------------------------------------------------
    // APPLY UPDATES
    // -------------------------------------------------

    if (name !== undefined) {
      workflow.name =
        name;
    }

    if (
      description !==
      undefined
    ) {
      workflow.description =
        description;
    }

    if (
      trigger !==
      undefined
    ) {
      workflow.trigger =
        trigger;
    }

    if (
      conditions !==
      undefined
    ) {
      workflow.conditions =
        conditions;
    }

    if (
      actions !==
      undefined
    ) {
      workflow.actions =
        actions;
    }

    if (
      active !==
      undefined
    ) {
      workflow.active =
        active;
    }

    // -------------------------------------------------
    // SAVE
    // -------------------------------------------------

    await workflow.save();

    // =================================================
    // AUDIT LOG
    // =================================================

    await createAuditLog({
      req,

      action:
        "WORKFLOW_UPDATED",

      description:
        `Workflow "${workflow.name}" was updated.`,

      targetType:
        "Workflow",

      targetId:
        workflow._id,

      targetName:
        workflow.name,

      status:
        "Success",

      metadata: {
        previousWorkflow,

        updatedWorkflow: {
          name:
            workflow.name,

          description:
            workflow.description,

          trigger:
            workflow.trigger,

          conditions:
            workflow.conditions,

          actions:
            workflow.actions,

          active:
            workflow.active,
        },
      },
    });

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    return res.status(200).json({
      success: true,

      message:
        "Workflow updated successfully.",

      workflow,
    });
  } catch (error) {
    console.error(
      "UPDATE WORKFLOW ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// DELETE WORKFLOW
// =====================================================

const deleteWorkflow = async (
  req,
  res
) => {
  try {
    const workflow =
      await Workflow.findById(
        req.params.id
      );

    if (!workflow) {
      return res.status(404).json({
        success: false,
        message:
          "Workflow not found.",
      });
    }

    // -------------------------------------------------
    // SAVE INFORMATION BEFORE DELETE
    // -------------------------------------------------

    const deletedWorkflow = {
      id:
        workflow._id,

      name:
        workflow.name,

      description:
        workflow.description,

      trigger:
        workflow.trigger,

      conditions:
        workflow.conditions,

      actions:
        workflow.actions,

      active:
        workflow.active,
    };

    // -------------------------------------------------
    // DELETE
    // -------------------------------------------------

    await Workflow.findByIdAndDelete(
      req.params.id
    );

    // =================================================
    // AUDIT LOG
    // =================================================

    await createAuditLog({
      req,

      action:
        "WORKFLOW_DELETED",

      description:
        `Workflow "${workflow.name}" was deleted.`,

      targetType:
        "Workflow",

      targetId:
        workflow._id,

      targetName:
        workflow.name,

      status:
        "Success",

      metadata: {
        deletedWorkflow,
      },
    });

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    return res.status(200).json({
      success: true,

      message:
        "Workflow deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE WORKFLOW ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// TOGGLE WORKFLOW
// =====================================================

const toggleWorkflow = async (
  req,
  res
) => {
  try {
    const workflow =
      await Workflow.findById(
        req.params.id
      );

    if (!workflow) {
      return res.status(404).json({
        success: false,
        message:
          "Workflow not found.",
      });
    }

    // -------------------------------------------------
    // PREVIOUS STATE
    // -------------------------------------------------

    const previousStatus =
      workflow.active;

    // -------------------------------------------------
    // TOGGLE
    // -------------------------------------------------

    workflow.active =
      !workflow.active;

    await workflow.save();

    // =================================================
    // AUDIT LOG
    // =================================================

    await createAuditLog({
      req,

      action:
        "WORKFLOW_TOGGLED",

      description:
        `Workflow "${workflow.name}" was ${
          workflow.active
            ? "activated"
            : "deactivated"
        }.`,
      
      targetType:
        "Workflow",

      targetId:
        workflow._id,

      targetName:
        workflow.name,

      status:
        "Success",

      metadata: {
        previousActive:
          previousStatus,

        newActive:
          workflow.active,
      },
    });

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    return res.status(200).json({
      success: true,

      message:
        workflow.active
          ? "Workflow activated."
          : "Workflow deactivated.",

      workflow,
    });
  } catch (error) {
    console.error(
      "TOGGLE WORKFLOW ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET EXECUTION HISTORY
// =====================================================

const getWorkflowExecutions =
  async (
    req,
    res
  ) => {
    try {
      const executions =
        await WorkflowExecution.find({
          workflow:
            req.params.id,
        })
          .populate(
            "workflow",
            "name"
          )
          .sort({
            executedAt: -1,
          })
          .limit(100);

      return res.status(200).json({
        success: true,

        count:
          executions.length,

        executions,
      });
    } catch (error) {
      console.error(
        "GET WORKFLOW EXECUTIONS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getWorkflows,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  toggleWorkflow,
  getWorkflowExecutions,
};