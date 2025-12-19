"use client";

import { useState, useEffect } from "react";
import { BookOpen, Clock, TrendingUp, Award, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import api from "@/lib/api";
import Link from "next/link";

interface Enrollment {
  id: number;
  course_id: number;
  progress_percentage: number;
  enrolled_at: string;
  last_accessed_at: string;
  course: {
    id: number;
    title: string;
    description: string;
    category: string;
    level: string;
    thumbnail_url: string | null;
    total_duration_minutes: number;
  };
}

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyEnrollments();
  }, []);

  const fetchMyEnrollments = async () => {
    try {
      const response = await api.get("/enrollments/my-courses");
      setEnrollments(response.data);
    } catch (error) {
      console.error("Failed to fetch enrollments:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">My Courses</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-900 rounded-xl border border-gray-800 h-80 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              My Learning Journey
            </h1>
            <p className="text-gray-400">Continue where you left off</p>
          </div>
          <Link href="/lms/courses">
            <Button className="bg-cyan-600 hover:bg-cyan-500">
              <BookOpen className="mr-2 h-4 w-4" />
              Browse Courses
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-cyan-900/30 to-cyan-900/10 border border-cyan-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-400 text-sm mb-1">Enrolled Courses</p>
                <p className="text-3xl font-bold text-white">
                  {enrollments.length}
                </p>
              </div>
              <BookOpen className="h-12 w-12 text-cyan-500/30" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/30 to-purple-900/10 border border-purple-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-400 text-sm mb-1">Completed</p>
                <p className="text-3xl font-bold text-white">
                  {
                    enrollments.filter((e) => e.progress_percentage === 100)
                      .length
                  }
                </p>
              </div>
              <Award className="h-12 w-12 text-purple-500/30" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-900/30 to-green-900/10 border border-green-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm mb-1">In Progress</p>
                <p className="text-3xl font-bold text-white">
                  {
                    enrollments.filter(
                      (e) =>
                        e.progress_percentage > 0 &&
                        e.progress_percentage < 100,
                    ).length
                  }
                </p>
              </div>
              <TrendingUp className="h-12 w-12 text-green-500/30" />
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {enrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment) => (
              <Link
                key={enrollment.id}
                href={`/lms/courses/${enrollment.course_id}/learn`}
              >
                <div className="group bg-gray-900 rounded-xl border border-gray-800 hover:border-cyan-500/50 transition-all overflow-hidden cursor-pointer h-full flex flex-col">
                  {/* Thumbnail */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                    {enrollment.course.thumbnail_url ? (
                      <img
                        src={enrollment.course.thumbnail_url}
                        alt={enrollment.course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-gray-700" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <Progress
                        value={enrollment.progress_percentage}
                        className="h-2"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-400 transition">
                      {enrollment.course.title}
                    </h3>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">
                      {enrollment.course.description}
                    </p>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-cyan-400 font-medium">
                          {Math.round(enrollment.progress_percentage)}%
                        </span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3.5 w-3.5" />
                        <span>
                          Last accessed{" "}
                          {formatDate(enrollment.last_accessed_at)}
                        </span>
                      </div>
                    </div>

                    <Button
                      className="w-full mt-4 bg-cyan-600 hover:bg-cyan-500 text-white"
                      size="sm"
                    >
                      <PlayCircle className="mr-2 h-4 w-4" />
                      {enrollment.progress_percentage === 0
                        ? "Start Course"
                        : "Continue Learning"}
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
            <BookOpen className="h-16 w-16 text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No courses yet
            </h3>
            <p className="text-gray-400 mb-6">
              Start your learning journey by enrolling in a course
            </p>
            <Link href="/lms/courses">
              <Button className="bg-cyan-600 hover:bg-cyan-500">
                Browse Courses
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
