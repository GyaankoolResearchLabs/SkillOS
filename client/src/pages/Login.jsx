import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaCheckCircle, FaLock, FaEnvelope, FaMagic } from "react-icons/fa";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import getskilledLogo from "../assets/getskilled-logo.png";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "manager@skillos.com",
    password: "admin123",
  });

  const handleLogin = async (e) => {
  e.preventDefault();

  if (!form.email || !form.password) {
    toast.error("Please enter email and password");
    return;
  }

  try {
    setLoading(true);

    const res = await api.post("/auth/login", form);

    login(res.data.user, res.data.token);

    toast.success("Welcome back to SkillOS!");

    const role = res.data.user.role?.toLowerCase();

    switch (role) {
      case "manager":
        navigate("/manager/dashboard");
        break;

      case "employee":
        navigate("/employee/dashboard");
        break;

      case "teacher":
        navigate("/teacher/dashboard");
        break;

      case "student":
        navigate("/student/dashboard");
        break;

      default:
        toast.error("Invalid user role");
        navigate("/login");
    }

  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Login Failed");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-4 md:p-6 select-none">
      {/* Outer Card (24px Radius) */}
      <div className="w-full max-w-4xl bg-white rounded-[24px] border border-[#E5E7EB] shadow-xl overflow-hidden grid lg:grid-cols-12 min-h-[520px]">
        {/* Left Side Brand Banner (5 cols) */}
        <div className="lg:col-span-5 bg-[#111827] p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            {/* Logo Container */}
            <div className="bg-white rounded-xl p-2.5 shadow-sm inline-block border border-gray-200">
              <img
                src={getskilledLogo}
                alt="Getskilled"
                className="h-8 w-auto object-contain"
              />
            </div>

            <div className="mt-6">
              <span className="inline-flex items-center gap-1 bg-[#18D39A]/20 text-[#18D39A] px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-[#18D39A]/30">
                <FaMagic className="text-[9px]" /> Next-Gen LMS
              </span>
              <h1 className="text-3xl font-extrabold mt-2 tracking-tight text-white leading-none">
                SkillOS
              </h1>
              <p className="text-[#D1D5DB] mt-2 text-xs leading-relaxed font-medium">
                AI Powered SOP Learning Management System
              </p>
            </div>

            {/* Core Capabilities */}
            <div className="mt-8 space-y-3">
              <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-[#9CA3AF]">
                Platform Features
              </h4>
              <ul className="space-y-2 text-xs font-medium text-[#D1D5DB]">
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-[#18D39A] shrink-0" />
                  <span>Instant AI SOP Course Generation</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-[#18D39A] shrink-0" />
                  <span>Employee Learning Management</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-[#18D39A] shrink-0" />
                  <span>Smart Course Assignment Tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-[#18D39A] shrink-0" />
                  <span>PDF Curriculum Exporting</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-800 text-[11px] text-[#9CA3AF] relative z-10 leading-tight">
            Powered by <span className="text-[#18D39A] font-bold">Getskilled</span>
            <br />
            Gyaankool Research Labs Pvt. Ltd.
          </div>
        </div>

        {/* Right Side Form (7 cols) */}
        <div className="lg:col-span-7 p-8 md:p-10 flex flex-col justify-center bg-white">
          <div className="max-w-sm w-full mx-auto">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#18D39A]">
              Manager Access
            </span>
            <h2 className="text-2xl font-extrabold text-[#202B38] mt-1 tracking-tight leading-none">
              Welcome Back
            </h2>
            <p className="text-[#6B7280] text-xs mt-1.5 leading-snug">
              Sign in to manage your AI SOP courses and employees.
            </p>

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              {/* Email */}
              <div className="flex flex-col">
                <label htmlFor="login-email-input">Email Address</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-xs pointer-events-none" />
                  <input
                    id="login-email-input"
                    type="email"
                    placeholder="manager@skillos.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col">
                <label htmlFor="login-password-input">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-xs pointer-events-none" />
                  <input
                    id="login-password-input"
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#18D39A] hover:bg-[#13B987] text-white font-extrabold text-sm rounded-xl transition-all shadow-xs cursor-pointer mt-2 flex items-center justify-center gap-2"
              >
                {loading ? "Authenticating..." : "Sign In to SkillOS"}
              </button>
            </form>

            {/* Demo Credentials Box */}
           {/* Demo Accounts */}

<div className="mt-6 bg-[#F8FAFC] rounded-xl border border-[#E5E7EB] p-4">

  <h4 className="text-xs font-bold uppercase tracking-wider text-[#202B38] mb-4">
    Demo Accounts
  </h4>

  <div className="space-y-3 text-xs">

    <div className="flex justify-between">
      <span className="font-semibold text-[#111827]">Manager</span>
      <span className="font-mono">manager@skillos.com / admin123</span>
    </div>

    <div className="flex justify-between">
      <span className="font-semibold text-[#111827]">Employee</span>
      <span className="font-mono">employee@skillos.com / employee123</span>
    </div>

    <div className="flex justify-between">
      <span className="font-semibold text-[#111827]">Teacher</span>
      <span className="font-mono">teacher@skillos.com / teacher123</span>
    </div>

    <div className="flex justify-between">
      <span className="font-semibold text-[#111827]">Student</span>
      <span className="font-mono">student@skillos.com / student123</span>
    </div>

  </div>

</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;