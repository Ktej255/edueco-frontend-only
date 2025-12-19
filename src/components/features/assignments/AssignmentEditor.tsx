"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface AssignmentEditorProps {
  title: string;
  description: string;
  maxPoints: number;
  dueDate: string;
  allowLateSubmission: boolean;
  latePenaltyPerDay: number;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onMaxPointsChange: (points: number) => void;
  onDueDateChange: (date: string) => void;
  onAllowLateChange: (allow: boolean) => void;
  onLatePenaltyChange: (penalty: number) => void;
}

export function AssignmentEditor({
  title,
  description,
  maxPoints,
  dueDate,
  allowLateSubmission,
  latePenaltyPerDay,
  onTitleChange,
  onDescriptionChange,
  onMaxPointsChange,
  onDueDateChange,
  onAllowLateChange,
  onLatePenaltyChange,
}: AssignmentEditorProps) {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="title" className="text-white">
          Assignment Title
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white mt-2"
          placeholder="e.g., Week 1 Essay Assignment"
        />
      </div>

      <div>
        <Label htmlFor="description" className="text-white">
          Description
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white mt-2"
          rows={5}
          placeholder="Provide detailed instructions for the assignment..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="max-points" className="text-white">
            Max Points
          </Label>
          <Input
            id="max-points"
            type="number"
            min="0"
            step="0.5"
            value={maxPoints}
            onChange={(e) => onMaxPointsChange(parseFloat(e.target.value))}
            className="bg-gray-800 border-gray-700 text-white mt-2"
          />
        </div>

        <div>
          <Label htmlFor="due-date" className="text-white">
            Due Date
          </Label>
          <div className="relative mt-2">
            <Input
              id="due-date"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => onDueDateChange(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-6">
        <h3 className="text-white font-medium mb-4">
          Late Submission Settings
        </h3>

        <div className="flex items-center gap-3 mb-4">
          <input
            type="checkbox"
            id="allow-late"
            checked={allowLateSubmission}
            onChange={(e) => onAllowLateChange(e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="allow-late" className="text-white cursor-pointer">
            Allow late submissions
          </Label>
        </div>

        {allowLateSubmission && (
          <div>
            <Label htmlFor="late-penalty" className="text-white">
              Late Penalty (% per day)
            </Label>
            <Input
              id="late-penalty"
              type="number"
              min="0"
              max="100"
              step="1"
              value={latePenaltyPerDay}
              onChange={(e) => onLatePenaltyChange(parseFloat(e.target.value))}
              className="bg-gray-800 border-gray-700 text-white mt-2"
            />
            <p className="text-sm text-gray-400 mt-2">
              Example: 10% penalty = 10 points deducted per day late on a
              100-point assignment
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
