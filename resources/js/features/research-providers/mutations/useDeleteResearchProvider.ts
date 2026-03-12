import { useMutation, useQueryClient } from "@tanstack/react-query";
import { researchProvidersApi } from "../api";

export function useDeleteResearchProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => researchProvidersApi.deleteResearchProvider(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research-providers"] });
    },
    onError: (error: Error) => {
      console.error("Error deleting research provider:", error);
    },
  });
}
