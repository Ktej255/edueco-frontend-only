"use client";

import React, { useState, useEffect } from "react";
import { Users, TrendingUp, Award, Clock, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

interface Cohort {
  id: string;
  name: string;
  start_date: string;
  user_count: number;
  completion_rate: number;
  avg_progress: number;
  retention_rate: number;
}

export default function CohortAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [courseId, setCourseId] = useState<string>("all");
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [courses, setCourses] = useState<Array<{ id: number; title: string }>>([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    fetchCohorts();
  }, [courseId]);

  const fetchCourses = async () => {
    try {
      const response = await api.get("/courses");
      setCourses(response.data.items || []);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  const fetchCohorts = async () => {
    try {
      setLoading(true);
      const url = courseId === "all" ? "/analytics/cohorts" : `/analytics/cohorts?course_id=${courseId}`;
      const response = await api.get(url);
      setCohorts(response.data);
    } catch (error) {
      console.error("Failed to fetch cohorts:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8" />
            Cohort Analytics
          </h1>
          <p className="text-muted-foreground mt-2">
            Track performance and engagement by student cohorts
          </p>
        </div>
        <Select value={courseId} onValueChange={setCourseId}>
          <SelectTrigger className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id.toString()}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {cohorts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No cohort data available</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {cohorts.map((cohort) => (
            <Card key={cohort.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{cohort.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Started: {new Date(cohort.start_date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline">
                    <Users className="h-3 w-3 mr-1" />
                    {cohort.user_count} students
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Avg Progress</span>
                    </div>
                    <p className="text-2xl font-bold">{cohort.avg_progress.toFixed(1)}%</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Completion Rate</span>
                    </div>
                    <p className={`text-2xl font-bold ${cohort.completion_rate >= 70 ? "text-green-600" : cohort.completion_rate >= 40 ? "text-yellow-600" : "text-red-600"}`}>
                      {cohort.completion_rate.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Retention Rate</span>
                    </div>
                    <p className={`text-2xl font-bold ${cohort.retention_rate >= 80 ? "text-green-600" : cohort.retention_rate >= 50 ? "text-yellow-600" : "text-red-600"}`}>
                      {cohort.retention_rate.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
