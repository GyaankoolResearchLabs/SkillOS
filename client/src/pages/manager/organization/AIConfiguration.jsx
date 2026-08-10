import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaRobot,
  FaSave,
  FaUndo,
  FaCheckCircle,
  FaBookOpen,
  FaClipboardCheck,
  FaLightbulb,
  FaChartLine,
  FaShieldAlt,
  FaCog,
} from "react-icons/fa";

import api from "../../../services/api";

// =====================================================
// DEFAULT CONFIGURATION
// =====================================================

const DEFAULT_CONFIG = {
  enabled: true,

  provider: "OpenAI",

  model: "gpt-4.1",

  features: {
    sopCourseGeneration: true,
    sopAnalysis: true,
    quizGeneration: true,
    aiInsights: true,
    courseRecommendations: true,
  },

  courseGeneration: {
    difficulty: "Intermediate",
    modules: 5,
    lessonsPerModule: 4,
  },

  // IMPORTANT:
  // Quiz difficulty uses ONLY:
  // Easy | Medium | Hard
  quizGeneration: {
    questionsPerQuiz: 10,
    passingScore: 70,
    difficulty: "Medium",
  },

  responseStyle: "Professional",
};

// =====================================================
// VALID VALUES
// =====================================================

const QUIZ_DIFFICULTIES = [
  "Easy",
  "Medium",
  "Hard",
];

const COURSE_DIFFICULTIES = [
  "Beginner",
  "Intermediate",
  "Advanced",
];

// =====================================================
// NORMALIZE CONFIGURATION
// =====================================================

const normalizeConfiguration = (incoming = {}) => {
  const quizDifficulty =
    QUIZ_DIFFICULTIES.includes(
      incoming?.quizGeneration?.difficulty
    )
      ? incoming.quizGeneration.difficulty
      : DEFAULT_CONFIG.quizGeneration.difficulty;

  const courseDifficulty =
    COURSE_DIFFICULTIES.includes(
      incoming?.courseGeneration?.difficulty
    )
      ? incoming.courseGeneration.difficulty
      : DEFAULT_CONFIG.courseGeneration.difficulty;

  return {
    ...DEFAULT_CONFIG,
    ...incoming,

    features: {
      ...DEFAULT_CONFIG.features,
      ...(incoming.features || {}),
    },

    courseGeneration: {
      ...DEFAULT_CONFIG.courseGeneration,
      ...(incoming.courseGeneration || {}),
      difficulty: courseDifficulty,
    },

    quizGeneration: {
      ...DEFAULT_CONFIG.quizGeneration,
      ...(incoming.quizGeneration || {}),
      difficulty: quizDifficulty,
    },
  };
};

// =====================================================
// TOGGLE
// =====================================================

function Toggle({ enabled, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      aria-label={
        enabled
          ? "Disable setting"
          : "Enable setting"
      }
      className={`
        relative
        inline-flex
        h-6
        w-11
        flex-shrink-0
        rounded-full
        transition-colors
        duration-200
        ${
          enabled
            ? "bg-[#18D39A]"
            : "bg-slate-300"
        }
      `}
    >
      <span
        className={`
          pointer-events-none
          inline-block
          h-5
          w-5
          rounded-full
          bg-white
          shadow
          transform
          transition
          duration-200
          mt-0.5
          ${
            enabled
              ? "translate-x-5"
              : "translate-x-0.5"
          }
        `}
      />
    </button>
  );
}

// =====================================================
// FEATURE CARD
// =====================================================

