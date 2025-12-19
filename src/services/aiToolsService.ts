import api from "@/lib/api";

export interface EssayGradeRequest {
  submission_id: number;
  essay_text: string;
  rubric: Record<string, string>;
  max_score?: number;
}

export interface EssayGradeResponse {
  submission_id: number;
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  grammar_score: number;
  originality_score: number;
}

export interface QuizGenerationRequest {
  course_id: number;
  lesson_id?: number;
  content: string;
  num_questions?: number;
  difficulty?: "easy" | "medium" | "hard";
  question_types?: string[];
}

export interface QuizGenerationResponse {
  id: number;
  questions: Array<{
    question: string;
    type: string;
    options?: string[];
    correct_answer: string;
    explanation: string;
    difficulty: string;
    bloom_level: string;
    points?: number;
  }>;
  generation_time: number;
  estimated_cost: number;
}

export interface DifficultyAnalysisRequest {
  content_id: number;
  content_type: "course" | "lesson";
  content_text: string;
  target_level?: string;
}

export interface DifficultyAnalysisResponse {
  flesch_reading_ease: number;
  flesch_kincaid_grade: number;
  recommended_level: string;
  target_audience: string;
  estimated_reading_time: number;
  simplification_suggestions: string[];
}

export interface PlagiarismCheckRequest {
  submission_id: number;
  text: string;
  assignment_id: number;
  threshold?: number;
}

export interface PlagiarismCheckResponse {
  submission_id: number;
  similarity_percentage: number;
  originality_score: number;
  matches: Array<{
    source: string;
    url?: string;
    percentage: number;
    text_snippet: string;
  }>;
  is_plagiarized: boolean;
  review_required: boolean;
}

export interface AIUsageStats {
  feature: string;
  usage_count: number;
  total_tokens: number;
  total_cost: number;
}

export const aiToolsService = {
  // Essay Grading
  gradeEssay: async (
    request: EssayGradeRequest,
  ): Promise<EssayGradeResponse> => {
    const response = await api.post("/ai-tools/grade-essay", request);
    return response.data;
  },

  getGradingResult: async (
    submissionId: number,
  ): Promise<EssayGradeResponse> => {
    const response = await api.get(`/ai-tools/grading-result/${submissionId}`);
    return response.data;
  },

  // Quiz Generation
  generateQuiz: async (
    request: QuizGenerationRequest,
  ): Promise<QuizGenerationResponse> => {
    const response = await api.post("/ai-tools/generate-quiz", request);
    return response.data;
  },

  getGeneratedQuiz: async (quizId: number) => {
    const response = await api.get(`/ai-tools/generated-quiz/${quizId}`);
    return response.data;
  },

  rateQuiz: async (quizId: number, rating: number, notes?: string) => {
    const response = await api.post(`/ai-tools/rate-quiz/${quizId}`, null, {
      params: { rating, notes },
    });
    return response.data;
  },

  // Difficulty Analysis
  analyzeDifficulty: async (
    request: DifficultyAnalysisRequest,
  ): Promise<DifficultyAnalysisResponse> => {
    const response = await api.post("/ai-tools/analyze-difficulty", request);
    return response.data;
  },

  // Plagiarism Detection
  checkPlagiarism: async (
    request: PlagiarismCheckRequest,
  ): Promise<PlagiarismCheckResponse> => {
    const response = await api.post("/ai-tools/check-plagiarism", request);
    return response.data;
  },

  getPlagiarismResult: async (
    submissionId: number,
  ): Promise<PlagiarismCheckResponse> => {
    const response = await api.get(
      `/ai-tools/plagiarism-result/${submissionId}`,
    );
    return response.data;
  },

  reviewPlagiarism: async (checkId: number, notes: string) => {
    const response = await api.post(
      `/ai-tools/plagiarism-review/${checkId}`,
      null,
      {
        params: { notes },
      },
    );
    return response.data;
  },

  // Usage Statistics
  getUsageStats: async (): Promise<AIUsageStats[]> => {
    const response = await api.get("/ai-tools/usage-stats");
    return response.data;
  },
};
