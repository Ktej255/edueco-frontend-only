"use client";

import StandardListPage from "@/components/scaffold/StandardListPage";
import { Badge } from "@/components/ui/badge";

const MOCK_AFFILIATES = [
  { id: 1, name: "TechBlog Inc", code: "TECH2024", referrals: 150, earnings: "₹45,000", conversion: "3.5%", status: "active" },
  { id: 2, name: "LearnFast Youtube", code: "LEARNFAST", referrals: 890, earnings: "₹1,20,000", conversion: "5.2%", status: "active" },
  { id: 3, name: "John Doe", code: "JOHN10", referrals: 12, earnings: "₹2,400", conversion: "1.1%", status: "inactive" },
];

export default function AffiliatesPage() {
  const columns = [
    { key: "name", label: "Affiliate Name" },
    {
      key: "code",
      label: "Referral Code",
      render: (value: string) => (
        <code className="bg-gray-800 px-2 py-1 rounded text-xs font-mono text-cyan-400">{value}</code>
      )
    },
    { key: "referrals", label: "Total Referrals" },
    { key: "conversion", label: "Conversion Rate" },
    { key: "earnings", label: "Total Earnings" },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <Badge variant="outline" className={
          value === "active" ? "border-green-500/50 text-green-500 bg-green-500/10" :
            "border-gray-500/50 text-gray-500 bg-gray-500/10"
        }>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      )
    }
  ];

  return (
    <StandardListPage
      title="Affiliates"
      description="Track affiliate performance and manage referral partners."
      columns={columns}
      data={MOCK_AFFILIATES}
      actionLabel="Add Affiliate"
      onAdd={() => console.log("Add affiliate")}
      onEdit={(row) => console.log("Edit", row)}
      onDelete={(row) => console.log("Delete", row)}
    />
  );
}
