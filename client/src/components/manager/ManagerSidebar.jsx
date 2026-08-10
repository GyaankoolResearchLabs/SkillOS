import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  FaHome,
  FaUpload,
  FaUsers,
  FaBookOpen,
  FaSignOutAlt,
  FaUserCircle,
  FaChevronDown,
  FaFileAlt,
  FaBuilding,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import useOrganizationSettings from "../../hooks/useOrganizationSettings";

function ManagerSidebar({ collapsed }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // =====================================================
  // ORGANIZATION SETTINGS
  // =====================================================

  const {
    organizationName,
    shortName,
    tagline,
    logo,
    navigationLabel,
    navigation,
  } = useOrganizationSettings();

  // =====================================================
  // LOCAL BRANDING STATE
  //
  // This guarantees the sidebar refreshes immediately
  // after Branding settings are saved.
  // =====================================================

  const [branding, setBranding] = useState(() => {
    try {
      const saved = localStorage.getItem(
        "skillos_branding"
      );

      if (!saved) {
        return null;
      }

      return JSON.parse(saved);
    } catch (error) {
      console.error(
        "Failed to load sidebar branding:",
        error
      );

      return null;
    }
  });

  // =====================================================
  // REFRESH BRANDING
  // =====================================================

  useEffect(() => {
    const refreshBranding = () => {
      try {
        const saved = localStorage.getItem(
          "skillos_branding"
        );

        if (!saved) {
          setBranding(null);
          return;
        }

        const parsed = JSON.parse(saved);

        setBranding(parsed);
      } catch (error) {
        console.error(
          "Failed to refresh sidebar branding:",
          error
        );
      }
    };

    // Same-tab branding update
    window.addEventListener(
      "organizationSettingsUpdated",
      refreshBranding
    );

    // Other-tab update
    window.addEventListener(
      "storage",
      refreshBranding
    );

    // Refresh when browser/window regains focus
    window.addEventListener(
      "focus",
      refreshBranding
    );

    return () => {
      window.removeEventListener(
        "organizationSettingsUpdated",
        refreshBranding
      );

      window.removeEventListener(
        "storage",
        refreshBranding
      );

      window.removeEventListener(
        "focus",
        refreshBranding
      );
    };
  }, []);

  // =====================================================
  // FINAL DISPLAY VALUES
  //
  // Saved Branding has priority.
  // =====================================================

  const displayName =
    branding?.organizationName?.trim() ||
    organizationName?.trim() ||
    "SkillOS";

  const displayShortName =
    branding?.shortName?.trim() ||
    shortName?.trim() ||
    displayName;

  const displayTagline =
    branding?.tagline?.trim() ||
    tagline?.trim() ||
    "A GyaanKool Enterprise";

  const displayLogo =
    branding?.logo ||
    logo ||
    null;

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    const confirmed = window.confirm(
      `Are you sure you want to logout from ${displayName}?`
    );

    if (!confirmed) {
      return;
    }

    logout();
    navigate("/login");
  };

  // =====================================================
  // ICON MAP
  // =====================================================

  const iconMap = {
    dashboard: FaHome,
    upload: FaUpload,
    employees: FaUsers,
    "role-sops": FaFileAlt,
    courses: FaBookOpen,
    organization: FaBuilding,
  };

  // =====================================================
  // NAVIGATION CLASS
  // =====================================================

  const navClass = ({ isActive }) =>
    `
      flex
      items-center
      ${
        collapsed
          ? "justify-center px-0"
          : "gap-4 px-4"
      }
      py-3.5
      rounded-[14px]
      transition-all
      duration-200
      font-bold
      text-sm
      ${
        isActive
          ? "bg-[#19D68C] text-white shadow-md shadow-[#19D68C]/25"
          : "text-[#94A3B8] hover:bg-[#152438] hover:text-white"
      }
    `;

  // =====================================================
  // VISIBLE NAVIGATION
  // =====================================================

  const visibleNavigation = Array.isArray(
    navigation
  )
    ? navigation.filter(
        (item) => item.visible !== false
      )
    : [];

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <aside
      className={`
        ${
          collapsed
            ? "w-20"
            : "w-[260px]"
        }
        h-screen
        bg-gradient-to-b
        from-[#07152B]
        to-[#0A1835]
        border-r
        border-[#152438]
        flex
        flex-col
        transition-all
        duration-300
        overflow-hidden
        shrink-0
      `}
    >
      {/* ==================================================
          BRAND
      ================================================== */}

      <div
        className="
          p-6
          border-b
          border-[#152438]
          shrink-0
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
              w-14
              h-14
              rounded-2xl
              bg-white
              flex
              items-center
              justify-center
              overflow-hidden
              shrink-0
            "
          >
            {displayLogo ? (
              <img
                src={displayLogo}
                alt={`${displayName} logo`}
                className="
                  w-full
                  h-full
                  object-contain
                  p-1
                "
                onError={(event) => {
                  event.currentTarget.style.display =
                    "none";
                }}
              />
            ) : (
              <span
                className="
                  text-[#19D68C]
                  font-black
                  text-xl
                "
              >
                {displayShortName
                  ?.charAt(0)
                  ?.toUpperCase() || "S"}
              </span>
            )}
          </div>

          {/* COMPANY NAME */}

          {!collapsed && (
            <div className="min-w-0">
              <h2
                className="
                  text-white
                  text-xl
                  font-black
                  truncate
                "
                title={displayName}
              >
                {displayName}
              </h2>

              <p
                className="
                  text-[#64748B]
                  text-xs
                  mt-1
                  truncate
                "
                title={displayTagline}
              >
                {displayTagline}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ==================================================
          NAVIGATION
      ================================================== */}

      <div
        className="
          flex-1
          min-h-0
          overflow-y-auto
          overflow-x-hidden
          px-4
          py-6
        "
      >
        {!collapsed && (
          <p
            className="
              text-[11px]
              font-bold
              uppercase
              tracking-[3px]
              text-[#64748B]
              mb-4
              px-2
            "
          >
            {navigationLabel ||
              "Navigation"}
          </p>
        )}

        <nav className="space-y-2">
          {visibleNavigation.map(
            (item) => {
              const Icon =
                iconMap[item.id] ||
                FaBookOpen;

              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={navClass}
                >
                  <Icon
                    className="
                      text-lg
                      shrink-0
                    "
                  />

                  {!collapsed && (
                    <span className="truncate">
                      {item.label}
                    </span>
                  )}
                </NavLink>
              );
            }
          )}
        </nav>
      </div>

      {/* ==================================================
          USER FOOTER
      ================================================== */}

      {!collapsed && (
        <div
          className="
            border-t
            border-[#152438]
            p-4
            shrink-0
          "
        >
          {/* USER CARD */}

          <div
            className="
              bg-[#101F33]
              rounded-2xl
              p-4
              flex
              items-center
              justify-between
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
                min-w-0
              "
            >
              <div
                className="
                  w-10
                  h-10
                  rounded-full
                  bg-[#19D68C]
                  flex
                  items-center
                  justify-center
                  text-white
                  shrink-0
                "
              >
                <FaUserCircle size={24} />
              </div>

              <div className="min-w-0">
                <h4
                  className="
                    text-white
                    text-sm
                    font-bold
                    truncate
                  "
                >
                  {user?.name ||
                    `${displayShortName} Manager`}
                </h4>

                <p
                  className="
                    text-[#94A3B8]
                    text-xs
                    truncate
                  "
                >
                  {user?.email ||
                    "manager@skillos.com"}
                </p>
              </div>
            </div>

            <FaChevronDown
              className="
                text-[#64748B]
                shrink-0
              "
            />
          </div>

          {/* LOGOUT */}

          <button
            type="button"
            onClick={handleLogout}
            className="
              mt-4
              w-full
              h-11
              rounded-xl
              border
              border-[#22334D]
              text-[#CBD5E1]
              hover:bg-red-500
              hover:border-red-500
              hover:text-white
              transition
              flex
              items-center
              justify-center
              gap-2
            "
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      )}
    </aside>
  );
}

export default ManagerSidebar;