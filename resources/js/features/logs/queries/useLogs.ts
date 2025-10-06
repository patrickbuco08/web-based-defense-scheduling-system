import { useQuery } from "@tanstack/react-query";
import { logsApi, LogFilters } from "../api";

export function useLogs(filters: LogFilters, enabled: boolean = true) {
  return useQuery({
    queryKey: ["logs", filters],
    queryFn: () => logsApi.getLogs(filters),
    enabled,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: false,
  });
}
