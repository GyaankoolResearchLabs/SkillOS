import { useEffect, useState } from "react";
import {
  FaShieldAlt,
  FaLock,
  FaKey,
  FaSave,
  FaCheckCircle,
  FaInfoCircle,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const DEFAULT_SETTINGS = {
  minimumPasswordLength: 8,
  requireUppercase: true,
  requireNumber: true,
  requireSpecialCharacter: true,
  passwordExpiryDays: 90,
  maxFailedLoginAttempts: 5,
  lockoutDurationMinutes: 15,
  sessionDurationHours: 24,
};

function Security() {
  const [settings, setSettings] =
    useState(DEFAULT_SETTINGS);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  // =====================================================
  // LOAD SETTINGS
  // =====================================================

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE}/security/settings`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load security settings."
        );
      }

      setSettings({
        ...DEFAULT_SETTINGS,
        ...data.settings,
      });
    } catch (error) {
      console.error(
        "SECURITY SETTINGS LOAD ERROR:",
        error
      );

      toast.error(
        error.message ||
          "Failed to load security settings."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CHANGE SETTING
  // =====================================================

  const handleChange = (
    field,
    value
  ) => {
    setSettings((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // =====================================================
  // SAVE
  // =====================================================

  const handleSave = async () => {
    try {
      setSaving(true);

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE}/security/settings`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            ...settings,

            minimumPasswordLength:
              Number(
                settings.minimumPasswordLength
              ),

            passwordExpiryDays:
              Number(
                settings.passwordExpiryDays
              ),

            maxFailedLoginAttempts:
              Number(
                settings.maxFailedLoginAttempts
              ),

            lockoutDurationMinutes:
              Number(
                settings.lockoutDurationMinutes
              ),

            sessionDurationHours:
              Number(
                settings.sessionDurationHours
              ),
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save security settings."
        );
      }

      setSettings({
        ...DEFAULT_SETTINGS,
        ...data.settings,
      });

      toast.success(
        "Security settings saved successfully."
      );
    } catch (error) {
      console.error(
        "SECURITY SETTINGS SAVE ERROR:",
        error
      );

      toast.error(
        error.message ||
          "Failed to save security settings."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-sm font-medium text-slate-500">
          Loading security settings...
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-8">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <FaShieldAlt size={22} />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Security
          </h1>

          <p className="mt-1 text-slate-500">
            Configure authentication and security
            policies for your organization.
          </p>
        </div>
      </div>

      {/* =====================================================
          PASSWORD POLICY
      ===================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FaLock />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Password Policy
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Define the password requirements for your
              organization.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* MINIMUM LENGTH */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Minimum Password Length
            </label>

            <input
              type="number"
              min="6"
              max="32"
              value={
                settings.minimumPasswordLength
              }
              onChange={(event) =>
                handleChange(
                  "minimumPasswordLength",
                  event.target.value
                )
              }
              className="
                w-full
                rounded-xl
                border
                border-slate-200
                px-4
                py-3
                outline-none
                focus:border-emerald-500
                focus:ring-2
                focus:ring-emerald-100
              "
            />

            <p className="mt-2 text-xs text-slate-400">
              Allowed range: 6–32 characters.
            </p>
          </div>

          {/* EXPIRY */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Password Expiry
            </label>

            <select
              value={
                settings.passwordExpiryDays
              }
              onChange={(event) =>
                handleChange(
                  "passwordExpiryDays",
                  Number(event.target.value)
                )
              }
              className="
                w-full
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-3
                outline-none
                focus:border-emerald-500
                focus:ring-2
                focus:ring-emerald-100
              "
            >
              <option value={0}>
                Never
              </option>

              <option value={30}>
                30 days
              </option>

              <option value={60}>
                60 days
              </option>

              <option value={90}>
                90 days
              </option>

              <option value={180}>
                180 days
              </option>

              <option value={365}>
                365 days
              </option>
            </select>
          </div>
        </div>

        {/* PASSWORD REQUIREMENTS */}

        <div className="mt-8 space-y-3">
          <h3 className="text-sm font-bold text-slate-800">
            Password Requirements
          </h3>

          <ToggleRow
            label="Require uppercase letter"
            description="Passwords must contain at least one uppercase letter."
            checked={
              settings.requireUppercase
            }
            onChange={(value) =>
              handleChange(
                "requireUppercase",
                value
              )
            }
          />

          <ToggleRow
            label="Require number"
            description="Passwords must contain at least one number."
            checked={
              settings.requireNumber
            }
            onChange={(value) =>
              handleChange(
                "requireNumber",
                value
              )
            }
          />

          <ToggleRow
            label="Require special character"
            description="Passwords must contain at least one special character."
            checked={
              settings.requireSpecialCharacter
            }
            onChange={(value) =>
              handleChange(
                "requireSpecialCharacter",
                value
              )
            }
          />
        </div>
      </section>

      {/* =====================================================
          LOGIN PROTECTION
      ===================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <FaKey />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Login Protection
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Protect accounts from repeated failed
              authentication attempts.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* MAX ATTEMPTS */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Maximum Failed Login Attempts
            </label>

            <input
              type="number"
              min="1"
              max="20"
              value={
                settings.maxFailedLoginAttempts
              }
              onChange={(event) =>
                handleChange(
                  "maxFailedLoginAttempts",
                  event.target.value
                )
              }
              className="
                w-full
                rounded-xl
                border
                border-slate-200
                px-4
                py-3
                outline-none
                focus:border-emerald-500
                focus:ring-2
                focus:ring-emerald-100
              "
            />

            <p className="mt-2 text-xs text-slate-400">
              Account will be locked after this many
              consecutive failed attempts.
            </p>
          </div>

          {/* LOCKOUT */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Lockout Duration
            </label>

            <select
              value={
                settings.lockoutDurationMinutes
              }
              onChange={(event) =>
                handleChange(
                  "lockoutDurationMinutes",
                  Number(event.target.value)
                )
              }
              className="
                w-full
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-3
                outline-none
                focus:border-emerald-500
                focus:ring-2
                focus:ring-emerald-100
              "
            >
              <option value={5}>
                5 minutes
              </option>

              <option value={10}>
                10 minutes
              </option>

              <option value={15}>
                15 minutes
              </option>

              <option value={30}>
                30 minutes
              </option>

              <option value={60}>
                1 hour
              </option>

              <option value={120}>
                2 hours
              </option>
            </select>
          </div>
        </div>
      </section>

      {/* =====================================================
          SESSION SECURITY
      ===================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <FaShieldAlt />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Session Security
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Configure how long authenticated sessions remain
              valid.
            </p>
          </div>
        </div>

        <div className="mt-8 max-w-xl">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Session Duration
          </label>

          <select
            value={
              settings.sessionDurationHours
            }
            onChange={(event) =>
              handleChange(
                "sessionDurationHours",
                Number(event.target.value)
              )
            }
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-3
              outline-none
              focus:border-emerald-500
              focus:ring-2
              focus:ring-emerald-100
            "
          >
            <option value={1}>
              1 hour
            </option>

            <option value={4}>
              4 hours
            </option>

            <option value={8}>
              8 hours
            </option>

            <option value={12}>
              12 hours
            </option>

            <option value={24}>
              24 hours
            </option>

            <option value={48}>
              48 hours
            </option>

            <option value={168}>
              7 days
            </option>
          </select>

          <p className="mt-2 text-xs text-slate-400">
            JWT/session expiration policy for new logins.
          </p>
        </div>
      </section>

      {/* =====================================================
          SECURITY INFORMATION
      ===================================================== */}

      <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-5 text-sm text-blue-800">
        <FaInfoCircle className="mt-0.5 flex-shrink-0" />

        <p className="leading-6">
          Changes to login protection take effect for future
          authentication attempts. Existing authentication
          tokens are not automatically revoked when these
          settings are changed.
        </p>
      </div>

      {/* =====================================================
          SAVE BUTTON
      ===================================================== */}

      <div className="flex justify-end border-t border-slate-200 pt-6">
        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#18D39A]
            px-6
            py-3
            font-semibold
            text-white
            shadow-sm
            transition
            hover:bg-[#12bd89]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {saving ? (
            "Saving..."
          ) : (
            <>
              <FaSave />
              Save Security Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// =====================================================
// TOGGLE COMPONENT
// =====================================================

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
      <div className="min-w-0">
        <p className="font-semibold text-slate-900">
          {label}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() =>
          onChange(!checked)
        }
        className={`
          relative
          h-7
          w-12
          flex-shrink-0
          rounded-full
          transition
          ${
            checked
              ? "bg-[#18D39A]"
              : "bg-slate-300"
          }
        `}
      >
        <span
          className={`
            absolute
            top-1
            h-5
            w-5
            rounded-full
            bg-white
            shadow
            transition
            ${
              checked
                ? "left-6"
                : "left-1"
            }
          `}
        />
      </button>
    </div>
  );
}

export default Security;