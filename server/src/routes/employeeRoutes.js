const express = require("express");

const router = express.Router();

const {
  getEmployees,
  getStudents,
  getTeachers,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

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
// Create User (Employee / Teacher / Student)
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