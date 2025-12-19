"use client";

import { useEffect, useState } from "react";
import StandardListPage from "@/components/scaffold/StandardListPage";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ThumbsUp } from "lucide-react";
import api from "@/lib/api";

export default function DiscussionsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Note: Fetching threads for a specific course or all threads if admin
    // For now, we'll try to fetch all threads via a new endpoint or mock it if not available globally
    // The current backend requires course_id for listing threads.
    // We might need to adjust the backend to allow listing all threads for admins, 
    // or we can fetch threads for a default course for demonstration.
    // Let's assume we have a global endpoint or we'll fetch for course_id=1
    const fetchData = async () => {
      try {
        // Temporary: Fetching for course 1. In a real app, this would be a global admin view.
        const response = await api.get("/discussions/courses/1/threads");
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch discussions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = [
    {
      key: "title",
      label: "Topic",
      render: (value: string, row: any) => (
        <div>
          <div className="font-medium text-white">{value}</div>
          <div className="text-xs text-gray-500">by {row.author_name || "Unknown"}</div>
        </div>
      )
    },
    {
      key: "reply_count",
      label: "Replies",
      render: (value: number) => (
        <div className="flex items-center gap-2 text-gray-300">
          <MessageSquare className="h-3 w-3" />
          {value}
        </div>
      )
    },
    {
      key: "view_count",
      label: "Views",
      render: (value: number) => <span className="text-gray-400">{value}</span>
    },
    {
      key: "is_resolved",
      label: "Status",
      render: (value: boolean) => (
        <Badge variant="outline" className={
          value ? "border-green-500/50 text-green-500 bg-green-500/10" :
            "border-blue-500/50 text-blue-500 bg-blue-500/10"
        }>
          {value ? "Resolved" : "Open"}
        </Badge>
      )
    }
  ];

  return (
    <StandardListPage
      title="Discussions"
      description="Moderate course forums and community discussions."
      columns={columns}
      data={data}
      actionLabel="New Topic"
      onAdd={() => console.log("New")}
      onEdit={(row) => console.log("View", row)}
      onDelete={(row) => console.log("Delete", row)}
    />
  );
}
