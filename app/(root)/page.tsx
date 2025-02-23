import { auth } from '@/auth';
import ResumeUpload from '@/components/ResumeUpload';
import { redirect } from 'next/navigation';
import React from 'react';

const Page: React.FC = async () => {
    const session = await auth();
     if (!session) redirect("/login");
    return (
        <div className='w-auto h-[90.222vh]'>
            <div className='flex-col justify-center w-full h-1/4 px-4 text-white bg-cover bg-center' style={{ backgroundImage: "url('/images/cover_image.jpg')" }}>
            <h1 className='text-2xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-3xl font-semibold'>
                    Welcome {session.user?.name?.split(' ')[0]}👋!!
                </h1>
                <p className='text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl mt-4'>
                    Job search has never been more easier before with AI at your disposal.
                </p>
            </div>
            <div className='flex w-full h-3/4 p-4'>
                <div className='w-1/2 h-full bg-white border border-gray-100 shadow-lg rounded-lg p-4'>
                    <ResumeUpload />
                </div>
                <div className='w-1/2 h-full'>

                </div>
            </div>
        </div>
    );
};

export default Page;