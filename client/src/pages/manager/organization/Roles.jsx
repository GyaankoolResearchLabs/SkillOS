import { useEffect, useMemo, useState } from "react";
import {
  FaUsersCog,
  FaUserShield,
  FaUserTie,
  FaUserCheck,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
  FaBuilding,
} from "react-icons/fa";

const STORAGE_KEY = "skillos_organization_roles";

const DEFAULT_ROLES = [
  {
    id: "role-1",
    name: "HR Manager",
    department: "Human Resources",
    description:
      "Manages HR operations, employee relations and people processes.",
    level: "Manager",
    employees: 0,
    status: "Active",
  },
  {
    id: "role-2",
    name: "Marketing Manager",
    department: "Marketing",
    description:
      "Leads marketing strategy, campaigns and brand initiatives.",
    level: "Manager",
    employees: 0,
    status: "Active",
  },
  {
    id: "role-3",
    name: "Marketing Executive",
    department: "Marketing",
    description:
      "Supports marketing campaigns, content and digital activities.",
    level: "Mid-Level",
    employees: 0,
    status: "Active",
  },
];

const EMPTY_FORM = {
  name: "",
  department: "",
  description: "",
  level: "Entry-Level",
  status: "Active",
};

function loadRoles() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      const parsed = JSON.parse(stored);

      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("LOAD ROLES ERROR:", error);
  }

  return DEFAULT_ROLES;
}

