'use client'

import React, { useState } from 'react'
import NavigateBetweenResumes from './NavigateBetweenResumes'
import { Button } from './ui/button'
import Image from 'next/image'
import { BookmarkCheck, Check, ExternalLink, Loader2, SlidersHorizontal } from 'lucide-react'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'
import { searchJobs } from '@/lib/actions/job'
import { Badge } from './ui/badge'
import { saveJobs } from '@/lib/actions/database'
import { toast } from 'sonner'

interface BookmarkProps {
    jobId: string,
    isBookmarked: boolean
}

function JobRecommendations({ handleToggle, jobSearchParams }: { handleToggle: () => void, jobSearchParams: Filters }) {
    const [queryString, setQueryString] = useState<string>("");
    const [jobBookmarked, setJobBookmarked] = useState<Array<BookmarkProps>>([]);
    const [jobPostData, setJobPostData] = useState<Array<any>>([]);
    const [seacrhing, setSearching] = useState<boolean>(false);
    const [selectedProfile, setSelectedProfile] = useState<string>("");
    function handleQueryString(query: string, profileId: string) {
        setQueryString(query);
        setSelectedProfile(profileId);
    }

    const handleJobSearch = async () => {
        setSearching(true);
        const jobPostData = await searchJobs(jobSearchParams, queryString);
        setJobPostData(jobPostData);
        setSearching(false);
        jobPostData.forEach((job: { id: any }) => {
            setJobBookmarked(jobBookmarked => [...jobBookmarked, { jobId: job.id, isBookmarked: false }]);
        });
    }

    const handleBookmark = (jobId: string) => {
        setJobBookmarked(jobBookmarked.map((job) => {
            if (job.jobId === jobId) {
                return {
                    ...job,
                    isBookmarked: !job.isBookmarked
                }
            }
            return job;
        }));
    }

    const handleSaveJob = async (profileId: string, job: any) => {
        const { organization_logo, title, organization, date_posted, date_validthrough, url } = job;
        const data = {
            logo: organization_logo,
            title,
            company: organization,
            posted: date_posted,
            valid: date_validthrough,
            url
        }
        try {
            await saveJobs(profileId, data);
        } catch (error) {
            console.error(error);
            toast.error(
                "Error while saving the job!",
            );
        }
        toast.success(
            "Job saved successfully!",
        );
    }
    return (
        <div className='h-full w-full border-black-1'>
            <div className='flex justify-end items-center gap-2 p-2'>
                <Button onClick={handleToggle} className='lg:hidden'><SlidersHorizontal /> Filters</Button>
                {!seacrhing ? <Button className='bg-blue-500 hover:bg-blue-400' onClick={handleJobSearch}>Search Jobs</Button> : <Button className='bg-blue-400' disabled>
                    <Loader2 className="animate-spin" />
                    Searching
                </Button>}
                <NavigateBetweenResumes handleQueryString={handleQueryString} />
            </div>
            <div className='overflow-y-scroll p-2 flex flex-col gap-2 h-[78vh]'>
                {
                    jobPostData.length > 0 ? (
                        <>
                            {jobPostData.map((job) => (
                                <div key={job.id} className='p-4 border-2 ml-2 rounded-md'>
                                    <div className='flex gap-2 justify-between items-start'>
                                        <div className='flex justify-center items-center'>
                                            <Image
                                                src={job.organization_logo}
                                                height={30}
                                                width={30}
                                                alt='logo'
                                            />
                                            <h2 className='text-xl font-semibold ml-2'>{job.title}</h2>
                                        </div>
                                        <div className='flex gap-2'>
                                            {jobBookmarked.filter(jobB => jobB.jobId === job.id)[0].isBookmarked ? (<div className='flex justify-center items-center mr-2'>
                                                <Badge className=' rounded-lg flex justify-center items-center' variant="outline">
                                                    <Check size={17} />
                                                    <p className='ml-1'>Saved</p>
                                                </Badge>
                                            </div>) : (<Button variant="outline" onClick={() => {
                                                handleSaveJob(selectedProfile, job);
                                                handleBookmark(job.id);
                                            }}>
                                                <BookmarkCheck />Save
                                            </Button>)}
                                            <Sheet>
                                                <SheetTrigger asChild>
                                                    <Button className='bg-blue-500 hover:bg-blue-400'>View</Button>
                                                </SheetTrigger>
                                                <SheetContent style={{ height: "100vh" }}>
                                                    <SheetHeader>
                                                        <SheetTitle>Job Details</SheetTitle>
                                                        <SheetDescription>
                                                            Review the details carefully and click the &apos;Apply&apos; button below to be redirected to the LinkedIn job posting.
                                                        </SheetDescription>
                                                    </SheetHeader>
                                                    <div className=" max-w-lg h-[77%] py-4 my-[2vh] mx-auto overflow-y-scroll">
                                                        {/* Company Logo */}
                                                        <div className="flex items-center space-x-4">
                                                            {/* {job.organization_logo && (
                                                <img
                                                    // src={job.organization_logo}
                                                    // alt={`${job.organization} logo`}
                                                    className="w-16 h-16 rounded-full"
                                                />
                                            )} */}
                                                            <Image
                                                                src={job.organization_logo}
                                                                height={50}
                                                                width={50}
                                                                alt='logo'
                                                            />
                                                            <div>
                                                                <h2 className="text-xl font-semibold">
                                                                    {job.title}
                                                                </h2>
                                                                <a
                                                                    href={job.linkedin_org_url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-500 hover:underline cursor-pointer"
                                                                >
                                                                    {job.organization}
                                                                </a>
                                                            </div>
                                                        </div>

                                                        {/* Job Details */}
                                                        <div className="mt-4 text-gray-600">
                                                            <p>
                                                                <strong>Location:</strong> {job.locations_derived[0] || "Not specified"}{" "}
                                                            </p>
                                                            <p>
                                                                <strong>Employment Type:</strong> {job.employment_type[0]}
                                                            </p>
                                                            <p>
                                                                <strong>Posted on:</strong> {new Date(job.date_posted).toDateString()}
                                                            </p>
                                                            <p>
                                                                <strong>Deadline:</strong> {new Date(job.date_validthrough).toDateString()}
                                                            </p>
                                                        </div>
                                                        <strong className='mt-4 text-gray-700'>Organization Description: </strong>
                                                        {/* Shortened Description */}
                                                        <p className=" text-sm text-gray-700">
                                                            {job.linkedin_org_description}
                                                        </p>
                                                        {/* Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae mollitia, tenetur error expedita, suscipit temporibus odio eligendi voluptatibus modi id magnam totam similique, quibusdam ea. Provident voluptatem cum vel, ea natus voluptatibus consequuntur dolores vero perferendis incidunt unde. Excepturi eius nobis fugiat eveniet esse? Velit deserunt perspiciatis quas omnis dolorum reprehenderit, alias repellat? Unde quasi placeat corporis fuga amet. Ipsa dolorum ducimus delectus consequuntur mollitia maiores et numquam illum, molestias maxime deleniti tempore! Vitae quisquam voluptatem vel ullam est ducimus deleniti dicta, quam, eligendi quae veritatis doloremque. Iste placeat provident laboriosam nihil architecto, odit sed assumenda vitae quia maiores illo ex ratione et magnam autem adipisci atque amet nemo nam. At laboriosam corrupti fuga doloremque unde voluptatibus earum in hic magnam ducimus! Dicta quod assumenda ex quos sapiente, inventore, corporis impedit, temporibus nostrum architecto ad est sit perspiciatis explicabo. Placeat, quae magni. Commodi animi enim odio pariatur blanditiis et facere maiores quas, non, fugit magnam. Deleniti aperiam suscipit in qui quisquam dolore aut explicabo quaerat necessitatibus maxime repellendus fugit corrupti nihil eum quasi commodi nisi fuga molestias alias eius laboriosam beatae, dolor vitae impedit! Incidunt, eum quasi alias fugit culpa itaque, fuga laboriosam doloribus harum, nam praesentium cum fugiat ea?
                                                        </p>
                                                        <strong className='mt-4 text-gray-700'>Shortened Job Responsibilties: </strong>
                                                        {/* Shortened Description */}
                                                        {/* <p className=" text-sm text-gray-700"> */}
                                                        {/* {job.linkedin_org_description.slice(0, 200)}... */}
                                                        {/* Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae mollitia, tenetur error expedita, suscipit temporibus odio eligendi voluptatibus modi id magnam totam similique, quibusdam ea. Provident voluptatem cum vel, ea natus voluptatibus consequuntur dolores vero perferendis incidunt unde. Excepturi eius nobis fugiat eveniet esse? Velit deserunt perspiciatis quas omnis dolorum reprehenderit, alias repellat? Unde quasi placeat corporis fuga amet. Ipsa dolorum ducimus delectus consequuntur mollitia maiores et numquam illum, molestias maxime deleniti tempore! Vitae quisquam voluptatem vel ullam est ducimus deleniti dicta, quam, eligendi quae veritatis doloremque. Iste placeat provident laboriosam nihil architecto, odit sed assumenda vitae quia maiores illo ex ratione et magnam autem adipisci atque amet nemo nam. At laboriosam corrupti fuga doloremque unde voluptatibus earum in hic magnam ducimus! Dicta quod assumenda ex quos sapiente, inventore, corporis impedit, temporibus nostrum architecto ad est sit perspiciatis explicabo. Placeat, quae magni. Commodi animi enim odio pariatur blanditiis et facere maiores quas, non, fugit magnam. Deleniti aperiam suscipit in qui quisquam dolore aut explicabo quaerat necessitatibus maxime repellendus fugit corrupti nihil eum quasi commodi nisi fuga molestias alias eius laboriosam beatae, dolor vitae impedit! Incidunt, eum quasi alias fugit culpa itaque, fuga laboriosam doloribus harum, nam praesentium cum fugiat ea? */}
                                                        {/* </p> */}
                                                        {/* <div className='mt-4 text-gray-700'>
                                                            <strong>
                                                                Key Skills:
                                                            </strong>
                                                            <br />
                                                            <div className='flex gap-2 flex-wrap p-2'>
                                                                {
                                                                    ["NLP", "Python", "AWS", "Computer Vision"].map((skill) => (

                                                                        <div key={skill} className='bg-gray-200 p-2 rounded-md text-sm'>{skill}</div>
                                                                    ))
                                                                }
                                                            </div>
                                                        </div> */}
                                                    </div>
                                                    <SheetFooter>
                                                        <SheetClose asChild>
                                                            <a href={job.url} target="_blank"><Button className='bg-blue-500 hover:bg-blue-400 '><ExternalLink />Apply</Button></a>
                                                        </SheetClose>
                                                    </SheetFooter>
                                                </SheetContent>
                                            </Sheet>
                                        </div>
                                    </div>
                                    <p className='mt-4'>
                                        <span className='font-medium'>Company:</span> {job.organization}
                                    </p>
                                    <div className='lg:flex justify-between'>
                                        <p>
                                            <span className='font-medium'>Industry:</span> {job.linkedin_org_industry}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className='w-full h-full flex justify-center items-center'>
                            <div className='text-center'>
                                <div className='flex w-full justify-center items-center'>
                                    <Image
                                        src='/images/planet.png'
                                        alt='planet'
                                        width={200}
                                        height={200}
                                    />
                                </div>
                                <h2 className='text-2xl font-semibold text-muted-foreground'>No Jobs</h2>
                                <p className='text-muted-foreground text-lg'>Press the Search Jobs button to search for jobs.</p>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default JobRecommendations