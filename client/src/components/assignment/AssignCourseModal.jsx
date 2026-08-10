import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import employeeService from "../../services/employeeService";
import assignmentService from "../../services/assignmentService";

function AssignCourseModal({
  open,
  course,
  onClose,
  onAssigned,
}) {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadEmployees();
      setSelectedEmployee("");
    }
  }, [open]);

  const loadEmployees = async () => {
    try {
      const res = await employeeService.getEmployees();
      setEmployees(res.data.employees || []);
    } catch (err) {
      console.error(err);
      toast.error("Unable to load employees.");
    }
  };

  const handleAssign = async () => {
    if (!selectedEmployee) {
      toast.error("Please select an employee.");
      return;
    }

    try {
      setLoading(true);

      console.log({
        employeeId: selectedEmployee,
        courseId: course._id,
      });

      await assignmentService.assignCourse({
        employeeId: selectedEmployee,
        courseId: course._id,
      });

      toast.success("Course assigned successfully.");

      if (onAssigned) {
        onAssigned();
      }

      onClose();

    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
        "Unable to assign course."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open || !course) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-[520px] p-8 shadow-xl">

        <h2 className="text-3xl font-bold">
          Assign Course
        </h2>

        <p className="text-gray-500 mt-2">
          {course.courseTitle}
        </p>

        <div className="mt-8">

          <label className="block font-semibold mb-2">
            Employee
          </label>

          <select
            className="w-full border rounded-xl p-3"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="">
              Select Employee
            </option>

            {employees.map((emp) => (
              <option
                key={emp._id}
                value={emp._id}
              >
                {emp.name} ({emp.email})
              </option>
            ))}

          </select>

        </div>

        <div className="flex justify-end gap-4 mt-8">

          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-3 border rounded-xl"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={handleAssign}
            className="px-6 py-3 rounded-xl bg-[#18D39A] text-white hover:bg-[#14b67c]"
          >
            {loading ? "Assigning..." : "Assign Course"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default AssignCourseModal;