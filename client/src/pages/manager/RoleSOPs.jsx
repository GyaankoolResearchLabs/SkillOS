import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaPlus,
  FaEye,
  FaEdit,
  FaCopy,
  FaArchive,
  FaTrash,
  FaGraduationCap,
  FaSearch,
  FaFileAlt,
  FaBuilding,
  FaTimes,
  FaBriefcase,
  FaUserTie,
  FaMapMarkerAlt,
  FaClipboardList,
  FaTools,
  FaBook,
  FaBullseye,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";

import api from "../../services/api";

function RoleSOPs() {
  const navigate = useNavigate();

  const [roleSOPs, setRoleSOPs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [selectedSOP, setSelectedSOP] =
    useState(null);

  const [viewLoading, setViewLoading] =
    useState(false);

  const [generatingId, setGeneratingId] =
    useState(null);

  // =====================================================
  // FETCH
  // =====================================================

  const fetchRoleSOPs = async () => {
    try {
      setLoading(true);

      const response =
        await api.get("/role-sops");

      const data =
        response.data?.roleSOPs ||
        response.data?.data ||
        response.data ||
        [];

      setRoleSOPs(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "FETCH ROLE SOPS ERROR:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to load Role SOPs."
      );

      setRoleSOPs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoleSOPs();
  }, []);

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredSOPs =
    roleSOPs.filter((sop) => {
      const query =
        search.trim().toLowerCase();

      if (!query) return true;

      return (
        String(
          sop?.department || ""
        )
          .toLowerCase()
          .includes(query) ||
        String(sop?.role || "")
          .toLowerCase()
          .includes(query) ||
        String(sop?.team || "")
          .toLowerCase()
          .includes(query) ||
        String(
          sop?.seniority || ""
        )
          .toLowerCase()
          .includes(query) ||
        String(sop?.status || "")
          .toLowerCase()
          .includes(query)
      );
    });

  // =====================================================
  // CREATE
  // =====================================================

  const handleCreate = () => {
    navigate(
      "/manager/role-sops/create"
    );
  };

  // =====================================================
  // VIEW
  // =====================================================

  const handleView = async (sop) => {
    try {
      if (!sop?._id) {
        alert("Invalid Role SOP ID.");
        return;
      }

      setViewLoading(true);

      const response =
        await api.get(
          `/role-sops/${sop._id}`
        );

      const data =
        response.data?.roleSOP ||
        response.data?.data ||
        response.data ||
        sop;

      setSelectedSOP(data);
    } catch (error) {
      console.error(
        "VIEW ROLE SOP ERROR:",
        error
      );

      setSelectedSOP(sop);
    } finally {
      setViewLoading(false);
    }
  };

  const closeView = () => {
    setSelectedSOP(null);
  };

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (id) => {
    if (!id) {
      alert("Invalid Role SOP ID.");
      return;
    }

    navigate(
      `/manager/role-sops/${id}/edit`
    );
  };

  // =====================================================
  // GENERATE TRAINING
  // =====================================================

  const handleGenerateTraining =
    async (sop) => {
      const id = sop?._id;

      if (!id) {
        alert("Invalid Role SOP ID.");
        return;
      }

      const alreadyGenerated =
        Array.isArray(
          sop.generatedCourseIds
        ) &&
        sop.generatedCourseIds.length >
          0;

      if (alreadyGenerated) {
        alert(
          "Training has already been generated for this Role SOP."
        );
        return;
      }

      const confirmed =
        window.confirm(
          `Generate training for "${sop.role}"?\n\nThis will create the learning modules, reading material and quizzes.`
        );

      if (!confirmed) return;

      try {
        setGeneratingId(id);

        const response =
          await api.post(
            `/role-sops/${id}/generate-training`
          );

        alert(
          response.data?.message ||
            "Training generated successfully."
        );

        await fetchRoleSOPs();
      } catch (error) {
        console.error(
          "GENERATE TRAINING ERROR:",
          error
        );

        alert(
          error?.response?.data?.message ||
            "Failed to generate training."
        );
      } finally {
        setGeneratingId(null);
      }
    };

  // =====================================================
  // DUPLICATE
  // =====================================================

  const handleDuplicate =
    async (id) => {
      if (!id) {
        alert("Invalid Role SOP ID.");
        return;
      }

      if (
        !window.confirm(
          "Are you sure you want to duplicate this Role SOP?"
        )
      ) {
        return;
      }

      try {
        await api.post(
          `/role-sops/${id}/duplicate`
        );

        alert(
          "Role SOP duplicated successfully."
        );

        await fetchRoleSOPs();
      } catch (error) {
        console.error(
          "DUPLICATE ERROR:",
          error
        );

        alert(
          error?.response?.data?.message ||
            "Failed to duplicate Role SOP."
        );
      }
    };

  // =====================================================
  // ARCHIVE
  // =====================================================

  const handleArchive =
    async (id) => {
      if (!id) return;

      if (
        !window.confirm(
          "Are you sure you want to archive this Role SOP?"
        )
      ) {
        return;
      }

      try {
        await api.patch(
          `/role-sops/${id}/archive`
        );

        alert(
          "Role SOP archived successfully."
        );

        await fetchRoleSOPs();
      } catch (error) {
        console.error(
          "ARCHIVE ERROR:",
          error
        );

        alert(
          error?.response?.data?.message ||
            "Failed to archive Role SOP."
        );
      }
    };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete =
    async (id) => {
      if (!id) return;

      if (
        !window.confirm(
          "Are you sure you want to permanently delete this Role SOP?\n\nThis action cannot be undone."
        )
      ) {
        return;
      }

      try {
        await api.delete(
          `/role-sops/${id}`
        );

        alert(
          "Role SOP deleted successfully."
        );

        await fetchRoleSOPs();
      } catch (error) {
        console.error(
          "DELETE ERROR:",
          error
        );

        alert(
          error?.response?.data?.message ||
            "Failed to delete Role SOP."
        );
      }
    };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto rounded-full border-4 border-[#18D39A] border-t-transparent animate-spin" />

          <p className="mt-4 text-[#64748B]">
            Loading Role SOPs...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <>
      <div className="w-full max-w-7xl mx-auto pb-10">

        {/* HEADER */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#111827]">
              Role SOPs
            </h1>

            <p className="mt-2 text-[#64748B]">
              Create and manage department and
              role-specific SOPs.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreate}
            className="h-12 px-6 rounded-xl bg-[#18D39A] hover:bg-[#13B987] text-white font-semibold flex items-center justify-center gap-2 shadow-md"
          >
            <FaPlus />
            Create Role SOP
          </button>
        </div>

        {/* SEARCH */}

        <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm p-4 mb-6">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search department, role or team..."
              className="w-full h-12 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] pl-11 pr-4 outline-none focus:border-[#18D39A]"
            />
          </div>
        </div>

        {/* EMPTY */}

        {filteredSOPs.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm p-12 text-center">
            <FaFileAlt
              size={35}
              className="mx-auto text-[#18D39A]"
            />

            <h2 className="mt-5 text-xl font-bold">
              {search
                ? "No matching Role SOPs"
                : "No Role SOPs yet"}
            </h2>

            <p className="mt-2 text-[#64748B]">
              {search
                ? "Try another search."
                : "Create your first Role SOP."}
            </p>
          </div>
        ) : (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden">

            {/* HEADER */}

            <div className="grid grid-cols-[1.2fr_1.5fr_0.7fr_1fr_1.2fr_3fr] gap-4 px-6 py-4 bg-[#F8FAFC] border-b text-xs font-bold uppercase text-[#64748B]">
              <div>Department</div>
              <div>Role</div>
              <div>Version</div>
              <div>Status</div>
              <div>Training</div>
              <div>Actions</div>
            </div>

            {/* ROWS */}

            {filteredSOPs.map(
              (sop) => {
                const id =
                  sop?._id;

                const generated =
                  Array.isArray(
                    sop?.generatedCourseIds
                  ) &&
                  sop.generatedCourseIds
                    .length > 0;

                const isPublished =
                  sop?.status ===
                  "Published";

                const isArchived =
                  sop?.status ===
                  "Archived";

                const isGenerating =
                  generatingId === id;

                return (
                  <div
                    key={id}
                    className="grid grid-cols-[1.2fr_1.5fr_0.7fr_1fr_1.2fr_3fr] gap-4 items-center px-6 py-5 border-b last:border-b-0 hover:bg-[#FAFCFB]"
                  >

                    {/* DEPARTMENT */}

                    <div>
                      <div className="flex items-center gap-2 font-semibold">
                        <FaBuilding className="text-[#18D39A]" />
                        {sop?.department ||
                          "—"}
                      </div>

                      {sop?.team && (
                        <p className="ml-6 mt-1 text-xs text-[#64748B]">
                          {sop.team}
                        </p>
                      )}
                    </div>

                    {/* ROLE */}

                    <div>
                      <p className="font-semibold">
                        {sop?.role ||
                          "—"}
                      </p>

                      {sop?.seniority && (
                        <p className="mt-1 text-xs text-[#64748B]">
                          {sop.seniority}
                        </p>
                      )}
                    </div>

                    {/* VERSION */}

                    <div>
                      <span className="inline-flex px-3 py-1 rounded-lg bg-[#F1F5F9] text-sm font-semibold">
                        v
                        {sop?.version ||
                          "1.0"}
                      </span>
                    </div>

                    {/* STATUS */}

                    <div>
                      <span className="inline-flex px-3 py-1.5 rounded-full text-xs font-semibold border">
                        {sop?.status ||
                          "Draft"}
                      </span>
                    </div>

                    {/* TRAINING */}

                    <div>
                      {generated ? (
                        <div>
                          <span className="flex items-center gap-2 text-sm font-semibold text-green-700">
                            <FaGraduationCap />
                            Generated
                          </span>

                          <button
                            type="button"
                            onClick={() => {
                              const courseId =
                                typeof sop.generatedCourseIds?.[0] ===
                                "object"
                                  ? sop.generatedCourseIds[0]?._id
                                  : sop.generatedCourseIds?.[0];

                              if (courseId) {
                                navigate(
                                  `/manager/course/${courseId}`
                                );
                              }
                            }}
                            className="mt-2 text-xs text-blue-600 hover:underline"
                          >
                            View Training
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={
                            isGenerating
                          }
                          onClick={() =>
                            handleGenerateTraining(
                              sop
                            )
                          }
                          className="h-9 px-3 rounded-lg bg-[#18D39A] hover:bg-[#13B987] disabled:opacity-60 text-white text-sm font-semibold flex items-center gap-2"
                        >
                          {isGenerating ? (
                            <>
                              <FaSpinner className="animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <FaGraduationCap />
                              Generate
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {/* ACTIONS */}

                    <div className="flex flex-wrap gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          handleView(
                            sop
                          )
                        }
                        disabled={
                          viewLoading
                        }
                        className="h-9 px-3 rounded-lg border border-[#E5E7EB] flex items-center gap-2"
                      >
                        <FaEye />
                        View
                      </button>

                      {!isPublished &&
                        !isArchived && (
                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                id
                              )
                            }
                            className="h-9 px-3 rounded-lg border flex items-center gap-2"
                          >
                            <FaEdit />
                            Edit
                          </button>
                        )}

                      <button
                        type="button"
                        onClick={() =>
                          handleDuplicate(
                            id
                          )
                        }
                        className="h-9 px-3 rounded-lg border flex items-center gap-2"
                      >
                        <FaCopy />
                        Duplicate
                      </button>

                      {!isArchived && (
                        <button
                          type="button"
                          onClick={() =>
                            handleArchive(
                              id
                            )
                          }
                          className="h-9 px-3 rounded-lg border border-orange-200 text-orange-600 flex items-center gap-2"
                        >
                          <FaArchive />
                          Archive
                        </button>
                      )}

                      {!isPublished && (
                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              id
                            )
                          }
                          className="h-9 px-3 rounded-lg border border-red-200 text-red-600 flex items-center gap-2"
                        >
                          <FaTrash />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>

      {/* =================================================
          VIEW MODAL
      ================================================= */}

      {selectedSOP && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onMouseDown={(e) => {
            if (
              e.target ===
              e.currentTarget
            ) {
              closeView();
            }
          }}
        >
          <div className="w-full max-w-5xl max-h-[92vh] overflow-hidden bg-white rounded-3xl shadow-2xl flex flex-col">

            <div className="px-8 py-6 border-b flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-[#18D39A] text-sm font-bold uppercase">
                  <FaFileAlt />
                  Role SOP
                </div>

                <h2 className="mt-2 text-2xl font-black">
                  {selectedSOP.role ||
                    "Role SOP"}
                </h2>

                <p className="mt-1 text-[#64748B]">
                  {selectedSOP.department ||
                    "—"}
                </p>
              </div>

              <button
                type="button"
                onClick={closeView}
                className="w-10 h-10 rounded-xl border flex items-center justify-center"
              >
                <FaTimes />
              </button>
            </div>

            <div className="overflow-y-auto p-8 space-y-6">

              <section className="rounded-2xl border p-6">
                <h3 className="text-lg font-bold mb-5">
                  Role Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                  <InfoItem
                    icon={<FaBuilding />}
                    label="Department"
                    value={
                      selectedSOP.department
                    }
                  />

                  <InfoItem
                    icon={<FaBriefcase />}
                    label="Role"
                    value={
                      selectedSOP.role
                    }
                  />

                  <InfoItem
                    icon={<FaUserTie />}
                    label="Seniority"
                    value={
                      selectedSOP.seniority
                    }
                  />

                  <InfoItem
                    icon={<FaBuilding />}
                    label="Team"
                    value={
                      selectedSOP.team
                    }
                  />

                  <InfoItem
                    icon={<FaMapMarkerAlt />}
                    label="Location"
                    value={
                      selectedSOP.location
                    }
                  />

                  <InfoItem
                    icon={<FaUserTie />}
                    label="Reporting Manager"
                    value={
                      selectedSOP.reportingManager
                    }
                  />
                </div>
              </section>

              <section className="rounded-2xl border p-6">
                <h3 className="text-lg font-bold mb-3">
                  Role Purpose
                </h3>

                <p className="text-[#64748B] leading-7">
                  {selectedSOP.rolePurpose ||
                    "No role purpose provided."}
                </p>
              </section>

              <SOPArraySection
                title="Responsibilities"
                icon={
                  <FaClipboardList />
                }
                items={
                  selectedSOP.responsibilities ||
                  []
                }
                renderItem={(item) =>
                  typeof item ===
                  "string"
                    ? item
                    : item?.title ||
                      "Responsibility"
                }
              />

              <SOPArraySection
                title="Tools"
                icon={<FaTools />}
                items={
                  selectedSOP.tools ||
                  []
                }
                renderItem={(item) =>
                  typeof item ===
                  "string"
                    ? item
                    : item?.name ||
                      "Tool"
                }
              />

              <SOPArraySection
                title="Policies"
                icon={<FaBook />}
                items={
                  selectedSOP.policies ||
                  []
                }
                renderItem={(item) =>
                  typeof item ===
                  "string"
                    ? item
                    : item?.name ||
                      item?.title ||
                      "Policy"
                }
              />

              <SOPArraySection
                title="KPIs"
                icon={<FaBullseye />}
                items={
                  selectedSOP.kpis ||
                  []
                }
                renderItem={(item) =>
                  typeof item ===
                  "string"
                    ? item
                    : item?.name ||
                      item?.title ||
                      "KPI"
                }
              />

            </div>

            <div className="px-8 py-5 border-t flex justify-between items-center">

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100">
                {selectedSOP.status ||
                  "Draft"}
              </span>

              <div className="flex gap-3">

                {(!selectedSOP.generatedCourseIds ||
                  selectedSOP
                    .generatedCourseIds
                    .length ===
                    0) && (
                  <button
                    type="button"
                    disabled={
                      generatingId ===
                      selectedSOP._id
                    }
                    onClick={async () => {
                      await handleGenerateTraining(
                        selectedSOP
                      );

                      closeView();
                    }}
                    className="h-11 px-5 rounded-xl bg-[#18D39A] text-white font-semibold flex items-center gap-2"
                  >
                    <FaGraduationCap />
                    Generate Training
                  </button>
                )}

                <button
                  type="button"
                  onClick={closeView}
                  className="h-11 px-5 rounded-xl border font-semibold"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

// =====================================================
// INFO ITEM
// =====================================================

function InfoItem({
  icon,
  label,
  value,
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#94A3B8] mb-1">
        {icon}
        {label}
      </div>

      <p className="text-sm font-semibold text-[#111827]">
        {value || "Not provided"}
      </p>
    </div>
  );
}

// =====================================================
// ARRAY SECTION
// =====================================================

function SOPArraySection({
  title,
  icon,
  items,
  renderItem,
}) {
  return (
    <section className="rounded-2xl border p-6">

      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-[#E8FFF6] text-[#18D39A] flex items-center justify-center">
          {icon}
        </div>

        <h3 className="text-lg font-bold">
          {title}
        </h3>
      </div>

      {!items.length ? (
        <p className="text-[#94A3B8]">
          No {title.toLowerCase()} defined.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map(
            (item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-xl bg-[#F8FAFC] border p-4"
              >
                <span className="w-6 h-6 rounded-full bg-[#E8FFF6] text-[#18D39A] flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {index + 1}
                </span>

                <div className="text-sm text-[#334155]">
                  {renderItem(item)}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </section>
  );
}

export default RoleSOPs;