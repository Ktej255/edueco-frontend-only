"use client";

import StandardListPage from "@/components/scaffold/StandardListPage";
import { Badge } from "@/components/ui/badge";
import { Timer } from "lucide-react";

const MOCK_TESTS = [
  { id: 1, title: "Weekly Coding Challenge", date: "2024-03-25 10:00 AM", duration: "60 mins", participants: 150, status: "upcoming" },
  { id: 2, title: "Monthly Scholarship Test", date: "2024-04-01 02:00 PM", duration: "120 mins", participants: 500, status: "upcoming" },
  { id: 3, title: "Python Speed Test", date: "2024-03-15 05:00 PM", duration: "30 mins", participants: 89, status: "completed" },
];

export default function LiveTestsPage() {
  const columns = [
    { key: "title", label: "Test Name", render: (val: string) => <span className="font-medium text-white">{val}</span> },
    { key: "date", label: "Scheduled For" },
    {
      key: "duration",
      label: "Duration",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Timer className="h-3 w-3 text-gray-500" />
          {value}
        </div>
      )
    },
    { key: "participants", label: "Registered" },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <Badge variant="outline" className={
          value === "upcoming" ? "border-blue-500/50 text-blue-500 bg-blue-500/10" :
            "border-gray-500/50 text-gray-500 bg-gray-500/10"
        }>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      )
    }
  ];

  return (
    <StandardListPage
      title="Live Tests"
      description="Schedule and manage real-time competitive tests."
      columns={columns}
      data={MOCK_TESTS}
      actionLabel="Schedule Test"
      onAdd={() => console.log("Schedule")}
      onEdit={(row) => console.log("Edit", row)}
      onDelete={(row) => console.log("Delete", row)}
    />
  );
}
