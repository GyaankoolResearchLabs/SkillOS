import { FaMagic } from "react-icons/fa";

function CourseHero({ course }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800">

      {/* Background Glow */}

      <div className="absolute right-[-120px] top-[-120px] w-[450px] h-[450px] rounded-full bg-[#18D39A]/10 blur-3xl" />

      {/* Content */}

      <div className="relative p-10 lg:p-14">

        <div className="max-w-5xl">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#18D39A]/15 text-[#18D39A] font-semibold">

            <FaMagic />

            AI Generated Curriculum

          </div>

          <h1 className="mt-6 text-5xl lg:text-6xl font-black leading-tight text-white">

            {course.courseTitle}

          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-300 max-w-4xl">

            {course.description}

          </p>

        </div>

      </div>

    </div>
  );
}

export default CourseHero;