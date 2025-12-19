"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssignmentSubmission } from "@/components/features/assignments/AssignmentSubmission";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

export default function AssignmentSubmitPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params?.assignmentId as string;
  const courseId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState<any>(null);
  const [existingSubmission, setExistingSubmission] = useState<any>(null);

  useEffect(() => {
    if (assignmentId) {
      fetchData();
    }
  }, [assignmentId]);

  const fetchData = async () => {
    try {
      const [assignmentRes, submissionRes] = await Promise.all([
        api.get(`/assignments/${assignmentId}`),
        api.get(`/assignments/${assignmentId}/my-submission`),
      ]);
      setAssignment(assignmentRes.data);
      setExistingSubmission(submissionRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (files: File[], notes: string) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    if (notes) formData.append("notes", notes);

    try {
      await api.post(`/assignments/${assignmentId}/submit`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Assignment submitted successfully!");
      router.push(`/lms/courses/${courseId}`);
    } catch (error) {
      console.error("Failed to submit assignment:", error);
      throw error;
    }
  };

  const isLate = () => {
    if (!assignment?.due_date) return false;
    return new Date() > new Date(assignment.due_date);
  };

  const formatDueDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading assignment...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push(`/lms/courses/${courseId}`)}
            className="mb-4 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Course
          </Button>

          <h1 className="text-3xl font-bold text-white mb-4">
            {assignment.title}
          </h1>

          {/* Assignment Info */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
            <p className="text-gray-300 whitespace-pre-wrap mb-4">
              {assignment.description}
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-cyan-600 text-cyan-400"
                >
                  {assignment.max_points} Points
                </Badge>
              </div>

              {assignment.due_date && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span
                    className={`text-sm ${isLate() ? "text-red-400" : "text-gray-400"}`}
                  >
                    Due: {formatDueDate(assignment.due_date)}
                  </span>
                  {isLate() && (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/50">
                      LATE
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {isLate() &&
              assignment.allow_late_submission &&
              assignment.late_penalty_per_day > 0 && (
                <div className="mt-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-yellow-400 font-medium">
                      Late Submission
                    </p>
                    <p className="text-sm text-yellow-400/80 mt-1">
                      {assignment.late_penalty_per_day}% penalty per day will be
                      applied to your grade
                    </p>
                  </div>
                </div>
              )}

            {isLate() && !assignment.allow_late_submission && (
              <div className="mt-4 bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                <p className="text-red-400">
                  ⚠️ Late submissions are not allowed for this assignment
                </p>
              </div>
            )}
          </div>

          {/* Submission Section */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">
              Submit Your Work
            </h2>
            {!assignment.allow_late_submission && isLate() ? (
              <div className="text-center py-12">
                <p className="text-gray-400">
                  This assignment is past due and no longer accepts submissions.
                </p>
              </div>
            ) : (
              <AssignmentSubmission
                onSubmit={handleSubmit}
                existingSubmission={existingSubmission}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
