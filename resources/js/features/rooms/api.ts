// resources/js/features/rooms/api.ts
import { apiClient } from "@/lib/api-client";

export const roomsApi = {
    getRooms: async () => {
        const response = await apiClient.get("/admin/rooms");
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
        const response = await apiClient.put(`/admin/rooms/${id}`, data);
        return response.data;
    },
};
