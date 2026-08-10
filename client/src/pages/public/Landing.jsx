import {
  ArrowRight,
  Brain,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Play,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">

          {/* Logo */}

          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm">
              <Sparkles size={21} />
            </div>

            <div>
              <div className="text-xl font-bold tracking-tight">
                SkillOS
              </div>

              <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
                Intelligent Learning Platform
              </div>
            </div>
          </Link>

          {/* Navigation */}

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              How It Works
            </a>

            <a
              href="#solutions"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              Solutions
            </a>

            <a
              href="#pricing"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              Pricing
            </a>
          </nav>

          {/* Actions */}

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden text-sm font-semibold text-slate-700 transition hover:text-slate-950 sm:block"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Get Started
              <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </header>


      {/* =====================================================
          HERO
      ===================================================== */}

      <main>

        <section className="relative overflow-hidden">

          {/* Background decoration */}

          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-[-250px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-slate-200/50 blur-3xl" />
            <div className="absolute right-[-200px] top-[300px] h-[400px] w-[400px] rounded-full bg-blue-100/40 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-8 lg:pb-32 lg:pt-28">

            <div className="mx-auto max-w-4xl text-center">

              {/* Badge */}

              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm">
                <Sparkles size={14} />
                AI-Powered Learning & Employee Enablement
              </div>

              {/* Heading */}

              <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                Turn your company's
                <span className="block text-slate-500">
                  knowledge into skills.
                </span>
              </h1>

              {/* Description */}

              <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-600">
                SkillOS transforms your company's SOPs and organizational
                knowledge into structured employee training, onboarding,
                assessments, and measurable learning experiences.
              </p>

              {/* CTA */}

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">

                <Link
                  to="/register"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-slate-800 sm:w-auto"
                >
                  Start Building Your Workforce
                  <ArrowRight size={17} />
                </Link>

                <a
                  href="#how-it-works"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
                >
                  <Play size={16} />
                  See How It Works
                </a>

              </div>

            </div>


            {/* =================================================
                PRODUCT PREVIEW
            ================================================= */}

            <div className="relative mx-auto mt-20 max-w-6xl">

              <div className="absolute -inset-4 rounded-[2rem] bg-slate-200/40 blur-2xl" />

              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

                {/* Browser top */}

                <div className="flex h-12 items-center border-b border-slate-200 bg-slate-50 px-5">
                  <div className="flex gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                    <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                    <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  </div>

                  <div className="mx-auto hidden rounded-lg border border-slate-200 bg-white px-20 py-1.5 text-[10px] text-slate-400 sm:block">
                    app.skillos.ai
                  </div>
                </div>

                {/* Fake dashboard */}

                <div className="grid min-h-[420px] grid-cols-12 bg-slate-50">

                  {/* Sidebar */}

                  <div className="hidden border-r border-slate-200 bg-white p-5 md:col-span-3 md:block">

                    <div className="mb-8 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-white">
                        <Sparkles size={15} />
                      </div>
                      <span className="font-bold">SkillOS</span>
                    </div>

                    <div className="space-y-2">

                      <div className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold">
                        Dashboard
                      </div>

                      <div className="px-3 py-2 text-xs text-slate-500">
                        Employees
                      </div>

                      <div className="px-3 py-2 text-xs text-slate-500">
                        Courses
                      </div>

                      <div className="px-3 py-2 text-xs text-slate-500">
                        SOPs
                      </div>

                      <div className="px-3 py-2 text-xs text-slate-500">
                        Analytics
                      </div>

                    </div>

                  </div>


                  {/* Dashboard */}

                  <div className="col-span-12 p-6 md:col-span-9 lg:p-8">

                    <div className="mb-6 flex items-center justify-between">

                      <div>
                        <p className="text-xs font-medium text-slate-400">
                          ORGANIZATION
                        </p>

                        <h3 className="mt-1 text-xl font-bold">
                          Learning Overview
                        </h3>
                      </div>

                      <div className="hidden rounded-lg bg-slate-950 px-4 py-2 text-xs font-semibold text-white sm:block">
                        + Create SOP
                      </div>

                    </div>


                    <div className="grid gap-4 sm:grid-cols-3">

                      <div className="rounded-xl border border-slate-200 bg-white p-5">
                        <Users className="mb-4 text-slate-500" size={20} />
                        <p className="text-xs text-slate-400">
                          Employees
                        </p>
                        <p className="mt-1 text-2xl font-bold">
                          248
                        </p>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-white p-5">
                        <GraduationCap
                          className="mb-4 text-slate-500"
                          size={20}
                        />
                        <p className="text-xs text-slate-400">
                          Active Courses
                        </p>
                        <p className="mt-1 text-2xl font-bold">
                          36
                        </p>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-white p-5">
                        <ClipboardCheck
                          className="mb-4 text-slate-500"
                          size={20}
                        />
                        <p className="text-xs text-slate-400">
                          Completion
                        </p>
                        <p className="mt-1 text-2xl font-bold">
                          87%
                        </p>
                      </div>

                    </div>


                    <div className="mt-5 grid gap-5 lg:grid-cols-5">

                      <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-3">

                        <div className="mb-5 flex items-center justify-between">
                          <h4 className="text-sm font-bold">
                            Employee Progress
                          </h4>

                          <span className="text-xs text-slate-400">
                            This month
                          </span>
                        </div>

                        <div className="space-y-4">

                          {[78, 64, 91, 52].map((value, index) => (
                            <div key={index}>

                              <div className="mb-1.5 flex justify-between text-xs">
                                <span className="text-slate-500">
                                  Training Module {index + 1}
                                </span>

                                <span className="font-semibold">
                                  {value}%
                                </span>
                              </div>

                              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                <div
                                  className="h-full rounded-full bg-slate-900"
                                  style={{
                                    width: `${value}%`,
                                  }}
                                />
                              </div>

                            </div>
                          ))}

                        </div>

                      </div>


                      <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">

                        <div className="mb-5 flex items-center gap-2">
                          <Brain size={18} />
                          <h4 className="text-sm font-bold">
                            AI Insights
                          </h4>
                        </div>

                        <div className="space-y-3">

                          <div className="rounded-lg bg-slate-50 p-3">
                            <p className="text-xs font-semibold">
                              Training Opportunity
                            </p>

                            <p className="mt-1 text-[11px] leading-5 text-slate-500">
                              12 employees may need additional support.
                            </p>
                          </div>

                          <div className="rounded-lg bg-slate-50 p-3">
                            <p className="text-xs font-semibold">
                              Strong Performance
                            </p>

                            <p className="mt-1 text-[11px] leading-5 text-slate-500">
                              Compliance training completion increased.
                            </p>
                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            TRUST STRIP
        ===================================================== */}

        <section className="border-y border-slate-200 bg-white">

          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-6 py-8 sm:flex-row lg:px-8">

            <p className="text-sm font-medium text-slate-500">
              Built for organizations that want smarter employee development.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <span>Onboarding</span>
              <span>Training</span>
              <span>Compliance</span>
              <span>Performance</span>
              <span>AI</span>
            </div>

          </div>

        </section>


        {/* =====================================================
            FEATURES
        ===================================================== */}

        <section
          id="features"
          className="scroll-mt-20 bg-white py-24"
        >

          <div className="mx-auto max-w-7xl px-6 lg:px-8">

            <div className="max-w-2xl">

              <div className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500">
                <Zap size={16} />
                Everything in one platform
              </div>

              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                From company knowledge
                <span className="block text-slate-400">
                  to employee capability.
                </span>
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                SkillOS brings your organization's training workflow into
                one connected system.
              </p>

            </div>


            <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

              <FeatureCard
                icon={FileText}
                title="AI-Powered SOPs"
                description="Upload your organization's SOPs and turn them into structured learning experiences."
              />

              <FeatureCard
                icon={Brain}
                title="Intelligent Course Creation"
                description="Transform organizational knowledge into lessons, modules, quizzes, and assessments."
              />

              <FeatureCard
                icon={Users}
                title="Employee Management"
                description="Manage employees, roles, departments, assignments, and learning journeys."
              />

              <FeatureCard
                icon={GraduationCap}
                title="Employee Learning"
                description="Give employees a dedicated learning environment to complete their assigned training."
              />

              <FeatureCard
                icon={ClipboardCheck}
                title="Assessments"
                description="Measure understanding through quizzes, module assessments, and final evaluations."
              />

              <FeatureCard
                icon={LayoutDashboard}
                title="Manager Insights"
                description="Understand training activity, employee progress, and organizational learning performance."
              />

            </div>

          </div>

        </section>


        {/* =====================================================
            HOW IT WORKS
        ===================================================== */}

        <section
          id="how-it-works"
          className="scroll-mt-20 bg-slate-950 py-24 text-white"
        >

          <div className="mx-auto max-w-7xl px-6 lg:px-8">

            <div className="mx-auto max-w-2xl text-center">

              <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                How SkillOS works
              </p>

              <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                One workflow.
                <span className="block text-slate-500">
                  Complete learning system.
                </span>
              </h2>

            </div>


            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

              <ProcessCard
                number="01"
                icon={FileText}
                title="Bring Your Knowledge"
                description="Upload your SOPs, processes, and organizational knowledge."
              />

              <ProcessCard
                number="02"
                icon={Brain}
                title="Let SkillOS Build"
                description="AI converts your knowledge into structured training content."
              />

              <ProcessCard
                number="03"
                icon={GraduationCap}
                title="Employees Learn"
                description="Assign courses and let employees learn through their dedicated portal."
              />

              <ProcessCard
                number="04"
                icon={LayoutDashboard}
                title="Managers Measure"
                description="Track progress, assessments, completion, and learning performance."
              />

            </div>

          </div>

        </section>


        {/* =====================================================
            SOLUTIONS
        ===================================================== */}

        <section
          id="solutions"
          className="scroll-mt-20 bg-slate-50 py-24"
        >

          <div className="mx-auto max-w-7xl px-6 lg:px-8">

            <div className="grid items-center gap-16 lg:grid-cols-2">

              <div>

                <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                  Built for modern organizations
                </p>

                <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                  Stop repeating the same training.
                </h2>

                <p className="mt-6 text-lg leading-8 text-slate-600">
                  Your best processes shouldn't live inside someone's head,
                  scattered documents, or endless training sessions.
                  SkillOS turns organizational knowledge into a repeatable
                  learning system.
                </p>

                <div className="mt-8 space-y-4">

                  <Benefit text="Standardize employee onboarding" />
                  <Benefit text="Convert SOPs into structured training" />
                  <Benefit text="Create role-specific learning paths" />
                  <Benefit text="Measure employee learning progress" />
                  <Benefit text="Give managers centralized visibility" />

                </div>

              </div>


              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">

                <div className="mb-8 flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 text-white">
                    <ShieldCheck size={22} />
                  </div>

                  <div>
                    <p className="font-bold">
                      Organizational Knowledge
                    </p>

                    <p className="text-sm text-slate-500">
                      Your company's most valuable asset
                    </p>
                  </div>

                </div>


                <div className="space-y-3">

                  <FlowBox
                    icon={FileText}
                    text="Company SOP"
                  />

                  <div className="flex justify-center">
                    <ChevronRight
                      className="rotate-90 text-slate-300"
                      size={18}
                    />
                  </div>

                  <FlowBox
                    icon={Brain}
                    text="SkillOS AI"
                  />

                  <div className="flex justify-center">
                    <ChevronRight
                      className="rotate-90 text-slate-300"
                      size={18}
                    />
                  </div>

                  <FlowBox
                    icon={GraduationCap}
                    text="Employee Training"
                  />

                  <div className="flex justify-center">
                    <ChevronRight
                      className="rotate-90 text-slate-300"
                      size={18}
                    />
                  </div>

                  <FlowBox
                    icon={ClipboardCheck}
                    text="Measured Capability"
                  />

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            PRICING
        ===================================================== */}

        <section
          id="pricing"
          className="scroll-mt-20 bg-white py-24"
        >

          <div className="mx-auto max-w-7xl px-6 lg:px-8">

            <div className="mx-auto max-w-2xl text-center">

              <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                Simple to start
              </p>

              <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                Start building a smarter workforce.
              </h2>

              <p className="mt-5 text-lg text-slate-600">
                Choose the SkillOS plan that fits your organization.
              </p>

            </div>


            <div className="mx-auto mt-14 max-w-lg">

              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      SkillOS
                    </p>

                    <h3 className="mt-1 text-2xl font-bold">
                      Business
                    </h3>
                  </div>

                  <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
                    Flexible
                  </div>

                </div>


                <p className="mt-5 text-sm leading-6 text-slate-500">
                  Everything your organization needs to manage employee
                  onboarding, training, assessments, and learning.
                </p>


                <div className="my-7 border-t border-slate-200" />


                <div className="space-y-3">

                  <Benefit text="AI-powered SOP to training workflow" />
                  <Benefit text="Employee learning portal" />
                  <Benefit text="Manager dashboard" />
                  <Benefit text="Courses and assessments" />
                  <Benefit text="Organization management" />

                </div>


                <Link
                  to="/register"
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Get Started
                  <ArrowRight size={17} />
                </Link>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            CTA
        ===================================================== */}

        <section
          id="get-started"
          className="scroll-mt-20 bg-slate-950 py-24 text-white"
        >

          <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-950">
              <Sparkles size={25} />
            </div>

            <h2 className="mt-7 text-4xl font-bold tracking-tight sm:text-5xl">
              Your organization's knowledge
              <span className="block text-slate-500">
                deserves a better system.
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              Build a repeatable employee learning system with SkillOS.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">

              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Create Your Organization
                <ArrowRight size={17} />
              </Link>

              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-900"
              >
                Explore Features
              </a>

            </div>

          </div>

        </section>

      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-slate-200 bg-white">

        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">

          <div className="flex items-center gap-2">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-white">
              <Sparkles size={15} />
            </div>

            <span className="font-bold">
              SkillOS
            </span>

          </div>

          <p className="text-xs text-slate-400">
            Intelligent learning infrastructure for modern organizations.
          </p>

          <div className="flex gap-5 text-xs font-medium text-slate-500">

            <a
              href="#features"
              className="hover:text-slate-950"
            >
              Features
            </a>

            <a
              href="#pricing"
              className="hover:text-slate-950"
            >
              Pricing
            </a>

            <Link
              to="/login"
              className="hover:text-slate-950"
            >
              Login
            </Link>

          </div>

        </div>

      </footer>

    </div>
  );
}


