"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BookOpen,
    PenTool,
    Brain,
    CheckSquare,
    LayoutDashboard,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

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

interface StudentSidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

export default function StudentSidebar({ isCollapsed, onToggle }: StudentSidebarProps) {
    const pathname = usePathname();

    return (
        <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 overflow-y-auto transition-all duration-300 z-40 ${isCollapsed ? "w-20" : "w-64"
            }`}>
            {/* Toggle Button */}
            <button
                onClick={onToggle}
                className="absolute -right-3 top-4 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:bg-gray-50 transition-colors z-50"
            >
                {isCollapsed ? (
                    <ChevronRight className="h-4 w-4 text-gray-600" />
                ) : (
                    <ChevronLeft className="h-4 w-4 text-gray-600" />
                )}
            </button>
            <nav className="p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors overflow-hidden ${isActive
                                ? "bg-blue-600 text-white"
                                : "text-gray-700 hover:bg-gray-100"
                                } ${isCollapsed ? "justify-center px-2" : ""}`}
                            title={isCollapsed ? item.name : ""}
                        >
                            <Icon className="h-5 w-5 shrink-0" />
                            {!isCollapsed && <span className="font-medium whitespace-nowrap">{item.name}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Progress Section */}
            {!isCollapsed && (
                <div className="p-4 mt-6 border-t border-gray-200">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                        <h3 className="font-semibold text-sm text-gray-900 mb-2">
                            Your Progress
                        </h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-600">Overall</span>
                                <span className="font-medium text-gray-900">67%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                                    style={{ width: "67%" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
}
