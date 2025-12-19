"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

export default function QuizTakePage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params?.quizId as string;
  const courseId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quiz, setQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  useEffect(() => {
    if (quiz?.time_limit_minutes && timeLeft === null) {
      setTimeLeft(quiz.time_limit_minutes * 60);
    }
  }, [quiz]);

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0 && !result) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev && prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev ? prev - 1 : 0;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, result]);

  const fetchQuiz = async () => {
    try {
      const response = await api.get(`/quizzes/${quizId}`);
      setQuiz(response.data);
    } catch (error) {
      console.error("Failed to fetch quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, value: any) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const formattedAnswers = quiz.questions.map((q: any) => {
        const answer = answers[q.id];
        if (q.type === "multiple_choice" || q.type === "true_false") {
          return {
            question_id: q.id,
            selected_option_id: answer,
          };
        } else {
          return {
            question_id: q.id,
            text_response: answer || "",
          };
        }
      });

      const response = await api.post(`/quizzes/${quizId}/submit`, {
        quiz_id: parseInt(quizId),
        answers: formattedAnswers,
      });
      setResult(response.data);
    } catch (error) {
      console.error("Failed to submit quiz:", error);
      alert("Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading quiz...</div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
            <div
              className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${
                result.passed ? "bg-green-500/20" : "bg-red-500/20"
              }`}
            >
              {result.passed ? (
                <CheckCircle className="h-10 w-10 text-green-400" />
              ) : (
                <AlertCircle className="h-10 w-10 text-red-400" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              {result.passed ? "Congratulations!" : "Quiz Completed"}
            </h1>
            <p className="text-gray-400 mb-8">
              {result.passed
                ? "You passed the quiz!"
                : "You didn't reach the passing score this time."}
            </p>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-800/50 rounded-lg p-6">
                <p className="text-gray-400 text-sm mb-2">Your Score</p>
                <p className="text-4xl font-bold text-white">
                  {result.score.toFixed(1)}
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-6">
                <p className="text-gray-400 text-sm mb-2">Status</p>
                <Badge
                  className={`text-lg px-4 py-2 ${
                    result.passed
                      ? "bg-green-500/20 text-green-400 border-green-500/50"
                      : "bg-red-500/20 text-red-400 border-red-500/50"
                  }`}
                >
                  {result.passed ? "Passed" : "Not Passed"}
                </Badge>
              </div>
            </div>
            <Button
              onClick={() => router.push(`/lms/courses/${courseId}`)}
              className="bg-cyan-600 hover:bg-cyan-500"
            >
              Back to Course
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push(`/lms/courses/${courseId}`)}
            className="mb-4 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Course
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">{quiz.title}</h1>
              {quiz.description && (
                <p className="text-gray-400 mt-2">{quiz.description}</p>
              )}
            </div>
            {timeLeft !== null && (
              <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-lg px-4 py-2">
                <Clock className="h-5 w-5 text-cyan-400" />
                <span
                  className={`text-lg font-mono ${
                    timeLeft < 60 ? "text-red-400" : "text-white"
                  }`}
                >
                  {formatTime(timeLeft)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6 mb-8">
          {quiz.questions.map((question: any, index: number) => (
            <div
              key={question.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium mb-2">{question.text}</p>
                  <Badge
                    variant="outline"
                    className="text-xs border-cyan-600 text-cyan-400"
                  >
                    {question.points}{" "}
                    {question.points === 1 ? "point" : "points"}
                  </Badge>
                </div>
              </div>

              <div className="ml-12">
                {question.type === "multiple_choice" && (
                  <div className="space-y-2">
                    {question.options.map((option: any) => (
                      <label
                        key={option.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          answers[question.id] === option.id
                            ? "bg-cyan-500/10 border-cyan-500"
                            : "bg-gray-800/50 border-gray-700 hover:border-gray-600"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          checked={answers[question.id] === option.id}
                          onChange={() =>
                            handleAnswerChange(question.id, option.id)
                          }
                          className="text-cyan-500"
                        />
                        <span className="text-white">{option.text}</span>
                      </label>
                    ))}
                  </div>
                )}

                {question.type === "true_false" && (
                  <div className="flex gap-4">
                    {question.options.map((option: any) => (
                      <button
                        key={option.id}
                        onClick={() =>
                          handleAnswerChange(question.id, option.id)
                        }
                        className={`flex-1 px-6 py-3 rounded-lg border transition-colors ${
                          answers[question.id] === option.id
                            ? "bg-cyan-500/10 border-cyan-500 text-white"
                            : "bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600"
                        }`}
                      >
                        {option.text}
                      </button>
                    ))}
                  </div>
                )}

                {question.type === "short_answer" && (
                  <Input
                    value={answers[question.id] || ""}
                    onChange={(e) =>
                      handleAnswerChange(question.id, e.target.value)
                    }
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Enter your answer..."
                  />
                )}

                {question.type === "long_answer" && (
                  <Textarea
                    value={answers[question.id] || ""}
                    onChange={(e) =>
                      handleAnswerChange(question.id, e.target.value)
                    }
                    className="bg-gray-800 border-gray-700 text-white"
                    rows={5}
                    placeholder="Write your answer here..."
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-cyan-600 hover:bg-cyan-500"
            size="lg"
          >
            {submitting ? "Submitting..." : "Submit Quiz"}
          </Button>
        </div>
      </div>
    </div>
  );
}
