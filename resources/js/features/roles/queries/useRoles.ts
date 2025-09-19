import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { rolesApi } from "../api";

export function useRoles() {
  return useQuery({
    queryKey: ["roles"],
    queryFn: () => rolesApi.getRoles(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
