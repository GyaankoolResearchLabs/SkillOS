import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaShieldAlt,
  FaUsers,
  FaCheckCircle,
  FaExclamationTriangle,
  FaBookOpen,
  FaSearch,
  FaSyncAlt,
  FaClock,
  FaChartLine,
} from "react-icons/fa";
import toast from "react-hot-toast";

import api from "../../../services/api";

// =====================================================
// HELPERS
// =====================================================

const normalizeId = (value) => {
  if (!value) return "";

  if (typeof value === "object") {
    return String(value._id || value.id || "");
  }

  return String(value);
};

const getEmployeeId = (employee) => {
  return normalizeId(employee?._id || employee?.id);
};

const getAssignmentEmployeeId = (assignment) => {
  return normalizeId(
    assignment?.employee?._id ||
      assignment?.employee?.id ||
      assignment?.employee
  );
};

const getAssignmentStatus = (assignment) => {
  return String(assignment?.status || "")
    .trim()
    .toLowerCase();
};

// =====================================================
// COMPLIANCE PAGE
// =====================================================

export default function Compliance() {
  const [employees, setEmployees] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // ===================================================
  // LOAD DATA
  // ===================================================

  const loadComplianceData = useCallback(
    async (showRefreshLoader = false) => {
      try {
        if (showRefreshLoader) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const [employeesResponse, assignmentsResponse] =
          await Promise.all([
            api.get("/employees"),
            api.get("/assignments"),
          ]);

        const employeeData =
          employeesResponse?.data?.employees ||
          employeesResponse?.data?.data ||
          [];

        const assignmentData =
          assignmentsResponse?.data?.assignments ||
          assignmentsResponse?.data?.data ||
          [];

        setEmployees(
          Array.isArray(employeeData)
            ? employeeData
            : []
        );

        setAssignments(
          Array.isArray(assignmentData)
            ? assignmentData
            : []
        );
      } catch (error) {
        console.error(
          "COMPLIANCE LOAD ERROR:",
          error
        );

        toast.error(
          error?.response?.data?.message ||
            "Failed to load compliance data."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    loadComplianceData();
  }, [loadComplianceData]);

  // ===================================================
  // EMPLOYEE COMPLIANCE CALCULATION
  // ===================================================

  const employeeCompliance = useMemo(() => {
    return employees.map((employee) => {
      const employeeId = getEmployeeId(employee);

      const employeeAssignments =
        assignments.filter(
          (assignment) =>
            getAssignmentEmployeeId(
              assignment
            ) === employeeId
        );

      const totalAssigned =
        employeeAssignments.length;

      const completed =
        employeeAssignments.filter(
          (assignment) =>
            getAssignmentStatus(assignment) ===
            "completed"
        ).length;

      const inProgress =
        employeeAssignments.filter(
          (assignment) =>
            getAssignmentStatus(assignment) ===
            "in progress"
        ).length;

      const assigned =
        employeeAssignments.filter(
          (assignment) =>
            getAssignmentStatus(assignment) ===
            "assigned"
        ).length;

      const progressValues =
        employeeAssignments
          .map((assignment) =>
            Number(assignment?.progress || 0)
          )
          .filter((value) => !Number.isNaN(value));

      const averageProgress =
        progressValues.length > 0
          ? Math.round(
              progressValues.reduce(
                (sum, value) => sum + value,
                0
              ) / progressValues.length
            )
          : 0;

      /*
       * Compliance rule:
       *
       * 100% = all assigned training completed
       * Partial = some training completed/in progress
       * 0% = no completed training
       *
       * Employees with no assigned training are
       * considered "Not Assigned".
       */

      let complianceScore = 0;
      let complianceStatus = "Not Assigned";

      if (totalAssigned > 0) {
        complianceScore = Math.round(
          (completed / totalAssigned) * 100
        );

        if (complianceScore === 100) {
          complianceStatus = "Compliant";
        } else if (complianceScore > 0) {
          complianceStatus = "In Progress";
        } else {
          complianceStatus = "Attention Required";
        }
      }

      return {
        ...employee,

        employeeId,

        totalAssigned,
        completed,
        inProgress,
        assigned,

        averageProgress,

        complianceScore,
        complianceStatus,
      };
    });
  }, [employees, assignments]);

  // ===================================================
  // OVERALL STATISTICS
  // ===================================================

  const statistics = useMemo(() => {
    const totalEmployees =
      employeeCompliance.length;

    const employeesWithTraining =
      employeeCompliance.filter(
        (employee) =>
          employee.totalAssigned > 0
      );

    const compliantEmployees =
      employeeCompliance.filter(
        (employee) =>
          employee.complianceStatus ===
          "Compliant"
      ).length;

    const attentionRequired =
      employeeCompliance.filter(
        (employee) =>
          employee.complianceStatus ===
          "Attention Required"
      ).length;

    const inProgressEmployees =
      employeeCompliance.filter(
        (employee) =>
          employee.complianceStatus ===
          "In Progress"
      ).length;

    const totalAssigned =
      assignments.length;

    const completedTraining =
      assignments.filter(
        (assignment) =>
          getAssignmentStatus(assignment) ===
          "completed"
      ).length;

    const averageCompliance =
      employeesWithTraining.length > 0
        ? Math.round(
            employeesWithTraining.reduce(
              (sum, employee) =>
                sum + employee.complianceScore,
              0
            ) / employeesWithTraining.length
          )
        : 0;

    return {
      totalEmployees,
      employeesWithTraining:
        employeesWithTraining.length,
      compliantEmployees,
      attentionRequired,
      inProgressEmployees,
      totalAssigned,
      completedTraining,
      averageCompliance,
    };
  }, [employeeCompliance, assignments]);

  // ===================================================
  // SEARCH + FILTER
  // ===================================================

  const filteredEmployees = useMemo(() => {
    const searchTerm =
      search.trim().toLowerCase();

    return employeeCompliance.filter(
      (employee) => {
        const matchesSearch =
          !searchTerm ||
          String(
            employee?.name || ""
          )
            .toLowerCase()
            .includes(searchTerm) ||
          String(
            employee?.email || ""
          )
            .toLowerCase()
            .includes(searchTerm) ||
          String(
            employee?.department || ""
          )
            .toLowerCase()
            .includes(searchTerm) ||
          String(
            employee?.designation || ""
          )
            .toLowerCase()
            .includes(searchTerm);

        const matchesFilter =
          filter === "all" ||
          employee.complianceStatus ===
            filter;

        return (
          matchesSearch &&
          matchesFilter
        );
      }
    );
  }, [
    employeeCompliance,
    search,
    filter,
  ]);

  // ===================================================
  // STATUS STYLES
  // ===================================================

  const getStatusClasses = (status) => {
    switch (status) {
      case "Compliant":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "In Progress":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "Attention Required":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  // ===================================================
  // PROGRESS BAR
  // ===================================================

  const getProgressClasses = (score) => {
    if (score >= 100) {
      return "bg-[#18D39A]";
    }

    if (score >= 50) {
      return "bg-blue-500";
    }

    if (score > 0) {
      return "bg-orange-500";
    }

    return "bg-slate-300";
  };

  // ===================================================
  // LOADING STATE
  // ===================================================

  if (loading) {
    return (
      <div className="min-w-0 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-64 bg-slate-200 rounded" />
            <div className="h-4 w-96 bg-slate-200 rounded" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse"
            >
              <div className="h-10 w-10 bg-slate-200 rounded-xl mb-5" />
              <div className="h-8 w-20 bg-slate-200 rounded mb-3" />
              <div className="h-4 w-32 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="min-w-0 w-full space-y-6">
      {/* =================================================
          HEADER
      ================================================= */}

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                <FaShieldAlt className="text-xl text-[#18D39A]" />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Compliance
                </h1>

                <p className="text-slate-500 mt-1">
                  Monitor employee training compliance
                  and identify learning gaps.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              loadComplianceData(true)
            }
            disabled={refreshing}
            className="
              shrink-0
              inline-flex
              items-center
              justify-center
              gap-2
              px-5
              py-3
              rounded-xl
              bg-[#18D39A]
              hover:bg-[#13B987]
              text-white
              font-semibold
              transition
              disabled:opacity-60
              disabled:cursor-not-allowed
            "
          >
            <FaSyncAlt
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>
        </div>
      </section>

      {/* =================================================
          STATISTICS
      ================================================= */}

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Average Compliance */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Overall Compliance
              </p>

              <h2 className="text-3xl font-bold text-slate-900 mt-2">
                {statistics.averageCompliance}%
              </h2>

              <p className="text-xs text-slate-400 mt-2">
                Across employees with training
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
              <FaChartLine className="text-[#18D39A]" />
            </div>
          </div>
        </div>

        {/* Employees */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Employees
              </p>

              <h2 className="text-3xl font-bold text-slate-900 mt-2">
                {statistics.totalEmployees}
              </h2>

              <p className="text-xs text-slate-400 mt-2">
                {statistics.employeesWithTraining} with
                assigned training
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
              <FaUsers className="text-blue-500" />
            </div>
          </div>
        </div>

        {/* Compliant */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Compliant Employees
              </p>

              <h2 className="text-3xl font-bold text-slate-900 mt-2">
                {statistics.compliantEmployees}
              </h2>

              <p className="text-xs text-emerald-600 mt-2">
                Training fully completed
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
              <FaCheckCircle className="text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Attention */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Attention Required
              </p>

              <h2 className="text-3xl font-bold text-slate-900 mt-2">
                {statistics.attentionRequired}
              </h2>

              <p className="text-xs text-red-500 mt-2">
                Employees with incomplete training
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
              <FaExclamationTriangle className="text-red-500" />
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          TRAINING SUMMARY
      ================================================= */}

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <FaBookOpen className="text-blue-500" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Training Summary
            </h2>

            <p className="text-sm text-slate-500">
              Current organization-wide training status.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">
              Total Assigned
            </p>

            <p className="text-2xl font-bold text-slate-900 mt-2">
              {statistics.totalAssigned}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">
              Completed
            </p>

            <p className="text-2xl font-bold text-emerald-600 mt-2">
              {statistics.completedTraining}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">
              In Progress
            </p>

            <p className="text-2xl font-bold text-blue-600 mt-2">
              {statistics.inProgressEmployees}
            </p>
          </div>
        </div>
      </section>

      {/* =================================================
          EMPLOYEE COMPLIANCE
      ================================================= */}

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}

        <div className="p-6 border-b border-slate-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Employee Compliance
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Review individual employee training
                completion.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}

              <div className="relative">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search employees..."
                  className="
                    w-full
                    sm:w-64
                    h-11
                    pl-10
                    pr-4
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    text-sm
                    text-slate-800
                    outline-none
                    focus:border-[#18D39A]
                    focus:ring-2
                    focus:ring-[#18D39A]/20
                  "
                />
              </div>

              {/* Filter */}

              <select
                value={filter}
                onChange={(e) =>
                  setFilter(e.target.value)
                }
                className="
                  h-11
                  px-4
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  text-sm
                  text-slate-700
                  outline-none
                  focus:border-[#18D39A]
                "
              >
                <option value="all">
                  All Employees
                </option>

                <option value="Compliant">
                  Compliant
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Attention Required">
                  Attention Required
                </option>

                <option value="Not Assigned">
                  Not Assigned
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}

        <div className="overflow-x-auto">
          {filteredEmployees.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center">
                <FaUsers className="text-slate-400 text-xl" />
              </div>

              <h3 className="text-lg font-semibold text-slate-800 mt-4">
                No employees found
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Try changing your search or filter.
              </p>
            </div>
          ) : (
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Employee
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Department
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Training
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Progress
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Compliance
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.map(
                  (employee) => (
                    <tr
                      key={
                        employee.employeeId ||
                        employee._id
                      }
                      className="hover:bg-slate-50 transition"
                    >
                      {/* Employee */}

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#18D39A]/10 text-[#18D39A] flex items-center justify-center font-bold">
                            {String(
                              employee.name ||
                                "E"
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 truncate">
                              {employee.name ||
                                "Unnamed Employee"}
                            </p>

                            <p className="text-xs text-slate-500 truncate">
                              {employee.email ||
                                "No email"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Department */}

                      <td className="px-6 py-5">
                        <p className="text-sm font-medium text-slate-700">
                          {employee.department ||
                            "—"}
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          {employee.designation ||
                            "—"}
                        </p>
                      </td>

                      {/* Training */}

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <FaBookOpen className="text-slate-400" />

                          <span className="text-sm font-semibold text-slate-700">
                            {employee.totalAssigned}
                          </span>
                        </div>

                        <p className="text-xs text-slate-400 mt-1">
                          {employee.completed} completed
                        </p>
                      </td>

                      {/* Progress */}

                      <td className="px-6 py-5">
                        <div className="w-40">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-slate-600">
                              {employee.averageProgress}%
                            </span>

                            <span className="text-xs text-slate-400">
                              {employee.inProgress >
                              0
                                ? `${employee.inProgress} active`
                                : ""}
                            </span>
                          </div>

                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${getProgressClasses(
                                employee.averageProgress
                              )}`}
                              style={{
                                width: `${Math.min(
                                  100,
                                  Math.max(
                                    0,
                                    employee.averageProgress
                                  )
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Compliance */}

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          {employee.complianceStatus ===
                          "Compliant" ? (
                            <FaCheckCircle className="text-emerald-500" />
                          ) : employee.complianceStatus ===
                            "Attention Required" ? (
                            <FaExclamationTriangle className="text-red-500" />
                          ) : (
                            <FaClock className="text-blue-500" />
                          )}

                          <span className="font-bold text-slate-800">
                            {employee.complianceScore}%
                          </span>
                        </div>
                      </td>

                      {/* Status */}

                      <td className="px-6 py-5">
                        <span
                          className={`
                            inline-flex
                            items-center
                            px-3
                            py-1.5
                            rounded-full
                            border
                            text-xs
                            font-bold
                            ${getStatusClasses(
                              employee.complianceStatus
                            )}
                          `}
                        >
                          {employee.complianceStatus}
                        </span>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}

        {filteredEmployees.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
            <p className="text-xs text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {filteredEmployees.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {employeeCompliance.length}
              </span>{" "}
              employees
            </p>
          </div>
        )}
      </section>

      {/* =================================================
          COMPLIANCE INFORMATION
      ================================================= */}

      <section className="bg-slate-900 rounded-2xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 shrink-0 rounded-xl bg-white/10 flex items-center justify-center">
            <FaShieldAlt className="text-[#18D39A]" />
          </div>

          <div>
            <h3 className="font-bold text-lg">
              How compliance is calculated
            </h3>

            <p className="text-sm text-slate-300 mt-2 leading-6">
              An employee is considered compliant when
              all of their assigned training programs are
              completed. Employees with incomplete
              assignments are shown as requiring attention
              or being in progress.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}