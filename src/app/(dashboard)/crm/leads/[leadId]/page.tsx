"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    Phone,
    Mail,
    MessageSquare,
    Calendar,
    MapPin,
    BookOpen,
    Clock,
    Star,
    TrendingUp,
    Activity,
    FileText,
    Video,
    Globe,
    Edit,
    MoreHorizontal,
    Send,
    Plus,
    ChevronRight,
    User,
    Briefcase,
    GraduationCap,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

// Mock lead data
const leadData = {
    id: "1",
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+91 98765 43210",
    alternatePhone: "+91 98765 43220",
    address: "Koramangala, Bangalore, Karnataka",
    dateOfBirth: "March 15, 1998",
    course: "MBA Program",
    strength: "Hot",
    score: 92,
    source: "Website",
    stage: "Application",
    counselor: "Amit Kumar",
    counselorEmail: "amit.k@eduecosystem.com",
    createdAt: "December 10, 2024",
    lastActivity: "2 mins ago",
    education: "B.Com from Delhi University (2020)",
    workExperience: "3 years at Infosys as Business Analyst",
    interests: ["Finance", "Marketing", "Strategy"],
    notes: "Very interested in the executive MBA program. Has budget constraints but willing to explore EMI options.",
};

const activityTimeline = [
    {
        id: 1,
        type: "call",
        title: "Outbound Call",
        description: "Discussed program details and fee structure. Candidate showed high interest.",
        time: "2 mins ago",
        user: "Amit Kumar",
        duration: "12 mins",
        icon: Phone,
        color: "bg-blue-500",
    },
    {
        id: 2,
        type: "email",
        title: "Email Sent",
        description: "Sent brochure and fee details as discussed",
        time: "15 mins ago",
        user: "Amit Kumar",
        icon: Mail,
        color: "bg-purple-500",
    },
    {
        id: 3,
        type: "whatsapp",
        title: "WhatsApp Message",
        description: "Shared application link and deadline reminder",
        time: "1 hour ago",
        user: "System (Automated)",
        icon: MessageSquare,
        color: "bg-emerald-500",
    },
    {
        id: 4,
        type: "visit",
        title: "Website Visit",
        description: "Viewed MBA program page and faculty section",
        time: "3 hours ago",
        user: "Lead",
        pages: ["MBA Program", "Faculty", "Placements"],
        icon: Globe,
        color: "bg-amber-500",
    },
    {
        id: 5,
        type: "form",
        title: "Form Submitted",
        description: "Downloaded admission guide PDF",
        time: "Yesterday",
        user: "Lead",
        icon: FileText,
        color: "bg-rose-500",
    },
    {
        id: 6,
        type: "webinar",
        title: "Webinar Attended",
        description: "Attended 'Career in MBA' webinar - watched 45 mins",
        time: "Dec 12, 2024",
        user: "Lead",
        icon: Video,
        color: "bg-indigo-500",
    },
    {
        id: 7,
        type: "inquiry",
        title: "Inquiry Created",
        description: "Lead registered interest via website inquiry form",
        time: "Dec 10, 2024",
        user: "System",
        icon: Plus,
        color: "bg-gray-500",
    },
];

const engagementScores = [
    { label: "Email Opens", value: 85, max: 100 },
    { label: "Website Visits", value: 12, max: 20 },
    { label: "Webinars", value: 2, max: 5 },
    { label: "Downloads", value: 4, max: 10 },
    { label: "Call Response", value: 90, max: 100 },
];

