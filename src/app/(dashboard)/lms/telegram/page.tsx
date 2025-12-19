"use client";

import StandardListPage from "@/components/scaffold/StandardListPage";
import { Badge } from "@/components/ui/badge";
import { Send, Users } from "lucide-react";

const MOCK_COMMUNITIES = [
  { id: 1, name: "Python Developers Hub", members: 4500, type: "Public Channel", link: "t.me/python_hub", status: "connected" },
  { id: 2, name: "Premium Trading Signals", members: 890, type: "Private Group", link: "t.me/+abc123xyz", status: "connected" },
  { id: 3, name: "Design Mentorship", members: 120, type: "Private Group", link: "t.me/+def456uvw", status: "disconnected" },
];

export default function TelegramCommunitiesPage() {
  const columns = [
    {
      key: "name",
      label: "Community Name",
      render: (value: string, row: any) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-500/20 rounded-full flex items-center justify-center">
            <Send className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <div className="font-medium text-white">{value}</div>
            <div className="text-xs text-gray-500">{row.type}</div>
          </div>
        </div>
      )
    },
    {
      key: "members",
      label: "Members",
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <Users className="h-3 w-3 text-gray-500" />
          {value.toLocaleString()}
        </div>
      )
    },
    {
      key: "link",
      label: "Invite Link",
      render: (value: string) => (
        <code className="text-xs bg-gray-900 px-2 py-1 rounded text-blue-400">{value}</code>
      )
    },
    {
      key: "status",
      label: "Connection",
      render: (value: string) => (
        <Badge variant="outline" className={
          value === "connected" ? "border-green-500/50 text-green-500 bg-green-500/10" :
            "border-red-500/50 text-red-500 bg-red-500/10"
        }>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      )
    }
  ];

  return (
    <StandardListPage
      title="Telegram Communities"
      description="Manage your connected Telegram groups and channels."
      columns={columns}
      data={MOCK_COMMUNITIES}
      actionLabel="Connect Community"
      onAdd={() => console.log("Connect")}
      onEdit={(row) => console.log("Edit", row)}
      onDelete={(row) => console.log("Delete", row)}
    />
  );
}
