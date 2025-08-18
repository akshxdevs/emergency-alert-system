"use client";
import { AlertCategorySelector } from "@/app/Components/AlertModel/AlertCategorySelector";
import { AlertHeaderCard } from "@/app/Components/AlertModel/AlertHeaderCard";
import { AlertLevelSetter } from "@/app/Components/AlertModel/AlertLevelSetter";
import { OtherOptions } from "@/app/Components/AlertModel/OtherOptions";
import { ReportButton } from "@/app/Components/AlertModel/ReportButton";
import { AppBar } from "@/app/Components/Reusables/AppBar";
import MapSelector from "@/app/Components/MapPage/MapSelector";
import { useEmergencySocket } from "@/app/Components/Sockets/SocketComponenet";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";

interface Alert {
  id: string;
  type: string;
  reportedBy: string;
  status: string;
  assignedTo: string;
  timeStamp: string;
  description: string;
  priority: string | number;
  location: Array<{ lat: number; long: number }>;
  autoDisappearAt?: number | null;
}

export default function HomePage() {
  const {data:session} = useSession();
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [hazardType, setHazardType] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [userId,setUserId] = useState<string|null>(null);
  const [userRole, setUserRole] = useState<string | any>();
  const [showAlertModel,setShowAlertModel] = useState(true);
  const [isNotificationAvailable,setIsNotificationAvailable] = useState(false);
  const [clearMarker, setClearMarker] = useState(false);
  const [isMapDragging, setIsMapDragging] = useState(false);
  const params = useParams();

  const roleAssignedTo: Record<string, string> = {
    CRIME: "POLICE",
    FIRE: "FIRE",
    MEDICAL: "MEDICAL",
    ACCIDENT: "POLICE",
    OTHER: "POLICE",
  };

  useEffect(() => {
    const sessionUserId = session?.user?.id;
    if (sessionUserId) {
      setUserId(sessionUserId);
    } else {
      setUserId("anonymous-user");
    }
    
    const role: string = params[""]?.[0] as string;
    setUserRole(role);
  }, [session, userRole]);
  
  const { sendEmergency } = useEmergencySocket(userId || "anonymous-user", userRole);

  const handleLocationSelect = useCallback((lat: number, lng: number) => {
    setLat(lat);
    setLng(lng);
    setShowAlertModel(true);
  }, []);

  const handleCategoryChange = useCallback((category: string | null) => {
    if (category) {
      setHazardType(category.toUpperCase());
    } else {
      setHazardType("");
    }
  }, []);

  const handleLevelChange = useCallback((level:string | null) => {
    if (level) {
      setPriority(level.toUpperCase());
    }else{
      setHazardType("");
    }
  }, []);

  const handleMoreDetails = useCallback((moreDetails:string | null) => {
    if (moreDetails) {
      setDescription(moreDetails.toUpperCase());
    }else{
      setDescription("");
    }
  }, []);

  const handleDragChange = useCallback((isDragging: boolean) => {
    setIsMapDragging(isDragging);
  }, []);

  const handleConfirm = useCallback(async () => {
    const assignedTo = roleAssignedTo[hazardType] || "OTHER";
    const alertPayload: Alert = {
      id: `alert-${Date.now()}`,
      type: hazardType,
      reportedBy: userId || "anonymous",
      priority: priority,
      status: "REPORTED",
      description: description,
      assignedTo: assignedTo,
      timeStamp: new Date().toISOString(),
      location: [{
        lat: lat || 0,
        long: lng || 0,
      }],
    };
    sendEmergency(alertPayload);
  }, [hazardType, priority, description, lat, lng, roleAssignedTo, sendEmergency, userId]);

  const handleLocationButtonClick = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLat(latitude);
          setLng(longitude);
        },
        (error) => {
          console.error("Location access denied:", error);
          alert("Please allow location access to use this feature.");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      alert("Geolocation is not supported by your browser.");
    }
  }, []);

  const handleClearMarker = useCallback(() => {
    setClearMarker(true);
    setLat(null);
    setLng(null);
    setTimeout(() => setClearMarker(false), 100);
  }, []);

  const handleToggleAlertModel = useCallback(() => {
    setShowAlertModel(!showAlertModel);
  }, [showAlertModel]);
  const mapProps = useMemo(() => ({
    onLocationSelect: handleLocationSelect,
    externalLat: lat,
    externalLng: lng,
    clearMarker,
    onDragChange: handleDragChange,
  }), [handleLocationSelect, lat, lng, clearMarker, handleDragChange]);

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
          <div className="relative h-full w-full">
            <MapSelector {...mapProps} />
            
            {/* Drag Indicator */}
            {isMapDragging && (
              <div className="absolute top-4 right-4 z-50 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg animate-pulse">
                🗺️ Dragging Map
              </div>
            )}
          </div>
        </div>
        
        {/* Alert Model Overlay - Floating on top */}
        <div className="absolute top-[100px] left-5 w-[400px] bg-white/95 backdrop-blur-sm text-zinc-900 shadow-xl rounded-lg border border-gray-200 overflow-y-auto max-h-[calc(100vh-120px)] z-40">
          {showAlertModel && (
            <div className="p-3 space-y-3 font-martianmono">
              <AlertHeaderCard lat={lat} lng={lng}/>
              <AlertLevelSetter onLevelChange={handleLevelChange}/>
              <AlertCategorySelector onCategoryChange={handleCategoryChange}/>
              <OtherOptions onAddingMoreDetails= {handleMoreDetails}/>
              <ReportButton onConfirm={handleConfirm}/>
            </div>          
          )}
        </div>
        {/* Bottom Navigation Bar */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-[400px] bg-white/20 backdrop-blur-md text-zinc-900 shadow-lg border border-gray-200 rounded-full z-40">
          {showAlertModel && (
            <div className="px-6 py-1">
              <div className="flex justify-between items-center">
                {/* Notification Button */}
                <button className="group relative p-3 rounded-full bg-white/50 hover:bg-blue-50/80 transition-all duration-300 transform hover:scale-105 hover:shadow-md border border-gray-200/50">
                  <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                    </svg>
                    {isNotificationAvailable &&(
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </button>

                {/* Home Button */}
                <button className="group relative p-3 rounded-full bg-blue-50/80 hover:bg-blue-100/90 transition-all duration-300 transform hover:scale-105 hover:shadow-md border border-blue-200/50">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                </button>

                {/* Location/Relocate Button */}
                <button 
                  onClick={handleLocationButtonClick}
                  className="group relative p-3 rounded-full bg-blue-500 hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-md border border-blue-400 shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white group-hover:text-white transition-colors duration-300">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <circle cx="12" cy="12" r="3" fill="currentColor"/>
                    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>

                {/* Clear Marker Button */}
                {(lat || lng) && (
                  <button
                    onClick={handleClearMarker}
                    className={`group relative p-3 rounded-full bg-gray-50/80 hover:bg-gray-100/90 transition-all duration-300 transform hover:scale-105 hover:shadow-md border border-gray-200/50 ${
                      isMapDragging ? 'animate-shake' : ''
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
