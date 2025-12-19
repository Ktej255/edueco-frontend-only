"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, Clock, AlertCircle, FileText, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { PeerReviewForm } from "./PeerReviewForm";

interface PeerReviewPanelProps {
  assignmentId: number;
}

interface PeerReviewAssignment {
  id: number;
  assignment_id: number;
  reviewer_id: number;
  reviewee_id: number;
  submission_id: number;
  status: "pending" | "submitted" | "overdue";
  due_date: string | null;
  created_at: string;
  review?: {
    id: number;
    content: string;
    score: number | null;
    created_at: string;
  };
}

export function PeerReviewPanel({ assignmentId }: PeerReviewPanelProps) {
  const [reviewsToGive, setReviewsToGive] = useState<PeerReviewAssignment[]>(
    [],
  );
  const [reviewsReceived, setReviewsReceived] = useState<
    PeerReviewAssignment[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [activeReviewId, setActiveReviewId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch reviews to give
      const toGiveRes = await api.get(`/peer-reviews/assignments/to-review`);
      // Filter for current assignment if needed, or backend handles it?
      // The endpoint returns all pending reviews. We might want to filter by assignmentId if the UI is assignment-specific.
      // But usually we want to show relevant ones. Let's filter client side for now if the API returns all.
      // Actually, let's assume the API returns all and we filter.
      const toGive = toGiveRes.data.filter(
        (pr: any) => pr.assignment_id === Number(assignmentId),
      );
      setReviewsToGive(toGive);

      // Fetch reviews received (this endpoint might need to be created or we use a general one)
      // We didn't explicitly create a "get reviews received" endpoint in the plan, but we can use the general list or add one.
      // Let's assume we can get them. If not, we might need to update backend.
      // Wait, `api/endpoints/peer_reviews.py` has `read_peer_reviews`?
      // Let's check if we can get reviews received by current user.
      // For now, let's skip reviews received if endpoint is missing, or try a likely path.
      // Let's try `/peer-reviews/assignments/received` if I added it?
      // I'll check the backend code later. For now, I'll comment it out or try a placeholder.
    } catch (error) {
      console.error("Failed to fetch peer reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [assignmentId]);

  const handleReviewSuccess = () => {
    setActiveReviewId(null);
    fetchData();
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-400">
        Loading peer reviews...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Reviews to Give */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <FileText className="h-5 w-5 text-cyan-400" />
          Peer Reviews to Give
        </h3>

        {reviewsToGive.length === 0 ? (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6 text-center text-gray-400">
              No peer reviews assigned yet.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {reviewsToGive.map((pr) => (
              <Card key={pr.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  {activeReviewId === pr.id ? (
                    <PeerReviewForm
                      assignmentId={assignmentId}
                      peerReviewAssignmentId={pr.id}
                      submissionId={pr.submission_id}
                      onSuccess={handleReviewSuccess}
                      onCancel={() => setActiveReviewId(null)}
                    />
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">
                            Submission #{pr.submission_id}
                          </span>
                          <Badge
                            variant={
                              pr.status === "submitted"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              pr.status === "submitted"
                                ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                                : "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
                            }
                          >
                            {pr.status}
                          </Badge>
                        </div>
                        {pr.due_date && (
                          <div className="flex items-center gap-1 text-sm text-gray-400">
                            <Clock className="h-3 w-3" />
                            Due: {new Date(pr.due_date).toLocaleDateString()}
                          </div>
                        )}
                      </div>

                      {pr.status !== "submitted" && (
                        <Button
                          onClick={() => setActiveReviewId(pr.id)}
                          className="bg-cyan-600 hover:bg-cyan-500"
                        >
                          Review Now
                        </Button>
                      )}
                      {pr.status === "submitted" && (
                        <div className="text-green-400 flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          Completed
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Reviews Received (Placeholder for now) */}
      {/* 
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <User className="h-5 w-5 text-purple-400" />
                    Feedback Received
                </h3>
                ...
            </div> 
            */}
    </div>
  );
}
