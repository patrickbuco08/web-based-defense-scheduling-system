import { useQuery } from "@tanstack/react-query";
import { departmentsApi } from "../api";

export function useDepartments() {
  return useQuery({
    queryKey: ["departments"],
    queryFn: () => departmentsApi.getDepartments(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
