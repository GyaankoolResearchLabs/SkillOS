import { useEffect, useState } from "react";

import LogoUploader from "./LogoUploader";

import {
  FaBuilding,
  FaGlobe,
  FaEnvelope,
  FaFont,
  FaMoon,
  FaSun,
  FaDesktop,
  FaSave,
} from "react-icons/fa";

// ======================================================
// DEFAULT BRANDING SETTINGS
// ======================================================

const DEFAULT_BRANDING = {
  organizationName: "SkillOS Technologies",

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
};

// ======================================================
// COMPONENT
// ======================================================

export default function Branding() {
  const [branding, setBranding] = useState(
    DEFAULT_BRANDING
  );

  const [logo, setLogo] = useState(null);

  const [favicon, setFavicon] = useState(null);

  const [loginBackground, setLoginBackground] =
    useState(null);

  const [dashboardBanner, setDashboardBanner] =
    useState(null);

  const [saving, setSaving] = useState(false);

  const [saveMessage, setSaveMessage] =
    useState("");

  // ====================================================
  // LOAD SAVED BRANDING
  // ====================================================

  useEffect(() => {
    try {
      const savedBranding =
        localStorage.getItem("skillos_branding");

      if (!savedBranding) {
        return;
      }

      const parsed = JSON.parse(savedBranding);

      /*
       * We intentionally remove old fields from previous
       * versions of the branding system.
       *
       * Old fields removed:
       * - shortName
       * - navigationLabel
       * - navigation
       */

      const cleanedBranding = {
        organizationName:
          parsed.organizationName ||
          DEFAULT_BRANDING.organizationName,

        tagline:
          parsed.tagline ||
          DEFAULT_BRANDING.tagline,

        website:
          parsed.website ||
          DEFAULT_BRANDING.website,

        supportEmail:
          parsed.supportEmail ||
          DEFAULT_BRANDING.supportEmail,

        primaryColor:
          parsed.primaryColor ||
          DEFAULT_BRANDING.primaryColor,

        secondaryColor:
          parsed.secondaryColor ||
          DEFAULT_BRANDING.secondaryColor,

        accentColor:
          parsed.accentColor ||
          DEFAULT_BRANDING.accentColor,

        headingFont:
          parsed.headingFont ||
          DEFAULT_BRANDING.headingFont,

        bodyFont:
          parsed.bodyFont ||
          DEFAULT_BRANDING.bodyFont,

        theme:
          parsed.theme ||
          DEFAULT_BRANDING.theme,

        logo:
          parsed.logo || null,

        favicon:
          parsed.favicon || null,

        loginBackground:
          parsed.loginBackground || null,

        dashboardBanner:
          parsed.dashboardBanner || null,
      };

      setBranding(cleanedBranding);

      setLogo(parsed.logo || null);

      setFavicon(parsed.favicon || null);

      setLoginBackground(
        parsed.loginBackground || null
      );

      setDashboardBanner(
        parsed.dashboardBanner || null
      );
    } catch (error) {
      console.error(
        "Unable to load saved branding:",
        error
      );
    }
  }, []);

  // ====================================================
  // APPLY THEME
  // ====================================================

  useEffect(() => {
    const root = document.documentElement;

    if (branding.theme === "dark") {
      root.classList.add("dark");
      return;
    }

    if (branding.theme === "light") {
      root.classList.remove("dark");
      return;
    }

    const prefersDark =
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

    root.classList.toggle(
      "dark",
      prefersDark
    );
  }, [branding.theme]);

  // ====================================================
  // UPDATE BRANDING FIELD
  // ====================================================

  const updateField = (field, value) => {
    setBranding((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // ====================================================
  // SAVE BRANDING
  // ====================================================

  const handleSaveBranding = async () => {
    if (saving) {
      return;
    }

    setSaving(true);

    setSaveMessage("");

    try {
      const brandingData = {
        organizationName:
          branding.organizationName?.trim() ||
          DEFAULT_BRANDING.organizationName,

        tagline:
          branding.tagline?.trim() ||
          DEFAULT_BRANDING.tagline,

        website:
          branding.website?.trim() ||
          "",

        supportEmail:
          branding.supportEmail?.trim() ||
          "",

        primaryColor:
          branding.primaryColor ||
          DEFAULT_BRANDING.primaryColor,

        secondaryColor:
          branding.secondaryColor ||
          DEFAULT_BRANDING.secondaryColor,

        accentColor:
          branding.accentColor ||
          DEFAULT_BRANDING.accentColor,

        headingFont:
          branding.headingFont ||
          DEFAULT_BRANDING.headingFont,

        bodyFont:
          branding.bodyFont ||
          DEFAULT_BRANDING.bodyFont,

        theme:
          branding.theme ||
          DEFAULT_BRANDING.theme,

        logo: logo || null,

        favicon: favicon || null,

        loginBackground:
          loginBackground || null,

        dashboardBanner:
          dashboardBanner || null,
      };

      // Save only the current branding structure.
      // Old navigation / shortName fields are removed.
      localStorage.setItem(
        "skillos_branding",
        JSON.stringify(brandingData)
      );

      // Update local state with the clean structure.
      setBranding(brandingData);

      // Notify the rest of the application.
      window.dispatchEvent(
        new Event(
          "organizationSettingsUpdated"
        )
      );

      // Small delay for better UX.
      await new Promise((resolve) =>
        setTimeout(resolve, 400)
      );

      setSaveMessage(
        "Branding settings saved successfully."
      );
    } catch (error) {
      console.error(
        "Failed to save branding:",
        error
      );

      setSaveMessage(
        "Unable to save branding settings."
      );
    } finally {
      setSaving(false);
    }
  };

  // ====================================================
  // GLOBAL ORGANIZATION SAVE BUTTON
  // ====================================================

  useEffect(() => {
    const handleGlobalSave = () => {
      handleSaveBranding();
    };

    window.addEventListener(
      "skillos:save-organization",
      handleGlobalSave
    );

    return () => {
      window.removeEventListener(
        "skillos:save-organization",
        handleGlobalSave
      );
    };
  });

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="space-y-6">

      {/* =================================================
          SAVE MESSAGE
      ================================================= */}

      {saveMessage && (
        <div
          className="
            bg-green-50
            border
            border-green-200
            text-green-700
            rounded-xl
            px-5
            py-4
            font-medium
          "
        >
          {saveMessage}
        </div>
      )}

      {/* =================================================
          ORGANIZATION INFORMATION
      ================================================= */}

      <div
        className="
          bg-white
          rounded-2xl
          border
          border-slate-200
          shadow-sm
          p-8
        "
      >
        <h2
          className="
            text-xl
            font-bold
            text-slate-800
            mb-6
          "
        >
          Organization Information
        </h2>

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-6
          "
        >

          {/* ============================================
              ORGANIZATION NAME
          ============================================ */}

          <div>
            <label
              className="
                block
                text-sm
                font-semibold
                text-slate-700
                mb-2
              "
            >
              <FaBuilding className="inline mr-2" />

              Organization Name
            </label>

            <input
              type="text"
              value={
                branding.organizationName
              }
              onChange={(e) =>
                updateField(
                  "organizationName",
                  e.target.value
                )
              }
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-[#19D68C]
              "
              placeholder="Your company name"
            />
          </div>

          {/* ============================================
              COMPANY TAGLINE
          ============================================ */}

          <div>
            <label
              className="
                block
                text-sm
                font-semibold
                text-slate-700
                mb-2
              "
            >
              Company Tagline
            </label>

            <input
              type="text"
              value={branding.tagline}
              onChange={(e) =>
                updateField(
                  "tagline",
                  e.target.value
                )
              }
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-[#19D68C]
              "
              placeholder="Your company tagline"
            />
          </div>

          {/* ============================================
              WEBSITE
          ============================================ */}

          <div>
            <label
              className="
                block
                text-sm
                font-semibold
                text-slate-700
                mb-2
              "
            >
              <FaGlobe className="inline mr-2" />

              Website
            </label>

            <input
              type="url"
              value={branding.website}
              onChange={(e) =>
                updateField(
                  "website",
                  e.target.value
                )
              }
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-[#19D68C]
              "
              placeholder="https://yourcompany.com"
            />
          </div>

          {/* ============================================
              SUPPORT EMAIL
          ============================================ */}

          <div>
            <label
              className="
                block
                text-sm
                font-semibold
                text-slate-700
                mb-2
              "
            >
              <FaEnvelope className="inline mr-2" />

              Support Email
            </label>

            <input
              type="email"
              value={branding.supportEmail}
              onChange={(e) =>
                updateField(
                  "supportEmail",
                  e.target.value
                )
              }
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-[#19D68C]
              "
              placeholder="support@yourcompany.com"
            />
          </div>

        </div>
      </div>

      {/* =================================================
          BRANDING ASSETS
      ================================================= */}

      <div
        className="
          bg-white
          rounded-2xl
          border
          border-slate-200
          shadow-sm
          p-8
        "
      >
        <h2
          className="
            text-xl
            font-bold
            text-slate-800
            mb-2
          "
        >
          Branding Assets
        </h2>

        <p
          className="
            text-sm
            text-slate-500
            mb-6
          "
        >
          Upload the visual assets your
          organization wants to use across
          the platform.
        </p>

        <div
          className="
            grid
            grid-cols-1
            xl:grid-cols-2
            gap-6
          "
        >

          {/* ORGANIZATION LOGO */}

          <LogoUploader
            label="Organization Logo"
            description="Primary logo displayed throughout the platform."
            value={logo}
            onChange={(file, preview) =>
              setLogo(preview)
            }
          />

          {/* FAVICON */}

          <LogoUploader
            label="Favicon"
            description="Browser and application favicon."
            value={favicon}
            onChange={(file, preview) =>
              setFavicon(preview)
            }
          />

          {/* LOGIN BACKGROUND */}

          <LogoUploader
            label="Login Background"
            description="Background image displayed on the login page."
            value={loginBackground}
            onChange={(file, preview) =>
              setLoginBackground(preview)
            }
          />

          {/* DASHBOARD BANNER */}

          <LogoUploader
            label="Dashboard Banner"
            description="Optional dashboard banner."
            value={dashboardBanner}
            onChange={(file, preview) =>
              setDashboardBanner(preview)
            }
          />

        </div>
      </div>

      {/* =================================================
          THEME + COLORS
      ================================================= */}

      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
        "
      >

        {/* ==============================================
            THEME
        ============================================== */}

        <div
          className="
            bg-white
            rounded-2xl
            border
            border-slate-200
            shadow-sm
            p-8
          "
        >
          <h2
            className="
              text-xl
              font-bold
              text-slate-800
              mb-6
            "
          >
            Theme
          </h2>

          <div
            className="
              grid
              grid-cols-3
              gap-4
            "
          >

            {/* LIGHT */}

            <button
              type="button"
              onClick={() =>
                updateField(
                  "theme",
                  "light"
                )
              }
              className={`
                rounded-xl
                border
                p-5
                transition
                ${
                  branding.theme ===
                  "light"
                    ? "border-[#19D68C] bg-[#19D68C]/10"
                    : "border-slate-200"
                }
              `}
            >
              <FaSun
                className="
                  text-3xl
                  mx-auto
                  mb-3
                  text-yellow-500
                "
              />

              <h3 className="font-semibold">
                Light
              </h3>
            </button>

            {/* DARK */}

            <button
              type="button"
              onClick={() =>
                updateField(
                  "theme",
                  "dark"
                )
              }
              className={`
                rounded-xl
                border
                p-5
                transition
                ${
                  branding.theme ===
                  "dark"
                    ? "border-[#19D68C] bg-[#19D68C]/10"
                    : "border-slate-200"
                }
              `}
            >
              <FaMoon
                className="
                  text-3xl
                  mx-auto
                  mb-3
                  text-slate-700
                "
              />

              <h3 className="font-semibold">
                Dark
              </h3>
            </button>

            {/* SYSTEM */}

            <button
              type="button"
              onClick={() =>
                updateField(
                  "theme",
                  "system"
                )
              }
              className={`
                rounded-xl
                border
                p-5
                transition
                ${
                  branding.theme ===
                  "system"
                    ? "border-[#19D68C] bg-[#19D68C]/10"
                    : "border-slate-200"
                }
              `}
            >
              <FaDesktop
                className="
                  text-3xl
                  mx-auto
                  mb-3
                  text-slate-500
                "
              />

              <h3 className="font-semibold">
                System
              </h3>
            </button>

          </div>
        </div>

        {/* ==============================================
            COLORS
        ============================================== */}

        <div
          className="
            bg-white
            rounded-2xl
            border
            border-slate-200
            shadow-sm
            p-8
          "
        >
          <h2
            className="
              text-xl
              font-bold
              text-slate-800
              mb-6
            "
          >
            Theme Colors
          </h2>

          <div className="space-y-5">

            <ColorInput
              label="Primary Color"
              value={
                branding.primaryColor
              }
              onChange={(value) =>
                updateField(
                  "primaryColor",
                  value
                )
              }
            />

            <ColorInput
              label="Secondary Color"
              value={
                branding.secondaryColor
              }
              onChange={(value) =>
                updateField(
                  "secondaryColor",
                  value
                )
              }
            />

            <ColorInput
              label="Accent Color"
              value={
                branding.accentColor
              }
              onChange={(value) =>
                updateField(
                  "accentColor",
                  value
                )
              }
            />

          </div>
        </div>

      </div>

      {/* =================================================
          TYPOGRAPHY
      ================================================= */}

      <div
        className="
          bg-white
          rounded-2xl
          border
          border-slate-200
          shadow-sm
          p-8
        "
      >
        <h2
          className="
            text-xl
            font-bold
            text-slate-800
            mb-6
          "
        >
          <FaFont className="inline mr-2" />

          Typography
        </h2>

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-6
          "
        >

          {/* HEADING FONT */}

          <div>
            <label
              className="
                block
                font-medium
                mb-2
              "
            >
              Heading Font
            </label>

            <select
              value={
                branding.headingFont
              }
              onChange={(e) =>
                updateField(
                  "headingFont",
                  e.target.value
                )
              }
              className="
                w-full
                border
                rounded-xl
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-[#19D68C]
              "
            >
              <option value="Inter">
                Inter
              </option>

              <option value="Poppins">
                Poppins
              </option>

              <option value="Roboto">
                Roboto
              </option>

              <option value="Open Sans">
                Open Sans
              </option>
            </select>
          </div>

          {/* BODY FONT */}

          <div>
            <label
              className="
                block
                font-medium
                mb-2
              "
            >
              Body Font
            </label>

            <select
              value={
                branding.bodyFont
              }
              onChange={(e) =>
                updateField(
                  "bodyFont",
                  e.target.value
                )
              }
              className="
                w-full
                border
                rounded-xl
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-[#19D68C]
              "
            >
              <option value="Inter">
                Inter
              </option>

              <option value="Poppins">
                Poppins
              </option>

              <option value="Roboto">
                Roboto
              </option>

              <option value="Open Sans">
                Open Sans
              </option>
            </select>
          </div>

        </div>
      </div>

      {/* =================================================
          SAVE BUTTON
      ================================================= */}

      <div
        className="
          flex
          justify-end
          pb-8
        "
      >
        <button
          type="button"
          onClick={handleSaveBranding}
          disabled={saving}
          className="
            flex
            items-center
            gap-3
            px-8
            py-3
            rounded-xl
            bg-[#19D68C]
            text-white
            font-bold
            hover:bg-[#15C67D]
            disabled:opacity-50
            disabled:cursor-not-allowed
            transition
          "
        >
          <FaSave />

          {saving
            ? "Saving..."
            : "Save Branding"}
        </button>
      </div>

    </div>
  );
}

// ======================================================
// COLOR INPUT COMPONENT
// ======================================================

function ColorInput({
  label,
  value,
  onChange,
}) {
  return (
    <div>
      <label
        className="
          block
          font-medium
          mb-2
        "
      >
        {label}
      </label>

      <div
        className="
          flex
          gap-4
          items-center
        "
      >
        <input
          type="color"
          value={value}
          onChange={(e) =>
            onChange(
              e.target.value
            )
          }
          className="
            w-16
            h-12
            rounded
            cursor-pointer
          "
        />

        <input
          value={value}
          onChange={(e) =>
            onChange(
              e.target.value
            )
          }
          className="
            flex-1
            border
            border-slate-300
            rounded-xl
            px-4
            py-3
            outline-none
            focus:ring-2
            focus:ring-[#19D68C]
          "
        />
      </div>
    </div>
  );
}