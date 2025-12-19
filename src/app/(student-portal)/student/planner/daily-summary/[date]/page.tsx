"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Award, TrendingUp, TrendingDown, CheckCircle, AlertTriangle,
    ArrowRight, Calendar, Clock, Target, BookOpen, Minus
} from "lucide-react";

export default function DailySummaryPage() {
    const params = useParams();
    const router = useRouter();
    const date = params.date as string;

    // Mock daily summary data
    const summary = {
        date: new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        totalQuestions: 3,
        overallScore: 81,
        averageImprovement: 26,
        totalTimeSpent: 385, // minutes

        questionScores: {
            q1: { before: 54, after: 78, improvement: 24 },
            q2: { before: 58, after: 82, improvement: 24 },
            q3: { before: 62, after: 84, improvement: 22 }
        },

        comparison: {
            yesterday: {
                overallScore: 75,
                averageImprovement: 20
            },
            today: {
                overallScore: 81,
                averageImprovement: 26
            },
            trend: 'improving' as 'improving' | 'declining' | 'stable',
            improvementPercentage: 8
        },

        strengths: [
            "Excellent understanding of constitutional principles",
            "Strong analytical skills in comparing federal systems",
            "Good use of landmark judgments and case laws",
            "Improved answer structure after reading content",
            "Consistent performance across all three questions"
        ],

        challenges: [
            "Time management - took extra time in content reading",
            "Could include more contemporary examples",
            "Need to work on conclusion writing",
            "Some key points missed in before-answers"
        ],

        recommendations: [
            "Practice writing concise conclusions",
            "Read more current affairs related to polity",
            "Work on time management for 60-minute content reading",
            "Focus on covering all key points in first attempt"
        ]
    };

    const getTrendIcon = () => {
        if (summary.comparison.trend === 'improving') {
            return <TrendingUp className="h-8 w-8 text-green-600" />;
        } else if (summary.comparison.trend === 'declining') {
            return <TrendingDown className="h-8 w-8 text-red-600" />;
        } else {
            return <Minus className="h-8 w-8 text-yellow-600" />;
        }
    };

    const getTrendColor = () => {
        if (summary.comparison.trend === 'improving') return 'text-green-600';
        if (summary.comparison.trend === 'declining') return 'text-red-600';
        return 'text-yellow-600';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center space-y-4">
                    <Award className="h-24 w-24 text-yellow-500 mx-auto" />
                    <h1 className="text-4xl font-bold text-foreground">Daily Drill Complete!</h1>
                    <p className="text-lg text-muted-foreground">{summary.date}</p>
                </div>

                {/* Overall Performance */}
                <Card className="border-2 border-primary">
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="text-center space-y-2">
                                <p className="text-sm text-muted-foreground">Overall Score</p>
                                <p className="text-5xl font-bold text-primary">{summary.overallScore}%</p>
                            </div>
                            <div className="text-center space-y-2">
                                <p className="text-sm text-muted-foreground">Avg Improvement</p>
                                <p className="text-5xl font-bold text-green-600">+{summary.averageImprovement}%</p>
                            </div>
                            <div className="text-center space-y-2">
                                <p className="text-sm text-muted-foreground">Questions</p>
                                <p className="text-5xl font-bold text-foreground">{summary.totalQuestions}/3</p>
                            </div>
                            <div className="text-center space-y-2">
                                <p className="text-sm text-muted-foreground">Time Spent</p>
                                <p className="text-5xl font-bold text-foreground">{Math.floor(summary.totalTimeSpent / 60)}h {summary.totalTimeSpent % 60}m</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Yesterday vs Today Comparison */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {getTrendIcon()}
                            Performance Comparison
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Yesterday's Score</p>
                                <p className="text-3xl font-bold text-foreground">{summary.comparison.yesterday.overallScore}%</p>
                                <p className="text-sm text-muted-foreground">Avg Improvement: +{summary.comparison.yesterday.averageImprovement}%</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Today's Score</p>
                                <p className="text-3xl font-bold text-primary">{summary.comparison.today.overallScore}%</p>
                                <p className="text-sm text-muted-foreground">Avg Improvement: +{summary.comparison.today.averageImprovement}%</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Trend</p>
                                <p className={`text-3xl font-bold capitalize ${getTrendColor()}`}>
                                    {summary.comparison.trend}
                                </p>
                                <p className={`text-sm font-semibold ${getTrendColor()}`}>
                                    {summary.comparison.trend === 'improving' ? '+' : summary.comparison.trend === 'declining' ? '-' : ''}
                                    {summary.comparison.improvementPercentage}% from yesterday
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Question-wise Performance */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-primary" />
                            Question-wise Performance
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {Object.entries(summary.questionScores).map(([key, scores], idx) => (
                            <div key={key} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-foreground">Question {idx + 1}</span>
                                    <span className="text-sm text-green-600 font-semibold">+{scores.improvement}% improvement</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">Before Reading</p>
                                        <Progress value={scores.before} className="h-2" />
                                        <p className="text-sm font-semibold text-foreground">{scores.before}%</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">After Reading</p>
                                        <Progress value={scores.after} className="h-2" />
                                        <p className="text-sm font-semibold text-primary">{scores.after}%</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Insights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Strengths */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-600">
                                <CheckCircle className="h-5 w-5" />
                                Your Strengths
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {summary.strengths.map((strength, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-foreground">{strength}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Challenges */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-orange-600">
                                <AlertTriangle className="h-5 w-5" />
                                Areas for Improvement
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {summary.challenges.map((challenge, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-foreground">{challenge}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Recommendations */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-primary" />
                            AI Recommendations
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {summary.recommendations.map((recommendation, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span className="text-foreground">{recommendation}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <Button onClick={() => router.push('/student/dashboard')} className="flex-1" size="lg">
                        <Calendar className="mr-2 h-5 w-5" />
                        View Dashboard
                    </Button>
                    <Button onClick={() => router.push('/student/planner')} variant="outline" className="flex-1" size="lg">
                        Back to Planner
                    </Button>
                </div>

                {/* Motivational Message */}
                <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10">
                    <CardContent className="p-6 text-center">
                        <p className="text-lg font-semibold text-foreground">
                            🎉 Great work today! You're making consistent progress. Keep it up!
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Your dedication and hard work will pay off. See you tomorrow!
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
