import { useQuery } from "@tanstack/react-query";
import { criticsApi } from "../api";

export function useCritics() {
  return useQuery({
    queryKey: ["critics"],
    queryFn: () => criticsApi.getCritics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
