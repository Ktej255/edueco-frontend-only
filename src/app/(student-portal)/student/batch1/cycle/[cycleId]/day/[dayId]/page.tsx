"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Video, FileText, Upload, Play, Download, Clock, CheckCircle2, BookOpen, Unlock, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Course Data (same as parent page)
const UPSC_CYCLES = [
    {
        id: 1, name: "Indian Polity", theme: "The Rules of the Game", color: "blue",
        topics: [
            { day: 1, title: "Historical Background", description: "1909 vs 1919 vs 1935 Acts - Dyarchy, Bicameralism" },
            { day: 2, title: "Constitution Basics", description: "Preamble, Union & Territory (Art 1-4), Citizenship" },
            { day: 3, title: "Fundamental Rights I", description: "Writs, Article 19, 21 nuances" },
            { day: 4, title: "DPSP & Fundamental Duties", description: "42nd/44th Amendment changes" },
            { day: 5, title: "Parliament I", description: "Budget process, Cut motions, Guillotine" },
            { day: 6, title: "Parliament II", description: "Bills (Money vs Finance), Joint Sitting rules" },
            { day: 7, title: "Executive", description: "President's Pardoning/Veto vs Governor's powers" },
            { day: 8, title: "Judiciary", description: "Jurisdiction, Contempt, NJAC vs Collegium" },
            { day: 9, title: "Federalism & Local Gov", description: "7th Schedule, PESA Act 1996, 73rd Amendment" },
            { day: 10, title: "Current & Mock Test", description: "New Bills, Anti-Defection + Full Polity Mock" }
        ]
    },
    {
        id: 2, name: "Modern History", theme: "Chronology & Consequence", color: "amber", topics: [
            { day: 1, title: "Pre-1857 Era", description: "Decline of Mughals, Carnatic Wars" },
            { day: 2, title: "1857 Revolt", description: "Causes, Leaders, Failure" },
            { day: 3, title: "Social Reform I", description: "Raja Ram Mohan Roy" },
            { day: 4, title: "Social Reform II", description: "Dayanand to Ambedkar" },
            { day: 5, title: "INC Phases", description: "Moderates vs Extremists" },
            { day: 6, title: "Gandhian Era I", description: "Non-Cooperation" },
            { day: 7, title: "Gandhian Era II", description: "Civil Disobedience" },
            { day: 8, title: "Revolutionaries", description: "HRA/HSRA, Ghadar" },
            { day: 9, title: "Constitutional Acts", description: "1861 to 1947" },
            { day: 10, title: "Mock Test", description: "Full History Mock" }
        ]
    },
    { id: 3, name: "Geography", theme: "Concept & Map Work", color: "green", topics: Array.from({ length: 10 }, (_, i) => ({ day: i + 1, title: `Geography Day ${i + 1}`, description: "Topic content" })) },
    { id: 4, name: "Indian Economy", theme: "Concepts + Budget", color: "purple", topics: Array.from({ length: 10 }, (_, i) => ({ day: i + 1, title: `Economy Day ${i + 1}`, description: "Topic content" })) },
    { id: 5, name: "Environment & Ecology", theme: "Species, Acts & Climate", color: "emerald", topics: Array.from({ length: 10 }, (_, i) => ({ day: i + 1, title: `Environment Day ${i + 1}`, description: "Topic content" })) },
    { id: 6, name: "Science & Technology", theme: "Application & New Tech", color: "cyan", topics: Array.from({ length: 10 }, (_, i) => ({ day: i + 1, title: `Sci-Tech Day ${i + 1}`, description: "Topic content" })) },
    { id: 7, name: "Ancient, Medieval & Culture", theme: "Terminology & Chronology", color: "orange", topics: Array.from({ length: 10 }, (_, i) => ({ day: i + 1, title: `Culture Day ${i + 1}`, description: "Topic content" })) },
    { id: 8, name: "International Relations", theme: "Mapping & Groupings", color: "rose", topics: Array.from({ length: 10 }, (_, i) => ({ day: i + 1, title: `IR Day ${i + 1}`, description: "Topic content" })) },
    { id: 9, name: "Revision & Mocks", theme: "Closing the Gaps", color: "indigo", topics: Array.from({ length: 10 }, (_, i) => ({ day: i + 1, title: `Revision Day ${i + 1}`, description: "Topic content" })) },
];

// ADMIN MODE - Set to true to unlock all content for upload
const ADMIN_MODE = true;

