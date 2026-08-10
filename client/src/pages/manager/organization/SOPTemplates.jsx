import { useEffect, useMemo, useState } from "react";
import {
  FaBookOpen,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaCopy,
  FaTimes,
  FaSave,
  FaLayerGroup,
  FaSpinner,
} from "react-icons/fa";
import toast from "react-hot-toast";

import api from "../../../services/api";

// =====================================================
// AVAILABLE ROLE SOP SECTIONS
// =====================================================

const DEFAULT_SECTIONS = [
  {
    key: "rolePurpose",
    title: "Role Purpose",
  },
  {
    key: "responsibilities",
    title: "Responsibilities",
  },
  {
    key: "processes",
    title: "Processes & Procedures",
  },
  {
    key: "tools",
    title: "Tools & Technologies",
  },
  {
    key: "policies",
    title: "Policies & Guidelines",
  },
  {
    key: "kpis",
    title: "KPIs & Performance",
  },
  {
    key: "onboardingRequirements",
    title: "Onboarding Requirements",
  },
  {
    key: "knowledgeRequirements",
    title: "Knowledge Requirements",
  },
];

// =====================================================
// EMPTY FORM
// =====================================================

const getEmptyForm = () => ({
  name: "",
  department: "",
  role: "",
  description: "",
  sections: [
    {
      key: "rolePurpose",
      title: "Role Purpose",
      enabled: true,
      required: false,
      order: 1,
    },
    {
      key: "responsibilities",
      title: "Responsibilities",
      enabled: true,
      required: false,
      order: 2,
    },
    {
      key: "processes",
      title: "Processes & Procedures",
      enabled: true,
      required: false,
      order: 3,
    },
    {
      key: "tools",
      title: "Tools & Technologies",
      enabled: true,
      required: false,
      order: 4,
    },
  ],
});

// =====================================================
// COMPONENT
// =====================================================

