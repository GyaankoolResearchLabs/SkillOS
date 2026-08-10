console.log("====== SOP CONTROLLER LOADED ======");

const generateDocumentHash =
  require("../utils/hashDocument");

const Course = require("../models/Course");

const normalizeCourse =
  require("../utils/normalizeCourse");

const {
  extractPDFText,
} = require("../services/pdfService");

const cleanText =
  require("../services/ai/textCleaner");

const extractImportantSections =
  require("../services/ai/sectionExtractor");

const generateCourse =
  require("../services/ai/aiCourseGenerator");

// =====================================================
// ORGANIZATION HELPER
// =====================================================

const getOrganizationId = (req) => {
  return req.user?.organizationId || null;
};

// =====================================================
// Upload SOP & Generate AI Course
// =====================================================

const uploadSOP = async (req, res) => {
  console.log("====== uploadSOP CALLED ======");

  try {
    // ===================================================
    // AUTHENTICATION / ORGANIZATION VALIDATION
    // ===================================================

    const organizationId =
      getOrganizationId(req);

    const userId =
      req.user?._id || null;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        message:
          "User is not associated with an organization.",
      });
    }

    console.log(
      "UPLOAD ORGANIZATION:",
      organizationId.toString()
    );

    console.log(
      "UPLOAD USER:",
      userId.toString()
    );

    // ===================================================
    // VALIDATE FILE
    // ===================================================

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "No document uploaded.",
      });
    }

    console.log(
      "Uploaded:",
      req.file.originalname
    );

    // ===================================================
    // READ UI OPTIONS
    // ===================================================

    const audience =
      req.body.audience ||
      "Employee";

    const category =
      req.body.category ||
      "Compliance";

    const difficulty =
      req.body.difficulty ||
      "Auto";

    let options = {};

    try {
      options = req.body.options
        ? JSON.parse(req.body.options)
        : {};
    } catch (error) {
      console.log(
        "Unable to parse options. Using defaults."
      );

      options = {};
    }

    // ===================================================
    // EXTRACT PDF
    // ===================================================

    console.log(
      "Extracting PDF..."
    );

    const rawText =
      await extractPDFText(
        req.file.path
      );

    if (
      !rawText ||
      rawText.trim().length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Unable to extract text from document.",
      });
    }

    console.log(
      "PDF Extracted"
    );

    // ===================================================
    // CLEAN TEXT
    // ===================================================

    const cleanedText =
      cleanText(rawText);

    const documentHash =
      generateDocumentHash(
        cleanedText
      );

    console.log(
      "Generated Hash:",
      documentHash
    );

    // ===================================================
    // PREVENT DUPLICATE COURSES
    // ===================================================
    //
    // IMPORTANT:
    // Duplicate checking is now organization-specific.
    //
    // Organization A uploading a document should not
    // prevent Organization B from uploading the same SOP.
    // ===================================================

    const existingCourse =
      await Course.findOne({
        organizationId,
        documentHash,
      });

    if (existingCourse) {
      return res.status(409).json({
        success: false,

        message:
          "A course has already been generated from this document.",

        course: existingCourse,
      });
    }

    // ===================================================
    // EXTRACT IMPORTANT SECTIONS
    // ===================================================

    const importantText =
      extractImportantSections(
        cleanedText
      );

    const aiInput =
      importantText.length > 500
        ? importantText
        : cleanedText;

    console.log(
      "Preparing AI Input..."
    );

    // ===================================================
    // LIMIT TEXT SIZE
    // ===================================================

    const masterSummary =
      aiInput.slice(0, 15000);

    console.log(
      `Using ${masterSummary.length} characters for AI generation`
    );

    // ===================================================
    // GENERATE COURSE + AI INSIGHTS
    // ===================================================

    console.log(
      "Generating AI Course..."
    );

    const result =
      await generateCourse({
        text: aiInput,

        audience,

        category,

        difficulty,

        options,

        userId,
      });

    if (!result) {
      throw new Error(
        "AI course generator returned no result."
      );
    }

    const aiCourse =
      result.course;

    const aiInsights =
      result.aiInsights;

    console.log(
      "Course & AI Insights Generated"
    );

    // ===================================================
    // VALIDATE AI COURSE
    // ===================================================

    if (!aiCourse) {
      throw new Error(
        "AI course generator did not return a course."
      );
    }

    // ===================================================
    // NORMALIZE AI OUTPUT
    // ===================================================

    const cleanedCourse =
      normalizeCourse(
        aiCourse
      );

    // ===================================================
    // BACKEND VALUES ALWAYS WIN
    // ===================================================
    //
    // NEVER trust organizationId coming from the
    // frontend or AI output.
    //
    // The organization comes ONLY from req.user.
    // ===================================================

    cleanedCourse.organizationId =
      organizationId;

    cleanedCourse.createdBy =
      userId;

    cleanedCourse.aiInsights =
      aiInsights;

    cleanedCourse.audience =
      audience;

    cleanedCourse.category =
      category;

    cleanedCourse.documentHash =
      documentHash;

    // ===================================================
    // LOG BEFORE SAVE
    // ===================================================

    console.log(
      "------------------------------------------"
    );

    console.log(
      "COURSE SAVE INFORMATION"
    );

    console.log(
      "organizationId:",
      cleanedCourse.organizationId
    );

    console.log(
      "createdBy:",
      cleanedCourse.createdBy
    );

    console.log(
      "documentHash:",
      cleanedCourse.documentHash
    );

    console.log(
      "courseTitle:",
      cleanedCourse.courseTitle
    );

    console.log(
      "------------------------------------------"
    );

    // ===================================================
    // GENERATE ONBOARDING ASSESSMENTS
    // ===================================================

    if (
      audience === "Employee" &&
      (
        category === "Onboarding" ||
        category === "Induction"
      )
    ) {
      console.log(
        "Generating onboarding assessments..."
      );

      const generateOnboardingAssessments =
        require(
          "../services/ai/aiOnboardingAssessmentGenerator"
        );

      const assessmentResult =
        await generateOnboardingAssessments(
          cleanedCourse
        );

      if (
        assessmentResult &&
        Array.isArray(
          assessmentResult.assessments
        )
      ) {
        cleanedCourse.onboardingAssessments =
          assessmentResult.assessments.map(
            (assessment) => ({
              title:
                assessment.title ||
                "",

              description:
                assessment.description ||
                "",

              studyContent:
                assessment.studyContent ||
                "",

              estimatedDuration:
                assessment.estimatedDuration ||
                "5 minutes",

              questions:
                Array.isArray(
                  assessment.questions
                )
                  ? assessment.questions
                  : [],

              passingScore:
                80,
            })
          );
      } else {
        cleanedCourse.onboardingAssessments =
          [];
      }

      console.log(
        "ONBOARDING ASSESSMENTS GENERATED:",
        cleanedCourse
          .onboardingAssessments
          .length
      );

      console.log(
        "STUDY MATERIAL GENERATED:",
        cleanedCourse
          .onboardingAssessments
          .map(
            (assessment) => ({
              title:
                assessment.title,

              studyContentLength:
                assessment
                  .studyContent
                  ?.length || 0,

              questions:
                assessment
                  .questions
                  ?.length || 0,
            })
          )
      );
    }

    // ===================================================
    // FINAL ORGANIZATION SAFETY
    // ===================================================
    //
    // Re-assign these immediately before MongoDB save.
    // This protects against normalizeCourse or any
    // previous operation modifying them.
    // ===================================================

    cleanedCourse.organizationId =
      organizationId;

    cleanedCourse.createdBy =
      userId;

    cleanedCourse.documentHash =
      documentHash;

    console.log(
      "Generated Hash:",
      documentHash
    );

    console.log(
      "Saving Hash:",
      cleanedCourse.documentHash
    );

    console.log(
      "Saving Organization:",
      cleanedCourse.organizationId
    );

    console.log(
      "Saving Creator:",
      cleanedCourse.createdBy
    );

    // ===================================================
    // SAVE COURSE
    // ===================================================

    const savedCourse =
      await Course.create(
        cleanedCourse
      );

    console.log(
      "=========================================="
    );

    console.log(
      "COURSE SAVED TO MONGODB"
    );

    console.log(
      "Course ID:",
      savedCourse._id.toString()
    );

    console.log(
      "Organization ID:",
      savedCourse.organizationId
        ?.toString()
    );

    console.log(
      "Created By:",
      savedCourse.createdBy
        ?.toString()
    );

    console.log(
      "=========================================="
    );

    // ===================================================
    // RESPONSE
    // ===================================================

    return res.status(201).json({
      success: true,

      message:
        "AI Course generated successfully.",

      course:
        savedCourse,
    });
  } catch (err) {
    console.error(
      "UPLOAD SOP ERROR"
    );

    console.error(err);

    return res.status(500).json({
      success: false,

      message:
        err.message ||
        "Failed to generate AI course.",
    });
  }
};

