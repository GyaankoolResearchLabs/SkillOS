import { Outlet, useLocation } from "react-router-dom";

import EmployeeSidebar from "../components/layout/EmployeeSidebar";
import EmployeeNavbar from "../components/layout/EmployeeNavbar";

function EmployeeLayout() {
  const location = useLocation();

  // =======================================
  // Page Title
  // =======================================

  const getTitle = () => {
    switch (location.pathname) {
      case "/employee/dashboard":
        return "Dashboard";
      case "/employee/notifications":
      return "Notifications";
      case "/employee/courses":
        return "My Courses";

      case "/employee/progress":
        return "Learning Progress";

      case "/employee/quiz":
        return "Quiz";

      case "/employee/certificates":
        return "Certificates";

      default:
        return "Employee Portal";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* =======================================
          Employee Sidebar
      ======================================= */}

      <EmployeeSidebar />

      {/* =======================================
          Main Application Area
      ======================================= */}

      <div
        className="
          ml-[270px]
          min-h-screen
          w-[calc(100%-270px)]
          flex
          flex-col
        "
      >
        {/* =======================================
            Top Navbar
        ======================================= */}

        <EmployeeNavbar
          title={getTitle()}
        />

        {/* =======================================
            Page Content
        ======================================= */}

        <main
          className="
            flex-1
            min-w-0
            p-8
          "
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default EmployeeLayout;