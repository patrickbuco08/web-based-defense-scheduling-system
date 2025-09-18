import { useQuery } from "@tanstack/react-query";
import { roomsApi } from "../api";

export function useRooms() {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: () => roomsApi.getRooms(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
