// resources/js/features/rooms/mutations/useDeleteRoom.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { roomsApi } from "../api";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface ErrorResponse {
    message?: string;
    error?: string;
    // Add other possible error response fields
}

export function useDeleteRoom() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => roomsApi.deleteRoom(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rooms"] });
            toast.success("Room deleted successfully");
        },
        onError: (error: Error) => {
            console.error("Error deleting room:", error);

            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "Failed to delete room. Please try again.";

            toast.error(errorMessage);
        },
    });
}