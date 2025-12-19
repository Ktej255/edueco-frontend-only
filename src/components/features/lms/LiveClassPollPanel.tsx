"use client";

import React, { useState } from "react";
import { BarChart2, CheckCircle, Plus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Assuming this exists or I'll use standard inputs if not
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Poll } from "@/hooks/useLiveClassWebSocket";

interface LiveClassPollPanelProps {
  polls: Poll[];
  activePollId?: number;
  userRole: "instructor" | "student";
  onVote: (pollId: number, optionIndex: number) => void;
  onCreatePoll: (question: string, options: string[]) => void;
  onEndPoll: (pollId: number) => void;
}

export function LiveClassPollPanel({
  polls,
  activePollId,
  userRole,
  onVote,
  onCreatePoll,
  onEndPoll,
}: LiveClassPollPanelProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptions, setNewOptions] = useState(["", ""]);

  const activePoll = polls.find((p) => p.poll_id === activePollId);

  const handleVote = () => {
    if (activePoll && selectedOption !== null) {
      onVote(activePoll.poll_id, selectedOption);
      setSelectedOption(null); // Reset after vote
    }
  };

  const handleCreatePoll = () => {
    const validOptions = newOptions.filter((o) => o.trim() !== "");
    if (newQuestion.trim() && validOptions.length >= 2) {
      onCreatePoll(newQuestion, validOptions);
      setIsCreating(false);
      setNewQuestion("");
      setNewOptions(["", ""]);
    }
  };

  const addOption = () => {
    if (newOptions.length < 5) {
      setNewOptions([...newOptions, ""]);
    }
  };

  const updateOption = (index: number, value: string) => {
    const updated = [...newOptions];
    updated[index] = value;
    setNewOptions(updated);
  };

  // Mock results for visualization (in real app, this would come from backend/websocket)
  // For now, we'll just show the options. If we had vote counts, we'd calculate percentages.
  // Let's assume the Poll object might have a 'results' field or we receive it separately.
  // Since the interface Poll doesn't have results yet, I'll add a mock visualization or just list options.

  return (
    <Card className="h-full bg-gray-900 border-gray-800 flex flex-col">
      <CardHeader className="pb-2 border-b border-gray-800 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-gray-200 flex items-center gap-2">
          <BarChart2 className="h-4 w-4 text-cyan-500" />
          Polls
        </CardTitle>
        {userRole === "instructor" && (
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Plus className="h-4 w-4 text-cyan-500" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle>Create New Poll</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Question</Label>
                  <Input
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Ask a question..."
                    className="bg-gray-900 border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Options</Label>
                  {newOptions.map((option, idx) => (
                    <Input
                      key={idx}
                      value={option}
                      onChange={(e) => updateOption(idx, e.target.value)}
                      placeholder={`Option ${idx + 1}`}
                      className="bg-gray-900 border-gray-700 mb-2"
                    />
                  ))}
                  {newOptions.length < 5 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addOption}
                      className="w-full border-dashed border-gray-600 text-gray-400 hover:text-white"
                    >
                      <Plus className="h-3 w-3 mr-1" /> Add Option
                    </Button>
                  )}
                </div>
                <Button
                  onClick={handleCreatePoll}
                  className="w-full bg-cyan-600 hover:bg-cyan-500"
                >
                  Launch Poll
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {activePoll ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between">
              <Badge
                variant="outline"
                className="border-cyan-500/50 text-cyan-400 bg-cyan-500/10"
              >
                Active Now
              </Badge>
              {userRole === "instructor" && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => onEndPoll(activePoll.poll_id)}
                >
                  End Poll
                </Button>
              )}
            </div>

            <h3 className="text-lg font-semibold text-white">
              {activePoll.question}
            </h3>

            <div className="space-y-3">
              {activePoll.options.map((option, idx) => (
                <div
                  key={idx}
                  className={`
                                        p-3 rounded-lg border transition-all cursor-pointer
                                        ${
                                          selectedOption === idx
                                            ? "border-cyan-500 bg-cyan-500/10"
                                            : "border-gray-700 hover:border-gray-600 bg-gray-800/50"
                                        }
                                    `}
                  onClick={() =>
                    userRole === "student" && setSelectedOption(idx)
                  }
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-200">{option}</span>
                    {selectedOption === idx && (
                      <CheckCircle className="h-4 w-4 text-cyan-500" />
                    )}
                  </div>
                  {/* If we had results, we'd show progress bar here */}
                  {/* <Progress value={45} className="h-1.5 bg-gray-700" indicatorClassName="bg-cyan-500" /> */}
                </div>
              ))}
            </div>

            {userRole === "student" && (
              <Button
                className="w-full bg-cyan-600 hover:bg-cyan-500 mt-4"
                disabled={selectedOption === null}
                onClick={handleVote}
              >
                Submit Vote
              </Button>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-2">
            <BarChart2 className="h-8 w-8 opacity-20" />
            <p className="text-sm">No active polls</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
