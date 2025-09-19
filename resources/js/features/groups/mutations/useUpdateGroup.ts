import { useMutation, useQueryClient } from "@tanstack/react-query";
import { groupsApi, UpdateGroupData } from "../api";

export function useUpdateGroup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: { id: number; data: UpdateGroupData }) =>
            groupsApi.update(params.id, params.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["groups"] });
        },
        onError: (error: any) => {
            console.error("Error updating group:", error);
        },
    });
}
