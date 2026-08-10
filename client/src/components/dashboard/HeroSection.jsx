import { Link } from "react-router-dom";
import {
  FaCloudUploadAlt,
  FaChartLine,
} from "react-icons/fa";

function HeroSection() {
  return (
    <section
      className="
        relative
        overflow-hidden
        rounded-[32px]
        bg-gradient-to-r
        from-[#0F172A]
        via-[#1E293B]
        to-[#23404B]
        px-12
        py-14
        mb-10
      "
    >
      {/* Background Glow */}

      <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#18D39A]/10 blur-3xl" />

      <div className="relative z-10 flex items-center justify-between">

        {/* Left */}

        <div className="max-w-3xl">

          <p className="text-[#18D39A] uppercase tracking-[5px] text-sm font-bold mb-5">
            GOOD EVENING
          </p>

          <h1 className="text-[58px] leading-[1.05] font-black text-white">
            Welcome to SkillOS
          </h1>

          <p className="mt-6 text-[20px] leading-9 text-slate-300 max-w-2xl">
            Generate AI-powered learning courses from SOP documents,
            manage employees, assign learning paths and monitor
            organizational training from one centralized dashboard.
          </p>

        </div>

        {/* Right */}

        <div className="flex gap-5 self-start mt-2">

          <Link
            to="/upload"
            className="
              h-14
              px-8
              rounded-2xl
              bg-[#18D39A]
              hover:bg-[#13B987]
              text-white
              font-bold
              flex
              items-center
              gap-3
              shadow-xl
            "
          >
            <FaCloudUploadAlt />
            Upload SOP
          </Link>

          <button
            className="
              h-14
              px-8
              rounded-2xl
              border
              border-white/20
              text-white
              font-bold
              hover:bg-white/10
              flex
              items-center
              gap-3
            "
          >
            <FaChartLine />
            View Reports
          </button>

        </div>

      </div>
    </section>
  );
}

export default HeroSection;