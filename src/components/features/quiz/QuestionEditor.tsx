import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface QuestionOption {
  id?: number;
  text: string;
  is_correct: boolean;
  order_index: number;
  match_text?: string;
}

interface QuestionEditorProps {
  questionType: string;
  questionText: string;
  points: number;
  explanation: string;
  options: QuestionOption[];
  onQuestionTextChange: (text: string) => void;
  onPointsChange: (points: number) => void;
  onExplanationChange: (text: string) => void;
  onOptionsChange: (options: QuestionOption[]) => void;
}

export function QuestionEditor({
  questionType,
  questionText,
  points,
  explanation,
  options,
  onQuestionTextChange,
  onPointsChange,
  onExplanationChange,
  onOptionsChange,
}: QuestionEditorProps) {
  const addOption = () => {
    onOptionsChange([
      ...options,
      { text: "", is_correct: false, order_index: options.length },
    ]);
  };

  const updateOption = (index: number, field: string, value: any) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    onOptionsChange(newOptions);
  };

  const removeOption = (index: number) => {
    onOptionsChange(options.filter((_, i) => i !== index));
  };

  const renderOptionsEditor = () => {
    switch (questionType) {
      case "multiple_choice":
        return (
          <div className="space-y-3">
            <Label className="text-white">Answer Options</Label>
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={option.is_correct}
                  onChange={() => {
                    const newOptions = options.map((opt, i) => ({
                      ...opt,
                      is_correct: i === index,
                    }));
                    onOptionsChange(newOptions);
                  }}
                  className="mt-1"
                />
                <Input
                  value={option.text}
                  onChange={(e) => updateOption(index, "text", e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="bg-gray-800 border-gray-700 text-white flex-1"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeOption(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={addOption}
              className="border-gray-700 text-gray-300"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Option
            </Button>
          </div>
        );

      case "true_false":
        return (
          <div className="space-y-3">
            <Label className="text-white">Correct Answer</Label>
            <div className="flex gap-4">
              <button
                onClick={() =>
                  onOptionsChange([
                    { text: "True", is_correct: true, order_index: 0 },
                    { text: "False", is_correct: false, order_index: 1 },
                  ])
                }
                className={`px-6 py-3 rounded-lg ${
                  options[0]?.is_correct
                    ? "bg-green-600 text-white"
                    : "bg-gray-800 text-gray-400"
                }`}
              >
                True
              </button>
              <button
                onClick={() =>
                  onOptionsChange([
                    { text: "True", is_correct: false, order_index: 0 },
                    { text: "False", is_correct: true, order_index: 1 },
                  ])
                }
                className={`px-6 py-3 rounded-lg ${
                  options[1]?.is_correct
                    ? "bg-green-600 text-white"
                    : "bg-gray-800 text-gray-400"
                }`}
              >
                False
              </button>
            </div>
          </div>
        );

      case "short_answer":
        return (
          <div className="space-y-3">
            <Label className="text-white">
              Acceptable Answers (case-insensitive)
            </Label>
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={option.text}
                  onChange={(e) => updateOption(index, "text", e.target.value)}
                  placeholder={`Acceptable answer ${index + 1}`}
                  className="bg-gray-800 border-gray-700 text-white flex-1"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeOption(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={addOption}
              className="border-gray-700 text-gray-300"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Answer
            </Button>
          </div>
        );

      case "long_answer":
        return (
          <div className="p-4 bg-gray-800/50 rounded border border-gray-700">
            <p className="text-sm text-gray-400">
              This question requires manual grading. Students will provide a
              text response.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="question-text" className="text-white">
          Question Text
        </Label>
        <Textarea
          id="question-text"
          value={questionText}
          onChange={(e) => onQuestionTextChange(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white mt-2"
          rows={3}
          placeholder="Enter your question here..."
        />
      </div>

      <div>
        <Label htmlFor="points" className="text-white">
          Points
        </Label>
        <Input
          id="points"
          type="number"
          min="1"
          value={points}
          onChange={(e) => onPointsChange(parseInt(e.target.value))}
          className="bg-gray-800 border-gray-700 text-white mt-2"
        />
      </div>

      {renderOptionsEditor()}

      <div>
        <Label htmlFor="explanation" className="text-white">
          Explanation (Optional)
        </Label>
        <Textarea
          id="explanation"
          value={explanation}
          onChange={(e) => onExplanationChange(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white mt-2"
          rows={2}
          placeholder="Explain the correct answer..."
        />
      </div>
    </div>
  );
}
