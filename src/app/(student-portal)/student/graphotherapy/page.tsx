"use client";

import { useState, useEffect } from "react";
import { PenTool, Lock, Unlock, ChevronRight, TrendingUp, Calendar, Target, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { graphotherapyService, OverviewResponse, GRAPHOTHERAPY_LEVELS } from "@/services/graphotherapyService";

export default function GraphotherapyPage() {
    const [overview, setOverview] = useState<OverviewResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadOverview();
    }, []);

    const loadOverview = async () => {
        try {
            setLoading(true);
            const data = await graphotherapyService.getOverview();
            setOverview(data);
        } catch (err: any) {
            console.error("Failed to load graphotherapy overview:", err);
            setError(err.message || "Failed to load data");
            // Set mock data for development
            setOverview({
                current_level: 1,
                current_day: 1,
                total_streak: 0,
                last_practice_date: null,
                levels: [
                    { level: 1, name: "Foundation", description: "Building core handwriting habits", total_days: 21, completed_days: 0, is_unlocked: true, is_current: true, is_completed: false },
                    { level: 2, name: "Intermediate", description: "Improving letter formations", total_days: 30, completed_days: 0, is_unlocked: true, is_current: false, is_completed: false },
                    { level: 3, name: "Advanced", description: "Word and sentence practice", total_days: 40, completed_days: 0, is_unlocked: true, is_current: false, is_completed: false },
                    { level: 4, name: "Mastery", description: "Full handwriting transformation", total_days: 90, completed_days: 0, is_unlocked: true, is_current: false, is_completed: false },
                ],
                total_days_completed: 0,
                total_days_remaining: 181
            });
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

    const totalDays = 21 + 30 + 40 + 90; // 181 total
    const progressPercent = overview ? (overview.total_days_completed / totalDays) * 100 : 0;

    return (
        <div className="space-y-8 max-w-6xl mx-auto p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Graphotherapy Journey</h1>
                    <p className="text-gray-600 dark:text-gray-400">Transform your handwriting through consistent daily practice</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                        <TrendingUp className="h-5 w-5 text-orange-600" />
                        <span className="font-bold text-orange-600">{overview?.total_streak || 0} Day Streak</span>
                    </div>
                </div>
            </div>

            {/* Overall Progress */}
            <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                        <div>
                            <h2 className="text-xl font-bold mb-1">Your Transformation Journey</h2>
                            <p className="text-indigo-100">181 days to master your handwriting</p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold">{overview?.total_days_completed || 0}</div>
                            <div className="text-sm text-indigo-200">Days Completed</div>
                        </div>
                    </div>
                    <Progress value={progressPercent} className="h-3 bg-white/20" />
                    <div className="flex justify-between mt-2 text-sm text-indigo-200">
                        <span>Level {overview?.current_level || 1}, Day {overview?.current_day || 1}</span>
                        <span>{overview?.total_days_remaining || 181} days remaining</span>
                    </div>
                </CardContent>
            </Card>

            {/* Current Day Quick Action */}
            {overview && overview.current_level && (
                <Card className="border-2 border-primary/30 bg-primary/5">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className={`w-16 h-16 rounded-2xl ${getLevelColor(overview.current_level).bg} flex items-center justify-center`}>
                                    <PenTool className={`h-8 w-8 ${getLevelColor(overview.current_level).text}`} />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Today's Practice</div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                        Level {overview.current_level} - Day {overview.current_day}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {GRAPHOTHERAPY_LEVELS[overview.current_level as keyof typeof GRAPHOTHERAPY_LEVELS]?.name}
                                    </p>
                                </div>
                            </div>
                            <Link href={`/student/graphotherapy/level/${overview.current_level}/day/${overview.current_day}`}>
                                <Button size="lg" className="w-full md:w-auto">
                                    Start Today's Practice
                                    <ChevronRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Level Cards */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">All Levels</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {overview?.levels.map((level) => {
                        const colors = getLevelColor(level.level);
                        const progressPercent = (level.completed_days / level.total_days) * 100;

                        return (
                            <Card
                                key={level.level}
                                className={`relative overflow-hidden transition-all ${level.is_current ? `border-2 ${colors.border}` : ''
                                    } ${!level.is_unlocked ? 'opacity-60' : 'hover:shadow-lg cursor-pointer'}`}
                            >
                                {level.is_current && (
                                    <div className={`absolute top-0 right-0 px-3 py-1 ${colors.bg} ${colors.text} text-xs font-bold rounded-bl-lg`}>
                                        CURRENT
                                    </div>
                                )}
                                {level.is_completed && (
                                    <div className="absolute top-0 right-0 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 text-xs font-bold rounded-bl-lg flex items-center gap-1">
                                        <CheckCircle2 className="h-3 w-3" /> COMPLETED
                                    </div>
                                )}
                                <CardHeader>
                                    <div className="flex items-start gap-4">
                                        <div className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center`}>
                                            {level.is_unlocked ? (
                                                <span className={`text-2xl font-bold ${colors.text}`}>{level.level}</span>
                                            ) : (
                                                <Lock className={`h-6 w-6 ${colors.text}`} />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                Level {level.level}: {level.name}
                                                {level.is_unlocked && !level.is_completed && (
                                                    <Unlock className="h-4 w-4 text-green-500" />
                                                )}
                                            </CardTitle>
                                            <CardDescription className="mt-1">
                                                {level.description}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                {level.total_days} Days
                                            </span>
                                            <span className={colors.text}>
                                                {level.completed_days} / {level.total_days} completed
                                            </span>
                                        </div>
                                        <Progress value={progressPercent} className="h-2" />

                                        {level.is_unlocked ? (
                                            <Link href={`/student/graphotherapy/level/${level.level}`}>
                                                <Button variant="outline" className="w-full mt-2">
                                                    {level.is_completed ? "Review Level" : "Continue"}
                                                    <ChevronRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            </Link>
                                        ) : (
                                            <Button variant="outline" className="w-full mt-2" disabled>
                                                <Lock className="mr-2 h-4 w-4" />
                                                Complete Level {level.level - 1} First
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-neutral-900">
                    <CardContent className="p-4 text-center">
                        <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{overview?.current_level || 1}</div>
                        <div className="text-xs text-gray-400">Current Level</div>
                    </CardContent>
                </Card>
                <Card className="bg-neutral-900">
                    <CardContent className="p-4 text-center">
                        <Calendar className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{overview?.total_days_completed || 0}</div>
                        <div className="text-xs text-gray-400">Days Done</div>
                    </CardContent>
                </Card>
                <Card className="bg-neutral-900">
                    <CardContent className="p-4 text-center">
                        <TrendingUp className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{overview?.total_streak || 0}</div>
                        <div className="text-xs text-gray-400">Day Streak</div>
                    </CardContent>
                </Card>
                <Card className="bg-neutral-900">
                    <CardContent className="p-4 text-center">
                        <PenTool className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{Math.round(progressPercent)}%</div>
                        <div className="text-xs text-gray-400">Complete</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
