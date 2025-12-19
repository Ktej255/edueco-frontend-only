"use client";

import { useState, useEffect } from "react";
import { BookOpen, Video, Upload, Users, BarChart3, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Stats data
const teacherStats = [
    { label: "Videos Uploaded", value: "12", icon: Video, color: "text-blue-600", bgColor: "bg-blue-100" },
    { label: "Active Courses", value: "3", icon: BookOpen, color: "text-green-600", bgColor: "bg-green-100" },
    { label: "Students Enrolled", value: "156", icon: Users, color: "text-purple-600", bgColor: "bg-purple-100" },
    { label: "Completion Rate", value: "78%", icon: BarChart3, color: "text-amber-600", bgColor: "bg-amber-100" },
];

// Quick actions
const quickActions = [
    {
        title: "UPSC Batch 1 Content",
        description: "Upload videos for Prelims cycles",
        href: "/teacher/batch1",
        icon: Upload,
        color: "bg-indigo-600 hover:bg-indigo-700"
    },
    {
        title: "View Analytics",
        description: "Check student progress and performance",
        href: "/teacher/analytics",
        icon: BarChart3,
        color: "bg-emerald-600 hover:bg-emerald-700"
    },
];

export default function TeacherDashboard() {
    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Teacher Dashboard</h1>
                    <p className="text-gray-600 mt-1">Manage your courses and content</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/teacher/batch1">
                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Content
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {teacherStats.map((stat) => (
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

            {/* Quick Actions */}
            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quickActions.map((action) => (
                        <Link key={action.href} href={action.href}>
                            <Card className="cursor-pointer hover:shadow-lg transition-all">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-4 rounded-xl ${action.color} text-white`}>
                                            <action.icon className="h-8 w-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">{action.title}</h3>
                                            <p className="text-gray-500">{action.description}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Recent Activity
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <div>
                                <p className="font-medium text-gray-800">Video uploaded for Cycle 1 Day 1</p>
                                <p className="text-sm text-gray-500">2 hours ago</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                            <Video className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="font-medium text-gray-800">New student enrolled in Batch 1</p>
                                <p className="text-sm text-gray-500">5 hours ago</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-amber-50 rounded-lg">
                            <AlertCircle className="h-5 w-5 text-amber-600" />
                            <div>
                                <p className="font-medium text-gray-800">Pending: Upload videos for Cycle 1 Day 2</p>
                                <p className="text-sm text-gray-500">Action required</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
