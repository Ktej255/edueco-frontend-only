/**
 * React Hook for Real-Time Notifications
 * Manages WebSocket connection and notification state
 */

import { useEffect, useState, useCallback } from "react";
import { notificationsWS } from "@/utils/websocket";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  data?: any;
  action_url?: string;
  priority?: "low" | "normal" | "high" | "urgent";
  created_at: string;
  is_read: boolean;
}

export interface OnlineUser {
  user_id: number;
  user_name: string;
}

export function useRealtimeNotifications() {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  // Connect to WebSocket
  useEffect(() => {
    if (!user || !token) return;

    // Connect to notifications WebSocket
    const wsUrl = `/api/v1/ws/notifications/${user.id}`;
    notificationsWS.connect(token);

    // Handle connection
    notificationsWS.onConnect(() => {
      console.log("✅ Connected to notifications");
      setIsConnected(true);
    });

    // Handle disconnection
    notificationsWS.onDisconnect(() => {
      console.log("🔌 Disconnected from notifications");
      setIsConnected(false);
    });

    // Handle incoming notifications
    notificationsWS.on("notification", (message) => {
      const notification = message.notification as Notification;

      // Add to state
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Show toast notification
      const toastOptions = {
        action: notification.action_url
          ? {
            label: "View",
            onClick: () => (window.location.href = notification.action_url!),
          }
          : undefined,
      };

      if (notification.priority === "urgent") {
        toast.error(notification.title, {
          description: notification.message,
          ...toastOptions,
        });
      } else if (notification.priority === "high") {
        toast.warning(notification.title, {
          description: notification.message,
          ...toastOptions,
        });
      } else {
        toast.info(notification.title, {
          description: notification.message,
          ...toastOptions,
        });
      }
    });

    // Cleanup
    return () => {
      notificationsWS.disconnect();
    };
  }, [user, token]);

  const markAsRead = useCallback((notificationId: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  }, []);

  const clearNotification = useCallback(
    (notificationId: number) => {
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      const notification = notifications.find((n) => n.id === notificationId);
      if (notification && !notification.is_read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    },
    [notifications],
  );

  return {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    clearNotification,
  };
}

/**
 * Hook for Discussion Thread WebSocket
 */
export function useDiscussionWebSocket(threadId: number) {
  const { token } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [typingUsers, setTypingUsers] = useState<OnlineUser[]>([]);

  useEffect(() => {
    if (!token || !threadId) return;

    const { createDiscussionWS } = require("@/utils/websocket");
    const ws = createDiscussionWS(threadId);
    ws.connect(token);

    // Handle online users list
    ws.on("online_users", (message: any) => {
      setOnlineUsers(message.users || []);
    });

    // Handle user joined
    ws.on("user_joined", (message: any) => {
      setOnlineUsers((prev) => {
        if (!prev.find((u) => u.user_id === message.user_id)) {
          return [
            ...prev,
            { user_id: message.user_id, user_name: message.user_name },
          ];
        }
        return prev;
      });
    });

    // Handle user left
    ws.on("user_left", (message: any) => {
      setOnlineUsers((prev) =>
        prev.filter((u) => u.user_id !== message.user_id),
      );
    });

    // Handle typing indicators
    ws.on("user_typing", (message: any) => {
      setTypingUsers((prev) => {
        if (!prev.find((u) => u.user_id === message.user_id)) {
          return [
            ...prev,
            { user_id: message.user_id, user_name: message.user_name },
          ];
        }
        return prev;
      });

      // Remove after 5 seconds
      setTimeout(() => {
        setTypingUsers((prev) =>
          prev.filter((u) => u.user_id !== message.user_id),
        );
      }, 5000);
    });

    ws.on("user_stopped_typing", (message: any) => {
      setTypingUsers((prev) =>
        prev.filter((u) => u.user_id !== message.user_id),
      );
    });

    return () => {
      ws.disconnect();
    };
  }, [token, threadId]);

  return {
    onlineUsers,
    typingUsers,
  };
}
