import Image from "next/image";
import Link from "next/link";
import { BookOpen, Clock, Lock, ShoppingCart, Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import api from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail_url?: string;
  price: number;
  level: string;
  category: string;
  total_enrollments: number;
  total_duration_minutes: number;
  average_rating: number;
  total_reviews: number;
  is_password_protected: boolean;
  progress?: number;
}

interface CourseCardProps {
  course: Course;
  showProgress?: boolean;
}

const levelColors = {
  beginner: "bg-green-500/10 text-green-400 border-green-500/20",
  intermediate: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  advanced: "bg-red-500/10 text-red-400 border-red-500/20",
};

const categoryColors: Record<string, string> = {
  programming: "bg-blue-500/10 text-blue-400",
  design: "bg-pink-500/10 text-pink-400",
  business: "bg-purple-500/10 text-purple-400",
  marketing: "bg-orange-500/10 text-orange-400",
};

export function CourseCard({ course, showProgress = false }: CourseCardProps) {
  const { showToast } = useToast();

  return (
    <Link href={`/lms/courses/${course.id}`} className="block group h-full">
      <div className="h-full bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 flex flex-col">
        {/* Thumbnail */}
        <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
          {course.thumbnail_url ? (
            <Image
              src={course.thumbnail_url}
              alt={course.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="h-16 w-16 text-gray-700" />
            </div>
          )}
          {course.price === 0 && !showProgress && (
            <Badge className="absolute top-3 right-3 bg-green-500 text-white border-0">
              FREE
            </Badge>
          )}
          {course.is_password_protected && (
            <Badge className="absolute top-3 left-3 bg-gray-900/80 text-white border border-gray-700 backdrop-blur-sm">
              <Lock className="w-3 h-3 mr-1" />
              Protected
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Category & Level */}
          <div className="flex gap-2 mb-3">
            <Badge
              className={`${categoryColors[course.category] || "bg-gray-500/10 text-gray-400"} border-0 text-xs`}
            >
              {(course.category || "Uncategorized").replace(/_/g, " ")}
            </Badge>
            <Badge
              className={`${levelColors[course.level as keyof typeof levelColors] || "bg-gray-500/10 text-gray-400"} border text-xs`}
            >
              {course.level}
            </Badge>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-400 transition">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">
            {course.description}
          </p>

          {/* Progress Bar (if enabled) */}
          {showProgress && typeof course.progress === "number" && (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Progress</span>
                <span>{Math.round(course.progress)}%</span>
              </div>
              <Progress value={course.progress} className="h-2" />
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-4 pb-4 border-b border-gray-800">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                <span>{(course.total_enrollments || 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{Math.floor(course.total_duration_minutes / 60)}h</span>
              </div>
            </div>
            {course.total_reviews > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                <span className="text-white font-medium">
                  {course.average_rating.toFixed(1)}
                </span>
                <span>({course.total_reviews})</span>
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="flex gap-2 mt-auto">
            {!showProgress ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-cyan-400 border-cyan-400 hover:bg-cyan-950 flex-1"
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    try {
                      await api.post("/cart/items", {
                        course_id: course.id,
                        quantity: 1,
                      });
                      showToast("Added to cart successfully", "success");
                    } catch (error) {
                      showToast("Failed to add to cart", "error");
                    }
                  }}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  size="sm"
                  className="bg-cyan-600 hover:bg-cyan-500 text-white flex-1"
                >
                  View Course
                </Button>
              </>
            ) : (
              <Button className="w-full bg-cyan-600 hover:bg-cyan-500">
                Continue Learning
              </Button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
