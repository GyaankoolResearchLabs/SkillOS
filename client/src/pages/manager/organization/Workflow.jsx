import { useEffect, useMemo, useState } from "react";

import {
  getWorkflows,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow as deleteWorkflowApi,
  toggleWorkflow as toggleWorkflowApi,
  getWorkflowExecutions,
} from "../../../services/workflowService";

import {
  Activity,
  ArrowRight,
  Bell,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Copy,
  Edit3,
  GitBranch,
  Play,
  Plus,
  Search,
  Settings2,
  Trash2,
  X,
  Zap,
} from "lucide-react";

// =====================================================
// TRIGGER OPTIONS
// =====================================================

const TRIGGERS = [
  {
    value: "employee.created",
    label: "Employee Created",
  },
  {
    value: "employee.updated",
    label: "Employee Updated",
  },
  {
    value: "sop.submitted",
    label: "SOP Submitted",
  },
  {
    value: "sop.approved",
    label: "SOP Approved",
  },
  {
    value: "course.assigned",
    label: "Course Assigned",
  },
  {
    value: "course.completed",
    label: "Course Completed",
  },
  {
    value: "training.inactive",
    label: "Training Inactive",
  },
];

// =====================================================
// ACTION OPTIONS
// =====================================================

const ACTION_TYPES = [
  {
    value: "send_notification",
    label: "Send Notification",
  },
  {
    value: "assign_course",
    label: "Assign Course",
  },
];

// =====================================================
// RECIPIENT OPTIONS
// =====================================================

const RECIPIENTS = [
  {
    value: "employee",
    label: "Employee",
  },
  {
    value: "manager",
    label: "Manager",
  },
  {
    value: "hr",
    label: "HR",
  },
];

// =====================================================
// HELPERS
// =====================================================

function getTriggerLabel(event) {
  const trigger = TRIGGERS.find(
    (item) => item.value === event
  );

  return trigger?.label || event || "Unknown Trigger";
}

function getActionLabel(action) {
  if (!action) return "Unknown Action";

  if (action.type === "send_notification") {
    return "Send Notification";
  }

  if (action.type === "assign_course") {
    return "Assign Course";
  }

  return action.type || "Unknown Action";
}

