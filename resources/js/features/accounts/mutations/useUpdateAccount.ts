// resources/js/features/accounts/mutations/useUpdateAccount.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountsApi } from "../api";
import { toast } from "sonner";

export interface AccountUpdateData {
  name?: string;
  email?: string;
  role?: string;
  department_id?: number | null;
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: number } & AccountUpdateData) => 
      accountsApi.updateAccount(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: (error: Error) => {
      console.error("Error updating account:", error);
    },
  });
}
