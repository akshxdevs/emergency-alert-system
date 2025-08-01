"use client";
import { AddMoreAlertDetails } from "@/app/Components/AlertModel/AddMoreAlertDetails";
import { AlertCategorySelector } from "@/app/Components/AlertModel/AlertCategorySelector";
import { AlertHeaderCard } from "@/app/Components/AlertModel/AlertHeaderCard";
import { AlertLevelSetter } from "@/app/Components/AlertModel/AlertLevelSetter";
import { OtherOptions } from "@/app/Components/AlertModel/OtherOptions";
import { AppBar } from "@/app/Components/AppBar";
import MapSelector from "@/app/Components/MapSelector";
import { SlideToConfirm } from "@/app/Components/SlideToConfirm";
import { useEmergencySocket } from "@/app/Components/SocketComponenet";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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
  const [userId] = useState("user123");
  const [userRole, setUserRole] = useState<string | any>();
  const params = useParams();

  const roleAssignedTo: Record<string, string> = {
    CRIME: "POLICE",
    FIRE: "FIRE",
    MEDICAL: "MEDICAL",
  };

  useEffect(() => {
    const role: string = params[""]?.[0] as string;
    setUserRole(role);
  }, [userRole]);

  const { sendEmergency } = useEmergencySocket(userId, userRole);

  const handleLocationSelect = (lat: number, lng: number) => {
    console.log("Selected Location:", lat, lng);
    setLat(lat);
    setLng(lng);
    setShowSlider(true);
    setShowAlertModal(true);
  };

  const handleConfirm = async () => {
    const assignedTo = roleAssignedTo[hazardType] || "OTHER";
    console.log(priority);
    const alertPayload = {
      type: hazardType,
      priority: priority,
      status: "REPORTED",
      description: description,
      assignedTo: assignedTo,
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
    <div className="min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="h-full"
      >
        <div className="relative z-50">
          <AppBar />
        </div>
        
        {/* Full Page Map - Base Layer */}
        <div className="w-full h-screen relative z-0">
          <MapSelector onLocationSelect={handleLocationSelect} />
          {showSlider && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
              <SlideToConfirm onConfirm={handleConfirm} />
            </div>
          )} 
        </div>
        
        {/* Alert Model Overlay - Floating on top */}
        <div className="absolute top-[200px] left-28 w-[450px] bg-white/95 backdrop-blur-sm text-zinc-900 shadow-xl rounded-lg border border-gray-200 overflow-y-auto max-h-[calc(100vh-120px)] z-40">
          <div className="p-4 space-y-4">
            <AlertHeaderCard lat={lat} lng={lng}/>
            <AlertLevelSetter/>
            <AddMoreAlertDetails/>
            <AlertCategorySelector/>
            <OtherOptions/>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
