import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import React from "react";
import { Outlet } from "react-router-dom";
import { SiteHeader } from "@/components/ui/site-header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar variant="inset" />

      <SidebarInset>
        <SiteHeader />
        <main className="flex-1">
          {/* <SidebarTrigger /> */}
          {/* top bar / breadcrumbs here if needed */}
          <div className="p-4">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
