"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar, Clock, Video, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const liveClassSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  scheduled_at: z.string().min(1, "Schedule date/time is required"),
  duration_minutes: z.number().min(15).max(480),
  meeting_url: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  meeting_password: z.string().optional(),
  platform: z.enum(["zoom", "meet", "teams", "webrtc", "custom"]),
});

interface LiveClassSchedulerProps {
  courseId: number;
  onSuccess: () => void;
  onCancel: () => void;
  existingClass?: any;
}

export function LiveClassScheduler({
  courseId,
  onSuccess,
  onCancel,
  existingClass,
}: LiveClassSchedulerProps) {
  const form = useForm<z.infer<typeof liveClassSchema>>({
    resolver: zodResolver(liveClassSchema),
    defaultValues: {
      title: existingClass?.title || "",
      description: existingClass?.description || "",
      scheduled_at: existingClass?.scheduled_at
        ? new Date(existingClass.scheduled_at).toISOString().slice(0, 16)
        : "",
      duration_minutes: existingClass?.duration_minutes || 60,
      meeting_url: existingClass?.meeting_url || "",
      meeting_password: existingClass?.meeting_password || "",
      platform: existingClass?.platform || "zoom",
    },
  });

  const onSubmit = async (values: z.infer<typeof liveClassSchema>) => {
    try {
      // Convert scheduled_at to ISO string
      const scheduledAt = new Date(values.scheduled_at).toISOString();

      // API call would go here
      console.log("Creating live class:", {
        ...values,
        scheduled_at: scheduledAt,
        course_id: courseId,
      });
      onSuccess();
    } catch (error) {
      console.error("Failed to create live class:", error);
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          {existingClass ? "Edit Live Class" : "Schedule Live Class"}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-gray-400 hover:text-white"
        >
          Cancel
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Introduction to React Hooks"
                    className="bg-gray-900 border-gray-700 text-white"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">
                  Description (Optional)
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="We'll cover useState, useEffect, and custom hooks..."
                    className="bg-gray-900 border-gray-700 text-white min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="scheduled_at"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    Schedule Date & Time
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      className="bg-gray-900 border-gray-700 text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration_minutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    Duration (minutes)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="15"
                      max="480"
                      className="bg-gray-900 border-gray-700 text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="platform"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Platform</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="zoom">Zoom</SelectItem>
                    <SelectItem value="meet">Google Meet</SelectItem>
                    <SelectItem value="teams">Microsoft Teams</SelectItem>
                    <SelectItem value="webrtc">Built-in WebRTC</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="meeting_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">
                  Meeting URL (Optional)
                </FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://zoom.us/j/123456789"
                    className="bg-gray-900 border-gray-700 text-white"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-gray-400 text-sm">
                  Leave empty to generate automatically
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="meeting_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">
                  Meeting Password (Optional)
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Leave empty for no password"
                    className="bg-gray-900 border-gray-700 text-white"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-gray-700 text-gray-300"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-cyan-600 hover:bg-cyan-500">
              {existingClass ? "Update Class" : "Schedule Class"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
