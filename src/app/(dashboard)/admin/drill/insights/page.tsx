"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Lightbulb, AlertTriangle, TrendingUp, RefreshCw } from "lucide-react";

interface Recommendation {
    category: string;
    priority: string;
    topic?: string;
    description: string;
    suggested_action: string;
    expected_impact: string;
}

interface Insight {
    id: string;
    date: string;
    gs_paper: string;
    total_students: number;
    average_score: number;
    common_challenges: string[];
    high_performing_topics: string[];
    low_performing_topics: string[];
    ai_recommendations: {
        overall_assessment: string;
        recommendations: Recommendation[];
        content_gaps: string[];
        difficulty_adjustments: string[];
        new_topics_suggested: string[];
        teaching_method_improvements: string[];
    };
}

export default function AdminInsightsPage() {
    const [insights, setInsights] = useState<Insight[]>([]);
    const [selectedGS, setSelectedGS] = useState<string>("GS2");
    const [generating, setGenerating] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInsights();
    }, [selectedGS]);

    const fetchInsights = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/admin/analytics/curriculum-recommendations?gs_paper=${selectedGS}`);
            const data = await response.json();
            setInsights(data.insights || []);
        } catch (error) {
            console.error("Failed to fetch insights:", error);
        } finally {
            setLoading(false);
        }
    };

    const generateNewInsights = async () => {
        try {
            setGenerating(true);
            const response = await fetch(`/api/admin/analytics/generate-insights?gs_paper=${selectedGS}`, {
                method: "POST"
            });
            const newInsight = await response.json();
            alert("New insights generated successfully!");
            fetchInsights();
        } catch (error) {
            console.error("Failed to generate insights:", error);
            alert("Failed to generate insights");
        } finally {
            setGenerating(false);
        }
    };

    const latestInsight = insights[0];

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        AI-Powered Curriculum Insights
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Grok-generated recommendations for curriculum improvement
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchInsights}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                    <Button onClick={generateNewInsights} disabled={generating}>
                        <Brain className="h-4 w-4 mr-2" />
                        {generating ? "Generating..." : "Generate New Insights"}
                    </Button>
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

            {loading ? (
                <Card>
                    <CardContent className="p-8 text-center">
                        <p className="text-gray-500">Loading insights...</p>
                    </CardContent>
                </Card>
            ) : !latestInsight ? (
                <Card>
                    <CardContent className="p-8 text-center">
                        <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">No insights available yet</p>
                        <Button onClick={generateNewInsights}>
                            Generate First Insights
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {/* Overall Assessment */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Brain className="h-5 w-5 text-purple-600" />
                                Overall Assessment
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {latestInsight.ai_recommendations.overall_assessment}
                            </p>
                            <div className="mt-4 grid grid-cols-3 gap-4">
                                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Students Analyzed</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        {latestInsight.total_students}
                                    </p>
                                </div>
                                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Average Score</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        {latestInsight.average_score.toFixed(1)}%
                                    </p>
                                </div>
                                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Analysis Date</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                        {new Date(latestInsight.date).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recommendations */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lightbulb className="h-5 w-5 text-yellow-600" />
                                AI Recommendations
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {latestInsight.ai_recommendations.recommendations.map((rec, idx) => (
                                <div
                                    key={idx}
                                    className={`p-4 rounded-lg border-l-4 ${rec.priority === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                                            rec.priority === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                                                'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                                                    rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-blue-100 text-blue-700'
                                                }`}>
                                                {rec.priority.toUpperCase()} PRIORITY
                                            </span>
                                            <span className="ml-2 px-2 py-1 rounded text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                                {rec.category.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    {rec.topic && (
                                        <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                            Topic: {rec.topic}
                                        </p>
                                    )}
                                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                                        <strong>Issue:</strong> {rec.description}
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                                        <strong>Suggested Action:</strong> {rec.suggested_action}
                                    </p>
                                    <p className="text-green-700 dark:text-green-400 text-sm">
                                        <strong>Expected Impact:</strong> {rec.expected_impact}
                                    </p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Content Gaps & Improvements */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                                    Content Gaps
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {latestInsight.ai_recommendations.content_gaps.map((gap, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                                            <span className="text-orange-600 mt-1">•</span>
                                            <span>{gap}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-green-600" />
                                    Teaching Method Improvements
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {latestInsight.ai_recommendations.teaching_method_improvements.map((improvement, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                                            <span className="text-green-600 mt-1">•</span>
                                            <span>{improvement}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Performance Topics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-green-600">High-Performing Topics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-1">
                                    {latestInsight.high_performing_topics.map((topic, idx) => (
                                        <li key={idx} className="text-gray-700 dark:text-gray-300">
                                            ✓ {topic}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-red-600">Low-Performing Topics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-1">
                                    {latestInsight.low_performing_topics.map((topic, idx) => (
                                        <li key={idx} className="text-gray-700 dark:text-gray-300">
                                            ⚠ {topic}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
}
