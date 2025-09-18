import * as React from "react";
import {
  QueryClient,
  QueryClientProvider as TanstackProvider,
} from "@tanstack/react-query";

// Create a single query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export function QueryClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TanstackProvider client={queryClient}>
      {children}
      {/* Remove this line if you don't want devtools */}
    </TanstackProvider>
  );
}
