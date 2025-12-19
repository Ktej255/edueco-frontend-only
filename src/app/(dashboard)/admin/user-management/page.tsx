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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    Users,
    Shield,
    Eye,
    EyeOff,
    Activity,
    Ban,
    CheckCircle,
    Search,
    Settings2,
    Monitor,
    LogOut,
    Clock,
    Lock,
    Unlock,
} from "lucide-react";
import api from "@/lib/api";

interface User {
    id: number;
    email: string;
    full_name: string | null;
    role: string;
    is_active: boolean;
    is_banned: boolean;
    last_login: string | null;
    active_sessions: number;
    permissions: UserPermissions | null;
}

interface UserPermissions {
    can_view_leads: boolean;
    can_edit_leads: boolean;
    can_delete_leads: boolean;
    can_reassign_leads: boolean;
    can_export_leads: boolean;
    can_manage_users: boolean;
    can_view_activity_logs: boolean;
    can_manage_permissions: boolean;
    can_send_emails: boolean;
    can_send_sms: boolean;
    can_make_calls: boolean;
    can_view_reports: boolean;
    can_export_reports: boolean;
    can_view_analytics: boolean;
    can_view_payments: boolean;
    can_process_refunds: boolean;
}

interface ActivityLog {
    id: number;
    user_id: number;
    action: string;
    details: string | null;
    timestamp: string;
}

interface DataMaskingConfig {
    id: number;
    role: string | null;
    user_id: number | null;
    mask_email: boolean;
    mask_phone: boolean;
    mask_address: boolean;
    mask_financial: boolean;
    masking_pattern: string;
    is_active: boolean;
}

