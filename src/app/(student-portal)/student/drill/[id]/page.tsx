"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DrillStepWizard } from "@/components/upsc/DrillStepWizard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Mock Data for Development
const MOCK_QUESTION = {
    question_number: 1,
    title: "Significance of Article 370",
    question_text: "Discuss the historical significance of Article 370 and the implications of its abrogation on the federal structure of India. (250 words)",
    marks: 15,
    subject: "GS-2 Polity",
    microtopics: ["Federalism", "J&K Reorganization", "Constitutional History"],
};

const MOCK_TIMER_CONFIG = {
    read: 10, // Shortened for demo (real: 300)
    write_before: 20, // Shortened for demo (real: 1200)
    study: 30, // Shortened for demo (real: 3600)
    write_after: 20, // Shortened for demo (real: 1200)
};

export default function DrillPage() {
    const params = useParams();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate API fetch
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleSessionComplete = () => {
        // Navigate to report page
        router.push("/student/reports/mock-report-id");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-blue-200 rounded-full mb-4"></div>
                    <div className="h-4 w-48 bg-slate-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="w-5 h-5 text-slate-500" />
                        </Button>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900">
                                Daily Mains Drill
                            </h1>
                            <p className="text-xs text-slate-500">
                                Session ID: {params.id?.toString().slice(0, 8)}...
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                            LIVE SESSION
                        </span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <DrillStepWizard
                    question={MOCK_QUESTION}
                    timerConfig={MOCK_TIMER_CONFIG}
                    onSessionComplete={handleSessionComplete}
                />
            </main>
        </div>
    );
}
