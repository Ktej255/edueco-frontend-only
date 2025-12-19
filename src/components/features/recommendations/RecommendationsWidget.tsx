"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Star, Users, TrendingUp, ChevronRight } from "lucide-react";
import api from "@/lib/api";
import Link from "next/link";
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

export default function RecommendationsWidget() {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await api.get("/recommendations/for-you?limit=6");
      setRecommendations(response.data.recommendations || []);
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-purple-900/20 to-gray-900 border-purple-500/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <CardTitle className="text-white">Recommended For You</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-gray-400">Loading recommendations...</div>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-purple-900/20 to-gray-900 border-purple-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <CardTitle className="text-white">Recommended For You</CardTitle>
          </div>
          <Link href="/recommendations">
            <Button
              variant="ghost"
              size="sm"
              className="text-purple-400 hover:text-purple-300"
            >
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
        <p className="text-sm text-gray-400 mt-1">
          AI-powered personalized course suggestions
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((rec) => (
            <div
              key={rec.course_id}
              onClick={() => router.push(`/lms/courses/${rec.course_id}`)}
              className="bg-gray-900/50 rounded-lg p-4 border border-gray-800 hover:border-purple-500/50 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-2">
                  {rec.title}
                </h4>
              </div>

              <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                {rec.description}
              </p>

              <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
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
                  className="border-purple-500/50 text-purple-400 text-xs"
                >
                  {rec.level}
                </Badge>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                <div className="text-sm text-purple-400 font-medium">
                  {rec.price > 0 ? `₹${rec.price}` : "Free"}
                </div>
                <div className="text-xs text-gray-500">{rec.reason}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
