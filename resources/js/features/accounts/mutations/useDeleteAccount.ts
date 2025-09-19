// resources/js/features/accounts/mutations/useDeleteAccount.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountsApi } from "../api";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface ErrorResponse {
  message?: string;
  error?: string;
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => accountsApi.deleteAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      toast.success("Account deleted successfully");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error("Error deleting account:", error);

      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to delete account. Please try again.";

      toast.error(errorMessage);
    },
  });
}
