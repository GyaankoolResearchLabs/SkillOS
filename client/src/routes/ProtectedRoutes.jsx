import { useNavigate } from "react-router-dom";
import {
  FaLock,
  FaArrowLeft,
} from "react-icons/fa";

import usePermissions from "../hooks/usePermissions";

function ProtectedRoute({
  children,
  permission,
}) {
  const navigate = useNavigate();

  const { can } =
    usePermissions();

  if (
    permission &&
    !can(permission)
  ) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-8">

        <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-sm p-10 text-center">

          <div className="w-20 h-20 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center">

            <FaLock
              size={30}
              className="text-slate-500"
            />

          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            Access Restricted
          </h1>

          <p className="mt-3 text-slate-500 leading-7">
            You don't have permission to access
            this section.
          </p>

          <p className="text-sm text-slate-400 mt-2">
            Contact your organization administrator
            if you need access.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            className="mt-7 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#19D68C] text-white font-semibold hover:bg-[#15C67D] transition"
          >
            <FaArrowLeft />
            Go Back
          </button>

        </div>

      </div>
    );
  }

  return children;
}

export default ProtectedRoute;