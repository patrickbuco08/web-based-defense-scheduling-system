import { useQuery } from "@tanstack/react-query";
import { defensesApi } from "../api";

export function useArchivedDefenses() {
  return useQuery({
    queryKey: ["defenses", "archived"],
    queryFn: () => defensesApi.getArchivedDefenses(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
