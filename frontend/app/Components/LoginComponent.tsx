"use client";
import { useState } from "react"

export const LoginComponent = () =>{
    const [showPassword,setShowPassword] = useState(false);
    return <div>
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="bg-[#141a15ea] px-32 py-10 border-2 border-gray-950 rounded-lg">
                <div className="flex flex-col pb-5 text-2xl font-bold">
                    <span>Stay connected.</span>
                    <span>Stay alert.</span> 
                    <span>Sign in to protect..</span> 
                </div>
                <div className="">
                    <input type="text" className="p-2 bg-[#141a15ea] rounded-lg border border-gray-700" placeholder="username" />
                </div>                
                <div className="flex justify-between gap-4">
                    <div className="">
                        <input type={`${showPassword ? "text" : "password"}`} className="border border-gray-700 my-3 p-2 bg-[#141a15ea] rounded-lg" placeholder="password" />
                    </div>
                    <div className="py-6">
                        {showPassword ? (
                            <button onClick={()=>{
                                setShowPassword(false);
                            }}>                              
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg> 
                            </button>
                        ):(
                            <button onClick={()=>{
                                setShowPassword(true);
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>  
                            </button>
                        )}
                    </div>
                </div>
                <div className="max-w-[230px]"> 
                    <button className="w-full p-2 border-2  rounded-lg bg-[#141a15ea] border-green-800">Lock In 🔒</button>
                </div>
            </div>
        </div>
    </div>
}