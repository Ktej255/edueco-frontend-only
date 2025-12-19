"use client";

import { useEffect, useState } from "react";
import StandardListPage from "@/components/scaffold/StandardListPage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";
import { Video, Calendar, Clock, Users, Loader2, ExternalLink, Copy, Check } from "lucide-react";

interface Webinar {
    id: number;
    title: string;
    description?: string;
    scheduled_at: string;
    duration_minutes: number;
    status: string;
    platform: string;
    course_id?: number;
    instructor_id?: number;
    meeting_url?: string;
    recording_url?: string;
    recording_available?: boolean;
}

export default function WebinarsPage() {
    const [data, setData] = useState<Webinar[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [creating, setCreating] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        scheduled_at: "",
        duration_minutes: 60,
        platform: "google_meet",
        meeting_url: "",
        course_id: 1, // Default course
    });
    const [copiedId, setCopiedId] = useState<number | null>(null);

    const fetchWebinars = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get("/live-classes/webinars");
            setData(response.data);
        } catch (err: any) {
            console.error("Failed to fetch webinars:", err);
            setError(err.response?.data?.detail || "Failed to load webinars");
            // Fallback to mock data for demo
            setData([
                {
                    id: 1,
                    title: "Introduction to Advanced Physics",
                    description: "Learn the fundamentals of advanced physics concepts",
                    scheduled_at: new Date(Date.now() + 86400000).toISOString(),
                    duration_minutes: 60,
                    status: "scheduled",
                    platform: "zoom",
                },
                {
                    id: 2,
                    title: "Web Development Trends 2025",
                    description: "Explore the latest trends in web development",
                    scheduled_at: new Date(Date.now() + 172800000).toISOString(),
                    duration_minutes: 90,
                    status: "scheduled",
                    platform: "zoom",
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWebinars();
    }, []);

    const handleCreate = async () => {
        try {
            setCreating(true);
            await api.post(`/live-classes/courses/${formData.course_id}/live-classes`, {
                ...formData,
                scheduled_at: new Date(formData.scheduled_at).toISOString(),
            });
            setShowCreateDialog(false);
            setFormData({
                title: "",
                description: "",
                scheduled_at: "",
                duration_minutes: 60,
                platform: "google_meet",
                meeting_url: "",
                course_id: 1,
            });
            fetchWebinars();
        } catch (err: any) {
            console.error("Failed to create webinar:", err);
            alert(err.response?.data?.detail || "Failed to create webinar");
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (row: Webinar) => {
        if (!confirm(`Are you sure you want to cancel "${row.title}"?`)) return;

        try {
            setDeleting(row.id);
            await api.delete(`/live-classes/${row.id}`);
            fetchWebinars();
        } catch (err: any) {
            console.error("Failed to delete webinar:", err);
            alert(err.response?.data?.detail || "Failed to cancel webinar");
        } finally {
            setDeleting(null);
        }
    };

    const handleJoinMeeting = (webinar: Webinar) => {
        if (webinar.meeting_url) {
            window.open(webinar.meeting_url, '_blank', 'noopener,noreferrer');
        } else {
            alert('No meeting link available. Please add a Google Meet link.');
        }
    };

    const handleCopyLink = (webinar: Webinar) => {
        if (webinar.meeting_url) {
            navigator.clipboard.writeText(webinar.meeting_url);
            setCopiedId(webinar.id);
            setTimeout(() => setCopiedId(null), 2000);
        }
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { color: string; label: string }> = {
            scheduled: { color: "border-blue-500/50 text-blue-500", label: "Scheduled" },
            live: { color: "border-green-500/50 text-green-500 animate-pulse", label: "🔴 Live" },
            completed: { color: "border-gray-500/50 text-gray-400", label: "Completed" },
            cancelled: { color: "border-red-500/50 text-red-500", label: "Cancelled" },
        };
        const variant = variants[status] || variants.scheduled;
        return (
            <Badge variant="outline" className={variant.color}>
                {variant.label}
            </Badge>
        );
    };

    const columns = [
        {
            key: "title",
            label: "Topic",
            render: (val: string, row: Webinar) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg">
                        <Video className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                        <span className="font-medium text-white">{val}</span>
                        {row.description && (
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{row.description}</p>
                        )}
                    </div>
                </div>
            )
        },
        {
            key: "scheduled_at",
            label: "Scheduled For",
            render: (val: string) => (
                <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(val).toLocaleString()}</span>
                </div>
            )
        },
        {
            key: "duration_minutes",
            label: "Duration",
            render: (val: number) => (
                <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>{val} mins</span>
                </div>
            )
        },
        {
            key: "platform",
            label: "Platform",
            render: (val: string) => {
                const platformLabels: Record<string, string> = {
                    google_meet: "Google Meet",
                    zoom: "Zoom",
                    teams: "MS Teams",
                    daily: "Daily.co"
                };
                return (
                    <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                        {platformLabels[val] || val}
                    </Badge>
                );
            }
        },
        {
            key: "status",
            label: "Status",
            render: (val: string) => getStatusBadge(val)
        },
        {
            key: "meeting_url",
            label: "Action",
            render: (val: string, row: Webinar) => (
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        onClick={() => handleJoinMeeting(row)}
                        disabled={!row.meeting_url || row.status === 'cancelled'}
                        className={row.status === 'live'
                            ? "bg-red-600 hover:bg-red-700 animate-pulse"
                            : "bg-emerald-600 hover:bg-emerald-700"}
                    >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        {row.status === 'live' ? 'Join Now' : 'Join'}
                    </Button>
                    {row.meeting_url && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCopyLink(row)}
                            className="border-gray-700"
                        >
                            {copiedId === row.id ? (
                                <Check className="h-3 w-3 text-green-500" />
                            ) : (
                                <Copy className="h-3 w-3" />
                            )}
                        </Button>
                    )}
                </div>
            )
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-emerald-500 mx-auto mb-4" />
                    <p className="text-gray-400">Loading webinars...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <StandardListPage
                title="Webinars & Live Classes"
                description="Schedule and manage live sessions and webinars."
                columns={columns}
                data={data}
                actionLabel="Schedule Webinar"
                onAdd={() => setShowCreateDialog(true)}
                onDelete={handleDelete}
            />

            {/* Create Webinar Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Video className="h-5 w-5 text-emerald-500" />
                            Schedule New Webinar
                        </DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Create a new live class or webinar session.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., Introduction to React Hooks"
                                className="bg-gray-800 border-gray-700"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Brief description of the webinar"
                                className="bg-gray-800 border-gray-700"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="scheduled_at">Date & Time</Label>
                                <Input
                                    id="scheduled_at"
                                    type="datetime-local"
                                    value={formData.scheduled_at}
                                    onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                                    className="bg-gray-800 border-gray-700"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="duration">Duration (mins)</Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    value={formData.duration_minutes}
                                    onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 60 })}
                                    className="bg-gray-800 border-gray-700"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="platform">Platform</Label>
                            <Select
                                value={formData.platform}
                                onValueChange={(value) => setFormData({ ...formData, platform: value })}
                            >
                                <SelectTrigger className="bg-gray-800 border-gray-700">
                                    <SelectValue placeholder="Select platform" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700">
                                    <SelectItem value="google_meet">Google Meet (Free)</SelectItem>
                                    <SelectItem value="zoom">Zoom</SelectItem>
                                    <SelectItem value="teams">Microsoft Teams</SelectItem>
                                    <SelectItem value="daily">Daily.co</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="meeting_url">
                                Meeting Link
                                <span className="text-xs text-gray-500 ml-2">
                                    (Create a meeting in Google Meet and paste the link)
                                </span>
                            </Label>
                            <Input
                                id="meeting_url"
                                value={formData.meeting_url}
                                onChange={(e) => setFormData({ ...formData, meeting_url: e.target.value })}
                                placeholder="https://meet.google.com/xxx-xxxx-xxx"
                                className="bg-gray-800 border-gray-700"
                            />
                            <p className="text-xs text-gray-500">
                                💡 Go to <a href="https://meet.google.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">meet.google.com</a> → Start a meeting → Copy the link
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowCreateDialog(false)}
                            className="border-gray-700"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreate}
                            disabled={creating || !formData.title || !formData.scheduled_at}
                            className="bg-emerald-600 hover:bg-emerald-700"
                        >
                            {creating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Schedule Webinar"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
