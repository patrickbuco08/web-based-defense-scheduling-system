import { apiClient } from "@/lib/api-client";

export const criticsApi = {
    getCritics: async () => {
        const response = await apiClient.get("/critics");
        return response.data;
    },
};