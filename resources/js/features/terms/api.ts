import { apiClient } from "@/lib/api-client";

export const termsApi = {
    getActiveTerm: async () => {
        const response = await apiClient.get("/terms/active");
        return response.data;
    },
};