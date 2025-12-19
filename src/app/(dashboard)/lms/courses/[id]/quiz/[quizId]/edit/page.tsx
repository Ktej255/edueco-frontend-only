"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QuizBuilder, Question } from "@/components/features/quiz/QuizBuilder";
import api from "@/lib/api";

export default function QuizEditPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params?.quizId as string;
  const courseId = params?.id as string;
  const isNew = quizId === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [quizData, setQuizData] = useState<{
    title: string;
    description: string;
    time_limit_minutes: number;
    passing_score: number;
    max_attempts: number;
    is_published: boolean;
    shuffle_questions: boolean;
    show_correct_answers: boolean;
    questions: Question[];
  }>({
    title: "",
    description: "",
    time_limit_minutes: 60,
    passing_score: 70,
    max_attempts: 3,
    is_published: false,
    shuffle_questions: false,
    show_correct_answers: true,
    questions: [],
  });

  useEffect(() => {
    if (!isNew && quizId) {
      fetchQuiz();
    }
  }, [quizId, isNew]);

  const fetchQuiz = async () => {
    try {
      const response = await api.get(`/quizzes/${quizId}`);
      setQuizData(response.data);
    } catch (error) {
      console.error("Failed to fetch quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (isNew) {
        await api.post("/quizzes/", {
          ...quizData,
          course_id: parseInt(courseId),
        });
      } else {
        await api.put(`/quizzes/${quizId}`, quizData);
      }
      router.push(`/lms/courses/${courseId}/edit`);
    } catch (error) {
      console.error("Failed to save quiz:", error);
      alert("Failed to save quiz");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading quiz...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push(`/lms/courses/${courseId}/edit`)}
            className="mb-4 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Course
          </Button>

          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">
              {isNew ? "Create New Quiz" : "Edit Quiz"}
            </h1>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-cyan-600 hover:bg-cyan-500"
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save Quiz"}
            </Button>
          </div>
        </div>

        {/* Quiz Settings */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Quiz Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label htmlFor="title" className="text-white">
                Quiz Title
              </Label>
              <Input
                id="title"
                value={quizData.title}
                onChange={(e) =>
                  setQuizData({ ...quizData, title: e.target.value })
                }
                className="bg-gray-800 border-gray-700 text-white mt-2"
                placeholder="e.g., Module 1 Final Quiz"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description" className="text-white">
                Description
              </Label>
              <Textarea
                id="description"
                value={quizData.description}
                onChange={(e) =>
                  setQuizData({ ...quizData, description: e.target.value })
                }
                className="bg-gray-800 border-gray-700 text-white mt-2"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="time-limit" className="text-white">
                Time Limit (minutes)
              </Label>
              <Input
                id="time-limit"
                type="number"
                min="0"
                value={quizData.time_limit_minutes || ""}
                onChange={(e) =>
                  setQuizData({
                    ...quizData,
                    time_limit_minutes: parseInt(e.target.value) || 0,
                  })
                }
                className="bg-gray-800 border-gray-700 text-white mt-2"
              />
            </div>
            <div>
              <Label htmlFor="passing-score" className="text-white">
                Passing Score (%)
              </Label>
              <Input
                id="passing-score"
                type="number"
                min="0"
                max="100"
                value={quizData.passing_score}
                onChange={(e) =>
                  setQuizData({
                    ...quizData,
                    passing_score: parseFloat(e.target.value),
                  })
                }
                className="bg-gray-800 border-gray-700 text-white mt-2"
              />
            </div>
            <div>
              <Label htmlFor="max-attempts" className="text-white">
                Max Attempts
              </Label>
              <Input
                id="max-attempts"
                type="number"
                min="0"
                value={quizData.max_attempts || ""}
                onChange={(e) =>
                  setQuizData({
                    ...quizData,
                    max_attempts: parseInt(e.target.value) || 0,
                  })
                }
                className="bg-gray-800 border-gray-700 text-white mt-2"
              />
            </div>
            <div className="flex items-center gap-4 mt-6">
              <input
                type="checkbox"
                id="shuffle"
                checked={quizData.shuffle_questions}
                onChange={(e) =>
                  setQuizData({
                    ...quizData,
                    shuffle_questions: e.target.checked,
                  })
                }
                className="rounded"
              />
              <Label htmlFor="shuffle" className="text-white cursor-pointer">
                Shuffle questions
              </Label>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <QuizBuilder
            questions={quizData.questions}
            onQuestionsChange={(questions) =>
              setQuizData({ ...quizData, questions })
            }
            courseId={courseId}
            quizId={quizId}
            onRefresh={fetchQuiz}
          />
        </div>
      </div>
    </div>
  );
}
