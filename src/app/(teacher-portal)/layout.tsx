"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    PlusCircle,
    Bot,
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
    ChevronDown,
    ChevronRight,
    LogOut,
    FileText,
    Video,
    CreditCard,
    Layers,
    HelpCircle,
    ClipboardCheck,
    FileEdit,
    Timer,
    Radio,
    Star,
    UserCog,
    UserCheck,
    UserPlus,
    Mail,
    PieChart,
    ArrowLeftRight,
    Wallet,
    MousePointerClick,
    LayoutTemplate,
    Palette,
    Hammer,
    Settings2,
    History,
    Target,
    MessageCircle,
    Bell,
    Ticket,
    Handshake,
    Linkedin,
    Send,
    Facebook,
    Instagram,
    Youtube,
    Twitter,
    Puzzle,
    Code,
    Webhook,
    FileCode,
    Link as LinkIcon,
    Receipt,
    Shield,
    ListPlus,
    Sparkles,
    LogIn,
    LineChart,
    Cpu,
    BookOpen,
    GraduationCap,
    FolderOpen,
} from "lucide-react";

interface Route {
    label: string;
    icon: any;
    href: string;
    color?: string;
    badge?: string;
    children?: Route[];
}

// Full navigation routes adapted for teacher portal
const teacherRoutes: Route[] = [
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
        href: "/products",
        color: "text-blue-400",
        children: [
            { label: "Courses", icon: Layers, href: "/lms/courses", color: "text-emerald-300" },
            { label: "Packages", icon: Layers, href: "/lms/bundles", color: "text-emerald-300" },
            { label: "Membership", icon: CreditCard, href: "/lms/memberships", color: "text-emerald-300" },
            { label: "Webinars", icon: Video, href: "/lms/webinars", color: "text-emerald-300" },
            { label: "Digital products", icon: FileText, href: "/lms/digital-products", color: "text-emerald-300" },
            { label: "Telegram communities", icon: MessageSquare, href: "/lms/telegram", color: "text-emerald-300" },
        ],
    },
    {
        label: "Manage",
        icon: Wrench,
        href: "/manage",
        color: "text-orange-400",
        children: [
            { label: "Asset library", icon: Folder, href: "/manage/assets", color: "text-emerald-300" },
            { label: "Discussions", icon: MessageSquare, href: "/lms/discussions", color: "text-emerald-300" },
            { label: "Question bank", icon: HelpCircle, href: "/lms/questions", color: "text-emerald-300" },
            { label: "Quiz reviews", icon: ClipboardCheck, href: "/lms/quiz-reviews", color: "text-emerald-300" },
            { label: "Assignments", icon: FileEdit, href: "/lms/assignments", color: "text-emerald-300" },
            { label: "Live tests", icon: Timer, href: "/lms/live-tests", color: "text-emerald-300" },
            { label: "Live classes", icon: Radio, href: "/lms/live-classes", color: "text-emerald-300" },
            { label: "Ratings & reviews", icon: Star, href: "/lms/reviews", color: "text-emerald-300" },
        ],
    },
    {
        label: "Community",
        icon: MessageSquare,
        href: "/community",
        color: "text-pink-400",
    },
    {
        label: "Users",
        icon: Users,
        href: "/users",
        color: "text-indigo-400",
        children: [
            { label: "Learners", icon: Users, href: "/users/learners", color: "text-emerald-300" },
            { label: "Admins", icon: UserCog, href: "/users/admins", color: "text-emerald-300" },
            { label: "Instructors", icon: UserCheck, href: "/users/instructors", color: "text-emerald-300" },
            { label: "Affiliates", icon: UserPlus, href: "/users/affiliates", color: "text-emerald-300" },
            { label: "Enquiries", icon: Mail, href: "/users/enquiries", color: "text-emerald-300" },
        ],
    },
    {
        label: "Reports",
        icon: BarChart3,
        href: "/reports",
        color: "text-teal-400",
        children: [
            { label: "Overview", icon: PieChart, href: "/reports/overview", color: "text-emerald-300" },
            { label: "Transactions", icon: ArrowLeftRight, href: "/reports/transactions", color: "text-emerald-300" },
            { label: "Settlements", icon: Wallet, href: "/reports/settlements", color: "text-emerald-300" },
            { label: "Webinars", icon: Video, href: "/reports/webinars", color: "text-emerald-300" },
            { label: "Traffic", icon: MousePointerClick, href: "/reports/traffic", color: "text-emerald-300" },
        ],
    },
    {
        label: "Analytics",
        icon: LineChart,
        href: "/teacher/analytics",
        color: "text-purple-400",
        children: [
            { label: "Overview", icon: BarChart3, href: "/teacher/analytics", color: "text-emerald-300" },
            { label: "Comparison", icon: ArrowLeftRight, href: "/analytics/comparison", color: "text-emerald-300" },
            { label: "Cohorts", icon: Users, href: "/analytics/cohorts", color: "text-emerald-300" },
            { label: "Executive", icon: LayoutDashboard, href: "/admin/executive", color: "text-emerald-300" },
            { label: "AI Debug", icon: Cpu, href: "/admin/ai-debug", color: "text-emerald-300", badge: "NEW" },
        ],
    },
    {
        label: "Website",
        icon: Globe,
        href: "/website",
        color: "text-cyan-400",
        children: [
            { label: "Website pages", icon: LayoutTemplate, href: "/website/pages", color: "text-emerald-300" },
            { label: "Website builder", icon: Palette, href: "/website/builder", color: "text-emerald-300" },
        ],
    },
    {
        label: "Mobile App",
        icon: Smartphone,
        href: "/mobile-app",
        color: "text-purple-400",
        children: [
            { label: "App builder", icon: Hammer, href: "/mobile-app/builder", color: "text-emerald-300" },
            { label: "Configuration", icon: Settings2, href: "/mobile-app/config", color: "text-emerald-300" },
            { label: "Build history", icon: History, href: "/mobile-app/history", color: "text-emerald-300" },
        ],
    },
    {
        label: "Marketing",
        icon: Megaphone,
        href: "/marketing",
        color: "text-red-400",
        children: [
            { label: "Campaigns", icon: Target, href: "/marketing/campaigns", color: "text-emerald-300" },
            { label: "Messenger", icon: MessageCircle, href: "/marketing/messenger", color: "text-emerald-300" },
            { label: "Blogs", icon: FileText, href: "/marketing/blogs", color: "text-emerald-300" },
            { label: "Announcements", icon: Bell, href: "/marketing/announcements", color: "text-emerald-300" },
            { label: "Wallet", icon: Wallet, href: "/marketing/wallet", color: "text-emerald-300" },
            { label: "Promo codes", icon: Ticket, href: "/marketing/promo-codes", color: "text-emerald-300" },
            { label: "Referrals", icon: UserPlus, href: "/marketing/referrals", color: "text-emerald-300" },
            { label: "Affiliates", icon: Handshake, href: "/marketing/affiliates", color: "text-emerald-300" },
        ],
    },
    {
        label: "AI Social Media",
        icon: Share2,
        href: "/social-media",
        color: "text-blue-400",
        children: [
            { label: "LinkedIn", icon: Linkedin, href: "/social-media/linkedin", color: "text-emerald-300" },
            { label: "Telegram", icon: Send, href: "/social-media/telegram", color: "text-emerald-300" },
            { label: "Facebook", icon: Facebook, href: "/social-media/facebook", color: "text-emerald-300" },
            { label: "Instagram", icon: Instagram, href: "/social-media/instagram", color: "text-emerald-300" },
            { label: "Youtube", icon: Youtube, href: "/social-media/youtube", color: "text-emerald-300" },
            { label: "X (Twitter)", icon: Twitter, href: "/social-media/twitter", color: "text-emerald-300" },
        ],
    },
    {
        label: "Integrations",
        icon: Zap,
        href: "/integrations",
        color: "text-yellow-400",
        children: [
            { label: "Third party", icon: Puzzle, href: "/integrations/third-party", color: "text-emerald-300" },
            { label: "APIs", icon: Code, href: "/integrations/apis", color: "text-emerald-300" },
            { label: "Webhooks", icon: Webhook, href: "/integrations/webhooks", color: "text-emerald-300" },
            { label: "Logs", icon: FileCode, href: "/integrations/logs", color: "text-emerald-300" },
        ],
    },
    {
        label: "Settings",
        icon: Settings,
        href: "/settings",
        color: "text-gray-400",
        children: [
            { label: "Domain management", icon: LinkIcon, href: "/settings/domain", color: "text-emerald-300" },
            { label: "Payments", icon: CreditCard, href: "/settings/payments", color: "text-emerald-300" },
            { label: "Tax and Invoicing", icon: Receipt, href: "/settings/tax", color: "text-emerald-300" },
            { label: "Security", icon: Shield, href: "/settings/security", color: "text-emerald-300" },
            { label: "Communications", icon: Mail, href: "/settings/communications", color: "text-emerald-300" },
            { label: "Custom fields", icon: ListPlus, href: "/settings/custom-fields", color: "text-emerald-300" },
            { label: "User experience", icon: Sparkles, href: "/settings/ux", color: "text-emerald-300" },
            { label: "Signup and login", icon: LogIn, href: "/settings/auth", color: "text-emerald-300" },
        ],
    },
];

