"use client";
import { useRouter } from "next/navigation"

export const AppBar = () => {
    const router = useRouter()
    
    return   <div
    className="font-gilroy fixed top-4 py-3 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 shadow-md border border-gray-800 rounded-full backdrop-blur-md bg-white/75 transition-all duration-500"
  >     <div className="pl-5 flex gap-2">
            <div className="flex justify-center items-center gap-1 text-[#979797] text-sm">
                    <img width="32" height="32" src="https://img.icons8.com/color-pixels/32/siren.png" alt="siren"/>
                    <p className="p-2 text-zinc-600 rounded-lg transition-colors duration-500 ease-in-out hover:bg-gray-800 hover:text-white hover:[transition-delay:200ms]">Search</p>
                    <p className="p-2 text-zinc-600  rounded-lg transition-colors duration-500 ease-in-out hover:bg-gray-800 hover:text-white hover:[transition-delay:200ms]">Service</p>
                    <p className="p-2 text-zinc-600  rounded-lg transition-colors duration-500 ease-in-out hover:bg-gray-800 hover:text-white hover:[transition-delay:200ms]">Explore</p>
                    <p className="p-2 text-zinc-600  rounded-lg transition-colors duration-500 ease-in-out hover:bg-gray-800 hover:text-white hover:[transition-delay:200ms]">About</p>
                    <button className="flex justify-center items-center gap-2 p-2 text-zinc-600  rounded-lg transition-colors duration-500 ease-in-out hover:bg-gray-800 hover:text-white hover:[transition-delay:200ms]">
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
    </div>
}