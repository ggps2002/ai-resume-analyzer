'use client'

import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import { text } from "stream/consumers"

// Menu items.
const items = [
  {
    title: "Generate Cover Letter",
    url: "#",
    icon: Home,
  },
  {
    title: "Interview Prep",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Job Recommendations",
    url: "#",
    icon: Calendar,
  },
]

export function AppSidebar() {
    const [isActive, setIsActive] = useState("")
    const {
        isMobile
      } = useSidebar()
  return (
    <Sidebar collapsible={isMobile ? "icon" : "none"} className="shadow-lg h-screen">
    <SidebarHeader >
        <h1 className="sidebar-logo">Resume</h1>
    </SidebarHeader>
    <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[18px] leading-[22px] text-[#00214F]">Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive === item.title} onClick={() => setIsActive(item.title)} >
                    <a href={item.url} className="sidebar-link" style={{ textDecoration: "none" }}>
                      <item.icon />
                      <span className="sidebar-label">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
