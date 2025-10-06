import {
  IconBuilding,
  IconCalendarEvent,
  IconCalendarMonth,
  IconCamera,
  IconDoorEnter,
  IconFileAi,
  IconFileDescription,
  IconInnerShadowTop,
  IconSettings,
  IconUsers
} from "@tabler/icons-react";
import * as React from "react";

import { NavDocuments } from "@/components/ui/nav-documents";
import { NavMain } from "@/components/ui/nav-main";
import { NavSecondary } from "@/components/ui/nav-secondary";
import { NavUser } from "@/components/ui/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  const data = {
    navMain: [
      {
        title: "My Defense Schedules",
        url: "/app",
        icon: IconCalendarEvent,
      },
    ],
    adviser: [
      {
        name: "Group Registration",
        url: "/app/adviser/groups",
        icon: IconUsers,
      },
    ],
    coordinator: [
      {
        name: "Department Defense Calendar",
        url: "/app/coordinators/calendar",
        icon: IconCalendarMonth,
      },
      {
        name: "Reports",
        url: "/app/coordinators/reports",
        icon: IconFileDescription,
      },
    ],
    admin: [
      {
        name: "Accounts",
        url: "/app/admin/accounts",
        icon: IconUsers,
      },
      {
        name: "Manage Rooms",
        url: "/app/admin/rooms",
        icon: IconDoorEnter,
      },
      {
        name: "Manage Departments",
        url: "/app/admin/departments",
        icon: IconBuilding,
      },
      {
        name: "Manage Terms",
        url: "/app/admin/terms",
        icon: IconCalendarMonth,
      },
      {
        name: "Reports",
        url: "/app/admin/reports",
        icon: IconFileDescription,
      },
    ],
    navClouds: [
      {
        title: "Capture",
        icon: IconCamera,
        isActive: true,
        url: "#",
        items: [
          {
            title: "Active Proposals",
            url: "#",
          },
          {
            title: "Archived",
            url: "#",
          },
        ],
      },
      {
        title: "Proposal",
        icon: IconFileDescription,
        url: "#",
        items: [
          {
            title: "Active Proposals",
            url: "#",
          },
          {
            title: "Archived",
            url: "#",
          },
        ],
      },
      {
        title: "Prompts",
        icon: IconFileAi,
        url: "#",
        items: [
          {
            title: "Active Proposals",
            url: "#",
          },
          {
            title: "Archived",
            url: "#",
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: "Settings",
        url: "#",
        icon: IconSettings,
      },
    ],
  };

  const isAdviser = user.roles.includes('adviser');

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/app" className="flex items-center gap-2">
                <img
                  src="/images/cct-logo.png"
                  alt="CCT Logo"
                  className="h-8 w-auto"
                />
                <span className="text-base font-semibold">
                  CCT Defense Scheduling
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {isAdviser && <NavMain items={data.navMain} />}
        {user.roles.includes('adviser') && <NavDocuments title="Adviser" items={data.adviser} />}
        {user.roles.includes('coordinator') && <NavDocuments title="Coordinator" items={data.coordinator} />}
        {user.roles.includes('admin') && <NavDocuments title="Admin" items={data.admin} />}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
