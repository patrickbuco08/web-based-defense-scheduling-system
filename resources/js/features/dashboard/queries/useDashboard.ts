import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api";

export function useDashboard() {
    return useQuery({
        queryKey: ["dashboard"],
        queryFn: () => dashboardApi.getDashboardData(),
        staleTime: 30 * 1000,
        refetchOnWindowFocus: false,
    });
}
