import { useMutation, useQueryClient } from "@tanstack/react-query";
import { defensesApi } from "../api";

export function useArchiveDefense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, archived }: { id: number; archived: boolean }) =>
      defensesApi.archiveDefense(id, archived),
    onSuccess: () => {
      // Invalidate both active and archived defenses queries
      queryClient.invalidateQueries({ queryKey: ["defenses"] });
      queryClient.invalidateQueries({ queryKey: ["defenses", "archived"] });
      queryClient.invalidateQueries({ queryKey: ["defenses", "department"] });
    },
  });
}
