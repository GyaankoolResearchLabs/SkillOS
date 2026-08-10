import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  FaBuilding,
  FaPalette,
  FaSitemap,
  FaUserShield,
  FaLock,
  FaProjectDiagram,
  FaBookOpen,
  FaRobot,
  FaShieldAlt,
  FaBell,
  FaTable,
  FaPaintBrush,
  FaUserCog,
  FaClipboardList,
  FaSearch,
  FaSave,
} from "react-icons/fa";
const menuItems = [
  {
    title: "General",
    path: "general",
    icon: FaBuilding,
  },
  {
    title: "Branding",
    path: "branding",
    icon: FaPalette,
  },
  {
    title: "Departments",
    path: "departments",
    icon: FaSitemap,
  },
  {
    title: "Organization Roles",
    path: "roles",
    icon: FaUserShield,
  },
  {
    title: "Permissions",
    path: "permissions",
    icon: FaLock,
  },
  {
    title: "Workflow Engine",
    path: "workflow",
    icon: FaProjectDiagram,
  },
  {
    title: "SOP Templates",
    path: "templates",
    icon: FaBookOpen,
  },
  {
    title: "AI Configuration",
    path: "ai",
    icon: FaRobot,
  },
  {
    title: "Compliance",
    path: "compliance",
    icon: FaShieldAlt,
  },
  {
    title: "Notifications",
    path: "notifications",
    icon: FaBell,
  },
  {
    title: "Security",
    path: "security",
    icon: FaUserCog,
  },
  {
    title: "Audit Logs",
    path: "audit",
    icon: FaClipboardList,
  },
];
export default function OrganizationLayout() {
  const location = useLocation();

  const current =
    menuItems.find((item) =>
      location.pathname.endsWith(item.path)
    ) || menuItems[0];

  return (
    <div className="flex gap-6 h-full">

      {/* LEFT PANEL */}

      <aside className="w-[270px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">

        <div className="p-6 border-b">

          <h1 className="text-xl font-bold">
            Organization Settings
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Configure your organization.
          </p>

          <div className="relative mt-5">

            <FaSearch className="absolute left-4 top-3.5 text-slate-400" />

            <input
              placeholder="Search..."
              className="w-full rounded-xl border border-slate-300 pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#19D68C]"
            />

          </div>

        </div>

        <nav className="flex-1 overflow-y-auto p-3">
  {menuItems.map((item) => {
    const Icon = item.icon;

    return (
      <NavLink
        key={item.path}
        to={item.path}
        className={({ isActive }) =>
          `flex items-center gap-4 rounded-xl px-4 py-3 mb-2 transition-all duration-200 ${
            isActive
              ? "bg-[#19D68C] text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100"
          }`
        }
      >
        <Icon className="text-lg" />
        <span className="font-medium">{item.title}</span>
      </NavLink>
    );
  })}
</nav>
      </aside>

      {/* RIGHT CONTENT */}

      <section className="flex-1 min-w-0 flex flex-col gap-5">

        {/* PAGE HEADER */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-8 py-6 flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-bold text-slate-800">
              {current.title}
            </h1>

            <p className="mt-2 text-slate-500">
              Configure your organization's {current.title.toLowerCase()} settings.
            </p>

          </div>

        <button
  type="button"
  onClick={() => {
    console.log("Organization Save clicked");

    window.dispatchEvent(
      new CustomEvent("skillos:save-organization")
    );
  }}
  className="
    flex
    items-center
    gap-3
    px-6
    py-3
    rounded-xl
    bg-[#19D68C]
    text-white
    font-semibold
    hover:bg-[#15C67D]
    active:scale-95
    transition-all
    cursor-pointer
  "
>
  <FaSave />
  Save Changes
</button>

        </div>

        {/* PAGE CONTENT */}

        <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">

          <Outlet />

        </div>

      </section>

    </div>
  );
}