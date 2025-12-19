"use client";

import { useState } from "react";
import {
  MousePointerClick,
  Globe,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Smartphone,
  Monitor,
  Tablet,
  Chrome,
  Search,
  Share2,
  Mail,
  Link2,
  ChevronLeft,
  Download,
  RefreshCw,
  Calendar,
  MapPin,
  Clock,
  Eye,
  UserPlus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

// Traffic data over time
const trafficData = [
  { date: "Dec 10", visitors: 1245, pageViews: 3456, sessions: 1890 },
  { date: "Dec 11", visitors: 1456, pageViews: 4123, sessions: 2134 },
  { date: "Dec 12", visitors: 1678, pageViews: 4567, sessions: 2456 },
  { date: "Dec 13", visitors: 1234, pageViews: 3234, sessions: 1789 },
  { date: "Dec 14", visitors: 1890, pageViews: 5234, sessions: 2890 },
  { date: "Dec 15", visitors: 2123, pageViews: 5890, sessions: 3123 },
  { date: "Dec 16", visitors: 1987, pageViews: 5456, sessions: 2987 },
];

// Traffic sources
const trafficSources = [
  { name: "Organic Search", value: 42, visits: 5234, color: "#22c55e" },
  { name: "Direct", value: 28, visits: 3456, color: "#3b82f6" },
  { name: "Social Media", value: 18, visits: 2234, color: "#a855f7" },
  { name: "Referral", value: 8, visits: 987, color: "#f59e0b" },
  { name: "Email", value: 4, visits: 489, color: "#ef4444" },
];

// Device breakdown
const deviceData = [
  { name: "Mobile", value: 58, icon: Smartphone, color: "#3b82f6" },
  { name: "Desktop", value: 35, icon: Monitor, color: "#22c55e" },
  { name: "Tablet", value: 7, icon: Tablet, color: "#a855f7" },
];

// Top pages
const topPages = [
  { path: "/courses/upsc-prelims-2026", title: "UPSC Prelims 2026 - Batch 1", views: 4567, unique: 2345 },
  { path: "/", title: "Homepage", views: 3456, unique: 2890 },
  { path: "/courses/gs-mains", title: "GS Mains Answer Writing", views: 2345, unique: 1678 },
  { path: "/login", title: "Login Page", views: 1890, unique: 1456 },
  { path: "/courses/csat", title: "CSAT Crash Course", views: 1567, unique: 1234 },
  { path: "/pricing", title: "Pricing Page", views: 1234, unique: 987 },
];

// Geographic data
const geoData = [
  { country: "India", visits: 8945, percentage: 72 },
  { country: "United States", visits: 1234, percentage: 10 },
  { country: "United Kingdom", visits: 567, percentage: 5 },
  { country: "UAE", visits: 456, percentage: 4 },
  { country: "Canada", visits: 345, percentage: 3 },
  { country: "Others", visits: 743, percentage: 6 },
];

// Stats
const trafficStats = [
  {
    label: "Total Visitors",
    value: "12,456",
    change: "+18.2%",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    label: "Page Views",
    value: "45,678",
    change: "+12.5%",
    trend: "up",
    icon: Eye,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    label: "Avg. Session",
    value: "4m 32s",
    change: "+8.3%",
    trend: "up",
    icon: Clock,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    label: "Bounce Rate",
    value: "32.4%",
    change: "-5.2%",
    trend: "down",
    icon: TrendingUp,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
];

const getSourceIcon = (source: string) => {
  switch (source.toLowerCase()) {
    case "organic search":
      return <Search className="h-4 w-4" />;
    case "direct":
      return <Globe className="h-4 w-4" />;
    case "social media":
      return <Share2 className="h-4 w-4" />;
    case "referral":
      return <Link2 className="h-4 w-4" />;
    case "email":
      return <Mail className="h-4 w-4" />;
    default:
      return <Globe className="h-4 w-4" />;
  }
};

export default function TrafficPage() {
  const [dateRange, setDateRange] = useState("7days");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <MousePointerClick className="h-8 w-8 text-emerald-600" />
            Traffic Analytics
          </h1>
          <p className="text-gray-600 mt-1">Monitor visitor traffic and engagement patterns</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[150px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {trafficStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                </div>
                <div className={`flex items-center text-sm ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  {stat.change}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Traffic Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            Traffic Overview
          </CardTitle>
          <CardDescription>Visitors and page views over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={trafficData}>
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="pageViews"
                stroke="#22c55e"
                fillOpacity={1}
                fill="url(#colorViews)"
                name="Page Views"
              />
              <Area
                type="monotone"
                dataKey="visitors"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorVisitors)"
                name="Visitors"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Sources and Devices Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-emerald-600" />
              Traffic Sources
            </CardTitle>
            <CardDescription>Where your visitors come from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trafficSources.map((source) => (
                <div key={source.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${source.color}20` }}
                    >
                      <span style={{ color: source.color }}>{getSourceIcon(source.name)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{source.name}</p>
                      <p className="text-xs text-gray-500">{source.visits.toLocaleString()} visits</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${source.value}%`, backgroundColor: source.color }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600 w-12 text-right">
                      {source.value}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-emerald-600" />
              Device Breakdown
            </CardTitle>
            <CardDescription>How visitors access your platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              {deviceData.map((device) => (
                <div key={device.name} className="flex items-center gap-2">
                  <device.icon className="h-4 w-4" style={{ color: device.color }} />
                  <span className="text-sm text-gray-600">{device.name}</span>
                  <span className="text-sm font-bold" style={{ color: device.color }}>
                    {device.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Pages and Geography */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-emerald-600" />
              Top Pages
            </CardTitle>
            <CardDescription>Most visited pages on your platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPages.map((page, index) => (
                <div
                  key={page.path}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{page.title}</p>
                      <p className="text-xs text-gray-400">{page.path}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{page.views.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{page.unique.toLocaleString()} unique</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-emerald-600" />
              Geographic Distribution
            </CardTitle>
            <CardDescription>Where your visitors are located</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {geoData.map((geo) => (
                <div
                  key={geo.country}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">
                      {geo.country === "India" ? "🇮🇳" :
                        geo.country === "United States" ? "🇺🇸" :
                          geo.country === "United Kingdom" ? "🇬🇧" :
                            geo.country === "UAE" ? "🇦🇪" :
                              geo.country === "Canada" ? "🇨🇦" : "🌍"}
                    </span>
                    <span className="font-medium text-gray-800">{geo.country}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${geo.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-16 text-right">
                      {geo.visits.toLocaleString()}
                    </span>
                    <span className="text-sm font-medium text-emerald-600 w-10 text-right">
                      {geo.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
