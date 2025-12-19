import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Package, BookOpen, CheckCircle } from "lucide-react";
import Link from "next/link";

interface Course {
  id: number;
  title: string;
  thumbnail_url: string | null;
}

interface Bundle {
  id: number;
  title: string;
  description: string;
  price: number;
  currency: string;
  thumbnail_url: string | null;
  courses: Course[];
  total_value?: number;
}

interface BundleCardProps {
  bundle: Bundle;
  isEnrolled?: boolean;
}

export function BundleCard({ bundle, isEnrolled = false }: BundleCardProps) {
  const savings = bundle.total_value
    ? Math.round(
        ((bundle.total_value - bundle.price) / bundle.total_value) * 100,
      )
    : 0;

  return (
    <Card className="bg-gray-900 border-gray-800 overflow-hidden hover:border-cyan-500/50 transition-all duration-300 group">
      <div className="relative h-48 bg-gray-800">
        {bundle.thumbnail_url ? (
          <img
            src={bundle.thumbnail_url}
            alt={bundle.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <Package className="h-16 w-16 text-gray-700 group-hover:text-cyan-500/50 transition-colors" />
          </div>
        )}

        {/* Course Stack Effect */}
        <div className="absolute -bottom-6 left-4 flex -space-x-4">
          {bundle.courses.slice(0, 3).map((course, i) => (
            <div
              key={course.id}
              className="w-12 h-12 rounded-lg border-2 border-gray-900 bg-gray-800 overflow-hidden shadow-lg"
              style={{ zIndex: 3 - i }}
            >
              {course.thumbnail_url ? (
                <img
                  src={course.thumbnail_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-700">
                  <BookOpen className="h-4 w-4 text-gray-400" />
                </div>
              )}
            </div>
          ))}
          {bundle.courses.length > 3 && (
            <div className="w-12 h-12 rounded-lg border-2 border-gray-900 bg-gray-800 flex items-center justify-center text-xs font-bold text-white z-0">
              +{bundle.courses.length - 3}
            </div>
          )}
        </div>

        {savings > 0 && (
          <Badge className="absolute top-4 right-4 bg-green-500 hover:bg-green-600 text-white border-0">
            Save {savings}%
          </Badge>
        )}
      </div>

      <CardHeader className="pt-10 pb-4">
        <div className="flex justify-between items-start gap-4">
          <h3 className="font-bold text-xl text-white line-clamp-2 group-hover:text-cyan-400 transition-colors">
            {bundle.title}
          </h3>
        </div>
        <p className="text-sm text-gray-400 line-clamp-2 h-10">
          {bundle.description}
        </p>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <BookOpen className="h-4 w-4" />
          <span>{bundle.courses.length} Courses included</span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white">
            {bundle.currency === "INR" ? "₹" : "$"}
            {bundle.price.toLocaleString("en-IN")}
          </span>
          {bundle.total_value && bundle.total_value > bundle.price && (
            <span className="text-sm text-gray-500 line-through">
              {bundle.currency === "INR" ? "₹" : "$"}
              {bundle.total_value.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter>
        {isEnrolled ? (
          <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
            <Link href={`/lms/bundles/${bundle.id}`}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Enrolled
            </Link>
          </Button>
        ) : (
          <Button className="w-full bg-cyan-600 hover:bg-cyan-500" asChild>
            <Link href={`/lms/bundles/${bundle.id}`}>View Bundle</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
