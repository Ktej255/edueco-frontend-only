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
import { Label } from "@/components/ui/label";
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
    RefreshCcw,
    MoreHorizontal,
    CheckCircle2,
    Users,
    ArrowRightLeft,
    Download
} from "lucide-react";
import { leadsApi } from "@/services/leads-api";
import { Lead } from "@/types/lead";
import api from "@/lib/api";

export default function LeadsPage() {
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
            // Fetch users who can be assigned leads (e.g., admins, teachers)
            // Using a generic user fetch for now, assuming role filter works
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
            // toast success
        } catch (error) {
            console.error("Failed to reassign", error);
        }
    };

    const verifyLead = async (id: number) => {
        try {
            await leadsApi.verifyLead(id, 'EMAIL'); // Defaulting to EMAIL for now
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
        <div className="p-8 space-y-8 bg-slate-950 min-h-screen text-slate-100">

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Lead Management</h1>
                    <p className="text-slate-400 mt-1">Centralize, track, and optimize your enrollments.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                        <Download className="mr-2 h-4 w-4" /> Export
                    </Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <UserPlus className="mr-2 h-4 w-4" /> Add Lead
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 bg-slate-900 border-slate-800">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-semibold">Total Leads</p>
                            <h3 className="text-2xl font-bold text-white mt-1">{totalLeads}</h3>
                        </div>
                        <Users className="h-5 w-5 text-blue-500" />
                    </div>
                </Card>
                <Card className="p-4 bg-slate-900 border-slate-800">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-semibold">New Leads</p>
                            <h3 className="text-2xl font-bold text-white mt-1">{newLeads}</h3>
                        </div>
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                </Card>
                <Card className="p-4 bg-slate-900 border-slate-800">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-semibold">Conversion Rate</p>
                            <h3 className="text-2xl font-bold text-white mt-1">
                                {totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0}%
                            </h3>
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    </div>
                </Card>
                <Card className="p-4 bg-slate-900 border-slate-800">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-semibold">Unassigned</p>
                            <h3 className="text-2xl font-bold text-white mt-1">
                                {leads.filter(l => !l.assigned_to_id).length}
                            </h3>
                        </div>
                        <ArrowRightLeft className="h-5 w-5 text-orange-500" />
                    </div>
                </Card>
            </div>

            {/* Filters & Actions */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                <div className="flex gap-4 items-center flex-1">
                    <div className="relative w-72">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                        <Input
                            placeholder="Search by name, email, phone..."
                            className="pl-8 bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500 focus-visible:ring-emerald-500"
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                    </div>

                    <Select
                        value={filters.status}
                        onValueChange={(val) => setFilters({ ...filters, status: val })}
                    >
                        <SelectTrigger className="w-[180px] bg-slate-900 border-slate-700 text-slate-100">
                            <div className="flex items-center gap-2">
                                <Filter className="h-3 w-3" />
                                <SelectValue placeholder="Status" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
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
                        <span className="text-sm text-slate-400">{selectedLeads.length} selected</span>
                        <Dialog open={isReassignOpen} onOpenChange={setIsReassignOpen}>
                            <DialogTrigger asChild>
                                <Button variant="secondary" className="bg-indigo-600 hover:bg-indigo-700 text-white border-0">
                                    <ArrowRightLeft className="mr-2 h-4 w-4" /> Reassign Selected
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-slate-900 border-slate-800 text-white">
                                <DialogHeader>
                                    <DialogTitle>Bulk Reassign Leads</DialogTitle>
                                </DialogHeader>
                                <div className="py-4 space-y-4">
                                    <p className="text-slate-400">
                                        Assigning <strong>{selectedLeads.length}</strong> leads to:
                                    </p>
                                    <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
                                        <SelectTrigger className="bg-slate-800 border-slate-700">
                                            <SelectValue placeholder="Select Team Member" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                            {assignees.map(user => (
                                                <SelectItem key={user.id} value={user.id.toString()}>
                                                    {user.full_name || user.email}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <DialogFooter>
                                    <Button variant="ghost" onClick={() => setIsReassignOpen(false)} className="text-slate-400 hover:text-white hover:bg-slate-800">Cancel</Button>
                                    <Button onClick={handleBulkReassign} className="bg-emerald-600 hover:bg-emerald-700">
                                        Confirm Reassignment
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
            </div>

            {/* Main Table */}
            <Card className="bg-slate-900 border-slate-800 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-950">
                        <TableRow className="border-slate-800 hover:bg-slate-950">
                            <TableHead className="w-[50px]">
                                <input
                                    type="checkbox"
                                    className="rounded border-slate-600 bg-slate-900"
                                    checked={leads.length > 0 && selectedLeads.length === leads.length}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                />
                            </TableHead>
                            <TableHead className="text-slate-400">Name</TableHead>
                            <TableHead className="text-slate-400">Contact</TableHead>
                            <TableHead className="text-slate-400">Status</TableHead>
                            <TableHead className="text-slate-400">Source</TableHead>
                            <TableHead className="text-slate-400">Verification</TableHead>
                            <TableHead className="text-slate-400">Assigned To</TableHead>
                            <TableHead className="text-right text-slate-400">Actions</TableHead>
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
                                <TableRow key={lead.id} className="border-slate-800 hover:bg-slate-800/50">
                                    <TableCell>
                                        <input
                                            type="checkbox"
                                            className="rounded border-slate-600 bg-slate-900"
                                            checked={selectedLeads.includes(lead.id)}
                                            onChange={(e) => handleSelectLead(lead.id, e.target.checked)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium text-white">{lead.name}</div>
                                        <div className="text-xs text-slate-500">Added {new Date(lead.created_at).toLocaleDateString()}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm text-slate-300">{lead.email}</div>
                                        <div className="text-xs text-slate-500">{lead.phone || '-'}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`
                                    ${lead.status === 'NEW' ? 'border-blue-500 text-blue-400' : ''}
                                    ${lead.status === 'CONTACTED' ? 'border-yellow-500 text-yellow-400' : ''}
                                    ${lead.status === 'ENROLLED' ? 'border-emerald-500 text-emerald-400 bg-emerald-950' : ''}
                                    border
                                `}>
                                            {lead.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 w-fit">
                                                PRI: {lead.source_primary || 'Direct'}
                                            </span>
                                            {lead.source_secondary && (
                                                <span className="text-[10px] opacity-70">
                                                    SEC: {lead.source_secondary}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {lead.is_verified ? (
                                            <div className="flex items-center gap-1 text-emerald-400 text-xs">
                                                <CheckCircle2 className="h-3 w-3" />
                                                Verified
                                            </div>
                                        ) : (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 text-xs text-slate-500 hover:text-emerald-400"
                                                onClick={() => verifyLead(lead.id)}
                                            >
                                                Verify Now
                                            </Button>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {lead.assigned_to_id ? (
                                            // Normally we would find the user in assignees, but for speed just showing ID or if joined
                                            <div className="flex items-center gap-2">
                                                <div className="h-6 w-6 rounded-full bg-indigo-900 flex items-center justify-center text-xs text-white">
                                                    {assignees.find(u => u.id === lead.assigned_to_id)?.full_name?.[0] || 'U'}
                                                </div>
                                                <span className="text-sm text-slate-300">
                                                    {assignees.find(u => u.id === lead.assigned_to_id)?.full_name || `User ${lead.assigned_to_id}`}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-600 italic">Unassigned</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
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
