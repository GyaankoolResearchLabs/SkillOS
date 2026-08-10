import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "../context/AuthContext";

import {
  loadPermissions,
  savePermissions,
  PERMISSIONS_UPDATED_EVENT,
} from "../config/permissions";

// ============================================================
// CENTRALIZED PERMISSION HOOK
// ============================================================
//
// Rules:
// 1. All normal manager permissions are configurable.
// 2. Manager permission-management access can NEVER be
//    accidentally disabled.
// 3. This prevents the manager from locking themselves out.
// 4. HR / Trainer / Employee continue using their configured
//    permissions normally.
// ============================================================

const PROTECTED_MANAGER_PERMISSIONS = [
  "system.permissions",
];

// ============================================================
// VALID ROLES
// ============================================================

const VALID_ROLES = [
  "manager",
  "hr",
  "trainer",
  "employee",
];

// ============================================================
// HOOK
// ============================================================

export default function usePermissions() {
  const { user } = useAuth();

  // ----------------------------------------------------------
  // Load permissions
  // ----------------------------------------------------------

  const [permissions, setPermissions] = useState(() =>
    loadPermissions()
  );

  // ----------------------------------------------------------
  // Current role
  // ----------------------------------------------------------

  const role = useMemo(() => {
    const currentRole =
      user?.role?.toLowerCase?.();

    if (VALID_ROLES.includes(currentRole)) {
      return currentRole;
    }

    return "employee";
  }, [user?.role]);

  // ----------------------------------------------------------
  // Refresh permissions
  // ----------------------------------------------------------

  const refreshPermissions = useCallback(() => {
    setPermissions(loadPermissions());
  }, []);

  // ----------------------------------------------------------
  // Listen for centralized permission changes
  // ----------------------------------------------------------

  useEffect(() => {
    window.addEventListener(
      PERMISSIONS_UPDATED_EVENT,
      refreshPermissions
    );

    window.addEventListener(
      "storage",
      refreshPermissions
    );

    return () => {
      window.removeEventListener(
        PERMISSIONS_UPDATED_EVENT,
        refreshPermissions
      );

      window.removeEventListener(
        "storage",
        refreshPermissions
      );
    };
  }, [refreshPermissions]);

  // ----------------------------------------------------------
  // Current role permissions
  // ----------------------------------------------------------

  const currentPermissions = useMemo(() => {
    const rolePermissions =
      permissions?.[role] || {};

    return {
      ...rolePermissions,
    };
  }, [permissions, role]);

  // ==========================================================
  // CHECK ONE PERMISSION
  // ==========================================================

  const can = useCallback(
    (permissionId) => {
      if (!permissionId) {
        return false;
      }

      // ------------------------------------------------------
      // PROTECTED MANAGER ACCESS
      // ------------------------------------------------------
      //
      // The manager must ALWAYS be able to access the
      // permission-management system.
      //
      // This prevents:
      //
      // Organization OFF
      //       ↓
      // Permissions inaccessible
      //       ↓
      // Manager permanently locked out
      //
      // ------------------------------------------------------

      if (
        role === "manager" &&
        PROTECTED_MANAGER_PERMISSIONS.includes(
          permissionId
        )
      ) {
        return true;
      }

      return (
        currentPermissions?.[permissionId] === true
      );
    },
    [currentPermissions, role]
  );

  // ==========================================================
  // CHECK ANY PERMISSION
  // ==========================================================

  const canAny = useCallback(
    (permissionIds = []) => {
      if (!Array.isArray(permissionIds)) {
        return false;
      }

      return permissionIds.some((permissionId) =>
        can(permissionId)
      );
    },
    [can]
  );

  // ==========================================================
  // CHECK ALL PERMISSIONS
  // ==========================================================

  const canAll = useCallback(
    (permissionIds = []) => {
      if (!Array.isArray(permissionIds)) {
        return false;
      }

      return permissionIds.every((permissionId) =>
        can(permissionId)
      );
    },
    [can]
  );

  // ==========================================================
  // CHECK WHETHER USER IS MANAGER
  // ==========================================================

  const isManager = role === "manager";

  // ==========================================================
  // CHECK WHETHER USER CAN MANAGE PERMISSIONS
  // ==========================================================

  const canManagePermissions =
    role === "manager";

  // ==========================================================
  // RETURN
  // ==========================================================

  return {
    role,

    permissions,

    currentPermissions,

    can,

    canAny,

    canAll,

    isManager,

    canManagePermissions,

    refreshPermissions,
  };
}