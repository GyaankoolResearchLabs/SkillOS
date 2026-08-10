import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBookOpen,
  FaClipboardList,
  FaGraduationCap,
  FaAward,
  FaPlay,
  FaChartLine,
} from "react-icons/fa";

import assignmentService from "../../services/assignmentService";
import { useAuth } from "../../context/AuthContext";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await assignmentService.getAssignments();
      setAssignments(res.data.assignments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const total = assignments.length;

    const completed = assignments.filter(
      (a) => a.status === "Completed"
    ).length;

    const avg =
      total === 0
        ? 0
        : Math.round(
            assignments.reduce(
              (sum, a) => sum + (a.progress || 0),
              0
            ) / total
          );

    return {
      total,
      completed,
      avg,
      certificates: completed,
    };
  }, [assignments]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 text-xl">
        Loading Dashboard...
      </div>
    );
  }

  const continueCourse =
    assignments.find(
      (assignment) => assignment.status !== "Completed"
    ) || null;

  return (
    <div className="space-y-8">

      {/* ================= HERO ================= */}

      <div className="rounded-3xl bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] text-white p-10">

        <div className="flex flex-col lg:flex-row justify-between gap-8">

          <div>

            <p className="uppercase tracking-[5px] text-white/80 text-sm font-semibold">
              SkillOS Academic
            </p>

            <h1 className="text-4xl font-black mt-3">
              {new Date().getHours() < 12
                ? "Good Morning,"
                : new Date().getHours() < 17
                ? "Good Afternoon,"
                : "Good Evening,"}
              <br />
              {user?.name || "Student"}
            </h1>

            <p className="mt-5 text-white/90 max-w-2xl leading-8 text-lg">
              Continue your learning journey, complete your assigned
              courses, improve your quiz performance, and earn
              certificates as you progress through your academic
              curriculum.
            </p>

            <button
              onClick={() => {
                if (continueCourse) {
                  navigate(`/student/course/${continueCourse._id}`);
                } else {
                  navigate("/student/courses");
                }
              }}
              className="mt-8 bg-white text-indigo-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
            >
              Resume Learning
            </button>

          </div>

          <div className="bg-white/15 backdrop-blur rounded-3xl p-8 min-w-[280px]">

            <p className="text-white/80 uppercase tracking-wider text-sm">
              Semester Progress
            </p>

            <h2 className="text-7xl font-black mt-3">
              {stats.avg}%
            </h2>

            <div className="mt-5 h-3 bg-white/20 rounded-full overflow-hidden">

              <div
                className="h-full bg-white"
                style={{
                  width: `${stats.avg}%`,
                }}
              />

            </div>

          </div>

        </div>

      </div>

      {/* ================= KPI ================= */}

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-white rounded-3xl shadow-lg p-7 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer">

          <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">
            <FaBookOpen className="text-3xl text-blue-600" />
          </div>

          <h2 className="text-5xl font-black mt-6">
            {stats.total}
          </h2>

          <p className="mt-2 text-gray-500">
            Courses Assigned
          </p>

        </div>

        <div className="bg-white rounded-3xl shadow-lg p-7 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer">

          <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center">
            <FaClipboardList className="text-3xl text-orange-500" />
          </div>

          <h2 className="text-5xl font-black mt-6">
            {stats.completed}
          </h2>

          <p className="mt-2 text-gray-500">
            Courses Completed
          </p>

        </div>

        <div className="bg-white rounded-3xl shadow-lg p-7 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer">

          <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center">
            <FaChartLine className="text-3xl text-green-600" />
          </div>

          <h2 className="text-5xl font-black mt-6">
            {stats.avg}%
          </h2>

          <p className="mt-2 text-gray-500">
            Overall Progress
          </p>

        </div>

        <div className="bg-white rounded-3xl shadow-lg p-7 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer">

          <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center">
            <FaAward className="text-3xl text-purple-600" />
          </div>

          <h2 className="text-5xl font-black mt-6">
            {stats.certificates}
          </h2>

          <p className="mt-2 text-gray-500">
            Academic Certificates
          </p>

        </div>

      </div>

      {/* ================= CONTINUE LEARNING ================= */}

      <div className="bg-white rounded-3xl shadow-lg p-8">

        <div className="flex justify-between items-center mb-8">

          <div>

            <h2 className="text-3xl font-black">
              Continue Learning
            </h2>

            <p className="text-gray-500 mt-2">
              Pick up exactly where you left off.
            </p>

          </div>

          <FaGraduationCap className="text-5xl text-indigo-600" />

        </div>

        {!continueCourse ? (

          <div className="text-center py-16">

            <FaAward className="mx-auto text-6xl text-green-500" />

            <h3 className="text-3xl font-bold mt-6">
              Congratulations!
            </h3>

            <p className="text-gray-500 mt-3">
              You have completed every assigned course.
            </p>

          </div>

        ) : (

          <div className="border rounded-3xl p-8 bg-gradient-to-r from-indigo-50 to-blue-50">

            <h3 className="text-3xl font-black">
              {continueCourse.course?.courseTitle}
            </h3>

            <p className="text-gray-500 mt-2">
              {continueCourse.course?.estimatedDuration}
            </p>

            <div className="mt-8">

              <div className="flex justify-between mb-2">

                <span>Course Progress</span>

                <span className="font-bold">
                  {continueCourse.progress}%
                </span>

              </div>

              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">

                <div
                  className="h-full bg-indigo-600 rounded-full"
                  style={{
                    width: `${continueCourse.progress}%`,
                  }}
                />

              </div>

            </div>

            <button
              onClick={() =>
                navigate(`/student/course/${continueCourse._id}`)
              }
              className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl flex items-center gap-3"
            >
              <FaPlay />
              Resume Learning
            </button>

          </div>

        )}

      </div>

    </div>
  );
}

export default Dashboard;