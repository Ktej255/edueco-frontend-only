"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Award, TrendingUp, CheckCircle, AlertTriangle,
    ArrowLeft, Download, Share2, Target, BookOpen, Clock
} from "lucide-react";

export default function DrillReportPage() {
    const params = useParams();
    const router = useRouter();
    const date = params.date as string;

    // Mock AI-generated report data
    const report = {
        overallScore: 78,
        improvement: 24,
        beforeScore: 54,
        afterScore: 78,
        timeSpent: {
            questionReading: 4.5,
            beforeWriting: 18,
            contentReading: 62,
            afterWriting: 19,
            modelReview: 8
        },
        strengths: [
            "Good understanding of constitutional principles",
            "Effective use of examples",
            "Clear structure and organization",
            "Improved depth after reading content"
        ],
        improvements: [
            "Include more landmark judgments",
            "Elaborate on contemporary relevance",
            "Better conclusion summarizing key points",
            "Time management - complete within allocated time"
        ],
        keyMetrics: {
            contentCoverage: 85,
            structureQuality: 75,
            examplesUsed: 70,
            languageClarity: 80
        },
        comparison: {
            before: {
                wordCount: 280,
                keyPointsCovered: 3,
                examplesUsed: 1,
                structureScore: 60
            },
            after: {
                wordCount: 420,
                keyPointsCovered: 6,
                examplesUsed: 3,
                structureScore: 85
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Button variant="ghost" onClick={() => router.push('/student/planner')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Planner
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                        </Button>
                        <Button variant="outline" size="sm">
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                        </Button>
                    </div>
                </div>

                {/* Overall Performance */}
                <Card className="border-2 border-primary">
                    <CardContent className="p-8">
                        <div className="text-center space-y-4">
                            <Award className="h-20 w-20 text-yellow-500 mx-auto" />
                            <h1 className="text-3xl font-bold text-foreground">Performance Report</h1>
                            <p className="text-muted-foreground">Daily Drill - {new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">Overall Score</p>
                                    <p className="text-5xl font-bold text-primary">{report.overallScore}%</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">Improvement</p>
                                    <p className="text-5xl font-bold text-green-600">+{report.improvement}%</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">Before → After</p>
                                    <p className="text-3xl font-bold text-foreground">{report.beforeScore}% → {report.afterScore}%</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-5 w-5 text-primary" />
                                Key Metrics
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {Object.entries(report.keyMetrics).map(([key, value]) => (
                                <div key={key} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="capitalize text-foreground">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                        <span className="font-semibold text-primary">{value}%</span>
                                    </div>
                                    <Progress value={value} className="h-2" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-primary" />
                                Time Management
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {Object.entries(report.timeSpent).map(([key, value]) => (
                                <div key={key} className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground capitalize">
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </span>
                                    <span className="font-semibold text-foreground">{value} min</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Before vs After Comparison */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            Before vs After Comparison
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="font-semibold text-foreground">Before Reading Content</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Word Count</span>
                                        <span className="font-semibold text-foreground">{report.comparison.before.wordCount}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Key Points Covered</span>
                                        <span className="font-semibold text-foreground">{report.comparison.before.keyPointsCovered}/8</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Examples Used</span>
                                        <span className="font-semibold text-foreground">{report.comparison.before.examplesUsed}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Structure Score</span>
                                        <span className="font-semibold text-foreground">{report.comparison.before.structureScore}%</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="font-semibold text-green-600">After Reading Content</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Word Count</span>
                                        <span className="font-semibold text-green-600">{report.comparison.after.wordCount} (+{report.comparison.after.wordCount - report.comparison.before.wordCount})</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Key Points Covered</span>
                                        <span className="font-semibold text-green-600">{report.comparison.after.keyPointsCovered}/8 (+{report.comparison.after.keyPointsCovered - report.comparison.before.keyPointsCovered})</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Examples Used</span>
                                        <span className="font-semibold text-green-600">{report.comparison.after.examplesUsed} (+{report.comparison.after.examplesUsed - report.comparison.before.examplesUsed})</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Structure Score</span>
                                        <span className="font-semibold text-green-600">{report.comparison.after.structureScore}% (+{report.comparison.after.structureScore - report.comparison.before.structureScore}%)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Strengths and Improvements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-600">
                                <CheckCircle className="h-5 w-5" />
                                Strengths
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {report.strengths.map((strength, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-foreground">{strength}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-orange-600">
                                <AlertTriangle className="h-5 w-5" />
                                Areas for Improvement
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {report.improvements.map((improvement, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-foreground">{improvement}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <Button onClick={() => router.push('/student/planner')} className="flex-1" size="lg">
                        <BookOpen className="mr-2 h-5 w-5" />
                        Back to Planner
                    </Button>
                    <Button onClick={() => router.push('/student/dashboard')} variant="outline" className="flex-1" size="lg">
                        View Dashboard
                    </Button>
                </div>
            </div>
        </div>
    );
}
