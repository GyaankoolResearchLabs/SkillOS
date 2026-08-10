const Course = require("../models/Course");

const generateOnboardingAssessments =
  require("../services/ai/aiOnboardingAssessmentGenerator");

const generateModule =
  require("../services/ai/generateModule");

// ======================================================
// ORGANIZATION HELPER
// ======================================================

const getOrganizationId = (req) => {
  return req.user?.organizationId || null;
};

// ======================================================
// MIGRATE LEGACY COURSES
// ======================================================
//
// Older courses may have been created before
// organizationId was introduced.
//
// A legacy course can ONLY be migrated when:
// 1. organizationId is missing
// 2. createdBy matches the authenticated user
//
// This prevents another organization from claiming
// somebody else's course.
// ======================================================

const migrateLegacyCoursesForUser = async (req) => {
  const organizationId = getOrganizationId(req);
  const userId = req.user?._id;

  if (!organizationId || !userId) {
    return;
  }

  try {
    const result = await Course.updateMany(
      {
        createdBy: userId,
        $or: [
          {
            organizationId: null,
          },
          {
            organizationId: {
              $exists: false,
            },
          },
        ],
      },
      {
        $set: {
          organizationId,
        },
      }
    );

    if (result.modifiedCount > 0) {
      console.log(
        `Migrated ${result.modifiedCount} legacy course(s) for user ${userId}`
      );
    }
  } catch (error) {
    console.error(
      "LEGACY COURSE MIGRATION ERROR:",
      error
    );
  }
};

// ======================================================
// GET ALL COURSES
// ======================================================

