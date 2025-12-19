
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { upscService, UPSCReport } from "@/services/upscService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, AlertTriangle, Lightbulb } from "lucide-react";

export default function ReportPage() {
    const params = useParams();
    const router = useRouter();
    const [report, setReport] = useState<UPSCReport | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            if (!params.reportId) return;
            // In a real app, we would fetch by ID. 
            // For now, if it's "mock-report-id", we show mock data, else try to fetch (if API was ready for single report)
            // Since I haven't implemented getReportById in service yet, I'll mock it or add it.
            // Let's add getReportById to service first or mock it here.

            // Mocking for now to match the drill page flow
            if (params.reportId === "mock-report-id") {
                setReport({
                    id: "mock-report-id",
                    student_id: "student-1",
                    question_id: "q-1",
                    coverage_before: 45,
                    similarity_before: 60,
                    estimated_marks_before: 4.5,
                    coverage_after: 85,
                    similarity_after: 90,
                    estimated_marks_after: 8.5,
                    missed_points: ["Constitutional Assembly debates", "Instrument of Accession details"],
                    suggestions: ["Focus more on the legal aspects", "Mention the 2019 Reorganization Act specifically"],
                    tone_feedback: "The tone is objective but lacks critical analysis in the conclusion.",
                    generated_at: new Date().toISOString()
                });
                setIsLoading(false);
            } else {
                // TODO: Implement getReportById in upscService and use it
                setIsLoading(false);
            }
        };
        fetchReport();
    }, [params.reportId]);

    if (isLoading) {
        return <div className="p-8 text-center">Loading Report...</div>;
    }

    if (!report) {
        return <div className="p-8 text-center">Report not found.</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center space-x-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="w-5 h-5 text-slate-500" />
                    </Button>
                    <h1 className="text-lg font-bold text-slate-900">Drill Report</h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Score Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-orange-50 border-orange-200">
                        <CardHeader>
                            <CardTitle className="text-orange-800">Before Study</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-orange-600 mb-2">
                                {report.estimated_marks_before} <span className="text-lg text-gray-500">/ 15</span>
                            </div>
                            <div className="space-y-2 text-sm text-gray-700">
                                <div className="flex justify-between">
                                    <span>Coverage</span>
                                    <span className="font-medium">{report.coverage_before}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Similarity</span>
                                    <span className="font-medium">{report.similarity_before}%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-green-50 border-green-200">
                        <CardHeader>
                            <CardTitle className="text-green-800">After Study</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-green-600 mb-2">
                                {report.estimated_marks_after} <span className="text-lg text-gray-500">/ 15</span>
                            </div>
                            <div className="space-y-2 text-sm text-gray-700">
                                <div className="flex justify-between">
                                    <span>Coverage</span>
                                    <span className="font-medium">{report.coverage_after}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Similarity</span>
                                    <span className="font-medium">{report.similarity_after}%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Feedback */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                                Missed Points
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                                {report.missed_points?.map((point, i) => (
                                    <li key={i}>{point}</li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lightbulb className="w-5 h-5 text-yellow-500" />
                                Suggestions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                                {report.suggestions?.map((suggestion, i) => (
                                    <li key={i}>{suggestion}</li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-blue-500" />
                            Tone & Style
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700">{report.tone_feedback}</p>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
