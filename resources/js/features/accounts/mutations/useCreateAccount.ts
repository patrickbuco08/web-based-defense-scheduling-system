import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountsApi } from "../api";
import { toast } from "sonner";

export interface CreateAccountData {
  name: string;
  email: string;
  roles: string[];
  department_id?: number | null;
  password: string;
  password_confirmation: string;
}

export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAccountData) => 
      accountsApi.createAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: (error: Error) => {
      console.error("Error creating account:", error);
    },
  });
}
