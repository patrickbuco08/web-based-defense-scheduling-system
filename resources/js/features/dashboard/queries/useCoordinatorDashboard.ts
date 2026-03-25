import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api";

export function useCoordinatorDashboard() {
    return useQuery({
        queryKey: ["coordinator-dashboard"],
        queryFn: () => dashboardApi.getCoordinatorDashboardData(),
        staleTime: 30 * 1000,
        refetchOnWindowFocus: false,
    });
}
