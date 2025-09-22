import { useMutation, useQueryClient } from "@tanstack/react-query";
import { termsApi } from "../api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ErrorResponseInterface } from "@/features/types";

export function useDeleteTerm() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => termsApi.deleteTerm(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["terms"] });
            toast.success("Term deleted successfully");
        },
        onError: (error: AxiosError<ErrorResponseInterface>) => {
            console.error("Error deleting account:", error);

            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "Failed to delete term. Please try again.";

            toast.error(errorMessage);
        },
    });
}