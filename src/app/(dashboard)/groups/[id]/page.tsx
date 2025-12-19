"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Users, MessageSquare, Calendar, BookOpen, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/lib/api";

interface StudyGroup {
    id: number;
    name: string;
    description: string;
    course_id: number;
    course_title?: string;
    member_count: number;
    created_at: string;
}

interface Member {
    id: number;
    user: {
        id: number;
        full_name: string;
        email: string;
    };
    role: "admin" | "member";
    joined_at: string;
}

interface Message {
    id: number;
    user_name: string;
    content: string;
    created_at: string;
}

export default function StudyGroupDetailPage() {
    const params = useParams();
    const id = params?.id;

    const [group, setGroup] = useState<StudyGroup | null>(null);
    const [members, setMembers] = useState<Member[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        if (id) {
            fetchGroupDetails();
            fetchMembers();
            fetchMessages();
        }
    }, [id]);

    const fetchGroupDetails = async () => {
        try {
            const response = await api.get(`/study-groups/${id}`);
            setGroup(response.data);
        } catch (error) {
            console.error("Failed to fetch group:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMembers = async () => {
        try {
            const response = await api.get(`/study-groups/${id}/members`);
            setMembers(response.data);
        } catch (error) {
            console.error("Failed to fetch members:", error);
        }
    };

    const fetchMessages = async () => {
        try {
            const response = await api.get(`/study-groups/${id}/messages`);
            setMessages(response.data);
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await api.post(`/study-groups/${id}/messages`, {
                content: newMessage,
            });
            setNewMessage("");
            fetchMessages();
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-12 w-12 animate-spin" />
            </div>
        );
    }

    if (!group) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <p className="text-muted-foreground">Study group not found</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-2xl">{group.name}</CardTitle>
                            <p className="text-muted-foreground mt-2">{group.description}</p>
                            {group.course_title && (
                                <div className="flex items-center gap-2 mt-3 text-sm">
                                    <BookOpen className="h-4 w-4" />
                                    <span>{group.course_title}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{group.member_count} members</span>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <Tabs defaultValue="discussion">
                <TabsList>
                    <TabsTrigger value="discussion">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Discussion
                    </TabsTrigger>
                    <TabsTrigger value="members">
                        <Users className="h-4 w-4 mr-2" />
                        Members
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="discussion" className="mt-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                                {messages.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">
                                        No messages yet. Start the conversation!
                                    </p>
                                ) : (
                                    messages.map((message) => (
                                        <div key={message.id} className="flex gap-3">
                                            <Avatar>
                                                <AvatarFallback>
                                                    {message.user_name.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-medium text-sm">{message.user_name}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(message.created_at).toLocaleString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm">{message.content}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <Textarea
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="min-h-[80px]"
                                />
                                <Button type="submit" size="icon" className="self-end">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="members" className="mt-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="space-y-3">
                                {members.map((member) => (
                                    <div
                                        key={member.id}
                                        className="flex items-center justify-between py-3 border-b last:border-b-0"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarFallback>
                                                    {member.user.full_name.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{member.user.full_name}</p>
                                                <p className="text-sm text-muted-foreground">{member.user.email}</p>
                                            </div>
                                        </div>
                                        {member.role === "admin" && (
                                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                                Admin
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
