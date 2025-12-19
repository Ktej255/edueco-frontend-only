"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { CheckCircle, Clock, User, FileText } from "lucide-react";
import api from "@/lib/api";

interface AssignmentGradeProps {
  assignmentId: number;
  assignment: {
    title: string;
    max_score: number;
  };
}

interface Submission {
  id: number;
  user_id: number;
  submitted_at: string;
  submission_text?: string;
  submission_url?: string;
  attachment_url?: string;
  score?: number;
  feedback?: string;
  status: string;
  student: {
    full_name: string;
    email: string;
  };
}

export function AssignmentGrade({
  assignmentId,
  assignment,
}: AssignmentGradeProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [score, setScore] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, [assignmentId]);

  const fetchSubmissions = async () => {
    try {
      const response = await api.get(
        `/assignments/${assignmentId}/submissions`,
      );
      setSubmissions(response.data);
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGrade = async () => {
    if (!selectedSubmission) return;

    setGrading(true);
    try {
      await api.put(`/assignments/${assignmentId}/grade`, {
        submission_id: selectedSubmission.id,
        score: parseInt(score),
        feedback: feedback || undefined,
      });

      // Refresh submissions
      await fetchSubmissions();
      setSelectedSubmission(null);
      setScore("");
      setFeedback("");
    } catch (error: any) {
      console.error("Failed to grade assignment:", error);
      alert(error.response?.data?.detail || "Failed to grade assignment");
    } finally {
      setGrading(false);
    }
  };

  const selectSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    setScore(submission.score?.toString() || "");
    setFeedback(submission.feedback || "");
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-400">
        Loading submissions...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          {assignment.title}
        </h2>
        <p className="text-gray-400">Grade student submissions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Submissions List */}
        <div className="md:col-span-1 space-y-3">
          <h3 className="text-lg font-semibold text-white mb-3">
            Submissions ({submissions.length})
          </h3>

          {submissions.length === 0 ? (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 text-center">
              <FileText className="h-12 w-12 text-gray-700 mx-auto mb-2" />
              <p className="text-gray-500">No submissions yet</p>
            </div>
          ) : (
            submissions.map((submission) => (
              <button
                key={submission.id}
                onClick={() => selectSubmission(submission)}
                className={`w-full text-left p-4 rounded-lg border transition ${
                  selectedSubmission?.id === submission.id
                    ? "border-cyan-500 bg-cyan-500/10"
                    : "border-gray-800 bg-gray-900 hover:border-gray-700"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-white">
                      {submission.student?.full_name || "Student"}
                    </span>
                  </div>
                  {submission.status === "graded" && (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <Clock className="h-3 w-3" />
                  <span>
                    {new Date(submission.submitted_at).toLocaleDateString()}
                  </span>
                </div>

                {submission.status === "graded" && (
                  <div className="text-sm">
                    <span className="text-cyan-400 font-semibold">
                      Score: {submission.score}/{assignment.max_score}
                    </span>
                  </div>
                )}
              </button>
            ))
          )}
        </div>

        {/* Grading Panel */}
        <div className="md:col-span-2">
          {selectedSubmission ? (
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {selectedSubmission.student?.full_name}'s Submission
                </h3>
                <p className="text-sm text-gray-400">
                  Submitted:{" "}
                  {new Date(selectedSubmission.submitted_at).toLocaleString()}
                </p>
              </div>

              {/* Submission Content */}
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">Submission:</p>

                {selectedSubmission.submission_text && (
                  <div className="text-white whitespace-pre-wrap mb-3">
                    {selectedSubmission.submission_text}
                  </div>
                )}

                {selectedSubmission.submission_url && (
                  <a
                    href={selectedSubmission.submission_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline block mb-2"
                  >
                    {selectedSubmission.submission_url}
                  </a>
                )}

                {selectedSubmission.attachment_url && (
                  <a
                    href={selectedSubmission.attachment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline block"
                  >
                    View Attachment
                  </a>
                )}
              </div>

              {/* Grading Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Score (out of {assignment.max_score})
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max={assignment.max_score}
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    placeholder="Enter score"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Feedback (optional)
                  </label>
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide feedback to the student..."
                    rows={4}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <Button
                  onClick={handleGrade}
                  disabled={grading || !score}
                  className="w-full bg-cyan-600 hover:bg-cyan-500"
                >
                  {grading ? "Grading..." : "Save Grade"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-12 text-center">
              <FileText className="h-16 w-16 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-400">Select a submission to grade</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