// Sidebar Item Component
function SidebarItem({
    route,
    pathname,
    isOpen,
    onToggle,
}: {
    route: Route;
    pathname: string | null;
    isOpen: boolean;
    onToggle: () => void;
}) {
    const isActive = pathname === route.href || route.children?.some(child => pathname === child.href);
    const hasChildren = route.children && route.children.length > 0;

    return (
        <div className="flex flex-col mb-1">
            <div
                className={cn(
                    "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-emerald-700/50 rounded-lg transition",
                    isActive && !hasChildren ? "text-white bg-emerald-600" : "text-emerald-100",
                    isActive && hasChildren ? "text-white" : ""
                )}
                onClick={() => {
                    if (hasChildren) {
                        onToggle();
                    }
                }}
            >
                <Link
                    href={hasChildren ? "#" : route.href}
                    className="flex items-center flex-1"
                    onClick={(e) => {
                        if (hasChildren) {
                            e.preventDefault();
                            onToggle();
                        }
                    }}
                >
                    <route.icon className={cn("h-5 w-5 mr-3", isActive ? "text-white" : route.color)} />
                    <span className="flex-1">{route.label}</span>
                    {route.badge && (
                        <span className="ml-auto bg-emerald-400/20 text-emerald-300 text-[10px] font-medium px-1.5 py-0.5 rounded border border-emerald-400/30">
                            {route.badge}
                        </span>
                    )}
                </Link>

                {hasChildren && (
                    <div
                        role="button"
                        className="ml-auto p-1 hover:bg-emerald-600/50 rounded"
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggle();
                        }}
                    >
                        {isOpen ? (
                            <ChevronDown className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )}
                    </div>
                )}
            </div>

            {isOpen && hasChildren && (
                <div className="ml-4 mt-1 space-y-1 border-l border-emerald-600/50 pl-3">
                    {route.children?.map((child) => (
                        <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                                "text-sm group flex p-2 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-emerald-700/50 rounded-lg transition",
                                pathname === child.href
                                    ? "text-white bg-emerald-600/30"
                                    : "text-emerald-200"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <child.icon className={cn("h-4 w-4 mr-2", child.color)} />
                                {child.label}
                                {child.badge && (
                                    <span className="ml-auto bg-emerald-400/20 text-emerald-300 text-[10px] font-medium px-1.5 py-0.5 rounded">
                                        {child.badge}
                                    </span>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function TeacherLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [openItems, setOpenItems] = useState<string[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }
        setIsAuthenticated(true);
        setLoading(false);
    }, [router]);

    const toggleItem = (label: string) => {
        setOpenItems((prev) =>
            prev.includes(label)
                ? prev.filter((item) => item !== label)
                : [...prev, label]
        );
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-72 bg-gradient-to-b from-emerald-800 to-emerald-900 text-white flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-emerald-700/50">
                    <Link href="/teacher/dashboard" className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-xl">👨‍🏫</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">Teacher Portal</h1>
                            <p className="text-emerald-300 text-xs">Content Management</p>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-600 scrollbar-track-transparent">
                    <div className="space-y-1">
                        {teacherRoutes.map((route) => (
                            <SidebarItem
                                key={route.href + route.label}
                                route={route}
                                pathname={pathname}
                                isOpen={openItems.includes(route.label)}
                                onToggle={() => toggleItem(route.label)}
                            />
                        ))}
                    </div>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-emerald-700/50">
                    <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-emerald-300 hover:text-white hover:bg-emerald-700/50 rounded-lg transition mb-2"
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        Admin Dashboard
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 w-full text-left text-red-300 hover:text-red-200 hover:bg-red-500/20 rounded-lg transition"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}