export default function Roles() {
  const [roles, setRoles] = useState(loadRoles);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [status, setStatus] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);

  // =====================================================
  // SAVE ROLES
  // =====================================================

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(roles)
    );

    window.dispatchEvent(
      new Event("organizationRolesUpdated")
    );
  }, [roles]);

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalRoles = roles.length;

  const activeRoles = roles.filter(
    (role) => role.status === "Active"
  ).length;

  const inactiveRoles = roles.filter(
    (role) => role.status === "Inactive"
  ).length;

  const assignedEmployees = roles.reduce(
    (total, role) =>
      total + Number(role.employees || 0),
    0
  );

  // =====================================================
  // DEPARTMENTS
  // =====================================================

  const departments = useMemo(() => {
    const values = roles
      .map((role) => role.department)
      .filter(Boolean);

    return ["All", ...new Set(values)];
  }, [roles]);

  // =====================================================
  // FILTER
  // =====================================================

  const filteredRoles = useMemo(() => {
    const value = search.toLowerCase().trim();

    return roles.filter((role) => {
      const matchesSearch =
        !value ||
        role.name?.toLowerCase().includes(value) ||
        role.department?.toLowerCase().includes(value) ||
        role.description?.toLowerCase().includes(value);

      const matchesDepartment =
        department === "All" ||
        role.department === department;

      const matchesStatus =
        status === "All" ||
        role.status === status;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus
      );
    });
  }, [
    roles,
    search,
    department,
    status,
  ]);

  // =====================================================
  // ADD ROLE
  // =====================================================

  const openAddRole = () => {
    setEditingRole(null);

    setForm({
      ...EMPTY_FORM,
      department:
        department !== "All"
          ? department
          : "",
    });

    setShowModal(true);
  };

  // =====================================================
  // EDIT ROLE
  // =====================================================

  const openEditRole = (role) => {
    setEditingRole(role);

    setForm({
      name: role.name || "",
      department: role.department || "",
      description: role.description || "",
      level: role.level || "Entry-Level",
      status: role.status || "Active",
    });

    setShowModal(true);
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeModal = () => {
    setShowModal(false);
    setEditingRole(null);
    setForm(EMPTY_FORM);
  };

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // SAVE ROLE
  // =====================================================

  const saveRole = (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      alert("Role name is required.");
      return;
    }

    if (!form.department.trim()) {
      alert("Department is required.");
      return;
    }

    if (editingRole) {
      setRoles((previous) =>
        previous.map((role) =>
          role.id === editingRole.id
            ? {
                ...role,
                ...form,
              }
            : role
        )
      );
    } else {
      setRoles((previous) => [
        ...previous,
        {
          id: `role-${Date.now()}`,
          ...form,
          employees: 0,
        },
      ]);
    }

    closeModal();
  };

  // =====================================================
  // DELETE ROLE
  // =====================================================

  const deleteRole = (role) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${role.name}"?`
    );

    if (!confirmed) return;

    setRoles((previous) =>
      previous.filter(
        (item) => item.id !== role.id
      )
    );
  };

  // =====================================================
  // TOGGLE STATUS
  // =====================================================

  const toggleStatus = (role) => {
    setRoles((previous) =>
      previous.map((item) =>
        item.id === role.id
          ? {
              ...item,
              status:
                item.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : item
      )
    );
  };

  return (
    <div className="w-full min-w-0 space-y-5 pb-8">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div className="min-w-0">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 flex-shrink-0 rounded-xl bg-emerald-50 flex items-center justify-center">
                <FaUsersCog className="text-[#19D68C] text-xl" />
              </div>

              <div className="min-w-0">

                <h1 className="text-xl sm:text-2xl font-bold text-slate-800 truncate">
                  Organization Roles
                </h1>

                <p className="text-sm text-slate-500 mt-1">
                  Manage roles and responsibilities across your organization.
                </p>

              </div>

            </div>

          </div>

          <button
            type="button"
            onClick={openAddRole}
            className="flex-shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#19D68C] hover:bg-[#15C67D] text-white font-semibold transition"
          >
            <FaPlus />
            Add Role
          </button>

        </div>

      </div>

      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        <StatCard
          title="Total Roles"
          value={totalRoles}
          icon={<FaUsersCog />}
          className="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Active Roles"
          value={activeRoles}
          icon={<FaUserCheck />}
          className="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Inactive Roles"
          value={inactiveRoles}
          icon={<FaUserShield />}
          className="bg-slate-100 text-slate-500"
        />

        <StatCard
          title="Assigned Employees"
          value={assignedEmployees}
          icon={<FaUserTie />}
          className="bg-purple-50 text-purple-600"
        />

      </div>

      {/* =================================================
          FILTERS
      ================================================= */}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

          <div className="relative">

            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search roles..."
              className="w-full h-12 rounded-xl border border-slate-300 pl-11 pr-4 outline-none focus:border-[#19D68C] focus:ring-2 focus:ring-[#19D68C]/20"
            />

          </div>

          <select
            value={department}
            onChange={(event) =>
              setDepartment(event.target.value)
            }
            className="w-full h-12 rounded-xl border border-slate-300 px-4 outline-none focus:border-[#19D68C] focus:ring-2 focus:ring-[#19D68C]/20"
          >
            {departments.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item === "All"
                  ? "All Departments"
                  : item}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
            className="w-full h-12 rounded-xl border border-slate-300 px-4 outline-none focus:border-[#19D68C] focus:ring-2 focus:ring-[#19D68C]/20"
          >
            <option value="All">
              All Status
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>
          </select>

        </div>

      </div>

      {/* =================================================
          ROLES
      ================================================= */}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-w-0">

        <div className="p-5 border-b border-slate-200">

          <h2 className="text-lg font-bold text-slate-800">
            Roles
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            {filteredRoles.length} role
            {filteredRoles.length !== 1
              ? "s"
              : ""}{" "}
            found
          </p>

        </div>

        {/* IMPORTANT:
            Horizontal scrolling stays INSIDE this card
        */}

        <div className="w-full overflow-x-auto">

          <table className="w-full min-w-[900px]">

            <thead>

              <tr className="bg-slate-50 border-b border-slate-200">

                <th className="text-left px-5 py-4 text-xs font-bold uppercase text-slate-500">
                  Role
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold uppercase text-slate-500">
                  Department
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold uppercase text-slate-500">
                  Level
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold uppercase text-slate-500">
                  Employees
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold uppercase text-slate-500">
                  Status
                </th>

                <th className="text-right px-5 py-4 text-xs font-bold uppercase text-slate-500">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredRoles.map((role) => (

                <tr
                  key={role.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition"
                >

                  <td className="px-5 py-5">

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-emerald-50 flex items-center justify-center">
                        <FaUserTie className="text-[#19D68C]" />
                      </div>

                      <div className="min-w-0">

                        <p className="font-bold text-slate-800">
                          {role.name}
                        </p>

                        <p className="text-sm text-slate-500 max-w-[280px] truncate">
                          {role.description ||
                            "No description provided."}
                        </p>

                      </div>

                    </div>

                  </td>

                  <td className="px-5 py-5">

                    <div className="flex items-center gap-2 text-slate-700">

                      <FaBuilding className="text-slate-400 flex-shrink-0" />

                      <span>
                        {role.department}
                      </span>

                    </div>

                  </td>

                  <td className="px-5 py-5">

                    <span className="inline-flex px-3 py-1.5 rounded-lg bg-slate-100 text-sm font-semibold text-slate-700">
                      {role.level}
                    </span>

                  </td>

                  <td className="px-5 py-5 font-semibold text-slate-700">
                    {role.employees || 0}
                  </td>

                  <td className="px-5 py-5">

                    <button
                      type="button"
                      onClick={() =>
                        toggleStatus(role)
                      }
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${
                        role.status === "Active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >

                      <span
                        className={`w-2 h-2 rounded-full ${
                          role.status === "Active"
                            ? "bg-emerald-500"
                            : "bg-slate-400"
                        }`}
                      />

                      {role.status}

                    </button>

                  </td>

                  <td className="px-5 py-5">

                    <div className="flex justify-end gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          openEditRole(role)
                        }
                        className="w-10 h-10 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center"
                        title="Edit Role"
                      >
                        <FaEdit />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteRole(role)
                        }
                        className="w-10 h-10 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center"
                        title="Delete Role"
                      >
                        <FaTrash />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {filteredRoles.length === 0 && (

        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">

          <FaUsersCog className="mx-auto text-4xl text-slate-300" />

          <h3 className="mt-4 text-lg font-bold text-slate-700">
            No roles found
          </h3>

          <p className="text-slate-500 mt-2">
            Try changing your filters or create a new role.
          </p>

          <button
            type="button"
            onClick={openAddRole}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#19D68C] text-white font-semibold"
          >
            <FaPlus />
            Add Role
          </button>

        </div>

      )}

      {/* =================================================
          MODAL
      ================================================= */}

      {showModal && (

        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden">

            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-slate-800">
                  {editingRole
                    ? "Edit Role"
                    : "Create Role"}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Configure the organizational role.
                </p>

              </div>

              <button
                type="button"
                onClick={closeModal}
                className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <FaTimes />
              </button>

            </div>

            <form
              onSubmit={saveRole}
              className="p-6 space-y-5"
            >

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Role Name
                  </label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Marketing Manager"
                    className="w-full h-11 rounded-xl border border-slate-300 px-4 outline-none focus:border-[#19D68C]"
                  />

                </div>

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Department
                  </label>

                  <input
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    placeholder="Marketing"
                    className="w-full h-11 rounded-xl border border-slate-300 px-4 outline-none focus:border-[#19D68C]"
                  />

                </div>

              </div>

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe this role..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none resize-none focus:border-[#19D68C]"
                />

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Role Level
                  </label>

                  <select
                    name="level"
                    value={form.level}
                    onChange={handleChange}
                    className="w-full h-11 rounded-xl border border-slate-300 px-4 outline-none focus:border-[#19D68C]"
                  >
                    <option>Entry-Level</option>
                    <option>Junior</option>
                    <option>Mid-Level</option>
                    <option>Senior</option>
                    <option>Manager</option>
                    <option>Director</option>
                    <option>Executive</option>
                  </select>

                </div>

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full h-11 rounded-xl border border-slate-300 px-4 outline-none focus:border-[#19D68C]"
                  >
                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>
                  </select>

                </div>

              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">

                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#19D68C] hover:bg-[#15C67D] text-white font-semibold flex items-center gap-2"
                >
                  <FaSave />

                  {editingRole
                    ? "Save Changes"
                    : "Create Role"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

// =====================================================
// STAT CARD
// =====================================================

function StatCard({
  title,
  value,
  icon,
  className,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 min-w-0">

      <div className="flex items-center justify-between gap-3">

        <div className="min-w-0">

          <p className="text-sm text-slate-500 truncate">
            {title}
          </p>

          <p className="text-3xl font-bold text-slate-800 mt-2">
            {value}
          </p>

        </div>

        <div
          className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center ${className}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}