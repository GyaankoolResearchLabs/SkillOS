import { useEffect, useState } from "react";
import {
  FaBell,
  FaCheck,
  FaCheckDouble,
  FaClock,
  FaSpinner,
} from "react-icons/fa";
import toast from "react-hot-toast";

import api from "../../../services/api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const [markingId, setMarkingId] =
    useState(null);

  // =====================================================
  // LOAD NOTIFICATIONS
  // =====================================================

  const loadNotifications = async () => {
    try {
      setLoading(true);

      const response =
        await api.get("/notifications");

      const data = response.data;

      setNotifications(
        data.notifications || []
      );

      setUnreadCount(
        data.unreadCount || 0
      );
    } catch (error) {
      console.error(
        "LOAD NOTIFICATIONS ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadNotifications();
  }, []);

  // =====================================================
  // MARK ONE AS READ
  // =====================================================

  const markAsRead = async (
    notificationId
  ) => {
    try {
      setMarkingId(notificationId);

      await api.patch(
        `/notifications/${notificationId}/read`
      );

      setNotifications(
        (current) =>
          current.map(
            (notification) =>
              notification._id ===
              notificationId
                ? {
                    ...notification,
                    read: true,
                  }
                : notification
          )
      );

      setUnreadCount(
        (current) =>
          Math.max(0, current - 1)
      );
    } catch (error) {
      console.error(
        "MARK NOTIFICATION READ ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to mark notification as read."
      );
    } finally {
      setMarkingId(null);
    }
  };

  // =====================================================
  // MARK ALL AS READ
  // =====================================================

  const markAllAsRead = async () => {
    if (unreadCount === 0) {
      return;
    }

    try {
      setMarkingAll(true);

      await api.patch(
        "/notifications/read-all"
      );

      setNotifications(
        (current) =>
          current.map(
            (notification) => ({
              ...notification,
              read: true,
            })
          )
      );

      setUnreadCount(0);

      toast.success(
        "All notifications marked as read."
      );
    } catch (error) {
      console.error(
        "MARK ALL NOTIFICATIONS READ ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to mark notifications as read."
      );
    } finally {
      setMarkingAll(false);
    }
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "";
    }

    return parsedDate.toLocaleString(
      [],
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-full bg-slate-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 flex flex-col items-center justify-center">
            <FaSpinner className="animate-spin text-[#19D68C] text-2xl" />

            <p className="mt-4 text-sm font-medium text-slate-500">
              Loading notifications...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-full bg-slate-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-xl bg-[#19D68C]/10 flex items-center justify-center">
                <FaBell className="text-[#19D68C] text-lg" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Notifications
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Stay updated with important
                  SkillOS activities and workflow
                  alerts.
                </p>
              </div>

            </div>

            <div className="flex items-center gap-3">

              <div className="px-3 py-2 rounded-lg bg-slate-100">
                <span className="text-xs text-slate-500">
                  Unread
                </span>

                <span className="ml-2 text-sm font-bold text-slate-900">
                  {unreadCount}
                </span>
              </div>

              <button
                type="button"
                onClick={markAllAsRead}
                disabled={
                  unreadCount === 0 ||
                  markingAll
                }
                className="
                  inline-flex
                  items-center
                  gap-2
                  px-4
                  py-2.5
                  rounded-xl
                  bg-[#19D68C]
                  text-white
                  text-sm
                  font-semibold
                  hover:bg-[#15C67D]
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  transition
                "
              >
                {markingAll ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaCheckDouble />
                )}

                Mark all as read
              </button>

            </div>
          </div>
        </div>

        {/* =================================================
            NOTIFICATION LIST
        ================================================= */}

        <div className="mt-5">

          {notifications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">

              <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center">
                <FaBell className="text-slate-400 text-xl" />
              </div>

              <h2 className="mt-5 text-lg font-bold text-slate-900">
                No notifications
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                You're all caught up. New
                notifications will appear here.
              </p>

            </div>
          ) : (
            <div className="space-y-3">

              {notifications.map(
                (notification) => (
                  <div
                    key={
                      notification._id
                    }
                    className={`
                      bg-white
                      rounded-2xl
                      border
                      shadow-sm
                      p-5
                      transition
                      ${
                        notification.read
                          ? "border-slate-200"
                          : "border-[#19D68C]/40 bg-[#19D68C]/[0.025]"
                      }
                    `}
                  >

                    <div className="flex items-start gap-4">

                      {/* ICON */}

                      <div
                        className={`
                          w-11
                          h-11
                          rounded-xl
                          flex
                          items-center
                          justify-center
                          shrink-0
                          ${
                            notification.read
                              ? "bg-slate-100 text-slate-400"
                              : "bg-[#19D68C]/10 text-[#19D68C]"
                          }
                        `}
                      >
                        <FaBell />
                      </div>

                      {/* CONTENT */}

                      <div className="flex-1 min-w-0">

                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">

                          <div className="min-w-0">

                            <div className="flex items-center gap-2">

                              <h3 className="text-base font-bold text-slate-900">
                                {
                                  notification.title
                                }
                              </h3>

                              {!notification.read && (
                                <span className="w-2 h-2 rounded-full bg-[#19D68C] shrink-0" />
                              )}

                            </div>

                            <p className="mt-2 text-sm leading-6 text-slate-600">
                              {
                                notification.message
                              }
                            </p>

                          </div>

                          {!notification.read && (
                            <span className="shrink-0 inline-flex items-center px-2.5 py-1 rounded-full bg-[#19D68C]/10 text-[#159B6B] text-xs font-semibold">
                              New
                            </span>
                          )}

                        </div>

                        {/* FOOTER */}

                        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <FaClock />

                            <span>
                              {formatDate(
                                notification.createdAt
                              )}
                            </span>
                          </div>

                          {!notification.read && (
                            <button
                              type="button"
                              onClick={() =>
                                markAsRead(
                                  notification._id
                                )
                              }
                              disabled={
                                markingId ===
                                notification._id
                              }
                              className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                px-3
                                py-2
                                rounded-lg
                                border
                                border-slate-200
                                text-slate-600
                                text-xs
                                font-semibold
                                hover:bg-slate-50
                                disabled:opacity-50
                                transition
                              "
                            >
                              {markingId ===
                              notification._id ? (
                                <FaSpinner className="animate-spin" />
                              ) : (
                                <FaCheck />
                              )}

                              Mark as read
                            </button>
                          )}

                        </div>

                      </div>
                    </div>
                  </div>
                )
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}