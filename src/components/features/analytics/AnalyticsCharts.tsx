"use client";

import { Card } from "@/components/ui/card";
import {
  BarChart3,
  TrendingUp,
  Target,
  Clock,
  Zap,
  Award,
  Brain,
  Users,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";

interface AnalyticsChartsProps {
  stats: any;
  detailedStats: any;
}

export default function AnalyticsCharts({
  stats,
  detailedStats,
}: AnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Skills Radar Chart */}
      <Card className="bg-gray-900 border-gray-800 p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <Brain className="mr-2 h-5 w-5 text-purple-400" />
          Cognitive Skills Profile
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              cx="50%"
              cy="50%"
              outerRadius="80%"
              data={detailedStats?.skills || []}
            >
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#9CA3AF" }} />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 150]}
                tick={{ fill: "#9CA3AF" }}
              />
              <Radar
                name="My Skills"
                dataKey="A"
                stroke="#8B5CF6"
                fill="#8B5CF6"
                fillOpacity={0.6}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "none",
                  borderRadius: "8px",
                }}
                itemStyle={{ color: "#fff" }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Focus Trends Line Chart */}
      <Card className="bg-gray-900 border-gray-800 p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <TrendingUp className="mr-2 h-5 w-5 text-cyan-400" />
          Focus Trends (Last 10 Sessions)
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={
                stats?.attention?.recent_scores?.map(
                  (score: number, i: number) => ({
                    name: `Session ${i + 1}`,
                    score,
                  }),
                ) || []
              }
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" tick={{ fill: "#9CA3AF" }} />
              <YAxis tick={{ fill: "#9CA3AF" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "none",
                  borderRadius: "8px",
                }}
                itemStyle={{ color: "#fff" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#06B6D4"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Comparative Analysis */}
      <Card className="bg-gray-900 border-gray-800 p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <Users className="mr-2 h-5 w-5 text-blue-400" />
          Comparative Analysis
        </h3>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Your Average Focus</span>
              <span className="text-white font-bold">
                {detailedStats?.comparative?.user_focus || 0}%
              </span>
            </div>
            <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{
                  width: `${detailedStats?.comparative?.user_focus || 0}%`,
                }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Global Average</span>
              <span className="text-white font-bold">
                {detailedStats?.comparative?.global_focus || 0}%
              </span>
            </div>
            <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-600"
                style={{
                  width: `${detailedStats?.comparative?.global_focus || 0}%`,
                }}
              />
            </div>
          </div>
          <div className="pt-4 border-t border-gray-800">
            <p className="text-center text-gray-300">
              You are in the{" "}
              <span className="text-green-400 font-bold">
                Top {100 - (detailedStats?.comparative?.user_percentile || 0)}%
              </span>{" "}
              of all learners!
            </p>
          </div>
        </div>
      </Card>

      {/* Activity Heatmap (Simplified as Bar for now) */}
      <Card className="bg-gray-900 border-gray-800 p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <Clock className="mr-2 h-5 w-5 text-green-400" />
          Weekly Activity Volume
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={Object.entries(stats?.weekly_activity || {}).map(
                ([day, min]) => ({ name: day, minutes: min }),
              )}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" tick={{ fill: "#9CA3AF" }} />
              <YAxis tick={{ fill: "#9CA3AF" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "none",
                  borderRadius: "8px",
                }}
                itemStyle={{ color: "#fff" }}
              />
              <Legend />
              <Bar dataKey="minutes" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
