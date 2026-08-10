import React from "react";
import {
  FaArrowTrendUp,
  FaArrowTrendDown,
} from "react-icons/fa6";

function StatCard({
  title,
  value,
  trend = "",
  footerText = "",
  icon,
  bgColor = "#ECFDF5",
  iconColor = "#18D39A",
}) {
  const positive =
    trend &&
    (trend.includes("↑") ||
      trend.includes("+") ||
      trend.toLowerCase().includes("increase"));

  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-3xl
        bg-white
        border
        border-[#E8EDF3]
        p-7
        shadow-sm
        hover:shadow-xl
        hover:-translate-y-1
        transition-all
        duration-300
      "
    >
      {/* Decorative Background */}

      <div
        className="
          absolute
          -right-10
          -top-10
          w-32
          h-32
          rounded-full
          opacity-10
        "
        style={{
          backgroundColor: iconColor,
        }}
      />

      {/* Top */}

      <div className="flex justify-between items-start relative z-10">

        <div>

          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">

            {title}

          </p>

          <h2 className="text-5xl font-black text-slate-900 mt-3">

            {value}

          </h2>

        </div>

        <div
          className="
            w-16
            h-16
            rounded-2xl
            flex
            items-center
            justify-center
            shadow-sm
          "
          style={{
            backgroundColor: bgColor,
          }}
        >
          <div
            className="text-3xl"
            style={{
              color: iconColor,
            }}
          >
            {icon}
          </div>
        </div>

      </div>

      {/* Trend */}

      {trend && (

        <div className="mt-8 flex items-center gap-2">

          <div
            className={`
              w-8
              h-8
              rounded-full
              flex
              items-center
              justify-center
              ${
                positive
                  ? "bg-green-100"
                  : "bg-red-100"
              }
            `}
          >
            {positive ? (
              <FaArrowTrendUp className="text-green-600 text-sm" />
            ) : (
              <FaArrowTrendDown className="text-red-600 text-sm" />
            )}
          </div>

          <div>

            <p
              className={`font-bold ${
                positive
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {trend}
            </p>

            <p className="text-xs text-slate-500">

              {footerText}

            </p>

          </div>

        </div>

      )}

      {/* Bottom Accent */}

      <div
        className="absolute bottom-0 left-0 w-full h-1"
        style={{
          backgroundColor: iconColor,
        }}
      />

    </div>
  );
}

export default StatCard;