function getStrengthBadge(strength: string) {
    switch (strength) {
        case "Hot":
            return <Badge className="bg-red-500/10 text-red-500 border-red-500/20 text-base px-4 py-1">🔥 Hot Lead</Badge>;
        case "Warm":
            return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-base px-4 py-1">☀️ Warm Lead</Badge>;
        case "Cold":
            return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-base px-4 py-1">❄️ Cold Lead</Badge>;
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
    return <Badge className={`${stageColors[stage] || "bg-gray-500/10 text-gray-500"} text-base px-4 py-1`}>{stage}</Badge>;
}

export default function LeadProfilePage() {
    const params = useParams();
    const router = useRouter();
    const [note, setNote] = useState("");

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold">Lead Profile</h1>
                        <Badge variant="outline" className="text-muted-foreground">
                            ID: {params.leadId}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">One View Profile - Complete lead information</p>
                </div>
                <Button variant="outline" className="gap-2">
                    <Edit className="h-4 w-4" />
                    Edit
                </Button>
                <Button className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 gap-2">
                    <Phone className="h-4 w-4" />
                    Call Now
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Profile Info */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Profile Card */}
                    <Card className="border-0 shadow-lg overflow-hidden">
                        <div className="h-24 bg-gradient-to-r from-rose-500 to-purple-600" />
                        <CardContent className="pt-0 -mt-12">
                            <div className="flex flex-col items-center text-center">
                                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-rose-400 to-purple-500 flex items-center justify-center text-white font-bold text-3xl border-4 border-background shadow-lg">
                                    {leadData.name.split(" ").map((n) => n[0]).join("")}
                                </div>
                                <h2 className="text-xl font-bold mt-4">{leadData.name}</h2>
                                <p className="text-muted-foreground text-sm">{leadData.course}</p>
                                <div className="flex items-center gap-2 mt-3">
                                    {getStrengthBadge(leadData.strength)}
                                </div>
                                <div className="mt-2">
                                    {getStageBadge(leadData.stage)}
                                </div>
                            </div>

                            {/* Score and Strength */}
                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <div className="text-center p-4 rounded-xl bg-muted/30">
                                    <div className="flex items-center justify-center gap-2 mb-1">
                                        <Star className="h-4 w-4 text-amber-500" />
                                        <span className="text-sm font-medium">Lead Score</span>
                                    </div>
                                    <p className="text-3xl font-bold text-emerald-500">{leadData.score}</p>
                                    <p className="text-xs text-muted-foreground">out of 100</p>
                                </div>
                                <div className="text-center p-4 rounded-xl bg-muted/30">
                                    <div className="flex items-center justify-center gap-2 mb-1">
                                        <TrendingUp className="h-4 w-4 text-purple-500" />
                                        <span className="text-sm font-medium">Strength</span>
                                    </div>
                                    <p className="text-3xl font-bold text-purple-500">Top 5%</p>
                                    <p className="text-xs text-muted-foreground">vs pool</p>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="mt-6 grid grid-cols-3 gap-2">
                                <Button variant="outline" className="flex-col h-auto py-3 hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500/20">
                                    <Phone className="h-5 w-5 mb-1" />
                                    <span className="text-xs">Call</span>
                                </Button>
                                <Button variant="outline" className="flex-col h-auto py-3 hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/20">
                                    <MessageSquare className="h-5 w-5 mb-1" />
                                    <span className="text-xs">WhatsApp</span>
                                </Button>
                                <Button variant="outline" className="flex-col h-auto py-3 hover:bg-purple-500/10 hover:text-purple-500 hover:border-purple-500/20">
                                    <Mail className="h-5 w-5 mb-1" />
                                    <span className="text-xs">Email</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Details */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold">Contact Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-500/10">
                                    <Mail className="h-4 w-4 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Email</p>
                                    <p className="text-sm font-medium">{leadData.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-emerald-500/10">
                                    <Phone className="h-4 w-4 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Phone</p>
                                    <p className="text-sm font-medium">{leadData.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-purple-500/10">
                                    <MapPin className="h-4 w-4 text-purple-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Location</p>
                                    <p className="text-sm font-medium">{leadData.address}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-amber-500/10">
                                    <Calendar className="h-4 w-4 text-amber-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Date of Birth</p>
                                    <p className="text-sm font-medium">{leadData.dateOfBirth}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Background Info */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold">Background</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-indigo-500/10">
                                    <GraduationCap className="h-4 w-4 text-indigo-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Education</p>
                                    <p className="text-sm font-medium">{leadData.education}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-rose-500/10">
                                    <Briefcase className="h-4 w-4 text-rose-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Work Experience</p>
                                    <p className="text-sm font-medium">{leadData.workExperience}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-2">Interests</p>
                                <div className="flex flex-wrap gap-2">
                                    {leadData.interests.map((interest) => (
                                        <Badge key={interest} variant="outline" className="bg-muted/50">
                                            {interest}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Assigned Counselor */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold">Assigned Counselor</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold">
                                    {leadData.counselor.split(" ").map((n) => n[0]).join("")}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">{leadData.counselor}</p>
                                    <p className="text-sm text-muted-foreground">{leadData.counselorEmail}</p>
                                </div>
                                <Button variant="ghost" size="sm">
                                    Change
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Activity & Engagement */}
                <div className="lg:col-span-2 space-y-6">
                    <Tabs defaultValue="timeline" className="w-full">
                        <TabsList className="w-full justify-start bg-muted/30">
                            <TabsTrigger value="timeline" className="gap-2">
                                <Activity className="h-4 w-4" />
                                Activity Timeline
                            </TabsTrigger>
                            <TabsTrigger value="engagement" className="gap-2">
                                <TrendingUp className="h-4 w-4" />
                                Engagement
                            </TabsTrigger>
                            <TabsTrigger value="notes" className="gap-2">
                                <FileText className="h-4 w-4" />
                                Notes
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="timeline" className="mt-6">
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg font-semibold">Activity Timeline</CardTitle>
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <Clock className="h-4 w-4" />
                                            Filter
                                        </Button>
                                    </div>
                                    <CardDescription>Complete history of interactions and activities</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="relative">
                                        <div className="absolute left-6 top-0 bottom-0 w-px bg-muted" />
                                        <div className="space-y-6">
                                            {activityTimeline.map((activity) => (
                                                <div key={activity.id} className="relative flex gap-4">
                                                    <div className={`h-12 w-12 rounded-full ${activity.color} flex items-center justify-center text-white z-10 shadow-lg`}>
                                                        <activity.icon className="h-5 w-5" />
                                                    </div>
                                                    <div className="flex-1 pt-1">
                                                        <div className="flex items-center justify-between">
                                                            <h4 className="font-semibold">{activity.title}</h4>
                                                            <span className="text-xs text-muted-foreground">{activity.time}</span>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                                                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                                            <span className="flex items-center gap-1">
                                                                <User className="h-3 w-3" />
                                                                {activity.user}
                                                            </span>
                                                            {activity.duration && (
                                                                <span className="flex items-center gap-1">
                                                                    <Clock className="h-3 w-3" />
                                                                    {activity.duration}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {activity.pages && (
                                                            <div className="flex flex-wrap gap-1 mt-2">
                                                                {activity.pages.map((page) => (
                                                                    <Badge key={page} variant="outline" className="text-xs bg-muted/50">
                                                                        {page}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="engagement" className="mt-6">
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">Engagement Metrics</CardTitle>
                                    <CardDescription>How this lead compares to your average prospect</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {engagementScores.map((metric) => (
                                        <div key={metric.label} className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-medium">{metric.label}</span>
                                                <span className="text-muted-foreground">
                                                    {metric.label.includes("%") ? `${metric.value}%` : `${metric.value}/${metric.max}`}
                                                </span>
                                            </div>
                                            <Progress value={(metric.value / metric.max) * 100} className="h-2" />
                                        </div>
                                    ))}

                                    <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 mt-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-emerald-500/20">
                                                <TrendingUp className="h-5 w-5 text-emerald-500" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-emerald-600 dark:text-emerald-400">High Engagement Lead</p>
                                                <p className="text-sm text-muted-foreground">
                                                    This lead shows 43% higher engagement than average prospects
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="notes" className="mt-6">
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">Notes & Follow-ups</CardTitle>
                                    <CardDescription>Internal notes and scheduled follow-ups</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Existing Note */}
                                    <div className="p-4 rounded-xl bg-muted/30">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 text-sm font-semibold">
                                                    AK
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">Amit Kumar</p>
                                                    <p className="text-xs text-muted-foreground">Dec 14, 2024</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <p className="text-sm mt-3">{leadData.notes}</p>
                                    </div>

                                    {/* Add Note */}
                                    <div className="space-y-3">
                                        <Textarea
                                            placeholder="Add a note about this lead..."
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                            className="min-h-[100px]"
                                        />
                                        <div className="flex items-center justify-between">
                                            <Button variant="outline" className="gap-2">
                                                <Calendar className="h-4 w-4" />
                                                Schedule Follow-up
                                            </Button>
                                            <Button className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 gap-2">
                                                <Send className="h-4 w-4" />
                                                Save Note
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {/* Nurturing Stage */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">Nurturing Journey</CardTitle>
                            <CardDescription>Current position in the enrollment funnel</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                {["New", "Inquiry", "Follow-up", "Demo", "Application", "Enrolled"].map((stage, index) => {
                                    const isCompleted = index < 4;
                                    const isCurrent = stage === "Application";
                                    return (
                                        <div key={stage} className="flex items-center">
                                            <div className="flex flex-col items-center">
                                                <div
                                                    className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold text-sm ${isCompleted || isCurrent
                                                            ? "bg-gradient-to-br from-rose-500 to-purple-600 text-white"
                                                            : "bg-muted text-muted-foreground"
                                                        } ${isCurrent ? "ring-4 ring-rose-500/20" : ""}`}
                                                >
                                                    {isCompleted ? "✓" : index + 1}
                                                </div>
                                                <p className={`text-xs mt-2 ${isCurrent ? "font-semibold text-rose-500" : "text-muted-foreground"}`}>
                                                    {stage}
                                                </p>
                                            </div>
                                            {index < 5 && (
                                                <div
                                                    className={`w-8 md:w-16 h-1 mx-1 rounded ${isCompleted ? "bg-gradient-to-r from-rose-500 to-purple-600" : "bg-muted"
                                                        }`}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
