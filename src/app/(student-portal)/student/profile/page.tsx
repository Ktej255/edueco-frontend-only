"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    User,
    Mail,
    Calendar,
    Award,
    BookOpen,
    Target,
    TrendingUp,
    Camera,
    Star,
    Trophy,
    Flame,
    Brain,
    Pen,
    Save,
    RefreshCw,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { getStudentStats, StudentStats } from "@/services/progressStorage";

export default function StudentProfilePage() {
    const { user } = useAuth();
    const [editing, setEditing] = useState(false);
    const [stats, setStats] = useState<StudentStats | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [formData, setFormData] = useState({
        full_name: user?.full_name || "",
        email: user?.email || "",
        bio: "",
    });

    // Load stats
    const loadStats = useCallback(() => {
        setIsRefreshing(true);
        const studentStats = getStudentStats();
        setStats(studentStats);
        setTimeout(() => setIsRefreshing(false), 300);
    }, []);

    // Initial load
    useEffect(() => {
        loadStats();
    }, [loadStats]);

    // Listen for storage changes
    useEffect(() => {
        const handleStorageChange = () => {
            loadStats();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('focus', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('focus', handleStorageChange);
        };
    }, [loadStats]);

    // Update form data when user changes
    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || "",
                email: user.email || "",
                bio: "",
            });
        }
    }, [user]);

    const handleSave = () => {
        // In real implementation, save to backend
        setEditing(false);
    };

    const achievements = [
        {
            id: 1,
            name: "First Step",
            description: "Started your learning journey",
            icon: BookOpen,
            color: "cyan",
            unlocked: true,
        },
        {
            id: 2,
            name: "Week Warrior",
            description: "7-day streak",
            icon: Flame,
            color: "orange",
            unlocked: (stats?.overallStreak || 0) >= 7,
        },
        {
            id: 3,
            name: "Meditation Master",
            description: "Complete 30 days of meditation",
            icon: Brain,
            color: "purple",
            unlocked: (stats?.meditation?.currentDay || 0) >= 30,
        },
        {
            id: 4,
            name: "Writing Expert",
            description: "Complete Level 1 Graphotherapy",
            icon: Pen,
            color: "green",
            unlocked: (stats?.graphotherapy?.currentLevel || 1) > 1,
        },
        {
            id: 5,
            name: "Perfect Focus",
            description: "Achieve 90% recall score",
            icon: Target,
            color: "blue",
            unlocked: (stats?.prelims?.avgRecall || 0) >= 90,
        },
        {
            id: 6,
            name: "Top Learner",
            description: "Complete 50 segments",
            icon: Trophy,
            color: "yellow",
            unlocked: (stats?.prelims?.totalSegmentsCompleted || 0) >= 50,
        },
    ];

    const unlockedCount = achievements.filter(a => a.unlocked).length;

    return (
        <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-950">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header with Profile Picture */}
                <Card className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8 border-0 text-white relative overflow-hidden">
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -ml-10 -mb-10" />

                    <div className="relative flex flex-col md:flex-row gap-8 items-start md:items-center">
                        {/* Profile Picture */}
                        <div className="relative group">
                            <div className="w-28 h-28 rounded-full bg-white/20 p-1 backdrop-blur-sm">
                                <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center">
                                    <User className="h-14 w-14 text-white" />
                                </div>
                            </div>
                            <button className="absolute bottom-0 right-0 p-2 rounded-full bg-white text-purple-600 shadow-lg hover:scale-110 transition-transform">
                                <Camera className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1">
                            <div className="flex items-start justify-between flex-wrap gap-4">
                                <div>
                                    {!editing ? (
                                        <>
                                            <h1 className="text-3xl font-bold mb-2">
                                                {user?.full_name || "Student"}
                                            </h1>
                                            <div className="flex items-center gap-4 text-blue-100 mb-3">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4" />
                                                    {user?.email}
                                                </div>
                                            </div>
                                            <p className="text-blue-100">
                                                {formData.bio || "Learning enthusiast on the path to success 🚀"}
                                            </p>
                                        </>
                                    ) : (
                                        <div className="space-y-4 max-w-md">
                                            <Input
                                                value={formData.full_name}
                                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                                className="bg-white/10 border-white/30 text-white placeholder-white/50"
                                                placeholder="Your name"
                                            />
                                            <Textarea
                                                value={formData.bio}
                                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                                className="bg-white/10 border-white/30 text-white placeholder-white/50"
                                                placeholder="Tell us about yourself..."
                                                rows={2}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    {!editing ? (
                                        <Button
                                            onClick={() => setEditing(true)}
                                            className="bg-white text-purple-600 hover:bg-blue-50"
                                        >
                                            Edit Profile
                                        </Button>
                                    ) : (
                                        <>
                                            <Button onClick={handleSave} className="bg-white text-green-600 hover:bg-green-50">
                                                <Save className="mr-2 h-4 w-4" />
                                                Save
                                            </Button>
                                            <Button
                                                onClick={() => setEditing(false)}
                                                variant="outline"
                                                className="border-white/50 text-white hover:bg-white/10"
                                            >
                                                Cancel
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Refresh Button */}
                <div className="flex justify-end">
                    <Button variant="ghost" size="sm" onClick={loadStats} disabled={isRefreshing}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                        Refresh Stats
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800/50 p-4 text-center">
                        <Flame className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {stats?.overallStreak || 0}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Day Streak</p>
                    </Card>
                    <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border-indigo-200 dark:border-indigo-800/50 p-4 text-center">
                        <Target className="h-8 w-8 text-indigo-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {stats?.prelims?.totalSegmentsCompleted || 0}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Segments</p>
                    </Card>
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800/50 p-4 text-center">
                        <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {stats?.prelims?.avgRecall || 0}%
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Avg Recall</p>
                    </Card>
                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800/50 p-4 text-center">
                        <Brain className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            L{stats?.meditation?.currentLevel || 1}D{stats?.meditation?.currentDay || 1}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Meditation</p>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800/50 p-4 text-center">
                        <Pen className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            L{stats?.graphotherapy?.currentLevel || 1}D{stats?.graphotherapy?.currentDay || 1}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Graphotherapy</p>
                    </Card>
                    <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800/50 p-4 text-center">
                        <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {unlockedCount}/{achievements.length}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Badges</p>
                    </Card>
                </div>

                {/* Achievements */}
                <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-xl bg-yellow-100 dark:bg-yellow-900/30">
                            <Trophy className="h-5 w-5 text-yellow-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Achievements</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {achievements.map((achievement) => {
                            const Icon = achievement.icon;
                            const colorMap: Record<string, string> = {
                                cyan: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-500",
                                orange: "from-orange-500/20 to-red-500/20 border-orange-500/30 text-orange-500",
                                yellow: "from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-500",
                                green: "from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-500",
                                purple: "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-500",
                                blue: "from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-500",
                            };
                            return (
                                <div
                                    key={achievement.id}
                                    className={`p-4 rounded-xl border transition-all ${achievement.unlocked
                                            ? `bg-gradient-to-br ${colorMap[achievement.color]}`
                                            : "bg-gray-100 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-50"
                                        }`}
                                >
                                    <Icon
                                        className={`h-8 w-8 mx-auto mb-2 ${achievement.unlocked ? colorMap[achievement.color].split(' ').pop() : "text-gray-400"
                                            }`}
                                    />
                                    <p className={`text-center font-semibold ${achievement.unlocked ? "text-gray-900 dark:text-white" : "text-gray-500"
                                        }`}>
                                        {achievement.name}
                                    </p>
                                    <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {achievement.description}
                                    </p>
                                    {achievement.unlocked && (
                                        <div className="text-center mt-2">
                                            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-full">
                                                ✓ Unlocked
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>
        </div>
    );
}
