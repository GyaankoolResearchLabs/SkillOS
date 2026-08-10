import { useEffect, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaBuilding,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaTimes,
  FaSave,
  FaSearch,
} from "react-icons/fa";

const STORAGE_KEY = "skillos_departments";

const DEFAULT_DEPARTMENTS = [
  {
    id: "dept-1",
    name: "Human Resources",
    code: "HR",
    description:
      "People operations, recruitment and employee management.",
    head: "HR Manager",
    employees: 0,
    status: "Active",
  },
  {
    id: "dept-2",
    name: "Marketing",
    code: "MKT",
    description:
      "Marketing, branding, campaigns and digital growth.",
    head: "Marketing Manager",
    employees: 0,
    status: "Active",
  },
  {
    id: "dept-3",
    name: "Sales",
    code: "SAL",
    description:
      "Sales operations, customer acquisition and revenue growth.",
    head: "Sales Manager",
    employees: 0,
    status: "Active",
  },
];

const EMPTY_FORM = {
  name: "",
  code: "",
  description: "",
  head: "",
  employees: 0,
  status: "Active",
};

// ======================================================
// STORAGE
// ======================================================

function loadDepartments() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(DEFAULT_DEPARTMENTS)
      );

      return DEFAULT_DEPARTMENTS;
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed)
      ? parsed
      : DEFAULT_DEPARTMENTS;
  } catch (error) {
    console.error(
      "Failed to load departments:",
      error
    );

    return DEFAULT_DEPARTMENTS;
  }
}

function saveDepartments(departments) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(departments)
  );

  window.dispatchEvent(
    new Event("organizationSettingsUpdated")
  );
}

