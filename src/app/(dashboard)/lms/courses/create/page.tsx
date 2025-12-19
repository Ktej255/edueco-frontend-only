"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Sparkles,
  BookOpen,
  Wand2,
  FileText,
  Upload,
  LayoutTemplate
} from "lucide-react";
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
import api from "@/lib/api";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Course Basics", icon: BookOpen },
  { id: 2, label: "AI Outline", icon: Wand2 },
  { id: 3, label: "Content Generation", icon: FileText },
  { id: 4, label: "Assets & Publish", icon: Upload },
];

export default function CreateCoursePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    level: "beginner",
    price: 0,
    thumbnail_url: "",
    tags: "",
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      // Create course logic here
      const courseData = {
        ...formData,
        price: parseFloat(formData.price.toString() || "0"),
        tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
      };

      const response = await api.post("/courses/", courseData);
      router.push(`/lms/courses/${response.data.id}`);
    } catch (error) {
      console.error("Failed to create course:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Create New Course</h1>
            <p className="text-gray-400">Use our AI-powered tools to create engaging courses quickly</p>
          </div>
          <Button variant="outline" className="border-gray-800 text-white hover:bg-gray-900">
            <LayoutTemplate className="mr-2 h-4 w-4" />
            New from Template
          </Button>
        </div>

        {/* Steps Navigation */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between px-8">
            {STEPS.map((s, index) => (
              <div key={s.id} className="flex items-center flex-1 last:flex-none">
                <div
                  className={cn(
                    "flex items-center gap-3 cursor-pointer",
                    step === s.id ? "text-cyan-400" : step > s.id ? "text-green-500" : "text-gray-500"
                  )}
                  onClick={() => step > s.id && setStep(s.id)}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2",
                    step === s.id ? "border-cyan-400 bg-cyan-400/10" :
                      step > s.id ? "border-green-500 bg-green-500/10" :
                        "border-gray-600 bg-gray-800"
                  )}>
                    {step > s.id ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                  </div>
                  <span className="font-medium">{s.label}</span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className="h-[1px] flex-1 bg-gray-800 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-8 min-h-[400px]">
          {step === 1 && (
            <div className="max-w-3xl">
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-2">Course Information</h2>
                <p className="text-gray-400">Start with a course title, and our AI will draft the rest for you.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="text-white mb-2 block">Start with a Title *</Label>
                  <div className="flex gap-4">
                    <Input
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      placeholder="e.g., 'Introduction to Quantum Computing'"
                      className="bg-gray-900 border-gray-800 text-white h-12"
                    />
                    <Button variant="outline" className="h-12 w-12 border-gray-800 p-0">
                      <Wand2 className="h-4 w-4 text-cyan-400" />
                    </Button>
                  </div>
                </div>

                {/* Additional basic fields can go here */}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wand2 className="h-8 w-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">AI Outline Generator</h3>
              <p className="text-gray-400 mb-6">Let AI structure your course based on the title.</p>
              <Button className="bg-cyan-600 hover:bg-cyan-500">
                Generate Outline
              </Button>
            </div>
          )}

          {/* Placeholder for other steps */}
          {(step === 3 || step === 4) && (
            <div className="text-center py-12 text-gray-500">
              Step {step} content coming soon...
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-end mt-8">
          {step < 4 ? (
            <Button
              onClick={() => setStep(step + 1)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8"
            >
              Next: {STEPS[step].label}
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-500 text-white px-8"
            >
              Create Course
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
