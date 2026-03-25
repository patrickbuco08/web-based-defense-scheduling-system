import { apiClient } from "@/lib/api-client";

export interface DashboardStats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    cancelled: number;
    panelists_assigned: number;
}

export interface DashboardDefense {
    id: number;
    title: string;
    status: string;
    start_at: string;
    end_at: string;
    formatted_date: string;
    formatted_time: string;
    group: {
        id: number;
        group_code: string;
        course_code: string;
    };
    room?: {
        id: number;
        room_number: string;
        building: string;
    };
}

export interface DashboardData {
    stats: DashboardStats;
    recent_defenses: DashboardDefense[];
}

export const dashboardApi = {
    getDashboardData: async (): Promise<DashboardData> => {
        const response = await apiClient.get("/dashboard");
        return response.data;
    },
    getCoordinatorDashboardData: async (): Promise<DashboardData> => {
        const response = await apiClient.get("/coordinator/dashboard");
        return response.data;
    },
};
