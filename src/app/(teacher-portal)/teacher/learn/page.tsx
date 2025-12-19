"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    BookOpen,
    Users,
    Clock,
    TrendingUp,
    PlayCircle,
    FileText,
    BarChart3,
    CheckCircle,
    Cpu
} from "lucide-react";

export default function TeacherLearnPage() {
    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Learning Management</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Monitor student progress and manage learning content
                    </p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Active Students</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">24</p>
                            </div>
                            <Users className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Lessons Completed</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">156</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Progress</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">67%</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Time/Day</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">45m</p>
                            </div>
                            <Clock className="h-8 w-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Content Management */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PlayCircle className="h-5 w-5 text-blue-500" />
                            Video Content
                        </CardTitle>
                        <CardDescription>
                            Manage video lessons and transcriptions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/teacher/batch1">
                            <Button className="w-full">
                                Manage Batch 1 Videos
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Student Progress */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-green-500" />
                            Student Progress
                        </CardTitle>
                        <CardDescription>
                            View detailed student analytics
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/teacher/dashboard">
                            <Button className="w-full" variant="outline">
                                View Dashboard
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* AI Debug */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Cpu className="h-5 w-5 text-purple-500" />
                            AI Transparency
                            <Badge variant="secondary" className="ml-2">NEW</Badge>
                        </CardTitle>
                        <CardDescription>
                            Monitor AI operations step-by-step
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/admin/ai-debug">
                            <Button className="w-full" variant="outline">
                                View AI Debug
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Recent Learning Activity
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">Student completed GS2 - Lesson 3</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">2 minutes ago</p>
                                </div>
                            </div>
                            <Badge>Completed</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">Student started Quality video</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">15 minutes ago</p>
                                </div>
                            </div>
                            <Badge variant="outline">In Progress</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">AI Analysis completed for drill submission</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">30 minutes ago</p>
                                </div>
                            </div>
                            <Badge variant="secondary">AI</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
