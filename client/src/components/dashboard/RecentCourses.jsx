import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaClock,
  FaLayerGroup,
  FaEllipsisV,
  FaFileAlt,
  FaChevronDown,
} from "react-icons/fa";

function RecentCourses({ courses = [], onDelete }) {
  const [search, setSearch] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);

  const defaultMockCourses = [
    {
      _id: "mock-1",
      courseTitle: "Innovative Tech Training",
      description: "AI-generated from uploaded SOP document",
      estimatedDuration: "110 Minutes",
      modules: new Array(11).fill(0),
      gradient: "from-[#19D68C] to-[#10B981]",
    },
    {
      _id: "mock-2",
      courseTitle: "SkilOS Test Course",
      description: "Generated from uploaded SOP",
      estimatedDuration: "30 Minutes",
      modules: new Array(2).fill(0),
      gradient: "from-[#3B82F6] to-[#2563EB]",
    },
    {
      _id: "mock-3",
      courseTitle: "Sales Process Training",
      description: "AI-generated from uploaded SOP",
      estimatedDuration: "45 Minutes",
      modules: new Array(5).fill(0),
      gradient: "from-[#8B5CF6] to-[#7C3AED]",
    },
  ];

  const displayCourses = courses.length > 0 ? courses : defaultMockCourses;

  const filtered = displayCourses.filter((c) =>
    c.courseTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-[18px] border border-[#E8EDF3] p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-5">
          <h3 className="text-lg font-extrabold text-[#111827]">
            Recent AI Generated Courses
          </h3>
          <Link
            to="/courses"
            className="text-xs font-semibold px-4 py-2 border border-[#E8EDF3] bg-white rounded-[10px] hover:bg-slate-50 transition-colors text-[#111827]"
          >
            View All
          </Link>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-6">
          <div className="sm:col-span-8 relative">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-xs pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="w-full bg-[#F7F9FC] border border-[#E8EDF3] rounded-[12px] py-2 pl-9 pr-3 text-xs text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#19D68C]"
            />
            <FaSearch className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-xs pointer-events-none" />
          </div>
          <div className="sm:col-span-4 relative">
            <select className="w-full bg-[#F7F9FC] border border-[#E8EDF3] rounded-[12px] py-2 px-3 text-xs text-[#111827] font-semibold appearance-none focus:outline-none cursor-pointer pr-8">
              <option>All Courses</option>
              <option>Generated</option>
              <option>Draft</option>
            </select>
            <FaChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-xs pointer-events-none" />
          </div>
        </div>

        {/* Course Stacked List */}
        <div className="divide-y divide-[#F3F4F6]">
          {filtered.slice(0, 3).map((course, idx) => {
            const gradients = [
              "bg-gradient-to-br from-[#19D68C] to-[#10B981]",
              "bg-gradient-to-br from-[#3B82F6] to-[#2563EB]",
              "bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED]",
            ];
            const bgGradient = gradients[idx % gradients.length];

            return (
              <div
                key={course._id}
                className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Large Thumbnail File Square */}
                  <div
                    className={`w-14 h-14 rounded-[16px] ${bgGradient} flex items-center justify-center text-white relative shrink-0 shadow-xs`}
                  >
                    <FaFileAlt size={22} className="opacity-90" />
                    <span className="absolute bottom-1 right-1 bg-black/40 text-[9px] font-extrabold px-1 rounded text-white tracking-wider">
                      AI
                    </span>
                  </div>

                  {/* Details */}
                  <div className="min-w-0">
                    <Link
                      to={`/course/${course._id}`}
                      className="font-extrabold text-sm text-[#111827] hover:text-[#19D68C] transition-colors truncate block"
                    >
                      {course.courseTitle}
                    </Link>
                    <p className="text-xs text-[#6B7280] truncate mt-0.5 font-normal">
                      {course.description || "AI-generated from uploaded SOP document"}
                    </p>

                    <div className="flex items-center gap-4 mt-2 text-xs text-[#6B7280] font-medium">
                      <span className="flex items-center gap-1">
                        <FaClock className="text-[#9CA3AF] text-[11px]" />
                        {course.estimatedDuration || "30 Minutes"}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaLayerGroup className="text-[#9CA3AF] text-[11px]" />
                        {course.modules?.length || 2} Modules
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Status Badge & 3-Dot Menu */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className="bg-[#E8FFF6] text-[#19D68C] text-xs font-bold px-3 py-1 rounded-full border border-[#19D68C]/20">
                    Generated
                  </span>

                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveMenu(activeMenu === course._id ? null : course._id)
                      }
                      className="text-[#9CA3AF] hover:text-[#111827] p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <FaEllipsisV className="text-xs" />
                    </button>

                    {activeMenu === course._id && (
                      <div className="absolute right-0 top-8 bg-white border border-[#E8EDF3] rounded-[12px] shadow-lg p-1.5 w-36 z-20 text-xs">
                        <Link
                          to={`/course/${course._id}`}
                          className="block px-3 py-2 text-[#111827] hover:bg-slate-50 font-medium rounded-lg"
                        >
                          View Details
                        </Link>
                        {onDelete && (
                          <button
                            onClick={() => {
                              onDelete(course._id);
                              setActiveMenu(null);
                            }}
                            className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 font-medium rounded-lg"
                          >
                            Delete Course
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Link */}
      <div className="border-t border-[#F3F4F6] pt-4 mt-6 text-center">
        <Link
          to="/"
          className="text-xs font-bold text-[#111827] hover:text-[#19D68C] transition-colors inline-block"
        >
          View All Courses
        </Link>
      </div>
    </div>
  );
}

export default RecentCourses;
