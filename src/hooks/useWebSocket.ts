/**
 * WebSocket Hook
 *
 * Custom React hook for managing WebSocket connections with automatic
 * reconnection, event handling, and state synchronization.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@/contexts/auth-context";

export interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

interface UseWebSocketOptions {
  onMessage?: (message: WebSocketMessage) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

interface UseWebSocketReturn {
  sendMessage: (message: WebSocketMessage) => void;
  isConnected: boolean;
  reconnect: () => void;
  disconnect: () => void;
}

/**
 * Custom hook for WebSocket connection management
 *
 * @param url - WebSocket endpoint URL (relative to API base)
 * @param options - Configuration options
 * @returns WebSocket connection utilities
 *
 * @example
 * const { sendMessage, isConnected } = useWebSocket('/ws/discussions/123', {
 *   onMessage: (message) => {
 *     if (message.type === 'new_post') {
 *       // Handle new post
 *     }
 *   }
 * });
 */
export function useWebSocket(
  url: string | null,
  options: UseWebSocketOptions = {},
): UseWebSocketReturn {
  const {
    onMessage,
    onOpen,
    onClose,
    onError,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
  } = options;

  const { token } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageQueueRef = useRef<WebSocketMessage[]>([]);
  const intentionalCloseRef = useRef(false);

  /**
   * Get WebSocket URL with authentication token
   */
  const getWebSocketUrl = useCallback(() => {
    if (!url || !token) return null;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const wsProtocol = apiUrl.startsWith("https") ? "wss" : "ws";
    const wsHost = apiUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");

    return `${wsProtocol}://${wsHost}${url}?token=${token}`;
  }, [url, token]);

  /**
   * Send a message through WebSocket
   */
  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      // Queue message if not connected
      messageQueueRef.current.push(message);
    }
  }, []);

  /**
   * Connect to WebSocket
   */
  const connect = useCallback(() => {
    const wsUrl = getWebSocketUrl();
    if (!wsUrl) return;

    try {
      // Close existing connection if any
      if (wsRef.current) {
        wsRef.current.close();
      }

      intentionalCloseRef.current = false;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("[WebSocket] Connected to", url);
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;

        // Send queued messages
        while (messageQueueRef.current.length > 0) {
          const queuedMessage = messageQueueRef.current.shift();
          if (queuedMessage) {
            ws.send(JSON.stringify(queuedMessage));
          }
        }

        onOpen?.();
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          onMessage?.(message);
        } catch (error) {
          console.error("[WebSocket] Failed to parse message:", error);
        }
      };

      ws.onclose = (event) => {
        console.log(
          "[WebSocket] Disconnected from",
          url,
          event.code,
          event.reason,
        );
        setIsConnected(false);
        wsRef.current = null;

        onClose?.();

        // Attempt reconnection if not intentional close
        if (
          !intentionalCloseRef.current &&
          reconnectAttemptsRef.current < maxReconnectAttempts
        ) {
          reconnectAttemptsRef.current += 1;
          const delay =
            reconnectInterval * Math.pow(1.5, reconnectAttemptsRef.current - 1);

          console.log(
            `[WebSocket] Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`,
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          console.error("[WebSocket] Max reconnection attempts reached");
        }
      };

      ws.onerror = (event) => {
        console.error("[WebSocket] Error:", event);
        onError?.(event);
      };

      wsRef.current = ws;
    } catch (error) {
      console.error("[WebSocket] Connection error:", error);
    }
  }, [
    getWebSocketUrl,
    url,
    maxReconnectAttempts,
    reconnectInterval,
    onMessage,
    onOpen,
    onClose,
    onError,
  ]);

  /**
   * Manually trigger reconnection
   */
  const reconnect = useCallback(() => {
    reconnectAttemptsRef.current = 0;
    connect();
  }, [connect]);

  /**
   * Disconnect WebSocket
   */
  const disconnect = useCallback(() => {
    intentionalCloseRef.current = true;

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close(1000, "Client disconnect");
      wsRef.current = null;
    }

    setIsConnected(false);
  }, []);

  /**
   * Setup and cleanup
   */
  useEffect(() => {
    if (url && token && !intentionalCloseRef.current) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [url, token, connect, disconnect]);

  return {
    sendMessage,
    isConnected,
    reconnect,
    disconnect,
  };
}

/**
 * Hook for discussion WebSocket
 */
export function useDiscussionWebSocket(threadId: number | null) {
  const [typingUsers, setTypingUsers] = useState<
    Array<{ user_id: number; username: string }>
  >([]);
  const [onlineUsers, setOnlineUsers] = useState<
    Array<{ user_id: number; username: string }>
  >([]);

  const { sendMessage, isConnected } = useWebSocket(
    threadId ? `/ws/discussions/${threadId}` : null,
    {
      onMessage: (message) => {
        switch (message.type) {
          case "user_typing":
            setTypingUsers((prev) => {
              const exists = prev.some((u) => u.user_id === message.user_id);
              if (!exists) {
                return [
                  ...prev,
                  { user_id: message.user_id, username: message.username },
                ];
              }
              return prev;
            });
            break;

          case "user_stopped_typing":
            setTypingUsers((prev) =>
              prev.filter((u) => u.user_id !== message.user_id),
            );
            break;

          case "online_users":
            setOnlineUsers(message.users || []);
            break;

          case "user_joined":
            setOnlineUsers((prev) => [
              ...prev,
              { user_id: message.user_id, username: message.user_name },
            ]);
            break;

          case "user_left":
            setOnlineUsers((prev) =>
              prev.filter((u) => u.user_id !== message.user_id),
            );
            break;
        }
      },
    },
  );

  const startTyping = useCallback(() => {
    sendMessage({ type: "typing" });
  }, [sendMessage]);

  const stopTyping = useCallback(() => {
    sendMessage({ type: "stop_typing" });
  }, [sendMessage]);

  return {
    typingUsers,
    onlineUsers,
    isConnected,
    startTyping,
    stopTyping,
  };
}

/**
 * Hook for live class WebSocket
 */
export function useLiveClassWebSocket(sessionId: number | null) {
  const [participants, setParticipants] = useState(0);
  const [chatMessages, setChatMessages] = useState<Array<any>>([]);

  const { sendMessage, isConnected } = useWebSocket(
    sessionId ? `/ws/live-class/${sessionId}` : null,
    {
      onMessage: (message) => {
        switch (message.type) {
          case "connected":
            setParticipants(message.participant_count || 0);
            break;

          case "participant_update":
            setParticipants(message.participant_count || 0);
            break;

          case "chat_message":
            setChatMessages((prev) => [...prev, message]);
            break;

          case "reaction":
            // Handle reactions (could trigger animation)
            break;
        }
      },
    },
  );

  const sendChatMessage = useCallback(
    (text: string) => {
      sendMessage({
        type: "chat_message",
        message: text,
      });
    },
    [sendMessage],
  );

  const sendReaction = useCallback(
    (emoji: string) => {
      sendMessage({
        type: "reaction",
        emoji,
      });
    },
    [sendMessage],
  );

  return {
    participants,
    chatMessages,
    isConnected,
    sendChatMessage,
    sendReaction,
  };
}

/**
 * Hook for notifications WebSocket
 */
export function useNotificationsWebSocket() {
  const [notifications, setNotifications] = useState<Array<any>>([]);

  const { isConnected } = useWebSocket("/ws/notifications", {
    onMessage: (message) => {
      setNotifications((prev) => [message, ...prev]);
    },
  });

  return {
    notifications,
    isConnected,
  };
}
