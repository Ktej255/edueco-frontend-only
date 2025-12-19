import api from "@/lib/api";

export interface BundleCourseInfo {
  id: number;
  title: string;
  price: number;
}

export interface Bundle {
  id: number;
  title: string;
  slug: string;
  description?: string;
  price: number;
  original_price: number;
  discount_percentage: number;
  thumbnail_url?: string;
  is_published: boolean;
  total_enrollments: number;
  courses: BundleCourseInfo[];
  savings?: number;
  course_count?: number;
}

export interface BundleCreate {
  title: string;
  description: string;
  course_ids: number[];
  discount_percentage: number;
  slug?: string;
  thumbnail_url?: string;
  is_published?: boolean;
}

export const bundleService = {
  createBundle: async (data: BundleCreate): Promise<Bundle> => {
    const response = await api.post("/bundles/", data);
    return response.data;
  },

  getBundle: async (id: number): Promise<Bundle> => {
    const response = await api.get(`/bundles/${id}`);
    return response.data;
  },

  enrollInBundle: async (
    bundleId: number,
    paymentId: string,
    amount: number,
  ): Promise<{ message: string; enrollment_id: number }> => {
    const response = await api.post(`/bundles/${bundleId}/enroll`, null, {
      params: { payment_id: paymentId, amount },
    });
    return response.data;
  },

  getFeaturedBundles: async (limit: number = 10): Promise<Bundle[]> => {
    const response = await api.get("/bundles/featured", { params: { limit } });
    return response.data;
  },
};
