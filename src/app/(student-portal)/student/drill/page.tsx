"use client";

import { useEffect, useState } from "react";
import { upscService } from "@/services/upscService";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, CheckSquare } from "lucide-react";

export default function DrillPage() {
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await upscService.getStudentDashboard();
                setDashboardData(data);
            } catch (error) {
                console.error("Failed to load drill data", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading drills...</div>;

    const nextDrill = dashboardData?.next_drill;

    return (
        <div className="space-y-8 max-w-4xl mx-auto p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-display">Daily Drills</h1>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                    Streak: <span className="font-bold text-orange-500">{dashboardData?.current_streak || 0} Days</span>
                </div>
            </div>

            {/* Today's Drill Hero */}
            <div className="relative overflow-hidden rounded-3xl bg-indigo-900 text-white shadow-2xl p-8 md:p-12">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm font-medium backdrop-blur-sm border border-white/10 mb-6">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        Today's Focus
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        {nextDrill?.title || "No active drill for today"}
                    </h2>

                    <p className="text-blue-100 text-lg mb-8 max-w-2xl">
                        Complete today's drill to maintain your streak and master high-yield topics.
                    </p>

                    {nextDrill ? (
                        <Link href={`/student/drill/${nextDrill.plan_id}`}>
                            <Button className="h-12 px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-lg font-semibold shadow-lg shadow-blue-500/30 transition-all hover:scale-105">
                                Start Now <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    ) : (
                        <Button disabled className="h-12 px-8 bg-slate-700 text-slate-400 rounded-xl">
                            All Caught Up
                        </Button>
                    )}
                </div>
            </div>

            {/* Past Drills / History */}
            <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Recent History</h3>
                <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-slate-200 dark:border-neutral-700 overflow-hidden">
                    {dashboardData?.recent_reports?.length > 0 ? (
                        <div className="divide-y divide-slate-100 dark:divide-neutral-700">
                            {dashboardData.recent_reports.map((report: any) => (
                                <div key={report.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-neutral-700/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                                            <CheckSquare className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-slate-900 dark:text-white">Drill Completed</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{report.generated_at ? new Date(report.generated_at).toLocaleDateString() : 'Unknown Date'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                            Score: {report.estimated_marks_after || report.estimated_marks_before || 0}
                                        </span>
                                        <Link href={`/student/reports/${report.id}`}>
                                            <Button variant="ghost" size="sm">View Report</Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                            No recent drills completed.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
