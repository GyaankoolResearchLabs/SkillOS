import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBookOpen,
  FaCheckCircle,
  FaClock,
  FaCertificate,
  FaPlay,
  FaShieldAlt,
  FaArrowRight,
  FaUserCheck,
  FaClipboardCheck,
  FaGraduationCap,
  FaTimes,
} from "react-icons/fa";

import assignmentService from "../../services/assignmentService";
import dashboardService from "../../services/dashboardService";
import { useAuth } from "../../context/AuthContext";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // =====================================================
  // STATE
  // =====================================================

  const [assignments, setAssignments] = useState([]);
  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);
  const [syncingOnboarding, setSyncingOnboarding] = useState(false);

  // =====================================================
  // ASSESSMENT STATE
  // =====================================================

  const [selectedInduction, setSelectedInduction] = useState(null);
  const [showStudyMaterial, setShowStudyMaterial] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);

  const [assessmentAnswers, setAssessmentAnswers] = useState([]);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [submittingAssessment, setSubmittingAssessment] = useState(false);

  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [assignmentRes, dashboardRes] = await Promise.all([
        assignmentService.getAssignments(),
        dashboardService.getEmployeeDashboard(),
      ]);

      console.log(
        "EMPLOYEE DASHBOARD ASSIGNMENTS:",
        assignmentRes?.data
      );

      setAssignments(assignmentRes?.data?.assignments || []);

      setDashboard(
        dashboardRes?.data?.dashboard || null
      );
    } catch (error) {
      console.error(
        "LOAD EMPLOYEE DASHBOARD ERROR:",
        error
      );

      setAssignments([]);
      setDashboard(null);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SYNC ONBOARDING
  // =====================================================

  const syncEmployeeOnboarding = async () => {
    try {
      setSyncingOnboarding(true);

      const response =
        await dashboardService.syncEmployeeOnboarding();

      console.log(
        "ONBOARDING SYNC SUCCESS:",
        response?.data
      );

      await loadDashboard();

      window.alert(
        response?.data?.message ||
          "Onboarding synced successfully."
      );
    } catch (error) {
      console.error(
        "ONBOARDING SYNC ERROR:",
        error
      );

      window.alert(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to sync onboarding."
      );
    } finally {
      setSyncingOnboarding(false);
    }
  };

  // =====================================================
  // INDUCTION HELPERS
  // =====================================================

  const isInductionComplete = (item) => {
    return (
      item?.completed === true ||
      item?.isCompleted === true ||
      item?.passed === true ||
      item?.status === "completed" ||
      item?.status === "Completed"
    );
  };

  const getInductionTitle = (item, index) => {
    return (
      item?.title ||
      item?.name ||
      item?.label ||
      item?.item ||
      `Induction Step ${index + 1}`
    );
  };

  // =====================================================
  // ONBOARDING DATA
  // =====================================================

  const onboarding = dashboard?.onboarding || null;

  const inductionItems = onboarding?.induction || [];

  const completedInductionCount =
    inductionItems.filter(
      isInductionComplete
    ).length;

  const calculatedInductionProgress =
    inductionItems.length > 0
      ? Math.round(
          (completedInductionCount /
            inductionItems.length) *
            100
        )
      : 0;

  const onboardingProgress =
    typeof onboarding?.progress === "number"
      ? onboarding.progress
      : calculatedInductionProgress;

  const safeOnboardingProgress = Math.min(
    Math.max(Number(onboardingProgress) || 0, 0),
    100
  );

  const onboardingStatus =
    onboarding?.status || "Not Started";

  // =====================================================
  // SELECTED ASSESSMENT
  // =====================================================

  const selectedAssessment = selectedInduction
    ? {
        title:
          selectedInduction.title ||
          "Induction Assessment",

        description:
          selectedInduction.description || "",

        studyContent:
          selectedInduction.studyContent || "",

        estimatedDuration:
          selectedInduction.estimatedDuration ||
          "5 minutes",

        questions:
          selectedInduction.questions || [],

        passingScore:
          selectedInduction.passingScore || 80,
      }
    : null;

  // =====================================================
  // OPEN INDUCTION
  // =====================================================

  const openInduction = (inductionId) => {
    const item = inductionItems.find(
      (induction) =>
        String(induction?._id) ===
        String(inductionId)
    );

    if (!item) {
      return;
    }

    if (isInductionComplete(item)) {
      return;
    }

    setSelectedInduction(item);
    setAssessmentAnswers([]);
    setAssessmentResult(null);
    setShowAssessment(false);
    setShowStudyMaterial(true);
  };

  // =====================================================
  // ANSWER CHANGE
  // =====================================================

  const handleAnswerChange = (
    questionIndex,
    answer
  ) => {
    setAssessmentAnswers((previous) => {
      const updated = [...previous];

      updated[questionIndex] = answer;

      return updated;
    });
  };

  // =====================================================
  // SUBMIT ASSESSMENT
  // =====================================================

  const submitInductionAssessment = async () => {
    if (
      !selectedInduction ||
      !selectedAssessment
    ) {
      return;
    }

    const questions =
      selectedAssessment.questions || [];

    const totalQuestions = questions.length;

    if (totalQuestions === 0) {
      setAssessmentResult({
        passed: false,
        error:
          "No assessment questions are available.",
      });

      return;
    }

    if (
      assessmentAnswers.length !==
        totalQuestions ||
      assessmentAnswers.some(
        (answer) =>
          answer === undefined ||
          answer === null ||
          answer === ""
      )
    ) {
      setAssessmentResult({
        passed: false,
        error:
          "Please answer all questions before submitting.",
      });

      return;
    }

    try {
      setSubmittingAssessment(true);
      setAssessmentResult(null);

      const response =
        await dashboardService.completeInductionItem(
          selectedInduction._id,
          assessmentAnswers
        );

      setAssessmentResult(
        response?.data || {
          passed: false,
          error:
            "Assessment response was unavailable.",
        }
      );

      await loadDashboard();
    } catch (error) {
      console.error(
        "SUBMIT INDUCTION ASSESSMENT ERROR:",
        error
      );

      setAssessmentResult({
        passed: false,
        error:
          error?.response?.data?.message ||
          "Unable to submit assessment.",
      });
    } finally {
      setSubmittingAssessment(false);
    }
  };

  // =====================================================
  // CLOSE MODALS
  // =====================================================

  const closeAssessment = () => {
    setShowAssessment(false);
    setShowStudyMaterial(false);
    setSelectedInduction(null);
    setAssessmentAnswers([]);
    setAssessmentResult(null);
    setSubmittingAssessment(false);
  };

  const openAssessment = () => {
    setShowStudyMaterial(false);
    setShowAssessment(true);
    setAssessmentResult(null);
  };

  // =====================================================
  // STATUS HELPERS
  // =====================================================

  const getOnboardingStatusLabel = () => {
    const status = String(onboardingStatus)
      .trim()
      .toLowerCase();

    if (
      status === "completed" ||
      safeOnboardingProgress >= 100
    ) {
      return "Completed";
    }

    if (
      status === "in progress" ||
      status === "in-progress"
    ) {
      return "In Progress";
    }

    return "Not Started";
  };

  const onboardingStatusLabel =
    getOnboardingStatusLabel();

  const getStatusClasses = (status) => {
    if (status === "Completed") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (status === "In Progress") {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }

    return "bg-gray-100 text-gray-600 border-gray-200";
  };

  // =====================================================
  // COURSE DATA
  // =====================================================

  /*
   * IMPORTANT FIX
   *
   * Ignore assignments that have:
   * - no course
   * - no assignment ID
   * - an "Untitled Course"
   *
   * This prevents accidental/invalid assignments
   * from appearing on the Employee Dashboard.
   */

  const validAssignments = assignments.filter(
    (item) => {
      if (
        !item ||
        !item._id ||
        !item.course
      ) {
        return false;
      }

      const title = String(
        item.course?.courseTitle ||
          item.course?.title ||
          ""
      )
        .trim()
        .toLowerCase();

      if (
        title === "untitled course" ||
        title === "untitled"
      ) {
        return false;
      }

      return true;
    }
  );

  // =====================================================
  // COURSE SUMMARY
  // =====================================================

  const courseSummary = useMemo(() => {
    const total = validAssignments.length;

    const completed =
      validAssignments.filter(
        (item) =>
          item.status === "Completed" ||
          Number(item.progress) >= 100
      ).length;

    const inProgress =
      validAssignments.filter(
        (item) => {
          const progress =
            Number(item.progress) || 0;

          return (
            progress > 0 &&
            progress < 100
          );
        }
      ).length;

    return {
      total,
      completed,
      inProgress,
    };
  }, [validAssignments]);

  // =====================================================
  // CONTINUE COURSE
  // =====================================================

  /*
   * Because validAssignments already removes
   * "Untitled Course", it can NEVER appear here.
   */

  const continueCourse =
    dashboard?.continueCourse &&
    dashboard?.continueCourse?.course &&
    String(
      dashboard.continueCourse.course?.courseTitle ||
        dashboard.continueCourse.course?.title ||
        ""
    )
      .trim()
      .toLowerCase() !== "untitled course"
      ? dashboard.continueCourse
      : validAssignments.find(
          (item) => {
            const progress =
              Number(item?.progress) || 0;

            return (
              progress > 0 &&
              progress < 100
            );
          }
        ) ||
        validAssignments.find(
          (item) =>
            Number(item?.progress) === 0
        ) ||
        null;

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="text-center">

          <div className="w-11 h-11 border-4 border-[#18D39A] border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-500 font-semibold">
            Loading your dashboard...
          </p>

        </div>
      </div>
    );
  }

  // =====================================================
  // STATS
  // =====================================================

  const stats = {
    assignedCourses:
      Number(
        dashboard?.assignedCourses
      ) || courseSummary.total,

    inProgressCourses:
      Number(
        dashboard?.inProgressCourses
      ) || courseSummary.inProgress,

    completedCourses:
      Number(
        dashboard?.completedCourses
      ) || courseSummary.completed,

    certificatesEarned:
      Number(
        dashboard?.certificatesEarned
      ) || 0,

    overallProgress: Math.min(
      Math.max(
        Number(
          dashboard?.overallProgress
        ) || 0,
        0
      ),
      100
    ),
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="space-y-8 pb-12">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

        <div className="bg-gradient-to-r from-[#07152B] to-[#12304A] px-8 py-9 md:px-10">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            <div className="min-w-0">

              <p className="text-[#18D39A] text-xs font-bold uppercase tracking-[3px]">
                Employee Learning
              </p>

              <h1 className="text-3xl md:text-4xl font-black text-white mt-3">
                Welcome back,{" "}
                {user?.name || "Employee"}
              </h1>

              <p className="text-slate-300 mt-3 max-w-2xl leading-7">
                Stay on top of your assigned
                training, complete your onboarding
                and continue building your skills.
              </p>

            </div>

            <div className="flex-shrink-0">

              <div className="bg-white/10 border border-white/10 rounded-2xl px-5 py-4 min-w-[190px]">

                <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                  Overall Progress
                </p>

                <div className="flex items-end gap-2 mt-1">

                  <span className="text-3xl font-black text-white">
                    {stats.overallProgress}%
                  </span>

                </div>

                <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-[#18D39A] rounded-full transition-all"
                    style={{
                      width: `${stats.overallProgress}%`,
                    }}
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          KPI CARDS
      ================================================= */}

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-semibold text-gray-500">
                Assigned Courses
              </p>

              <p className="text-3xl font-black text-gray-900 mt-2">
                {stats.assignedCourses}
              </p>

            </div>

            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
              <FaBookOpen className="text-xl text-[#18D39A]" />
            </div>

          </div>

        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-semibold text-gray-500">
                In Progress
              </p>

              <p className="text-3xl font-black text-gray-900 mt-2">
                {stats.inProgressCourses}
              </p>

            </div>

            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <FaClock className="text-xl text-blue-500" />
            </div>

          </div>

        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-semibold text-gray-500">
                Completed
              </p>

              <p className="text-3xl font-black text-gray-900 mt-2">
                {stats.completedCourses}
              </p>

            </div>

            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <FaCheckCircle className="text-xl text-green-500" />
            </div>

          </div>

        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-semibold text-gray-500">
                Certificates
              </p>

              <p className="text-3xl font-black text-gray-900 mt-2">
                {stats.certificatesEarned}
              </p>

            </div>

            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
              <FaCertificate className="text-xl text-purple-500" />
            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          ONBOARDING
      ================================================= */}

      {onboarding && (
        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

          <div className="p-7 md:p-8 border-b border-gray-100">

            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

              <div className="flex items-start gap-4 min-w-0">

                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <FaUserCheck className="text-2xl text-[#18D39A]" />
                </div>

                <div className="min-w-0">

                  <p className="text-xs uppercase tracking-[2px] font-bold text-[#18D39A]">
                    Employee Onboarding
                  </p>

                  <h2 className="text-2xl font-black text-gray-900 mt-1">
                    Welcome to the organization
                  </h2>

                  <p className="text-gray-500 mt-2">
                    Complete your induction activities
                    and onboarding training.
                  </p>

                </div>

              </div>

              <span
                className={`px-4 py-2 rounded-full border text-sm font-bold self-start ${getStatusClasses(
                  onboardingStatusLabel
                )}`}
              >
                {onboardingStatusLabel}
              </span>

            </div>

            <div className="mt-7">

              <div className="flex items-center justify-between mb-2">

                <div>

                  <p className="text-sm font-bold text-gray-700">
                    Onboarding Progress
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {completedInductionCount} of{" "}
                    {inductionItems.length || 0}{" "}
                    induction activities completed
                  </p>

                </div>

                <span className="text-lg font-black text-gray-900">
                  {safeOnboardingProgress}%
                </span>

              </div>

              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">

                <div
                  className="h-full bg-gradient-to-r from-[#18D39A] to-[#10B981] rounded-full transition-all duration-500"
                  style={{
                    width: `${safeOnboardingProgress}%`,
                  }}
                />

              </div>

            </div>

          </div>

          <div className="p-7 md:p-8">

            <div className="flex items-center justify-between mb-5">

              <div>

                <h3 className="text-lg font-bold text-gray-900">
                  Induction Activities
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Complete each activity to finish onboarding.
                </p>

              </div>

              {inductionItems.length === 0 && (
                <button
                  type="button"
                  onClick={syncEmployeeOnboarding}
                  disabled={syncingOnboarding}
                  className="px-4 py-2.5 rounded-xl bg-[#18D39A] hover:bg-[#13B987] disabled:opacity-60 text-white text-sm font-bold transition"
                >
                  {syncingOnboarding
                    ? "Syncing..."
                    : "Sync Onboarding"}
                </button>
              )}

            </div>

            {inductionItems.length > 0 ? (

              <div className="space-y-3">

                {inductionItems.map(
                  (item, index) => {

                    const completed =
                      isInductionComplete(item);

                    const title =
                      getInductionTitle(
                        item,
                        index
                      );

                    return (
                      <div
                        key={
                          item?._id ||
                          `${title}-${index}`
                        }
                        className={`flex items-center gap-4 p-4 rounded-2xl border transition ${
                          completed
                            ? "bg-emerald-50/60 border-emerald-100"
                            : "bg-gray-50 border-gray-100 hover:border-emerald-200"
                        }`}
                      >

                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            completed
                              ? "bg-[#18D39A] text-white"
                              : "bg-white text-gray-400 border border-gray-200"
                          }`}
                        >
                          {completed ? (
                            <FaCheckCircle />
                          ) : (
                            <span className="text-sm font-bold">
                              {index + 1}
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">

                          <p
                            className={`font-bold ${
                              completed
                                ? "text-emerald-800"
                                : "text-gray-900"
                            }`}
                          >
                            {title}
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            {completed
                              ? "Completed successfully"
                              : item?.estimatedDuration ||
                                "Assessment required"}
                          </p>

                        </div>

                        {!completed && (
                          <button
                            type="button"
                            onClick={() =>
                              openInduction(
                                item?._id
                              )
                            }
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#18D39A] hover:bg-[#13B987] text-white text-sm font-bold transition flex-shrink-0"
                          >
                            Start
                            <FaArrowRight className="text-xs" />
                          </button>
                        )}

                        {completed && (
                          <span className="text-xs font-bold text-emerald-600">
                            Complete
                          </span>
                        )}

                      </div>
                    );
                  }
                )}

              </div>

            ) : (

              <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center">

                <FaGraduationCap className="text-3xl text-gray-300 mx-auto" />

                <p className="font-bold text-gray-800 mt-3">
                  Onboarding activities are not available yet.
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Sync your onboarding to load the required activities.
                </p>

                <button
                  type="button"
                  onClick={syncEmployeeOnboarding}
                  disabled={syncingOnboarding}
                  className="mt-5 px-5 py-2.5 rounded-xl bg-[#18D39A] hover:bg-[#13B987] disabled:opacity-60 text-white font-bold text-sm"
                >
                  {syncingOnboarding
                    ? "Syncing..."
                    : "Sync Onboarding"}
                </button>

              </div>

            )}

          </div>

        </section>
      )}

      {/* =================================================
          CONTINUE LEARNING
      ================================================= */}

      <section>

        <div className="flex items-center justify-between mb-5">

          <div>

            <h2 className="text-xl font-black text-gray-900">
              Continue Learning
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Pick up where you left off.
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/employee/courses")
            }
            className="text-sm font-bold text-[#13B987] hover:text-[#0f9f74] flex items-center gap-2"
          >
            View All
            <FaArrowRight className="text-xs" />
          </button>

        </div>

        {continueCourse ? (

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">

            <div className="flex flex-col lg:flex-row lg:items-center gap-6">

              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <FaBookOpen className="text-2xl text-[#18D39A]" />
              </div>

              <div className="flex-1 min-w-0">

                <div className="flex flex-wrap items-center gap-3">

                  <h3 className="text-xl font-black text-gray-900">
                    {continueCourse?.course?.courseTitle ||
                      continueCourse?.course?.title ||
                      "Assigned Learning Course"}
                  </h3>

                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                    {Number(
                      continueCourse?.progress
                    ) > 0
                      ? "In Progress"
                      : "Not Started"}
                  </span>

                </div>

                <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                  {continueCourse?.course?.description ||
                    "Continue your assigned learning program."}
                </p>

                <div className="mt-5">

                  <div className="flex justify-between text-sm mb-2">

                    <span className="font-semibold text-gray-600">
                      Progress
                    </span>

                    <span className="font-bold text-gray-900">
                      {Math.min(
                        Math.max(
                          Number(
                            continueCourse?.progress
                          ) || 0,
                          0
                        ),
                        100
                      )}
                      %
                    </span>

                  </div>

                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">

                    <div
                      className="h-full bg-[#18D39A] rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          Math.max(
                            Number(
                              continueCourse?.progress
                            ) || 0,
                            0
                          ),
                          100
                        )}%`,
                      }}
                    />

                  </div>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/employee/course/${continueCourse._id}`
                  )
                }
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#18D39A] hover:bg-[#13B987] text-white font-bold transition flex-shrink-0"
              >
                <FaPlay />

                {Number(
                  continueCourse?.progress
                ) > 0
                  ? "Continue"
                  : "Start Learning"}
              </button>

            </div>

          </div>

        ) : (

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">

            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto">
              <FaBookOpen className="text-xl text-gray-400" />
            </div>

            <h3 className="font-bold text-gray-900 mt-4">
              No courses assigned yet
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Your assigned learning courses will appear here.
            </p>

          </div>

        )}

      </section>

      {/* =================================================
          RECENT ACTIVITY
      ================================================= */}

      {Array.isArray(
        dashboard?.recentActivity
      ) &&
        dashboard.recentActivity.length > 0 && (
          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">

            <div className="mb-6">

              <h2 className="text-xl font-black text-gray-900">
                Recent Activity
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Your latest learning activity.
              </p>

            </div>

            <div className="space-y-4">

              {dashboard.recentActivity
                .slice(0, 6)
                .map(
                  (activity, index) => (
                    <div
                      key={
                        activity?._id ||
                        `${index}-${activity?.title || "activity"}`
                      }
                      className="flex items-start gap-4"
                    >

                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                        <FaCheckCircle className="text-[#18D39A]" />
                      </div>

                      <div className="flex-1 min-w-0">

                        <p className="font-bold text-gray-900">
                          {activity?.title ||
                            activity?.action ||
                            "Learning activity"}
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          {activity?.description ||
                            activity?.message ||
                            ""}
                        </p>

                      </div>

                    </div>
                  )
                )}

            </div>

          </section>
        )}

      {/* =================================================
          STUDY MATERIAL MODAL
      ================================================= */}

      {showStudyMaterial &&
        selectedInduction && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">

            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">

              <div className="px-7 py-6 border-b border-gray-100 flex items-center justify-between gap-4">

                <div className="min-w-0">

                  <p className="text-xs uppercase tracking-wider font-bold text-[#18D39A]">
                    Induction Study Material
                  </p>

                  <h2 className="text-2xl font-black text-gray-900 mt-1 truncate">
                    {selectedInduction.title}
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={closeAssessment}
                  className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 flex-shrink-0"
                >
                  <FaTimes />
                </button>

              </div>

              <div className="p-7 overflow-y-auto">

                <div className="flex flex-wrap gap-3 mb-6">

                  <span className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">
                    {selectedAssessment?.estimatedDuration ||
                      "5 minutes"}
                  </span>

                  <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                    Passing Score:{" "}
                    {selectedAssessment?.passingScore ||
                      80}
                    %
                  </span>

                </div>

                {selectedAssessment?.description && (
                  <p className="text-gray-600 leading-7 mb-6">
                    {selectedAssessment.description}
                  </p>
                )}

                <div className="bg-slate-50 rounded-2xl border border-gray-100 p-6">

                  <h3 className="font-bold text-gray-900 mb-4">
                    Study Material
                  </h3>

                  <div className="text-gray-700 leading-8 whitespace-pre-wrap">
                    {selectedAssessment?.studyContent ||
                      "No study material is available for this induction activity."}
                  </div>

                </div>

              </div>

              <div className="px-7 py-5 border-t border-gray-100 flex justify-end gap-3">

                <button
                  type="button"
                  onClick={closeAssessment}
                  className="px-5 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={openAssessment}
                  className="px-5 py-3 rounded-xl bg-[#18D39A] hover:bg-[#13B987] text-white font-bold flex items-center gap-2"
                >
                  <FaClipboardCheck />
                  Take Assessment
                </button>

              </div>

            </div>

          </div>
        )}

      {/* =================================================
          ASSESSMENT MODAL
      ================================================= */}

      {showAssessment &&
        selectedInduction &&
        selectedAssessment && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">

            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">

              <div className="px-7 py-6 border-b border-gray-100 flex items-center justify-between gap-4">

                <div>

                  <p className="text-xs uppercase tracking-wider font-bold text-[#18D39A]">
                    Induction Assessment
                  </p>

                  <h2 className="text-2xl font-black text-gray-900 mt-1">
                    {selectedAssessment.title}
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={closeAssessment}
                  className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
                >
                  <FaTimes />
                </button>

              </div>

              <div className="p-7 overflow-y-auto">

                {selectedAssessment.questions?.length >
                0 ? (

                  <div className="space-y-6">

                    {selectedAssessment.questions.map(
                      (
                        question,
                        questionIndex
                      ) => {

                        const questionText =
                          typeof question ===
                          "string"
                            ? question
                            : question?.question ||
                              question?.text ||
                              `Question ${
                                questionIndex + 1
                              }`;

                        const options =
                          Array.isArray(
                            question?.options
                          )
                            ? question.options
                            : [];

                        return (
                          <div
                            key={
                              question?._id ||
                              questionIndex
                            }
                            className="border border-gray-100 rounded-2xl p-6"
                          >

                            <p className="font-bold text-gray-900 leading-7">
                              {questionIndex + 1}.{" "}
                              {questionText}
                            </p>

                            {options.length > 0 ? (

                              <div className="mt-5 space-y-3">

                                {options.map(
                                  (
                                    option,
                                    optionIndex
                                  ) => {

                                    const value =
                                      typeof option ===
                                      "string"
                                        ? option
                                        : option?.text ||
                                          option?.value ||
                                          option?.label ||
                                          "";

                                    const selected =
                                      assessmentAnswers[
                                        questionIndex
                                      ] === value;

                                    return (
                                      <label
                                        key={
                                          optionIndex
                                        }
                                        className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${
                                          selected
                                            ? "border-[#18D39A] bg-emerald-50"
                                            : "border-gray-200 hover:border-emerald-200"
                                        }`}
                                      >

                                        <input
                                          type="radio"
                                          name={`question-${questionIndex}`}
                                          value={value}
                                          checked={
                                            selected
                                          }
                                          onChange={() =>
                                            handleAnswerChange(
                                              questionIndex,
                                              value
                                            )
                                          }
                                          className="accent-[#18D39A]"
                                        />

                                        <span className="text-sm text-gray-700">
                                          {value}
                                        </span>

                                      </label>
                                    );
                                  }
                                )}

                              </div>

                            ) : (

                              <textarea
                                value={
                                  assessmentAnswers[
                                    questionIndex
                                  ] || ""
                                }
                                onChange={(event) =>
                                  handleAnswerChange(
                                    questionIndex,
                                    event.target.value
                                  )
                                }
                                rows={4}
                                placeholder="Enter your answer..."
                                className="mt-4 w-full border border-gray-200 rounded-xl p-4 outline-none focus:border-[#18D39A] focus:ring-2 focus:ring-[#18D39A]/10"
                              />

                            )}

                          </div>
                        );
                      }
                    )}

                  </div>

                ) : (

                  <div className="text-center py-12">

                    <FaClipboardCheck className="text-4xl text-gray-300 mx-auto" />

                    <h3 className="text-xl font-bold text-gray-900 mt-4">
                      Assessment unavailable
                    </h3>

                    <p className="text-gray-500 mt-2">
                      No assessment questions are available.
                    </p>

                  </div>

                )}

                {assessmentResult && (
                  <div
                    className={`mt-6 rounded-2xl p-5 border ${
                      assessmentResult?.passed
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >

                    <div className="flex items-start gap-3">

                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          assessmentResult?.passed
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {assessmentResult?.passed ? (
                          <FaCheckCircle />
                        ) : (
                          <FaShieldAlt />
                        )}
                      </div>

                      <div>

                        <p
                          className={`font-bold ${
                            assessmentResult?.passed
                              ? "text-emerald-800"
                              : "text-red-800"
                          }`}
                        >
                          {assessmentResult?.passed
                            ? "Assessment Passed"
                            : "Assessment Not Passed"}
                        </p>

                        <p className="text-sm text-gray-600 mt-1">
                          {assessmentResult?.message ||
                            assessmentResult?.error ||
                            (assessmentResult?.score !==
                            undefined
                              ? `Score: ${assessmentResult.score}%`
                              : "Assessment submitted.")}
                        </p>

                      </div>

                    </div>

                  </div>
                )}

              </div>

              <div className="px-7 py-5 border-t border-gray-100 flex flex-col sm:flex-row sm:justify-between gap-3">

                <button
                  type="button"
                  onClick={() => {
                    setShowAssessment(false);
                    setShowStudyMaterial(true);
                  }}
                  className="px-5 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50"
                >
                  Back to Study Material
                </button>

                <button
                  type="button"
                  disabled={
                    submittingAssessment ||
                    !selectedAssessment?.questions
                      ?.length ||
                    assessmentAnswers.length !==
                      selectedAssessment.questions.length
                  }
                  onClick={
                    submitInductionAssessment
                  }
                  className="px-6 py-3 rounded-xl bg-[#18D39A] hover:bg-[#13B987] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold flex items-center justify-center gap-2"
                >
                  <FaClipboardCheck />

                  {submittingAssessment
                    ? "Submitting..."
                    : "Submit Assessment"}
                </button>

              </div>

            </div>

          </div>
        )}

    </div>
  );
}

export default Dashboard;