// =====================================================
// GET ALL COURSES
// =====================================================

const getCourses = async (
  req,
  res
) => {
  try {
    const organizationId =
      getOrganizationId(req);

    if (!organizationId) {
      return res.status(400).json({
        success: false,

        message:
          "User is not associated with an organization.",
      });
    }

    const courses =
      await Course.find({
        organizationId,
      }).sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,

      count:
        courses.length,

      courses,
    });
  } catch (err) {
    console.error(
      "GET COURSES ERROR:",
      err
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch courses.",
    });
  }
};

// =====================================================
// GET COURSE BY ID
// =====================================================

const getCourseById = async (
  req,
  res
) => {
  try {
    const organizationId =
      getOrganizationId(req);

    if (!organizationId) {
      return res.status(400).json({
        success: false,

        message:
          "User is not associated with an organization.",
      });
    }

    const course =
      await Course.findOne({
        _id: req.params.id,

        organizationId,
      });

    if (!course) {
      return res.status(404).json({
        success: false,

        message:
          "Course not found.",
      });
    }

    return res.status(200).json({
      success: true,

      course,
    });
  } catch (err) {
    console.error(
      "GET COURSE BY ID ERROR:",
      err
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch course.",
    });
  }
};

// =====================================================
// DELETE COURSE
// =====================================================

const deleteCourse = async (
  req,
  res
) => {
  try {
    const organizationId =
      getOrganizationId(req);

    if (!organizationId) {
      return res.status(400).json({
        success: false,

        message:
          "User is not associated with an organization.",
      });
    }

    const course =
      await Course.findOneAndDelete({
        _id: req.params.id,

        organizationId,
      });

    if (!course) {
      return res.status(404).json({
        success: false,

        message:
          "Course not found.",
      });
    }

    return res.status(200).json({
      success: true,

      message:
        "Course deleted successfully.",
    });
  } catch (err) {
    console.error(
      "DELETE COURSE ERROR:",
      err
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to delete course.",
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  uploadSOP,
  getCourses,
  getCourseById,
  deleteCourse,
};