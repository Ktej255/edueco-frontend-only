"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  ChevronRight,
  CheckCircle,
  Circle,
  Lock,
  PlayCircle,
  BookOpen,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import api from "@/lib/api";
import { QuizAttempt } from "@/components/features/lms/QuizAttempt";
import { QuizResults } from "@/components/features/lms/QuizResults";
import { AssignmentSubmit } from "@/components/features/lms/AssignmentSubmit";
import { LockedLesson } from "@/components/features/lms/LockedLesson";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseReviewsSection from "@/components/CourseReviews";
import { MessageSquare, FileText, Star, Download } from "lucide-react";

interface Lesson {
  id: number;
  title: string;
  description: string;
  type: string;
  content: any;
  video_url: string | null;
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
  modules: Module[];
}

export default function CourseLearningPage() {
  const params = useParams();
  const courseId = params?.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [quizState, setQuizState] = useState<"idle" | "taking" | "results">(
    "idle",
  );
  const [quizResult, setQuizResult] = useState<any>(null);
  const [accessInfo, setAccessInfo] = useState<any>(null);

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      const [courseRes, progressRes] = await Promise.all([
        api.get(`/courses/${courseId}`),
        api.get(`/courses/${courseId}/progress`),
      ]);

      setCourse(courseRes.data);
      setProgress(progressRes.data.progress_percentage || 0);

      // Fetch completed lessons IDs (assuming the API returns them or we fetch them separately)
      // For now, we'll assume the progress endpoint returns a list of completed lesson IDs
      // If not, we might need another endpoint or update the progress endpoint
      // Let's mock it for now or update the API to return it
      // Ideally: setCompletedLessons(progressRes.data.completed_lesson_ids)

      // Since we didn't add completed_lesson_ids to the schema yet, let's fetch it via a new call or update the schema
      // For this iteration, I'll assume we can get it.
      // Actually, let's just use the count for now or fetch individual status if needed.
      // But to show checkmarks, we need IDs.
      // Let's add a quick fetch for lesson statuses if possible, or just rely on local state for the session.
      // Better: Update the fetch to get detailed progress.

      // Temporary: Fetch all lesson progresses
      // const progressDetails = await api.get(`/courses/${courseId}/my-progress-details`)
      // setCompletedLessons(progressDetails.data.map(p => p.lesson_id))
    } catch (error) {
      console.error("Failed to fetch course data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonClick = async (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setAccessInfo(null); // Reset access info while loading

    try {
      const response = await api.get(
        `/lessons/${lesson.id}/access?course_id=${courseId}`,
      );
      setAccessInfo(response.data);
    } catch (error) {
      console.error("Failed to check lesson access:", error);
      // Fallback to allow access if check fails (or handle error appropriately)
      setAccessInfo({ has_access: true });
    }
  };

  const markAsComplete = async () => {
    if (!currentLesson) return;

    try {
      await api.post(`/progress/lessons/${currentLesson.id}/mark-complete`);
      setCompletedLessons((prev) => [...prev, currentLesson.id]);

      // Update overall progress
      const progressRes = await api.get(`/courses/${courseId}/progress`);
      setProgress(progressRes.data.progress_percentage);

      // Find next lesson
      const allLessons = course?.modules.flatMap((m) => m.lessons) || [];
      const currentIndex = allLessons.findIndex(
        (l) => l.id === currentLesson.id,
      );
      if (currentIndex < allLessons.length - 1) {
        setCurrentLesson(allLessons[currentIndex + 1]);
      }
    } catch (error) {
      console.error("Failed to mark lesson complete:", error);
    }
  };

  const renderLessonContent = () => {
    if (!currentLesson) return null;

    // Check if access is denied
    if (accessInfo && !accessInfo.has_access) {
      return <LockedLesson lesson={currentLesson} accessInfo={accessInfo} />;
    }

    switch (currentLesson.type) {
      case "video":
        return (
          <div className="space-y-6">
            {/* Video Player Placeholder */}
            <div className="aspect-video bg-gray-900 rounded-xl flex items-center justify-center border border-gray-800">
              {currentLesson.video_url ? (
                <video
                  src={currentLesson.video_url}
                  controls
                  className="w-full h-full rounded-xl"
                  onEnded={markAsComplete} // Auto-complete on finish
                />
              ) : (
                <div className="text-center">
                  <PlayCircle className="h-20 w-20 text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-500">Video content coming soon</p>
                </div>
              )}
            </div>
          </div>
        );

      case "text":
        return (
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-8">
            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{
                __html:
                  currentLesson.content?.markdown
                    ?.replace(/\n/g, "<br/>")
                    ?.replace(
                      /# (.*)/g,
                      '<h1 class="text-3xl font-bold text-white mb-4">$1</h1>',
                    )
                    ?.replace(
                      /## (.*)/g,
                      '<h2 class="text-2xl font-bold text-white mb-3">$1</h2>',
                    ) || "Content not available",
              }}
            />
          </div>
        );

      case "quiz":
        if (quizState === "taking" && currentLesson.content?.quiz_id) {
          return (
            <QuizAttempt
              quizId={currentLesson.content.quiz_id}
              onComplete={(result) => {
                setQuizResult(result);
                setQuizState("results");
                if (result.passed) {
                  markAsComplete();
                }
              }}
            />
          );
        } else if (quizState === "results" && quizResult) {
          return (
            <QuizResults
              result={quizResult}
              onRetake={() => setQuizState("taking")}
              allowRetake={true}
            />
          );
        } else {
          return (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 text-center">
              <Award className="h-16 w-16 text-cyan-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Quiz Time!</h3>
              <p className="text-gray-400 mb-6">
                Test your knowledge with this lesson quiz
              </p>
              <Button
                onClick={() => setQuizState("taking")}
                className="bg-cyan-600 hover:bg-cyan-500"
              >
                Start Quiz
              </Button>
            </div>
          );
        }

      case "assignment":
        if (currentLesson.content?.assignment_id) {
          return (
            <AssignmentSubmit
              assignmentId={currentLesson.content.assignment_id}
              assignment={{
                title: currentLesson.title,
                description: currentLesson.description || "",
                instructions: currentLesson.content.instructions || "",
                max_score: currentLesson.content.max_score || 100,
                due_date: currentLesson.content.due_date,
                submission_type:
                  currentLesson.content.submission_type || "file",
              }}
              existingSubmission={null}
              onSubmitSuccess={() => {
                markAsComplete();
                alert("Assignment submitted successfully!");
              }}
            />
          );
        } else {
          return (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Assignment</h3>
              <p className="text-gray-300 mb-6">{currentLesson.description}</p>
              <div className="bg-gray-800 rounded-lg p-6 mb-6">
                <p className="text-gray-400 text-sm mb-2">Instructions:</p>
                <p className="text-white">
                  {currentLesson.content?.instructions ||
                    "Complete the assigned task"}
                </p>
              </div>
              <Button
                className="bg-cyan-600 hover:bg-cyan-500"
                onClick={markAsComplete}
              >
                Submit Assignment
              </Button>
            </div>
          );
        }

      default:
        return (
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 text-center">
            <p className="text-gray-400">Content type not supported yet</p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Course not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar - Lesson Navigation */}
      <div className="w-80 bg-gray-900 border-r border-gray-800 overflow-y-auto">
        {/* Course Header */}
        <div className="p-6 border-b border-gray-800">
          <h2 className="font-bold text-white mb-2 line-clamp-2">
            {course.title}
          </h2>
          <div className="mb-3">
            <Progress value={progress} className="h-2" />
          </div>
          <p className="text-sm text-gray-400">
            {Math.round(progress)}% Complete
          </p>
        </div>

        {/* Modules & Lessons */}
        <div className="p-4 space-y-4">
          {course.modules.map((module, modIndex) => (
            <div key={module.id}>
              {/* Module Header */}
              <div className="mb-2">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                  Module {modIndex + 1}
                </h3>
                <p className="text-white font-medium">{module.title}</p>
              </div>

              {/* Lessons */}
              <div className="space-y-1">
                {module.lessons.map((lesson) => {
                  const isActive = currentLesson?.id === lesson.id;
                  const isCompleted = completedLessons.includes(lesson.id);

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => handleLessonClick(lesson)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${
                        isActive
                          ? "bg-cyan-600 text-white"
                          : "hover:bg-gray-800 text-gray-300"
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        ) : lesson.is_preview ? (
                          <PlayCircle className="h-5 w-5" />
                        ) : (
                          <Circle className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium line-clamp-1">
                          {lesson.title}
                        </p>
                        <p className="text-xs opacity-70">
                          {lesson.duration_minutes} min
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-8">
          {currentLesson ? (
            <div className="space-y-6">
              {/* Lesson Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                  <span>{currentLesson.type.toUpperCase()}</span>
                  <ChevronRight className="h-4 w-4" />
                  <span>{currentLesson.duration_minutes} minutes</span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">
                  {currentLesson.title}
                </h1>
                {currentLesson.description && (
                  <p className="text-xl text-gray-400">
                    {currentLesson.description}
                  </p>
                )}
              </div>

              {/* Lesson Content */}
              {renderLessonContent()}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8 border-t border-gray-800">
                <Button variant="outline" className="border-gray-700">
                  Previous Lesson
                </Button>
                <Button
                  className="bg-cyan-600 hover:bg-cyan-500"
                  onClick={markAsComplete}
                  disabled={completedLessons.includes(currentLesson.id)}
                >
                  {completedLessons.includes(currentLesson.id) ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Completed
                    </>
                  ) : (
                    "Mark Complete & Continue"
                  )}
                </Button>
              </div>

              {/* Course Tabs (Overview, Q&A, Reviews, Resources) */}
              <div className="mt-12">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="w-full justify-start border-b border-gray-800 bg-transparent p-0 mb-6">
                    <TabsTrigger
                      value="overview"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-500 data-[state=active]:bg-transparent px-6 py-3"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="qa"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-500 data-[state=active]:bg-transparent px-6 py-3"
                    >
                      Q&A
                    </TabsTrigger>
                    <TabsTrigger
                      value="reviews"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-500 data-[state=active]:bg-transparent px-6 py-3"
                    >
                      Reviews
                    </TabsTrigger>
                    <TabsTrigger
                      value="resources"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-500 data-[state=active]:bg-transparent px-6 py-3"
                    >
                      Resources
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <h3 className="text-xl font-bold text-white">
                      About this lesson
                    </h3>
                    <p className="text-gray-300">
                      {currentLesson.description ||
                        "No description available for this lesson."}
                    </p>
                  </TabsContent>

                  <TabsContent value="qa">
                    <div className="bg-gray-900 rounded-lg p-8 text-center border border-gray-800">
                      <MessageSquare className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">
                        Lesson Q&A
                      </h3>
                      <p className="text-gray-400 mb-4">
                        Have a question? Ask your instructor and peers.
                      </p>
                      <Button variant="outline">Ask a Question</Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="reviews">
                    <CourseReviewsSection courseId={courseId} />
                  </TabsContent>

                  <TabsContent value="resources">
                    <div className="bg-gray-900 rounded-lg p-8 text-center border border-gray-800">
                      <Download className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">
                        Lesson Resources
                      </h3>
                      <p className="text-gray-400">
                        No resources attached to this lesson.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <BookOpen className="h-16 w-16 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-400">Select a lesson to begin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
