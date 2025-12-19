"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SectionLibrary } from "@/components/features/lms/builder/SectionLibrary";
import { BuilderCanvas } from "@/components/features/lms/builder/BuilderCanvas";
import { StyleEditor } from "@/components/features/lms/builder/StyleEditor";
import { usePageBuilder } from "@/store/pageBuilderStore";
import { Button } from "@/components/ui/button";
import { Save, Eye, ArrowLeft } from "lucide-react";
import api from "@/lib/api";

export default function PageBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const { sections, setSections, isDirty, setIsDirty } = usePageBuilder();
  const [saving, setSaving] = useState(false);
  const [courseName, setCourseName] = useState("");

  useEffect(() => {
    loadPageLayout();
  }, [courseId]);

  const loadPageLayout = async () => {
    try {
      const response = await api.get(`/courses/${courseId}`);
      setCourseName(response.data.title);

      if (response.data.page_layout?.sections) {
        setSections(response.data.page_layout.sections);
      }
    } catch (error) {
      console.error("Failed to load page layout:", error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/courses/${courseId}`, {
        page_layout: { sections },
      });
      setIsDirty(false);
      alert("Page layout saved successfully!");
    } catch (error) {
      console.error("Failed to save page layout:", error);
      alert("Failed to save page layout");
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    // Save current state to localStorage for preview
    localStorage.setItem("preview-layout", JSON.stringify({ sections }));
    window.open(`/lms/courses/${courseId}?preview=true`, "_blank");
  };

  return (
    <div className="h-screen flex flex-col bg-black">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-white">Page Builder</h1>
            <p className="text-sm text-gray-400">{courseName}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handlePreview}
            className="border-gray-700"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isDirty || saving}
            className="bg-cyan-600 hover:bg-cyan-500"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* 3-Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        <SectionLibrary />
        <BuilderCanvas />
        <StyleEditor />
      </div>
    </div>
  );
}
