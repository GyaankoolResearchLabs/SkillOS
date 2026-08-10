const Workflow = require("../models/Workflow");
const WorkflowExecution = require("../models/WorkflowExecution");
const Assignment = require("../models/Assignment");

const {
  createNotification,
} = require("./notificationService");

// =====================================================
// GET NESTED VALUE
// =====================================================
//
// Example:
//
// employee.department
//
// payload:
// {
//   employee: {
//     department: "Marketing"
//   }
// }
//
// returns:
// "Marketing"
//
// =====================================================

const getValue = (
  object,
  path
) => {
  if (!object || !path) {
    return undefined;
  }

  return path
    .split(".")
    .reduce(
      (current, key) =>
        current?.[key],
      object
    );
};

// =====================================================
// TEMPLATE VARIABLES
// =====================================================
//
// Example:
//
// "Welcome {{employee.name}}"
//
// becomes:
//
// "Welcome Rahul"
//
// =====================================================

const interpolate = (
  template,
  payload
) => {
  if (
    typeof template !== "string"
  ) {
    return "";
  }

  return template.replace(
    /\{\{\s*([^}]+)\s*\}\}/g,
    (_, path) => {
      const value =
        getValue(
          payload,
          path.trim()
        );

      return value === undefined ||
        value === null
        ? ""
        : String(value);
    }
  );
};

// =====================================================
// EVALUATE CONDITION
// =====================================================

const evaluateCondition = (
  condition,
  payload
) => {
  const actualValue =
    getValue(
      payload,
      condition.field
    );

  const expectedValue =
    condition.value;

  switch (
    condition.operator
  ) {
    case "equals":
      return (
        String(actualValue)
          .toLowerCase() ===
        String(expectedValue)
          .toLowerCase()
      );

    case "not_equals":
      return (
        String(actualValue)
          .toLowerCase() !==
        String(expectedValue)
          .toLowerCase()
      );

    case "contains":
      return String(actualValue)
        .toLowerCase()
        .includes(
          String(expectedValue)
            .toLowerCase()
        );

    case "not_contains":
      return !String(actualValue)
        .toLowerCase()
        .includes(
          String(expectedValue)
            .toLowerCase()
        );

    case "starts_with":
      return String(actualValue)
        .toLowerCase()
        .startsWith(
          String(expectedValue)
            .toLowerCase()
        );

    case "ends_with":
      return String(actualValue)
        .toLowerCase()
        .endsWith(
          String(expectedValue)
            .toLowerCase()
        );

    case "in":
      return (
        Array.isArray(
          expectedValue
        ) &&
        expectedValue.includes(
          actualValue
        )
      );

    case "not_in":
      return (
        Array.isArray(
          expectedValue
        ) &&
        !expectedValue.includes(
          actualValue
        )
      );

    case "exists":
      return (
        actualValue !==
          undefined &&
        actualValue !== null &&
        actualValue !== ""
      );

    case "not_exists":
      return (
        actualValue ===
          undefined ||
        actualValue === null ||
        actualValue === ""
      );

    default:
      console.warn(
        "Unknown workflow operator:",
        condition.operator
      );

      return false;
  }
};

// =====================================================
// EVALUATE ALL CONDITIONS
// =====================================================

const evaluateConditions = (
  conditions,
  payload
) => {
  if (
    !conditions ||
    conditions.length === 0
  ) {
    return true;
  }

  return conditions.every(
    (condition) =>
      evaluateCondition(
        condition,
        payload
      )
  );
};

// =====================================================
// EXECUTE SEND NOTIFICATION
// =====================================================

const executeSendNotification =
  async (
    action,
    payload,
    workflow
  ) => {
    let recipientId = null;

    // -----------------------------------------------
    // Employee
    // -----------------------------------------------

    if (
      action.recipient ===
      "employee"
    ) {
      recipientId =
        payload?.employee?._id;
    }

    // -----------------------------------------------
    // Manager
    // -----------------------------------------------

    if (
      action.recipient ===
      "manager"
    ) {
      recipientId =
        payload?.manager?._id;
    }

    // -----------------------------------------------
    // HR
    // -----------------------------------------------

    if (
      action.recipient ===
      "hr"
    ) {
      recipientId =
        payload?.hr?._id;
    }

    if (!recipientId) {
      throw new Error(
        `Unable to determine notification recipient for action in workflow "${workflow.name}".`
      );
    }

    const title =
      interpolate(
        action.title ||
          workflow.name,
        payload
      );

    const message =
      interpolate(
        action.message,
        payload
      );

    const notification =
      await createNotification({
        recipient:
          recipientId,

        title,

        message,

        type:
          "workflow",

        metadata: {
          workflowId:
            workflow._id,

          workflowName:
            workflow.name,

          event:
            workflow.trigger
              ?.event,
        },
      });

    return {
      action:
        "send_notification",

      success: true,

      notificationId:
        notification._id,
    };
  };

// =====================================================
// EXECUTE ASSIGN COURSE
// =====================================================

