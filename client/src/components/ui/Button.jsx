function Button({
  children,
  icon,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const variants = {
    primary:
      "bg-[#18D39A] hover:bg-[#13B987] text-white shadow-lg shadow-[#18D39A]/20",

    secondary:
      "bg-white border border-[#E5E7EB] hover:bg-[#F8FAFC] text-[#1E293B]",

    danger:
      "bg-[#EF4444] hover:bg-[#DC2626] text-white shadow-lg shadow-red-500/20",

    ghost:
      "bg-transparent hover:bg-[#F1F5F9] text-[#1E293B]",
  };

  const sizes = {
    sm: "h-10 px-4 text-sm",
    md: "h-12 px-6 text-sm",
    lg: "h-14 px-8 text-base",
  };

  return (
    <button
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-2xl
        font-semibold
        transition-all
        duration-300
        hover:-translate-y-0.5
        active:scale-95
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}

export default Button;