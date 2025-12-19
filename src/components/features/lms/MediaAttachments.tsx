"use client";

import { useState } from "react";
import {
  Upload,
  X,
  FileText,
  Video,
  File,
  PlayCircle,
  Download,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/lib/api";

interface VideoAttachmentProps {
  videoUrl?: string;
  videoType?: "upload" | "youtube" | "vimeo";
  onUpdate: (data: { type: string; url: string }) => void;
}

export function VideoAttachment({
  videoUrl,
  videoType,
  onUpdate,
}: VideoAttachmentProps) {
  const [type, setType] = useState<"upload" | "youtube" | "vimeo">(
    videoType || "youtube",
  );
  const [url, setUrl] = useState(videoUrl || "");
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("video/")) {
      alert("Please upload a video file");
      return;
    }

    // Validate file size (max 500MB for now)
    if (file.size > 500 * 1024 * 1024) {
      alert("File size must be less than 500MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/upload/video", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1),
          );
          console.log(`Upload progress: ${percentCompleted}%`);
        },
      });

      const uploadedUrl = response.data.url;
      setUrl(uploadedUrl);
      onUpdate({ type: "upload", url: uploadedUrl });
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload video");
    } finally {
      setUploading(false);
    }
  };

  const handleEmbedUpdate = () => {
    if (!url) return;
    onUpdate({ type, url });
  };

  const extractVideoId = (url: string, platform: "youtube" | "vimeo") => {
    if (platform === "youtube") {
      const match = url.match(
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
      );
      return match ? match[1] : null;
    } else if (platform === "vimeo") {
      const match = url.match(/vimeo\.com\/(\d+)/);
      return match ? match[1] : null;
    }
    return null;
  };

  const getEmbedUrl = (url: string, platform: "youtube" | "vimeo") => {
    const videoId = extractVideoId(url, platform);
    if (!videoId) return null;

    if (platform === "youtube") {
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (platform === "vimeo") {
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <Tabs value={type} onValueChange={(v) => setType(v as any)}>
        <TabsList className="grid grid-cols-3 w-full bg-gray-800">
          <TabsTrigger
            value="youtube"
            className="data-[state=active]:bg-red-600"
          >
            YouTube
          </TabsTrigger>
          <TabsTrigger
            value="vimeo"
            className="data-[state=active]:bg-blue-600"
          >
            Vimeo
          </TabsTrigger>
          <TabsTrigger
            value="upload"
            className="data-[state=active]:bg-purple-600"
          >
            Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="youtube" className="space-y-3">
          <div>
            <Label className="text-gray-300">YouTube URL</Label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="mt-2 bg-gray-800 border-gray-700 text-white"
            />
          </div>
          {url && getEmbedUrl(url, "youtube") && (
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src={getEmbedUrl(url, "youtube")!}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          )}
          <Button
            onClick={handleEmbedUpdate}
            className="bg-red-600 hover:bg-red-500"
          >
            Save YouTube Video
          </Button>
        </TabsContent>

        <TabsContent value="vimeo" className="space-y-3">
          <div>
            <Label className="text-gray-300">Vimeo URL</Label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://vimeo.com/..."
              className="mt-2 bg-gray-800 border-gray-700 text-white"
            />
          </div>
          {url && getEmbedUrl(url, "vimeo") && (
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src={getEmbedUrl(url, "vimeo")!}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          )}
          <Button
            onClick={handleEmbedUpdate}
            className="bg-blue-600 hover:bg-blue-500"
          >
            Save Vimeo Video
          </Button>
        </TabsContent>

        <TabsContent value="upload" className="space-y-3">
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-purple-500 transition">
            <input
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
              className="hidden"
              id="video-upload"
              disabled={uploading}
            />
            <label htmlFor="video-upload" className="cursor-pointer">
              <Upload className="h-12 w-12 text-gray-500 mx-auto mb-3" />
              <p className="text-white font-medium">
                {uploading ? "Uploading..." : "Click to upload video"}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                MP4, WebM, or OGG (max 500MB)
              </p>
            </label>
          </div>

          {url && (
            <div>
              <p className="text-sm text-gray-400 mb-2">Uploaded video:</p>
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <video src={url} controls className="w-full h-full" />
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface FileAttachmentProps {
  files?: Array<{
    id: number;
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  onUpdate: (
    files: Array<{ name: string; url: string; type: string; size: number }>,
  ) => void;
}

export function FileAttachment({ files = [], onUpdate }: FileAttachmentProps) {
  const [uploading, setUploading] = useState(false);
  const [currentFiles, setCurrentFiles] = useState<Array<{ id?: number; name: string; url: string; type: string; size: number }>>(files);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setUploading(true);
    try {
      const uploadedFiles = [];

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const formData = new FormData();
        formData.append("file", file);

        const response = await api.post("/upload/file", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        uploadedFiles.push({
          name: file.name,
          url: response.data.url,
          type: file.type,
          size: file.size,
        });
      }

      const updatedFiles = [...currentFiles, ...uploadedFiles];
      setCurrentFiles(updatedFiles);
      onUpdate(updatedFiles);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload files");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = currentFiles.filter((_, i) => i !== index);
    setCurrentFiles(updatedFiles);
    onUpdate(updatedFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getFileIcon = (type: string) => {
    if (type.includes("pdf"))
      return <FileText className="h-5 w-5 text-red-400" />;
    if (type.includes("video"))
      return <Video className="h-5 w-5 text-purple-400" />;
    return <File className="h-5 w-5 text-gray-400" />;
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-cyan-500 transition">
        <input
          type="file"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
          disabled={uploading}
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className="h-10 w-10 text-gray-500 mx-auto mb-2" />
          <p className="text-white font-medium">
            {uploading ? "Uploading..." : "Click to upload files"}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            PDF, documents, images, or any file type
          </p>
        </label>
      </div>

      {currentFiles.length > 0 && (
        <div className="space-y-2">
          <Label className="text-gray-300">
            Attached Files ({currentFiles.length})
          </Label>
          <div className="space-y-2">
            {currentFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-cyan-500 transition group"
              >
                <div className="flex items-center gap-3 flex-1">
                  {getFileIcon(file.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(file.url, "_blank")}
                    className="text-cyan-400 hover:text-cyan-300"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveFile(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface PDFViewerProps {
  pdfUrl: string;
}

export function PDFViewer({ pdfUrl }: PDFViewerProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-red-400" />
          <span className="text-white">PDF Document</span>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => window.open(pdfUrl, "_blank")}
          className="border-gray-700"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Open in New Tab
        </Button>
      </div>

      <div className="aspect-[8.5/11] bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
        <iframe src={pdfUrl} className="w-full h-full" title="PDF Viewer" />
      </div>
    </div>
  );
}
