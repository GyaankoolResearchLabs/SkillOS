import { Link } from "react-router-dom";
import {
  FaCloudUploadAlt,
  FaUserPlus,
  FaClipboardCheck,
  FaBookOpen,
} from "react-icons/fa";

function ActivityPanel() {
  const activities = [
    {
      id: 1,
      title: "SOP uploaded",
      description: "Innovative Tech Training SOP.pdf",
      time: "10:30 AM",
      date: "Today",
      icon: <FaCloudUploadAlt />,
      bgColor: "bg-[#19D68C]",
    },
    {
      id: 2,
      title: "Employee added",
      description: "Rahul Sharma added to the system",
      time: "09:15 AM",
      date: "Today",
      icon: <FaUserPlus />,
      bgColor: "bg-[#3B82F6]",
    },
    {
      id: 3,
      title: "Course assigned",
      description: "Innovative Tech Training assigned to 5 employees",
      time: "Yesterday",
      date: "04:45 PM",
      icon: <FaClipboardCheck />,
      bgColor: "bg-[#F59E0B]",
    },
    {
      id: 4,
      title: "AI Course generated",
      description: "SkilOS Test Course generated",
      time: "Yesterday",
      date: "11:20 AM",
      icon: <FaBookOpen />,
      bgColor: "bg-[#8B5CF6]",
    },
    {
      id: 5,
      title: "SOP uploaded",
      description: "Sales Process SOP.pdf",
      time: "2 May 2026",
      date: "03:30 PM",
      icon: <FaCloudUploadAlt />,
      bgColor: "bg-[#19D68C]",
    },
  ];

  return (
    <div className="bg-white rounded-[18px] border border-[#E8EDF3] p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-6">
          <h3 className="text-lg font-extrabold text-[#111827]">
            Activity Timeline
          </h3>
          <Link
            to="/activity"
            className="text-xs font-semibold px-4 py-2 border border-[#E8EDF3] bg-white rounded-[10px] hover:bg-slate-50 transition-colors text-[#111827]"
          >
            View All
          </Link>
        </div>

        {/* Vertical Connecting Timeline */}
        <div className="relative pl-6 space-y-6 before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E8EDF3]">
          {activities.map((act) => (
            <div key={act.id} className="relative flex items-start justify-between gap-4">
              {/* Circular Icon Node */}
              <div
                className={`absolute -left-6 top-0 w-7 h-7 rounded-full ${act.bgColor} text-white flex items-center justify-center text-xs shadow-xs border-2 border-white`}
              >
                {act.icon}
              </div>

              {/* Text Meta */}
              <div className="min-w-0 flex-1 pl-2">
                <h4 className="text-xs font-bold text-[#111827] leading-tight">
                  {act.title}
                </h4>
                <p className="text-xs text-[#6B7280] mt-0.5 font-normal truncate">
                  {act.description}
                </p>
              </div>

              {/* Right Aligned Timestamp */}
              <div className="text-right text-[11px] font-medium text-[#9CA3AF] shrink-0 leading-tight">
                <div>{act.time}</div>
                <div>{act.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Link */}
      <div className="border-t border-[#F3F4F6] pt-4 mt-6 text-center">
        <Link
          to="/"
          className="text-xs font-bold text-[#111827] hover:text-[#19D68C] transition-colors inline-block"
        >
          View All Activity
        </Link>
      </div>
    </div>
  );
}

export default ActivityPanel;