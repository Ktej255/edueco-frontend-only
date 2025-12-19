"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { TrendingUp, Star, Users, Flame } from "lucide-react";
import Link from "next/link";

interface TrendingCourse {
  course_id: number;
  title: string;
  description: string;
  category: string;
  level: string;
  rating: number;
  total_enrollments: number;
  recent_enrollments: number;
  price: number;
  instructor_name: string;
}

interface TrendingCoursesProps {
  limit?: number;
  days?: number;
}

export default function TrendingCourses({
  limit = 4,
  days = 7,
}: TrendingCoursesProps) {
  const [trending, setTrending] = useState<TrendingCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/recommendations/trending?limit=${limit}&days=${days}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );

      setTrending(response.data.trending_courses);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching trending courses:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse">
            <div className="h-5 bg-gray-700 rounded mb-3"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {trending.map((course, index) => (
        <Link
          key={course.course_id}
          href={`/lms/courses/${course.course_id}`}
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 hover:from-gray-750 hover:to-gray-850 transition-all border border-gray-700 hover:border-orange-500 relative overflow-hidden group"
        >
          {/* Trending Badge */}
          <div className="absolute top-2 right-2">
            <div className="flex items-center gap-1 bg-orange-500/20 px-2 py-1 rounded-full">
              <Flame className="w-3 h-3 text-orange-500" />
              <span className="text-xs font-bold text-orange-500">
                #{index + 1}
              </span>
            </div>
          </div>

          {/* Course Title */}
          <h3 className="font-semibold mb-2 line-clamp-2 pr-12">
            {course.title}
          </h3>

          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500" />
              <span>{course.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span>+{course.recent_enrollments}</span>
            </div>
          </div>

          {/* Category */}
          <span className="inline-block px-2 py-1 bg-blue-900/30 text-blue-400 rounded text-xs mb-2">
            {course.category}
          </span>

          {/* Price */}
          <div className="text-sm font-bold text-green-400">
            {course.price === 0 ? "Free" : `$${course.price}`}
          </div>

          {/* Hover Effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        </Link>
      ))}
    </div>
  );
}
