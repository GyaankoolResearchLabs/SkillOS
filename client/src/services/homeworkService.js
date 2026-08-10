import api from "./api";

const homeworkService = {
  createHomework(data) {
    return api.post("/homework", data);
  },

  getHomework() {
    return api.get("/homework");
  },

  getHomeworkById(id) {
    return api.get(`/homework/${id}`);
  },

  updateHomework(id, data) {
    return api.put(`/homework/${id}`, data);
  },

  publishHomework(id) {
    return api.patch(`/homework/${id}/publish`);
  },

  deleteHomework(id) {
    return api.delete(`/homework/${id}`);
  },
};

export default homeworkService;