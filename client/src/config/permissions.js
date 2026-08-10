// ======================================================
// SKILLOS CENTRALIZED PERMISSIONS
// ======================================================
export const PERMISSIONS_UPDATED_EVENT =
  "skillos:permissions-updated";
export const STORAGE_KEY = "skillos_permissions";

// ======================================================
// ROLES
// ======================================================

export const DEFAULT_ROLES = [
  {
    id: "manager",
    name: "Manager",
    description:
      "Full access to manage employees and training",
  },

  {
    id: "hr",
    name: "HR Manager",
    description:
      "Manage employees, onboarding and HR operations",
  },

  {
    id: "trainer",
    name: "Trainer",
    description:
      "Create and manage employee training",
  },

  {
    id: "employee",
    name: "Employee",
    description:
      "Access assigned courses and personal progress",
  },
];

// ======================================================
// PERMISSION GROUPS
// ======================================================

export const PERMISSION_GROUPS = [
  {
    title: "Dashboard",
    permissions: [
      {
        id: "dashboard.view",
        name: "View Dashboard",
        description:
          "Allow access to the main dashboard",
      },
    ],
  },

  {
    title: "Employees",
    permissions: [
      {
        id: "employees.view",
        name: "View Employees",
        description:
          "View employee information",
      },

      {
        id: "employees.create",
        name: "Create Employees",
        description:
          "Add new employees to the organization",
      },

      {
        id: "employees.edit",
        name: "Edit Employees",
        description:
          "Modify employee information",
      },

      {
        id: "employees.delete",
        name: "Delete Employees",
        description:
          "Remove employees from the organization",
      },
    ],
  },

  {
    title: "SOP Management",
    permissions: [
      {
        id: "sop.view",
        name: "View SOPs",
        description:
          "View uploaded and generated SOPs",
      },

      {
        id: "sop.create",
        name: "Create SOPs",
        description:
          "Create new SOPs and role-based SOPs",
      },

      {
        id: "sop.edit",
        name: "Edit SOPs",
        description:
          "Modify existing SOPs",
      },

      {
        id: "sop.delete",
        name: "Delete SOPs",
        description:
          "Delete SOPs from the organization",
      },
    ],
  },

  {
    title: "Courses & Training",
    permissions: [
      {
        id: "courses.view",
        name: "View Courses",
        description:
          "View available training courses",
      },

      {
        id: "courses.create",
        name: "Create Courses",
        description:
          "Create AI-generated or manual courses",
      },

      {
        id: "courses.edit",
        name: "Edit Courses",
        description:
          "Modify course content",
      },

      {
        id: "courses.delete",
        name: "Delete Courses",
        description:
          "Delete training courses",
      },

      {
        id: "courses.assign",
        name: "Assign Courses",
        description:
          "Assign courses to employees",
      },
    ],
  },

  {
    title: "Upload SOP",
    permissions: [
      {
        id: "upload.create",
        name: "Upload SOP",
        description:
          "Upload SOP documents",
      },

      {
        id: "upload.generate",
        name: "Generate Training",
        description:
          "Generate training content using AI",
      },
    ],
  },

  {
    title: "Organization",
    permissions: [
      {
        id: "organization.view",
        name: "View Organization Settings",
        description:
          "Access organization configuration",
      },

      {
        id: "organization.edit",
        name: "Edit Organization Settings",
        description:
          "Modify organization configuration",
      },

      {
        id: "organization.branding",
        name: "Manage Branding",
        description:
          "Customize company branding",
      },
    ],
  },

  {
    title: "System",
    permissions: [
      {
        id: "system.permissions",
        name: "Manage Permissions",
        description:
          "Configure role permissions",
      },

      {
        id: "system.audit",
        name: "View Audit Logs",
        description:
          "View organization activity logs",
      },
    ],
  },
];

// ======================================================
// DEFAULT PERMISSIONS
// ======================================================

