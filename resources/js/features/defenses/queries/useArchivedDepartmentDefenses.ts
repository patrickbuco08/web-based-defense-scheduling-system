import { useQuery } from "@tanstack/react-query";
import { defensesApi } from "../api";

export function useArchivedDepartmentDefenses() {
  return useQuery({
    queryKey: ["defenses", "archived", "department"],
    queryFn: () => defensesApi.getArchivedDepartmentDefenses(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
