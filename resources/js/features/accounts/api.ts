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

export const accountsApi = {
  getAccounts: async () => {
    const response = await apiClient.get('/admin/accounts');
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
    const response = await apiClient.put(`/admin/accounts/${id}`, data);
    return response.data;
  },
  deleteAccount: async (id: number) => {
    const response = await apiClient.delete(`/admin/accounts/${id}`);
    return response.data;
  },
  createAccount: async (data: AccountData) => {
    const response = await apiClient.post('/admin/accounts', data);
    return response.data;
  },
};
