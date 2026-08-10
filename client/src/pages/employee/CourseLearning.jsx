import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaBookOpen,
  FaPlayCircle,
  FaCheckCircle,
  FaClipboardCheck,
  FaChevronDown,
  FaChevronUp,
  FaLock,
  FaClock,
  FaTrophy,
} from "react-icons/fa";
import toast from "react-hot-toast";

import assignmentService from "../../services/assignmentService";
import { useAuth } from "../../context/AuthContext";

function CourseLearning() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState(null);

  useEffect(() => {
    fetchAssignment();
  }, [id]);

  const fetchAssignment = async () => {
    try {
      setLoading(true);

      const res = await assignmentService.getAssignments();
      const selected = res.data.assignments.find((item) => item._id === id);

      if (!selected) {
        toast.error("Course not found");
        return;
      }

      setAssignment(selected);
    } catch (err) {
      console.error(err);
      toast.error("Unable to load course.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl font-semibold">
        Loading Course...
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl font-semibold">
        Course Not Found
      </div>
    );
  }

  const modules = assignment.course?.modules || [];
  const completedModules = assignment.completedModules || [];
  const completedLessons = assignment.completedLessons || [];
  const quizScores = assignment.quizScores || [];

  const isLessonCompleted = (moduleId) =>
  completedLessons.some(
    (id) => id.toString() === moduleId.toString()
  );

const isModuleCompleted = (moduleId) =>
  completedModules.some(
    (id) => id.toString() === moduleId.toString()
  );
  const hasPassedQuiz = (moduleId) =>
  quizScores.some(
    (quiz) =>
      quiz.moduleId?.toString() ===
        moduleId.toString() &&
      quiz.passed
  );

  const isUnlocked = (index) => {
  if (index === 0) return true;

  return completedModules.some(
    (id) =>
      id.toString() ===
      modules[index - 1]._id.toString()
  );
};

  const toggleModule = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const startLesson = (moduleId) => {
    navigate(`/${user.role}/course/${assignment._id}/module/${moduleId}`);
  };

  const startQuiz = (moduleId) => {
    navigate(`/${user.role}/quiz/${assignment._id}/${moduleId}`);
  };

  const startFinalAssessment = () => {
    navigate(`/${user.role}/final-assessment/${assignment._id}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-lg p-8">
      <h1 className="text-4xl font-bold">
  {assignment.course?.courseTitle}
</h1>

<p className="text-gray-500 mt-3">
  {assignment.course?.description}
</p>
        <div className="grid md:grid-cols-4 gap-5 mt-8">
          <div className="bg-gray-50 rounded-xl p-5">
            <p className="text-gray-500">Progress</p>
            <h2 className="text-3xl font-bold mt-2">{assignment.progress || 0}%</h2>
          </div>

          <div className="bg-gray-50 rounded-xl p-5">
            <p className="text-gray-500">Modules</p>
            <h2 className="text-3xl font-bold mt-2">{modules.length}</h2>
          </div>

          <div className="bg-gray-50 rounded-xl p-5">
            <p className="text-gray-500">Completed</p>
            <h2 className="text-3xl font-bold mt-2">{completedModules.length}</h2>
          </div>

          <div className="bg-gray-50 rounded-xl p-5">
            <p className="text-gray-500">Status</p>
            <h2 className="text-2xl font-bold mt-2">{assignment.status}</h2>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex justify-between mb-2">
            <span>Course Progress</span>
            <span className="font-bold">{assignment.progress || 0}%</span>
          </div>

          <div className="w-full h-4 rounded-full bg-gray-200 overflow-hidden">
            <div
              className="bg-[#18D39A] h-full"
              style={{ width: `${assignment.progress || 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Modules */}
      <div className="space-y-5">
        {modules.map((module, index) => {
          const lessonCompleted = isLessonCompleted(module._id);
          const completed = isModuleCompleted(module._id);
          const quizPassed = hasPassedQuiz(module._id);
          const unlocked = isUnlocked(index);
          const isExpanded = expandedModule === module._id;

          return (
            <div
              key={module._id}
              className="bg-white rounded-3xl shadow-lg overflow-hidden"
            >
              <div
                onClick={() => toggleModule(module._id)}
                className="cursor-pointer p-6 flex justify-between items-center hover:bg-gray-50"
              >
                <div>
                  <h2 className="text-2xl font-bold">Module {index + 1}</h2>
                  <p className="text-lg mt-2">{module.title}</p>
                  <div className="flex items-center gap-2 mt-3 text-gray-500">
                    <FaClock />
                    {module.duration}
                  </div>
                </div>

                <div className="text-2xl">
                  {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>

              {isExpanded && (
                <div className="border-t p-6">
                  <h3 className="text-xl font-bold">Learning Objectives</h3>

                  <ul className="mt-5 space-y-3">
                    {module.learningObjectives?.map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <FaBookOpen className="text-[#18D39A]" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 flex flex-wrap gap-4">

  {!unlocked ? (

    <button
      disabled
      className="bg-gray-300 text-gray-600 px-6 py-3 rounded-xl flex items-center gap-2"
    >
      <FaLock />
      Locked
    </button>

  ) : !lessonCompleted ? (

    <button
      onClick={() => startLesson(module._id)}
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"
    >
      <FaPlayCircle />
      Start Lesson
    </button>

  ) : !quizPassed ? (

    <>
      <button
        disabled
        className="bg-green-600 text-white px-6 py-3 rounded-xl flex items-center gap-2"
      >
        <FaCheckCircle />
        Lesson Completed
      </button>

      <button
        onClick={() => startQuiz(module._id)}
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl flex items-center gap-2"
      >
        <FaClipboardCheck />
        Take Quiz
      </button>
    </>

  ) : (

    <>
      <button
        disabled
        className="bg-green-600 text-white px-6 py-3 rounded-xl flex items-center gap-2"
      >
        <FaCheckCircle />
        Lesson Completed
      </button>

      <button
        disabled
        className="bg-emerald-600 text-white px-6 py-3 rounded-xl flex items-center gap-2"
      >
        <FaCheckCircle />
        Quiz Passed
      </button>
    </>

  )}

</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Final Assessment */}
      {modules.length > 0 &&
  completedModules.length === modules.length && (
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex items-center gap-4">
            <FaTrophy className="text-5xl text-yellow-500" />
            <div>
              <h2 className="text-3xl font-bold">Final Assessment</h2>
              <p className="text-gray-500 mt-2">
                You have completed every module. Take the final assessment to
                earn your certificate.
              </p>
            </div>
          </div>

          <button
            onClick={startFinalAssessment}
            className="mt-8 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg"
          >
            Start Final Assessment
          </button>
        </div>
      )}
    </div>
  );
}

export default CourseLearning;