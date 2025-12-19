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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { FileText, Clock, CheckCircle } from "lucide-react";
import api from "@/lib/api";

export default function PeerReviewsToCompletePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const response = await api.get("/peer-reviews/assignments/to-review");
      setAssignments(response.data);
    } catch (error) {
      console.error("Failed to load peer reviews:", error);
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
          <p className="text-gray-400">Loading peer reviews...</p>
        </div>
      </div>
    );
  }

  const pendingReviews = assignments.filter((a) => a.status === "pending");
  const completedReviews = assignments.filter((a) => a.status === "submitted");

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Peer Reviews to Complete
        </h1>
        <p className="text-gray-400">
          Review your classmates' work and provide constructive feedback
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-white">
                  {pendingReviews.length}
                </p>
                <p className="text-gray-400 mt-1">Pending Reviews</p>
              </div>
              <Clock className="h-12 w-12 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-white">
                  {completedReviews.length}
                </p>
                <p className="text-gray-400 mt-1">Completed</p>
              </div>
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Reviews */}
      {pendingReviews.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Pending Reviews
          </h2>
          <div className="space-y-4">
            {pendingReviews.map((assignment) => (
              <Card
                key={assignment.id}
                className="bg-gray-800 border-gray-700 hover:border-cyan-500 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg">
                        {assignment.assignment?.title || "Assignment"}
                      </CardTitle>
                      <CardDescription>
                        Review work by{" "}
                        {assignment.reviewee?.full_name ||
                          assignment.reviewee?.email}
                      </CardDescription>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-yellow-900/20 text-yellow-500 border-yellow-900"
                    >
                      Pending
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <FileText className="h-4 w-4" />
                      <span>Review assignment submission</span>
                    </div>
                    <Button
                      onClick={() =>
                        router.push(
                          `/student/peer-reviews/${assignment.id}/submit`,
                        )
                      }
                      className="bg-cyan-600 hover:bg-cyan-700"
                    >
                      Start Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Completed Reviews */}
      {completedReviews.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Completed Reviews
          </h2>
          <div className="space-y-4">
            {completedReviews.map((assignment) => (
              <Card key={assignment.id} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg">
                        {assignment.assignment?.title || "Assignment"}
                      </CardTitle>
                      <CardDescription>
                        Reviewed work by{" "}
                        {assignment.reviewee?.full_name ||
                          assignment.reviewee?.email}
                      </CardDescription>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-green-900/20 text-green-500 border-green-900"
                    >
                      Completed
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      Submitted on{" "}
                      {new Date(assignment.updated_at).toLocaleDateString()}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() =>
                        router.push(
                          `/student/peer-reviews/${assignment.id}/view`,
                        )
                      }
                      className="bg-gray-900"
                    >
                      View Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {assignments.length === 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="py-12 text-center">
            <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No Peer Reviews Assigned
            </h3>
            <p className="text-gray-400">
              You don't have any peer reviews to complete at the moment.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
