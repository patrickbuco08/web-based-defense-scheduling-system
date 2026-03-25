import { useMutation, useQueryClient } from "@tanstack/react-query";
import { groupsApi } from "../api";
import { toast } from "sonner";

export interface CreateGroupData {
  department_ids: number[];
  term_id: string | number;
  critic_id?: string | number | null;
  research_critic_id?: string | number | null;
  course_code?: string;
  members: Array<{ name: string }>;
}

export function useCreateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGroupData) => 
      groupsApi.create({
        ...data,
        department_ids: data.department_ids,
        term_id: Number(data.term_id),
        critic_id: data.critic_id !== undefined && data.critic_id !== null && data.critic_id !== '' ? Number(data.critic_id) : null,
        research_critic_id: data.research_critic_id !== undefined && data.research_critic_id !== null && data.research_critic_id !== '' ? Number(data.research_critic_id) : null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
    onError: (error: any) => {
      console.error("Error creating group:", error);
      throw error;
    },
  });
}
