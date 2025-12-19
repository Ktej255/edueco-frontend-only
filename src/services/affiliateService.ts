import api from "@/lib/api";

export interface AffiliateStats {
  referral_code: string;
  clicks: number;
  conversions: number;
  conversion_rate: number;
  total_earnings: number;
  pending_earnings: number;
  paid_earnings: number;
}

export interface AffiliateRegister {
  custom_slug?: string;
  payment_method: string;
  payout_email?: string;
}

export interface AffiliateLinkResponse {
  referral_code: string;
  tracking_cookie: string;
}

export const affiliateService = {
  register: async (data: AffiliateRegister): Promise<AffiliateStats> => {
    const response = await api.post("/affiliates/register", data);
    return response.data;
  },

  getStats: async (): Promise<AffiliateStats> => {
    const response = await api.get("/affiliates/stats");
    return response.data;
  },

  trackClick: async (referralCode: string): Promise<AffiliateLinkResponse> => {
    const response = await api.post(`/affiliates/track/${referralCode}`);
    return response.data;
  },
};
