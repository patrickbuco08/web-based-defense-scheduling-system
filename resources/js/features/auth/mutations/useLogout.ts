import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api";
import { toast } from "sonner";

// Update the logout mutation in NavUser component
export const useLogoutMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => authApi.logout(),
        onSuccess: () => {
            queryClient.clear();
            localStorage.removeItem('auth_token'); // Remove any stored tokens
            sessionStorage.clear(); // Clear session storage

            window.location.href = '/login';
        },
        onError: (error) => {
            console.error('Logout failed:', error);
            // You might want to show a toast notification here
            // toast.error('Failed to log out. Please try again.');
        },
    });
}