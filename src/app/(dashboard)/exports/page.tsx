"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, FileText, File, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface ExportButtonProps {
  type: "analytics" | "user-data" | "course";
  courseId?: number;
  label?: string;
}

function ExportButton({ type, courseId, label }: ExportButtonProps) {
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useState<"csv" | "pdf" | "json">("csv");

  const handleExport = async () => {
    setLoading(true);

    try {
      let url = "";
      const token = localStorage.getItem("token");

      // Build URL based on type
      if (type === "analytics") {
        url = `${API_URL}/api/v1/exports/analytics?format=${format}`;
      } else if (type === "user-data") {
        url = `${API_URL}/api/v1/exports/user-data?format=${format === "csv" ? "json" : format}`;
      } else if (type === "course" && courseId) {
        url = `${API_URL}/api/v1/exports/course/${courseId}?format=${format === "csv" ? "json" : format}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      // Create download link
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;

      // Set filename based on type and format
      const fileExtension = format;
      const filename = `${type}_${Date.now()}.${fileExtension}`;
      link.setAttribute("download", filename);

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error: any) {
      console.error("Export failed:", error);
      alert(error.response?.data?.detail || "Export failed");
    } finally {
      setLoading(false);
    }
  };

  // Determine available formats
  const availableFormats =
    type === "analytics" ? ["csv", "pdf", "json"] : ["json", "pdf"];

  return (
    <div className="flex items-center gap-2">
      <Select value={format} onValueChange={(value: any) => setFormat(value)}>
        <SelectTrigger className="w-24">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {availableFormats.map((fmt) => (
            <SelectItem key={fmt} value={fmt}>
              {fmt.toUpperCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button onClick={handleExport} disabled={loading} variant="outline">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" />
            {label || "Export"}
          </>
        )}
      </Button>
    </div>
  );
}

export default function DataExportPage() {
  return (
    <div className="container max-w-4xl py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Data Export</h1>
        <p className="text-muted-foreground mt-2">
          Download your data in various formats
        </p>
      </div>

      {/* Analytics Export */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Analytics Data
              </CardTitle>
              <CardDescription>
                Export your learning analytics and progress reports
              </CardDescription>
            </div>
            <ExportButton type="analytics" label="Export Analytics" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Includes course completion data, quiz scores, time spent, and
            engagement metrics.
          </p>
        </CardContent>
      </Card>

      {/* User Data Export (GDPR) */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <File className="h-5 w-5" />
                Personal Data (GDPR)
              </CardTitle>
              <CardDescription>
                Download all your personal information
              </CardDescription>
            </div>
            <ExportButton type="user-data" label="Export Data" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Includes account information, profile data, course enrollments, and
            activity history. Required for GDPR compliance.
          </p>
        </CardContent>
      </Card>

      {/* Export Info */}
      <Card className="bg-muted">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <h3 className="font-semibold">Export Formats</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>
                • <strong>CSV</strong>: Spreadsheet format (Excel, Google
                Sheets)
              </li>
              <li>
                • <strong>PDF</strong>: Formatted document for printing
              </li>
              <li>
                • <strong>JSON</strong>: Raw data format for developers
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
