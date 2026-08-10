import {
  FaClock,
  FaCheckCircle,
  FaGraduationCap,
} from "react-icons/fa";

import Card from "../ui/Card";

function ModuleCard({ module, index }) {
  return (
    <Card className="p-8 hover:border-[#18D39A]/40 hover:shadow-xl transition-all duration-300">

      {/* Header */}

      <div className="flex flex-wrap justify-between items-start gap-6">

        <div className="flex gap-5">

          <div className="w-16 h-16 rounded-2xl bg-[#E8FFF6] flex items-center justify-center text-[#18D39A] text-xl font-black">

            {String(index + 1).padStart(2, "0")}

          </div>

          <div>

            <p className="text-xs uppercase tracking-[2px] text-[#18D39A] font-bold">

              Module {index + 1}

            </p>

            <h2 className="text-2xl font-bold text-[#202B38] mt-1 leading-tight">

              {module.title}

            </h2>

          </div>

        </div>

        {module.duration && (

          <div className="bg-[#E8FFF6] text-[#18D39A] rounded-full px-5 py-2 font-semibold text-sm">

            <FaClock className="inline mr-2" />

            {module.duration}

          </div>

        )}

      </div>

      {/* Objectives */}

      <div className="mt-8">

        <div className="flex items-center gap-3 mb-6">

          <FaGraduationCap
            className="text-[#18D39A]"
            size={20}
          />

          <h3 className="text-lg font-bold text-[#202B38]">

            Learning Objectives

          </h3>

        </div>

        <div className="grid md:grid-cols-2 gap-4">

          {module.learningObjectives?.map((objective, i) => (

            <div
              key={i}
              className="
                rounded-2xl
                border
                border-[#E5E7EB]
                bg-[#F8FAFC]
                p-5
                hover:bg-[#E8FFF6]/40
                transition
              "
            >

              <div className="flex gap-3">

                <FaCheckCircle
                  className="text-[#18D39A] mt-1 shrink-0"
                />

                <p className="leading-7 text-[#202B38]">

                  {objective}

                </p>

              </div>

            </div>

          ))}

        </div>

      </div>

    </Card>
  );
}

export default ModuleCard;