"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Star, MessageSquare, TrendingUp, TrendingDown } from "lucide-react";
import api from "@/lib/api";

export default function ReceivedPeerReviewsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get("/peer-reviews/assignments/received");
      setReviews(response.data);
    } catch (error) {
      console.error("Failed to load reviews:", error);
      toast.error("Failed to load peer reviews");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading reviews...</p>
        </div>
      </div>
    );
  }

  const reviewedAssignments = reviews.filter((r) => r.status === "submitted");
  const averageRating =
    reviewedAssignments.length > 0
      ? reviewedAssignments.reduce(
          (sum, r) => sum + (r.review?.rating || 0),
          0,
        ) / reviewedAssignments.length
      : 0;

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Reviews Received</h1>
        <p className="text-gray-400">
          See what your peers think about your work
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-white">
                  {reviewedAssignments.length}
                </p>
                <p className="text-gray-400 mt-1">Reviews Received</p>
              </div>
              <MessageSquare className="h-12 w-12 text-cyan-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-white">
                    {averageRating.toFixed(1)}
                  </p>
                  <Star className="h-6 w-6 fill-yellow-500 text-yellow-500" />
                </div>
                <p className="text-gray-400 mt-1">Average Rating</p>
              </div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-8 w-8 ${
                      i < Math.round(averageRating)
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <Card key={review.id} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-white text-lg">
                    {review.assignment?.title || "Assignment"}
                  </CardTitle>
                  <CardDescription>
                    {review.status === "submitted"
                      ? `Reviewed by ${review.reviewer?.full_name || review.reviewer?.email}`
                      : "Review pending"}
                  </CardDescription>
                </div>
                <Badge
                  variant="secondary"
                  className={
                    review.status === "submitted"
                      ? "bg-green-900/20 text-green-500 border-green-900"
                      : "bg-yellow-900/20 text-yellow-500 border-yellow-900"
                  }
                >
                  {review.status === "submitted" ? "Reviewed" : "Pending"}
                </Badge>
              </div>
            </CardHeader>

            {review.status === "submitted" && review.review && (
              <CardContent className="space-y-4">
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">Rating:</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.review.rating
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-white font-semibold">
                    {review.review.rating}/5
                  </span>
                </div>

                {/* Strengths */}
                {review.review.strengths && (
                  <div className="bg-green-900/10 border border-green-900/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <h4 className="text-green-500 font-semibold text-sm">
                        Strengths
                      </h4>
                    </div>
                    <p className="text-gray-300 text-sm">
                      {review.review.strengths}
                    </p>
                  </div>
                )}

                {/* Areas for Improvement */}
                {review.review.improvements && (
                  <div className="bg-orange-900/10 border border-orange-900/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="h-4 w-4 text-orange-500" />
                      <h4 className="text-orange-500 font-semibold text-sm">
                        Areas for Improvement
                      </h4>
                    </div>
                    <p className="text-gray-300 text-sm">
                      {review.review.improvements}
                    </p>
                  </div>
                )}

                {/* Overall Feedback */}
                <div className="bg-gray-900 rounded-lg p-4">
                  <h4 className="text-white font-semibold text-sm mb-2">
                    Overall Feedback
                  </h4>
                  <p className="text-gray-300 text-sm">
                    {review.review.feedback}
                  </p>
                </div>

                <div className="text-xs text-gray-500 pt-2 border-t border-gray-700">
                  Submitted on{" "}
                  {new Date(review.updated_at).toLocaleDateString()}
                </div>
              </CardContent>
            )}

            {review.status === "pending" && (
              <CardContent>
                <p className="text-gray-400 text-sm text-center py-4">
                  Waiting for peer to complete the review
                </p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {reviews.length === 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="py-12 text-center">
            <MessageSquare className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No Reviews Yet
            </h3>
            <p className="text-gray-400">
              You haven't received any peer reviews yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
