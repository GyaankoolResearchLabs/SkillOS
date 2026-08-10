import { Link } from "react-router-dom";
import {
  FaBars,
  FaUserCircle,
  FaChevronDown,
  FaCloudUploadAlt,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";

function ManagerNavbar({
  title = "Dashboard",
  collapsed,
  setCollapsed,
}) {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-white border-b border-[#E8EDF3] flex items-center justify-between px-8 sticky top-0 z-20 shrink-0">

      {/* Left */}

      <div className="flex items-center gap-3">

        <button
  onClick={() => {
  console.log("Clicked");
  console.log(collapsed);
  setCollapsed(!collapsed);
}}
  className="text-[#64748B] hover:text-[#111827] transition"
>
  <FaBars />
</button>

        <div>

          <h1 className="text-[28px] font-black text-[#111827] leading-none">
            {title}
          </h1>

          <p className="text-xs text-[#64748B] mt-1">
            Welcome back,
            <span className="font-bold text-[#111827]">
              {" "}
              {user?.name || "SkillOS Manager"}
            </span>
          </p>

        </div>

      </div>

      {/* Right */}

      <div className="flex items-center gap-3">

        {/* Upload */}

        <Link
          to="/manager/upload"
          className="
            h-11
            px-5
            rounded-xl
            bg-[#19D68C]
            hover:bg-[#16C681]
            text-white
            font-semibold
            text-sm
            flex
            items-center
            gap-2
            transition
            shadow-md
            shadow-[#19D68C]/20
          "
        >

          <FaCloudUploadAlt />

          Upload SOP

        </Link>

        {/* User */}

        <div
          className="
            flex
            items-center
            gap-3
            bg-white
            border
            border-[#E5E7EB]
            rounded-xl
            px-3
            py-2
          "
        >

          <div className="w-10 h-10 rounded-full bg-[#19D68C] flex items-center justify-center text-white">

            <FaUserCircle size={24} />

          </div>

          <div className="hidden md:block">

            <h4 className="text-sm font-bold text-[#111827]">
              {user?.name || "SkillOS Manager"}
            </h4>

            <p className="text-[11px] text-[#64748B]">
              Manager
            </p>

          </div>

          <FaChevronDown className="text-[#94A3B8] text-xs" />

        </div>

      </div>

    </header>
  );
}

export default ManagerNavbar;