import api from "./api";

const login = (data) => api.post("/auth/login", data);

const seedUsers = () => api.get("/auth/seed");

export default {
  login,
  seedUsers,
};