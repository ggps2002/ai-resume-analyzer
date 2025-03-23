import { auth } from '@/auth';
import ResumeUpload from '@/components/ResumeUpload';
import { redirect } from 'next/navigation';
import React from 'react';

const Page: React.FC = async () => {
    const session = await auth();
     if (!session) redirect("/login");
    return (
        <div className='w-auto h-[90.222vh]'>
            <div className='flex flex-col items-center justify-center w-full h-1/4 px-4 text-white bg-cover bg-center' style={{ backgroundImage: "url('/images/cover_image.jpg')" }}>
                <h1 className='text-2xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-3xl font-semibold'>
                    Hello {session.user?.name?.split(' ')[0]}👋!!
                </h1>
                <p className='text-center text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl mt-4'>
                Job search has never been easier with AI at your disposal.
                </p>
            </div>
            <div className='flex-col lg:flex w-full h-3/4 p-4'>
                <div className='xs:w-full xs:h-1/2 lg:w-1/2 lg:min-h-full border border-gray-300 shadow-lg rounded-lg p-4'>
                    <ResumeUpload />
                </div>
                <div className='xs:w-full xs:f-1/2 lg:w-1/2 lg:max-h-full'>

                </div>
            </div>
        </div>
    );
};

export default Page;