function formatDate(date) {
  if (!date) {
    return "Never";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Never";
  }

  return parsedDate.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function normalizeWorkflow(workflow, executions = []) {
  const executionList = Array.isArray(executions)
    ? executions
    : [];

  const latestExecution = executionList[0];

  return {
    ...workflow,

    id: workflow._id,

    status: workflow.active
      ? "Active"
      : "Inactive",

    trigger:
      getTriggerLabel(
        workflow.trigger?.event
      ),

    triggerEvent:
      workflow.trigger?.event || "",

    actions: Array.isArray(workflow.actions)
      ? workflow.actions
      : [],

    executions:
      executionList.length,

    lastRun:
      latestExecution?.executedAt
        ? formatDate(
            latestExecution.executedAt
          )
        : "Never",
  };
}

// =====================================================
// STATUS BADGE
// =====================================================

function StatusBadge({ status }) {
  const active = status === "Active";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "bg-slate-100 text-slate-600"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active
            ? "bg-emerald-500"
            : "bg-slate-400"
        }`}
      />

      {status}
    </span>
  );
}

// =====================================================
// WORKFLOW MODAL
// =====================================================

function WorkflowModal({
  workflow,
  onClose,
  onSave,
  saving,
}) {
  const [name, setName] = useState(
    workflow?.name || ""
  );

  const [description, setDescription] =
    useState(
      workflow?.description || ""
    );

  const [trigger, setTrigger] = useState(
    workflow?.triggerEvent ||
      TRIGGERS[0].value
  );

  const [actions, setActions] =
    useState(() => {
      if (
        workflow?.actions &&
        workflow.actions.length
      ) {
        return workflow.actions.map(
          (action) => ({
            type:
              action.type ||
              "send_notification",

            recipient:
              action.recipient ||
              "employee",

            title:
              action.title || "",

            message:
              action.message || "",

            course:
              action.course || null,
          })
        );
      }

      return [
        {
          type: "send_notification",
          recipient: "employee",
          title: "",
          message: "",
          course: null,
        },
      ];
    });

  const addAction = () => {
    setActions((current) => [
      ...current,
      {
        type: "send_notification",
        recipient: "employee",
        title: "",
        message: "",
        course: null,
      },
    ]);
  };

  const removeAction = (index) => {
    setActions((current) =>
      current.filter(
        (_, actionIndex) =>
          actionIndex !== index
      )
    );
  };

  const updateAction = (
    index,
    field,
    value
  ) => {
    setActions((current) =>
      current.map(
        (action, actionIndex) => {
          if (
            actionIndex !== index
          ) {
            return action;
          }

          return {
            ...action,
            [field]: value,
          };
        }
      )
    );
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!name.trim()) {
      alert(
        "Workflow name is required."
      );
      return;
    }

    if (!trigger) {
      alert(
        "Workflow trigger is required."
      );
      return;
    }

    if (!actions.length) {
      alert(
        "At least one action is required."
      );
      return;
    }

    const cleanedActions =
      actions.map((action) => {
        if (
          action.type ===
          "send_notification"
        ) {
          return {
            type: "send_notification",
            recipient:
              action.recipient ||
              "employee",
            title:
              action.title || "",
            message:
              action.message || "",
            course: null,
          };
        }

        return {
          type: "assign_course",
          recipient:
            action.recipient ||
            "employee",
          title: "",
          message: "",
          course:
            action.course || null,
        };
      });

    await onSave({
      name: name.trim(),

      description:
        description.trim(),

      trigger: {
        event: trigger,
      },

      conditions:
        workflow?.conditions || [],

      actions: cleanedActions,

      active:
        workflow?.active !== undefined
          ? workflow.active
          : true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {workflow
                ? "Edit Workflow"
                : "Create Workflow"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Define when the workflow starts
              and what actions it performs.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="min-h-0 overflow-y-auto px-6 py-6"
        >
          <div className="space-y-6">

            {/* NAME */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Workflow Name
              </label>

              <input
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                placeholder="e.g. Employee Onboarding"
                disabled={saving}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              />
            </div>

            {/* DESCRIPTION */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Description
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                rows={3}
                disabled={saving}
                placeholder="Describe what this workflow is responsible for..."
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              />
            </div>

            {/* TRIGGER */}

            <div>
              <div className="mb-2 flex items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Zap size={16} />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-800">
                    Trigger
                  </p>

                  <p className="text-xs text-slate-500">
                    What starts this workflow?
                  </p>
                </div>
              </div>

              <div className="relative">
                <select
                  value={trigger}
                  onChange={(event) =>
                    setTrigger(
                      event.target.value
                    )
                  }
                  disabled={saving}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                >
                  {TRIGGERS.map(
                    (item) => (
                      <option
                        key={item.value}
                        value={
                          item.value
                        }
                      >
                        {item.label}
                      </option>
                    )
                  )}
                </select>

                <ChevronDown
                  size={17}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>

            {/* ACTIONS */}

            <div>
              <div className="mb-3 flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                    <GitBranch size={16} />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      Actions
                    </p>

                    <p className="text-xs text-slate-500">
                      What should happen after the trigger?
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addAction}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-slate-900"
                >
                  <Plus size={16} />
                  Add action
                </button>
              </div>

              <div className="space-y-4">

                {actions.map(
                  (
                    action,
                    index
                  ) => (
                    <div
                      key={index}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                    >

                      {/* ACTION HEADER */}

                      <div className="mb-4 flex items-center justify-between">

                        <div className="flex items-center gap-3">

                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-xs font-semibold text-slate-500 shadow-sm">
                            {index + 1}
                          </div>

                          <p className="text-sm font-medium text-slate-800">
                            Action {index + 1}
                          </p>
                        </div>

                        {actions.length >
                          1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeAction(
                                index
                              )
                            }
                            disabled={
                              saving
                            }
                            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                          >
                            <Trash2
                              size={17}
                            />
                          </button>
                        )}
                      </div>

                      {/* ACTION TYPE */}

                      <div className="mb-4">
                        <label className="mb-2 block text-xs font-medium text-slate-600">
                          Action Type
                        </label>

                        <div className="relative">
                          <select
                            value={
                              action.type
                            }
                            onChange={(
                              event
                            ) =>
                              updateAction(
                                index,
                                "type",
                                event
                                  .target
                                  .value
                              )
                            }
                            disabled={
                              saving
                            }
                            className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                          >
                            {ACTION_TYPES.map(
                              (
                                item
                              ) => (
                                <option
                                  key={
                                    item.value
                                  }
                                  value={
                                    item.value
                                  }
                                >
                                  {
                                    item.label
                                  }
                                </option>
                              )
                            )}
                          </select>

                          <ChevronDown
                            size={17}
                            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                          />
                        </div>
                      </div>

                      {/* RECIPIENT */}

                      <div className="mb-4">
                        <label className="mb-2 block text-xs font-medium text-slate-600">
                          Recipient
                        </label>

                        <div className="relative">
                          <select
                            value={
                              action.recipient
                            }
                            onChange={(
                              event
                            ) =>
                              updateAction(
                                index,
                                "recipient",
                                event
                                  .target
                                  .value
                              )
                            }
                            disabled={
                              saving
                            }
                            className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                          >
                            {RECIPIENTS.map(
                              (
                                item
                              ) => (
                                <option
                                  key={
                                    item.value
                                  }
                                  value={
                                    item.value
                                  }
                                >
                                  {
                                    item.label
                                  }
                                </option>
                              )
                            )}
                          </select>

                          <ChevronDown
                            size={17}
                            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                          />
                        </div>
                      </div>

                      {/* NOTIFICATION FIELDS */}

                      {action.type ===
                        "send_notification" && (
                        <>
                          <div className="mb-4">
                            <label className="mb-2 block text-xs font-medium text-slate-600">
                              Notification Title
                            </label>

                            <input
                              value={
                                action.title
                              }
                              onChange={(
                                event
                              ) =>
                                updateAction(
                                  index,
                                  "title",
                                  event
                                    .target
                                    .value
                                )
                              }
                              disabled={
                                saving
                              }
                              placeholder="e.g. Welcome to SkillOS"
                              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-xs font-medium text-slate-600">
                              Notification Message
                            </label>

                            <textarea
                              value={
                                action.message
                              }
                              onChange={(
                                event
                              ) =>
                                updateAction(
                                  index,
                                  "message",
                                  event
                                    .target
                                    .value
                                )
                              }
                              disabled={
                                saving
                              }
                              rows={3}
                              placeholder="Enter the notification message..."
                              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                            />
                          </div>
                        </>
                      )}

                      {/* COURSE FIELD */}

                      {action.type ===
                        "assign_course" && (
                        <div>
                          <label className="mb-2 block text-xs font-medium text-slate-600">
                            Course ID
                          </label>

                          <input
                            value={
                              action.course ||
                              ""
                            }
                            onChange={(
                              event
                            ) =>
                              updateAction(
                                index,
                                "course",
                                event
                                  .target
                                  .value ||
                                  null
                              )
                            }
                            disabled={
                              saving
                            }
                            placeholder="Enter the Course ID"
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                          />

                          <p className="mt-1.5 text-xs text-slate-400">
                            Use the MongoDB Course ID for
                            the course you want to assign.
                          </p>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* FOOTER */}

          <div className="mt-8 flex justify-end gap-3 border-t border-slate-200 pt-5">

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : workflow
                ? "Save Changes"
                : "Create Workflow"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// =====================================================
// WORKFLOW DETAILS
// =====================================================

function WorkflowDetails({
  workflow,
  onClose,
}) {
  if (!workflow) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/30 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">

        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">

          <div className="flex min-w-0 items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <GitBranch size={19} />
            </div>

            <div className="min-w-0">

              <h3 className="truncate text-base font-semibold text-slate-900">
                {workflow.name}
              </h3>

              <div className="mt-1">
                <StatusBadge
                  status={
                    workflow.status
                  }
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={19} />
          </button>
        </div>

        <div className="space-y-5 px-6 py-6">

          {/* DESCRIPTION */}

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Description
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              {workflow.description ||
                "No description provided."}
            </p>
          </div>

          {/* FLOW */}

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Workflow Flow
            </p>

            <div className="space-y-3">

              {/* TRIGGER */}

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Zap size={16} />
                </div>

                <div className="min-w-0">

                  <p className="text-xs text-slate-400">
                    Trigger
                  </p>

                  <p className="truncate text-sm font-medium text-slate-800">
                    {workflow.trigger}
                  </p>
                </div>
              </div>

              {/* ACTIONS */}

              {workflow.actions.map(
                (
                  action,
                  index
                ) => (
                  <div
                    key={`${action.type}-${index}`}
                  >
                    <div className="ml-4 h-4 border-l border-dashed border-slate-300" />

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                        <ArrowRight size={16} />
                      </div>

                      <div className="min-w-0">

                        <p className="text-xs text-slate-400">
                          Action{" "}
                          {index + 1}
                        </p>

                        <p className="truncate text-sm font-medium text-slate-800">
                          {
                            getActionLabel(
                              action
                            )
                          }
                        </p>

                        {action.type ===
                          "send_notification" && (
                          <p className="mt-1 truncate text-xs text-slate-500">
                            Recipient:{" "}
                            {
                              action.recipient
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* STATISTICS */}

          <div className="grid grid-cols-2 gap-3">

            <div className="rounded-xl border border-slate-200 p-4">

              <p className="text-xs text-slate-400">
                Executions
              </p>

              <p className="mt-1 text-xl font-semibold text-slate-900">
                {workflow.executions}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">

              <p className="text-xs text-slate-400">
                Last Run
              </p>

              <p className="mt-1 truncate text-sm font-semibold text-slate-900">
                {workflow.lastRun}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-200 px-6 py-4">

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// MAIN WORKFLOW PAGE
// =====================================================

export default function Workflow() {
  const [workflows, setWorkflows] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [modal, setModal] =
    useState(null);

  const [details, setDetails] =
    useState(null);

  // ===================================================
  // LOAD WORKFLOWS
  // ===================================================

  const loadWorkflows = async () => {
    try {
      setLoading(true);

      const result =
        await getWorkflows();

      if (!result?.success) {
        throw new Error(
          result?.message ||
            "Failed to load workflows."
        );
      }

      const databaseWorkflows =
        Array.isArray(
          result.workflows
        )
          ? result.workflows
          : [];

      // -----------------------------------------------
      // Load execution history
      // -----------------------------------------------

      const normalized =
        await Promise.all(
          databaseWorkflows.map(
            async (workflow) => {
              try {
                const executionResult =
                  await getWorkflowExecutions(
                    workflow._id
                  );

                return normalizeWorkflow(
                  workflow,
                  executionResult
                    ?.executions || []
                );
              } catch (executionError) {
                console.warn(
                  "Could not load workflow executions:",
                  executionError
                );

                return normalizeWorkflow(
                  workflow,
                  []
                );
              }
            }
          )
        );

      setWorkflows(normalized);

      console.log(
        "WORKFLOWS LOADED FROM MONGODB:",
        normalized
      );
    } catch (error) {
      console.error(
        "LOAD WORKFLOWS ERROR:",
        error
      );

      alert(
        error?.response?.data
          ?.message ||
          error.message ||
          "Failed to load workflows."
      );

      setWorkflows([]);
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    loadWorkflows();
  }, []);

  // ===================================================
  // FILTER
  // ===================================================

  const filteredWorkflows =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return workflows.filter(
        (workflow) => {
          const matchesSearch =
            !query ||
            workflow.name
              ?.toLowerCase()
              .includes(query) ||
            workflow.description
              ?.toLowerCase()
              .includes(query) ||
            workflow.trigger
              ?.toLowerCase()
              .includes(query);

          const matchesStatus =
            statusFilter === "All" ||
            workflow.status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      workflows,
      search,
      statusFilter,
    ]);

  // ===================================================
  // SUMMARY
  // ===================================================

  const activeCount =
    workflows.filter(
      (workflow) =>
        workflow.status ===
        "Active"
    ).length;

  const totalExecutions =
    workflows.reduce(
      (
        total,
        workflow
      ) =>
        total +
        Number(
          workflow.executions || 0
        ),
      0
    );

  // ===================================================
  // SAVE WORKFLOW
  // ===================================================

  const saveWorkflow =
    async (workflowData) => {
      try {
        setSaving(true);

        // ---------------------------------------------
        // CREATE
        // ---------------------------------------------

        if (
          !modal ||
          modal === "create"
        ) {
          const result =
            await createWorkflow(
              workflowData
            );

          if (!result?.success) {
            throw new Error(
              result?.message ||
                "Failed to create workflow."
            );
          }

          alert(
            "Workflow created successfully."
          );
        }

        // ---------------------------------------------
        // UPDATE
        // ---------------------------------------------

        else {
          const workflowId =
            modal.workflow?._id;

          if (!workflowId) {
            throw new Error(
              "Workflow ID is missing."
            );
          }

          const result =
            await updateWorkflow(
              workflowId,
              workflowData
            );

          if (!result?.success) {
            throw new Error(
              result?.message ||
                "Failed to update workflow."
            );
          }

          alert(
            "Workflow updated successfully."
          );
        }

        setModal(null);

        await loadWorkflows();
      } catch (error) {
        console.error(
          "SAVE WORKFLOW ERROR:",
          error
        );

        alert(
          error?.response?.data
            ?.message ||
            error.message ||
            "Failed to save workflow."
        );
      } finally {
        setSaving(false);
      }
    };

  // ===================================================
  // TOGGLE WORKFLOW
  // ===================================================

  const handleToggleWorkflow =
    async (workflow) => {
      try {
        const workflowId =
          workflow._id;

        if (!workflowId) {
          throw new Error(
            "Workflow ID is missing."
          );
        }

        const result =
          await toggleWorkflowApi(
            workflowId
          );

        if (!result?.success) {
          throw new Error(
            result?.message ||
              "Failed to toggle workflow."
          );
        }

        setWorkflows(
          (current) =>
            current.map(
              (item) => {
                if (
                  item._id !==
                  workflowId
                ) {
                  return item;
                }

                return {
                  ...item,

                  active:
                    result.workflow
                      .active,

                  status:
                    result.workflow
                      .active
                      ? "Active"
                      : "Inactive",
                };
              }
            )
        );

        console.log(
          "WORKFLOW TOGGLED:",
          result.workflow
        );
      } catch (error) {
        console.error(
          "TOGGLE WORKFLOW ERROR:",
          error
        );

        alert(
          error?.response?.data
            ?.message ||
            error.message ||
            "Failed to toggle workflow."
        );
      }
    };

  // ===================================================
  // DUPLICATE WORKFLOW
  // ===================================================

  const duplicateWorkflow =
    async (workflow) => {
      try {
        if (!workflow._id) {
          throw new Error(
            "Workflow ID is missing."
          );
        }

        const duplicateData = {
          name:
            `${workflow.name} Copy`,

          description:
            workflow.description ||
            "",

          trigger: {
            event:
              workflow.triggerEvent,
          },

          conditions:
            workflow.conditions ||
            [],

          actions:
            workflow.actions ||
            [],

          active: false,
        };

        const result =
          await createWorkflow(
            duplicateData
          );

        if (!result?.success) {
          throw new Error(
            result?.message ||
              "Failed to duplicate workflow."
          );
        }

        alert(
          "Workflow duplicated successfully."
        );

        await loadWorkflows();
      } catch (error) {
        console.error(
          "DUPLICATE WORKFLOW ERROR:",
          error
        );

        alert(
          error?.response?.data
            ?.message ||
            error.message ||
            "Failed to duplicate workflow."
        );
      }
    };

  // ===================================================
  // DELETE WORKFLOW
  // ===================================================

  const handleDeleteWorkflow =
    async (workflow) => {
      const confirmed =
        window.confirm(
          `Are you sure you want to delete "${workflow.name}"?`
        );

      if (!confirmed) {
        return;
      }

      try {
        if (!workflow._id) {
          throw new Error(
            "Workflow ID is missing."
          );
        }

        const result =
          await deleteWorkflowApi(
            workflow._id
          );

        if (!result?.success) {
          throw new Error(
            result?.message ||
              "Failed to delete workflow."
          );
        }

        alert(
          "Workflow deleted successfully."
        );

        await loadWorkflows();
      } catch (error) {
        console.error(
          "DELETE WORKFLOW ERROR:",
          error
        );

        alert(
          error?.response?.data
            ?.message ||
            error.message ||
            "Failed to delete workflow."
        );
      }
    };

  // ===================================================
  // RETURN
  // ===================================================

  return (
    <div className="min-w-0 overflow-x-hidden">

      <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="min-w-0">

            <div className="flex items-center gap-2">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <GitBranch size={19} />
              </div>

              <h1 className="truncate text-2xl font-semibold tracking-tight text-slate-900">
                Workflow Engine
              </h1>
            </div>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Automate repetitive organization
              processes by connecting triggers,
              conditions, and actions.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setModal("create")
            }
            disabled={loading}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus size={17} />
            Create Workflow
          </button>
        </div>

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* TOTAL */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5">

            <div className="flex items-center justify-between">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <GitBranch size={19} />
              </div>

              <span className="text-xs font-medium text-slate-400">
                Total
              </span>
            </div>

            <p className="mt-4 text-2xl font-semibold text-slate-900">
              {loading
                ? "..."
                : workflows.length}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Workflows configured
            </p>
          </div>

          {/* ACTIVE */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5">

            <div className="flex items-center justify-between">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={19} />
              </div>

              <span className="text-xs font-medium text-slate-400">
                Running
              </span>
            </div>

            <p className="mt-4 text-2xl font-semibold text-slate-900">
              {loading
                ? "..."
                : activeCount}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Active workflows
            </p>
          </div>

          {/* EXECUTIONS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5">

            <div className="flex items-center justify-between">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Activity size={19} />
              </div>

              <span className="text-xs font-medium text-slate-400">
                Lifetime
              </span>
            </div>

            <p className="mt-4 text-2xl font-semibold text-slate-900">
              {loading
                ? "..."
                : totalExecutions}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Workflow executions
            </p>
          </div>

          {/* AUTOMATION */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5">

            <div className="flex items-center justify-between">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Clock3 size={19} />
              </div>

              <span className="text-xs font-medium text-slate-400">
                Automation
              </span>
            </div>

            <p className="mt-4 text-2xl font-semibold text-slate-900">
              24/7
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Automated processing
            </p>
          </div>
        </div>

        {/* =================================================
            WORKFLOW LIST
        ================================================= */}

        <div className="rounded-2xl border border-slate-200 bg-white">

          {/* LIST HEADER */}

          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Organization Workflows
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage automated processes
                across your organization.
              </p>
            </div>

            <div className="flex min-w-0 flex-col gap-2 sm:flex-row">

              {/* SEARCH */}

              <div className="relative min-w-0 sm:w-64">

                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search workflows..."
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                />
              </div>

              {/* FILTER */}

              <div className="relative">

                <select
                  value={
                    statusFilter
                  }
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value
                    )
                  }
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 sm:w-32"
                >
                  <option>
                    All
                  </option>

                  <option>
                    Active
                  </option>

                  <option>
                    Inactive
                  </option>
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* TABLE */}

          <div className="min-w-0 overflow-x-auto">

            <table className="w-full min-w-[950px]">

              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Workflow
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Trigger
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Executions
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Last Run
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {/* LOADING */}

                {loading && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-16 text-center"
                    >
                      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-700" />

                      <p className="mt-4 text-sm text-slate-500">
                        Loading workflows...
                      </p>
                    </td>
                  </tr>
                )}

                {/* DATA */}

                {!loading &&
                  filteredWorkflows.map(
                    (workflow) => (
                      <tr
                        key={
                          workflow._id
                        }
                        className="transition hover:bg-slate-50/60"
                      >

                        {/* WORKFLOW */}

                        <td className="px-5 py-4">

                          <div className="flex min-w-[220px] items-start gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                              <GitBranch
                                size={17}
                              />
                            </div>

                            <div className="min-w-0">

                              <button
                                type="button"
                                onClick={() =>
                                  setDetails(
                                    workflow
                                  )
                                }
                                className="truncate text-left text-sm font-semibold text-slate-900 hover:text-slate-600"
                              >
                                {
                                  workflow.name
                                }
                              </button>

                              <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                                {
                                  workflow.description ||
                                  "No description"
                                }
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* TRIGGER */}

                        <td className="px-5 py-4">

                          <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm text-slate-700">

                            <Zap
                              size={15}
                              className="text-blue-500"
                            />

                            {
                              workflow.trigger
                            }
                          </span>
                        </td>

                        {/* ACTIONS */}

                        <td className="px-5 py-4">

                          <div className="flex max-w-[240px] flex-wrap gap-1.5">

                            {workflow.actions
                              .slice(
                                0,
                                2
                              )
                              .map(
                                (
                                  action,
                                  index
                                ) => (
                                  <span
                                    key={`${action.type}-${index}`}
                                    className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600"
                                  >
                                    {getActionLabel(
                                      action
                                    )}
                                  </span>
                                )
                              )}

                            {workflow.actions
                              .length >
                              2 && (
                              <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-500">
                                +
                                {workflow
                                  .actions
                                  .length -
                                  2}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">

                          <button
                            type="button"
                            onClick={() =>
                              handleToggleWorkflow(
                                workflow
                              )
                            }
                            title="Toggle workflow status"
                          >
                            <StatusBadge
                              status={
                                workflow.status
                              }
                            />
                          </button>
                        </td>

                        {/* EXECUTIONS */}

                        <td className="px-5 py-4 text-sm font-medium text-slate-700">
                          {
                            workflow.executions
                          }
                        </td>

                        {/* LAST RUN */}

                        <td className="px-5 py-4 text-sm text-slate-500">
                          {
                            workflow.lastRun
                          }
                        </td>

                        {/* ACTION BUTTONS */}

                        <td className="px-5 py-4">

                          <div className="flex justify-end gap-1">

                            {/* VIEW */}

                            <button
                              type="button"
                              onClick={() =>
                                setDetails(
                                  workflow
                                )
                              }
                              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                              title="View workflow"
                            >
                              <Play
                                size={16}
                              />
                            </button>

                            {/* EDIT */}

                            <button
                              type="button"
                              onClick={() =>
                                setModal({
                                  type: "edit",
                                  workflow,
                                })
                              }
                              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                              title="Edit workflow"
                            >
                              <Edit3
                                size={16}
                              />
                            </button>

                            {/* DUPLICATE */}

                            <button
                              type="button"
                              onClick={() =>
                                duplicateWorkflow(
                                  workflow
                                )
                              }
                              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                              title="Duplicate workflow"
                            >
                              <Copy
                                size={16}
                              />
                            </button>

                            {/* DELETE */}

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteWorkflow(
                                  workflow
                                )
                              }
                              className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                              title="Delete workflow"
                            >
                              <Trash2
                                size={16}
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}

                {/* EMPTY */}

                {!loading &&
                  filteredWorkflows.length ===
                    0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-5 py-16 text-center"
                      >

                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                          <Search
                            size={20}
                          />
                        </div>

                        <p className="mt-4 text-sm font-medium text-slate-800">
                          No workflows found
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {search ||
                          statusFilter !==
                            "All"
                            ? "Try changing your search or filter."
                            : "There are currently no workflows in MongoDB."}
                        </p>
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>

          {/* FOOTER */}

          <div className="flex flex-col gap-2 border-t border-slate-200 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">

            <span>
              Showing{" "}
              {
                filteredWorkflows.length
              }{" "}
              of{" "}
              {workflows.length}{" "}
              workflows
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Settings2
                size={14}
              />
              MongoDB workflow automation
            </span>
          </div>
        </div>

        {/* =================================================
            AUTOMATION INFO
        ================================================= */}

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm">
              <Bell size={19} />
            </div>

            <div className="min-w-0">

              <h3 className="text-sm font-semibold text-slate-900">
                Build automated employee workflows
              </h3>

              <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
                Connect events in SkillOS with
                automated actions to reduce
                repetitive administrative work.
                Workflows can be connected to
                employee onboarding, SOP approvals,
                training assignments, notifications,
                and compliance processes.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">

                {[
                  "Employee lifecycle",
                  "Training automation",
                  "SOP approvals",
                  "Notifications",
                  "Compliance",
                ].map(
                  (item) => (
                    <span
                      key={item}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600"
                    >
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          MODALS
      ================================================= */}

      {modal && (
        <WorkflowModal
          workflow={
            modal === "create"
              ? null
              : modal.workflow
          }
          onClose={() =>
            setModal(null)
          }
          onSave={saveWorkflow}
          saving={saving}
        />
      )}

      {details && (
        <WorkflowDetails
          workflow={details}
          onClose={() =>
            setDetails(null)
          }
        />
      )}
    </div>
  );
}