import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaSave,
  FaPaperPlane,
  FaPlus,
  FaTrash,
  FaBuilding,
  FaBriefcase,
  FaUsers,
  FaMapMarkerAlt,
  FaUserTie,
  FaTools,
  FaBullseye,
  FaBookOpen,
  FaMagic,
  FaSpinner,
  FaCheckCircle,
} from "react-icons/fa";

import api from "../../services/api";

// ======================================================
// EMPTY FACTORIES
// ======================================================

const createResponsibility = () => ({
  title: "",
  description: "",
});

const createProcessStep = (stepNumber = 1) => ({
  stepNumber,
  instruction: "",
  expectedOutcome: "",
  responsiblePerson: "",
  approver: "",
});

const createProcess = () => ({
  name: "",
  description: "",
  steps: [createProcessStep(1)],
  tools: [],
});

const createTool = () => ({
  name: "",
  description: "",
});

const createPolicy = () => ({
  name: "",
  description: "",
});

const createKPI = () => ({
  name: "",
  description: "",
  target: "",
});

// ======================================================
// DEFAULT FORM
// ======================================================

const createDefaultForm = () => ({
  organization: "",
  department: "",
  team: "",
  role: "",
  seniority: "",
  reportingManager: "",
  location: "",
  employmentType: "Full-Time",

  rolePurpose: "",

  responsibilities: [createResponsibility()],

  processes: [createProcess()],

  tools: [createTool()],

  policies: [createPolicy()],

  kpis: [createKPI()],

  onboardingRequirements: [""],

  knowledgeRequirements: [""],
});

// ======================================================
// TEMPLATE SECTION DEFINITIONS
// ======================================================

const TEMPLATE_SECTION_MAP = {
  rolePurpose: "rolePurpose",
  responsibilities: "responsibilities",
  processes: "processes",
  tools: "tools",
  policies: "policies",
  kpis: "kpis",
  onboardingRequirements: "onboardingRequirements",
  knowledgeRequirements: "knowledgeRequirements",
};

// ======================================================
// HELPERS
// ======================================================

const safeString = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
};

const normalizeStringArray = (items) => {
  if (!Array.isArray(items)) {
    return [""];
  }

  const result = items
    .map((item) => {
      if (typeof item === "string") {
        return item;
      }

      if (item && typeof item === "object") {
        return item.name || item.title || "";
      }

      return "";
    })
    .map((item) => safeString(item));

  return result.length > 0 ? result : [""];
};

// ======================================================
// NORMALIZE SOP FROM DATABASE
// ======================================================

const normalizeSOP = (sop) => {
  const responsibilities =
    Array.isArray(sop?.responsibilities) &&
    sop.responsibilities.length > 0
      ? sop.responsibilities.map((item) => {
          if (typeof item === "string") {
            return {
              title: item,
              description: "",
            };
          }

          return {
            title: safeString(
              item?.title || item?.name
            ),
            description: safeString(
              item?.description
            ),
          };
        })
      : [createResponsibility()];

  const processes =
    Array.isArray(sop?.processes) &&
    sop.processes.length > 0
      ? sop.processes.map((process) => {
          const rawSteps = Array.isArray(
            process?.steps
          )
            ? process.steps
            : [];

          const steps =
            rawSteps.length > 0
              ? rawSteps.map((step, index) => ({
                  stepNumber:
                    Number(step?.stepNumber) ||
                    index + 1,

                  instruction: safeString(
                    step?.instruction ||
                      step?.name ||
                      step
                  ),

                  expectedOutcome: safeString(
                    step?.expectedOutcome
                  ),

                  responsiblePerson: safeString(
                    step?.responsiblePerson
                  ),

                  approver: safeString(
                    step?.approver
                  ),
                }))
              : [createProcessStep(1)];

          const rawTools = Array.isArray(
            process?.tools
          )
            ? process.tools
            : [];

          const processTools = rawTools
            .map((tool) => {
              if (typeof tool === "string") {
                return tool;
              }

              if (
                tool &&
                typeof tool === "object"
              ) {
                return (
                  tool.name ||
                  tool.title ||
                  ""
                );
              }

              return "";
            })
            .map((tool) => safeString(tool))
            .filter(Boolean);

          return {
            name: safeString(process?.name),
            description: safeString(
              process?.description
            ),
            steps,
            tools: processTools,
          };
        })
      : [createProcess()];

  const tools =
    Array.isArray(sop?.tools) &&
    sop.tools.length > 0
      ? sop.tools.map((tool) => {
          if (typeof tool === "string") {
            return {
              name: tool,
              description: "",
            };
          }

          return {
            name: safeString(
              tool?.name || tool?.title
            ),
            description: safeString(
              tool?.description
            ),
          };
        })
      : [createTool()];

  const policies =
    Array.isArray(sop?.policies) &&
    sop.policies.length > 0
      ? sop.policies.map((policy) => {
          if (typeof policy === "string") {
            return {
              name: policy,
              description: "",
            };
          }

          return {
            name: safeString(
              policy?.name || policy?.title
            ),
            description: safeString(
              policy?.description
            ),
          };
        })
      : [createPolicy()];

  const kpis =
    Array.isArray(sop?.kpis) &&
    sop.kpis.length > 0
      ? sop.kpis.map((kpi) => {
          if (typeof kpi === "string") {
            return {
              name: kpi,
              description: "",
              target: "",
            };
          }

          return {
            name: safeString(
              kpi?.name || kpi?.title
            ),
            description: safeString(
              kpi?.description
            ),
            target: safeString(kpi?.target),
          };
        })
      : [createKPI()];

  return {
    organization: safeString(sop?.organization),
    department: safeString(sop?.department),
    team: safeString(sop?.team),
    role: safeString(sop?.role),
    seniority: safeString(sop?.seniority),
    reportingManager: safeString(
      sop?.reportingManager
    ),
    location: safeString(sop?.location),

    employmentType:
      sop?.employmentType || "Full-Time",

    rolePurpose: safeString(
      sop?.rolePurpose
    ),

    responsibilities,

    processes,

    tools,

    policies,

    kpis,

    onboardingRequirements:
      normalizeStringArray(
        sop?.onboardingRequirements
      ),

    knowledgeRequirements:
      normalizeStringArray(
        sop?.knowledgeRequirements
      ),
  };
};

// ======================================================
// COMPONENT
// ======================================================

