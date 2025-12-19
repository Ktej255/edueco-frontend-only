"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  BarChart2,
  HelpCircle,
  Users,
  MoreVertical,
  X,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import axios from "axios";

import useLiveClassWebSocket, {
  Poll,
  Question,
  ChatMessage,
  Reaction,
  OnlineUser,
} from "@/hooks/useLiveClassWebSocket";

import { LiveClassChatPanel } from "./LiveClassChatPanel";
import { LiveClassPollPanel } from "./LiveClassPollPanel";
import { LiveClassQAPanel } from "./LiveClassQAPanel";
import { LiveClassParticipantsList } from "./LiveClassParticipantsList";
import { LiveClassReactionBar } from "./LiveClassReactionBar";
import { VideoPlayer } from "@/components/features/lms/VideoPlayer";

// API Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const getAuthHeader = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

interface LiveClassViewerProps {
  liveClass: {
    id: number;
    title: string;
    instructor_id: number;
    video_url?: string; // HLS or other stream URL
    status: string;
  };
  currentUser: {
    id: number;
    name: string;
    role: "instructor" | "student";
  };
  token: string;
}

export function LiveClassViewer({
  liveClass,
  currentUser,
  token,
}: LiveClassViewerProps) {
  const [activeTab, setActiveTab] = useState("chat");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // State for interactive features
  const [polls, setPolls] = useState<Poll[]>([]);
  const [activePollId, setActivePollId] = useState<number | undefined>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [latestReaction, setLatestReaction] = useState<{
    reaction: string;
    id: string;
  } | null>(null);
  const [typingUsers, setTypingUsers] = useState<
    { user_id: number; user_name: string }[]
  >([]);

  // WebSocket Hook
  const {
    isConnected,
    onlineUsers,
    onlineUserCount,
    sendTyping,
    sendStopTyping,
    sendChatMessageWS,
  } = useLiveClassWebSocket({
    classId: liveClass.id,
    token,
    onPollCreated: (poll) => {
      setPolls((prev) => [...prev, poll]);
      setActivePollId(poll.poll_id);
      toast.info("New poll started!");
      if (activeTab !== "polls") {
        // Optional: Show indicator on tab
      }
    },
    onPollUpdated: (data) => {
      // Update poll results logic here
    },
    onPollStatusChanged: (data) => {
      if (data.status === "ended") {
        setActivePollId(undefined);
        toast.info("Poll ended");
      }
    },
    onNewQuestion: (question) => {
      setQuestions((prev) => [question, ...prev]);
      if (activeTab !== "qa") {
        toast.info("New question asked");
      }
    },
    onQuestionAnswered: (data) => {
      setQuestions((prev) =>
        prev.map((q) =>
          q.question_id === data.question_id
            ? { ...q, answer: data.answer }
            : q,
        ),
      );
    },
    onQuestionUpvoted: (data) => {
      setQuestions((prev) =>
        prev.map((q) =>
          q.question_id === data.question_id
            ? { ...q, upvotes: data.upvotes }
            : q,
        ),
      );
    },
    onChatMessage: (message) => {
      setMessages((prev) => [...prev, message]);
    },
    onReaction: (reaction) => {
      setLatestReaction({
        reaction: reaction.reaction,
        id: Math.random().toString(),
      });
    },
    onTyping: (user) => {
      setTypingUsers((prev) => {
        if (prev.find((u) => u.user_id === user.user_id)) return prev;
        return [...prev, user];
      });
    },
    onStoppedTyping: (user) => {
      setTypingUsers((prev) => prev.filter((u) => u.user_id !== user.user_id));
    },
  });

  // Handlers
  const handleSendMessage = async (text: string) => {
    // Optimistic update
    const tempMsg: ChatMessage = {
      id: Date.now(),
      user_id: currentUser.id,
      user_name: currentUser.name,
      message: text,
      is_instructor: currentUser.role === "instructor",
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);

    // Send via WebSocket for real-time
    sendChatMessageWS(text);

    // Also persist via API
    try {
      await axios.post(
        `${API_URL}/api/v1/live-class-interactive/classes/${liveClass.id}/chat`,
        { message: text },
        { headers: getAuthHeader() },
      );
    } catch (error: any) {
      console.error("Failed to persist chat message:", error);
      // Message still sent via WebSocket, so don't show error to user
    }
  };

  const handleReaction = async (emoji: string) => {
    try {
      await axios.post(
        `${API_URL}/api/v1/live-class-interactive/classes/${liveClass.id}/reactions`,
        { reaction: emoji },
        { headers: getAuthHeader() },
      );
      // Reaction will be broadcast via WebSocket
    } catch (error: any) {
      console.error("Failed to send reaction:", error);
    }
  };

  // API handlers with error handling
  const handleVote = async (pollId: number, optionIndex: number) => {
    try {
      await axios.post(
        `${API_URL}/api/v1/live-class-interactive/polls/${pollId}/vote`,
        { option_index: optionIndex },
        { headers: getAuthHeader() },
      );
      toast.success("Vote submitted!");
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || "Failed to submit vote";
      toast.error(errorMsg);
      console.error("Vote error:", error);
    }
  };

  const handleCreatePoll = async (question: string, options: string[]) => {
    try {
      await axios.post(
        `${API_URL}/api/v1/live-class-interactive/classes/${liveClass.id}/polls`,
        {
          question,
          options,
          duration_minutes: 5,
        },
        { headers: getAuthHeader() },
      );
      toast.success("Poll created!");
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || "Failed to create poll";
      toast.error(errorMsg);
      console.error("Create poll error:", error);
    }
  };

  const handleEndPoll = async (pollId: number) => {
    try {
      await axios.patch(
        `${API_URL}/api/v1/live-class-interactive/polls/${pollId}/status`,
        { status: "ended" },
        { headers: getAuthHeader() },
      );
      toast.success("Poll ended");
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || "Failed to end poll";
      toast.error(errorMsg);
      console.error("End poll error:", error);
    }
  };

  const handleAskQuestion = async (text: string) => {
    try {
      await axios.post(
        `${API_URL}/api/v1/live-class-interactive/classes/${liveClass.id}/questions`,
        { question: text },
        { headers: getAuthHeader() },
      );
      toast.success("Question submitted!");
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || "Failed to ask question";
      toast.error(errorMsg);
      console.error("Ask question error:", error);
    }
  };

  const handleUpvoteQuestion = async (questionId: number) => {
    try {
      await axios.post(
        `${API_URL}/api/v1/live-class-interactive/questions/${questionId}/upvote`,
        {},
        { headers: getAuthHeader() },
      );
      toast.success("Question upvoted!");
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.detail || "Failed to upvote question";
      toast.error(errorMsg);
      console.error("Upvote error:", error);
    }
  };

  const handleAnswerQuestion = async (questionId: number, answer: string) => {
    try {
      await axios.post(
        `${API_URL}/api/v1/live-class-interactive/questions/${questionId}/answer`,
        { answer },
        { headers: getAuthHeader() },
      );
      toast.success("Answer posted!");
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || "Failed to post answer";
      toast.error(errorMsg);
      console.error("Answer error:", error);
    }
  };

  // Load initial data when component mounts
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [pollsData, questionsData, chatData] = await Promise.all([
          axios.get(
            `${API_URL}/api/v1/live-class-interactive/classes/${liveClass.id}/polls`,
            { headers: getAuthHeader() },
          ),
          axios.get(
            `${API_URL}/api/v1/live-class-interactive/classes/${liveClass.id}/questions`,
            { headers: getAuthHeader() },
          ),
          axios.get(
            `${API_URL}/api/v1/live-class-interactive/classes/${liveClass.id}/chat`,
            { headers: getAuthHeader() },
          ),
        ]);

        setPolls(pollsData.data || []);
        setQuestions(questionsData.data || []);
        setMessages(chatData.data || []);

        // Set active poll if there is one
        const activePoll = pollsData.data?.find(
          (p: any) => p.status === "active",
        );
        if (activePoll) {
          setActivePollId(activePoll.poll_id);
        }
      } catch (error: any) {
        console.error("Failed to load initial data:", error);
        toast.error("Failed to load live class data");
      }
    };

    loadInitialData();
  }, [liveClass.id]);

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      {/* Main Content Area (Video) */}
      <div
        className={`flex-1 flex flex-col relative transition-all duration-300 ${isSidebarOpen ? "mr-0 md:mr-80" : "mr-0"}`}
      >
        {/* Header */}
        <div className="h-14 border-b border-gray-800 flex items-center justify-between px-4 bg-gray-900/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3">
            <h1 className="text-white font-semibold truncate max-w-[200px] md:max-w-md">
              {liveClass.title}
            </h1>
            <Badge
              variant={isConnected ? "default" : "destructive"}
              className="h-5 text-[10px]"
            >
              {isConnected ? "LIVE" : "OFFLINE"}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-gray-400 text-sm mr-2">
              <Users className="h-4 w-4" />
              <span>{onlineUserCount}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-400 hover:text-white"
            >
              {isSidebarOpen ? (
                <Maximize2 className="h-4 w-4" />
              ) : (
                <Minimize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Video Container */}
        <div className="flex-1 bg-black relative flex items-center justify-center">
          {/* Placeholder for Video Player */}
          <div className="w-full h-full bg-gray-900 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="mb-2">Video Stream Area</p>
              <p className="text-xs text-gray-600">
                Stream URL: {liveClass.video_url || "Not available"}
              </p>
            </div>
          </div>

          {/* Reaction Bar Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <LiveClassReactionBar
              onReaction={handleReaction}
              incomingReaction={latestReaction}
            />
          </div>
        </div>
      </div>

      {/* Sidebar (Desktop) */}
      <div
        className={`
                    fixed right-0 top-0 bottom-0 w-80 bg-gray-900 border-l border-gray-800 
                    transform transition-transform duration-300 z-20 flex flex-col
                    ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}
                `}
      >
        <div className="h-14 border-b border-gray-800 flex items-center justify-between px-4">
          <span className="font-semibold text-gray-200">Interactive Panel</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-gray-400"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col min-h-0"
        >
          <TabsList className="w-full justify-start rounded-none border-b border-gray-800 bg-transparent p-0 h-10">
            <TabsTrigger
              value="chat"
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-500 data-[state=active]:bg-gray-800/50 h-10"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger
              value="qa"
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-500 data-[state=active]:bg-gray-800/50 h-10"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Q&A
            </TabsTrigger>
            <TabsTrigger
              value="polls"
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-500 data-[state=active]:bg-gray-800/50 h-10"
            >
              <BarChart2 className="h-4 w-4 mr-2" />
              Polls
            </TabsTrigger>
            <TabsTrigger
              value="people"
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-500 data-[state=active]:bg-gray-800/50 h-10"
            >
              <Users className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden relative">
            <TabsContent
              value="chat"
              className="h-full m-0 data-[state=inactive]:hidden"
            >
              <LiveClassChatPanel
                messages={messages}
                currentUserId={currentUser.id}
                onSendMessage={handleSendMessage}
                onTyping={sendTyping}
                onStopTyping={sendStopTyping}
                typingUsers={typingUsers}
              />
            </TabsContent>

            <TabsContent
              value="qa"
              className="h-full m-0 data-[state=inactive]:hidden"
            >
              <LiveClassQAPanel
                questions={questions}
                userRole={currentUser.role}
                onAskQuestion={handleAskQuestion}
                onUpvote={handleUpvoteQuestion}
                onAnswer={handleAnswerQuestion}
              />
            </TabsContent>

            <TabsContent
              value="polls"
              className="h-full m-0 data-[state=inactive]:hidden"
            >
              <LiveClassPollPanel
                polls={polls}
                activePollId={activePollId}
                userRole={currentUser.role}
                onVote={handleVote}
                onCreatePoll={handleCreatePoll}
                onEndPoll={handleEndPoll}
              />
            </TabsContent>

            <TabsContent
              value="people"
              className="h-full m-0 data-[state=inactive]:hidden"
            >
              <LiveClassParticipantsList
                participants={onlineUsers}
                instructorId={liveClass.instructor_id}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
