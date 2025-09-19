import { useMutation, useQueryClient } from "@tanstack/react-query";
import { groupsApi } from "../api";

export function useDeleteGroup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => groupsApi.deleteGroup(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["groups"] });
        },
        onError: (error: any) => {
            console.error("Error deleting group:", error);
        },
    });
}
