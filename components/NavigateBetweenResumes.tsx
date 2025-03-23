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

interface NavigateBetweenResumesProps {
    handleQueryString?: (arg0: string, arg1: string) => void,
}

function NavigateBetweenResumes({ handleQueryString = () => {}}: NavigateBetweenResumesProps) {
    const [position, setPosition] = React.useState<string>("");
    const [profiles, setProfiles] = React.useState<Array<ProfileDetails>>([]);
    const [isMounted, setIsMounted] = React.useState(false);  // Prevent hydration error

    async function getProfiles() {
        const getProfileDetails = await getCurrentUserProfiles();
        if (getProfileDetails && getProfileDetails.length > 0) {
            setPosition(getProfileDetails[0].name);
            setProfiles(getProfileDetails);
            console.log("Profiles:", getProfileDetails);
        } else {
            setPosition("");
            setProfiles([]);
        }
    }

    React.useEffect(() => {
        setIsMounted(true);  // Ensure component is mounted
        getProfiles();
    }, []);

    React.useEffect(() => {
        if (isMounted) {
            const selectedProfile = profiles.find(profile => profile.name === position);
            if (selectedProfile) {
                handleQueryString(selectedProfile.queryString, selectedProfile.id);
            }
        }
    }, [position, isMounted]);

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">Select Profile</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Your Profiles</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                        {profiles.map((profile) => (
                            <DropdownMenuRadioItem key={profile.name} value={profile.name}>
                                {profile.name}
                            </DropdownMenuRadioItem> 
                        ))}
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default NavigateBetweenResumes
