"use client";

import { useEffect, useState } from "react";
import StandardListPage from "@/components/scaffold/StandardListPage";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

export default function PromoCodesPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/coupons/");
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch coupons:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = [
    {
      key: "code",
      label: "Code",
      render: (val: string) => <span className="font-mono font-bold text-yellow-400">{val}</span>
    },
    {
      key: "discount_value",
      label: "Discount",
      render: (val: number, row: any) => (
        <span>{val}{row.discount_type === "percentage" ? "%" : " USD"}</span>
      )
    },
    {
      key: "usage_count",
      label: "Usage",
      render: (val: number, row: any) => (
        <span className="text-gray-400">
          {val} / {row.usage_limit || "∞"}
        </span>
      )
    },
    {
      key: "is_active",
      label: "Status",
      render: (val: boolean) => (
        <Badge variant="outline" className={val ? "border-green-500/50 text-green-500 bg-green-500/10" : "border-red-500/50 text-red-500 bg-red-500/10"}>
          {val ? "Active" : "Inactive"}
        </Badge>
      )
    }
  ];

  return (
    <StandardListPage
      title="Promo Codes"
      description="Create and manage discount codes for your courses."
      columns={columns}
      data={data}
      actionLabel="Create Coupon"
      onAdd={() => console.log("Create")}
      onDelete={(row) => console.log("Delete", row)}
    />
  );
}
