import { Link } from "react-router-dom";
import { FaCloudUploadAlt, FaUserPlus } from "react-icons/fa";

function WelcomeSection() {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-10 mb-8">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-[#18D39A] font-semibold uppercase tracking-widest">
            Dashboard Overview
          </p>

          <h1 className="text-5xl font-bold text-[#202B38] mt-2">
            Welcome back 👋
          </h1>

          <p className="text-gray-500 mt-4 text-lg max-w-2xl">
            Manage SOPs, generate AI-powered learning courses,
            assign employees and monitor organizational training.
          </p>

        </div>

        <div className="flex gap-4">

          <Link
            to="/upload"
            className="bg-[#18D39A] hover:bg-[#13B987] text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-3 transition"
          >
            <FaCloudUploadAlt />
            Upload SOP
          </Link>

          <Link
            to="/employees"
            className="border border-gray-300 px-8 py-4 rounded-2xl hover:bg-gray-100 transition flex items-center gap-3"
          >
            <FaUserPlus />
            Add Employee
          </Link>

        </div>

      </div>

    </div>
  );
}

export default WelcomeSection;