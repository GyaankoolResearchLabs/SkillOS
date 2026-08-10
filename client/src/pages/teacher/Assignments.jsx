import { useEffect, useMemo, useState } from "react";
import {
  FaClipboardCheck,
  FaSearch,
  FaUserGraduate,
  FaBook,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

import assignmentService from "../../services/assignmentService";

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const res = await assignmentService.getAssignments();
      setAssignments(res.data.assignments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssignments = useMemo(() => {
    return assignments.filter((assignment) => {
      const value = `
        ${assignment.employee?.name || ""}
        ${assignment.employee?.email || ""}
        ${assignment.course?.courseTitle || ""}
      `.toLowerCase();

      return value.includes(search.toLowerCase());
    });
  }, [assignments, search]);

  if (loading) {
    return (
      <div className="text-center mt-20 text-xl">
        Loading Assignments...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          Course Assignments
        </h1>

        <p className="text-gray-500 mt-2">
          Monitor learner progress across assigned courses.
        </p>

      </div>

      <div className="bg-white rounded-2xl shadow p-5">

        <div className="relative">

          <FaSearch className="absolute left-4 top-4 text-gray-400" />

          <input
            type="text"
            placeholder="Search by student or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border rounded-xl outline-none"
          />

        </div>

      </div>

      {filteredAssignments.length === 0 ? (

        <div className="bg-white rounded-2xl shadow p-10 text-center">

          <h2 className="text-2xl font-semibold">
            No Assignments Found
          </h2>

        </div>

      ) : (

        <div className="space-y-6">

          {filteredAssignments.map((assignment) => (

            <div
              key={assignment._id}
              className="bg-white rounded-2xl shadow p-6"
            >

              <div className="flex justify-between items-start">

                <div className="space-y-3">

                  <div className="flex items-center gap-3">
                    <FaUserGraduate className="text-[#18D39A]" />

                    <h2 className="text-2xl font-bold">
                      {assignment.employee?.name}
                    </h2>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600">
                    <FaBook />
                    {assignment.course?.courseTitle}
                  </div>

                  <div className="text-gray-500">
                    {assignment.employee?.email}
                  </div>

                </div>

                <span
                  className={`px-4 py-2 rounded-full font-semibold text-sm ${
                    assignment.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : assignment.status === "In Progress"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {assignment.status}
                </span>

              </div>

              <div className="mt-8">

                <div className="flex justify-between mb-2">

                  <span className="font-medium">
                    Course Progress
                  </span>

                  <span className="font-bold">
                    {assignment.progress}%
                  </span>

                </div>

                <div className="h-3 rounded-full bg-gray-200 overflow-hidden">

                  <div
                    className="h-full bg-[#18D39A] transition-all"
                    style={{
                      width: `${assignment.progress}%`,
                    }}
                  />

                </div>

              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-8">

                <div className="bg-gray-50 rounded-xl p-4 text-center">

                  <FaClipboardCheck className="mx-auto text-blue-500 text-2xl mb-2" />

                  <p className="text-gray-500">
                    Modules Completed
                  </p>

                  <h3 className="text-2xl font-bold mt-2">
                    {assignment.completedModules?.length || 0}
                  </h3>

                </div>

                <div className="bg-gray-50 rounded-xl p-4 text-center">

                  <FaClock className="mx-auto text-yellow-500 text-2xl mb-2" />

                  <p className="text-gray-500">
                    Started
                  </p>

                  <h3 className="font-semibold mt-2">
                    {assignment.startedAt
                      ? new Date(
                          assignment.startedAt
                        ).toLocaleDateString()
                      : "Not Started"}
                  </h3>

                </div>

                <div className="bg-gray-50 rounded-xl p-4 text-center">

                  <FaCheckCircle className="mx-auto text-green-500 text-2xl mb-2" />

                  <p className="text-gray-500">
                    Completed
                  </p>

                  <h3 className="font-semibold mt-2">
                    {assignment.completedAt
                      ? new Date(
                          assignment.completedAt
                        ).toLocaleDateString()
                      : "--"}
                  </h3>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Assignments;