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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ChevronLeft, Users, Send } from "lucide-react";
import api from "@/lib/api";

export default function AssignPeerReviewsPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedAssignments, setSelectedAssignments] = useState<
    Record<number, number[]>
  >({});
  const [reviewsPerStudent, setReviewsPerStudent] = useState(2);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [assignmentId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [assignmentRes, submissionsRes] = await Promise.all([
        api.get(`/lms/assignments/${assignmentId}`),
        api.get(`/lms/assignments/${assignmentId}/submissions`),
      ]);

      setAssignment(assignmentRes.data);
      setSubmissions(submissionsRes.data);

      // Extract unique students from submissions
      const uniqueStudents = submissionsRes.data.map((sub: any) => ({
        id: sub.user_id,
        name: sub.user?.full_name || sub.user?.email || "Unknown",
      }));
      setStudents(uniqueStudents);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast.error("Failed to load assignment data");
    } finally {
      setLoading(false);
    }
  };

  const toggleReviewer = (submissionId: number, reviewerId: number) => {
    setSelectedAssignments((prev) => {
      const current = prev[submissionId] || [];
      const isSelected = current.includes(reviewerId);

      return {
        ...prev,
        [submissionId]: isSelected
          ? current.filter((id) => id !== reviewerId)
          : [...current, reviewerId],
      };
    });
  };

  const autoAssign = () => {
    const newAssignments: Record<number, number[]> = {};

    submissions.forEach((submission) => {
      // Get other students (excluding the submission author)
      const otherStudents = students.filter((s) => s.id !== submission.user_id);

      // Randomly select reviews per student
      const selectedReviewers = otherStudents
        .sort(() => Math.random() - 0.5)
        .slice(0, reviewsPerStudent)
        .map((s) => s.id);

      newAssignments[submission.id] = selectedReviewers;
    });

    setSelectedAssignments(newAssignments);
    toast.success(
      `Auto-assigned ${reviewsPerStudent} reviewers per submission`,
    );
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      // Create peer review assignments
      const assignments = [];
      for (const [submissionId, reviewerIds] of Object.entries(
        selectedAssignments,
      )) {
        const submission = submissions.find(
          (s) => s.id === parseInt(submissionId),
        );
        if (!submission) continue;

        for (const reviewerId of reviewerIds) {
          assignments.push({
            peer_review_assignment_id: 0, // Will be set by backend
            assignment_id: parseInt(assignmentId),
            reviewee_id: submission.user_id,
            reviewer_id: reviewerId,
            status: "pending",
          });
        }
      }

      // Send to backend
      await Promise.all(
        assignments.map((assignment) =>
          api.post("/peer-reviews/assignments", assignment),
        ),
      );

      toast.success("Peer review assignments created successfully");
      router.back();
    } catch (error) {
      console.error("Failed to create assignments:", error);
      toast.error("Failed to create peer review assignments");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading assignment...</p>
        </div>
      </div>
    );
  }

  const totalAssignments = Object.values(selectedAssignments).reduce(
    (sum, reviewers) => sum + reviewers.length,
    0,
  );

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <h1 className="text-3xl font-bold text-white mb-2">
          Assign Peer Reviews
        </h1>
        <p className="text-gray-400">{assignment?.title}</p>
      </div>

      {/* Controls */}
      <Card className="mb-6 bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Assignment Settings</CardTitle>
          <CardDescription>Configure peer review assignments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="reviews-per-student" className="text-white">
                Reviews per Student
              </Label>
              <Input
                id="reviews-per-student"
                type="number"
                min={1}
                max={5}
                value={reviewsPerStudent}
                onChange={(e) =>
                  setReviewsPerStudent(parseInt(e.target.value) || 2)
                }
                className="bg-gray-900 border-gray-700 text-white"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={autoAssign}
                variant="outline"
                className="bg-gray-900"
              >
                <Users className="h-4 w-4 mr-2" />
                Auto-Assign
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-700">
            <div className="text-sm text-gray-400">
              <p>{submissions.length} submissions</p>
              <p>{totalAssignments} peer reviews to assign</p>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={totalAssignments === 0 || submitting}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              {submitting ? (
                <>Creating...</>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Assign Reviews
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Submissions List */}
      <div className="space-y-4">
        {submissions.map((submission) => (
          <Card key={submission.id} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white text-lg">
                    {submission.user?.full_name || submission.user?.email}
                  </CardTitle>
                  <CardDescription>
                    Submitted{" "}
                    {new Date(submission.submitted_at).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Badge variant="secondary">
                  {(selectedAssignments[submission.id] || []).length} reviewers
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400 mb-4">
                Select students to review this submission:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {students
                  .filter((student) => student.id !== submission.user_id)
                  .map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center space-x-2 p-3 rounded-lg bg-gray-900 border border-gray-700"
                    >
                      <Checkbox
                        id={`${submission.id}-${student.id}`}
                        checked={(
                          selectedAssignments[submission.id] || []
                        ).includes(student.id)}
                        onCheckedChange={() =>
                          toggleReviewer(submission.id, student.id)
                        }
                      />
                      <Label
                        htmlFor={`${submission.id}-${student.id}`}
                        className="text-white cursor-pointer flex-1"
                      >
                        {student.name}
                      </Label>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
