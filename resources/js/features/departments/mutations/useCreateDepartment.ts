import { useMutation, useQueryClient } from "@tanstack/react-query";
import { departmentsApi } from "../api";

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: departmentsApi.createDepartment,
    onSuccess: () => {
      return queryClient.invalidateQueries({ 
        queryKey: ['departments'],
        refetchType: 'active',
      });
    },
    onError: (error) => {
      console.error("Error creating department:", error);
    },
  });
};