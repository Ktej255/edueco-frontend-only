"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ChevronRight, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Folder,
    Wrench,
    MessageSquare,
    Users,
    BarChart3,
    Globe,
    Smartphone,
    Megaphone,
    Share2,
    Zap,
    Settings,
    BookOpen,
    GraduationCap,
    FolderOpen,
    LineChart,
} from "lucide-react";

interface Route {
    label: string;
    icon: any;
    href: string;
    color?: string;
    badge?: string;
    children?: Route[];
}

// Simplified routes for mobile
const mobileRoutes: Route[] = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/teacher/dashboard",
        color: "text-emerald-400",
    },
    {
        label: "UPSC Batch 1",
        icon: BookOpen,
        href: "/teacher/batch1",
        color: "text-blue-400",
        badge: "ACTIVE",
    },
    {
        label: "Content Library",
        icon: FolderOpen,
        href: "/teacher/content",
        color: "text-amber-400",
    },
    {
        label: "My Courses",
        icon: GraduationCap,
        href: "/teacher/courses",
        color: "text-purple-400",
    },
    {
        label: "Products",
        icon: Folder,
        href: "/teacher/lms/courses",
        color: "text-blue-400",
    },
    {
        label: "Manage",
        icon: Wrench,
        href: "/teacher/manage/assets",
        color: "text-orange-400",
    },
    {
        label: "Community",
        icon: MessageSquare,
        href: "/teacher/community",
        color: "text-pink-400",
    },
    {
        label: "Users",
        icon: Users,
        href: "/teacher/users/learners",
        color: "text-indigo-400",
    },
    {
        label: "Reports",
        icon: BarChart3,
        href: "/teacher/reports/overview",
        color: "text-teal-400",
    },
    {
        label: "Analytics",
        icon: LineChart,
        href: "/teacher/analytics",
        color: "text-purple-400",
    },
    {
        label: "Website",
        icon: Globe,
        href: "/teacher/website/pages",
        color: "text-cyan-400",
    },
    {
        label: "Mobile App",
        icon: Smartphone,
        href: "/teacher/mobile-app/builder",
        color: "text-purple-400",
    },
    {
        label: "Marketing",
        icon: Megaphone,
        href: "/teacher/marketing/campaigns",
        color: "text-red-400",
    },
    {
        label: "Social Media",
        icon: Share2,
        href: "/teacher/social-media/linkedin",
        color: "text-blue-400",
    },
    {
        label: "Integrations",
        icon: Zap,
        href: "/teacher/integrations/third-party",
        color: "text-yellow-400",
    },
    {
        label: "Settings",
        icon: Settings,
        href: "/teacher/settings",
        color: "text-gray-400",
    },
];

interface TeacherMobileSidebarProps {
    onLogout: () => void;
}

export default function TeacherMobileSidebar({ onLogout }: TeacherMobileSidebarProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="md:hidden p-2 hover:bg-emerald-700/50 rounded-lg transition-colors">
                <Menu className="h-6 w-6 text-emerald-300" />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[300px] bg-gradient-to-b from-emerald-800 to-emerald-900 border-r border-emerald-700/50">
                <SheetHeader className="p-4 border-b border-emerald-700/50">
                    <SheetTitle className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-xl">👨‍🏫</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white">Teacher Portal</h1>
                            <p className="text-emerald-300 text-xs">Content Management</p>
                        </div>
                    </SheetTitle>
                </SheetHeader>

                {/* Navigation - Scrollable */}
                <nav className="flex-1 p-4 overflow-y-auto max-h-[calc(100vh-200px)]">
                    <div className="space-y-1">
                        {mobileRoutes.map((route) => {
                            const isActive = pathname === route.href || pathname?.startsWith(route.href.split('/').slice(0, 3).join('/'));

                            return (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all min-h-[48px]",
                                        isActive
                                            ? "bg-emerald-600 text-white"
                                            : "text-emerald-100 hover:bg-emerald-700/50 active:bg-emerald-600/50"
                                    )}
                                >
                                    <route.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-white" : route.color)} />
                                    <span className="flex-1 font-medium">{route.label}</span>
                                    {route.badge && (
                                        <span className="bg-emerald-400/20 text-emerald-300 text-[10px] font-medium px-1.5 py-0.5 rounded border border-emerald-400/30">
                                            {route.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-emerald-700/50 bg-emerald-900">
                    <Link
                        href="/admin"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-emerald-300 hover:text-white hover:bg-emerald-700/50 rounded-lg transition mb-2 min-h-[48px]"
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        Admin Dashboard
                    </Link>
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            onLogout();
                        }}
                        className="flex items-center gap-2 px-4 py-3 w-full text-left text-red-300 hover:text-red-200 hover:bg-red-500/20 rounded-lg transition min-h-[48px]"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
