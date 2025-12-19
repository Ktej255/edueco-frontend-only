"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Target,
  Award,
  Clock,
  BookOpen,
  CheckCircle,
  Trophy,
  Zap,
  Calendar,
  BarChart3,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Card } from "@/components/ui/card";
import api from "@/lib/api";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { useToast } from "@/components/ui/Toast";

interface AnalyticsData {
  overview: {
    total_courses_enrolled: number;
    total_courses_completed: number;
    total_lessons_completed: number;
    total_quizzes_taken: number;
    total_assignments_submitted: number;
    total_coins_earned: number;
    current_streak: number;
    total_study_hours: number;
  };
  weekly_activity: Array<{
    day: string;
    lessons: number;
    quizzes: number;
    study_time: number;
  }>;
  course_progress: Array<{
    course_name: string;
    progress: number;
    time_spent: number;
  }>;
  engagement_by_category: Array<{
    category: string;
    count: number;
    color: string;
  }>;
  achievements_summary: {
    total: number;
    unlocked: number;
    categories: Record<string, number>;
  };
}

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];

export default function UserAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get("/analytics/student/global-dashboard");
      setAnalytics(response.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      showToast("Failed to load analytics", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <LoadingSkeleton variant="card" count={6} />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-400">No analytics data available</p>
      </div>
    );
  }

  const completionRate =
    analytics.overview.total_courses_enrolled > 0
      ? Math.round(
        (analytics.overview.total_courses_completed /
          analytics.overview.total_courses_enrolled) *
        100,
      )
      : 0;

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
          <BarChart3 className="h-8 w-8 text-blue-400" />
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent">
            Learning Analytics
          </h1>
          <p className="text-gray-400 mt-1">
            Track your progress and engagement
          </p>
        </div>
      </div>

      {/* Overview Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<BookOpen className="h-6 w-6" />}
          label="Courses Enrolled"
          value={analytics.overview.total_courses_enrolled}
          color="blue"
        />
        <StatCard
          icon={<CheckCircle className="h-6 w-6" />}
          label="Completion Rate"
          value={`${completionRate}%`}
          color="green"
        />
        <StatCard
          icon={<Trophy className="h-6 w-6" />}
          label="Total Coins"
          value={analytics.overview.total_coins_earned}
          color="yellow"
        />
        <StatCard
          icon={<Zap className="h-6 w-6" />}
          label="Current Streak"
          value={`${analytics.overview.current_streak} days`}
          color="orange"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Target className="h-5 w-5" />}
          label="Lessons Completed"
          value={analytics.overview.total_lessons_completed}
          color="purple"
          small
        />
        <StatCard
          icon={<Award className="h-5 w-5" />}
          label="Quizzes Taken"
          value={analytics.overview.total_quizzes_taken}
          color="pink"
          small
        />
        <StatCard
          icon={<BookOpen className="h-5 w-5" />}
          label="Assignments"
          value={analytics.overview.total_assignments_submitted}
          color="indigo"
          small
        />
        <StatCard
          icon={<Clock className="h-5 w-5" />}
          label="Study Hours"
          value={Math.round(analytics.overview.total_study_hours)}
          color="cyan"
          small
        />
      </div>

      {/* Weekly Activity Chart */}
      <Card className="bg-gray-900 border-gray-800 p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-400" />
          Weekly Activity
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={analytics.weekly_activity}>
            <defs>
              <linearGradient id="colorLessons" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorQuizzes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="day" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#FFF" }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="lessons"
              stroke="#3B82F6"
              fillOpacity={1}
              fill="url(#colorLessons)"
              name="Lessons"
            />
            <Area
              type="monotone"
              dataKey="quizzes"
              stroke="#10B981"
              fillOpacity={1}
              fill="url(#colorQuizzes)"
              name="Quizzes"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Progress */}
        <Card className="bg-gray-900 border-gray-800 p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            Course Progress
          </h3>
          <div className="space-y-4">
            {analytics.course_progress.map((course, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white font-medium truncate">
                    {course.course_name}
                  </span>
                  <span className="text-blue-400">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {course.time_spent} hours studied
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Engagement by Category */}
        <Card className="bg-gray-900 border-gray-800 p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-400" />
            Engagement by Category
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={analytics.engagement_by_category}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                nameKey="category"
              >
                {analytics.engagement_by_category.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Achievements Summary */}
      <Card className="bg-gray-900 border-gray-800 p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-400" />
          Achievements Progress
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(analytics.achievements_summary.categories).map(
            ([category, count]) => (
              <div
                key={category}
                className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700"
              >
                <div className="text-2xl font-bold text-blue-400">{count}</div>
                <div className="text-xs text-gray-400 mt-1 capitalize">
                  {category}
                </div>
              </div>
            ),
          )}
        </div>
        <div className="mt-6 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-white font-medium">
            {analytics.achievements_summary.unlocked} /{" "}
            {analytics.achievements_summary.total} Achievements Unlocked
          </p>
          <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
            <div
              className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full"
              style={{
                width: `${(analytics.achievements_summary.unlocked / analytics.achievements_summary.total) * 100}%`,
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  small?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  color,
  small = false,
}) => {
  const colorClasses = {
    blue: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400",
    green:
      "from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400",
    yellow:
      "from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-400",
    orange:
      "from-orange-500/20 to-red-500/20 border-orange-500/30 text-orange-400",
    purple:
      "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400",
    pink: "from-pink-500/20 to-rose-500/20 border-pink-500/30 text-pink-400",
    indigo:
      "from-indigo-500/20 to-blue-500/20 border-indigo-500/30 text-indigo-400",
    cyan: "from-cyan-500/20 to-teal-500/20 border-cyan-500/30 text-cyan-400",
  };

  return (
    <div
      className={`bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} border rounded-xl p-${small ? "4" : "6"}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={
            colorClasses[color as keyof typeof colorClasses].split(" ")[3]
          }
        >
          {icon}
        </div>
        <div>
          <p className="text-gray-400 text-sm">{label}</p>
          <p
            className={`${small ? "text-xl" : "text-2xl"} font-bold text-white mt-1`}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};
