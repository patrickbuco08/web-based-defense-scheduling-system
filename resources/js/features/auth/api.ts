// resources/js/features/auth/api.ts
import { apiClient } from "@/lib/api-client";

export const authApi = {
  getCurrentUser: async () => {
    const response = await apiClient.get("/user");
    return response.data;
  },
  // Add other auth-related API calls here
};
