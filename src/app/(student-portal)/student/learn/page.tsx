"use client";

import { useState, useEffect } from "react";
import { BookOpen, Brain, PenTool, Calendar, Layers, Sparkles, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import api from "@/lib/api";

interface BatchOption {
    title: string;
    description: string;
    icon: any;
    href: string;
    color: string;
    bgColor: string;
    active: boolean;
    status?: string;
    batchId?: string; // Used for filtering
}

export default function LearnPage() {
    const { user } = useAuth();
    const [enrolledBatches, setEnrolledBatches] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch user's enrolled batches
    useEffect(() => {
        const fetchEnrolledBatches = async () => {
            try {
                // Master ID always gets access to both batches
                if (user?.email === 'ktej255@gmail.com') {
                    setEnrolledBatches(['batch1', 'batch2']);
                    setLoading(false);
                    return;
                }

                // Try to fetch from backend - if endpoint exists
                // For now, check localStorage for batch enrollment
                const storedBatches = localStorage.getItem('edueco_enrolled_batches');
                if (storedBatches) {
                    setEnrolledBatches(JSON.parse(storedBatches));
                } else {
                    // Default: show Batch 1 for all students (primary batch)
                    // Batch 2 is secondary/advanced content
                    setEnrolledBatches(['batch1']);
                }
            } catch (error) {
                console.error("Failed to fetch enrolled batches:", error);
                // Fallback to showing Batch 1
                setEnrolledBatches(['batch1']);
            } finally {
                setLoading(false);
            }
        };

        fetchEnrolledBatches();
    }, [user]);

    const allLearnOptions: BatchOption[] = [
        {
            title: "Batch 1",
            description: "Comprehensive UPSC Preparation Plan",
            icon: BookOpen,
            href: "/student/planner",
            color: "text-blue-600",
            bgColor: "bg-blue-100 dark:bg-blue-900/30",
            active: true,
            batchId: "batch1"
        },
        {
            title: "Batch 2",
            description: "Advanced Modules & Specialized Tracks",
            icon: Layers,
            href: "/student/batch2",
            color: "text-purple-600",
            bgColor: "bg-purple-100 dark:bg-purple-900/30",
            active: true,
            batchId: "batch2"
        }
    ];

    // Non-batch items (always visible)
    const generalItems: BatchOption[] = [
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

    // Filter batches based on enrollment
    const filteredBatches = allLearnOptions.filter(option =>
        enrolledBatches.includes(option.batchId || '')
    );

    // Combine filtered batches with general items
    const learnOptions = [...filteredBatches, ...generalItems];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Learning Hub</h1>
                <p className="text-gray-600 dark:text-gray-400">Select your path to continue your journey</p>
            </div>

            {/* Your Batches Section */}
            {filteredBatches.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Your Enrolled Batches</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredBatches.map((option, index) => (
                            <Link
                                key={index}
                                href={option.active ? option.href : "#"}
                                className={`block h-full ${!option.active ? 'cursor-not-allowed opacity-80' : ''}`}
                            >
                                <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 border-l-4 border-l-blue-500">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div className={`w-12 h-12 rounded-xl ${option.bgColor} flex items-center justify-center mb-4`}>
                                                <option.icon className={`h-6 w-6 ${option.color}`} />
                                            </div>
                                            <span className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-xs font-medium text-blue-700 dark:text-blue-300">
                                                Enrolled
                                            </span>
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
            )}

            {/* Other Learning Options */}
            <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Other Activities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {generalItems.map((option, index) => (
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
        </div>
    );
}

