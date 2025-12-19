"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Lock, CheckCircle2, Brain } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { meditationService, MeditationLevelDetail, MEDITATION_LEVELS } from "@/services/meditationService";

export default function MeditationLevelPage() {
    const params = useParams();
    const router = useRouter();
    const levelId = parseInt(params.levelId as string);

    const [levelData, setLevelData] = useState<MeditationLevelDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (levelId) {
            loadLevelData();
        }
    }, [levelId]);

    const loadLevelData = async () => {
        try {
            setLoading(true);
            const data = await meditationService.getLevelDetail(levelId);
            setLevelData(data);
        } catch (err: any) {
            console.error("Failed to load level:", err);
            setError(err.message || "Failed to load level data");
        } finally {
            setLoading(false);
        }
    };

    const getLevelColor = (level: number) => {
        const colors = {
            1: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400", border: "border-blue-500" },
            2: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400", border: "border-purple-500" },
            3: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-600 dark:text-orange-400", border: "border-orange-500" },
            4: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-600 dark:text-green-400", border: "border-green-500" }
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

    if (error || !levelData) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500">{error || "Failed to load level data"}</p>
                <Button onClick={() => router.push("/student/meditation")} className="mt-4">
                    Back to Meditation
                </Button>
            </div>
        );
    }

    const colors = getLevelColor(levelId);
    const completedDays = levelData.days.filter(d => d.is_completed).length;

    return (
        <div className="space-y-6 max-w-6xl mx-auto p-4 md:p-6">
            {/* Back Button */}
            <Button variant="ghost" onClick={() => router.push("/student/meditation")} className="mb-2 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Meditation
            </Button>

            {/* Level Header */}
            <Card className={`${colors.bg} border-0`}>
                <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center">
                            <Brain className={`h-8 w-8 ${colors.text}`} />
                        </div>
                        <div>
                            <h1 className={`text-2xl font-bold ${colors.text}`}>
                                Level {levelData.level}: {levelData.name}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                {levelData.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {levelData.total_days} Days Total
                                </span>
                                <span className={colors.text}>
                                    {completedDays} / {levelData.total_days} Completed
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Days Grid */}
            <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                    Daily Practice Schedule
                </h2>
                <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-3">
                    {levelData.days.map((day) => {
                        const isCompleted = day.is_completed;
                        const isUnlocked = day.is_unlocked;

                        return (
                            <div key={day.day_number}>
                                {isUnlocked ? (
                                    <Link href={`/student/meditation/level/${levelId}/day/${day.day_number}`}>
                                        <Card className={`hover:shadow-md transition-all cursor-pointer ${isCompleted
                                            ? `${colors.bg} ${colors.border} border-2`
                                            : 'hover:border-primary'
                                            }`}>
                                            <CardContent className="p-3 text-center">
                                                <div className="mb-1">
                                                    {isCompleted ? (
                                                        <CheckCircle2 className={`h-5 w-5 mx-auto ${colors.text}`} />
                                                    ) : (
                                                        <Brain className="h-5 w-5 mx-auto text-gray-600 dark:text-gray-400" />
                                                    )}
                                                </div>
                                                <div className={`text-sm font-bold ${isCompleted ? colors.text : 'text-gray-700 dark:text-gray-300'}`}>
                                                    Day {day.day_number}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {day.processes_count} proc
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ) : (
                                    <Card className="opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-800/50">
                                        <CardContent className="p-3 text-center">
                                            <div className="mb-1">
                                                <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500 mx-auto" />
                                            </div>
                                            <div className="text-sm font-bold text-gray-500 dark:text-gray-400">
                                                Day {day.day_number}
                                            </div>
                                            <div className="text-xs text-gray-400 dark:text-gray-500">
                                                {day.unlock_date ? "Tomorrow" : "Locked"}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
