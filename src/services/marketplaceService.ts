import api from "@/lib/api";

export interface InstructorEarnings {
  total_revenue: number;
  total_earnings: number;
  pending_payout: number;
  total_paid: number;
  available_balance: number;
}

export interface PayoutRequest {
  amount?: number;
  payment_method: string;
}

export interface PayoutResponse {
  id: number;
  amount: number;
  status: string;
  payment_method: string;
  requested_at: string;
  processed_at?: string;
  completed_at?: string;
  failure_reason?: string;
}

export interface RevenueStats {
  total_revenue: number;
  platform_earnings: number;
  instructor_earnings: number;
  affiliate_commissions: number;
  total_sales: number;
  average_sale_value: number;
}

export const marketplaceService = {
  // Instructor Earnings
  getMyEarnings: async (): Promise<InstructorEarnings> => {
    const response = await api.get("/marketplace/earnings");
    return response.data;
  },

  // Payouts
  requestPayout: async (data: PayoutRequest): Promise<PayoutResponse> => {
    const response = await api.post("/marketplace/payouts/request", null, {
      params: data,
    });
    return response.data;
  },

  getPayoutHistory: async (limit: number = 20): Promise<PayoutResponse[]> => {
    const response = await api.get("/marketplace/payouts/history", {
      params: { limit },
    });
    return response.data;
  },

  // Admin
  getPlatformRevenue: async (
    startDate?: string,
    endDate?: string,
  ): Promise<RevenueStats> => {
    const response = await api.get("/marketplace/admin/revenue", {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  },

  getPendingPayouts: async (
    type: "instructor" | "affiliate" = "instructor",
  ): Promise<PayoutResponse[]> => {
    const response = await api.get("/marketplace/admin/payouts/pending", {
      params: { payout_type: type },
    });
    return response.data;
  },

  processPayout: async (payoutId: number): Promise<void> => {
    await api.post(`/marketplace/admin/payouts/${payoutId}/process`);
  },

  triggerAutoPayouts: async (): Promise<{
    message: string;
    payout_ids: number[];
  }> => {
    const response = await api.post("/marketplace/admin/payouts/auto-process");
    return response.data;
  },
};
