"use client";

import StandardListPage from "@/components/scaffold/StandardListPage";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

const MOCK_REVIEWS = [
  { id: 1, course: "Python Masterclass", student: "Alice Johnson", rating: 5, comment: "Excellent course! Very comprehensive.", date: "2024-03-20" },
  { id: 2, course: "Web Dev Bootcamp", student: "Bob Smith", rating: 4, comment: "Great content, but audio quality could be better.", date: "2024-03-19" },
  { id: 3, course: "Data Science 101", student: "Charlie Brown", rating: 5, comment: "Dr. Wilson is an amazing instructor.", date: "2024-03-18" },
];

export default function ReviewsPage() {
  const columns = [
    { key: "course", label: "Course" },
    { key: "student", label: "Student" },
    {
      key: "rating",
      label: "Rating",
      render: (value: number) => (
        <div className="flex items-center text-yellow-500">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-3 w-3 ${i < value ? "fill-current" : "text-gray-700"}`} />
          ))}
        </div>
      )
    },
    {
      key: "comment",
      label: "Comment",
      render: (value: string) => (
        <div className="truncate max-w-xs text-gray-400 italic">"{value}"</div>
      )
    },
    { key: "date", label: "Date" },
  ];

  return (
    <StandardListPage
      title="Ratings & Reviews"
      description="Monitor and respond to student feedback."
      columns={columns}
      data={MOCK_REVIEWS}
      actionLabel="Export Reviews"
      onView={(row) => console.log("View", row)}
      onDelete={(row) => console.log("Delete", row)}
    />
  );
}
