"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { bundleService, Bundle } from "@/services/bundleService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, BookOpen, Clock, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function BundleDetailsPage() {
  const params = useParams();
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchBundle = async () => {
      if (!params?.id) return;
      try {
        const data = await bundleService.getBundle(Number(params?.id));
        setBundle(data);
      } catch (error) {
        console.error("Failed to fetch bundle:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBundle();
  }, [params?.id]);

  const handleEnroll = async () => {
    if (!bundle) return;
    setEnrolling(true);
    try {
      // In a real app, this would trigger a payment flow (Stripe/Razorpay)
      // For now, we simulate a successful payment
      const paymentId = `pay_${Date.now()}`;
      await bundleService.enrollInBundle(bundle.id, paymentId, bundle.price);
      alert("Successfully enrolled!");
      // Redirect to learning dashboard
    } catch (error) {
      console.error("Enrollment failed:", error);
      alert("Enrollment failed. Please try again.");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!bundle) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold">Bundle not found</h1>
        <Link href="/marketplace">
          <Button className="mt-4">Back to Marketplace</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">{bundle.title}</h1>
            <p className="text-lg text-muted-foreground">
              {bundle.description}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>What's Included</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bundle.courses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{course.title}</h3>
                        <p className="text-sm text-gray-500">Course</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">${course.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <BookOpen className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold">{bundle.course_count} Courses</h3>
                <p className="text-sm text-gray-500">
                  Comprehensive learning path
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <Clock className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold">Lifetime Access</h3>
                <p className="text-sm text-gray-500">Learn at your own pace</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <Award className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold">Certificate</h3>
                <p className="text-sm text-gray-500">Upon completion</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <div className="h-48 bg-gray-100 rounded-t-lg overflow-hidden relative">
              {bundle.thumbnail_url ? (
                <img
                  src={bundle.thumbnail_url}
                  alt={bundle.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-4xl font-bold">
                  {bundle.title.charAt(0)}
                </div>
              )}
            </div>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-primary">
                  ${bundle.price}
                </span>
                {bundle.original_price > bundle.price && (
                  <div className="flex flex-col mb-1">
                    <span className="text-sm text-gray-400 line-through">
                      ${bundle.original_price}
                    </span>
                    <Badge variant="destructive" className="text-xs">
                      {bundle.discount_percentage}% OFF
                    </Badge>
                  </div>
                )}
              </div>

              <Button
                className="w-full h-12 text-lg"
                onClick={handleEnroll}
                disabled={enrolling}
              >
                {enrolling ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Enroll Now"
                )}
              </Button>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Full lifetime access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Access on mobile and TV</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Certificate of completion</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
