import api from "./api";

const getCourses = () => api.get("/courses");

const getCourse = (id) => api.get(`/courses/${id}`);

const createCourse = (data) =>
  api.post("/courses", data);

const updateCourse = (id, data) =>
  api.put(`/courses/${id}`, data);

const publishCourse = (id) =>
  api.patch(`/courses/${id}/publish`);

const deleteCourse = (id) =>
  api.delete(`/courses/${id}`);

export default {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  publishCourse,
  deleteCourse,
};