import { useEffect, useState } from "react";
import {
  FaUsers,
  FaBook,
  FaClipboardCheck,
  FaChartLine,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

import employeeService from "../../services/employeeService";
import assignmentService from "../../services/assignmentService";
import courseService from "../../services/courseService";

function Dashboard() {
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    assignments: 0,
    completed: 0,
    inProgress: 0,
    completionRate: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [employeesRes, coursesRes, assignmentsRes] =
        await Promise.all([
          employeeService.getEmployees(),
          courseService.getCourses(),
          assignmentService.getAssignments(),
        ]);

      const employees = employeesRes.data.employees || [];
      const courses = coursesRes.data.courses || [];
      const assignments = assignmentsRes.data.assignments || [];

      const completed = assignments.filter(
        (a) => a.status === "Completed"
      ).length;

      const inProgress = assignments.filter(
        (a) => a.status === "In Progress"
      ).length;

      const completionRate =
        assignments.length === 0
          ? 0
          : Math.round((completed / assignments.length) * 100);

      setStats({
        students: employees.length,
        courses: courses.length,
        assignments: assignments.length,
        completed,
        inProgress,
        completionRate,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-xl">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div className="bg-gradient-to-r from-[#18D39A] to-[#12B886] rounded-3xl p-8 text-white">

        <h1 className="text-4xl font-bold">
          Teacher Dashboard
        </h1>

        <p className="mt-3 text-lg opacity-90">
          Monitor students, assignments and learning progress.
        </p>

      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        <div className="bg-white rounded-2xl shadow p-6">
          <FaUsers className="text-4xl text-[#18D39A]" />
          <p className="text-gray-500 mt-4">Students</p>
          <h2 className="text-4xl font-bold mt-2">
            {stats.students}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <FaBook className="text-4xl text-blue-500" />
          <p className="text-gray-500 mt-4">Courses</p>
          <h2 className="text-4xl font-bold mt-2">
            {stats.courses}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <FaClipboardCheck className="text-4xl text-orange-500" />
          <p className="text-gray-500 mt-4">
            Assignments
          </p>
          <h2 className="text-4xl font-bold mt-2">
            {stats.assignments}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <FaCheckCircle className="text-4xl text-green-500" />
          <p className="text-gray-500 mt-4">
            Completed
          </p>
          <h2 className="text-4xl font-bold mt-2">
            {stats.completed}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <FaClock className="text-4xl text-yellow-500" />
          <p className="text-gray-500 mt-4">
            In Progress
          </p>
          <h2 className="text-4xl font-bold mt-2">
            {stats.inProgress}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <FaChartLine className="text-4xl text-purple-500" />
          <p className="text-gray-500 mt-4">
            Completion Rate
          </p>
          <h2 className="text-4xl font-bold mt-2">
            {stats.completionRate}%
          </h2>
        </div>

      </div>

      <div className="bg-white rounded-2xl shadow p-8">

        <h2 className="text-2xl font-bold mb-6">
          Course Completion Overview
        </h2>

        <div className="h-5 rounded-full bg-gray-200 overflow-hidden">

          <div
            className="h-full bg-[#18D39A] transition-all duration-700"
            style={{
              width: `${stats.completionRate}%`,
            }}
          />

        </div>

        <p className="mt-4 text-gray-600">
          {stats.completed} of {stats.assignments} assigned
          courses have been completed.
        </p>

      </div>

    </div>
  );
}

export default Dashboard;