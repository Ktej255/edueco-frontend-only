"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BookOpen,
    PenTool,
    Brain,
    CheckSquare,
    LayoutDashboard,
    Menu,
    X,
    Settings,
    User,
    Shield,
} from "lucide-react";
import { getStudentStats, StudentStats } from "@/services/progressStorage";
import { useAuth } from "@/contexts/auth-context";

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

const batchItems = [
    {
        name: "Batch 1",
        href: "/student/planner", // Or dashboard? User specifically said batch options should be there
        icon: BookOpen,
    },
    {
        name: "Batch 2",
        href: "/student/batch2",
        icon: Layers,
    }
];

import { Layers } from "lucide-react";

interface StudentSidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

export default function StudentSidebar({ isCollapsed, onToggle }: StudentSidebarProps) {
    const pathname = usePathname();
    const { user } = useAuth();
    const isMasterId = user?.email === "ktej255@gmail.com";
    const [stats, setStats] = useState<StudentStats | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Calculate overall progress percentage
    const calculateProgress = useCallback((studentStats: StudentStats): number => {
        if (!studentStats) return 0;

        // Calculate based on meditation and graphotherapy progress (60 days each)
        const meditationProgress = ((studentStats.meditation.currentLevel - 1) * 60 + studentStats.meditation.currentDay) / 120 * 100;
        const graphoProgress = ((studentStats.graphotherapy.currentLevel - 1) * 60 + studentStats.graphotherapy.currentDay) / 120 * 100;
        const prelimsProgress = studentStats.prelims.totalSegmentsCompleted * 2; // Rough estimate

        // Weight the different activities
        const overall = Math.min(100, Math.round((meditationProgress + graphoProgress + prelimsProgress) / 3));
        return overall;
    }, []);

    // Load stats
    const loadStats = useCallback(() => {
        const studentStats = getStudentStats();
        setStats(studentStats);
    }, []);

    // Initial load
    useEffect(() => {
        loadStats();
    }, [loadStats]);

    // Listen for storage changes (real-time updates)
    useEffect(() => {
        const handleStorageChange = () => {
            loadStats();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('focus', handleStorageChange);

        // Refresh every 30 seconds
        const interval = setInterval(loadStats, 30000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('focus', handleStorageChange);
            clearInterval(interval);
        };
    }, [loadStats]);

    const progressPercent = stats ? calculateProgress(stats) : 0;
    const showExpanded = !isCollapsed || isHovered;

    return (
        <aside
            className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-y-auto transition-all duration-300 ease-in-out z-40 ${showExpanded ? "w-64" : "w-20"
                }`}
            onMouseEnter={() => isCollapsed && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Toggle Button - Hamburger Style */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <button
                    onClick={onToggle}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full flex items-center justify-center"
                    title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {isCollapsed ? (
                        <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    ) : (
                        <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    )}
                </button>
            </div>

            {/* Main Navigation */}
            <nav className="p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 overflow-hidden ${isActive
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                } ${!showExpanded ? "justify-center px-2" : ""}`}
                            title={!showExpanded ? item.name : ""}
                        >
                            <Icon className="h-5 w-5 shrink-0" />
                            <span className={`font-medium whitespace-nowrap transition-opacity duration-200 ${showExpanded ? "opacity-100" : "opacity-0 w-0"
                                }`}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}

                {/* Batch Items for Master ID */}
                {isMasterId && (
                    <>
                        <div className={`mt-4 mb-2 px-4 transition-opacity duration-200 ${showExpanded ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}`}>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Batches</p>
                        </div>
                        {batchItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 overflow-hidden ${isActive
                                        ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-900/10"
                                        } ${!showExpanded ? "justify-center px-2" : ""}`}
                                    title={!showExpanded ? item.name : ""}
                                >
                                    <Icon className="h-5 w-5 shrink-0" />
                                    <span className={`font-medium whitespace-nowrap transition-opacity duration-200 ${showExpanded ? "opacity-100" : "opacity-0 w-0"
                                        }`}>
                                        {item.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </>
                )}
            </nav>

            {/* Progress Section */}
            <div className={`p-4 mt-4 border-t border-gray-200 dark:border-gray-800 transition-opacity duration-200 ${showExpanded ? "opacity-100" : "opacity-0 h-0 overflow-hidden p-0"
                }`}>
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

            {/* Admin Portal Switcher - Only for Master ID */}
            {isMasterId && (
                <div className={`p-4 border-t border-gray-200 dark:border-gray-800 transition-opacity duration-200 ${showExpanded ? "opacity-100" : "opacity-0 h-0 overflow-hidden p-0"}`}>
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg"
                    >
                        <Shield className="h-5 w-5" />
                        <span className="font-medium">Admin Portal</span>
                    </Link>
                </div>
            )}

            {/* Bottom Menu Items */}
            <nav className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 space-y-2">
                {bottomMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 overflow-hidden ${isActive
                                ? "bg-gray-100 dark:bg-gray-800 text-blue-600"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                } ${!showExpanded ? "justify-center px-2" : ""}`}
                            title={!showExpanded ? item.name : ""}
                        >
                            <Icon className="h-5 w-5 shrink-0" />
                            <span className={`font-medium whitespace-nowrap transition-opacity duration-200 ${showExpanded ? "opacity-100" : "opacity-0 w-0"
                                }`}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}

