"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, CheckCircle, AlertCircle, FileVideo } from "lucide-react";
import api from "@/lib/api";

interface VideoUploaderProps {
  lessonId: number;
  onUploadComplete: (videoData: any) => void;
  initialVideoUrl?: string;
}

export function VideoUploader({
  lessonId,
  onUploadComplete,
  initialVideoUrl,
}: VideoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(
    initialVideoUrl || null,
  );
  const [status, setStatus] = useState<
    "idle" | "uploading" | "processing" | "ready" | "error"
  >("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("video/")) {
      setError("Please select a valid video file");
      return;
    }

    // Validate size (e.g., 500MB limit)
    if (file.size > 500 * 1024 * 1024) {
      setError("File size exceeds 500MB limit");
      return;
    }

    setError(null);
    setUploading(true);
    setProgress(0);
    setStatus("uploading");

    try {
      // 1. Get upload URL
      const { data: uploadConfig } = await api.post("/videos/upload-url", {
        lesson_id: lessonId,
      });
      const { upload_url, video_id } = uploadConfig;

      // 2. Upload file (Mocking the upload process for now)
      // In production: await axios.put(upload_url, file, { onUploadProgress: ... })

      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      setStatus("processing");

      // 3. Poll for status
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Manually set status to ready (since we are mocking)
      await api.post(`/videos/${video_id}/status?status=ready`);

      const { data: videoStatus } = await api.get(`/videos/${video_id}/status`);

      setVideoUrl(videoStatus.video_url);
      setStatus("ready");
      onUploadComplete(videoStatus);
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Failed to upload video. Please try again.");
      setStatus("error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {!videoUrl && status !== "ready" ? (
        <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-cyan-500 transition-colors">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="video/*"
            className="hidden"
          />

          {status === "idle" && (
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="mb-2"
                >
                  Select Video
                </Button>
                <p className="text-xs text-gray-500">
                  MP4, MOV, AVI up to 500MB
                </p>
              </div>
            </div>
          )}

          {(status === "uploading" || status === "processing") && (
            <div className="space-y-4">
              <FileVideo className="w-8 h-8 text-cyan-500 mx-auto animate-pulse" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-300">
                  {status === "uploading" ? "Uploading..." : "Processing..."}
                </p>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-gray-500">{progress}%</p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
              <p className="text-sm text-red-400">{error}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStatus("idle")}
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden bg-black border border-gray-800">
          <div className="aspect-video bg-gray-900 flex items-center justify-center">
            {/* Placeholder for video player or thumbnail */}
            <FileVideo className="w-12 h-12 text-gray-600" />
            <p className="absolute bottom-4 text-sm text-gray-400">
              Video Ready
            </p>
          </div>
          <div className="p-4 flex items-center justify-between bg-gray-900">
            <div className="flex items-center gap-2 text-green-500">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Upload Complete</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-400 hover:text-red-300"
              onClick={() => {
                setVideoUrl(null);
                setStatus("idle");
              }}
            >
              Replace
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
