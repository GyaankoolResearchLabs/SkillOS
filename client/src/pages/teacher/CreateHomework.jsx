import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import homeworkService from "../../services/homeworkService";
import api from "../../services/api";

function CreateHomework() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    instructions: "",
    course: "",
    dueDate: "",
    totalMarks: 100,
    passingMarks: 40,
    allowLateSubmission: false,
    students: [],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [courseRes, studentRes] = await Promise.all([
        api.get("/courses"),
        api.get("/students"),
      ]);

      setCourses(courseRes.data.courses || []);
      setStudents(studentRes.data.students || []);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStudent = (id) => {
    if (form.students.includes(id)) {
      setForm({
        ...form,
        students: form.students.filter((s) => s !== id),
      });
    } else {
      setForm({
        ...form,
        students: [...form.students, id],
      });
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      await homeworkService.createHomework(form);

      alert("Homework created successfully.");

      navigate("/teacher/homework");

    } catch (err) {

      console.error(err);

      alert(
        err.response?.data?.message ||
        "Unable to create homework."
      );

    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8">

      <h1 className="text-4xl font-bold mb-8">
        Create Homework
      </h1>

      <form
        onSubmit={submit}
        className="space-y-8 bg-white rounded-3xl shadow p-8"
      >

        <input
          className="w-full border rounded-xl p-3"
          placeholder="Homework Title"
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value,
            })
          }
        />

        <textarea
          className="w-full border rounded-xl p-3"
          rows={4}
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
        />

        <textarea
          className="w-full border rounded-xl p-3"
          rows={6}
          placeholder="Instructions"
          value={form.instructions}
          onChange={(e) =>
            setForm({
              ...form,
              instructions: e.target.value,
            })
          }
        />

        <select
          className="w-full border rounded-xl p-3"
          value={form.course}
          onChange={(e) =>
            setForm({
              ...form,
              course: e.target.value,
            })
          }
        >
          <option value="">
            Select Course
          </option>

          {courses.map((course) => (
            <option
              key={course._id}
              value={course._id}
            >
              {course.courseTitle}
            </option>
          ))}
        </select>

        <div>

          <h2 className="font-bold mb-4">
            Assign Students
          </h2>

          <div className="grid md:grid-cols-2 gap-3">

            {students.map((student) => (

              <label
                key={student._id}
                className="border rounded-xl p-3 flex items-center gap-3 cursor-pointer"
              >

                <input
                  type="checkbox"
                  checked={form.students.includes(student._id)}
                  onChange={() =>
                    toggleStudent(student._id)
                  }
                />

                {student.name}

              </label>

            ))}

          </div>

        </div>

        <input
          type="date"
          className="w-full border rounded-xl p-3"
          value={form.dueDate}
          onChange={(e) =>
            setForm({
              ...form,
              dueDate: e.target.value,
            })
          }
        />

        <div className="grid grid-cols-2 gap-4">

          <input
            type="number"
            className="border rounded-xl p-3"
            placeholder="Total Marks"
            value={form.totalMarks}
            onChange={(e) =>
              setForm({
                ...form,
                totalMarks: e.target.value,
              })
            }
          />

          <input
            type="number"
            className="border rounded-xl p-3"
            placeholder="Passing Marks"
            value={form.passingMarks}
            onChange={(e) =>
              setForm({
                ...form,
                passingMarks: e.target.value,
              })
            }
          />

        </div>

        <label className="flex gap-3 items-center">

          <input
            type="checkbox"
            checked={form.allowLateSubmission}
            onChange={(e) =>
              setForm({
                ...form,
                allowLateSubmission:
                  e.target.checked,
              })
            }
          />

          Allow Late Submission

        </label>

        <button
          className="bg-[#18D39A] text-white px-8 py-3 rounded-xl hover:bg-[#14b67c]"
        >
          Create Homework
        </button>

      </form>

    </div>
  );
}

export default CreateHomework;