"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  Mail,
  Calendar,
  Award,
  Zap,
  BookOpen,
  Target,
  TrendingUp,
  Settings,
  Camera,
  Shield,
  Star,
  Trophy,
  Flame,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    bio: user?.bio || "",
  });

  // Mock stats data
  const stats = {
    totalCourses: 12,
    completedCourses: 8,
    totalPoints: 2450,
    currentStreak: user?.streak_days || 0,
    totalStudyHours: 156,
    achievements: 24,
  };

  const achievements = [
    {
      id: 1,
      name: "First Course",
      icon: BookOpen,
      color: "cyan",
      unlocked: true,
    },
    {
      id: 2,
      name: "Week Warrior",
      icon: Flame,
      color: "orange",
      unlocked: true,
    },
    {
      id: 3,
      name: "Top Learner",
      icon: Trophy,
      color: "yellow",
      unlocked: true,
    },
    {
      id: 4,
      name: "Perfect Focus",
      icon: Target,
      color: "green",
      unlocked: false,
    },
  ];

  const handleSave = () => {
    // In real implementation, save to backend
    setEditing(false);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with Profile Picture */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800/50 rounded-2xl border border-gray-800/50 p-8 backdrop-blur-sm shadow-xl">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            {/* Profile Picture */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-1">
                <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                  <User className="h-16 w-16 text-cyan-400" />
                </div>
              </div>
              <button className="absolute bottom-0 right-0 p-2 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg transform transition-transform hover:scale-110">
                <Camera className="h-4 w-4 text-white" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent mb-2">
                    {user?.full_name || "User"}
                  </h1>
                  <div className="flex items-center gap-4 text-gray-400 mb-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {user?.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-xs font-semibold">
                        {user?.role || "user"}
                      </span>
                    </div>
                  </div>
                  {!editing && (
                    <p className="text-gray-300">
                      {formData.bio || "No bio yet. Click edit to add one!"}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {!editing ? (
                    <Button
                      onClick={() => setEditing(true)}
                      className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg shadow-cyan-500/30"
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={handleSave}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500"
                      >
                        Save Changes
                      </Button>
                      <Button
                        onClick={() => setEditing(false)}
                        variant="outline"
                        className="border-gray-700"
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {editing && (
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Full Name
                    </label>
                    <Input
                      value={formData.full_name}
                      onChange={(e) =>
                        setFormData({ ...formData, full_name: e.target.value })
                      }
                      className="bg-gray-800/80 border-gray-700/50 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Bio
                    </label>
                    <Textarea
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      className="bg-gray-800/80 border-gray-700/50 text-white"
                      rows={3}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="bg-gradient-to-br from-cyan-900/30 to-cyan-700/20 border-cyan-500/30 p-4 text-center">
            <BookOpen className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">
              {stats.totalCourses}
            </p>
            <p className="text-gray-400 text-sm">Courses</p>
          </Card>
          <Card className="bg-gradient-to-br from-green-900/30 to-green-700/20 border-green-500/30 p-4 text-center">
            <Target className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">
              {stats.completedCourses}
            </p>
            <p className="text-gray-400 text-sm">Completed</p>
          </Card>
          <Card className="bg-gradient-to-br from-purple-900/30 to-purple-700/20 border-purple-500/30 p-4 text-center">
            <Star className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{stats.totalPoints}</p>
            <p className="text-gray-400 text-sm">Points</p>
          </Card>
          <Card className="bg-gradient-to-br from-orange-900/30 to-orange-700/20 border-orange-500/30 p-4 text-center">
            <Flame className="h-8 w-8 text-orange-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">
              {stats.currentStreak}
            </p>
            <p className="text-gray-400 text-sm">Day Streak</p>
          </Card>
          <Card className="bg-gradient-to-br from-blue-900/30 to-blue-700/20 border-blue-500/30 p-4 text-center">
            <TrendingUp className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">
              {stats.totalStudyHours}
            </p>
            <p className="text-gray-400 text-sm">Hours</p>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-900/30 to-yellow-700/20 border-yellow-500/30 p-4 text-center">
            <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">
              {stats.achievements}
            </p>
            <p className="text-gray-400 text-sm">Badges</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Achievements */}
          <Card className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800/50 border-gray-800/50 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
                <Trophy className="h-5 w-5 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Achievements</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                const colorMap: Record<string, string> = {
                  cyan: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30",
                  orange:
                    "from-orange-500/20 to-red-500/20 border-orange-500/30",
                  yellow:
                    "from-yellow-500/20 to-orange-500/20 border-yellow-500/30",
                  green:
                    "from-green-500/20 to-emerald-500/20 border-green-500/30",
                };
                return (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-xl border ${
                      achievement.unlocked
                        ? `bg-gradient-to-br ${colorMap[achievement.color]}`
                        : "bg-gray-800/50 border-gray-700/50 opacity-50"
                    }`}
                  >
                    <Icon
                      className={`h-8 w-8 mx-auto mb-2 ${
                        achievement.unlocked
                          ? `text-${achievement.color}-400`
                          : "text-gray-600"
                      }`}
                    />
                    <p
                      className={`text-center text-sm font-semibold ${
                        achievement.unlocked ? "text-white" : "text-gray-500"
                      }`}
                    >
                      {achievement.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Quick Settings */}
          <Card className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800/50 border-gray-800/50 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                <Settings className="h-5 w-5 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Quick Actions</h3>
            </div>
            <div className="space-y-3">
              <Link href="/admin/settings">
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-700/50 hover:bg-gray-800/50"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </Button>
              </Link>
              <Link href="/notifications">
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-700/50 hover:bg-gray-800/50"
                >
                  <Award className="mr-2 h-4 w-4" />
                  View Notifications
                </Button>
              </Link>
              <Link href="/analytics">
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-700/50 hover:bg-gray-800/50"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Analytics Dashboard
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
