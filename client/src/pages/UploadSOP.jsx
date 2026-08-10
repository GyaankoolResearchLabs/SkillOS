import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  FaCloudUploadAlt,
  FaFilePdf,
  FaMagic,
  FaSpinner,
  FaCheckCircle,
  FaRobot,
  FaBrain,
} from "react-icons/fa";

import api from "../services/api";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import SectionHeader from "../components/ui/SectionHeader";

function UploadSOP() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // =====================================================
  // TOKEN
  // =====================================================

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("accessToken")
    );
  };

  // =====================================================
  // FILE VALIDATION
  // =====================================================

  const validateFile = (selectedFile) => {
    if (!selectedFile) {
      return false;
    }

    const isPDF =
      selectedFile.type === "application/pdf" ||
      selectedFile.name
        .toLowerCase()
        .endsWith(".pdf");

    if (!isPDF) {
      toast.error(
        "Only PDF files are supported."
      );

      return false;
    }

    return true;
  };

  // =====================================================
  // DRAG HANDLERS
  // =====================================================

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (
      e.type === "dragenter" ||
      e.type === "dragover"
    ) {
      setDragActive(true);
    }

    if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // =====================================================
  // DROP
  // =====================================================

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setDragActive(false);

    if (
      !e.dataTransfer ||
      !e.dataTransfer.files ||
      !e.dataTransfer.files.length
    ) {
      return;
    }

    const uploaded =
      e.dataTransfer.files[0];

    if (validateFile(uploaded)) {
      setFile(uploaded);
    }
  };

  // =====================================================
  // FILE INPUT
  // =====================================================

  const handleFileChange = (e) => {
    if (
      !e.target.files ||
      !e.target.files.length
    ) {
      return;
    }

    const uploaded =
      e.target.files[0];

    if (validateFile(uploaded)) {
      setFile(uploaded);
    }
  };

  // =====================================================
  // UPLOAD SOP
  // =====================================================

  const handleUpload = async () => {
    if (!file) {
      toast.error(
        "Please choose a PDF first."
      );

      return;
    }

    // ---------------------------------------------------
    // GET AUTH TOKEN
    // ---------------------------------------------------

    const token = getToken();

    console.log(
      "UPLOAD SOP TOKEN:",
      token
        ? "Token found"
        : "NO TOKEN FOUND"
    );

    if (!token) {
      toast.error(
        "Authentication token missing. Please login again."
      );

      return;
    }

    // ---------------------------------------------------
    // FORM DATA
    // ---------------------------------------------------

    const formData =
      new FormData();

    formData.append(
      "pdf",
      file
    );

    try {
      setLoading(true);

      console.log(
        "======================================"
      );

      console.log(
        "UPLOADING SOP"
      );

      console.log(
        "File:",
        file.name
      );

      console.log(
        "Size:",
        file.size
      );

      console.log(
        "Token:",
        "Attached"
      );

      console.log(
        "======================================"
      );

      // -------------------------------------------------
      // AUTHENTICATED REQUEST
      // -------------------------------------------------

      const response =
        await api.post(
          "/sops",
          formData,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      console.log(
        "SOP UPLOAD RESPONSE:",
        response.data
      );

      // -------------------------------------------------
      // SUCCESS
      // -------------------------------------------------

      toast.success(
        "Course generated successfully."
      );

      // Give the backend a moment to finish
      // before moving back to courses.

      setTimeout(() => {
        navigate("/courses");
      }, 500);
    } catch (err) {
      console.error(
        "UPLOAD SOP ERROR:",
        err
      );

      console.error(
        "UPLOAD SOP RESPONSE:",
        err.response?.data
      );

      // -------------------------------------------------
      // AUTH ERROR
      // -------------------------------------------------

      if (
        err.response?.status === 401
      ) {
        toast.error(
          err.response?.data?.message ||
            "Authentication failed. Please login again."
        );

        return;
      }

      // -------------------------------------------------
      // DUPLICATE SOP
      // -------------------------------------------------

      if (
        err.response?.status === 409
      ) {
        toast.error(
          err.response?.data?.message ||
            "A course already exists for this SOP."
        );

        return;
      }

      // -------------------------------------------------
      // GENERAL ERROR
      // -------------------------------------------------

      toast.error(
        err.response?.data?.message ||
          "Unable to generate course."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="space-y-10">

      <SectionHeader
        title="Upload SOP"
        subtitle="Generate AI-powered learning courses from your Standard Operating Procedure documents."
      />

      <div className="grid lg:grid-cols-3 gap-8">

        {/* =================================================
            LEFT PANEL
        ================================================= */}

        <div className="lg:col-span-2">

          <Card className="p-10">

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`
                border-2
                border-dashed
                rounded-[28px]
                transition-all
                duration-300
                text-center
                py-20
                px-10

                ${
                  dragActive
                    ? "border-[#18D39A] bg-[#E8FFF6]"
                    : "border-[#D1D5DB] hover:border-[#18D39A] bg-[#F8FAFC]"
                }
              `}
            >

              {/* UPLOAD ICON */}

              <div className="w-24 h-24 rounded-full bg-[#E8FFF6] mx-auto flex items-center justify-center">

                <FaCloudUploadAlt
                  className="text-[#18D39A]"
                  size={42}
                />

              </div>

              {/* TITLE */}

              <h2 className="text-3xl font-bold text-[#202B38] mt-8">

                Drag & Drop SOP PDF

              </h2>

              {/* DESCRIPTION */}

              <p className="text-[#64748B] mt-4 max-w-md mx-auto">

                Upload your SOP document to automatically
                generate AI-powered learning modules,
                quizzes and employee training material.

              </p>

              {/* FILE INPUT */}

              <input
                id="upload"
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={handleFileChange}
                disabled={loading}
              />

              <label
                htmlFor="upload"
                className="inline-block mt-10"
              >

                <Button
                  size="lg"
                  disabled={loading}
                  type="button"
                >

                  Browse PDF

                </Button>

              </label>

              {/* =================================================
                  SELECTED FILE
              ================================================= */}

              {file && (
                <div className="mt-10 rounded-3xl border border-[#E5E7EB] bg-white p-6">

                  <div className="flex items-center justify-between gap-4">

                    <div className="flex items-center gap-5 min-w-0">

                      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">

                        <FaFilePdf
                          className="text-red-500"
                          size={28}
                        />

                      </div>

                      <div className="text-left min-w-0">

                        <h3 className="font-bold text-lg text-[#202B38] truncate">

                          {file.name}

                        </h3>

                        <p className="text-[#64748B] mt-1">

                          {(
                            file.size /
                            (1024 * 1024)
                          ).toFixed(2)}

                          {" "}
                          MB

                        </p>

                      </div>

                    </div>

                    <div className="flex items-center gap-2 rounded-full bg-[#E8FFF6] px-4 py-2 text-[#18D39A] font-semibold shrink-0">

                      <FaCheckCircle />

                      Ready

                    </div>

                  </div>

                </div>
              )}

              {/* =================================================
                  GENERATE BUTTON
              ================================================= */}

              <div className="mt-10">

                <Button
                  size="lg"
                  className="w-full"
                  disabled={
                    !file ||
                    loading
                  }
                  onClick={handleUpload}
                  type="button"
                >

                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />

                      Generating AI Course...
                    </>
                  ) : (
                    <>
                      <FaMagic />

                      Generate AI Learning Course
                    </>
                  )}

                </Button>

              </div>

            </div>

          </Card>

        </div>

        {/* =================================================
            RIGHT PANEL
        ================================================= */}

        <div>

          <Card className="p-8 sticky top-8">

            {/* HEADER */}

            <div className="flex items-center gap-3 mb-8">

              <div className="w-14 h-14 rounded-2xl bg-[#E8FFF6] flex items-center justify-center">

                <FaRobot
                  className="text-[#18D39A]"
                  size={26}
                />

              </div>

              <div>

                <h2 className="text-xl font-bold text-[#202B38]">

                  AI Pipeline

                </h2>

                <p className="text-sm text-[#64748B]">

                  How SkillOS works

                </p>

              </div>

            </div>

            {/* PIPELINE */}

            <div className="space-y-7">

              {/* STEP 1 */}

              <div className="flex gap-4">

                <div className="w-12 h-12 rounded-full bg-[#18D39A] text-white font-bold flex items-center justify-center shrink-0">

                  1

                </div>

                <div>

                  <h4 className="font-semibold text-[#202B38]">

                    Upload SOP

                  </h4>

                  <p className="text-sm text-[#64748B] mt-1">

                    Securely upload your SOP PDF document.

                  </p>

                </div>

              </div>

              {/* STEP 2 */}

              <div className="flex gap-4">

                <div className="w-12 h-12 rounded-full bg-[#18D39A] text-white font-bold flex items-center justify-center shrink-0">

                  2

                </div>

                <div>

                  <h4 className="font-semibold text-[#202B38]">

                    AI Analysis

                  </h4>

                  <p className="text-sm text-[#64748B] mt-1">

                    AI extracts procedures,
                    objectives and workflows.

                  </p>

                </div>

              </div>

              {/* STEP 3 */}

              <div className="flex gap-4">

                <div className="w-12 h-12 rounded-full bg-[#18D39A] text-white font-bold flex items-center justify-center shrink-0">

                  3

                </div>

                <div>

                  <h4 className="font-semibold text-[#202B38]">

                    Generate Modules

                  </h4>

                  <p className="text-sm text-[#64748B] mt-1">

                    Interactive lessons, quizzes
                    and assessments are created.

                  </p>

                </div>

              </div>

              {/* STEP 4 */}

              <div className="flex gap-4">

                <div className="w-12 h-12 rounded-full bg-[#18D39A] text-white font-bold flex items-center justify-center shrink-0">

                  4

                </div>

                <div>

                  <h4 className="font-semibold text-[#202B38]">

                    Employee Training

                  </h4>

                  <p className="text-sm text-[#64748B] mt-1">

                    Assign generated courses
                    to employees instantly.

                  </p>

                </div>

              </div>

            </div>

            {/* AI FEATURES */}

            <div className="mt-10 rounded-2xl bg-[#F8FAFC] p-6">

              <div className="flex items-center gap-3">

                <FaBrain
                  className="text-[#18D39A]"
                  size={22}
                />

                <h4 className="font-bold text-[#202B38]">

                  AI Features

                </h4>

              </div>

              <ul className="mt-5 space-y-3 text-sm text-[#64748B]">

                <li>
                  • Automatic module generation
                </li>

                <li>
                  • AI learning objectives
                </li>

                <li>
                  • Assessment generation
                </li>

                <li>
                  • Employee assignment ready
                </li>

                <li>
                  • Smart course structure
                </li>

              </ul>

            </div>

          </Card>

        </div>

      </div>

    </div>
  );
}

export default UploadSOP;