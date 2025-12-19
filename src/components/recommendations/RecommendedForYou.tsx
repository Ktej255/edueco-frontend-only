"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BookOpen, TrendingUp, Star, Users } from "lucide-react";
import Link from "next/link";

interface RecommendedCourse {
  course_id: number;
  title: string;
  description: string;
  category: string;
  level: string;
  rating: number;
  total_enrollments: number;
  score: number;
  reason: string;
  price: number;
  instructor_name: string;
}

interface RecommendedForYouProps {
  limit?: number;
}

export default function RecommendedForYou({
  limit = 6,
}: RecommendedForYouProps) {
  const [recommendations, setRecommendations] = useState<RecommendedCourse[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/recommendations/for-you?limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setRecommendations(response.data.recommendations);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-lg p-6 animate-pulse">
            <div className="h-6 bg-gray-700 rounded mb-4"></div>
            <div className="h-4 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No recommendations available yet</p>
        <p className="text-gray-500 text-sm mt-2">
          Enroll in courses to get personalized recommendations
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recommendations.map((course) => (
        <Link
          key={course.course_id}
          href={`/lms/courses/${course.course_id}`}
          className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors border border-gray-700 hover:border-blue-500"
        >
          {/* Recommendation Badge */}
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-blue-400 font-medium">
              {Math.round(course.score * 100)}% Match
            </span>
          </div>

          {/* Course Title */}
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
            {course.title}
          </h3>

          {/* Course Description */}
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {course.description}
          </p>

          {/* Course Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>{course.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{course.total_enrollments}</span>
            </div>
          </div>

          {/* Recommendation Reason */}
          <div className="bg-gray-900 rounded px-3 py-2 mb-3">
            <p className="text-xs text-gray-300">{course.reason}</p>
          </div>

          {/* Category & Level */}
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-1 bg-blue-900/30 text-blue-400 rounded text-xs">
              {course.category}
            </span>
            <span className="px-2 py-1 bg-purple-900/30 text-purple-400 rounded text-xs">
              {course.level}
            </span>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-green-400">
              {course.price === 0 ? "Free" : `$${course.price}`}
            </span>
            <span className="text-blue-400 text-sm font-medium">
              View Course →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
