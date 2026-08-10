import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaBookOpen,
  FaBullseye,
  FaCheckCircle,
  FaClock,
  FaGraduationCap,
  FaLightbulb,
  FaListUl,
  FaPlayCircle,
} from "react-icons/fa";

import assignmentService from "../../services/assignmentService";

// ======================================================
// HELPERS
// ======================================================

const toArray = (value) => {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }

      if (item && typeof item === "object") {
        return (
          item.text ||
          item.content ||
          item.description ||
          item.title ||
          ""
        ).trim();
      }

      return "";
    })
    .filter(Boolean);
};

const toText = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "object") {
    return (
      value.content ||
      value.text ||
      value.description ||
      value.body ||
      ""
    ).trim();
  }

  return String(value);
};

// ======================================================
// READING MATERIAL
// ======================================================

function ReadingMaterial({ content }) {
  if (!content) {
    return (
      <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-6">
        <p className="text-[#64748B] leading-7">
          No reading material is available for this lesson.
        </p>
      </div>
    );
  }

  if (typeof content === "string") {
    const paragraphs = content
      .split(/\n+/)
      .map((item) => item.trim())
      .filter(Boolean);

    return (
      <div className="space-y-5">
        {paragraphs.map((paragraph, index) => {
          const isHeading =
            paragraph.startsWith("# ") ||
            paragraph.startsWith("## ") ||
            paragraph.startsWith("### ");

          const cleanParagraph = paragraph.replace(
            /^#{1,3}\s*/,
            ""
          );

          if (isHeading) {
            return (
              <h3
                key={index}
                className="text-xl font-bold text-[#0F172A] pt-2"
              >
                {cleanParagraph}
              </h3>
            );
          }

          return (
            <p
              key={index}
              className="text-[16px] leading-8 text-[#334155]"
            >
              {paragraph}
            </p>
          );
        })}
      </div>
    );
  }

  if (Array.isArray(content)) {
    return (
      <div className="space-y-5">
        {content.map((item, index) => {
          const text = toText(item);

          if (!text) return null;

          return (
            <p
              key={index}
              className="text-[16px] leading-8 text-[#334155]"
            >
              {text}
            </p>
          );
        })}
      </div>
    );
  }

  if (typeof content === "object") {
    const text =
      content.content ||
      content.text ||
      content.body ||
      content.description ||
      "";

    return (
      <p className="text-[16px] leading-8 text-[#334155] whitespace-pre-line">
        {text}
      </p>
    );
  }

  return null;
}

// ======================================================
// SECTION
// ======================================================

