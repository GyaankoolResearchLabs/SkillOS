import { Link } from "react-router-dom";
import {
  FaBookOpen,
  FaClock,
  FaEye,
  FaTrash,
  FaLayerGroup,
  FaCalendarAlt,
} from "react-icons/fa";

function CourseCard({ course, onDelete }) {
  return (
    <div className="bg-white rounded-md border border-[#E2E8F0] overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md mb-6 last:mb-0">
      {/* Top Body Section */}
      <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start gap-4 min-w-0 flex-1">
          {/* Left Green Square Icon Box */}
          <div className="w-12 h-12 rounded-md bg-[#18D39A] text-white flex items-center justify-center text-xl shrink-0 shadow-xs">
            <FaBookOpen />
          </div>

          {/* Title & Description */}
          <div className="min-w-0 flex-1">
            <span className="inline-block bg-[#E8FFF6] text-[#18D39A] font-extrabold text-[10px] px-2.5 py-0.5 rounded-sm uppercase tracking-wider">
              AI Generated Course
            </span>
            <h3 className="text-base md:text-lg font-extrabold text-[#0F172A] mt-1.5 tracking-tight leading-tight truncate">
              {course.courseTitle}
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5 font-normal truncate">
              {course.description || "AI-generated from uploaded SOP document"}
            </p>
          </div>
        </div>

        {/* Right Metadata Metrics & Status */}
        <div className="flex items-center gap-5 shrink-0 flex-wrap md:flex-nowrap pt-2 md:pt-0 border-t md:border-t-0 border-[#F1F5F9]">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#64748B]">
            <FaCalendarAlt className="text-[#94A3B8]" />
            <div>
              <span className="font-bold text-[#0F172A]">
                {new Date(course.createdAt || Date.now()).toLocaleDateString()}
              </span>
              <span className="block text-[10px] text-[#94A3B8] font-normal leading-none">Created</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#64748B]">
            <FaLayerGroup className="text-[#94A3B8]" />
            <div>
              <span className="font-bold text-[#0F172A]">
                {course.modules?.length || 11}
              </span>
              <span className="block text-[10px] text-[#94A3B8] font-normal leading-none">Modules</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#64748B]">
            <FaClock className="text-[#94A3B8]" />
            <div>
              <span className="font-bold text-[#0F172A]">
                {course.estimatedDuration || "110 Minutes"}
              </span>
              <span className="block text-[10px] text-[#94A3B8] font-normal leading-none">Duration</span>
            </div>
          </div>

          <span className="bg-[#E8FFF6] text-[#18D39A] font-bold text-xs px-3 py-1 rounded-sm border border-[#18D39A]/20">
            Generated
          </span>
        </div>
      </div>

      {/* Bottom Action Footer Bar */}
      <div className="bg-[#F8FAFC] border-t border-[#F1F5F9] px-5 py-3 flex items-center justify-between">
        <Link
          to={`/manager/course/${course._id}`}
          className="text-xs font-bold text-[#0F172A] hover:text-[#18D39A] flex items-center gap-2 transition-colors cursor-pointer"
        >
          <FaEye className="text-xs" />
          <span>View Course</span>
        </Link>

        {/* Pop-Up Red Delete Button */}
        <button
          onClick={() => onDelete(course._id)}
          className="bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold text-xs px-3.5 py-1.5 rounded-md shadow-md shadow-red-500/25 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shrink-0 flex items-center gap-1.5 border border-red-400/30"
          title="Delete Course"
        >
          <FaTrash className="text-xs" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}

export default CourseCard;