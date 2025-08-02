"use client";
import { AlertCategorySelector } from "@/app/Components/AlertModel/AlertCategorySelector";
import { AlertHeaderCard } from "@/app/Components/AlertModel/AlertHeaderCard";
import { AlertLevelSetter } from "@/app/Components/AlertModel/AlertLevelSetter";
import { OtherOptions } from "@/app/Components/AlertModel/OtherOptions";
import { ReportButton } from "@/app/Components/AlertModel/ReportButton";
import { AppBar } from "@/app/Components/Reusables/AppBar";
import MapSelector from "@/app/Components/MainPage/MapSelector";
import { useEmergencySocket } from "@/app/Components/Sockets/SocketComponenet";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function () {
  const {data:session} = useSession();
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [hazardType, setHazardType] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [userId,setUserId] = useState<string|null>(null);
  const [userRole, setUserRole] = useState<string | any>();
  const [showAlertModel,setShowAlertModel] = useState(true);
  const params = useParams();

  const roleAssignedTo: Record<string, string> = {
    CRIME: "POLICE",
    FIRE: "FIRE",
    MEDICAL: "MEDICAL",
  };

  useEffect(() => {
    const sessionUserId = session?.user?.id;
    if (sessionUserId) {
      setUserId(sessionUserId);
    } else {
      // Fallback to a default user ID if session is not available
      setUserId("anonymous-user");
    }
    
    const role: string = params[""]?.[0] as string;
    setUserRole(role);
  }, [session, userRole]);
  
  console.log("Current userId:", userId);
  
  const { sendEmergency } = useEmergencySocket(userId || "anonymous-user", userRole);

  const handleLocationSelect = (lat: number, lng: number) => {
    console.log("Selected Location:", lat, lng);
    setLat(lat);
    setLng(lng);
    setShowAlertModel(true);
  };

  const handleCategoryChange = (category: string | null) => {
    if (category) {
      setHazardType(category.toUpperCase());
      console.log("Hazard type set to:", category.toUpperCase());
    } else {
      setHazardType("");
    }
  };

  const handleLevelChange = (level:string | null) => {
    if (level) {
      setPriority(level.toUpperCase());
      console.log("Priority Level set to: ",level.toUpperCase());
    }else{
      setHazardType("");
    }
  };
  const handleMoreDetails = (moreDetails:string | null) => {
    if (moreDetails) {
      setDescription(moreDetails.toUpperCase());
      console.log("Description Details: ",moreDetails.toUpperCase());
    }else{
      setDescription("");
    }
  }

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
  };

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
        </div>
        
        {/* Alert Model Overlay - Floating on top */}
        <div className="absolute top-[120px] left-5 w-[400px] bg-white/95 backdrop-blur-sm text-zinc-900 shadow-xl rounded-lg border border-gray-200 overflow-y-auto max-h-[calc(100vh-120px)] z-40">
          {showAlertModel && (
            <div className="p-3 space-y-3">
              <AlertHeaderCard lat={lat} lng={lng}/>
              <AlertLevelSetter onLevelChange={handleLevelChange}/>
              <AlertCategorySelector onCategoryChange={handleCategoryChange}/>
              <OtherOptions onAddingMoreDetails= {handleMoreDetails}/>
              <ReportButton onConfirm={handleConfirm}/>
            </div>          
          )}
        </div>
        <div className="absolute top-[970px] left-5 w-[400px] bg-white/95 backdrop-blur-sm text-zinc-900 shadow-xl rounded-lg border border-gray-200 overflow-y-auto max-h-[calc(100vh-120px)] z-40">
          {showAlertModel && (
            <div className="px-3 py-5 space-y-3">
              <div className="flex justify-between px-20">
                                <button>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                  </svg>
                </button>
                <button>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                </button>
                <button>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
              </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
