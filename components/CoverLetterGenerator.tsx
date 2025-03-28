'use client'

import React, { useEffect, useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import NavigateBetweenResumes from './NavigateBetweenResumes';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { getProfileContactDetails, getSavedJobs } from '@/lib/actions/database';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { getLLMCoverLetter } from '@/lib/llm';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import html2pdf from 'html2pdf.js';

const CoverLetterLayout: React.FC = () => {
    const [savedJobs, setSavedJobs] = useState<Array<{ title: string, company: string, logo: string }>>([]);
    const [selectedJob, setSelectedJob] = useState<string>("");
    const [additionalInformation, setAdditionalInformation] = useState<string>("");
    const [contactDetails, setContactDetails] = useState<Contact | undefined>();
    const [profile, setProfile] = useState<{ queryString: string, profileId: string, name: string }>({ queryString: "", profileId: "", name: "" });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [coverLetter, setCoverLetter] = useState<string>("// You can write your cover letter here or let AI do it for you... //");
    const [visibleText, setVisibleText] = useState<string>("");
    const containerRef = useRef<HTMLDivElement>(null);
    const [showAnimation, setShowAnimation] = useState<boolean>(false);
    const [isEditable, setIsEditable] = useState<boolean>(true);

    const editor = useEditor({
        extensions: [StarterKit],
        content: coverLetter,
        onUpdate: ({ editor }) => {
            if (showAnimation) {
                setCoverLetter(editor.getHTML());
            }
        },
    });

    // ✅ Gradual reveal animation only when showAnimation is true
    useEffect(() => {
        if (coverLetter && showAnimation) {
            let i = 0;
            setVisibleText("");
            setIsEditable(false);
            const interval = setInterval(() => {
                setVisibleText((prev) => prev + coverLetter[i]);
                i++;

                // Auto-scroll effect as content expands
                if (containerRef.current) {
                    containerRef.current.scrollTop = containerRef.current.scrollHeight;
                }

                if (i >= coverLetter.length) {
                    clearInterval(interval);
                    setShowAnimation(false);
                    setIsEditable(true);  // ✅ Disable animation after first run
                }
            }, 15); // Adjust speed

            return () => clearInterval(interval);
        } else {
            setVisibleText(coverLetter);
            setIsEditable(true);  // ✅ Display full content without animation on subsequent edits
        }
    }, [coverLetter, showAnimation]);

    useEffect(() => {
        if (editor) {
            editor.commands.setContent(visibleText);
        }
    }, [visibleText, editor]);

    const handleGenerate = async () => {
        const message = {
            name: profile.name,
            contact: contactDetails!,
            job: selectedJob,
            AdditionalInformation: additionalInformation,
        }
        setIsGenerating(true);
        setIsEditable(false);
        const response = await getLLMCoverLetter(message);
        setCoverLetter(response);
        setIsGenerating(false);
        setShowAnimation(true);  // ✅ Enable animation only after generation
    }

    const handleGetProfileContactInfo = async (profileId: string) => {
        const contactDetails = await getProfileContactDetails(profileId);
        if (contactDetails) {
            setContactDetails(contactDetails);
        }
    }

    const handleGetSavedJobs = async (profileId: string) => {
        const savedJobs = await getSavedJobs(profileId);
        if (savedJobs) {
            setSavedJobs(savedJobs);
        }
    }

    const handleQueryString = (queryString: string, profileId: string, name: string) => {
        setProfile({
            queryString: queryString,
            profileId: profileId,
            name: name
        });
    }

    useEffect(() => {
        setIsLoading(true);
        if (profile.profileId && profile.profileId.trim() !== "") {
            handleGetSavedJobs(profile.profileId);
            handleGetProfileContactInfo(profile.profileId);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }, [profile.profileId]);

    // ✅ Export to PDF Function
    const handleExportToPDF = () => {
        if (editor) {
            const htmlContent = editor.getHTML();
    
            // Create a temporary div to measure content
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;
            tempDiv.style.position = 'absolute';
            tempDiv.style.left = '-9999px';
            tempDiv.style.width = '210mm'; // A4 width
            document.body.appendChild(tempDiv);
    
            // Calculate scaling factor
            const contentHeight = tempDiv.offsetHeight;
            const a4Height = 297; // A4 height in mm
            const scale = (a4Height - 20) / (contentHeight / 4); // Adjust for margins and px-to-mm conversion
    
            // Remove temporary div
            document.body.removeChild(tempDiv);
    
            const options = {
                margin: 10,
                filename: `cover_letter_${profile.name}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: Math.min(2, Math.max(1, scale)), // Dynamic scaling between 1-2
                    width: 800, // Fixed width to match A4 proportions
                    windowWidth: 800
                },
                jsPDF: { 
                    unit: 'mm', 
                    format: 'a4', 
                    orientation: 'portrait',
                    hotfixes: ['px_scaling'] // Fix for pixel scaling issues
                },
                pagebreak: { 
                    mode: ['avoid-all'] // Prevent page breaks
                }
            };
    
            const element = document.createElement('div');
            element.innerHTML = htmlContent;
            element.style.width = '100%'; // Ensure content uses full width
    
            html2pdf()
                .from(element)
                .set(options)
                .save()
                .catch((err: unknown) => console.error('PDF generation error:', err));
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 h-[calc(100vh-48px)]">
                {/* Left Grid - Input Form */}
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md flex flex-col md:h-[90%]">
                    <div className="flex flex-col flex-1 overflow-hidden">
                        <h2 className="text-xl sm:text-2xl font-bold">Generate Your Cover Letter✨</h2>
                        <p className="text-muted-foreground font-semibold text-sm sm:text-base">Let A.I write your cover letter.</p>
                        <div className="flex justify-end mb-2">
                            <NavigateBetweenResumes handleQueryString={handleQueryString} />
                        </div>
                        <Separator />
                        {isLoading ? (
                            <>
                                <Typography variant="h3"><Skeleton /></Typography>
                                <Typography variant="body2"><Skeleton height={150} /></Typography>
                            </>
                        ) : (
                            <>
                                <div className="my-2">
                                    <Label htmlFor="select Job">Select a Job</Label>
                                    <Select onValueChange={(value) => setSelectedJob(value)}>
                                        <SelectTrigger className="w-full sm:w-[280px]">
                                            <SelectValue placeholder="Select a saved job to generate cover letter" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {savedJobs.map((job, index) => (
                                                    <SelectItem key={index} value={`${job.title} at ${job.company}`}>
                                                        {job.title} at {job.company}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="message">Additional Information</Label>
                                    <Textarea
                                        placeholder="Any additional information you'd like to include..."
                                        id="message"
                                        className="h-48"
                                        value={additionalInformation}
                                        onChange={(e) => setAdditionalInformation(e.target.value)}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Generate Button at the Bottom */}
                    {isLoading ? (
                        <Typography variant="h3"><Skeleton /></Typography>
                    ) : (
                        <div className="mt-4">
                            {isGenerating ? (
                                <Button disabled className="w-full bg-blue-500 hover:bg-blue-400">
                                    <Loader2 className="animate-spin" />
                                    Generating Cover Letter...
                                </Button>
                            ) : (
                                <Button className="w-full bg-blue-500 hover:bg-blue-400" onClick={handleGenerate}>
                                    <AutoAwesomeIcon fontSize="large" />Generate Cover Letter
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Grid - Generated Cover Letter (Editable with TipTap) */}
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md flex flex-col md:h-[90%] overflow-y-auto gap-4" ref={containerRef}>
                    <div className="flex justify-between mb-2">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold">Your Cover Letter✉️</h2>
                            <p className="text-muted-foreground font-semibold text-sm sm:text-base">
                                Press Export to export your cover letter as pdf.
                            </p>
                        </div>
                        <Button onClick={handleExportToPDF}>Export</Button>
                    </div>
                    {isGenerating ? (
                        <>
                            <Typography variant="body2"><Skeleton width={60} /></Typography>
                            <Typography variant="body2"><Skeleton /></Typography>
                            <Typography variant="body2"><Skeleton /></Typography>
                            <Typography variant="body2"><Skeleton /></Typography>
                            <Typography variant="body2"><Skeleton /></Typography>
                            <Typography variant="body2"><Skeleton /></Typography>
                            <Typography variant="body2"><Skeleton /></Typography>
                            <Typography variant="body2"><Skeleton /></Typography>
                            <Typography variant="body2"><Skeleton /></Typography>
                            <Typography variant="body2"><Skeleton /></Typography>
                            <Typography variant="body2"><Skeleton /></Typography>
                            <Typography variant="body2"><Skeleton /></Typography>
                            <Typography variant="body2"><Skeleton width={60} /></Typography>
                            <Typography variant="body2"><Skeleton width={150} /></Typography>
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className={`${!isEditable && 'pointer-events-none'}`}
                        >
                            <EditorContent editor={editor} />
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CoverLetterLayout;