import { NavLink, useNavigate } from "react-router-dom";

import {
  FaHome,
  FaBookOpen,
  FaChartLine,
  FaClipboardCheck,
  FaCertificate,
  FaBell,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";

import getskilledLogo from "../../assets/getskilled-logo.png";

import { useAuth } from "../../context/AuthContext";

import useOrganizationSettings from "../../hooks/useOrganizationSettings";

function EmployeeSidebar() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  // =====================================================
  // ORGANIZATION SETTINGS
  // =====================================================

  const {
    organizationName,
    tagline,
    logo,
  } = useOrganizationSettings();

  // =====================================================
  // BRANDING
  // =====================================================

  const displayName =
    organizationName?.trim() || "SkillOS";

  const displayTagline =
    tagline?.trim() || "";

  const displayLogo =
    logo || getskilledLogo;

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // =====================================================
  // NAVIGATION STYLE
  // =====================================================

  const navClass = ({ isActive }) =>
    `
      flex
      items-center
      gap-3
      px-4
      py-3
      rounded-xl
      transition-all
      duration-200
      font-semibold
      ${
        isActive
          ? "bg-[#18D39A] text-white shadow-lg"
          : "text-slate-300 hover:bg-[#1E293B] hover:text-white"
      }
    `;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <aside
      className="
        fixed
        left-0
        top-0
        z-40
        flex
        h-screen
        w-[270px]
        flex-col
        overflow-hidden
        bg-[#0F172A]
        border-r
        border-[#1F2937]
      "
    >
      {/* =================================================
          BRANDING
      ================================================= */}

      <div
        className="
          flex-shrink-0
          p-6
          border-b
          border-[#1F2937]
        "
      >
        {/* Logo */}

        <div
          className="
            h-16
            w-full
            bg-white
            rounded-xl
            p-3
            flex
            items-center
            justify-center
          "
        >
          <img
            src={displayLogo}
            alt={`${displayName} logo`}
            className="
              max-h-10
              max-w-full
              object-contain
            "
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = getskilledLogo;
            }}
          />
        </div>

        {/* Organization Name */}

        <h1
          className="
            mt-5
            text-3xl
            font-black
            text-white
            truncate
          "
          title={displayName}
        >
          {displayName}
        </h1>

        {/* Tagline */}

        {displayTagline && (
          <p
            className="
              mt-2
              text-sm
              text-slate-400
              line-clamp-2
            "
            title={displayTagline}
          >
            {displayTagline}
          </p>
        )}

        {/* Portal */}

        <p
          className="
            mt-3
            text-xs
            font-semibold
            uppercase
            tracking-wider
            text-slate-500
          "
        >
          Employee Portal
        </p>
      </div>

      {/* =================================================
          NAVIGATION
      ================================================= */}

      <div
        className="
          flex-1
          min-h-0
          overflow-y-auto
          overflow-x-hidden
          px-5
          py-6
        "
      >
        <p
          className="
            mb-5
            text-xs
            font-bold
            uppercase
            tracking-[3px]
            text-slate-500
          "
        >
          Navigation
        </p>

        <nav className="space-y-2">
          {/* Dashboard */}

          <NavLink
            to="/employee/dashboard"
            className={navClass}
          >
            <FaHome />
            <span>Dashboard</span>
          </NavLink>

          {/* Notifications */}

          <NavLink
            to="/employee/notifications"
            className={navClass}
          >
            <FaBell />
            <span>Notifications</span>
          </NavLink>

          {/* My Courses */}

          <NavLink
            to="/employee/courses"
            className={navClass}
          >
            <FaBookOpen />
            <span>My Courses</span>
          </NavLink>

          {/* Learning Progress */}

          <NavLink
            to="/employee/progress"
            className={navClass}
          >
            <FaChartLine />
            <span>Learning Progress</span>
          </NavLink>

          {/* Quiz */}

          <NavLink
            to="/employee/quiz"
            className={navClass}
          >
            <FaClipboardCheck />
            <span>Quiz</span>
          </NavLink>

          {/* Certificates */}

          <NavLink
            to="/employee/certificates"
            className={navClass}
          >
            <FaCertificate />
            <span>Certificates</span>
          </NavLink>
        </nav>
      </div>

      {/* =================================================
          USER AREA
      ================================================= */}

      <div
        className="
          flex-shrink-0
          w-full
          border-t
          border-[#1F2937]
          bg-[#0F172A]
          p-4
        "
      >
        {/* User */}

        <div
          className="
            flex
            w-full
            items-center
            gap-3
            rounded-2xl
            bg-[#1F2937]
            p-4
          "
        >
          <div
            className="
              flex
              h-12
              w-12
              flex-shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#18D39A]
              text-white
            "
          >
            <FaUserCircle size={28} />
          </div>

          <div className="min-w-0 flex-1">
            <h3
              className="
                truncate
                font-semibold
                text-white
              "
            >
              {user?.name || "Employee"}
            </h3>

            <p
              className="
                truncate
                text-xs
                text-slate-400
              "
            >
              {user?.email || ""}
            </p>
          </div>
        </div>

        {/* Logout */}

        <button
          type="button"
          onClick={handleLogout}
          className="
            mt-4
            flex
            h-11
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-[#334155]
            text-slate-300
            transition
            hover:border-red-500
            hover:bg-red-500
            hover:text-white
          "
        >
          <FaSignOutAlt />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default EmployeeSidebar;