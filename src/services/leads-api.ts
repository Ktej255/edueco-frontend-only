import api from "@/lib/api";
import { Lead, LeadFilter } from "@/types/lead";

export const leadsApi = {
    getLeads: async (params?: LeadFilter & { skip?: number; limit?: number }) => {
        const response = await api.get<Lead[]>("/leads", { params });
        return response.data;
    },

    createLead: async (data: Partial<Lead>) => {
        const response = await api.post<Lead>("/leads", data);
        return response.data;
    },

    updateLead: async (id: number, data: Partial<Lead>) => {
        const response = await api.put<Lead>(`/leads/${id}`, data);
        return response.data;
    },

    bulkReassign: async (leadIds: number[], assignedToId: number) => {
        const response = await api.post<Lead[]>("/leads/bulk-reassign", {
            lead_ids: leadIds,
            assigned_to_id: assignedToId,
        });
        return response.data;
    },

    verifyLead: async (id: number, method: 'EMAIL' | 'SMS' | 'WHATSAPP') => {
        const response = await api.post<Lead>(`/leads/${id}/verify`, null, {
            params: { method }
        });
        return response.data;
    }
};
