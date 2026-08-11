const AIConfiguration = require("../models/AIConfiguration");

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
// DEFAULT CONFIGURATION
// =====================================================

const DEFAULT_CONFIGURATION = {
  enabled: true,

  // Kept internally for the AI service.
  // It is no longer exposed in the frontend UI.
  provider: "OpenAI",

  model: "gpt-4.1",

  features: {
    sopCourseGeneration: true,
    sopAnalysis: true,
    quizGeneration: true,
    aiInsights: true,
    courseRecommendations: true,
  },

  // Course difficulty supports:
  // Beginner | Intermediate | Advanced
  courseGeneration: {
    difficulty: "Intermediate",
    modules: 5,
    lessonsPerModule: 4,
  },

  // Quiz difficulty supports ONLY:
  // Easy | Medium | Hard
  quizGeneration: {
    questionsPerQuiz: 10,
    passingScore: 70,
    difficulty: "Medium",
  },

  responseStyle: "Professional",
};

// =====================================================
// NORMALIZE CONFIGURATION
// =====================================================

const normalizeConfiguration = (configuration = {}) => {
  const courseDifficulty =
    COURSE_DIFFICULTIES.includes(
      configuration?.courseGeneration?.difficulty
    )
      ? configuration.courseGeneration.difficulty
      : DEFAULT_CONFIGURATION.courseGeneration.difficulty;

  const quizDifficulty =
    QUIZ_DIFFICULTIES.includes(
      configuration?.quizGeneration?.difficulty
    )
      ? configuration.quizGeneration.difficulty
      : DEFAULT_CONFIGURATION.quizGeneration.difficulty;

  return {
    enabled:
      configuration.enabled !== undefined
        ? configuration.enabled
        : DEFAULT_CONFIGURATION.enabled,

    provider:
      configuration.provider ||
      DEFAULT_CONFIGURATION.provider,

    model:
      configuration.model ||
      DEFAULT_CONFIGURATION.model,

    features: {
      ...DEFAULT_CONFIGURATION.features,
      ...(configuration.features || {}),
    },

    courseGeneration: {
      ...DEFAULT_CONFIGURATION.courseGeneration,
      ...(configuration.courseGeneration || {}),
      difficulty: courseDifficulty,
    },

    quizGeneration: {
      ...DEFAULT_CONFIGURATION.quizGeneration,
      ...(configuration.quizGeneration || {}),
      difficulty: quizDifficulty,
    },

    responseStyle:
      configuration.responseStyle ||
      DEFAULT_CONFIGURATION.responseStyle,
  };
};

// =====================================================
// GET AI CONFIGURATION
// =====================================================

const getAIConfiguration = async (req, res) => {
  try {
    console.log("==========================================");
    console.log("GET AI CONFIGURATION");
    console.log("USER ID:", req.user?._id);
    console.log("==========================================");

    let configuration =
      await AIConfiguration.findOne({
        createdBy: req.user._id,
      });

    // -----------------------------------------------
    // CREATE DEFAULT CONFIGURATION
    // -----------------------------------------------

    if (!configuration) {
      console.log(
        "NO AI CONFIGURATION FOUND."
      );

      console.log(
        "CREATING DEFAULT AI CONFIGURATION..."
      );

      configuration =
        await AIConfiguration.create({
          createdBy: req.user._id,
          ...DEFAULT_CONFIGURATION,
        });

      console.log(
        "DEFAULT AI CONFIGURATION CREATED:",
        configuration._id
      );
    }

    // -----------------------------------------------
    // NORMALIZE RESPONSE
    // -----------------------------------------------

    const normalizedConfiguration =
      normalizeConfiguration(
        configuration.toObject
          ? configuration.toObject()
          : configuration
      );

    return res.status(200).json({
      success: true,
      configuration: {
        ...configuration.toObject(),
        ...normalizedConfiguration,
      },
    });
  } catch (error) {
    console.error(
      "GET AI CONFIGURATION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load AI configuration.",
    });
  }
};

// =====================================================
// UPDATE AI CONFIGURATION
// =====================================================

const updateAIConfiguration = async (
  req,
  res
) => {
  try {
    console.log(
      "=========================================="
    );

    console.log(
      "UPDATE AI CONFIGURATION"
    );

    console.log(
      "USER ID:",
      req.user?._id
    );

    console.log(
      "REQUEST BODY:",
      req.body
    );

    console.log(
      "=========================================="
    );

    const {
      enabled,
      provider,
      model,
      features,
      courseGeneration,
      quizGeneration,
      responseStyle,
    } = req.body;

    // -----------------------------------------------
    // VALIDATE COURSE DIFFICULTY
    // -----------------------------------------------

    const requestedCourseDifficulty =
      courseGeneration?.difficulty;

    const finalCourseDifficulty =
      COURSE_DIFFICULTIES.includes(
        requestedCourseDifficulty
      )
        ? requestedCourseDifficulty
        : DEFAULT_CONFIGURATION
            .courseGeneration
            .difficulty;

    // -----------------------------------------------
    // VALIDATE QUIZ DIFFICULTY
    // -----------------------------------------------

    const requestedQuizDifficulty =
      quizGeneration?.difficulty;

    const finalQuizDifficulty =
      QUIZ_DIFFICULTIES.includes(
        requestedQuizDifficulty
      )
        ? requestedQuizDifficulty
        : DEFAULT_CONFIGURATION
            .quizGeneration
            .difficulty;

    // -----------------------------------------------
    // BUILD SAFE CONFIGURATION
    // -----------------------------------------------

    const safeConfiguration = {
      enabled:
        enabled !== undefined
          ? enabled
          : DEFAULT_CONFIGURATION.enabled,

      provider:
        provider ||
        DEFAULT_CONFIGURATION.provider,

      model:
        model ||
        DEFAULT_CONFIGURATION.model,

      features: {
        ...DEFAULT_CONFIGURATION.features,
        ...(features || {}),
      },

      courseGeneration: {
        ...DEFAULT_CONFIGURATION.courseGeneration,
        ...(courseGeneration || {}),
        difficulty:
          finalCourseDifficulty,
      },

      quizGeneration: {
        ...DEFAULT_CONFIGURATION.quizGeneration,
        ...(quizGeneration || {}),
        difficulty:
          finalQuizDifficulty,
      },

      responseStyle:
        responseStyle ||
        DEFAULT_CONFIGURATION.responseStyle,
    };

    console.log(
      "SAFE AI CONFIGURATION:",
      safeConfiguration
    );

    // -----------------------------------------------
    // SAVE
    // -----------------------------------------------

    const configuration =
      await AIConfiguration.findOneAndUpdate(
        {
          createdBy: req.user._id,
        },
        {
          $set: safeConfiguration,
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        }
      );

    console.log(
      "AI CONFIGURATION SAVED:",
      configuration._id
    );

    return res.status(200).json({
      success: true,
      message:
        "AI configuration saved successfully.",
      configuration,
    });
  } catch (error) {
    console.error(
      "UPDATE AI CONFIGURATION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to save AI configuration.",
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getAIConfiguration,
  updateAIConfiguration,
};