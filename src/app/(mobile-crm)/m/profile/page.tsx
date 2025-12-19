"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    User,
    MapPin,
    Phone,
    Calendar,
    Clock,
    TrendingUp,
    Target,
    Route,
    LogOut,
    Settings,
    Bell,
    ChevronRight,
    Award,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/auth-context";

// Mock performance data
const performanceData = {
    leadsContacted: 45,
    leadsTarget: 60,
    conversions: 8,
    conversionsTarget: 10,
    meetings: 12,
    meetingsTarget: 15,
    totalDistance: 156,
    avgResponseTime: "12 min",
};

const achievements = [
    { id: 1, label: "First Check-in", icon: MapPin, completed: true },
    { id: 2, label: "10 Leads Contacted", icon: Phone, completed: true },
    { id: 3, label: "First Conversion", icon: Target, completed: true },
    { id: 4, label: "50 Calls Made", icon: Phone, completed: false },
];

const menuItems = [
    { label: "Route History", icon: Route, href: "/m/route-history" },
    { label: "Notifications", icon: Bell, href: "/m/notifications" },
    { label: "Settings", icon: Settings, href: "/m/settings" },
];

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const [currentMonth, setCurrentMonth] = useState("");

    useEffect(() => {
        setCurrentMonth(
            new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })
        );
    }, []);

    const leadsProgress = (performanceData.leadsContacted / performanceData.leadsTarget) * 100;
    const conversionsProgress = (performanceData.conversions / performanceData.conversionsTarget) * 100;
    const meetingsProgress = (performanceData.meetings / performanceData.meetingsTarget) * 100;

    return (
        <div className="p-4 space-y-6 pb-24">
            {/* Profile Header */}
            <Card className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-emerald-500/30">
                <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-2xl shrink-0">
                            {user?.full_name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("") || "U"}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-white">
                                {user?.full_name || "User"}
                            </h2>
                            <p className="text-emerald-300 text-sm">{user?.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                                    Field Agent
                                </Badge>
                                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                                    Active
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Monthly Performance */}
            <Card className="bg-gray-800/50 border-gray-700/50">
                <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm text-gray-300 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-emerald-400" />
                            {currentMonth} Performance
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-4">
                    {/* Leads Progress */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Leads Contacted</span>
                            <span className="text-white font-medium">
                                {performanceData.leadsContacted}/{performanceData.leadsTarget}
                            </span>
                        </div>
                        <Progress value={leadsProgress} className="h-2 bg-gray-700" />
                    </div>

                    {/* Conversions Progress */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Conversions</span>
                            <span className="text-white font-medium">
                                {performanceData.conversions}/{performanceData.conversionsTarget}
                            </span>
                        </div>
                        <Progress value={conversionsProgress} className="h-2 bg-gray-700" />
                    </div>

                    {/* Meetings Progress */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Meetings</span>
                            <span className="text-white font-medium">
                                {performanceData.meetings}/{performanceData.meetingsTarget}
                            </span>
                        </div>
                        <Progress value={meetingsProgress} className="h-2 bg-gray-700" />
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                            <p className="text-2xl font-bold text-white">
                                {performanceData.totalDistance}
                                <span className="text-sm font-normal text-gray-400 ml-1">km</span>
                            </p>
                            <p className="text-xs text-gray-400 mt-1">Distance Traveled</p>
                        </div>
                        <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                            <p className="text-2xl font-bold text-white">
                                {performanceData.avgResponseTime}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">Avg Response Time</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="bg-gray-800/50 border-gray-700/50">
                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm text-gray-300 flex items-center gap-2">
                        <Award className="h-4 w-4 text-amber-400" />
                        Achievements
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <div className="grid grid-cols-2 gap-3">
                        {achievements.map((achievement) => (
                            <div
                                key={achievement.id}
                                className={`flex items-center gap-2 p-3 rounded-lg ${achievement.completed
                                        ? "bg-emerald-500/10 border border-emerald-500/30"
                                        : "bg-gray-700/30 border border-gray-700"
                                    }`}
                            >
                                <achievement.icon
                                    className={`h-5 w-5 ${achievement.completed ? "text-emerald-400" : "text-gray-500"
                                        }`}
                                />
                                <span
                                    className={`text-xs ${achievement.completed ? "text-emerald-300" : "text-gray-500"
                                        }`}
                                >
                                    {achievement.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Menu Items */}
            <Card className="bg-gray-800/50 border-gray-700/50">
                <CardContent className="p-0">
                    {menuItems.map((item, index) => (
                        <Link key={item.label} href={item.href}>
                            <div
                                className={`flex items-center justify-between p-4 hover:bg-gray-700/30 transition-colors ${index !== menuItems.length - 1 ? "border-b border-gray-700/50" : ""
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className="h-5 w-5 text-gray-400" />
                                    <span className="text-white">{item.label}</span>
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-500" />
                            </div>
                        </Link>
                    ))}
                </CardContent>
            </Card>

            {/* Logout Button */}
            <Button
                variant="outline"
                className="w-full h-12 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                onClick={logout}
            >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
            </Button>
        </div>
    );
}
