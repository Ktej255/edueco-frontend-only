"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Users, FileText, Activity } from "lucide-react";
import api from "@/lib/api";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock data for charts
  const userGrowthData = [
    { month: "Jan", users: 120 },
    { month: "Feb", users: 180 },
    { month: "Mar", users: 250 },
    { month: "Apr", users: 320 },
    { month: "May", users: 400 },
    { month: "Jun", users: 480 },
  ];

  const engagementData = [
    { day: "Mon", submissions: 45, sessions: 120 },
    { day: "Tue", submissions: 52, sessions: 135 },
    { day: "Wed", submissions: 48, sessions: 128 },
    { day: "Thu", submissions: 61, sessions: 145 },
    { day: "Fri", submissions: 55, sessions: 132 },
    { day: "Sat", submissions: 38, sessions: 98 },
    { day: "Sun", submissions: 42, sessions: 105 },
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get("/admin/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-gray-400">
          Detailed platform analytics and insights
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-900/30 to-blue-700/20 border-blue-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-white">
                {stats?.users?.total || 0}
              </p>
              <p className="text-green-400 text-sm mt-1">
                +12% from last month
              </p>
            </div>
            <Users className="h-12 w-12 text-blue-400" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/30 to-purple-700/20 border-purple-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Submissions</p>
              <p className="text-3xl font-bold text-white">
                {stats?.content?.submissions || 0}
              </p>
              <p className="text-green-400 text-sm mt-1">+8% from last week</p>
            </div>
            <FileText className="h-12 w-12 text-purple-400" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/30 to-green-700/20 border-green-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Users</p>
              <p className="text-3xl font-bold text-white">
                {stats?.users?.active || 0}
              </p>
              <p className="text-green-400 text-sm mt-1">+5% from yesterday</p>
            </div>
            <Activity className="h-12 w-12 text-green-400" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-900/30 to-orange-700/20 border-orange-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg Engagement</p>
              <p className="text-3xl font-bold text-white">85%</p>
              <p className="text-green-400 text-sm mt-1">+3% from last week</p>
            </div>
            <TrendingUp className="h-12 w-12 text-orange-400" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card className="bg-gray-900 border-gray-800 p-6">
          <h3 className="text-xl font-bold text-white mb-6">User Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "none",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#F3F4F6" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#8B5CF6"
                strokeWidth={3}
                dot={{ fill: "#8B5CF6", r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Engagement Chart */}
        <Card className="bg-gray-900 border-gray-800 p-6">
          <h3 className="text-xl font-bold text-white mb-6">
            Weekly Engagement
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "none",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#F3F4F6" }}
              />
              <Legend />
              <Bar dataKey="submissions" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="sessions" fill="#10B981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
