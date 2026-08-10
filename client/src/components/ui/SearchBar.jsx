import React from "react";
import { FaSearch } from "react-icons/fa";

function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}) {
  return (
    <div className={`relative w-full ${className}`}>
      <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-lg pointer-events-none transition-colors duration-200" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-white border border-[#E5E7EB] rounded-[16px] py-3.5 pl-12 pr-4 text-[#202B38] placeholder-[#9CA3AF] text-base shadow-sm transition-all duration-200 focus:outline-none focus:border-[#18D39A] focus:ring-4 focus:ring-[#18D39A]/18"
      />
    </div>
  );
}

export default SearchBar;
