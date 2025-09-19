import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { SiteHeader } from "@/components/ui/site-header";

export default function AppLayout() {
  return (
    <div className="w-full flex min-h-screen">
      <AppSidebar variant="inset" />

      <SidebarInset>
        <SiteHeader />
        <main className="flex flex-1 flex-col">
          <Outlet />
        </main>
      </SidebarInset>
    </div>
  );
}