export const DEFAULT_PERMISSIONS = {
  manager: {
    "dashboard.view": true,

    "employees.view": true,
    "employees.create": true,
    "employees.edit": true,
    "employees.delete": true,

    "sop.view": true,
    "sop.create": true,
    "sop.edit": true,
    "sop.delete": true,

    "courses.view": true,
    "courses.create": true,
    "courses.edit": true,
    "courses.delete": true,
    "courses.assign": true,

    "upload.create": true,
    "upload.generate": true,

    "organization.view": true,
    "organization.edit": true,
    "organization.branding": true,

    "system.permissions": true,
    "system.audit": true,
  },

  hr: {
    "dashboard.view": true,

    "employees.view": true,
    "employees.create": true,
    "employees.edit": true,
    "employees.delete": false,

    "sop.view": true,
    "sop.create": true,
    "sop.edit": true,
    "sop.delete": false,

    "courses.view": true,
    "courses.create": false,
    "courses.edit": false,
    "courses.delete": false,
    "courses.assign": true,

    "upload.create": true,
    "upload.generate": true,

    "organization.view": true,
    "organization.edit": false,
    "organization.branding": false,

    "system.permissions": false,
    "system.audit": true,
  },

  trainer: {
    "dashboard.view": true,

    "employees.view": true,
    "employees.create": false,
    "employees.edit": false,
    "employees.delete": false,

    "sop.view": true,
    "sop.create": true,
    "sop.edit": true,
    "sop.delete": false,

    "courses.view": true,
    "courses.create": true,
    "courses.edit": true,
    "courses.delete": false,
    "courses.assign": true,

    "upload.create": true,
    "upload.generate": true,

    "organization.view": false,
    "organization.edit": false,
    "organization.branding": false,

    "system.permissions": false,
    "system.audit": false,
  },

  employee: {
    "dashboard.view": true,

    "employees.view": false,
    "employees.create": false,
    "employees.edit": false,
    "employees.delete": false,

    "sop.view": false,
    "sop.create": false,
    "sop.edit": false,
    "sop.delete": false,

    "courses.view": true,
    "courses.create": false,
    "courses.edit": false,
    "courses.delete": false,
    "courses.assign": false,

    "upload.create": false,
    "upload.generate": false,

    "organization.view": false,
    "organization.edit": false,
    "organization.branding": false,

    "system.permissions": false,
    "system.audit": false,
  },
};

// ======================================================
// ALL PERMISSION IDS
// ======================================================

export const getAllPermissionIds = () => {
  return PERMISSION_GROUPS.flatMap((group) =>
    group.permissions.map(
      (permission) => permission.id
    )
  );
};

// ======================================================
// NORMALIZE PERMISSIONS
// ======================================================

export const normalizePermissions = (
  savedPermissions = {}
) => {
  const permissionIds =
    getAllPermissionIds();

  const normalized = {};

  DEFAULT_ROLES.forEach((role) => {
    normalized[role.id] = {};

    permissionIds.forEach((permissionId) => {
      const savedValue =
        savedPermissions?.[role.id]?.[
          permissionId
        ];

      if (typeof savedValue === "boolean") {
        normalized[role.id][permissionId] =
          savedValue;
      } else {
        normalized[role.id][permissionId] =
          DEFAULT_PERMISSIONS[
            role.id
          ]?.[permissionId] ?? false;
      }
    });
  });

  // ====================================================
  // MANAGER SAFETY
  // ====================================================
  //
  // Manager must always be able to access the
  // centralized Permissions page.
  //
  // Otherwise the manager could disable their own
  // permission and lock themselves out.
  //
  // ====================================================

  normalized.manager[
    "system.permissions"
  ] = true;

  return normalized;
};

// ======================================================
// LOAD PERMISSIONS
// ======================================================

export const loadPermissions = () => {
  try {
    const stored =
      localStorage.getItem(STORAGE_KEY);

    // --------------------------------------------------
    // FIRST RUN
    // --------------------------------------------------

    if (!stored) {
      const initialized =
        normalizePermissions(
          DEFAULT_PERMISSIONS
        );

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(initialized)
      );

      return initialized;
    }

    // --------------------------------------------------
    // EXISTING DATA
    // --------------------------------------------------

    const parsed = JSON.parse(stored);

    const normalized =
      normalizePermissions(parsed);

    // Repair old/incomplete permission data.
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(normalized)
    );

    return normalized;
  } catch (error) {
    console.error(
      "SKILLOS PERMISSIONS: Failed to load permissions",
      error
    );

    return normalizePermissions(
      DEFAULT_PERMISSIONS
    );
  }
};

// ======================================================
// SAVE PERMISSIONS
// ======================================================

export const savePermissions = (
  permissionData
) => {
  try {
    const normalized =
      normalizePermissions(
        permissionData
      );

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(normalized)
    );

    // Tell PermissionRoute and other components
    // that the permission configuration changed.

   window.dispatchEvent(
  new CustomEvent(
    PERMISSIONS_UPDATED_EVENT,
    {
      detail: normalized,
    }
  )
);

    return true;
  } catch (error) {
    console.error(
      "SKILLOS PERMISSIONS: Failed to save permissions",
      error
    );

    return false;
  }
};

// ======================================================
// INITIALIZE PERMISSIONS
// ======================================================
//
// This is the important part.
//
// PermissionRoute can now initialize the permission
// system BEFORE Permissions.jsx is ever opened.
//
// ======================================================

export const initializePermissions = () => {
  return loadPermissions();
};