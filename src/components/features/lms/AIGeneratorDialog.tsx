"use client";

import { useState } from "react";
import { Sparkles, Loader2, BookOpen, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

interface Lesson {
  title: string;
  description: string;
  type: string;
  duration_minutes: number;
}

interface Module {
  title: string;
  description: string;
  lessons: Lesson[];
}

interface CourseOutline {
  course_title: string;
  course_description: string;
  modules: Module[];
}

interface AIGeneratorDialogProps {
  open: boolean;
  onClose: () => void;
  onGenerate: (outline: CourseOutline) => void;
}

export function AIGeneratorDialog({
  open,
  onClose,
  onGenerate,
}: AIGeneratorDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    topic: "",
    target_audience: "General learners",
    difficulty: "beginner",
    objectives: "",
    module_count: 4,
  });

  const handleGenerate = async () => {
    if (!formData.topic) {
      alert("Please enter a course topic");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/ai-course/generate-outline", formData);
      onGenerate(response.data);
      onClose();
    } catch (error: any) {
      console.error("AI generation failed:", error);
      alert(
        error.response?.data?.detail || "Failed to generate course outline",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-400" />
            AI Course Generator
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Let AI create a comprehensive course outline for you in seconds
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Topic */}
          <div>
            <Label htmlFor="ai-topic" className="text-white mb-2 block">
              Course Topic *
            </Label>
            <Input
              id="ai-topic"
              value={formData.topic}
              onChange={(e) =>
                setFormData({ ...formData, topic: e.target.value })
              }
              placeholder="e.g., Machine Learning Fundamentals"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          {/* Target Audience & Difficulty */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ai-audience" className="text-white mb-2 block">
                Target Audience
              </Label>
              <Input
                id="ai-audience"
                value={formData.target_audience}
                onChange={(e) =>
                  setFormData({ ...formData, target_audience: e.target.value })
                }
                placeholder="e.g., Software developers"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div>
              <Label htmlFor="ai-difficulty" className="text-white mb-2 block">
                Difficulty Level
              </Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) =>
                  setFormData({ ...formData, difficulty: value })
                }
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Objectives */}
          <div>
            <Label htmlFor="ai-objectives" className="text-white mb-2 block">
              Learning Objectives (Optional)
            </Label>
            <Textarea
              id="ai-objectives"
              value={formData.objectives}
              onChange={(e) =>
                setFormData({ ...formData, objectives: e.target.value })
              }
              placeholder="What should students learn? (AI will use this to tailor the outline)"
              className="bg-gray-800 border-gray-700 text-white"
              rows={3}
            />
          </div>

          {/* Module Count */}
          <div>
            <Label htmlFor="ai-modules" className="text-white mb-2 block">
              Number of Modules: {formData.module_count}
            </Label>
            <input
              id="ai-modules"
              type="range"
              min="2"
              max="8"
              value={formData.module_count}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  module_count: parseInt(e.target.value),
                })
              }
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              AI will generate {formData.module_count} modules with 3-5 lessons
              each
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-cyan-900/20 border border-cyan-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-cyan-100 font-medium mb-1">
                  How it works
                </p>
                <p className="text-xs text-cyan-200/70">
                  Our AI will analyze your inputs and generate a complete course
                  structure with modules, lessons, and content suggestions. You
                  can edit everything after generation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="border-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={loading || !formData.topic}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Course Outline
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface OutlinePreviewProps {
  outline: CourseOutline;
  onAccept: () => void;
  onReject: () => void;
}

export function OutlinePreview({
  outline,
  onAccept,
  onReject,
}: OutlinePreviewProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-cyan-400" />
          <h3 className="text-xl font-bold text-white">AI Generated Outline</h3>
        </div>
        <Badge className="bg-green-500/10 text-green-400 border-green-500/20 border">
          Ready to import
        </Badge>
      </div>

      {/* Course Info */}
      <div className="mb-6 pb-6 border-b border-gray-800">
        <h4 className="text-2xl font-bold text-white mb-2">
          {outline.course_title}
        </h4>
        <p className="text-gray-300">{outline.course_description}</p>
      </div>

      {/* Modules */}
      <div className="space-y-4 mb-6">
        {outline.modules.map((module, modIndex) => (
          <div key={modIndex} className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-bold flex-shrink-0">
                {modIndex + 1}
              </div>
              <div className="flex-1">
                <h5 className="font-semibold text-white mb-1">
                  {module.title}
                </h5>
                <p className="text-sm text-gray-400">{module.description}</p>
              </div>
            </div>

            {/* Lessons */}
            <div className="ml-11 space-y-2">
              {module.lessons.map((lesson, lessonIndex) => (
                <div
                  key={lessonIndex}
                  className="flex items-center gap-3 text-sm"
                >
                  <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                  <span className="text-gray-300">{lesson.title}</span>
                  <Badge className="text-xs bg-gray-700/50 text-gray-400 border-0">
                    {lesson.type}
                  </Badge>
                  <span className="text-gray-500 text-xs">
                    {lesson.duration_minutes} min
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onReject}
          className="flex-1 border-gray-700"
        >
          Regenerate
        </Button>
        <Button
          onClick={onAccept}
          className="flex-1 bg-cyan-600 hover:bg-cyan-500"
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Import to Course
        </Button>
      </div>
    </div>
  );
}
