import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBook,
  FaClock,
  FaPlayCircle,
  FaCheckCircle,
} from "react-icons/fa";

import assignmentService from "../../services/assignmentService";

function MyCourses() {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 text-xl">
        Loading Courses...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold">
          My Courses
        </h1>

        <p className="text-gray-500 mt-2">
          Continue learning from your assigned courses.
        </p>
      </div>

      {assignments.length === 0 ? (

        <div className="bg-white rounded-3xl shadow p-12 text-center">

          <FaBook className="mx-auto text-6xl text-gray-300" />

          <h2 className="text-2xl font-bold mt-6">
            No Courses Assigned
          </h2>

          <p className="text-gray-500 mt-3">
            Your instructor has not assigned any courses yet.
          </p>

        </div>

      ) : (

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

          {assignments.map((assignment) => (

            <div
              key={assignment._id}
              className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all p-6"
            >

              <FaBook className="text-5xl text-[#18D39A]" />

              <h2 className="text-2xl font-bold mt-5">
                {assignment.course?.courseTitle}
              </h2>

              <p className="text-gray-500 mt-3 line-clamp-3">
                {assignment.course?.description}
              </p>

              <div className="flex items-center gap-2 mt-5 text-gray-600">
                <FaClock />
                {assignment.course?.estimatedDuration || "N/A"}
              </div>

              <div className="mt-6">

                <div className="flex justify-between mb-2">

                  <span>Progress</span>

                  <span className="font-semibold">
                    {assignment.progress || 0}%
                  </span>

                </div>

                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-[#18D39A]"
                    style={{
                      width: `${assignment.progress || 0}%`,
                    }}
                  />

                </div>

              </div>

              <div className="mt-8 flex justify-between items-center">

                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    assignment.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : assignment.status === "In Progress"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {assignment.status}
                </span>

                {assignment.status === "Completed" && (
                  <FaCheckCircle className="text-green-600 text-xl" />
                )}

              </div>

              <button
                onClick={() =>
                  navigate(`/student/course/${assignment._id}`)
                }
                className="mt-8 w-full bg-[#18D39A] hover:bg-[#14b67c] text-white py-3 rounded-xl flex justify-center items-center gap-2"
              >

                <FaPlayCircle />

                Continue Learning

              </button>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default MyCourses;