// ======================================================
// COMPONENT
// ======================================================

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [editingDepartment, setEditingDepartment] =
    useState(null);

  const [form, setForm] =
    useState(EMPTY_FORM);

  // ====================================================
  // LOAD
  // ====================================================

  useEffect(() => {
    setDepartments(loadDepartments());
  }, []);

  // ====================================================
  // MODAL
  // ====================================================

  const openAddModal = () => {
    setEditingDepartment(null);
    setForm({ ...EMPTY_FORM });
    setShowModal(true);
  };

  const openEditModal = (department) => {
    setEditingDepartment(department);

    setForm({
      name: department.name || "",
      code: department.code || "",
      description:
        department.description || "",
      head: department.head || "",
      employees:
        department.employees || 0,
      status:
        department.status || "Active",
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDepartment(null);
    setForm({ ...EMPTY_FORM });
  };

  // ====================================================
  // FORM
  // ====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        name === "employees"
          ? Number(value)
          : value,
    }));
  };

  // ====================================================
  // SAVE
  // ====================================================

  const handleSave = (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      alert("Department name is required.");
      return;
    }

    if (!form.code.trim()) {
      alert("Department code is required.");
      return;
    }

    let updatedDepartments;

    if (editingDepartment) {
      updatedDepartments =
        departments.map((department) =>
          department.id ===
          editingDepartment.id
            ? {
                ...department,
                ...form,
                name: form.name.trim(),
                code: form.code
                  .trim()
                  .toUpperCase(),
              }
            : department
        );
    } else {
      const newDepartment = {
        id: `dept-${Date.now()}`,
        ...form,
        name: form.name.trim(),
        code: form.code
          .trim()
          .toUpperCase(),
      };

      updatedDepartments = [
        ...departments,
        newDepartment,
      ];
    }

    setDepartments(updatedDepartments);

    saveDepartments(updatedDepartments);

    closeModal();
  };

  // ====================================================
  // DELETE
  // ====================================================

  const handleDelete = (department) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${department.name}"?`
    );

    if (!confirmed) return;

    const updatedDepartments =
      departments.filter(
        (item) =>
          item.id !== department.id
      );

    setDepartments(updatedDepartments);

    saveDepartments(updatedDepartments);
  };

  // ====================================================
  // STATUS
  // ====================================================

  const toggleStatus = (department) => {
    const updatedDepartments =
      departments.map((item) =>
        item.id === department.id
          ? {
              ...item,
              status:
                item.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : item
      );

    setDepartments(updatedDepartments);

    saveDepartments(updatedDepartments);
  };

  // ====================================================
  // SEARCH
  // ====================================================

  const query = search
    .toLowerCase()
    .trim();

  const filteredDepartments =
    departments.filter((department) => {
      if (!query) return true;

      return (
        department.name
          ?.toLowerCase()
          .includes(query) ||
        department.code
          ?.toLowerCase()
          .includes(query) ||
        department.head
          ?.toLowerCase()
          .includes(query)
      );
    });

  // ====================================================
  // STATS
  // ====================================================

  const activeCount =
    departments.filter(
      (department) =>
        department.status === "Active"
    ).length;

  const inactiveCount =
    departments.length - activeCount;

  // ====================================================
  // UI
  // ====================================================

  return (
    <div className="w-full space-y-5 pb-8">

      {/* ================================================= */}
      {/* PAGE HEADER */}
      {/* ================================================= */}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm px-5 py-5">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <FaBuilding className="text-[#19D68C]" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Departments
              </h2>

              <p className="text-sm text-slate-500 mt-0.5">
                Manage your organization's departments.
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              px-5
              py-2.5
              rounded-xl
              bg-[#19D68C]
              hover:bg-[#15C67D]
              text-white
              text-sm
              font-semibold
              shadow-sm
              transition
              shrink-0
            "
          >
            <FaPlus />
            Add Department
          </button>

        </div>

      </div>

      {/* ================================================= */}
      {/* STATISTICS */}
      {/* ================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Total */}

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm px-5 py-4">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Total Departments
              </p>

              <p className="text-2xl font-bold text-slate-800 mt-1">
                {departments.length}
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <FaBuilding className="text-blue-600" />
            </div>

          </div>

        </div>

        {/* Active */}

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm px-5 py-4">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Active
              </p>

              <p className="text-2xl font-bold text-slate-800 mt-1">
                {activeCount}
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <FaCheckCircle className="text-[#19D68C]" />
            </div>

          </div>

        </div>

        {/* Inactive */}

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm px-5 py-4">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Inactive
              </p>

              <p className="text-2xl font-bold text-slate-800 mt-1">
                {inactiveCount}
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <FaTimesCircle className="text-slate-500" />
            </div>

          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* DEPARTMENT TABLE */}
      {/* ================================================= */}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        {/* SEARCH */}

        <div className="px-5 py-4 border-b border-slate-200">

          <div className="relative w-full max-w-sm">

            <FaSearch
              className="
                absolute
                left-3.5
                top-1/2
                -translate-y-1/2
                text-slate-400
                text-sm
              "
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search departments..."
              className="
                w-full
                border
                border-slate-300
                rounded-xl
                pl-10
                pr-4
                py-2.5
                text-sm
                outline-none
                transition
                focus:border-[#19D68C]
                focus:ring-2
                focus:ring-[#19D68C]/20
              "
            />

          </div>

        </div>

        {/* ================================================= */}
        {/* EMPTY */}
        {/* ================================================= */}

        {filteredDepartments.length === 0 && (

          <div className="py-14 text-center px-5">

            <div className="w-14 h-14 mx-auto rounded-xl bg-slate-100 flex items-center justify-center">
              <FaBuilding className="text-slate-400 text-xl" />
            </div>

            <h3 className="text-lg font-bold text-slate-800 mt-4">
              {search
                ? "No departments found"
                : "No departments created yet"}
            </h3>

            <p className="text-sm text-slate-500 mt-1.5">
              {search
                ? "Try another search term."
                : "Create your first department to get started."}
            </p>

            {!search && (
              <button
                type="button"
                onClick={openAddModal}
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  px-5
                  py-2.5
                  rounded-xl
                  bg-[#19D68C]
                  text-white
                  text-sm
                  font-semibold
                "
              >
                <FaPlus />
                Add Department
              </button>
            )}

          </div>

        )}

        {/* ================================================= */}
        {/* TABLE */}
        {/* ================================================= */}

        {filteredDepartments.length > 0 && (

          <div className="overflow-x-auto">

            <table className="w-full table-fixed min-w-[850px]">

              <thead>

                <tr className="bg-slate-50 border-b border-slate-200">

                  <th className="w-[30%] text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    Department
                  </th>

                  <th className="w-[10%] text-left px-4 py-3.5 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    Code
                  </th>

                  <th className="w-[18%] text-left px-4 py-3.5 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    Department Head
                  </th>

                  <th className="w-[12%] text-left px-4 py-3.5 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    Employees
                  </th>

                  <th className="w-[13%] text-left px-4 py-3.5 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="w-[17%] text-right px-5 py-3.5 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredDepartments.map(
                  (department) => (

                    <tr
                      key={department.id}
                      className="
                        border-b
                        border-slate-100
                        last:border-b-0
                        hover:bg-slate-50/60
                        transition
                      "
                    >

                      {/* Department */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3 min-w-0">

                          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                            <FaBuilding className="text-[#19D68C] text-sm" />
                          </div>

                          <div className="min-w-0">

                            <p className="font-semibold text-slate-800 text-sm truncate">
                              {department.name}
                            </p>

                            <p
                              className="
                                text-xs
                                text-slate-500
                                mt-0.5
                                truncate
                              "
                              title={
                                department.description
                              }
                            >
                              {department.description ||
                                "No description"}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* CODE */}

                      <td className="px-4 py-4">

                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">
                          {department.code}
                        </span>

                      </td>

                      {/* HEAD */}

                      <td className="px-4 py-4">

                        <p className="text-sm text-slate-700 truncate">
                          {department.head ||
                            "Not assigned"}
                        </p>

                      </td>

                      {/* EMPLOYEES */}

                      <td className="px-4 py-4">

                        <div className="flex items-center gap-1.5 text-sm text-slate-700">

                          <FaUsers className="text-slate-400 text-xs" />

                          <span className="font-semibold">
                            {department.employees ||
                              0}
                          </span>

                        </div>

                      </td>

                      {/* STATUS */}

                      <td className="px-4 py-4">

                        <button
                          type="button"
                          onClick={() =>
                            toggleStatus(
                              department
                            )
                          }
                          className={`
                            inline-flex
                            items-center
                            gap-1.5
                            px-2.5
                            py-1
                            rounded-full
                            text-xs
                            font-semibold
                            ${
                              department.status ===
                              "Active"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                            }
                          `}
                        >

                          {department.status ===
                          "Active" ? (
                            <FaCheckCircle />
                          ) : (
                            <FaTimesCircle />
                          )}

                          {department.status}

                        </button>

                      </td>

                      {/* ACTIONS */}

                      <td className="px-5 py-4">

                        <div className="flex items-center justify-end gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(
                                department
                              )
                            }
                            title="Edit department"
                            className="
                              w-9
                              h-9
                              rounded-lg
                              border
                              border-slate-200
                              text-slate-600
                              hover:bg-slate-100
                              hover:text-slate-900
                              flex
                              items-center
                              justify-center
                              transition
                            "
                          >
                            <FaEdit className="text-sm" />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                department
                              )
                            }
                            title="Delete department"
                            className="
                              w-9
                              h-9
                              rounded-lg
                              border
                              border-red-200
                              text-red-500
                              hover:bg-red-50
                              flex
                              items-center
                              justify-center
                              transition
                            "
                          >
                            <FaTrash className="text-sm" />
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* ================================================= */}
      {/* ADD / EDIT MODAL */}
      {/* ================================================= */}

      {showModal && (

        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">

            {/* HEADER */}

            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">

              <div>

                <h3 className="text-lg font-bold text-slate-800">
                  {editingDepartment
                    ? "Edit Department"
                    : "Add Department"}
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  {editingDepartment
                    ? "Update department information."
                    : "Create a new department."}
                </p>

              </div>

              <button
                type="button"
                onClick={closeModal}
                className="
                  w-9
                  h-9
                  rounded-lg
                  hover:bg-slate-100
                  flex
                  items-center
                  justify-center
                  text-slate-500
                "
              >
                <FaTimes />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSave}
              className="p-6 space-y-4"
            >

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* NAME */}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Department Name *
                  </label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Marketing"
                    className="
                      w-full
                      border
                      border-slate-300
                      rounded-xl
                      px-4
                      py-2.5
                      text-sm
                      outline-none
                      focus:border-[#19D68C]
                      focus:ring-2
                      focus:ring-[#19D68C]/20
                    "
                    required
                  />
                </div>

                {/* CODE */}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Department Code *
                  </label>

                  <input
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    placeholder="e.g. MKT"
                    maxLength={10}
                    className="
                      w-full
                      border
                      border-slate-300
                      rounded-xl
                      px-4
                      py-2.5
                      text-sm
                      uppercase
                      outline-none
                      focus:border-[#19D68C]
                      focus:ring-2
                      focus:ring-[#19D68C]/20
                    "
                    required
                  />
                </div>

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Describe the department..."
                  className="
                    w-full
                    border
                    border-slate-300
                    rounded-xl
                    px-4
                    py-2.5
                    text-sm
                    resize-none
                    outline-none
                    focus:border-[#19D68C]
                    focus:ring-2
                    focus:ring-[#19D68C]/20
                  "
                />

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* HEAD */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Department Head
                  </label>

                  <input
                    name="head"
                    value={form.head}
                    onChange={handleChange}
                    placeholder="e.g. John Smith"
                    className="
                      w-full
                      border
                      border-slate-300
                      rounded-xl
                      px-4
                      py-2.5
                      text-sm
                      outline-none
                      focus:border-[#19D68C]
                      focus:ring-2
                      focus:ring-[#19D68C]/20
                    "
                  />

                </div>

                {/* EMPLOYEES */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Employees
                  </label>

                  <input
                    name="employees"
                    type="number"
                    min="0"
                    value={form.employees}
                    onChange={handleChange}
                    className="
                      w-full
                      border
                      border-slate-300
                      rounded-xl
                      px-4
                      py-2.5
                      text-sm
                      outline-none
                      focus:border-[#19D68C]
                      focus:ring-2
                      focus:ring-[#19D68C]/20
                    "
                  />

                </div>

              </div>

              {/* STATUS */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="
                    w-full
                    border
                    border-slate-300
                    rounded-xl
                    px-4
                    py-2.5
                    text-sm
                    bg-white
                    outline-none
                    focus:border-[#19D68C]
                    focus:ring-2
                    focus:ring-[#19D68C]/20
                  "
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
                </select>

              </div>

              {/* FOOTER */}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">

                <button
                  type="button"
                  onClick={closeModal}
                  className="
                    px-5
                    py-2.5
                    rounded-xl
                    border
                    border-slate-300
                    text-slate-700
                    text-sm
                    font-semibold
                    hover:bg-slate-50
                    transition
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="
                    px-5
                    py-2.5
                    rounded-xl
                    bg-[#19D68C]
                    hover:bg-[#15C67D]
                    text-white
                    text-sm
                    font-semibold
                    flex
                    items-center
                    gap-2
                    transition
                  "
                >
                  <FaSave />

                  {editingDepartment
                    ? "Save Changes"
                    : "Create Department"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}