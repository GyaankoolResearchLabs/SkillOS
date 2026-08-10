import api from "./api";

// =====================================
// Assign One Student
// =====================================

const assignCourse = (data) => {
  return api.post("/assignments", data);
};

// =====================================
// Bulk Assign Students
// =====================================

const bulkAssignCourse = (data) => {
  return api.post("/assignments/bulk", data);
};

// =====================================
// Get All Assignments
// =====================================

const getAssignments = () => {
  return api.get("/assignments");
};

// =====================================
// Get Assignment By ID
// =====================================
// =====================================
// Generate AI Module
// =====================================

const generateModule = (
  courseId,
  moduleId
) => {
  return api.post(
    `/courses/${courseId}/modules/${moduleId}/generate`
  );
};
const getAssignmentById = (id) => {
  return api.get(`/assignments/${id}`);
};

// =====================================
// Complete Lesson
// =====================================

const completeLesson = (
  assignmentId,
  moduleId
) => {
  return api.patch(
    `/assignments/${assignmentId}/module/${moduleId}`
  );
};
// =====================================
// Submit Module Quiz
// =====================================

const submitModuleQuiz = (
  assignmentId,
  moduleId,
  answers
) => {
  return api.post(
    `/assignments/${assignmentId}/module/${moduleId}/quiz`,
    {
      answers,
    }
  );
};

// =====================================
// Submit Final Assessment
// =====================================

const submitFinalAssessment = (
  assignmentId,
  answers
) => {
  return api.post(
    `/assignments/${assignmentId}/final-assessment`,
    {
      answers,
    }
  );
};

// =====================================
// Complete Course
// =====================================

const completeCourse = (id) => {
  return api.patch(`/assignments/${id}/complete`);
};

const assignmentService = {
  assignCourse,
  bulkAssignCourse,
  getAssignments,
  getAssignmentById,
  generateModule,
  completeLesson,
  submitModuleQuiz,
  submitFinalAssessment,
  completeCourse,
};

export default assignmentService;