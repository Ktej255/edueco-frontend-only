"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronDown, ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    BarChart3,
    Brain,
    FileText,
    Settings,
    TrendingUp,
    Activity,
    Mail,
    FileCode,
    Shield,
    GraduationCap,
    Zap,
} from "lucide-react";

const menuItems = [
    {
        name: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        name: "Drill Management",
        icon: BookOpen,
        children: [
            { name: "Questions", href: "/admin/drill/questions", icon: FileText },
            { name: "Analytics", href: "/admin/drill/analytics", icon: BarChart3 },
            { name: "AI Insights", href: "/admin/drill/insights", icon: Brain },
        ],
    },
    {
        name: "CRM & Users",
        icon: Users,
        children: [
            { name: "Users", href: "/admin/users", icon: Users },
            { name: "Leads", href: "/admin/leads", icon: TrendingUp },
            { name: "Marketing", href: "/admin/marketing-automation", icon: Zap },
            { name: "User Management", href: "/admin/user-management", icon: Shield },
        ],
    },
    {
        name: "Content",
        icon: FileText,
        children: [
            { name: "Submissions", href: "/admin/submissions", icon: FileText },
            { name: "Courses", href: "/admin/courses", icon: GraduationCap },
            { name: "Categories", href: "/admin/categories", icon: BookOpen },
        ],
    },
    {
        name: "Analytics",
        href: "/admin/analytics",
        icon: TrendingUp,
    },
    {
        name: "Communications",
        icon: Mail,
        children: [
            { name: "Email Templates", href: "/admin/email-templates", icon: FileCode },
            { name: "Email Logs", href: "/admin/email-logs", icon: Mail },
        ],
    },
    {
        name: "Logs",
        href: "/admin/logs",
        icon: Activity,
    },
    {
        name: "Settings",
        href: "/admin/settings",
        icon: Settings,
    },
];

export default function AdminMobileSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    const toggleExpanded = (name: string) => {
        setExpandedItems((prev) =>
            prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
        );
    };

    const isActive = (href: string) => pathname === href;
    const isGroupActive = (children: { href: string }[]) =>
        children?.some((child) => pathname === child.href);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[300px] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
                <SheetHeader className="p-4 border-b border-gray-200 dark:border-gray-800">
                    <SheetTitle className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Shield className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Admin Portal</h1>
                            <p className="text-gray-500 dark:text-gray-400 text-xs">System Management</p>
                        </div>
                    </SheetTitle>
                </SheetHeader>

                {/* Navigation */}
                <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const hasChildren = item.children && item.children.length > 0;
                        const isExpanded = expandedItems.includes(item.name);
                        const groupActive = hasChildren && isGroupActive(item.children!);
                        const itemActive = item.href && isActive(item.href);

                        if (hasChildren) {
                            return (
                                <div key={item.name}>
                                    <button
                                        onClick={() => toggleExpanded(item.name)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 min-h-[48px] ${groupActive
                                            ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200"
                                            }`}
                                    >
                                        <Icon className="h-5 w-5 shrink-0" />
                                        <span className="font-medium flex-1 text-left whitespace-nowrap">
                                            {item.name}
                                        </span>
                                        {isExpanded ? (
                                            <ChevronDown className="h-4 w-4" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4" />
                                        )}
                                    </button>
                                    {isExpanded && (
                                        <div className="ml-4 mt-1 space-y-1">
                                            {item.children!.map((child) => {
                                                const ChildIcon = child.icon;
                                                return (
                                                    <Link
                                                        key={child.href}
                                                        href={child.href}
                                                        onClick={() => setIsOpen(false)}
                                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 min-h-[48px] ${isActive(child.href)
                                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                                                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200"
                                                            }`}
                                                    >
                                                        <ChildIcon className="h-4 w-4 shrink-0" />
                                                        <span className="text-sm whitespace-nowrap">{child.name}</span>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={item.name}
                                href={item.href!}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 min-h-[48px] ${itemActive
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200"
                                    }`}
                            >
                                <Icon className="h-5 w-5 shrink-0" />
                                <span className="font-medium whitespace-nowrap">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Quick Access */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-4">
                        <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-2">
                            Quick Access
                        </h3>
                        <div className="space-y-2 text-sm">
                            <Link
                                href="/teacher/dashboard"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline py-2 min-h-[44px]"
                            >
                                <GraduationCap className="h-4 w-4" />
                                Teacher Portal
                            </Link>
                            <Link
                                href="/student/dashboard"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline py-2 min-h-[44px]"
                            >
                                <Users className="h-4 w-4" />
                                Student Portal
                            </Link>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
