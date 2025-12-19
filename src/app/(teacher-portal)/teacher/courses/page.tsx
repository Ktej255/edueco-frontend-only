"use client";

import { useState } from "react";
import {
    GraduationCap,
    Users,
    BookOpen,
    BarChart3,
    Clock,
    CheckCircle2,
    AlertCircle,
    MoreVertical,
    Eye,
    Pencil,
    Settings,
    Trash2,
    Plus,
    TrendingUp,
    Play,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

// Sample course data
const courses = [
    {
        id: 1,
        name: "UPSC Prelims 2026 - Batch 1",
        description: "90-Day Crash Course for Prelims",
        thumbnail: "🎯",
        students: 156,
        completion: 67,
        status: "published",
        lessons: 120,
        duration: "90 days",
        revenue: "₹4,68,000",
        lastUpdated: "2 hours ago",
        href: "/teacher/batch1",
    },
    {
        id: 2,
        name: "GS Mains Answer Writing",
        description: "Master the art of answer writing for GS papers",
        thumbnail: "✍️",
        students: 89,
        completion: 45,
        status: "published",
        lessons: 60,
        duration: "30 days",
        revenue: "₹1,78,000",
        lastUpdated: "1 day ago",
        href: "/teacher/courses/gs-mains",
    },
    {
        id: 3,
        name: "CSAT Crash Course",
        description: "Complete CSAT preparation in 15 days",
        thumbnail: "🧮",
        students: 234,
        completion: 78,
        status: "published",
        lessons: 45,
        duration: "15 days",
        revenue: "₹2,34,000",
        lastUpdated: "3 days ago",
        href: "/teacher/courses/csat",
    },
    {
        id: 4,
        name: "Current Affairs Monthly",
        description: "Monthly current affairs for UPSC",
        thumbnail: "📰",
        students: 567,
        completion: 92,
        status: "published",
        lessons: 30,
        duration: "Monthly",
        revenue: "₹5,67,000",
        lastUpdated: "1 week ago",
        href: "/teacher/courses/current-affairs",
    },
    {
        id: 5,
        name: "Optional: Psychology",
        description: "Complete Psychology optional preparation",
        thumbnail: "🧠",
        students: 0,
        completion: 0,
        status: "draft",
        lessons: 0,
        duration: "60 days",
        revenue: "₹0",
        lastUpdated: "2 weeks ago",
        href: "/teacher/courses/psychology",
    },
];

// Stats summary
const courseStats = [
    { label: "Total Courses", value: "5", icon: BookOpen, color: "text-blue-600", bgColor: "bg-blue-100" },
    { label: "Total Students", value: "1,046", icon: Users, color: "text-green-600", bgColor: "bg-green-100" },
    { label: "Active Learners", value: "789", icon: Play, color: "text-purple-600", bgColor: "bg-purple-100" },
    { label: "Total Revenue", value: "₹14.47L", icon: TrendingUp, color: "text-amber-600", bgColor: "bg-amber-100" },
];

const getStatusBadge = (status: string) => {
    switch (status) {
        case "published":
            return (
                <span className="flex items-center gap-1 text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                    <CheckCircle2 className="h-3 w-3" />
                    Published
                </span>
            );
        case "draft":
            return (
                <span className="flex items-center gap-1 text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                    <AlertCircle className="h-3 w-3" />
                    Draft
                </span>
            );
        default:
            return (
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                    {status}
                </span>
            );
    }
};

const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 50) return "bg-blue-500";
    if (percentage >= 25) return "bg-yellow-500";
    return "bg-gray-300";
};

export default function MyCoursesPage() {
    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <GraduationCap className="h-8 w-8 text-emerald-600" />
                        My Courses
                    </h1>
                    <p className="text-gray-600 mt-1">Manage and track your course performance</p>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Course
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {courseStats.map((stat) => (
                    <Card key={stat.label}>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                                    <p className="text-sm text-gray-500">{stat.label}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Course Cards */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">All Courses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {courses.map((course) => (
                        <Card key={course.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center text-3xl">
                                            {course.thumbnail}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-gray-800">{course.name}</h3>
                                                {getStatusBadge(course.status)}
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">{course.description}</p>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                                <Eye className="mr-2 h-4 w-4" />
                                                View Course
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit Course
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Settings className="mr-2 h-4 w-4" />
                                                Settings
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600">
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Stats Row */}
                                <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t">
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-gray-800">{course.students}</p>
                                        <p className="text-xs text-gray-500">Students</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-gray-800">{course.lessons}</p>
                                        <p className="text-xs text-gray-500">Lessons</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-gray-800">{course.duration}</p>
                                        <p className="text-xs text-gray-500">Duration</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-emerald-600">{course.revenue}</p>
                                        <p className="text-xs text-gray-500">Revenue</p>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-4">
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <span className="text-gray-500">Avg. Completion</span>
                                        <span className="font-medium text-gray-700">{course.completion}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${getCompletionColor(course.completion)} transition-all`}
                                            style={{ width: `${course.completion}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between mt-4 pt-3 border-t">
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        Updated {course.lastUpdated}
                                    </span>
                                    <Link href={course.href}>
                                        <Button size="sm" variant="outline">
                                            Manage Content
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
