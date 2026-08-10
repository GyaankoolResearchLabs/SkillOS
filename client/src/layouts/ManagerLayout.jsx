import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";

function ManagerLayout() {
  return (
    <div className="min-h-screen bg-[#F7F9FC]">

      {/* =========================================
          SIDEBAR
      ========================================= */}

      <Sidebar />

      {/* =========================================
          CONTENT AREA
      ========================================= */}

      <div
        className="
          ml-[270px]
          min-h-screen
          w-[calc(100%-270px)]
          min-w-0
        "
      >
        <main
          className="
            w-full
            min-w-0
            min-h-screen
            overflow-x-hidden
            p-8
          "
        >
          <div className="w-full min-w-0">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
}

export default ManagerLayout;