const executeAssignCourse =
  async (
    action,
    payload
  ) => {
    const employeeId =
      payload?.employee?._id;

    if (!employeeId) {
      throw new Error(
        "Employee ID is required to assign a course."
      );
    }

    if (!action.course) {
      throw new Error(
        "Course ID is required for assign_course action."
      );
    }

    // -----------------------------------------------
    // Prevent duplicate assignment
    // -----------------------------------------------

    const existingAssignment =
      await Assignment.findOne({
        employee: employeeId,
        course: action.course,
      });

    if (existingAssignment) {
      return {
        action:
          "assign_course",

        success: true,

        skipped: true,

        reason:
          "Course is already assigned.",

        assignmentId:
          existingAssignment._id,
      };
    }

    const assignment =
      await Assignment.create({
        employee: employeeId,

        course: action.course,

        status: "Assigned",

        progress: 0,

        completedModules: [],

        completedLessons: [],

        assignedAt:
          new Date(),
      });

    return {
      action:
        "assign_course",

      success: true,

      assignmentId:
        assignment._id,
    };
  };

// =====================================================
// EXECUTE ACTION
// =====================================================

const executeAction =
  async (
    action,
    payload,
    workflow
  ) => {
    switch (action.type) {
      case "send_notification":
        return executeSendNotification(
          action,
          payload,
          workflow
        );

      case "assign_course":
        return executeAssignCourse(
          action,
          payload
        );

      default:
        throw new Error(
          `Unsupported workflow action: ${action.type}`
        );
    }
  };

// =====================================================
// TRIGGER WORKFLOW
// =====================================================

const triggerWorkflow =
  async (
    eventName,
    payload = {}
  ) => {
    console.log(
      "================================================"
    );

    console.log(
      "WORKFLOW EVENT:",
      eventName
    );

    console.log(
      "WORKFLOW PAYLOAD:",
      payload
    );

    console.log(
      "================================================"
    );

    // -----------------------------------------------
    // Find active workflows
    // -----------------------------------------------

    const workflows =
      await Workflow.find({
        active: true,

        "trigger.event":
          eventName,
      });

    console.log(
      "ACTIVE WORKFLOWS FOUND:",
      workflows.length
    );

    // -----------------------------------------------
    // Nothing to execute
    // -----------------------------------------------

    if (!workflows.length) {
      return {
        triggered: false,

        event:
          eventName,

        workflowsFound: 0,

        executions: [],
      };
    }

    const executions = [];

    // -----------------------------------------------
    // Execute each workflow
    // -----------------------------------------------

    for (
      const workflow of workflows
    ) {
      let execution = null;

      try {
        // ==========================================
        // CHECK CONDITIONS
        // ==========================================

        const conditionsPassed =
          evaluateConditions(
            workflow.conditions,
            payload
          );

        console.log(
          `WORKFLOW "${workflow.name}" CONDITIONS:`,
          conditionsPassed
        );

        // ==========================================
        // CONDITIONS FAILED
        // ==========================================

        if (
          !conditionsPassed
        ) {
          execution =
            await WorkflowExecution.create(
              {
                workflow:
                  workflow._id,

                event:
                  eventName,

                entityType:
                  "Employee",

                entityId:
                  payload?.employee
                    ?._id || null,

                status:
                  "SKIPPED",

                conditionsPassed:
                  false,

                actionResults:
                  [],
              }
            );

          executions.push(
            execution
          );

          continue;
        }

        // ==========================================
        // EXECUTE ACTIONS
        // ==========================================

        const actionResults =
          [];

        for (
          const action of workflow.actions
        ) {
          try {
            const result =
              await executeAction(
                action,
                payload,
                workflow
              );

            actionResults.push(
              result
            );
          } catch (actionError) {
            actionResults.push({
              action:
                action.type,

              success:
                false,

              error:
                actionError.message,
            });

            throw actionError;
          }
        }

        // ==========================================
        // SUCCESS
        // ==========================================

        execution =
          await WorkflowExecution.create(
            {
              workflow:
                workflow._id,

              event:
                eventName,

              entityType:
                "Employee",

              entityId:
                payload?.employee
                  ?._id || null,

              status:
                "SUCCESS",

              conditionsPassed:
                true,

              actionResults,
            }
          );

        executions.push(
          execution
        );

        console.log(
          `WORKFLOW SUCCESS: ${workflow.name}`
        );
      } catch (error) {
        // ==========================================
        // FAILED
        // ==========================================

        console.error(
          `WORKFLOW FAILED: ${workflow.name}`,
          error
        );

        execution =
          await WorkflowExecution.create(
            {
              workflow:
                workflow._id,

              event:
                eventName,

              entityType:
                "Employee",

              entityId:
                payload?.employee
                  ?._id || null,

              status:
                "FAILED",

              conditionsPassed:
                true,

              actionResults:
                [],

              error:
                error.message,
            }
          );

        executions.push(
          execution
        );
      }
    }

    return {
      triggered: true,

      event:
        eventName,

      workflowsFound:
        workflows.length,

      executions,
    };
  };

module.exports = {
  triggerWorkflow,
  evaluateCondition,
  evaluateConditions,
  interpolate,
};