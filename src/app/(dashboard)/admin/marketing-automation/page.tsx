"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Workflow,
    Mail,
    MessageSquare,
    Bell,
    Phone,
    Plus,
    Play,
    Pause,
    Settings,
    BarChart3,
    Send,
    Users,
    Zap,
    Clock,
    CheckCircle,
    AlertCircle,
    TrendingUp,
    FileText,
} from "lucide-react";
import api from "@/lib/api";

interface Template {
    id: number;
    name: string;
    channel: string;
    subject?: string;
    body: string;
    category?: string;
    is_active: boolean;
}

interface WorkflowSummary {
    id: number;
    name: string;
    status: string;
    trigger_type: string;
    total_enrolled: number;
    total_completed: number;
    total_converted: number;
    steps_count: number;
    created_at: string;
}

interface ChannelAnalytics {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    delivery_rate: number;
    open_rate: number;
    click_rate: number;
}

interface Dashboard {
    total_workflows: number;
    active_workflows: number;
    total_templates: number;
    leads_in_workflows: number;
    email_analytics: ChannelAnalytics;
    sms_analytics: ChannelAnalytics;
    whatsapp_analytics: ChannelAnalytics;
    push_analytics: ChannelAnalytics;
    top_workflows: WorkflowSummary[];
}

const channelIcons: Record<string, React.ReactNode> = {
    EMAIL: <Mail className="h-4 w-4" />,
    SMS: <MessageSquare className="h-4 w-4" />,
    WHATSAPP: <Phone className="h-4 w-4" />,
    PUSH: <Bell className="h-4 w-4" />,
};

const statusColors: Record<string, string> = {
    DRAFT: "bg-slate-700 text-slate-300",
    ACTIVE: "bg-emerald-900 text-emerald-300",
    PAUSED: "bg-amber-900 text-amber-300",
    ARCHIVED: "bg-red-900 text-red-300",
};

const triggerLabels: Record<string, string> = {
    LEAD_CREATED: "Lead Created",
    LEAD_UPDATED: "Lead Updated",
    STAGE_CHANGED: "Stage Changed",
    FIELD_UPDATE: "Field Update",
    TIME_DELAY: "Time-based",
    SPECIFIC_DATE: "Specific Date",
    USER_ACTIVITY: "User Activity",
    MANUAL: "Manual Trigger",
};

