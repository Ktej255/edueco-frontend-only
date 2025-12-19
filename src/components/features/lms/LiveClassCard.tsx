"use client";

import React from "react";
import { Calendar, Clock, Video, PlayCircle, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface LiveClassCardProps {
  liveClass?: {
    id: number;
    title: string;
    description?: string;
    scheduled_at: string;
    duration_minutes: number;
    status: "scheduled" | "live" | "completed" | "cancelled";
    meeting_url?: string;
    recording_url?: string;
    recording_available: boolean;
    instructor_id: number;
    platform: string;
  };
  onJoin?: (id: number) => void;
  onViewRecording?: (id: number) => void;
  showActions?: boolean;
  isLoading?: boolean;
}

export function LiveClassCard({
  liveClass,
  onJoin,
  onViewRecording,
  showActions = true,
  isLoading = false,
}: LiveClassCardProps) {
  if (isLoading || !liveClass) {
    return (
      <Card className="bg-gray-800 border-gray-700 h-full">
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <Skeleton className="h-6 w-3/4 bg-gray-700" />
            <Skeleton className="h-5 w-16 bg-gray-700" />
          </div>
          <Skeleton className="h-4 w-full bg-gray-700" />
          <Skeleton className="h-4 w-2/3 bg-gray-700" />
          <div className="space-y-2 pt-2">
            <Skeleton className="h-4 w-1/2 bg-gray-700" />
            <Skeleton className="h-4 w-1/3 bg-gray-700" />
          </div>
          {showActions && <Skeleton className="h-10 w-full bg-gray-700 mt-4" />}
        </CardContent>
      </Card>
    );
  }

  const scheduledDate = new Date(liveClass.scheduled_at);
  const isUpcoming = scheduledDate > new Date();
  const isLive = liveClass.status === "live";
  const isPast = liveClass.status === "completed";

  const getStatusBadge = () => {
    switch (liveClass.status) {
      case "live":
        return (
          <Badge className="bg-red-500 text-white animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]">
            ● LIVE
          </Badge>
        );
      case "scheduled":
        return (
          <Badge
            variant="secondary"
            className="bg-blue-500/10 text-blue-400 border border-blue-500/20"
          >
            Scheduled
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="secondary"
            className="bg-gray-500/10 text-gray-400 border border-gray-500/20"
          >
            Completed
          </Badge>
        );
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 group h-full flex flex-col">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h3
                  className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors line-clamp-1"
                  title={liveClass.title}
                >
                  {liveClass.title}
                </h3>
                {getStatusBadge()}
              </div>
              {liveClass.description && (
                <p className="text-sm text-gray-400 line-clamp-2 mb-4 h-10">
                  {liveClass.description}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Calendar className="h-4 w-4 text-cyan-400" />
              <span>
                {scheduledDate.toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Clock className="h-4 w-4 text-cyan-400" />
              <span>{liveClass.duration_minutes} minutes</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Video className="h-4 w-4 text-cyan-400" />
              <span className="capitalize">{liveClass.platform}</span>
            </div>
          </div>
        </div>

        {showActions && (
          <div className="flex gap-2 mt-auto pt-4 border-t border-gray-700/50">
            {isLive && liveClass.meeting_url && (
              <Button
                onClick={() => onJoin?.(liveClass.id)}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/20 transition-all hover:scale-[1.02]"
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                Join Live
              </Button>
            )}

            {isUpcoming && !isLive && (
              <Button
                variant="outline"
                className="flex-1 border-gray-700 text-gray-300 bg-gray-800/50 cursor-not-allowed opacity-70"
                disabled
              >
                <Calendar className="mr-2 h-4 w-4" />
                Upcoming
              </Button>
            )}

            {isPast &&
              liveClass.recording_available &&
              liveClass.recording_url && (
                <Button
                  onClick={() => onViewRecording?.(liveClass.id)}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/20 transition-all hover:scale-[1.02]"
                >
                  <PlayCircle className="mr-2 h-4 w-4" />
                  View Recording
                </Button>
              )}

            {isPast && !liveClass.recording_available && (
              <Button
                variant="outline"
                className="flex-1 border-gray-700 text-gray-400 bg-gray-800/50 cursor-not-allowed"
                disabled
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Attended
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
