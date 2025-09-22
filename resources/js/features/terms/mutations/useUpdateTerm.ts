// resources/js/features/terms/mutations/useUpdateTerm.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { termsApi } from "../api";
import { TermInterface, TermPayload } from "../api";

export function useUpdateTerm() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: TermPayload }) =>
            termsApi.updateTerm(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["terms"] });
        },
        onError: (error: Error) => {
            console.error("Error updating term:", error);
        },
    });
}
