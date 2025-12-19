"use client";

import { useEffect, useState } from "react";
import StandardListPage from "@/components/scaffold/StandardListPage";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import api from "@/lib/api";

export default function AdminsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/users/?role=admin");
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch admins:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = [
    {
      key: "full_name",
      label: "Name",
      render: (value: string, row: any) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-900 text-blue-200">{value?.charAt(0) || "A"}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-white">{value || "Unknown"}</div>
            <div className="text-xs text-gray-500">{row.email}</div>
          </div>
        </div>
      )
    },
    {
      key: "is_superuser",
      label: "Role",
      render: (value: boolean) => (
        <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 hover:bg-purple-500/20">
          {value ? "Super Admin" : "Admin"}
        </Badge>
      )
    },
    {
      key: "is_active",
      label: "Status",
      render: (value: boolean) => (
        <Badge variant="outline" className={
          value ? "border-green-500/50 text-green-500 bg-green-500/10" :
            "border-red-500/50 text-red-500 bg-red-500/10"
        }>
          {value ? "Active" : "Inactive"}
        </Badge>
      )
    }
  ];

  return (
    <StandardListPage
      title="Administrators"
      description="Manage administrative access and roles for your platform."
      columns={columns}
      data={data}
      actionLabel="Invite Admin"
      onAdd={() => console.log("Invite admin")}
      onEdit={(row) => console.log("Edit", row)}
      onDelete={(row) => console.log("Delete", row)}
    />
  );
}
