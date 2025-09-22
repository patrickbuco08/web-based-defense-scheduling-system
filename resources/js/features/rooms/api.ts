// resources/js/features/rooms/api.ts
import { apiClient } from "@/lib/api-client";

const API_BASE_URL = "/rooms";

export interface RoomData {
  id: number;
  room_number: string;
  building: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const roomsApi = {
    getRooms: async (): Promise<RoomData[]> => {
        const response = await apiClient.get(API_BASE_URL);
        return response.data;
    },
    
    createRoom: async (data: { room_number: string; building: string; is_active: boolean }): Promise<RoomData> => {
        const response = await apiClient.post(API_BASE_URL, data);
        return response.data;
    },
    updateRoom: async (
        id: number,
        data: {
            room_number: string;
            building: string;
            is_active: boolean;
        }
    ): Promise<RoomData> => {
        const response = await apiClient.put(`${API_BASE_URL}/${id}`, data);
        return response.data;
    },
    deleteRoom: async (id: number): Promise<{ success: boolean }> => {
        const response = await apiClient.delete(`${API_BASE_URL}/${id}`);
        return response.data;
    },
};
