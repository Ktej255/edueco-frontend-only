"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export default function PaymentSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = params?.id as string;
  const sessionId = searchParams?.get("session_id");

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"success" | "error">("success");
  const [course, setCourse] = useState<any>(null);

  useEffect(() => {
    if (courseId && sessionId) {
      verifyPayment();
    }
  }, [courseId, sessionId]);

  const verifyPayment = async () => {
    try {
      // Fetch payment status
      const paymentResponse = await api.get(
        `/course-payments/payment-status/${courseId}`,
      );

      if (paymentResponse.data?.status === "succeeded") {
        setStatus("success");

        // Fetch course details
        const courseResponse = await api.get(`/courses/${courseId}`);
        setCourse(courseResponse.data);
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {status === "success" ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            {/* Success Icon */}
            <div className="mb-6">
              <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center mx-auto">
                <CheckCircle className="h-10 w-10 text-green-400" />
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-4xl font-bold text-white mb-4">
              Payment Successful! 🎉
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              You're now enrolled in {course?.title || "the course"}
            </p>

            {/* Course Info */}
            {course && (
              <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
                <h2 className="text-lg font-semibold text-white mb-2">
                  {course.title}
                </h2>
                <p className="text-gray-400 text-sm mb-4">
                  {course.description}
                </p>
                <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                  <div>
                    <span className="text-white font-semibold">
                      {course.total_lessons || 0}
                    </span>{" "}
                    lessons
                  </div>
                  <div>
                    <span className="text-white font-semibold">
                      {course.duration_hours || 0}
                    </span>{" "}
                    hours
                  </div>
                  <div>
                    <span className="text-white font-semibold">
                      {course.level}
                    </span>{" "}
                    level
                  </div>
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-cyan-900/20 border border-cyan-500/20 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-cyan-100 mb-3">What's next?</h3>
              <ul className="text-left text-cyan-200/80 space-y-2 text-sm">
                <li>✓ You now have lifetime access to this course</li>
                <li>✓ Start learning at your own pace</li>
                <li>✓ Track your progress in the dashboard</li>
                <li>✓ Earn a certificate upon completion</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={() => router.push(`/lms/courses/${courseId}/learn`)}
                className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
              >
                Start Learning
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/lms/my-courses")}
                className="flex-1 border-gray-700"
              >
                View My Courses
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            {/* Error Icon */}
            <div className="mb-6">
              <div className="w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500 flex items-center justify-center mx-auto">
                <XCircle className="h-10 w-10 text-red-400" />
              </div>
            </div>

            {/* Error Message */}
            <h1 className="text-4xl font-bold text-white mb-4">
              Payment Failed
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              There was an issue processing your payment
            </p>

            <p className="text-gray-400 mb-8">
              Don't worry, no charges were made to your account. Please try
              again or contact support if the issue persists.
            </p>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={() => router.push(`/lms/courses/${courseId}`)}
                className="flex-1 bg-cyan-600 hover:bg-cyan-500"
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/support")}
                className="flex-1 border-gray-700"
              >
                Contact Support
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
