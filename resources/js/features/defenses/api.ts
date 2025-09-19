// resources/js/features/rooms/api.ts
import { apiClient } from "@/lib/api-client";

export const defensesApi = {
    getDefenses: async () => {
        const response = await apiClient.get("/api/defenses");
        return response.data;
    },
};
