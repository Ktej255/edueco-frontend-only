"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function NewAnnouncementPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    is_pinned: false,
    send_notification: true,
    send_email: false,
    is_published: true,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/api/v1/announcements/courses/${courseId}/announcements`,
        { ...formData, course_id: parseInt(courseId) },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success("Announcement created successfully!");
      router.push(`/lms/courses/${courseId}/announcements`);
    } catch (error: any) {
      console.error("Error creating announcement:", error);
      toast.error(
        error.response?.data?.detail || "Failed to create announcement",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.push(`/lms/courses/${courseId}/announcements`)}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Announcements
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create New Announcement</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter announcement title..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Write your announcement here..."
                rows={10}
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="is_pinned">Pin to Top</Label>
                  <p className="text-sm text-muted-foreground">
                    Pinned announcements appear at the top
                  </p>
                </div>
                <Switch
                  id="is_pinned"
                  checked={formData.is_pinned}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_pinned: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="send_notification">Send Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify all enrolled students
                  </p>
                </div>
                <Switch
                  id="send_notification"
                  checked={formData.send_notification}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, send_notification: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="send_email">Send Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Also send via email (if configured)
                  </p>
                </div>
                <Switch
                  id="send_email"
                  checked={formData.send_email}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, send_email: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="is_published">Publish Immediately</Label>
                  <p className="text-sm text-muted-foreground">
                    Make announcement visible to students
                  </p>
                </div>
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_published: checked })
                  }
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Creating..." : "Create Announcement"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  router.push(`/lms/courses/${courseId}/announcements`)
                }
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
