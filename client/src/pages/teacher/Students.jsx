import { useEffect, useMemo, useState } from "react";
import {
  FaSearch,
  FaUserGraduate,
  FaEnvelope,
  FaBuilding,
  FaChartLine,
} from "react-icons/fa";

import employeeService from "../../services/employeeService";
import assignmentService from "../../services/assignmentService";

function Students() {
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [studentRes, assignmentRes] = await Promise.all([
        employeeService.getEmployees(),
        assignmentService.getAssignments(),
      ]);

      setStudents(studentRes.data.employees || []);
      setAssignments(assignmentRes.data.assignments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const value =
        `${student.name} ${student.email} ${student.department}`.toLowerCase();

      return value.includes(search.toLowerCase());
    });
  }, [students, search]);

  const getStudentAssignments = (studentId) => {
    return assignments.filter(
      (assignment) =>
        assignment.employee &&
        assignment.employee._id === studentId
    );
  };

  const getAverageProgress = (studentId) => {
    const list = getStudentAssignments(studentId);

    if (list.length === 0) return 0;

    return Math.round(
      list.reduce(
        (sum, assignment) => sum + assignment.progress,
        0
      ) / list.length
    );
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-xl">
        Loading Students...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          Students
        </h1>

        <p className="text-gray-500 mt-2">
          View enrolled learners and monitor their progress.
        </p>

      </div>

      <div className="bg-white rounded-2xl shadow p-5">

        <div className="relative">

          <FaSearch className="absolute left-4 top-4 text-gray-400" />

          <input
            type="text"
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border rounded-xl outline-none"
          />

        </div>

      </div>

      <div className="grid gap-6">

        {filteredStudents.length === 0 ? (

          <div className="bg-white rounded-2xl shadow p-10 text-center">

            <h2 className="text-2xl font-semibold">
              No Students Found
            </h2>

          </div>

        ) : (

          filteredStudents.map((student) => {

            const studentAssignments =
              getStudentAssignments(student._id);

            const completed =
              studentAssignments.filter(
                (assignment) =>
                  assignment.status === "Completed"
              ).length;

            const progress =
              getAverageProgress(student._id);

            return (

              <div
                key={student._id}
                className="bg-white rounded-2xl shadow p-6"
              >

                <div className="flex justify-between items-center">

                  <div>

                    <div className="flex items-center gap-3">

                      <FaUserGraduate className="text-[#18D39A] text-2xl" />

                      <h2 className="text-2xl font-bold">
                        {student.name}
                      </h2>

                    </div>

                    <div className="flex flex-wrap gap-6 mt-4 text-gray-600">

                      <div className="flex items-center gap-2">
                        <FaEnvelope />
                        {student.email}
                      </div>

                      <div className="flex items-center gap-2">
                        <FaBuilding />
                        {student.department || "N/A"}
                      </div>

                    </div>

                  </div>

                  <div className="text-right">

                    <p className="text-gray-500">
                      Average Progress
                    </p>

                    <h2 className="text-3xl font-bold text-[#18D39A]">
                      {progress}%
                    </h2>

                  </div>

                </div>

                <div className="mt-6">

                  <div className="flex justify-between mb-2">

                    <span className="text-gray-500">
                      Progress
                    </span>

                    <span className="font-semibold">
                      {progress}%
                    </span>

                  </div>

                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">

                    <div
                      className="h-full bg-[#18D39A]"
                      style={{
                        width: `${progress}%`,
                      }}
                    />

                  </div>

                </div>

                <div className="grid grid-cols-3 gap-4 mt-8">

                  <div className="bg-gray-50 rounded-xl p-4 text-center">

                    <p className="text-gray-500">
                      Assigned
                    </p>

                    <h3 className="text-2xl font-bold mt-2">
                      {studentAssignments.length}
                    </h3>

                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 text-center">

                    <p className="text-gray-500">
                      Completed
                    </p>

                    <h3 className="text-2xl font-bold mt-2 text-green-600">
                      {completed}
                    </h3>

                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 text-center">

                    <FaChartLine className="mx-auto text-[#18D39A] text-2xl mb-2" />

                    <p className="font-semibold">
                      Learning Active
                    </p>

                  </div>

                </div>

              </div>

            );

          })

        )}

      </div>

    </div>
  );
}

export default Students;