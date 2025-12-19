"use client";

import { useEffect, useState } from "react";
import StandardListPage from "@/components/scaffold/StandardListPage";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

export default function DigitalProductsPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/digital-products/");
                setData(response.data);
            } catch (error) {
                console.error("Failed to fetch digital products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const columns = [
        {
            key: "title",
            label: "Product Name",
            render: (val: string) => <span className="font-medium text-white">{val}</span>
        },
        {
            key: "price",
            label: "Price",
            render: (val: number) => <span className="text-gray-400">${val}</span>
        },
        {
            key: "file_type",
            label: "Type",
            render: (val: string) => <span className="text-gray-400 uppercase">{val}</span>
        },
        {
            key: "status",
            label: "Status",
            render: (val: string) => (
                <Badge variant="outline" className={val === "active" ? "border-green-500/50 text-green-500" : "border-gray-500/50 text-gray-500"}>
                    {val || "Draft"}
                </Badge>
            )
        }
    ];

    return (
        <StandardListPage
            title="Digital Products"
            description="Manage your digital downloads and products."
            columns={columns}
            data={data}
            actionLabel="Add Product"
            onAdd={() => console.log("Add")}
            onDelete={(row) => console.log("Delete", row)}
        />
    );
}