export default function MarketingAutomationPage() {
    const [dashboard, setDashboard] = useState<Dashboard | null>(null);
    const [workflows, setWorkflows] = useState<WorkflowSummary[]>([]);
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [newWorkflow, setNewWorkflow] = useState({
        name: "",
        description: "",
        trigger_type: "LEAD_CREATED",
    });
    const [newTemplate, setNewTemplate] = useState({
        name: "",
        channel: "EMAIL",
        subject: "",
        body: "",
        category: "general",
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [dashboardRes, workflowsRes, templatesRes] = await Promise.all([
                api.get("/marketing-automation/dashboard"),
                api.get("/marketing-automation/workflows"),
                api.get("/marketing-automation/templates"),
            ]);
            setDashboard(dashboardRes.data);
            setWorkflows(workflowsRes.data);
            setTemplates(templatesRes.data);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateWorkflow = async () => {
        try {
            await api.post("/marketing-automation/workflows", newWorkflow);
            setIsWorkflowModalOpen(false);
            setNewWorkflow({ name: "", description: "", trigger_type: "LEAD_CREATED" });
            fetchData();
        } catch (error) {
            console.error("Failed to create workflow", error);
        }
    };

    const handleCreateTemplate = async () => {
        try {
            await api.post("/marketing-automation/templates", newTemplate);
            setIsTemplateModalOpen(false);
            setNewTemplate({ name: "", channel: "EMAIL", subject: "", body: "", category: "general" });
            fetchData();
        } catch (error) {
            console.error("Failed to create template", error);
        }
    };

    const handleToggleWorkflow = async (workflow: WorkflowSummary) => {
        try {
            const endpoint = workflow.status === "ACTIVE"
                ? `/marketing-automation/workflows/${workflow.id}/pause`
                : `/marketing-automation/workflows/${workflow.id}/activate`;
            await api.post(endpoint);
            fetchData();
        } catch (error) {
            console.error("Failed to toggle workflow", error);
        }
    };

    const renderChannelCard = (channel: string, analytics: ChannelAnalytics, icon: React.ReactNode, color: string) => (
        <Card className={`p-4 bg-gradient-to-br ${color} border-0`}>
            <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white/10 rounded-lg">{icon}</div>
                <span className="font-semibold text-white">{channel}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                    <span className="text-white/60">Sent</span>
                    <p className="font-bold text-white">{analytics.sent}</p>
                </div>
                <div>
                    <span className="text-white/60">Delivered</span>
                    <p className="font-bold text-white">{analytics.delivered}</p>
                </div>
                <div>
                    <span className="text-white/60">Open Rate</span>
                    <p className="font-bold text-white">{analytics.open_rate.toFixed(1)}%</p>
                </div>
                <div>
                    <span className="text-white/60">Click Rate</span>
                    <p className="font-bold text-white">{analytics.click_rate.toFixed(1)}%</p>
                </div>
            </div>
        </Card>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-screen bg-slate-950">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 bg-slate-950 min-h-screen text-slate-100">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <Zap className="h-8 w-8 text-amber-400" />
                        Marketing Automation
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Create powerful drip campaigns and automate personalized engagement
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="border-slate-700 text-slate-300 hover:bg-slate-800"
                        onClick={() => setIsTemplateModalOpen(true)}
                    >
                        <FileText className="h-4 w-4 mr-2" /> New Template
                    </Button>
                    <Button
                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                        onClick={() => setIsWorkflowModalOpen(true)}
                    >
                        <Plus className="h-4 w-4 mr-2" /> Create Workflow
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 bg-slate-900 border-slate-800">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-semibold">Total Workflows</p>
                            <h3 className="text-2xl font-bold text-white mt-1">{dashboard?.total_workflows || 0}</h3>
                        </div>
                        <Workflow className="h-5 w-5 text-violet-500" />
                    </div>
                </Card>
                <Card className="p-4 bg-slate-900 border-slate-800">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-semibold">Active Workflows</p>
                            <h3 className="text-2xl font-bold text-emerald-400 mt-1">{dashboard?.active_workflows || 0}</h3>
                        </div>
                        <Play className="h-5 w-5 text-emerald-500" />
                    </div>
                </Card>
                <Card className="p-4 bg-slate-900 border-slate-800">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-semibold">Templates</p>
                            <h3 className="text-2xl font-bold text-white mt-1">{dashboard?.total_templates || 0}</h3>
                        </div>
                        <FileText className="h-5 w-5 text-cyan-500" />
                    </div>
                </Card>
                <Card className="p-4 bg-slate-900 border-slate-800">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-semibold">Leads in Workflows</p>
                            <h3 className="text-2xl font-bold text-amber-400 mt-1">{dashboard?.leads_in_workflows || 0}</h3>
                        </div>
                        <Users className="h-5 w-5 text-amber-500" />
                    </div>
                </Card>
            </div>

            {/* Channel Performance */}
            <div>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-indigo-400" />
                    Channel Performance (Last 30 Days)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {renderChannelCard("Email", dashboard?.email_analytics || { sent: 0, delivered: 0, opened: 0, clicked: 0, delivery_rate: 0, open_rate: 0, click_rate: 0 }, <Mail className="h-5 w-5 text-white" />, "from-blue-900 to-blue-700")}
                    {renderChannelCard("SMS", dashboard?.sms_analytics || { sent: 0, delivered: 0, opened: 0, clicked: 0, delivery_rate: 0, open_rate: 0, click_rate: 0 }, <MessageSquare className="h-5 w-5 text-white" />, "from-green-900 to-green-700")}
                    {renderChannelCard("WhatsApp", dashboard?.whatsapp_analytics || { sent: 0, delivered: 0, opened: 0, clicked: 0, delivery_rate: 0, open_rate: 0, click_rate: 0 }, <Phone className="h-5 w-5 text-white" />, "from-emerald-900 to-emerald-700")}
                    {renderChannelCard("Push", dashboard?.push_analytics || { sent: 0, delivered: 0, opened: 0, clicked: 0, delivery_rate: 0, open_rate: 0, click_rate: 0 }, <Bell className="h-5 w-5 text-white" />, "from-purple-900 to-purple-700")}
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="workflows" className="space-y-4">
                <TabsList className="bg-slate-900 border border-slate-800">
                    <TabsTrigger value="workflows" className="data-[state=active]:bg-slate-800">
                        <Workflow className="h-4 w-4 mr-2" /> Workflows
                    </TabsTrigger>
                    <TabsTrigger value="templates" className="data-[state=active]:bg-slate-800">
                        <FileText className="h-4 w-4 mr-2" /> Templates
                    </TabsTrigger>
                </TabsList>

                {/* Workflows Tab */}
                <TabsContent value="workflows" className="space-y-4">
                    <Card className="bg-slate-900 border-slate-800 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-950">
                                <TableRow className="border-slate-800">
                                    <TableHead className="text-slate-400">Workflow</TableHead>
                                    <TableHead className="text-slate-400">Trigger</TableHead>
                                    <TableHead className="text-slate-400">Status</TableHead>
                                    <TableHead className="text-slate-400">Steps</TableHead>
                                    <TableHead className="text-slate-400">Enrolled</TableHead>
                                    <TableHead className="text-slate-400">Converted</TableHead>
                                    <TableHead className="text-right text-slate-400">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {workflows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                                            No workflows yet. Create your first automation workflow!
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    workflows.map((workflow) => (
                                        <TableRow key={workflow.id} className="border-slate-800 hover:bg-slate-800/50">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                                                        <Workflow className="h-5 w-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-white">{workflow.name}</div>
                                                        <div className="text-xs text-slate-500">ID: {workflow.id}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="border-slate-600 text-slate-300">
                                                    <Zap className="h-3 w-3 mr-1" />
                                                    {triggerLabels[workflow.trigger_type] || workflow.trigger_type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={statusColors[workflow.status]}>
                                                    {workflow.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-slate-300">{workflow.steps_count} steps</span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-slate-300">{workflow.total_enrolled}</span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-emerald-400 font-medium">{workflow.total_converted}</span>
                                                    {workflow.total_enrolled > 0 && (
                                                        <span className="text-xs text-slate-500">
                                                            ({((workflow.total_converted / workflow.total_enrolled) * 100).toFixed(1)}%)
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className={`h-8 ${workflow.status === "ACTIVE" ? "text-amber-400 hover:text-amber-300" : "text-emerald-400 hover:text-emerald-300"}`}
                                                        onClick={() => handleToggleWorkflow(workflow)}
                                                    >
                                                        {workflow.status === "ACTIVE" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 text-slate-400 hover:text-white"
                                                    >
                                                        <Settings className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                {/* Templates Tab */}
                <TabsContent value="templates" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {templates.length === 0 ? (
                            <Card className="col-span-3 p-8 bg-slate-900 border-slate-800 text-center">
                                <FileText className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                                <p className="text-slate-400">No templates yet. Create your first communication template!</p>
                            </Card>
                        ) : (
                            templates.map((template) => (
                                <Card key={template.id} className="p-4 bg-slate-900 border-slate-800 hover:border-slate-700 transition-all">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className={`p-2 rounded-lg ${template.channel === "EMAIL" ? "bg-blue-900" :
                                                    template.channel === "SMS" ? "bg-green-900" :
                                                        template.channel === "WHATSAPP" ? "bg-emerald-900" :
                                                            "bg-purple-900"
                                                }`}>
                                                {channelIcons[template.channel]}
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-white">{template.name}</h4>
                                                <span className="text-xs text-slate-500">{template.channel}</span>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                                            {template.category || "General"}
                                        </Badge>
                                    </div>
                                    {template.subject && (
                                        <p className="text-sm text-slate-400 mb-2 truncate">
                                            <span className="text-slate-500">Subject:</span> {template.subject}
                                        </p>
                                    )}
                                    <p className="text-sm text-slate-500 line-clamp-2">{template.body}</p>
                                </Card>
                            ))
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Create Workflow Modal */}
            <Dialog open={isWorkflowModalOpen} onOpenChange={setIsWorkflowModalOpen}>
                <DialogContent className="bg-slate-900 border-slate-800 text-white">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Workflow className="h-5 w-5 text-violet-400" />
                            Create New Workflow
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label className="text-slate-300">Workflow Name</Label>
                            <Input
                                value={newWorkflow.name}
                                onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                                className="bg-slate-800 border-slate-700 text-white mt-1"
                                placeholder="e.g., Welcome Series"
                            />
                        </div>
                        <div>
                            <Label className="text-slate-300">Description</Label>
                            <Textarea
                                value={newWorkflow.description}
                                onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                                className="bg-slate-800 border-slate-700 text-white mt-1"
                                placeholder="Describe what this workflow does..."
                            />
                        </div>
                        <div>
                            <Label className="text-slate-300">Trigger Type</Label>
                            <Select
                                value={newWorkflow.trigger_type}
                                onValueChange={(value) => setNewWorkflow({ ...newWorkflow, trigger_type: value })}
                            >
                                <SelectTrigger className="bg-slate-800 border-slate-700 text-white mt-1">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700">
                                    <SelectItem value="LEAD_CREATED">Lead Created</SelectItem>
                                    <SelectItem value="STAGE_CHANGED">Stage Changed</SelectItem>
                                    <SelectItem value="FIELD_UPDATE">Field Update</SelectItem>
                                    <SelectItem value="MANUAL">Manual Trigger</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsWorkflowModalOpen(false)} className="text-slate-400">
                            Cancel
                        </Button>
                        <Button onClick={handleCreateWorkflow} className="bg-violet-600 hover:bg-violet-700">
                            Create Workflow
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Template Modal */}
            <Dialog open={isTemplateModalOpen} onOpenChange={setIsTemplateModalOpen}>
                <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-cyan-400" />
                            Create Communication Template
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-slate-300">Template Name</Label>
                                <Input
                                    value={newTemplate.name}
                                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                                    className="bg-slate-800 border-slate-700 text-white mt-1"
                                    placeholder="e.g., Welcome Email"
                                />
                            </div>
                            <div>
                                <Label className="text-slate-300">Channel</Label>
                                <Select
                                    value={newTemplate.channel}
                                    onValueChange={(value) => setNewTemplate({ ...newTemplate, channel: value })}
                                >
                                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white mt-1">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-700">
                                        <SelectItem value="EMAIL">Email</SelectItem>
                                        <SelectItem value="SMS">SMS</SelectItem>
                                        <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                                        <SelectItem value="PUSH">Push Notification</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        {newTemplate.channel === "EMAIL" && (
                            <div>
                                <Label className="text-slate-300">Subject</Label>
                                <Input
                                    value={newTemplate.subject}
                                    onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                                    className="bg-slate-800 border-slate-700 text-white mt-1"
                                    placeholder="Welcome to {{organization_name}}!"
                                />
                            </div>
                        )}
                        <div>
                            <Label className="text-slate-300">Message Body</Label>
                            <Textarea
                                value={newTemplate.body}
                                onChange={(e) => setNewTemplate({ ...newTemplate, body: e.target.value })}
                                className="bg-slate-800 border-slate-700 text-white mt-1 min-h-[150px]"
                                placeholder="Hi {{name}}, welcome to our platform!

Use tokens like {{name}}, {{email}}, {{course}} for personalization."
                            />
                        </div>
                        <div className="bg-slate-800 p-3 rounded-lg">
                            <p className="text-xs text-slate-400 mb-2">Available Personalization Tokens:</p>
                            <div className="flex flex-wrap gap-2">
                                {["{{name}}", "{{email}}", "{{phone}}", "{{course}}", "{{stage}}", "{{source}}"].map((token) => (
                                    <Badge
                                        key={token}
                                        variant="outline"
                                        className="text-xs border-slate-600 text-slate-300 cursor-pointer hover:bg-slate-700"
                                        onClick={() => setNewTemplate({ ...newTemplate, body: newTemplate.body + " " + token })}
                                    >
                                        {token}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsTemplateModalOpen(false)} className="text-slate-400">
                            Cancel
                        </Button>
                        <Button onClick={handleCreateTemplate} className="bg-cyan-600 hover:bg-cyan-700">
                            Create Template
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
