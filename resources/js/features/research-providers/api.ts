import { apiClient } from "@/lib/api-client";

export interface ResearchProvider {
  id: number;
  name: string;
  role: string;
  department: {
    id: number;
    name: string;
    code: string;
  } | null;
  created_at: string;
}

export interface CreateResearchProviderData {
  name: string;
  role: string;
  department_id: number;
}

export interface UpdateResearchProviderData {
  name?: string;
  role?: string;
  department_id?: number;
}

const API_BASE_URL = '/research-service-providers';

export const researchProvidersApi = {
  getResearchProviders: async () => {
    const response = await apiClient.get(API_BASE_URL);
    return response.data;
  },
  createResearchProvider: async (data: CreateResearchProviderData) => {
    const response = await apiClient.post(API_BASE_URL, data);
    return response.data;
  },
  updateResearchProvider: async (id: number, data: UpdateResearchProviderData) => {
    const response = await apiClient.put(`${API_BASE_URL}/${id}`, data);
    return response.data;
  },
  deleteResearchProvider: async (id: number) => {
    const response = await apiClient.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  },
};
