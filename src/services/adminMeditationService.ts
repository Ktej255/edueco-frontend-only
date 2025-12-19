import api from "@/lib/api";
import { MeditationProcessInfo } from "./meditationService";

export interface ProcessCreateRequest {
    name: string;
    description?: string;
    order: number;
    duration_minutes: number;
    level: number;
}

export interface ProcessUpdateRequest {
    name?: string;
    description?: string;
    order?: number;
    duration_minutes?: number;
    video_url?: string;
    is_active?: boolean;
}

export const adminMeditationService = {
    // Get all processes
    async getProcesses(level?: number): Promise<MeditationProcessInfo[]> {
        const params = level ? { level } : {};
        const response = await api.get("/admin/meditation/processes", { params });
        return response.data;
    },

    // Create a new process
    async createProcess(data: ProcessCreateRequest): Promise<MeditationProcessInfo> {
        const response = await api.post("/admin/meditation/processes", data);
        return response.data;
    },

    // Get a single process
    async getProcess(id: number): Promise<MeditationProcessInfo> {
        const response = await api.get(`/admin/meditation/processes/${id}`);
        return response.data;
    },

    // Update a process
    async updateProcess(id: number, data: ProcessUpdateRequest): Promise<MeditationProcessInfo> {
        const response = await api.put(`/admin/meditation/processes/${id}`, data);
        return response.data;
    },

    // Delete a process
    async deleteProcess(id: number): Promise<void> {
        await api.delete(`/admin/meditation/processes/${id}`);
    },

    // Upload video for a process
    async uploadVideo(processId: number, file: File): Promise<MeditationProcessInfo> {
        const formData = new FormData();
        formData.append("file", file);
        const response = await api.post(
            `/admin/meditation/processes/${processId}/video`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    },

    // Delete video from a process
    async deleteVideo(processId: number): Promise<void> {
        await api.delete(`/admin/meditation/processes/${processId}/video`);
    },
};

export default adminMeditationService;