function FeatureCard({
  icon,
  title,
  description,
  enabled,
  onChange,
}) {
  return (
    <div
      className="
        bg-white
        border
        border-slate-200
        rounded-2xl
        p-5
        flex
        items-center
        justify-between
        gap-4
      "
    >
      <div className="flex items-center gap-4 min-w-0">
        <div
          className="
            w-11
            h-11
            rounded-xl
            bg-[#18D39A]/10
            text-[#18D39A]
            flex
            items-center
            justify-center
            flex-shrink-0
          "
        >
          {icon}
        </div>

        <div className="min-w-0">
          <h3 className="font-bold text-slate-900">
            {title}
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            {description}
          </p>
        </div>
      </div>

      <Toggle
        enabled={enabled}
        onChange={onChange}
      />
    </div>
  );
}

// =====================================================
// AI CONFIGURATION
// =====================================================

export default function AIConfiguration() {
  const [config, setConfig] =
    useState(DEFAULT_CONFIG);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  // ===================================================
  // LOAD CONFIGURATION
  // ===================================================

  useEffect(() => {
    const loadConfiguration = async () => {
      try {
        setLoading(true);

        const response = await api.get(
          "/ai-configuration"
        );

        if (
          response.data?.success &&
          response.data?.configuration
        ) {
          const normalized =
            normalizeConfiguration(
              response.data.configuration
            );

          setConfig(normalized);
        }
      } catch (error) {
        console.error(
          "LOAD AI CONFIGURATION ERROR:",
          error
        );

        toast.error(
          "Failed to load AI configuration."
        );
      } finally {
        setLoading(false);
      }
    };

    loadConfiguration();
  }, []);

  // ===================================================
  // UPDATE ROOT CONFIG
  // ===================================================

  const updateConfig = (key, value) => {
    setConfig((current) => ({
      ...current,
      [key]: value,
    }));
  };

  // ===================================================
  // UPDATE FEATURE
  // ===================================================

  const updateFeature = (key, value) => {
    setConfig((current) => ({
      ...current,

      features: {
        ...current.features,
        [key]: value,
      },
    }));
  };

  // ===================================================
  // UPDATE COURSE
  // ===================================================

  const updateCourse = (key, value) => {
    setConfig((current) => ({
      ...current,

      courseGeneration: {
        ...current.courseGeneration,
        [key]: value,
      },
    }));
  };

  // ===================================================
  // UPDATE QUIZ
  // ===================================================

  const updateQuiz = (key, value) => {
    setConfig((current) => ({
      ...current,

      quizGeneration: {
        ...current.quizGeneration,
        [key]: value,
      },
    }));
  };

  // ===================================================
  // SAVE CONFIGURATION
  // ===================================================

  const handleSave = async () => {
    try {
      setSaving(true);

      // -----------------------------------------------
      // FINAL SAFETY NORMALIZATION
      // -----------------------------------------------

      const normalizedConfig =
        normalizeConfiguration(config);

      // -----------------------------------------------
      // PAYLOAD
      // -----------------------------------------------

      const payload = {
        enabled: normalizedConfig.enabled,

        provider:
          normalizedConfig.provider,

        model:
          normalizedConfig.model,

        features:
          normalizedConfig.features,

        courseGeneration:
          normalizedConfig.courseGeneration,

        quizGeneration: {
          ...normalizedConfig.quizGeneration,

          // NEVER allow Intermediate here
          difficulty:
            QUIZ_DIFFICULTIES.includes(
              normalizedConfig
                .quizGeneration
                .difficulty
            )
              ? normalizedConfig
                  .quizGeneration
                  .difficulty
              : "Medium",
        },

        responseStyle:
          normalizedConfig.responseStyle,
      };

      console.log(
        "SAVING AI CONFIGURATION:",
        payload
      );

      const response = await api.put(
        "/ai-configuration",
        payload
      );

      if (response.data?.success) {
        const savedConfig =
          normalizeConfiguration(
            response.data.configuration ||
              payload
          );

        setConfig(savedConfig);

        window.dispatchEvent(
          new CustomEvent(
            "skillos:ai-configuration-updated",
            {
              detail: savedConfig,
            }
          )
        );

        toast.success(
          "AI configuration saved successfully."
        );
      } else {
        throw new Error(
          response.data?.message ||
            "Failed to save configuration."
        );
      }
    } catch (error) {
      console.error(
        "SAVE AI CONFIGURATION ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to save AI configuration."
      );
    } finally {
      setSaving(false);
    }
  };

  // ===================================================
  // RESET
  // ===================================================

  const handleReset = () => {
    const confirmed =
      window.confirm(
        "Reset AI configuration to default settings?"
      );

    if (!confirmed) {
      return;
    }

    // Create a fresh object instead of
    // reusing the same DEFAULT_CONFIG reference.
    const resetConfig =
      normalizeConfiguration(
        structuredClone(DEFAULT_CONFIG)
      );

    setConfig(resetConfig);

    toast.success(
      "Configuration reset locally. Click Save Changes to apply it."
    );
  };

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <div className="w-full min-w-0">
        <div
          className="
            bg-white
            rounded-2xl
            border
            border-slate-200
            p-10
            text-center
            text-slate-500
          "
        >
          Loading AI configuration...
        </div>
      </div>
    );
  }

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="w-full min-w-0">

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="
          bg-white
          rounded-2xl
          border
          border-slate-200
          shadow-sm
          p-6
          mb-6
        "
      >
        <div
          className="
            flex
            flex-col
            lg:flex-row
            lg:items-center
            lg:justify-between
            gap-5
          "
        >
          <div className="flex items-center gap-4 min-w-0">
            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-[#18D39A]/10
                text-[#18D39A]
                flex
                items-center
                justify-center
                flex-shrink-0
              "
            >
              <FaRobot size={25} />
            </div>

            <div className="min-w-0">
              <h1
                className="
                  text-2xl
                  md:text-3xl
                  font-extrabold
                  text-slate-900
                "
              >
                AI Configuration
              </h1>

              <p className="text-slate-500 mt-1">
                Configure how SkillOS uses AI
                across your organization.
              </p>
            </div>
          </div>

          <div className="flex gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={handleReset}
              className="
                px-5
                py-3
                rounded-xl
                border
                border-slate-200
                text-slate-600
                font-semibold
                hover:bg-slate-50
                transition
                flex
                items-center
                gap-2
              "
            >
              <FaUndo size={13} />
              Reset
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="
                px-5
                py-3
                rounded-xl
                bg-[#18D39A]
                text-white
                font-bold
                hover:bg-[#13B987]
                disabled:opacity-60
                transition
                flex
                items-center
                gap-2
              "
            >
              <FaSave size={14} />

              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* =================================================
          AI STATUS
      ================================================= */}

      <div
        className="
          bg-white
          rounded-2xl
          border
          border-slate-200
          shadow-sm
          p-6
          mb-6
        "
      >
        <div
          className="
            flex
            flex-col
            md:flex-row
            md:items-center
            md:justify-between
            gap-5
          "
        >
          <div className="flex items-center gap-4">
            <div
              className="
                w-12
                h-12
                rounded-xl
                bg-[#18D39A]/10
                text-[#18D39A]
                flex
                items-center
                justify-center
              "
            >
              <FaCheckCircle size={22} />
            </div>

            <div>
              <h2 className="font-bold text-lg">
                AI Services
              </h2>

              <p className="text-sm text-slate-500">
                Enable or disable AI functionality.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`
                font-bold
                text-sm
                ${
                  config.enabled
                    ? "text-[#13B987]"
                    : "text-slate-400"
                }
              `}
            >
              {config.enabled
                ? "AI Enabled"
                : "AI Disabled"}
            </span>

            <Toggle
              enabled={config.enabled}
              onChange={(value) =>
                updateConfig(
                  "enabled",
                  value
                )
              }
            />
          </div>
        </div>
      </div>

      {/* =================================================
          PROVIDER
      ================================================= */}

      <div
        className="
          bg-white
          rounded-2xl
          border
          border-slate-200
          shadow-sm
          p-6
          mb-6
        "
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="
              w-10
              h-10
              rounded-xl
              bg-slate-100
              flex
              items-center
              justify-center
              text-slate-600
            "
          >
            <FaCog />
          </div>

          <div>
            <h2 className="text-lg font-bold">
              AI Provider
            </h2>

            <p className="text-sm text-slate-500">
              Configure the AI service used by
              SkillOS.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* PROVIDER */}

          <div>
            <label className="block text-sm font-semibold mb-2">
              Provider
            </label>

            <select
              value={config.provider}
              onChange={(e) => {
                const provider =
                  e.target.value;

                let model = "gpt-4.1";

                if (provider === "Claude") {
                  model = "claude-sonnet";
                }

                if (provider === "Gemini") {
                  model =
                    "gemini-2.5-flash";
                }

                setConfig((current) => ({
                  ...current,
                  provider,
                  model,
                }));
              }}
              className="
                w-full
                h-12
                px-4
                rounded-xl
                border
                border-slate-200
                bg-white
                focus:outline-none
                focus:ring-2
                focus:ring-[#18D39A]
              "
            >
              <option value="OpenAI">
                OpenAI
              </option>

              <option value="Claude">
                Claude
              </option>

              <option value="Gemini">
                Gemini
              </option>
            </select>
          </div>

          {/* MODEL */}

          <div>
            <label className="block text-sm font-semibold mb-2">
              Model
            </label>

            <select
              value={config.model}
              onChange={(e) =>
                updateConfig(
                  "model",
                  e.target.value
                )
              }
              className="
                w-full
                h-12
                px-4
                rounded-xl
                border
                border-slate-200
                bg-white
                focus:outline-none
                focus:ring-2
                focus:ring-[#18D39A]
              "
            >
              {config.provider ===
                "OpenAI" && (
                <>
                  <option value="gpt-4.1">
                    GPT-4.1
                  </option>

                  <option value="gpt-4.1-mini">
                    GPT-4.1 Mini
                  </option>
                </>
              )}

              {config.provider ===
                "Claude" && (
                <>
                  <option value="claude-sonnet">
                    Claude Sonnet
                  </option>

                  <option value="claude-haiku">
                    Claude Haiku
                  </option>
                </>
              )}

              {config.provider ===
                "Gemini" && (
                <>
                  <option value="gemini-2.5-flash">
                    Gemini 2.5 Flash
                  </option>

                  <option value="gemini-2.5-pro">
                    Gemini 2.5 Pro
                  </option>
                </>
              )}
            </select>
          </div>
        </div>

        <div
          className="
            mt-5
            p-4
            rounded-xl
            bg-amber-50
            border
            border-amber-100
            text-sm
            text-amber-700
          "
        >
          <strong>Security:</strong>{" "}
          API keys remain on the server and are
          never stored in the browser.
        </div>
      </div>

      {/* =================================================
          FEATURES
      ================================================= */}

      <div
        className="
          bg-slate-50
          rounded-2xl
          border
          border-slate-200
          p-6
          mb-6
        "
      >
        <div className="mb-6">
          <h2 className="text-lg font-bold">
            AI Features
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Choose which AI capabilities are
            available.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

          <FeatureCard
            icon={<FaBookOpen />}
            title="SOP Course Generation"
            description="Convert SOP documents into structured training courses."
            enabled={
              config.features
                .sopCourseGeneration
            }
            onChange={(value) =>
              updateFeature(
                "sopCourseGeneration",
                value
              )
            }
          />

          <FeatureCard
            icon={<FaChartLine />}
            title="SOP Analysis"
            description="Analyze SOP content and identify important training requirements."
            enabled={
              config.features
                .sopAnalysis
            }
            onChange={(value) =>
              updateFeature(
                "sopAnalysis",
                value
              )
            }
          />

          <FeatureCard
            icon={<FaClipboardCheck />}
            title="Quiz Generation"
            description="Generate assessments from training content."
            enabled={
              config.features
                .quizGeneration
            }
            onChange={(value) =>
              updateFeature(
                "quizGeneration",
                value
              )
            }
          />

          <FeatureCard
            icon={<FaLightbulb />}
            title="AI Insights"
            description="Generate intelligent insights from training data."
            enabled={
              config.features
                .aiInsights
            }
            onChange={(value) =>
              updateFeature(
                "aiInsights",
                value
              )
            }
          />

          <FeatureCard
            icon={<FaBookOpen />}
            title="Course Recommendations"
            description="Recommend relevant learning programs."
            enabled={
              config.features
                .courseRecommendations
            }
            onChange={(value) =>
              updateFeature(
                "courseRecommendations",
                value
              )
            }
          />
        </div>
      </div>

      {/* =================================================
          COURSE GENERATION
      ================================================= */}

      <div
        className="
          bg-white
          rounded-2xl
          border
          border-slate-200
          shadow-sm
          p-6
          mb-6
        "
      >
        <h2 className="text-lg font-bold">
          Course Generation
        </h2>

        <p className="text-sm text-slate-500 mt-1 mb-6">
          Configure the structure of AI-generated
          courses.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* COURSE DIFFICULTY */}

          <div>
            <label className="block text-sm font-semibold mb-2">
              Difficulty
            </label>

            <select
              value={
                config.courseGeneration
                  .difficulty
              }
              onChange={(e) =>
                updateCourse(
                  "difficulty",
                  e.target.value
                )
              }
              className="
                w-full
                h-12
                px-4
                rounded-xl
                border
                border-slate-200
                bg-white
                focus:outline-none
                focus:ring-2
                focus:ring-[#18D39A]
              "
            >
              <option value="Beginner">
                Beginner
              </option>

              <option value="Intermediate">
                Intermediate
              </option>

              <option value="Advanced">
                Advanced
              </option>
            </select>
          </div>

          {/* MODULES */}

          <div>
            <label className="block text-sm font-semibold mb-2">
              Modules
            </label>

            <input
              type="number"
              min="1"
              max="20"
              value={
                config.courseGeneration
                  .modules
              }
              onChange={(e) =>
                updateCourse(
                  "modules",
                  Math.max(
                    1,
                    Math.min(
                      20,
                      Number(
                        e.target.value
                      )
                    )
                  )
                )
              }
              className="
                w-full
                h-12
                px-4
                rounded-xl
                border
                border-slate-200
                focus:outline-none
                focus:ring-2
                focus:ring-[#18D39A]
              "
            />
          </div>

          {/* LESSONS */}

          <div>
            <label className="block text-sm font-semibold mb-2">
              Lessons Per Module
            </label>

            <input
              type="number"
              min="1"
              max="20"
              value={
                config.courseGeneration
                  .lessonsPerModule
              }
              onChange={(e) =>
                updateCourse(
                  "lessonsPerModule",
                  Math.max(
                    1,
                    Math.min(
                      20,
                      Number(
                        e.target.value
                      )
                    )
                  )
                )
              }
              className="
                w-full
                h-12
                px-4
                rounded-xl
                border
                border-slate-200
                focus:outline-none
                focus:ring-2
                focus:ring-[#18D39A]
              "
            />
          </div>
        </div>
      </div>

      {/* =================================================
          QUIZ GENERATION
      ================================================= */}

      <div
        className="
          bg-white
          rounded-2xl
          border
          border-slate-200
          shadow-sm
          p-6
          mb-6
        "
      >
        <h2 className="text-lg font-bold">
          Quiz Generation
        </h2>

        <p className="text-sm text-slate-500 mt-1 mb-6">
          Configure AI-generated assessments.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* QUESTIONS */}

          <div>
            <label className="block text-sm font-semibold mb-2">
              Questions Per Quiz
            </label>

            <input
              type="number"
              min="1"
              max="50"
              value={
                config.quizGeneration
                  .questionsPerQuiz
              }
              onChange={(e) =>
                updateQuiz(
                  "questionsPerQuiz",
                  Math.max(
                    1,
                    Math.min(
                      50,
                      Number(
                        e.target.value
                      )
                    )
                  )
                )
              }
              className="
                w-full
                h-12
                px-4
                rounded-xl
                border
                border-slate-200
                focus:outline-none
                focus:ring-2
                focus:ring-[#18D39A]
              "
            />
          </div>

          {/* PASSING SCORE */}

          <div>
            <label className="block text-sm font-semibold mb-2">
              Passing Score
            </label>

            <input
              type="number"
              min="1"
              max="100"
              value={
                config.quizGeneration
                  .passingScore
              }
              onChange={(e) =>
                updateQuiz(
                  "passingScore",
                  Math.max(
                    1,
                    Math.min(
                      100,
                      Number(
                        e.target.value
                      )
                    )
                  )
                )
              }
              className="
                w-full
                h-12
                px-4
                rounded-xl
                border
                border-slate-200
                focus:outline-none
                focus:ring-2
                focus:ring-[#18D39A]
              "
            />
          </div>

          {/* QUIZ DIFFICULTY */}

          <div>
            <label className="block text-sm font-semibold mb-2">
              Difficulty
            </label>

            <select
              value={
                QUIZ_DIFFICULTIES.includes(
                  config.quizGeneration
                    .difficulty
                )
                  ? config
                      .quizGeneration
                      .difficulty
                  : "Medium"
              }
              onChange={(e) =>
                updateQuiz(
                  "difficulty",
                  e.target.value
                )
              }
              className="
                w-full
                h-12
                px-4
                rounded-xl
                border
                border-slate-200
                bg-white
                focus:outline-none
                focus:ring-2
                focus:ring-[#18D39A]
              "
            >
              <option value="Easy">
                Easy
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="Hard">
                Hard
              </option>
            </select>
          </div>
        </div>

        {/* IMPORTANT INFO */}

        <div
          className="
            mt-5
            p-4
            rounded-xl
            bg-blue-50
            border
            border-blue-100
            text-sm
            text-blue-700
          "
        >
          Quiz difficulty supports only{" "}
          <strong>
            Easy, Medium, and Hard
          </strong>
          .
        </div>
      </div>

      {/* =================================================
          RESPONSE STYLE
      ================================================= */}

      <div
        className="
          bg-white
          rounded-2xl
          border
          border-slate-200
          shadow-sm
          p-6
          mb-6
        "
      >
        <div className="flex items-center gap-3 mb-5">
          <div
            className="
              w-10
              h-10
              rounded-xl
              bg-slate-100
              flex
              items-center
              justify-center
              text-slate-600
            "
          >
            <FaShieldAlt />
          </div>

          <div>
            <h2 className="text-lg font-bold">
              AI Response Style
            </h2>

            <p className="text-sm text-slate-500">
              Define the tone of generated content.
            </p>
          </div>
        </div>

        <select
          value={config.responseStyle}
          onChange={(e) =>
            updateConfig(
              "responseStyle",
              e.target.value
            )
          }
          className="
            w-full
            md:w-1/2
            h-12
            px-4
            rounded-xl
            border
            border-slate-200
            bg-white
            focus:outline-none
            focus:ring-2
            focus:ring-[#18D39A]
          "
        >
          <option value="Professional">
            Professional
          </option>

          <option value="Simple & Beginner Friendly">
            Simple & Beginner Friendly
          </option>

          <option value="Detailed & Technical">
            Detailed & Technical
          </option>

          <option value="Concise">
            Concise
          </option>
        </select>
      </div>

      {/* =================================================
          FINAL SAVE
      ================================================= */}

      <div className="flex justify-end pb-8">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="
            px-6
            py-3
            rounded-xl
            bg-[#18D39A]
            text-white
            font-bold
            hover:bg-[#13B987]
            disabled:opacity-60
            transition
            flex
            items-center
            gap-2
          "
        >
          <FaSave />

          {saving
            ? "Saving..."
            : "Save AI Configuration"}
        </button>
      </div>
    </div>
  );
}