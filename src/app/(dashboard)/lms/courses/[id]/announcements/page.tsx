"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Megaphone, Plus, Pin, Eye } from "lucide-react";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Announcement {
    id: number;
    title: string;
    content: string;
    is_pinned: boolean;
    instructor_name: string;
    created_at: string;
    is_read: boolean;
}

export default function AnnouncementsPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id as string;

    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<string>("");

    useEffect(() => {
        fetchAnnouncements();
        fetchUnreadCount();
        checkUserRole();
    }, [courseId]);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${API_URL}/api/v1/announcements/courses/${courseId}/announcements`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setAnnouncements(response.data);
        } catch (error) {
            console.error("Error fetching announcements:", error);
            toast.error("Failed to load announcements");
        } finally {
            setLoading(false);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${API_URL}/api/v1/announcements/courses/${courseId}/announcements/unread-count`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setUnreadCount(response.data.unread_count);
        } catch (error) {
            console.error("Error fetching unread count:", error);
        }
    };

    const checkUserRole = () => {
        const role = localStorage.getItem("role");
        setUserRole(role || "");
    };

    const handleMarkAsRead = async (announcementId: number) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `${API_URL}/api/v1/announcements/announcements/${announcementId}/mark-read`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            fetchAnnouncements();
            fetchUnreadCount();
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Course Announcements</h1>
                    <p className="text-muted-foreground">
                        Stay updated with important course information
                        {unreadCount > 0 && (
                            <Badge variant="destructive" className="ml-2">
                                {unreadCount} Unread
                            </Badge>
                        )}
                    </p>
                </div>
                {userRole === "instructor" && (
                    <Button onClick={() => router.push(`/lms/courses/${courseId}/announcements/new`)}>
                        <Plus className="w-4 h-4 mr-2" />
                        New Announcement
                    </Button>
                )}
            </div>

            {loading ? (
                <Card>
                    <CardContent className="p-8 text-center">
                        Loading announcements...
                    </CardContent>
                </Card>
            ) : announcements.length === 0 ? (
                <Card>
                    <CardContent className="p-8 text-center">
                        <Megaphone className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">
                            No announcements yet. Check back later for updates!
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {announcements.map((announcement) => (
                        <Card
                            key={announcement.id}
                            className={`${announcement.is_pinned ? "border-2 border-primary" : ""
                                } ${!announcement.is_read ? "bg-blue-50 dark:bg-blue-950/20" : ""}`}
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                        <Avatar>
                                            <AvatarFallback>
                                                {announcement.instructor_name[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                {announcement.is_pinned && (
                                                    <Pin className="w-4 h-4 text-primary" />
                                                )}
                                                {!announcement.is_read && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        New
                                                    </Badge>
                                                )}
                                                <CardTitle className="text-xl">
                                                    {announcement.title}
                                                </CardTitle>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                By {announcement.instructor_name} •{" "}
                                                {new Date(announcement.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    {!announcement.is_read && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleMarkAsRead(announcement.id)}
                                        >
                                            <Eye className="w-4 h-4 mr-1" />
                                            Mark Read
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="whitespace-pre-wrap">{announcement.content}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
