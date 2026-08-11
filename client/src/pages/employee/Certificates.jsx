import { useEffect, useState } from "react";
import {
  FaAward,
  FaDownload,
  FaCalendarAlt,
  FaCheckCircle,
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

  // =====================================================
  // LOAD CERTIFICATES
  // =====================================================

  const loadCertificates = async () => {
    try {
      const res =
        await assignmentService.getAssignments();

      const completed =
        (res.data.assignments || []).filter(
          (assignment) =>
            assignment.status === "Completed" &&
            assignment.course
        );

      setAssignments(completed);
    } catch (err) {
      console.error(
        "LOAD CERTIFICATES ERROR:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // DOWNLOAD / PRINT CERTIFICATE
  // =====================================================

  const downloadCertificate = (
    assignment
  ) => {
    const win = window.open(
      "",
      "_blank"
    );

    if (!win) {
      alert(
        "Please allow pop-ups to print your certificate."
      );
      return;
    }

    // =================================================
    // EMPLOYEE NAME
    // =================================================
    //
    // The employee portal already knows the logged-in
    // employee through AuthContext.
    //
    // This prevents the certificate from falling back
    // to "Employee".
    //
    // =================================================

    const employeeName =
      user?.name ||
      assignment.employee?.name ||
      "Employee";

    const courseTitle =
      assignment.course?.courseTitle ||
      "Training Course";

    const completionDate =
      assignment.completedAt
        ? new Date(
            assignment.completedAt
          ).toLocaleDateString()
        : "-";

    win.document.write(`
      <html>

      <head>

        <title>SkillOS Enterprise Certificate</title>

        <style>

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            background: #f3f4f6;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            font-family: Georgia, serif;
          }

          .certificate {

            width: 1100px;
            height: 760px;

            background: white;

            border: 18px solid #18D39A;

            padding: 70px;

            position: relative;

            text-align: center;

          }

          .certificate:before {

            content: "";

            position: absolute;

            top: 18px;
            left: 18px;
            right: 18px;
            bottom: 18px;

            border: 3px solid #D4AF37;

          }

          .logo {

            color: #18D39A;

            font-size: 46px;

            font-weight: bold;

            margin-bottom: 10px;

          }

          .enterprise {

            color: #666;

            letter-spacing: 5px;

            font-size: 14px;

            text-transform: uppercase;

          }

          .title {

            margin-top: 45px;

            font-size: 54px;

            color: #222;

            font-weight: bold;

          }

          .subtitle {

            margin-top: 40px;

            color: #777;

            font-size: 24px;

          }

          .name {

            margin-top: 35px;

            font-size: 54px;

            color: #18D39A;

            font-weight: bold;

            text-transform: uppercase;

          }

          .desc {

            margin-top: 25px;

            font-size: 24px;

            color: #666;

            line-height: 1.7;

          }

          .course {

            margin-top: 35px;

            font-size: 38px;

            color: #222;

            font-weight: bold;

          }

          .date {

            margin-top: 50px;

            font-size: 22px;

            color: #444;

          }

          .footer {

            margin-top: 90px;

            display: flex;

            justify-content: space-between;

          }

          .signature {

            width: 240px;

            border-top: 2px solid #444;

            padding-top: 12px;

            font-size: 20px;

          }

        </style>

      </head>

      <body>

        <div class="certificate">

          <div class="logo">
            SkillOS Enterprise
          </div>

          <div class="enterprise">
            Corporate Learning Platform
          </div>

          <div class="title">
            CERTIFICATE OF COMPLETION
          </div>

          <div class="subtitle">
            This Certificate is Proudly Presented To
          </div>

          <div class="name">
            ${employeeName}
          </div>

          <div class="desc">
            for successfully completing the mandatory corporate learning programme
          </div>

          <div class="course">
            ${courseTitle}
          </div>

          <div class="date">

            Completion Date

            <br />
            <br />

            ${completionDate}

          </div>

          <div class="footer">

            <div class="signature">
              Training Manager
            </div>

            <div class="signature">
              SkillOS Enterprise
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

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="text-gray-500">
          Loading Certificates...
        </p>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="space-y-8">

      {/* =================================================
          HEADER
      ================================================= */}

      <div>

        <h1 className="text-4xl font-bold">
          Enterprise Certificates
        </h1>

        <p className="text-gray-500 mt-2">
          Professional certificates earned after
          completing corporate training.
        </p>

      </div>

      {/* =================================================
          NO CERTIFICATES
      ================================================= */}

      {assignments.length === 0 ? (

        <div className="bg-white rounded-3xl shadow p-16 text-center">

          <FaAward className="mx-auto text-7xl text-gray-300" />

          <h2 className="text-3xl font-bold mt-8">
            No Certificates Yet
          </h2>

          <p className="text-gray-500 mt-4">
            Complete your assigned training to
            unlock certificates.
          </p>

        </div>

      ) : (

        /* =================================================
           CERTIFICATE LIST
        ================================================= */

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

          {assignments.map(
            (assignment) => (

              <div
                key={assignment._id}
                className="bg-white rounded-3xl shadow-lg p-8 border border-green-100 hover:shadow-xl transition"
              >

                {/* Award */}

                <div className="flex justify-center">

                  <FaAward className="text-7xl text-[#18D39A]" />

                </div>

                {/* Course */}

                <h2 className="text-2xl font-bold text-center mt-6">

                  {assignment.course?.courseTitle}

                </h2>

                {/* Completion */}

                <div className="flex items-center justify-center gap-2 mt-6 text-green-600 font-semibold">

                  <FaCheckCircle />

                  Corporate Training Completed

                </div>

                {/* Date */}

                <div className="flex items-center justify-center gap-2 mt-4 text-gray-500">

                  <FaCalendarAlt />

                  {assignment.completedAt
                    ? new Date(
                        assignment.completedAt
                      ).toLocaleDateString()
                    : "-"}

                </div>

                {/* Print */}

                <button
                  onClick={() =>
                    downloadCertificate(
                      assignment
                    )
                  }
                  className="w-full mt-8 bg-[#18D39A] hover:bg-[#14b67c] text-white py-3 rounded-xl flex justify-center items-center gap-2"
                >

                  <FaDownload />

                  Print Certificate

                </button>

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
}

export default Certificates;