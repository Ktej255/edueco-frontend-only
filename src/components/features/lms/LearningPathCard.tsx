"use client";

import React from "react";
import { BookOpen, Clock, Award, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

interface LearningPathCardProps {
  path: {
    id: number;
    title: string;
    description?: string;
    slug: string;
    thumbnail_url?: string;
    difficulty_level: string;
    estimated_duration_hours?: number;
    price: number;
    is_published: boolean;
    total_enrollments?: number;
    path_courses?: any[];
  };
  enrollment?: {
    progress_percentage: number;
    completed_courses: number;
    total_courses: number;
    is_completed: boolean;
  };
  showProgress?: boolean;
}

export function LearningPathCard({
  path,
  enrollment,
  showProgress = false,
}: LearningPathCardProps) {
  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-green-500/10 text-green-400";
      case "intermediate":
        return "bg-yellow-500/10 text-yellow-400";
      case "advanced":
        return "bg-red-500/10 text-red-400";
      default:
        return "bg-gray-500/10 text-gray-400";
    }
  };

  const courseCount = path.path_courses?.length || 0;

  return (
    <Link href={`/lms/learning-paths/${path.slug}`}>
      <Card className="bg-gray-800 border-gray-700 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10 cursor-pointer h-full flex flex-col">
        {/* Thumbnail */}
        {path.thumbnail_url && (
          <div className="relative h-48 overflow-hidden rounded-t-lg">
            <img
              src={path.thumbnail_url}
              alt={path.title}
              className="w-full h-full object-cover"
            />
            {path.price > 0 && (
              <div className="absolute top-3 right-3 bg-cyan-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                ${path.price}
              </div>
            )}
            {path.price === 0 && (
              <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                FREE
              </div>
            )}
          </div>
        )}

        <CardContent className="p-6 flex-1 flex flex-col">
          {/* Title and Difficulty */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
              {path.title}
            </h3>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className={getDifficultyColor(path.difficulty_level)}
              >
                {path.difficulty_level}
              </Badge>
              {enrollment?.is_completed && (
                <Badge className="bg-green-500/10 text-green-400">
                  ✓ Completed
                </Badge>
              )}
            </div>
          </div>

          {/* Description */}
          {path.description && (
            <p className="text-sm text-gray-400 mb-4 line-clamp-2">
              {path.description}
            </p>
          )}

          {/* Progress (if enrolled) */}
          {showProgress && enrollment && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">Progress</span>
                <span className="text-xs text-cyan-400">
                  {Math.round(enrollment.progress_percentage)}%
                </span>
              </div>
              <Progress
                value={enrollment.progress_percentage}
                className="h-2"
              />
              <p className="text-xs text-gray-400 mt-1">
                {enrollment.completed_courses} of {enrollment.total_courses}{" "}
                courses completed
              </p>
            </div>
          )}

          {/* Metadata */}
          <div className="mt-auto space-y-2">
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <BookOpen className="h-3 w-3 text-cyan-400" />
                <span>{courseCount} courses</span>
              </div>
              {path.estimated_duration_hours && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-cyan-400" />
                  <span>{path.estimated_duration_hours}h</span>
                </div>
              )}
            </div>

            {path.total_enrollments !== undefined &&
              path.total_enrollments > 0 && (
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Users className="h-3 w-3 text-cyan-400" />
                  <span>{path.total_enrollments} enrolled</span>
                </div>
              )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
