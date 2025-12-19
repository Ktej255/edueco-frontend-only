"use client";

import { usePageBuilder } from "@/store/pageBuilderStore";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export function StyleEditor() {
  const selectedSectionId = usePageBuilder((state) => state.selectedSectionId);
  const sections = usePageBuilder((state) => state.sections);
  const updateSection = usePageBuilder((state) => state.updateSection);

  const selectedSection = sections.find((s) => s.id === selectedSectionId);

  if (!selectedSection) {
    return (
      <div className="w-80 bg-gray-900 border-l border-gray-800 p-4">
        <p className="text-gray-500 text-sm text-center mt-8">
          Select a section to edit its content and styles
        </p>
      </div>
    );
  }

  const updateContent = (key: string, value: any) => {
    updateSection(selectedSection.id, {
      content: { ...selectedSection.content, [key]: value },
    });
  };

  const updateStyles = (key: string, value: any) => {
    updateSection(selectedSection.id, {
      styles: { ...selectedSection.styles, [key]: value },
    });
  };

  return (
    <div className="w-80 bg-gray-900 border-l border-gray-800 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold text-white mb-4">Edit Section</h2>

      {/* Content Editor */}
      <div className="space-y-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-400">Content</h3>

        {selectedSection.type === "hero" && (
          <>
            <div>
              <Label className="text-gray-300">Title</Label>
              <Input
                value={selectedSection.content.title || ""}
                onChange={(e) => updateContent("title", e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-300">Subtitle</Label>
              <Textarea
                value={selectedSection.content.subtitle || ""}
                onChange={(e) => updateContent("subtitle", e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                rows={3}
              />
            </div>
            <div>
              <Label className="text-gray-300">CTA Button Text</Label>
              <Input
                value={selectedSection.content.ctaText || ""}
                onChange={(e) => updateContent("ctaText", e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </>
        )}

        {selectedSection.type === "features" && (
          <div>
            <Label className="text-gray-300 mb-2  block">Features</Label>
            {selectedSection.content.features?.map(
              (feature: any, idx: number) => (
                <div
                  key={idx}
                  className="mb-3 p-3 bg-gray-800 rounded-lg border border-gray-700"
                >
                  <Input
                    placeholder="Feature title"
                    value={feature.title}
                    onChange={(e) => {
                      const newFeatures = [...selectedSection.content.features];
                      newFeatures[idx].title = e.target.value;
                      updateContent("features", newFeatures);
                    }}
                    className="mb-2 bg-gray-900 border-gray-600 text-white"
                  />
                  <Input
                    placeholder="Feature description"
                    value={feature.description}
                    onChange={(e) => {
                      const newFeatures = [...selectedSection.content.features];
                      newFeatures[idx].description = e.target.value;
                      updateContent("features", newFeatures);
                    }}
                    className="bg-gray-900 border-gray-600 text-white"
                  />
                </div>
              ),
            )}
          </div>
        )}

        {selectedSection.type === "instructor" && (
          <>
            <div>
              <Label className="text-gray-300">Name</Label>
              <Input
                value={selectedSection.content.name || ""}
                onChange={(e) => updateContent("name", e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-300">Title</Label>
              <Input
                value={selectedSection.content.title || ""}
                onChange={(e) => updateContent("title", e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-300">Bio</Label>
              <Textarea
                value={selectedSection.content.bio || ""}
                onChange={(e) => updateContent("bio", e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                rows={4}
              />
            </div>
          </>
        )}

        {selectedSection.type === "pricing" && (
          <>
            <div>
              <Label className="text-gray-300">Price (INR)</Label>
              <Input
                type="number"
                value={selectedSection.content.price || 0}
                onChange={(e) =>
                  updateContent("price", parseInt(e.target.value))
                }
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </>
        )}
      </div>

      {/* Styles Editor */}
      <div className="space-y-4 pt-4 border-t border-gray-800">
        <h3 className="text-sm font-semibold text-gray-400">Styling</h3>

        <div>
          <Label className="text-gray-300">Padding</Label>
          <select
            value={selectedSection.styles.padding || "medium"}
            onChange={(e) => updateStyles("padding", e.target.value)}
            className="w-full mt-1 bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <div>
          <Label className="text-gray-300">Text Align</Label>
          <select
            value={selectedSection.styles.textAlign || "center"}
            onChange={(e) => updateStyles("textAlign", e.target.value)}
            className="w-full mt-1 bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
      </div>
    </div>
  );
}
