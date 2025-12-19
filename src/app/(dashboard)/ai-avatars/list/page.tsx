"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, MessageSquare, Settings, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

interface Avatar {
    id: number;
    name: string;
    description: string;
    purpose: string;
    tone: string;
    created_at: string;
    is_active: boolean;
}

export default function AvatarsListPage() {
    const router = useRouter();
    const [avatars, setAvatars] = useState<Avatar[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAvatars();
    }, []);

    const fetchAvatars = async () => {
        try {
            const response = await api.get("/ai/avatars");
            setAvatars(response.data);
        } catch (error) {
            console.error("Failed to fetch avatars:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteAvatar = async (id: number) => {
        if (!confirm("Are you sure you want to delete this avatar?")) return;

        try {
            await api.delete(`/ai/avatars/${id}`);
            setAvatars(avatars.filter((a) => a.id !== id));
        } catch (error) {
            console.error("Failed to delete avatar:", error);
        }
    };

    const getPurposeColor = (purpose: string) => {
        const colors: Record<string, string> = {
            sales: "bg-green-500/20 text-green-400",
            support: "bg-blue-500/20 text-blue-400",
            engage: "bg-purple-500/20 text-purple-400",
            generic: "bg-gray-500/20 text-gray-400",
        };
        return colors[purpose] || colors.generic;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Sparkles className="h-8 w-8 text-blue-500" />
                        AI Avatars
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your AI-powered assistants
                    </p>
                </div>
                <Button onClick={() => router.push("/ai-avatars")} size="lg">
                    <Plus className="h-5 w-5 mr-2" />
                    Create New Avatar
                </Button>
            </div>

            {avatars.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <Sparkles className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No AI Avatars Yet</h3>
                        <p className="text-muted-foreground mb-6">
                            Create your first AI avatar to start providing automated assistance
                        </p>
                        <Button onClick={() => router.push("/ai-avatars")}>
                            <Plus className="h-5 w-5 mr-2" />
                            Create Your First Avatar
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {avatars.map((avatar) => (
                        <Card key={avatar.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <CardTitle className="text-xl mb-2">{avatar.name}</CardTitle>
                                        <Badge className={getPurposeColor(avatar.purpose)}>
                                            {avatar.purpose}
                                        </Badge>
                                    </div>
                                    {avatar.is_active && (
                                        <Badge variant="outline" className="bg-green-500/20 text-green-400">
                                            Active
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {avatar.description || "No description"}
                                </p>
                                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                                    <span>Tone: {avatar.tone}</span>
                                    <span>
                                        Created {new Date(avatar.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => router.push(`/ai-avatars/chat/${avatar.id}`)}
                                    >
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        Chat
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.push(`/ai-avatars/edit/${avatar.id}`)}
                                    >
                                        <Settings className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => deleteAvatar(avatar.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
