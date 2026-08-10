import { Outlet, useLocation } from "react-router-dom";
import EmployeeSidebar from "../components/layout/EmployeeSidebar";
import { useAuth } from "../context/AuthContext";

function EmployeeLayout() {
  const location = useLocation();
  const { user } = useAuth();

  const getTitle = () => {
    switch (location.pathname) {
      case "/employee/dashboard":
        return "Dashboard";

      case "/employee/courses":
        return "My Courses";

      case "/employee/progress":
        return "Learning Progress";

      case "/employee/quiz":
        return "Quiz";

      case "/employee/certificates":
        return "Certificates";

      case "/employee/notifications":
        return "Notifications";

      default:
        return "Employee Portal";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <div className="fixed inset-y-0 left-0 z-40 w-[270px]">
        <EmployeeSidebar />
      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="ml-[270px] min-h-screen min-w-0">

        {/* ===================================================
            HEADER
        =================================================== */}

        <header className="sticky top-0 z-30 h-[76px] bg-white border-b border-gray-200">

          <div className="h-full px-8 flex items-center justify-between">

            {/* Page title */}

            <div className="min-w-0">

              <h1 className="text-2xl font-bold text-[#07152B]">
                {getTitle()}
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Employee Portal
              </p>

            </div>

            {/* Employee */}

            <div className="flex items-center gap-3">

              <div className="hidden sm:block text-right">

                <p className="text-sm font-semibold text-[#07152B]">
                  {user?.name || "Employee"}
                </p>

                <p className="text-xs text-gray-500">
                  Employee
                </p>

              </div>

              <div className="w-10 h-10 rounded-full bg-[#18D39A] flex items-center justify-center text-white font-bold">
                {(user?.name || "E")
                  .charAt(0)
                  .toUpperCase()}
              </div>

            </div>

          </div>

        </header>

        {/* ===================================================
            PAGE CONTENT
        =================================================== */}

        <main className="w-full min-w-0 p-8 overflow-x-hidden">

          <Outlet />

        </main>

      </div>

    </div>
  );
}

export default EmployeeLayout;