"use client";

import { useEffect, useState } from "react";
import StandardListPage from "@/components/scaffold/StandardListPage";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

export default function QuizReviewsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/quizzes/attempts/all");
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch quiz attempts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = [
    {
      key: "attempt",
      label: "Student",
      render: (val: any) => <span className="font-medium text-white">User {val?.user_id}</span>
    },
    {
      key: "attempt",
      label: "Quiz ID",
      render: (val: any) => <span className="text-gray-300">Quiz #{val?.quiz_id}</span>
    },
    {
      key: "percentage",
      label: "Score",
      render: (val: number) => <span className={val >= 70 ? "text-green-400" : "text-red-400"}>{val}%</span>
    },
    {
      key: "passed",
      label: "Result",
      render: (val: boolean) => (
        <Badge variant="outline" className={val ? "border-green-500/50 text-green-500 bg-green-500/10" : "border-red-500/50 text-red-500 bg-red-500/10"}>
          {val ? "Passed" : "Failed"}
        </Badge>
      )
    }
  ];

  return (
    <StandardListPage
      title="Quiz Reviews"
      description="Review student quiz submissions and grading."
      columns={columns}
      data={data}
      actionLabel="Refresh"
      onAdd={() => window.location.reload()}
      onView={(row) => console.log("Review", row)}
    />
  );
}
