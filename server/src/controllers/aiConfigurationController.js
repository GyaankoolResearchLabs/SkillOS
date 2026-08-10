const AIConfiguration = require("../models/AIConfiguration");

// =====================================================
// DEFAULT CONFIGURATION
// =====================================================

const DEFAULT_CONFIGURATION = {
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

  quizGeneration: {
    questionsPerQuiz: 10,
    passingScore: 70,
    difficulty: "Intermediate",
  },

  responseStyle: "Professional",
};

// =====================================================
// GET CONFIGURATION
// =====================================================

const getAIConfiguration = async (req, res) => {
  try {
    let configuration =
      await AIConfiguration.findOne({
        createdBy: req.user._id,
      });

    // -----------------------------------------------
    // Create defaults automatically
    // -----------------------------------------------

    if (!configuration) {
      configuration =
        await AIConfiguration.create({
          createdBy: req.user._id,
          ...DEFAULT_CONFIGURATION,
        });
    }

    return res.status(200).json({
      success: true,
      configuration,
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
// UPDATE CONFIGURATION
// =====================================================

const updateAIConfiguration = async (req, res) => {
  try {
    const {
      enabled,
      provider,
      model,
      features,
      courseGeneration,
      quizGeneration,
      responseStyle,
    } = req.body;

    const configuration =
      await AIConfiguration.findOneAndUpdate(
        {
          createdBy: req.user._id,
        },
        {
          $set: {
            enabled:
              enabled !== undefined
                ? enabled
                : true,

            provider:
              provider || "OpenAI",

            model:
              model || "gpt-4.1",

            features: {
              ...DEFAULT_CONFIGURATION.features,
              ...(features || {}),
            },

            courseGeneration: {
              ...DEFAULT_CONFIGURATION.courseGeneration,
              ...(courseGeneration || {}),
            },

            quizGeneration: {
              ...DEFAULT_CONFIGURATION.quizGeneration,
              ...(quizGeneration || {}),
            },

            responseStyle:
              responseStyle ||
              "Professional",
          },
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        }
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

module.exports = {
  getAIConfiguration,
  updateAIConfiguration,
};