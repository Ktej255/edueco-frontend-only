"use client";

import { useState } from "react";
import {
    Users,
    Phone,
    Mail,
    MessageSquare,
    TrendingUp,
    Target,
    Clock,
    Award,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Filter,
    MoreHorizontal,
    UserPlus,
    Settings,
    ChevronRight,
    Activity,
    Zap,
    RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Mock data for counselors
const counselors = [
    {
        id: "1",
        name: "Amit Kumar",
        email: "amit.k@eduecosystem.com",
        avatar: "AK",
        status: "online",
        role: "Senior Counselor",
        stats: {
            calls: 45,
            emails: 120,
            whatsapp: 85,
            conversions: 12,
            leadsAssigned: 48,
            responseTime: "2 min",
            conversionRate: 25,
        },
        performance: {
            target: 15,
            achieved: 12,
            trend: "up",
        },
        recentActivity: "On call with Priya Sharma",
    },
    {
        id: "2",
        name: "Sneha Reddy",
        email: "sneha.r@eduecosystem.com",
        avatar: "SR",
        status: "online",
        role: "Counselor",
        stats: {
            calls: 38,
            emails: 95,
            whatsapp: 72,
            conversions: 10,
            leadsAssigned: 42,
            responseTime: "5 min",
            conversionRate: 24,
        },
        performance: {
            target: 12,
            achieved: 10,
            trend: "up",
        },
        recentActivity: "Sending follow-up emails",
    },
    {
        id: "3",
        name: "Rajesh Nair",
        email: "rajesh.n@eduecosystem.com",
        avatar: "RN",
        status: "away",
        role: "Senior Counselor",
        stats: {
            calls: 52,
            emails: 140,
            whatsapp: 95,
            conversions: 15,
            leadsAssigned: 55,
            responseTime: "3 min",
            conversionRate: 27,
        },
        performance: {
            target: 18,
            achieved: 15,
            trend: "down",
        },
        recentActivity: "In team meeting",
    },
    {
        id: "4",
        name: "Priyanka Das",
        email: "priyanka.d@eduecosystem.com",
        avatar: "PD",
        status: "online",
        role: "Counselor",
        stats: {
            calls: 41,
            emails: 88,
            whatsapp: 65,
            conversions: 8,
            leadsAssigned: 35,
            responseTime: "4 min",
            conversionRate: 23,
        },
        performance: {
            target: 10,
            achieved: 8,
            trend: "up",
        },
        recentActivity: "Updating lead notes",
    },
    {
        id: "5",
        name: "Vikram Menon",
        email: "vikram.m@eduecosystem.com",
        avatar: "VM",
        status: "offline",
        role: "Junior Counselor",
        stats: {
            calls: 28,
            emails: 65,
            whatsapp: 45,
            conversions: 5,
            leadsAssigned: 25,
            responseTime: "8 min",
            conversionRate: 20,
        },
        performance: {
            target: 8,
            achieved: 5,
            trend: "down",
        },
        recentActivity: "Offline since 2 hours",
    },
];

const allocationRules = [
    { name: "Round Robin", leads: 45, active: true, description: "Evenly distribute leads among online counselors" },
    { name: "Course-based", leads: 28, active: true, description: "Assign MBA leads to senior counselors" },
    { name: "Source-based", leads: 15, active: false, description: "LinkedIn leads to specialized team" },
    { name: "Score-based", leads: 32, active: true, description: "Hot leads to top performers" },
];

const teamStats = [
    { label: "Total Calls Today", value: "204", change: "+12%", icon: Phone, color: "from-blue-500 to-blue-600" },
    { label: "Emails Sent", value: "508", change: "+8%", icon: Mail, color: "from-purple-500 to-purple-600" },
    { label: "Conversions", value: "50", change: "+15%", icon: Target, color: "from-emerald-500 to-emerald-600" },
    { label: "Avg Response Time", value: "4.2 min", change: "-2 min", icon: Clock, color: "from-amber-500 to-amber-600" },
];

function getStatusBadge(status: string) {
    switch (status) {
        case "online":
            return (
                <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs text-emerald-500">Online</span>
                </div>
            );
        case "away":
            return (
                <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-amber-500" />
                    <span className="text-xs text-amber-500">Away</span>
                </div>
            );
        case "offline":
            return (
                <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-gray-400" />
                    <span className="text-xs text-gray-500">Offline</span>
                </div>
            );
        default:
            return null;
    }
}

export default function CounselorsPage() {
    const [timeRange, setTimeRange] = useState("today");

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
                        Counselor Dashboard
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Monitor and optimize team productivity
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-[150px]">
                            <Calendar className="h-4 w-4 mr-2" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="week">This Week</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="gap-2">
                        <Settings className="h-4 w-4" />
                        Settings
                    </Button>
                    <Button className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 gap-2">
                        <UserPlus className="h-4 w-4" />
                        Add Counselor
                    </Button>
                </div>
            </div>

            {/* Team Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {teamStats.map((stat, index) => (
                    <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`} />
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                                    <stat.icon className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex items-center gap-1 text-sm font-medium text-emerald-500">
                                    <ArrowUpRight className="h-4 w-4" />
                                    {stat.change}
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-3xl font-bold">{stat.value}</p>
                                <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Counselor List */}
                <Card className="lg:col-span-2 border-0 shadow-lg">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-semibold">Team Performance</CardTitle>
                                <CardDescription>Individual counselor productivity metrics</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon">
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {counselors.map((counselor) => (
                            <div
                                key={counselor.id}
                                className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold">
                                                {counselor.avatar}
                                            </div>
                                            {counselor.status === "online" && (
                                                <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-emerald-500 border-2 border-background" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold">{counselor.name}</p>
                                                <Badge variant="outline" className="text-xs">
                                                    {counselor.role}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{counselor.recentActivity}</p>
                                        </div>
                                    </div>
                                    {getStatusBadge(counselor.status)}
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                                    <div className="text-center p-2 rounded-lg bg-background/50">
                                        <div className="flex items-center justify-center gap-1 text-blue-500">
                                            <Phone className="h-4 w-4" />
                                            <span className="font-bold">{counselor.stats.calls}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">Calls</p>
                                    </div>
                                    <div className="text-center p-2 rounded-lg bg-background/50">
                                        <div className="flex items-center justify-center gap-1 text-purple-500">
                                            <Mail className="h-4 w-4" />
                                            <span className="font-bold">{counselor.stats.emails}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">Emails</p>
                                    </div>
                                    <div className="text-center p-2 rounded-lg bg-background/50">
                                        <div className="flex items-center justify-center gap-1 text-emerald-500">
                                            <MessageSquare className="h-4 w-4" />
                                            <span className="font-bold">{counselor.stats.whatsapp}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">WhatsApp</p>
                                    </div>
                                    <div className="text-center p-2 rounded-lg bg-background/50">
                                        <div className="flex items-center justify-center gap-1 text-amber-500">
                                            <Users className="h-4 w-4" />
                                            <span className="font-bold">{counselor.stats.leadsAssigned}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">Leads</p>
                                    </div>
                                    <div className="text-center p-2 rounded-lg bg-background/50">
                                        <div className="flex items-center justify-center gap-1 text-rose-500">
                                            <Target className="h-4 w-4" />
                                            <span className="font-bold">{counselor.stats.conversions}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">Converted</p>
                                    </div>
                                </div>

                                {/* Performance Bar */}
                                <div className="mt-4">
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="text-muted-foreground">
                                            Monthly Target: {counselor.performance.achieved}/{counselor.performance.target}
                                        </span>
                                        <span className={`flex items-center gap-1 ${counselor.performance.trend === "up" ? "text-emerald-500" : "text-red-500"
                                            }`}>
                                            {counselor.performance.trend === "up" ? (
                                                <ArrowUpRight className="h-4 w-4" />
                                            ) : (
                                                <ArrowDownRight className="h-4 w-4" />
                                            )}
                                            {Math.round((counselor.performance.achieved / counselor.performance.target) * 100)}%
                                        </span>
                                    </div>
                                    <Progress
                                        value={(counselor.performance.achieved / counselor.performance.target) * 100}
                                        className="h-2"
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Dynamic Lead Allocation */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-rose-500 to-purple-600">
                                        <Zap className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-semibold">Lead Allocation</CardTitle>
                                        <CardDescription>Dynamic distribution rules</CardDescription>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {allocationRules.map((rule, index) => (
                                <div
                                    key={index}
                                    className={`p-4 rounded-xl border ${rule.active ? "border-emerald-500/20 bg-emerald-500/5" : "border-muted bg-muted/30"
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-3 w-3 rounded-full ${rule.active ? "bg-emerald-500" : "bg-gray-400"}`} />
                                            <div>
                                                <p className="font-medium text-sm">{rule.name}</p>
                                                <p className="text-xs text-muted-foreground">{rule.description}</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="text-xs">
                                            {rule.leads} leads
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                            <Button variant="outline" className="w-full gap-2 mt-4">
                                <Settings className="h-4 w-4" />
                                Configure Rules
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Top Performer */}
                    <Card className="border-0 shadow-lg overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-amber-400 to-amber-600" />
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Award className="h-8 w-8 text-amber-500" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Top Performer</p>
                                    <p className="font-semibold">This Month</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20">
                                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-lg">
                                    RN
                                </div>
                                <div>
                                    <p className="font-bold text-lg">Rajesh Nair</p>
                                    <p className="text-sm text-muted-foreground">15 conversions • 27% rate</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Response Time Leaderboard */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Clock className="h-4 w-4 text-blue-500" />
                                Fastest Response
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {counselors
                                .sort((a, b) => parseFloat(a.stats.responseTime) - parseFloat(b.stats.responseTime))
                                .slice(0, 3)
                                .map((counselor, index) => (
                                    <div key={counselor.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                        <div className="flex items-center gap-3">
                                            <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? "bg-amber-500 text-white" :
                                                    index === 1 ? "bg-gray-300 text-gray-700" :
                                                        "bg-amber-700 text-white"
                                                }`}>
                                                {index + 1}
                                            </span>
                                            <p className="font-medium text-sm">{counselor.name}</p>
                                        </div>
                                        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                                            {counselor.stats.responseTime}
                                        </Badge>
                                    </div>
                                ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