const getCourses = async (req, res) => {
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

    // --------------------------------------------------
    // Migrate old courses belonging to this user
    // --------------------------------------------------

    await migrateLegacyCoursesForUser(req);

    // --------------------------------------------------
    // ONLY return courses belonging to this organization
    // --------------------------------------------------

    const courses = await Course.find({
      organizationId,
    }).sort({
      createdAt: -1,
    });

    console.log(
      "GET COURSES SUCCESS:",
      courses.length
    );

    return res.status(200).json({
      success: true,
      count: courses.length,
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

// ======================================================
// GET SINGLE COURSE
// ======================================================

const getCourseById = async (req, res) => {
  try {
    const organizationId =
      getOrganizationId(req);

    const userId =
      req.user?._id;

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        message:
          "User is not associated with an organization.",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    const courseId =
      req.params.id;

    console.log(
      "=========================================="
    );

    console.log(
      "GET COURSE BY ID"
    );

    console.log(
      "Course ID:",
      courseId
    );

    console.log(
      "User ID:",
      userId
    );

    console.log(
      "Organization ID:",
      organizationId
    );

    console.log(
      "=========================================="
    );

    // ==================================================
    // FIRST: FIND COURSE BY ID
    // ==================================================

    let course =
      await Course.findById(courseId);

    // ==================================================
    // COURSE DOES NOT EXIST
    // ==================================================

    if (!course) {
      console.log(
        "COURSE DOES NOT EXIST IN DATABASE"
      );

      return res.status(404).json({
        success: false,
        message:
          "Course not found.",
      });
    }

    console.log(
      "DATABASE COURSE FOUND"
    );

    console.log(
      "Database Course ID:",
      course._id.toString()
    );

    console.log(
      "Database Organization ID:",
      course.organizationId
        ? course.organizationId.toString()
        : null
    );

    console.log(
      "Database Created By:",
      course.createdBy
        ? course.createdBy.toString()
        : null
    );

    // ==================================================
    // ORGANIZATION MATCH
    // ==================================================

    if (
      course.organizationId &&
      course.organizationId.toString() ===
        organizationId.toString()
    ) {
      console.log(
        "COURSE TENANT VERIFIED"
      );

      return res.status(200).json({
        success: true,
        course,
      });
    }

    // ==================================================
    // LEGACY / INCORRECTLY LINKED COURSE
    // ==================================================
    //
    // If the course was created by this exact user,
    // it is safe to repair its organizationId.
    //
    // We NEVER allow a random user to claim a course.
    //
    // ==================================================

    if (
      course.createdBy &&
      course.createdBy.toString() ===
        userId.toString()
    ) {
      console.log(
        "COURSE CREATED BY CURRENT USER"
      );

      console.log(
        "Repairing organizationId..."
      );

      course.organizationId =
        organizationId;

      await course.save();

      console.log(
        "COURSE ORGANIZATION REPAIRED"
      );

      return res.status(200).json({
        success: true,
        course,
      });
    }

    // ==================================================
    // SECURITY BLOCK
    // ==================================================

    console.log(
      "COURSE TENANT MISMATCH"
    );

    console.log(
      "Course Organization:",
      course.organizationId
    );

    console.log(
      "Current User Organization:",
      organizationId
    );

    return res.status(404).json({
      success: false,
      message:
        "Course not found.",
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

// ======================================================
// GENERATE SINGLE MODULE
// ======================================================

const generateCourseModule = async (
  req,
  res
) => {
  try {
    const {
      courseId,
      moduleId,
    } = req.params;

    const organizationId =
      getOrganizationId(req);

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        message:
          "User is not associated with an organization.",
      });
    }

    // --------------------------------------------------
    // Migrate legacy courses first
    // --------------------------------------------------

    await migrateLegacyCoursesForUser(req);

    console.log(
      "=========================================="
    );

    console.log(
      "GENERATE MODULE REQUEST"
    );

    console.log(
      "Course ID:",
      courseId
    );

    console.log(
      "Module ID:",
      moduleId
    );

    console.log(
      "Organization ID:",
      organizationId
    );

    console.log(
      "=========================================="
    );

    // --------------------------------------------------
    // FIND COURSE INSIDE ORGANIZATION
    // --------------------------------------------------

    const course =
      await Course.findOne({
        _id: courseId,
        organizationId,
      });

    if (!course) {
      return res.status(404).json({
        success: false,
        message:
          "Course not found.",
      });
    }

    // --------------------------------------------------
    // FIND MODULE
    // --------------------------------------------------

    const module =
      course.modules.id(moduleId);

    if (!module) {
      return res.status(404).json({
        success: false,
        message:
          "Module not found.",
      });
    }

    // --------------------------------------------------
    // ALREADY GENERATED
    // --------------------------------------------------

    if (
      module.generated === true &&
      module.content &&
      module.content.trim().length > 0
    ) {
      return res.status(200).json({
        success: true,
        alreadyGenerated: true,
        module,
      });
    }

    // --------------------------------------------------
    // GENERATE WITH AI
    // --------------------------------------------------

    console.log(
      `Generating learning material for: ${module.title}`
    );

    const generatedModule =
      await generateModule({
        courseTitle:
          course.courseTitle || "",

        courseDescription:
          course.description || "",

        audience:
          course.audience ||
          "Employee",

        difficulty:
          course.difficulty ||
          "Beginner",

        moduleTitle:
          module.title || "",

        moduleSummary:
          module.summary || "",
      });

    console.log(
      "AI MODULE RESPONSE:",
      generatedModule
    );

    if (!generatedModule) {
      throw new Error(
        "AI module generator returned no data."
      );
    }

    // --------------------------------------------------
    // SAVE GENERATED CONTENT
    // --------------------------------------------------

    module.content =
      typeof generatedModule.content ===
      "string"
        ? generatedModule.content
        : "";

    module.learningObjectives =
      Array.isArray(
        generatedModule.learningObjectives
      )
        ? generatedModule.learningObjectives
        : [];

    module.keyPoints =
      Array.isArray(
        generatedModule.keyPoints
      )
        ? generatedModule.keyPoints
        : [];

    module.example =
      typeof generatedModule.example ===
      "string"
        ? generatedModule.example
        : "";

    module.tips =
      Array.isArray(
        generatedModule.tips
      )
        ? generatedModule.tips
        : [];

    module.quiz =
      Array.isArray(
        generatedModule.quiz
      )
        ? generatedModule.quiz
        : [];

    module.generated = true;

    module.generatedAt =
      new Date();

    await course.save();

    console.log(
      "MODULE GENERATED SUCCESSFULLY"
    );

    return res.status(200).json({
      success: true,

      message:
        "Learning material generated successfully.",

      module,
    });
  } catch (err) {
    console.error(
      "GENERATE MODULE ERROR:"
    );

    console.error(err);

    return res.status(500).json({
      success: false,

      message:
        err.message ||
        "Failed to generate learning material.",
    });
  }
};

// ======================================================
// CREATE COURSE
// ======================================================

const createCourse = async (
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

    // --------------------------------------------------
    // VALIDATE TITLE
    // --------------------------------------------------

    if (
      !req.body.courseTitle ||
      !req.body.courseTitle.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Course title is required.",
      });
    }

    // --------------------------------------------------
    // CREATE COURSE
    // --------------------------------------------------
    //
    // IMPORTANT:
    // organizationId is ALWAYS taken from req.user.
    //
    // We never trust organizationId supplied by
    // the frontend.
    // --------------------------------------------------

    const course =
      await Course.create({
        ...req.body,

        organizationId,

        createdBy:
          req.user?._id ||
          null,
      });

    console.log(
      "COURSE CREATED SUCCESSFULLY"
    );

    console.log(
      "Course ID:",
      course._id.toString()
    );

    console.log(
      "Organization ID:",
      organizationId.toString()
    );

    return res.status(201).json({
      success: true,

      message:
        "Course created successfully.",

      course,
    });
  } catch (err) {
    console.error(
      "CREATE COURSE ERROR:",
      err
    );

    return res.status(500).json({
      success: false,

      message:
        err.message ||
        "Failed to create course.",
    });
  }
};

// ======================================================
// UPDATE COURSE
// ======================================================

const updateCourse = async (
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

    // --------------------------------------------------
    // MIGRATE LEGACY COURSES
    // --------------------------------------------------

    await migrateLegacyCoursesForUser(req);

    // --------------------------------------------------
    // FIND COURSE
    // --------------------------------------------------

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

    // --------------------------------------------------
    // UPDATE COURSE DATA
    // --------------------------------------------------

    Object.assign(
      course,
      req.body
    );

    // --------------------------------------------------
    // NEVER ALLOW ORGANIZATION REASSIGNMENT
    // --------------------------------------------------

    course.organizationId =
      organizationId;

    // --------------------------------------------------
    // GENERATE ONBOARDING ASSESSMENTS
    // --------------------------------------------------

    try {
      const assessmentResult =
        await generateOnboardingAssessments(
          course
        );

      if (
        assessmentResult &&
        Array.isArray(
          assessmentResult.assessments
        )
      ) {
        course.onboardingAssessments =
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

              passingScore: 80,
            })
          );
      }

      console.log(
        "ONBOARDING ASSESSMENTS GENERATED:",
        course.onboardingAssessments.length
      );
    } catch (
      assessmentError
    ) {
      console.error(
        "ONBOARDING ASSESSMENT GENERATION ERROR:"
      );

      console.error(
        assessmentError
      );

      // Do not fail the course update if
      // assessment generation fails.
    }

    // --------------------------------------------------
    // SAVE
    // --------------------------------------------------

    await course.save();

    return res.status(200).json({
      success: true,

      message:
        "Course updated successfully.",

      course,
    });
  } catch (err) {
    console.error(
      "UPDATE COURSE ERROR:",
      err
    );

    return res.status(500).json({
      success: false,

      message:
        err.message ||
        "Failed to update course.",
    });
  }
};

