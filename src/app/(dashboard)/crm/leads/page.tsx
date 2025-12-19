"use client";

import { useState, useMemo } from "react";
import {
    Search,
    Filter,
    Download,
    Plus,
    Phone,
    Mail,
    MessageSquare,
    MoreHorizontal,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    Eye,
    UserPlus,
    RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

// Mock data for leads
const mockLeads = [
    {
        id: "1",
        name: "Priya Sharma",
        email: "priya.sharma@email.com",
        phone: "+91 98765 43210",
        course: "MBA Program",
        strength: "Hot",
        score: 92,
        source: "Website",
        stage: "Application",
        counselor: "Amit Kumar",
        lastActivity: "2 mins ago",
        createdAt: "Dec 15, 2024",
    },
    {
        id: "2",
        name: "Rahul Verma",
        email: "rahul.v@email.com",
        phone: "+91 98765 43211",
        course: "Data Science",
        strength: "Warm",
        score: 78,
        source: "LinkedIn",
        stage: "Inquiry",
        counselor: "Sneha Reddy",
        lastActivity: "15 mins ago",
        createdAt: "Dec 14, 2024",
    },
    {
        id: "3",
        name: "Ananya Patel",
        email: "ananya.p@email.com",
        phone: "+91 98765 43212",
        course: "BBA Program",
        strength: "Hot",
        score: 88,
        source: "Referral",
        stage: "Demo Scheduled",
        counselor: "Rajesh Nair",
        lastActivity: "32 mins ago",
        createdAt: "Dec 14, 2024",
    },
    {
        id: "4",
        name: "Vikram Singh",
        email: "vikram.s@email.com",
        phone: "+91 98765 43213",
        course: "MBA Program",
        strength: "Cold",
        score: 45,
        source: "Event",
        stage: "New",
        counselor: "Unassigned",
        lastActivity: "1 hour ago",
        createdAt: "Dec 13, 2024",
    },
    {
        id: "5",
        name: "Neha Gupta",
        email: "neha.g@email.com",
        phone: "+91 98765 43214",
        course: "Digital Marketing",
        strength: "Warm",
        score: 72,
        source: "Website",
        stage: "Follow-up",
        counselor: "Priyanka Das",
        lastActivity: "2 hours ago",
        createdAt: "Dec 12, 2024",
    },
    {
        id: "6",
        name: "Arjun Menon",
        email: "arjun.m@email.com",
        phone: "+91 98765 43215",
        course: "MBA Program",
        strength: "Hot",
        score: 95,
        source: "Website",
        stage: "Enrolled",
        counselor: "Amit Kumar",
        lastActivity: "3 hours ago",
        createdAt: "Dec 11, 2024",
    },
    {
        id: "7",
        name: "Kavitha Rajan",
        email: "kavitha.r@email.com",
        phone: "+91 98765 43216",
        course: "Data Science",
        strength: "Warm",
        score: 68,
        source: "Social Media",
        stage: "Inquiry",
        counselor: "Sneha Reddy",
        lastActivity: "5 hours ago",
        createdAt: "Dec 10, 2024",
    },
    {
        id: "8",
        name: "Suresh Kumar",
        email: "suresh.k@email.com",
        phone: "+91 98765 43217",
        course: "BBA Program",
        strength: "Cold",
        score: 35,
        source: "Event",
        stage: "Lost",
        counselor: "Rajesh Nair",
        lastActivity: "1 day ago",
        createdAt: "Dec 9, 2024",
    },
    {
        id: "9",
        name: "Meera Iyer",
        email: "meera.i@email.com",
        phone: "+91 98765 43218",
        course: "Digital Marketing",
        strength: "Hot",
        score: 90,
        source: "Referral",
        stage: "Application",
        counselor: "Priyanka Das",
        lastActivity: "1 day ago",
        createdAt: "Dec 8, 2024",
    },
    {
        id: "10",
        name: "Deepak Joshi",
        email: "deepak.j@email.com",
        phone: "+91 98765 43219",
        course: "MBA Program",
        strength: "Warm",
        score: 75,
        source: "LinkedIn",
        stage: "Demo Scheduled",
        counselor: "Amit Kumar",
        lastActivity: "2 days ago",
        createdAt: "Dec 7, 2024",
    },
];

const stages = ["All", "New", "Inquiry", "Follow-up", "Demo Scheduled", "Application", "Enrolled", "Lost"];
const sources = ["All", "Website", "LinkedIn", "Referral", "Event", "Social Media"];
const strengths = ["All", "Hot", "Warm", "Cold"];

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

function getStageBadge(stage: string) {
    const stageColors: Record<string, string> = {
        "New": "bg-gray-500/10 text-gray-500 border-gray-500/20",
        "Inquiry": "bg-blue-500/10 text-blue-500 border-blue-500/20",
        "Follow-up": "bg-purple-500/10 text-purple-500 border-purple-500/20",
        "Demo Scheduled": "bg-amber-500/10 text-amber-500 border-amber-500/20",
        "Application": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        "Enrolled": "bg-green-500/10 text-green-600 border-green-500/20",
        "Lost": "bg-red-500/10 text-red-500 border-red-500/20",
    };
    return <Badge className={stageColors[stage] || "bg-gray-500/10 text-gray-500"}>{stage}</Badge>;
}

function getScoreColor(score: number) {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
}

export default function LeadsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [stageFilter, setStageFilter] = useState("All");
    const [sourceFilter, setSourceFilter] = useState("All");
    const [strengthFilter, setStrengthFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredLeads = useMemo(() => {
        return mockLeads.filter((lead) => {
            const matchesSearch =
                lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.course.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStage = stageFilter === "All" || lead.stage === stageFilter;
            const matchesSource = sourceFilter === "All" || lead.source === sourceFilter;
            const matchesStrength = strengthFilter === "All" || lead.strength === strengthFilter;
            return matchesSearch && matchesStage && matchesSource && matchesStrength;
        });
    }, [searchQuery, stageFilter, sourceFilter, strengthFilter]);

    const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
    const paginatedLeads = filteredLeads.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
                        Lead Management
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage and nurture your prospective students
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                    <Button className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 gap-2">
                        <Plus className="h-4 w-4" />
                        Add Lead
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-0 shadow-md">
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Total Leads</p>
                        <p className="text-2xl font-bold">{mockLeads.length}</p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-md">
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Hot Leads</p>
                        <p className="text-2xl font-bold text-red-500">
                            {mockLeads.filter((l) => l.strength === "Hot").length}
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-md">
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">In Pipeline</p>
                        <p className="text-2xl font-bold text-purple-500">
                            {mockLeads.filter((l) => !["Enrolled", "Lost"].includes(l.stage)).length}
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-md">
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Converted</p>
                        <p className="text-2xl font-bold text-emerald-500">
                            {mockLeads.filter((l) => l.stage === "Enrolled").length}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <Card className="border-0 shadow-lg">
                <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, email, or course..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Select value={stageFilter} onValueChange={setStageFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Stage" />
                                </SelectTrigger>
                                <SelectContent>
                                    {stages.map((stage) => (
                                        <SelectItem key={stage} value={stage}>
                                            {stage}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={sourceFilter} onValueChange={setSourceFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Source" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sources.map((source) => (
                                        <SelectItem key={source} value={source}>
                                            {source}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={strengthFilter} onValueChange={setStrengthFilter}>
                                <SelectTrigger className="w-[130px]">
                                    <SelectValue placeholder="Strength" />
                                </SelectTrigger>
                                <SelectContent>
                                    {strengths.map((strength) => (
                                        <SelectItem key={strength} value={strength}>
                                            {strength}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button variant="outline" size="icon" onClick={() => {
                                setSearchQuery("");
                                setStageFilter("All");
                                setSourceFilter("All");
                                setStrengthFilter("All");
                            }}>
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Leads Table */}
            <Card className="border-0 shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="text-left p-4 font-medium text-sm">Lead</th>
                                <th className="text-left p-4 font-medium text-sm hidden md:table-cell">Course</th>
                                <th className="text-left p-4 font-medium text-sm hidden lg:table-cell">Source</th>
                                <th className="text-left p-4 font-medium text-sm">Stage</th>
                                <th className="text-left p-4 font-medium text-sm">Strength</th>
                                <th className="text-center p-4 font-medium text-sm hidden md:table-cell">Score</th>
                                <th className="text-left p-4 font-medium text-sm hidden xl:table-cell">Counselor</th>
                                <th className="text-right p-4 font-medium text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedLeads.map((lead, index) => (
                                <tr
                                    key={lead.id}
                                    className={`border-b border-muted/50 hover:bg-muted/30 transition-colors ${index % 2 === 0 ? "bg-background" : "bg-muted/10"
                                        }`}
                                >
                                    <td className="p-4">
                                        <Link href={`/crm/leads/${lead.id}`} className="group">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-rose-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                                                    {lead.name.split(" ").map((n) => n[0]).join("")}
                                                </div>
                                                <div>
                                                    <p className="font-medium group-hover:text-rose-500 transition-colors">
                                                        {lead.name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">{lead.email}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="p-4 hidden md:table-cell">
                                        <p className="text-sm">{lead.course}</p>
                                    </td>
                                    <td className="p-4 hidden lg:table-cell">
                                        <p className="text-sm text-muted-foreground">{lead.source}</p>
                                    </td>
                                    <td className="p-4">{getStageBadge(lead.stage)}</td>
                                    <td className="p-4">{getStrengthBadge(lead.strength)}</td>
                                    <td className="p-4 text-center hidden md:table-cell">
                                        <span className={`font-bold ${getScoreColor(lead.score)}`}>{lead.score}</span>
                                    </td>
                                    <td className="p-4 hidden xl:table-cell">
                                        <p className="text-sm">{lead.counselor}</p>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-500/10">
                                                <Phone className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10">
                                                <MessageSquare className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-purple-500 hover:text-purple-600 hover:bg-purple-500/10">
                                                <Mail className="h-4 w-4" />
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/crm/leads/${lead.id}`} className="flex items-center gap-2 cursor-pointer">
                                                            <Eye className="h-4 w-4" />
                                                            View Profile
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="flex items-center gap-2">
                                                        <UserPlus className="h-4 w-4" />
                                                        Assign Counselor
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-500 flex items-center gap-2">
                                                        Mark as Lost
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between p-4 border-t border-muted/50">
                    <p className="text-sm text-muted-foreground">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                        {Math.min(currentPage * itemsPerPage, filteredLeads.length)} of {filteredLeads.length} leads
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="icon"
                                onClick={() => setCurrentPage(page)}
                                className={currentPage === page ? "bg-rose-500 hover:bg-rose-600" : ""}
                            >
                                {page}
                            </Button>
                        ))}
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
