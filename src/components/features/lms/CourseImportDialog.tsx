import React, { useState } from "react";
import { Upload, FileJson, Loader2, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import api from "@/lib/api";

interface CourseImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CourseImportDialog({
  open,
  onOpenChange,
  onSuccess,
}: CourseImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (
        selectedFile.type !== "application/json" &&
        !selectedFile.name.endsWith(".json")
      ) {
        setError("Please upload a valid JSON file");
        return;
      }
      setFile(selectedFile);
      setError(null);

      // Read file for preview
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          setPreview(json);
        } catch (err) {
          setError("Invalid JSON content");
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      await api.post("/courses/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onSuccess();
      onOpenChange(false);
      setFile(null);
      setPreview(null);
    } catch (err: any) {
      console.error("Import failed:", err);
      setError(err.response?.data?.detail || "Failed to import course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Course</DialogTitle>
          <DialogDescription className="text-gray-400">
            Upload a course JSON file to import it into your catalog.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!file ? (
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-cyan-500/50 transition-colors">
              <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
                id="course-import-file"
              />
              <label
                htmlFor="course-import-file"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-cyan-400" />
                </div>
                <span className="text-sm font-medium text-gray-300">
                  Click to upload JSON file
                </span>
                <span className="text-xs text-gray-500">Maximum size 10MB</span>
              </label>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded bg-cyan-500/10 flex items-center justify-center">
                    <FileJson className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white truncate max-w-[200px]">
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                    setError(null);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  Change
                </Button>
              </div>

              {preview && (
                <div className="space-y-2 text-sm border-t border-gray-700 pt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Title:</span>
                    <span className="text-white font-medium">
                      {preview.title}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Modules:</span>
                    <span className="text-white">
                      {preview.modules?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Category:</span>
                    <span className="text-white capitalize">
                      {preview.category_slug?.replace(/_/g, " ") ||
                        "Uncategorized"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {error && (
            <Alert
              variant="destructive"
              className="bg-red-900/20 border-red-900/50"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="text-gray-400 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!file || loading || !!error}
            className="bg-cyan-600 hover:bg-cyan-500 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Import Course
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
