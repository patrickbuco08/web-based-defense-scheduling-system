import { useMutation, useQueryClient } from "@tanstack/react-query";
import { defensesApi } from "../api";

interface UpdateDefensePayload {
    title: string;
    group_id: string | number;
    room_id?: string | number;
    date: string;
    start_time: string;
    end_time: string;
    notes?: string;
    status: string;
    panelists?: number[];
}

export function useUpdateDefense() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateDefensePayload }) =>
            defensesApi.updateDefense(id, data),
        onSuccess: () => {
            // Invalidate and refetch defense-related queries
            queryClient.invalidateQueries({ queryKey: ["defenses"] });
            queryClient.invalidateQueries({ queryKey: ["defenses", "department"] });
        },
    });
}
