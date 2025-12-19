"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, Clock, AlertCircle } from "lucide-react";
import api from "@/lib/api";

interface QuizAttemptProps {
  quizId: number;
  onComplete: (result: any) => void;
}

interface Question {
  id: number;
  text: string;
  options: string;
}

export function QuizAttempt({ quizId, onComplete }: QuizAttemptProps) {
  const [attempt, setAttempt] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    startAttempt();
  }, [quizId]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          submitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const startAttempt = async () => {
    try {
      const response = await api.post(`/quizzes/${quizId}/start`);
      setAttempt(response.data);

      // Fetch quiz questions
      const quizRes = await api.get(`/quizzes/${quizId}`);
      setQuestions(quizRes.data.questions || []);

      if (response.data.time_limit_minutes) {
        setTimeLeft(response.data.time_limit_minutes * 60);
      }
    } catch (error) {
      console.error("Failed to start quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  const submitQuiz = async () => {
    try {
      const result = await api.post(`/quizzes/${quizId}/submit`, answers);
      onComplete(result.data);
    } catch (error) {
      console.error("Failed to submit quiz:", error);
    }
  };

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const currentQuestion = questions[currentIndex];
  const parsedOptions = currentQuestion
    ? JSON.parse(currentQuestion.options)
    : [];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  if (loading) {
    return <div className="p-8 text-center">Loading quiz...</div>;
  }

  if (!currentQuestion) {
    return <div className="p-8 text-center">No questions available</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Quiz In Progress</h2>
            <p className="text-gray-400">Attempt #{attempt?.attempt_number}</p>
          </div>
          {timeLeft !== null && (
            <div className="flex items-center gap-2 text-cyan-400">
              <Clock className="h-5 w-5" />
              <span className="text-xl font-mono">
                {Math.floor(timeLeft / 60)}:
                {String(timeLeft % 60).padStart(2, "0")}
              </span>
            </div>
          )}
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-gray-400 mt-2">
          Question {currentIndex + 1} of {questions.length}
        </p>
      </div>

      {/* Question */}
      <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
        <h3 className="text-xl font-semibold text-white mb-6">
          {currentQuestion.text}
        </h3>

        <div className="space-y-3">
          {parsedOptions.map((option: string, idx: number) => {
            const isSelected = answers[currentQuestion.id] === option;
            return (
              <button
                key={idx}
                onClick={() => handleAnswer(currentQuestion.id, option)}
                className={`w-full  text-left p-4 rounded-lg border-2 transition ${
                  isSelected
                    ? "border-cyan-500 bg-cyan-500/10 text-white"
                    : "border-gray-700 hover:border-gray-600 bg-gray-800 text-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  {isSelected ? (
                    <CheckCircle className="h-5 w-5 text-cyan-500 flex-shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-600 flex-shrink-0" />
                  )}
                  <span>{option}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="border-gray-700"
        >
          Previous
        </Button>

        {currentIndex === questions.length - 1 ? (
          <Button
            onClick={submitQuiz}
            className="bg-cyan-600 hover:bg-cyan-500"
            disabled={Object.keys(answers).length !== questions.length}
          >
            Submit Quiz
          </Button>
        ) : (
          <Button
            onClick={() =>
              setCurrentIndex((prev) =>
                Math.min(questions.length - 1, prev + 1),
              )
            }
            className="bg-cyan-600 hover:bg-cyan-500"
          >
            Next Question
          </Button>
        )}
      </div>

      {/* Answer Progress */}
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
        <p className="text-sm text-gray-400 mb-3">Answer Progress</p>
        <div className="grid grid-cols-10 gap-2">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-10 w-10 rounded flex items-center justify-center text-sm font-medium ${
                answers[q.id]
                  ? "bg-cyan-600 text-white"
                  : idx === currentIndex
                    ? "bg-gray-700 border-2 border-cyan-500 text-white"
                    : "bg-gray-800 text-gray-400"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
