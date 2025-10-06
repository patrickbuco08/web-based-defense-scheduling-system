import { useQuery } from "@tanstack/react-query";
import { reportsApi, ReportFilters } from "../api";

export function useReports(filters: ReportFilters, enabled: boolean = true) {
  return useQuery({
    queryKey: ["reports", filters],
    queryFn: () => reportsApi.getReports(filters),
    enabled,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: false,
  });
}
