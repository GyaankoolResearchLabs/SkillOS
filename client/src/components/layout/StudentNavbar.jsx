import {
  FaBell,
  FaSearch,
  FaUserCircle,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";

function StudentNavbar({ title }) {

  const { user } = useAuth();

  return (

    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">

      <div>

        <h1 className="text-3xl font-bold">
          {title}
        </h1>

        <p className="text-gray-500 mt-1">
          Welcome back, {user?.name}
        </p>

      </div>

      <div className="flex items-center gap-5">

        <div className="relative">

          <FaSearch className="absolute left-4 top-4 text-gray-400"/>

          <input
            placeholder="Search courses..."
            className="w-80 h-12 rounded-xl border pl-11"
          />

        </div>

        <button className="w-12 h-12 rounded-xl border relative">

          <FaBell className="mx-auto"/>

          <span className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full"/>

        </button>

        <div className="flex items-center gap-3">

          <FaUserCircle
            size={46}
            className="text-[#18D39A]"
          />

          <div>

            <h3 className="font-bold">
              {user?.name}
            </h3>

            <p className="text-gray-500 text-sm">
              Student
            </p>

          </div>

        </div>

      </div>

    </header>

  );

}

export default StudentNavbar;