"use client";
import { useState } from "react"

export default function(){
    const [isLogin,setIsLogin] = useState(false);
    return <div className="flex flex-col justify-center items-center h-screen">
        {isLogin && (
            <div className="bg-white px-32 py-10">

            </div>
        )}
    </div>
}