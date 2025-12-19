"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Upload, X } from "lucide-react";

const courseSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category_id: z.string().optional(),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  price: z.number().min(0),
  duration_hours: z.number().min(1).optional(),
  thumbnail_url: z.string().optional(),
  language: z.string().optional(),
  requirements: z.string().optional(),
  what_you_learn: z.string().optional(),
});

type CourseFormData = z.infer<typeof courseSchema>;

const STEPS = [
  { id: 1, name: "Basic Info", description: "Course title and description" },
  { id: 2, name: "Details", description: "Category, level, and pricing" },
  { id: 3, name: "Media", description: "Thumbnail and preview" },
  { id: 4, name: "Review", description: "Review and publish" },
];

const CATEGORIES = [
  { id: "1", name: "Technology" },
  { id: "2", name: "Business" },
  { id: "3", name: "Design" },
  { id: "4", name: "Marketing" },
  { id: "5", name: "Personal Development" },
];

export default function CreateCoursePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      level: "beginner",
      price: 0,
      language: "en",
    },
  });

  const formData = watch();
  const progress = (currentStep / STEPS.length) * 100;

  const handleNext = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate as any);

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleThumbnailUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setValue("thumbnail_url", response.data.url);
      toast.success("Thumbnail uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload thumbnail");
    }
  };

  const onSubmit = async (data: CourseFormData) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/v1/courses", data);
      toast.success("Course created successfully!");
      router.push(`/instructor/courses/${response.data.id}/content`);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to create course");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldsForStep = (step: number): (keyof CourseFormData)[] => {
    switch (step) {
      case 1:
        return ["title", "description"];
      case 2:
        return ["category_id", "level", "price", "duration_hours"];
      case 3:
        return ["thumbnail_url"];
      default:
        return [];
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold mb-2">Create New Course</h1>
        <p className="text-gray-400">
          Follow the steps below to create your course
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <Progress value={progress} className="mb-4" />
        <div className="flex justify-between">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={`flex flex-col items-center flex-1 ${step.id === currentStep
                  ? "text-blue-500"
                  : step.id < currentStep
                    ? "text-green-500"
                    : "text-gray-500"
                }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step.id === currentStep
                    ? "bg-blue-500 text-white"
                    : step.id < currentStep
                      ? "bg-green-500 text-white"
                      : "bg-gray-700 text-gray-400"
                  }`}
              >
                {step.id < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.id
                )}
              </div>
              <div className="text-sm font-medium text-center">{step.name}</div>
              <div className="text-xs text-gray-500 text-center hidden sm:block">
                {step.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>{STEPS[currentStep - 1].name}</CardTitle>
            <CardDescription>
              {STEPS[currentStep - 1].description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title *</Label>
                  <Input
                    id="title"
                    {...register("title")}
                    placeholder="e.g., Complete Web Development Bootcamp"
                    className="bg-gray-800 border-gray-700"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Describe what students will learn in this course..."
                    rows={6}
                    className="bg-gray-800 border-gray-700"
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="what_you_learn">
                    What You'll Learn (Optional)
                  </Label>
                  <Textarea
                    id="what_you_learn"
                    {...register("what_you_learn")}
                    placeholder="• Build real-world projects&#10;• Master key concepts&#10;• Get job-ready skills"
                    rows={4}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
              </>
            )}

            {/* Step 2: Details */}
            {currentStep === 2 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      onValueChange={(value) => setValue("category_id", value)}
                      defaultValue={formData.category_id}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="level">Difficulty Level *</Label>
                    <Select
                      onValueChange={(value: any) => setValue("level", value)}
                      defaultValue={formData.level}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (USD) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      {...register("price", { valueAsNumber: true })}
                      placeholder="0.00"
                      className="bg-gray-800 border-gray-700"
                    />
                    <p className="text-sm text-gray-500">
                      Set to 0 for free course
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration_hours">Duration (hours)</Label>
                    <Input
                      id="duration_hours"
                      type="number"
                      {...register("duration_hours", {
                        valueAsNumber: true,
                      })}
                      placeholder="10"
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Requirements (Optional)</Label>
                  <Textarea
                    id="requirements"
                    {...register("requirements")}
                    placeholder="• Basic knowledge of...&#10;• Access to..."
                    rows={3}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
              </>
            )}

            {/* Step 3: Media */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Course Thumbnail</Label>
                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
                    {thumbnailPreview ? (
                      <div className="relative">
                        <img
                          src={thumbnailPreview}
                          alt="Thumbnail preview"
                          className="max-h-64 mx-auto rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setThumbnailPreview(null);
                            setValue("thumbnail_url", "");
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                        <p className="text-gray-400 mb-2">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-gray-500">
                          PNG, JPG up to 5MB (Recommended: 1280x720)
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailUpload}
                          className="hidden"
                          id="thumbnail-upload"
                        />
                        <Label
                          htmlFor="thumbnail-upload"
                          className="inline-block mt-4 cursor-pointer"
                        >
                          <Button type="button" variant="outline" asChild>
                            <span>Choose File</span>
                          </Button>
                        </Label>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="bg-gray-800 rounded-lg p-6 space-y-4">
                  <h3 className="text-xl font-semibold mb-4">
                    Review Your Course
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-gray-400">Title</Label>
                      <p className="text-lg font-medium">{formData.title}</p>
                    </div>

                    <div>
                      <Label className="text-gray-400">Description</Label>
                      <p className="text-gray-300">{formData.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-400">Level</Label>
                        <p className="capitalize">{formData.level}</p>
                      </div>
                      <div>
                        <Label className="text-gray-400">Price</Label>
                        <p>
                          {formData.price === 0 ? "Free" : `$${formData.price}`}
                        </p>
                      </div>
                    </div>

                    {thumbnailPreview && (
                      <div>
                        <Label className="text-gray-400">Thumbnail</Label>
                        <img
                          src={thumbnailPreview}
                          alt="Course thumbnail"
                          className="w-full max-w-md rounded-lg mt-2"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep < STEPS.length ? (
            <Button type="button" onClick={handleNext}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Course"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
