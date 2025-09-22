import { useMutation, useQueryClient } from "@tanstack/react-query";
import { termsApi, TermPayload } from "../api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ErrorResponseInterface } from "@/features/types";

export function useCreateTerm() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: TermPayload) => termsApi.createTerm(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["terms"] });
            toast.success("Term created successfully");
        },
        onError: (error: AxiosError<ErrorResponseInterface>) => {
            console.error("Error creating term:", error);

            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "Failed to create term. Please try again.";

            toast.error(errorMessage);
        },
    });
}
