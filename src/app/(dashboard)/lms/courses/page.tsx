"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Eye,
  Trash2,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import Link from "next/link";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail_url: string | null;
  total_enrollments: number;
  is_published: boolean;
  level: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get("/courses/");
      setCourses(response.data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Created Courses</h1>
            <p className="text-gray-400">Manage and track your course performance</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-500" asChild>
            <Link href="/lms/courses/create">
              <Plus className="mr-2 h-4 w-4" />
              Create New Course
            </Link>
          </Button>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <LoadingSkeleton variant="card" count={6} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden flex flex-col">
                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-white font-semibold line-clamp-2 h-12">
                      {course.title || "Untitled Course"}
                    </h3>
                    <Badge variant="secondary" className="bg-gray-800 text-gray-400 text-xs">
                      {course.is_published ? "Published" : "Unknown"}
                    </Badge>
                  </div>

                  <p className="text-gray-400 text-sm line-clamp-3 mb-4 h-[60px]">
                    {course.description || "Start by giving your course a title and description."}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center text-gray-500 text-sm">
                      <Users className="h-4 w-4 mr-1" />
                      {course.total_enrollments} students
                    </div>
                    <div className="text-white font-bold">
                      ₹{course.price}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/50 border-t border-gray-800 p-2 flex gap-2">
                  <Button variant="outline" className="flex-1 border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 h-9 text-xs" asChild>
                    <Link href={`/lms/courses/${course.id}/edit`}>
                      <Edit className="mr-2 h-3 w-3" />
                      Edit
                    </Link>
                  </Button>
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white h-9 text-xs" asChild>
                    <Link href={`/lms/courses/${course.id}`}>
                      View
                    </Link>
                  </Button>
                </div>
              </div>
            ))}

            {/* Empty State Card Example (from screenshot) */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden flex flex-col">
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-white font-semibold">Untitled Course</h3>
                  <Badge variant="secondary" className="bg-gray-800 text-gray-400 text-xs">Draft</Badge>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Start by giving your course a title and description.
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center text-gray-500 text-sm">
                    0 students
                  </div>
                  <div className="text-white font-bold">₹100</div>
                </div>
              </div>
              <div className="bg-gray-900/50 border-t border-gray-800 p-2 flex gap-2">
                <Button variant="outline" className="flex-1 border-gray-700 text-gray-300 h-9 text-xs">
                  <Edit className="mr-2 h-3 w-3" /> Edit
                </Button>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white h-9 text-xs">
                  View
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
