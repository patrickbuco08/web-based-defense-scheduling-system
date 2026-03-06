// resources/js/features/groups/api.ts
import { apiClient } from "@/lib/api-client";

export interface GroupMember {
  id: number;
  student_name: string;
}

export interface Group {
  id: number;
  department_id: number;
  term_id: number;
  group_code: string;
  course_code: string;
  adviser_id: number;
  critic_id: number | null;
  created_at: string;
  updated_at: string;
  department?: {
    id: number;
    name: string;
  };
  term?: {
    id: number;
    school_year: string;
    semester: string;
  };
  adviser?: {
    id: number;
    name: string;
    email: string;
  };
  critic?: {
    id: number;
    name: string;
    email: string;
  } | null;
  members?: GroupMember[];
}

export interface CreateGroupData {
  department_id: number;
  term_id: number;
  critic_id?: number | null;
  course_code?: string;
  members: Array<{ name: string; email?: string | null }>;
}

export interface UpdateGroupData {
  department_id?: number;
  term_id?: number;
  group_code?: string;
  critic_id?: number | null;
  members?: Array<{ name: string }>;
}

export const groupsApi = {
  getGroups: async (): Promise<Group[]> => {
    const response = await apiClient.get('/adviser/groups');
    return response.data;
  },
  create: async (data: CreateGroupData): Promise<Group> => {
    const response = await apiClient.post('/adviser/groups', data);
    return response.data;
  },
  update: async (id: number, data: UpdateGroupData): Promise<Group> => {
    const response = await apiClient.put(`/adviser/groups/${id}`, data);
    return response.data;
  },
  deleteGroup: async (id: number): Promise<void> => {
    await apiClient.delete(`/adviser/groups/${id}`);
  },
};
