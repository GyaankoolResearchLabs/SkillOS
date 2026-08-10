import { Link } from "react-router-dom";
import {
  FaCloudUploadAlt,
  FaBookOpen,
  FaUsers,
  FaTasks,
} from "react-icons/fa";

const actions = [
  {
    title: "Upload SOP",
    description: "Generate AI learning modules from SOP documents.",
    icon: <FaCloudUploadAlt />,
    color: "bg-[#E8FFF6] text-[#18D39A]",
    to: "/upload",
  },
  {
    title: "Manage Employees",
    description: "Add, edit and organize employee accounts.",
    icon: <FaUsers />,
    color: "bg-[#EEF6FF] text-[#2563EB]",
    to: "/employees",
  },
  {
    title: "View Courses",
    description: "Review all AI-generated learning courses.",
    icon: <FaBookOpen />,
    color: "bg-[#FFF7E6] text-[#F59E0B]",
    to: "/",
  },
  {
    title: "Assignments",
    description: "Assign courses to your workforce.",
    icon: <FaTasks />,
    color: "bg-[#F3F0FF] text-[#8B5CF6]",
    to: "/employees",
  },
];

function QuickActions() {
  return (
    <div className="mt-12">

      <div className="mb-6">

        <h2 className="text-[28px] font-black text-[#111827]">
          Quick Actions
        </h2>

        <p className="mt-1 text-[#64748B]">
          Frequently used management actions.
        </p>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {actions.map((action) => (
          <Link
            key={action.title}
            to={action.to}
            className="bg-white border border-[#E5E7EB] rounded-3xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${action.color}`}
            >
              {action.icon}
            </div>

            <h3 className="mt-5 text-lg font-bold text-[#111827]">
              {action.title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#64748B]">
              {action.description}
            </p>
          </Link>
        ))}

      </div>

    </div>
  );
}

export default QuickActions;