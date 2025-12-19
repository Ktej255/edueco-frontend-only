"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  PlayCircle,
  BookOpen,
  Star,
  ShieldCheck,
  Clock,
} from "lucide-react";
import api from "@/lib/api";

interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string | null;
  price: number;
  total_duration_minutes: number;
  total_lessons: number;
}

interface Bundle {
  id: number;
  title: string;
  description: string;
  price: number;
  currency: string;
  thumbnail_url: string | null;
  courses: Course[];
  total_value: number;
  instructor: {
    full_name: string;
  };
}

export default function BundleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bundleId = params?.id as string;

  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    if (bundleId) {
      fetchBundleData();
    }
  }, [bundleId]);

  const fetchBundleData = async () => {
    try {
      const response = await api.get(`/bundles/${bundleId}`);
      setBundle(response.data);

      // Check enrollment status (mock for now, or add endpoint)
      // setIsEnrolled(response.data.is_enrolled)
    } catch (error) {
      console.error("Failed to fetch bundle:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await api.post(`/bundles/${bundleId}/enroll`);
      setIsEnrolled(true);
      // Show success message or redirect
    } catch (error) {
      console.error("Enrollment failed:", error);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading...
      </div>
    );
  if (!bundle)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Bundle not found
      </div>
    );

  const savings = Math.round(
    ((bundle.total_value - bundle.price) / bundle.total_value) * 100,
  );

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative bg-gray-900 border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/20 to-purple-900/20" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 px-4 py-1 text-sm">
                Course Bundle
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                {bundle.title}
              </h1>
              <p className="text-xl text-gray-400 leading-relaxed">
                {bundle.description}
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-cyan-500" />
                  <span>{bundle.courses.length} Courses</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span>4.9 Average Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-green-500" />
                  <span>Certificate of Completion</span>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
                    {bundle.instructor.full_name[0]}
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Created by</p>
                    <p className="text-white font-medium">
                      {bundle.instructor.full_name}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="lg:pl-12">
              <Card className="bg-gray-800 border-gray-700 shadow-2xl overflow-hidden">
                <div className="aspect-video bg-gray-700 relative">
                  {bundle.thumbnail_url ? (
                    <img
                      src={bundle.thumbnail_url}
                      alt={bundle.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                      <span className="text-gray-500">No Thumbnail</span>
                    </div>
                  )}
                  {savings > 0 && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white font-bold px-4 py-2 rounded-full shadow-lg">
                      Save {savings}%
                    </div>
                  )}
                </div>
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-end gap-3">
                    <span className="text-4xl font-bold text-white">
                      {bundle.currency === "INR" ? "₹" : "$"}
                      {bundle.price}
                    </span>
                    <span className="text-xl text-gray-500 line-through mb-1">
                      {bundle.currency === "INR" ? "₹" : "$"}
                      {bundle.total_value}
                    </span>
                  </div>

                  {isEnrolled ? (
                    <Button
                      className="w-full h-12 text-lg bg-green-600 hover:bg-green-700"
                      onClick={() => router.push("/lms/courses")}
                    >
                      Go to My Courses
                    </Button>
                  ) : (
                    <Button
                      className="w-full h-12 text-lg bg-cyan-600 hover:bg-cyan-500"
                      onClick={handleEnroll}
                      disabled={enrolling}
                    >
                      {enrolling ? "Enrolling..." : "Enroll Now"}
                    </Button>
                  )}

                  <p className="text-center text-sm text-gray-400">
                    30-Day Money-Back Guarantee
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Courses List */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-white mb-8">
          Courses in this Bundle
        </h2>
        <div className="grid gap-6">
          {bundle.courses.map((course, index) => (
            <div
              key={course.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col md:flex-row gap-6 hover:border-gray-700 transition-colors"
            >
              <div className="w-full md:w-64 aspect-video bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                {course.thumbnail_url ? (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <PlayCircle className="h-12 w-12 text-gray-600" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge
                      variant="outline"
                      className="mb-2 border-gray-700 text-gray-400"
                    >
                      Course {index + 1}
                    </Badge>
                    <h3 className="text-xl font-bold text-white">
                      {course.title}
                    </h3>
                  </div>
                  <span className="text-cyan-400 font-bold">
                    {bundle.currency === "INR" ? "₹" : "$"}
                    {course.price}
                  </span>
                </div>
                <p className="text-gray-400 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{course.total_duration_minutes || 0} mins</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{course.total_lessons || 0} lessons</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
