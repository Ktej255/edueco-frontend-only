"use client";

import React from "react";
import { FileText, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TemplateCardProps {
  template: {
    id: number;
    name: string;
    description?: string;
    background_url?: string;
    background_color: string;
    is_default: boolean;
    is_public: boolean;
    creator_id: number;
  };
  selected?: boolean;
  onSelect?: (id: number) => void;
  showActions?: boolean;
}

export function TemplateCard({
  template,
  selected = false,
  onSelect,
  showActions = true,
}: TemplateCardProps) {
  return (
    <Card
      className={`bg-gray-800 border-gray-700 hover:border-cyan-500/50 transition-all cursor-pointer ${selected ? "ring-2 ring-cyan-500" : ""}`}
      onClick={() => onSelect?.(template.id)}
    >
      <CardContent className="p-4">
        {/* Preview */}
        <div
          className="relative h-40 rounded-lg mb-4 overflow-hidden flex items-center justify-center"
          style={{ backgroundColor: template.background_color }}
        >
          {template.background_url ? (
            <img
              src={template.background_url}
              alt={template.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-4">
              <FileText className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p className="text-xs text-gray-400">Preview</p>
            </div>
          )}

          {/* Selection indicator */}
          {selected && (
            <div className="absolute top-2 right-2 bg-cyan-600 rounded-full p-1">
              <Check className="h-4 w-4 text-white" />
            </div>
          )}

          {/* Default badge */}
          {template.is_default && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-green-500/90 text-white">Default</Badge>
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h3 className="text-white font-semibold mb-1">{template.name}</h3>
          {template.description && (
            <p className="text-xs text-gray-400 line-clamp-2">
              {template.description}
            </p>
          )}

          <div className="flex items-center gap-2 mt-2">
            {template.is_public && (
              <Badge
                variant="secondary"
                className="bg-gray-700 text-gray-300 text-xs"
              >
                Public
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
