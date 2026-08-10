import { useEffect, useState } from "react";
import {
  FaRobot,
  FaCheckCircle,
  FaSpinner,
  FaClock,
} from "react-icons/fa";

const STAGES = [
  "Uploading Document",
  "Reading PDF",
  "Cleaning Content",
  "Extracting Important Sections",
  "Generating Course Outline",
  "Generating AI Insights",
  "Saving Course",
];

function AIGenerationScreen({
  currentStage = 0,
}) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = Date.now();

    const timer = setInterval(() => {
      setElapsed(
        Math.floor((Date.now() - start) / 1000)
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutes = String(
    Math.floor(elapsed / 60)
  ).padStart(2, "0");

  const seconds = String(
    elapsed % 60
  ).padStart(2, "0");

  const progress =
    ((currentStage + 1) / STAGES.length) * 100;

  return (
    <div className="fixed inset-0 bg-[#0B1220] z-[9999] flex items-center justify-center">

      <div className="w-full max-w-3xl rounded-3xl bg-[#111827] border border-gray-800 shadow-2xl p-10">

        <div className="flex items-center gap-4">

          <div className="w-16 h-16 rounded-2xl bg-[#18D39A]/15 flex items-center justify-center">

            <FaRobot className="text-3xl text-[#18D39A]" />

          </div>

          <div>

            <h1 className="text-3xl font-bold text-white">

              Generating Your AI Course

            </h1>

            <p className="text-gray-400 mt-2">

              Building a professional learning experience from your SOP.

            </p>

          </div>

        </div>

        <div className="mt-10 grid grid-cols-2 gap-8">

          <div>

            <div className="text-gray-400 text-sm">

              Elapsed Time

            </div>

            <div className="flex items-center gap-3 mt-2 text-3xl font-bold text-white">

              <FaClock className="text-[#18D39A]" />

              {minutes}:{seconds}

            </div>

          </div>

          <div>

            <div className="text-gray-400 text-sm">

              Estimated Remaining

            </div>

            <div className="text-3xl font-bold text-white mt-2">

              Calculating...

            </div>

          </div>

        </div>

        <div className="mt-10">

          <div className="w-full h-3 rounded-full bg-gray-800 overflow-hidden">

            <div
              className="h-full bg-[#18D39A] transition-all duration-700"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

        <div className="mt-10 space-y-5">

          {STAGES.map((stage, index) => (

            <div
              key={stage}
              className="flex items-center gap-4"
            >

              {index < currentStage ? (

                <FaCheckCircle className="text-green-400" />

              ) : index === currentStage ? (

                <FaSpinner className="animate-spin text-[#18D39A]" />

              ) : (

                <div className="w-4 h-4 rounded-full border border-gray-600" />

              )}

              <span
                className={
                  index <= currentStage
                    ? "text-white"
                    : "text-gray-500"
                }
              >
                {stage}
              </span>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default AIGenerationScreen;