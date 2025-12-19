"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Upload,
  Link as LinkIcon,
  FileText,
  Clock,
  CheckCircle,
  Trophy,
} from "lucide-react";
import api from "@/lib/api";
import { PeerReviewPanel } from "../assignments/PeerReviewPanel";

interface AssignmentSubmitProps {
  assignmentId: number;
  assignment: {
    title: string;
    description: string;
    instructions: string;
    max_score: number;
    due_date?: string;
    submission_type: string;
  };
  existingSubmission?: any;
  onSubmitSuccess: () => void;
}

export function AssignmentSubmit({
  assignmentId,
  assignment,
  existingSubmission,
  onSubmitSuccess,
}: AssignmentSubmitProps) {
  const [submissionText, setSubmissionText] = useState(
    existingSubmission?.submission_text || "",
  );
  const [submissionUrl, setSubmissionUrl] = useState(
    existingSubmission?.submission_url || "",
  );
  const [attachmentUrl, setAttachmentUrl] = useState(
    existingSubmission?.attachment_url || "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await api.post(`/assignments/${assignmentId}/submit`, {
        submission_text: submissionText || undefined,
        submission_url: submissionUrl || undefined,
        attachment_url: attachmentUrl || undefined,
      });
      onSubmitSuccess();
    } catch (error: any) {
      console.error("Failed to submit assignment:", error);
      alert(error.response?.data?.detail || "Failed to submit assignment");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if past due date
  const isPastDue =
    assignment.due_date && new Date() > new Date(assignment.due_date);
  const daysUntilDue = assignment.due_date
    ? Math.ceil(
        (new Date(assignment.due_date).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : null;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Assignment Details */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h2 className="text-2xl font-bold text-white mb-2">
          {assignment.title}
        </h2>
        <p className="text-gray-400 mb-4">{assignment.description}</p>

        {assignment.instructions && (
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-400 mb-2">Instructions:</p>
            <p className="text-white whitespace-pre-wrap">
              {assignment.instructions}
            </p>
          </div>
        )}

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <Trophy className="h-4 w-4" />
            <span>Max Score: {assignment.max_score}</span>
          </div>
          {assignment.due_date && (
            <div
              className={`flex items-center gap-2 ${
                isPastDue
                  ? "text-red-400"
                  : daysUntilDue && daysUntilDue <= 3
                    ? "text-yellow-400"
                    : "text-gray-400"
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>
                Due: {new Date(assignment.due_date).toLocaleDateString()}
                {daysUntilDue !== null &&
                  daysUntilDue > 0 &&
                  ` (${daysUntilDue} days left)`}
                {isPastDue && " (Past Due)"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Existing Submission Status */}
      {existingSubmission && (
        <div className="bg-green-500/10 border border-green-500 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-400 mb-2">
            <CheckCircle className="h-5 w-5" />
            <span className="font-semibold">Submitted</span>
          </div>
          <p className="text-sm text-gray-400">
            Submitted on:{" "}
            {new Date(existingSubmission.submitted_at).toLocaleString()}
          </p>
          {existingSubmission.status === "graded" && (
            <div className="mt-3 p-3 bg-gray-800 rounded">
              <p className="text-cyan-400 font-semibold">
                Score: {existingSubmission.score}/{assignment.max_score}
              </p>
              {existingSubmission.feedback && (
                <p className="text-gray-300 mt-2">
                  {existingSubmission.feedback}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Submission Form */}
      {!existingSubmission && (
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">
            Your Submission
          </h3>

          {assignment.submission_type === "text" && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <FileText className="inline h-4 w-4 mr-2" />
                Your Answer
              </label>
              <Textarea
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                placeholder="Type your answer here..."
                rows={10}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          )}

          {assignment.submission_type === "url" && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <LinkIcon className="inline h-4 w-4 mr-2" />
                Submission URL
              </label>
              <Input
                type="url"
                value={submissionUrl}
                onChange={(e) => setSubmissionUrl(e.target.value)}
                placeholder="https://..."
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          )}

          {assignment.submission_type === "file" && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <Upload className="inline h-4 w-4 mr-2" />
                Upload File
              </label>
              <Input
                type="url"
                value={attachmentUrl}
                onChange={(e) => setAttachmentUrl(e.target.value)}
                placeholder="File URL (upload to cloud first)"
                className="bg-gray-800 border-gray-700 text-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload your file to a cloud service and paste the URL here
              </p>
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              (!submissionText && !submissionUrl && !attachmentUrl)
            }
            className="w-full bg-cyan-600 hover:bg-cyan-500"
          >
            {isSubmitting ? "Submitting..." : "Submit Assignment"}
          </Button>
        </div>
      )}
      {/* Peer Reviews */}
      {existingSubmission && (
        <div className="pt-8 border-t border-gray-800">
          <PeerReviewPanel assignmentId={assignmentId} />
        </div>
      )}
    </div>
  );
}
