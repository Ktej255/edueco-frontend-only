"use client";

import { useState } from "react";
import {
  Video,
  Users,
  Clock,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ChevronLeft,
  Download,
  RefreshCw,
  Eye,
  Play,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Mic,
  MessageSquare,
  UserCheck,
  Timer,
  BarChart3,
  PlayCircle,
  PauseCircle,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
} from "recharts";

// Webinar data
const webinars = [
  {
    id: "WEB001",
    title: "UPSC 2026 Strategy Session",
    host: "Dr. Ananya Sharma",
    date: "2024-12-14",
    time: "7:00 PM",
    duration: "1h 45m",
    registered: 567,
    attended: 423,
    peakViewers: 398,
    avgWatchTime: "1h 12m",
    status: "completed",
    recording: true,
    questions: 89,
  },
  {
    id: "WEB002",
    title: "Current Affairs December 2024",
    host: "Prof. Rajesh Kumar",
    date: "2024-12-12",
    time: "6:00 PM",
    duration: "2h 00m",
    registered: 892,
    attended: 654,
    peakViewers: 612,
    avgWatchTime: "1h 28m",
    status: "completed",
    recording: true,
    questions: 156,
  },
  {
    id: "WEB003",
    title: "Essay Writing Masterclass",
    host: "Dr. Priya Menon",
    date: "2024-12-10",
    time: "5:00 PM",
    duration: "1h 30m",
    registered: 345,
    attended: 287,
    peakViewers: 265,
    avgWatchTime: "1h 05m",
    status: "completed",
    recording: true,
    questions: 67,
  },
  {
    id: "WEB004",
    title: "Geography Map Reading Session",
    host: "Mr. Vikram Singh",
    date: "2024-12-18",
    time: "7:00 PM",
    duration: "Expected 2h",
    registered: 234,
    attended: 0,
    peakViewers: 0,
    avgWatchTime: "-",
    status: "upcoming",
    recording: false,
    questions: 0,
  },
  {
    id: "WEB005",
    title: "CSAT Problem Solving",
    host: "Ms. Sneha Reddy",
    date: "2024-12-20",
    time: "6:00 PM",
    duration: "Expected 1h 30m",
    registered: 178,
    attended: 0,
    peakViewers: 0,
    avgWatchTime: "-",
    status: "upcoming",
    recording: false,
    questions: 0,
  },
];

// Attendance trend data
const attendanceTrend = [
  { webinar: "W1", registered: 450, attended: 356, percentage: 79 },
  { webinar: "W2", registered: 520, attended: 398, percentage: 77 },
  { webinar: "W3", registered: 480, attended: 412, percentage: 86 },
  { webinar: "W4", registered: 567, attended: 423, percentage: 75 },
  { webinar: "W5", registered: 892, attended: 654, percentage: 73 },
  { webinar: "W6", registered: 345, attended: 287, percentage: 83 },
];

// Stats
const webinarStats = [
  {
    label: "Total Webinars",
    value: "24",
    change: "+4 this month",
    icon: Video,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    label: "Total Registrations",
    value: "8,945",
    change: "+18.5%",
    trend: "up",
    icon: UserCheck,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    label: "Avg. Attendance",
    value: "76%",
    change: "+3.2%",
    trend: "up",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    label: "Questions Asked",
    value: "1,234",
    change: "+22.1%",
    trend: "up",
    icon: MessageSquare,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return (
        <span className="flex items-center gap-1 text-xs px-2.5 py-1 bg-green-100 text-green-700 rounded-full font-medium">
          <CheckCircle2 className="h-3 w-3" />
          Completed
        </span>
      );
    case "live":
      return (
        <span className="flex items-center gap-1 text-xs px-2.5 py-1 bg-red-100 text-red-700 rounded-full font-medium animate-pulse">
          <PlayCircle className="h-3 w-3" />
          Live Now
        </span>
      );
    case "upcoming":
      return (
        <span className="flex items-center gap-1 text-xs px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
          <Calendar className="h-3 w-3" />
          Upcoming
        </span>
      );
    case "cancelled":
      return (
        <span className="flex items-center gap-1 text-xs px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
          <XCircle className="h-3 w-3" />
          Cancelled
        </span>
      );
    default:
      return (
        <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full">
          {status}
        </span>
      );
  }
};

export default function WebinarsPage() {
  const [dateFilter, setDateFilter] = useState("30days");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredWebinars = webinars.filter((w) => {
    return statusFilter === "all" || w.status === statusFilter;
  });

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
            <Video className="h-8 w-8 text-emerald-600" />
            Webinar Reports
          </h1>
          <p className="text-gray-600 mt-1">View webinar attendance and engagement analytics</p>
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="live">Live</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[130px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {webinarStats.map((stat) => (
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
                {stat.trend && (
                  <div className="flex items-center text-sm text-green-600">
                    <ArrowUpRight className="h-4 w-4" />
                    {stat.change}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Attendance Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-emerald-600" />
            Registration vs Attendance Trend
          </CardTitle>
          <CardDescription>Track how many registered users actually attend</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="webinar" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip />
              <Bar dataKey="registered" fill="#93c5fd" name="Registered" radius={[4, 4, 0, 0]} />
              <Bar dataKey="attended" fill="#22c55e" name="Attended" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-300" />
              <span className="text-sm text-gray-600">Registered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500" />
              <span className="text-sm text-gray-600">Attended</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Webinars Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Video className="h-5 w-5 text-emerald-600" />
              Webinar History
            </span>
            <span className="text-sm font-normal text-gray-500">
              Showing {filteredWebinars.length} webinars
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Webinar</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date & Time</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Registered</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Attended</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Peak Viewers</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Questions</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWebinars.map((webinar) => (
                  <tr key={webinar.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-800">{webinar.title}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Mic className="h-3 w-3" />
                          {webinar.host}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm text-gray-800">{webinar.date}</p>
                        <p className="text-xs text-gray-500">{webinar.time} • {webinar.duration}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-semibold text-gray-800">{webinar.registered}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {webinar.attended > 0 ? (
                        <div>
                          <span className="font-semibold text-green-600">{webinar.attended}</span>
                          <p className="text-xs text-gray-500">
                            {Math.round((webinar.attended / webinar.registered) * 100)}%
                          </p>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {webinar.peakViewers > 0 ? (
                        <span className="font-medium text-gray-700">{webinar.peakViewers}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {webinar.questions > 0 ? (
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                          {webinar.questions} Q&A
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {getStatusBadge(webinar.status)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {webinar.recording && (
                            <DropdownMenuItem>
                              <Play className="mr-2 h-4 w-4" />
                              Watch Recording
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Users className="mr-2 h-4 w-4" />
                            View Attendees
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Export Report
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredWebinars.length === 0 && (
            <div className="text-center py-12">
              <Video className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No webinars found</h3>
              <p className="text-gray-400">Try adjusting your filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white rounded-xl shadow-sm">
                <Timer className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-800">1h 15m</p>
                <p className="text-sm text-blue-600">Average Watch Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white rounded-xl shadow-sm">
                <PlayCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-green-800">18</p>
                <p className="text-sm text-green-600">Recordings Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white rounded-xl shadow-sm">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-800">+24%</p>
                <p className="text-sm text-purple-600">Engagement Growth</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
