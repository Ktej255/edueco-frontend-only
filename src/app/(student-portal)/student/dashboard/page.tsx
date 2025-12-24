"use client";

import { useState, useEffect, useCallback } from "react";
import {
    BookOpen,
    Brain,
    TrendingUp,
    ArrowRight,
    PlayCircle,
    Target,
    Pen,
    GraduationCap,
    RefreshCw,
    Clock,
    Rocket,
    Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import {
    getStudentStats,
    getResumePoint,
    getMeditationProgress,
    getGraphotherapyProgress,
    getLearningProgress,
    ResumePoint,
    StudentStats,
} from "@/services/progressStorage";

export default function StudentDashboard() {
    const [stats, setStats] = useState<StudentStats | null>(null);
    const [resumePoint, setResumePoint] = useState<ResumePoint | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Load stats from storage
    const loadStats = useCallback(() => {
        setIsRefreshing(true);

        const studentStats = getStudentStats();
        const resume = getResumePoint();

        setStats(studentStats);
        setResumePoint(resume);
        setLastUpdated(new Date());

        setTimeout(() => setIsRefreshing(false), 300);
    }, []);

    // Initial load
    useEffect(() => {
        loadStats();
    }, [loadStats]);

    // Listen for storage changes (cross-tab sync)
    useEffect(() => {
        const handleStorageChange = () => {
            loadStats();
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [loadStats]);

    // Auto-refresh on window focus
    useEffect(() => {
        const handleFocus = () => {
            loadStats();
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [loadStats]);

    // Auto-refresh every 30 seconds
    useEffect(() => {
        const interval = setInterval(loadStats, 30000);
        return () => clearInterval(interval);
    }, [loadStats]);

    if (!stats) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-6">
            {/* Hero Section with Resume Point */}
            <div className="relative overflow-hidden rounded-3xl bg-indigo-900 text-white shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-500 rounded-full blur-3xl opacity-10 -ml-10 -mb-10"></div>

                <div className="relative p-8 md:p-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-4 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm font-medium backdrop-blur-sm border border-white/10">
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                Continue Your Practice
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold font-display leading-tight text-white">
                                Welcome Back! 👋
                            </h1>
                            <p className="text-blue-100 text-lg">
                                Keep your {stats?.overallStreak || 0}-day streak alive! You have activities waiting.
                            </p>
                        </div>

                        {/* Resume Learning Card */}
                        {resumePoint && resumePoint.type && (
                            <Link href={resumePoint.href}>
                                <Card className="bg-white/10 border-white/20 hover:bg-white/20 transition-all cursor-pointer min-w-[280px]">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3 mb-2">
                                            <PlayCircle className="h-8 w-8 text-green-400" />
                                            <div>
                                                <p className="text-white font-semibold">Resume Learning</p>
                                                <p className="text-blue-200 text-sm">{resumePoint.label}</p>
                                            </div>
                                        </div>
                                        <p className="text-blue-300 text-xs">{resumePoint.details}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Refresh Button */}
            <div className="flex justify-end items-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={loadStats}
                    disabled={isRefreshing}
                >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl shadow-sm border flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-500">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Streak</p>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">{stats?.overallStreak || 0} Days 🔥</h4>
                    </div>
                </div>

                <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl shadow-sm border flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500">
                        <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Prelims Avg</p>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">{stats?.prelims?.avgRecall || 0}%</h4>
                    </div>
                </div>

                <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl shadow-sm border flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-500">
                        <Brain className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Meditation</p>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">Lv{stats?.meditation?.currentLevel} D{stats?.meditation?.currentDay}</h4>
                    </div>
                </div>

                <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl shadow-sm border flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-500">
                        <Pen className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Graphotherapy</p>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">Lv{stats?.graphotherapy?.currentLevel} D{stats?.graphotherapy?.currentDay}</h4>
                    </div>
                </div>
            </div>

            {/* Activity Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Prelims (Batch 1) Card */}
                <Card className="border-l-4 border-l-indigo-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Target className="h-5 w-5 text-indigo-600" />
                            UPSC Prelims (Batch 1)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Current Progress</span>
                                <span className="font-semibold">Cycle {stats?.prelims?.currentCycle}, Day {stats?.prelims?.currentDay}</span>
                            </div>

                            {stats?.prelims?.lastSessionRecalls && stats.prelims.lastSessionRecalls.length > 0 && (
                                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3">
                                    <p className="text-xs text-gray-500 mb-2">Last Session Recall Scores:</p>
                                    <div className="flex gap-2">
                                        {stats.prelims.lastSessionRecalls.map((score: number, i: number) => (
                                            <div key={i} className="flex-1 text-center">
                                                <div className={`text-lg font-bold ${score >= 80 ? 'text-green-600' : score >= 70 ? 'text-yellow-600' : 'text-orange-600'}`}>
                                                    {score}%
                                                </div>
                                                <div className="text-xs text-gray-400">Part {i + 1}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-indigo-200">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Average</span>
                                            <span className="font-bold text-indigo-600">{stats.prelims.avgRecall}%</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="text-sm text-gray-500">
                                {stats?.prelims?.totalSegmentsCompleted || 0} segments completed
                            </div>

                            <Link href="/student/batch1">
                                <Button className="w-full mt-2">
                                    Continue Learning <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Meditation Card */}
                <Card className="border-l-4 border-l-purple-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Brain className="h-5 w-5 text-purple-600" />
                            Meditation
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Current Level</span>
                                <span className="font-semibold">Level {stats?.meditation?.currentLevel}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Current Day</span>
                                <span className="font-semibold">Day {stats?.meditation?.currentDay} of 60</span>
                            </div>

                            <Progress value={(stats?.meditation?.currentDay / 60) * 100} className="h-2" />

                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Streak</span>
                                <span className="font-semibold text-purple-600">{stats?.meditation?.streakDays} days 🧘</span>
                            </div>

                            <Link href="/student/meditation">
                                <Button variant="outline" className="w-full mt-2 border-purple-500 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30">
                                    Practice Today <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Graphotherapy Card */}
                <Card className="border-l-4 border-l-green-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Pen className="h-5 w-5 text-green-600" />
                            Graphotherapy
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Current Level</span>
                                <span className="font-semibold">Level {stats?.graphotherapy?.currentLevel}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Current Day</span>
                                <span className="font-semibold">Day {stats?.graphotherapy?.currentDay} of 60</span>
                            </div>

                            <Progress value={(stats?.graphotherapy?.currentDay / 60) * 100} className="h-2" />

                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Streak</span>
                                <span className="font-semibold text-green-600">{stats?.graphotherapy?.streakDays} days ✍️</span>
                            </div>

                            <Link href="/student/graphotherapy">
                                <Button variant="outline" className="w-full mt-2 border-green-500 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30">
                                    Practice Today <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Batch 2 Section */}
            <Card className="border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/10 dark:to-orange-900/10">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Rocket className="h-5 w-5 text-amber-600" />
                        Batch 2 - Research Hub
                        <span className="ml-auto px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full flex items-center gap-1">
                            <Sparkles className="h-3 w-3" />
                            Self Study
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Missions Completed</span>
                            <span className="font-semibold">2 / 5</span>
                        </div>

                        {/* Day Progress */}
                        <div className="grid grid-cols-5 gap-2">
                            {[1, 2, 3, 4, 5].map((day) => (
                                <div
                                    key={day}
                                    className={`text-center p-2 rounded-lg ${day <= 2
                                            ? 'bg-amber-500 text-white'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                                        }`}
                                >
                                    <div className="text-xs">Day</div>
                                    <div className="font-bold">{day}</div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-amber-100 dark:bg-amber-900/20 rounded-lg p-3">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-amber-800 dark:text-amber-200">Avg. AI Score</span>
                                <span className="font-bold text-amber-600">82%</span>
                            </div>
                            <Progress value={82} className="h-2" />
                        </div>

                        <div className="flex gap-2">
                            <Link href="/student/batch2?tab=missions" className="flex-1">
                                <Button className="w-full bg-amber-500 hover:bg-amber-600">
                                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/student/batch2?tab=progress">
                                <Button variant="outline" className="border-amber-500 text-amber-700">
                                    Details
                                </Button>
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>


            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {stats?.prelims?.totalSegmentsCompleted > 0 && (
                            <div className="flex items-center gap-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <Target className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium">Prelims: {stats.prelims.totalSegmentsCompleted} segments completed</h4>
                                    <p className="text-xs text-muted-foreground">Average Recall: {stats.prelims.avgRecall}%</p>
                                </div>
                            </div>
                        )}

                        {stats?.meditation?.streakDays > 0 && (
                            <div className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-xl">
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                    <Brain className="h-5 w-5 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium">Meditation: Level {stats.meditation.currentLevel}, Day {stats.meditation.currentDay}</h4>
                                    <p className="text-xs text-muted-foreground">{stats.meditation.streakDays} day streak</p>
                                </div>
                            </div>
                        )}

                        {stats?.graphotherapy?.streakDays > 0 && (
                            <div className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-xl">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                    <Pen className="h-5 w-5 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium">Graphotherapy: Level {stats.graphotherapy.currentLevel}, Day {stats.graphotherapy.currentDay}</h4>
                                    <p className="text-xs text-muted-foreground">{stats.graphotherapy.streakDays} day streak</p>
                                </div>
                            </div>
                        )}

                        {stats?.prelims?.totalSegmentsCompleted === 0 &&
                            stats?.meditation?.streakDays === 0 &&
                            stats?.graphotherapy?.streakDays === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p>Start your learning journey today!</p>
                                    <Link href="/student/batch1">
                                        <Button className="mt-4">Get Started</Button>
                                    </Link>
                                </div>
                            )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

