import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, GripVertical, Edit2, Trash2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QuestionEditor } from "./QuestionEditor";
import { Badge } from "@/components/ui/badge";

export interface Question {
  id: number | string;
  text: string;
  type: string;
  points: number;
  order_index: number;
  explanation: string;
  options: Array<{
    id?: number;
    text: string;
    is_correct: boolean;
    order_index: number;
    match_text?: string;
  }>;
}

import { QuizGenerator } from "./QuizGenerator";

interface QuizBuilderProps {
  questions: Question[];
  onQuestionsChange: (questions: Question[]) => void;
  courseId?: string | number;
  quizId?: string | number;
  onRefresh?: () => void;
}

function SortableQuestion({ question, index, onEdit, onDelete }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `question-${question.id}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getQuestionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      multiple_choice: "Multiple Choice",
      true_false: "True/False",
      short_answer: "Short Answer",
      long_answer: "Essay",
    };
    return labels[type] || type;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-800/50 border border-gray-700 rounded-lg p-4"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing mt-1"
          >
            <GripVertical className="h-5 w-5 text-gray-500 hover:text-cyan-400" />
          </div>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-bold">
            {index + 1}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-white font-medium">
                {question.text || "Untitled Question"}
              </p>
              <Badge
                variant="outline"
                className="text-xs border-gray-600 text-gray-400"
              >
                {getQuestionTypeLabel(question.type)}
              </Badge>
              <Badge
                variant="outline"
                className="text-xs border-cyan-600 text-cyan-400"
              >
                {question.points} pts
              </Badge>
            </div>
            {question.options.length > 0 && (
              <div className="text-sm text-gray-400 space-y-1">
                {question.options.slice(0, 2).map((opt: any, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    {opt.is_correct && (
                      <CheckCircle className="h-3 w-3 text-green-400" />
                    )}
                    <span>{opt.text}</span>
                  </div>
                ))}
                {question.options.length > 2 && (
                  <span className="text-xs text-gray-500">
                    +{question.options.length - 2} more options
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(question)}
            className="text-gray-400 hover:text-white"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(question.id)}
            className="text-red-400 hover:text-red-300"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function QuizBuilder({
  questions,
  onQuestionsChange,
  courseId,
  quizId,
  onRefresh,
}: QuizBuilderProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [questionForm, setQuestionForm] = useState<Question>({
    id: 0,
    text: "",
    type: "multiple_choice",
    points: 1,
    order_index: 0,
    explanation: "",
    options: [],
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeIndex = questions.findIndex(
      (q) => `question-${q.id}` === active.id,
    );
    const overIndex = questions.findIndex(
      (q) => `question-${q.id}` === over.id,
    );

    const newQuestions = arrayMove(questions, activeIndex, overIndex).map(
      (q, idx) => ({
        ...q,
        order_index: idx,
      }),
    );
    onQuestionsChange(newQuestions);
  };

  const openDialog = (question?: Question) => {
    if (question) {
      setEditingQuestion(question);
      setQuestionForm(question);
    } else {
      setEditingQuestion(null);
      setQuestionForm({
        id: Date.now(),
        text: "",
        type: "multiple_choice",
        points: 1,
        order_index: questions.length,
        explanation: "",
        options: [],
      });
    }
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editingQuestion) {
      const updatedQuestions = questions.map((q) =>
        q.id === editingQuestion.id ? questionForm : q,
      );
      onQuestionsChange(updatedQuestions);
    } else {
      onQuestionsChange([...questions, questionForm]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: number | string) => {
    if (confirm("Are you sure you want to delete this question?")) {
      onQuestionsChange(questions.filter((q) => q.id !== id));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Questions</h3>
        <div className="flex gap-2">
          {courseId && quizId && onRefresh && (
            <QuizGenerator
              courseId={courseId}
              quizId={quizId}
              onGenerate={onRefresh}
            />
          )}
          <Button
            onClick={() => openDialog()}
            className="bg-cyan-600 hover:bg-cyan-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-800 rounded-lg">
          <p className="text-gray-400 mb-4">
            No questions yet. Add your first question.
          </p>
          <Button
            onClick={() => openDialog()}
            className="bg-cyan-600 hover:bg-cyan-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={questions.map((q) => `question-${q.id}`)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {questions.map((question, index) => (
                <SortableQuestion
                  key={question.id}
                  question={question}
                  index={index}
                  onEdit={openDialog}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingQuestion ? "Edit Question" : "Add New Question"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Select
                value={questionForm.type}
                onValueChange={(value) => {
                  setQuestionForm({
                    ...questionForm,
                    type: value,
                    options:
                      value === "true_false"
                        ? [
                            { text: "True", is_correct: true, order_index: 0 },
                            {
                              text: "False",
                              is_correct: false,
                              order_index: 1,
                            },
                          ]
                        : [],
                  });
                }}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select question type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800">
                  <SelectItem value="multiple_choice">
                    Multiple Choice
                  </SelectItem>
                  <SelectItem value="true_false">True/False</SelectItem>
                  <SelectItem value="short_answer">Short Answer</SelectItem>
                  <SelectItem value="long_answer">Essay</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <QuestionEditor
              questionType={questionForm.type}
              questionText={questionForm.text}
              points={questionForm.points}
              explanation={questionForm.explanation}
              options={questionForm.options}
              onQuestionTextChange={(text) =>
                setQuestionForm({ ...questionForm, text })
              }
              onPointsChange={(points) =>
                setQuestionForm({ ...questionForm, points })
              }
              onExplanationChange={(explanation) =>
                setQuestionForm({ ...questionForm, explanation })
              }
              onOptionsChange={(options) =>
                setQuestionForm({ ...questionForm, options })
              }
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="border-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-cyan-600 hover:bg-cyan-500"
            >
              Save Question
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
