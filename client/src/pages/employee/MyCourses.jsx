import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBook,
  FaClock,
  FaPlayCircle,
  FaArrowRight,
} from "react-icons/fa";

import assignmentService from "../../services/assignmentService";

function MyCourses() {
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
      const res =
        await assignmentService.getAssignments();

      console.log(
        "Employee Assignments:",
        res.data
      );

      const receivedAssignments =
        res?.data?.assignments || [];

      // -------------------------------------------------
      // Only show valid assignments that contain a course
      // -------------------------------------------------

      const validAssignments =
        receivedAssignments.filter(
          (item) =>
            item &&
            item._id &&
            item.course
        );

      setAssignments(validAssignments);
    } catch (err) {
      console.error(
        "LOAD EMPLOYEE COURSES ERROR:",
        err
      );

      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">

          <div className="w-10 h-10 border-4 border-[#18D39A] border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-500 font-medium">
            Loading your courses...
          </p>

        </div>
      </div>
    );
  }

  // =====================================================
  // EMPTY STATE
  // =====================================================

  if (assignments.length === 0) {
    return (
      <div className="space-y-8">

        <div>
          <h1 className="text-3xl font-black text-gray-900">
            My Courses
          </h1>

          <p className="text-gray-500 mt-2">
            Assigned learning courses
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center">

          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto">
            <FaBook className="text-2xl text-[#18D39A]" />
          </div>

          <h2 className="text-xl font-bold text-gray-900 mt-5">
            No courses assigned
          </h2>

          <p className="text-gray-500 mt-2 max-w-md mx-auto">
            You don't have any learning courses assigned
            to you yet.
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
          PAGE HEADER
      ================================================= */}

      <div>

        <h1 className="text-3xl font-black text-gray-900">
          My Courses
        </h1>

        <p className="text-gray-500 mt-2">
          Assigned learning courses
        </p>

      </div>

      {/* =================================================
          COURSE GRID
      ================================================= */}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {assignments.map((item) => {

          const course = item.course;

          const progress = Math.min(
            Math.max(
              Number(item.progress) || 0,
              0
            ),
            100
          );

          const courseTitle =
            course.courseTitle ||
            course.title ||
            "Untitled Course";

          const description =
            course.description ||
            "Complete this assigned learning course to improve your skills and training progress.";

          const duration =
            course.estimatedDuration ||
            course.duration ||
            "Self-paced";

          return (
            <div
              key={item._id}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
            >

              {/* =================================================
                  COURSE CONTENT
              ================================================= */}

              <div className="p-7 flex-1">

                {/* Course Icon */}

                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">

                  <FaBook className="text-2xl text-[#18D39A]" />

                </div>

                {/* Course Title */}

                <h2 className="text-2xl font-black text-gray-900 mt-6 leading-tight">
                  {courseTitle}
                </h2>

                {/* Description */}

                <p className="text-gray-500 mt-4 leading-7 line-clamp-5">
                  {description}
                </p>

                {/* Duration */}

                <div className="flex items-center gap-2 mt-6 text-gray-600">

                  <FaClock className="text-sm" />

                  <span className="text-sm font-medium">
                    {duration}
                  </span>

                </div>

                {/* =================================================
                    PROGRESS
                ================================================= */}

                <div className="mt-7">

                  <div className="flex items-center justify-between mb-2">

                    <span className="text-sm font-semibold text-gray-600">
                      Progress
                    </span>

                    <span className="text-sm font-bold text-gray-900">
                      {progress}%
                    </span>

                  </div>

                  <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">

                    <div
                      className="h-full bg-[#18D39A] rounded-full transition-all duration-500"
                      style={{
                        width: `${progress}%`,
                      }}
                    />

                  </div>

                </div>

              </div>

              {/* =================================================
                  ACTION
              ================================================= */}

              <div className="px-7 pb-7">

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/employee/course/${item._id}`
                    )
                  }
                  className="w-full bg-[#18D39A] hover:bg-[#13B987] text-white py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold transition"
                >

                  <FaPlayCircle />

                  {progress > 0
                    ? "Continue Learning"
                    : "Start Learning"}

                  <FaArrowRight className="text-sm" />

                </button>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}

export default MyCourses;