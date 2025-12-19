"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Search,
    Filter,
    UserPlus,
    MoreHorizontal,
    CheckCircle2,
    Users,
    ArrowRightLeft,
    Download
} from "lucide-react";
import { leadsApi } from "@/services/leads-api";
import { Lead } from "@/types/lead";
import api from "@/lib/api";

export default function TeacherLeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
    const [filters, setFilters] = useState({
        status: "ALL",
        search: "",
    });

    // Bulk Reassign State
    const [isReassignOpen, setIsReassignOpen] = useState(false);
    const [assignees, setAssignees] = useState<any[]>([]);
    const [selectedAssignee, setSelectedAssignee] = useState<string>("");

    useEffect(() => {
        fetchLeads();
        fetchAssignees();
    }, [filters]);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const apiFilters: any = {};
            if (filters.status !== "ALL") apiFilters.status = filters.status;
            if (filters.search) apiFilters.search = filters.search;

            const data = await leadsApi.getLeads(apiFilters);
            setLeads(data);
        } catch (error) {
            console.error("Failed to fetch leads", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAssignees = async () => {
        try {
            const response = await api.get("/users/", { params: { limit: 100 } });
            setAssignees(response.data);
        } catch (error) {
            console.error("Failed to fetch assignees", error);
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedLeads(leads.map((l) => l.id));
        } else {
            setSelectedLeads([]);
        }
    };

    const handleSelectLead = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedLeads([...selectedLeads, id]);
        } else {
            setSelectedLeads(selectedLeads.filter((lId) => lId !== id));
        }
    };

    const handleBulkReassign = async () => {
        if (!selectedAssignee || selectedLeads.length === 0) return;

        try {
            await leadsApi.bulkReassign(selectedLeads, parseInt(selectedAssignee));
            fetchLeads();
            setIsReassignOpen(false);
            setSelectedLeads([]);
        } catch (error) {
            console.error("Failed to reassign", error);
        }
    };

    const verifyLead = async (id: number) => {
        try {
            await leadsApi.verifyLead(id, 'EMAIL');
            fetchLeads();
        } catch (error) {
            console.error("Failed to verify", error);
        }
    }

    // Stats
    const totalLeads = leads.length;
    const newLeads = leads.filter(l => l.status === 'NEW').length;
    const convertedLeads = leads.filter(l => l.status === 'ENROLLED').length;

    return (
        <div className="p-8 space-y-8 bg-slate-50 min-h-screen text-slate-900">

            {/* Header - Light Mode for Teacher Portal usually, but checking style... keeping consistent with code but maybe light bg */}
            {/* Wait, the teacher portal in previous tasks seemed to be using similar dark or emerald themes. Let's use a conditional styling or just safe defaults.
          The user mentioned "Restoring Teacher Portal UI" and "Emerald design theme". Admin page was dark.
          I'll try to adapt to a cleaner, possibly light or emerald-light theme if that's the teacher portal vibe, 
          BUT looking at the specific `Card` usages in `admin/page.tsx` (dark mode classes), I'll stick to a dark theme for safety or make it neutral.
          Actually, `admin/page.tsx` had `bg-gradient-to-br from-emerald-900`. 
          Let's try to match the "Emerald" vibe.
      */}

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Leads</h1>
                    <p className="text-slate-500 mt-1">Manage inquiries and student enrollments.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="border-slate-300">
                        <Download className="mr-2 h-4 w-4" /> Export
                    </Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <UserPlus className="mr-2 h-4 w-4" /> Add Lead
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Total Leads</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalLeads}</h3>
                        </div>
                        <Users className="h-5 w-5 text-blue-600" />
                    </div>
                </Card>
                <Card className="p-4 border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">New Leads</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">{newLeads}</h3>
                        </div>
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                </Card>
                <Card className="p-4 border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Conversion Rate</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">
                                {totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0}%
                            </h3>
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    </div>
                </Card>
                <Card className="p-4 border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">My Pending</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">
                                {leads.filter(l => l.status !== 'CLOSED' && l.status !== 'ENROLLED').length}
                            </h3>
                        </div>
                        <ArrowRightLeft className="h-5 w-5 text-orange-500" />
                    </div>
                </Card>
            </div>

            {/* Filters & Actions */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex gap-4 items-center flex-1">
                    <div className="relative w-72">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search leads..."
                            className="pl-8 border-slate-200 focus-visible:ring-emerald-500"
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                    </div>

                    <Select
                        value={filters.status}
                        onValueChange={(val) => setFilters({ ...filters, status: val })}
                    >
                        <SelectTrigger className="w-[180px] border-slate-200">
                            <div className="flex items-center gap-2">
                                <Filter className="h-3 w-3 text-slate-500" />
                                <SelectValue placeholder="Status" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Statuses</SelectItem>
                            <SelectItem value="NEW">New</SelectItem>
                            <SelectItem value="CONTACTED">Contacted</SelectItem>
                            <SelectItem value="INTERESTED">Interested</SelectItem>
                            <SelectItem value="ENROLLED">Enrolled</SelectItem>
                            <SelectItem value="CLOSED">Closed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {selectedLeads.length > 0 && (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-5 duration-200">
                        <span className="text-sm text-slate-500">{selectedLeads.length} selected</span>
                        <Dialog open={isReassignOpen} onOpenChange={setIsReassignOpen}>
                            <DialogTrigger asChild>
                                <Button variant="secondary" className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border-0">
                                    <ArrowRightLeft className="mr-2 h-4 w-4" /> Transfer
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Transfer Leads</DialogTitle>
                                </DialogHeader>
                                <div className="py-4 space-y-4">
                                    <p className="text-slate-600">
                                        Transferring <strong>{selectedLeads.length}</strong> leads to:
                                    </p>
                                    <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Colleague" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {assignees.map(user => (
                                                <SelectItem key={user.id} value={user.id.toString()}>
                                                    {user.full_name || user.email}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <DialogFooter>
                                    <Button variant="ghost" onClick={() => setIsReassignOpen(false)}>Cancel</Button>
                                    <Button onClick={handleBulkReassign} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                        Confirm Transfer
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
            </div>

            {/* Main Table */}
            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow className="border-slate-200">
                            <TableHead className="w-[50px]">
                                <input
                                    type="checkbox"
                                    className="rounded border-slate-300"
                                    checked={leads.length > 0 && selectedLeads.length === leads.length}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                />
                            </TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Verification</TableHead>
                            <TableHead>Assigned To</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-10 text-slate-500">
                                    Loading leads...
                                </TableCell>
                            </TableRow>
                        ) : leads.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-10 text-slate-500">
                                    No leads found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            leads.map((lead) => (
                                <TableRow key={lead.id} className="border-slate-100 hover:bg-slate-50">
                                    <TableCell>
                                        <input
                                            type="checkbox"
                                            className="rounded border-slate-300"
                                            checked={selectedLeads.includes(lead.id)}
                                            onChange={(e) => handleSelectLead(lead.id, e.target.checked)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium text-slate-900">{lead.name}</div>
                                        <div className="text-xs text-slate-500">Added {new Date(lead.created_at).toLocaleDateString()}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm text-slate-700">{lead.email}</div>
                                        <div className="text-xs text-slate-500">{lead.phone || '-'}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`
                                    ${lead.status === 'NEW' ? 'border-blue-200 bg-blue-50 text-blue-700' : ''}
                                    ${lead.status === 'CONTACTED' ? 'border-yellow-200 bg-yellow-50 text-yellow-700' : ''}
                                    ${lead.status === 'ENROLLED' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : ''}
                                `}>
                                            {lead.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 w-fit border border-slate-200">
                                                PRI: {lead.source_primary || 'Direct'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {lead.is_verified ? (
                                            <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
                                                <CheckCircle2 className="h-3 w-3" />
                                                Verified
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-400">Unverified</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-slate-600">
                                            {assignees.find(u => u.id === lead.assigned_to_id)?.full_name || '-'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
