console.log("******** APP.JS LOADED ********");

require("dotenv").config();

console.log(
  "OPENAI KEY LOADED:",
  process.env.OPENAI_API_KEY
    ? `${process.env.OPENAI_API_KEY.slice(0, 7)}...`
    : "NOT FOUND"
);

// ==============================
// Route Imports
// ==============================
const express = require("express");
const cors = require("cors");

const protect = require("./middleware/authMiddleware");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const organizationRoutes = require("./routes/organizationRoutes");
const workflowRoutes = require("./routes/workflowRoutes");
const sopTemplateRoutes = require("./routes/sopTemplateRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const securityRoutes = require("./routes/securityRoutes");
const aiConfigurationRoutes = require("./routes/aiConfigurationRoutes");
const auditLogRoutes = require("./routes/auditLogRoutes");
const aiRoutes = require("./routes/aiRoutes");
const sopRoutes = require("./routes/sopRoutes");
const roleSOPRoutes = require("./routes/roleSOPRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const courseRoutes = require("./routes/courseRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const homeworkRoutes = require("./routes/homeworkRoutes");
const submissionRoutes = require("./routes/submissionRoutes");

// ==============================
// Controllers
// ==============================
const dashboardController = require("./controllers/dashboardController");
const employeeController = require("./controllers/employeeController");

// ==============================
// App Initialization
// ==============================
const app = express();

// ==============================
// Connect Database
// ==============================
connectDB();

// ==============================
// CORS CONFIGURATION
// ==============================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://skillos-lms.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin
      // such as Postman, server-to-server requests, etc.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("CORS BLOCKED:", origin);

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// ==============================
// Body Parser
// ==============================
app.use(express.json());

// ==============================
// Request Logger
// ==============================
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// ==============================
// API ROUTES
// ==============================

// Authentication
app.use("/api/auth", authRoutes);

// Organizations
app.use(
  "/api/organizations",
  organizationRoutes
);

// Workflows
app.use(
  "/api/workflows",
  workflowRoutes
);

// SOP Templates
app.use(
  "/api/sop-templates",
  sopTemplateRoutes
);

// Notifications
app.use(
  "/api/notifications",
  notificationRoutes
);

// Security
app.use(
  "/api/security",
  securityRoutes
);

// AI Configuration
app.use(
  "/api/ai-configuration",
  aiConfigurationRoutes
);

// Audit Logs
app.use(
  "/api/audit-logs",
  auditLogRoutes
);

// ==============================
// AI
// ==============================
app.use("/api/ai", aiRoutes);

// ==============================
// SOP Upload & Generation
// ==============================
app.use("/api/sops", sopRoutes);

// ==============================
// Courses
// ==============================
app.use("/api/courses", courseRoutes);

// ==============================
// Role SOP
// ==============================
app.use(
  "/api/role-sops",
  roleSOPRoutes
);

// ==============================
// Employees
// ==============================

app.patch(
  "/api/employees/sync-existing-onboarding",
  protect,
  employeeController.syncEmployeeOnboarding
);

app.use(
  "/api/employees",
  employeeRoutes
);

app.patch(
  "/api/employees/sync-onboarding",
  protect,
  employeeController.syncEmployeeOnboarding
);

// ==============================
// Dashboard
// ==============================

app.get(
  "/api/dashboard",
  dashboardController.getDashboardStats
);

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

// ==============================
// Assignments
// ==============================
app.use(
  "/api/assignments",
  assignmentRoutes
);

// ==============================
// Homework
// ==============================
app.use(
  "/api/homework",
  homeworkRoutes
);

// ==============================
// Submissions
// ==============================
app.use(
  "/api/submissions",
  submissionRoutes
);

// ==============================
// HEALTH CHECK
// ==============================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SkillOS Backend Running",
    time: new Date().toISOString(),
  });
});

// ==============================
// START SERVER
// ==============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `SkillOS Server running on port ${PORT}`
  );
});