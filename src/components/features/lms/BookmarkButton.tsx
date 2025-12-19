"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface BookmarkButtonProps {
  lessonId?: number;
  courseId: number;
  type: "lesson" | "course";
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export default function BookmarkButton({
  lessonId,
  courseId,
  type,
  variant = "outline",
  size = "sm",
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkBookmarkStatus();
  }, [lessonId, courseId, type]);

  const checkBookmarkStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const endpoint =
        type === "lesson"
          ? `${API_URL}/api/v1/notes/lessons/${lessonId}/is-bookmarked`
          : `${API_URL}/api/v1/notes/courses/${courseId}/is-bookmarked`;

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsBookmarked(response.data.is_bookmarked);
    } catch (error) {
      console.error("Error checking bookmark:", error);
    }
  };

  const toggleBookmark = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (isBookmarked) {
        // Remove bookmark
        const endpoint =
          type === "lesson"
            ? `${API_URL}/api/v1/notes/bookmarks/lessons/${lessonId}`
            : `${API_URL}/api/v1/notes/bookmarks/courses/${courseId}`;

        await axios.delete(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsBookmarked(false);
        toast.success("Bookmark removed");
      } else {
        // Add bookmark
        const endpoint =
          type === "lesson"
            ? `${API_URL}/api/v1/notes/bookmarks/lessons`
            : `${API_URL}/api/v1/notes/bookmarks/courses`;

        const data =
          type === "lesson"
            ? { lesson_id: lessonId, course_id: courseId }
            : { course_id: courseId };

        await axios.post(endpoint, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsBookmarked(true);
        toast.success("Bookmarked!");
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("Failed to toggle bookmark");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={isBookmarked ? "default" : variant}
      size={size}
      onClick={toggleBookmark}
      disabled={loading}
    >
      <Bookmark
        className={`w-4 h-4 ${size !== "icon" ? "mr-2" : ""} ${isBookmarked ? "fill-current" : ""}`}
      />
      {size !== "icon" && (isBookmarked ? "Bookmarked" : "Bookmark")}
    </Button>
  );
}
