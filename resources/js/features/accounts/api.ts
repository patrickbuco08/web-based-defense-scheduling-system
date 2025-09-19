// resources/js/features/accounts/api.ts
import { apiClient } from "@/lib/api-client";

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
};
