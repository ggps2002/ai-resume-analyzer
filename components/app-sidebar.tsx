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
} from "@/components/ui/menusidebar"
import { useEffect, useState } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"

// Menu items.
const items = [
    {
        title: "Home",
        url: "/",
        icon: Home
    },
    {
        title: "Generate Cover Letter",
        url: "/GenerateCoverLetter",
        icon: FileText,
    },
    {
        title: "Interview Prep",
        url: "#",
        icon: User,
    },
    {
        title: "Job Recommendations",
        url: "/JobRecommendations",
        icon: Search,
    },
]

export function AppSidebar() {
    const pathname = usePathname()
    const [isActive, setIsActive] = useState("")
    const { isMobile } = useSidebar()

    useEffect(() => {
        setIsActive(pathname)
    }, [pathname])


    return (
        <Sidebar collapsible={isMobile ? "icon" : "none"} className="h-screen border-r-2 bg-gray-50">
            <SidebarHeader>
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
                                    <SidebarMenuButton asChild isActive={isActive === item.url} onClick={() => setIsActive(item.url)}>
                                        <a href={item.url} className={`sidebar-link ${isActive === item.url ? 'bg-blue-500' : ''}`} style={{ textDecoration: "none" }}>
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