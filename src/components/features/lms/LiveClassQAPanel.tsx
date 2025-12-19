"use client";

import React, { useState } from "react";
import {
  MessageCircle,
  ThumbsUp,
  CheckCircle,
  Send,
  MoreVertical,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Question } from "@/hooks/useLiveClassWebSocket";
import { Textarea } from "@/components/ui/textarea";

interface LiveClassQAPanelProps {
  questions: Question[];
  userRole: "instructor" | "student";
  onAskQuestion: (text: string) => void;
  onUpvote: (questionId: number) => void;
  onAnswer: (questionId: number, answer: string) => void;
}

export function LiveClassQAPanel({
  questions,
  userRole,
  onAskQuestion,
  onUpvote,
  onAnswer,
}: LiveClassQAPanelProps) {
  const [newQuestion, setNewQuestion] = useState("");
  const [answeringId, setAnsweringId] = useState<number | null>(null);
  const [answerText, setAnswerText] = useState("");

  const handleAsk = () => {
    if (newQuestion.trim()) {
      onAskQuestion(newQuestion);
      setNewQuestion("");
    }
  };

  const handleSubmitAnswer = (questionId: number) => {
    if (answerText.trim()) {
      onAnswer(questionId, answerText);
      setAnsweringId(null);
      setAnswerText("");
    }
  };

  // Sort questions: Answered last, then by upvotes
  const sortedQuestions = [...questions].sort((a, b) => {
    if (a.answer && !b.answer) return 1;
    if (!a.answer && b.answer) return -1;
    return (b.upvotes || 0) - (a.upvotes || 0);
  });

  return (
    <Card className="h-full bg-gray-900 border-gray-800 flex flex-col">
      <CardHeader className="pb-2 border-b border-gray-800">
        <CardTitle className="text-sm font-medium text-gray-200 flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-cyan-500" />
          Q&A
          <Badge
            variant="secondary"
            className="ml-auto bg-gray-800 text-gray-400"
          >
            {questions.length}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {sortedQuestions.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-2 min-h-[200px]">
            <MessageCircle className="h-8 w-8 opacity-20" />
            <p className="text-sm">No questions yet</p>
          </div>
        ) : (
          sortedQuestions.map((q) => (
            <div key={q.question_id} className="space-y-2">
              <div
                className={`p-3 rounded-lg border ${q.answer ? "bg-gray-800/30 border-gray-800" : "bg-gray-800 border-gray-700"}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-cyan-400">
                        {q.student_name}
                      </span>
                      <span className="text-xs text-gray-500">
                        •{" "}
                        {new Date().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-200">{q.text}</p>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-gray-400 hover:text-cyan-400 hover:bg-cyan-950/30"
                      onClick={() => onUpvote(q.question_id)}
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      <span className="text-xs">{q.upvotes || 0}</span>
                    </Button>
                  </div>
                </div>

                {q.answer && (
                  <div className="mt-3 pt-3 border-t border-gray-700/50 pl-2 border-l-2 border-l-cyan-500/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant="outline"
                        className="text-[10px] h-4 px-1 border-cyan-500/30 text-cyan-400"
                      >
                        Instructor Answer
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-300">{q.answer}</p>
                  </div>
                )}

                {userRole === "instructor" && !q.answer && (
                  <div className="mt-2 pt-2 border-t border-gray-700/50">
                    {answeringId === q.question_id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={answerText}
                          onChange={(e) => setAnswerText(e.target.value)}
                          placeholder="Type your answer..."
                          className="min-h-[60px] bg-gray-900 border-gray-700 text-sm"
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setAnsweringId(null)}
                            className="h-7 text-xs"
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSubmitAnswer(q.question_id)}
                            className="h-7 text-xs bg-cyan-600 hover:bg-cyan-500"
                          >
                            Submit Answer
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs w-full text-gray-400 hover:text-cyan-400"
                        onClick={() => {
                          setAnsweringId(q.question_id);
                          setAnswerText("");
                        }}
                      >
                        Answer Question
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>

      <div className="p-3 border-t border-gray-800 bg-gray-900/50">
        <div className="flex gap-2">
          <Input
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Ask a question..."
            className="bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500"
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          />
          <Button
            size="icon"
            onClick={handleAsk}
            disabled={!newQuestion.trim()}
            className="bg-cyan-600 hover:bg-cyan-500 shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
