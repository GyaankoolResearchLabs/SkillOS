import { useEffect, useState } from "react";
import {
  FaAward,
  FaCalendarAlt,
  FaDownload,
  FaGraduationCap,
} from "react-icons/fa";

import assignmentService from "../../services/assignmentService";
import { useAuth } from "../../context/AuthContext";

function Certificates() {
  const { user } = useAuth();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      const res = await assignmentService.getAssignments();

      const completed = (res.data.assignments || []).filter(
        (assignment) =>
          assignment.status === "Completed" &&
          assignment.course
      );

      setAssignments(completed);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = (assignment) => {
    const win = window.open("", "_blank");

    win.document.write(`
      <html>

      <head>

      <title>SkillOS Academic Certificate</title>

      <style>

      *{
        margin:0;
        padding:0;
        box-sizing:border-box;
      }

      body{
        background:#eef2ff;
        display:flex;
        justify-content:center;
        align-items:center;
        height:100vh;
        font-family:Georgia, serif;
      }

      .certificate{

        width:1100px;
        height:760px;

        background:white;

        border:18px solid #2563EB;

        padding:70px;

        position:relative;

        text-align:center;

      }

      .certificate:before{

        content:"";

        position:absolute;

        top:18px;
        left:18px;
        right:18px;
        bottom:18px;

        border:3px solid #818CF8;

      }

      .logo{

        color:#2563EB;

        font-size:46px;

        font-weight:bold;

      }

      .sub{

        margin-top:8px;

        letter-spacing:5px;

        color:#666;

        text-transform:uppercase;

      }

      .title{

        margin-top:45px;

        font-size:54px;

        font-weight:bold;

      }

      .student{

        margin-top:40px;

        font-size:52px;

        color:#2563EB;

        font-weight:bold;

        text-transform:uppercase;

      }

      .course{

        margin-top:35px;

        font-size:38px;

        font-weight:bold;

      }

      .text{

        margin-top:25px;

        font-size:24px;

        color:#555;

        line-height:1.7;

      }

      .footer{

        margin-top:90px;

        display:flex;

        justify-content:space-between;

      }

      .sign{

        width:240px;

        border-top:2px solid #333;

        padding-top:10px;

        font-size:20px;

      }

      </style>

      </head>

      <body>

      <div class="certificate">

        <div class="logo">

          SkillOS Academic

        </div>

        <div class="sub">

          Learning Excellence

        </div>

        <div class="title">

          CERTIFICATE OF ACHIEVEMENT

        </div>

        <div class="text">

          This Certificate is Proudly Awarded To

        </div>

        <div class="student">

          ${user?.name || "Student"}

        </div>

        <div class="text">

          for successfully completing the academic course

        </div>

        <div class="course">

          ${assignment.course?.courseTitle}

        </div>

        <div class="text">

          Completion Date

          <br/><br/>

          ${
            assignment.completedAt
              ? new Date(
                  assignment.completedAt
                ).toLocaleDateString()
              : "-"
          }

        </div>

        <div class="footer">

          <div class="sign">

            Course Instructor

          </div>

          <div class="sign">

            Dean of Academics

          </div>

        </div>

      </div>

      </body>

      </html>
    `);

    win.document.close();

    setTimeout(() => {
      win.print();
    }, 500);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 text-xl">
        Loading Certificates...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          Academic Certificates
        </h1>

        <p className="text-gray-500 mt-2">
          Certificates earned after successfully completing academic subjects.
        </p>

      </div>

      {assignments.length === 0 ? (

        <div className="bg-white rounded-3xl shadow-lg p-16 text-center">

          <FaGraduationCap className="mx-auto text-7xl text-blue-300" />

          <h2 className="text-3xl font-bold mt-8">
            No Certificates Yet
          </h2>

          <p className="text-gray-500 mt-4">
            Complete your academic courses to unlock certificates.
          </p>

        </div>

      ) : (

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

          {assignments.map((assignment) => (

            <div
              key={assignment._id}
              className="bg-white rounded-3xl shadow-lg border border-blue-100 p-8 hover:shadow-xl transition"
            >

              <div className="flex justify-center">

                <FaAward className="text-7xl text-blue-600" />

              </div>

              <h2 className="text-2xl font-bold text-center mt-6">

                {assignment.course?.courseTitle}

              </h2>

              <div className="flex justify-center items-center gap-2 mt-6 text-blue-600 font-semibold">

                <FaGraduationCap />

                Academic Course Completed

              </div>

              <div className="flex justify-center items-center gap-2 mt-4 text-gray-500">

                <FaCalendarAlt />

                {assignment.completedAt
                  ? new Date(
                      assignment.completedAt
                    ).toLocaleDateString()
                  : "-"}

              </div>

              <button
                onClick={() =>
                  downloadCertificate(assignment)
                }
                className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl flex justify-center items-center gap-2"
              >

                <FaDownload />

                Print Certificate

              </button>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Certificates;