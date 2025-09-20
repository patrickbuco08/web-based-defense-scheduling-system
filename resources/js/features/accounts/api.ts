// resources/js/features/accounts/api.ts
import { apiClient } from "@/lib/api-client";

export interface AccountData {
  name: string;
  email: string;
  role: string;
  department_id?: number | null;
  password: string;
  password_confirmation: string;
}

const API_BASE_URL = '/accounts';

export const accountsApi = {
  getAccounts: async () => {
    const response = await apiClient.get(API_BASE_URL);
    return response.data;
  },
  updateAccount: async (
    id: number,
    data: {
      name?: string;
      email?: string;
      role?: string;
      department_id?: number | null;
    }
  ) => {
    const response = await apiClient.put(`${API_BASE_URL}/${id}`, data);
    return response.data;
  },
  deleteAccount: async (id: number) => {
    const response = await apiClient.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  },
  createAccount: async (data: AccountData) => {
    const response = await apiClient.post(API_BASE_URL, data);
    return response.data;
  },
};
