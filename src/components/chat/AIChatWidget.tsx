"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    MessageCircle,
    X,
    Send,
    Loader2,
    Sparkles,
    User,
    BookOpen,
    Video,
    HelpCircle,
    ChevronRight
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

interface QuickAction {
    label: string;
    icon: React.ReactNode;
    prompt: string;
}

export default function AIChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [hasGreeted, setHasGreeted] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Generate greeting based on current page
    const getPageContext = () => {
        if (pathname?.includes("/student")) return "student portal";
        if (pathname?.includes("/teacher")) return "teacher portal";
        if (pathname?.includes("/admin")) return "admin dashboard";
        if (pathname?.includes("/courses")) return "courses section";
        if (pathname?.includes("/webinars")) return "webinars section";
        if (pathname?.includes("/meditation")) return "meditation section";
        return "platform";
    };

    // Initial greeting when widget opens
    useEffect(() => {
        if (isOpen && !hasGreeted && messages.length === 0) {
            const greetingMessage: Message = {
                id: Date.now().toString(),
                role: "assistant",
                content: `👋 Hi! I'm Tej's AI Assistant. I'm here to help you navigate the ${getPageContext()}.\n\nHow can I assist you today?`,
                timestamp: new Date(),
            };
            setMessages([greetingMessage]);
            setHasGreeted(true);
        }
    }, [isOpen, hasGreeted, messages.length, pathname]);

    // Quick actions based on current page
    const getQuickActions = (): QuickAction[] => {
        const baseActions: QuickAction[] = [
            {
                label: "Browse Courses",
                icon: <BookOpen className="h-3 w-3" />,
                prompt: "Show me available courses"
            },
            {
                label: "Join Webinar",
                icon: <Video className="h-3 w-3" />,
                prompt: "How do I join a webinar?"
            },
            {
                label: "Get Help",
                icon: <HelpCircle className="h-3 w-3" />,
                prompt: "I need help getting started"
            },
        ];

        if (pathname?.includes("/student")) {
            return [
                { label: "My Progress", icon: <ChevronRight className="h-3 w-3" />, prompt: "Show my learning progress" },
                { label: "Start Meditation", icon: <Sparkles className="h-3 w-3" />, prompt: "How do I start a meditation session?" },
                ...baseActions.slice(0, 1),
            ];
        }

        if (pathname?.includes("/teacher")) {
            return [
                { label: "Upload Content", icon: <ChevronRight className="h-3 w-3" />, prompt: "How do I upload course content?" },
                { label: "View Analytics", icon: <ChevronRight className="h-3 w-3" />, prompt: "Show me my teaching analytics" },
                ...baseActions.slice(1, 2),
            ];
        }

        return baseActions;
    };

    // Don't render on login/register page (moved AFTER all hooks)
    if (pathname === "/login" || pathname === "/register") {
        return null;
    }

    const sendMessage = async (text: string) => {
        if (!text.trim() || loading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: text.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            // Use the existing AI chat endpoint
            const response = await api.post("/ai/chat", {
                message: text,
                context: `User is currently on the ${getPageContext()}. Page path: ${pathname}`,
            });

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: response.data.response || "I'm here to help! Could you please rephrase your question?",
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error: any) {
            console.error("Chat error:", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "I'm having trouble connecting right now. Please try again in a moment, or contact support if this persists.",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickAction = (action: QuickAction) => {
        sendMessage(action.prompt);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 ${isOpen
                    ? "bg-gray-800 text-gray-300 scale-90"
                    : "bg-gradient-to-br from-emerald-500 to-teal-600 text-white hover:scale-110 hover:shadow-emerald-500/25"
                    }`}
            >
                {isOpen ? (
                    <X className="h-6 w-6" />
                ) : (
                    <MessageCircle className="h-6 w-6" />
                )}
            </button>

            {/* Notification dot when closed */}
            {!isOpen && messages.length === 0 && (
                <span className="fixed bottom-14 right-6 z-50 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-full">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">Tej's AI Assistant</h3>
                                <p className="text-xs text-emerald-100">Here to help you navigate</p>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="h-72 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex gap-2 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                            >
                                <div className={`flex-shrink-0 p-1.5 rounded-full ${message.role === "user"
                                    ? "bg-blue-600"
                                    : "bg-gradient-to-br from-emerald-500 to-teal-500"
                                    }`}>
                                    {message.role === "user" ? (
                                        <User className="h-4 w-4 text-white" />
                                    ) : (
                                        <Sparkles className="h-4 w-4 text-white" />
                                    )}
                                </div>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${message.role === "user"
                                    ? "bg-blue-600 text-white rounded-tr-sm"
                                    : "bg-gray-800 text-gray-200 rounded-tl-sm"
                                    }`}>
                                    <p className="whitespace-pre-wrap">{message.content}</p>
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex gap-2">
                                <div className="flex-shrink-0 p-1.5 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500">
                                    <Sparkles className="h-4 w-4 text-white" />
                                </div>
                                <div className="bg-gray-800 p-3 rounded-2xl rounded-tl-sm">
                                    <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Actions */}
                    {messages.length <= 1 && (
                        <div className="px-4 pb-2">
                            <p className="text-xs text-gray-500 mb-2">Quick actions:</p>
                            <div className="flex flex-wrap gap-2">
                                {getQuickActions().map((action, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleQuickAction(action)}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-full text-xs text-gray-300 transition-colors"
                                    >
                                        {action.icon}
                                        {action.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <div className="p-4 border-t border-gray-800">
                        <div className="flex gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask me anything..."
                                className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 rounded-full"
                                disabled={loading}
                            />
                            <Button
                                onClick={() => sendMessage(input)}
                                disabled={!input.trim() || loading}
                                size="icon"
                                className="rounded-full bg-emerald-600 hover:bg-emerald-500"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
