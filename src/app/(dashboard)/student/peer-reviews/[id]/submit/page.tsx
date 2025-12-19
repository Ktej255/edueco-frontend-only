"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { ChevronLeft, Star, Send } from "lucide-react";
import api from "@/lib/api";

export default function SubmitPeerReviewPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState<any>(null);
  const [submission, setSubmission] = useState<any>(null);
  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState("");
  const [strengths, setStrengths] = useState("");
  const [improvements, setImprovements] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [assignmentId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/peer-reviews/assignments/${assignmentId}`,
      );
      setAssignment(response.data);

      // Load the submission to review
      const submissionRes = await api.get(
        `/lms/assignments/${response.data.assignment_id}/submissions/${response.data.reviewee_id}`,
      );
      setSubmission(submissionRes.data);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast.error("Failed to load peer review assignment");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toast.error("Please provide feedback");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/peer-reviews", {
        peer_review_assignment_id: parseInt(assignmentId),
        rating,
        feedback,
        strengths,
        improvements,
      });

      toast.success("Peer review submitted successfully");
      router.push("/student/peer-reviews");
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error("Failed to submit peer review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Submit Peer Review
        </h1>
        <p className="text-gray-400">{assignment?.assignment?.title}</p>
      </div>

      {/* Submission to Review */}
      <Card className="mb-6 bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Submission to Review</CardTitle>
          <CardDescription>
            Review work by{" "}
            {assignment?.reviewee?.full_name || assignment?.reviewee?.email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-white">Submitted Files</Label>
            <div className="mt-2 space-y-2">
              {submission?.submitted_files?.map(
                (file: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-gray-900 rounded"
                  >
                    <span className="text-cyan-500">{file}</span>
                  </div>
                ),
              )}
            </div>
          </div>

          {submission?.notes && (
            <div>
              <Label className="text-white">Student Notes</Label>
              <p className="mt-2 text-gray-300 p-3 bg-gray-900 rounded">
                {submission.notes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Form */}
      <Card className="mb-6 bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Your Review</CardTitle>
          <CardDescription>Provide constructive feedback</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Rating */}
          <div>
            <Label className="text-white mb-3 block">Overall Rating</Label>
            <RadioGroup
              value={rating.toString()}
              onValueChange={(v) => setRating(parseInt(v))}
            >
              {[...Array(5)].map((_, i) => {
                const value = 5 - i;
                return (
                  <div
                    key={value}
                    className="flex items-center space-x-2 p-3 bg-gray-900 rounded hover:bg-gray-850"
                  >
                    <RadioGroupItem
                      value={value.toString()}
                      id={`rating-${value}`}
                    />
                    <Label
                      htmlFor={`rating-${value}`}
                      className="flex-1 cursor-pointer flex items-center gap-2 text-white"
                    >
                      <div className="flex">
                        {[...Array(value)].map((_, starIndex) => (
                          <Star
                            key={starIndex}
                            className="h-4 w-4 fill-yellow-500 text-yellow-500"
                          />
                        ))}
                      </div>
                      <span>
                        {value === 5
                          ? "Excellent"
                          : value === 4
                            ? "Good"
                            : value === 3
                              ? "Average"
                              : value === 2
                                ? "Below Average"
                                : "Needs Work"}
                      </span>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          {/* Strengths */}
          <div>
            <Label htmlFor="strengths" className="text-white">
              What did the student do well?
            </Label>
            <Textarea
              id="strengths"
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
              placeholder="Highlight the strengths of this submission..."
              className="mt-2 bg-gray-900 border-gray-700 text-white min-h-[100px]"
            />
          </div>

          {/* Areas for Improvement */}
          <div>
            <Label htmlFor="improvements" className="text-white">
              What could be improved?
            </Label>
            <Textarea
              id="improvements"
              value={improvements}
              onChange={(e) => setImprovements(e.target.value)}
              placeholder="Suggest areas for improvement..."
              className="mt-2 bg-gray-900 border-gray-700 text-white min-h-[100px]"
            />
          </div>

          {/* Overall Feedback */}
          <div>
            <Label htmlFor="feedback" className="text-white">
              Overall Feedback *
            </Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Provide comprehensive feedback on the submission..."
              className="mt-2 bg-gray-900 border-gray-700 text-white min-h-[150px]"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="bg-gray-900"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={submitting || !feedback.trim()}
          className="bg-cyan-600 hover:bg-cyan-700"
        >
          {submitting ? (
            <>Submitting...</>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Submit Review
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
