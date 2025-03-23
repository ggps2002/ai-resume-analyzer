'use client'

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import NavigateBetweenResumes from './NavigateBetweenResumes';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { getSavedJobs } from '@/lib/actions/database';

const CoverLetterLayout: React.FC = () => {
    const [savedJobs, setSavedJobs] = useState<Array<{title: string, company: string, logo: string}>>([]);
    const [profileId, setProfileId] = useState<string>("");
    const [coverLetter, setCoverLetter] = useState<string>(
        `Dear Hiring Manager,\n\nI am excited to apply for the Software Engineer position at Tech Corp. With my extensive experience in software development and a passion for creating efficient and scalable solutions, I am confident in my ability to contribute to your team.\n\nI look forward to the possibility of discussing this exciting opportunity with you. Thank you for considering my application.\n\nSincerely,\nJohn Doe
        lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum.
        lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum.
        lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum.
        lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum.
        lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum.`
    );

    const editor = useEditor({
        extensions: [StarterKit],
        content: coverLetter,
        onUpdate: ({ editor }) => {
            setCoverLetter(editor.getHTML());
        },
    });

    const handleGetSavedJobs = async (profileId : string) => {
        const savedJobs = await getSavedJobs(profileId);
        console.log("Saved Jobs:", savedJobs);
        if (savedJobs) {
            setSavedJobs(savedJobs);
        }
    }

    const handleQueryString = (queryString : string, profileId : string) => {
        setProfileId(profileId);
    }
    
    useEffect(() => {
        handleGetSavedJobs(profileId);
    }, [profileId]);

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 h-[calc(100vh-48px)]">
                {/* Left Grid - Input Form */}
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md flex flex-col h-[90%]">
                    <div className="flex flex-col flex-1 overflow-hidden">
                        <h2 className="text-xl sm:text-2xl font-bold">Generate Your Cover Letter✨</h2>
                        <p className='text-muted-foreground font-semibold text-sm sm:text-base'>Let A.I write your cover letter.</p>
                        <div className='flex justify-end mb-2'>
                            <NavigateBetweenResumes handleQueryString={handleQueryString}/>
                        </div>
                        <Separator />
                        <div className='my-2'>
                            <Label htmlFor="select Job">Select a Job</Label>
                            <Select>
                                <SelectTrigger className="w-full sm:w-[280px]">
                                    <SelectValue placeholder="Select a saved job to generate cover letter" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {savedJobs.map((job, index) => (
                                            <SelectItem key={index} value={job.title}>{job.title} at {job.company}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="message">Additional Information</Label>
                            <Textarea placeholder="Any additional information you'd like to include..." id="message" className='h-32'/>
                        </div>
                    </div>
                    {/* Generate Button at the Bottom */}
                    <div className="mt-4">
                        <Button className='w-full bg-blue-500 hover:bg-blue-400'><AutoAwesomeIcon fontSize="large"/>Generate Cover Letter</Button>
                    </div>
                </div>

                {/* Right Grid - Generated Cover Letter (Editable with Tiptap) */}
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md flex flex-col h-[90%] overflow-y-auto gap-4">
                    <div className='flex justify-between mb-2'>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold">Your Cover Letter✉️</h2>
                            <p className='text-muted-foreground font-semibold text-sm sm:text-base'>Press Export to export your cover letter as pdf.</p>
                        </div>
                        <Button>Export</Button>
                    </div>
                    <div className="prose flex-1 overflow-y-auto pb-4">
                        <EditorContent editor={editor} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoverLetterLayout;