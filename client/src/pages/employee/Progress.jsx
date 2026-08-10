import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBook,
  FaCheckCircle,
  FaClock,
  FaChartLine,
  FaArrowRight,
} from "react-icons/fa";

import assignmentService from "../../services/assignmentService";

function Progress() {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // LOAD ASSIGNMENTS
  // =====================================================

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const res = await assignmentService.getAssignments();

      const received =
        res?.data?.assignments || [];

      // Only display assignments that have a valid course
      const validAssignments = received.filter(
        (item) =>
          item &&
          item._id &&
          item.course
      );

      setAssignments(validAssignments);
    } catch (error) {
      console.error(
        "LOAD EMPLOYEE PROGRESS ERROR:",
        error
      );

      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // STATISTICS
  // =====================================================

  const stats = useMemo(() => {
    const total = assignments.length;

    const completed = assignments.filter(
      (item) => item.status === "Completed"
    ).length;

    const inProgress = assignments.filter(
      (item) =>
        item.status === "In Progress" ||
        (Number(item.progress) > 0 &&
          item.status !== "Completed")
    ).length;

    const average =
      total === 0
        ? 0
        : Math.round(
            assignments.reduce(
              (sum, item) =>
                sum + (Number(item.progress) || 0),
              0
            ) / total
          );

    return {
      total,
      completed,
      inProgress,
      average,
    };
  }, [assignments]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#18D39A] border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-500 font-medium">
            Loading your progress...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN
  // =====================================================

  return (
    <div className="space-y-8 pb-10">

      {/* =================================================
          HEADER
      ================================================= */}

      <div>
        <h1 className="text-3xl font-black text-gray-900">
          Learning Progress
        </h1>

        <p className="text-gray-500 mt-2">
          Track your learning progress and course completion.
        </p>
      </div>

      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        {/* Total Courses */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Courses
              </p>

              <p className="text-3xl font-black text-gray-900 mt-2">
                {stats.total}
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
              <FaBook className="text-xl text-[#18D39A]" />
            </div>

          </div>
        </div>

        {/* Completed */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Completed
              </p>

              <p className="text-3xl font-black text-gray-900 mt-2">
                {stats.completed}
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <FaCheckCircle className="text-xl text-green-500" />
            </div>

          </div>
        </div>

        {/* In Progress */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                In Progress
              </p>

              <p className="text-3xl font-black text-gray-900 mt-2">
                {stats.inProgress}
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
              <FaClock className="text-xl text-amber-500" />
            </div>

          </div>
        </div>

        {/* Average */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Average Progress
              </p>

              <p className="text-3xl font-black text-gray-900 mt-2">
                {stats.average}%
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <FaChartLine className="text-xl text-blue-500" />
            </div>

          </div>
        </div>

      </div>

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {assignments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">

          <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto">
            <FaBook className="text-2xl text-gray-400" />
          </div>

          <h2 className="text-xl font-bold text-gray-900 mt-5">
            No Learning Activity
          </h2>

          <p className="text-gray-500 mt-2 max-w-md mx-auto">
            Your assigned courses and learning progress
            will appear here once your manager assigns them.
          </p>

        </div>
      ) : (

        /* =================================================
           COURSE PROGRESS
        ================================================= */

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Section Header */}

          <div className="px-6 py-5 border-b border-gray-100">

            <h2 className="text-xl font-bold text-gray-900">
              Course Progress
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Overview of your assigned learning courses.
            </p>

          </div>

          {/* Course Rows */}

          <div className="divide-y divide-gray-100">

            {assignments.map((item) => {

              const progress = Math.min(
                Math.max(
                  Number(item.progress) || 0,
                  0
                ),
                100
              );

              const title =
                item.course?.courseTitle ||
                item.course?.title ||
                "Untitled Course";

              const description =
                item.course?.description ||
                "Assigned learning course.";

              const completedModules =
                item.completedModules?.length || 0;

              const status =
                item.status || "Assigned";

              return (
                <div
                  key={item._id}
                  className="px-6 py-6 hover:bg-gray-50/70 transition"
                >

                  {/* Top */}

                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                    <div className="flex gap-4 min-w-0">

                      <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                        <FaBook className="text-[#18D39A]" />
                      </div>

                      <div className="min-w-0">

                        <h3 className="text-lg font-bold text-gray-900">
                          {title}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {description}
                        </p>

                      </div>

                    </div>

                    {/* Status */}

                    <span
                      className={`self-start px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
                        status === "Completed"
                          ? "bg-green-50 text-green-700"
                          : status === "In Progress"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {status}
                    </span>

                  </div>

                  {/* Progress */}

                  <div className="mt-6">

                    <div className="flex items-center justify-between mb-2">

                      <span className="text-sm font-semibold text-gray-600">
                        Progress
                      </span>

                      <span className="text-sm font-bold text-gray-900">
                        {progress}%
                      </span>

                    </div>

                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-[#18D39A] rounded-full transition-all duration-500"
                        style={{
                          width: `${progress}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* Bottom */}

                  <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                    <div className="text-sm text-gray-500">

                      <span>
                        Modules completed:
                      </span>

                      <span className="ml-2 font-bold text-gray-900">
                        {completedModules}
                      </span>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/employee/course/${item._id}`
                        )
                      }
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#18D39A] hover:bg-[#13B987] text-white font-semibold transition"
                    >
                      View Course
                      <FaArrowRight className="text-xs" />
                    </button>

                  </div>

                </div>
              );
            })}

          </div>

        </div>
      )}

    </div>
  );
}

export default Progress;