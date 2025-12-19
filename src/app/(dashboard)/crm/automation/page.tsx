"use client";

import { useState } from "react";
import {
    Workflow,
    Mail,
    MessageSquare,
    Phone,
    Target,
    Users,
    Clock,
    Play,
    Pause,
    Plus,
    Settings,
    ChevronRight,
    Zap,
    BarChart3,
    ArrowUpRight,
    Edit,
    Trash2,
    Copy,
    MoreHorizontal,
    Filter,
    Calendar,
    Send,
    Bot,
    Sparkles,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data
const automationCampaigns = [
    {
        id: "1",
        name: "MBA Welcome Series",
        description: "7-day email sequence for new MBA inquiries",
        status: "active",
        type: "email",
        triggers: "New Lead (MBA)",
        leadsInFlow: 245,
        conversions: 32,
        conversionRate: 13.1,
        steps: 7,
        lastRun: "2 mins ago",
    },
    {
        id: "2",
        name: "Abandoned Application Reminder",
        description: "WhatsApp reminders for incomplete applications",
        status: "active",
        type: "whatsapp",
        triggers: "Application Started",
        leadsInFlow: 128,
        conversions: 45,
        conversionRate: 35.2,
        steps: 4,
        lastRun: "5 mins ago",
    },
    {
        id: "3",
        name: "Event Follow-up Campaign",
        description: "Multi-channel follow-up after education fair",
        status: "paused",
        type: "multi",
        triggers: "Event Attendance",
        leadsInFlow: 89,
        conversions: 12,
        conversionRate: 13.5,
        steps: 5,
        lastRun: "2 days ago",
    },
    {
        id: "4",
        name: "Re-engagement Campaign",
        description: "Reactivate cold leads with special offers",
        status: "active",
        type: "sms",
        triggers: "Cold Lead (30 days)",
        leadsInFlow: 412,
        conversions: 28,
        conversionRate: 6.8,
        steps: 3,
        lastRun: "1 hour ago",
    },
];

const emailTemplates = [
    { id: "1", name: "Welcome Email", opens: 68, clicks: 24, category: "Onboarding" },
    { id: "2", name: "Course Brochure", opens: 72, clicks: 31, category: "Information" },
    { id: "3", name: "Application Reminder", opens: 58, clicks: 42, category: "Conversion" },
    { id: "4", name: "Scholarship Alert", opens: 82, clicks: 45, category: "Promotion" },
    { id: "5", name: "Deadline Reminder", opens: 75, clicks: 38, category: "Urgency" },
];

const automationStats = [
    { label: "Active Campaigns", value: "12", icon: Play, color: "from-emerald-500 to-emerald-600" },
    { label: "Leads in Automation", value: "2,847", icon: Users, color: "from-blue-500 to-blue-600" },
    { label: "Messages Sent Today", value: "1,245", icon: Send, color: "from-purple-500 to-purple-600" },
    { label: "Automation Rate", value: "78%", icon: Zap, color: "from-amber-500 to-amber-600" },
];

function getTypeIcon(type: string) {
    switch (type) {
        case "email":
            return <Mail className="h-4 w-4" />;
        case "whatsapp":
            return <MessageSquare className="h-4 w-4" />;
        case "sms":
            return <Phone className="h-4 w-4" />;
        case "multi":
            return <Workflow className="h-4 w-4" />;
        default:
            return <Mail className="h-4 w-4" />;
    }
}

function getTypeColor(type: string) {
    switch (type) {
        case "email":
            return "bg-purple-500/10 text-purple-500 border-purple-500/20";
        case "whatsapp":
            return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
        case "sms":
            return "bg-blue-500/10 text-blue-500 border-blue-500/20";
        case "multi":
            return "bg-amber-500/10 text-amber-500 border-amber-500/20";
        default:
            return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
}

export default function AutomationPage() {
    const [activeTab, setActiveTab] = useState("campaigns");

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
                        Marketing Automation
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Automate nurturing workflows to boost conversions
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2">
                        <Calendar className="h-4 w-4" />
                        Schedule
                    </Button>
                    <Button className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 gap-2">
                        <Plus className="h-4 w-4" />
                        Create Automation
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {automationStats.map((stat, index) => (
                    <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`} />
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                                    <stat.icon className="h-6 w-6 text-white" />
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

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-muted/30">
                    <TabsTrigger value="campaigns" className="gap-2">
                        <Workflow className="h-4 w-4" />
                        Campaigns
                    </TabsTrigger>
                    <TabsTrigger value="templates" className="gap-2">
                        <Mail className="h-4 w-4" />
                        Email Templates
                    </TabsTrigger>
                    <TabsTrigger value="builder" className="gap-2">
                        <Sparkles className="h-4 w-4" />
                        Workflow Builder
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="campaigns" className="mt-6 space-y-4">
                    {automationCampaigns.map((campaign) => (
                        <Card key={campaign.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-xl ${getTypeColor(campaign.type)}`}>
                                            {getTypeIcon(campaign.type)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-semibold text-lg">{campaign.name}</h3>
                                                {campaign.status === "active" ? (
                                                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                                                        <Play className="h-3 w-3 mr-1" />
                                                        Active
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                                                        <Pause className="h-3 w-3 mr-1" />
                                                        Paused
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">{campaign.description}</p>
                                            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Target className="h-4 w-4" />
                                                    Trigger: {campaign.triggers}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Workflow className="h-4 w-4" />
                                                    {campaign.steps} steps
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    Last run: {campaign.lastRun}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="gap-2">
                                                <Edit className="h-4 w-4" />
                                                Edit Campaign
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="gap-2">
                                                <Copy className="h-4 w-4" />
                                                Duplicate
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="gap-2">
                                                <BarChart3 className="h-4 w-4" />
                                                View Analytics
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="gap-2 text-red-500">
                                                <Trash2 className="h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Stats Row */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-blue-500">{campaign.leadsInFlow}</p>
                                        <p className="text-xs text-muted-foreground">Leads in Flow</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-emerald-500">{campaign.conversions}</p>
                                        <p className="text-xs text-muted-foreground">Conversions</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-purple-500">{campaign.conversionRate}%</p>
                                        <p className="text-xs text-muted-foreground">Conversion Rate</p>
                                    </div>
                                    <div className="flex items-center justify-center gap-2">
                                        <Button variant="outline" size="sm" className="gap-1">
                                            {campaign.status === "active" ? (
                                                <>
                                                    <Pause className="h-4 w-4" />
                                                    Pause
                                                </>
                                            ) : (
                                                <>
                                                    <Play className="h-4 w-4" />
                                                    Resume
                                                </>
                                            )}
                                        </Button>
                                        <Button size="sm" className="gap-1">
                                            <BarChart3 className="h-4 w-4" />
                                            Analytics
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="templates" className="mt-6">
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg font-semibold">Email Templates</CardTitle>
                                    <CardDescription>Pre-built templates for your campaigns</CardDescription>
                                </div>
                                <Button className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Create Template
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {emailTemplates.map((template) => (
                                    <Card key={template.id} className="border hover:border-rose-500/50 transition-colors cursor-pointer group">
                                        <CardContent className="p-4">
                                            <div className="h-24 bg-gradient-to-br from-muted/50 to-muted rounded-lg mb-4 flex items-center justify-center">
                                                <Mail className="h-8 w-8 text-muted-foreground group-hover:text-rose-500 transition-colors" />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium">{template.name}</p>
                                                    <Badge variant="outline" className="text-xs mt-1">
                                                        {template.category}
                                                    </Badge>
                                                </div>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className="flex items-center gap-4 mt-3 text-sm">
                                                <span className="text-emerald-500">{template.opens}% opens</span>
                                                <span className="text-blue-500">{template.clicks}% clicks</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="builder" className="mt-6">
                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-12">
                            <div className="text-center">
                                <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center mb-6">
                                    <Workflow className="h-10 w-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Visual Workflow Builder</h3>
                                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                                    Create powerful automation workflows with our drag-and-drop builder.
                                    Design multi-step sequences across Email, SMS, and WhatsApp.
                                </p>
                                <div className="flex items-center justify-center gap-4">
                                    <Button size="lg" className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 gap-2">
                                        <Plus className="h-5 w-5" />
                                        Create New Workflow
                                    </Button>
                                    <Button size="lg" variant="outline" className="gap-2">
                                        <Sparkles className="h-5 w-5" />
                                        Use Template
                                    </Button>
                                </div>

                                {/* Feature Preview */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                                    <div className="p-6 rounded-xl bg-muted/30 text-left">
                                        <div className="p-3 rounded-lg bg-blue-500/10 w-fit mb-4">
                                            <Mail className="h-6 w-6 text-blue-500" />
                                        </div>
                                        <h4 className="font-semibold mb-2">Drip Campaigns</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Automate email sequences based on lead behavior and stage
                                        </p>
                                    </div>
                                    <div className="p-6 rounded-xl bg-muted/30 text-left">
                                        <div className="p-3 rounded-lg bg-emerald-500/10 w-fit mb-4">
                                            <MessageSquare className="h-6 w-6 text-emerald-500" />
                                        </div>
                                        <h4 className="font-semibold mb-2">WhatsApp Integration</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Send rich media messages via verified WhatsApp Business API
                                        </p>
                                    </div>
                                    <div className="p-6 rounded-xl bg-muted/30 text-left">
                                        <div className="p-3 rounded-lg bg-purple-500/10 w-fit mb-4">
                                            <Bot className="h-6 w-6 text-purple-500" />
                                        </div>
                                        <h4 className="font-semibold mb-2">AI-Powered</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Use Niaa chatbot to nurture leads 24/7 automatically
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
