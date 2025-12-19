"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Plus, Video, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LiveClassCard } from "@/components/features/lms/LiveClassCard";
import { LiveClassScheduler } from "@/components/features/lms/LiveClassScheduler";
import api from "@/lib/api";
import { toast } from "sonner";

export default function LiveClassesPage() {
  const params = useParams();
  const courseId = params?.id as string;

  const [liveClasses, setLiveClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScheduler, setShowScheduler] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const fetchLiveClasses = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/live-classes/courses/${courseId}/live-classes`,
      );
      setLiveClasses(response.data);
    } catch (error) {
      console.error("Failed to fetch live classes:", error);
      toast.error("Failed to load live classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchLiveClasses();
    }
  }, [courseId]);

  const handleJoinClass = (id: number) => {
    const liveClass = liveClasses.find((lc) => lc.id === id);
    if (liveClass?.meeting_url) {
      window.open(liveClass.meeting_url, "_blank");
      // Record attendance
      api.post(`/live-classes/${id}/join`).catch(console.error);
    }
  };

  const handleViewRecording = (id: number) => {
    const liveClass = liveClasses.find((lc) => lc.id === id);
    if (liveClass?.recording_url) {
      window.open(liveClass.recording_url, "_blank");
    }
  };

  const filterClasses = (status?: string) => {
    if (!status || status === "all") return liveClasses;
    return liveClasses.filter((lc) => lc.status === status);
  };

  const upcomingClasses = liveClasses.filter(
    (lc) => lc.status === "scheduled" && new Date(lc.scheduled_at) > new Date(),
  );
  const liveNow = liveClasses.filter((lc) => lc.status === "live");
  const pastClasses = liveClasses.filter((lc) => lc.status === "completed");

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Live Classes</h1>
            <p className="text-gray-400">
              Join live sessions and watch recordings
            </p>
          </div>
          <Button
            onClick={() => setShowScheduler(!showScheduler)}
            className="bg-cyan-600 hover:bg-cyan-500 transition-all hover:scale-105"
          >
            <Plus className="mr-2 h-4 w-4" />
            Schedule Live Class
          </Button>
        </div>

        {/* Scheduler */}
        {showScheduler && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
            <LiveClassScheduler
              courseId={Number(courseId)}
              onSuccess={() => {
                setShowScheduler(false);
                fetchLiveClasses();
                toast.success("Live class scheduled successfully!");
              }}
              onCancel={() => setShowScheduler(false)}
            />
          </div>
        )}

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="bg-gray-800 border-gray-700 p-1">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400"
            >
              All ({liveClasses.length})
            </TabsTrigger>
            <TabsTrigger
              value="live"
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400"
            >
              Live Now ({liveNow.length})
            </TabsTrigger>
            <TabsTrigger
              value="upcoming"
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400"
            >
              Upcoming ({upcomingClasses.length})
            </TabsTrigger>
            <TabsTrigger
              value="past"
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400"
            >
              Past ({pastClasses.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="all"
            className="space-y-4 focus-visible:outline-none"
          >
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <LiveClassCard key={i} isLoading={true} />
                ))}
              </div>
            ) : filterClasses().length === 0 ? (
              <div className="text-center py-16 bg-gray-900/50 rounded-lg border border-gray-800 border-dashed">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
                  <Video className="h-8 w-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">
                  No live classes found
                </h3>
                <p className="text-gray-400">
                  There are no classes scheduled in this category.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterClasses().map((liveClass) => (
                  <LiveClassCard
                    key={liveClass.id}
                    liveClass={liveClass}
                    onJoin={handleJoinClass}
                    onViewRecording={handleViewRecording}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent
            value="live"
            className="space-y-4 focus-visible:outline-none"
          >
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2].map((i) => (
                  <LiveClassCard key={i} isLoading={true} />
                ))}
              </div>
            ) : liveNow.length === 0 ? (
              <div className="text-center py-16 bg-gray-900/50 rounded-lg border border-gray-800 border-dashed">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
                  <Video className="h-8 w-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">
                  No live classes happening now
                </h3>
                <p className="text-gray-400">
                  Check back later for upcoming sessions.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {liveNow.map((liveClass) => (
                  <LiveClassCard
                    key={liveClass.id}
                    liveClass={liveClass}
                    onJoin={handleJoinClass}
                    onViewRecording={handleViewRecording}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent
            value="upcoming"
            className="space-y-4 focus-visible:outline-none"
          >
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <LiveClassCard key={i} isLoading={true} />
                ))}
              </div>
            ) : upcomingClasses.length === 0 ? (
              <div className="text-center py-16 bg-gray-900/50 rounded-lg border border-gray-800 border-dashed">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
                  <Calendar className="h-8 w-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">
                  No upcoming classes
                </h3>
                <p className="text-gray-400">
                  Schedule a new class to get started.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingClasses.map((liveClass) => (
                  <LiveClassCard
                    key={liveClass.id}
                    liveClass={liveClass}
                    onJoin={handleJoinClass}
                    onViewRecording={handleViewRecording}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent
            value="past"
            className="space-y-4 focus-visible:outline-none"
          >
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <LiveClassCard key={i} isLoading={true} />
                ))}
              </div>
            ) : pastClasses.length === 0 ? (
              <div className="text-center py-16 bg-gray-900/50 rounded-lg border border-gray-800 border-dashed">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
                  <Clock className="h-8 w-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">
                  No past classes
                </h3>
                <p className="text-gray-400">
                  Completed classes will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastClasses.map((liveClass) => (
                  <LiveClassCard
                    key={liveClass.id}
                    liveClass={liveClass}
                    onJoin={handleJoinClass}
                    onViewRecording={handleViewRecording}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