export default function DayContentPage() {
    const params = useParams();
    const router = useRouter();
    const cycleId = parseInt(params.cycleId as string);
    const dayId = parseInt(params.dayId as string);

    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [notes, setNotes] = useState("");
    const [uploading, setUploading] = useState(false);

    const cycle = UPSC_CYCLES.find(c => c.id === cycleId);
    const topic = cycle?.topics.find(t => t.day === dayId);

    const getColorClasses = (color: string) => {
        const colors: Record<string, { bg: string; text: string }> = {
            blue: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600" },
            amber: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-600" },
            green: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-600" },
            purple: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600" },
            emerald: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-600" },
            cyan: { bg: "bg-cyan-100 dark:bg-cyan-900/30", text: "text-cyan-600" },
            orange: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-600" },
            rose: { bg: "bg-rose-100 dark:bg-rose-900/30", text: "text-rose-600" },
            indigo: { bg: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-600" }
        };
        return colors[color] || colors.blue;
    };

    if (!cycle || !topic) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500">Content not found</p>
                <Button onClick={() => router.push("/student/batch1")} className="mt-4">
                    Back to Batch 1
                </Button>
            </div>
        );
    }

    const colors = getColorClasses(cycle.color);

    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploading(true);
            // Simulate upload - in production this would call an API
            setTimeout(() => {
                setVideoUrl(URL.createObjectURL(file));
                setUploading(false);
                toast.success("Video uploaded successfully!");
            }, 1500);
        }
    };

    const handleSaveNotes = () => {
        toast.success("Notes saved!");
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto p-4 md:p-6">
            {/* Back Button */}
            <Button
                variant="ghost"
                onClick={() => router.push("/student/batch1")}
                className="text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Batch 1
            </Button>

            {/* Header */}
            <Card className={`${colors.bg} border-0`}>
                <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                        <div className={`w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center`}>
                            <span className={`text-2xl font-bold ${colors.text}`}>{dayId}</span>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm text-gray-500">Cycle {cycleId}: {cycle.name}</span>
                                {ADMIN_MODE && (
                                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-600 rounded-full flex items-center gap-1">
                                        <Unlock className="h-3 w-3" /> Unlocked
                                    </span>
                                )}
                            </div>
                            <h1 className={`text-2xl font-bold ${colors.text}`}>
                                Day {dayId}: {topic.title}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                {topic.description}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Video Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                        <Video className="h-5 w-5" />
                        Lecture Video
                    </CardTitle>
                    <CardDescription>Upload or view the lecture video for this day</CardDescription>
                </CardHeader>
                <CardContent>
                    {videoUrl ? (
                        <div className="space-y-4">
                            <div className="aspect-video bg-black rounded-lg overflow-hidden">
                                <video src={videoUrl} controls className="w-full h-full" />
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => setVideoUrl(null)}>
                                    Replace Video
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                            <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 mb-4">No video uploaded yet</p>
                            <input
                                type="file"
                                accept="video/*"
                                onChange={handleVideoUpload}
                                className="hidden"
                                id="video-upload"
                            />
                            <Button
                                onClick={() => document.getElementById("video-upload")?.click()}
                                disabled={uploading}
                            >
                                <Upload className="mr-2 h-4 w-4" />
                                {uploading ? "Uploading..." : "Upload Video"}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Notes Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                        <FileText className="h-5 w-5" />
                        Lecture Notes / Key Points
                    </CardTitle>
                    <CardDescription>Add important points, bullet notes, or study material</CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Enter lecture notes here...

Example:
• Key Point 1: Historical Background of 1909 Act
• Key Point 2: Morley-Minto Reforms
• Key Point 3: Provincial autonomy under 1919 Act
• Important: Dyarchy system explained..."
                        rows={10}
                        className="mb-4"
                    />
                    <Button onClick={handleSaveNotes}>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Save Notes
                    </Button>
                </CardContent>
            </Card>

            {/* Materials Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                        <BookOpen className="h-5 w-5" />
                        Additional Materials
                    </CardTitle>
                    <CardDescription>Upload PDFs, handouts, or reference documents</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm mb-3">Drag & drop files or click to upload</p>
                        <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" className="hidden" id="material-upload" />
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById("material-upload")?.click()}
                        >
                            Choose Files
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
                {dayId > 1 && (
                    <Button
                        variant="outline"
                        onClick={() => router.push(`/student/batch1/cycle/${cycleId}/day/${dayId - 1}`)}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Previous Day
                    </Button>
                )}
                <div className="flex-1" />
                {dayId < 10 && (
                    <Button
                        onClick={() => router.push(`/student/batch1/cycle/${cycleId}/day/${dayId + 1}`)}
                    >
                        Next Day
                        <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                    </Button>
                )}
            </div>
        </div>
    );
}
