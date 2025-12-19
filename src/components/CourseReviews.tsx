"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Star, ThumbsUp, CheckCircle } from "lucide-react";

type Review = {
  id: number;
  rating: number;
  comment: string;
  review_text?: string;
  author_name: string;
  created_at: string;
  helpful_count: number;
  has_found_helpful?: boolean;
};

type RatingsBreakdown = {
  average_rating: number;
  total_reviews: number;
  ratings: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
};

export default function CourseReviewsSection({
  courseId,
}: {
  courseId: string;
}) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [breakdown, setBreakdown] = useState<RatingsBreakdown | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);

  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    review_text: "",
  });

  useEffect(() => {
    fetchReviews();
  }, [courseId]);

  const fetchReviews = async () => {
    try {
      const [reviewsRes, breakdownRes, userReviewRes] = await Promise.all([
        axios.get(`/api/v1/courses/${courseId}/reviews`),
        axios.get(`/api/v1/courses/${courseId}/reviews/breakdown`),
        axios
          .get(`/api/v1/courses/${courseId}/reviews/my-review`)
          .catch(() => ({ data: null })),
      ]);
      setReviews(reviewsRes.data);
      setBreakdown(breakdownRes.data);
      setUserReview(userReviewRes.data);
      if (userReviewRes.data) {
        setReviewForm({
          rating: userReviewRes.data.rating,
          review_text:
            userReviewRes.data.review_text || userReviewRes.data.comment || "",
        });
      }
    } catch (error) {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (reviewForm.rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    try {
      if (userReview) {
        await axios.patch(`/api/v1/reviews/${userReview.id}`, reviewForm);
        toast.success("Review updated!");
      } else {
        await axios.post(`/api/v1/courses/${courseId}/reviews`, {
          ...reviewForm,
          course_id: parseInt(courseId),
        });
        toast.success("Review submitted!");
      }
      setIsReviewDialogOpen(false);
      fetchReviews();
    } catch (error) {
      toast.error("Failed to submit review");
    }
  };

  const handleHelpful = async (reviewId: number) => {
    try {
      await axios.post(`/api/v1/reviews/${reviewId}/helpful`);
      fetchReviews();
    } catch (error) {
      toast.error("Failed to mark as helpful");
    }
  };

  const renderStars = (
    rating: number,
    interactive = false,
    size = "w-5 h-5",
  ) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${star <= rating
                ? "fill-yellow-500 text-yellow-500"
                : "text-gray-600"
              } ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
            onClick={
              interactive
                ? () => setReviewForm({ ...reviewForm, rating: star })
                : undefined
            }
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="text-gray-400">Loading reviews...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Ratings Overview */}
      {breakdown && (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Average Rating */}
              <div className="text-center md:text-left">
                <div className="text-5xl font-bold mb-2">
                  {breakdown.average_rating.toFixed(1)}
                </div>
                {renderStars(Math.round(breakdown.average_rating))}
                <div className="text-sm text-gray-400 mt-2">
                  Based on {breakdown.total_reviews} reviews
                </div>
              </div>

              {/* Ratings Breakdown */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm">{stars}</span>
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    </div>
                    <Progress
                      value={
                        (breakdown.ratings[
                          stars as keyof typeof breakdown.ratings
                        ] /
                          breakdown.total_reviews) *
                        100
                      }
                      className="flex-1 h-2"
                    />
                    <span className="text-sm text-gray-400 w-12 text-right">
                      {
                        breakdown.ratings[
                        stars as keyof typeof breakdown.ratings
                        ]
                      }
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Write Review Button */}
            <div className="mt-6 pt-6 border-t border-gray-800">
              <Button
                onClick={() => setIsReviewDialogOpen(true)}
                className="w-full md:w-auto"
              >
                {userReview ? "Edit My Review" : "Write a Review"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Student Reviews</h3>
        {reviews.length === 0 ? (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-12 text-center">
              <p className="text-gray-400">
                No reviews yet. Be the first to review this course!
              </p>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-10 h-10 flex-shrink-0">
                    <AvatarFallback className="bg-blue-600">
                      {review.author_name ? review.author_name[0] : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-semibold">
                          {review.author_name || "Anonymous"}
                        </div>
                        <div className="text-sm text-gray-400">
                          {new Date(review.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-gray-300 mb-3">
                      {review.review_text || review.comment}
                    </p>
                    <button
                      className={`flex items-center gap-1 text-sm transition-colors ${review.has_found_helpful
                          ? "text-blue-500"
                          : "text-gray-400 hover:text-blue-400"
                        }`}
                      onClick={() => handleHelpful(review.id)}
                    >
                      <ThumbsUp
                        className={`w-4 h-4 ${review.has_found_helpful ? "fill-blue-500" : ""
                          }`}
                      />
                      Helpful ({review.helpful_count})
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {userReview ? "Edit Your Review" : "Write a Review"}
            </DialogTitle>
            <DialogDescription>
              Share your experience with this course
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Your Rating *
              </label>
              {renderStars(reviewForm.rating, true, "w-8 h-8")}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Your Review
              </label>
              <Textarea
                value={reviewForm.review_text}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, review_text: e.target.value })
                }
                placeholder="What did you like or dislike about this course?"
                rows={6}
                className="bg-gray-800 border-gray-700"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsReviewDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmitReview}>
              <CheckCircle className="w-4 h-4 mr-2" />
              {userReview ? "Update Review" : "Submit Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
