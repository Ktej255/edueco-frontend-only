"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssignmentEditor } from "@/components/features/assignments/AssignmentEditor";
import api from "@/lib/api";

export default function AssignmentEditPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params?.assignmentId as string;
  const courseId = params?.id as string;
  const isNew = assignmentId === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [assignmentData, setAssignmentData] = useState({
    title: "",
    description: "",
    max_points: 100,
    due_date: "",
    allow_late_submission: true,
    late_penalty_per_day: 10,
    is_published: false,
  });

  useEffect(() => {
    if (!isNew && assignmentId) {
      fetchAssignment();
    }
  }, [assignmentId, isNew]);

  const fetchAssignment = async () => {
    try {
      const response = await api.get(`/assignments/${assignmentId}`);
      const data = response.data;
      setAssignmentData({
        ...data,
        due_date: data.due_date
          ? new Date(data.due_date).toISOString().slice(0, 16)
          : "",
      });
    } catch (error) {
      console.error("Failed to fetch assignment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        ...assignmentData,
        due_date: assignmentData.due_date
          ? new Date(assignmentData.due_date).toISOString()
          : null,
        course_id: parseInt(courseId),
      };

      if (isNew) {
        await api.post("/assignments/", payload);
      } else {
        await api.put(`/assignments/${assignmentId}`, payload);
      }
      router.push(`/lms/courses/${courseId}/edit`);
    } catch (error) {
      console.error("Failed to save assignment:", error);
      alert("Failed to save assignment");
    } finally {
      setSaving(false);
    }
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
            onClick={() => router.push(`/lms/courses/${courseId}/edit`)}
            className="mb-4 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Course
          </Button>

          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">
              {isNew ? "Create New Assignment" : "Edit Assignment"}
            </h1>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-cyan-600 hover:bg-cyan-500"
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save Assignment"}
            </Button>
          </div>
        </div>

        {/* Assignment Editor */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <AssignmentEditor
            title={assignmentData.title}
            description={assignmentData.description}
            maxPoints={assignmentData.max_points}
            dueDate={assignmentData.due_date}
            allowLateSubmission={assignmentData.allow_late_submission}
            latePenaltyPerDay={assignmentData.late_penalty_per_day}
            onTitleChange={(title) =>
              setAssignmentData({ ...assignmentData, title })
            }
            onDescriptionChange={(description) =>
              setAssignmentData({ ...assignmentData, description })
            }
            onMaxPointsChange={(max_points) =>
              setAssignmentData({ ...assignmentData, max_points })
            }
            onDueDateChange={(due_date) =>
              setAssignmentData({ ...assignmentData, due_date })
            }
            onAllowLateChange={(allow_late_submission) =>
              setAssignmentData({ ...assignmentData, allow_late_submission })
            }
            onLatePenaltyChange={(late_penalty_per_day) =>
              setAssignmentData({ ...assignmentData, late_penalty_per_day })
            }
          />
        </div>
      </div>
    </div>
  );
}
