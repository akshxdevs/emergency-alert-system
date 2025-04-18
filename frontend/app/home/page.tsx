"use client";
import { useState } from "react"
import 'leaflet/dist/leaflet.css';
import MapSelector from "../Components/MapSelector";
import '../Components/LeafLetIcons';
import { AppBar } from "../Components/AppBar";
import { SlideToConfirm } from "../Components/SlideToConfirm";

export default function(){
    const [isLogin,setIsLogin] = useState(true);
    const [data,setData] = useState(false);
        const handleLocationSelect = (lat: number, lng: number) => {
            setData(true);
            console.log("Selected Location:", lat, lng);
        };
        const handleConfirm = () => {
            // alert("User confirmed!");
          };
    return <div className="flex flex-col justify-center items-center h-screen">
        {isLogin && (
            <div className="bg-[#141a15ea] p-10">
                <AppBar/>
                <div>
                    <h2 className="text-2xl font-semibold py-5">Select Location of Emergency</h2>
                    <MapSelector onLocationSelect={handleLocationSelect} />
                </div>
                {data && (
                    <div className="py-2">
                        <SlideToConfirm onConfirm={handleConfirm} />
                    </div>
                )}
            </div>
        )}
    </div>
}