import { useEffect, useState } from "react";
import {
  FaClipboardCheck,
  FaCheckCircle,
  FaPlayCircle,
} from "react-icons/fa";

import assignmentService from "../../services/assignmentService";

function Quiz() {
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
        Loading Quiz Center...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          Quiz Center
        </h1>

        <p className="text-gray-500 mt-2">
          Attempt quizzes for your assigned courses.
        </p>

      </div>

      {assignments.length === 0 ? (

        <div className="bg-white rounded-3xl shadow p-12 text-center">

          <FaClipboardCheck className="mx-auto text-6xl text-gray-300" />

          <h2 className="text-2xl font-bold mt-6">
            No Quizzes Available
          </h2>

          <p className="text-gray-500 mt-3">
            Your instructor hasn't assigned any quizzes yet.
          </p>

        </div>

      ) : (

        <div className="grid lg:grid-cols-2 gap-8">

          {assignments.map((assignment) => (

            <div
              key={assignment._id}
              className="bg-white rounded-3xl shadow-lg p-6"
            >

              <h2 className="text-2xl font-bold">
                {assignment.course?.courseTitle}
              </h2>

              <p className="text-gray-500 mt-3">
                {assignment.course?.modules?.length || 0} Modules
              </p>

              <div className="mt-6">

                <div className="flex justify-between mb-2">

                  <span>Course Progress</span>

                  <span className="font-semibold">
                    {assignment.progress}%
                  </span>

                </div>

                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-[#18D39A]"
                    style={{
                      width: `${assignment.progress}%`,
                    }}
                  />

                </div>

              </div>

              <div className="mt-8">

                {assignment.status === "Completed" ? (

                  <button
                    className="w-full bg-[#18D39A] hover:bg-[#14b67c] text-white py-3 rounded-xl flex items-center justify-center gap-2"
                  >

                    <FaPlayCircle />

                    Take Final Assessment

                  </button>

                ) : (

                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-600 py-3 rounded-xl cursor-not-allowed"
                  >

                    Complete Course to Unlock Quiz

                  </button>

                )}

              </div>

              {assignment.status === "Completed" && (

                <div className="mt-5 flex items-center gap-2 text-green-600 font-semibold">

                  <FaCheckCircle />

                  Eligible for Final Assessment

                </div>

              )}

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Quiz;