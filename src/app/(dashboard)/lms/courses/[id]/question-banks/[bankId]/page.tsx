"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  ArrowLeft,
  Save,
  Trash2,
  GripVertical,
  Edit,
} from "lucide-react";
import { toast } from "sonner";

interface BankQuestion {
  id: number;
  text: string;
  type: string;
  points: number;
  difficulty: string;
  options?: string; // JSON string
  correct_answer?: string;
  explanation?: string;
  tags?: string;
  usage_count: number;
}

interface QuestionBank {
  id: number;
  title: string;
  description?: string;
}

export default function QuestionBankDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id;
  const bankId = params.bankId;

  const [bank, setBank] = useState<QuestionBank | null>(null);
  const [questions, setQuestions] = useState<BankQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<BankQuestion | null>(
    null,
  );

  // Question Form State
  const [qForm, setQForm] = useState({
    text: "",
    type: "multiple_choice",
    points: 1,
    difficulty: "medium",
    options: [] as string[],
    correct_answer: "",
    explanation: "",
    tags: "",
  });

  // Options management for MC/Multiple Response
  const [newOption, setNewOption] = useState("");

  useEffect(() => {
    if (bankId) {
      fetchBankDetails();
      fetchQuestions();
    }
  }, [bankId]);

  const fetchBankDetails = async () => {
    try {
      const response = await api.get(
        `/question-banks/courses/${courseId}/question-banks`,
      );
      const found = response.data.find((b: any) => b.id === Number(bankId));
      if (found) setBank(found);
    } catch (error) {
      console.error("Error fetching bank:", error);
    }
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/question-banks/question-banks/${bankId}/questions`,
      );
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuestion = async () => {
    if (!qForm.text) {
      toast.error("Question text is required");
      return;
    }

    try {
      const payload = {
        text: qForm.text,
        type: qForm.type,
        points: qForm.points,
        difficulty: qForm.difficulty,
        options: JSON.stringify(qForm.options),
        correct_answer: qForm.correct_answer,
        explanation: qForm.explanation,
        tags: qForm.tags,
        question_bank_ids: [Number(bankId)],
      };

      if (editingQuestion) {
        await api.put(
          `/question-banks/bank-questions/${editingQuestion.id}`,
          payload,
        );
        toast.success("Question updated");
      } else {
        await api.post(`/question-banks/bank-questions`, payload);
        toast.success("Question added");
      }

      setIsSheetOpen(false);
      resetForm();
      fetchQuestions();
    } catch (error) {
      console.error("Error saving question:", error);
      toast.error("Failed to save question");
    }
  };

  const handleDeleteQuestion = async (id: number) => {
    if (!confirm("Remove this question from the bank?")) return;

    try {
      await api.delete(
        `/question-banks/bank-questions/${id}/remove-from-bank/${bankId}`,
      );
      toast.success("Question removed");
      fetchQuestions();
    } catch (error) {
      console.error("Error removing question:", error);
      toast.error("Failed to remove question");
    }
  };

  const resetForm = () => {
    setEditingQuestion(null);
    setQForm({
      text: "",
      type: "multiple_choice",
      points: 1,
      difficulty: "medium",
      options: [],
      correct_answer: "",
      explanation: "",
      tags: "",
    });
  };

  const openEdit = (q: BankQuestion) => {
    setEditingQuestion(q);
    setQForm({
      text: q.text,
      type: q.type,
      points: q.points,
      difficulty: q.difficulty,
      options: q.options ? JSON.parse(q.options) : [],
      correct_answer: q.correct_answer || "",
      explanation: q.explanation || "",
      tags: q.tags || "",
    });
    setIsSheetOpen(true);
  };

  const addOption = () => {
    if (newOption.trim()) {
      setQForm({ ...qForm, options: [...qForm.options, newOption.trim()] });
      setNewOption("");
    }
  };

  const removeOption = (index: number) => {
    const newOptions = [...qForm.options];
    newOptions.splice(index, 1);
    setQForm({ ...qForm, options: newOptions });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{bank?.title || "Loading..."}</h1>
          <p className="text-muted-foreground text-sm">
            Manage questions in this bank
          </p>
        </div>
        <div className="ml-auto">
          <Sheet
            open={isSheetOpen}
            onOpenChange={(open) => {
              setIsSheetOpen(open);
              if (!open) resetForm();
            }}
          >
            <SheetTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[600px] sm:w-[540px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>
                  {editingQuestion ? "Edit Question" : "Add Question"}
                </SheetTitle>
                <SheetDescription>
                  {editingQuestion
                    ? "Update existing question details."
                    : "Create a new question for this bank."}
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-6 py-6">
                <div className="space-y-2">
                  <Label>Question Text</Label>
                  <Textarea
                    placeholder="Enter your question..."
                    value={qForm.text}
                    onChange={(e) =>
                      setQForm({ ...qForm, text: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={qForm.type}
                      onValueChange={(val) => setQForm({ ...qForm, type: val })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="multiple_choice">
                          Multiple Choice
                        </SelectItem>
                        <SelectItem value="true_false">True/False</SelectItem>
                        <SelectItem value="short_answer">
                          Short Answer
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Difficulty</Label>
                    <Select
                      value={qForm.difficulty}
                      onValueChange={(val) =>
                        setQForm({ ...qForm, difficulty: val })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Points</Label>
                    <Input
                      type="number"
                      min={1}
                      value={qForm.points}
                      onChange={(e) =>
                        setQForm({
                          ...qForm,
                          points: parseInt(e.target.value) || 1,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <Input
                      placeholder="e.g. math, algebra"
                      value={qForm.tags}
                      onChange={(e) =>
                        setQForm({ ...qForm, tags: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Dynamic Options Section based on Type */}
                {qForm.type === "multiple_choice" && (
                  <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                    <Label>Options</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add an option..."
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && (e.preventDefault(), addOption())
                        }
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={addOption}
                      >
                        Add
                      </Button>
                    </div>
                    <div className="space-y-2 mt-2">
                      {qForm.options.map((opt, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 bg-background p-2 rounded border"
                        >
                          <div className="flex-1 text-sm">{opt}</div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            onClick={() => removeOption(idx)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2 mt-4">
                      <Label>Correct Answer (Exact match of option text)</Label>
                      <Select
                        value={qForm.correct_answer}
                        onValueChange={(val) =>
                          setQForm({ ...qForm, correct_answer: val })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select correct option" />
                        </SelectTrigger>
                        <SelectContent>
                          {qForm.options.map((opt, idx) => (
                            <SelectItem key={idx} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {qForm.type === "true_false" && (
                  <div className="space-y-2">
                    <Label>Correct Answer</Label>
                    <Select
                      value={qForm.correct_answer}
                      onValueChange={(val) =>
                        setQForm({ ...qForm, correct_answer: val })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">True</SelectItem>
                        <SelectItem value="false">False</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {qForm.type === "short_answer" && (
                  <div className="space-y-2">
                    <Label>Correct Answer</Label>
                    <Input
                      placeholder="Enter the expected answer"
                      value={qForm.correct_answer}
                      onChange={(e) =>
                        setQForm({ ...qForm, correct_answer: e.target.value })
                      }
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Explanation (Optional)</Label>
                  <Textarea
                    placeholder="Explain why this is the correct answer..."
                    value={qForm.explanation}
                    onChange={(e) =>
                      setQForm({ ...qForm, explanation: e.target.value })
                    }
                  />
                </div>
              </div>
              <SheetFooter>
                <Button variant="outline" onClick={() => setIsSheetOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveQuestion}>Save Question</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading questions...</div>
      ) : questions.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium">No questions in this bank</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto mt-1">
                Add questions to this bank to start using them in your quizzes.
              </p>
            </div>
            <Button onClick={() => setIsSheetOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Question
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <Card key={q.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {q.type.replace("_", " ")}
                      </Badge>
                      <Badge
                        variant={
                          q.difficulty === "hard"
                            ? "destructive"
                            : q.difficulty === "medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {q.difficulty}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {q.points} pts
                      </span>
                      {q.tags && (
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          {q.tags}
                        </span>
                      )}
                    </div>
                    <p className="font-medium">{q.text}</p>
                    {q.type === "multiple_choice" && q.options && (
                      <div className="pl-4 border-l-2 border-muted space-y-1 mt-2">
                        {JSON.parse(q.options).map(
                          (opt: string, idx: number) => (
                            <div
                              key={idx}
                              className={`text-sm ${opt === q.correct_answer ? "text-green-600 font-medium" : "text-muted-foreground"}`}
                            >
                              {opt === q.correct_answer && "✓ "}
                              {opt}
                            </div>
                          ),
                        )}
                      </div>
                    )}
                    {q.explanation && (
                      <p className="text-sm text-muted-foreground italic mt-2">
                        Explanation: {q.explanation}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(q)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteQuestion(q.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