function SOPTemplates() {
  const [templates, setTemplates] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  const [duplicatingId, setDuplicatingId] =
    useState(null);

  const [showModal, setShowModal] =
    useState(false);

  const [editingTemplate, setEditingTemplate] =
    useState(null);

  const [form, setForm] =
    useState(getEmptyForm());

  // =====================================================
  // LOAD TEMPLATES
  // =====================================================

  const loadTemplates = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/sop-templates"
      );

      setTemplates(
        response.data.templates || []
      );
    } catch (error) {
      console.error(
        "LOAD SOP TEMPLATES ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load SOP templates."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadTemplates();
  }, []);

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredTemplates = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return templates;
    }

    return templates.filter((template) =>
      [
        template.name,
        template.department,
        template.role,
        template.description,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [templates, search]);

  // =====================================================
  // OPEN CREATE
  // =====================================================

  const openCreate = () => {
    setEditingTemplate(null);

    setForm(getEmptyForm());

    setShowModal(true);
  };

  // =====================================================
  // OPEN EDIT
  // =====================================================

  const openEdit = (template) => {
    setEditingTemplate(template);

    const sections =
      Array.isArray(template.sections) &&
      template.sections.length > 0
        ? template.sections.map(
            (section, index) => ({
              key: section.key,
              title: section.title,
              description:
                section.description || "",
              enabled:
                section.enabled !== false,
              required:
                section.required === true,
              order:
                section.order ||
                index + 1,
            })
          )
        : getEmptyForm().sections;

    setForm({
      name: template.name || "",
      department:
        template.department || "",
      role: template.role || "",
      description:
        template.description || "",
      sections,
    });

    setShowModal(true);
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);

    setEditingTemplate(null);

    setForm(getEmptyForm());
  };

  // =====================================================
  // ADD SECTION
  // =====================================================

  const addSection = () => {
    const usedKeys = form.sections.map(
      (section) => section.key
    );

    const nextSection =
      DEFAULT_SECTIONS.find(
        (section) =>
          !usedKeys.includes(section.key)
      );

    if (!nextSection) {
      toast.error(
        "All available SOP sections have already been added."
      );

      return;
    }

    setForm((current) => ({
      ...current,

      sections: [
        ...current.sections,
        {
          key: nextSection.key,
          title: nextSection.title,
          description: "",
          enabled: true,
          required: false,
          order:
            current.sections.length + 1,
        },
      ],
    }));
  };

  // =====================================================
  // REMOVE SECTION
  // =====================================================

  const removeSection = (index) => {
    setForm((current) => {
      if (current.sections.length === 1) {
        toast.error(
          "A template must contain at least one section."
        );

        return current;
      }

      const sections =
        current.sections.filter(
          (_, sectionIndex) =>
            sectionIndex !== index
        );

      return {
        ...current,

        sections: sections.map(
          (section, sectionIndex) => ({
            ...section,
            order:
              sectionIndex + 1,
          })
        ),
      };
    });
  };

  // =====================================================
  // CHANGE SECTION
  // =====================================================

  const updateSection = (
    index,
    field,
    value
  ) => {
    setForm((current) => {
      const sections = [
        ...current.sections,
      ];

      sections[index] = {
        ...sections[index],
        [field]: value,
      };

      return {
        ...current,
        sections,
      };
    });
  };

  // =====================================================
  // MOVE SECTION UP
  // =====================================================

  const moveSectionUp = (index) => {
    if (index === 0) {
      return;
    }

    setForm((current) => {
      const sections = [
        ...current.sections,
      ];

      [
        sections[index - 1],
        sections[index],
      ] = [
        sections[index],
        sections[index - 1],
      ];

      return {
        ...current,

        sections: sections.map(
          (section, sectionIndex) => ({
            ...section,
            order:
              sectionIndex + 1,
          })
        ),
      };
    });
  };

  // =====================================================
  // MOVE SECTION DOWN
  // =====================================================

  const moveSectionDown = (index) => {
    if (
      index ===
      form.sections.length - 1
    ) {
      return;
    }

    setForm((current) => {
      const sections = [
        ...current.sections,
      ];

      [
        sections[index],
        sections[index + 1],
      ] = [
        sections[index + 1],
        sections[index],
      ];

      return {
        ...current,

        sections: sections.map(
          (section, sectionIndex) => ({
            ...section,
            order:
              sectionIndex + 1,
          })
        ),
      };
    });
  };

  // =====================================================
  // SAVE TEMPLATE
  // =====================================================

  const handleSave = async (event) => {
    event.preventDefault();

    const name =
      form.name.trim();

    const department =
      form.department.trim();

    const role =
      form.role.trim();

    const description =
      form.description.trim();

    const sections =
      form.sections
        .filter(
          (section) =>
            section.key &&
            section.title
        )
        .map(
          (section, index) => ({
            key: section.key,
            title:
              section.title.trim(),
            description:
              section.description?.trim() ||
              "",
            enabled:
              section.enabled !== false,
            required:
              section.required === true,
            order:
              index + 1,
          })
        );

    if (!name) {
      toast.error(
        "Please enter a template name."
      );

      return;
    }

    if (!department) {
      toast.error(
        "Please enter a department."
      );

      return;
    }

    if (!role) {
      toast.error(
        "Please enter a role."
      );

      return;
    }

    if (sections.length === 0) {
      toast.error(
        "Please add at least one SOP section."
      );

      return;
    }

    try {
      setSaving(true);

      const payload = {
        name,
        department,
        role,
        description,
        sections,
      };

      if (editingTemplate) {
        const response =
          await api.put(
            `/sop-templates/${editingTemplate._id}`,
            payload
          );

        const updatedTemplate =
          response.data.template;

        setTemplates((current) =>
          current.map((template) =>
            template._id ===
            updatedTemplate._id
              ? updatedTemplate
              : template
          )
        );

        toast.success(
          "SOP template updated successfully."
        );
      } else {
        const response =
          await api.post(
            "/sop-templates",
            payload
          );

        const newTemplate =
          response.data.template;

        setTemplates((current) => [
          newTemplate,
          ...current,
        ]);

        toast.success(
          "SOP template created successfully."
        );
      }

      closeModal();
    } catch (error) {
      console.error(
        "SAVE SOP TEMPLATE ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to save SOP template."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const deleteTemplate = async (
    template
  ) => {
    const confirmed =
      window.confirm(
        `Delete "${template.name}"? This action cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(template._id);

      await api.delete(
        `/sop-templates/${template._id}`
      );

      setTemplates((current) =>
        current.filter(
          (item) =>
            item._id !== template._id
        )
      );

      toast.success(
        "SOP template deleted successfully."
      );
    } catch (error) {
      console.error(
        "DELETE SOP TEMPLATE ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to delete SOP template."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================================
  // DUPLICATE
  // =====================================================

  const duplicateTemplate = async (
    template
  ) => {
    try {
      setDuplicatingId(
        template._id
      );

      const response =
        await api.post(
          `/sop-templates/${template._id}/duplicate`
        );

      const duplicated =
        response.data.template;

      setTemplates((current) => [
        duplicated,
        ...current,
      ]);

      toast.success(
        "SOP template duplicated successfully."
      );
    } catch (error) {
      console.error(
        "DUPLICATE SOP TEMPLATE ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to duplicate SOP template."
      );
    } finally {
      setDuplicatingId(null);
    }
  };

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "";
    }

    return parsedDate.toLocaleDateString(
      [],
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="w-full min-w-0">
        <div
          className="
            bg-white
            rounded-2xl
            border
            border-slate-200
            shadow-sm
            p-12
            flex
            flex-col
            items-center
            justify-center
          "
        >
          <FaSpinner
            className="
              animate-spin
              text-[#19D68C]
              text-2xl
            "
          />

          <p className="mt-4 text-sm text-slate-500">
            Loading SOP templates...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="w-full min-w-0">
      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="
          bg-white
          rounded-2xl
          border
          border-slate-200
          shadow-sm
          p-6
        "
      >
        <div
          className="
            flex
            flex-col
            lg:flex-row
            lg:items-center
            lg:justify-between
            gap-5
          "
        >
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div
                className="
                  w-12
                  h-12
                  rounded-xl
                  bg-[#19D68C]/10
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
              >
                <FaBookOpen className="text-[#19D68C] text-xl" />
              </div>

              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-slate-900">
                  SOP Templates
                </h1>

                <p className="text-sm text-slate-500 mt-1">
                  Create reusable SOP structures
                  for departments and roles.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              px-5
              py-3
              rounded-xl
              bg-[#19D68C]
              text-white
              font-semibold
              shadow-sm
              hover:bg-[#15C67D]
              transition
              shrink-0
            "
          >
            <FaPlus />
            Create Template
          </button>
        </div>
      </div>

      {/* =================================================
          INFO
      ================================================= */}

      <div
        className="
          mt-5
          bg-[#F0FDF8]
          border
          border-[#B8F1DA]
          rounded-2xl
          p-6
        "
      >
        <div className="flex items-start gap-4">
          <div
            className="
              w-11
              h-11
              rounded-xl
              bg-white
              flex
              items-center
              justify-center
              shrink-0
            "
          >
            <FaLayerGroup className="text-[#19D68C]" />
          </div>

          <div className="min-w-0">
            <h2 className="font-bold text-slate-900">
              Build reusable SOP structures
            </h2>

            <p className="text-sm text-slate-600 mt-1 leading-6">
              Templates define the structure of
              role-based SOPs. Managers can reuse
              them when creating new SOPs instead of
              starting from scratch.
            </p>
          </div>
        </div>
      </div>

      {/* =================================================
          SEARCH
      ================================================= */}

      <div
        className="
          mt-5
          bg-white
          rounded-2xl
          border
          border-slate-200
          shadow-sm
          p-5
        "
      >
        <div className="relative max-w-xl">
          <FaSearch
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search templates..."
            className="
              w-full
              h-12
              pl-11
              pr-4
              rounded-xl
              border
              border-slate-200
              outline-none
              text-sm
              focus:border-[#19D68C]
              focus:ring-2
              focus:ring-[#19D68C]/10
            "
          />
        </div>
      </div>

      {/* =================================================
          TEMPLATE LIST
      ================================================= */}

      <div className="mt-5">
        {filteredTemplates.length ===
        0 ? (
          <div
            className="
              bg-white
              rounded-2xl
              border
              border-slate-200
              shadow-sm
              p-12
              text-center
            "
          >
            <FaBookOpen className="mx-auto text-3xl text-slate-300" />

            <h2 className="mt-4 font-bold text-slate-900">
              {search
                ? "No matching templates"
                : "No SOP templates yet"}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {search
                ? "Try a different search term."
                : "Create your first reusable SOP template."}
            </p>

            {!search && (
              <button
                type="button"
                onClick={openCreate}
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  px-4
                  py-2.5
                  rounded-xl
                  bg-[#19D68C]
                  text-white
                  text-sm
                  font-semibold
                  hover:bg-[#15C67D]
                "
              >
                <FaPlus />
                Create Template
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {filteredTemplates.map(
              (template) => (
                <div
                  key={template._id}
                  className="
                    bg-white
                    rounded-2xl
                    border
                    border-slate-200
                    shadow-sm
                    p-6
                    min-w-0
                  "
                >
                  {/* CARD HEADER */}

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className="
                          w-11
                          h-11
                          rounded-xl
                          bg-slate-100
                          flex
                          items-center
                          justify-center
                          shrink-0
                        "
                      >
                        <FaBookOpen className="text-slate-500" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 truncate">
                          {template.name}
                        </h3>

                        <p className="text-xs text-slate-500 mt-1">
                          {template.department}{" "}
                          •{" "}
                          {template.role}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`
                        shrink-0
                        px-2.5
                        py-1
                        rounded-full
                        text-xs
                        font-semibold
                        ${
                          template.active
                            ? "bg-[#19D68C]/10 text-[#159B6B]"
                            : "bg-slate-100 text-slate-500"
                        }
                      `}
                    >
                      {template.active
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </div>

                  {/* DESCRIPTION */}

                  <p className="mt-5 text-sm text-slate-600 leading-6">
                    {template.description ||
                      "No description provided."}
                  </p>

                  {/* SECTIONS */}

                  <div className="mt-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      SOP Sections
                    </p>

                    <div className="mt-3 space-y-2">
                      {(
                        template.sections ||
                        []
                      )
                        .filter(
                          (section) =>
                            section.enabled !==
                            false
                        )
                        .sort(
                          (a, b) =>
                            a.order - b.order
                        )
                        .map(
                          (
                            section,
                            index
                          ) => (
                            <div
                              key={
                                section._id ||
                                `${template._id}-${index}`
                              }
                              className="
                                flex
                                items-center
                                gap-3
                                px-3
                                py-2.5
                                rounded-lg
                                bg-slate-50
                              "
                            >
                              <span
                                className="
                                  w-6
                                  h-6
                                  rounded-md
                                  bg-white
                                  border
                                  border-slate-200
                                  flex
                                  items-center
                                  justify-center
                                  text-xs
                                  font-bold
                                  text-slate-500
                                  shrink-0
                                "
                              >
                                {index + 1}
                              </span>

                              <span className="text-sm text-slate-700 truncate">
                                {
                                  section.title
                                }
                              </span>

                              {section.required && (
                                <span className="ml-auto text-[10px] font-bold text-red-500">
                                  Required
                                </span>
                              )}
                            </div>
                          )
                        )}
                    </div>
                  </div>

                  {/* FOOTER */}

                  <div
                    className="
                      mt-5
                      pt-4
                      border-t
                      border-slate-100
                      flex
                      flex-col
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                      gap-3
                    "
                  >
                    <span className="text-xs text-slate-400">
                      Updated{" "}
                      {formatDate(
                        template.updatedAt
                      )}
                    </span>

                    <div className="flex items-center gap-2">
                      {/* DUPLICATE */}

                      <button
                        type="button"
                        onClick={() =>
                          duplicateTemplate(
                            template
                          )
                        }
                        disabled={
                          duplicatingId ===
                          template._id
                        }
                        className="
                          w-9
                          h-9
                          rounded-lg
                          border
                          border-slate-200
                          text-slate-500
                          hover:bg-slate-50
                          disabled:opacity-50
                          flex
                          items-center
                          justify-center
                        "
                        title="Duplicate"
                      >
                        {duplicatingId ===
                        template._id ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaCopy />
                        )}
                      </button>

                      {/* EDIT */}

                      <button
                        type="button"
                        onClick={() =>
                          openEdit(
                            template
                          )
                        }
                        className="
                          w-9
                          h-9
                          rounded-lg
                          border
                          border-slate-200
                          text-slate-500
                          hover:bg-slate-50
                          flex
                          items-center
                          justify-center
                        "
                        title="Edit"
                      >
                        <FaEdit />
                      </button>

                      {/* DELETE */}

                      <button
                        type="button"
                        onClick={() =>
                          deleteTemplate(
                            template
                          )
                        }
                        disabled={
                          deletingId ===
                          template._id
                        }
                        className="
                          w-9
                          h-9
                          rounded-lg
                          border
                          border-red-100
                          text-red-500
                          hover:bg-red-50
                          disabled:opacity-50
                          flex
                          items-center
                          justify-center
                        "
                        title="Delete"
                      >
                        {deletingId ===
                        template._id ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaTrash />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* =================================================
          CREATE / EDIT MODAL
      ================================================= */}

      {showModal && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            bg-slate-900/50
            flex
            items-center
            justify-center
            p-4
          "
        >
          <div
            className="
              w-full
              max-w-3xl
              max-h-[90vh]
              overflow-y-auto
              bg-white
              rounded-2xl
              shadow-2xl
            "
          >
            {/* MODAL HEADER */}

            <div
              className="
                sticky
                top-0
                z-10
                bg-white
                px-6
                py-5
                border-b
                border-slate-200
                flex
                items-center
                justify-between
              "
            >
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingTemplate
                    ? "Edit SOP Template"
                    : "Create SOP Template"}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Define the reusable structure
                  for this role.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="
                  w-9
                  h-9
                  rounded-lg
                  text-slate-400
                  hover:bg-slate-100
                  flex
                  items-center
                  justify-center
                "
              >
                <FaTimes />
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={handleSave}
              className="p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* NAME */}

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Template Name
                  </label>

                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        name:
                          event.target.value,
                      })
                    }
                    placeholder="e.g. Marketing Executive SOP"
                    className="
                      w-full
                      h-11
                      px-4
                      rounded-xl
                      border
                      border-slate-200
                      outline-none
                      focus:border-[#19D68C]
                      focus:ring-2
                      focus:ring-[#19D68C]/10
                    "
                  />
                </div>

                {/* DEPARTMENT */}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Department
                  </label>

                  <input
                    type="text"
                    value={
                      form.department
                    }
                    onChange={(event) =>
                      setForm({
                        ...form,
                        department:
                          event.target.value,
                      })
                    }
                    placeholder="e.g. Marketing"
                    className="
                      w-full
                      h-11
                      px-4
                      rounded-xl
                      border
                      border-slate-200
                      outline-none
                      focus:border-[#19D68C]
                    "
                  />
                </div>

                {/* ROLE */}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Role
                  </label>

                  <input
                    type="text"
                    value={form.role}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        role:
                          event.target.value,
                      })
                    }
                    placeholder="e.g. Marketing Executive"
                    className="
                      w-full
                      h-11
                      px-4
                      rounded-xl
                      border
                      border-slate-200
                      outline-none
                      focus:border-[#19D68C]
                    "
                  />
                </div>

                {/* DESCRIPTION */}

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Description
                  </label>

                  <textarea
                    value={
                      form.description
                    }
                    onChange={(event) =>
                      setForm({
                        ...form,
                        description:
                          event.target.value,
                      })
                    }
                    rows={3}
                    placeholder="Describe when this template should be used."
                    className="
                      w-full
                      px-4
                      py-3
                      rounded-xl
                      border
                      border-slate-200
                      outline-none
                      resize-none
                      focus:border-[#19D68C]
                    "
                  />
                </div>
              </div>

              {/* =================================================
                  SECTIONS
              ================================================= */}

              <div className="mt-7">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      SOP Sections
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                      Choose which sections should
                      appear in SOPs created from this
                      template.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addSection}
                    className="
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      px-3
                      py-2
                      rounded-lg
                      bg-slate-100
                      text-slate-700
                      text-xs
                      font-semibold
                      hover:bg-slate-200
                      shrink-0
                    "
                  >
                    <FaPlus />
                    Add Section
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {form.sections.map(
                    (
                      section,
                      index
                    ) => (
                      <div
                        key={`${section.key}-${index}`}
                        className="
                          border
                          border-slate-200
                          rounded-xl
                          p-4
                        "
                      >
                        <div className="flex items-start gap-3">
                          {/* ORDER */}

                          <div
                            className="
                              w-8
                              h-8
                              rounded-lg
                              bg-slate-100
                              flex
                              items-center
                              justify-center
                              text-xs
                              font-bold
                              text-slate-500
                              shrink-0
                            "
                          >
                            {index + 1}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {/* SECTION */}

                              <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                                  Section
                                </label>

                                <select
                                  value={
                                    section.key
                                  }
                                  onChange={(
                                    event
                                  ) => {
                                    const selected =
                                      DEFAULT_SECTIONS.find(
                                        (item) =>
                                          item.key ===
                                          event
                                            .target
                                            .value
                                      );

                                    if (
                                      !selected
                                    ) {
                                      return;
                                    }

                                    updateSection(
                                      index,
                                      "key",
                                      selected.key
                                    );

                                    updateSection(
                                      index,
                                      "title",
                                      selected.title
                                    );
                                  }}
                                  className="
                                    w-full
                                    h-10
                                    px-3
                                    rounded-lg
                                    border
                                    border-slate-200
                                    text-sm
                                    outline-none
                                    focus:border-[#19D68C]
                                  "
                                >
                                  {DEFAULT_SECTIONS.map(
                                    (
                                      item
                                    ) => (
                                      <option
                                        key={
                                          item.key
                                        }
                                        value={
                                          item.key
                                        }
                                      >
                                        {
                                          item.title
                                        }
                                      </option>
                                    )
                                  )}
                                </select>
                              </div>

                              {/* TITLE */}

                              <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                                  Display Title
                                </label>

                                <input
                                  type="text"
                                  value={
                                    section.title
                                  }
                                  onChange={(
                                    event
                                  ) =>
                                    updateSection(
                                      index,
                                      "title",
                                      event
                                        .target
                                        .value
                                    )
                                  }
                                  className="
                                    w-full
                                    h-10
                                    px-3
                                    rounded-lg
                                    border
                                    border-slate-200
                                    text-sm
                                    outline-none
                                    focus:border-[#19D68C]
                                  "
                                />
                              </div>
                            </div>

                            {/* DESCRIPTION */}

                            <div className="mt-3">
                              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                                Section Description
                              </label>

                              <input
                                type="text"
                                value={
                                  section.description ||
                                  ""
                                }
                                onChange={(
                                  event
                                ) =>
                                  updateSection(
                                    index,
                                    "description",
                                    event
                                      .target
                                      .value
                                  )
                                }
                                placeholder="Optional guidance for this section"
                                className="
                                  w-full
                                  h-10
                                  px-3
                                  rounded-lg
                                  border
                                  border-slate-200
                                  text-sm
                                  outline-none
                                  focus:border-[#19D68C]
                                "
                              />
                            </div>

                            {/* OPTIONS */}

                            <div className="mt-3 flex flex-wrap items-center gap-4">
                              <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
                                <input
                                  type="checkbox"
                                  checked={
                                    section.enabled !==
                                    false
                                  }
                                  onChange={(
                                    event
                                  ) =>
                                    updateSection(
                                      index,
                                      "enabled",
                                      event
                                        .target
                                        .checked
                                    )
                                  }
                                  className="accent-[#19D68C]"
                                />

                                Enabled
                              </label>

                              <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
                                <input
                                  type="checkbox"
                                  checked={
                                    section.required ===
                                    true
                                  }
                                  onChange={(
                                    event
                                  ) =>
                                    updateSection(
                                      index,
                                      "required",
                                      event
                                        .target
                                        .checked
                                    )
                                  }
                                  className="accent-[#19D68C]"
                                />

                                Required
                              </label>
                            </div>
                          </div>

                          {/* ACTIONS */}

                          <div className="flex flex-col gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() =>
                                moveSectionUp(
                                  index
                                )
                              }
                              disabled={
                                index === 0
                              }
                              className="
                                w-8
                                h-8
                                rounded-lg
                                text-slate-500
                                hover:bg-slate-100
                                disabled:opacity-30
                              "
                              title="Move up"
                            >
                              ↑
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                moveSectionDown(
                                  index
                                )
                              }
                              disabled={
                                index ===
                                form.sections
                                  .length -
                                  1
                              }
                              className="
                                w-8
                                h-8
                                rounded-lg
                                text-slate-500
                                hover:bg-slate-100
                                disabled:opacity-30
                              "
                              title="Move down"
                            >
                              ↓
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                removeSection(
                                  index
                                )
                              }
                              className="
                                w-8
                                h-8
                                rounded-lg
                                text-red-500
                                hover:bg-red-50
                              "
                              title="Remove"
                            >
                              <FaTrash className="mx-auto text-xs" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* FOOTER */}

              <div
                className="
                  mt-7
                  pt-5
                  border-t
                  border-slate-200
                  flex
                  flex-col-reverse
                  sm:flex-row
                  sm:justify-end
                  gap-3
                "
              >
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="
                    px-5
                    py-2.5
                    rounded-xl
                    border
                    border-slate-200
                    text-slate-600
                    font-semibold
                    hover:bg-slate-50
                    disabled:opacity-50
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    px-5
                    py-2.5
                    rounded-xl
                    bg-[#19D68C]
                    text-white
                    font-semibold
                    hover:bg-[#15C67D]
                    disabled:opacity-50
                    shadow-sm
                  "
                >
                  {saving ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaSave />
                  )}

                  {saving
                    ? "Saving..."
                    : editingTemplate
                    ? "Update Template"
                    : "Save Template"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SOPTemplates;