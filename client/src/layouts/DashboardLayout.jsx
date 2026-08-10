import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";

import Sidebar from "../components/layout/Sidebar";
import TopNavbar from "../components/layout/TopNavbar";

function DashboardLayout() {
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);

  const getTitle = () => {
    switch (location.pathname) {
      case "/manager/dashboard":
        return "Dashboard";

      case "/manager/upload":
        return "Upload SOP";

      case "/manager/employees":
        return "Employee Management";

      case "/manager/courses":
        return "Courses";

      case "/manager/organization":
        return "Organization";

      default:
        if (location.pathname.startsWith("/manager/course/")) {
          return "Course Details";
        }

        if (
          location.pathname.startsWith(
            "/manager/course-editor/"
          )
        ) {
          return "Course Editor";
        }

        return "SkillOS";
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F7F9FC]">

      {/* ==========================================
          MANAGER SIDEBAR
      ========================================== */}

      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* ==========================================
          MAIN APPLICATION AREA
      ========================================== */}

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">

        {/* Top Navbar */}

        <TopNavbar
          title={getTitle()}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        {/* Page Content */}

        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden p-8">
          <div className="w-full min-w-0">
            <Outlet />
          </div>
        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;