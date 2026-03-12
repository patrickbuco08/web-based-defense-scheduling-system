import { useMutation, useQueryClient } from "@tanstack/react-query";
import { researchProvidersApi, UpdateResearchProviderData } from "../api";

export function useUpdateResearchProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateResearchProviderData }) =>
      researchProvidersApi.updateResearchProvider(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research-providers"] });
    },
    onError: (error: Error) => {
      console.error("Error updating research provider:", error);
    },
  });
}
