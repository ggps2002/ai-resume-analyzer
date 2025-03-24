"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getCurrentUserProfiles } from "@/lib/actions/database";
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { User } from "lucide-react";


interface NavigateBetweenResumesProps {
    handleQueryString?: (arg0: string, arg1: string, arg2: string) => void,
}

function NavigateBetweenResumes({ handleQueryString = () => {}}: NavigateBetweenResumesProps) {
    const [position, setPosition] = React.useState<string>("");
    const [profiles, setProfiles] = React.useState<Array<ProfileDetails>>([]);
    const [isMounted, setIsMounted] = React.useState(false);  // Prevent hydration error
    const [isLoading, setIsLoading] = React.useState(false);

    async function getProfiles() {
        setIsLoading(true);
        const getProfileDetails = await getCurrentUserProfiles();
        if (getProfileDetails && getProfileDetails.length > 0) {
            setPosition(getProfileDetails[0].userSetName);
            setProfiles(getProfileDetails);
        } else {
            setPosition("");
            setProfiles([]);
        }
        setIsLoading(false);
    }

    React.useEffect(() => {
        setIsMounted(true);  // Ensure component is mounted
        getProfiles();
    }, []);

    React.useEffect(() => {
        if (isMounted) {
            const selectedProfile = profiles.find(profile => profile.userSetName === position);
            if (selectedProfile) {
                handleQueryString(selectedProfile.queryString, selectedProfile.id, selectedProfile.name);
            }
        }
    }, [position, isMounted]);

    return (
        isLoading? (
            <Typography variant="h1" ><Skeleton height={40} width={100}/></Typography>
        ) : (<div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline"><User/>Select Profile</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Your Profiles</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                        {profiles.map((profile) => (
                            <DropdownMenuRadioItem key={profile.name} value={profile.userSetName}>
                                {profile.userSetName}
                            </DropdownMenuRadioItem> 
                        ))}
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>)
    )
}

export default NavigateBetweenResumes
