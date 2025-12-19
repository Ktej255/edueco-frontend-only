"use client";

import React, { useEffect, useState } from "react";
import { Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LearningPathCard } from "@/components/features/lms/LearningPathCard";
import api from "@/lib/api";
import { toast } from "sonner";

export default function LearningPathsPage() {
  const [allPaths, setAllPaths] = useState<any[]>([]);
  const [myEnrollments, setMyEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pathsRes, enrollmentsRes] = await Promise.all([
        api.get("/learning-paths/"),
        api.get("/learning-paths/my-enrollments").catch(() => ({ data: [] })),
      ]);

      setAllPaths(pathsRes.data);
      setMyEnrollments(enrollmentsRes.data);
    } catch (error) {
      console.error("Failed to fetch learning paths:", error);
      toast.error("Failed to load learning paths");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredPaths = allPaths.filter((path) => {
    if (difficultyFilter === "all") return true;
    return path.difficulty_level === difficultyFilter;
  });

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-400">
        Loading learning paths...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Learning Paths</h1>
          <p className="text-gray-400">
            Structured learning journeys to master new skills
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="bg-gray-800 border-gray-700">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-gray-700"
              >
                All Paths ({filteredPaths.length})
              </TabsTrigger>
              <TabsTrigger
                value="enrolled"
                className="data-[state=active]:bg-gray-700"
              >
                My Paths ({myEnrollments.length})
              </TabsTrigger>
            </TabsList>

            {/* Filters */}
            <div className="flex items-center gap-3">
              <Select
                value={difficultyFilter}
                onValueChange={setDifficultyFilter}
              >
                <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* All Paths Tab */}
          <TabsContent value="all">
            {filteredPaths.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                No learning paths available
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPaths.map((path) => (
                  <LearningPathCard key={path.id} path={path} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* My Paths Tab */}
          <TabsContent value="enrolled">
            {myEnrollments.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">
                  You haven't enrolled in any learning paths yet
                </p>
                <Button
                  onClick={() =>
                    document
                      .querySelector<HTMLButtonElement>('[value="all"]')
                      ?.click()
                  }
                  className="bg-cyan-600 hover:bg-cyan-500"
                >
                  Browse Learning Paths
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myEnrollments.map((enrollment) => (
                  <LearningPathCard
                    key={enrollment.id}
                    path={enrollment.path}
                    enrollment={enrollment}
                    showProgress={true}
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
