import { useEffect, useState } from "react";

// ======================================================
// STORAGE KEYS
// ======================================================

const GENERAL_KEY = "skillos_general_settings";
const BRANDING_KEY = "skillos_branding";

// ======================================================
// DEFAULT GENERAL SETTINGS
// ======================================================

const DEFAULT_GENERAL = {
  organizationName: "SkillOS",
  organizationCode: "",
  website: "",
  supportEmail: "",
  supportPhone: "",
  industry: "",
  country: "India",
  timezone: "Asia/Kolkata",
  currency: "INR",
  language: "English",
  startTime: "09:00",
  endTime: "18:00",
};

// ======================================================
// DEFAULT NAVIGATION
// ======================================================

const DEFAULT_NAVIGATION = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/manager/dashboard",
    visible: true,
  },
  {
    id: "upload",
    label: "Upload SOP",
    path: "/manager/upload",
    visible: true,
  },
  {
    id: "employees",
    label: "Employees",
    path: "/manager/employees",
    visible: true,
  },
  {
    id: "role-sops",
    label: "Role SOPs",
    path: "/manager/role-sops",
    visible: true,
  },
  {
    id: "courses",
    label: "Courses",
    path: "/manager/courses",
    visible: true,
  },
  {
    id: "organization",
    label: "Organization",
    path: "/manager/organization",
    visible: true,
  },
];

// ======================================================
// DEFAULT BRANDING
// ======================================================

const DEFAULT_BRANDING = {
  organizationName: "SkillOS",
  shortName: "SkillOS",
  tagline: "A GyaanKool Enterprise",

  website: "https://skillos.ai",
  supportEmail: "support@skillos.ai",

  primaryColor: "#19D68C",
  secondaryColor: "#07152B",
  accentColor: "#3B82F6",

  headingFont: "Inter",
  bodyFont: "Inter",

  theme: "light",

  logo: null,
  favicon: null,
  loginBackground: null,
  dashboardBanner: null,

  navigationLabel: "Navigation",

  navigation: DEFAULT_NAVIGATION,
};

// ======================================================
// READ LOCAL STORAGE SAFELY
// ======================================================

function readStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);

    if (!stored) {
      return {
        ...fallback,
      };
    }

    const parsed = JSON.parse(stored);

    return {
      ...fallback,
      ...parsed,
    };
  } catch (error) {
    console.error(`Failed to read ${key}:`, error);

    return {
      ...fallback,
    };
  }
}

// ======================================================
// NORMALIZE BRANDING
// ======================================================

function normalizeBranding(savedBranding, general) {
  const branding = {
    ...DEFAULT_BRANDING,
    ...savedBranding,
  };

  // ----------------------------------------------------
  // Organization Name
  // ----------------------------------------------------

  branding.organizationName =
    savedBranding?.organizationName ||
    general?.organizationName ||
    DEFAULT_BRANDING.organizationName;

  // ----------------------------------------------------
  // Short Name
  // ----------------------------------------------------

  branding.shortName =
    savedBranding?.shortName ||
    branding.organizationName ||
    DEFAULT_BRANDING.shortName;

  // ----------------------------------------------------
  // Tagline
  // ----------------------------------------------------

  branding.tagline =
    savedBranding?.tagline ||
    DEFAULT_BRANDING.tagline;

  // ----------------------------------------------------
  // Website
  // ----------------------------------------------------

  branding.website =
    savedBranding?.website ||
    general?.website ||
    DEFAULT_BRANDING.website;

  // ----------------------------------------------------
  // Support Email
  // ----------------------------------------------------

  branding.supportEmail =
    savedBranding?.supportEmail ||
    general?.supportEmail ||
    DEFAULT_BRANDING.supportEmail;

  // ----------------------------------------------------
  // Navigation
  // ----------------------------------------------------

  branding.navigation =
    Array.isArray(savedBranding?.navigation)
      ? savedBranding.navigation
      : DEFAULT_NAVIGATION;

  // ----------------------------------------------------
  // Navigation Label
  // ----------------------------------------------------

  branding.navigationLabel =
    savedBranding?.navigationLabel ||
    DEFAULT_BRANDING.navigationLabel;

  return branding;
}

