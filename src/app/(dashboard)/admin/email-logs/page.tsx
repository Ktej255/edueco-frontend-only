"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Mail,
  Eye,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface EmailLog {
  id: number;
  user_id: number;
  recipient_email: string;
  subject: string;
  template_name: string | null;
  status: "sent" | "failed" | "pending";
  error_message: string | null;
  sent_at: string;
  created_at: string;
}

const statusConfig = {
  sent: {
    label: "Sent",
    icon: CheckCircle2,
    className: "bg-green-600/20 text-green-400 border-green-600/50",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    className: "bg-red-600/20 text-red-400 border-red-600/50",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-yellow-600/20 text-yellow-400 border-yellow-600/50",
  },
};

export default function EmailLogsPage() {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<EmailLog | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [userIdFilter, setUserIdFilter] = useState("");

  useEffect(() => {
    fetchLogs();
  }, [statusFilter, userIdFilter]);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const params = new URLSearchParams();

      if (statusFilter && statusFilter !== "all") {
        params.append("status_filter", statusFilter);
      }

      if (userIdFilter) {
        params.append("user_id", userIdFilter);
      }

      const response = await axios.get(
        `${API_URL}/api/v1/email-notifications/logs?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setLogs(response.data);
    } catch (error: any) {
      console.error("Error fetching email logs:", error);
      toast.error(error.response?.data?.detail || "Failed to load email logs");
    } finally {
      setLoading(false);
    }
  };

  const openViewDialog = (log: EmailLog) => {
    setSelectedLog(log);
    setIsViewDialogOpen(true);
  };

  const filteredLogs = logs.filter((log) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        log.recipient_email.toLowerCase().includes(query) ||
        log.subject.toLowerCase().includes(query) ||
        log.template_name?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const stats = {
    total: logs.length,
    sent: logs.filter((l) => l.status === "sent").length,
    failed: logs.filter((l) => l.status === "failed").length,
    pending: logs.filter((l) => l.status === "pending").length,
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-400">Loading email logs...</div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Email Logs</h1>
        <p className="text-gray-400 mt-2">
          View and monitor all email notifications sent from the platform
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Emails
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-400">
              Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {stats.sent}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-400">
              Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">
              {stats.failed}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-400">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">
              {stats.pending}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gray-900 border-gray-800 mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="search"
                  placeholder="Search emails, subjects, templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                type="number"
                placeholder="Filter by user ID"
                value={userIdFilter}
                onChange={(e) => setUserIdFilter(e.target.value)}
                className="bg-gray-800 border-gray-700"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle>Email History</CardTitle>
          <CardDescription>
            {filteredLogs.length}{" "}
            {filteredLogs.length === 1 ? "email" : "emails"} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredLogs.map((log) => {
              const StatusIcon = statusConfig[log.status].icon;
              return (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-4 border border-gray-800 rounded-lg hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{log.subject}</span>
                      <Badge className={statusConfig[log.status].className}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig[log.status].label}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-400 space-y-1">
                      <p>
                        <strong>To:</strong> {log.recipient_email}
                      </p>
                      {log.template_name && (
                        <p>
                          <strong>Template:</strong> {log.template_name}
                        </p>
                      )}
                      <p>
                        <strong>Sent:</strong>{" "}
                        {new Date(
                          log.sent_at || log.created_at,
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openViewDialog(log)}
                    className="border-gray-700"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Details
                  </Button>
                </div>
              );
            })}

            {filteredLogs.length === 0 && (
              <div className="py-12 text-center">
                <Mail className="w-12 h-12 mx-auto text-gray-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No emails found</h3>
                <p className="text-gray-400">
                  {searchQuery || statusFilter !== "all" || userIdFilter
                    ? "Try adjusting your filters"
                    : "Email logs will appear here once emails are sent"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Log Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Email Log Details</DialogTitle>
            <DialogDescription>
              Complete information about this email notification
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold">Status</Label>
                  <div className="mt-2">
                    <Badge
                      className={statusConfig[selectedLog.status].className}
                    >
                      {React.createElement(
                        statusConfig[selectedLog.status].icon,
                        {
                          className: "w-3 h-3 mr-1",
                        },
                      )}
                      {statusConfig[selectedLog.status].label}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-semibold">User ID</Label>
                  <p className="mt-2 text-sm">{selectedLog.user_id}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold">Recipient</Label>
                <p className="mt-1 p-3 bg-gray-800 rounded-md text-sm">
                  {selectedLog.recipient_email}
                </p>
              </div>

              <div>
                <Label className="text-sm font-semibold">Subject</Label>
                <p className="mt-1 p-3 bg-gray-800 rounded-md text-sm">
                  {selectedLog.subject}
                </p>
              </div>

              {selectedLog.template_name && (
                <div>
                  <Label className="text-sm font-semibold">Template Used</Label>
                  <p className="mt-1 p-3 bg-gray-800 rounded-md text-sm">
                    {selectedLog.template_name}
                  </p>
                </div>
              )}

              {selectedLog.error_message && (
                <div>
                  <Label className="text-sm font-semibold text-red-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Error Message
                  </Label>
                  <p className="mt-1 p-3 bg-red-900/20 border border-red-800 rounded-md text-sm text-red-400">
                    {selectedLog.error_message}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold">Created At</Label>
                  <p className="mt-1 text-sm text-gray-400">
                    {new Date(selectedLog.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Sent At</Label>
                  <p className="mt-1 text-sm text-gray-400">
                    {selectedLog.sent_at
                      ? new Date(selectedLog.sent_at).toLocaleString()
                      : "Not sent yet"}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() => setIsViewDialogOpen(false)}
              className="bg-gray-800 hover:bg-gray-700"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
