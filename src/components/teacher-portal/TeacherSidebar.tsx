"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
    Menu,
    X,
} from "lucide-react";

interface Route {
    label: string;
    icon: any;
    href: string;
    color?: string;
    badge?: string;
    children?: Route[];
}

// Teacher portal routes - all prefixed with /teacher to use teacher layout
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
        href: "#",
        color: "text-blue-400",
        children: [
            { label: "Courses", icon: Layers, href: "/teacher/lms/courses", color: "text-emerald-300" },
            { label: "Packages", icon: Layers, href: "/teacher/lms/bundles", color: "text-emerald-300" },
            { label: "Membership", icon: CreditCard, href: "/teacher/lms/memberships", color: "text-emerald-300" },
            { label: "Webinars", icon: Video, href: "/teacher/lms/webinars", color: "text-emerald-300" },
            { label: "Digital products", icon: FileText, href: "/teacher/lms/digital-products", color: "text-emerald-300" },
            { label: "Telegram communities", icon: MessageSquare, href: "/teacher/lms/telegram", color: "text-emerald-300" },
        ],
    },
    {
        label: "Manage",
        icon: Wrench,
        href: "#",
        color: "text-orange-400",
        children: [
            { label: "Asset library", icon: Folder, href: "/teacher/manage/assets", color: "text-emerald-300" },
            { label: "Discussions", icon: MessageSquare, href: "/teacher/lms/discussions", color: "text-emerald-300" },
            { label: "Question bank", icon: HelpCircle, href: "/teacher/lms/questions", color: "text-emerald-300" },
            { label: "Quiz reviews", icon: ClipboardCheck, href: "/teacher/lms/quiz-reviews", color: "text-emerald-300" },
            { label: "Assignments", icon: FileEdit, href: "/teacher/lms/assignments", color: "text-emerald-300" },
            { label: "Live tests", icon: Timer, href: "/teacher/lms/live-tests", color: "text-emerald-300" },
            { label: "Live classes", icon: Radio, href: "/teacher/lms/live-classes", color: "text-emerald-300" },
            { label: "Ratings & reviews", icon: Star, href: "/teacher/lms/reviews", color: "text-emerald-300" },
        ],
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
        href: "#",
        color: "text-indigo-400",
        children: [
            { label: "Learners", icon: Users, href: "/teacher/users/learners", color: "text-emerald-300" },
            { label: "Admins", icon: UserCog, href: "/teacher/users/admins", color: "text-emerald-300" },
            { label: "Instructors", icon: UserCheck, href: "/teacher/users/instructors", color: "text-emerald-300" },
            { label: "Affiliates", icon: UserPlus, href: "/teacher/users/affiliates", color: "text-emerald-300" },
            { label: "Enquiries", icon: Mail, href: "/teacher/users/enquiries", color: "text-emerald-300" },
        ],
    },
    {
        label: "Reports",
        icon: BarChart3,
        href: "#",
        color: "text-teal-400",
        children: [
            { label: "Overview", icon: PieChart, href: "/teacher/reports/overview", color: "text-emerald-300" },
            { label: "Transactions", icon: ArrowLeftRight, href: "/teacher/reports/transactions", color: "text-emerald-300" },
            { label: "Settlements", icon: Wallet, href: "/teacher/reports/settlements", color: "text-emerald-300" },
            { label: "Webinars", icon: Video, href: "/teacher/reports/webinars", color: "text-emerald-300" },
            { label: "Traffic", icon: MousePointerClick, href: "/teacher/reports/traffic", color: "text-emerald-300" },
        ],
    },
    {
        label: "Analytics",
        icon: LineChart,
        href: "/teacher/analytics",
        color: "text-purple-400",
        children: [
            { label: "Overview", icon: BarChart3, href: "/teacher/analytics", color: "text-emerald-300" },
            { label: "Comparison", icon: ArrowLeftRight, href: "/teacher/analytics/comparison", color: "text-emerald-300" },
            { label: "Cohorts", icon: Users, href: "/teacher/analytics/cohorts", color: "text-emerald-300" },
            { label: "Executive", icon: LayoutDashboard, href: "/teacher/executive", color: "text-emerald-300" },
            { label: "AI Debug", icon: Cpu, href: "/teacher/ai-debug", color: "text-emerald-300", badge: "NEW" },
        ],
    },
    {
        label: "Website",
        icon: Globe,
        href: "#",
        color: "text-cyan-400",
        children: [
            { label: "Website pages", icon: LayoutTemplate, href: "/teacher/website/pages", color: "text-emerald-300" },
            { label: "Website builder", icon: Palette, href: "/teacher/website/builder", color: "text-emerald-300" },
        ],
    },
    {
        label: "Mobile App",
        icon: Smartphone,
        href: "#",
        color: "text-purple-400",
        children: [
            { label: "App builder", icon: Hammer, href: "/teacher/mobile-app/builder", color: "text-emerald-300" },
            { label: "Configuration", icon: Settings2, href: "/teacher/mobile-app/config", color: "text-emerald-300" },
            { label: "Build history", icon: History, href: "/teacher/mobile-app/history", color: "text-emerald-300" },
        ],
    },
    {
        label: "Marketing",
        icon: Megaphone,
        href: "#",
        color: "text-red-400",
        children: [
            { label: "Campaigns", icon: Target, href: "/teacher/marketing/campaigns", color: "text-emerald-300" },
            { label: "Messenger", icon: MessageCircle, href: "/teacher/marketing/messenger", color: "text-emerald-300" },
            { label: "Blogs", icon: FileText, href: "/teacher/marketing/blogs", color: "text-emerald-300" },
            { label: "Announcements", icon: Bell, href: "/teacher/marketing/announcements", color: "text-emerald-300" },
            { label: "Wallet", icon: Wallet, href: "/teacher/marketing/wallet", color: "text-emerald-300" },
            { label: "Promo codes", icon: Ticket, href: "/teacher/marketing/promo-codes", color: "text-emerald-300" },
            { label: "Referrals", icon: UserPlus, href: "/teacher/marketing/referrals", color: "text-emerald-300" },
            { label: "Affiliates", icon: Handshake, href: "/teacher/marketing/affiliates", color: "text-emerald-300" },
        ],
    },
    {
        label: "AI Social Media",
        icon: Share2,
        href: "#",
        color: "text-blue-400",
        children: [
            { label: "LinkedIn", icon: Linkedin, href: "/teacher/social-media/linkedin", color: "text-emerald-300" },
            { label: "Telegram", icon: Send, href: "/teacher/social-media/telegram", color: "text-emerald-300" },
            { label: "Facebook", icon: Facebook, href: "/teacher/social-media/facebook", color: "text-emerald-300" },
            { label: "Instagram", icon: Instagram, href: "/teacher/social-media/instagram", color: "text-emerald-300" },
            { label: "Youtube", icon: Youtube, href: "/teacher/social-media/youtube", color: "text-emerald-300" },
            { label: "X (Twitter)", icon: Twitter, href: "/teacher/social-media/twitter", color: "text-emerald-300" },
        ],
    },
    {
        label: "Integrations",
        icon: Zap,
        href: "#",
        color: "text-yellow-400",
        children: [
            { label: "Third party", icon: Puzzle, href: "/teacher/integrations/third-party", color: "text-emerald-300" },
            { label: "APIs", icon: Code, href: "/teacher/integrations/apis", color: "text-emerald-300" },
            { label: "Webhooks", icon: Webhook, href: "/teacher/integrations/webhooks", color: "text-emerald-300" },
            { label: "Logs", icon: FileCode, href: "/teacher/integrations/logs", color: "text-emerald-300" },
        ],
    },
    {
        label: "Settings",
        icon: Settings,
        href: "#",
        color: "text-gray-400",
        children: [
            { label: "Domain management", icon: LinkIcon, href: "/teacher/settings/domain", color: "text-emerald-300" },
            { label: "Payments", icon: CreditCard, href: "/teacher/settings/payments", color: "text-emerald-300" },
            { label: "Tax and Invoicing", icon: Receipt, href: "/teacher/settings/tax", color: "text-emerald-300" },
            { label: "Security", icon: Shield, href: "/teacher/settings/security", color: "text-emerald-300" },
            { label: "Communications", icon: Mail, href: "/teacher/settings/communications", color: "text-emerald-300" },
            { label: "Custom fields", icon: ListPlus, href: "/teacher/settings/custom-fields", color: "text-emerald-300" },
            { label: "User experience", icon: Sparkles, href: "/teacher/settings/ux", color: "text-emerald-300" },
            { label: "Signup and login", icon: LogIn, href: "/teacher/settings/auth", color: "text-emerald-300" },
        ],
    },
];

