import api from "@/lib/api";

export interface LevelInfo {
    level: number;
    name: string;
    description: string;
    total_days: number;
    completed_days: number;
    is_unlocked: boolean;
    is_current: boolean;
    is_completed: boolean;
}

export interface OverviewResponse {
    current_level: number;
    current_day: number;
    total_streak: number;
    last_practice_date: string | null;
    levels: LevelInfo[];
    total_days_completed: number;
    total_days_remaining: number;
}

export interface DayInfo {
    day_number: number;
    is_unlocked: boolean;
    is_completed: boolean;
    completed_at: string | null;
    upload_url: string | null;
    unlock_date: string | null;  // When this day will unlock (for display)
}

export interface LevelDetailResponse {
    level: number;
    name: string;
    description: string;
    total_days: number;
    days: DayInfo[];
}

export interface DayDetailResponse {
    level: number;
    day_number: number;
    is_unlocked: boolean;
    is_completed: boolean;
    completed_at: string | null;
    upload_url: string | null;
    can_complete_today: boolean;
}

export interface DayCompleteResponse {
    success: boolean;
    message: string;
    upload_url: string | null;
    new_streak: number;
    level_completed: boolean;
    next_level_unlocked: boolean;
}

export interface StreakResponse {
    current_streak: number;
    total_streak: number;
    last_practice_date: string | null;
}

// Level configuration (mirrors backend)
export const GRAPHOTHERAPY_LEVELS = {
    1: { days: 21, name: "Foundation", description: "Building core handwriting habits", color: "blue" },
    2: { days: 30, name: "Intermediate", description: "Improving letter formations", color: "purple" },
    3: { days: 40, name: "Advanced", description: "Word and sentence practice", color: "orange" },
    4: { days: 90, name: "Mastery", description: "Full handwriting transformation", color: "green" }
};

export const graphotherapyService = {
    /**
     * Get overview of graphotherapy progress
     */
    async getOverview(): Promise<OverviewResponse> {
        const response = await api.get("/graphotherapy/overview");
        return response.data;
    },

    /**
     * Get details for a specific level
     */
    async getLevelDetail(levelId: number): Promise<LevelDetailResponse> {
        const response = await api.get(`/graphotherapy/level/${levelId}`);
        return response.data;
    },

    /**
     * Get details for a specific day
     */
    async getDayDetail(levelId: number, dayNumber: number): Promise<DayDetailResponse> {
        const response = await api.get(`/graphotherapy/level/${levelId}/day/${dayNumber}`);
        return response.data;
    },

    /**
     * Complete a day with image upload
     */
    async completeDay(levelId: number, dayNumber: number, file: File): Promise<DayCompleteResponse> {
        const formData = new FormData();
        formData.append("file", file);

        const response = await api.post(
            `/graphotherapy/level/${levelId}/day/${dayNumber}/complete`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );
        return response.data;
    },

    /**
     * Get current streak information
     */
    async getStreak(): Promise<StreakResponse> {
        const response = await api.get("/graphotherapy/streak");
        return response.data;
    }
};

export default graphotherapyService;
