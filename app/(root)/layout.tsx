
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { SidebarProvider, SidebarTrigger, useSidebar } from '@/components/ui/menusidebar';
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
        <main className='lg:overflow-hidden w-screen h-screen'>
            <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <header className="w-full  mx-auto flex flex-col">
                <div className='flex justify-between p-2 items-center border-b-2'>
                    <CustomTrigger />
                    <div className='rounded-full mr-4'>
                        <ProfilePicture />
                    </div>
                </div>
                {children}
            </header>
        </SidebarProvider>
        </main>
    )
};

export default Layout;