import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Activity,
  User,
  Clock,
} from "lucide-react";

import {
  getAuditLogs,
  getAuditLogSummary,
} from "../../../services/auditLogService";

// =====================================================
// HELPERS
// =====================================================

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatAction = (action) => {
  if (!action) return "Unknown Action";

  return action
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const getInitials = (name) => {
  if (!name) return "S";

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

// =====================================================
// COMPONENT
// =====================================================

export default function AuditLogs() {
  // ===================================================
  // STATE
  // ===================================================

  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    successful: 0,
    failed: 0,
    actionCounts: [],
    userActivity: [],
  });

  const [search, setSearch] = useState("");
  const [action, setAction] = useState("all");
  const [status, setStatus] = useState("all");
  const [userRole, setUserRole] = useState("all");

  const [page, setPage] = useState(1);
  const [limit] = useState(25);

  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // ===================================================
  // LOAD AUDIT LOGS
  // ===================================================

  const loadLogs = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await getAuditLogs({
        page,
        limit,
        action,
        status,
        userRole,
        search: search.trim(),
      });

      if (!response?.success) {
        throw new Error(
          response?.message || "Failed to load audit logs."
        );
      }

      setLogs(
        Array.isArray(response.logs)
          ? response.logs
          : []
      );

      setTotalLogs(
        Number(response.total) || 0
      );

      setTotalPages(
        Math.max(
          Number(response.totalPages) || 1,
          1
        )
      );
    } catch (err) {
      console.error(
        "LOAD AUDIT LOGS ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load audit logs."
      );

      setLogs([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ===================================================
  // LOAD SUMMARY
  // ===================================================

  const loadSummary = async () => {
    try {
      const response =
        await getAuditLogSummary();

      if (
        response?.success &&
        response?.summary
      ) {
        setSummary(response.summary);
      }
    } catch (err) {
      console.error(
        "LOAD AUDIT SUMMARY ERROR:",
        err
      );
    }
  };

  // ===================================================
  // INITIAL LOAD / FILTER LOAD
  // ===================================================

  useEffect(() => {
    loadLogs();
  }, [
    page,
    action,
    status,
    userRole,
    search,
  ]);

  useEffect(() => {
    loadSummary();
  }, []);

  // ===================================================
  // ACTION OPTIONS
  // ===================================================

  const actionOptions = useMemo(() => {
    const actions =
      Array.isArray(summary.actionCounts)
        ? summary.actionCounts
        : [];

    return actions.map(
      (item) => item?._id
    ).filter(Boolean);
  }, [summary.actionCounts]);

  // ===================================================
  // SEARCH HANDLER
  // ===================================================

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  // ===================================================
  // ACTION FILTER
  // ===================================================

  const handleActionChange = (event) => {
    setAction(event.target.value);
    setPage(1);
  };

  // ===================================================
  // STATUS FILTER
  // ===================================================

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setPage(1);
  };

  // ===================================================
  // ROLE FILTER
  // ===================================================

  const handleRoleChange = (event) => {
    setUserRole(event.target.value);
    setPage(1);
  };

  // ===================================================
  // REFRESH
  // ===================================================

  const handleRefresh = async () => {
    await Promise.all([
      loadLogs(true),
      loadSummary(),
    ]);
  };

  // ===================================================
  // CLEAR FILTERS
  // ===================================================

  const clearFilters = () => {
    setSearch("");
    setAction("all");
    setStatus("all");
    setUserRole("all");
    setPage(1);
  };

  // ===================================================
  // STATUS BADGE
  // ===================================================

  const renderStatus = (logStatus) => {
    const isSuccess =
      logStatus === "Success";

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
          isSuccess
            ? "bg-emerald-50 text-emerald-700"
            : "bg-red-50 text-red-700"
        }`}
      >
        {isSuccess ? (
          <CheckCircle2 size={13} />
        ) : (
          <XCircle size={13} />
        )}

        {logStatus || "Unknown"}
      </span>
    );
  };

  // ===================================================
  // PAGE RANGE
  // ===================================================

  const startRecord =
    totalLogs === 0
      ? 0
      : (page - 1) * limit + 1;

  const endRecord =
    Math.min(
      page * limit,
      totalLogs
    );

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="min-w-0 space-y-6">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                <ShieldCheck
                  size={25}
                  className="text-emerald-600"
                />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Audit Logs
                </h1>

                <p className="mt-1 text-slate-500">
                  Monitor important activities and
                  security events across your organization.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={18}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>
        </div>
      </div>

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* TOTAL */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Events
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {summary.total || 0}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
              <Activity
                size={22}
                className="text-blue-600"
              />
            </div>
          </div>
        </div>

        {/* SUCCESS */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Successful
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-600">
                {summary.successful || 0}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
              <CheckCircle2
                size={22}
                className="text-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* FAILED */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Failed
              </p>

              <p className="mt-2 text-3xl font-bold text-red-600">
                {summary.failed || 0}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
              <XCircle
                size={22}
                className="text-red-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          LOG TABLE CARD
      ================================================= */}

      <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* FILTERS */}

        <div className="border-b border-slate-200 p-5">
          <div className="flex flex-col gap-3 xl:flex-row">
            {/* SEARCH */}

            <div className="relative min-w-0 flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search audit logs..."
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* ACTION */}

            <select
              value={action}
              onChange={handleActionChange}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500"
            >
              <option value="all">
                All Actions
              </option>

              {actionOptions.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {formatAction(item)}
                  </option>
                )
              )}
            </select>

            {/* STATUS */}

            <select
              value={status}
              onChange={handleStatusChange}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500"
            >
              <option value="all">
                All Status
              </option>

              <option value="Success">
                Success
              </option>

              <option value="Failed">
                Failed
              </option>
            </select>

            {/* ROLE */}

            <select
              value={userRole}
              onChange={handleRoleChange}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500"
            >
              <option value="all">
                All Roles
              </option>

              <option value="manager">
                Manager
              </option>

              <option value="employee">
                Employee
              </option>

              <option value="teacher">
                Teacher
              </option>

              <option value="student">
                Student
              </option>

              <option value="system">
                System
              </option>
            </select>

            {/* CLEAR */}

            {(search ||
              action !== "all" ||
              status !== "all" ||
              userRole !== "all") && (
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="m-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <strong>
              Unable to load audit logs.
            </strong>

            <div className="mt-1">
              {error}
            </div>
          </div>
        )}

        {/* =================================================
            TABLE
        ================================================= */}

        <div className="min-w-0 overflow-x-auto">
          <table className="w-full min-w-[1050px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Date & Time
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  User
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Action
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Target
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Description
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-14 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <RefreshCw
                        size={25}
                        className="animate-spin text-emerald-500"
                      />

                      <span className="text-sm text-slate-500">
                        Loading audit logs...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-16 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                        <ShieldCheck
                          size={26}
                          className="text-slate-400"
                        />
                      </div>

                      <h3 className="mt-4 text-lg font-semibold text-slate-800">
                        No audit logs found
                      </h3>

                      <p className="mt-1 max-w-md text-sm text-slate-500">
                        No activity matches your current
                        filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log._id}
                    className="border-b border-slate-100 transition hover:bg-slate-50"
                  >
                    {/* DATE */}

                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Clock
                          size={15}
                          className="text-slate-400"
                        />

                        <span className="text-sm text-slate-700">
                          {formatDate(
                            log.createdAt
                          )}
                        </span>
                      </div>
                    </td>

                    {/* USER */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-700">
                          {getInitials(
                            log.userName
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="font-medium text-slate-800">
                            {log.userName ||
                              "System"}
                          </p>

                          <p className="max-w-[220px] truncate text-xs text-slate-500">
                            {log.userEmail ||
                              log.userRole ||
                              "system"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* ACTION */}

                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                        {formatAction(
                          log.action
                        )}
                      </span>
                    </td>

                    {/* TARGET */}

                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          {log.targetName ||
                            "—"}
                        </p>

                        {log.targetType && (
                          <p className="mt-0.5 text-xs text-slate-400">
                            {log.targetType}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* STATUS */}

                    <td className="px-5 py-4">
                      {renderStatus(
                        log.status
                      )}
                    </td>

                    {/* DESCRIPTION */}

                    <td className="max-w-[350px] px-5 py-4">
                      <p className="line-clamp-2 text-sm text-slate-600">
                        {log.description ||
                          "No description provided."}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* =================================================
            PAGINATION
        ================================================= */}

        {!loading &&
          totalLogs > 0 && (
            <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-700">
                  {startRecord}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-slate-700">
                  {endRecord}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700">
                  {totalLogs}
                </span>{" "}
                logs
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setPage(
                      (current) =>
                        Math.max(
                          current - 1,
                          1
                        )
                    )
                  }
                  disabled={page <= 1}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <span className="px-3 text-sm font-medium text-slate-600">
                  Page {page} of{" "}
                  {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setPage(
                      (current) =>
                        Math.min(
                          current + 1,
                          totalPages
                        )
                    )
                  }
                  disabled={
                    page >= totalPages
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}