// ======================================================
// HOOK
// ======================================================

export default function useOrganizationSettings() {
  const [general, setGeneral] = useState(() =>
    readStorage(
      GENERAL_KEY,
      DEFAULT_GENERAL
    )
  );

  const [branding, setBranding] = useState(() => {
    const savedGeneral = readStorage(
      GENERAL_KEY,
      DEFAULT_GENERAL
    );

    const savedBranding = readStorage(
      BRANDING_KEY,
      DEFAULT_BRANDING
    );

    return normalizeBranding(
      savedBranding,
      savedGeneral
    );
  });

  // ====================================================
  // LOAD / REFRESH SETTINGS
  // ====================================================

  const loadSettings = () => {
    const savedGeneral = readStorage(
      GENERAL_KEY,
      DEFAULT_GENERAL
    );

    const savedBranding = readStorage(
      BRANDING_KEY,
      DEFAULT_BRANDING
    );

    const normalizedBranding =
      normalizeBranding(
        savedBranding,
        savedGeneral
      );

    setGeneral(savedGeneral);
    setBranding(normalizedBranding);
  };

  // ====================================================
  // LISTEN FOR BRANDING CHANGES
  // ====================================================

  useEffect(() => {
    const handleSettingsUpdate = () => {
      loadSettings();
    };

    window.addEventListener(
      "organizationSettingsUpdated",
      handleSettingsUpdate
    );

    window.addEventListener(
      "storage",
      handleSettingsUpdate
    );

    return () => {
      window.removeEventListener(
        "organizationSettingsUpdated",
        handleSettingsUpdate
      );

      window.removeEventListener(
        "storage",
        handleSettingsUpdate
      );
    };
  }, []);

  // ====================================================
  // ORGANIZATION INFORMATION
  // ====================================================

  const organizationName =
    branding.organizationName ||
    general.organizationName ||
    "SkillOS";

  const shortName =
    branding.shortName ||
    organizationName ||
    "SkillOS";

  const tagline =
    branding.tagline ||
    "A GyaanKool Enterprise";

  // ====================================================
  // RETURN SETTINGS
  // ====================================================

  return {
    // --------------------------------------------------
    // Full objects
    // --------------------------------------------------

    general,

    branding,

    // --------------------------------------------------
    // Organization
    // --------------------------------------------------

    organizationName,

    shortName,

    tagline,

    website:
      branding.website ||
      general.website ||
      "",

    supportEmail:
      branding.supportEmail ||
      general.supportEmail ||
      "",

    // --------------------------------------------------
    // Colors
    // --------------------------------------------------

    primaryColor:
      branding.primaryColor ||
      "#19D68C",

    secondaryColor:
      branding.secondaryColor ||
      "#07152B",

    accentColor:
      branding.accentColor ||
      "#3B82F6",

    // --------------------------------------------------
    // Typography
    // --------------------------------------------------

    headingFont:
      branding.headingFont ||
      "Inter",

    bodyFont:
      branding.bodyFont ||
      "Inter",

    // --------------------------------------------------
    // Theme
    // --------------------------------------------------

    theme:
      branding.theme ||
      "light",

    // --------------------------------------------------
    // Assets
    // --------------------------------------------------

    logo:
      branding.logo ||
      null,

    favicon:
      branding.favicon ||
      null,

    loginBackground:
      branding.loginBackground ||
      null,

    dashboardBanner:
      branding.dashboardBanner ||
      null,

    // --------------------------------------------------
    // Navigation
    // --------------------------------------------------

    navigationLabel:
      branding.navigationLabel ||
      "Navigation",

    navigation:
      Array.isArray(branding.navigation)
        ? branding.navigation
        : DEFAULT_NAVIGATION,
  };
}