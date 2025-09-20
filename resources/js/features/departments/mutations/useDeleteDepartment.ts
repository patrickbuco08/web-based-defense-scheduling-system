import { useMutation, useQueryClient } from "@tanstack/react-query";
import { departmentsApi } from "../api";

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: departmentsApi.deleteDepartment,
    onSuccess: () => {
      return queryClient.invalidateQueries({ 
        queryKey: ['departments'],
        refetchType: 'active',
      });
    },
    onError: (error) => {
      console.error("Error deleting department:", error);
    },
  });
};