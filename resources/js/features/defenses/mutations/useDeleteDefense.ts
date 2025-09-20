import { useMutation, useQueryClient } from "@tanstack/react-query";
import { defensesApi } from "../api";

export function useDeleteDefense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => defensesApi.deleteDefense(id),
    onSuccess: () => {
      // Invalidate defenses queries to refresh calendars/views
      queryClient.invalidateQueries({ queryKey: ["defenses"] });
      queryClient.invalidateQueries({ queryKey: ["defenses", "department"] });
    },
  });
}
