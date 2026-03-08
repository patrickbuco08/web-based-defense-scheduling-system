import { useQuery } from "@tanstack/react-query";
import { defensesApi } from "../api";

export function useArchivedAdminDefenses() {
  return useQuery({
    queryKey: ["defenses", "archived", "admin"],
    queryFn: () => defensesApi.getArchivedAdminDefenses(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
