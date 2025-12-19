"use client";

import { useState } from "react";
import {
    TrendingUp,
    Users,
    Target,
    Phone,
    Mail,
    MessageSquare,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Filter,
    MoreHorizontal,
    Zap,
    Bot,
    ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

// Mock data for the dashboard
const kpiData = [
    {
        title: "Total Leads",
        value: "12,847",
        change: "+12.5%",
        trend: "up",
        icon: Users,
        color: "from-blue-500 to-blue-600",
    },
    {
        title: "Conversions",
        value: "1,284",
        change: "+8.2%",
        trend: "up",
        icon: Target,
        color: "from-emerald-500 to-emerald-600",
    },
    {
        title: "Conversion Rate",
        value: "9.99%",
        change: "+2.1%",
        trend: "up",
        icon: TrendingUp,
        color: "from-purple-500 to-purple-600",
    },
    {
        title: "ROI",
        value: "324%",
        change: "-1.3%",
        trend: "down",
        icon: Zap,
        color: "from-amber-500 to-amber-600",
    },
];

const leadSources = [
    { name: "Website", leads: 4521, percentage: 35, color: "bg-blue-500" },
    { name: "Social Media", leads: 3210, percentage: 25, color: "bg-purple-500" },
    { name: "Referrals", leads: 2054, percentage: 16, color: "bg-emerald-500" },
    { name: "Events", leads: 1541, percentage: 12, color: "bg-amber-500" },
    { name: "Direct", leads: 1521, percentage: 12, color: "bg-rose-500" },
];

const recentLeads = [
    {
        id: "1",
        name: "Priya Sharma",
        email: "priya.sharma@email.com",
        course: "MBA Program",
        strength: "Hot",
        score: 92,
        source: "Website",
        time: "2 mins ago",
    },
    {
        id: "2",
        name: "Rahul Verma",
        email: "rahul.v@email.com",
        course: "Data Science",
        strength: "Warm",
        score: 78,
        source: "LinkedIn",
        time: "15 mins ago",
    },
    {
        id: "3",
        name: "Ananya Patel",
        email: "ananya.p@email.com",
        course: "BBA Program",
        strength: "Hot",
        score: 88,
        source: "Referral",
        time: "32 mins ago",
    },
    {
        id: "4",
        name: "Vikram Singh",
        email: "vikram.s@email.com",
        course: "MBA Program",
        strength: "Cold",
        score: 45,
        source: "Event",
        time: "1 hour ago",
    },
    {
        id: "5",
        name: "Neha Gupta",
        email: "neha.g@email.com",
        course: "Digital Marketing",
        strength: "Warm",
        score: 72,
        source: "Website",
        time: "2 hours ago",
    },
];

const counselorActivity = [
    { name: "Amit Kumar", calls: 45, emails: 120, conversions: 12, active: true },
    { name: "Sneha Reddy", calls: 38, emails: 95, conversions: 10, active: true },
    { name: "Rajesh Nair", calls: 52, emails: 140, conversions: 15, active: false },
    { name: "Priyanka Das", calls: 41, emails: 88, conversions: 8, active: true },
];

const niaaInteractions = [
    { query: "Course fee structure for MBA?", time: "Just now", resolved: true },
    { query: "Admission deadline for October batch", time: "5 mins ago", resolved: true },
    { query: "Scholarship eligibility criteria", time: "12 mins ago", resolved: false },
    { query: "Campus placement statistics", time: "18 mins ago", resolved: true },
];

function getStrengthBadge(strength: string) {
    switch (strength) {
        case "Hot":
            return <Badge className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20">🔥 Hot</Badge>;
        case "Warm":
            return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20">☀️ Warm</Badge>;
        case "Cold":
            return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20">❄️ Cold</Badge>;
        default:
            return <Badge variant="outline">{strength}</Badge>;
    }
}

export default function CRMDashboardPage() {
    const [timeRange, setTimeRange] = useState("7d");

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
                        CRM Dashboard
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Nurture leads and convert them into students
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Calendar className="h-4 w-4" />
                        Last 7 days
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Filters
                    </Button>
                    <Button className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 gap-2">
                        <Phone className="h-4 w-4" />
                        Quick Call
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiData.map((kpi, index) => (
                    <Card
                        key={index}
                        className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${kpi.color} opacity-5`} />
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${kpi.color}`}>
                                    <kpi.icon className="h-6 w-6 text-white" />
                                </div>
                                <div className={`flex items-center gap-1 text-sm font-medium ${kpi.trend === "up" ? "text-emerald-500" : "text-red-500"
                                    }`}>
                                    {kpi.trend === "up" ? (
                                        <ArrowUpRight className="h-4 w-4" />
                                    ) : (
                                        <ArrowDownRight className="h-4 w-4" />
                                    )}
                                    {kpi.change}
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-3xl font-bold">{kpi.value}</p>
                                <p className="text-muted-foreground text-sm mt-1">{kpi.title}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lead Sources */}
                <Card className="lg:col-span-1 border-0 shadow-lg">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold">Lead Sources</CardTitle>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </div>
                        <CardDescription>Distribution by acquisition channel</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {leadSources.map((source, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">{source.name}</span>
                                    <span className="text-muted-foreground">{source.leads.toLocaleString()} leads</span>
                                </div>
                                <div className="relative">
                                    <Progress value={source.percentage} className="h-2" />
                                    <div
                                        className={`absolute top-0 left-0 h-2 rounded-full ${source.color} transition-all duration-500`}
                                        style={{ width: `${source.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Recent Leads */}
                <Card className="lg:col-span-2 border-0 shadow-lg">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-semibold">Recent Leads</CardTitle>
                                <CardDescription>Latest inquiries from prospective students</CardDescription>
                            </div>
                            <Link href="/crm/leads">
                                <Button variant="ghost" size="sm" className="gap-1 text-rose-500 hover:text-rose-600">
                                    View All
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentLeads.map((lead) => (
                                <Link
                                    key={lead.id}
                                    href={`/crm/leads/${lead.id}`}
                                    className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-rose-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                                            {lead.name.split(" ").map(n => n[0]).join("")}
                                        </div>
                                        <div>
                                            <p className="font-semibold group-hover:text-rose-500 transition-colors">{lead.name}</p>
                                            <p className="text-sm text-muted-foreground">{lead.course}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-sm font-medium">Score: {lead.score}</p>
                                            <p className="text-xs text-muted-foreground">{lead.source}</p>
                                        </div>
                                        {getStrengthBadge(lead.strength)}
                                        <span className="text-xs text-muted-foreground hidden md:block">{lead.time}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Counselor Activity */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-semibold">Counselor Activity</CardTitle>
                                <CardDescription>Real-time team productivity</CardDescription>
                            </div>
                            <Link href="/crm/counselors">
                                <Button variant="ghost" size="sm" className="gap-1 text-rose-500 hover:text-rose-600">
                                    View Dashboard
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {counselorActivity.map((counselor, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 rounded-xl bg-muted/30"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm">
                                                {counselor.name.split(" ").map(n => n[0]).join("")}
                                            </div>
                                            {counselor.active && (
                                                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium">{counselor.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {counselor.active ? "Online" : "Away"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 text-sm">
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <Phone className="h-4 w-4" />
                                            <span>{counselor.calls}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <Mail className="h-4 w-4" />
                                            <span>{counselor.emails}</span>
                                        </div>
                                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                                            {counselor.conversions} converted
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Niaa Chatbot Interactions */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
                                    <Bot className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold">Niaa Chatbot</CardTitle>
                                    <CardDescription>24/7 AI-powered engagement</CardDescription>
                                </div>
                            </div>
                            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                                Active
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {niaaInteractions.map((interaction, index) => (
                                <div
                                    key={index}
                                    className="flex items-start justify-between p-4 rounded-xl bg-muted/30"
                                >
                                    <div className="flex items-start gap-3">
                                        <MessageSquare className="h-5 w-5 text-purple-500 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium">{interaction.query}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{interaction.time}</p>
                                        </div>
                                    </div>
                                    {interaction.resolved ? (
                                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs">
                                            Resolved
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-xs">
                                            Pending
                                        </Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-purple-500/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-purple-600 dark:text-purple-400">Today's Stats</p>
                                    <p className="text-sm text-muted-foreground">247 conversations handled</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">94%</p>
                                    <p className="text-xs text-muted-foreground">Resolution Rate</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