function Section({ icon, title, children }) {
  return (
    <section className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#E8FFF6] text-[#18D39A] flex items-center justify-center">
          {icon}
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-[#0F172A]">
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
}

// ======================================================
// LESSON
// ======================================================

function Lesson() {
  const navigate = useNavigate();

  const { assignmentId, moduleId } = useParams();

  const [assignment, setAssignment] = useState(null);
  const [module, setModule] = useState(null);

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [completing, setCompleting] = useState(false);

  const [error, setError] = useState("");

  // ====================================================
  // LOAD ASSIGNMENT + GENERATE LESSON IF NECESSARY
  // ====================================================

  useEffect(() => {
    const loadLesson = async () => {
      try {
        setLoading(true);
        setError("");

        console.log(
          "===================================="
        );

        console.log("LOADING LESSON");

        console.log("Assignment ID:", assignmentId);
        console.log("Module ID:", moduleId);

        console.log(
          "===================================="
        );

        // ------------------------------------------------
        // GET ASSIGNMENT
        // ------------------------------------------------

        const response =
          await assignmentService.getAssignmentById(
            assignmentId
          );

        console.log(
          "ASSIGNMENT RESPONSE:",
          response
        );

        const assignmentData =
          response?.data?.assignment ||
          response?.data?.data ||
          response?.data;

        if (!assignmentData) {
          throw new Error(
            "Assignment data was not returned."
          );
        }

        setAssignment(assignmentData);

        // ------------------------------------------------
        // GET COURSE
        // ------------------------------------------------

        const course = assignmentData.course;

        if (!course) {
          throw new Error(
            "The assigned course was not found."
          );
        }

        const courseId =
          course._id || course.id;

        if (!courseId) {
          throw new Error(
            "Course ID is missing."
          );
        }

        console.log(
          "COURSE ID:",
          courseId
        );

        // ------------------------------------------------
        // GET MODULES
        // ------------------------------------------------

        let modules = Array.isArray(course.modules)
          ? course.modules
          : [];

        // ------------------------------------------------
        // FIND CURRENT MODULE
        // ------------------------------------------------

        let currentModule =
          modules.find(
            (item) =>
              String(item?._id) ===
              String(moduleId)
          ) ||
          modules.find(
            (item) =>
              String(item?.id) ===
              String(moduleId)
          );

        if (!currentModule) {
          throw new Error(
            "The requested lesson was not found."
          );
        }

        console.log(
          "CURRENT MODULE BEFORE GENERATION:",
          currentModule
        );

        // ------------------------------------------------
        // CHECK READING MATERIAL
        // ------------------------------------------------

        const existingContent =
          currentModule.content ||
          currentModule.lessonContent ||
          currentModule.lessonNotes ||
          currentModule.readingMaterial ||
          "";

        // ------------------------------------------------
        // GENERATE IF CONTENT DOES NOT EXIST
        // ------------------------------------------------

        if (
          !existingContent ||
          String(existingContent).trim().length === 0
        ) {
          console.log(
            "NO READING MATERIAL FOUND."
          );

          console.log(
            "STARTING AI MODULE GENERATION..."
          );

          setGenerating(true);

          const generateResponse =
            await assignmentService.generateModule(
              courseId,
              moduleId
            );

          console.log(
            "GENERATE MODULE RESPONSE:",
            generateResponse
          );

          const generatedModule =
            generateResponse?.data?.module ||
            generateResponse?.data?.data ||
            generateResponse?.data;

          if (!generatedModule) {
            throw new Error(
              "AI did not return generated lesson material."
            );
          }

          currentModule = generatedModule;

          console.log(
            "GENERATED MODULE:",
            generatedModule
          );
        } else {
          console.log(
            "READING MATERIAL ALREADY EXISTS."
          );
        }

        // ------------------------------------------------
        // SAVE MODULE TO STATE
        // ------------------------------------------------

        setModule(currentModule);
      } catch (err) {
        console.error(
          "LOAD LESSON ERROR:",
          err
        );

        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Unable to load lesson.";

        setError(message);
      } finally {
        setGenerating(false);
        setLoading(false);
      }
    };

    if (assignmentId && moduleId) {
      loadLesson();
    }
  }, [assignmentId, moduleId]);

  // ====================================================
  // DATA
  // ====================================================

  const learningObjectives = toArray(
    module?.learningObjectives
  );

  const keyPoints = toArray(
    module?.keyPoints
  );

  const tips = toArray(
    module?.tips
  );

  const summary = toText(
    module?.summary
  );

  const example = toText(
    module?.example
  );

  const duration =
    toText(module?.duration) ||
    "30 minutes";

  const content =
    module?.content ||
    module?.lessonContent ||
    module?.lessonNotes ||
    module?.readingMaterial ||
    "";

  // ====================================================
  // COMPLETE LESSON
  // ====================================================

  const handleComplete = async () => {
    try {
      setCompleting(true);

      console.log(
        "COMPLETING LESSON:",
        assignmentId,
        moduleId
      );

      await assignmentService.completeLesson(
        assignmentId,
        moduleId
      );

      alert(
        "Lesson completed successfully. You can now attend the quiz."
      );

      navigate(
        `/employee/quiz/${assignmentId}/${moduleId}`
      );
    } catch (err) {
      console.error(
        "COMPLETE LESSON ERROR:",
        err
      );

      alert(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to complete the lesson."
      );
    } finally {
      setCompleting(false);
    }
  };

  // ====================================================
  // BACK
  // ====================================================

  const handleBack = () => {
    navigate(-1);
  };

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F8FB] flex items-center justify-center">
        <div className="text-center">

          <div className="w-12 h-12 rounded-full border-4 border-[#18D39A] border-t-transparent animate-spin mx-auto" />

          <p className="mt-5 text-[#64748B] font-semibold">
            Loading your lesson...
          </p>

          {generating && (
            <p className="mt-2 text-[#18D39A] font-semibold">
              AI is preparing your reading material...
            </p>
          )}

        </div>
      </div>
    );
  }

  // ====================================================
  // ERROR
  // ====================================================

  if (error || !module) {
    return (
      <div className="min-h-screen bg-[#F6F8FB] p-6">

        <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-10 text-center">

          <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto text-2xl font-bold">
            !
          </div>

          <h2 className="mt-6 text-2xl font-bold text-[#0F172A]">
            Unable to load lesson
          </h2>

          <p className="mt-3 text-[#64748B]">
            {error ||
              "The lesson could not be found."}
          </p>

          <button
            type="button"
            onClick={handleBack}
            className="mt-7 px-6 h-12 rounded-xl bg-[#18D39A] hover:bg-[#13B987] text-white font-bold transition"
          >
            Back to Course
          </button>

        </div>

      </div>
    );
  }

  // ====================================================
  // PAGE
  // ====================================================

  return (
    <div className="min-h-screen bg-[#F6F8FB] pb-20">

      <div className="max-w-6xl mx-auto px-5 md:px-8 pt-6">

        {/* ============================================
            BACK
        ============================================ */}

        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 text-[#18D39A] hover:text-[#13B987] font-bold transition mb-6"
        >
          <FaArrowLeft />

          Back to Course
        </button>

        {/* ============================================
            HEADER
        ============================================ */}

        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 md:p-10">

          <div className="flex flex-col md:flex-row md:justify-between gap-6">

            <div className="flex-1">

              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-[#E8FFF6] text-[#0F9F73] text-sm font-semibold">
                <FaBookOpen />

                Learning Module
              </div>

              <h1 className="mt-5 text-3xl md:text-4xl font-black text-[#0F172A] leading-tight">
                {module.title ||
                  "Course Lesson"}
              </h1>

              {summary && (
                <p className="mt-4 text-lg text-[#64748B] leading-8 max-w-4xl">
                  {summary}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-5 mt-6">

                <div className="flex items-center gap-2 text-sm font-semibold text-[#64748B]">
                  <FaClock className="text-[#18D39A]" />

                  {duration}
                </div>

                <div className="flex items-center gap-2 text-sm font-semibold text-[#64748B]">
                  <FaGraduationCap className="text-[#18D39A]" />

                  Study before quiz
                </div>

              </div>

            </div>

            <div className="w-16 h-16 rounded-2xl bg-[#E8FFF6] text-[#18D39A] flex items-center justify-center text-2xl flex-shrink-0">
              <FaBookOpen />
            </div>

          </div>

        </div>

        {/* ============================================
            LEARNING OBJECTIVES
        ============================================ */}

        {learningObjectives.length > 0 && (
          <div className="mt-6">

            <Section
              icon={<FaBullseye />}
              title="Learning Objectives"
            >

              <p className="text-[#64748B] mb-5">
                By the end of this lesson,
                you should be able to:
              </p>

              <div className="space-y-3">

                {learningObjectives.map(
                  (objective, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]"
                    >

                      <div className="w-7 h-7 rounded-full bg-[#E8FFF6] text-[#18D39A] flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {index + 1}
                      </div>

                      <p className="text-[#334155] leading-7">
                        {objective}
                      </p>

                    </div>
                  )
                )}

              </div>

            </Section>

          </div>
        )}

        {/* ============================================
            READING MATERIAL
        ============================================ */}

        <div className="mt-6">

          <Section
            icon={<FaBookOpen />}
            title="Reading Material"
          >

            <ReadingMaterial
              content={content}
            />

          </Section>

        </div>

        {/* ============================================
            KEY POINTS
        ============================================ */}

        {keyPoints.length > 0 && (
          <div className="mt-6">

            <Section
              icon={<FaListUl />}
              title="Key Points to Remember"
            >

              <div className="space-y-3">

                {keyPoints.map(
                  (point, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-xl bg-[#F8FAFC]"
                    >

                      <FaCheckCircle className="text-[#18D39A] mt-1 flex-shrink-0" />

                      <p className="text-[#334155] leading-7">
                        {point}
                      </p>

                    </div>
                  )
                )}

              </div>

            </Section>

          </div>
        )}

        {/* ============================================
            PRACTICAL EXAMPLE
        ============================================ */}

        {example && (
          <div className="mt-6">

            <Section
              icon={<FaPlayCircle />}
              title="Practical Example"
            >

              <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-6">

                <p className="text-[#334155] leading-8 whitespace-pre-line">
                  {example}
                </p>

              </div>

            </Section>

          </div>
        )}

        {/* ============================================
            TIPS
        ============================================ */}

        {tips.length > 0 && (
          <div className="mt-6">

            <Section
              icon={<FaLightbulb />}
              title="Tips for Success"
            >

              <div className="space-y-3">

                {tips.map(
                  (tip, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-xl bg-[#FFFDF2] border border-[#F1E7B5]"
                    >

                      <FaLightbulb className="text-[#D4A900] mt-1 flex-shrink-0" />

                      <p className="text-[#475569] leading-7">
                        {tip}
                      </p>

                    </div>
                  )
                )}

              </div>

            </Section>

          </div>
        )}

        {/* ============================================
            COMPLETE LESSON
        ============================================ */}

        <div className="mt-8 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 md:p-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>

              <h2 className="text-xl font-bold text-[#0F172A]">
                Ready for the quiz?
              </h2>

              <p className="mt-2 text-[#64748B] leading-7 max-w-2xl">
                Read through all the material carefully.
                Once you finish studying, mark the lesson
                complete to continue to the module quiz.
              </p>

            </div>

            <button
              type="button"
              onClick={handleComplete}
              disabled={completing}
              className="h-12 px-7 rounded-xl bg-[#18D39A] hover:bg-[#13B987] text-white font-bold flex items-center justify-center gap-3 shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed flex-shrink-0"
            >

              {completing ? (
                <>
                  <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />

                  Completing...
                </>
              ) : (
                <>
                  <FaCheckCircle />

                  Mark Lesson Complete
                </>
              )}

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Lesson;