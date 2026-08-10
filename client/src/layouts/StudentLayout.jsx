import { Outlet, useLocation } from "react-router-dom";

import StudentSidebar from "../components/layout/StudentSidebar";
import StudentNavbar from "../components/layout/StudentNavbar";

function StudentLayout() {

  const location = useLocation();

  const getTitle = () => {

    switch (location.pathname) {

      case "/student/dashboard":
        return "Dashboard";

      case "/student/courses":
        return "My Courses";

      case "/student/quiz":
        return "Quiz";

      case "/student/certificates":
        return "Certificates";

      default:
        return "Student Portal";

    }

  };

  return (

    <div className="flex h-screen bg-[#F7F9FC]">

      <StudentSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        <StudentNavbar title={getTitle()} />

        <main className="flex-1 overflow-y-auto p-8">

          <Outlet />

        </main>

      </div>

    </div>

  );

}

export default StudentLayout;