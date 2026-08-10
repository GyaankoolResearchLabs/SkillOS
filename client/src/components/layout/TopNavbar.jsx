import { FaBars } from "react-icons/fa";

function TopNavbar({
  title = "Dashboard",
  collapsed,
  setCollapsed,
}) {
  return (
    <header className="h-20 bg-white border-b border-[#E8EDF3] flex items-center px-8 sticky top-0 z-20 shrink-0">
      <div className="flex items-center gap-4">
        <button
          aria-label="Toggle Menu"
          onClick={() => setCollapsed(!collapsed)}
          className="text-[#6B7280] hover:text-[#111827] text-base cursor-pointer"
        >
          <FaBars />
        </button>

        <h1 className="text-xl font-bold text-[#111827] tracking-tight">
          {title}
        </h1>
      </div>
    </header>
  );
}

export default TopNavbar;