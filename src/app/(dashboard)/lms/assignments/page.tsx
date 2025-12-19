"use client";

import { useEffect, useState } from "react";
import StandardListPage from "@/components/scaffold/StandardListPage";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

export default function AssignmentsPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Try to fetch assignments, fallback to empty array if fails
                const response = await api.get("/assignments/");
                setData(response.data);
            } catch (error) {
                console.error("Failed to fetch assignments:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const columns = [
        {
            key: "title",
            label: "Title",
            render: (val: string) => <span className="font-medium text-white">{val}</span>
        },
        {
            key: "course_id",
            label: "Course",
            render: (val: number) => <span className="text-gray-400">Course #{val}</span>
        },
        {
            key: "due_date",
            label: "Due Date",
            render: (val: string) => <span className="text-gray-400">{val ? new Date(val).toLocaleDateString() : "No due date"}</span>
        },
        {
            key: "status",
            label: "Status",
            render: (val: string) => (
                <Badge variant="outline" className={val === "published" ? "border-green-500/50 text-green-500" : "border-yellow-500/50 text-yellow-500"}>
                    {val || "Draft"}
                </Badge>
            )
        }
    ];

    return (
        <StandardListPage
            title="Assignments"
            description="Manage course assignments and submissions."
            columns={columns}
            data={data}
            actionLabel="Create Assignment"
            onAdd={() => console.log("Create")}
            onDelete={(row) => console.log("Delete", row)}
        />
    );
}