// ======================================================
// PUBLISH COURSE
// ======================================================

const publishCourse = async (
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

    // --------------------------------------------------
    // MIGRATE LEGACY COURSES
    // --------------------------------------------------

    await migrateLegacyCoursesForUser(req);

    // --------------------------------------------------
    // FIND COURSE
    // --------------------------------------------------

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

    // --------------------------------------------------
    // PUBLISH
    // --------------------------------------------------

    course.status =
      "Published";

    await course.save();

    console.log(
      "COURSE PUBLISHED:",
      course._id.toString()
    );

    return res.status(200).json({
      success: true,

      message:
        "Course published successfully.",

      course,
    });
  } catch (error) {
    console.error(
      "PUBLISH COURSE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to publish course.",
    });
  }
};

// ======================================================
// DELETE COURSE
// ======================================================

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

    // --------------------------------------------------
    // MIGRATE LEGACY COURSES
    // --------------------------------------------------

    await migrateLegacyCoursesForUser(req);

    // --------------------------------------------------
    // DELETE ONLY FROM USER'S ORGANIZATION
    // --------------------------------------------------

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

    console.log(
      "COURSE DELETED:",
      course._id.toString()
    );

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

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  getCourses,
  getCourseById,
  generateCourseModule,
  createCourse,
  updateCourse,
  deleteCourse,
  publishCourse,
};