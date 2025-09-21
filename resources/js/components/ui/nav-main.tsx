import React from "react";
import { type Icon } from "@tabler/icons-react";

import { DefenseProposal } from "@/components/DefenseProposal";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
    show?: boolean;
  }[];
}) {
  const { user } = useAuth();
  const location = useLocation();

  const isAdviser = user.roles.includes('admin');


  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            {isAdviser && <DefenseProposal />}
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={location.pathname === item.url}
                className={cn(
                  "w-full justify-start",
                  location.pathname === item.url && "bg-accent text-accent-foreground"
                )}
              >
                <Link to={item.url} className="flex items-center gap-2 w-full">
                  {item.icon && (
                    <item.icon
                      className={cn(
                        "size-4",
                        location.pathname === item.url ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                  )}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
