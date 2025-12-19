"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Lock, CheckCircle2, Circle, Calendar, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { graphotherapyService, LevelDetailResponse, GRAPHOTHERAPY_LEVELS, DayInfo } from "@/services/graphotherapyService";

export default function LevelDetailPage() {
    const params = useParams();
    const router = useRouter();
    const levelId = parseInt(params.levelId as string);

    const [levelData, setLevelData] = useState<LevelDetailResponse | null>(null);
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
            const data = await graphotherapyService.getLevelDetail(levelId);
            setLevelData(data);
        } catch (err: any) {
            console.error("Failed to load level data:", err);
            setError(err.response?.data?.detail || err.message || "Failed to load level");
            // Mock data for development
            const levelConfig = GRAPHOTHERAPY_LEVELS[levelId as keyof typeof GRAPHOTHERAPY_LEVELS];
            if (levelConfig) {
                const days: DayInfo[] = Array.from({ length: levelConfig.days }, (_, i) => ({
                    day_number: i + 1,
                    is_unlocked: i === 0,
                    is_completed: false,
                    completed_at: null,
                    upload_url: null
                }));
                setLevelData({
                    level: levelId,
                    name: levelConfig.name,
                    description: levelConfig.description,
                    total_days: levelConfig.days,
                    days
                });
            }
        } finally {
            setLoading(false);
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

    if (!levelData) {
        return (
            <div className="p-6 text-center">
                <p className="text-muted-foreground">{error || "Level not found"}</p>
                <Button variant="outline" onClick={() => router.back()} className="mt-4">
                    Go Back
                </Button>
            </div>
        );
    }

    const colors = getLevelColor(levelId);
    const completedDays = levelData.days.filter(d => d.is_completed).length;
    const progressPercent = (completedDays / levelData.total_days) * 100;

    return (
        <div className="space-y-6 max-w-6xl mx-auto p-4 md:p-6">
            {/* Back Button */}
            <Button variant="ghost" onClick={() => router.push("/student/graphotherapy")} className="mb-2 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Graphotherapy
            </Button>

            {/* Level Header */}
            <Card className={`bg-gradient-to-r ${colors.gradient} text-white border-0`}>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="text-sm text-white/80 mb-1">Level {levelId}</div>
                            <h1 className="text-3xl font-bold mb-2">{levelData.name}</h1>
                            <p className="text-white/90">{levelData.description}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-bold">{completedDays}/{levelData.total_days}</div>
                            <div className="text-sm text-white/80">Days Completed</div>
                        </div>
                    </div>
                    <div className="mt-6">
                        <Progress value={progressPercent} className="h-3 bg-white/20" />
                        <div className="flex justify-between mt-2 text-sm text-white/80">
                            <span>{Math.round(progressPercent)}% Complete</span>
                            <span>{levelData.total_days - completedDays} days remaining</span>
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

                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-3">
                    {levelData.days.map((day) => {
                        const DayWrapper = day.is_unlocked ? Link : 'div';
                        const wrapperProps = day.is_unlocked
                            ? { href: `/student/graphotherapy/level/${levelId}/day/${day.day_number}` }
                            : {};

                        return (
                            <div key={day.day_number}>
                                {day.is_unlocked ? (
                                    <Link href={`/student/graphotherapy/level/${levelId}/day/${day.day_number}`}>
                                        <Card className={`transition-all cursor-pointer hover:shadow-md ${day.is_completed
                                            ? 'bg-green-100 dark:bg-green-900/30 border-green-500'
                                            : 'hover:border-primary'
                                            }`}>
                                            <CardContent className="p-4 text-center">
                                                <div className="mb-2">
                                                    {day.is_completed ? (
                                                        <CheckCircle2 className="h-6 w-6 text-green-600 mx-auto" />
                                                    ) : (
                                                        <Circle className={`h-6 w-6 mx-auto ${colors.text}`} />
                                                    )}
                                                </div>
                                                <div className="text-sm font-bold text-gray-900 dark:text-gray-100">Day {day.day_number}</div>
                                                {day.is_completed && day.completed_at && (
                                                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                        {new Date(day.completed_at).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ) : (
                                    <Card className="opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-800/50">
                                        <CardContent className="p-4 text-center">
                                            <div className="mb-2">
                                                <Lock className="h-6 w-6 text-gray-400 dark:text-gray-500 mx-auto" />
                                            </div>
                                            <div className="text-sm font-bold text-gray-700 dark:text-gray-400">Day {day.day_number}</div>
                                            <div className="text-xs text-gray-600 dark:text-gray-500 mt-1">
                                                {day.unlock_date ? (
                                                    `Unlocks ${new Date(day.unlock_date).toLocaleDateString() === new Date().toLocaleDateString()
                                                        ? 'tomorrow at 12 AM'
                                                        : new Date(day.unlock_date).toLocaleDateString()}`
                                                ) : (
                                                    'Locked'
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4 text-center">
                        <div className={`text-2xl font-bold ${colors.text}`}>{completedDays}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Completed</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{levelData.total_days - completedDays}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Remaining</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{Math.round(progressPercent)}%</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Progress</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
