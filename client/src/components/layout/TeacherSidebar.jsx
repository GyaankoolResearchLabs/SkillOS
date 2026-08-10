import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaBookOpen,
  FaClipboardCheck,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import getskilledLogo from "../../assets/getskilled-logo.png";
function TeacherSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
      isActive
        ? "bg-[#18D39A] text-white"
        : "text-slate-300 hover:bg-[#1E293B]"
    }`;

  return (
    <aside className="w-[270px] h-screen bg-[#111827] flex flex-col">

      <div className="p-6 border-b border-slate-700">

        <img
          src={getskilledLogo}
          alt="Logo"
          className="bg-white rounded-lg p-2 h-16"
        />

        <h1 className="text-3xl font-bold text-white mt-6">
          SkillOS
        </h1>

        <p className="text-slate-400">
          Teacher Portal
        </p>

      </div>

      <nav className="flex-1 p-5 space-y-2">

        <NavLink to="/teacher/dashboard" className={navClass}>
          <FaHome />
          Dashboard
        </NavLink>

        <NavLink to="/teacher/students" className={navClass}>
          <FaUsers />
          Students
        </NavLink>

        <NavLink to="/teacher/courses" className={navClass}>
          <FaBookOpen />
          Courses
        </NavLink>

        <NavLink to="/teacher/assignments" className={navClass}>
          <FaClipboardCheck />
          Assignments
        </NavLink>

      </nav>

      <div className="p-5 border-t border-slate-700">

        <div className="flex items-center gap-3 bg-slate-800 rounded-xl p-3">

          <FaUserCircle
            size={34}
            className="text-[#18D39A]"
          />

          <div>

            <h3 className="text-white font-semibold">
              {user?.name}
            </h3>

            <p className="text-slate-400 text-sm">
              Teacher
            </p>

          </div>

        </div>

        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="mt-4 w-full h-11 rounded-xl border border-slate-600 text-white hover:bg-slate-700"
        >
          <FaSignOutAlt className="inline mr-2" />
          Logout
        </button>

      </div>

    </aside>
  );
}

export default TeacherSidebar;