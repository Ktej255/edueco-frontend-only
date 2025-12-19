"use client";

import React, { useState } from "react";
import {
  aiToolsService,
  QuizGenerationRequest,
  QuizGenerationResponse,
} from "@/services/aiToolsService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles, Download, Copy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AIToolsPage() {
  const [activeTab, setActiveTab] = useState("quiz-generator");

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-8">
        <Sparkles className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">AI Tools</h1>
          <p className="text-muted-foreground">
            Automate grading, generate quizzes, and analyze content with AI
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="quiz-generator">Quiz Generator</TabsTrigger>
          <TabsTrigger value="essay-grader">Essay Grader</TabsTrigger>
          <TabsTrigger value="content-analyzer">Content Analyzer</TabsTrigger>
        </TabsList>

        <TabsContent value="quiz-generator" className="space-y-4">
          <QuizGeneratorTab />
        </TabsContent>

        <TabsContent value="essay-grader" className="space-y-4">
          <EssayGraderTab />
        </TabsContent>

        <TabsContent value="content-analyzer" className="space-y-4">
          <ContentAnalyzerTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Quiz Generator Component
function QuizGeneratorTab() {
  const [content, setContent] = useState("");
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium",
  );
  const [generating, setGenerating] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] =
    useState<QuizGenerationResponse | null>(null);

  const handleGenerate = async () => {
    if (!content.trim()) {
      alert("Please enter some content to generate a quiz from");
      return;
    }

    setGenerating(true);
    try {
      const request: QuizGenerationRequest = {
        course_id: 1, // TODO: Get from context
        content: content,
        num_questions: numQuestions,
        difficulty: difficulty,
        question_types: ["mcq", "true_false"],
      };

      const quiz = await aiToolsService.generateQuiz(request);
      setGeneratedQuiz(quiz);
    } catch (error) {
      console.error("Quiz generation failed:", error);
      alert("Failed to generate quiz. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedQuiz) return;
    const text = JSON.stringify(generatedQuiz.questions, null, 2);
    navigator.clipboard.writeText(text);
    alert("Quiz copied to clipboard!");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Quiz from Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Lesson Content</Label>
            <Textarea
              id="content"
              placeholder="Paste your lesson content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="font-mono text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="num-questions">Number of Questions</Label>
              <Input
                id="num-questions"
                type="number"
                min="1"
                max="25"
                value={numQuestions}
                onChange={(e) =>
                  setNumQuestions(parseInt(e.target.value) || 10)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select
                value={difficulty}
                onValueChange={(value: any) => setDifficulty(value)}
              >
                <SelectTrigger id="difficulty">
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

          <Button
            onClick={handleGenerate}
            disabled={generating || !content.trim()}
            className="w-full"
          >
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Quiz
              </>
            )}
          </Button>

          {generatedQuiz && (
            <div className="text-sm text-muted-foreground space-y-1">
              <p>⚡ Generated in {generatedQuiz.generation_time.toFixed(2)}s</p>
              <p>
                💰 Estimated cost: ${generatedQuiz.estimated_cost.toFixed(4)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Panel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Generated Questions</CardTitle>
            {generatedQuiz && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!generatedQuiz ? (
            <div className="text-center py-12 text-muted-foreground">
              <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Generated questions will appear here</p>
            </div>
          ) : (
            <div className="space-y-6 max-h-[600px] overflow-y-auto">
              {generatedQuiz.questions.map((q, idx) => (
                <div key={idx} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold">
                      Q{idx + 1}. {q.question}
                    </h3>
                    <span className="text-xs px-2 py-1 bg-primary/10 rounded">
                      {q.difficulty}
                    </span>
                  </div>

                  {q.options && (
                    <div className="space-y-2">
                      {q.options.map((opt, i) => (
                        <div
                          key={i}
                          className={`p-2 rounded text-sm ${
                            opt === q.correct_answer
                              ? "bg-green-100 border border-green-300"
                              : "bg-gray-50"
                          }`}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="text-sm">
                    <span className="font-medium">Explanation: </span>
                    <span className="text-muted-foreground">
                      {q.explanation}
                    </span>
                  </div>

                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <span className="px-2 py-1 bg-gray-100 rounded">
                      {q.bloom_level}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded">
                      {q.points || 1} point{q.points !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Essay Grader Component
function EssayGraderTab() {
  const [essayText, setEssayText] = useState("");
  const [rubric, setRubric] = useState<Record<string, string>>({
    Content: "Accuracy, depth, and relevance of content",
    Organization: "Logical structure and flow of ideas",
    Language: "Grammar, vocabulary, and writing style",
  });
  const [maxScore, setMaxScore] = useState(100);
  const [grading, setGrading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGrade = async () => {
    if (!essayText.trim()) {
      alert("Please enter an essay to grade");
      return;
    }

    setGrading(true);
    try {
      const graded = await aiToolsService.gradeEssay({
        submission_id: Date.now(), // Mock submission ID
        essay_text: essayText,
        rubric: rubric,
        max_score: maxScore,
      });
      setResult(graded);
    } catch (error) {
      console.error("Grading failed:", error);
      alert("Failed to grade essay. Please try again.");
    } finally {
      setGrading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Panel */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Essay Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="essay">Student Essay</Label>
              <Textarea
                id="essay"
                placeholder="Paste student essay here..."
                value={essayText}
                onChange={(e) => setEssayText(e.target.value)}
                rows={15}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                {essayText.split(" ").filter((w) => w).length} words
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Grading Rubric</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(rubric).map(([criterion, description]) => (
              <div key={criterion} className="space-y-2">
                <Label className="font-semibold">{criterion}</Label>
                <Input
                  value={description}
                  onChange={(e) =>
                    setRubric({ ...rubric, [criterion]: e.target.value })
                  }
                  placeholder="Criterion description"
                />
              </div>
            ))}

            <div className="space-y-2">
              <Label htmlFor="max-score">Maximum Score</Label>
              <Input
                id="max-score"
                type="number"
                min="1"
                max="200"
                value={maxScore}
                onChange={(e) => setMaxScore(parseInt(e.target.value) || 100)}
              />
            </div>

            <Button
              onClick={handleGrade}
              disabled={grading || !essayText.trim()}
              className="w-full"
            >
              {grading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Grading...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Grade Essay
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Results Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Grading Results</CardTitle>
        </CardHeader>
        <CardContent>
          {!result ? (
            <div className="text-center py-12 text-muted-foreground">
              <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Grading results will appear here</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Score Display */}
              <div className="text-center p-6 bg-primary/5 rounded-lg">
                <div className="text-5xl font-bold text-primary mb-2">
                  {result.score}/{maxScore}
                </div>
                <div className="text-lg text-muted-foreground">
                  {Math.round((result.score / maxScore) * 100)}%
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">
                    Grammar
                  </div>
                  <div className="text-2xl font-semibold">
                    {result.grammar_score}%
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">
                    Originality
                  </div>
                  <div className="text-2xl font-semibold">
                    {result.originality_score}%
                  </div>
                </div>
              </div>

              {/* Feedback */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Overall Feedback</h4>
                  <p className="text-sm text-muted-foreground">
                    {result.feedback}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-green-700">
                    Strengths
                  </h4>
                  <ul className="list-disc list-inside space-y-1">
                    {result.strengths.map((strength: string, idx: number) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-orange-700">
                    Areas for Improvement
                  </h4>
                  <ul className="list-disc list-inside space-y-1">
                    {result.improvements.map(
                      (improvement: string, idx: number) => (
                        <li key={idx} className="text-sm text-muted-foreground">
                          {improvement}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Content Analyzer Component
function ContentAnalyzerTab() {
  const [content, setContent] = useState("");
  const [targetLevel, setTargetLevel] = useState("undergraduate");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!content.trim()) {
      alert("Please enter content to analyze");
      return;
    }

    setAnalyzing(true);
    try {
      const result = await aiToolsService.analyzeDifficulty({
        content_id: Date.now(),
        content_type: "lesson",
        content_text: content,
        target_level: targetLevel,
      });
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Failed to analyze content. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const getReadabilityColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getGradeColor = (grade: number) => {
    if (grade <= 8) return "text-green-600";
    if (grade <= 12) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Content Input</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content-text">Lesson or Course Content</Label>
            <Textarea
              id="content-text"
              placeholder="Paste your content here for readability analysis..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              {content.split(" ").filter((w) => w).length} words
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target-level">Target Audience Level</Label>
            <Select value={targetLevel} onValueChange={setTargetLevel}>
              <SelectTrigger id="target-level">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high-school">High School</SelectItem>
                <SelectItem value="undergraduate">Undergraduate</SelectItem>
                <SelectItem value="graduate">Graduate</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={analyzing || !content.trim()}
            className="w-full"
          >
            {analyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Analyze Content
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Results</CardTitle>
        </CardHeader>
        <CardContent>
          {!analysis ? (
            <div className="text-center py-12 text-muted-foreground">
              <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Analysis results will appear here</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Readability Scores */}
              <div className="space-y-3">
                <h4 className="font-semibold">Readability Scores</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 border rounded">
                    <div className="text-xs text-muted-foreground mb-1">
                      Flesch Reading Ease
                    </div>
                    <div
                      className={`text-2xl font-bold ${getReadabilityColor(analysis.flesch_reading_ease)}`}
                    >
                      {analysis.flesch_reading_ease.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {analysis.flesch_reading_ease >= 80
                        ? "Easy"
                        : analysis.flesch_reading_ease >= 60
                          ? "Moderate"
                          : "Difficult"}
                    </div>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="text-xs text-muted-foreground mb-1">
                      Grade Level
                    </div>
                    <div
                      className={`text-2xl font-bold ${getGradeColor(analysis.flesch_kincaid_grade)}`}
                    >
                      {analysis.flesch_kincaid_grade.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Grade {Math.round(analysis.flesch_kincaid_grade)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold mb-2">Recommended Level</h4>
                <p className="text-lg capitalize">
                  {analysis.recommended_level}
                </p>
                <p className="text-sm text-muted-foreground">
                  {analysis.target_audience}
                </p>
              </div>

              {/* Metrics */}
              <div className="space-y-2">
                <h4 className="font-semibold">Additional Metrics</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2 bg-gray-50 rounded">
                    <span className="text-muted-foreground">Reading Time:</span>
                    <span className="ml-2 font-semibold">
                      {analysis.estimated_reading_time} min
                    </span>
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              {analysis.simplification_suggestions?.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">
                    Suggestions for Improvement
                  </h4>
                  <ul className="list-disc list-inside space-y-1">
                    {analysis.simplification_suggestions.map(
                      (suggestion: string, idx: number) => (
                        <li key={idx} className="text-sm text-muted-foreground">
                          {suggestion}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
