"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChatMessage } from "@/hooks/useLiveClassWebSocket";

interface LiveClassChatPanelProps {
  messages: ChatMessage[];
  currentUserId: number;
  onSendMessage: (message: string) => void;
  onTyping?: () => void;
  onStopTyping?: () => void;
  typingUsers?: { user_id: number; user_name: string }[];
}

export function LiveClassChatPanel({
  messages,
  currentUserId,
  onSendMessage,
  onTyping,
  onStopTyping,
  typingUsers = [],
}: LiveClassChatPanelProps) {
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typingUsers]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
      if (onStopTyping) onStopTyping();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    if (onTyping) {
      onTyping();

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        if (onStopTyping) onStopTyping();
      }, 2000);
    }
  };

  return (
    <Card className="h-full bg-gray-900 border-gray-800 flex flex-col">
      <CardHeader className="pb-2 border-b border-gray-800 py-3">
        <CardTitle className="text-sm font-medium text-gray-200">
          Live Chat
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-2 min-h-[200px]">
              <p className="text-sm">Welcome to the live chat!</p>
              <p className="text-xs">Say hello to everyone 👋</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.user_id === currentUserId;
              return (
                <div
                  key={msg.id || Math.random()}
                  className={`flex gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}
                >
                  <Avatar className="h-8 w-8 border border-gray-700">
                    <AvatarFallback
                      className={`text-xs ${msg.is_instructor ? "bg-cyan-900 text-cyan-200" : "bg-gray-800 text-gray-300"}`}
                    >
                      {msg.user_name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div
                    className={`flex flex-col max-w-[80%] ${isMe ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs font-medium ${msg.is_instructor ? "text-cyan-400" : "text-gray-400"}`}
                      >
                        {msg.user_name}
                        {msg.is_instructor && " (Instructor)"}
                      </span>
                      <span className="text-[10px] text-gray-600">
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div
                      className={`
                                                px-3 py-2 rounded-lg text-sm break-words
                                                ${
                                                  isMe
                                                    ? "bg-cyan-600 text-white rounded-tr-none"
                                                    : msg.is_instructor
                                                      ? "bg-cyan-900/30 border border-cyan-800/50 text-gray-200 rounded-tl-none"
                                                      : "bg-gray-800 text-gray-200 rounded-tl-none"
                                                }
                                            `}
                    >
                      {msg.message}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Typing Indicator */}
          {typingUsers.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-gray-500 italic animate-pulse pl-10">
              <span>
                {typingUsers.length === 1
                  ? `${typingUsers[0].user_name} is typing...`
                  : `${typingUsers.length} people are typing...`}
              </span>
            </div>
          )}
        </div>

        <div className="p-3 border-t border-gray-800 bg-gray-900/50">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500 focus-visible:ring-cyan-500"
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className="bg-cyan-600 hover:bg-cyan-500 shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
