// resources/js/features/defenses/api.ts
import { apiClient } from "@/lib/api-client";

interface CreateDefensePayload {
    title: string;
    group_id: string | number;
    date: string;
    start_time: string;
    end_time: string;
    notes?: string;
}

export const defensesApi = {
    getDefenses: async () => {
        const response = await apiClient.get("/defenses");
        return response.data;
    },
    
    createDefense: async (data: CreateDefensePayload) => {
        const response = await apiClient.post("/defenses", {
            ...data,
            group_id: Number(data.group_id), // Ensure group_id is a number
            // Combine date and time for the API
            start_at: `${data.date} ${data.start_time}`,
            end_at: `${data.date} ${data.end_time}`,
        });
        return response.data;
    },
};
