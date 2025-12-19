"use client";

import React, { useState, useEffect } from "react";
import { ChatInterface } from "@/components/tutor/ChatInterface";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BookOpen, Code, MessageSquare, BrainCircuit } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export default function TutorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);

  // Load history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tutor/history`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (response.data && response.data.length > 0) {
          // Load most recent conversation
          const lastConv = response.data[0];
          setConversationId(lastConv.id);
          setMessages(lastConv.messages || []);
        } else {
          // Set initial welcome message
          setMessages([
            {
              role: "assistant",
              content:
                "Hello! I'm your AI Tutor. I can help you understand concepts, review code, or create a study plan. What would you like to learn today?",
            },
          ]);
        }
      } catch (error) {
        console.error("Failed to load history:", error);
      }
    };

    fetchHistory();
  }, []);

  const handleSendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      // Optimistically add user message
      const newMessages = [...messages, { role: "user", content } as Message];
      setMessages(newMessages);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tutor/chat`,
        {
          message: content,
          conversation_id: conversationId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setConversationId(response.data.conversation_id);

      // Update with assistant response
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.data.response },
      ]);
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to get response from AI Tutor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Tutor</h1>
        <p className="text-muted-foreground">
          Your personal AI learning assistant powered by GPT-4.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="h-full border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-primary" />
                Interactive Session
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                className="h-[600px]"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button
                variant="outline"
                className="justify-start"
                onClick={() =>
                  handleSendMessage("Explain the concept of recursion")
                }
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Explain Concept
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                onClick={() =>
                  handleSendMessage("Review this code snippet:\n\n")
                }
              >
                <Code className="mr-2 h-4 w-4" />
                Review Code
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                onClick={() =>
                  handleSendMessage("Create a study plan for Python")
                }
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Study Plan
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>• Be specific with your questions for better answers.</p>
              <p>• Paste code blocks for debugging help.</p>
              <p>• Ask for examples to clarify complex topics.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
