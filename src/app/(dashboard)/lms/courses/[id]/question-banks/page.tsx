"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Database, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface QuestionBank {
  id: number;
  title: string;
  description?: string;
  category?: string;
  difficulty_level: string;
  is_active: boolean;
  question_count: number;
  created_at: string;
}

export default function QuestionBanksPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id;

  const [banks, setBanks] = useState<QuestionBank[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    difficulty_level: "medium",
    is_active: true,
  });

  useEffect(() => {
    if (courseId) {
      fetchBanks();
    }
  }, [courseId]);

  const fetchBanks = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/question-banks/courses/${courseId}/question-banks`,
      );
      setBanks(response.data);
    } catch (error) {
      console.error("Error fetching question banks:", error);
      toast.error("Failed to load question banks");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.title) {
      toast.error("Title is required");
      return;
    }

    try {
      await api.post(`/question-banks/question-banks`, {
        course_id: Number(courseId),
        ...formData,
      });

      toast.success("Question bank created");
      setIsCreateOpen(false);
      setFormData({
        title: "",
        description: "",
        category: "",
        difficulty_level: "medium",
        is_active: true,
      });
      fetchBanks();
    } catch (error) {
      console.error("Error creating question bank:", error);
      toast.error("Failed to create question bank");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this question bank?")) return;

    try {
      await api.delete(`/question-banks/question-banks/${id}`);
      toast.success("Question bank deleted");
      fetchBanks();
    } catch (error) {
      console.error("Error deleting question bank:", error);
      toast.error("Failed to delete question bank");
    }
  };

  const filteredBanks = banks.filter(
    (bank) =>
      bank.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (bank.category &&
        bank.category.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Question Banks</h1>
          <p className="text-muted-foreground">
            Manage pools of questions for random quiz generation
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Bank
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Question Bank</DialogTitle>
              <DialogDescription>
                Create a new pool of questions to use in your quizzes.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  placeholder="e.g., Chapter 1 Questions"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  placeholder="Optional description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input
                    placeholder="e.g., Midterm"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Difficulty Level</Label>
                  <Select
                    value={formData.difficulty_level}
                    onValueChange={(val) =>
                      setFormData({ ...formData, difficulty_level: val })
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
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>Create Bank</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search banks..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading question banks...</div>
      ) : filteredBanks.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
            <Database className="w-12 h-12 text-muted-foreground opacity-50" />
            <div className="text-center">
              <h3 className="text-lg font-medium">No question banks yet</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto mt-1">
                Create a question bank to start building a reusable pool of
                questions for your quizzes.
              </p>
            </div>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Bank
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBanks.map((bank) => (
            <Card key={bank.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-1">{bank.title}</CardTitle>
                    <CardDescription>
                      {bank.category || "Uncategorized"}
                    </CardDescription>
                  </div>
                  <Badge variant={bank.is_active ? "default" : "secondary"}>
                    {bank.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {bank.description || "No description provided."}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline">{bank.difficulty_level}</Badge>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">
                    {bank.question_count} questions
                  </span>
                </div>
              </CardContent>
              <div className="p-6 pt-0 mt-auto flex justify-between items-center border-t pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDelete(bank.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
                <Button
                  size="sm"
                  onClick={() =>
                    router.push(
                      `/lms/courses/${courseId}/question-banks/${bank.id}`,
                    )
                  }
                >
                  Manage Questions
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
