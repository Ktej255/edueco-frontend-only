"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  Users,
  DollarSign,
  Star,
  BookOpen,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";

interface DashboardStats {
  total_revenue: number;
  total_students: number;
  active_courses: number;
  average_rating: number;
  monthly_revenue: number;
  monthly_enrollments: number;
}

interface RevenueData {
  date: string;
  amount: number;
}

export default function InstructorDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30");

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, revenueRes] = await Promise.all([
        api.get("/instructor/analytics/instructor/dashboard"),
        api.get(
          `/instructor/analytics/instructor/revenue-chart?days=${timeRange}`,
        ),
      ]);
      setStats(statsRes.data);
      setRevenueData(revenueRes.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-8 flex items-center justify-center">
        <div className="text-white">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Instructor Dashboard
            </h1>
            <p className="text-gray-400">
              Overview of your courses and performance
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px] bg-gray-900 border-gray-800 text-white">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 3 months</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-cyan-600 hover:bg-cyan-500">
              <ArrowDownRight className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Revenue"
            value={`₹${stats?.total_revenue.toLocaleString()}`}
            subValue={`+₹${stats?.monthly_revenue.toLocaleString()} this month`}
            icon={DollarSign}
            trend="up"
          />
          <StatsCard
            title="Total Students"
            value={stats?.total_students.toString() || "0"}
            subValue={`+${stats?.monthly_enrollments} new students`}
            icon={Users}
            trend="up"
          />
          <StatsCard
            title="Active Courses"
            value={stats?.active_courses.toString() || "0"}
            subValue="Published courses"
            icon={BookOpen}
            trend="neutral"
          />
          <StatsCard
            title="Average Rating"
            value={stats?.average_rating.toFixed(1) || "0.0"}
            subValue="Based on student reviews"
            icon={Star}
            trend="up"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2 bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Revenue Overview</CardTitle>
              <CardDescription>Daily revenue performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient
                        id="colorRevenue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#0891b2"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#0891b2"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="date"
                      stroke="#9ca3af"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })
                      }
                    />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        borderColor: "#374151",
                        color: "#fff",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#06b6d4"
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top Courses (Placeholder for now) */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">
                Top Performing Courses
              </CardTitle>
              <CardDescription>By revenue this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gray-700 rounded flex items-center justify-center text-gray-400">
                        {i}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          Course Title {i}
                        </p>
                        <p className="text-xs text-gray-400">12 sales</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-cyan-400">₹4,500</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, subValue, icon: Icon, trend }: any) {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <div className="h-8 w-8 bg-gray-800 rounded-full flex items-center justify-center">
            <Icon className="h-4 w-4 text-cyan-500" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold text-white">{value}</h3>
        </div>
        <div className="mt-2 flex items-center text-xs">
          {trend === "up" ? (
            <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
          ) : (
            <ArrowDownRight className="h-3 w-3 text-gray-500 mr-1" />
          )}
          <span className={trend === "up" ? "text-green-500" : "text-gray-500"}>
            {subValue}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
