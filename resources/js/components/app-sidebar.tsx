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
  IconUsers,
  IconArchive
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

  const dashboard = {
    name: "Dashboard",
    url: "/app/dashboard",
    icon: IconInnerShadowTop,
  };

  const data = {
    navMain: [
      {
        title: "Propose schedule availability",
        url: "/app",
        icon: IconCalendarEvent,
      },
    ],
    adviser: [
      dashboard,
      {
        name: "Group Registration",
        url: "/app/adviser/groups",
        icon: IconUsers,
      },
      {
        name: "Archived Defenses",
        url: "/app/adviser/archived",
        icon: IconArchive,
      },
    ],
    coordinator: [
      {
        name: "Department Defense Calendar",
        url: "/app/coordinators/calendar",
        icon: IconCalendarMonth,
      },
      {
        name: "Archived Defenses",
        url: "/app/coordinators/archived",
        icon: IconArchive,
      },
      {
        name: "Reports",
        url: "/app/coordinators/reports",
        icon: IconFileDescription,
      },
      {
        name: "Activity Log",
        url: "/app/coordinators/logs",
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
        name: "Research Service Providers",
        url: "/app/admin/research-providers",
        icon: IconFileAi,
      },
      {
        name: "Manage Rooms",
        url: "/app/admin/rooms",
        icon: IconDoorEnter,
      },
      {
        name: "Manage Courses",
        url: "/app/admin/departments",
        icon: IconBuilding,
      },
      {
        name: "Manage Academic Year",
        url: "/app/admin/academic-year",
        icon: IconCalendarMonth,
      },
      {
        name: "Archived Defenses",
        url: "/app/admin/archived",
        icon: IconArchive,
      },
      {
        name: "Reports",
        url: "/app/admin/reports",
        icon: IconFileDescription,
      },
      {
        name: "Activity Log",
        url: "/app/admin/logs",
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
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser user={user} /> */}
      </SidebarFooter>
    </Sidebar>
  );
}
