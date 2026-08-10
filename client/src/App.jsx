import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// =====================================================
// AUTH
// =====================================================

import Login from "./pages/Login";
import Landing from "./pages/public/Landing";
import Register from "./pages/public/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import PermissionRoute from "./components/PermissionRoute";

// =====================================================
// MANAGER LAYOUT
// =====================================================

import DashboardLayout from "./layouts/DashboardLayout";

// =====================================================
// MANAGER PAGES
// =====================================================

import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";

import UploadSOP from "./pages/manager/UploadSOP";
import ManagerCourses from "./pages/manager/Courses";
import ManagerCourseDetails from "./pages/manager/CourseDetails";
import CourseEditor from "./pages/manager/CourseEditor";

// =====================================================
// ROLE SOP
// =====================================================

import RoleSOP from "./pages/manager/RoleSOP";
import RoleSOPs from "./pages/manager/RoleSOPs";

// =====================================================
// ORGANIZATION
// =====================================================

import OrganizationLayout from "./pages/manager/organization/OrganizationLayout";
import GeneralSettings from "./pages/manager/organization/GeneralSettings";
import Branding from "./pages/manager/organization/Branding";
import Departments from "./pages/manager/organization/Departments";
import Roles from "./pages/manager/organization/Roles";
import Permissions from "./pages/manager/organization/Permissions";
import Workflow from "./pages/manager/organization/Workflow";
import SOPTemplates from "./pages/manager/organization/SOPTemplates";
import AIConfiguration from "./pages/manager/organization/AIConfiguration";
import Compliance from "./pages/manager/organization/Compliance";
import Notifications from "./pages/manager/organization/Notifications";
import Security from "./pages/manager/organization/Security";
import AuditLogs from "./pages/manager/organization/AuditLogs";

// =====================================================
// EMPLOYEE
// =====================================================

import EmployeeLayout from "./layouts/EmployeeLayout";
import EmployeeDashboard from "./pages/employee/Dashboard";
import MyCourses from "./pages/employee/MyCourses";
import CourseLearning from "./pages/employee/CourseLearning";
import Lesson from "./pages/employee/Lesson";
import EmployeeNotifications from "./pages/employee/Notifications";
import FinalAssessment from "./pages/employee/FinalAssessment";
import Progress from "./pages/employee/Progress";
import Quiz from "./pages/employee/Quiz";
import Certificates from "./pages/employee/Certificates";
import ModuleQuiz from "./pages/employee/ModuleQuiz";

// =====================================================
// STUDENT
// =====================================================

import StudentLayout from "./layouts/StudentLayout";
import StudentDashboard from "./pages/student/Dashboard";
import StudentCourses from "./pages/student/MyCourses";
import StudentQuiz from "./pages/student/Quiz";
import StudentCertificates from "./pages/student/Certificates";

// =====================================================
// TEACHER
// =====================================================

import TeacherLayout from "./layouts/TeacherLayout";
import TeacherDashboard from "./pages/teacher/Dashboard";
import TeacherCourses from "./pages/teacher/Courses";
import TeacherCourseDetails from "./pages/teacher/CourseDetails";
import Students from "./pages/teacher/Students";
import Assignments from "./pages/teacher/Assignments";

// =====================================================
// APP
// =====================================================

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =================================================
            LOGIN
        ================================================= */}

        <Route
          path="/login"
          element={<Login />}
        />
        <Route
  path="/register"
  element={<Register />}
