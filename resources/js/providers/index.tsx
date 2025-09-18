import React from "react";
import { AuthProvider } from "./AuthProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClientProvider } from "./QueryClientProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider>
      <AuthProvider>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          {children}
        </SidebarProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
