import api from "./api";

// ==============================
// Get All Employees
// ==============================

const getEmployees = () => {
  return api.get("/employees");
};

// ==============================
// Add Employee
// ==============================

const addEmployee = (data) => {
  return api.post("/employees", data);
};

// ==============================
// Update Employee
// ==============================

const updateEmployee = (id, data) => {
  return api.put(`/employees/${id}`, data);
};

// ==============================
// Delete Employee
// ==============================

const deleteEmployee = (id) => {
  return api.delete(`/employees/${id}`);
};

export default {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
};