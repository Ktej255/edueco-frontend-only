"use client";

import StandardListPage from "@/components/scaffold/StandardListPage";
import { Badge } from "@/components/ui/badge";
import { Video } from "lucide-react";

const MOCK_CLASSES = [
  { id: 1, topic: "Advanced React Patterns", instructor: "James Chen", date: "2024-03-22 04:00 PM", platform: "Zoom", status: "upcoming" },
  { id: 2, topic: "Q&A Session: Data Science", instructor: "Sarah Wilson", date: "2024-03-24 11:00 AM", platform: "Google Meet", status: "upcoming" },
  { id: 3, topic: "Intro to UI Design", instructor: "Emily Davis", date: "2024-03-18 02:00 PM", platform: "Zoom", status: "completed" },
];

export default function LiveClassesPage() {
  const columns = [
    { key: "topic", label: "Topic", render: (val: string) => <span className="font-medium text-white">{val}</span> },
    { key: "instructor", label: "Instructor" },
    { key: "date", label: "Date & Time" },
    {
      key: "platform",
      label: "Platform",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Video className="h-3 w-3 text-gray-500" />
          {value}
        </div>
      )
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <Badge variant="outline" className={
          value === "upcoming" ? "border-green-500/50 text-green-500 bg-green-500/10" :
            "border-gray-500/50 text-gray-500 bg-gray-500/10"
        }>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      )
    }
  ];

  return (
    <StandardListPage
      title="Live Classes"
      description="Manage your live virtual classroom sessions."
      columns={columns}
      data={MOCK_CLASSES}
      actionLabel="Schedule Class"
      onAdd={() => console.log("Schedule")}
      onEdit={(row) => console.log("Edit", row)}
      onDelete={(row) => console.log("Delete", row)}
    />
  );
}
