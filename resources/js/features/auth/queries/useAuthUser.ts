// resources/js/features/auth/queries/useAuthUser.ts
import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api";

export const useAuthUser = () => {
  return useQuery({
    queryKey: ["auth", "user"],
    queryFn: () => authApi.getCurrentUser(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};
