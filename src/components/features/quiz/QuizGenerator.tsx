"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Wand2, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface QuestionBank {
  id: number;
  title: string;
  question_count: number;
}

interface PoolConfig {
  question_bank_id: string;
  num_questions: number;
  difficulty_filter: string;
}

interface QuizGeneratorProps {
  courseId: number | string;
  quizId: number | string;
  onGenerate: () => void;
}

export function QuizGenerator({
  courseId,
  quizId,
  onGenerate,
}: QuizGeneratorProps) {
  const [open, setOpen] = useState(false);
  const [banks, setBanks] = useState<QuestionBank[]>([]);
  const [loading, setLoading] = useState(false);
  const [pools, setPools] = useState<PoolConfig[]>([
    { question_bank_id: "", num_questions: 5, difficulty_filter: "all" },
  ]);

  useEffect(() => {
    if (open && courseId) {
      fetchBanks();
    }
  }, [open, courseId]);

  const fetchBanks = async () => {
    try {
      const response = await api.get(
        `/question-banks/courses/${courseId}/question-banks`,
      );
      setBanks(response.data);
    } catch (error) {
      console.error("Error fetching banks:", error);
    }
  };

  const handleAddPool = () => {
    setPools([
      ...pools,
      { question_bank_id: "", num_questions: 5, difficulty_filter: "all" },
    ]);
  };

  const handleRemovePool = (index: number) => {
    const newPools = [...pools];
    newPools.splice(index, 1);
    setPools(newPools);
  };

  const updatePool = (index: number, field: keyof PoolConfig, value: any) => {
    const newPools = [...pools];
    newPools[index] = { ...newPools[index], [field]: value };
    setPools(newPools);
  };

  const handleGenerate = async () => {
    const validPools = pools.filter((p) => p.question_bank_id);
    if (validPools.length === 0) {
      toast.error("Please select at least one question bank");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        quiz_id: Number(quizId),
        pools: validPools.map((p) => ({
          question_bank_id: Number(p.question_bank_id),
          num_questions: p.num_questions,
          difficulty_filter:
            p.difficulty_filter === "all" ? null : p.difficulty_filter,
        })),
      };

      await api.post(`/question-banks/quizzes/generate-from-banks`, payload);

      toast.success("Questions generated successfully!");
      setOpen(false);
      onGenerate();
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast.error("Failed to generate quiz");
    } finally {
      setLoading(false);
    }
  };

  if (quizId === "new") {
    return (
      <Button
        variant="outline"
        disabled
        title="Save quiz first to generate from bank"
        className="opacity-50 cursor-not-allowed border-gray-700 text-gray-400"
      >
        <Wand2 className="mr-2 h-4 w-4" />
        Generate from Bank
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-cyan-600 text-cyan-400 hover:bg-cyan-950"
        >
          <Wand2 className="mr-2 h-4 w-4" />
          Generate from Bank
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Generate Quiz Questions</DialogTitle>
          <DialogDescription className="text-gray-400">
            Randomly select questions from your question banks.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
          {pools.map((pool, index) => (
            <div
              key={index}
              className="flex gap-3 items-start p-3 bg-gray-800 rounded-lg border border-gray-700"
            >
              <div className="grid gap-3 flex-1">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-400">
                      Question Bank
                    </Label>
                    <Select
                      value={pool.question_bank_id}
                      onValueChange={(val) =>
                        updatePool(index, "question_bank_id", val)
                      }
                    >
                      <SelectTrigger className="bg-gray-900 border-gray-700 h-8 text-white">
                        <SelectValue placeholder="Select Bank" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-800 text-white">
                        {banks.map((bank) => (
                          <SelectItem key={bank.id} value={String(bank.id)}>
                            {bank.title} ({bank.question_count})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-400">Difficulty</Label>
                    <Select
                      value={pool.difficulty_filter}
                      onValueChange={(val) =>
                        updatePool(index, "difficulty_filter", val)
                      }
                    >
                      <SelectTrigger className="bg-gray-900 border-gray-700 h-8 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-800 text-white">
                        <SelectItem value="all">Any Difficulty</SelectItem>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="space-y-1 flex-1">
                    <Label className="text-xs text-gray-400">Count</Label>
                    <Input
                      type="number"
                      min={1}
                      className="bg-gray-900 border-gray-700 h-8 text-white"
                      value={pool.num_questions}
                      onChange={(e) =>
                        updatePool(
                          index,
                          "num_questions",
                          parseInt(e.target.value) || 1,
                        )
                      }
                    />
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-red-400 mt-6"
                onClick={() => handleRemovePool(index)}
                disabled={pools.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddPool}
            className="text-cyan-400 hover:text-cyan-300"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Another Bank
          </Button>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="border-gray-700 text-white hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-cyan-600 hover:bg-cyan-500 text-white"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Generate Questions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
