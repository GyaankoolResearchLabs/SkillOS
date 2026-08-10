import { useAuth } from "../../context/AuthContext";

function EmployeeNavbar({ title = "Employee Dashboard" }) {
  const { user } = useAuth();

  return (
    <header
      className="
        h-[92px]
        flex-shrink-0
        bg-white
        border-b
        border-[#E5E7EB]
        flex
        items-center
        px-10
      "
    >
      <div>
        <h1 className="text-2xl font-bold text-[#202B38]">
          {title}
        </h1>

        <p className="text-sm text-[#64748B] mt-1">
          Welcome back,
          <span className="font-semibold text-[#202B38]">
            {" "}
            {user?.name || "Employee"}
          </span>
        </p>
      </div>
    </header>
  );
}

export default EmployeeNavbar;