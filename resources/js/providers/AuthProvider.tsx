import React from "react";
import { createContext } from "react";
import { useAuthUser } from "@/features/auth/queries/useAuthUser";

type AuthContextValue = {
  user: any;
  loading: boolean;
  error: unknown;
  refreshUser: () => Promise<any>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    data: user,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useAuthUser();

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: Boolean(isLoading || isFetching),
        error,
        refreshUser: refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
