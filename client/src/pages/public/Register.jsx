import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    organizationName: "",
    managerName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // UPDATE FIELD
  // =====================================================

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    // Clear errors while user is correcting the form
    if (error) {
      setError("");
    }
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (event) => {
    if (event) {
      event.preventDefault();
    }

    console.log("REGISTER BUTTON CLICKED");

    // Prevent duplicate submission
    if (loading) {
      console.log("Registration already in progress.");
      return;
    }

    setError("");
    setSuccess("");

    const organizationName =
      form.organizationName.trim();

    const managerName =
      form.managerName.trim();

    const email =
      form.email.trim().toLowerCase();

    const password =
      form.password;

    const confirmPassword =
      form.confirmPassword;

    console.log("REGISTER FORM DATA:", {
      organizationName,
      managerName,
      email,
      passwordLength: password.length,
    });

    // =====================================================
    // REQUIRED FIELDS
    // =====================================================

    if (!organizationName) {
      setError(
        "Please enter your organization name."
      );
      return;
    }

    if (!managerName) {
      setError(
        "Please enter your full name."
      );
      return;
    }

    if (!email) {
      setError(
        "Please enter your work email."
      );
      return;
    }

    // =====================================================
    // EMAIL
    // =====================================================

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError(
        "Please enter a valid email address."
      );
      return;
    }

    // =====================================================
    // PASSWORD
    // =====================================================

    if (!password) {
      setError(
        "Please create a password."
      );
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError(
        "Password must contain at least one uppercase letter."
      );
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError(
        "Password must contain at least one number."
      );
      return;
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      setError(
        "Password must contain at least one special character."
      );
      return;
    }

    // =====================================================
    // CONFIRM PASSWORD
    // =====================================================

    if (!confirmPassword) {
      setError(
        "Please confirm your password."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    // =====================================================
    // API REQUEST
    // =====================================================

    try {
      setLoading(true);

      console.log(
        "Creating organization..."
      );

      const response = await fetch(
        `${API_BASE_URL}/auth/register-organization`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            organizationName,
            managerName,
            email,
            password,
          }),
        }
      );

      console.log(
        "Registration HTTP status:",
        response.status
      );

      let data;

      try {
        data = await response.json();
      } catch (jsonError) {
        console.error(
          "Failed to parse registration response:",
          jsonError
        );

        throw new Error(
          "The server returned an invalid response."
        );
      }

      console.log(
        "Registration response:",
        data
      );

      // ===================================================
      // API ERROR
      // ===================================================

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to create your organization."
        );
      }

      // ===================================================
      // SUCCESS
      // ===================================================

      setSuccess(
        "Organization created successfully. Redirecting to login..."
      );

      // ===================================================
      // REDIRECT
      // ===================================================

      setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: {
            registrationSuccess: true,
            email,
          },
        });
      }, 1200);
    } catch (err) {
      console.error(
        "ORGANIZATION REGISTRATION ERROR:",
        err
      );

      setError(
        err?.message ||
          "Unable to create your organization. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">

      <div className="grid min-h-screen lg:grid-cols-2">

        {/* =================================================
            LEFT — PRODUCT MESSAGE
        ================================================= */}

        <div className="relative hidden overflow-hidden lg:flex">

          <div className="absolute inset-0 bg-slate-950" />

          <div className="absolute left-[-150px] top-[-150px] h-[500px] w-[500px] rounded-full bg-slate-800/60 blur-3xl" />

          <div className="absolute bottom-[-200px] right-[-100px] h-[500px] w-[500px] rounded-full bg-slate-800/50 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

            {/* Logo */}

            <Link
              to="/"
              className="flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-950">
                <Sparkles size={21} />
              </div>

              <div>
                <div className="text-xl font-bold text-white">
                  SkillOS
                </div>

                <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">
                  Intelligent Learning Platform
                </div>
              </div>
            </Link>

            {/* Message */}

            <div className="max-w-xl">

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-400">
                <Sparkles size={14} />
                Start your SkillOS workspace
              </div>

              <h1 className="text-5xl font-bold leading-tight tracking-tight text-white xl:text-6xl">
                Build a smarter
                <span className="block text-slate-500">
                  learning organization.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
                Bring your company's knowledge,
                SOPs, onboarding, training and
                employee development into one
                intelligent platform.
              </p>

              <div className="mt-10 space-y-5">

                <RegistrationBenefit
                  title="Centralize company knowledge"
                  description="Turn organizational processes into structured learning."
                />

                <RegistrationBenefit
                  title="Train employees consistently"
                  description="Give every employee a clear and measurable learning journey."
                />

                <RegistrationBenefit
                  title="Measure learning performance"
                  description="Track courses, assessments, progress and completion."
                />

              </div>

            </div>

            {/* Footer */}

            <p className="text-xs text-slate-600">
              By creating an organization, you agree to
              the SkillOS platform terms and policies.
            </p>

          </div>
        </div>

        {/* =================================================
            RIGHT — REGISTRATION
        ================================================= */}

        <div className="flex items-center justify-center bg-slate-50 px-6 py-10 sm:px-10">

          <div className="w-full max-w-xl">

            {/* Mobile logo */}

            <div className="mb-8 lg:hidden">

              <Link
                to="/"
                className="inline-flex items-center gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
                  <Sparkles size={19} />
                </div>

                <span className="text-xl font-bold">
                  SkillOS
                </span>
              </Link>

            </div>

            {/* Heading */}

            <div className="mb-8">

              <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                Get started
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Create your organization
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Set up your SkillOS workspace and
                create the first manager account.
              </p>

            </div>

            {/* Form card */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">

              {/* Success */}

              {success && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-700">

                  <CheckCircle2
                    size={19}
                    className="mt-0.5 shrink-0"
                  />

                  <span>
                    {success}
                  </span>

                </div>
              )}

              {/* Error */}

              {error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              {/* =================================================
                  FORM

                  noValidate is intentional.
                  React performs all validation above.
              ================================================= */}

              <form
                onSubmit={handleSubmit}
                noValidate
                className="space-y-6"
              >

                {/* =========================================
                    ORGANIZATION
                ========================================= */}

                <div>

                  <div className="mb-4 flex items-center gap-2">

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                      <Building2 size={16} />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Organization
                      </h3>

                      <p className="text-xs text-slate-400">
                        Your company's SkillOS workspace
                      </p>
                    </div>

                  </div>

                  <Field
                    label="Organization Name"
                    icon={Building2}
                    value={
                      form.organizationName
                    }
                    onChange={(value) =>
                      updateField(
                        "organizationName",
                        value
                      )
                    }
                    placeholder="e.g. Acme Technologies"
                  />

                </div>

                {/* =========================================
                    MANAGER
                ========================================= */}

                <div>

                  <div className="mb-4 flex items-center gap-2">

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                      <User size={16} />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Manager Account
                      </h3>

                      <p className="text-xs text-slate-400">
                        This account will manage your organization
                      </p>
                    </div>

                  </div>

                  <div className="space-y-4">

                    <Field
                      label="Full Name"
                      icon={User}
                      value={
                        form.managerName
                      }
                      onChange={(value) =>
                        updateField(
                          "managerName",
                          value
                        )
                      }
                      placeholder="Your full name"
                    />

                    <Field
                      label="Work Email"
                      icon={Mail}
                      type="email"
                      value={form.email}
                      onChange={(value) =>
                        updateField(
                          "email",
                          value
                        )
                      }
                      placeholder="you@company.com"
                    />

                    <PasswordField
                      label="Password"
                      value={form.password}
                      onChange={(value) =>
                        updateField(
                          "password",
                          value
                        )
                      }
                      visible={showPassword}
                      onToggle={() =>
                        setShowPassword(
                          (previous) =>
                            !previous
                        )
                      }
                      placeholder="Create a strong password"
                    />

                    <PasswordField
                      label="Confirm Password"
                      value={
                        form.confirmPassword
                      }
                      onChange={(value) =>
                        updateField(
                          "confirmPassword",
                          value
                        )
                      }
                      visible={
                        showConfirmPassword
                      }
                      onToggle={() =>
                        setShowConfirmPassword(
                          (previous) =>
                            !previous
                        )
                      }
                      placeholder="Enter your password again"
                    />

                  </div>

                </div>

                {/* Password requirements */}

                <div className="rounded-xl bg-slate-50 p-4">

                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">

                    <ShieldCheck size={15} />

                    Password requirements

                  </div>

                  <div className="mt-3 grid gap-2 text-xs text-slate-500 sm:grid-cols-2">

                    <Requirement
                      valid={
                        form.password.length >=
                        8
                      }
                      text="At least 8 characters"
                    />

                    <Requirement
                      valid={
                        /[A-Z]/.test(
                          form.password
                        )
                      }
                      text="One uppercase letter"
                    />

                    <Requirement
                      valid={
                        /[0-9]/.test(
                          form.password
                        )
                      }
                      text="One number"
                    />

                    <Requirement
                      valid={
                        /[^A-Za-z0-9]/.test(
                          form.password
                        )
                      }
                      text="One special character"
                    />

                  </div>

                </div>

                {/* Submit */}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {loading
                    ? "Creating Organization..."
                    : "Create Organization"}

                  {!loading && (
                    <ArrowRight size={17} />
                  )}

                </button>

              </form>

              {/* Login */}

              <div className="mt-7 border-t border-slate-200 pt-6 text-center">

                <p className="text-sm text-slate-500">
                  Already have a SkillOS account?
                </p>

                <Link
                  to="/login"
                  className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-slate-950 hover:underline"
                >
                  Sign in
                  <ArrowRight size={14} />
                </Link>

              </div>

            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">

              <LockKeyhole size={13} />

              Your account information is securely processed.

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}


/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">

        <Icon
          size={17}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type={type}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
        />

      </div>

    </div>
  );
}


