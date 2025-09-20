import { useMutation, useQueryClient } from "@tanstack/react-query";
import { departmentsApi } from "../api";

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { code: string; name: string } }) =>
      departmentsApi.updateDepartment(id, data),
    onSuccess: () => {
      return queryClient.invalidateQueries({ 
        queryKey: ['departments'],
        refetchType: 'active',
      });
    },
    onError: (error) => {
      console.error("Error updating department:", error);
    },
  });
};