import { auth } from '@/auth';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React from 'react';


const Layout: React.FC<{ children: React.ReactNode }> = async ({ children }) => {
    const session = await auth()
    if (session) redirect("/")
    return (
        <main className=' lg:overflow-hidden lg:flex w-screen h-screen'>
            <section className='w-1/2 h-full relative hidden lg:block'>
                <Image
                    src="/images/cover_image.jpg" // Ensure the src starts with a leading slash
                    alt='auth_image'
                    layout="fill" // Use the fill layout mode
                    objectFit="cover" // Ensure the image covers the container
                />
            </section>
            <section className='lg:w-1/2 h-full w-full p-8 '>
            <div className='flex'>
            <Image src="/images/logo.png" alt="logo" height={30} width={30} />
            <h1 className="sidebar-logo ml-1">Resume</h1>
            </div>
                <div className='flex justify-center items-center h-full w-full'>
                    {children}
                </div>
            </section>
        </main>
    );
};

export default Layout;