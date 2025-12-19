"use client";

import { type Notification } from "@/stores/notificationStore";
import { useNotificationStore } from "@/stores/notificationStore";
import axios from "axios";
import {
  BookOpen,
  Award,
  Bell,
  FileText,
  UserPlus,
  CheckCircle,
} from "lucide-react";

interface NotificationItemProps {
  notification: Notification;
  onClick?: () => void;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "course_enrolled":
      return <BookOpen className="w-5 h-5 text-blue-500" />;
    case "certificate_issued":
      return <Award className="w-5 h-5 text-yellow-500" />;
    case "assignment_created":
    case "assignment_graded":
      return <FileText className="w-5 h-5 text-green-500" />;
    case "achievement_unlocked":
      return <CheckCircle className="w-5 h-5 text-purple-500" />;
    case "student_enrolled":
      return <UserPlus className="w-5 h-5 text-indigo-500" />;
    default:
      return <Bell className="w-5 h-5 text-gray-500" />;
  }
};

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export default function NotificationItem({
  notification,
  onClick,
}: NotificationItemProps) {
  const markAsRead = useNotificationStore((state) => state.markAsRead);

  const handleClick = async () => {
    if (!notification.is_read) {
      try {
        const token = localStorage.getItem("token");
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/notifications/${notification.id}/read`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        markAsRead(notification.id);
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }

    onClick?.();
  };

  return (
    <div
      onClick={handleClick}
      className={`p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
        !notification.is_read ? "bg-blue-50 dark:bg-blue-900/10" : ""
      }`}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-1">
          {getNotificationIcon(notification.type)}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {notification.title}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {notification.message}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            {formatTimeAgo(notification.created_at)}
          </p>
        </div>

        {!notification.is_read && (
          <div className="flex-shrink-0">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
}