/>

        {/* =================================================
            MANAGER
        ================================================= */}

        <Route
          path="/manager"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* -------------------------------------------------
              MANAGER DEFAULT
          ------------------------------------------------- */}

          <Route
            index
            element={
              <Navigate
                to="dashboard"
                replace
              />
            }
          />

          {/* =================================================
              DASHBOARD
          ================================================= */}

          <Route
            path="dashboard"
            element={
              <PermissionRoute permission="dashboard.view">
                <Dashboard />
              </PermissionRoute>
            }
          />

          {/* =================================================
              UPLOAD SOP
          ================================================= */}

          <Route
            path="upload"
            element={
              <PermissionRoute permission="upload.create">
                <UploadSOP />
              </PermissionRoute>
            }
          />

          {/* =================================================
              EMPLOYEES
          ================================================= */}

          <Route
            path="employees"
            element={
              <PermissionRoute permission="employees.view">
                <Employees />
              </PermissionRoute>
            }
          />

          {/* =================================================
              ROLE SOP
          ================================================= */}

          <Route
            path="role-sops"
            element={
              <PermissionRoute permission="sop.view">
                <RoleSOPs />
              </PermissionRoute>
            }
          />

          <Route
            path="role-sops/create"
            element={
              <PermissionRoute permission="sop.create">
                <RoleSOP />
              </PermissionRoute>
            }
          />

          <Route
            path="role-sops/:id"
            element={
              <PermissionRoute permission="sop.view">
                <RoleSOP />
              </PermissionRoute>
            }
          />

          <Route
            path="role-sops/:id/edit"
            element={
              <PermissionRoute permission="sop.edit">
                <RoleSOP />
              </PermissionRoute>
            }
          />

          <Route
            path="role-sops/:id/generate"
            element={
              <PermissionRoute permission="upload.generate">
                <RoleSOP />
              </PermissionRoute>
            }
          />

          {/* =================================================
              COURSES
          ================================================= */}

          <Route
            path="courses"
            element={
              <PermissionRoute permission="courses.view">
                <ManagerCourses />
              </PermissionRoute>
            }
          />

          <Route
            path="course/:id"
            element={
              <PermissionRoute permission="courses.view">
                <ManagerCourseDetails />
              </PermissionRoute>
            }
          />

          <Route
            path="course-editor/:id"
            element={
              <PermissionRoute permission="courses.edit">
                <CourseEditor />
              </PermissionRoute>
            }
          />

          {/* =================================================
              ORGANIZATION
              
              IMPORTANT:
              Do NOT protect this parent route with
              organization.view.

              Otherwise disabling organization.view would
              also disable the Permissions page and the
              manager could lock themselves out.
          ================================================= */}

          <Route
            path="organization"
            element={<OrganizationLayout />}
          >
            {/* -------------------------------------------------
                ORGANIZATION DEFAULT

                Keep the manager inside the organization
                settings area.

                Permissions is protected separately below.
            ------------------------------------------------- */}

            <Route
              index
              element={
                <Navigate
                  to="general"
                  replace
                />
              }
            />

            {/* =================================================
                GENERAL SETTINGS
            ================================================= */}

            <Route
              path="general"
              element={
                <PermissionRoute permission="organization.view">
                  <GeneralSettings />
                </PermissionRoute>
              }
            />

            {/* =================================================
                BRANDING
            ================================================= */}

            <Route
              path="branding"
              element={
                <PermissionRoute permission="organization.branding">
                  <Branding />
                </PermissionRoute>
              }
            />

            {/* =================================================
                DEPARTMENTS
            ================================================= */}

            <Route
              path="departments"
              element={
                <PermissionRoute permission="organization.edit">
                  <Departments />
                </PermissionRoute>
              }
            />

            {/* =================================================
                ORGANIZATION ROLES
            ================================================= */}

            <Route
              path="roles"
              element={
                <PermissionRoute permission="organization.edit">
                  <Roles />
                </PermissionRoute>
              }
            />

            {/* =================================================
                PERMISSIONS
              
                CRITICAL:
                This uses system.permissions and NOT
                organization.view.

                Therefore disabling Organization does NOT
                lock the manager out of Permissions.
            ================================================= */}

            <Route
              path="permissions"
              element={
                <PermissionRoute permission="system.permissions">
                  <Permissions />
                </PermissionRoute>
              }
            />

            {/* =================================================
                WORKFLOW
            ================================================= */}

            <Route
              path="workflow"
              element={
                <PermissionRoute permission="organization.edit">
                  <Workflow />
                </PermissionRoute>
              }
            />

            {/* =================================================
                SOP TEMPLATES
            ================================================= */}

            <Route
              path="templates"
              element={
                <PermissionRoute permission="organization.edit">
                  <SOPTemplates />
                </PermissionRoute>
              }
            />

            {/* =================================================
                AI CONFIGURATION
            ================================================= */}

            <Route
              path="ai"
              element={
                <PermissionRoute permission="organization.edit">
                  <AIConfiguration />
                </PermissionRoute>
              }
            />

            {/* =================================================
                COMPLIANCE
            ================================================= */}

            <Route
              path="compliance"
              element={
                <PermissionRoute permission="organization.edit">
                  <Compliance />
                </PermissionRoute>
              }
            />

            {/* =================================================
                NOTIFICATIONS
            ================================================= */}

            <Route
              path="notifications"
              element={
                <PermissionRoute permission="organization.edit">
                  <Notifications />
                </PermissionRoute>
              }
            />

            {/* =================================================
                SECURITY
            ================================================= */}

            <Route
              path="security"
              element={
                <PermissionRoute permission="organization.edit">
                  <Security />
                </PermissionRoute>
              }
            />

            {/* =================================================
                AUDIT LOGS
            ================================================= */}

            <Route
              path="audit"
              element={
                <PermissionRoute permission="system.audit">
                  <AuditLogs />
                </PermissionRoute>
              }
            />
          </Route>
        </Route>

        {/* =====================================================
            EMPLOYEE
        ===================================================== */}

        <Route
          path="/employee"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <EmployeeLayout />
            </ProtectedRoute>
          }
        >
          {/* Employee default */}

          <Route
            index
            element={
              <Navigate
                to="dashboard"
                replace
              />
            }
          />

          {/* Dashboard */}

          <Route
            path="dashboard"
            element={
              <PermissionRoute permission="dashboard.view">
                <EmployeeDashboard />
              </PermissionRoute>
            }
          />
 <Route
  path="notifications"
  element={<EmployeeNotifications />}
