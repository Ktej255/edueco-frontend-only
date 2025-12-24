"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
    BookOpen,
    PenTool,
    Brain,
    CheckSquare,
    LayoutDashboard,
    Settings,
    User,
} from "lucide-react";
import { getStudentStats, StudentStats } from "@/services/progressStorage";

const menuItems = [
    {
        name: "Dashboard",
        href: "/student/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Learn",
        href: "/student/learn",
        icon: BookOpen,
    },
    {
        name: "Graphotherapy",
        href: "/student/graphotherapy",
        icon: PenTool,
    },
    {
        name: "Meditation",
        href: "/student/meditation",
        icon: Brain,
    },
    {
        name: "Daily Action",
        href: "/student/daily-action",
        icon: CheckSquare,
    },
];

const bottomMenuItems = [
    {
        name: "Profile",
        href: "/student/profile",
        icon: User,
    },
    {
        name: "Settings",
        href: "/student/settings",
        icon: Settings,
    },
];

export default function StudentMobileSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [stats, setStats] = useState<StudentStats | null>(null);

    // Calculate overall progress percentage
    const calculateProgress = useCallback((studentStats: StudentStats): number => {
        if (!studentStats) return 0;

        const meditationProgress = ((studentStats.meditation.currentLevel - 1) * 60 + studentStats.meditation.currentDay) / 120 * 100;
        const graphoProgress = ((studentStats.graphotherapy.currentLevel - 1) * 60 + studentStats.graphotherapy.currentDay) / 120 * 100;
        const prelimsProgress = studentStats.prelims.totalSegmentsCompleted * 2;

        const overall = Math.min(100, Math.round((meditationProgress + graphoProgress + prelimsProgress) / 3));
        return overall;
    }, []);

    // Load stats
    useEffect(() => {
        const studentStats = getStudentStats();
        setStats(studentStats);
    }, []);

    const progressPercent = stats ? calculateProgress(stats) : 0;

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[280px] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
                <SheetHeader className="p-4 border-b border-gray-200 dark:border-gray-800">
                    <SheetTitle className="text-left text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Student Portal
                    </SheetTitle>
                </SheetHeader>

                {/* Main Navigation */}
                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 min-h-[48px] ${isActive
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700"
                                    }`}
                            >
                                <Icon className="h-5 w-5 shrink-0" />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Progress Section */}
                <div className="p-4 mt-2 border-t border-gray-200 dark:border-gray-800">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
                        <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-2">
                            Your Progress
                        </h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-600 dark:text-gray-400">Overall</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">{progressPercent}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                            {stats && (
                                <div className="mt-3 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                                    <div className="flex justify-between">
                                        <span>🧘 Meditation</span>
                                        <span>Lv{stats.meditation.currentLevel} D{stats.meditation.currentDay}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>✍️ Graphotherapy</span>
                                        <span>Lv{stats.graphotherapy.currentLevel} D{stats.graphotherapy.currentDay}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>🔥 Streak</span>
                                        <span>{stats.overallStreak} days</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Menu Items */}
                <nav className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 space-y-2">
                    {bottomMenuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 min-h-[48px] ${isActive
                                    ? "bg-gray-100 dark:bg-gray-800 text-blue-600"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700"
                                    }`}
                            >
                                <Icon className="h-5 w-5 shrink-0" />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </SheetContent>
        </Sheet>
    );
}
