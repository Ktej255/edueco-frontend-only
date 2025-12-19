"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Clock,
  Award,
  Target,
  TrendingUp,
  PlayCircle,
  Calendar,
  Coins,
  Users,
} from "lucide-react";

type CourseProgress = {
  id: number;
  title: string;
  thumbnail_url?: string;
  progress_percentage: number;
  last_accessed?: string;
  next_lesson_title?: string;
  total_lessons: number;
  completed_lessons: number;
};

type DashboardData = {
  stats: {
    courses_enrolled: number;
    courses_completed: number;
    total_hours_learned: number;
    current_streak: number;
    coins_earned: number;
    achievements_unlocked: number;
  };
  continue_learning: CourseProgress[];
  upcoming_classes: Array<{
    id: number;
    title: string;
    scheduled_at: string;
    instructor_name: string;
  }>;
  recent_achievements: Array<{
    id: number;
    title: string;
    description: string;
    icon_url?: string;
    earned_at: string;
  }>;
};

export default function StudentDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  // Placeholder for peer reviews - should be fetched from API
  const [peerReviews] = useState({ pending: 0, received: 0 });

  useEffect(() => {
    fetchDashboard();
    fetchRecommendations();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await axios.get("/api/v1/student/dashboard");
      setData(response.data);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const res = await axios.get("/api/v1/recommendations/for-you?limit=3");
      setRecommendations(res.data.recommendations);
    } catch (error) {
      console.error("Failed to load recommendations");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-400">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center text-gray-400">No data available</div>
      </div>
    );
  }

  const { stats, continue_learning, upcoming_classes, recent_achievements } =
    data;

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
        <p className="text-gray-400">
          Ready to continue your learning journey?
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Enrolled Courses
            </CardTitle>
            <BookOpen className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.courses_enrolled}</div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.courses_completed} completed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Hours Learned</CardTitle>
            <Clock className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.total_hours_learned}
            </div>
            <p className="text-xs text-gray-500 mt-1">Total time invested</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Current Streak
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.current_streak} days
            </div>
            <p className="text-xs text-gray-500 mt-1">Keep it going! 🔥</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Coins Earned</CardTitle>
            <Coins className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.coins_earned}</div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.achievements_unlocked} achievements
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Learning */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Continue Learning</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/lms/my-courses")}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {continue_learning.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No courses in progress</p>
                  <Button
                    className="mt-4"
                    onClick={() => router.push("/lms/courses")}
                  >
                    Browse Courses
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {continue_learning.map((course) => (
                    <div
                      key={course.id}
                      className="flex gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors cursor-pointer"
                      onClick={() =>
                        router.push(`/lms/courses/${course.id}/learn`)
                      }
                    >
                      {/* Thumbnail */}
                      <div
                        className="w-32 h-20 bg-gray-700 rounded flex-shrink-0 bg-cover bg-center"
                        style={{
                          backgroundImage: course.thumbnail_url
                            ? `url(${course.thumbnail_url})`
                            : undefined,
                        }}
                      >
                        {!course.thumbnail_url && (
                          <div className="h-full flex items-center justify-center text-gray-600 text-2xl font-bold">
                            {course.title[0]}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1 truncate">
                          {course.title}
                        </h3>
                        {course.next_lesson_title && (
                          <p className="text-sm text-gray-400 mb-2 truncate">
                            Next: {course.next_lesson_title}
                          </p>
                        )}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>
                              {course.completed_lessons} of{" "}
                              {course.total_lessons} lessons
                            </span>
                            <span>{course.progress_percentage}%</span>
                          </div>
                          <Progress
                            value={course.progress_percentage}
                            className="h-1"
                          />
                        </div>
                      </div>

                      {/* Continue Button */}
                      <div className="flex items-center">
                        <Button size="sm" className="gap-2">
                          <PlayCircle className="w-4 h-4" />
                          Continue
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <Card className="bg-gray-900 border-gray-800 mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-500" />
                    Recommended for You
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recommendations.map((course) => (
                    <div
                      key={course.id}
                      className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-750 transition-colors"
                      onClick={() => router.push(`/lms/courses/${course.id}`)}
                    >
                      <div
                        className="h-32 bg-gray-700 bg-cover bg-center"
                        style={{
                          backgroundImage: course.thumbnail_url
                            ? `url(${course.thumbnail_url})`
                            : undefined,
                        }}
                      >
                        {!course.thumbnail_url && (
                          <div className="h-full flex items-center justify-center text-gray-600 font-bold">
                            {course.title[0]}
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-sm line-clamp-1 mb-1">
                          {course.title}
                        </h3>
                        <p className="text-xs text-gray-400 mb-2 line-clamp-1">
                          by {course.instructor?.full_name || "Instructor"}
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="bg-blue-900/50 text-blue-400 px-2 py-0.5 rounded">
                            {course.level || "All Levels"}
                          </span>
                          <span className="text-yellow-500 flex items-center gap-1">
                            ⭐ {course.rating || "New"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upcoming Classes */}
          {upcoming_classes.length > 0 && (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Live Classes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcoming_classes.map((liveClass) => (
                    <div
                      key={liveClass.id}
                      className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{liveClass.title}</div>
                        <div className="text-sm text-gray-400">
                          by {liveClass.instructor_name}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(liveClass.scheduled_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Peer Reviews */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-500" />
                Peer Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                  <span className="text-sm">To Complete</span>
                  <div className="flex items-center gap-2">
                    <div className="bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded text-sm font-semibold">
                      {peerReviews.pending}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                  <span className="text-sm">Received</span>
                  <div className="flex items-center gap-2">
                    <div className="bg-green-500/20 text-green-500 px-2 py-1 rounded text-sm font-semibold">
                      {peerReviews.received}
                    </div>
                  </div>
                </div>
                <Button
                  className="w-full mt-2"
                  onClick={() => router.push("/student/peer-reviews")}
                  variant={peerReviews.pending > 0 ? "default" : "outline"}
                >
                  {peerReviews.pending > 0 ? "Review Now" : "View All Reviews"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Daily Goal */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Daily Goal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>15 minutes today</span>
                    <span className="text-blue-400">30/30 min</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div className="text-center py-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="text-2xl mb-1">🎯</div>
                  <div className="text-sm text-green-400 font-medium">
                    Goal Achieved!
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recent_achievements.length === 0 ? (
                <div className="text-center py-4 text-gray-500 text-sm">
                  Complete lessons to earn achievements
                </div>
              ) : (
                <div className="space-y-3">
                  {recent_achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex items-center gap-3 p-2 bg-gray-800 rounded-lg"
                    >
                      <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                        {achievement.icon_url ? (
                          <img
                            src={achievement.icon_url}
                            alt=""
                            className="w-6 h-6"
                          />
                        ) : (
                          "🏆"
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {achievement.title}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {achievement.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
