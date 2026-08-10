function Card({ children, className = "" }) {
  return (
    <div
      className={`
        bg-white
        rounded-[24px]
        border
        border-[#E5E7EB]
        shadow-sm
        hover:shadow-xl
        transition-all
        duration-300
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default Card;