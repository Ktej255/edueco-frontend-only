"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Activity, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await api.get("/admin/logs");
      setLogs(response.data.logs);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Activity Logs</h1>
          <p className="text-gray-400">Admin action audit trail</p>
        </div>
        <Button
          onClick={fetchLogs}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="text-white text-center py-12">Loading...</div>
      ) : logs.length === 0 ? (
        <Card className="bg-gray-900 border-gray-800 p-12 text-center">
          <Activity className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No admin activity logs yet</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <Card key={log.id} className="bg-gray-900 border-gray-800 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span
                      className={`px-3 py-1 rounded text-sm font-semibold ${
                        log.action === "ban_user"
                          ? "bg-red-600 text-white"
                          : log.action === "unban_user"
                            ? "bg-green-600 text-white"
                            : log.action === "promote_user"
                              ? "bg-purple-600 text-white"
                              : log.action === "delete_user"
                                ? "bg-gray-600 text-white"
                                : "bg-blue-600 text-white"
                      }`}
                    >
                      {log.action.replace("_", " ").toUpperCase()}
                    </span>
                    <span className="text-gray-400 text-sm">
                      Admin ID: {log.admin_id}
                    </span>
                  </div>
                  <p className="text-white mb-1">{log.details}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>
                      Target: {log.target_type} #{log.target_id}
                    </span>
                    {log.ip_address && <span>IP: {log.ip_address}</span>}
                  </div>
                </div>
                <div className="text-right text-sm text-gray-400">
                  {formatDate(log.created_at)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
