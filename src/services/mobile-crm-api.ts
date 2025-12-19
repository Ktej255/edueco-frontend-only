import api from "@/lib/api";

// Field Activities
export interface FieldActivity {
    id: number;
    user_id: number;
    activity_type: string;
    latitude?: number;
    longitude?: number;
    address?: string;
    lead_id?: number;
    title?: string;
    notes?: string;
    photos?: string[];
    duration_minutes?: number;
    route_distance_km?: number;
    started_at: string;
    ended_at?: string;
    created_at: string;
}

export interface CheckInRequest {
    latitude: number;
    longitude: number;
    address?: string;
    notes?: string;
}

export interface CheckOutRequest {
    latitude?: number;
    longitude?: number;
    notes?: string;
    route_distance_km?: number;
}

export interface MeetingLogRequest {
    activity_type: string;
    latitude?: number;
    longitude?: number;
    address?: string;
    lead_id?: number;
    title?: string;
    notes?: string;
    duration_minutes?: number;
    photos?: string[];
}

export interface FieldActivityDashboard {
    total_activities_today: number;
    check_ins_today: number;
    meetings_today: number;
    total_distance_km: number;
    active_check_in?: FieldActivity;
}

// Call Logs
export interface CallLog {
    id: number;
    user_id: number;
    lead_id: number;
    call_type: string;
    phone_number?: string;
    duration_seconds: number;
    outcome?: string;
    notes?: string;
    call_started_at: string;
    call_ended_at?: string;
    created_at: string;
}

export interface QuickCallRequest {
    lead_id: number;
    phone_number: string;
}

export interface CallLogSummary {
    total_calls: number;
    connected_calls: number;
    missed_calls: number;
    total_duration_minutes: number;
    average_duration_seconds: number;
}

// Voice Notes
export interface VoiceNote {
    id: number;
    user_id: number;
    lead_id?: number;
    field_activity_id?: number;
    file_url: string;
    file_name?: string;
    file_size_bytes?: number;
    duration_seconds?: number;
    transcription?: string;
    title?: string;
    created_at: string;
}

// API Functions
export const mobileCrmApi = {
    // Field Activities
    checkIn: async (data: CheckInRequest): Promise<FieldActivity> => {
        const response = await api.post<FieldActivity>("/field-activities/check-in", data);
        return response.data;
    },

    checkOut: async (data: CheckOutRequest): Promise<FieldActivity> => {
        const response = await api.post<FieldActivity>("/field-activities/check-out", data);
        return response.data;
    },

    logMeeting: async (data: MeetingLogRequest): Promise<FieldActivity> => {
        const response = await api.post<FieldActivity>("/field-activities/meeting", data);
        return response.data;
    },

    getMyActivities: async (params?: {
        activity_type?: string;
        date_from?: string;
        date_to?: string;
        skip?: number;
        limit?: number;
    }): Promise<FieldActivity[]> => {
        const response = await api.get<FieldActivity[]>("/field-activities/my-activities", { params });
        return response.data;
    },

    getRouteForDate: async (userId: number, date: string): Promise<FieldActivity[]> => {
        const response = await api.get<FieldActivity[]>(`/field-activities/route/${userId}/${date}`);
        return response.data;
    },

    getDashboard: async (): Promise<FieldActivityDashboard> => {
        const response = await api.get<FieldActivityDashboard>("/field-activities/dashboard");
        return response.data;
    },

    // Call Logs
    logCall: async (data: {
        lead_id: number;
        call_type: string;
        phone_number?: string;
        duration_seconds?: number;
        outcome?: string;
        notes?: string;
    }): Promise<CallLog> => {
        const response = await api.post<CallLog>("/call-logs/", data);
        return response.data;
    },

    quickCall: async (data: QuickCallRequest): Promise<CallLog> => {
        const response = await api.post<CallLog>("/call-logs/quick-call", data);
        return response.data;
    },

    updateCallLog: async (id: number, data: {
        duration_seconds?: number;
        outcome?: string;
        notes?: string;
    }): Promise<CallLog> => {
        const response = await api.put<CallLog>(`/call-logs/${id}`, data);
        return response.data;
    },

    getCallsForLead: async (leadId: number): Promise<CallLog[]> => {
        const response = await api.get<CallLog[]>(`/call-logs/lead/${leadId}`);
        return response.data;
    },

    getMyCalls: async (params?: { call_type?: string; skip?: number; limit?: number }): Promise<CallLog[]> => {
        const response = await api.get<CallLog[]>("/call-logs/my-calls", { params });
        return response.data;
    },

    getCallSummary: async (leadId: number): Promise<CallLogSummary> => {
        const response = await api.get<CallLogSummary>(`/call-logs/summary/${leadId}`);
        return response.data;
    },

    // Voice Notes
    uploadVoiceNote: async (
        file: Blob,
        data: {
            lead_id?: number;
            field_activity_id?: number;
            title?: string;
            duration_seconds?: number;
        }
    ): Promise<VoiceNote> => {
        const formData = new FormData();
        formData.append("file", file, `voice_note_${Date.now()}.webm`);
        if (data.lead_id) formData.append("lead_id", data.lead_id.toString());
        if (data.field_activity_id) formData.append("field_activity_id", data.field_activity_id.toString());
        if (data.title) formData.append("title", data.title);
        if (data.duration_seconds) formData.append("duration_seconds", data.duration_seconds.toString());

        const response = await api.post<VoiceNote>("/voice-notes/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    },

    getVoiceNotesForLead: async (leadId: number): Promise<VoiceNote[]> => {
        const response = await api.get<VoiceNote[]>(`/voice-notes/lead/${leadId}`);
        return response.data;
    },

    getMyVoiceNotes: async (params?: { skip?: number; limit?: number }): Promise<VoiceNote[]> => {
        const response = await api.get<VoiceNote[]>("/voice-notes/my-notes", { params });
        return response.data;
    },

    deleteVoiceNote: async (id: number): Promise<void> => {
        await api.delete(`/voice-notes/${id}`);
    },
};

export default mobileCrmApi;
