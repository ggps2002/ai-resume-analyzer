'use client'

import React, { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface JobFilterSidebarProps {
    onFilterChange: (filters: Filters) => void;
    show: boolean;
    handleToggle: () => void,
}

const JobFilterSidebar: React.FC<JobFilterSidebarProps> = ({ onFilterChange, show, handleToggle }) => {
    const [isFilterSet, setIsFilterSet] = useState<boolean>(false);
    const [filters, setFilters] = useState<Filters>({
        location: '',
        jobType: '',
        experienceLevel: '',
        isRemote: undefined,
    });

    const handleSetFilters = () => {
        onFilterChange({
            ...filters
        });
        setIsFilterSet(true);
    }

    const handleRemoveFilters = () => {
        onFilterChange({
            location: '',
            jobType: '',
            experienceLevel: '',
            isRemote: undefined,
        })
        setFilters({
            location: '',
            jobType: '',
            experienceLevel: '',
            isRemote: undefined,
        })
        setIsFilterSet(false);
    }

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        console.log(filters);
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value,
        });
    };

    return (
        <>
            <div className={`relative lg:flex h-full items-start border-r-2 lg:translate-x-0 ${show ? 'translate-x-0' : '-translate-x-[70vh]'} transition-all ease-in-out`}>
                <div className="absolute lg:static lg:flex lg:flex-col justify-between p-4 h-full bg-white">
                    <div>
                        <div className='absolute top-4 right-4 sm:flex justify-end lg:hidden border-gray-500 inline-block border-2 rounded-md' >
                            <X className='cursor-pointer' onClick={handleToggle} />
                        </div>
                        <h2 className="text-center font-semibold mb-2">Filter Jobs</h2>
                        <hr />
                        <div className="my-4">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                type="text"
                                name="location"
                                id="location"
                                placeholder="eg. United States, San Francisco"
                                value={filters.location}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-4">
                            <Label htmlFor="jobType">Job Type</Label>
                            <Select
                                name="jobType"
                                value={filters.jobType}
                                onValueChange={(value) =>
                                    handleChange({ target: { name: "jobType", value } } as React.ChangeEvent<HTMLSelectElement>)
                                }
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a job type." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Select job type</SelectLabel>
                                        <SelectItem value="FULL_TIME">Full Time</SelectItem>
                                        <SelectItem value="INTERN">Intern</SelectItem>
                                        <SelectItem value="PART_TIME">Part Time</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='mb-4'>
                            <Label htmlFor="isRemote">Remote</Label>
                            <RadioGroup value={filters.isRemote !== undefined ? filters.isRemote.toString() : ''} onValueChange={(value) => handleChange({ target: { name: "isRemote", value } } as React.ChangeEvent<HTMLSelectElement>)}>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='True' id='r1' onClick={() => handleChange({ target: { name: "isRemote", value: "True" } } as React.ChangeEvent<HTMLSelectElement>)}/>
                                    <Label htmlFor="r1">True</Label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value='False' id='r2' onClick={() => handleChange({ target: { name: "isRemote", value: "False" } } as React.ChangeEvent<HTMLSelectElement>)}/>
                                    <Label htmlFor="r2">False</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <div className="mb-4">
                            <Label htmlFor="experienceLevel">Experience Level</Label>
                            <Select
                                name="experienceLevel"
                                value={filters.experienceLevel}
                                onValueChange={(value) =>
                                    handleChange({ target: { name: "experienceLevel", value } } as React.ChangeEvent<HTMLSelectElement>)
                                }
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select your experience level." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Select experience level</SelectLabel>
                                        <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                                        <SelectItem value="Mid-Senior level">Mid Senior</SelectItem>
                                        <SelectItem value="Entry level">Entry</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="mt-auto text-right">
                        <Button onClick={() => {
                            if (isFilterSet) {
                                handleRemoveFilters()
                            } else {
                                handleSetFilters();
                            }
                        }}>{ isFilterSet ? 'Remove Filter' : 'Apply Filter'}</Button>
                    </div>
                </div>
            </div>

        </>
    );
};

export default JobFilterSidebar;