/* =========================================================
   PASSWORD FIELD
========================================================= */

function PasswordField({
  label,
  value,
  onChange,
  visible,
  onToggle,
  placeholder,
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">

        <LockKeyhole
          size={17}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type={
            visible
              ? "text"
              : "password"
          }
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label={
            visible
              ? "Hide password"
              : "Show password"
          }
        >
          {visible ? (
            <EyeOff size={17} />
          ) : (
            <Eye size={17} />
          )}
        </button>

      </div>

    </div>
  );
}


/* =========================================================
   REQUIREMENT
========================================================= */

function Requirement({
  valid,
  text,
}) {
  return (
    <div className="flex items-center gap-2">

      <CheckCircle2
        size={14}
        className={
          valid
            ? "text-green-500"
            : "text-slate-300"
        }
      />

      <span
        className={
          valid
            ? "text-slate-700"
            : "text-slate-400"
        }
      >
        {text}
      </span>

    </div>
  );
}


/* =========================================================
   REGISTRATION BENEFIT
========================================================= */

function RegistrationBenefit({
  title,
  description,
}) {
  return (
    <div className="flex gap-4">

      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
        <CheckCircle2 size={17} />
      </div>

      <div>

        <p className="text-sm font-bold text-white">
          {title}
        </p>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>

      </div>

    </div>
  );
}