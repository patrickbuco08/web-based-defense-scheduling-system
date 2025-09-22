import { useQuery } from "@tanstack/react-query";
import { termsApi } from "../api";

export function useTerms() {
    return useQuery({
        queryKey: ["terms"],
        queryFn: () => termsApi.getTerms(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
    });
}