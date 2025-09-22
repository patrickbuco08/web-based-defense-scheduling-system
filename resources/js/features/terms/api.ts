import { apiClient } from "@/lib/api-client";

export type TermPayload = Pick<
    TermInterface,
    "school_year" | "semester" | "is_current"
>;

export interface TermInterface {
    id: number;
    school_year: string;
    semester: string;
    is_current: boolean;
    created_at: string;
    updated_at: string;
}

const API_BASE_URL = "/terms";

export const termsApi = {
    getTerms: async (): Promise<TermInterface[]> => {
        const response = await apiClient.get(API_BASE_URL);
        return response.data;
    },
    getActiveTerm: async (): Promise<TermInterface> => {
        const response = await apiClient.get(`${API_BASE_URL}/active`);
        return response.data;
    },
    createTerm: async (data: TermPayload) => {
        const response = await apiClient.post(API_BASE_URL, data);
        return response.data;
    },
    updateTerm: async (id: number, data: TermPayload) => {
        const response = await apiClient.put(`${API_BASE_URL}/${id}`, data);
        return response.data;
    },
    deleteTerm: async (id: number) => {
        const response = await apiClient.delete(`${API_BASE_URL}/${id}`);
        return response.data;
    },
};