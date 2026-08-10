function SectionHeader({
  title,
  subtitle,
  action,
}) {
  return (
    <div className="flex items-center justify-between mb-8">

      <div>

        <h2 className="text-3xl font-bold text-[#1E293B]">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-2 text-[#64748B]">
            {subtitle}
          </p>
        )}

      </div>

      {action}

    </div>
  );
}

export default SectionHeader;