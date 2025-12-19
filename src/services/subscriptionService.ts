import api from "@/lib/api";

export interface Plan {
  id: number;
  name: string;
  slug: string;
  monthly_price: number;
  yearly_price?: number;
  description?: string;
  features?: string; // JSON string
  trial_days: number;
  is_active: boolean;
}

export interface Subscription {
  id: number;
  plan_id: number;
  status: string;
  billing_cycle: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  plan: Plan;
}

export interface PlanCreate {
  name: string;
  monthly_price: number;
  yearly_price?: number;
  description?: string;
  features?: string[];
  access_level?: string;
  trial_days?: number;
}

export const subscriptionService = {
  getPlans: async (): Promise<Plan[]> => {
    const response = await api.get("/subscriptions/plans");
    return response.data;
  },

  createPlan: async (data: PlanCreate): Promise<Plan> => {
    const response = await api.post("/subscriptions/plans", data);
    return response.data;
  },

  getMySubscription: async (): Promise<Subscription | null> => {
    const response = await api.get("/subscriptions/me");
    return response.data;
  },

  subscribe: async (
    planId: number,
    billingCycle: "monthly" | "yearly" = "monthly",
  ): Promise<Subscription> => {
    const response = await api.post("/subscriptions/subscribe", null, {
      params: { plan_id: planId, billing_cycle: billingCycle },
    });
    return response.data;
  },

  cancelSubscription: async (
    immediate: boolean = false,
  ): Promise<Subscription> => {
    const response = await api.post("/subscriptions/cancel", null, {
      params: { immediate },
    });
    return response.data;
  },
};
