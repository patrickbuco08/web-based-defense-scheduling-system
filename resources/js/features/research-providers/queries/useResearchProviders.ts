import { useQuery } from "@tanstack/react-query";
import { researchProvidersApi, ResearchProvider } from "../api";

export function useResearchProviders() {
    return useQuery<ResearchProvider[]>({
        queryKey: ['research-providers'],
        queryFn: () => researchProvidersApi.getResearchProviders(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
    });
}
