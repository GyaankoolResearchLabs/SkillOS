import { useEffect, useState } from "react";
import {
  FaBook,
  FaSearch,
  FaUser,
  FaCheckCircle,
  FaClock,
  FaSpinner,
} from "react-icons/fa";
import toast from "react-hot-toast";

import assignmentService from "../../services/assignmentService";

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // =====================================================
  // LOAD ASSIGNMENTS
  // =====================================================

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);

      const res =
        await assignmentService.getAssignments();

      console.log(
        "TEACHER ASSIGNMENTS:",
        res.data
      );

      setAssignments(
        res.data?.assignments || []
      );
    } catch (err) {
      console.error(
        "LOAD ASSIGNMENTS ERROR:",
        err
      );

      toast.error(
        err.response?.data?.message ||
          "Unable to load assignments."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FILTER ASSIGNMENTS
  // =====================================================

  const filteredAssignments =
    assignments.filter((assignment) => {
      const employeeName =
        assignment.employee?.name || "";

      const employeeEmail =
        assignment.employee?.email || "";

      const courseTitle =
        assignment.course?.courseTitle ||
        assignment.course?.title ||
        "";

      const searchText =
        `${employeeName} ${employeeEmail} ${courseTitle}`
          .toLowerCase();

      const matchesSearch =
        searchText.includes(
          search.toLowerCase()
        );

      const matchesStatus =
        statusFilter === "All" ||
        assignment.status ===
          statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  // =====================================================
  // STATS
  // =====================================================

  const totalAssignments =
    assignments.length;

  const completedAssignments =
    assignments.filter(
      (assignment) =>
        assignment.status ===
        "Completed"
    ).length;

  const inProgressAssignments =
    assignments.filter(
      (assignment) =>
        assignment.status ===
        "In Progress"
    ).length;

  const assignedAssignments =
    assignments.filter(
      (assignment) =>
        assignment.status ===
        "Assigned"
    ).length;

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";

      case "In Progress":
        return "bg-blue-100 text-blue-700";

      case "Assigned":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <FaSpinner className="animate-spin text-xl" />
          <span>
            Loading assignments...
          </span>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="space-y-8 min-w-0">
      {/* =================================================
          HEADER
      ================================================= */}

      <div>
        <h1 className="text-4xl font-black text-[#111827]">
          Assignments
        </h1>

        <p className="text-gray-500 mt-2">
          View and track course assignments
          for employees and students.
        </p>
      </div>

      {/* =================================================
          STATS
      ================================================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Total */}

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Total Assignments
              </p>

              <h2 className="text-3xl font-bold mt-2 text-[#111827]">
                {totalAssignments}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <FaBook className="text-xl text-[#18D39A]" />
            </div>
          </div>
        </div>

        {/* Assigned */}

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Assigned
              </p>

              <h2 className="text-3xl font-bold mt-2 text-[#111827]">
                {assignedAssignments}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
              <FaClock className="text-xl text-yellow-600" />
            </div>
          </div>
        </div>

        {/* In Progress */}

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                In Progress
              </p>

              <h2 className="text-3xl font-bold mt-2 text-[#111827]">
                {inProgressAssignments}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <FaSpinner className="text-xl text-blue-600" />
            </div>
          </div>
        </div>

        {/* Completed */}

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Completed
              </p>

              <h2 className="text-3xl font-bold mt-2 text-[#111827]">
                {completedAssignments}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <FaCheckCircle className="text-xl text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          FILTERS
      ================================================= */}

      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}

          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Search employee or course..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#18D39A]"
            />
          </div>

          {/* Status */}

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#18D39A]"
          >
            <option value="All">
              All Statuses
            </option>

            <option value="Assigned">
              Assigned
            </option>

            <option value="In Progress">
              In Progress
            </option>

            <option value="Completed">
              Completed
            </option>
          </select>
        </div>
      </div>

      {/* =================================================
          ASSIGNMENTS TABLE
      ================================================= */}

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-5 font-semibold text-gray-700">
                  Employee
                </th>

                <th className="text-left p-5 font-semibold text-gray-700">
                  Course
                </th>

                <th className="text-left p-5 font-semibold text-gray-700">
                  Status
                </th>

                <th className="text-left p-5 font-semibold text-gray-700">
                  Progress
                </th>

                <th className="text-left p-5 font-semibold text-gray-700">
                  Assigned
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredAssignments.length ===
              0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-12 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <FaBook className="text-4xl text-gray-300 mb-4" />

                      <h3 className="text-lg font-semibold text-gray-700">
                        No assignments found
                      </h3>

                      <p className="text-gray-400 mt-1">
                        Assign a course to an employee
                        to see it here.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAssignments.map(
                  (assignment) => {
                    const employee =
                      assignment.employee ||
                      {};

                    const course =
                      assignment.course ||
                      {};

                    const progress =
                      assignment.progress ||
                      0;

                    return (
                      <tr
                        key={
                          assignment._id
                        }
                        className="border-t hover:bg-gray-50"
                      >
                        {/* Employee */}

                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#18D39A]/10 flex items-center justify-center">
                              <FaUser className="text-[#18D39A]" />
                            </div>

                            <div>
                              <p className="font-semibold text-gray-800">
                                {employee.name ||
                                  "Unknown Employee"}
                              </p>

                              <p className="text-sm text-gray-400">
                                {employee.email ||
                                  "-"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Course */}

                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <FaBook className="text-[#18D39A]" />

                            <span className="font-medium text-gray-800">
                              {course.courseTitle ||
                                course.title ||
                                "Untitled Course"}
                            </span>
                          </div>
                        </td>

                        {/* Status */}

                        <td className="p-5">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                              assignment.status
                            )}`}
                          >
                            {assignment.status ||
                              "Assigned"}
                          </span>
                        </td>

                        {/* Progress */}

                        <td className="p-5">
                          <div className="w-40">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>
                                Progress
                              </span>

                              <span>
                                {progress}%
                              </span>
                            </div>

                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#18D39A] rounded-full"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    Math.max(
                                      0,
                                      progress
                                    )
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Assigned Date */}

                        <td className="p-5 text-gray-500">
                          {assignment.assignedAt
                            ? new Date(
                                assignment.assignedAt
                              ).toLocaleDateString()
                            : assignment.createdAt
                            ? new Date(
                                assignment.createdAt
                              ).toLocaleDateString()
                            : "-"}
                        </td>
                      </tr>
                    );
                  }
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Assignments;