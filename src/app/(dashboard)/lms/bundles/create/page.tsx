"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Upload, Plus, X, DollarSign } from "lucide-react";
import api from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Course {
  id: number;
  title: string;
  price: number;
  thumbnail_url: string | null;
}

export default function CreateBundlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    thumbnail_url: "",
    is_published: false,
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get("/courses/my-courses");
      setCourses(response.data);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  const handleCourseToggle = (courseId: number) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId],
    );
  };

  const calculateTotalValue = () => {
    return courses
      .filter((c) => selectedCourses.includes(c.id))
      .reduce((sum, c) => sum + c.price, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (selectedCourses.length < 2) {
      setError("Please select at least 2 courses for a bundle");
      setLoading(false);
      return;
    }

    try {
      await api.post("/bundles/", {
        ...formData,
        price: parseFloat(formData.price),
        course_ids: selectedCourses,
      });
      router.push("/lms/bundles");
    } catch (err) {
      console.error("Failed to create bundle:", err);
      setError("Failed to create bundle. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const totalValue = calculateTotalValue();
  const bundlePrice = parseFloat(formData.price) || 0;
  const savings =
    totalValue > 0
      ? Math.round(((totalValue - bundlePrice) / totalValue) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="text-gray-400 mb-6 pl-0 hover:text-white"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Bundles
        </Button>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Create Course Bundle
            </h1>
            <p className="text-gray-400">
              Group your courses together to offer better value
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Basic Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Bundle Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-white">
                      Bundle Title
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="bg-gray-800 border-gray-700 text-white mt-2"
                      placeholder="e.g., Full Stack Web Development Masterclass"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-white">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="bg-gray-800 border-gray-700 text-white mt-2"
                      placeholder="Describe what students will learn from this bundle..."
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="thumbnail" className="text-white">
                      Thumbnail URL
                    </Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="thumbnail"
                        value={formData.thumbnail_url}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            thumbnail_url: e.target.value,
                          })
                        }
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="https://..."
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="border-gray-700"
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Select Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {courses.map((course) => (
                      <div
                        key={course.id}
                        className={`flex items-center p-3 rounded-lg border transition-colors cursor-pointer ${
                          selectedCourses.includes(course.id)
                            ? "bg-cyan-900/20 border-cyan-500/50"
                            : "bg-gray-800 border-gray-700 hover:border-gray-600"
                        }`}
                        onClick={() => handleCourseToggle(course.id)}
                      >
                        <Checkbox
                          checked={selectedCourses.includes(course.id)}
                          onCheckedChange={() => handleCourseToggle(course.id)}
                          className="mr-4"
                        />
                        <div className="flex-1">
                          <h4 className="text-white font-medium">
                            {course.title}
                          </h4>
                          <p className="text-sm text-gray-400">
                            ₹{course.price}
                          </p>
                        </div>
                      </div>
                    ))}
                    {courses.length === 0 && (
                      <p className="text-gray-400 text-center py-4">
                        No courses found. Create some courses first.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Pricing & Summary */}
            <div className="space-y-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-gray-400">Total Value</Label>
                    <div className="text-2xl font-bold text-gray-300 line-through decoration-gray-500">
                      ₹{totalValue}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="price" className="text-white">
                      Bundle Price
                    </Label>
                    <div className="relative mt-2">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        className="bg-gray-800 border-gray-700 text-white pl-9 text-lg font-bold"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  {savings > 0 && (
                    <div className="bg-green-900/20 border border-green-900 rounded-lg p-4 text-center">
                      <p className="text-green-400 text-sm font-medium">
                        Student Savings
                      </p>
                      <p className="text-2xl font-bold text-green-500">
                        {savings}% OFF
                      </p>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 pt-4 border-t border-gray-800">
                    <Checkbox
                      id="published"
                      checked={formData.is_published}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          is_published: checked as boolean,
                        })
                      }
                    />
                    <Label
                      htmlFor="published"
                      className="text-white cursor-pointer"
                    >
                      Publish immediately
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-cyan-600 hover:bg-cyan-500 h-12 text-lg"
                disabled={loading}
              >
                {loading ? "Creating Bundle..." : "Create Bundle"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
