"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Category {
  id: number;
  name: string;
  description: string;
}

export default function NewThreadPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, [courseId]);

  const fetchCategories = async () => {
    try {
      setFetchingCategories(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/api/v1/discussions/courses/${courseId}/categories`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setCategories(response.data);
      // Auto-select first category if available
      if (response.data.length > 0) {
        setSelectedCategory(response.data[0].id.toString());
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setFetchingCategories(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!content.trim()) {
      toast.error("Please enter content");
      return;
    }

    if (!selectedCategory) {
      toast.error("Please select a category");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/api/v1/discussions/threads`,
        {
          title: title.trim(),
          content: content.trim(),
          category_id: parseInt(selectedCategory),
          course_id: parseInt(courseId),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success("Thread created successfully!");
      // Redirect to the newly created thread
      router.push(`/lms/courses/${courseId}/discussions/${response.data.id}`);
    } catch (error: any) {
      console.error("Error creating thread:", error);
      const errorMessage =
        error.response?.data?.detail || "Failed to create thread";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingCategories) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 mx-auto animate-spin mb-4" />
            <p>Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => router.push(`/lms/courses/${courseId}/discussions`)}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Discussions
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Create New Discussion Thread
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Selection */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                disabled={categories.length === 0}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                      {cat.description && (
                        <span className="text-muted-foreground text-sm ml-2">
                          - {cat.description}
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {categories.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No categories available. Contact your instructor.
                </p>
              )}
            </div>

            {/* Title Input */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Title<span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a descriptive title for your thread"
                maxLength={200}
                required
              />
              <p className="text-sm text-muted-foreground">
                {title.length}/200 characters
              </p>
            </div>

            {/* Content Textarea */}
            <div className="space-y-2">
              <Label htmlFor="content">
                Content<span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Describe your question or topic in detail..."
                rows={12}
                required
                className="resize-y"
              />
              <p className="text-sm text-muted-foreground">
                Be clear and specific to get better responses
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={
                  loading ||
                  !title.trim() ||
                  !content.trim() ||
                  !selectedCategory
                }
                className="flex-1"
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {loading ? "Creating..." : "Create Thread"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  router.push(`/lms/courses/${courseId}/discussions`)
                }
                disabled={loading}
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
