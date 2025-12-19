"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  TrendingUp,
  Shield,
  Activity,
  Mail,
  FileCode,
  BookOpen,
  BarChart3,
  Brain,
} from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Drill Questions", href: "/admin/drill/questions", icon: BookOpen },
    { name: "Drill Analytics", href: "/admin/drill/analytics", icon: BarChart3 },
    { name: "AI Insights", href: "/admin/drill/insights", icon: Brain },
    { name: "Submissions", href: "/admin/submissions", icon: FileText },
    { name: "Analytics", href: "/admin/analytics", icon: TrendingUp },
    { name: "Email Templates", href: "/admin/email-templates", icon: FileCode },
    { name: "Email Logs", href: "/admin/email-logs", icon: Mail },
    { name: "Logs", href: "/admin/logs", icon: Activity },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      {/* Sidebar */}
      <div className="w-64 bg-black/40 backdrop-blur-xl border-r border-purple-500/20">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <Shield className="h-8 w-8 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          </div>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${isActive
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:bg-purple-900/30 hover:text-white"
                    }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
