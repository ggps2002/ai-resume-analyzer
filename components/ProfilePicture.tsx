import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { auth, signOut } from "@/auth";
import LogoutIcon from '@mui/icons-material/Logout';

export async function ProfilePicture() {
    const session = await auth()

    if (!session?.user) return null;
    return (
        <div>
            <Popover>
                <PopoverTrigger>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </PopoverTrigger>
                <PopoverContent>
                    <div className='flex justify-between'>
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className='cursor-pointer '>
                            <form
                                action={async () => {
                                    "use server";

                                    await signOut();
                                }}
                                className="mb-4"
                            >
                                <Button variant="destructive"><LogoutIcon/> Logout</Button>
                            </form>
                        </div>
                    </div>
                    <div>
                        <p className='font-bold'></p>
                        <p className="profile-name">{session.user.name}</p>
                        <p className="profile-email">{session.user.email}</p>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}
