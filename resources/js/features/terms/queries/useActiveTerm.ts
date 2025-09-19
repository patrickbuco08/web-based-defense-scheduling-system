import { useQuery } from "@tanstack/react-query";
import { termsApi } from "../api";

export function useActiveTerm() {
    return useQuery({
        queryKey: ["active-term"],
        queryFn: () => termsApi.getActiveTerm(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
    });
}