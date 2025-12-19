/**
 * Custom Hook for Live Class WebSocket Management
 * Handles real-time updates for polls, Q&A, chat, and reactions
 */

import { useEffect, useRef, useState, useCallback } from "react";
import WebSocketClient from "@/utils/websocket";

// Message types
export interface LiveClassMessage {
  type:
  | "live_class_update"
  | "chat_message"
  | "user_joined"
  | "user_left"
  | "online_users"
  | "user_typing"
  | "user_stopped_typing"
  | "poll_created"
  | "poll_updated"
  | "poll_status_changed"
  | "new_question"
  | "question_answered"
  | "question_upvoted"
  | "reaction";
  [key: string]: any;
}

export interface Poll {
  poll_id: number;
  question: string;
  options: string[];
  status?: string;
}

export interface Question {
  question_id: number;
  text: string;
  student_name: string;
  upvotes?: number;
  answer?: string;
}

export interface ChatMessage {
  id: number;
  user_id: number;
  user_name: string;
  message: string;
  is_instructor: boolean;
  created_at: string;
}

export interface Reaction {
  reaction: string;
  user_id: number;
}

export interface OnlineUser {
  user_id: number;
  user_name: string;
}

interface UseLiveClassWebSocketProps {
  classId: number;
  token: string;
  onPollCreated?: (poll: Poll) => void;
  onPollUpdated?: (data: any) => void;
  onPollStatusChanged?: (data: any) => void;
  onNewQuestion?: (question: Question) => void;
  onQuestionAnswered?: (data: any) => void;
  onQuestionUpvoted?: (data: any) => void;
  onChatMessage?: (message: ChatMessage) => void;
  onReaction?: (reaction: Reaction) => void;
  onUserJoined?: (user: OnlineUser) => void;
  onUserLeft?: (user: OnlineUser) => void;
  onOnlineUsers?: (users: OnlineUser[]) => void;
  onTyping?: (data: { user_id: number; user_name: string }) => void;
  onStoppedTyping?: (data: { user_id: number }) => void;
}

export const useLiveClassWebSocket = ({
  classId,
  token,
  onPollCreated,
  onPollUpdated,
  onPollStatusChanged,
  onNewQuestion,
  onQuestionAnswered,
  onQuestionUpvoted,
  onChatMessage,
  onReaction,
  onUserJoined,
  onUserLeft,
  onOnlineUsers,
  onTyping,
  onStoppedTyping,
}: UseLiveClassWebSocketProps) => {
  const wsRef = useRef<WebSocketClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!classId || !token) return;

    // Create WebSocket client for this live class
    const ws = new WebSocketClient(`/api/v1/ws/live-class/${classId}`);
    wsRef.current = ws;

    // Connection handlers
    ws.onConnect(() => {
      console.log("✅ Connected to live class:", classId);
      setIsConnected(true);
      setConnectionError(null);
    });

    ws.onDisconnect(() => {
      console.log("🔌 Disconnected from live class:", classId);
      setIsConnected(false);
    });

    // Message handlers
    ws.on("live_class_update", (message: any) => {
      const { update_type, data } = message;

      switch (update_type) {
        case "poll_created":
          onPollCreated?.(data as Poll);
          break;
        case "poll_updated":
          onPollUpdated?.(data);
          break;
        case "poll_status_changed":
          onPollStatusChanged?.(data);
          break;
        case "new_question":
          onNewQuestion?.(data as Question);
          break;
        case "question_answered":
          onQuestionAnswered?.(data);
          break;
        case "question_upvoted":
          onQuestionUpvoted?.(data);
          break;
        case "reaction":
          onReaction?.(data as Reaction);
          break;
      }
    });

    ws.on("chat_message", (message: any) => {
      onChatMessage?.(message as ChatMessage);
    });

    ws.on("user_joined", (message: any) => {
      const user = { user_id: message.user_id, user_name: message.user_name };
      setOnlineUsers((prev) => [...prev, user]);
      onUserJoined?.(user);
    });

    ws.on("user_left", (message: any) => {
      const user = { user_id: message.user_id, user_name: message.user_name };
      setOnlineUsers((prev) => prev.filter((u) => u.user_id !== user.user_id));
      onUserLeft?.(user);
    });

    ws.on("online_users", (message: any) => {
      setOnlineUsers(message.users || []);
      onOnlineUsers?.(message.users || []);
    });

    ws.on("user_typing", (message: any) => {
      onTyping?.({ user_id: message.user_id, user_name: message.user_name });
    });

    ws.on("user_stopped_typing", (message: any) => {
      onStoppedTyping?.({ user_id: message.user_id });
    });

    // Connect
    try {
      ws.connect(token);
    } catch (error) {
      console.error("Failed to connect to live class WebSocket:", error);
      setConnectionError("Failed to connect to live class");
    }

    // Cleanup on unmount
    return () => {
      console.log("🧹 Cleaning up live class WebSocket");
      ws.disconnect();
    };
  }, [classId, token]);

  // Send typing indicator
  const sendTyping = useCallback(() => {
    if (wsRef.current?.isConnected()) {
      wsRef.current.send({ type: "typing" });
    }
  }, []);

  // Send stop typing indicator
  const sendStopTyping = useCallback(() => {
    if (wsRef.current?.isConnected()) {
      wsRef.current.send({ type: "stop_typing" });
    }
  }, []);

  // Send chat message via WebSocket (for immediate feedback)
  const sendChatMessageWS = useCallback((message: string) => {
    if (wsRef.current?.isConnected()) {
      wsRef.current.send({
        type: "chat_message",
        message,
      });
    }
  }, []);

  return {
    isConnected,
    connectionError,
    onlineUsers,
    onlineUserCount: onlineUsers.length,
    sendTyping,
    sendStopTyping,
    sendChatMessageWS,
  };
};

export default useLiveClassWebSocket;
