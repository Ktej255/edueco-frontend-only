"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  BookOpen,
  Clock,
  Users,
  Star,
  PlayCircle,
  CheckCircle,
  Lock,
  Award,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import api from "@/lib/api";
import { PaymentGatewayDialog } from "@/components/features/lms/PaymentGatewayDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Lesson {
  id: number;
  title: string;
  description: string;
  type: string;
  duration_minutes: number;
  is_preview: boolean;
  order_index: number;
}

interface Module {
  id: number;
  title: string;
  description: string;
  duration_minutes: number;
  order_index: number;
  lessons: Lesson[];
}

interface Course {
  id: number;
  title: string;
  description: string;
  long_description: string;
  category: string;
  level: string;
  thumbnail_url: string | null;
  preview_video_url: string | null;
  price: number;
  currency: string;
  total_enrollments: number;
  average_rating: number;
  total_reviews: number;
  total_duration_minutes: number;
  instructor_id: number;
  modules: Module[];
  is_password_protected: boolean;
}

const LessonTypeIcon = ({ type }: { type: string }) => {
  const icons = {
    video: <PlayCircle className="h-4 w-4" />,
    text: <BookOpen className="h-4 w-4" />,
    quiz: <Award className="h-4 w-4" />,
    assignment: <CheckCircle className="h-4 w-4" />,
  };
  return icons[type as keyof typeof icons] || <BookOpen className="h-4 w-4" />;
};

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [expandedModules, setExpandedModules] = useState<number[]>([]);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
      checkEnrollment();
    }
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const response = await api.get(`/courses/${courseId}`);
      setCourse(response.data);
      // Expand first module by default
      if (response.data.modules && response.data.modules.length > 0) {
        setExpandedModules([response.data.modules[0].id]);
      }
    } catch (error) {
      console.error("Failed to fetch course:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const response = await api.get("/courses/my-courses");
      const enrolled = response.data.some(
        (e: any) => e.course_id === parseInt(courseId),
      );
      setIsEnrolled(enrolled);
    } catch (error) {
      console.error("Failed to check enrollment:", error);
    }
  };

  const handleEnroll = async () => {
    // Check for password protection first
    if (course?.is_password_protected && !password && course.price <= 0) {
      setPasswordDialogOpen(true);
      return;
    }

    // If course is free, enroll directly
    if (course && course.price <= 0) {
      try {
        setEnrolling(true);
        await api.post(`/courses/${courseId}/enroll`, { password });
        setIsEnrolled(true);
        setPasswordDialogOpen(false);
        // Redirect to learning page
        router.push(`/lms/courses/${courseId}/learn`);
      } catch (error: any) {
        console.error("Failed to enroll:", error);
        alert(error.response?.data?.detail || "Failed to enroll in course");
        if (error.response?.status === 403) {
          setPassword(""); // Clear password on failure
        }
      } finally {
        setEnrolling(false);
      }
    } else {
      // Open payment dialog for paid courses
      setPaymentDialogOpen(true);
    }
  };

  const toggleModule = (moduleId: number) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId],
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-6 flex items-center justify-center">
        <div className="text-white">Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-black p-6 flex items-center justify-center">
        <div className="text-white">Course not found</div>
      </div>
    );
  }

  const totalLessons = course.modules.reduce(
    (acc, mod) => acc + mod.lessons.length,
    0,
  );

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-cyan-900/20 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Course Info */}
            <div className="lg:col-span-2">
              <div className="flex gap-3 mb-4">
                <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 border">
                  {course.category.replace(/_/g, " ")}
                </Badge>
                <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 border">
                  {course.level}
                </Badge>
              </div>

              <h1 className="text-4xl font-bold text-white mb-4">
                {course.title}
              </h1>
              <p className="text-xl text-gray-300 mb-6">{course.description}</p>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-white font-medium">
                    {course.average_rating.toFixed(1)}
                  </span>
                  <span className="text-gray-400">
                    ({course.total_reviews} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">
                    {course.total_enrollments.toLocaleString()} students
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">
                    {Math.floor(course.total_duration_minutes / 60)}h{" "}
                    {course.total_duration_minutes % 60}m total
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">{totalLessons} lessons</span>
                </div>
              </div>
            </div>

            {/* Right: Enrollment Card */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 sticky top-6">
                {course.thumbnail_url && (
                  <div className="relative mb-4 group">
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    {course.preview_video_url && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition">
                        <PlayCircle className="h-12 w-12 text-white" />
                      </div>
                    )}
                  </div>
                )}

                {/* Price Display */}
                <div className="mb-6">
                  {course.price > 0 ? (
                    <div>
                      <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text mb-2">
                        ₹{course.price.toLocaleString("en-IN")}
                      </div>
                      <p className="text-sm text-gray-400">
                        One-time payment • Lifetime access
                      </p>
                    </div>
                  ) : (
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      FREE
                    </div>
                  )}
                </div>

                {isEnrolled ? (
                  <Button
                    onClick={() =>
                      router.push(`/lms/courses/${courseId}/learn`)
                    }
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white mb-4"
                    size="lg"
                  >
                    Continue Learning
                  </Button>
                ) : (
                  <Button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/30 mb-4"
                    size="lg"
                  >
                    {enrolling
                      ? "Enrolling..."
                      : course.price > 0
                        ? "Buy Now"
                        : "Enroll for Free"}
                  </Button>
                )}

                {/* Preview Lessons Info */}
                {!isEnrolled && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <PlayCircle className="h-4 w-4 text-green-400" />
                      <span className="text-sm font-semibold text-green-400">
                        Free Preview Available
                      </span>
                    </div>
                    <p className="text-xs text-gray-300">
                      Try sample lessons before enrolling
                    </p>
                  </div>
                )}

                {/* Money-back guarantee (for paid courses) */}
                {course.price > 0 && (
                  <div className="text-center pt-4 border-t border-gray-800">
                    <p className="text-sm text-gray-400">
                      30-day money-back guarantee
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Description & Curriculum */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                About This Course
              </h2>
              <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                {course.long_description || course.description}
              </p>
            </div>

            {/* Curriculum */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                Course Curriculum
              </h2>

              <div className="space-y-3">
                {course.modules.map((module, moduleIndex) => (
                  <div
                    key={module.id}
                    className="border border-gray-800 rounded-lg overflow-hidden"
                  >
                    {/* Module Header */}
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-800 transition"
                    >
                      <div className="flex items-center gap-3 flex-1 text-left">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-bold">
                          {moduleIndex + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">
                            {module.title}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {module.lessons.length} lessons •{" "}
                            {module.duration_minutes} min
                          </p>
                        </div>
                      </div>
                      {expandedModules.includes(module.id) ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </button>

                    {/* Lessons */}
                    {expandedModules.includes(module.id) && (
                      <div className="border-t border-gray-800">
                        {module.lessons.map((lesson) => {
                          const canAccess = isEnrolled || lesson.is_preview;
                          return (
                            <div
                              key={lesson.id}
                              onClick={() => {
                                if (canAccess) {
                                  router.push(
                                    `/lms/courses/${courseId}/learn?lesson=${lesson.id}`,
                                  );
                                }
                              }}
                              className={`flex items-center justify-between p-4 hover:bg-gray-800/30 transition border-b border-gray-800/50 last:border-b-0 ${canAccess
                                  ? "cursor-pointer"
                                  : "cursor-not-allowed"
                                }`}
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <div className="text-gray-500">
                                  {lesson.is_preview ? (
                                    <PlayCircle className="h-4 w-4 text-green-400" />
                                  ) : !isEnrolled ? (
                                    <Lock className="h-4 w-4" />
                                  ) : (
                                    <LessonTypeIcon type={lesson.type} />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p
                                    className={`text-sm ${canAccess ? "text-white hover:text-cyan-400" : "text-gray-400"}`}
                                  >
                                    {lesson.title}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-xs text-gray-500">
                                  {lesson.duration_minutes} min
                                </span>
                                {lesson.is_preview && (
                                  <Badge className="bg-green-500/10 text-green-400 border-0 text-xs">
                                    Preview
                                  </Badge>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 sticky top-6">
              <h3 className="font-bold text-white mb-4">
                This course includes:
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-gray-300">
                  <PlayCircle className="h-4 w-4 text-cyan-400" />
                  <span>
                    {Math.floor(course.total_duration_minutes / 60)} hours
                    on-demand video
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <BookOpen className="h-4 w-4 text-cyan-400" />
                  <span>{totalLessons} lessons</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Award className="h-4 w-4 text-cyan-400" />
                  <span>Certificate of completion</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <CheckCircle className="h-4 w-4 text-cyan-400" />
                  <span>Full lifetime access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Password Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">
              Course Password Required
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-400">
              This course is password protected. Please enter the password to
              enroll.
            </p>
            <div className="space-y-2">
              <Label htmlFor="course-password">Password</Label>
              <Input
                id="course-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Enter course password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPasswordDialogOpen(false)}
              className="border-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEnroll}
              disabled={!password || enrolling}
              className="bg-cyan-600 hover:bg-cyan-500"
            >
              {enrolling ? "Enrolling..." : "Submit & Enroll"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