/* =========================================================
   FEATURE CARD
========================================================= */

function FeatureCard({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-slate-950 group-hover:text-white">
        <Icon size={20} />
      </div>

      <h3 className="mt-6 text-lg font-bold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        {description}
      </p>

    </div>
  );
}


/* =========================================================
   PROCESS CARD
========================================================= */

function ProcessCard({
  number,
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <div className="flex items-center justify-between">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-950">
          <Icon size={20} />
        </div>

        <span className="text-xs font-bold tracking-widest text-slate-600">
          {number}
        </span>

      </div>

      <h3 className="mt-7 text-lg font-bold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        {description}
      </p>

    </div>
  );
}


/* =========================================================
   BENEFIT
========================================================= */

function Benefit({ text }) {
  return (
    <div className="flex items-start gap-3">

      <CheckCircle2
        size={18}
        className="mt-0.5 shrink-0 text-slate-700"
      />

      <span className="text-sm text-slate-600">
        {text}
      </span>

    </div>
  );
}


/* =========================================================
   FLOW BOX
========================================================= */

function FlowBox({
  icon: Icon,
  text,
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-slate-700 shadow-sm">
        <Icon size={18} />
      </div>

      <span className="text-sm font-semibold">
        {text}
      </span>

    </div>
  );
}


export default Landing;