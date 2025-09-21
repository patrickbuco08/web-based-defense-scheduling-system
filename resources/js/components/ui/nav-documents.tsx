import React from "react";

import {
  IconDots,
  IconFolder,
  IconShare3,
  IconTrash,
  type Icon,
} from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"

export function NavDocuments({
  title,
  items,
}: {
  title: string
  items: {
    name: string
    url: string
    icon: Icon
  }[]
}) {
  const location = useLocation()
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname === item.url}
              className={cn(
                "w-full justify-start",
                location.pathname === item.url && "bg-accent text-accent-foreground"
              )}
            >
              <Link to={item.url}>
                <item.icon className={cn(
                  "mr-2 h-4 w-4",
                  location.pathname === item.url ? "text-primary" : "text-muted-foreground"
                )} />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}

      </SidebarMenu>
    </SidebarGroup>
  )
}
