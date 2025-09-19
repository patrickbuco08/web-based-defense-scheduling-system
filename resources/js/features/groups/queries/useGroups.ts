import { useQuery } from "@tanstack/react-query";
import { groupsApi } from "../api";

export function useGroups() {
  return useQuery({
    queryKey: ["groups"],
    queryFn: () => groupsApi.getGroups(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
