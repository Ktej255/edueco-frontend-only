"use client";

import React, { useState, useCallback } from "react";
import {
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  FileText,
  Image,
  Video,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { Progress } from "@/components/ui/progress";

export interface FileUploadProgress {
  file: File;
  progress: number;
  status: "uploading" | "success" | "error";
  error?: string;
  url?: string;
}

interface FileUploadWithProgressProps {
  onUploadComplete: (files: FileUploadProgress[]) => void;
  acceptedFileTypes?: string;
  maxFileSize?: number; // in MB
  maxFiles?: number;
  uploadEndpoint: string;
}

export const FileUploadWithProgress: React.FC<FileUploadWithProgressProps> = ({
  onUploadComplete,
  acceptedFileTypes = "*",
  maxFileSize = 100,
  maxFiles = 10,
  uploadEndpoint,
}) => {
  const [files, setFiles] = useState<FileUploadProgress[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { showToast } = useToast();

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/"))
      return <Image className="h-5 w-5 text-blue-400" />;
    if (file.type.startsWith("video/"))
      return <Video className="h-5 w-5 text-purple-400" />;
    return <FileText className="h-5 w-5 text-gray-400" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const uploadFile = async (file: File, index: number) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setFiles((prev) =>
            prev.map((f, i) => (i === index ? { ...f, progress } : f)),
          );
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setFiles((prev) =>
            prev.map((f, i) =>
              i === index
                ? { ...f, status: "success", progress: 100, url: response.url }
                : f,
            ),
          );
        } else {
          setFiles((prev) =>
            prev.map((f, i) =>
              i === index
                ? { ...f, status: "error", error: "Upload failed" }
                : f,
            ),
          );
        }
      });

      xhr.addEventListener("error", () => {
        setFiles((prev) =>
          prev.map((f, i) =>
            i === index ? { ...f, status: "error", error: "Network error" } : f,
          ),
        );
      });

      xhr.open("POST", uploadEndpoint);
      xhr.send(formData);
    } catch (error) {
      setFiles((prev) =>
        prev.map((f, i) =>
          i === index ? { ...f, status: "error", error: String(error) } : f,
        ),
      );
    }
  };

  const handleFiles = useCallback(
    (selectedFiles: FileList | null) => {
      if (!selectedFiles) return;

      const fileArray = Array.from(selectedFiles);

      // Validate file count
      if (files.length + fileArray.length > maxFiles) {
        showToast(`Maximum ${maxFiles} files allowed`, "error");
        return;
      }

      // Validate file sizes
      const oversizedFiles = fileArray.filter(
        (f) => f.size > maxFileSize * 1024 * 1024,
      );
      if (oversizedFiles.length > 0) {
        showToast(`Some files exceed ${maxFileSize}MB limit`, "error");
        return;
      }

      // Add files to state
      const newFiles: FileUploadProgress[] = fileArray.map((file) => ({
        file,
        progress: 0,
        status: "uploading" as const,
      }));

      setFiles((prev) => [...prev, ...newFiles]);

      // Start uploads
      newFiles.forEach((fileProgress, index) => {
        uploadFile(fileProgress.file, files.length + index);
      });
    },
    [files.length, maxFiles, maxFileSize, showToast],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleComplete = () => {
    onUploadComplete(files.filter((f) => f.status === "success"));
    setFiles([]);
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-xl p-8 transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-500/10"
            : "border-gray-700 bg-gray-900/50 hover:border-gray-600"
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="p-4 bg-gray-800 rounded-full">
            <Upload className="h-8 w-8 text-gray-400" />
          </div>
          <div className="text-center">
            <p className="text-white font-medium mb-1">
              Drag and drop files here
            </p>
            <p className="text-sm text-gray-400">
              or click to browse (max {maxFileSize}MB per file)
            </p>
          </div>
          <input
            type="file"
            multiple
            accept={acceptedFileTypes}
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg cursor-pointer transition-colors"
          >
            Browse Files
          </label>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-400">
            Uploading {files.length} file{files.length !== 1 ? "s" : ""}
          </h4>
          {files.map((fileProgress, index) => (
            <div
              key={index}
              className="bg-gray-900 border border-gray-800 rounded-lg p-4"
            >
              <div className="flex items-start gap-3">
                {getFileIcon(fileProgress.file)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white text-sm font-medium truncate">
                      {fileProgress.file.name}
                    </p>
                    <div className="flex items-center gap-2">
                      {fileProgress.status === "success" && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {fileProgress.status === "error" && (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                      <button
                        onClick={() => removeFile(index)}
                        className="text-gray-500 hover:text-white transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {fileProgress.status === "uploading" && (
                    <>
                      <Progress
                        value={fileProgress.progress}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{formatFileSize(fileProgress.file.size)}</span>
                        <span>{fileProgress.progress}%</span>
                      </div>
                    </>
                  )}

                  {fileProgress.status === "success" && (
                    <p className="text-xs text-green-500">Upload complete</p>
                  )}

                  {fileProgress.status === "error" && (
                    <p className="text-xs text-red-500">
                      {fileProgress.error || "Upload failed"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Complete Button */}
          {files.every((f) => f.status !== "uploading") &&
            files.some((f) => f.status === "success") && (
              <button
                onClick={handleComplete}
                className="w-full py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors"
              >
                Confirm Upload (
                {files.filter((f) => f.status === "success").length} file
                {files.filter((f) => f.status === "success").length !== 1
                  ? "s"
                  : ""}
                )
              </button>
            )}
        </div>
      )}
    </div>
  );
};
