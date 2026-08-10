import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaSave,
  FaBookOpen,
  FaCheckCircle,
} from "react-icons/fa";
import toast from "react-hot-toast";

import api from "../../services/api";

function CourseEditor() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/courses/${id}`);

      setCourse(res.data.course);
    } catch (err) {
      console.error("LOAD COURSE ERROR:", err);

      toast.error(
        err.response?.data?.message ||
          "Unable to load course."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!course) return;

    try {
      setSaving(true);

      const res = await api.put(`/courses/${id}`, {
        audience: course.audience,
        category: course.category,
        status: course.status,
      });

      setCourse(res.data.course);

      toast.success(
        course.category === "Onboarding"
          ? "Onboarding course saved. Assessments are being prepared."
          : "Course updated successfully."
      );
    } catch (err) {
      console.error("UPDATE COURSE ERROR:", err);

      toast.error(
        err.response?.data?.message ||
          "Unable to update course."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500 text-lg">
          Loading course...
        </p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="bg-white rounded-3xl shadow p-10 text-center">
        <h2 className="text-2xl font-bold">
          Course Not Found
        </h2>

        <button
          onClick={() => navigate("/manager/courses")}
          className="mt-6 bg-[#18D39A] text-white px-6 py-3 rounded-xl"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  const assessmentCount =
    course.onboardingAssessments?.length || 0;

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center gap-4">

        <div>
          <button
            onClick={() => navigate("/manager/courses")}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4"
          >
            <FaArrowLeft />
            Back to Courses
          </button>

          <h1 className="text-4xl font-black">
            Course Editor
          </h1>

          <p className="text-gray-500 mt-2">
            Configure your training program.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#18D39A] hover:bg-[#14b67c] disabled:opacity-50 text-white px-7 py-3 rounded-xl flex items-center gap-2 font-semibold"
        >
          <FaSave />

          {saving ? "Saving..." : "Save Changes"}
        </button>

      </div>

      {/* Course Information */}
      <div className="bg-white rounded-3xl shadow p-8">

        <div className="flex items-start gap-4 mb-8">

          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
            <FaBookOpen className="text-2xl text-[#18D39A]" />
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              {course.courseTitle}
            </h2>

            <p className="text-gray-500 mt-1">
              Course configuration
            </p>
          </div>

        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {/* Audience */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Audience
            </label>

            <select
              value={course.audience || "Employee"}
              onChange={(e) =>
                setCourse({
                  ...course,
                  audience: e.target.value,
                })
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white outline-none focus:border-[#18D39A]"
            >
              <option value="Employee">
                Employee
              </option>

              <option value="Student">
                Student
              </option>

              <option value="Teacher">
                Teacher
              </option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category
            </label>

            <select
              value={course.category || "Training"}
              onChange={(e) =>
                setCourse({
                  ...course,
                  category: e.target.value,
                })
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white outline-none focus:border-[#18D39A]"
            >
              <option value="Training">
                Training
              </option>

              <option value="Compliance">
                Compliance
              </option>

              <option value="Onboarding">
                Onboarding
              </option>

              <option value="Induction">
                Induction
              </option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>

            <select
              value={course.status || "Published"}
              onChange={(e) =>
                setCourse({
                  ...course,
                  status: e.target.value,
                })
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white outline-none focus:border-[#18D39A]"
            >
              <option value="Draft">
                Draft
              </option>

              <option value="Published">
                Published
              </option>

              <option value="Archived">
                Archived
              </option>
            </select>
          </div>

        </div>

      </div>

      {/* Onboarding Assessment Status */}
      <div className="bg-white rounded-3xl shadow p-8">

        <div className="flex items-center justify-between gap-6">

          <div className="flex items-start gap-4">

            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center">
              <FaCheckCircle className="text-2xl text-green-600" />
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                Onboarding Assessment
              </h2>

              <p className="text-gray-500 mt-1">
                Assessments are automatically generated
                when an Employee course is classified as
                Onboarding.
              </p>
            </div>

          </div>

          <div className="text-right">

            <p className="text-3xl font-black">
              {assessmentCount}
            </p>

            <p className="text-sm text-gray-500">
              Assessments
            </p>

          </div>

        </div>

        {course.audience === "Employee" &&
        (course.category === "Onboarding" ||
          course.category === "Induction") ? (
          <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-100 p-5">

            <p className="font-semibold text-emerald-800">
              This is an onboarding course.
            </p>

            <p className="text-sm text-emerald-700 mt-1">
              Save the course to generate its onboarding
              assessments automatically.
            </p>

          </div>
        ) : (
          <div className="mt-6 rounded-2xl bg-gray-50 border border-gray-100 p-5">

            <p className="font-semibold text-gray-700">
              Onboarding assessments are inactive.
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Set Audience to Employee and Category to
              Onboarding to enable them.
            </p>

          </div>
        )}

      </div>

    </div>
  );
}

export default CourseEditor;