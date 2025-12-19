"use client";

import { useState, useEffect } from "react";
import { Bell, User, Flame } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import LiveDateTime from "@/components/LiveDateTime";
import { getStudentStats } from "@/services/progressStorage";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function StudentHeader() {
    const { user, logout } = useAuth();
    const [streak, setStreak] = useState(0);

    // Load streak from persistent storage
    useEffect(() => {
        const stats = getStudentStats();
        setStreak(stats.overallStreak);

        // Listen for storage updates
        const handleStorageChange = () => {
            const updatedStats = getStudentStats();
            setStreak(updatedStats.overallStreak);
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-b border-border z-50 transition-colors">
            <div className="flex items-center justify-between h-full px-6">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Eduecosystem
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                        Student
                    </span>
                </div>

                {/* Center: Live Date/Time */}
                <div className="hidden md:flex">
                    <LiveDateTime className="text-gray-700 dark:text-gray-200" />
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    <ThemeToggle />

                    {/* Streak */}
                    <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded-lg">
                        <Flame className="h-5 w-5 text-orange-500" />
                        <span className="font-bold text-orange-700 dark:text-orange-400">{streak}</span>
                        <span className="text-xs text-orange-600 dark:text-orange-300">day streak!</span>
                    </div>

                    {/* Notifications */}
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    </Button>

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                    <User className="h-5 w-5 text-white" />
                                </div>
                                <span className="font-medium text-foreground">{user?.full_name || "Student"}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => (window.location.href = "/settings")}>
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => (window.location.href = "/profile")}>
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}

