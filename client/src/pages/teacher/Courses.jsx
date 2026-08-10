import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBook,
  FaSearch,
  FaLayerGroup,
  FaClipboardList,
  FaSignal,
} from "react-icons/fa";

import courseService from "../../services/courseService";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const res = await courseService.getCourses();
      setCourses(res.data.courses || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      return (
        course.courseTitle
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        course.description
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    });
  }, [courses, search]);

  if (loading) {
    return (
      <div className="text-center mt-20 text-xl">
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
          View and manage your courses.
        </p>

      </div>

      <div className="bg-white rounded-2xl shadow p-5">

        <div className="relative">

          <FaSearch className="absolute left-4 top-4 text-gray-400" />

          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border rounded-xl outline-none"
          />

        </div>

      </div>

      {filteredCourses.length === 0 ? (

        <div className="bg-white rounded-2xl shadow p-10 text-center">

          <h2 className="text-2xl font-semibold">
            No Courses Found
          </h2>

        </div>

      ) : (

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {filteredCourses.map((course) => (

            <div
              key={course._id}
              className="bg-white rounded-3xl shadow hover:shadow-xl transition p-6"
            >

              <FaBook className="text-5xl text-[#18D39A]" />

              <h2 className="text-2xl font-bold mt-5">
                {course.courseTitle}
              </h2>

              <p className="text-gray-500 mt-3 line-clamp-3">
                {course.description}
              </p>

              <div className="space-y-3 mt-6">

                <div className="flex items-center gap-3">
                  <FaLayerGroup className="text-blue-500" />
                  <span>
                    {course.modules?.length || 0} Modules
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <FaClipboardList className="text-orange-500" />
                  <span>
                    {course.totalQuizQuestions || 0} Quiz Questions
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <FaSignal className="text-purple-500" />
                  <span>
                    {course.difficulty || "Beginner"}
                  </span>
                </div>

              </div>

              <div className="mt-8 flex justify-between items-center">

                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    course.status === "Published"
                      ? "bg-green-100 text-green-700"
                      : course.status === "Draft"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {course.status}
                </span>

                <Link
                  to={`/teacher/courses/${course._id}`}
                  className="bg-[#18D39A] hover:bg-[#14b67c] text-white px-5 py-2 rounded-xl transition font-medium"
                >
                  View Course
                </Link>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Courses;