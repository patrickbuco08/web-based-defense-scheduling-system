import { useMutation, useQueryClient } from "@tanstack/react-query";
import { defensesApi } from "../api";
import { toast } from "sonner";

export const useCreateDefense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: defensesApi.createDefense,
    onSuccess: () => {
      // Invalidate and refetch the defenses list
      return queryClient.invalidateQueries({ 
        queryKey: ['defenses'],
        refetchType: 'active',
      });
    },
    onError: (error) => {
      console.error("Error creating defense:", error);
    },
  });
};
