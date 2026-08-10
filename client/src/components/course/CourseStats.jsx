import {
  FaCalendarAlt,
  FaTag,
  FaLayerGroup,
  FaUserGraduate,
} from "react-icons/fa";

function CourseStats({ course }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">

      <div className="bg-white rounded-2xl border p-5 shadow-sm">
        <div className="flex items-center gap-2 text-[#18D39A] mb-2">
          <FaCalendarAlt />
          <span className="text-sm font-semibold">Created On</span>
        </div>

        <p className="font-bold text-[#202B38]">
          {course.createdAt
            ? new Date(course.createdAt).toLocaleString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "N/A"}
        </p>
      </div>

      <div className="bg-white rounded-2xl border p-5 shadow-sm">
        <div className="flex items-center gap-2 text-[#18D39A] mb-2">
          <FaTag />
          <span className="text-sm font-semibold">Category</span>
        </div>

        <p className="font-bold text-[#202B38]">
          {course.category || "General"}
        </p>
      </div>

      <div className="bg-white rounded-2xl border p-5 shadow-sm">
        <div className="flex items-center gap-2 text-[#18D39A] mb-2">
          <FaLayerGroup />
          <span className="text-sm font-semibold">Modules</span>
        </div>

        <p className="font-bold text-[#202B38]">
          {course.modules?.length || 0}
        </p>
      </div>

      <div className="bg-white rounded-2xl border p-5 shadow-sm">
        <div className="flex items-center gap-2 text-[#18D39A] mb-2">
          <FaUserGraduate />
          <span className="text-sm font-semibold">Audience</span>
        </div>

        <p className="font-bold text-[#202B38]">
          {course.audience || "Employee"}
        </p>
      </div>

    </div>
  );
}

export default CourseStats;