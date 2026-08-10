console.log("******** APP.JS LOADED ********");
require("dotenv").config();
console.log(
  "OPENAI KEY LOADED:",
  process.env.OPENAI_API_KEY
    ? `${process.env.OPENAI_API_KEY.slice(0, 7)}...`
    : "NOT FOUND"
);
const homeworkRoutes = require("./routes/homeworkRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const express = require("express");
const cors = require("cors");
const protect = require("./middleware/authMiddleware");
const connectDB = require("./config/db");
const securityRoutes = require("./routes/securityRoutes");
const aiConfigurationRoutes = require("./routes/aiConfigurationRoutes");
const workflowRoutes =
  require("./routes/workflowRoutes");
const sopTemplateRoutes = require("./routes/sopTemplateRoutes");
const notificationRoutes =
  require("./routes/notificationRoutes");
  const auditLogRoutes = require("./routes/auditLogRoutes");
// ==============================
// Route Imports
// ==============================

const authRoutes = require("./routes/authRoutes");
const organizationRoutes = require("./routes/organizationRoutes");
const roleSOPRoutes = require("./routes/roleSOPRoutes");
const aiRoutes = require("./routes/aiRoutes");
const sopRoutes = require("./routes/sopRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const courseRoutes = require("./routes/courseRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");

// ==============================
// Controllers
// ==============================

const dashboardController = require("./controllers/dashboardController");
const employeeController =
  require("./controllers/employeeController");
// ==============================
// App Initialization
// ==============================

const app = express();

// ==============================
// Connect Database
// ==============================

connectDB();

// ==============================
// Middleware
// ==============================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// ==============================
// API Routes
// ==============================

// Authentication
app.use("/api/auth", authRoutes);
app.use(
  "/api/organizations",
  organizationRoutes
);
app.use(
  "/api/workflows",
  workflowRoutes
);
app.use(
  "/api/sop-templates",
  sopTemplateRoutes
);
app.use(
  "/api/notifications",
  notificationRoutes
);
app.use("/api/security", securityRoutes);
app.use(
  "/api/ai-configuration",
  aiConfigurationRoutes
);
app.use("/api/audit-logs", auditLogRoutes);
// AI
app.use("/api/ai", aiRoutes);

// SOP Upload & Generation
app.use("/api/sops", sopRoutes);

// Courses
app.use("/api/courses", courseRoutes);
app.use(
  "/api/role-sops",
  roleSOPRoutes
);
// Employees
app.patch(
  "/api/employees/sync-existing-onboarding",
  protect,
  employeeController.syncEmployeeOnboarding
);
app.use("/api/employees", employeeRoutes);
app.patch(
  "/api/employees/sync-onboarding",
  protect,
  employeeController.syncEmployeeOnboarding
);

// Dashboard
app.get("/api/dashboard", dashboardController.getDashboardStats);
console.log(
  "getDashboardStats:",
  typeof dashboardController.getDashboardStats
);

console.log(
  "getEmployeeDashboard:",
  typeof dashboardController.getEmployeeDashboard
);

console.log(
  "completeInductionItem:",
  typeof dashboardController.completeInductionItem
);
app.get(
  "/api/dashboard/employee",
  protect,
  dashboardController.getEmployeeDashboard
);
app.patch(
  "/api/dashboard/employee/onboarding/induction/:inductionId",
  protect,
  dashboardController.completeInductionItem
);
app.post(
  "/api/dashboard/employee/onboarding/assessment/:inductionId",
  protect,
  dashboardController.submitInductionAssessment
);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/homework", homeworkRoutes);
app.use("/api/submissions", submissionRoutes);
// ==============================
// Health Check
// ==============================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SkillOS Backend Running",
    time: new Date().toISOString(),
  });
});

// ==============================
// Start Server
// ==============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 SkillOS Server running on http://localhost:${PORT}`);
});