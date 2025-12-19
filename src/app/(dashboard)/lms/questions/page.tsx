"use client";

import { useEffect, useState } from "react";
import StandardListPage from "@/components/scaffold/StandardListPage";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

export default function QuestionBankPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/question-banks/");
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch question banks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = [
    { key: "title", label: "Bank Name", render: (val: string) => <span className="font-medium text-white">{val}</span> },
    { key: "category", label: "Category" },
    { key: "question_count", label: "Questions", render: (val: number) => <span className="text-gray-300">{val}</span> },
    {
      key: "difficulty_level",
      label: "Difficulty",
      render: (value: string) => (
        <Badge variant="outline" className={
          value === "hard" ? "border-red-500/50 text-red-500 bg-red-500/10" :
            value === "medium" ? "border-yellow-500/50 text-yellow-500 bg-yellow-500/10" :
              "border-green-500/50 text-green-500 bg-green-500/10"
        }>
          {value?.charAt(0).toUpperCase() + value?.slice(1)}
        </Badge>
      )
    }
  ];

  return (
    <StandardListPage
      title="Question Bank"
      description="Create and manage pools of questions for quizzes."
      columns={columns}
      data={data}
      actionLabel="Create Bank"
      onAdd={() => console.log("New")}
      onEdit={(row) => console.log("Edit", row)}
      onDelete={(row) => console.log("Delete", row)}
    />
  );
}