interface TeacherSidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
    onLogout: () => void;
}

// Sidebar Item Component
function SidebarItem({
    route,
    pathname,
    isOpen,
    onToggle,
    isCollapsed,
}: {
    route: Route;
    pathname: string | null;
    isOpen: boolean;
    onToggle: () => void;
    isCollapsed: boolean;
}) {
    const isActive = pathname === route.href || route.children?.some(child => pathname === child.href);
    const hasChildren = route.children && route.children.length > 0;

    if (isCollapsed) {
        return (
            <Link
                href={hasChildren ? route.children![0].href : route.href}
                className={cn(
                    "flex items-center justify-center p-3 rounded-lg transition-all",
                    isActive ? "bg-emerald-600 text-white" : "text-emerald-100 hover:bg-emerald-700/50"
                )}
                title={route.label}
            >
                <route.icon className={cn("h-5 w-5", isActive ? "text-white" : route.color)} />
            </Link>
        );
    }

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

export default function TeacherSidebar({ isCollapsed, onToggle, onLogout }: TeacherSidebarProps) {
    const pathname = usePathname();
    const [openItems, setOpenItems] = useState<string[]>([]);
    const [isHovered, setIsHovered] = useState(false);

    const toggleItem = (label: string) => {
        setOpenItems((prev) =>
            prev.includes(label)
                ? prev.filter((item) => item !== label)
                : [...prev, label]
        );
    };

    const showExpanded = !isCollapsed || isHovered;

    return (
        <aside
            className={cn(
                "bg-gradient-to-b from-emerald-800 to-emerald-900 text-white flex flex-col overflow-hidden transition-all duration-300",
                showExpanded ? "w-72" : "w-20"
            )}
            onMouseEnter={() => isCollapsed && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Header */}
            <div className="p-4 border-b border-emerald-700/50 flex items-center gap-3">
                <button
                    onClick={onToggle}
                    className="p-2 rounded-lg hover:bg-emerald-700/50 transition-colors"
                    title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {isCollapsed ? (
                        <Menu className="h-5 w-5 text-emerald-300" />
                    ) : (
                        <X className="h-5 w-5 text-emerald-300" />
                    )}
                </button>
                {showExpanded && (
                    <Link href="/teacher/dashboard" className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-xl">👨‍🏫</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold">Teacher Portal</h1>
                            <p className="text-emerald-300 text-xs">Content Management</p>
                        </div>
                    </Link>
                )}
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
                            isCollapsed={!showExpanded}
                        />
                    ))}
                </div>
            </nav>

            {/* Footer */}
            {showExpanded && (
                <div className="p-4 border-t border-emerald-700/50">
                    <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-emerald-300 hover:text-white hover:bg-emerald-700/50 rounded-lg transition mb-2"
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        Admin Dashboard
                    </Link>
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 px-4 py-2 w-full text-left text-red-300 hover:text-red-200 hover:bg-red-500/20 rounded-lg transition"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </button>
                </div>
            )}
        </aside>
    );
}
