import { useMutation, useQueryClient } from "@tanstack/react-query";
import { researchProvidersApi, CreateResearchProviderData } from "../api";

export function useCreateResearchProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateResearchProviderData) => 
      researchProvidersApi.createResearchProvider(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research-providers"] });
    },
    onError: (error: Error) => {
      console.error("Error creating research provider:", error);
    },
  });
}
