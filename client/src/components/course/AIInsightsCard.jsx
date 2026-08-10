import {
  FaBrain,
  FaClock,
  FaLayerGroup,
  FaSignal,
  FaTag,
  FaUsers,
} from "react-icons/fa";

import Card from "../ui/Card";

function AIInsightsCard({ course }) {
  const items = [
    {
      icon: <FaClock />,
      label: "Duration",
      value: course.estimatedDuration || "N/A",
    },
    {
      icon: <FaLayerGroup />,
      label: "Modules",
      value: course.modules?.length || 0,
    },
    {
      icon: <FaSignal />,
      label: "Difficulty",
      value: course.difficulty || "Beginner",
    },
    {
      icon: <FaTag />,
      label: "Category",
      value: course.category || "General",
    },
    {
      icon: <FaUsers />,
      label: "Audience",
      value: course.audience || "Employee",
    },
  ];

  return (
    <Card className="rounded-3xl shadow-lg border border-gray-100 overflow-hidden">

      {/* Header */}

      <div className="flex items-center gap-4 px-6 py-6 border-b border-gray-100">

        <div className="w-14 h-14 rounded-2xl bg-[#E8FFF6] flex items-center justify-center flex-shrink-0">

          <FaBrain
            className="text-[#18D39A]"
            size={24}
          />

        </div>

        <div>

          <h3 className="text-xl font-bold text-[#202B38]">
            AI Insights
          </h3>

          <p className="text-sm text-[#64748B] mt-1">
            Generated from uploaded SOP
          </p>

        </div>

      </div>

      {/* Content */}

      <div className="px-6 py-2">

        {items.map((item, index) => (

          <div
            key={item.label}
            className={`flex items-center justify-between py-5 ${
              index !== items.length - 1
                ? "border-b border-gray-100"
                : ""
            }`}
          >

            <div className="flex items-center gap-4 min-w-0">

              <div className="w-10 h-10 rounded-xl bg-[#F0FFF9] flex items-center justify-center text-[#18D39A] flex-shrink-0">

                {item.icon}

              </div>

              <span className="text-[15px] font-medium text-[#64748B]">
                {item.label}
              </span>

            </div>

            <span className="text-[15px] font-semibold text-[#202B38] text-right ml-4">
              {item.value}
            </span>

          </div>

        ))}

      </div>

    </Card>
  );
}

export default AIInsightsCard;