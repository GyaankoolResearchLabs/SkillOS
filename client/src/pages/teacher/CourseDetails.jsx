import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaBookOpen,
  FaLayerGroup,
  FaClock,
  FaPlus,
} from "react-icons/fa";

import api from "../../services/api";
import assignmentService from "../../services/assignmentService";

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [courseRes, studentRes] = await Promise.all([
        api.get(`/courses/${id}`),
        api.get("/employees/students"),
      ]);

      setCourse(courseRes.data.course);
      setStudents(studentRes.data.students || []);
    } catch (err) {
      console.error(err);
      alert("Unable to load course.");
    } finally {
      setLoading(false);
    }
  };

  const toggleStudent = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const assignStudents = async () => {
    if (selectedStudents.length === 0) {
      alert("Please select at least one student.");
      return;
    }

    try {
      setAssigning(true);

      await Promise.all(
        selectedStudents.map((studentId) =>
          assignmentService.assignCourse({
            studentId,
            courseId: course._id,
          })
        )
      );

      alert("Course assigned successfully.");

      setSelectedStudents([]);

      await loadData();

    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Unable to assign course."
      );
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-xl">
        Loading Course...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* Course Header */}

      <div className="bg-white rounded-3xl shadow p-8">

  <button
    onClick={() => navigate("/teacher/courses")}
    className="mb-6 px-5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
  >
    ← Back to Courses
  </button>

        <h1 className="text-4xl font-bold">
          {course.courseTitle}
        </h1>

        <p className="mt-3 text-gray-500">
          {course.description}
        </p>

        <div className="flex flex-wrap gap-8 mt-8">

          <div className="flex items-center gap-2">
            <FaLayerGroup className="text-blue-500" />
            <span>{course.modules?.length || 0} Modules</span>
          </div>

          <div className="flex items-center gap-2">
            <FaClock className="text-orange-500" />
            <span>{course.estimatedDuration}</span>
          </div>

          <div className="flex items-center gap-2">
            <FaBookOpen className="text-green-500" />
            <span>{course.status}</span>
          </div>

        </div>

      </div>

      {/* Students */}

      <div className="bg-white rounded-3xl shadow p-8">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            Assign Students
          </h2>

          <button
            onClick={assignStudents}
            disabled={
              assigning ||
              selectedStudents.length === 0
            }
            className="bg-[#18D39A] hover:bg-[#14b67c] disabled:bg-gray-300 text-white px-6 py-3 rounded-xl flex items-center gap-2"
          >
            <FaPlus />

            {assigning
              ? "Assigning..."
              : "Assign Selected"}
          </button>

        </div>

        {students.length === 0 ? (

          <div className="text-center py-10 text-gray-500">
            No students available.
          </div>

        ) : (

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">

            {students.map((student) => (

              <label
                key={student._id}
                className={`border rounded-2xl p-5 cursor-pointer transition ${
                  selectedStudents.includes(student._id)
                    ? "border-[#18D39A] bg-green-50"
                    : "border-gray-200"
                }`}
              >

                <div className="flex items-center gap-4">

                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(
                      student._id
                    )}
                    onChange={() =>
                      toggleStudent(student._id)
                    }
                  />

                  <div>

                    <h3 className="font-bold">
                      {student.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {student.email}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {student.department || "Student"}
                    </p>

                  </div>

                </div>

              </label>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default CourseDetails;