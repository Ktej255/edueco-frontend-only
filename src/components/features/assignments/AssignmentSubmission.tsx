"use client";

import React, { useState } from "react";
import { Upload, File as FileIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface SubmissionFile {
  file: File;
  name: string;
}

interface AssignmentSubmissionProps {
  onSubmit: (files: File[], notes: string) => Promise<void>;
  existingSubmission?: any;
}

export function AssignmentSubmission({
  onSubmit,
  existingSubmission,
}: AssignmentSubmissionProps) {
  const [files, setFiles] = useState<SubmissionFile[]>([]);
  const [notes, setNotes] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const submissionFiles = newFiles.map((file) => ({
      file,
      name: file.name,
    }));
    setFiles([...files, ...submissionFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      alert("Please upload at least one file");
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(
        files.map((f) => f.file),
        notes,
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-6">
      {/* File Upload Area */}
      <div>
        <Label className="text-white mb-2 block">Upload Files</Label>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? "border-cyan-500 bg-cyan-500/10"
              : "border-gray-700 bg-gray-800/50"
          }`}
        >
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-white mb-2">
            Drag and drop files here, or click to browse
          </p>
          <p className="text-sm text-gray-400 mb-4">
            PDF, DOCX, images, ZIP files (max 50MB each)
          </p>
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
            accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg,.zip"
          />
          <Button
            onClick={() => document.getElementById("file-upload")?.click()}
            variant="outline"
            className="border-gray-700 text-gray-300"
          >
            Browse Files
          </Button>
        </div>
      </div>

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <Label className="text-white">Uploaded Files ({files.length})</Label>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-800/50 border border-gray-700 rounded-lg p-3"
            >
              <div className="flex items-center gap-3">
                <FileIcon className="h-5 w-5 text-cyan-400" />
                <div>
                  <p className="text-white text-sm">{file.name}</p>
                  <p className="text-xs text-gray-400">
                    {formatFileSize(file.file.size)}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeFile(index)}
                className="text-red-400 hover:text-red-300"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Submission Notes */}
      <div>
        <Label htmlFor="notes" className="text-white">
          Submission Notes (Optional)
        </Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white mt-2"
          rows={4}
          placeholder="Add any notes or comments for your instructor..."
        />
      </div>

      {/* Existing Submission Warning */}
      {existingSubmission && (
        <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4">
          <p className="text-yellow-400 text-sm">
            ⚠️ You have already submitted this assignment. Submitting again will
            replace your previous submission.
          </p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={submitting || files.length === 0}
        className="bg-cyan-600 hover:bg-cyan-500 w-full"
        size="lg"
      >
        {submitting
          ? "Submitting..."
          : existingSubmission
            ? "Resubmit Assignment"
            : "Submit Assignment"}
      </Button>
    </div>
  );
}
