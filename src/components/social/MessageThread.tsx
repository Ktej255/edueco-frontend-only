"use client";

import { useState, useEffect, useRef } from "react";
import api from "@/lib/api";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNotifications } from "@/contexts/NotificationContext";

interface User {
  id: number;
  full_name: string | null;
}

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  created_at: string;
  is_read: boolean;
}

interface MessageThreadProps {
  currentUser: User;
  selectedFriend: User;
}

export default function MessageThread({
  currentUser,
  selectedFriend,
}: MessageThreadProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { socket } = useNotifications();

  useEffect(() => {
    fetchMessages();

    // Listen for real-time messages
    if (socket) {
      socket.on("new_message", (msg: any) => {
        if (
          msg.sender_id === selectedFriend.id ||
          msg.receiver_id === selectedFriend.id
        ) {
          setMessages((prev) => [...prev, msg]);
          scrollToBottom();
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("new_message");
      }
    };
  }, [selectedFriend.id]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/social/conversations/${selectedFriend.id}`,
      );
      setMessages(response.data);
      setLoading(false);
      scrollToBottom();
    } catch (error) {
      console.error("Error fetching messages:", error);
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await api.post("/social/messages", {
        receiver_id: selectedFriend.id,
        content: newMessage,
      });

      // Optimistic update or wait for socket?
      // API returns the message, so let's add it
      setMessages((prev) => [...prev, response.data]);
      setNewMessage("");
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center gap-3 bg-gray-800/30">
        <Avatar className="h-10 w-10">
          <AvatarFallback>
            {selectedFriend.full_name?.[0] || "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-bold text-white">{selectedFriend.full_name}</h3>
          <p className="text-xs text-green-400">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <p className="text-center text-gray-500 mt-10">
            Loading conversation...
          </p>
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            No messages yet. Say hello!
          </p>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === currentUser.id;
            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${isMe
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-800 text-gray-200 rounded-bl-none"
                    }`}
                >
                  <p>{msg.message}</p>
                  <p
                    className={`text-[10px] mt-1 ${isMe ? "text-blue-200" : "text-gray-400"}`}
                  >
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-gray-800 bg-gray-800/30 flex gap-2"
      >
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="bg-gray-800 border-gray-700 focus:ring-blue-500"
        />
        <Button
          type="submit"
          size="icon"
          className="bg-blue-600 hover:bg-blue-500"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
