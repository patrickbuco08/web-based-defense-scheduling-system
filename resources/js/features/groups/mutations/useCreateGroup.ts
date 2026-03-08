import { useMutation, useQueryClient } from "@tanstack/react-query";
import { groupsApi } from "../api";
import { toast } from "sonner";

export interface CreateGroupData {
  department_ids: number[];
  term_id: string | number;
  critic_id?: string | number | null;
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
        critic_id: data.critic_id ? Number(data.critic_id) : null,
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
