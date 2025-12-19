"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Users, TrendingUp, BookOpen, Award,
    Download, RefreshCw, Brain
} from "lucide-react";
import Link from "next/link";

interface AnalyticsData {
    total_students: number;
    total_drills: number;
    average_score: number;
    average_improvement: number;
    top_performers: Array<{ student_id: string; average_score: number }>;
}

interface TopicPerformance {
    topic: string;
    total_attempts: number;
    average_score: number;
    average_improvement: number;
}

export default function AdminAnalyticsPage() {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [topicPerformance, setTopicPerformance] = useState<TopicPerformance[]>([]);
    const [selectedGS, setSelectedGS] = useState<string>("GS2");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
        fetchTopicPerformance();
    }, [selectedGS]);

    const fetchAnalytics = async () => {
        try {
            const response = await fetch(`/api/admin/analytics/all-students/summary?gs_paper=${selectedGS}`);
            const data = await response.json();
            setAnalytics(data);
        } catch (error) {
            console.error("Failed to fetch analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTopicPerformance = async () => {
        try {
            const response = await fetch(`/api/admin/analytics/all-students/by-topic?gs_paper=${selectedGS}`);
            const data = await response.json();
            setTopicPerformance(data);
        } catch (error) {
            console.error("Failed to fetch topic performance:", error);
        }
    };

    const generateInsights = async () => {
        try {
            const response = await fetch(`/api/admin/analytics/generate-insights?gs_paper=${selectedGS}`, {
                method: "POST"
            });
            const insights = await response.json();
            alert("Insights generated! Check the AI Insights page.");
        } catch (error) {
            console.error("Failed to generate insights:", error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Student Analytics Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Monitor student performance and drill completion
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => { fetchAnalytics(); fetchTopicPerformance(); }}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                    <Link href="/admin/drill/insights">
                        <Button className="gap-2">
                            <Brain className="h-4 w-4" />
                            AI Insights
                        </Button>
                    </Link>
                </div>
            </div>

            {/* GS Paper Filter */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex gap-2">
                        {["GS1", "GS2", "GS3", "GS4"].map((gs) => (
                            <Button
                                key={gs}
                                variant={selectedGS === gs ? "default" : "outline"}
                                onClick={() => setSelectedGS(gs)}
                            >
                                {gs}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Overview Stats */}
            {analytics && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                        {analytics.total_students}
                                    </p>
                                </div>
                                <Users className="h-10 w-10 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Drills</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                        {analytics.total_drills}
                                    </p>
                                </div>
                                <BookOpen className="h-10 w-10 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Average Score</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                        {analytics.average_score.toFixed(1)}%
                                    </p>
                                </div>
                                <Award className="h-10 w-10 text-purple-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg Improvement</p>
                                    <p className="text-3xl font-bold text-green-600">
                                        +{analytics.average_improvement.toFixed(1)}%
                                    </p>
                                </div>
                                <TrendingUp className="h-10 w-10 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Topic Performance */}
            <Card>
                <CardHeader>
                    <CardTitle>Topic-wise Performance ({selectedGS})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-3 text-gray-700 dark:text-gray-300">Topic</th>
                                    <th className="text-right p-3 text-gray-700 dark:text-gray-300">Attempts</th>
                                    <th className="text-right p-3 text-gray-700 dark:text-gray-300">Avg Score</th>
                                    <th className="text-right p-3 text-gray-700 dark:text-gray-300">Avg Improvement</th>
                                    <th className="text-right p-3 text-gray-700 dark:text-gray-300">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topicPerformance.map((topic, idx) => (
                                    <tr key={idx} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <td className="p-3 text-gray-900 dark:text-gray-100 font-medium">
                                            {topic.topic}
                                        </td>
                                        <td className="p-3 text-right text-gray-700 dark:text-gray-300">
                                            {topic.total_attempts}
                                        </td>
                                        <td className="p-3 text-right">
                                            <span className={`px-2 py-1 rounded text-sm font-medium ${topic.average_score >= 80 ? 'bg-green-100 text-green-700' :
                                                    topic.average_score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                {topic.average_score.toFixed(1)}%
                                            </span>
                                        </td>
                                        <td className="p-3 text-right text-green-600 font-semibold">
                                            +{topic.average_improvement.toFixed(1)}%
                                        </td>
                                        <td className="p-3 text-right">
                                            {topic.average_score >= 80 ? (
                                                <span className="text-green-600">✓ Strong</span>
                                            ) : topic.average_score >= 60 ? (
                                                <span className="text-yellow-600">⚠ Moderate</span>
                                            ) : (
                                                <span className="text-red-600">⚠ Needs Attention</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link href="/admin/drill/analytics/students">
                            <Button variant="outline" className="w-full h-20">
                                <div className="text-center">
                                    <Users className="h-6 w-6 mx-auto mb-2" />
                                    <p className="text-sm">View All Students</p>
                                </div>
                            </Button>
                        </Link>
                        <Button variant="outline" className="w-full h-20" onClick={generateInsights}>
                            <div className="text-center">
                                <Brain className="h-6 w-6 mx-auto mb-2" />
                                <p className="text-sm">Generate AI Insights</p>
                            </div>
                        </Button>
                        <Button variant="outline" className="w-full h-20">
                            <div className="text-center">
                                <Download className="h-6 w-6 mx-auto mb-2" />
                                <p className="text-sm">Export Report</p>
                            </div>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
