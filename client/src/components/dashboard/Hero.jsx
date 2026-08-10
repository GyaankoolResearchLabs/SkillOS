import { Link } from "react-router-dom";
import {
  FaCloudUploadAlt,
  FaUserPlus,
  FaChartLine,
} from "react-icons/fa";

function Hero({ totalCourses, totalEmployees }) {
  return (
    <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#0F172A] via-[#111827] to-[#1E293B] p-10">

      {/* Background Glow */}

      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#18D39A]/10 blur-3xl"></div>

      <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-white/5 blur-2xl"></div>

      <div className="relative flex flex-col lg:flex-row justify-between gap-10">

        {/* LEFT */}

        <div className="max-w-2xl">

          <span className="inline-flex items-center gap-2 rounded-full bg-[#18D39A]/20 px-4 py-2 text-sm font-semibold text-[#18D39A]">

            <FaChartLine />

            AI Powered Learning Platform

          </span>

          <h1 className="mt-6 text-5xl font-bold text-white leading-tight">

            Welcome back,

            <br />

            SkillOS Manager

          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-300">

            Generate AI-powered learning courses from SOP documents,
            assign employees, monitor progress and manage enterprise
            training from one platform.

          </p>

          <div className="mt-8 flex flex-wrap gap-4">

            <Link
              to="/upload"
              className="flex items-center gap-3 rounded-2xl bg-[#18D39A] px-7 py-4 font-semibold text-white hover:bg-[#13B987] transition"
            >

              <FaCloudUploadAlt />

              Upload SOP

            </Link>

            <Link
              to="/employees"
              className="flex items-center gap-3 rounded-2xl border border-slate-600 px-7 py-4 font-semibold text-white hover:bg-white/10 transition"
            >

              <FaUserPlus />

              Add Employee

            </Link>

          </div>

        </div>

        {/* RIGHT */}

        <div className="grid grid-cols-2 gap-5 w-full lg:w-[420px]">

          <div className="rounded-3xl bg-white/10 backdrop-blur-lg p-6 border border-white/10">

            <p className="text-slate-300">
              Courses
            </p>

            <h2 className="mt-3 text-5xl font-bold text-white">
              {totalCourses}
            </h2>

          </div>

          <div className="rounded-3xl bg-white/10 backdrop-blur-lg p-6 border border-white/10">

            <p className="text-slate-300">
              Employees
            </p>

            <h2 className="mt-3 text-5xl font-bold text-white">
              {totalEmployees}
            </h2>

          </div>

          <div className="rounded-3xl bg-white/10 backdrop-blur-lg p-6 border border-white/10">

            <p className="text-slate-300">
              AI Status
            </p>

            <h2 className="mt-3 text-2xl font-bold text-[#18D39A]">
              Online
            </h2>

          </div>

          <div className="rounded-3xl bg-white/10 backdrop-blur-lg p-6 border border-white/10">

            <p className="text-slate-300">
              Completion
            </p>

            <h2 className="mt-3 text-5xl font-bold text-white">
              92%
            </h2>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Hero;