function RoleSOP() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [form, setForm] = useState(
    createDefaultForm()
  );

  const [loading, setLoading] = useState(
    isEditMode
  );

  const [saving, setSaving] = useState(false);

  // ====================================================
  // TEMPLATE STATE
  // ====================================================

  const [templates, setTemplates] = useState([]);

  const [templatesLoading, setTemplatesLoading] =
    useState(true);

  const [selectedTemplateId, setSelectedTemplateId] =
    useState("");

  const [selectedTemplate, setSelectedTemplate] =
    useState(null);

  const [templateApplied, setTemplateApplied] =
    useState(false);

  // ====================================================
  // ACTIVE SECTIONS
  // ====================================================

  const [activeSections, setActiveSections] =
    useState({
      rolePurpose: true,
      responsibilities: true,
      processes: true,
      tools: true,
      policies: true,
      kpis: true,
      onboardingRequirements: true,
      knowledgeRequirements: true,
    });

  // ====================================================
  // STYLES
  // ====================================================

  const inputClass = `
    w-full
    h-12
    px-4
    rounded-xl
    border
    border-[#E2E8F0]
    bg-white
    text-[#111827]
    outline-none
    transition
    focus:border-[#18D39A]
    focus:ring-2
    focus:ring-[#18D39A]/20
  `;

  const textareaClass = `
    w-full
    min-h-[120px]
    px-4
    py-3
    rounded-xl
    border
    border-[#E2E8F0]
    bg-white
    text-[#111827]
    outline-none
    resize-y
    transition
    focus:border-[#18D39A]
    focus:ring-2
    focus:ring-[#18D39A]/20
  `;

  // ====================================================
  // LOAD SOP TEMPLATES
  // ====================================================

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setTemplatesLoading(true);

        const response = await api.get(
          "/sop-templates"
        );

        const loadedTemplates =
          response.data?.templates ||
          response.data?.data ||
          [];

        setTemplates(
          Array.isArray(loadedTemplates)
            ? loadedTemplates.filter(
                (template) =>
                  template?.active !== false
              )
            : []
        );
      } catch (error) {
        console.error(
          "LOAD SOP TEMPLATES ERROR:",
          error
        );

        setTemplates([]);
      } finally {
        setTemplatesLoading(false);
      }
    };

    loadTemplates();
  }, []);

  // ====================================================
  // LOAD EDIT DATA
  // ====================================================

  useEffect(() => {
    if (!isEditMode) {
      setForm(createDefaultForm());
      setLoading(false);
      return;
    }

    const loadRoleSOP = async () => {
      try {
        setLoading(true);

        const response = await api.get(
          `/role-sops/${id}`
        );

        console.log(
          "ROLE SOP EDIT RESPONSE:",
          response.data
        );

        const sop =
          response.data?.roleSOP ||
          response.data?.data ||
          response.data;

        if (!sop) {
          throw new Error(
            "Role SOP not found."
          );
        }

        setForm(normalizeSOP(sop));
      } catch (error) {
        console.error(
          "LOAD ROLE SOP ERROR:",
          error
        );

        alert(
          error?.response?.data?.message ||
            "Failed to load Role SOP."
        );

        navigate("/manager/role-sops");
      } finally {
        setLoading(false);
      }
    };

    loadRoleSOP();
  }, [id, isEditMode, navigate]);

  // ====================================================
  // BASIC FIELD UPDATE
  // ====================================================

  const updateField = (
    field,
    value
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // ====================================================
  // APPLY TEMPLATE
  // ====================================================

  const applyTemplate = () => {
    if (!selectedTemplate) {
      alert(
        "Please select an SOP template first."
      );

      return;
    }

    const sections =
      selectedTemplate.sections || [];

    const newActiveSections = {
      rolePurpose: false,
      responsibilities: false,
      processes: false,
      tools: false,
      policies: false,
      kpis: false,
      onboardingRequirements: false,
      knowledgeRequirements: false,
    };

    sections.forEach((section) => {
      if (
        section?.enabled === false
      ) {
        return;
      }

      const key =
        TEMPLATE_SECTION_MAP[
          section?.key
        ];

      if (key) {
        newActiveSections[key] = true;
      }
    });

    setActiveSections(
      newActiveSections
    );

    // Automatically use template department
    // and role if the current form is empty.
    setForm((previous) => ({
      ...previous,

      department:
        previous.department.trim() ||
        selectedTemplate.department ||
        "",

      role:
        previous.role.trim() ||
        selectedTemplate.role ||
        "",
    }));

    setTemplateApplied(true);

    alert(
      `"${selectedTemplate.name}" template applied.`
    );
  };

  // ====================================================
  // RESET TEMPLATE
  // ====================================================

  const startFromScratch = () => {
    setSelectedTemplateId("");

    setSelectedTemplate(null);

    setTemplateApplied(false);

    setActiveSections({
      rolePurpose: true,
      responsibilities: true,
      processes: true,
      tools: true,
      policies: true,
      kpis: true,
      onboardingRequirements: true,
      knowledgeRequirements: true,
    });
  };

  // ====================================================
  // TEMPLATE SELECTION
  // ====================================================

  const handleTemplateChange = (
    event
  ) => {
    const templateId =
      event.target.value;

    setSelectedTemplateId(
      templateId
    );

    const template =
      templates.find(
        (item) =>
          String(item._id) ===
          String(templateId)
      );

    setSelectedTemplate(
      template || null
    );

    setTemplateApplied(false);
  };

  // ====================================================
  // GENERIC OBJECT ARRAY UPDATE
  // ====================================================

  const updateArrayItem = (
    section,
    index,
    field,
    value
  ) => {
    setForm((previous) => {
      const updated = [
        ...(previous[section] || []),
      ];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return {
        ...previous,
        [section]: updated,
      };
    });
  };

  // ====================================================
  // ADD ARRAY ITEM
  // ====================================================

  const addArrayItem = (
    section
  ) => {
    let item;

    switch (section) {
      case "responsibilities":
        item = createResponsibility();
        break;

      case "tools":
        item = createTool();
        break;

      case "policies":
        item = createPolicy();
        break;

      case "kpis":
        item = createKPI();
        break;

      default:
        item = "";
    }

    setForm((previous) => ({
      ...previous,
      [section]: [
        ...(previous[section] || []),
        item,
      ],
    }));
  };

  // ====================================================
  // REMOVE ARRAY ITEM
  // ====================================================

  const removeArrayItem = (
    section,
    index
  ) => {
    setForm((previous) => {
      const updated = [
        ...(previous[section] || []),
      ];

      updated.splice(index, 1);

      if (updated.length === 0) {
        switch (section) {
          case "responsibilities":
            updated.push(
              createResponsibility()
            );
            break;

          case "tools":
            updated.push(
              createTool()
            );
            break;

          case "policies":
            updated.push(
              createPolicy()
            );
            break;

          case "kpis":
            updated.push(
              createKPI()
            );
            break;

          default:
            updated.push("");
        }
      }

      return {
        ...previous,
        [section]: updated,
      };
    });
  };

  // ====================================================
  // STRING ARRAY UPDATE
  // ====================================================

  const updateStringArrayItem = (
    section,
    index,
    value
  ) => {
    setForm((previous) => {
      const updated = [
        ...(previous[section] || []),
      ];

      updated[index] = value;

      return {
        ...previous,
        [section]: updated,
      };
    });
  };

  // ====================================================
  // ADD STRING ARRAY ITEM
  // ====================================================

  const addStringArrayItem = (
    section
  ) => {
    setForm((previous) => ({
      ...previous,
      [section]: [
        ...(previous[section] || []),
        "",
      ],
    }));
  };

  // ====================================================
  // REMOVE STRING ARRAY ITEM
  // ====================================================

  const removeStringArrayItem = (
    section,
    index
  ) => {
    setForm((previous) => {
      const updated = [
        ...(previous[section] || []),
      ];

      updated.splice(index, 1);

      if (updated.length === 0) {
        updated.push("");
      }

      return {
        ...previous,
        [section]: updated,
      };
    });
  };

  // ====================================================
  // PROCESS UPDATE
  // ====================================================

  const updateProcess = (
    processIndex,
    field,
    value
  ) => {
    setForm((previous) => {
      const processes = [
        ...previous.processes,
      ];

      processes[processIndex] = {
        ...processes[processIndex],
        [field]: value,
      };

      return {
        ...previous,
        processes,
      };
    });
  };

  // ====================================================
  // ADD PROCESS
  // ====================================================

  const addProcess = () => {
    setForm((previous) => ({
      ...previous,
      processes: [
        ...previous.processes,
        createProcess(),
      ],
    }));
  };

  // ====================================================
  // REMOVE PROCESS
  // ====================================================

  const removeProcess = (
    processIndex
  ) => {
    setForm((previous) => {
      const processes =
        previous.processes.filter(
          (_, index) =>
            index !== processIndex
        );

      return {
        ...previous,
        processes:
          processes.length > 0
            ? processes
            : [createProcess()],
      };
    });
  };

  // ====================================================
  // PROCESS STEP UPDATE
  // ====================================================

  const updateProcessStep = (
    processIndex,
    stepIndex,
    field,
    value
  ) => {
    setForm((previous) => {
      const processes = [
        ...previous.processes,
      ];

      const steps = [
        ...(processes[processIndex]
          .steps || []),
      ];

      steps[stepIndex] = {
        ...steps[stepIndex],
        [field]: value,
      };

      processes[processIndex] = {
        ...processes[processIndex],
        steps,
      };

      return {
        ...previous,
        processes,
      };
    });
  };

  // ====================================================
  // ADD PROCESS STEP
  // ====================================================

  const addProcessStep = (
    processIndex
  ) => {
    setForm((previous) => {
      const processes = [
        ...previous.processes,
      ];

      const currentSteps =
        processes[processIndex]
          .steps || [];

      processes[processIndex] = {
        ...processes[processIndex],

        steps: [
          ...currentSteps,
          createProcessStep(
            currentSteps.length + 1
          ),
        ],
      };

      return {
        ...previous,
        processes,
      };
    });
  };

  // ====================================================
  // REMOVE PROCESS STEP
  // ====================================================

  const removeProcessStep = (
    processIndex,
    stepIndex
  ) => {
    setForm((previous) => {
      const processes = [
        ...previous.processes,
      ];

      let steps = [
        ...(processes[processIndex]
          .steps || []),
      ];

      steps.splice(stepIndex, 1);

      if (steps.length === 0) {
        steps = [
          createProcessStep(1),
        ];
      }

      steps = steps.map(
        (step, index) => ({
          ...step,
          stepNumber:
            index + 1,
        })
      );

      processes[processIndex] = {
        ...processes[processIndex],
        steps,
      };

      return {
        ...previous,
        processes,
      };
    });
  };

  // ====================================================
  // PROCESS TOOL UPDATE
  // ====================================================

  const updateProcessTool = (
    processIndex,
    toolIndex,
    value
  ) => {
    setForm((previous) => {
      const processes = [
        ...previous.processes,
      ];

      const tools = [
        ...(processes[processIndex]
          .tools || []),
      ];

      tools[toolIndex] = value;

      processes[processIndex] = {
        ...processes[processIndex],
        tools,
      };

      return {
        ...previous,
        processes,
      };
    });
  };

  // ====================================================
  // ADD PROCESS TOOL
  // ====================================================

  const addProcessTool = (
    processIndex
  ) => {
    setForm((previous) => {
      const processes = [
        ...previous.processes,
      ];

      processes[processIndex] = {
        ...processes[processIndex],
        tools: [
          ...(processes[processIndex]
            .tools || []),
          "",
        ],
      };

      return {
        ...previous,
        processes,
      };
    });
  };

  // ====================================================
  // REMOVE PROCESS TOOL
  // ====================================================

  const removeProcessTool = (
    processIndex,
    toolIndex
  ) => {
    setForm((previous) => {
      const processes = [
        ...previous.processes,
      ];

      const tools = [
        ...(processes[processIndex]
          .tools || []),
      ];

      tools.splice(toolIndex, 1);

      processes[processIndex] = {
        ...processes[processIndex],
        tools,
      };

      return {
        ...previous,
        processes,
      };
    });
  };

  // ====================================================
  // VALIDATION
  // ====================================================

  const validateForm = () => {
    if (!form.department.trim()) {
      alert(
        "Department is required."
      );

      return false;
    }

    if (!form.role.trim()) {
      alert(
        "Role is required."
      );

      return false;
    }

    if (!form.seniority) {
      alert(
        "Please select seniority."
      );

      return false;
    }

    return true;
  };

  // ====================================================
  // BUILD PAYLOAD
  // ====================================================

  const buildPayload = () => {
    const payload = {
      organization:
        form.organization.trim(),

      department:
        form.department.trim(),

      team:
        form.team.trim(),

      role:
        form.role.trim(),

      seniority:
        form.seniority,

      reportingManager:
        form.reportingManager.trim(),

      location:
        form.location.trim(),

      employmentType:
        form.employmentType,

      rolePurpose:
        form.rolePurpose.trim(),

      // ==================================================
      // RESPONSIBILITIES
      // ==================================================

      responsibilities:
        form.responsibilities
          .filter(
            (item) =>
              item?.title?.trim() ||
              item?.description?.trim()
          )
          .map((item) => ({
            title:
              item?.title?.trim() ||
              "",

            description:
              item?.description?.trim() ||
              "",
          })),

      // ==================================================
      // PROCESSES
      // ==================================================

      processes:
        form.processes
          .filter(
            (process) =>
              process?.name?.trim() ||
              process?.description?.trim() ||
              process?.steps?.some(
                (step) =>
                  step?.instruction?.trim()
              ) ||
              process?.tools?.some(
                (tool) =>
                  tool?.trim()
              )
          )
          .map((process) => ({
            name:
              process?.name?.trim() ||
              "",

            description:
              process?.description?.trim() ||
              "",

            steps:
              (process?.steps || [])
                .filter(
                  (step) =>
                    step?.instruction?.trim()
                )
                .map(
                  (step, index) => ({
                    stepNumber:
                      Number(
                        step?.stepNumber
                      ) ||
                      index + 1,

                    instruction:
                      step?.instruction?.trim() ||
                      "",

                    expectedOutcome:
                      step?.expectedOutcome?.trim() ||
                      "",

                    responsiblePerson:
                      step?.responsiblePerson?.trim() ||
                      "",

                    approver:
                      step?.approver?.trim() ||
                      "",
                  })
                ),

            tools:
              (process?.tools || [])
                .map((tool) =>
                  safeString(
                    tool
                  ).trim()
                )
                .filter(Boolean),
          })),

      // ==================================================
      // TOP LEVEL TOOLS
      // ==================================================

      tools:
        form.tools
          .filter(
            (tool) =>
              tool?.name?.trim() ||
              tool?.description?.trim()
          )
          .map((tool) => ({
            name:
              tool?.name?.trim() ||
              "",

            description:
              tool?.description?.trim() ||
              "",
          })),

      // ==================================================
      // POLICIES
      // ==================================================

      policies:
        form.policies
          .filter(
            (policy) =>
              policy?.name?.trim() ||
              policy?.description?.trim()
          )
          .map((policy) => ({
            name:
              policy?.name?.trim() ||
              "",

            description:
              policy?.description?.trim() ||
              "",
          })),

      // ==================================================
      // KPIs
      // ==================================================

      kpis:
        form.kpis
          .filter(
            (kpi) =>
              kpi?.name?.trim() ||
              kpi?.description?.trim() ||
              kpi?.target?.trim()
          )
          .map((kpi) => ({
            name:
              kpi?.name?.trim() ||
              "",

            description:
              kpi?.description?.trim() ||
              "",

            target:
              kpi?.target?.trim() ||
              "",
          })),

      // ==================================================
      // ONBOARDING
      // ==================================================

      onboardingRequirements:
        form.onboardingRequirements
          .map((item) =>
            safeString(
              item
            ).trim()
          )
          .filter(Boolean),

      // ==================================================
      // KNOWLEDGE
      // ==================================================

      knowledgeRequirements:
        form.knowledgeRequirements
          .map((item) =>
            safeString(
              item
            ).trim()
          )
          .filter(Boolean),
    };

    console.log(
      "FINAL ROLE SOP PAYLOAD:",
      JSON.stringify(
        payload,
        null,
        2
      )
    );

    return payload;
  };

  // ====================================================
  // SAVE
  // ====================================================

  const handleSave = async (
    publish = false
  ) => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const payload =
        buildPayload();

      const finalPayload = {
        ...payload,

        ...(publish
          ? {
              status: "Published",
            }
          : {}),
      };

      console.log(
        "SENDING ROLE SOP:",
        finalPayload
      );

      let response;

      if (isEditMode) {
        response = await api.put(
          `/role-sops/${id}`,
          finalPayload
        );
      } else {
        response = await api.post(
          "/role-sops",
          finalPayload
        );
      }

      console.log(
        "ROLE SOP SAVE RESPONSE:",
        response.data
      );

      alert(
        publish
          ? "Role SOP published successfully."
          : isEditMode
          ? "Role SOP updated successfully."
          : "Role SOP saved successfully."
      );

      navigate(
        "/manager/role-sops"
      );
    } catch (error) {
      console.error(
        "SAVE ROLE SOP ERROR:",
        error
      );

      console.error(
        "SERVER RESPONSE:",
        error?.response?.data
      );

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to save Role SOP.";

      alert(message);
    } finally {
      setSaving(false);
    }
  };

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div
            className="
              w-10
              h-10
              mx-auto
              rounded-full
              border-4
              border-[#18D39A]
              border-t-transparent
              animate-spin
            "
          />

          <p className="mt-4 text-[#64748B] font-medium">
            Loading Role SOP...
          </p>
        </div>
      </div>
    );
  }

  // ====================================================
  // PAGE
  // ====================================================

  return (
    <div className="w-full min-w-0 max-w-7xl mx-auto pb-20">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div
        className="
          flex
          flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-5
          mb-8
        "
      >
        <div className="min-w-0">
          <button
            type="button"
            onClick={() =>
              navigate(
                "/manager/role-sops"
              )
            }
            className="
              flex
              items-center
              gap-2
              text-[#64748B]
              hover:text-[#111827]
              font-medium
              mb-4
            "
          >
            <FaArrowLeft />
            Back to Role SOPs
          </button>

          <h1 className="text-3xl font-black text-[#111827]">
            {isEditMode
              ? "Edit Role SOP"
              : "Create Role SOP"}
          </h1>

          <p className="mt-2 text-[#64748B]">
            {isEditMode
              ? "Update the existing department and role-specific SOP."
              : "Create a customized SOP for a specific department and role."}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              navigate(
                "/manager/role-sops"
              )
            }
            disabled={saving}
            className="
              h-12
              px-5
              rounded-xl
              border
              border-[#E2E8F0]
              bg-white
              text-[#334155]
              font-semibold
              hover:bg-[#F8FAFC]
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() =>
              handleSave(false)
            }
            disabled={saving}
            className="
              h-12
              px-6
              rounded-xl
              border
              border-[#18D39A]
              text-[#18D39A]
              bg-white
              hover:bg-[#E8FFF6]
              font-semibold
              flex
              items-center
              gap-2
              disabled:opacity-50
            "
          >
            <FaSave />

            {saving
              ? "Saving..."
              : isEditMode
              ? "Save Changes"
              : "Save Role SOP"}
          </button>

          <button
            type="button"
            onClick={() =>
              handleSave(true)
            }
            disabled={saving}
            className="
              h-12
              px-6
              rounded-xl
              bg-[#18D39A]
              hover:bg-[#13B987]
              text-white
              font-semibold
              flex
              items-center
              gap-2
              shadow-md
              disabled:opacity-50
            "
          >
            <FaPaperPlane />

            {saving
              ? "Saving..."
              : isEditMode
              ? "Save & Publish"
              : "Save & Submit"}
          </button>
        </div>
      </div>

      {/* ==================================================
          SOP TEMPLATE
      ================================================== */}

      {!isEditMode && (
        <section
          className="
            bg-white
            rounded-2xl
            border
            border-[#E2E8F0]
            shadow-sm
            p-6
            md:p-8
            mb-6
          "
        >
          <div
            className="
              flex
              flex-col
              lg:flex-row
              lg:items-start
              lg:justify-between
              gap-6
            "
          >
            <div className="flex items-start gap-4 min-w-0">
              <div
                className="
                  w-12
                  h-12
                  rounded-xl
                  bg-[#E8FFF6]
                  text-[#18D39A]
                  flex
                  items-center
                  justify-center
                  flex-shrink-0
                "
              >
                <FaMagic />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-[#111827]">
                    Start with an SOP Template
                  </h2>

                  <span
                    className="
                      px-2
                      py-1
                      rounded-full
                      bg-[#E8FFF6]
                      text-[#0F9F73]
                      text-[10px]
                      font-bold
                      uppercase
                    "
                  >
                    Optional
                  </span>
                </div>

                <p className="mt-1 text-sm text-[#64748B] leading-6">
                  Choose a reusable template to
                  automatically configure which SOP
                  sections should be included.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={
                startFromScratch
              }
              className="
                text-sm
                font-semibold
                text-[#64748B]
                hover:text-[#111827]
                underline
                shrink-0
              "
            >
              Start from scratch
            </button>
          </div>

          <div
            className="
              mt-6
              grid
              grid-cols-1
              lg:grid-cols-[1fr_auto]
              gap-4
              items-end
            "
          >
            <div>
              <label
                className="
                  block
                  mb-2
                  text-sm
                  font-semibold
                  text-[#334155]
                "
              >
                Select Template
              </label>

              <select
                value={
                  selectedTemplateId
                }
                onChange={
                  handleTemplateChange
                }
                disabled={
                  templatesLoading
                }
                className={inputClass}
              >
                <option value="">
                  {templatesLoading
                    ? "Loading templates..."
                    : templates.length === 0
                    ? "No active templates available"
                    : "Choose an SOP template"}
                </option>

                {templates.map(
                  (template) => (
                    <option
                      key={
                        template._id
                      }
                      value={
                        template._id
                      }
                    >
                      {template.name}
                      {" — "}
                      {template.department}
                      {" / "}
                      {template.role}
                    </option>
                  )
                )}
              </select>
            </div>

            <button
              type="button"
              onClick={applyTemplate}
              disabled={
                !selectedTemplate ||
                templatesLoading
              }
              className="
                h-12
                px-6
                rounded-xl
                bg-[#18D39A]
                hover:bg-[#13B987]
                text-white
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                disabled:opacity-40
                disabled:cursor-not-allowed
                shrink-0
              "
            >
              <FaMagic />
              Apply Template
            </button>
          </div>

          {/* TEMPLATE PREVIEW */}

          {selectedTemplate && (
            <div
              className="
                mt-5
                rounded-xl
                border
                border-[#D7FBEF]
                bg-[#F8FFFC]
                p-5
              "
            >
              <div
                className="
                  flex
                  flex-col
                  sm:flex-row
                  sm:items-start
                  sm:justify-between
                  gap-4
                "
              >
                <div>
                  <h3 className="font-bold text-[#111827]">
                    {selectedTemplate.name}
                  </h3>

                  <p className="text-sm text-[#64748B] mt-1">
                    {selectedTemplate.description ||
                      "Reusable SOP structure"}
                  </p>
                </div>

                {templateApplied && (
                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      px-3
                      py-1.5
                      rounded-full
                      bg-[#E8FFF6]
                      text-[#0F9F73]
                      text-xs
                      font-bold
                      shrink-0
                    "
                  >
                    <FaCheckCircle />
                    Applied
                  </span>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {(
                  selectedTemplate.sections ||
                  []
                )
                  .filter(
                    (section) =>
                      section.enabled !==
                      false
                  )
                  .sort(
                    (a, b) =>
                      (a.order || 0) -
                      (b.order || 0)
                  )
                  .map(
                    (
                      section,
                      index
                    ) => (
                      <span
                        key={
                          section._id ||
                          `${section.key}-${index}`
                        }
                        className="
                          px-3
                          py-1.5
                          rounded-lg
                          bg-white
                          border
                          border-[#D7FBEF]
                          text-xs
                          font-semibold
                          text-[#334155]
                        "
                      >
                        {index + 1}.{" "}
                        {section.title}
                      </span>
                    )
                  )}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ==================================================
          1. ROLE INFORMATION
      ================================================== */}

      <FormSection
        number="1"
        title="Role Information"
        description="Define the organizational context and basic information for this role."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <FormField
            label="Organization"
            icon={<FaBuilding />}
          >
            <input
              value={
                form.organization
              }
              onChange={(e) =>
                updateField(
                  "organization",
                  e.target.value
                )
              }
              placeholder="Company name"
              className={inputClass}
            />
          </FormField>

          <FormField
            label="Department"
            required
            icon={<FaBuilding />}
          >
            <input
              value={
                form.department
              }
              onChange={(e) =>
                updateField(
                  "department",
                  e.target.value
                )
              }
              placeholder="e.g. Marketing"
              className={inputClass}
            />
          </FormField>

          <FormField
            label="Team"
            icon={<FaUsers />}
          >
            <input
              value={form.team}
              onChange={(e) =>
                updateField(
                  "team",
                  e.target.value
                )
              }
              placeholder="e.g. Digital Marketing"
              className={inputClass}
            />
          </FormField>

          <FormField
            label="Role"
            required
            icon={<FaBriefcase />}
          >
            <input
              value={form.role}
              onChange={(e) =>
                updateField(
                  "role",
                  e.target.value
                )
              }
              placeholder="e.g. Marketing Executive"
              className={inputClass}
            />
          </FormField>

          <FormField
            label="Seniority"
            required
            icon={<FaUserTie />}
          >
            <select
              value={
                form.seniority
              }
              onChange={(e) =>
                updateField(
                  "seniority",
                  e.target.value
                )
              }
              className={inputClass}
            >
              <option value="">
                Select seniority
              </option>

              <option value="Intern">
                Intern
              </option>

              <option value="Junior">
                Junior
              </option>

              <option value="Mid-Level">
                Mid-Level
              </option>

              <option value="Senior">
                Senior
              </option>

              <option value="Lead">
                Lead
              </option>

              <option value="Manager">
                Manager
              </option>

              <option value="Director">
                Director
              </option>
            </select>
          </FormField>

          <FormField
            label="Reporting Manager"
            icon={<FaUserTie />}
          >
            <input
              value={
                form.reportingManager
              }
              onChange={(e) =>
                updateField(
                  "reportingManager",
                  e.target.value
                )
              }
              placeholder="Manager name / role"
              className={inputClass}
            />
          </FormField>

          <FormField
            label="Location"
            icon={<FaMapMarkerAlt />}
          >
            <input
              value={form.location}
              onChange={(e) =>
                updateField(
                  "location",
                  e.target.value
                )
              }
              placeholder="e.g. Bangalore"
              className={inputClass}
            />
          </FormField>

          <FormField label="Employment Type">
            <select
              value={
                form.employmentType
              }
              onChange={(e) =>
                updateField(
                  "employmentType",
                  e.target.value
                )
              }
              className={inputClass}
            >
              <option value="Full-Time">
                Full-Time
              </option>

              <option value="Part-Time">
                Part-Time
              </option>

              <option value="Contract">
                Contract
              </option>

              <option value="Internship">
                Internship
              </option>

              <option value="Temporary">
                Temporary
              </option>
            </select>
          </FormField>

        </div>
      </FormSection>

      {/* ==================================================
          2. ROLE PURPOSE
      ================================================== */}

      {activeSections.rolePurpose && (
        <FormSection
          number="2"
          title="Role Purpose"
          description="Explain the primary purpose and expected contribution of this role."
        >
          <textarea
            value={
              form.rolePurpose
            }
            onChange={(e) =>
              updateField(
                "rolePurpose",
                e.target.value
              )
            }
            placeholder="Explain the primary purpose of this role..."
            className={textareaClass}
          />
        </FormSection>
      )}

      {/* ==================================================
          3. RESPONSIBILITIES
      ================================================== */}

      {activeSections.responsibilities && (
        <FormSection
          number="3"
          title="Responsibilities"
          description="Define the major responsibilities and duties of the employee."
          action={
            <button
              type="button"
              onClick={() =>
                addArrayItem(
                  "responsibilities"
                )
              }
              className={addButtonClass}
            >
              <FaPlus />
              Add Responsibility
            </button>
          }
        >
          <div className="space-y-4">
            {form.responsibilities.map(
              (item, index) => (
                <div
                  key={index}
                  className={itemCardClass}
                >
                  <div className="flex-1 min-w-0">
                    <input
                      value={
                        item.title
                      }
                      onChange={(e) =>
                        updateArrayItem(
                          "responsibilities",
                          index,
                          "title",
                          e.target.value
                        )
                      }
                      placeholder="Responsibility title"
                      className={inputClass}
                    />

                    <textarea
                      value={
                        item.description
                      }
                      onChange={(e) =>
                        updateArrayItem(
                          "responsibilities",
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Describe this responsibility..."
                      className={`${textareaClass} mt-3`}
                    />
                  </div>

                  <DeleteButton
                    onClick={() =>
                      removeArrayItem(
                        "responsibilities",
                        index
                      )
                    }
                  />
                </div>
              )
            )}
          </div>
        </FormSection>
      )}

      {/* ==================================================
          4. PROCESSES
      ================================================== */}

      {activeSections.processes && (
        <FormSection
          number="4"
          title="Processes"
          description="Define the important processes this role is responsible for."
          action={
            <button
              type="button"
              onClick={addProcess}
              className={addButtonClass}
            >
              <FaPlus />
              Add Process
            </button>
          }
        >
          <div className="space-y-6">

            {form.processes.map(
              (
                process,
                processIndex
              ) => (
                <div
                  key={processIndex}
                  className="
                    rounded-2xl
                    border
                    border-[#E2E8F0]
                    p-6
                    bg-[#FAFCFB]
                    min-w-0
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-4
                      mb-5
                    "
                  >
                    <h3 className="font-bold text-[#111827]">
                      Process{" "}
                      {processIndex + 1}
                    </h3>

                    <DeleteButton
                      onClick={() =>
                        removeProcess(
                          processIndex
                        )
                      }
                    />
                  </div>

                  <input
                    value={
                      process.name
                    }
                    onChange={(e) =>
                      updateProcess(
                        processIndex,
                        "name",
                        e.target.value
                      )
                    }
                    placeholder="Process name"
                    className={inputClass}
                  />

                  <textarea
                    value={
                      process.description
                    }
                    onChange={(e) =>
                      updateProcess(
                        processIndex,
                        "description",
                        e.target.value
                      )
                    }
                    placeholder="Describe the process..."
                    className={`${textareaClass} mt-4`}
                  />

                  {/* PROCESS STEPS */}

                  <div className="mt-6">
                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        mb-4
                      "
                    >
                      <h4 className="font-semibold text-[#334155]">
                        Process Steps
                      </h4>

                      <button
                        type="button"
                        onClick={() =>
                          addProcessStep(
                            processIndex
                          )
                        }
                        className="
                          text-sm
                          font-semibold
                          text-[#18D39A]
                          flex
                          items-center
                          gap-1
                        "
                      >
                        <FaPlus />
                        Add Step
                      </button>
                    </div>

                    <div className="space-y-4">

                      {process.steps.map(
                        (
                          step,
                          stepIndex
                        ) => (
                          <div
                            key={
                              stepIndex
                            }
                            className="
                              bg-white
                              border
                              border-[#E2E8F0]
                              rounded-xl
                              p-4
                            "
                          >
                            <div
                              className="
                                flex
                                items-start
                                gap-3
                              "
                            >
                              <div
                                className="
                                  w-9
                                  h-9
                                  rounded-full
                                  bg-[#E8FFF6]
                                  text-[#18D39A]
                                  flex
                                  items-center
                                  justify-center
                                  font-bold
                                  flex-shrink-0
                                "
                              >
                                {stepIndex +
                                  1}
                              </div>

                              <div className="flex-1 min-w-0">

                                <textarea
                                  value={
                                    step.instruction
                                  }
                                  onChange={(e) =>
                                    updateProcessStep(
                                      processIndex,
                                      stepIndex,
                                      "instruction",
                                      e.target.value
                                    )
                                  }
                                  placeholder={`Step ${
                                    stepIndex +
                                    1
                                  } instruction`}
                                  className={`
                                    ${textareaClass}
                                    min-h-[90px]
                                  `}
                                />

                                <div
                                  className="
                                    grid
                                    grid-cols-1
                                    md:grid-cols-2
                                    gap-3
                                    mt-3
                                  "
                                >
                                  <input
                                    value={
                                      step.expectedOutcome
                                    }
                                    onChange={(e) =>
                                      updateProcessStep(
                                        processIndex,
                                        stepIndex,
                                        "expectedOutcome",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Expected outcome"
                                    className={inputClass}
                                  />

                                  <input
                                    value={
                                      step.responsiblePerson
                                    }
                                    onChange={(e) =>
                                      updateProcessStep(
                                        processIndex,
                                        stepIndex,
                                        "responsiblePerson",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Responsible person"
                                    className={inputClass}
                                  />

                                  <input
                                    value={
                                      step.approver
                                    }
                                    onChange={(e) =>
                                      updateProcessStep(
                                        processIndex,
                                        stepIndex,
                                        "approver",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Approver"
                                    className={inputClass}
                                  />
                                </div>

                              </div>

                              <DeleteButton
                                onClick={() =>
                                  removeProcessStep(
                                    processIndex,
                                    stepIndex
                                  )
                                }
                              />
                            </div>
                          </div>
                        )
                      )}

                    </div>
                  </div>

                  {/* PROCESS TOOLS */}

                  <div className="mt-6">

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        mb-3
                      "
                    >
                      <div className="flex items-center gap-2">
                        <FaTools className="text-[#64748B]" />

                        <h4 className="font-semibold text-[#334155]">
                          Process Tools
                        </h4>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          addProcessTool(
                            processIndex
                          )
                        }
                        className="
                          text-sm
                          font-semibold
                          text-[#18D39A]
                          flex
                          items-center
                          gap-1
                        "
                      >
                        <FaPlus />
                        Add Tool
                      </button>
                    </div>

                    <div className="space-y-3">

                      {(process.tools || []).map(
                        (
                          tool,
                          toolIndex
                        ) => (
                          <div
                            key={
                              toolIndex
                            }
                            className="
                              flex
                              gap-3
                              items-center
                            "
                          >
                            <input
                              value={
                                tool
                              }
                              onChange={(e) =>
                                updateProcessTool(
                                  processIndex,
                                  toolIndex,
                                  e.target.value
                                )
                              }
                              placeholder="e.g. Google Ads"
                              className={inputClass}
                            />

                            <DeleteButton
                              onClick={() =>
                                removeProcessTool(
                                  processIndex,
                                  toolIndex
                                )
                              }
                            />
                          </div>
                        )
                      )}

                      {(process.tools || [])
                        .length ===
                        0 && (
                        <p className="text-sm text-[#94A3B8]">
                          No process-specific tools added.
                        </p>
                      )}

                    </div>
                  </div>

                </div>
              )
            )}

          </div>
        </FormSection>
      )}

      {/* ==================================================
          5. TOOLS
      ================================================== */}

      {activeSections.tools && (
        <FormSection
          number="5"
          title="Tools"
          description="Define the tools and software required for this role."
          action={
            <button
              type="button"
              onClick={() =>
                addArrayItem("tools")
              }
              className={addButtonClass}
            >
              <FaPlus />
              Add Tool
            </button>
          }
        >
          <div className="space-y-4">

            {form.tools.map(
              (tool, index) => (
                <div
                  key={index}
                  className={itemCardClass}
                >
                  <div className="flex-1 min-w-0">

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        mb-2
                        text-[#64748B]
                        text-sm
                        font-semibold
                      "
                    >
                      <FaTools />
                      Tool {index + 1}
                    </div>

                    <input
                      value={
                        tool.name
                      }
                      onChange={(e) =>
                        updateArrayItem(
                          "tools",
                          index,
                          "name",
                          e.target.value
                        )
                      }
                      placeholder="e.g. Google Ads"
                      className={inputClass}
                    />

                    <input
                      value={
                        tool.description
                      }
                      onChange={(e) =>
                        updateArrayItem(
                          "tools",
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Tool description"
                      className={`${inputClass} mt-3`}
                    />

                  </div>

                  <DeleteButton
                    onClick={() =>
                      removeArrayItem(
                        "tools",
                        index
                      )
                    }
                  />
                </div>
              )
            )}

          </div>
        </FormSection>
      )}

      {/* ==================================================
          6. POLICIES
      ================================================== */}

      {activeSections.policies && (
        <FormSection
          number="6"
          title="Policies"
          description="Define policies the employee must understand and follow."
          action={
            <button
              type="button"
              onClick={() =>
                addArrayItem(
                  "policies"
                )
              }
              className={addButtonClass}
            >
              <FaPlus />
              Add Policy
            </button>
          }
        >
          <div className="space-y-4">

            {form.policies.map(
              (policy, index) => (
                <div
                  key={index}
                  className={itemCardClass}
                >
                  <div className="flex-1 min-w-0">

                    <input
                      value={
                        policy.name
                      }
                      onChange={(e) =>
                        updateArrayItem(
                          "policies",
                          index,
                          "name",
                          e.target.value
                        )
                      }
                      placeholder="Policy name"
                      className={inputClass}
                    />

                    <textarea
                      value={
                        policy.description
                      }
                      onChange={(e) =>
                        updateArrayItem(
                          "policies",
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Policy description"
                      className={`${textareaClass} mt-3`}
                    />

                  </div>

                  <DeleteButton
                    onClick={() =>
                      removeArrayItem(
                        "policies",
                        index
                      )
                    }
                  />
                </div>
              )
            )}

          </div>
        </FormSection>
      )}

      {/* ==================================================
          7. KPIs
      ================================================== */}

      {activeSections.kpis && (
        <FormSection
          number="7"
          title="KPIs"
          description="Define measurable performance indicators for the role."
          action={
            <button
              type="button"
              onClick={() =>
                addArrayItem("kpis")
              }
              className={addButtonClass}
            >
              <FaPlus />
              Add KPI
            </button>
          }
        >
          <div className="space-y-4">

            {form.kpis.map(
              (kpi, index) => (
                <div
                  key={index}
                  className={itemCardClass}
                >
                  <div className="flex-1 min-w-0">

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        mb-3
                        text-[#64748B]
                        font-semibold
                      "
                    >
                      <FaBullseye />
                      KPI {index + 1}
                    </div>

                    <div
                      className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        gap-3
                      "
                    >
                      <input
                        value={
                          kpi.name
                        }
                        onChange={(e) =>
                          updateArrayItem(
                            "kpis",
                            index,
                            "name",
                            e.target.value
                          )
                        }
                        placeholder="KPI name"
                        className={inputClass}
                      />

                      <input
                        value={
                          kpi.target
                        }
                        onChange={(e) =>
                          updateArrayItem(
                            "kpis",
                            index,
                            "target",
                            e.target.value
                          )
                        }
                        placeholder="Target"
                        className={inputClass}
                      />
                    </div>

                    <textarea
                      value={
                        kpi.description
                      }
                      onChange={(e) =>
                        updateArrayItem(
                          "kpis",
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Describe the KPI..."
                      className={`${textareaClass} mt-3`}
                    />

                  </div>

                  <DeleteButton
                    onClick={() =>
                      removeArrayItem(
                        "kpis",
                        index
                      )
                    }
                  />
                </div>
              )
            )}

          </div>
        </FormSection>
      )}

      {/* ==================================================
          8. ONBOARDING REQUIREMENTS
      ================================================== */}

      {activeSections.onboardingRequirements && (
        <FormSection
          number="8"
          title="Onboarding Requirements"
          description="Define what a new employee must complete."
          action={
            <button
              type="button"
              onClick={() =>
                addStringArrayItem(
                  "onboardingRequirements"
                )
              }
              className={addButtonClass}
            >
              <FaPlus />
              Add Requirement
            </button>
          }
        >
          <StringArraySection
            items={
              form.onboardingRequirements
            }
            placeholder="e.g. Complete company induction"
            onChange={
              updateStringArrayItem
            }
            onRemove={
              removeStringArrayItem
            }
            section="onboardingRequirements"
          />
        </FormSection>
      )}

      {/* ==================================================
          9. KNOWLEDGE REQUIREMENTS
      ================================================== */}

      {activeSections.knowledgeRequirements && (
        <FormSection
          number="9"
          title="Knowledge Requirements"
          description="Define the knowledge an employee needs for this role."
          action={
            <button
              type="button"
              onClick={() =>
                addStringArrayItem(
                  "knowledgeRequirements"
                )
              }
              className={addButtonClass}
            >
              <FaPlus />
              Add Knowledge
            </button>
          }
        >
          <StringArraySection
            items={
              form.knowledgeRequirements
            }
            placeholder="e.g. Digital marketing fundamentals"
            onChange={
              updateStringArrayItem
            }
            onRemove={
              removeStringArrayItem
            }
            section="knowledgeRequirements"
          />
        </FormSection>
      )}

      {/* ==================================================
          BOTTOM ACTIONS
      ================================================== */}

      <div
        className="
          flex
          flex-col
          sm:flex-row
          justify-end
          gap-3
          mt-8
        "
      >
        <button
          type="button"
          onClick={() =>
            navigate(
              "/manager/role-sops"
            )
          }
          disabled={saving}
          className="
            h-12
            px-6
            rounded-xl
            border
            border-[#E2E8F0]
            bg-white
            text-[#334155]
            font-semibold
          "
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={() =>
            handleSave(false)
          }
          disabled={saving}
          className="
            h-12
            px-6
            rounded-xl
            border
            border-[#18D39A]
            text-[#18D39A]
            font-semibold
            flex
            items-center
            justify-center
            gap-2
            disabled:opacity-50
          "
        >
          <FaSave />

          {saving
            ? "Saving..."
            : isEditMode
            ? "Save Changes"
            : "Save Role SOP"}
        </button>

        <button
          type="button"
          onClick={() =>
            handleSave(true)
          }
          disabled={saving}
          className="
            h-12
            px-6
            rounded-xl
            bg-[#18D39A]
            hover:bg-[#13B987]
            text-white
            font-semibold
            flex
            items-center
            justify-center
            gap-2
            disabled:opacity-50
          "
        >
          <FaPaperPlane />

          {saving
            ? "Saving..."
            : isEditMode
            ? "Save & Publish"
            : "Save & Submit"}
        </button>
      </div>
    </div>
  );
}

// ======================================================
// FORM SECTION
// ======================================================

function FormSection({
  number,
  title,
  description,
  action,
  children,
}) {
  return (
    <section
      className="
        bg-white
        rounded-2xl
        border
        border-[#E2E8F0]
        shadow-sm
        p-6
        md:p-8
        mb-6
        min-w-0
      "
    >
      <div
        className="
          flex
          flex-col
          md:flex-row
          md:items-start
          md:justify-between
          gap-4
          mb-6
        "
      >
        <div className="flex items-start gap-4 min-w-0">

          <div
            className="
              w-10
              h-10
              rounded-xl
              bg-[#E8FFF6]
              text-[#18D39A]
              flex
              items-center
              justify-center
              font-black
              flex-shrink-0
            "
          >
            {number}
          </div>

          <div className="min-w-0">
            <h2
              className="
                text-xl
                font-bold
                text-[#111827]
              "
            >
              {title}
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-[#64748B]
              "
            >
              {description}
            </p>
          </div>
        </div>

        {action}
      </div>

      {children}
    </section>
  );
}

// ======================================================
// FORM FIELD
// ======================================================

function FormField({
  label,
  required,
  icon,
  children,
}) {
  return (
    <div className="min-w-0">
      <label
        className="
          flex
          items-center
          gap-2
          mb-2
          text-sm
          font-semibold
          text-[#334155]
        "
      >
        {icon}

        {label}

        {required && (
          <span className="text-red-500">
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
}

// ======================================================
// DELETE BUTTON
// ======================================================

function DeleteButton({
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-11
        h-11
        rounded-xl
        border
        border-red-200
        text-red-500
        hover:bg-red-50
        flex
        items-center
        justify-center
        flex-shrink-0
      "
      title="Delete"
    >
      <FaTrash />
    </button>
  );
}

// ======================================================
// STRING ARRAY SECTION
// ======================================================

function StringArraySection({
  items,
  placeholder,
  onChange,
  onRemove,
  section,
}) {
  return (
    <div className="space-y-4">

      {items.map(
        (item, index) => (
          <div
            key={index}
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-[#E2E8F0]
              bg-[#FAFCFB]
              p-5
              min-w-0
            "
          >
            <div
              className="
                w-8
                h-8
                rounded-full
                bg-[#E8FFF6]
                text-[#18D39A]
                flex
                items-center
                justify-center
                font-bold
                flex-shrink-0
              "
            >
              {index + 1}
            </div>

            <input
              value={item || ""}
              onChange={(e) =>
                onChange(
                  section,
                  index,
                  e.target.value
                )
              }
              placeholder={
                placeholder
              }
              className="
                w-full
                h-12
                px-4
                rounded-xl
                border
                border-[#E2E8F0]
                bg-white
                text-[#111827]
                outline-none
                focus:border-[#18D39A]
                focus:ring-2
                focus:ring-[#18D39A]/20
                min-w-0
              "
            />

            <DeleteButton
              onClick={() =>
                onRemove(
                  section,
                  index
                )
              }
            />
          </div>
        )
      )}

    </div>
  );
}

// ======================================================
// BUTTON STYLE
// ======================================================

const addButtonClass = `
  h-10
  px-4
  rounded-xl
  bg-[#E8FFF6]
  text-[#0F9F73]
  font-semibold
  text-sm
  flex
  items-center
  gap-2
  hover:bg-[#D7FBEF]
  transition
  shrink-0
`;

const itemCardClass = `
  flex
  items-start
  gap-4
  rounded-2xl
  border
  border-[#E2E8F0]
  bg-[#FAFCFB]
  p-5
  min-w-0
`;

export default RoleSOP;