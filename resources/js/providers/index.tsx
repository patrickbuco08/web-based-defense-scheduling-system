import React from "react";
import { AuthProvider } from "./AuthProvider";
import { SidebarProvider } from "@/components/ui/sidebar";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SidebarProvider>{children}</SidebarProvider>
    </AuthProvider>
  );
}
