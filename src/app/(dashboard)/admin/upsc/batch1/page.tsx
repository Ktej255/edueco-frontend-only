"use client";

import { useState, useEffect } from "react";
import { Upload, Video, Save, ChevronRight, Layers, Calendar, Clock, FileText, Trash2, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Link from "next/link";

// Course structure
const UPSC_CYCLES = [
    { id: 1, name: "Indian Polity", theme: "The Rules of the Game", dates: "Jan 1-10", color: "blue" },
    { id: 2, name: "Modern History", theme: "Chronology & Consequence", dates: "Jan 11-20", color: "amber" },
    { id: 3, name: "Geography", theme: "Concept & Map Work", dates: "Jan 21-30", color: "green" },
    { id: 4, name: "Indian Economy", theme: "Concepts + Budget", dates: "Jan 31-Feb 9", color: "purple" },
    { id: 5, name: "Environment & Ecology", theme: "Species, Acts & Climate", dates: "Feb 10-19", color: "emerald" },
    { id: 6, name: "Science & Technology", theme: "Application & New Tech", dates: "Feb 20-Mar 1", color: "cyan" },
    { id: 7, name: "Ancient, Medieval & Culture", theme: "Terminology & Chronology", dates: "Mar 2-11", color: "orange" },
    { id: 8, name: "International Relations", theme: "Mapping & Groupings", dates: "Mar 12-21", color: "rose" },
    { id: 9, name: "Revision & Mocks", theme: "Closing the Gaps", dates: "Mar 22-31", color: "indigo" }
];

export default function AdminBatch1Page() {
    const [selectedCycle, setSelectedCycle] = useState<number | null>(null);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);

    const getColorClasses = (color: string) => {
        const colors: Record<string, { bg: string; text: string; border: string }> = {
            blue: { bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-500" },
            amber: { bg: "bg-amber-100", text: "text-amber-600", border: "border-amber-500" },
            green: { bg: "bg-green-100", text: "text-green-600", border: "border-green-500" },
            purple: { bg: "bg-purple-100", text: "text-purple-600", border: "border-purple-500" },
            emerald: { bg: "bg-emerald-100", text: "text-emerald-600", border: "border-emerald-500" },
            cyan: { bg: "bg-cyan-100", text: "text-cyan-600", border: "border-cyan-500" },
            orange: { bg: "bg-orange-100", text: "text-orange-600", border: "border-orange-500" },
            rose: { bg: "bg-rose-100", text: "text-rose-600", border: "border-rose-500" },
            indigo: { bg: "bg-indigo-100", text: "text-indigo-600", border: "border-indigo-500" }
        };
        return colors[color] || colors.blue;
    };

    return (
        <div className="space-y-6 p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <Layers className="h-8 w-8 text-indigo-600" />
                        Batch 1 - Content Management
                    </h1>
                    <p className="text-gray-500 mt-1">
                        UPSC Prelims 2026 • 90 Days • Upload videos for each segment
                    </p>
                </div>
            </div>

            {/* Info Card */}
            <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                    <h3 className="font-semibold text-blue-700 mb-2">Content Structure</h3>
                    <ul className="text-sm text-blue-600 space-y-1">
                        <li>• Each day has <strong>3 Parts</strong> (2 hours each)</li>
                        <li>• Each part has <strong>4 video segments</strong> (~25 min each)</li>
                        <li>• Total: <strong>12 videos per day</strong> (4 segments × 3 parts)</li>
                        <li>• Students watch video → record audio/text → AI analyzes recall</li>
                    </ul>
                </CardContent>
            </Card>

            {/* Cycles Grid */}
            {!selectedCycle ? (
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Select Cycle to Manage</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {UPSC_CYCLES.map((cycle) => {
                            const colors = getColorClasses(cycle.color);
                            return (
                                <Card
                                    key={cycle.id}
                                    className={`cursor-pointer hover:shadow-lg transition-all border-l-4 ${colors.border}`}
                                    onClick={() => setSelectedCycle(cycle.id)}
                                >
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
                                                <span className={`text-xl font-bold ${colors.text}`}>{cycle.id}</span>
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">{cycle.name}</CardTitle>
                                                <CardDescription className="text-xs">{cycle.theme}</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                {cycle.dates}
                                            </span>
                                            <span>10 days</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            ) : !selectedDay ? (
                /* Day Selection */
                <div>
                    <Button variant="ghost" onClick={() => setSelectedCycle(null)} className="mb-4">
                        ← Back to Cycles
                    </Button>

                    <Card className={`${getColorClasses(UPSC_CYCLES[selectedCycle - 1].color).bg} border-0 mb-6`}>
                        <CardContent className="p-4">
                            <h2 className={`text-xl font-bold ${getColorClasses(UPSC_CYCLES[selectedCycle - 1].color).text}`}>
                                Cycle {selectedCycle}: {UPSC_CYCLES[selectedCycle - 1].name}
                            </h2>
                            <p className="text-gray-600">{UPSC_CYCLES[selectedCycle - 1].theme}</p>
                        </CardContent>
                    </Card>

                    <h3 className="text-lg font-semibold mb-4">Select Day to Upload Content</h3>
                    <div className="grid grid-cols-5 gap-3">
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((day) => (
                            <Card
                                key={day}
                                className="cursor-pointer hover:shadow-md hover:border-primary transition-all text-center"
                                onClick={() => setSelectedDay(day)}
                            >
                                <CardContent className="p-4">
                                    <div className="text-2xl font-bold text-gray-700">{day}</div>
                                    <div className="text-xs text-gray-500">Day {day}</div>
                                    <div className="text-xs text-gray-400 mt-1">12 segments</div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ) : (
                /* Video Upload for Day */
                <DayContentUpload
                    cycleId={selectedCycle}
                    cycleName={UPSC_CYCLES[selectedCycle - 1].name}
                    dayNumber={selectedDay}
                    color={UPSC_CYCLES[selectedCycle - 1].color}
                    onBack={() => setSelectedDay(null)}
                />
            )}
        </div>
    );
}

// Uploaded segment info interface
interface UploadedSegment {
    title: string;
    key_points: string;
    video_url: string | null;
}

// Day Content Upload Component
function DayContentUpload({ cycleId, cycleName, dayNumber, color, onBack }: {
    cycleId: number;
    cycleName: string;
    dayNumber: number;
    color: string;
    onBack: () => void;
}) {
    const [videos, setVideos] = useState<Record<string, { file: File | null; title: string; notes: string; existingVideoUrl?: string | null }>>({});
    const [saving, setSaving] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<string>("");
    const [loading, setLoading] = useState(true);

    const parts = [1, 2, 3];
    const segmentsPerPart = 4;

    // Fetch existing segments on load
    useEffect(() => {
        const fetchExistingContent = async () => {
            setLoading(true);
            try {
                // Fetch all 3 parts
                for (const part of parts) {
                    const response = await fetch(
                        `http://localhost:8000/api/v1/batch1/cycle/${cycleId}/day/${dayNumber}/part/${part}`
                    );
                    if (response.ok) {
                        const data = await response.json();
                        // Update state with existing data
                        data.segments?.forEach((seg: UploadedSegment & { id: number }) => {
                            const key = `${part}-${seg.id}`;
                            if (seg.video_url || (seg.title && !seg.title.includes("Not Uploaded"))) {
                                setVideos(prev => ({
                                    ...prev,
                                    [key]: {
                                        file: null,
                                        title: seg.title || "",
                                        notes: seg.key_points || "",
                                        existingVideoUrl: seg.video_url
                                    }
                                }));
                            }
                        });
                    }
                }
            } catch (error) {
                console.error("Failed to fetch existing content:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExistingContent();
    }, [cycleId, dayNumber]);

    const getColorClasses = (c: string) => {
        const colors: Record<string, { bg: string; text: string }> = {
            blue: { bg: "bg-blue-100", text: "text-blue-600" },
            amber: { bg: "bg-amber-100", text: "text-amber-600" },
            green: { bg: "bg-green-100", text: "text-green-600" },
            purple: { bg: "bg-purple-100", text: "text-purple-600" },
            emerald: { bg: "bg-emerald-100", text: "text-emerald-600" },
            cyan: { bg: "bg-cyan-100", text: "text-cyan-600" },
            orange: { bg: "bg-orange-100", text: "text-orange-600" },
            rose: { bg: "bg-rose-100", text: "text-rose-600" },
            indigo: { bg: "bg-indigo-100", text: "text-indigo-600" }
        };
        return colors[c] || colors.blue;
    };

    const handleVideoChange = (part: number, segment: number, file: File | null) => {
        const key = `${part}-${segment}`;
        setVideos(prev => ({
            ...prev,
            [key]: { ...prev[key], file, title: prev[key]?.title || "", notes: prev[key]?.notes || "" }
        }));
    };

    const handleSaveAll = async () => {
        setSaving(true);
        setUploadProgress("Starting upload...");

        try {
            let uploadedCount = 0;
            const totalToUpload = Object.keys(videos).filter(k => videos[k]?.file || videos[k]?.title).length;

            // Upload each segment that has content
            for (const part of parts) {
                for (let seg = 1; seg <= segmentsPerPart; seg++) {
                    const key = `${part}-${seg}`;
                    const video = videos[key];

                    if (video && (video.file || video.title)) {
                        setUploadProgress(`Uploading Part ${part} Segment ${seg}...`);

                        const formData = new FormData();
                        formData.append("title", video.title || `Segment ${seg}`);
                        formData.append("key_points", video.notes || "");

                        if (video.file) {
                            formData.append("video", video.file);
                        }

                        // Call backend API
                        const response = await fetch(
                            `http://localhost:8000/api/v1/batch1/cycle/${cycleId}/day/${dayNumber}/part/${part}/segment/${seg}`,
                            {
                                method: "POST",
                                body: formData,
                            }
                        );

                        if (!response.ok) {
                            throw new Error(`Failed to upload Part ${part} Segment ${seg}`);
                        }

                        uploadedCount++;
                        setUploadProgress(`Uploaded ${uploadedCount}/${totalToUpload} segments`);
                    }
                }
            }

            setUploadProgress("");
            toast.success(`Successfully uploaded ${uploadedCount} segment(s)!`);
        } catch (error: any) {
            console.error("Upload failed:", error);
            toast.error(`Upload failed: ${error.message}`);
            setUploadProgress("");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Button variant="ghost" onClick={onBack}>← Back to Days</Button>

            <Card className={`${getColorClasses(color).bg} border-0`}>
                <CardContent className="p-4">
                    <h2 className={`text-xl font-bold ${getColorClasses(color).text}`}>
                        Cycle {cycleId}: {cycleName} - Day {dayNumber}
                    </h2>
                    <p className="text-gray-600">Upload 12 video segments (4 per part × 3 parts)</p>
                </CardContent>
            </Card>

            {/* Parts */}
            {parts.map((part) => (
                <Card key={part}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Part {part} (2 Hours)
                        </CardTitle>
                        <CardDescription>Upload 4 video segments (~25 min each)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {Array.from({ length: segmentsPerPart }, (_, i) => i + 1).map((seg) => {
                            const key = `${part}-${seg}`;
                            const video = videos[key];

                            return (
                                <div key={seg} className="border rounded-lg p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold text-gray-700">Segment {seg}</h4>
                                        <span className="text-xs text-gray-400">~25 minutes</span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Video File</Label>
                                            <div className="mt-1">
                                                {video?.file ? (
                                                    <div className="flex items-center gap-2 p-2 bg-green-50 rounded border border-green-200">
                                                        <Video className="h-4 w-4 text-green-600" />
                                                        <span className="text-sm text-green-700 truncate flex-1">
                                                            {video.file.name}
                                                        </span>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleVideoChange(part, seg, null)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-500" />
                                                        </Button>
                                                    </div>
                                                ) : video?.existingVideoUrl ? (
                                                    <div className="flex items-center gap-2 p-2 bg-blue-50 rounded border border-blue-200">
                                                        <CheckCircle className="h-4 w-4 text-blue-600" />
                                                        <span className="text-sm text-blue-700 flex-1">
                                                            ✅ Video uploaded
                                                        </span>
                                                        <input
                                                            type="file"
                                                            accept="video/*"
                                                            className="hidden"
                                                            id={`video-${key}`}
                                                            onChange={(e) => handleVideoChange(part, seg, e.target.files?.[0] || null)}
                                                        />
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => document.getElementById(`video-${key}`)?.click()}
                                                        >
                                                            Replace
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <input
                                                            type="file"
                                                            accept="video/*"
                                                            className="hidden"
                                                            id={`video-${key}`}
                                                            onChange={(e) => handleVideoChange(part, seg, e.target.files?.[0] || null)}
                                                        />
                                                        <Button
                                                            variant="outline"
                                                            className="w-full"
                                                            onClick={() => document.getElementById(`video-${key}`)?.click()}
                                                        >
                                                            <Upload className="mr-2 h-4 w-4" />
                                                            Upload Video
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <Label>Segment Title</Label>
                                            <Input
                                                placeholder="E.g., 1909 Morley-Minto Reforms"
                                                className="mt-1"
                                                value={video?.title || ""}
                                                onChange={(e) => {
                                                    setVideos(prev => ({
                                                        ...prev,
                                                        [key]: { ...prev[key], file: prev[key]?.file || null, title: e.target.value, notes: prev[key]?.notes || "" }
                                                    }));
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label>Key Points (for AI analysis)</Label>
                                        <Textarea
                                            placeholder="Enter key concepts students should recall..."
                                            className="mt-1"
                                            rows={2}
                                            value={video?.notes || ""}
                                            onChange={(e) => {
                                                setVideos(prev => ({
                                                    ...prev,
                                                    [key]: { ...prev[key], file: prev[key]?.file || null, title: prev[key]?.title || "", notes: e.target.value }
                                                }));
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            ))}

            {/* Save Button */}
            <div className="flex flex-col items-end gap-2">
                {uploadProgress && (
                    <p className="text-sm text-blue-600 animate-pulse">{uploadProgress}</p>
                )}
                <Button size="lg" onClick={handleSaveAll} disabled={saving}>
                    <Save className="mr-2 h-5 w-5" />
                    {saving ? "Uploading..." : "Save All Content"}
                </Button>
            </div>
        </div>
    );
}
