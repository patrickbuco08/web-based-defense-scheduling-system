import { useQuery } from "@tanstack/react-query";
import { defensesApi } from "../api";

export function useDefenses() {
  return useQuery({
    queryKey: ["defenses"],
    queryFn: () => defensesApi.getDefenses(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
