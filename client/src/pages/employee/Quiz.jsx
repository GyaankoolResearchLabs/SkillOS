import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaClipboardCheck,
  FaQuestionCircle,
  FaPlayCircle,
  FaCheckCircle,
} from "react-icons/fa";

import assignmentService from "../../services/assignmentService";

function Quiz() {
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
      <div className="flex justify-center mt-24 text-lg text-gray-500">
        Loading quizzes...
      </div>
    );
  }

  const quizCourses = assignments.filter((assignment) =>
    assignment.course?.modules?.some(
      (module) => module.quiz && module.quiz.length > 0
    )
  );

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold">
          Quiz Center
        </h1>

        <p className="text-gray-500 mt-2">
          Complete quizzes to unlock course completion and certificates.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white rounded-2xl shadow p-6">
          <FaClipboardCheck className="text-3xl text-[#18D39A]" />

          <h3 className="mt-4 text-gray-500">
            Courses
          </h3>

          <p className="text-3xl font-bold">
            {quizCourses.length}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <FaQuestionCircle className="text-3xl text-blue-500" />

          <h3 className="mt-4 text-gray-500">
            Total Quizzes
          </h3>

          <p className="text-3xl font-bold">
            {quizCourses.reduce((total, assignment) => {
              return (
                total +
                assignment.course.modules.reduce(
                  (sum, module) =>
                    sum + (module.quiz?.length || 0),
                  0
                )
              );
            }, 0)}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <FaCheckCircle className="text-3xl text-green-500" />

          <h3 className="mt-4 text-gray-500">
            Completed Courses
          </h3>

          <p className="text-3xl font-bold">
            {
              assignments.filter(
                (a) => a.status === "Completed"
              ).length
            }
          </p>
        </div>

      </div>

      {quizCourses.length === 0 ? (

        <div className="bg-white rounded-2xl shadow p-10 text-center">

          <FaQuestionCircle className="mx-auto text-6xl text-gray-300" />

          <h2 className="text-2xl font-bold mt-6">
            No Quizzes Available
          </h2>

          <p className="text-gray-500 mt-3">
            Your assigned courses don't contain quizzes yet.
          </p>

        </div>

      ) : (

        <div className="grid lg:grid-cols-2 gap-6">

          {quizCourses.map((assignment) => {

            const totalQuestions =
              assignment.course.modules.reduce(
                (sum, module) =>
                  sum + (module.quiz?.length || 0),
                0
              );

            return (

              <div
                key={assignment._id}
                className="bg-white rounded-2xl shadow p-6"
              >

                <h2 className="text-2xl font-bold">
                  {assignment.course.courseTitle}
                </h2>

                <p className="text-gray-500 mt-2">
                  {assignment.course.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mt-6">

                  <div className="bg-gray-50 rounded-xl p-4">

                    <div className="text-gray-500 text-sm">
                      Progress
                    </div>

                    <div className="text-xl font-bold mt-1">
                      {assignment.progress}%
                    </div>

                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">

                    <div className="text-gray-500 text-sm">
                      Questions
                    </div>

                    <div className="text-xl font-bold mt-1">
                      {totalQuestions}
                    </div>

                  </div>

                </div>

                <button
                  onClick={() =>
                    navigate(`/employee/course/${assignment._id}`)
                  }
                  className="mt-8 w-full bg-[#18D39A] hover:bg-[#15bc88] text-white py-3 rounded-xl flex justify-center items-center gap-2"
                >
                  <FaPlayCircle />
                  Start Quiz
                </button>

              </div>

            );
          })}

        </div>

      )}

    </div>
  );
}

export default Quiz;