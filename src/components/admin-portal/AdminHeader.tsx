"use client";

import { Bell, User, Shield } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import LiveDateTime from "@/components/LiveDateTime";
import AdminMobileSidebar from "@/components/admin-portal/AdminMobileSidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminHeader() {
    const { user, logout } = useAuth();

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-b border-border z-50 transition-colors">
            <div className="flex items-center justify-between h-full px-3 sm:px-4 md:px-6">
                {/* Left Section: Mobile Menu + Logo */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Mobile Sidebar Toggle */}
                    <AdminMobileSidebar />

                    {/* Logo */}
                    <div className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Eduecosystem
                    </div>
                    <span className="hidden sm:inline-flex text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 px-2 py-1 rounded-full font-medium items-center gap-1">
                        <Shield className="h-3 w-3" />
                        Admin
                    </span>
                </div>

                {/* Center: Live Date/Time - Hidden on mobile and tablet */}
                <div className="hidden lg:flex">
                    <LiveDateTime className="text-gray-700 dark:text-gray-200" />
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                    <ThemeToggle />

                    {/* Notifications */}
                    <Button variant="ghost" size="icon" className="relative h-9 w-9 sm:h-10 sm:w-10">
                        <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    </Button>

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-2 px-2 sm:px-3">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-600 rounded-full flex items-center justify-center shrink-0">
                                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                </div>
                                <span className="hidden md:inline font-medium text-foreground">{user?.full_name || "Admin"}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => (window.location.href = "/admin/settings")}>
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => (window.location.href = "/student/dashboard")}>
                                View as Student
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => (window.location.href = "/teacher/dashboard")}>
                                View as Teacher
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={logout} className="text-red-600">
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}

