// resources/js/features/defenses/api.ts
import { apiClient } from "@/lib/api-client";

interface CreateDefensePayload {
    title: string;
    presentation_type: string;
    group_id: string | number;
    date: string;
    start_time: string;
    end_time: string;
    notes?: string;
    panelists?: number[];
}

interface UpdateDefensePayload {
    title: string;
    presentation_type: string;
    group_id: string | number;
    room_id?: string | number;
    date: string;
    start_time: string;
    end_time: string;
    notes?: string;
    status: string;
    panelists?: number[];
}

export const defensesApi = {
    getDefenses: async () => {
        const response = await apiClient.get("/defenses");
        return response.data;
    },

    getDepartmentDefenses: async () => {
        const response = await apiClient.get("/defenses/departments");
        return response.data;
    },
    
    createDefense: async (data: CreateDefensePayload) => {
        const response = await apiClient.post("/defenses", {
            ...data,
            group_id: Number(data.group_id), // Ensure group_id is a number
            panelists: data.panelists || [],
            // Combine date and time for the API
            start_at: `${data.date} ${data.start_time}`,
            end_at: `${data.date} ${data.end_time}`,
        });
        return response.data;
    },

    updateDefense: async (id: number, data: UpdateDefensePayload) => {
        const response = await apiClient.put(`/defenses/${id}`, {
            ...data,
            group_id: Number(data.group_id),
            room_id: data.room_id ? Number(data.room_id) : null,
            panelists: data.panelists || [],
        });
        return response.data;
    },

    deleteDefense: async (id: number) => {
        const response = await apiClient.delete(`/defenses/${id}`);
        return response.data;
    },

    archiveDefense: async (id: number, archived: boolean) => {
        const response = await apiClient.patch(`/defenses/${id}/archive`, {
            archived,
        });
        return response.data;
    },

    getArchivedDefenses: async () => {
        const response = await apiClient.get("/defenses/archived");
        return response.data;
    },
};
