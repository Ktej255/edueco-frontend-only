"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Star,
  Users,
  TrendingUp,
  Lightbulb,
  Target,
} from "lucide-react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

interface Recommendation {
  course_id: number;
  title: string;
  description: string;
  category: string;
  level: string;
  rating: number;
  total_enrollments: number;
  price: number;
  instructor_name: string;
  score: number;
  reason: string;
}

export default function RecommendationsPage() {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [recsRes, trendingRes] = await Promise.all([
        api.get("/recommendations/for-you?limit=20"),
        api.get("/recommendations/trending?limit=6"),
      ]);
      setRecommendations(recsRes.data.recommendations || []);
      setTrending(trendingRes.data.trending_courses || []);
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-6 flex items-center justify-center">
        <div className="text-white">
          Loading personalized recommendations...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
              <Sparkles className="h-8 w-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                AI Recommendations
              </h1>
              <p className="text-gray-400 mt-1">
                Personalized course suggestions powered by AI
              </p>
            </div>
          </div>
        </div>

        {/* Trending Courses */}
        {trending.length > 0 && (
          <Card className="bg-gradient-to-br from-orange-900/20 to-gray-900 border-orange-500/20 mb-8">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-400" />
                <CardTitle className="text-white">Trending Now</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trending.map((course: any) => (
                  <div
                    key={course.course_id}
                    onClick={() =>
                      router.push(`/lms/courses/${course.course_id}`)
                    }
                    className="bg-gray-900/50 rounded-lg p-4 border border-gray-800 hover:border-orange-500/50 transition-all cursor-pointer"
                  >
                    <h4 className="font-semibold text-white mb-2 line-clamp-2">
                      {course.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                      <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                      <span>{course.rating.toFixed(1)}</span>
                      <Users className="h-3 w-3 ml-2" />
                      <span>{course.total_enrollments}</span>
                    </div>
                    <Badge className="bg-orange-500/20 text-orange-400 text-xs">
                      {course.recent_enrollments} recent enrollments
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Personalized Recommendations */}
        <Card className="bg-gradient-to-br from-purple-900/20 to-gray-900 border-purple-500/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-400" />
              <CardTitle className="text-white">Recommended For You</CardTitle>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Based on your learning history and preferences
            </p>
          </CardHeader>
          <CardContent>
            {recommendations.length === 0 ? (
              <div className="text-center py-12">
                <Lightbulb className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No recommendations yet
                </h3>
                <p className="text-gray-400 mb-6">
                  Enroll in more courses to get personalized recommendations
                </p>
                <Button
                  onClick={() => router.push("/lms/marketplace")}
                  className="bg-purple-600 hover:bg-purple-500"
                >
                  Browse Marketplace
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((rec) => (
                  <div
                    key={rec.course_id}
                    onClick={() => router.push(`/lms/courses/${rec.course_id}`)}
                    className="bg-gray-900/50 rounded-xl p-5 border border-gray-800 hover:border-purple-500/50 transition-all cursor-pointer group"
                  >
                    <div className="mb-3">
                      <h4 className="font-semibold text-white group-hover:text-purple-400 transition-colors mb-2 line-clamp-2">
                        {rec.title}
                      </h4>
                      <p className="text-sm text-gray-400 line-clamp-3 mb-3">
                        {rec.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        <span>{rec.rating.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{rec.total_enrollments}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className="border-purple-500/50 text-purple-400"
                      >
                        {rec.level}
                      </Badge>
                    </div>

                    <div className="pt-3 border-t border-gray-800">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-lg font-semibold text-purple-400">
                          {rec.price > 0 ? `₹${rec.price}` : "Free"}
                        </div>
                        <div className="text-xs text-gray-500">
                          by {rec.instructor_name}
                        </div>
                      </div>
                      <div className="flex items-start gap-2 bg-purple-500/10 rounded-lg p-2">
                        <Lightbulb className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-purple-300">
                          {rec.reason}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
