import { Outlet, useLocation } from "react-router-dom";

import TeacherSidebar from "../components/layout/TeacherSidebar";
import TeacherNavbar from "../components/layout/TeacherNavbar";

function TeacherLayout() {

  const location = useLocation();

  const getTitle = () => {

    switch (location.pathname) {

      case "/teacher/dashboard":
        return "Dashboard";

      case "/teacher/students":
        return "Students";

      case "/teacher/courses":
        return "Courses";

      case "/teacher/assignments":
        return "Assignments";

      default:
        return "Teacher Portal";

    }

  };

  return (

    <div className="flex h-screen bg-[#F7F9FC]">

      <TeacherSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        <TeacherNavbar title={getTitle()} />

        <main className="flex-1 overflow-y-auto p-8">

          <Outlet />

        </main>

      </div>

    </div>

  );

}

export default TeacherLayout;