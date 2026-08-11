const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  getEmployees,
  getStudents,
  getTeachers,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

const router = express.Router();

// =====================================================
// AUTHENTICATION
// =====================================================
//
// Every employee/user-management request must have
// a valid authenticated user and organization context.
//
// protect attaches:
//   req.user
//   req.organization
//   req.organizationId
//
// =====================================================

router.use(protect);

// =======================================
// Get All Employees
// =======================================

router.get("/", getEmployees);

// =======================================
// Get All Students
// =======================================

router.get("/students", getStudents);

// =======================================
// Get All Teachers
// =======================================

router.get("/teachers", getTeachers);

// =======================================
// Create User
// Employee / Teacher / Student
// =======================================

router.post("/", createEmployee);

// =======================================
// Update User
// =======================================

router.put("/:id", updateEmployee);

// =======================================
// Delete User
// =======================================

router.delete("/:id", deleteEmployee);

module.exports = router;