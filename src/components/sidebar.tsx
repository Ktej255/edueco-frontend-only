"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  UserCircle,
  Phone,
  Workflow,
  TrendingUp,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import { Cpu } from "lucide-react";

import { useAuth } from "@/contexts/auth-context";

interface Route {
  label: string;
  icon: any;
  href: string;
  color?: string;
  badge?: string;
  children?: Route[];
}

const routes: Route[] = [
  {
    label: "Home",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
    children: [],
  },
  {
    label: "Create Course",
    icon: PlusCircle,
    href: "/lms/courses/create",
    color: "text-white",
    children: [],
  },
  {
    label: "AI Avatars",
    icon: Bot,
    href: "/ai-avatars",
    color: "text-emerald-500",
    badge: "NEW",
    children: [],
  },
  {
    label: "Products",
    icon: Folder,
    href: "/products",
    color: "text-blue-500",
    children: [
      { label: "Courses", icon: Layers, href: "/lms/courses", color: "text-zinc-400" },
      { label: "Packages", icon: Layers, href: "/lms/bundles", color: "text-zinc-400" },
      { label: "Membership", icon: CreditCard, href: "/lms/memberships", color: "text-zinc-400" },
      { label: "Webinars", icon: Video, href: "/lms/webinars", color: "text-zinc-400" },
      { label: "Digital products", icon: FileText, href: "/lms/digital-products", color: "text-zinc-400" },
      { label: "Telegram communities", icon: MessageSquare, href: "/lms/telegram", color: "text-zinc-400" },
    ],
  },
  {
    label: "Manage",
    icon: Wrench,
    href: "/manage",
    color: "text-orange-500",
    children: [
      { label: "Asset library", icon: Folder, href: "/manage/assets", color: "text-zinc-400" },
      { label: "Discussions", icon: MessageSquare, href: "/lms/discussions", color: "text-zinc-400" },
      { label: "Question bank", icon: HelpCircle, href: "/lms/questions", color: "text-zinc-400" },
      { label: "Quiz reviews", icon: ClipboardCheck, href: "/lms/quiz-reviews", color: "text-zinc-400" },
      { label: "Assignments", icon: FileEdit, href: "/lms/assignments", color: "text-zinc-400" },
      { label: "Live tests", icon: Timer, href: "/lms/live-tests", color: "text-zinc-400" },
      { label: "Live classes", icon: Radio, href: "/lms/live-classes", color: "text-zinc-400" },
      { label: "Ratings & reviews", icon: Star, href: "/lms/reviews", color: "text-zinc-400" },
    ],
  },
  {
    label: "Community",
    icon: MessageSquare,
    href: "/community",
    color: "text-pink-500",
    children: [],
  },
  {
    label: "Users",
    icon: Users,
    href: "/users",
    color: "text-indigo-500",
    children: [
      { label: "Learners", icon: Users, href: "/users/learners", color: "text-zinc-400" },
      { label: "Admins", icon: UserCog, href: "/users/admins", color: "text-zinc-400" },
      { label: "Instructors", icon: UserCheck, href: "/users/instructors", color: "text-zinc-400" },
      { label: "Affiliates", icon: UserPlus, href: "/users/affiliates", color: "text-zinc-400" },
      { label: "Enquiries", icon: Mail, href: "/users/enquiries", color: "text-zinc-400" },
    ],
  },
  {
    label: "CRM",
    icon: TrendingUp,
    href: "/crm",
    color: "text-rose-500",
    badge: "NEW",
    children: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/crm", color: "text-zinc-400" },
      { label: "Leads", icon: UserCircle, href: "/crm/leads", color: "text-zinc-400" },
      { label: "Counselors", icon: Phone, href: "/crm/counselors", color: "text-zinc-400" },
      { label: "Automation", icon: Workflow, href: "/crm/automation", color: "text-zinc-400" },
      { label: "Field Agents", icon: MapPin, href: "/crm/field-agents", color: "text-zinc-400" },
      { label: "Mobile CRM", icon: Smartphone, href: "/m", color: "text-zinc-400", badge: "NEW" },
    ],
  },
  {
    label: "Reports",
    icon: BarChart3,
    href: "/reports",
    color: "text-teal-500",
    children: [
      { label: "Overview", icon: PieChart, href: "/reports/overview", color: "text-zinc-400" },
      { label: "Transactions", icon: ArrowLeftRight, href: "/reports/transactions", color: "text-zinc-400" },
      { label: "Settlements", icon: Wallet, href: "/reports/settlements", color: "text-zinc-400" },
      { label: "Webinars", icon: Video, href: "/reports/webinars", color: "text-zinc-400" },
      { label: "Traffic", icon: MousePointerClick, href: "/reports/traffic", color: "text-zinc-400" },
    ],
  },
  {
    label: "Analytics",
    icon: LineChart,
    href: "/analytics",
    color: "text-purple-500",
    children: [
      { label: "Comparison", icon: ArrowLeftRight, href: "/analytics/comparison", color: "text-zinc-400" },
      { label: "Cohorts", icon: Users, href: "/analytics/cohorts", color: "text-zinc-400" },
      { label: "Executive", icon: LayoutDashboard, href: "/admin/executive", color: "text-zinc-400" },
      { label: "AI Debug", icon: Cpu, href: "/admin/ai-debug", color: "text-zinc-400", badge: "NEW" },
    ],
  },
  {
    label: "Website",
    icon: Globe,
    href: "/website",
    color: "text-cyan-500",
    children: [
      { label: "Website pages", icon: LayoutTemplate, href: "/website/pages", color: "text-zinc-400" },
      { label: "Website builder", icon: Palette, href: "/website/builder", color: "text-zinc-400" },
    ],
  },
  {
    label: "Mobile App",
    icon: Smartphone,
    href: "/mobile-app",
    color: "text-purple-500",
    children: [
      { label: "App builder", icon: Hammer, href: "/mobile-app/builder", color: "text-zinc-400" },
      { label: "Configuration", icon: Settings2, href: "/mobile-app/config", color: "text-zinc-400" },
      { label: "Build history", icon: History, href: "/mobile-app/history", color: "text-zinc-400" },
    ],
  },
  {
    label: "Marketing",
    icon: Megaphone,
    href: "/marketing",
    color: "text-red-500",
    children: [
      { label: "Campaigns", icon: Target, href: "/marketing/campaigns", color: "text-zinc-400" },
      { label: "Messenger", icon: MessageCircle, href: "/marketing/messenger", color: "text-zinc-400" },
      { label: "Blogs", icon: FileText, href: "/marketing/blogs", color: "text-zinc-400" },
      { label: "Announcements", icon: Bell, href: "/marketing/announcements", color: "text-zinc-400" },
      { label: "Wallet", icon: Wallet, href: "/marketing/wallet", color: "text-zinc-400" },
      { label: "Promo codes", icon: Ticket, href: "/marketing/promo-codes", color: "text-zinc-400" },
      { label: "Referrals", icon: UserPlus, href: "/marketing/referrals", color: "text-zinc-400" },
      { label: "Affiliates", icon: Handshake, href: "/marketing/affiliates", color: "text-zinc-400" },
    ],
  },
  {
    label: "AI Social Media",
    icon: Share2,
    href: "/social-media",
    color: "text-blue-400",
    children: [
      { label: "LinkedIn", icon: Linkedin, href: "/social-media/linkedin", color: "text-zinc-400" },
      { label: "Telegram", icon: Send, href: "/social-media/telegram", color: "text-zinc-400" },
      { label: "Facebook", icon: Facebook, href: "/social-media/facebook", color: "text-zinc-400" },
      { label: "Instagram", icon: Instagram, href: "/social-media/instagram", color: "text-zinc-400" },
      { label: "Youtube", icon: Youtube, href: "/social-media/youtube", color: "text-zinc-400" },
      { label: "X (Twitter)", icon: Twitter, href: "/social-media/twitter", color: "text-zinc-400" },
    ],
  },
  {
    label: "Integrations",
    icon: Zap,
    href: "/integrations",
    color: "text-yellow-500",
    children: [
      { label: "Third party integrations", icon: Puzzle, href: "/integrations/third-party", color: "text-zinc-400" },
      { label: "APIs", icon: Code, href: "/integrations/apis", color: "text-zinc-400" },
      { label: "Webhooks", icon: Webhook, href: "/integrations/webhooks", color: "text-zinc-400" },
      { label: "Logs", icon: FileCode, href: "/integrations/logs", color: "text-zinc-400" },
    ],
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
    color: "text-gray-500",
    children: [
      { label: "Domain management", icon: LinkIcon, href: "/settings/domain", color: "text-zinc-400" },
      { label: "Payments", icon: CreditCard, href: "/settings/payments", color: "text-zinc-400" },
      { label: "Tax and Invoicing", icon: Receipt, href: "/settings/tax", color: "text-zinc-400" },
      { label: "Security", icon: Shield, href: "/settings/security", color: "text-zinc-400" },
      { label: "Communications", icon: Mail, href: "/settings/communications", color: "text-zinc-400" },
      { label: "Custom fields", icon: ListPlus, href: "/settings/custom-fields", color: "text-zinc-400" },
      { label: "User experience", icon: Sparkles, href: "/settings/ux", color: "text-zinc-400" },
      { label: "Signup and login", icon: LogIn, href: "/settings/auth", color: "text-zinc-400" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (label: string) => {
    setOpenItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const filteredRoutes = routes.filter((route) => {
    if (user?.role === "student") {
      // Allow access to dashboard and specific student routes
      // Also check if any children match accessible paths
      if (route.href === "/dashboard") return true;
      if (route.href === "/community") return true;

      // Check children for student access (e.g., Courses in Products)
      if (route.label === "Products") return true; // Allow viewing products menu

      return false;
    }
    return true;
  });

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white border-r border-gray-800">
      <div className="px-3 py-2 flex-1 overflow-y-auto scrollbar-hide">
        <div className="flex items-center justify-center mb-10 mt-2">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wider">
              DashCode
            </h1>
          </Link>
        </div>

        <div className="space-y-1">
          {filteredRoutes.map((route) => (
            <SidebarItem
              key={route.href}
              route={route}
              pathname={pathname}
              isOpen={openItems.includes(route.label)}
              onToggle={() => toggleItem(route.label)}
            />
          ))}
        </div>
      </div>
      <div className="px-3 py-2">
        <button
          onClick={logout}
          className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition text-zinc-400"
        >
          <div className="flex items-center flex-1">
            <LogOut className="h-5 w-5 mr-3 text-red-500" />
            Logout
          </div>
        </button>
      </div>
    </div>
  );
}

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
  // Active state logic:
  // 1. Exact match on href
  // 2. Child match
  const isActive = pathname === route.href || route.children?.some(child => pathname === child.href);
  const hasChildren = route.children && route.children.length > 0;

  return (
    <div className="flex flex-col mb-1">
      <div
        className={cn(
          "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
          isActive && !hasChildren ? "text-white bg-blue-600 hover:bg-blue-700" : "text-zinc-400",
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
            <span className="ml-auto bg-emerald-500/10 text-emerald-500 text-[10px] font-medium px-1.5 py-0.5 rounded border border-emerald-500/20">
              {route.badge}
            </span>
          )}
        </Link>

        {hasChildren && (
          <div
            role="button"
            className="ml-auto p-1 hover:bg-white/20 rounded"
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
        <div className="ml-4 mt-1 space-y-1 border-l border-gray-700 pl-3">
          {route.children?.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className={cn(
                "text-sm group flex p-2 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === child.href
                  ? "text-white bg-blue-600/20"
                  : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                {/* Optional: Show child icons if needed, currently commented out to match typical clean look, or uncomment to show */}
                {/* <child.icon className={cn("h-4 w-4 mr-3", child.color)} /> */}
                {child.label}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
