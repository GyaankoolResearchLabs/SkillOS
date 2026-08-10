import { NavLink, useNavigate } from "react-router-dom";
import useOrganizationSettings from "../../hooks/useOrganizationSettings";

import {
  FaHome,
  FaUpload,
  FaUsers,
  FaBook,
  FaBuilding,
  FaFileAlt,
  FaSignOutAlt,
  FaChevronRight,
} from "react-icons/fa";

import getskilledLogo from "../../assets/getskilled-logo.png";
import { useAuth } from "../../context/AuthContext";

function Sidebar({ collapsed = false }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // =====================================================
  // ORGANIZATION BRANDING
  // =====================================================

  const {
    organizationName,
    shortName,
    logo,
    primaryColor,
    secondaryColor,
    tagline,
  } = useOrganizationSettings();

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmed) return;

    logout();
    navigate("/login");
  };

  // =====================================================
  // BRANDING FALLBACKS
  // =====================================================

  const displayName =
    organizationName?.trim() || "SkillOS";

  const displayShortName =
    shortName?.trim() || displayName;

  const displayTagline =
    tagline?.trim() || "AI Powered Learning";

  const displayLogo =
    logo?.trim() || getskilledLogo;

  const activeColor =
    primaryColor || "#19D68C";

  const sidebarColor =
    secondaryColor || "#0B1526";

  // =====================================================
  // MANAGER NAVIGATION
  // =====================================================

  const menuItems = [
    {
      name: "Dashboard",
      path: "/manager/dashboard",
      icon: FaHome,
    },
    {
      name: "Upload SOP",
      path: "/manager/upload",
      icon: FaUpload,
    },
    {
      name: "Employees",
      path: "/manager/employees",
      icon: FaUsers,
    },
    {
      name: "Role SOPs",
      path: "/manager/role-sops",
      icon: FaFileAlt,
    },
    {
      name: "Courses",
      path: "/manager/courses",
      icon: FaBook,
    },
    {
      name: "Organization",
      path: "/manager/organization",
      icon: FaBuilding,
    },
  ];

  // =====================================================
  // NAVIGATION CLASS
  // =====================================================

  const navClass = ({ isActive }) => `
    group
    relative
    flex
    items-center
    ${
      collapsed
        ? "justify-center w-12 h-12 mx-auto"
        : "gap-4 px-4 h-12"
    }
    rounded-xl
    transition-all
    duration-200
    font-semibold
    ${
      isActive
        ? "text-white shadow-md"
        : "text-slate-400 hover:bg-[#14233B] hover:text-white"
    }
  `;

  // =====================================================
  // SIDEBAR
  // =====================================================

  return (
    <aside
      className={`
        flex-shrink-0
        h-screen
        ${
          collapsed
            ? "w-20"
            : "w-[270px]"
        }
        flex
        flex-col
        border-r
        overflow-hidden
        transition-all
        duration-300
        ease-in-out
      `}
      style={{
        backgroundColor: sidebarColor,
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >

      {/* =================================================
          BRAND
      ================================================= */}

      <div
        className="
          flex-shrink-0
          px-5
          py-5
          border-b
          border-[#13233A]
        "
      >
        <div
          className={`
            flex
            items-center
            ${
              collapsed
                ? "justify-center"
                : "gap-3"
            }
          `}
        >

          {/* LOGO */}

          <div
            className="
              w-12
              h-12
              rounded-xl
              bg-white
              flex
              items-center
              justify-center
              flex-shrink-0
              overflow-hidden
              shadow-sm
            "
          >
            <img
              src={displayLogo}
              alt={displayName}
              className="
                w-full
                h-full
                object-contain
                p-1
              "
            />
          </div>

          {/* ORGANIZATION NAME */}

          {!collapsed && (
            <div className="min-w-0 flex-1">

              <h2
                className="
                  text-white
                  text-lg
                  font-bold
                  leading-tight
                  truncate
                "
              >
                {displayName}
              </h2>

              <p
                className="
                  text-slate-400
                  text-xs
                  mt-1
                  truncate
                "
              >
                {displayTagline}
              </p>

            </div>
          )}

        </div>
      </div>

      {/* =================================================
          MENU

          No hardcoded "NAVIGATION" heading.
      ================================================= */}

      <div
        className="
          flex-1
          min-h-0
          overflow-y-auto
          overflow-x-hidden
          py-5
        "
      >
        <nav className="px-3 space-y-2">

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={
                  collapsed
                    ? item.name
                    : undefined
                }
                className={navClass}
              >
                {({ isActive }) => (
                  <>
                    {/* ICON */}

                    <Icon
                      className={`
                        text-lg
                        flex-shrink-0
                        ${
                          isActive
                            ? "text-white"
                            : "text-slate-400"
                        }
                      `}
                    />

                    {/* LABEL */}

                    {!collapsed && (
                      <span className="flex-1 truncate text-[15px]">
                        {item.name}
                      </span>
                    )}

                    {/* ACTIVE ARROW */}

                    {!collapsed && isActive && (
                      <FaChevronRight
                        className="
                          text-xs
                          text-white
                          flex-shrink-0
                        "
                      />
                    )}

                    {/* COLLAPSED TOOLTIP */}

                    {collapsed && (
                      <span
                        className="
                          absolute
                          left-16
                          top-1/2
                          -translate-y-1/2
                          z-[100]
                          whitespace-nowrap
                          rounded-lg
                          bg-slate-900
                          px-3
                          py-2
                          text-xs
                          font-medium
                          text-white
                          opacity-0
                          pointer-events-none
                          translate-x-2
                          transition-all
                          duration-200
                          group-hover:opacity-100
                          group-hover:translate-x-0
                        "
                      >
                        {item.name}
                      </span>
                    )}
                  </>
                )}

              </NavLink>
            );
          })}

        </nav>
      </div>

      {/* =================================================
          USER SECTION
      ================================================= */}

      <div
        className="
          flex-shrink-0
          border-t
          border-[#13233A]
          p-4
        "
      >

        {/* USER CARD */}

        <div
          className={`
            rounded-2xl
            bg-[#0F2036]
            border
            border-[#1A2C47]
            ${
              collapsed
                ? "p-3 flex justify-center"
                : "p-4 flex items-center gap-3"
            }
          `}
        >

          {/* USER AVATAR */}

          <div
            className="
              w-10
              h-10
              rounded-full
              flex
              items-center
              justify-center
              flex-shrink-0
            "
            style={{
              backgroundColor: activeColor,
            }}
          >
            <span className="text-white font-bold text-sm">
              {user?.name
                ?.charAt(0)
                ?.toUpperCase() || "M"}
            </span>
          </div>

          {/* USER INFORMATION */}

          {!collapsed && (
            <div className="min-w-0 flex-1">

              <h3
                className="
                  text-white
                  text-sm
                  font-bold
                  truncate
                "
              >
                {user?.name || "Manager"}
              </h3>

              <p
                className="
                  text-slate-400
                  text-xs
                  truncate
                  mt-0.5
                "
              >
                {user?.email || ""}
              </p>

            </div>
          )}

        </div>

        {/* LOGOUT */}

        <button
          type="button"
          onClick={handleLogout}
          title={
            collapsed
              ? "Logout"
              : undefined
          }
          className={`
            mt-4
            w-full
            rounded-xl
            text-slate-400
            hover:bg-red-500
            hover:text-white
            transition-all
            duration-200
            ${
              collapsed
                ? "h-12 flex items-center justify-center"
                : "h-12 flex items-center gap-3 px-4"
            }
          `}
        >

          <FaSignOutAlt className="text-lg flex-shrink-0" />

          {!collapsed && (
            <span className="font-semibold">
              Logout
            </span>
          )}

        </button>

      </div>

    </aside>
  );
}

export default Sidebar;