import api from "./api";

export const logActivity = async (action: string, details?: string) => {
  try {
    await api.post("/analytics/events", {
      event_type: action,
      event_data: details ? { details } : {},
    });
  } catch (error) {
    console.error("Failed to log activity", error);
  }
};
