"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, RefreshCw, Eye, Trash2 } from "lucide-react";
import api from "@/lib/api";

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      // Note: This endpoint would need to be added to backend
      const response = await api.get("/grapho/submissions");
      setSubmissions(response.data);
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
      // Mock data for demonstration
      setSubmissions([
        {
          id: 1,
          user_id: 1,
          user_email: "user@example.com",
          created_at: new Date().toISOString(),
          analysis_result: {
            traits: ["Focused", "Creative"],
            confidence: 0.85,
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Content Moderation
          </h1>
          <p className="text-gray-400">Review handwriting submissions</p>
        </div>
        <Button
          onClick={fetchSubmissions}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Submissions Grid */}
      {loading ? (
        <div className="text-white text-center py-12">Loading...</div>
      ) : submissions.length === 0 ? (
        <Card className="bg-gray-900 border-gray-800 p-12 text-center">
          <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No submissions yet</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {submissions.map((submission) => (
            <Card
              key={submission.id}
              className="bg-gray-900 border-gray-800 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    Submission #{submission.id}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    User: {submission.user_email || `ID ${submission.user_id}`}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Date: {formatDate(submission.created_at)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedSubmission(submission)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    className="p-2 bg-red-600 hover:bg-red-700 rounded text-white"
                    title="Delete submission"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {submission.analysis_result && (
                <div className="mt-4 p-4 bg-gray-800 rounded">
                  <p className="text-sm text-gray-400 mb-2">Analysis Result:</p>
                  <div className="flex flex-wrap gap-2">
                    {submission.analysis_result.traits?.map(
                      (trait: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-purple-600 text-white rounded text-xs"
                        >
                          {trait}
                        </span>
                      ),
                    )}
                  </div>
                  {submission.analysis_result.confidence && (
                    <p className="text-sm text-gray-400 mt-2">
                      Confidence:{" "}
                      {(submission.analysis_result.confidence * 100).toFixed(0)}
                      %
                    </p>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedSubmission(null)}
        >
          <Card
            className="bg-gray-900 border-gray-800 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              Submission #{selectedSubmission.id}
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">User ID</p>
                <p className="text-white">{selectedSubmission.user_id}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Submitted</p>
                <p className="text-white">
                  {formatDate(selectedSubmission.created_at)}
                </p>
              </div>
              {selectedSubmission.analysis_result && (
                <div>
                  <p className="text-gray-400 text-sm mb-2">Analysis</p>
                  <pre className="bg-gray-800 p-4 rounded text-white text-sm overflow-x-auto">
                    {JSON.stringify(
                      selectedSubmission.analysis_result,
                      null,
                      2,
                    )}
                  </pre>
                </div>
              )}
            </div>
            <Button
              onClick={() => setSelectedSubmission(null)}
              className="mt-6 w-full bg-purple-600 hover:bg-purple-700"
            >
              Close
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
