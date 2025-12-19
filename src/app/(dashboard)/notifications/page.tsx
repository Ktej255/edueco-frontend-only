"use client";

import { useEffect, useState } from "react";
import {
  useNotificationStore,
  type Notification,
} from "@/stores/notificationStore";
import NotificationItem from "@/components/notifications/NotificationItem";
import axios from "axios";
import {
  CheckCheck,
  Loader2,
  Bell,
  Filter,
  Sparkles,
  Mail,
  Trophy,
  Users,
} from "lucide-react";

export default function NotificationsPage() {
  const { notifications, setNotifications, setUnreadCount, markAllAsRead } =
    useNotificationStore();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const url =
        filter === "unread"
          ? `${process.env.NEXT_PUBLIC_API_URL}/notifications?unread_only=true&limit=100`
          : `${process.env.NEXT_PUBLIC_API_URL}/notifications?limit=100`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unread_count);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/read-all`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      markAllAsRead();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.is_read)
      : notifications;

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="container mx-auto px-6 py-8 max-w-5xl min-h-screen">
      {/* Enhanced Header */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
            <Bell className="h-8 w-8 text-blue-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent">
              Notifications
            </h1>
            <p className="text-gray-400 mt-1">
              Stay updated with your latest activities
            </p>
          </div>
          {unreadCount > 0 && (
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/30">
              <span className="text-white font-bold">{unreadCount} New</span>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Filter and Actions Bar */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800/50 border border-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-3 rounded-xl transition-all duration-300 font-semibold flex items-center gap-2 ${
                filter === "all"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30"
                  : "bg-gray-800/80 text-gray-300 hover:bg-gray-700/80 border border-gray-700/50"
              }`}
            >
              <Filter className="h-4 w-4" />
              All
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  filter === "all" ? "bg-white/20" : "bg-gray-700"
                }`}
              >
                {notifications.length}
              </span>
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-6 py-3 rounded-xl transition-all duration-300 font-semibold flex items-center gap-2 ${
                filter === "unread"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30"
                  : "bg-gray-800/80 text-gray-300 hover:bg-gray-700/80 border border-gray-700/50"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              Unread
              {unreadCount > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    filter === "unread"
                      ? "bg-white/20"
                      : "bg-purple-500/20 text-purple-400"
                  }`}
                >
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {notifications.some((n) => !n.is_read) && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-600/20 to-emerald-600/20 hover:from-green-600/30 hover:to-emerald-600/30 border border-green-500/30 rounded-xl transition-all duration-300 text-sm font-semibold text-green-400 hover:text-green-300"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Enhanced Notifications List */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800/50 rounded-2xl border border-gray-800/50 overflow-hidden backdrop-blur-sm shadow-xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
            <p className="text-gray-400 text-lg">Loading notifications...</p>
            <p className="text-gray-500 text-sm mt-2">Please wait</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="p-6 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 mb-6">
              <Bell className="h-16 w-16 text-gray-600" />
            </div>
            <p className="text-gray-300 text-xl font-semibold mb-2">
              {filter === "unread"
                ? "No unread notifications"
                : "No notifications yet"}
            </p>
            <p className="text-gray-500 text-sm">
              You're all caught up! Great job! 🎉
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800/50">
            {filteredNotifications.map((notification, index) => (
              <div
                key={notification.id}
                className={`transition-all duration-300 hover:bg-gray-800/30 ${
                  index === 0 ? "rounded-t-2xl" : ""
                } ${
                  index === filteredNotifications.length - 1
                    ? "rounded-b-2xl"
                    : ""
                }`}
              >
                <NotificationItem
                  notification={notification}
                  onClick={() => {
                    if (notification.action_url) {
                      window.location.href = notification.action_url;
                    }
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {notifications.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Mail className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total</p>
                <p className="text-white font-bold text-xl">
                  {notifications.length}
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Sparkles className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Unread</p>
                <p className="text-white font-bold text-xl">{unreadCount}</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Trophy className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Read</p>
                <p className="text-white font-bold text-xl">
                  {notifications.length - unreadCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
