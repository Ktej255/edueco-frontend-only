"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import {
    Trophy,
    Award,
    Target,
    Zap,
    Star,
    TrendingUp,
    Users,
    Crown,
    Medal,
    Flame,
} from "lucide-react"

type Achievement = {
    id: number
    title: string
    description: string
    icon: string
    points: number
    category: string
    earned_at?: string
    progress?: number
    total?: number
}

type LeaderboardEntry = {
    rank: number
    user_id: number
    user_name: string
    total_points: number
    level: number
    badges_count: number
}

type GamificationStats = {
    total_points: number
    level: number
    next_level_points: number
    current_streak: number
    longest_streak: number
    badges_earned: number
    rank_position: number
    coins: number
}

export default function GamificationPage() {
    const [stats, setStats] = useState<GamificationStats | null>(null)
    const [achievements, setAchievements] = useState<Achievement[]>([])
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchGamificationData()
    }, [])

    const fetchGamificationData = async () => {
        try {
            const [statsRes, achievementsRes, leaderboardRes] = await Promise.all([
                axios.get("/api/v1/gamification/my-stats"),
                axios.get("/api/v1/gamification/achievements"),
                axios.get("/api/v1/gamification/leaderboard"),
            ])
            setStats(statsRes.data)
            setAchievements(achievementsRes.data)
            setLeaderboard(leaderboardRes.data)
        } catch (error) {
            toast.error("Failed to load gamification data")
        } finally {
            setLoading(false)
        }
    }

    const getLevelProgress = () => {
        if (!stats) return 0
        const currentLevelPoints = stats.total_points % 1000
        return (currentLevelPoints / 1000) * 100
    }

    const getStreakEmoji = (streak: number) => {
        if (streak >= 30) return "🔥🔥🔥"
        if (streak >= 14) return "🔥🔥"
        if (streak >= 7) return "🔥"
        return "⭐"
    }

    if (loading) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-gray-400">Loading...</div>
                </div>
            </div>
        )
    }

    if (!stats) return null

    return (
        <div className="container mx-auto py-8 px-4">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Achievements & Progress</h1>
                <p className="text-gray-400">Track your learning journey and compete with others</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Level Card */}
                <Card className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-purple-700/50">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-purple-300 mb-1">Level</p>
                                <p className="text-4xl font-bold text-white">{stats.level}</p>
                            </div>
                            <Crown className="w-12 h-12 text-purple-400" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-purple-200">
                                <span>{stats.total_points} XP</span>
                                <span>{stats.next_level_points} XP to next level</span>
                            </div>
                            <Progress value={getLevelProgress()} className="h-2 bg-purple-950" />
                        </div>
                    </CardContent>
                </Card>

                {/* Streak Card */}
                <Card className="bg-gradient-to-br from-orange-900/40 to-orange-800/20 border-orange-700/50">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-orange-300 mb-1">Current Streak</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-4xl font-bold text-white">{stats.current_streak}</p>
                                    <span className="text-2xl">{getStreakEmoji(stats.current_streak)}</span>
                                </div>
                                <p className="text-xs text-orange-300 mt-2">
                                    Longest: {stats.longest_streak} days
                                </p>
                            </div>
                            <Flame className="w-12 h-12 text-orange-400" />
                        </div>
                    </CardContent>
                </Card>

                {/* Coins Card */}
                <Card className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 border-yellow-700/50">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-yellow-300 mb-1">Coins Earned</p>
                                <p className="text-4xl font-bold text-white">{stats.coins}</p>
                                <p className="text-xs text-yellow-300 mt-2">
                                    Keep learning to earn more!
                                </p>
                            </div>
                            <Zap className="w-12 h-12 text-yellow-400" />
                        </div>
                    </CardContent>
                </Card>

                {/* Rank Card */}
                <Card className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border-blue-700/50">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-blue-300 mb-1">Global Rank</p>
                                <p className="text-4xl font-bold text-white">#{stats.rank_position}</p>
                                <p className="text-xs text-blue-300 mt-2">
                                    {stats.badges_earned} badges earned
                                </p>
                            </div>
                            <Trophy className="w-12 h-12 text-blue-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="achievements" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="achievements">
                        Achievements ({achievements.filter((a) => a.earned_at).length})
                    </TabsTrigger>
                    <TabsTrigger value="leaderboard">
                        Leaderboard
                    </TabsTrigger>
                    <TabsTrigger value="challenges">
                        Daily Challenges
                    </TabsTrigger>
                </TabsList>

                {/* Achievements Tab */}
                <TabsContent value="achievements">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {achievements.map((achievement) => (
                            <Card
                                key={achievement.id}
                                className={`border-gray-800 ${achievement.earned_at
                                    ? "bg-gray-900"
                                    : "bg-gray-900/50 opacity-60"
                                    }`}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div
                                            className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${achievement.earned_at
                                                ? "bg-gradient-to-br from-yellow-500 to-orange-500"
                                                : "bg-gray-800"
                                                }`}
                                        >
                                            {achievement.icon || "🏆"}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold mb-1">{achievement.title}</h3>
                                            <p className="text-sm text-gray-400 mb-2">
                                                {achievement.description}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <Badge variant="outline" className="text-xs">
                                                    {achievement.points} XP
                                                </Badge>
                                                {achievement.earned_at ? (
                                                    <span className="text-xs text-green-500">
                                                        ✓ Earned
                                                    </span>
                                                ) : achievement.progress !== undefined ? (
                                                    <span className="text-xs text-gray-500">
                                                        {achievement.progress}/{achievement.total}
                                                    </span>
                                                ) : null}
                                            </div>
                                            {achievement.progress !== undefined &&
                                                !achievement.earned_at && (
                                                    <Progress
                                                        value={
                                                            ((achievement.progress || 0) /
                                                                (achievement.total || 1)) *
                                                            100
                                                        }
                                                        className="h-1 mt-2"
                                                    />
                                                )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Leaderboard Tab */}
                <TabsContent value="leaderboard">
                    <Card className="bg-gray-900 border-gray-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-yellow-500" />
                                Top Learners This Month
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {leaderboard.map((entry, index) => (
                                    <div
                                        key={entry.user_id}
                                        className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${entry.rank <= 3
                                            ? "bg-gradient-to-r from-yellow-900/20 to-transparent border border-yellow-700/30"
                                            : "bg-gray-800 hover:bg-gray-750"
                                            }`}
                                    >
                                        {/* Rank */}
                                        <div className="w-12 flex-shrink-0 text-center">
                                            {entry.rank === 1 && (
                                                <Trophy className="w-8 h-8 mx-auto text-yellow-500" />
                                            )}
                                            {entry.rank === 2 && (
                                                <Medal className="w-8 h-8 mx-auto text-gray-400" />
                                            )}
                                            {entry.rank === 3 && (
                                                <Medal className="w-8 h-8 mx-auto text-orange-600" />
                                            )}
                                            {entry.rank > 3 && (
                                                <div className="text-2xl font-bold text-gray-500">
                                                    #{entry.rank}
                                                </div>
                                            )}
                                        </div>

                                        {/* User Info */}
                                        <div className="flex-1">
                                            <div className="font-semibold">{entry.user_name}</div>
                                            <div className="text-sm text-gray-400">
                                                Level {entry.level} • {entry.badges_count} badges
                                            </div>
                                        </div>

                                        {/* Points */}
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-yellow-500">
                                                {entry.total_points.toLocaleString()}
                                            </div>
                                            <div className="text-xs text-gray-500">XP</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Daily Challenges Tab */}
                <TabsContent value="challenges">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Challenge 1 */}
                        <Card className="bg-gray-900 border-gray-800">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                        <Target className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold mb-1">Complete 2 Lessons</h3>
                                        <p className="text-sm text-gray-400 mb-3">
                                            Finish any 2 lessons today to earn bonus XP
                                        </p>
                                        <Progress value={50} className="h-2 mb-2" />
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">1/2 complete</span>
                                            <Badge className="bg-blue-600">+50 XP</Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Challenge 2 */}
                        <Card className="bg-gray-900 border-gray-800">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                        <Star className="w-6 h-6 text-purple-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold mb-1">Perfect Quiz Score</h3>
                                        <p className="text-sm text-gray-400 mb-3">
                                            Get 100% on any quiz attempt
                                        </p>
                                        <Progress value={0} className="h-2 mb-2" />
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">Not started</span>
                                            <Badge className="bg-purple-600">+100 XP</Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Challenge 3 */}
                        <Card className="bg-gray-900 border-gray-800">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                                        <Users className="w-6 h-6 text-green-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold mb-1">Help a Classmate</h3>
                                        <p className="text-sm text-gray-400 mb-3">
                                            Answer a question in the discussion forum
                                        </p>
                                        <Progress value={100} className="h-2 mb-2" />
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-green-500">✓ Completed</span>
                                            <Badge className="bg-green-600">+30 XP</Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Challenge 4 */}
                        <Card className="bg-gray-900 border-gray-800">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
                                        <Flame className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold mb-1">Maintain Your Streak</h3>
                                        <p className="text-sm text-gray-400 mb-3">
                                            Learn for at least 15 minutes today
                                        </p>
                                        <Progress value={75} className="h-2 mb-2" />
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">11/15 minutes</span>
                                            <Badge className="bg-orange-600">+25 XP</Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