/>
          {/* Courses */}

          <Route
            path="courses"
            element={
              <PermissionRoute permission="courses.view">
                <MyCourses />
              </PermissionRoute>
            }
          />

          <Route
            path="course/:id"
            element={
              <PermissionRoute permission="courses.view">
                <CourseLearning />
              </PermissionRoute>
            }
          />

          <Route
            path="course/:assignmentId/module/:moduleId"
            element={
              <PermissionRoute permission="courses.view">
                <Lesson />
              </PermissionRoute>
            }
          />

          {/* Module Quiz */}

          <Route
            path="quiz/:assignmentId/:moduleId"
            element={
              <PermissionRoute permission="courses.view">
                <ModuleQuiz />
              </PermissionRoute>
            }
          />

          {/* Final Assessment */}

          <Route
            path="final-assessment/:assignmentId"
            element={
              <PermissionRoute permission="courses.view">
                <FinalAssessment />
              </PermissionRoute>
            }
          />

          {/* Progress */}

          <Route
            path="progress"
            element={
              <PermissionRoute permission="courses.view">
                <Progress />
              </PermissionRoute>
            }
          />

          {/* Quiz */}

          <Route
            path="quiz"
            element={
              <PermissionRoute permission="courses.view">
                <Quiz />
              </PermissionRoute>
            }
          />

          {/* Certificates */}

          <Route
            path="certificates"
            element={
              <PermissionRoute permission="courses.view">
                <Certificates />
              </PermissionRoute>
            }
          />
        </Route>

        {/* =====================================================
            STUDENT
        ===================================================== */}

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <Navigate
                to="dashboard"
                replace
              />
            }
          />

          <Route
            path="dashboard"
            element={<StudentDashboard />}
          />

          <Route
            path="courses"
            element={<StudentCourses />}
          />

          <Route
            path="course/:id"
            element={<CourseLearning />}
          />

          <Route
            path="course/:assignmentId/module/:moduleId"
            element={<Lesson />}
          />

          <Route
            path="quiz/:assignmentId/:moduleId"
            element={<ModuleQuiz />}
          />

          <Route
            path="final-assessment/:assignmentId"
            element={<FinalAssessment />}
          />

          <Route
            path="quiz"
            element={<StudentQuiz />}
          />

          <Route
            path="certificates"
            element={<StudentCertificates />}
          />
        </Route>

        {/* =====================================================
            TEACHER
        ===================================================== */}

        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <Navigate
                to="dashboard"
                replace
              />
            }
          />

          <Route
            path="dashboard"
            element={<TeacherDashboard />}
          />

          <Route
            path="courses"
            element={<TeacherCourses />}
          />

          <Route
            path="courses/:id"
            element={<TeacherCourseDetails />}
          />

          <Route
            path="students"
            element={<Students />}
          />

          <Route
            path="assignments"
            element={<Assignments />}
          />
        </Route>

        {/* =====================================================
            ROOT
        ===================================================== */}

       <Route
  path="/"
  element={<Landing />}
/>

        {/* =====================================================
            UNKNOWN ROUTES
        ===================================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;