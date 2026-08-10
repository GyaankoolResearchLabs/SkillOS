import { useEffect, useState } from "react";
import {
  FaBuilding,
  FaGlobe,
  FaClock,
  FaSave,
  FaCheckCircle,
} from "react-icons/fa";

const STORAGE_KEY = "skillos_general_settings";

const DEFAULT_SETTINGS = {
  organizationName: "",
  organizationCode: "",
  website: "",
  supportEmail: "",
  supportPhone: "",
  industry: "Manufacturing",

  country: "India",
  timezone: "Asia/Kolkata",
  currency: "INR",
  language: "English",

  startTime: "09:00",
  endTime: "18:00",
};

export default function GeneralSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const storedSettings = localStorage.getItem(STORAGE_KEY);

    if (!storedSettings) return;

    try {
      const parsedSettings = JSON.parse(storedSettings);

      setSettings({
        ...DEFAULT_SETTINGS,
        ...parsedSettings,
      });
    } catch (error) {
      console.error(
        "Unable to load organization settings:",
        error
      );
    }
  }, []);
  useEffect(() => {
  const handleGlobalSave = () => {
    handleSave();
  };

  window.addEventListener(
    "saveOrganizationSettings",
    handleGlobalSave
  );

  return () => {
    window.removeEventListener(
      "saveOrganizationSettings",
      handleGlobalSave
    );
  };
}, [settings]);

  const updateField = (field, value) => {
    setSettings((previous) => ({
      ...previous,
      [field]: value,
    }));

    setSaved(false);
  };

  const handleSave = async () => {
  setSaving(true);
  setSaved(false);

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(settings)
    );

    window.dispatchEvent(
      new Event("organizationSettingsUpdated")
    );

    await new Promise((resolve) =>
      setTimeout(resolve, 600)
    );

    setSaved(true);
  } catch (error) {
    console.error(
      "Unable to save organization settings:",
      error
    );
  } finally {
    setSaving(false);
  }
};

  return (
    <div className="space-y-6">

      {/* Organization Information */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

        <div className="px-8 py-6 border-b border-slate-200">

          <div className="flex items-center gap-3">

            <FaBuilding className="text-[#19D68C] text-xl" />

            <h2 className="text-xl font-bold text-slate-800">
              Organization Information
            </h2>

          </div>

          <p className="mt-2 text-sm text-slate-500">
            Basic information about your organization.
          </p>

        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">

          <Input
            label="Organization Name"
            value={settings.organizationName}
            onChange={(value) =>
              updateField("organizationName", value)
            }
            placeholder="Acme Corporation"
          />

          <Input
            label="Organization Code"
            value={settings.organizationCode}
            onChange={(value) =>
              updateField(
                "organizationCode",
                value.toUpperCase()
              )
            }
            placeholder="ACME001"
          />

          <Input
            label="Website"
            value={settings.website}
            onChange={(value) =>
              updateField("website", value)
            }
            placeholder="https://company.com"
          />

          <Input
            label="Support Email"
            type="email"
            value={settings.supportEmail}
            onChange={(value) =>
              updateField("supportEmail", value)
            }
            placeholder="support@company.com"
          />

          <Input
            label="Support Phone"
            value={settings.supportPhone}
            onChange={(value) =>
              updateField("supportPhone", value)
            }
            placeholder="+91 XXXXX XXXXX"
          />

          <Select
            label="Industry"
            value={settings.industry}
            onChange={(value) =>
              updateField("industry", value)
            }
            options={[
              "Manufacturing",
              "Healthcare",
              "Finance",
              "Education",
              "Retail",
              "Technology",
              "Construction",
              "Logistics",
              "Other",
            ]}
          />

        </div>

      </div>

      {/* Regional Settings */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

        <div className="px-8 py-6 border-b border-slate-200">

          <div className="flex items-center gap-3">

            <FaGlobe className="text-[#19D68C] text-xl" />

            <h2 className="text-xl font-bold text-slate-800">
              Regional Settings
            </h2>

          </div>

          <p className="mt-2 text-sm text-slate-500">
            Configure regional preferences for your organization.
          </p>

        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">

          <Select
            label="Country"
            value={settings.country}
            onChange={(value) =>
              updateField("country", value)
            }
            options={[
              "India",
              "United States",
              "United Kingdom",
              "Germany",
              "Australia",
              "Singapore",
              "Canada",
            ]}
          />

          <Select
            label="Timezone"
            value={settings.timezone}
            onChange={(value) =>
              updateField("timezone", value)
            }
            options={[
              "Asia/Kolkata",
              "UTC",
              "Europe/London",
              "Europe/Berlin",
              "America/New_York",
              "America/Los_Angeles",
              "Asia/Singapore",
            ]}
          />

          <Select
            label="Currency"
            value={settings.currency}
            onChange={(value) =>
              updateField("currency", value)
            }
            options={[
              "INR",
              "USD",
              "EUR",
              "GBP",
              "AUD",
              "CAD",
              "SGD",
            ]}
          />

          <Select
            label="Language"
            value={settings.language}
            onChange={(value) =>
              updateField("language", value)
            }
            options={[
              "English",
              "Hindi",
              "Kannada",
              "Tamil",
              "Telugu",
              "German",
              "French",
            ]}
          />

        </div>

      </div>

      {/* Working Hours */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

        <div className="px-8 py-6 border-b border-slate-200">

          <div className="flex items-center gap-3">

            <FaClock className="text-[#19D68C] text-xl" />

            <h2 className="text-xl font-bold text-slate-800">
              Working Hours
            </h2>

          </div>

          <p className="mt-2 text-sm text-slate-500">
            Define the standard working hours for your organization.
          </p>

        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">

          <TimeInput
            label="Start Time"
            value={settings.startTime}
            onChange={(value) =>
              updateField("startTime", value)
            }
          />

          <TimeInput
            label="End Time"
            value={settings.endTime}
            onChange={(value) =>
              updateField("endTime", value)
            }
          />

        </div>

      </div>

      {/* Save */}

      <div className="flex items-center justify-end gap-4">

        {saved && (
          <div className="flex items-center gap-2 text-sm font-semibold text-[#16B979]">
            <FaCheckCircle />
            Organization settings saved successfully.
          </div>
        )}

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="
            bg-[#19D68C]
            hover:bg-[#15c67e]
            disabled:opacity-60
            disabled:cursor-not-allowed
            text-white
            rounded-xl
            px-8
            py-3
            flex
            items-center
            gap-3
            font-semibold
            transition
          "
        >
          <FaSave />

          {saving ? "Saving..." : "Save Organization"}

        </button>

      </div>

    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div>

      <label className="block mb-2 font-medium text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="
          w-full
          rounded-xl
          border
          border-slate-300
          px-4
          py-3
          focus:ring-2
          focus:ring-[#19D68C]
          focus:border-[#19D68C]
          outline-none
          transition
        "
      />

    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div>

      <label className="block mb-2 font-medium text-slate-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="
          w-full
          rounded-xl
          border
          border-slate-300
          px-4
          py-3
          bg-white
          focus:ring-2
          focus:ring-[#19D68C]
          focus:border-[#19D68C]
          outline-none
          transition
        "
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

    </div>
  );
}

function TimeInput({
  label,
  value,
  onChange,
}) {
  return (
    <div>

      <label className="block mb-2 font-medium text-slate-700">
        {label}
      </label>

      <input
        type="time"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="
          w-full
          rounded-xl
          border
          border-slate-300
          px-4
          py-3
          focus:ring-2
          focus:ring-[#19D68C]
          focus:border-[#19D68C]
          outline-none
          transition
        "
      />

    </div>
  );
}