"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    MapPin,
    Phone,
    Users,
    ClipboardCheck,
    TrendingUp,
    Clock,
    ChevronRight,
    Zap,
    Target,
    Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";

// Quick action buttons
const quickActions = [
    {
        label: "Check In",
        icon: MapPin,
        href: "/m/check-in",
        color: "from-emerald-500 to-teal-600",
    },
    {
        label: "New Lead",
        icon: Users,
        href: "/m/leads/new",
        color: "from-blue-500 to-indigo-600",
    },
    {
        label: "Quick Call",
        icon: Phone,
        href: "/m/leads?action=call",
        color: "from-purple-500 to-pink-600",
    },
    {
        label: "Log Activity",
        icon: ClipboardCheck,
        href: "/m/activities/new",
        color: "from-amber-500 to-orange-600",
    },
];

// Mock stats data
const todayStats = [
    {
        label: "Leads Contacted",
        value: "12",
        change: "+3",
        icon: Phone,
        color: "text-emerald-400",
    },
    {
        label: "Meetings",
        value: "4",
        change: "+1",
        icon: Calendar,
        color: "text-blue-400",
    },
    {
        label: "Conversions",
        value: "2",
        change: "+2",
        icon: Target,
        color: "text-purple-400",
    },
    {
        label: "Distance",
        value: "15km",
        change: "",
        icon: MapPin,
        color: "text-amber-400",
    },
];

// Mock upcoming tasks
const upcomingTasks = [
    {
        id: "1",
        type: "follow-up",
        title: "Follow up with Priya Sharma",
        time: "10:30 AM",
        priority: "high",
    },
    {
        id: "2",
        type: "meeting",
        title: "Campus visit - Delhi University",
        time: "2:00 PM",
        priority: "medium",
    },
    {
        id: "3",
        type: "call",
        title: "Call Rahul about admission",
        time: "4:30 PM",
        priority: "low",
    },
];

// Mock recent leads
const recentLeads = [
    {
        id: "1",
        name: "Priya Sharma",
        course: "MBA Program",
        status: "Hot",
        lastContact: "2 hours ago",
    },
    {
        id: "2",
        name: "Rahul Verma",
        course: "Data Science",
        status: "Warm",
        lastContact: "Yesterday",
    },
    {
        id: "3",
        name: "Ananya Patel",
        course: "BBA Program",
        status: "New",
        lastContact: "Just now",
    },
];

function getPriorityColor(priority: string) {
    switch (priority) {
        case "high":
            return "bg-red-500/20 text-red-400 border-red-500/30";
        case "medium":
            return "bg-amber-500/20 text-amber-400 border-amber-500/30";
        default:
            return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
}

function getStatusColor(status: string) {
    switch (status) {
        case "Hot":
            return "bg-red-500/20 text-red-400";
        case "Warm":
            return "bg-amber-500/20 text-amber-400";
        case "New":
            return "bg-emerald-500/20 text-emerald-400";
        default:
            return "bg-gray-500/20 text-gray-400";
    }
}

export default function MobileDashboardPage() {
    const { user } = useAuth();
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [currentTime, setCurrentTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(
                now.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                })
            );
        };
        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-4 space-y-6">
            {/* Greeting Section */}
            <div className="space-y-1">
                <h2 className="text-2xl font-bold text-white">
                    Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 17 ? "Afternoon" : "Evening"}, {user?.full_name?.split(" ")[0] || "Agent"}!
                </h2>
                <p className="text-gray-400 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {currentTime} • {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                </p>
            </div>

            {/* Check-in Status Banner */}
            {!isCheckedIn && (
                <Link href="/m/check-in">
                    <Card className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-500/30 hover:border-emerald-400/50 transition-colors">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/20 rounded-lg">
                                    <MapPin className="h-5 w-5 text-emerald-400" />
                                </div>
                                <div>
                                    <p className="font-medium text-white">Start your day</p>
                                    <p className="text-sm text-emerald-300">Tap to check in</p>
                                </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-emerald-400" />
                        </CardContent>
                    </Card>
                </Link>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-3">
                {quickActions.map((action) => (
                    <Link key={action.label} href={action.href}>
                        <div className="flex flex-col items-center gap-2">
                            <div
                                className={`p-3 rounded-xl bg-gradient-to-br ${action.color} shadow-lg`}
                            >
                                <action.icon className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xs text-gray-300 text-center">
                                {action.label}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Today's Stats */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                        <Zap className="h-4 w-4 text-emerald-400" />
                        Today's Performance
                    </h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {todayStats.map((stat, index) => (
                        <Card
                            key={index}
                            className="bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/80 transition-colors"
                        >
                            <CardContent className="p-3">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                                        <p className="text-xs text-gray-400">{stat.label}</p>
                                    </div>
                                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                </div>
                                {stat.change && (
                                    <Badge
                                        variant="outline"
                                        className="mt-2 bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs"
                                    >
                                        {stat.change} today
                                    </Badge>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-400" />
                        Upcoming Tasks
                    </h3>
                    <Link href="/m/tasks" className="text-sm text-emerald-400">
                        View all
                    </Link>
                </div>
                <div className="space-y-2">
                    {upcomingTasks.map((task) => (
                        <Card
                            key={task.id}
                            className="bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/80 transition-colors"
                        >
                            <CardContent className="p-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-1 rounded-full bg-gradient-to-b from-blue-400 to-purple-500" />
                                    <div>
                                        <p className="text-sm font-medium text-white">
                                            {task.title}
                                        </p>
                                        <p className="text-xs text-gray-400">{task.time}</p>
                                    </div>
                                </div>
                                <Badge
                                    variant="outline"
                                    className={getPriorityColor(task.priority)}
                                >
                                    {task.priority}
                                </Badge>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Recent Leads */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                        <Users className="h-4 w-4 text-purple-400" />
                        Recent Leads
                    </h3>
                    <Link href="/m/leads" className="text-sm text-emerald-400">
                        View all
                    </Link>
                </div>
                <div className="space-y-2">
                    {recentLeads.map((lead) => (
                        <Link key={lead.id} href={`/m/leads/${lead.id}`}>
                            <Card className="bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/80 transition-colors">
                                <CardContent className="p-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                                            {lead.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">
                                                {lead.name}
                                            </p>
                                            <p className="text-xs text-gray-400">{lead.course}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge
                                            variant="outline"
                                            className={`${getStatusColor(lead.status)} border-0`}
                                        >
                                            {lead.status}
                                        </Badge>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {lead.lastContact}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
