"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  BookOpen,
  Clock,
  Award,
  Lock,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";

export default function LearningPathDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [path, setPath] = useState<any>(null);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const pathRes = await api.get(`/learning-paths/slug/${slug}`);
      setPath(pathRes.data);

      // Try to get enrollment
      try {
        const enrollmentRes = await api.get(
          `/learning-paths/${pathRes.data.id}/enrollment`,
        );
        setEnrollment(enrollmentRes.data);
      } catch (e) {
        // Not enrolled yet
        setEnrollment(null);
      }
    } catch (error) {
      console.error("Failed to fetch learning path:", error);
      toast.error("Failed to load learning path");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchData();
    }
  }, [slug]);

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      await api.post(`/learning-paths/${path.id}/enroll`);
      toast.success("Enrolled successfully!");
      fetchData();
    } catch (error: any) {
      console.error("Failed to enroll:", error);
      toast.error(error.response?.data?.detail || "Failed to enroll");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-400">Loading...</div>;
  }

  if (!path) {
    return <div className="text-center py-8 text-gray-400">Path not found</div>;
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="mb-8">
          {path.cover_image_url && (
            <div className="relative h-64 mb-6 rounded-xl overflow-hidden">
              <img
                src={path.cover_image_url}
                alt={path.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <h1 className="text-4xl font-bold text-white mb-4">{path.title}</h1>
          <p className="text-lg text-gray-300 mb-4">{path.description}</p>

          <div className="flex items-center gap-4 mb-6">
            <Badge
              variant="secondary"
              className={`
                            ${path.difficulty_level === "beginner" ? "bg-green-500/10 text-green-400" : ""}
                            ${path.difficulty_level === "intermediate" ? "bg-yellow-500/10 text-yellow-400" : ""}
                            ${path.difficulty_level === "advanced" ? "bg-red-500/10 text-red-400" : ""}
                        `}
            >
              {path.difficulty_level}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <BookOpen className="h-4 w-4 text-cyan-400" />
              <span>{path.path_courses?.length || 0} courses</span>
            </div>
            {path.estimated_duration_hours && (
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <Clock className="h-4 w-4 text-cyan-400" />
                <span>{path.estimated_duration_hours} hours total</span>
              </div>
            )}
          </div>

          {/* Enrollment Progress or CTA */}
          {enrollment ? (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Your Progress
                </h3>
                <span className="text-cyan-400 text-sm">
                  {Math.round(enrollment.progress_percentage)}% Complete
                </span>
              </div>
              <Progress
                value={enrollment.progress_percentage}
                className="h-3 mb-2"
              />
              <p className="text-sm text-gray-400">
                {enrollment.completed_courses} of {enrollment.total_courses}{" "}
                courses completed
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Button
                onClick={handleEnroll}
                disabled={enrolling}
                className="bg-cyan-600 hover:bg-cyan-500 text-lg px-8 py-6"
              >
                {enrolling
                  ? "Enrolling..."
                  : path.price > 0
                    ? `Enroll for $${path.price}`
                    : "Enroll for Free"}
              </Button>
            </div>
          )}
        </div>

        {/* Course List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">
            Learning Path Courses
          </h2>
          {path.path_courses && path.path_courses.length > 0 ? (
            path.path_courses.map((pathCourse: any, index: number) => (
              <Card key={pathCourse.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-cyan-400 font-semibold">
                          {index + 1}
                        </span>
                        <h3 className="text-lg font-semibold text-white">
                          Course {pathCourse.course_id}
                        </h3>
                        {!pathCourse.is_required && (
                          <Badge
                            variant="secondary"
                            className="bg-gray-700 text-gray-300"
                          >
                            Optional
                          </Badge>
                        )}
                      </div>
                      {pathCourse.prerequisite_course_id && (
                        <p className="text-sm text-gray-400 flex items-center gap-2 mb-2">
                          <Lock className="h-3 w-3" />
                          Requires completion of Course{" "}
                          {pathCourse.prerequisite_course_id}
                        </p>
                      )}
                    </div>

                    {enrollment && (
                      <Link href={`/lms/courses/${pathCourse.course_id}/learn`}>
                        <Button className="bg-cyan-600 hover:bg-cyan-500">
                          <span>Continue</span>
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-gray-400 text-center py-8">
              No courses in this path yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
