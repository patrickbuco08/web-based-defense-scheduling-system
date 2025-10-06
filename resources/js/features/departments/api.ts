import { apiClient } from "@/lib/api-client";

export interface Department {
  id: number;
  code: string;
  name: string;
  created_at: string;
}

export interface CreateDepartmentPayload {
  code: string;
  name: string;
}

export interface UpdateDepartmentPayload {
  code: string;
  name: string;
}

export const departmentsApi = {
  getDepartments: async (): Promise<Department[]> => {
    const response = await apiClient.get('/departments');
    return response.data;
  },

  createDepartment: async (data: CreateDepartmentPayload) => {
    const response = await apiClient.post('/departments', data);
    return response.data;
  },

  updateDepartment: async (id: number, data: UpdateDepartmentPayload) => {
    const response = await apiClient.put(`/departments/${id}`, data);
    return response.data;
  },

  deleteDepartment: async (id: number) => {
    const response = await apiClient.delete(`/departments/${id}`);
    return response.data;
  },
};