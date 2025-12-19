/**
 * Prelims Recall Analysis Service
 * Calls backend API to analyze student recall using AI
 */

import api from "@/lib/api";

export interface RecallAnalysisRequest {
    cycle_id: number;
    day_number: number;
    part_number: number;
    segment_number: number;
    segment_title: string;
    key_points: string;
    response_type: "audio" | "image";
    response_text?: string;
}

export interface RecallAnalysisResponse {
    // Topic Relevance
    is_relevant: boolean;
    relevance_message: string;

    // Core Metrics
    recall_score: number;
    understanding_level: string;  // Excellent/Good/Satisfactory/Needs Work/Insufficient
    coverage_percentage: number;  // What % of key points were covered

    // Detailed Analysis
    feedback: string;
    detailed_analysis: string;

    // Strengths & Improvements
    strengths: string[];
    areas_to_improve: string[];
    key_takeaways: string[];

    // Concept Coverage - STRICT MATCHING
    concepts_covered: string[];  // Topics that MATCH video
    concepts_missed: string[];   // Video topics NOT covered

    // Content Matching Analysis
    matched_content: string[];     // Student content matching video
    unmatched_content: string[];   // Student content not in video
    irrelevant_content: string[];  // Off-topic/wrong content

    // Penalty & Scoring
    penalty_applied: number;  // Points deducted for irrelevant
    base_score: number;       // Score before penalty

    // Personalized Recommendations
    revision_priority: string;  // high/medium/low
    memory_retention_tips: string[];
    suggested_next_steps: string[];

    // AI Metadata
    ai_source: string;
    ai_model?: string;
    analysis_timestamp?: string;
    confidence_score: number;
}

/**
 * Analyze student recall using AI Router
 */
export async function analyzeRecall(request: RecallAnalysisRequest): Promise<RecallAnalysisResponse> {
    try {
        // Use demo endpoint (no auth required for testing)
        const response = await api.post<RecallAnalysisResponse>("/prelims/analyze-recall-demo", request);
        return response.data;
    } catch (error: any) {
        console.error("Recall analysis failed:", error);
        // Return fallback response with template indicator
        return {
            is_relevant: true,
            relevance_message: "",
            recall_score: 70,
            understanding_level: "Satisfactory",
            coverage_percentage: 0,
            feedback: "Analysis could not be completed. Please try again.",
            detailed_analysis: "Unable to analyze your response. Please try again or continue with your learning.",
            strengths: ["Submitted response"],
            areas_to_improve: ["Ensure thorough coverage of key points"],
            key_takeaways: [],
            concepts_covered: [],
            concepts_missed: [],
            matched_content: [],
            unmatched_content: [],
            irrelevant_content: [],
            penalty_applied: 0,
            base_score: 70,
            revision_priority: "medium",
            memory_retention_tips: ["Review the video content again"],
            suggested_next_steps: ["Try submitting again", "Continue to next segment"],
            ai_source: "template",
            ai_model: undefined,
            analysis_timestamp: new Date().toISOString(),
            confidence_score: 0
        };
    }
}

export const prelimsRecallService = {
    analyzeRecall
};
