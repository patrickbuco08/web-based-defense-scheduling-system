// resources/js/features/rooms/api.ts
import { apiClient } from "@/lib/api-client";

const API_BASE_URL = "/rooms";

export const roomsApi = {
    getRooms: async () => {
        const response = await apiClient.get(API_BASE_URL);
        return response.data;
    },
    updateRoom: async (
        id: number,
        data: {
            room_number: string;
            building: string;
            is_active: boolean;
        }
    ) => {
        const response = await apiClient.put(`${API_BASE_URL}/${id}`, data);
        return response.data;
    },
    deleteRoom: async (id: number) => {
        const response = await apiClient.delete(`${API_BASE_URL}/${id}`);
        return response.data;
    },
};
