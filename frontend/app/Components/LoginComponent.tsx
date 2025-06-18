"use client";
import { BACKEND_URL } from "@/config";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react"

export const LoginComponent = () =>{
    const [showPassword,setShowPassword] = useState(false);
    const [userLoginModel,setUserLoginModel] = useState(true);
    const [policeLoginModel,setPoliceLoginModel] = useState(false);
    const [medicalLoginModel,setmedicalLoginModel] = useState(false);
    const [fireLoginModel,setFireLoginModel] = useState(false);
    const [userRole,setUserRole] = useState("");
    const [email,setEmail] = useState<string>("");
    const [password,setPassword] = useState<string>("");
    const router = useRouter();
    const params = useParams();

    useEffect(()=>{
        const role = params[""]?.[0];
        switch (role.toLocaleUpperCase()) {
            case "CIVILIAN":
                setUserLoginModel(true);
                break;
            case "POLICE":
                setPoliceLoginModel(true);
                break;
            case "FIRE":
                setFireLoginModel(true);
                break;
            case "MEDICAL":
                setmedicalLoginModel(true);
                break;
            default:
                break;
        }
        setUserRole(role.toLocaleUpperCase());
    },[])
    
     
    return <div>
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="bg-[#] px-32 py-10 border-2 border-gray-950 rounded-lg">
                {userRole === "CIVILIAN" &&(
                    <div>
                    {userLoginModel && (
                    <div>
                        <div className="flex flex-col pb-2   text-2xl font-bold">
                            <span>Stay connected.</span>
                            <span>Stay alert.</span> 
                            <span>Sign in to protect..</span> 
                        </div>
                        <div className="flex border w-10 mx-24 p-2 rounded-full mb-2 border-gray-700">
                            <p className="">🧑‍🦱</p>
                        </div>
                        <div className="">
                            <input type="text" className="p-2 bg-[#141a15ea] rounded-lg border border-gray-700" placeholder="username" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
                        </div>                
                        <div className="flex justify-between gap-4">
                            <div className="">
                                <input type={`${showPassword ? "text" : "password"}`} className="border border-gray-700 my-3 p-2 bg-[#141a15ea] rounded-lg" placeholder="password" value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
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
                    </div>
                )}
                
                        <div className="max-w-[230px]"> 
                            <button className="w-full p-2 border-2  rounded-lg bg-[#141a15ea] border-green-800" onClick={async()=>{
                                const res = await axios.post(`${BACKEND_URL}/user/signin`,{
                                    email:email,
                                    password:password,
                                    userRole:userRole
                                })
                                if (res.data) {
                                    const userId = res.data.user.id;
                                    console.log("Login Successfull!");
                                    router.push(`/home/${userRole}/${userId}`)
                                }
                            }}>Lock In 🔒</button>
                        </div>
                    </div>
                )}
                {userRole === "POLICE" &&(
                    <div>
                    {policeLoginModel && (
                    <div>
                        <div className="flex flex-col pb-2   text-2xl font-bold">
                            <span>Stay connected.</span>
                            <span>Stay alert.</span> 
                            <span>Sign in to protect..</span> 
                        </div>
                        <div className="flex border w-10 mx-24 p-2 rounded-full mb-2 border-gray-700">
                            <p className="">👮🏼‍♂️</p>
                        </div>
                        <div className="">
                            <input type="text" className="p-2 bg-[#141a15ea] rounded-lg border border-gray-700" placeholder="username" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
                        </div>                
                        <div className="flex justify-between gap-4">
                            <div className="">
                                <input type={`${showPassword ? "text" : "password"}`} className="border border-gray-700 my-3 p-2 bg-[#141a15ea] rounded-lg" placeholder="password" value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
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
                    </div>
                )}
                
                        <div className="max-w-[230px]"> 
                            <button className="w-full p-2 border-2  rounded-lg bg-[#141a15ea] border-green-800" onClick={async()=>{
                                const res = await axios.post(`${BACKEND_URL}/user/signin`,{
                                    email:email,
                                    password:password,
                                    userRole:userRole
                                })
                                if (res.data) {
                                    const userId = res.data.user.id;
                                    console.log("Login Successfull!");
                                    router.push(`/dashboard/${userId}/${userRole}`)
                                }
                            }}>Lock In 🔒</button>
                        </div>
                    </div>
                )}
                {userRole === "MEDICAL" &&(
                    <div>
                    {medicalLoginModel && (
                    <div>
                        <div className="flex flex-col pb-2   text-2xl font-bold">
                            <span>Stay connected.</span>
                            <span>Stay alert.</span> 
                            <span>Sign in to protect..</span> 
                        </div>
                        <div className="flex border w-10 mx-24 p-2 rounded-full mb-2 border-gray-700">
                            <p className="">🧑‍⚕️</p>
                        </div>
                        <div className="">
                            <input type="text" className="p-2 bg-[#141a15ea] rounded-lg border border-gray-700" placeholder="username" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
                        </div>                
                        <div className="flex justify-between gap-4">
                            <div className="">
                                <input type={`${showPassword ? "text" : "password"}`} className="border border-gray-700 my-3 p-2 bg-[#141a15ea] rounded-lg" placeholder="password" value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
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
                    </div>
                )}
                
                        <div className="max-w-[230px]"> 
                            <button className="w-full p-2 border-2  rounded-lg bg-[#141a15ea] border-green-800" onClick={async()=>{
                                const res = await axios.post(`${BACKEND_URL}/user/signin`,{
                                    email:email,
                                    password:password,
                                    userRole:userRole
                                })
                                if (res.data) {
                                    const userId = res.data.user.id;
                                    console.log("Login Successfull!");
                                    router.push(`/dashboard/${userId}/${userRole}`)
                                }
                            }}>Lock In 🔒</button>
                        </div>
                    </div>
                )}
                {userRole === "FIRE" &&(
                    <div>
                    {fireLoginModel && (
                    <div>
                        <div className="flex flex-col pb-2   text-2xl font-bold">
                            <span>Stay connected.</span>
                            <span>Stay alert.</span> 
                            <span>Sign in to protect..</span> 
                        </div>
                        <div className="flex border w-10 mx-24 p-2 rounded-full mb-2 border-gray-700">
                            <p className="">🧑🏻‍🚒</p>
                        </div>
                        <div className="">
                            <input type="text" className="p-2 bg-[#141a15ea] rounded-lg border border-gray-700" placeholder="username" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
                        </div>                
                        <div className="flex justify-between gap-4">
                            <div className="">
                                <input type={`${showPassword ? "text" : "password"}`} className="border border-gray-700 my-3 p-2 bg-[#141a15ea] rounded-lg" placeholder="password" value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
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
                    </div>
                )}
                
                        <div className="max-w-[230px]"> 
                            <button className="w-full p-2 border-2  rounded-lg bg-[#141a15ea] border-green-800" onClick={async()=>{
                                const res = await axios.post(`${BACKEND_URL}/user/signin`,{
                                    email:email,
                                    password:password,
                                    userRole:userRole
                                })
                                if (res.data) {
                                    const userId = res.data.user.id;
                                    console.log("Login Successfull!");
                                    router.push(`/dashboard/${userId}/${userRole}`)
                                }
                            }}>Lock In 🔒</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
}