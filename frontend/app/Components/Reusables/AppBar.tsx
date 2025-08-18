"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react";
import Image from "next/image";

export const AppBar = () => {
    const router = useRouter()
    const {data:session} = useSession();
    const [isVisible, setIsVisible] = useState(false);


    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div 
            className={`font-gilroy fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-xl z-50 shadow-2xl border border-gray-200/20 rounded-full backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}

        >
            {session ? (
                <div className="px-5 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1  p-1.5 rounded-lg shadow-lg">
                            <Image 
                                width={30} 
                                height={30} 
                                src="https://img.icons8.com/color-pixels/32/siren.png" 
                                alt="siren"
                                className="animate-pulse"
                            />
                        </div>
                        <div className="flex items-center">
                            {['About', 'Services','legal & terms'].map((item, index) => (
                                <button
                                    key={item}
                                    className="px-3 py-1.5 text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-300 ease-out hover:bg-gradient-to-r hover:from-red-500 hover:to-orange-500 hover:text-white hover:shadow-lg hover:scale-105 transform text-sm"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p>|</p>
                    </div>
                    {/* Right Section - Branding & Actions */}
                    <div className="flex items-center">
                        {/* GitHub Button */}
                        <a href="https://github.com/akshxdevs/emergency-alert-sys.git" target="_blank" rel="noopener noreferrer">
                            <button className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg transform">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="transparent" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                                    <path d="M9 18c-4.51 2-5-2-7-2"></path>
                                </svg>
                                <span className="text-xs font-medium">GitHub</span>
                            </button>
                        </a>

                        {/* Branding Button */}
                        <div className="relative group">
                            <a href="https://x.com/akshxdevs">
                                <button 
                                    className="flex items-center gap-2 text-white px-4 py-1.5 rounded-lg shadow-lg transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl transform group-hover:from-red-600 group-hover:via-red-700 group-hover:to-orange-600"
                                >
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                <circle cx="12" cy="7" r="4"></circle>
                                            </svg>
                                        </div>
                                        <div className="text-left">
                                            <div className="text-[10px] opacity-90">Backed by</div>
                                            <div className="text-xs font-semibold">@akshxdevs</div>
                                        </div>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
                                        <path d="M5 12h14"></path>
                                        <path d="m12 5 7 7-7 7"></path>
                                    </svg>
                                </button>
                            </a>
                            {/* Hover Effect Glow */}
                            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="pl-5 flex gap-2">
                <div className="flex justify-center items-center gap-1 text-[#979797] text-sm">
                        <Image width={32} height={32} src="https://img.icons8.com/color-pixels/32/siren.png" alt="siren"/>
                        <p className="p-2 text-zinc-600 rounded-lg transition-colors duration-500 ease-in-out hover:bg-gray-600 hover:text-white hover:[transition-delay:200ms]">Search</p>
                        <p className="p-2 text-zinc-600  rounded-lg transition-colors duration-500 ease-in-out hover:bg-gray-600 hover:text-white hover:[transition-delay:200ms]">Service</p>
                        <p className="p-2 text-zinc-600  rounded-lg transition-colors duration-500 ease-in-out hover:bg-gray-600 hover:text-white hover:[transition-delay:200ms]">Explore</p>
                        <p className="p-2 text-zinc-600  rounded-lg transition-colors duration-500 ease-in-out hover:bg-gray-600 hover:text-white hover:[transition-delay:200ms]">About</p>
                        <button className="flex justify-center items-center gap-2 p-2 text-zinc-600  rounded-lg transition-colors duration-500 ease-in-out hover:bg-gray-600 hover:text-white hover:[transition-delay:200ms]">
                            Resourses
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-4">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>

                </div>
                <div className="flex justify-center items-center gap-2">
                    <div className="p-2 text-zinc-600  rounded-lg transition-colors duration-500 ease-in-out hover:bg-gray-800 hover:text-white hover:[transition-delay:200ms]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="transparent" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-languages" aria-hidden="true"><path d="m5 8 6 6"></path><path d="m4 14 6-6 2-3"></path><path d="M2 5h12"></path><path d="M7 2h1"></path><path d="m22 22-5-10-5 10"></path><path d="M14 18h6"></path></svg>
                    </div>
                    <a href="https://github.com/akshxdevs/blumes.git">
                        <button className="flex justify-center items-center gap-2 bg-gray-700 px-4 py-2 rounded-full">
                            <span><svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="transparent" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-github" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg></span>
                        </button>                  
                            
                    </a>
                    <button onClick={() => router.push("/login")} className="w-32 md:w-32 text-slate-100 bg-red-500 px-4 py-2 rounded-full">
                        Get Started
                    </button>                  
                </div>
            </div>
            )}
        </div>
    );
}