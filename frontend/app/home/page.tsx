"use client";

import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import MapSelector from "../Components/MapSelector";
import "../Components/LeafLetIcons";
import { AppBar } from "../Components/AppBar";
import { SlideToConfirm } from "../Components/SlideToConfirm";
import { useEmergencySocket } from "../Components/SocketComponenet";

export default function () {
  const [isLogin, setIsLogin] = useState(true);
  const [showSlider, setShowSlider] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [hazardType, setHazardType] = useState("");
  const [showDescription, setShowDescription] = useState(false);
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [userId,setUserId] = useState("user123");
  const { sendEmergency } = useEmergencySocket(userId);

  const handleLocationSelect = (lat: number, lng: number) => {
    console.log("Selected Location:", lat, lng);
    setLat(lat);
    setLng(lng);
    setShowSlider(true);
    setShowAlertModal(true);
  };
  const handleConfirm = async() => {
    console.log(priority);
    const alertPayload = {
      type: hazardType,
      priority: priority,
      status: "IN_PROCRESS",
      description: description,
      assignedTo: "POLICE",
      location: {
        lat: lat,
        long: lng,
      },
    };
    sendEmergency(alertPayload);

    console.log("Emergency Confirmed!");  
    setShowAlertModal(false);
  };
  useEffect(() => {
    if (hazardType) {
      console.log("Hazard Type Selected:", hazardType);
    }
  }, [hazardType]);
  return (
    <div className="flex flex-col justify-center items-center h-screen relative bg-[#0f0f0f]">
      {isLogin && (
        <div className="bg-[#141a15ea] p-10 rounded-md z-10 shadow-md">
          <AppBar />
          <h2 className="text-2xl font-semibold py-5 text-white">
            Select Location of Emergency
          </h2>
          <MapSelector onLocationSelect={handleLocationSelect} />

          {showSlider && (
            <div className="py-5">
              <SlideToConfirm onConfirm={handleConfirm} />
            </div>
          )}
        </div>
      )}
      {showAlertModal && (
        <div className="fixed inset-x-[490px] inset-y-[145px] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-20">
          <div className="bg-[#141a15ea] p-10 rounded-lg shadow-lg text-center">
            <h1 className="text-xl font-bold mb-4">Hazard Type *</h1>
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {["FIRE", "CRIME", "ACCIDENT", "MEDICAL"].map((type) => (
                <button
                  key={type}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    hazardType === type
                      ? "bg-white text-black border-white"
                      : {
                          FIRE: "border-orange-500",
                          CRIME: "border-red-500",
                          ACCIDENT: "border-yellow-500",
                          MEDICAL: "border-blue-500",
                        }[type]
                  }`}
                  onClick={() => {
                    setHazardType(type);
                    setShowDescription(false);
                    setDescription("");
                  }}
                >
                  {type}
                </button>
              ))}
              <button
                className={`px-4 py-2 rounded-lg border ${
                  hazardType === "OTHER"
                    ? "bg-white text-black border-white"
                    : "border-green-500"
                }`}
                onClick={() => {
                  setHazardType("OTHER");
                  setShowDescription(true);
                }}
              >
                OTHER
              </button>
            </div>
            {showDescription && (
              <div className="mb-4">
                <h2 className="text-md font-semibold mb-1">
                  Give us a short brief
                </h2>
                <input
                  type="text"
                  className="w-full p-2 rounded-md border border-gray-600 bg-[#1f1f1f] text-white placeholder-gray-400"
                  placeholder="Tell us what happened..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            )}

            <div className="mt-4">
              <h2 className="text-md font-bold mb-2">Priority Level</h2>
              <div className="flex justify-center gap-2">
                {["LOW", "MEDIUM", "HIGH"].map((level, idx) => (
                  <button
                    key={level}
                    className={`px-4 py-2 rounded-lg border border-gray-900 text-white ${
                      priority === level
                        ? "ring-2 ring-white"
                        : ["bg-red-500", "bg-red-700", "bg-red-900"][idx]
                    }`}
                    onClick={() => setPriority(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
