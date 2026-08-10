import { useEffect, useMemo, useState } from "react";
import {
  FaSearch,
  FaUsers,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBuilding,
  FaPlus,
} from "react-icons/fa";

import userService from "../../services/userService";

function Employees() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] = useState("All");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const [employees, students, teachers] = await Promise.all([
        userService.getEmployees(),
        userService.getStudents(),
        userService.getTeachers(),
      ]);

      const allUsers = [
        ...(employees.data.employees || []),
        ...(students.data.students || []),
        ...(teachers.data.teachers || []),
      ];

      setUsers(allUsers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "All" ||
        user.role === roleFilter.toLowerCase();

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  if (loading) {
    return (
      <div className="text-center py-20 text-xl">
        Loading Users...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-4xl font-black text-[#111827]">
            User Management
          </h1>

          <p className="text-gray-500 mt-2">
            Manage Employees, Teachers and Students.
          </p>

        </div>

        <button
          className="bg-[#18D39A] text-white px-6 py-3 rounded-xl flex items-center gap-2"
        >
          <FaPlus />
          Add User
        </button>

      </div>

      {/* Stats */}

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white rounded-2xl p-6 shadow">

          <FaUsers className="text-3xl text-[#18D39A]" />

          <h2 className="mt-3 text-3xl font-bold">
            {users.length}
          </h2>

          <p>Total Users</p>

        </div>

        <div className="bg-white rounded-2xl p-6 shadow">

          <FaUserGraduate className="text-3xl text-blue-500" />

          <h2 className="mt-3 text-3xl font-bold">
            {users.filter(u => u.role === "student").length}
          </h2>

          <p>Students</p>

        </div>

        <div className="bg-white rounded-2xl p-6 shadow">

          <FaChalkboardTeacher className="text-3xl text-purple-500" />

          <h2 className="mt-3 text-3xl font-bold">
            {users.filter(u => u.role === "teacher").length}
          </h2>

          <p>Teachers</p>

        </div>

      </div>

      {/* Search */}

      <div className="bg-white rounded-2xl p-6 shadow">

        <div className="flex gap-4">

          <div className="flex-1 relative">

            <FaSearch className="absolute left-3 top-4 text-gray-400" />

            <input
              placeholder="Search users..."
              className="w-full border rounded-xl pl-10 pr-4 py-3"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <select
            className="border rounded-xl px-4"
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(e.target.value)
            }
          >

            <option>All</option>

            <option>Employee</option>

            <option>Teacher</option>

            <option>Student</option>

          </select>

        </div>

      </div>

      {/* Table */}

      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-50">

            <tr>

              <th className="text-left p-4">Name</th>

              <th>Email</th>

              <th>Role</th>

              <th>Department</th>

              <th></th>

            </tr>

          </thead>

          <tbody>

            {filteredUsers.map((user) => (

              <tr
                key={user._id}
                className="border-t hover:bg-gray-50"
              >

                <td className="p-4 font-semibold">
                  {user.name}
                </td>

                <td>{user.email}</td>

                <td>

                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">

                    {user.role}

                  </span>

                </td>

                <td>
                  {user.department || "-"}
                </td>

                <td className="text-right pr-4">

                  <button className="text-red-500">
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Employees;