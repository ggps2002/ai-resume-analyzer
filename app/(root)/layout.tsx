
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { SidebarProvider, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { cookies } from 'next/headers';
import { CustomTrigger } from '@/components/CustomSidebarTrigger';
import { ProfilePicture } from '@/components/ProfilePicture';


type LayoutProps = {
    children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = async ({ children }) => {
    const session = await auth();

    if (!session) redirect("/login");

    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"


    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <main className=' w-screen'>
                <header className='flex justify-between p-2 items-center shadow-lg bg-gray-200'>
                    <CustomTrigger />
                    <div className='rounded-full mr-4'>
                        <ProfilePicture />
                    </div>
                </header>
                {children}
            </main>
        </SidebarProvider>
    )
};

export default Layout;