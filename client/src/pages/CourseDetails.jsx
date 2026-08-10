import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  FaArrowLeft,
  FaBookOpen,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaDownload,
  FaLayerGroup,
  FaMagic,
  FaBrain,
  FaChartLine,
  FaGraduationCap,
} from "react-icons/fa";

import api from "../services/api";
import exportCourse from "../utils/exportCourse";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import SectionHeader from "../components/ui/SectionHeader";

function CourseDetails() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // FETCH COURSE
  // =====================================================

  useEffect(() => {
    if (id) {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);

      // =================================================
      // GET AUTH TOKEN
      // =================================================

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken");

      if (!token) {
        console.error(
          "COURSE DETAILS: Authentication token missing"
        );

        toast.error(
          "Authentication token missing. Please login again."
        );

        return;
      }

      console.log(
        "COURSE DETAILS: Loading course:",
        id
      );

      // =================================================
      // GET COURSE
      // =================================================
      //
      // IMPORTANT:
      // Courses are now protected by organization
      // isolation.
      //
      // Correct endpoint:
      //
      // /api/courses/:id
      //
      // =================================================

      const res = await api.get(
        `/courses/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "COURSE DETAILS RESPONSE:",
        res.data
      );

      if (
        res.data?.success &&
        res.data?.course
      ) {
        setCourse(res.data.course);
      } else {
        setCourse(null);

        toast.error(
          "Unable to load course."
        );
      }
    } catch (err) {
      console.error(
        "LOAD COURSE ERROR:",
        err
      );

      console.error(
        "STATUS:",
        err.response?.status
      );

      console.error(
        "SERVER RESPONSE:",
        err.response?.data
      );

      if (
        err.response?.status === 401
      ) {
        toast.error(
          "Your session has expired. Please login again."
        );
      } else if (
        err.response?.status === 403
      ) {
        toast.error(
          "You are not authorized to access this course."
        );
      } else if (
        err.response?.status === 404
      ) {
        toast.error(
          "Course not found."
        );
      } else {
        toast.error(
          "Unable to load course."
        );
      }

      setCourse(null);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-[#18D39A] border-t-transparent animate-spin mx-auto" />

          <h2 className="mt-6 text-2xl font-bold">
            Building AI Course...
          </h2>

          <p className="text-[#64748B] mt-2">
            Please wait while SkillOS prepares your
            training.
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // COURSE NOT FOUND
  // =====================================================

  if (!course) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold">
          Course not found
        </h2>

        <Link to="/">
          <Button className="mt-8">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  // =====================================================
  // COURSE PAGE
  // =====================================================

  return (
    <div className="space-y-10 min-w-0">
      {/* =================================================
          BACK
      ================================================= */}

      <Link
        to="/"
        className="inline-flex items-center gap-2 text-[#64748B] hover:text-[#18D39A] font-medium transition"
      >
        <FaArrowLeft />

        Dashboard
      </Link>

      {/* =================================================
          COURSE HERO
      ================================================= */}

      <div className="rounded-[36px] bg-gradient-to-r from-[#111827] via-[#1F2937] to-[#202B38] overflow-hidden relative">
        <div className="absolute right-[-120px] top-[-120px] w-[450px] h-[450px] rounded-full bg-[#18D39A]/10 blur-3xl" />

        <div className="relative p-10 lg:p-14">
          <div className="flex justify-between items-start gap-10 flex-wrap">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#18D39A]/15 text-[#18D39A] font-semibold">
                <FaMagic />

                AI Generated Curriculum
              </div>

              <h1 className="mt-6 text-4xl lg:text-6xl font-black leading-tight text-white">
                {course.courseTitle}
              </h1>

              <p className="mt-6 text-lg leading-8 text-gray-300 max-w-3xl">
                {course.description}
              </p>
            </div>

            <Button
              variant="secondary"
              icon={<FaDownload />}
              onClick={() => {
                exportCourse(course);

                toast.success(
                  "Downloading PDF..."
                );
              }}
            >
              Download Course
            </Button>
          </div>

          {/* =================================================
              COURSE STATS
          ================================================= */}

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mt-14">
            <Card className="bg-white/5 border-white/10 p-6">
              <div className="flex gap-4 items-center">
                <div className="w-14 h-14 rounded-2xl bg-[#18D39A]/20 flex items-center justify-center text-[#18D39A]">
                  <FaClock size={22} />
                </div>

                <div>
                  <p className="text-sm text-gray-400">
                    Duration
                  </p>

                  <h3 className="text-white text-xl font-bold">
                    {course.estimatedDuration ||
                      "Not specified"}
                  </h3>
                </div>
              </div>
            </Card>

            <Card className="bg-white/5 border-white/10 p-6">
              <div className="flex gap-4 items-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <FaLayerGroup size={22} />
                </div>

                <div>
                  <p className="text-sm text-gray-400">
                    Modules
                  </p>

                  <h3 className="text-white text-xl font-bold">
                    {course.modules?.length || 0}
                  </h3>
                </div>
              </div>
            </Card>

            <Card className="bg-white/5 border-white/10 p-6">
              <div className="flex gap-4 items-center">
                <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center text-green-400">
                  <FaCheckCircle size={22} />
                </div>

                <div>
                  <p className="text-sm text-gray-400">
                    Status
                  </p>

                  <h3 className="text-green-400 text-xl font-bold">
                    {course.status ||
                      "Generated"}
                  </h3>
                </div>
              </div>
            </Card>

            <Card className="bg-white/5 border-white/10 p-6">
              <div className="flex gap-4 items-center">
                <div className="w-14 h-14 rounded-2xl bg-yellow-500/20 flex items-center justify-center text-yellow-400">
                  <FaCalendarAlt size={22} />
                </div>

                <div>
                  <p className="text-sm text-gray-400">
                    Created
                  </p>

                  <h3 className="text-white text-xl font-bold">
                    {course.createdAt
                      ? new Date(
                          course.createdAt
                        ).toLocaleDateString()
                      : "N/A"}
                  </h3>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="grid xl:grid-cols-3 gap-8 min-w-0">
        {/* =================================================
            MODULES
        ================================================= */}

        <div className="xl:col-span-2 min-w-0">
          <SectionHeader
            title="Course Modules"
            subtitle="AI generated learning path extracted from the uploaded SOP."
          />

          <div className="space-y-8 mt-8">
            {course.modules?.map(
              (module, index) => (
                <Card
                  key={
                    module._id ||
                    index
                  }
                  className="p-8 hover:border-[#18D39A]/40 transition-all duration-300 hover:shadow-xl"
                >
                  <div className="flex justify-between items-start flex-wrap gap-6">
                    <div className="flex gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-[#E8FFF6] flex items-center justify-center text-[#18D39A] text-xl font-black">
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </div>

                      <div>
                        <p className="uppercase tracking-wider text-xs text-[#18D39A] font-bold">
                          Module{" "}
                          {index + 1}
                        </p>

                        <h2 className="text-2xl font-bold text-[#202B38] mt-1">
                          {module.title}
                        </h2>
                      </div>
                    </div>

                    {module.duration && (
                      <div className="rounded-full bg-[#E8FFF6] px-5 py-2 text-[#18D39A] font-semibold">
                        <FaClock className="inline mr-2" />

                        {module.duration}
                      </div>
                    )}
                  </div>

                  {/* =================================================
                      LEARNING OBJECTIVES
                  ================================================= */}

                  <div className="mt-8">
                    <h3 className="font-bold text-lg mb-5 flex items-center gap-3">
                      <FaGraduationCap className="text-[#18D39A]" />

                      Learning Objectives
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      {module.learningObjectives?.map(
                        (
                          objective,
                          i
                        ) => (
                          <div
                            key={i}
                            className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-5 hover:bg-[#E8FFF6]/40 transition"
                          >
                            <div className="flex gap-3">
                              <FaCheckCircle className="text-[#18D39A] mt-1" />

                              <p className="leading-7 text-[#202B38]">
                                {objective}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </Card>
              )
            )}
          </div>
        </div>

        {/* =================================================
            RIGHT SIDEBAR
        ================================================= */}

        <div className="space-y-6">
          {/* =================================================
              AI INSIGHTS
          ================================================= */}

          <Card className="p-8 sticky top-8">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-[#E8FFF6] flex items-center justify-center">
                <FaBrain
                  className="text-[#18D39A]"
                  size={24}
                />
              </div>

              <div>
                <h3 className="text-xl font-bold">
                  AI Insights
                </h3>

                <p className="text-sm text-[#64748B]">
                  Generated by SkillOS AI
                </p>
              </div>
            </div>

            <div className="space-y-5 mt-8">
              <div>
                <p className="text-sm text-[#64748B]">
                  Estimated Learning Time
                </p>

                <h4 className="font-bold text-xl mt-1">
                  {course.estimatedDuration ||
                    "Not specified"}
                </h4>
              </div>

              <div>
                <p className="text-sm text-[#64748B]">
                  Total Modules
                </p>

                <h4 className="font-bold text-xl mt-1">
                  {course.modules?.length ||
                    0}
                </h4>
              </div>

              <div>
                <p className="text-sm text-[#64748B]">
                  Generated
                </p>

                <h4 className="font-bold text-green-600 mt-1">
                  Successfully
                </h4>
              </div>
            </div>
          </Card>

          {/* =================================================
              ASSESSMENT
          ================================================= */}

          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <FaChartLine
                className="text-[#18D39A]"
                size={22}
              />

              <h3 className="text-xl font-bold">
                Assessment
              </h3>
            </div>

            <div className="space-y-5">
              <div className="flex justify-between">
                <span className="text-[#64748B]">
                  Questions
                </span>

                <strong>
                  {course.finalAssessment
                    ?.length ||
                    course.totalQuizQuestions ||
                    0}
                </strong>
              </div>

              <div className="flex justify-between">
                <span className="text-[#64748B]">
                  Passing Score
                </span>

                <strong>
                  70%
                </strong>
              </div>

              <div className="flex justify-between">
                <span className="text-[#64748B]">
                  Attempts
                </span>

                <strong>
                  Unlimited
                </strong>
              </div>
            </div>

            <Button
              className="w-full mt-8"
              icon={<FaBookOpen />}
            >
              Start Assessment
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;