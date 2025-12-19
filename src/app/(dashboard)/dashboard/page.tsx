"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Trophy,
  TrendingUp,
  MoreHorizontal,
  Calendar as CalendarIcon,
} from "lucide-react";
import Link from "next/link";
import AIAssistant from "@/components/ai-assistant";
import { useAuth } from "@/contexts/auth-context";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

const studyActivityData = [
  { name: "Mon", hours: 4 },
  { name: "Tue", hours: 6 },
  { name: "Wed", hours: 3 },
  { name: "Thu", hours: 8 },
  { name: "Fri", hours: 5 },
  { name: "Sat", hours: 2 },
  { name: "Sun", hours: 4 },
];

const progressData = [
  { name: "Week 1", score: 65 },
  { name: "Week 2", score: 72 },
  { name: "Week 3", score: 78 },
  { name: "Week 4", score: 85 },
];

const skillData = [
  { name: "Technical", value: 400, color: "#0ea5e9" },
  { name: "Creative", value: 300, color: "#8b5cf6" },
  { name: "Soft Skills", value: 300, color: "#f59e0b" },
];
import { useGameStats, useWolfPack, useTasks, useMyCourses } from "@/hooks/use-api";

export default function DashboardPage() {
  const { user } = useAuth();
  const { stats } = useGameStats();
  const { pack } = useWolfPack();
  const { tasks } = useTasks();
  const { courses, loading: coursesLoading } = useMyCourses();

  // Calculate stats
  const coursesInProgress = courses?.length || 0;
  // Mock study hours for now, or derive from stats if available
  const studyHours = stats?.total_study_hours || 12.5;
  const avgQuizScore = stats?.avg_quiz_score || 85;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-white shadow-lg">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            Good evening, {user?.full_name || "Student"}
          </h1>
          <p className="text-blue-100 max-w-xl mb-6">
            Welcome back to your learning dashboard. You have {coursesInProgress} active courses and {tasks?.length || 0} pending tasks.
          </p>
          <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
            View My Plan
          </Button>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 bg-[url('https://illustrations.popsy.co/white/student-going-to-school.svg')] bg-no-repeat bg-contain bg-right-bottom" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Courses in Progress</p>
              <h3 className="text-2xl font-bold">{coursesInProgress}</h3>
            </div>
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Study Hours</p>
              <h3 className="text-2xl font-bold">{studyHours}</h3>
            </div>
            <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
              <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Avg. Quiz Score</p>
              <h3 className="text-2xl font-bold">{avgQuizScore}%</h3>
            </div>
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Trophy className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Study Activity Bar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Study Activity</CardTitle>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studyActivityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                  />
                  <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Progress Line Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Performance</CardTitle>
            <div className="flex items-center text-sm text-green-500">
              <TrendingUp className="h-4 w-4 mr-1" />
              +5.2%
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-blue-500 mr-2" />
                  <span className="text-sm text-muted-foreground">Quiz Completion</span>
                </div>
                <span className="text-sm font-bold">92%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="h-2 w-2 rounded-full bg-purple-500 mr-2" />
                <span className="text-sm text-muted-foreground">Assignments</span>
              </div>
              <span className="text-sm font-bold">85%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Continue Learning</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {coursesLoading ? (
                <p className="text-sm text-muted-foreground">Loading courses...</p>
              ) : courses && courses.length > 0 ? (
                courses.slice(0, 3).map((enrollment: any) => (
                  <div key={enrollment.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">{enrollment.course?.title || "Course Title"}</h4>
                        <p className="text-xs text-muted-foreground">
                          {enrollment.progress_percentage || 0}% Complete
                        </p>
                      </div>
                    </div>
                    <Link href={`/lms/courses/${enrollment.course_id}`}>
                      <Button size="sm" variant="ghost">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No active courses. <Link href="/lms/courses" className="text-blue-500 hover:underline">Browse courses</Link></p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks && tasks.length > 0 ? (
                tasks.slice(0, 3).map((task: any, i: number) => (
                  <div key={i} className="flex items-start space-x-4 p-3 border-b last:border-0 border-border">
                    <div className="mt-1">
                      <div className={`h-2 w-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{task.title}</h4>
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        <span>{task.due_date ? new Date(task.due_date).toLocaleDateString() : "No due date"}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No upcoming tasks.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <AIAssistant />
    </div>
  );
}
