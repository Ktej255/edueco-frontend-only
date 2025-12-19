"use client";

import { useState } from "react";
import {
    MapPin,
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
    Navigation,
    CheckCircle,
    AlertCircle,
    Route,
    Car,
    Building,
    CircleDot,
    Search,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Mock data for field agents
const fieldAgents = [
    {
        id: "1",
        name: "Ravi Sharma",
        email: "ravi.s@eduecosystem.com",
        avatar: "RS",
        status: "active",
        role: "Senior Field Agent",
        territory: "North Delhi",
        currentLocation: "Rohini Sector 24",
        lastCheckIn: "10 mins ago",
        stats: {
            visitsToday: 8,
            visitsTarget: 12,
            totalLeads: 45,
            hotLeads: 12,
            conversions: 8,
            distance: "32 km",
        },
        performance: {
            target: 10,
            achieved: 8,
            trend: "up",
        },
        recentVisit: "Bright Future Academy",
    },
    {
        id: "2",
        name: "Meera Patel",
        email: "meera.p@eduecosystem.com",
        avatar: "MP",
        status: "active",
        role: "Field Agent",
        territory: "South Delhi",
        currentLocation: "Saket District Centre",
        lastCheckIn: "5 mins ago",
        stats: {
            visitsToday: 10,
            visitsTarget: 12,
            totalLeads: 38,
            hotLeads: 9,
            conversions: 6,
            distance: "28 km",
        },
        performance: {
            target: 8,
            achieved: 6,
            trend: "up",
        },
        recentVisit: "Excel Coaching Institute",
    },
    {
        id: "3",
        name: "Karthik Nair",
        email: "karthik.n@eduecosystem.com",
        avatar: "KN",
        status: "transit",
        role: "Senior Field Agent",
        territory: "Gurgaon",
        currentLocation: "DLF Cyber Hub",
        lastCheckIn: "25 mins ago",
        stats: {
            visitsToday: 6,
            visitsTarget: 10,
            totalLeads: 52,
            hotLeads: 15,
            conversions: 10,
            distance: "45 km",
        },
        performance: {
            target: 12,
            achieved: 10,
            trend: "down",
        },
        recentVisit: "In transit to next location",
    },
    {
        id: "4",
        name: "Anjali Reddy",
        email: "anjali.r@eduecosystem.com",
        avatar: "AR",
        status: "active",
        role: "Field Agent",
        territory: "Noida",
        currentLocation: "Sector 62",
        lastCheckIn: "15 mins ago",
        stats: {
            visitsToday: 7,
            visitsTarget: 10,
            totalLeads: 35,
            hotLeads: 8,
            conversions: 5,
            distance: "22 km",
        },
        performance: {
            target: 7,
            achieved: 5,
            trend: "up",
        },
        recentVisit: "Knowledge Hub School",
    },
    {
        id: "5",
        name: "Suresh Kumar",
        email: "suresh.k@eduecosystem.com",
        avatar: "SK",
        status: "offline",
        role: "Field Agent",
        territory: "East Delhi",
        currentLocation: "Last seen: Laxmi Nagar",
        lastCheckIn: "2 hours ago",
        stats: {
            visitsToday: 4,
            visitsTarget: 10,
            totalLeads: 28,
            hotLeads: 5,
            conversions: 3,
            distance: "15 km",
        },
        performance: {
            target: 6,
            achieved: 3,
            trend: "down",
        },
        recentVisit: "Day ended - Final visit: Metro School",
    },
];

const recentCheckIns = [
    { agent: "Meera Patel", location: "Excel Coaching Institute", time: "5 mins ago", type: "visit", notes: "Met with principal, interested in MBA program" },
    { agent: "Ravi Sharma", location: "Bright Future Academy", time: "10 mins ago", type: "visit", notes: "Follow-up scheduled for tomorrow" },
    { agent: "Anjali Reddy", location: "Knowledge Hub School", time: "15 mins ago", type: "visit", notes: "Collected 3 new leads" },
    { agent: "Karthik Nair", location: "DLF Cyber Hub", time: "25 mins ago", type: "transit", notes: "En route to Ambience Mall" },
];

const territories = [
    { name: "North Delhi", agents: 2, leads: 85, color: "bg-blue-500" },
    { name: "South Delhi", agents: 2, leads: 72, color: "bg-purple-500" },
    { name: "Gurgaon", agents: 3, leads: 95, color: "bg-emerald-500" },
    { name: "Noida", agents: 2, leads: 68, color: "bg-amber-500" },
    { name: "East Delhi", agents: 1, leads: 45, color: "bg-rose-500" },
];

const teamStats = [
    { label: "Active Agents", value: "4/5", change: "80%", icon: Users, color: "from-blue-500 to-blue-600" },
    { label: "Visits Today", value: "35", change: "+18%", icon: Building, color: "from-emerald-500 to-emerald-600" },
    { label: "Hot Leads", value: "49", change: "+12%", icon: Target, color: "from-rose-500 to-rose-600" },
    { label: "Avg Distance", value: "28 km", change: "-5%", icon: Route, color: "from-purple-500 to-purple-600" },
];

function getStatusBadge(status: string) {
    switch (status) {
        case "active":
            return (
                <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs text-emerald-500">Active</span>
                </div>
            );
        case "transit":
            return (
                <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-xs text-blue-500">In Transit</span>
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

export default function FieldAgentsPage() {
    const [timeRange, setTimeRange] = useState("today");
    const [searchQuery, setSearchQuery] = useState("");
    const [territoryFilter, setTerritoryFilter] = useState("all");

    const filteredAgents = fieldAgents.filter(agent => {
        const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            agent.territory.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTerritory = territoryFilter === "all" || agent.territory === territoryFilter;
        return matchesSearch && matchesTerritory;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">
                        Field Agents
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Track and manage field team activities in real-time
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
                        <MapPin className="h-4 w-4" />
                        View Map
                    </Button>
                    <Button className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 gap-2">
                        <UserPlus className="h-4 w-4" />
                        Add Agent
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

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search agents or territories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={territoryFilter} onValueChange={setTerritoryFilter}>
                    <SelectTrigger className="w-[180px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Territory" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Territories</SelectItem>
                        {territories.map((t) => (
                            <SelectItem key={t.name} value={t.name}>{t.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Agent List */}
                <Card className="lg:col-span-2 border-0 shadow-lg">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-semibold">Field Team</CardTitle>
                                <CardDescription>Live agent status and performance</CardDescription>
                            </div>
                            <Badge variant="outline" className="gap-1">
                                <CircleDot className="h-3 w-3 text-emerald-500" />
                                Live Tracking
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {filteredAgents.map((agent) => (
                            <div
                                key={agent.id}
                                className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                                                {agent.avatar}
                                            </div>
                                            {agent.status === "active" && (
                                                <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-emerald-500 border-2 border-background" />
                                            )}
                                            {agent.status === "transit" && (
                                                <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-blue-500 border-2 border-background flex items-center justify-center">
                                                    <Car className="h-2.5 w-2.5 text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold">{agent.name}</p>
                                                <Badge variant="outline" className="text-xs">
                                                    {agent.role}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <MapPin className="h-3 w-3" />
                                                {agent.currentLocation}
                                                <span className="text-xs">• {agent.lastCheckIn}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {getStatusBadge(agent.status)}
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                                    <div className="text-center p-2 rounded-lg bg-background/50">
                                        <div className="flex items-center justify-center gap-1 text-blue-500">
                                            <Building className="h-4 w-4" />
                                            <span className="font-bold">{agent.stats.visitsToday}/{agent.stats.visitsTarget}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">Visits</p>
                                    </div>
                                    <div className="text-center p-2 rounded-lg bg-background/50">
                                        <div className="flex items-center justify-center gap-1 text-purple-500">
                                            <Users className="h-4 w-4" />
                                            <span className="font-bold">{agent.stats.totalLeads}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">Leads</p>
                                    </div>
                                    <div className="text-center p-2 rounded-lg bg-background/50">
                                        <div className="flex items-center justify-center gap-1 text-rose-500">
                                            <Target className="h-4 w-4" />
                                            <span className="font-bold">{agent.stats.hotLeads}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">Hot</p>
                                    </div>
                                    <div className="text-center p-2 rounded-lg bg-background/50">
                                        <div className="flex items-center justify-center gap-1 text-emerald-500">
                                            <CheckCircle className="h-4 w-4" />
                                            <span className="font-bold">{agent.stats.conversions}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">Converted</p>
                                    </div>
                                    <div className="text-center p-2 rounded-lg bg-background/50">
                                        <div className="flex items-center justify-center gap-1 text-amber-500">
                                            <Route className="h-4 w-4" />
                                            <span className="font-bold">{agent.stats.distance}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">Distance</p>
                                    </div>
                                </div>

                                {/* Performance Bar */}
                                <div className="mt-4">
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="text-muted-foreground">
                                            Monthly Target: {agent.performance.achieved}/{agent.performance.target}
                                        </span>
                                        <span className={`flex items-center gap-1 ${agent.performance.trend === "up" ? "text-emerald-500" : "text-red-500"
                                            }`}>
                                            {agent.performance.trend === "up" ? (
                                                <ArrowUpRight className="h-4 w-4" />
                                            ) : (
                                                <ArrowDownRight className="h-4 w-4" />
                                            )}
                                            {Math.round((agent.performance.achieved / agent.performance.target) * 100)}%
                                        </span>
                                    </div>
                                    <Progress
                                        value={(agent.performance.achieved / agent.performance.target) * 100}
                                        className="h-2"
                                    />
                                </div>

                                {/* Recent Activity */}
                                <div className="mt-3 flex items-center gap-2 text-sm">
                                    <Activity className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">{agent.recentVisit}</span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Recent Check-ins */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-600">
                                    <Navigation className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold">Recent Check-ins</CardTitle>
                                    <CardDescription>Live field activity feed</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {recentCheckIns.map((checkIn, index) => (
                                <div
                                    key={index}
                                    className="p-3 rounded-xl bg-muted/30 border-l-2 border-emerald-500"
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="font-medium text-sm">{checkIn.agent}</p>
                                        <span className="text-xs text-muted-foreground">{checkIn.time}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                        {checkIn.type === "visit" ? (
                                            <Building className="h-3 w-3" />
                                        ) : (
                                            <Car className="h-3 w-3" />
                                        )}
                                        <span>{checkIn.location}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2 italic">{checkIn.notes}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Territory Coverage */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-emerald-500" />
                                Territory Coverage
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {territories.map((territory, index) => (
                                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-3 w-3 rounded-full ${territory.color}`} />
                                        <div>
                                            <p className="font-medium text-sm">{territory.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {territory.agents} agents • {territory.leads} leads
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Top Performer */}
                    <Card className="border-0 shadow-lg overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-amber-400 to-amber-600" />
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Award className="h-8 w-8 text-amber-500" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Top Field Agent</p>
                                    <p className="font-semibold">This Month</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20">
                                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-lg">
                                    KN
                                </div>
                                <div>
                                    <p className="font-bold text-lg">Karthik Nair</p>
                                    <p className="text-sm text-muted-foreground">10 conversions • 52 leads</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
