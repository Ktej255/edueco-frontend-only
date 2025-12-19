"use client";

import { useEffect, useState } from "react";
import StandardListPage from "@/components/scaffold/StandardListPage";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

export default function EnquiriesPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/enquiries/");
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch enquiries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = [
    { key: "name", label: "Name", render: (val: string) => <span className="font-medium text-white">{val}</span> },
    { key: "email", label: "Email" },
    { key: "subject", label: "Subject" },
    {
      key: "created_at",
      label: "Date",
      render: (value: string) => value ? new Date(value).toLocaleDateString() : "Just now"
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <Badge variant="outline" className={
          value === "new" ? "border-blue-500/50 text-blue-500 bg-blue-500/10" :
            value === "closed" ? "border-green-500/50 text-green-500 bg-green-500/10" :
              "border-yellow-500/50 text-yellow-500 bg-yellow-500/10"
        }>
          {value?.charAt(0).toUpperCase() + value?.slice(1)}
        </Badge>
      )
    }
  ];

  return (
    <StandardListPage
      title="Enquiries"
      description="Manage support tickets and contact form submissions."
      columns={columns}
      data={data}
      actionLabel="New Ticket"
      onAdd={() => console.log("New")}
      onEdit={(row) => console.log("Reply", row)}
      onDelete={(row) => console.log("Close", row)}
    />
  );
}
