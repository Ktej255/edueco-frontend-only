"use client";

import { CheckCircle, XCircle, Clock, Trophy, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface QuizResultsProps {
  result: {
    score_percentage: number;
    passed: boolean;
    correct_answers: number;
    total_questions: number;
    time_spent_seconds: number;
  };
  onRetake?: () => void;
  allowRetake?: boolean;
}

export function QuizResults({
  result,
  onRetake,
  allowRetake = true,
}: QuizResultsProps) {
  const minutes = Math.floor(result.time_spent_seconds / 60);
  const seconds = result.time_spent_seconds % 60;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Result Header */}
      <div
        className={`rounded-lg p-8 text-center border-2 ${
          result.passed
            ? "bg-green-500/10 border-green-500"
            : "bg-red-500/10 border-red-500"
        }`}
      >
        {result.passed ? (
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        ) : (
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        )}

        <h2 className="text-3xl font-bold text-white mb-2">
          {result.passed ? "Congratulations!" : "Keep Trying!"}
        </h2>
        <p className="text-gray-400">
          {result.passed
            ? "You passed the quiz!"
            : "You didn't pass this time, but you can try again!"}
        </p>
      </div>

      {/* Score Display */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <div className="text-center mb-6">
          <div className="text-6xl font-bold text-cyan-400 mb-2">
            {Math.round(result.score_percentage)}%
          </div>
          <p className="text-gray-400">Your Score</p>
        </div>

        <Progress value={result.score_percentage} className="h-3 mb-4" />

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="text-2xl font-bold text-white">
                {result.correct_answers}/{result.total_questions}
              </span>
            </div>
            <p className="text-sm text-gray-400">Correct Answers</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold text-white">
                {minutes}:{String(seconds).padStart(2, "0")}
              </span>
            </div>
            <p className="text-sm text-gray-400">Time Spent</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-center">
        {allowRetake && onRetake && (
          <Button onClick={onRetake} className="bg-cyan-600 hover:bg-cyan-500">
            <RotateCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        )}
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="border-gray-700"
        >
          Back to Course
        </Button>
      </div>
    </div>
  );
}
