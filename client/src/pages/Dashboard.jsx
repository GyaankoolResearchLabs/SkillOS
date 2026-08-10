import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBookOpen,
  FaUsers,
  FaClipboardCheck,
  FaClock,
  FaUpload,
  FaUserPlus,
  FaArrowRight,
  FaChartLine,
} from "react-icons/fa";

import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // LOAD MANAGER DASHBOARD DATA
  // =====================================================

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [
        coursesResponse,
        employeesResponse,
        assignmentsResponse,
      ] = await Promise.all([
        api.get("/courses"),
        api.get("/employees"),
        api.get("/assignments"),
      ]);

      console.log(
        "MANAGER COURSES:",
        coursesResponse?.data
      );

      console.log(
        "MANAGER EMPLOYEES:",
        employeesResponse?.data
      );

      console.log(
        "MANAGER ASSIGNMENTS:",
        assignmentsResponse?.data
      );

      const coursesData =
        coursesResponse?.data?.courses ||
        coursesResponse?.data ||
        [];

      const employeesData =
        employeesResponse?.data?.employees ||
        employeesResponse?.data ||
        [];

      const assignmentsData =
        assignmentsResponse?.data?.assignments ||
        assignmentsResponse?.data ||
        [];

      setCourses(
        Array.isArray(coursesData)
          ? coursesData
          : []
      );

      setEmployees(
        Array.isArray(employeesData)
          ? employeesData
          : []
      );

      setAssignments(
        Array.isArray(assignmentsData)
          ? assignmentsData
          : []
      );
    } catch (error) {
      console.error(
        "MANAGER DASHBOARD ERROR:",
        error
      );

      setCourses([]);
      setEmployees([]);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RECENT COURSES
  // =====================================================

  const recentCourses = useMemo(() => {
    return [...courses]
      .sort((a, b) => {
        const dateA = new Date(
          a?.createdAt || 0
        ).getTime();

        const dateB = new Date(
          b?.createdAt || 0
        ).getTime();

        return dateB - dateA;
      })
      .slice(0, 5);
  }, [courses]);

  // =====================================================
  // LEARNING TIME
  // =====================================================

  const learningTime = useMemo(() => {
    return courses.reduce(
      (total, course) => {
        const duration =
          Number(
            course?.estimatedDuration
          ) || 0;

        return total + duration;
      },
      0
    );
  }, [courses]);

  // =====================================================
  // STATS
  // =====================================================

  const stats = {
    courses: courses.length,
    employees: employees.length,
    assignments: assignments.length,
    learningTime,
  };

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "Recently";
    }

    try {
      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "Recently";
    }
  };

  // =====================================================
  // COURSE DURATION
  // =====================================================

  const getDuration = (course) => {
    if (
      course?.estimatedDuration !==
        undefined &&
      course?.estimatedDuration !==
        null &&
      course?.estimatedDuration !== ""
    ) {
      return `${course.estimatedDuration} mins`;
    }

    return "Duration not set";
  };

  // =====================================================
  // MODULE COUNT
  // =====================================================

  const getModuleCount = (course) => {
    if (
      Array.isArray(course?.modules)
    ) {
      return course.modules.length;
    }

    return Number(
      course?.moduleCount || 0
    );
  };

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <div className="w-full min-w-0 space-y-8">

        <div>
          <div className="
            h-4
            w-40
            rounded
            bg-gray-200
            animate-pulse
          " />

          <div className="
            h-10
            w-64
            rounded-lg
            bg-gray-200
            mt-3
            animate-pulse
          " />

          <div className="
            h-4
            w-full
            max-w-xl
            rounded
            bg-gray-200
            mt-3
            animate-pulse
          " />
        </div>

        <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4
          gap-5
        ">
          {[1, 2, 3, 4].map(
            (item) => (
              <div
                key={item}
                className="
                  bg-white
                  rounded-2xl
                  border
                  border-gray-100
                  p-6
                  shadow-sm
                "
              >
                <div className="
                  h-12
                  w-12
                  rounded-xl
                  bg-gray-200
                  animate-pulse
                " />

                <div className="
                  h-4
                  w-24
                  rounded
                  bg-gray-200
                  mt-5
                  animate-pulse
                " />

                <div className="
                  h-8
                  w-16
                  rounded
                  bg-gray-200
                  mt-3
                  animate-pulse
                " />
              </div>
            )
          )}
        </div>

      </div>
    );
  }

  // =====================================================
  // MANAGER DASHBOARD
  // =====================================================

  return (
    <div className="
      w-full
      min-w-0
      space-y-8
    ">

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="
        flex
        flex-col
        lg:flex-row
        lg:items-end
        lg:justify-between
        gap-6
      ">

        <div className="min-w-0">

          <p className="
            text-sm
            font-bold
            uppercase
            tracking-[2px]
            text-[#18D39A]
          ">
            Manager Dashboard
          </p>

          <h1 className="
            text-4xl
            md:text-5xl
            font-black
            text-[#07152B]
            mt-2
          ">
            Dashboard
          </h1>

          <p className="
            text-gray-500
            mt-3
            max-w-2xl
          ">
            Monitor learning courses, employees
            and AI-generated SOP training from
            one centralized dashboard.
          </p>

        </div>

        <div className="
          flex
          flex-wrap
          items-center
          gap-3
        ">

          {/* Upload SOP */}

          <button
            type="button"
            onClick={() =>
              navigate("/manager/upload")
            }
            className="
              group
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-[#18D39A]
              px-5
              py-3
              font-bold
              text-white
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-[#14B67C]
              hover:shadow-lg
            "
          >
            <FaUpload className="
              transition-transform
              duration-300
              group-hover:-translate-y-0.5
            " />

            Upload SOP
          </button>

          {/* Add Employee */}

          <button
            type="button"
            onClick={() =>
              navigate("/manager/employees")
            }
            className="
              group
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-gray-200
              bg-white
              px-5
              py-3
              font-bold
              text-gray-700
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:border-[#18D39A]
              hover:text-[#11996D]
              hover:shadow-lg
            "
          >
            <FaUserPlus className="
              transition-transform
              duration-300
              group-hover:scale-110
            " />

            Add Employee
          </button>

        </div>

      </section>

      {/* =================================================
          STAT CARDS
      ================================================= */}

      <section className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-4
        gap-5
      ">

        {/* =================================================
            COURSES
        ================================================= */}

        <div className="
          group
          bg-white
          rounded-2xl
          border
          border-gray-100
          shadow-sm
          p-6
          transition-all
          duration-300
          ease-out
          hover:-translate-y-1
          hover:border-emerald-100
          hover:shadow-xl
        ">

          <div className="
            flex
            items-start
            justify-between
          ">

            <div>

              <p className="
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-gray-400
                transition-colors
                duration-300
                group-hover:text-[#18D39A]
              ">
                Courses
              </p>

              <p className="
                text-3xl
                font-black
                text-[#07152B]
                mt-2
              ">
                {stats.courses}
              </p>

              <p className="
                text-sm
                text-gray-500
                mt-1
              ">
                AI Generated Courses
              </p>

            </div>

            <div className="
              w-12
              h-12
              rounded-xl
              bg-emerald-50
              flex
              items-center
              justify-center
              transition-all
              duration-300
              group-hover:scale-110
              group-hover:rotate-3
              group-hover:bg-[#18D39A]
            ">
              <FaBookOpen className="
                text-xl
                text-[#18D39A]
                transition-colors
                duration-300
                group-hover:text-white
              " />
            </div>

          </div>

        </div>

        {/* =================================================
            EMPLOYEES
        ================================================= */}

        <div className="
          group
          bg-white
          rounded-2xl
          border
          border-gray-100
          shadow-sm
          p-6
          transition-all
          duration-300
          ease-out
          hover:-translate-y-1
          hover:border-blue-100
          hover:shadow-xl
        ">

          <div className="
            flex
            items-start
            justify-between
          ">

            <div>

              <p className="
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-gray-400
                transition-colors
                duration-300
                group-hover:text-blue-500
              ">
                Employees
              </p>

              <p className="
                text-3xl
                font-black
                text-[#07152B]
                mt-2
              ">
                {stats.employees}
              </p>

              <p className="
                text-sm
                text-gray-500
                mt-1
              ">
                Registered Employees
              </p>

            </div>

            <div className="
              w-12
              h-12
              rounded-xl
              bg-blue-50
              flex
              items-center
              justify-center
              transition-all
              duration-300
              group-hover:scale-110
              group-hover:rotate-3
              group-hover:bg-blue-500
            ">
              <FaUsers className="
                text-xl
                text-blue-500
                transition-colors
                duration-300
                group-hover:text-white
              " />
            </div>

          </div>

        </div>

        {/* =================================================
            ASSIGNMENTS
        ================================================= */}

        <div className="
          group
          bg-white
          rounded-2xl
          border
          border-gray-100
          shadow-sm
          p-6
          transition-all
          duration-300
          ease-out
          hover:-translate-y-1
          hover:border-amber-100
          hover:shadow-xl
        ">

          <div className="
            flex
            items-start
            justify-between
          ">

            <div>

              <p className="
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-gray-400
                transition-colors
                duration-300
                group-hover:text-amber-500
              ">
                Assignments
              </p>

              <p className="
                text-3xl
                font-black
                text-[#07152B]
                mt-2
              ">
                {stats.assignments}
              </p>

              <p className="
                text-sm
                text-gray-500
                mt-1
              ">
                Assigned Courses
              </p>

            </div>

            <div className="
              w-12
              h-12
              rounded-xl
              bg-amber-50
              flex
              items-center
              justify-center
              transition-all
              duration-300
              group-hover:scale-110
              group-hover:rotate-3
              group-hover:bg-amber-500
            ">
              <FaClipboardCheck className="
                text-xl
                text-amber-500
                transition-colors
                duration-300
                group-hover:text-white
              " />
            </div>

          </div>

        </div>

        {/* =================================================
            LEARNING TIME
        ================================================= */}

        <div className="
          group
          bg-white
          rounded-2xl
          border
          border-gray-100
          shadow-sm
          p-6
          transition-all
          duration-300
          ease-out
          hover:-translate-y-1
          hover:border-purple-100
          hover:shadow-xl
        ">

          <div className="
            flex
            items-start
            justify-between
          ">

            <div>

              <p className="
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-gray-400
                transition-colors
                duration-300
                group-hover:text-purple-500
              ">
                Learning Time
              </p>

              <p className="
                text-3xl
                font-black
                text-[#07152B]
                mt-2
              ">
                {stats.learningTime}

                <span className="
                  text-base
                  font-semibold
                  text-gray-400
                  ml-1
                ">
                  mins
                </span>
              </p>

              <p className="
                text-sm
                text-gray-500
                mt-1
              ">
                Training Duration
              </p>

            </div>

            <div className="
              w-12
              h-12
              rounded-xl
              bg-purple-50
              flex
              items-center
              justify-center
              transition-all
              duration-300
              group-hover:scale-110
              group-hover:rotate-3
              group-hover:bg-purple-500
            ">
              <FaClock className="
                text-xl
                text-purple-500
                transition-colors
                duration-300
                group-hover:text-white
              " />
            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <section className="
        grid
        grid-cols-1
        xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]
        gap-6
      ">

        {/* =================================================
            RECENT COURSES
        ================================================= */}

        <div className="
          bg-white
          rounded-2xl
          border
          border-gray-100
          shadow-sm
          overflow-hidden
          min-w-0
          transition-shadow
          duration-300
          hover:shadow-lg
        ">

          <div className="
            p-6
            md:p-7
            border-b
            border-gray-100
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-4
          ">

            <div>

              <h2 className="
                text-xl
                font-black
                text-[#07152B]
              ">
                Recent Courses
              </h2>

              <p className="
                text-sm
                text-gray-500
                mt-1
              ">
                AI Generated Learning Courses
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/manager/courses")
              }
              className="
                group
                inline-flex
                items-center
                gap-2
                text-sm
                font-bold
                text-[#18D39A]
                transition-colors
                duration-200
                hover:text-[#11996D]
              "
            >
              View All

              <FaArrowRight className="
                transition-transform
                duration-300
                group-hover:translate-x-1.5
              " />
            </button>

          </div>

          {recentCourses.length === 0 ? (

            <div className="
              p-12
              text-center
            ">

              <div className="
                w-14
                h-14
                rounded-2xl
                bg-gray-50
                flex
                items-center
                justify-center
                mx-auto
                transition-all
                duration-300
                hover:scale-110
              ">
                <FaBookOpen className="
                  text-xl
                  text-gray-300
                " />
              </div>

              <h3 className="
                mt-4
                font-bold
                text-gray-800
              ">
                No courses yet
              </h3>

              <p className="
                text-sm
                text-gray-500
                mt-1
              ">
                Upload an SOP to generate your
                first learning course.
              </p>

            </div>

          ) : (

            <div className="
              divide-y
              divide-gray-100
            ">

              {recentCourses.map(
                (course) => (

                  <div
                    key={course._id}
                    onClick={() =>
                      navigate(
                        `/manager/course/${course._id}`
                      )
                    }
                    className="
                      group
                      p-6
                      md:p-7
                      cursor-pointer
                      transition-all
                      duration-300
                      hover:bg-gray-50
                    "
                  >

                    <div className="
                      flex
                      flex-col
                      lg:flex-row
                      lg:items-center
                      gap-5
                    ">

                      {/* COURSE ICON */}

                      <div className="
                        w-14
                        h-14
                        rounded-2xl
                        bg-emerald-50
                        flex
                        items-center
                        justify-center
                        flex-shrink-0
                        transition-all
                        duration-300
                        group-hover:scale-110
                        group-hover:bg-[#18D39A]
                      ">
                        <FaBookOpen className="
                          text-xl
                          text-[#18D39A]
                          transition-colors
                          duration-300
                          group-hover:text-white
                        " />
                      </div>

                      {/* COURSE INFORMATION */}

                      <div className="
                        flex-1
                        min-w-0
                      ">

                        <div className="
                          flex
                          flex-wrap
                          items-center
                          gap-2
                        ">

                          <span className="
                            inline-flex
                            px-2.5
                            py-1
                            rounded-full
                            bg-emerald-50
                            text-[#11996D]
                            text-[10px]
                            font-black
                            uppercase
                            tracking-wider
                            transition-colors
                            duration-300
                            group-hover:bg-[#18D39A]
                            group-hover:text-white
                          ">
                            AI Generated Course
                          </span>

                          <span className="
                            inline-flex
                            px-2.5
                            py-1
                            rounded-full
                            bg-green-50
                            text-green-700
                            text-[10px]
                            font-bold
                          ">
                            Generated
                          </span>

                        </div>

                        <h3 className="
                          text-lg
                          font-black
                          text-[#07152B]
                          mt-2
                          break-words
                          transition-colors
                          duration-200
                          group-hover:text-[#11996D]
                        ">
                          {course.courseTitle ||
                            course.title ||
                            "Untitled Course"}
                        </h3>

                        <p className="
                          text-sm
                          text-gray-500
                          mt-1
                          line-clamp-2
                        ">
                          {course.description ||
                            "AI-generated learning course created from an uploaded SOP document."}
                        </p>

                        <div className="
                          flex
                          flex-wrap
                          gap-x-5
                          gap-y-2
                          mt-4
                          text-xs
                          text-gray-500
                        ">

                          <span>
                            Duration:{" "}
                            <strong className="text-gray-700">
                              {getDuration(course)}
                            </strong>
                          </span>

                          <span>
                            Modules:{" "}
                            <strong className="text-gray-700">
                              {getModuleCount(course)}
                            </strong>
                          </span>

                          <span>
                            Created:{" "}
                            <strong className="text-gray-700">
                              {formatDate(
                                course.createdAt
                              )}
                            </strong>
                          </span>

                        </div>

                      </div>

                      {/* VIEW BUTTON */}

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();

                          navigate(
                            `/manager/course/${course._id}`
                          );
                        }}
                        className="
                          group/button
                          inline-flex
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          border
                          border-gray-200
                          bg-white
                          px-4
                          py-2.5
                          text-sm
                          font-bold
                          text-gray-700
                          transition-all
                          duration-300
                          hover:border-[#18D39A]
                          hover:bg-[#18D39A]
                          hover:text-white
                          hover:shadow-md
                          flex-shrink-0
                        "
                      >
                        View Course

                        <FaArrowRight className="
                          text-xs
                          transition-transform
                          duration-300
                          group-hover/button:translate-x-1
                        " />
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

        {/* =================================================
            RECENT ACTIVITY
        ================================================= */}

        <div className="
          bg-white
          rounded-2xl
          border
          border-gray-100
          shadow-sm
          overflow-hidden
          transition-shadow
          duration-300
          hover:shadow-lg
        ">

          <div className="
            p-6
            md:p-7
            border-b
            border-gray-100
          ">

            <div className="
              flex
              items-center
              justify-between
              gap-3
            ">

              <div>

                <h2 className="
                  text-xl
                  font-black
                  text-[#07152B]
                ">
                  Recent Activity
                </h2>

                <p className="
                  text-sm
                  text-gray-500
                  mt-1
                ">
                  Latest updates across SkillOS
                </p>

              </div>

              <div className="
                w-10
                h-10
                rounded-xl
                bg-blue-50
                flex
                items-center
                justify-center
                transition-all
                duration-300
                hover:scale-110
                hover:bg-blue-500
                group
              ">
                <FaChartLine className="
                  text-blue-500
                  transition-colors
                  duration-300
                  group-hover:text-white
                " />
              </div>

            </div>

          </div>

          <div className="p-6">

            <div className="space-y-2">

              {/* SOP */}

              <div className="
                group
                flex
                items-start
                gap-4
                rounded-xl
                p-3
                transition-all
                duration-300
                hover:bg-blue-50
                hover:translate-x-1
              ">

                <div className="
                  w-10
                  h-10
                  rounded-xl
                  bg-blue-50
                  flex
                  items-center
                  justify-center
                  flex-shrink-0
                  transition-all
                  duration-300
                  group-hover:bg-blue-500
                  group-hover:scale-105
                ">
                  <FaUpload className="
                    text-blue-500
                    transition-colors
                    duration-300
                    group-hover:text-white
                  " />
                </div>

                <div className="min-w-0">

                  <p className="
                    font-bold
                    text-gray-900
                  ">
                    SOP & Courses
                  </p>

                  <p className="
                    text-sm
                    text-gray-500
                    mt-1
                  ">
                    {courses.length} course
                    {courses.length === 1
                      ? ""
                      : "s"} available
                    from uploaded SOPs.
                  </p>

                </div>

              </div>

              {/* EMPLOYEES */}

              <div className="
                group
                flex
                items-start
                gap-4
                rounded-xl
                p-3
                transition-all
                duration-300
                hover:bg-emerald-50
                hover:translate-x-1
              ">

                <div className="
                  w-10
                  h-10
                  rounded-xl
                  bg-emerald-50
                  flex
                  items-center
                  justify-center
                  flex-shrink-0
                  transition-all
                  duration-300
                  group-hover:bg-[#18D39A]
                  group-hover:scale-105
                ">
                  <FaUsers className="
                    text-[#18D39A]
                    transition-colors
                    duration-300
                    group-hover:text-white
                  " />
                </div>

                <div className="min-w-0">

                  <p className="
                    font-bold
                    text-gray-900
                  ">
                    Employees
                  </p>

                  <p className="
                    text-sm
                    text-gray-500
                    mt-1
                  ">
                    {employees.length} registered
                    employee
                    {employees.length === 1
                      ? ""
                      : "s"}.
                  </p>

                </div>

              </div>

              {/* ASSIGNMENTS */}

              <div className="
                group
                flex
                items-start
                gap-4
                rounded-xl
                p-3
                transition-all
                duration-300
                hover:bg-amber-50
                hover:translate-x-1
              ">

                <div className="
                  w-10
                  h-10
                  rounded-xl
                  bg-amber-50
                  flex
                  items-center
                  justify-center
                  flex-shrink-0
                  transition-all
                  duration-300
                  group-hover:bg-amber-500
                  group-hover:scale-105
                ">
                  <FaClipboardCheck className="
                    text-amber-500
                    transition-colors
                    duration-300
                    group-hover:text-white
                  " />
                </div>

                <div className="min-w-0">

                  <p className="
                    font-bold
                    text-gray-900
                  ">
                    Course Assignments
                  </p>

                  <p className="
                    text-sm
                    text-gray-500
                    mt-1
                  ">
                    {assignments.length} active
                    assignment
                    {assignments.length === 1
                      ? ""
                      : "s"}.
                  </p>

                </div>

              </div>

              {/* LEARNING TIME */}

              <div className="
                group
                flex
                items-start
                gap-4
                rounded-xl
                p-3
                transition-all
                duration-300
                hover:bg-purple-50
                hover:translate-x-1
              ">

                <div className="
                  w-10
                  h-10
                  rounded-xl
                  bg-purple-50
                  flex
                  items-center
                  justify-center
                  flex-shrink-0
                  transition-all
                  duration-300
                  group-hover:bg-purple-500
                  group-hover:scale-105
                ">
                  <FaClock className="
                    text-purple-500
                    transition-colors
                    duration-300
                    group-hover:text-white
                  " />
                </div>

                <div className="min-w-0">

                  <p className="
                    font-bold
                    text-gray-900
                  ">
                    Learning Time
                  </p>

                  <p className="
                    text-sm
                    text-gray-500
                    mt-1
                  ">
                    {learningTime} minutes of
                    course duration currently
                    available.
                  </p>

                </div>

              </div>

            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/manager/courses")
              }
              className="
                group
                mt-6
                w-full
                rounded-xl
                border
                border-gray-200
                py-3
                text-sm
                font-bold
                text-gray-700
                transition-all
                duration-300
                hover:border-[#18D39A]
                hover:bg-[#18D39A]
                hover:text-white
                hover:shadow-md
              "
            >
              <span>
                View All Courses
              </span>

              <FaArrowRight className="
                inline-block
                ml-2
                text-xs
                transition-transform
                duration-300
                group-hover:translate-x-1
              " />
            </button>

          </div>

        </div>

      </section>

      {/* =================================================
          QUICK ACTIONS
      ================================================= */}

      <section className="
        grid
        grid-cols-1
        md:grid-cols-3
        gap-5
      ">

        {/* UPLOAD SOP */}

        <button
          type="button"
          onClick={() =>
            navigate("/manager/upload")
          }
          className="
            group
            relative
            overflow-hidden
            text-left
            bg-[#07152B]
            rounded-2xl
            p-6
            text-white
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-2xl
          "
        >

          <div className="
            absolute
            -right-10
            -top-10
            w-32
            h-32
            rounded-full
            bg-[#18D39A]/10
            transition-transform
            duration-500
            group-hover:scale-150
          " />

          <div className="
            relative
            w-11
            h-11
            rounded-xl
            bg-white/10
            flex
            items-center
            justify-center
            transition-all
            duration-300
            group-hover:bg-[#18D39A]
            group-hover:scale-110
          ">
            <FaUpload className="
              transition-transform
              duration-300
              group-hover:-translate-y-0.5
            " />
          </div>

          <h3 className="
            relative
            text-lg
            font-black
            mt-5
          ">
            Upload SOP
          </h3>

          <p className="
            relative
            text-sm
            text-slate-300
            mt-2
          ">
            Generate AI-powered learning
            courses from SOP documents.
          </p>

          <div className="
            relative
            mt-5
            flex
            items-center
            gap-2
            text-sm
            font-bold
            text-[#18D39A]
          ">
            Get Started

            <FaArrowRight className="
              transition-transform
              duration-300
              group-hover:translate-x-2
            " />
          </div>

        </button>

        {/* MANAGE EMPLOYEES */}

        <button
          type="button"
          onClick={() =>
            navigate("/manager/employees")
          }
          className="
            group
            relative
            overflow-hidden
            text-left
            bg-white
            rounded-2xl
            border
            border-gray-100
            shadow-sm
            p-6
            transition-all
            duration-300
            hover:-translate-y-1
            hover:border-blue-100
            hover:shadow-xl
          "
        >

          <div className="
            absolute
            -right-10
            -top-10
            w-32
            h-32
            rounded-full
            bg-blue-50
            opacity-0
            transition-all
            duration-500
            group-hover:opacity-100
            group-hover:scale-150
          " />

          <div className="
            relative
            w-11
            h-11
            rounded-xl
            bg-blue-50
            flex
            items-center
            justify-center
            transition-all
            duration-300
            group-hover:bg-blue-500
            group-hover:scale-110
          ">
            <FaUsers className="
              text-blue-500
              transition-colors
              duration-300
              group-hover:text-white
            " />
          </div>

          <h3 className="
            relative
            text-lg
            font-black
            text-[#07152B]
            mt-5
          ">
            Manage Employees
          </h3>

          <p className="
            relative
            text-sm
            text-gray-500
            mt-2
          ">
            Add employees and manage their
            training assignments.
          </p>

          <div className="
            relative
            mt-5
            flex
            items-center
            gap-2
            text-sm
            font-bold
            text-blue-500
          ">
            Manage Employees

            <FaArrowRight className="
              transition-transform
              duration-300
              group-hover:translate-x-2
            " />
          </div>

        </button>

        {/* MANAGE COURSES */}

        <button
          type="button"
          onClick={() =>
            navigate("/manager/courses")
          }
          className="
            group
            relative
            overflow-hidden
            text-left
            bg-white
            rounded-2xl
            border
            border-gray-100
            shadow-sm
            p-6
            transition-all
            duration-300
            hover:-translate-y-1
            hover:border-emerald-100
            hover:shadow-xl
          "
        >

          <div className="
            absolute
            -right-10
            -top-10
            w-32
            h-32
            rounded-full
            bg-emerald-50
            opacity-0
            transition-all
            duration-500
            group-hover:opacity-100
            group-hover:scale-150
          " />

          <div className="
            relative
            w-11
            h-11
            rounded-xl
            bg-emerald-50
            flex
            items-center
            justify-center
            transition-all
            duration-300
            group-hover:bg-[#18D39A]
            group-hover:scale-110
          ">
            <FaBookOpen className="
              text-[#18D39A]
              transition-colors
              duration-300
              group-hover:text-white
            " />
          </div>

          <h3 className="
            relative
            text-lg
            font-black
            text-[#07152B]
            mt-5
          ">
            Manage Courses
          </h3>

          <p className="
            relative
            text-sm
            text-gray-500
            mt-2
          ">
            Review and manage AI-generated
            learning courses.
          </p>

          <div className="
            relative
            mt-5
            flex
            items-center
            gap-2
            text-sm
            font-bold
            text-[#18D39A]
          ">
            View Courses

            <FaArrowRight className="
              transition-transform
              duration-300
              group-hover:translate-x-2
            " />
          </div>

        </button>

      </section>

    </div>
  );
}

export default Dashboard;