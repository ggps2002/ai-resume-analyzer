'use client'

import { Calendar, Home, MonitorPlay, User, Search, Settings, FileText } from "lucide-react"

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
import Image from "next/image"

// Menu items.
const items = [
    {
        title: "Generate Cover Letter",
        url: "#",
        icon: FileText,
    },
    {
        title: "Interview Prep",
        url: "#",
        icon: User,
    },
    {
        title: "Job Recommendations",
        url: "#",
        icon: Search,
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
                <div className="flex items-center justify-center m-2">
                <Image src="/images/logo.png" alt="logo" height={30} width={30} />
                <h1 className="sidebar-logo ml-1">Resume</h1>
                </div>
            </SidebarHeader>

            <SidebarSeparator />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-[18px] mb-4 font-bold leading-[22px] text-[#00214F]">
                        Application
                    </SidebarGroupLabel>
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
