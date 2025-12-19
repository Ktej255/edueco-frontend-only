"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Search,
  BookOpen,
  CheckCircle,
  Clock,
  Award,
  Download,
  PlayCircle,
} from "lucide-react";

type EnrolledCourse = {
  id: number;
  title: string;
  description: string;
  thumbnail_url?: string;
  instructor_name: string;
  progress_percentage: number;
  completion_date?: string;
  certificate_available: boolean;
  total_lessons: number;
  completed_lessons: number;
  last_accessed?: string;
  enrolled_at: string;
};

export default function MyCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchMyCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, searchQuery, filterStatus]);

  const fetchMyCourses = async () => {
    try {
      const response = await axios.get("/api/v1/enrollments/my-courses");
      setCourses(response.data);
    } catch (error) {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = [...courses];

    // Filter by search
    if (searchQuery.trim()) {
      filtered = filtered.filter((course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by status
    if (filterStatus === "in-progress") {
      filtered = filtered.filter(
        (course) =>
          course.progress_percentage > 0 && course.progress_percentage < 100,
      );
    } else if (filterStatus === "completed") {
      filtered = filtered.filter(
        (course) => course.progress_percentage === 100,
      );
    } else if (filterStatus === "not-started") {
      filtered = filtered.filter((course) => course.progress_percentage === 0);
    }

    setFilteredCourses(filtered);
  };

  const downloadCertificate = async (courseId: number) => {
    try {
      const response = await axios.get(
        `/api/v1/certificates/course/${courseId}/download`,
        { responseType: "blob" },
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `certificate-${courseId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Certificate downloaded!");
    } catch (error) {
      toast.error("Failed to download certificate");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-400">Loading your courses...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Courses</h1>
        <p className="text-gray-400">
          {courses.length} course{courses.length !== 1 ? "s" : ""} enrolled
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Enrolled</p>
                <p className="text-2xl font-bold">{courses.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">In Progress</p>
                <p className="text-2xl font-bold">
                  {
                    courses.filter(
                      (c) =>
                        c.progress_percentage > 0 &&
                        c.progress_percentage < 100,
                    ).length
                  }
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Completed</p>
                <p className="text-2xl font-bold">
                  {courses.filter((c) => c.progress_percentage === 100).length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Certificates</p>
                <p className="text-2xl font-bold">
                  {courses.filter((c) => c.certificate_available).length}
                </p>
              </div>
              <Award className="w-8 h-8 text-yellow-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search your courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-900 border-gray-800"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full md:w-48 bg-gray-900 border-gray-800">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="not-started">Not Started</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="w-16 h-16 text-gray-700 mb-4" />
            <p className="text-gray-400 text-lg mb-4">
              {searchQuery || filterStatus !== "all"
                ? "No courses match your filters"
                : "You haven't enrolled in any courses yet"}
            </p>
            {!searchQuery && filterStatus === "all" && (
              <Button onClick={() => router.push("/lms/courses")}>
                Browse Courses
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="bg-gray-900 border-gray-800 overflow-hidden hover:border-gray-700 transition-colors"
            >
              {/* Thumbnail */}
              <div
                className="h-40 bg-gray-800 bg-cover bg-center cursor-pointer"
                style={{
                  backgroundImage: course.thumbnail_url
                    ? `url(${course.thumbnail_url})`
                    : undefined,
                }}
                onClick={() => router.push(`/lms/courses/${course.id}/learn`)}
              >
                {!course.thumbnail_url && (
                  <div className="h-full flex items-center justify-center text-gray-600 text-4xl font-bold">
                    {course.title[0]}
                  </div>
                )}
                {/* Status Badge */}
                <div className="p-3">
                  {course.progress_percentage === 100 ? (
                    <Badge className="bg-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Completed
                    </Badge>
                  ) : course.progress_percentage > 0 ? (
                    <Badge className="bg-blue-600">In Progress</Badge>
                  ) : (
                    <Badge variant="secondary">Not Started</Badge>
                  )}
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-lg line-clamp-2">
                  {course.title}
                </CardTitle>
                <p className="text-sm text-gray-400">
                  by {course.instructor_name}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className="font-medium">
                      {course.progress_percentage}%
                    </span>
                  </div>
                  <Progress
                    value={course.progress_percentage}
                    className="h-2"
                  />
                  <div className="text-xs text-gray-500">
                    {course.completed_lessons} of {course.total_lessons} lessons
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {course.progress_percentage === 100 &&
                  course.certificate_available ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => downloadCertificate(course.id)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Certificate
                    </Button>
                  ) : null}
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() =>
                      router.push(`/lms/courses/${course.id}/learn`)
                    }
                  >
                    <PlayCircle className="w-4 h-4 mr-1" />
                    {course.progress_percentage === 0
                      ? "Start"
                      : course.progress_percentage === 100
                        ? "Review"
                        : "Continue"}
                  </Button>
                </div>

                {/* Last Accessed */}
                {course.last_accessed && (
                  <div className="text-xs text-gray-500">
                    Last accessed:{" "}
                    {new Date(course.last_accessed).toLocaleDateString()}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
