import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  initializePermissions,
  loadPermissions,
  PERMISSIONS_UPDATED_EVENT,
} from "../config/permissions";

// =====================================================
// PERMISSION ROUTE
// =====================================================

function PermissionRoute({
  permission,
  children,
  fallback = "/manager/dashboard",
}) {
  const { user } = useAuth();
  const location = useLocation();

  // ===================================================
  // INITIAL PERMISSION LOAD
  // ===================================================

  const [permissions, setPermissions] = useState(() =>
    initializePermissions()
  );

  // ===================================================
  // LISTEN FOR PERMISSION CHANGES
  // ===================================================

  useEffect(() => {
    const reloadPermissions = () => {
      const updatedPermissions = loadPermissions();

      setPermissions(updatedPermissions);
    };

    window.addEventListener(
      PERMISSIONS_UPDATED_EVENT,
      reloadPermissions
    );

    window.addEventListener(
      "storage",
      reloadPermissions
    );

    return () => {
      window.removeEventListener(
        PERMISSIONS_UPDATED_EVENT,
        reloadPermissions
      );

      window.removeEventListener(
        "storage",
        reloadPermissions
      );
    };
  }, []);

  // ===================================================
  // AUTH CHECK
  // ===================================================

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // ===================================================
  // USER ROLE
  // ===================================================

  const role = String(user.role || "")
    .trim()
    .toLowerCase();

  // ===================================================
  // ROLE PERMISSIONS
  // ===================================================

  const rolePermissions =
    permissions?.[role] || {};

  // ===================================================
  // PERMISSION CHECK
  // ===================================================

  const hasPermission =
    rolePermissions?.[permission] === true;

  // ===================================================
  // ACCESS DENIED
  // ===================================================

  if (!hasPermission) {
    return (
      <div className="flex min-h-[500px] w-full items-center justify-center px-4">
        <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

          {/* Icon */}

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <span className="text-2xl font-bold text-red-500">
              !
            </span>
          </div>

          {/* Title */}

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Access Restricted
          </h1>

          {/* Description */}

          <p className="mt-3 leading-6 text-slate-500">
            You do not have permission to access
            this section.
          </p>

          {/* Required permission */}

          <p className="mt-2 text-xs text-slate-400">
            Required permission:
            <span className="ml-1 font-semibold text-slate-500">
              {permission}
            </span>
          </p>

          {/* Back */}

          <button
            type="button"
            onClick={() => {
              if (window.history.length > 1) {
                window.history.back();
              } else {
                window.location.href = fallback;
              }
            }}
            className="
              mt-6
              rounded-xl
              bg-[#19D68C]
              px-5
              py-3
              font-semibold
              text-white
              transition
              hover:bg-[#15C67D]
            "
          >
            Go Back
          </button>

        </div>
      </div>
    );
  }

  // ===================================================
  // ACCESS GRANTED
  // ===================================================

  return children;
}

export default PermissionRoute;