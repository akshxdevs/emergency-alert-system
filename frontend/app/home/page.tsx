"use client";

import { useState } from "react";
import "leaflet/dist/leaflet.css";
import MapSelector from "../Components/MapSelector";
import "../Components/LeafLetIcons";
import { AppBar } from "../Components/AppBar";
import { SlideToConfirm } from "../Components/SlideToConfirm";

export default function EmergencyPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showSlider, setShowSlider] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [description,setDescription] = useState("");
  const [showDescription,setShowDescription] = useState(false)

  const handleLocationSelect = (lat: number, lng: number) => {
    setShowAlertModal(true)
    setShowSlider(true);
    console.log("📍 Selected Location:", lat, lng);
  };

  const handleConfirm = () => {
    console.log("✅ Emergency Confirmed!");
    setShowAlertModal(true);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen relative">
      {isLogin && (
        <div className="bg-[#141a15ea] p-10 rounded-md z-10">
          <AppBar />
          <div>
            <h2 className="text-2xl font-semibold py-5 text-white">
              Select Location of Emergency
            </h2>
            <MapSelector onLocationSelect={handleLocationSelect} />
          </div>

          {showSlider && (
            <div className="py-5">
              <SlideToConfirm onConfirm={handleConfirm} />
            </div>
          )}
        </div>
      )}

      {showAlertModal && (
        <div className="fixed inset-x-[530px] px-10 inset-y-[145px] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-20">
          <div className="bg-[#141a15ea] py-10 rounded-lg shadow-lg text-center">
            <h1>Hazard Type*</h1>
            <div>
                <button className="border p-2 rounded-lg border-orange-500 m-2 focus-within:border-slate-200">FIRE 🔥</button>
                <button className="border p-2 rounded-lg border-red-500 m-2 focus-within:border-slate-200">CRIME</button>
                <button className="border p-2 rounded-lg border-yellow-500 m-2 focus-within:border-slate-200">ACCIDENT</button>
                <button className="border p-2 rounded-lg border-blue-500 m-2 focus-within:border-slate-200">MEDICAL</button>
                <button className="border p-2 rounded-lg m-2 border-green-500 focus-within:border-slate-200" onClick={()=>{
                    setShowDescription(true)
                }}>OTHER</button>
            </div>
            {showDescription && (
                <div>
                    <h1>Give us a short brief!</h1>
                    <input className="border bg-[#141a15ea] p-2 rounded-lg my-2" type="text" placeholder="Tell us what happened here..." value={description} onChange={(e)=>setDescription(e.target.value)} />
                </div>
            )}
            <div>
                <h1>Priority Level</h1>
                <button className="border border-gray-900 p-2 rounded-lg bg-red-500 m-2 focus-within:border-slate-200">LOW</button>
                <button className="border border-gray-900  p-2 rounded-lg m-2 bg-red-700 focus-within:border-slate-200">MEDIUM</button>
                <button className="border border-gray-900  p-2 rounded-lg m-2 bg-red-900 focus-within:border-slate-200">HIGH</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
