"use client";

import { BookOpen, Brain, PenTool, Calendar, Layers, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

export default function LearnPage() {
    const learnOptions = [
        {
            title: "Batch 1",
            description: "Comprehensive UPSC Preparation Plan",
            icon: BookOpen,
            href: "/student/planner",
            color: "text-blue-600",
            bgColor: "bg-blue-100 dark:bg-blue-900/30",
            active: true
        },
        {
            title: "Batch 2",
            description: "Advanced Modules & Specialized Tracks",
            icon: Layers,
            href: "/student/batch2",
            color: "text-purple-600",
            bgColor: "bg-purple-100 dark:bg-purple-900/30",
            active: true
        },
        {
            title: "Self-Study Mode",
            description: "Curated resources for independent learning",
            icon: Sparkles,
            href: "#",
            color: "text-orange-600",
            bgColor: "bg-orange-100 dark:bg-orange-900/30",
            active: false,
            status: "Coming Soon"
        },
        {
            title: "Meditation",
            description: "Mindfulness & Focus Enhancement",
            icon: Brain,
            href: "/student/meditation",
            color: "text-green-600",
            bgColor: "bg-green-100 dark:bg-green-900/30",
            active: true
        },
        {
            title: "Graphotherapy",
            description: "Handwriting Analysis & Improvement",
            icon: PenTool,
            href: "/student/graphotherapy",
            color: "text-pink-600",
            bgColor: "bg-pink-100 dark:bg-pink-900/30",
            active: true
        },
        {
            title: "Upcoming Courses",
            description: "Future batches and special sessions",
            icon: Calendar,
            href: "#",
            color: "text-indigo-600",
            bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
            active: false,
            status: "Stay Tuned"
        }
    ];

    return (
        <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Learning Hub</h1>
                <p className="text-gray-600 dark:text-gray-400">Select your path to continue your journey</p>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {learnOptions.map((option, index) => (
                    <Link
                        key={index}
                        href={option.active ? option.href : "#"}
                        className={`block h-full ${!option.active ? 'cursor-not-allowed opacity-80' : ''}`}
                    >
                        <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className={`w-12 h-12 rounded-xl ${option.bgColor} flex items-center justify-center mb-4`}>
                                        <option.icon className={`h-6 w-6 ${option.color}`} />
                                    </div>
                                    {!option.active && (
                                        <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-gray-600 dark:text-gray-400">
                                            {option.status}
                                        </span>
                                    )}
                                </div>
                                <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                    {option.title}
                                </CardTitle>
                                <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
                                    {option.description}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
