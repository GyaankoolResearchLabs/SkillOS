import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBook,
  FaClock,
  FaEdit,
  FaEye,
  FaTrash,
  FaUpload,
  FaCheckCircle,
  FaUserPlus,
} from "react-icons/fa";

import api from "../../services/api";

import AssignCourseModal from "../../components/assignment/AssignCourseModal";

function Courses() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // GET AUTH TOKEN
  // =====================================================

  const getAuthToken = () => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken");

    return token;
  };

  // =====================================================
  // AUTH HEADERS
  // =====================================================

  const getAuthConfig = () => {
    const token = getAuthToken();

    if (!token) {
      return null;
    }

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // =====================================================
  // LOAD COURSES
  // =====================================================

  const loadCourses = async () => {
    try {
      setLoading(true);

      const config = getAuthConfig();

      if (!config) {
        console.error(
          "LOAD COURSES: Authentication token missing"
        );

        alert(
          "Authentication token missing. Please login again."
        );

        navigate("/login");

        return;
      }

      console.log(
        "LOAD COURSES: Requesting authenticated courses..."
      );

      const response = await api.get(
        "/courses",
        config
      );

      console.log(
        "LOAD COURSES RESPONSE:",
        response.data
      );

      setCourses(
        response.data?.courses || []
      );
    } catch (error) {
      console.error(
        "LOAD COURSES ERROR:",
        error
      );

      console.error(
        "LOAD COURSES STATUS:",
        error.response?.status
      );

      console.error(
        "LOAD COURSES SERVER RESPONSE:",
        error.response?.data
      );

      if (
        error.response?.status === 401
      ) {
        alert(
          "Your session has expired. Please login again."
        );

        localStorage.removeItem("token");
        localStorage.removeItem("authToken");

        navigate("/login");

        return;
      }

      alert(
        error.response?.data?.message ||
          "Unable to load courses."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadCourses();
  }, []);

  // =====================================================
  // PUBLISH COURSE
  // =====================================================

  const publishCourse = async (courseId) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to publish this course?"
      );

    if (!confirmed) return;

    try {
      const config = getAuthConfig();

      if (!config) {
        alert(
          "Authentication token missing. Please login again."
        );

        navigate("/login");

        return;
      }

      console.log(
        "PUBLISH COURSE:",
        courseId
      );

      await api.patch(
        `/courses/${courseId}/publish`,
        {},
        config
      );

      alert(
        "Course published successfully."
      );

      await loadCourses();
    } catch (error) {
      console.error(
        "PUBLISH COURSE ERROR:",
        error
      );

      console.error(
        "PUBLISH STATUS:",
        error.response?.status
      );

      console.error(
        "PUBLISH RESPONSE:",
        error.response?.data
      );

      if (
        error.response?.status === 401
      ) {
        alert(
          "Your session has expired. Please login again."
        );

        localStorage.removeItem("token");
        localStorage.removeItem("authToken");

        navigate("/login");

        return;
      }

      alert(
        error.response?.data?.message ||
          "Unable to publish course."
      );
    }
  };

  // =====================================================
  // DELETE COURSE
  // =====================================================

  const deleteCourse = async (courseId) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to permanently delete this course?"
      );

    if (!confirmed) return;

    try {
      const config = getAuthConfig();

      if (!config) {
        alert(
          "Authentication token missing. Please login again."
        );

        navigate("/login");

        return;
      }

      console.log(
        "DELETE COURSE:",
        courseId
      );

      await api.delete(
        `/courses/${courseId}`,
        config
      );

      alert(
        "Course deleted successfully."
      );

      await loadCourses();
    } catch (error) {
      console.error(
        "DELETE COURSE ERROR:",
        error
      );

      console.error(
        "DELETE STATUS:",
        error.response?.status
      );

      console.error(
        "DELETE RESPONSE:",
        error.response?.data
      );

      if (
        error.response?.status === 401
      ) {
        alert(
          "Your session has expired. Please login again."
        );

        localStorage.removeItem("token");
        localStorage.removeItem("authToken");

        navigate("/login");

        return;
      }

      alert(
        error.response?.data?.message ||
          "Unable to delete course."
      );
    }
  };

  // =====================================================
  // OPEN ASSIGN MODAL
  // =====================================================

  const openAssignModal = (course) => {
    if (!course?._id) {
      alert(
        "Invalid course selected."
      );

      return;
    }

    if (
      course.status !== "Published"
    ) {
      alert(
        "This course must be published before it can be assigned."
      );

      return;
    }

    setSelectedCourse(course);
    setShowAssignModal(true);
  };

  // =====================================================
  // CLOSE ASSIGN MODAL
  // =====================================================

  const closeAssignModal = () => {
    setShowAssignModal(false);
    setSelectedCourse(null);
  };

  // =====================================================
  // ASSIGNMENT SUCCESS
  // =====================================================

  const handleAssigned = async () => {
    closeAssignModal();

    await loadCourses();
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="space-y-8">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

        <div>
          <h1 className="text-3xl font-black text-[#111827]">
            Generated Courses
          </h1>

          <p className="text-[#64748B] mt-2">
            AI-generated learning courses from your SOPs.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/manager/upload")
          }
          className="
            bg-[#18D39A]
            hover:bg-[#14B67C]
            text-white
            px-6
            py-3
            rounded-xl
            flex
            items-center
            justify-center
            gap-2
            font-semibold
            transition
            shadow-sm
          "
        >
          <FaUpload />

          Upload SOP
        </button>
      </div>

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500">
            Loading courses...
          </p>
        </div>
      )}

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {!loading &&
        courses.length === 0 && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-16 text-center">

            <FaBook className="mx-auto text-5xl text-[#18D39A]" />

            <h2 className="text-2xl font-bold text-[#111827] mt-5">
              No Courses Available
            </h2>

            <p className="text-gray-500 mt-3">
              Upload an SOP to generate your first AI course.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/manager/upload")
              }
              className="
                mt-6
                bg-[#18D39A]
                hover:bg-[#14B67C]
                text-white
                px-6
                py-3
                rounded-xl
                font-semibold
              "
            >
              Upload SOP
            </button>
          </div>
        )}

      {/* =================================================
          COURSE GRID
      ================================================= */}

      {!loading &&
        courses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {courses.map((course) => {
              const isPublished =
                course.status === "Published";

              return (
                <div
                  key={course._id}
                  className="
                    bg-white
                    rounded-3xl
                    border
                    border-gray-200
                    p-6
                    shadow-sm
                    hover:shadow-lg
                    transition
                    flex
                    flex-col
                  "
                >

                  {/* COURSE ICON */}

                  <div className="w-14 h-14 rounded-2xl bg-[#E8FBF5] flex items-center justify-center">
                    <FaBook className="text-[#18D39A] text-2xl" />
                  </div>

                  {/* TITLE */}

                  <h2 className="text-2xl font-bold text-[#111827] mt-5">
                    {course.courseTitle}
                  </h2>

                  {/* DESCRIPTION */}

                  <p className="text-[#64748B] mt-3 line-clamp-3 min-h-[72px]">
                    {course.description ||
                      "No course description available."}
                  </p>

                  {/* DURATION */}

                  <div className="flex items-center gap-2 mt-5 text-[#475569]">
                    <FaClock className="text-[#18D39A]" />

                    <span>
                      {course.estimatedDuration ||
                        "Duration not specified"}
                    </span>
                  </div>

                  {/* CREATED */}

                  <div className="mt-5">
                    <p className="font-semibold text-[#334155]">
                      Created
                    </p>

                    <p className="text-[#64748B] mt-1">
                      {formatDate(
                        course.createdAt
                      )}
                    </p>
                  </div>

                  {/* STATUS */}

                  <div className="mt-5">

                    {isPublished ? (
                      <span
                        className="
                          inline-flex
                          items-center
                          gap-2
                          bg-green-100
                          text-green-700
                          px-3
                          py-1
                          rounded-full
                          text-sm
                          font-semibold
                        "
                      >
                        <FaCheckCircle />

                        Published
                      </span>
                    ) : (
                      <span
                        className="
                          inline-flex
                          items-center
                          gap-2
                          bg-yellow-100
                          text-yellow-700
                          px-3
                          py-1
                          rounded-full
                          text-sm
                          font-semibold
                        "
                      >
                        Draft
                      </span>
                    )}

                  </div>

                  {/* ACTIONS */}

                  <div className="grid grid-cols-2 gap-3 mt-8">

                    {/* VIEW */}

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/manager/course/${course._id}`
                        )
                      }
                      className="
                        flex
                        justify-center
                        items-center
                        gap-2
                        py-2.5
                        rounded-xl
                        border
                        border-blue-200
                        text-blue-600
                        hover:bg-blue-50
                        transition
                        font-medium
                      "
                    >
                      <FaEye />

                      View
                    </button>

                    {/* EDIT */}

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/manager/course-editor/${course._id}`
                        )
                      }
                      className="
                        flex
                        justify-center
                        items-center
                        gap-2
                        py-2.5
                        rounded-xl
                        border
                        border-orange-200
                        text-orange-500
                        hover:bg-orange-50
                        transition
                        font-medium
                      "
                    >
                      <FaEdit />

                      Edit
                    </button>

                    {/* PUBLISH */}

                    {!isPublished && (
                      <button
                        type="button"
                        onClick={() =>
                          publishCourse(
                            course._id
                          )
                        }
                        className="
                          flex
                          justify-center
                          items-center
                          gap-2
                          py-2.5
                          rounded-xl
                          border
                          border-green-200
                          text-green-600
                          hover:bg-green-50
                          transition
                          font-medium
                        "
                      >
                        <FaCheckCircle />

                        Publish
                      </button>
                    )}

                    {/* ASSIGN */}

                    {isPublished && (
                      <button
                        type="button"
                        onClick={() =>
                          openAssignModal(
                            course
                          )
                        }
                        className="
                          flex
                          justify-center
                          items-center
                          gap-2
                          py-2.5
                          rounded-xl
                          border
                          border-purple-200
                          text-purple-600
                          hover:bg-purple-50
                          transition
                          font-semibold
                        "
                      >
                        <FaUserPlus />

                        Assign
                      </button>
                    )}

                    {/* DELETE */}

                    <button
                      type="button"
                      onClick={() =>
                        deleteCourse(
                          course._id
                        )
                      }
                      className="
                        flex
                        justify-center
                        items-center
                        gap-2
                        py-2.5
                        rounded-xl
                        border
                        border-red-200
                        text-red-500
                        hover:bg-red-50
                        transition
                        font-medium
                      "
                    >
                      <FaTrash />

                      Delete
                    </button>

                  </div>
                </div>
              );
            })}

          </div>
        )}

      {/* ASSIGN COURSE MODAL */}

      <AssignCourseModal
        open={showAssignModal}
        course={selectedCourse}
        onClose={closeAssignModal}
        onAssigned={handleAssigned}
      />

    </div>
  );
}

export default Courses;