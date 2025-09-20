import { useQuery } from "@tanstack/react-query";
import { defensesApi } from "../api";

export function useDefenseDepartments() {
    return useQuery({
        queryKey: ["defenses", "department"],
        queryFn: () => defensesApi.getDepartmentDefenses(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
    });
}