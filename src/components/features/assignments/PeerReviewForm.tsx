"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Star, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import api from "@/lib/api";
import { toast } from "sonner";

const reviewSchema = z.object({
  content: z.string().min(10, "Review must be at least 10 characters"),
  score: z.number().min(0).max(100).optional(),
});

interface PeerReviewFormProps {
  assignmentId: number;
  peerReviewAssignmentId: number;
  submissionId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PeerReviewForm({
  assignmentId,
  peerReviewAssignmentId,
  submissionId,
  onSuccess,
  onCancel,
}: PeerReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      content: "",
      score: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof reviewSchema>) => {
    try {
      setIsSubmitting(true);
      await api.post("/peer-reviews/", {
        peer_review_assignment_id: peerReviewAssignmentId,
        content: values.content,
        score: values.score,
      });
      toast.success("Review submitted successfully!");
      onSuccess();
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Submit Peer Review</h3>
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="score"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Score (0-100)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Optional score"
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
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Feedback</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your constructive feedback here..."
                    className="bg-gray-900 border-gray-700 text-white min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-gray-700 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-cyan-600 hover:bg-cyan-500"
            >
              {isSubmitting ? (
                <>Submitting...</>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Review
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
