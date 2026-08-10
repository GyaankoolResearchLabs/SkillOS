import { useMemo, useState } from "react";
import {
  FaLock,
  FaSave,
  FaCheckCircle,
  FaUserShield,
  FaBook,
  FaUsers,
  FaUpload,
  FaChartLine,
  FaFileAlt,
  FaBuilding,
  FaCog,
} from "react-icons/fa";

import {
  DEFAULT_ROLES,
  PERMISSION_GROUPS,
  DEFAULT_PERMISSIONS,
  loadPermissions,
  normalizePermissions,
  savePermissions,
} from "../../../config/permissions";

// ======================================================
// COMPONENT
// ======================================================

export default function Permissions() {
  // ====================================================
  // STATE
  // ====================================================

  const [permissions, setPermissions] =
    useState(() =>
      loadPermissions()
    );

  const [selectedRole, setSelectedRole] =
    useState("manager");

  const [saved, setSaved] =
    useState(false);

  // ====================================================
  // CURRENT ROLE
  // ====================================================

  const currentPermissions =
    permissions?.[selectedRole] || {};

  // ====================================================
  // COUNTS
  // ====================================================

  const totalPermissions = useMemo(() => {
    return PERMISSION_GROUPS.reduce(
      (total, group) =>
        total + group.permissions.length,
      0
    );
  }, []);

  const enabledPermissions = useMemo(() => {
    return Object.values(
      currentPermissions
    ).filter(Boolean).length;
  }, [currentPermissions]);

  // ====================================================
  // SAVE FEEDBACK
  // ====================================================

  const showSaved = () => {
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  // ====================================================
  // SAVE
  // ====================================================

  const persistPermissions = (
    updatedPermissions
  ) => {
    const normalized =
      normalizePermissions(
        updatedPermissions
      );

    setPermissions(normalized);

    const success =
      savePermissions(normalized);

    if (success) {
      showSaved();
    }
  };

  // ====================================================
  // TOGGLE PERMISSION
  // ====================================================

  const togglePermission = (
    permissionId
  ) => {
    // Manager cannot disable their own
    // permission-management access.

    if (
      selectedRole === "manager" &&
      permissionId ===
        "system.permissions"
    ) {
      return;
    }

    const updatedRole = {
      ...currentPermissions,

      [permissionId]:
        !currentPermissions[
          permissionId
        ],
    };

    persistPermissions({
      ...permissions,

      [selectedRole]: updatedRole,
    });
  };

  // ====================================================
  // TOGGLE GROUP
  // ====================================================

  const toggleGroup = (group) => {
    const allEnabled =
      group.permissions.every(
        (permission) => {
          if (
            selectedRole === "manager" &&
            permission.id ===
              "system.permissions"
          ) {
            return true;
          }

          return (
            currentPermissions[
              permission.id
            ] === true
          );
        }
      );

    const updatedRole = {
      ...currentPermissions,
    };

    group.permissions.forEach(
      (permission) => {
        // Never disable the manager's
        // system.permissions permission.

        if (
          selectedRole === "manager" &&
          permission.id ===
            "system.permissions"
        ) {
          updatedRole[
            permission.id
          ] = true;

          return;
        }

        updatedRole[
          permission.id
        ] = !allEnabled;
      }
    );

    persistPermissions({
      ...permissions,

      [selectedRole]: updatedRole,
    });
  };

  // ====================================================
  // SAVE BUTTON
  // ====================================================

  const handleSave = () => {
    const success =
      savePermissions(
        permissions
      );

    if (success) {
      showSaved();
    }
  };

  // ====================================================
  // RESET ROLE
  // ====================================================

  const resetRole = () => {
    const role =
      DEFAULT_ROLES.find(
        (item) =>
          item.id === selectedRole
      );

    const confirmed =
      window.confirm(
        `Reset all permissions for ${
          role?.name ||
          selectedRole
        }?`
      );

    if (!confirmed) {
      return;
    }

    const updated = {
      ...permissions,

      [selectedRole]:
        DEFAULT_PERMISSIONS[
          selectedRole
        ],
    };

    persistPermissions(updated);
  };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="w-full min-w-0 space-y-6 pb-10">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

          <div className="flex min-w-0 items-center gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
              <FaLock className="text-xl text-blue-600" />
            </div>

            <div className="min-w-0">

              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Permissions
              </h1>

              <p className="mt-1 text-slate-500">
                Control what each role can access
                and manage.
              </p>

            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">

            <button
              type="button"
              onClick={resetRole}
              className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Reset Role
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="flex items-center justify-center gap-3 rounded-xl bg-[#19D68C] px-6 py-3 font-semibold text-white transition hover:bg-[#15C67D]"
            >
              <FaSave />
              Save Permissions
            </button>

          </div>
        </div>
      </div>

      {/* ==================================================
          SUCCESS
      ================================================== */}

      {saved && (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-green-700">
          <FaCheckCircle />

          <span className="font-medium">
            Permissions saved successfully.
          </span>
        </div>
      )}

      {/* ==================================================
          ROLE SELECTOR
      ================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

        <div className="mb-5 flex items-center gap-3">

          <FaUserShield className="text-xl text-[#19D68C]" />

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Select Role
            </h2>

            <p className="text-sm text-slate-500">
              Configure permissions for a specific
              role.
            </p>
          </div>

        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

          {DEFAULT_ROLES.map((role) => {

            const active =
              selectedRole === role.id;

            return (
              <button
                key={role.id}
                type="button"
                onClick={() => {
                  setSelectedRole(
                    role.id
                  );

                  setSaved(false);
                }}
                className={`rounded-xl border p-4 text-left transition-all ${
                  active
                    ? "border-[#19D68C] bg-[#19D68C]/10 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >

                <div className="flex items-center justify-between gap-3">

                  <span
                    className={`font-semibold ${
                      active
                        ? "text-[#079B69]"
                        : "text-slate-800"
                    }`}
                  >
                    {role.name}
                  </span>

                  {active && (
                    <FaCheckCircle className="shrink-0 text-[#19D68C]" />
                  )}

                </div>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {role.description}
                </p>

              </button>
            );
          })}

        </div>
      </div>

      {/* ==================================================
          SUMMARY
      ================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-sm text-slate-500">
            Selected Role
          </p>

          <p className="mt-2 text-xl font-bold text-slate-900">
            {
              DEFAULT_ROLES.find(
                (role) =>
                  role.id ===
                  selectedRole
              )?.name
            }
          </p>

        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-sm text-slate-500">
            Enabled Permissions
          </p>

          <p className="mt-2 text-xl font-bold text-[#19D68C]">
            {enabledPermissions}
          </p>

        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-sm text-slate-500">
            Total Permissions
          </p>

          <p className="mt-2 text-xl font-bold text-slate-900">
            {totalPermissions}
          </p>

        </div>

      </div>

      {/* ==================================================
          PERMISSION GROUPS
      ================================================== */}

      <div className="min-w-0 space-y-5">

        {PERMISSION_GROUPS.map(
          (group) => {

            const Icon =
              group.title === "Dashboard"
                ? FaChartLine
                : group.title === "Employees"
                ? FaUsers
                : group.title ===
                  "SOP Management"
                ? FaFileAlt
                : group.title ===
                  "Courses & Training"
                ? FaBook
                : group.title ===
                  "Upload SOP"
                ? FaUpload
                : group.title ===
                  "Organization"
                ? FaBuilding
                : FaCog;

            const enabledCount =
              group.permissions.filter(
                (permission) =>
                  currentPermissions[
                    permission.id
                  ] === true
              ).length;

            const allEnabled =
              group.permissions.every(
                (permission) => {

                  if (
                    selectedRole ===
                      "manager" &&
                    permission.id ===
                      "system.permissions"
                  ) {
                    return true;
                  }

                  return (
                    currentPermissions[
                      permission.id
                    ] === true
                  );
                }
              );

            return (
              <div
                key={group.title}
                className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >

                {/* GROUP HEADER */}

                <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

                  <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                      <Icon className="text-slate-600" />
                    </div>

                    <div className="min-w-0">

                      <h3 className="font-bold text-slate-900">
                        {group.title}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        {enabledCount} of{" "}
                        {
                          group
                            .permissions
                            .length
                        }{" "}
                        enabled
                      </p>

                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      toggleGroup(
                        group
                      )
                    }
                    className={`shrink-0 rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                      allEnabled
                        ? "border-red-200 text-red-600 hover:bg-red-50"
                        : "border-[#19D68C] text-[#079B69] hover:bg-[#19D68C]/10"
                    }`}
                  >
                    {allEnabled
                      ? "Disable All"
                      : "Enable All"}
                  </button>

                </div>

                {/* PERMISSION ROWS */}

                <div className="divide-y divide-slate-100">

                  {group.permissions.map(
                    (permission) => {

                      const enabled =
                        currentPermissions[
                          permission.id
                        ] === true;

                      const managerProtected =
                        selectedRole ===
                          "manager" &&
                        permission.id ===
                          "system.permissions";

                      return (
                        <div
                          key={
                            permission.id
                          }
                          className="flex items-center justify-between gap-5 px-5 py-5 transition hover:bg-slate-50 sm:px-6"
                        >

                          <div className="min-w-0">

                            <h4 className="font-semibold text-slate-800">
                              {
                                permission.name
                              }
                            </h4>

                            <p className="mt-1 text-sm leading-5 text-slate-500">
                              {
                                permission.description
                              }
                            </p>

                            {managerProtected && (
                              <p className="mt-2 text-xs font-medium text-blue-600">
                                Manager access to
                                Permissions
                                cannot be
                                disabled.
                              </p>
                            )}

                          </div>

                          {/* TOGGLE */}

                          <button
                            type="button"
                            role="switch"
                            aria-checked={
                              enabled
                            }
                            aria-disabled={
                              managerProtected
                            }
                            disabled={
                              managerProtected
                            }
                            onClick={() =>
                              togglePermission(
                                permission.id
                              )
                            }
                            className={`relative h-8 w-14 shrink-0 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#19D68C]/30 ${
                              enabled
                                ? "bg-[#19D68C]"
                                : "bg-slate-300"
                            } ${
                              managerProtected
                                ? "cursor-not-allowed opacity-70"
                                : "cursor-pointer"
                            }`}
                          >

                            <span
                              className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-200 ${
                                enabled
                                  ? "translate-x-7"
                                  : "translate-x-1"
                              }`}
                            />

                          </button>

                        </div>
                      );
                    }
                  )}

                </div>

              </div>
            );
          }
        )}

      </div>

      {/* ==================================================
          BOTTOM SAVE
      ================================================== */}

      <div className="flex justify-end">

        <button
          type="button"
          onClick={handleSave}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#19D68C] px-7 py-3 font-semibold text-white transition hover:bg-[#15C67D] sm:w-auto"
        >
          <FaSave />
          Save Permissions
        </button>

      </div>

    </div>
  );
}