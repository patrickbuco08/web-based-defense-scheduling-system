// resources/js/features/reports/api.ts
import { apiClient } from "@/lib/api-client";

export interface ReportFilters {
  term?: string;
  department?: string;
  status?: string;
  room?: string;
  date_start?: string;
  date_end?: string;
  search?: string;
}

export interface DefenseReport {
  id: number;
  group_code: string;
  title: string;
  adviser: string;
  critic: string;
  panelists: string[];
  room: string;
  start_date_time: string;
  end_date_time: string;
  status: string;
  department: string;
  term: string;
}

export interface ReportResponse {
  data: DefenseReport[];
  meta: {
    total: number;
    filters: ReportFilters;
  };
}

export const reportsApi = {
  getReports: async (filters: ReportFilters): Promise<ReportResponse> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });

    const response = await apiClient.get(`/reports?${params.toString()}`);
    return response.data;
  },

  exportCsv: async (filters: ReportFilters): Promise<Blob> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });

    const response = await apiClient.get(`/reports/export/csv?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  exportXlsx: async (filters: ReportFilters): Promise<Blob> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });

    const response = await apiClient.get(`/reports/export/xlsx?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
