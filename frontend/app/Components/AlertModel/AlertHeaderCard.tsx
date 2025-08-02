"use client";

import { useSession } from "next-auth/react";

type Location =  {
    lat: number | null,
    lng: number | null
}

export const AlertHeaderCard = ({lat,lng}:Location) => {
    const {data:session} = useSession(); 
    console.log("Full session:", session);
    console.log("User data:", session?.user);
    const username = session?.user?.username || 
                   session?.user?.name || 
                   session?.user?.email?.split('@')[0] || 
                   "User";
    const userProfilePic = session?.user?.image;
    
    return <div>
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
               <button className="p-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
               </button> 
               <div className="flex flex-col">
                 <p className="text-sm font-medium">Chennai</p>
                 <p className="text-xs text-zinc-500">{lat?.toFixed(4)} {lng?.toFixed(4)}</p>
               </div>
            </div>
            <div className="flex items-center">
                {session ? (
                    userProfilePic ? (
                        <img src={userProfilePic} alt="Profile" className="w-8 h-8 rounded-full" />
                    ) : (
                        <button className="p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        </button>
                    )
                ) : (
                    <div>
                        <h1 className="text-sm font-medium">Hello, {username}</h1>
                    </div>
                )}
            </div>
        </div>
    </div>
}