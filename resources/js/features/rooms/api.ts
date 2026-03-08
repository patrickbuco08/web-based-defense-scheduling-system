// resources/js/features/rooms/api.ts
import { apiClient } from "@/lib/api-client";

const API_BASE_URL = "/rooms";

export interface RoomDepartment {
  id: number;
  code: string;
  name: string;
}

export interface RoomData {
  id: number;
  room_number: string;
  building: string;
  is_active: boolean;
  department_ids: number[];
  departments: RoomDepartment[];
  created_at: string;
  updated_at: string;
}

export interface RoomPayload {
  room_number: string;
  building: string;
  is_active: boolean;
  department_ids: number[];
}

export const roomsApi = {
    getRooms: async (): Promise<RoomData[]> => {
        const response = await apiClient.get(API_BASE_URL);
        return response.data;
    },
    
    createRoom: async (data: RoomPayload): Promise<RoomData> => {
        const response = await apiClient.post(API_BASE_URL, data);
        return response.data.data;
    },
    updateRoom: async (
        id: number,
        data: RoomPayload
    ): Promise<RoomData> => {
        const response = await apiClient.put(`${API_BASE_URL}/${id}`, data);
        return response.data.data;
    },
    deleteRoom: async (id: number): Promise<{ success: boolean }> => {
        const response = await apiClient.delete(`${API_BASE_URL}/${id}`);
        return response.data;
    },
};