interface Stats {
    total_users: number;
    active_users: number;
    banned_users: number;
    users_by_role: Record<string, number>;
    active_sessions: number;
    recent_activities: ActivityLog[];
}

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
    const [maskingConfigs, setMaskingConfigs] = useState<DataMaskingConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
    const [editingPermissions, setEditingPermissions] = useState<Partial<UserPermissions>>({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, statsRes, logsRes, maskingRes] = await Promise.all([
                api.get("/admin/user-management/users"),
                api.get("/admin/user-management/stats"),
                api.get("/admin/user-management/activity-logs?limit=50"),
                api.get("/admin/user-management/data-masking"),
            ]);
            setUsers(usersRes.data);
            setStats(statsRes.data);
            setActivityLogs(logsRes.data);
            setMaskingConfigs(maskingRes.data);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBanUser = async (userId: number, isBanned: boolean) => {
        try {
            if (isBanned) {
                await api.post(`/admin/user-management/users/${userId}/unban`);
            } else {
                await api.post(`/admin/user-management/users/${userId}/ban`);
            }
            fetchData();
        } catch (error) {
            console.error("Failed to update user status", error);
        }
    };

    const handleUpdatePermissions = async () => {
        if (!selectedUser) return;
        try {
            await api.put(`/admin/user-management/permissions/${selectedUser.id}`, editingPermissions);
            setIsPermissionsOpen(false);
            fetchData();
        } catch (error) {
            console.error("Failed to update permissions", error);
        }
    };

    const openPermissionsDialog = (user: User) => {
        setSelectedUser(user);
        setEditingPermissions(user.permissions || {});
        setIsPermissionsOpen(true);
    };

    const filteredUsers = users.filter(
        (u) =>
            u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 bg-slate-950 min-h-screen text-slate-100">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Advanced User Management
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Manage users, permissions, data masking, and activity logs
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card className="p-4 bg-slate-900 border-slate-800">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-semibold">Total Users</p>
                            <h3 className="text-2xl font-bold text-white mt-1">{stats?.total_users || 0}</h3>
                        </div>
                        <Users className="h-5 w-5 text-blue-500" />
                    </div>
                </Card>
                <Card className="p-4 bg-slate-900 border-slate-800">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-semibold">Active Users</p>
                            <h3 className="text-2xl font-bold text-emerald-400 mt-1">{stats?.active_users || 0}</h3>
                        </div>
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                    </div>
                </Card>
                <Card className="p-4 bg-slate-900 border-slate-800">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-semibold">Banned Users</p>
                            <h3 className="text-2xl font-bold text-red-400 mt-1">{stats?.banned_users || 0}</h3>
                        </div>
                        <Ban className="h-5 w-5 text-red-500" />
                    </div>
                </Card>
                <Card className="p-4 bg-slate-900 border-slate-800">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-semibold">Active Sessions</p>
                            <h3 className="text-2xl font-bold text-white mt-1">{stats?.active_sessions || 0}</h3>
                        </div>
                        <Monitor className="h-5 w-5 text-indigo-500" />
                    </div>
                </Card>
                <Card className="p-4 bg-slate-900 border-slate-800">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-semibold">Masking Rules</p>
                            <h3 className="text-2xl font-bold text-white mt-1">{maskingConfigs.length}</h3>
                        </div>
                        <EyeOff className="h-5 w-5 text-amber-500" />
                    </div>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="users" className="space-y-4">
                <TabsList className="bg-slate-900 border border-slate-800">
                    <TabsTrigger value="users" className="data-[state=active]:bg-slate-800">
                        <Users className="h-4 w-4 mr-2" /> Users
                    </TabsTrigger>
                    <TabsTrigger value="masking" className="data-[state=active]:bg-slate-800">
                        <EyeOff className="h-4 w-4 mr-2" /> Data Masking
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="data-[state=active]:bg-slate-800">
                        <Activity className="h-4 w-4 mr-2" /> Activity Logs
                    </TabsTrigger>
                </TabsList>

                {/* Users Tab */}
                <TabsContent value="users" className="space-y-4">
                    <div className="flex gap-4 items-center">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                            <Input
                                placeholder="Search users..."
                                className="pl-8 bg-slate-900 border-slate-700 text-slate-100"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <Card className="bg-slate-900 border-slate-800 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-950">
                                <TableRow className="border-slate-800">
                                    <TableHead className="text-slate-400">User</TableHead>
                                    <TableHead className="text-slate-400">Role</TableHead>
                                    <TableHead className="text-slate-400">Status</TableHead>
                                    <TableHead className="text-slate-400">Sessions</TableHead>
                                    <TableHead className="text-slate-400">Last Login</TableHead>
                                    <TableHead className="text-right text-slate-400">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.id} className="border-slate-800 hover:bg-slate-800/50">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm">
                                                    {user.full_name?.[0] || user.email[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-white">{user.full_name || "N/A"}</div>
                                                    <div className="text-xs text-slate-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`
                          ${user.role === "admin" ? "border-red-500 text-red-400" : ""}
                          ${user.role === "teacher" ? "border-emerald-500 text-emerald-400" : ""}
                          ${user.role === "student" ? "border-blue-500 text-blue-400" : ""}
                        `}
                                            >
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {user.is_banned ? (
                                                <Badge variant="destructive" className="bg-red-900 text-red-200">
                                                    Banned
                                                </Badge>
                                            ) : user.is_active ? (
                                                <Badge className="bg-emerald-900 text-emerald-200 border-0">Active</Badge>
                                            ) : (
                                                <Badge variant="secondary">Inactive</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-slate-400">
                                                <Monitor className="h-3 w-3" />
                                                {user.active_sessions}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm text-slate-400">
                                                {user.last_login
                                                    ? new Date(user.last_login).toLocaleDateString()
                                                    : "Never"}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 text-slate-400 hover:text-white"
                                                    onClick={() => openPermissionsDialog(user)}
                                                >
                                                    <Shield className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className={`h-8 ${user.is_banned ? "text-emerald-400 hover:text-emerald-300" : "text-red-400 hover:text-red-300"}`}
                                                    onClick={() => handleBanUser(user.id, user.is_banned)}
                                                >
                                                    {user.is_banned ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                {/* Data Masking Tab */}
                <TabsContent value="masking" className="space-y-4">
                    <Card className="p-6 bg-slate-900 border-slate-800">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <EyeOff className="h-5 w-5 text-amber-500" />
                            Data Masking Configuration
                        </h3>
                        <p className="text-slate-400 mb-6">
                            Configure which fields should be masked for different roles. Masked data will appear
                            as "***" or partial values to users without proper permissions.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="p-4 bg-slate-800 border-slate-700">
                                <h4 className="font-medium text-white mb-4">Counselor Role</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-slate-300">Mask Email Addresses</Label>
                                        <Switch />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label className="text-slate-300">Mask Phone Numbers</Label>
                                        <Switch />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label className="text-slate-300">Mask Financial Data</Label>
                                        <Switch defaultChecked />
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-4 bg-slate-800 border-slate-700">
                                <h4 className="font-medium text-white mb-4">Marketing Team</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-slate-300">Mask Email Addresses</Label>
                                        <Switch defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label className="text-slate-300">Mask Phone Numbers</Label>
                                        <Switch defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label className="text-slate-300">Mask Financial Data</Label>
                                        <Switch defaultChecked />
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </Card>
                </TabsContent>

                {/* Activity Logs Tab */}
                <TabsContent value="activity" className="space-y-4">
                    <Card className="bg-slate-900 border-slate-800 overflow-hidden">
                        <div className="p-4 border-b border-slate-800">
                            <h3 className="font-semibold text-white flex items-center gap-2">
                                <Activity className="h-5 w-5 text-emerald-500" />
                                Recent Activity
                            </h3>
                        </div>
                        <div className="divide-y divide-slate-800 max-h-[500px] overflow-y-auto">
                            {activityLogs.map((log) => (
                                <div key={log.id} className="p-4 hover:bg-slate-800/50">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                                                    {log.action}
                                                </Badge>
                                                <span className="text-xs text-slate-500">User #{log.user_id}</span>
                                            </div>
                                            {log.details && (
                                                <p className="text-sm text-slate-400 mt-1">{log.details}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-slate-500">
                                            <Clock className="h-3 w-3" />
                                            {new Date(log.timestamp).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {activityLogs.length === 0 && (
                                <div className="p-8 text-center text-slate-500">No activity logs found</div>
                            )}
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Permissions Dialog */}
            <Dialog open={isPermissionsOpen} onOpenChange={setIsPermissionsOpen}>
                <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-indigo-400" />
                            Edit Permissions for {selectedUser?.full_name || selectedUser?.email}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-6 max-h-[60vh] overflow-y-auto">
                        {/* Lead Permissions */}
                        <div>
                            <h4 className="font-medium text-slate-300 mb-3">Lead Management</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { key: "can_view_leads", label: "View Leads" },
                                    { key: "can_edit_leads", label: "Edit Leads" },
                                    { key: "can_delete_leads", label: "Delete Leads" },
                                    { key: "can_reassign_leads", label: "Reassign Leads" },
                                    { key: "can_export_leads", label: "Export Leads" },
                                ].map((perm) => (
                                    <div key={perm.key} className="flex items-center justify-between bg-slate-800 p-2 rounded">
                                        <Label className="text-slate-300 text-sm">{perm.label}</Label>
                                        <Switch
                                            checked={(editingPermissions as any)[perm.key] || false}
                                            onCheckedChange={(checked) =>
                                                setEditingPermissions({ ...editingPermissions, [perm.key]: checked })
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Admin Permissions */}
                        <div>
                            <h4 className="font-medium text-slate-300 mb-3">Administration</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { key: "can_manage_users", label: "Manage Users" },
                                    { key: "can_view_activity_logs", label: "View Activity Logs" },
                                    { key: "can_manage_permissions", label: "Manage Permissions" },
                                ].map((perm) => (
                                    <div key={perm.key} className="flex items-center justify-between bg-slate-800 p-2 rounded">
                                        <Label className="text-slate-300 text-sm">{perm.label}</Label>
                                        <Switch
                                            checked={(editingPermissions as any)[perm.key] || false}
                                            onCheckedChange={(checked) =>
                                                setEditingPermissions({ ...editingPermissions, [perm.key]: checked })
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Communication Permissions */}
                        <div>
                            <h4 className="font-medium text-slate-300 mb-3">Communication</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { key: "can_send_emails", label: "Send Emails" },
                                    { key: "can_send_sms", label: "Send SMS" },
                                    { key: "can_make_calls", label: "Make Calls" },
                                ].map((perm) => (
                                    <div key={perm.key} className="flex items-center justify-between bg-slate-800 p-2 rounded">
                                        <Label className="text-slate-300 text-sm">{perm.label}</Label>
                                        <Switch
                                            checked={(editingPermissions as any)[perm.key] || false}
                                            onCheckedChange={(checked) =>
                                                setEditingPermissions({ ...editingPermissions, [perm.key]: checked })
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsPermissionsOpen(false)} className="text-slate-400">
                            Cancel
                        </Button>
                        <Button onClick={handleUpdatePermissions} className="bg-indigo-600 hover:bg-indigo-700">
                            Save Permissions
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
