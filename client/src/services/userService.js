import api from "./api";

const userService = {
  getEmployees() {
    return api.get("/employees");
  },

  getStudents() {
    return api.get("/employees/students");
  },

  getTeachers() {
    return api.get("/employees/teachers");
  },

  createUser(data) {
    return api.post("/employees", data);
  },

  updateUser(id, data) {
    return api.put(`/employees/${id}`, data);
  },

  deleteUser(id) {
    return api.delete(`/employees/${id}`);
  },
};

export default userService;