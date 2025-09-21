import { useQuery } from "@tanstack/react-query";
import { accountsApi } from "../api";

export interface User {
    id: number;
    department_id: number;

    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

export function useAccountByDepartments() {
    return useQuery<User[]>({
        queryKey: ['accounts'],
        queryFn: () => accountsApi.getAccountsByDepartment(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
    });
}
