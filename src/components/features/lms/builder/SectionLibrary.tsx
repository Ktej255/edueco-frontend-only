"use client";

import { usePageBuilder, PageSection } from "@/store/pageBuilderStore";
import {
  Plus,
  Video,
  Layout,
  Users,
  MessageSquare,
  HelpCircle,
  DollarSign,
  BarChart,
  FileText,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function SectionLibrary() {
  const addSection = usePageBuilder((state) => state.addSection);

  const sections = [
    {
      type: "hero" as const,
      icon: Sparkles,
      label: "Hero Section",
      desc: "Title, subtitle, CTA",
    },
    {
      type: "features" as const,
      icon: Layout,
      label: "Features Grid",
      desc: "2/3/4 column features",
    },
    {
      type: "curriculum" as const,
      icon: FileText,
      label: "Curriculum",
      desc: "Course modules list",
    },
    {
      type: "instructor" as const,
      icon: Users,
      label: "Instructor Bio",
      desc: "Photo, name, credentials",
    },
    {
      type: "testimonials" as const,
      icon: MessageSquare,
      label: "Testimonials",
      desc: "Student reviews",
    },
    {
      type: "faq" as const,
      icon: HelpCircle,
      label: "FAQ",
      desc: "Questions & answers",
    },
    {
      type: "pricing" as const,
      icon: DollarSign,
      label: "Pricing",
      desc: "Price card with features",
    },
    {
      type: "stats" as const,
      icon: BarChart,
      label: "Stats",
      desc: "Key numbers",
    },
    {
      type: "video" as const,
      icon: Video,
      label: "Video Embed",
      desc: "Preview video",
    },
  ];

  return (
    <div className="w-80 bg-gray-900 border-r border-gray-800 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold text-white mb-4">Add Sections</h2>
      <div className="space-y-2">
        {sections.map((section) => (
          <button
            key={section.type}
            onClick={() => addSection(section.type)}
            className="w-full flex items-start gap-3 p-3 rounded-lg border border-gray-800 hover:border-cyan-500 hover:bg-gray-800 transition text-left group"
          >
            <div className="p-2 rounded-lg bg-gray-800 group-hover:bg-cyan-500/10">
              <section.icon className="h-5 w-5 text-gray-400 group-hover:text-cyan-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-white text-sm">
                {section.label}
              </div>
              <div className="text-xs text-gray-500">{section.desc}</div>
            </div>
            <Plus className="h-4 w-4 text-gray-600 group-hover:text-cyan-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition" />
          </button>
        ))}
      </div>
    </div>
  );
}
