import React from "react";
import { AuthProvider } from "./AuthProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClientProvider } from "./QueryClientProvider";
import { SecurityProvider } from "./SecurityProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider>
      <AuthProvider>
        <SecurityProvider>
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
        </SecurityProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
