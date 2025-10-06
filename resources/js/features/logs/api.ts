// resources/js/features/logs/api.ts
import { apiClient } from "@/lib/api-client";

export interface LogFilters {
  date_start?: string;
  date_end?: string;
  action?: string;
  department?: string;
  search?: string;
}

export interface ActivityLog {
  id: number;
  log_name: string;
  description: string;
  subject_type: string | null;
  subject_id: number | null;
  causer_type: string | null;
  causer_id: number | null;
  properties: {
    status_from?: string | null;
    status_to?: string;
    room_id?: number;
    start_at?: string;
    end_at?: string;
    panelists?: string[];
    action?: string;
    reason?: string;
    group_id?: number;
    term_id?: number;
  };
  summary: string;
  created_at: string;
  updated_at: string;
  causer?: {
    id: number;
    name: string;
    email: string;
    department?: {
      id: number;
      name: string;
    };
  };
  subject?: {
    id: number;
    title?: string;
    group?: {
      id: number;
      group_code: string;
    };
  };
}

export interface LogResponse {
  data: ActivityLog[];
  meta: {
    total: number;
    filters: LogFilters;
  };
}

export const logsApi = {
  getLogs: async (filters: LogFilters): Promise<LogResponse> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });

    const response = await apiClient.get(`/logs?${params.toString()}`);
    return response.data;
  },

  exportCsv: async (filters: LogFilters): Promise<Blob> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });

    const response = await apiClient.get(`/logs/export/csv?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  exportXlsx: async (filters: LogFilters): Promise<Blob> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });

    const response = await apiClient.get(`/logs/export/xlsx?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
