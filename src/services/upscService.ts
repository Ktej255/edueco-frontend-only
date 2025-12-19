
import api from "@/lib/api";

export interface UPSCReport {
    id: string;
    student_id: string;
    question_id: string;
    attempt_before_id?: string;
    attempt_after_id?: string;
    coverage_before?: number;
    similarity_before?: number;
    estimated_marks_before?: number;
    coverage_after?: number;
    similarity_after?: number;
    estimated_marks_after?: number;
    missed_points?: string[];
    suggestions?: string[];
    tone_feedback?: string;
    generated_at?: string;
}

export interface StudentDashboardResponse {
    total_days_completed: number;
    current_streak: number;
    next_drill?: {
        plan_id: string;
        title: string;
        type: string;
    };
    recent_reports: UPSCReport[];
}

export interface UPSCPlan {
    id: string;
    title: string;
    plan_type: string;
    start_date: string;
    end_date: string;
    sequence_order: number;
    is_active: boolean;
}

export interface PlanStatusResponse {
    plan_id: string;
    is_locked: boolean;
    completion_percentage: number;
    unlocked_at?: string;
    completed_at?: string;
}

export const upscService = {
    getStudentDashboard: async (): Promise<StudentDashboardResponse> => {
        const response = await api.get("/upsc/student/dashboard");
        return response.data;
    },

    getStudentPlans: async (): Promise<UPSCPlan[]> => {
        const response = await api.get("/upsc/student/plans");
        return response.data;
    },

    getPlanStatus: async (planId: string): Promise<PlanStatusResponse> => {
        const response = await api.get(`/upsc/student/plans/${planId}/status`);
        return response.data;
    },

    submitAttempt: async (questionId: string, attemptType: string, file: File, mediaType: 'image' | 'audio' = 'image'): Promise<any> => {
        const formData = new FormData();
        formData.append("question_id", questionId);
        formData.append("attempt_type", attemptType);

        if (mediaType === 'image') {
            formData.append("image", file);
        } else {
            formData.append("audio", file);
        }

        const response = await api.post("/upsc/attempts", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    // --- Admin Methods ---
    getBatches: async (): Promise<any[]> => {
        const response = await api.get("/upsc/batches");
        return response.data;
    },

    getPlans: async (batchId?: string): Promise<any[]> => {
        const params = batchId ? { batch_id: batchId } : {};
        const response = await api.get("/upsc/plans", { params });
        return response.data;
    },

    createBatch: async (data: any): Promise<any> => {
        const response = await api.post("/upsc/batches", data);
        return response.data;
    },

    generatePlan: async (data: any): Promise<any> => {
        const response = await api.post("/upsc/plans/generate", data);
        return response.data;
    },

    approvePlan: async (planId: string): Promise<any> => {
        const response = await api.post(`/upsc/plans/${planId}/approve`);
        return response.data;
    },

    getBatchStudents: async (batchId: string): Promise<any[]> => {
        const response = await api.get(`/upsc/batches/${batchId}/students`);
        return response.data;
    },

    getStudentProgress: async (studentId: string): Promise<any[]> => {
        const response = await api.get(`/upsc/students/${studentId}/progress`);
        return response.data;
    },

    overrideProgress: async (studentId: string, planId: string, isLocked: boolean): Promise<any> => {
        const response = await api.post(`/upsc/students/${studentId}/progress/${planId}/override`, {
            is_locked: isLocked
        });
        return response.data;
    },

    getTimerConfigs: async (batchId: string): Promise<any[]> => {
        const response = await api.get(`/upsc/batches/${batchId}/timers`);
        return response.data;
    },

    createTimerConfig: async (data: { batch_id: string; phase: string; duration_minutes: number; is_active: boolean }): Promise<any> => {
        const response = await api.post("/upsc/timers", data);
        return response.data;
    }
};
