import Image from 'next/image';
import React from 'react';


const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <main className=' lg:overflow-hidden lg:flex w-screen h-screen'>
            <section className='w-1/2 h-full relative hidden lg:block'>
                <Image
                    src="/images/auth_image.jpg" // Ensure the src starts with a leading slash
                    alt='auth_image'
                    layout="fill" // Use the fill layout mode
                    objectFit="cover" // Ensure the image covers the container
                />
            </section>
            <section className='lg:w-1/2 h-full w-full bg-blue-100 flex justify-center items-center'>
                <div>
                    {children}
                </div>
            </section>
        </main>
    );
};

export default Layout;