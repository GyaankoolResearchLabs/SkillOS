import { useEffect, useState } from "react";
import employeeService from "../services/employeeService";
import toast from "react-hot-toast";

import {
  FaUserPlus,
  FaTrash,
  FaEdit,
  FaUsers,
  FaLock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import usePermissions from "../hooks/usePermissions";

function Employees() {
  // =====================================================
  // PERMISSIONS
  // =====================================================

  const { can } = usePermissions();

  const canViewEmployees = can("employees.view");
  const canCreateEmployees = can("employees.create");
  const canEditEmployees = can("employees.edit");
  const canDeleteEmployees = can("employees.delete");

  // =====================================================
  // STATE
  // =====================================================

  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    designation: "",
  });

  // =====================================================
  // LOAD EMPLOYEES
  // =====================================================

  const loadEmployees = async () => {
    /*
     * IMPORTANT:
     *
     * If the user does not have View Employees
     * permission, we don't even request the API.
     */

    if (!canViewEmployees) {
      setEmployees([]);
      return;
    }

    try {
      setLoading(true);

      const res =
        await employeeService.getEmployees();

      setEmployees(
        Array.isArray(res?.data?.employees)
          ? res.data.employees
          : []
      );
    } catch (err) {
      console.error(
        "LOAD EMPLOYEES ERROR:",
        err
      );

      toast.error(
        err.response?.data?.message ||
          "Unable to load employees"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD WHEN VIEW PERMISSION CHANGES
  // =====================================================

  useEffect(() => {
    loadEmployees();
  }, [canViewEmployees]);

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
  // ADD EMPLOYEE
  // =====================================================

  const handleAdd = async (event) => {
    event.preventDefault();

    /*
     * SECURITY CHECK
     *
     * Never rely only on hiding the button.
     */

    if (!canCreateEmployees) {
      toast.error(
        "You do not have permission to create employees."
      );

      return;
    }

    // ---------------------------------------------------
    // Validation
    // ---------------------------------------------------

    if (!form.name.trim()) {
      toast.error("Please enter employee name.");
      return;
    }

    if (!form.email.trim()) {
      toast.error("Please enter employee email.");
      return;
    }

    if (!form.password.trim()) {
      toast.error("Please enter employee password.");
      return;
    }

    if (!form.department.trim()) {
      toast.error("Please enter department.");
      return;
    }

    if (!form.designation.trim()) {
      toast.error("Please enter designation.");
      return;
    }

    try {
      setLoading(true);

      await employeeService.addEmployee({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        department: form.department.trim(),
        designation: form.designation.trim(),
      });

      toast.success(
        "Employee added successfully!"
      );

      // Reset form
      setForm({
        name: "",
        email: "",
        password: "",
        department: "",
        designation: "",
      });

      await loadEmployees();
    } catch (err) {
      console.error(
        "ADD EMPLOYEE ERROR:",
        err
      );

      console.error(
        "SERVER RESPONSE:",
        err.response
      );

      toast.error(
        err.response?.data?.message ||
          "Unable to add employee"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // DELETE EMPLOYEE
  // =====================================================

  const handleDelete = async (id) => {
    /*
     * Permission check even if the button
     * somehow gets triggered programmatically.
     */

    if (!canDeleteEmployees) {
      toast.error(
        "You do not have permission to delete employees."
      );

      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);

      await employeeService.deleteEmployee(id);

      toast.success(
        "Employee deleted successfully."
      );

      await loadEmployees();
    } catch (err) {
      console.error(
        "DELETE EMPLOYEE ERROR:",
        err
      );

      toast.error(
        err.response?.data?.message ||
          "Unable to delete employee"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // EDIT EMPLOYEE
  // =====================================================

  const handleEdit = (employee) => {
    if (!canEditEmployees) {
      toast.error(
        "You do not have permission to edit employees."
      );

      return;
    }

    /*
     * Your current employeeService code provided in this
     * conversation only exposes add/get/delete usage.
     *
     * Therefore we don't invent an update API here.
     *
     * Once employeeService.updateEmployee() exists,
     * this handler can open the edit form.
     */

    toast(
      `Edit employee: ${employee.name}`,
      {
        icon: "!",
      }
    );
  };

  // =====================================================
  // ACCESS DENIED
  // =====================================================

  if (!canViewEmployees) {
    return (
      <div className="w-full min-w-0 space-y-6 pb-10">
        {/* Header */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
              <FaLock className="text-red-500 text-xl" />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Employees
              </h1>

              <p className="text-slate-500 mt-1">
                Manage organization employees.
              </p>
            </div>
          </div>
        </div>

        {/* Access Restricted */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 sm:p-14 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
            <FaLock className="text-red-500 text-2xl" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-5">
            Access Restricted
          </h2>

          <p className="text-slate-500 mt-2 max-w-md mx-auto">
            You do not have permission to view
            employees. Please contact your
            organization administrator.
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="w-full min-w-0 space-y-6 pb-10">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Employees
          </h1>

          <p className="text-slate-500 mt-1">
            Manage organization employees.
          </p>
        </div>

        {/* Permission Status */}

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <FaUsers />

          <span>
            {employees.length}{" "}
            {employees.length === 1
              ? "employee"
              : "employees"}
          </span>
        </div>
      </div>

      {/* =================================================
          ADD EMPLOYEE
      ================================================= */}

      {canCreateEmployees && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#19D68C]/10 flex items-center justify-center">
                <FaUserPlus className="text-[#19D68C]" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Add Employee
                </h2>

                <p className="text-sm text-slate-500">
                  Add a new employee to your organization.
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleAdd}
            className="p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Name */}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Employee name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#19D68C] focus:ring-2 focus:ring-[#19D68C]/10 disabled:bg-slate-100"
                />
              </div>

              {/* Email */}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="employee@company.com"
                  value={form.email}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#19D68C] focus:ring-2 focus:ring-[#19D68C]/10 disabled:bg-slate-100"
                />
              </div>

              {/* Password */}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Temporary Password
                </label>

                <input
                  type="password"
                  name="password"
                  placeholder="Enter temporary password"
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#19D68C] focus:ring-2 focus:ring-[#19D68C]/10 disabled:bg-slate-100"
                />
              </div>

              {/* Department */}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Department
                </label>

                <input
                  type="text"
                  name="department"
                  placeholder="e.g. Marketing"
                  value={form.department}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#19D68C] focus:ring-2 focus:ring-[#19D68C]/10 disabled:bg-slate-100"
                />
              </div>

              {/* Designation */}

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Designation
                </label>

                <input
                  type="text"
                  name="designation"
                  placeholder="e.g. Marketing Executive"
                  value={form.designation}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#19D68C] focus:ring-2 focus:ring-[#19D68C]/10 disabled:bg-slate-100"
                />
              </div>
            </div>

            {/* Submit */}

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-[#19D68C] hover:bg-[#15C67D] disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition"
              >
                <FaUserPlus />

                {loading
                  ? "Processing..."
                  : "Add Employee"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =================================================
          NO CREATE PERMISSION NOTICE
      ================================================= */}

      {!canCreateEmployees && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 flex items-center gap-3">
          <FaLock className="text-slate-400" />

          <p className="text-sm text-slate-600">
            You can view employees, but you do not
            have permission to create new employees.
          </p>
        </div>
      )}

      {/* =================================================
          EMPLOYEE TABLE
      ================================================= */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Table Header */}

        <div className="px-6 py-5 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">
            Employee Directory
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            View and manage employees in your organization.
          </p>
        </div>

        {/* Loading */}

        {loading ? (
          <div className="p-12 text-center">
            <div className="mx-auto w-10 h-10 border-4 border-slate-200 border-t-[#19D68C] rounded-full animate-spin" />

            <p className="text-slate-500 mt-4">
              Loading employees...
            </p>
          </div>
        ) : employees.length === 0 ? (
          /* Empty State */

          <div className="p-12 text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
              <FaUsers className="text-slate-400 text-xl" />
            </div>

            <h3 className="font-bold text-slate-800 mt-4">
              No employees found
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Add an employee to get started.
            </p>
          </div>
        ) : (
          /* Table */

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">

              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Name
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Email
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Department
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Designation
                  </th>

                  {(canEditEmployees ||
                    canDeleteEmployees) && (
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>
                  )}

                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {employees.map((emp) => (
                  <tr
                    key={emp._id}
                    className="hover:bg-slate-50 transition"
                  >

                    {/* Name */}

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-full bg-[#19D68C]/10 flex items-center justify-center shrink-0">
                          <span className="text-[#079B69] font-bold">
                            {emp.name
                              ?.charAt(0)
                              ?.toUpperCase() ||
                              "E"}
                          </span>
                        </div>

                        <span className="font-semibold text-slate-800">
                          {emp.name || "Unnamed"}
                        </span>

                      </div>
                    </td>

                    {/* Email */}

                    <td className="px-6 py-5 text-slate-600">
                      {emp.email || "—"}
                    </td>

                    {/* Department */}

                    <td className="px-6 py-5 text-slate-600">
                      {emp.department || "—"}
                    </td>

                    {/* Designation */}

                    <td className="px-6 py-5 text-slate-600">
                      {emp.designation || "—"}
                    </td>

                    {/* Actions */}

                    {(canEditEmployees ||
                      canDeleteEmployees) && (
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">

                          {/* Edit */}

                          {canEditEmployees && (
                            <button
                              type="button"
                              onClick={() =>
                                handleEdit(emp)
                              }
                              title="Edit employee"
                              className="w-10 h-10 rounded-xl border border-orange-200 text-orange-500 hover:bg-orange-50 flex items-center justify-center transition"
                            >
                              <FaEdit />
                            </button>
                          )}

                          {/* Delete */}

                          {canDeleteEmployees && (
                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  emp._id
                                )
                              }
                              title="Delete employee"
                              className="w-10 h-10 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center transition"
                            >
                              <FaTrash />
                            </button>
                          )}

                        </div>
                      </td>
                    )}

                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* =================================================
          PERMISSION SUMMARY
      ================================================= */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

        <h3 className="font-bold text-slate-900 mb-4">
          Your Employee Permissions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

          {/* View */}

          <PermissionStatus
            label="View Employees"
            enabled={canViewEmployees}
          />

          {/* Create */}

          <PermissionStatus
            label="Create Employees"
            enabled={canCreateEmployees}
          />

          {/* Edit */}

          <PermissionStatus
            label="Edit Employees"
            enabled={canEditEmployees}
          />

          {/* Delete */}

          <PermissionStatus
            label="Delete Employees"
            enabled={canDeleteEmployees}
          />

        </div>
      </div>

    </div>
  );
}

// =====================================================
// PERMISSION STATUS COMPONENT
// =====================================================

function PermissionStatus({
  label,
  enabled,
}) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 flex items-center gap-3 ${
        enabled
          ? "border-green-200 bg-green-50"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      {enabled ? (
        <FaCheckCircle className="text-green-500 shrink-0" />
      ) : (
        <FaTimesCircle className="text-slate-400 shrink-0" />
      )}

      <span
        className={`text-sm font-semibold ${
          enabled
            ? "text-green-700"
            : "text-slate-500"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

export default Employees;