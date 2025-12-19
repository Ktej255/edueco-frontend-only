"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Upload, CheckCircle2, Clock, TrendingUp, Image, X, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { graphotherapyService, DayDetailResponse, GRAPHOTHERAPY_LEVELS } from "@/services/graphotherapyService";
import { useToast } from "@/components/ui/Toast";

export default function DayPracticePage() {
    const params = useParams();
    const router = useRouter();
    const { showToast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const levelId = parseInt(params.levelId as string);
    const dayNumber = parseInt(params.dayNumber as string);

    const [dayData, setDayData] = useState<DayDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (levelId && dayNumber) {
            loadDayData();
        }
    }, [levelId, dayNumber]);

    const loadDayData = async () => {
        try {
            setLoading(true);
            const data = await graphotherapyService.getDayDetail(levelId, dayNumber);
            setDayData(data);
        } catch (err: any) {
            console.error("Failed to load day data:", err);
            setError(err.response?.data?.detail || err.message || "Failed to load day");
            // Mock data for development
            setDayData({
                level: levelId,
                day_number: dayNumber,
                is_unlocked: dayNumber === 1,
                is_completed: false,
                completed_at: null,
                upload_url: null,
                can_complete_today: dayNumber === 1
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                showToast("Please select an image file", "error");
                return;
            }
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async () => {
        if (!selectedFile) {
            showToast("Please select an image to upload", "error");
            return;
        }

        try {
            setUploading(true);
            const result = await graphotherapyService.completeDay(levelId, dayNumber, selectedFile);

            showToast(result.message, "success");

            if (result.level_completed) {
                showToast(`🎉 Congratulations! You completed Level ${levelId}!`, "success");
            }

            // Refresh day data
            await loadDayData();

        } catch (err: any) {
            console.error("Failed to complete day:", err);
            showToast(err.response?.data?.detail || "Failed to submit practice", "error");
        } finally {
            setUploading(false);
        }
    };

    const getLevelColor = (level: number) => {
        const colors = {
            1: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400", gradient: "from-blue-500 to-blue-600" },
            2: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400", gradient: "from-purple-500 to-purple-600" },
            3: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-600 dark:text-orange-400", gradient: "from-orange-500 to-orange-600" },
            4: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-600 dark:text-green-400", gradient: "from-green-500 to-green-600" }
        };
        return colors[level as keyof typeof colors] || colors[1];
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const colors = getLevelColor(levelId);
    const levelConfig = GRAPHOTHERAPY_LEVELS[levelId as keyof typeof GRAPHOTHERAPY_LEVELS];

    if (!dayData?.is_unlocked) {
        return (
            <div className="max-w-2xl mx-auto p-6 text-center">
                <Card className="p-8">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Day Locked</h2>
                    <p className="text-muted-foreground mb-6">
                        Complete Day {dayNumber - 1} first to unlock this day.
                    </p>
                    <Button variant="outline" onClick={() => router.back()}>
                        Go Back
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-3xl mx-auto p-4 md:p-6">
            {/* Back Button */}
            <Button variant="ghost" onClick={() => router.push(`/student/graphotherapy/level/${levelId}`)} className="text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Level {levelId}
            </Button>

            {/* Day Header */}
            <Card className={`bg-gradient-to-r ${colors.gradient} text-white border-0`}>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-white/80 mb-1">
                                Level {levelId}: {levelConfig?.name}
                            </div>
                            <h1 className="text-3xl font-bold">Day {dayNumber}</h1>
                            <p className="text-white/90 mt-1">Daily Graphotherapy Practice</p>
                        </div>
                        {dayData.is_completed && (
                            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                                <CheckCircle2 className="h-5 w-5" />
                                <span className="font-medium">Completed</span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Completed State */}
            {dayData.is_completed && (
                <Card className="border-green-500 bg-green-50 dark:bg-green-900/20">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <CheckCircle2 className="h-8 w-8 text-green-600 flex-shrink-0" />
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-green-800 dark:text-green-400">
                                    Great Work!
                                </h3>
                                <p className="text-green-700 dark:text-green-300 mb-3">
                                    You completed this day's practice on{" "}
                                    {dayData.completed_at && new Date(dayData.completed_at).toLocaleDateString("en-US", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                </p>
                                {dayData.upload_url && (
                                    <div className="mt-4">
                                        <p className="text-sm text-green-600 dark:text-green-400 mb-2">Your uploaded practice:</p>
                                        <img
                                            src={dayData.upload_url}
                                            alt="Practice upload"
                                            className="max-w-full h-auto rounded-lg border border-green-300 dark:border-green-700"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 flex gap-4">
                            {dayNumber < (levelConfig?.days || 0) && (
                                <Link href={`/student/graphotherapy/level/${levelId}/day/${dayNumber + 1}`}>
                                    <Button>
                                        Continue to Day {dayNumber + 1}
                                    </Button>
                                </Link>
                            )}
                            <Link href={`/student/graphotherapy/level/${levelId}`}>
                                <Button variant="outline">
                                    View All Days
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Upload Section - Only show if not completed */}
            {!dayData.is_completed && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Upload className="h-5 w-5" />
                            Upload Your Practice
                        </CardTitle>
                        <CardDescription>
                            Take a photo of today's handwriting practice and upload it to complete this day.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Upload Area */}
                        {!selectedFile ? (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-12 text-center hover:border-primary dark:hover:border-primary transition-colors cursor-pointer"
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleFileSelect}
                                    accept="image/*"
                                />
                                <Image className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-foreground mb-2">
                                    Drop your practice image here
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    or click to browse your files
                                </p>
                                <Button variant="outline">Select Image</Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="relative inline-block">
                                    <img
                                        src={previewUrl || ""}
                                        alt="Preview"
                                        className="max-w-full h-auto max-h-96 rounded-lg border"
                                    />
                                    <button
                                        onClick={handleRemoveFile}
                                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                                </p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            onClick={handleSubmit}
                            disabled={!selectedFile || uploading}
                            className="w-full"
                            size="lg"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="mr-2 h-5 w-5" />
                                    Complete Day {dayNumber}
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Tips Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Tips for Today's Practice</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            Write slowly and deliberately, focusing on each stroke
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            Maintain consistent pressure throughout your writing
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            Practice for at least 15-20 minutes for best results
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            Take a clear photo in good lighting
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
