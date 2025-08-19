"use client";
import { AlertHeaderCard } from "@/app/Components/AlertModel/AlertHeaderCard";
import { AppBar } from "@/app/Components/Reusables/AppBar";
import MapSelector from "@/app/Components/MapPage/MapSelector";
import { useDashboardSocket } from "@/app/Components/Sockets/SocketComponenet";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
import { AlertIndicator } from "@/app/Components/Dashboard/AlertIndicator";

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
  autoDisappearAt?: number | null; // Added for auto-disappear functionality
}

export default function DashboardPage() {
  const {data:session} = useSession();
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [userId,setUserId] = useState<string|null>(null);
  const [userRole, setUserRole] = useState<string | null>();
  const [showAlertModel,setShowAlertModel] = useState(true);

  const [clearMarker, setClearMarker] = useState(false);
  const [isMapDragging, setIsMapDragging] = useState(false);
  const [selectedAlert] = useState<Alert | null>(null);
  const [showAlertDetails, setShowAlertDetails] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [isUpdatingAlert, setIsUpdatingAlert] = useState(false);
  const [updatingAlertId, setUpdatingAlertId] = useState<string | null>(null);
  const params = useParams();
  const [,setShowTimer] = useState(true);
  const [,setIstreat] = useState(true);

  useEffect(() => {
    const sessionUserId = session?.user?.id;
    const sessionUserRole = session?.user?.role;
    
    if (sessionUserId) {
      setUserId(sessionUserId);
    } else {
      setUserId("anonymous-user");
    }
    
    let determinedRole = null;
    
    if (sessionUserRole) {
      determinedRole = sessionUserRole.toUpperCase();
    } else {
      const urlSegments = params[""] as string[];
      
      if (urlSegments && urlSegments.length > 0) {
        const urlRole = urlSegments[0];
        
        const roleMapping: Record<string, string> = {
          "police": "POLICE",
          "fire": "FIRE", 
          "medical": "MEDICAL",
          "firefighter": "FIRE",
          "medic": "MEDICAL",
          "officer": "POLICE"
        };
        
        const validRoles = ["POLICE", "FIRE", "MEDICAL"];
        const normalizedRole = roleMapping[urlRole.toLowerCase()] || urlRole.toUpperCase();
        
        if (validRoles.includes(normalizedRole)) {
          determinedRole = normalizedRole;
        } else {
          console.error("Invalid role from URL:", urlRole, "Valid roles are:", validRoles);
          determinedRole = "POLICE"; // Default fallback
        }
      } else {
        determinedRole = "POLICE";
      }
    }
    
    const validRoles = ["POLICE", "FIRE", "MEDICAL"];
    if (determinedRole && validRoles.includes(determinedRole)) {
      setUserRole(determinedRole);
    } else {
      console.error("❌ Invalid determined role:", determinedRole, "Valid roles are:", validRoles);
      setUserRole("POLICE");
    }
    
  }, [session, params]);
  
  const { sendEmergencyUpdate, receivedAlerts, setReceivedAlerts, sendCancelAlert } = useDashboardSocket(userId || "anonymous-user", userRole || "POLICE");
  
  const handleLocationSelect = useCallback((lat: number, lng: number) => {
    setLat(lat);
    setLng(lng);
    setShowAlertModel(true);
  }, []);

  const handleDragChange = useCallback((isDragging: boolean) => {
    setIsMapDragging(isDragging);
  }, []);

  const handleUpdateAlertStatus = useCallback((alertId: string, newStatus: string) => {
    setIsUpdatingAlert(true);
    setUpdatingAlertId(alertId);
    
    const animateSlider = () => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 2;
        setSliderValue(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          
          const alertToUpdate = receivedAlerts.find(alert => alert.id === alertId);
          if (alertToUpdate) {
            const updatePayload = {
              ...alertToUpdate,
              status: newStatus
            };
            sendEmergencyUpdate(updatePayload);
          }
          

          setReceivedAlerts(prev => 
            prev.map(alert => 
              alert.id === alertId 
                ? { ...alert, status: newStatus }
                : alert
            )
          );
          
          setTimeout(() => {
            setIsUpdatingAlert(false);
            setUpdatingAlertId(null);
            setSliderValue(0);
          }, 500);
        }
      }, 20);
    };
    
    animateSlider();
    console.log(`Alert ${alertId} updated to ${newStatus}`);
  }, [sendEmergencyUpdate]);

  const handleCancelAlert = useCallback((alertId: string) => {
    if (confirm("Are you sure you want to cancel this emergency alert? This action cannot be undone.")) {
      setIsUpdatingAlert(true);
      setUpdatingAlertId(alertId);
      
      const animateSlider = () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 3;
          setSliderValue(progress);
          
          if (progress >= 100) {
            clearInterval(interval);
            
            sendCancelAlert(alertId);
            
            setTimeout(() => {
              setIsUpdatingAlert(false);
              setUpdatingAlertId(null);
              setSliderValue(0);
            }, 500);
          }
        }, 15);
      };
      
      animateSlider();
      console.log(`Alert ${alertId} cancelled`);
    }
  }, [sendCancelAlert]);

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



  const mapProps = useMemo(() => ({
    onLocationSelect: handleLocationSelect,
    externalLat: lat,
    externalLng: lng,
    clearMarker,
    onDragChange: handleDragChange,
  }), [handleLocationSelect, lat, lng, clearMarker, handleDragChange]);



  

  const getRemainingTime = (alert: Alert) => {
    if (!alert.autoDisappearAt) return null;
    const remaining = alert.autoDisappearAt - Date.now();
    if (remaining <= 0) return null;
    return Math.ceil(remaining / 1000); // Return seconds
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const CountdownTimer = ({ alert }: { alert: Alert }) => {
    const [timeLeft, setTimeLeft] = useState(getRemainingTime(alert));

    useEffect(() => {
      if (!alert.autoDisappearAt) return;

      const interval = setInterval(() => {
        const remaining = getRemainingTime(alert);
        setTimeLeft(remaining);
        
        if (remaining === null || remaining <= 0) {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }, [alert.autoDisappearAt]);

    if (!timeLeft || !alert.autoDisappearAt) return null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center space-x-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-2 h-2 bg-orange-500 rounded-full"
        />
        <span>Auto-remove in {formatTime(timeLeft)}</span>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 font-martianmono">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="h-full relative"
      >
        {/* Enhanced AppBar */}
        <div className="relative z-50">
          <AppBar />
        </div>

        {/* Enhanced Role Header with better styling */}
        <motion.div 
          initial={{ opacity: 0, x: -50, y: -20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`absolute top-[100px] left-5 z-40 max-w-[420px] w-full ${
            userRole === 'POLICE' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
            userRole === 'FIRE' ? 'bg-gradient-to-r from-red-500 to-red-600' :
            'bg-gradient-to-r from-emerald-500 to-emerald-600'
          } text-white px-6 py-4 rounded-xl shadow-2xl border border-white/20 backdrop-blur-sm`}
        >
          <div className="flex items-center space-x-4">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                repeatDelay: 2 
              }}
              className="text-3xl"
            >
              {userRole === 'POLICE' ? '🚔' : userRole === 'FIRE' ? '🚒' : '🚑'}
            </motion.div>
            <div>
              <h1 className="text-xl font-bold tracking-wide">
                {userRole === 'POLICE' ? 'Police Command Center' :
                 userRole === 'FIRE' ? 'Fire Department Hub' :
                 'Medical Emergency Station'}
              </h1>
              <p className="text-sm opacity-90 mt-1">
                Active Alerts: <span className="font-bold text-yellow-300">{receivedAlerts.length}</span>
              </p>
              <motion.div 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-xs opacity-75 mt-1"
              >
                {userRole === 'POLICE' ? 'Monitoring Crime & Accidents' :
                 userRole === 'FIRE' ? 'Monitoring Fire Emergencies' :
                 'Monitoring Medical Emergencies'}
              </motion.div>
              <div className="mt-2 text-xs opacity-60">
                <span className="bg-white/20 px-2 py-1 rounded-full">
                  Role: {userRole} | ID: {userId?.substring(0, 8)}...
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Map Container */}
        <div className="w-full h-screen relative z-0">
          <div className="relative h-full w-full">
            <MapSelector {...mapProps} />
            
            {/* Enhanced Drag Indicator */}
            <AnimatePresence>
              {isMapDragging && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  className="absolute top-4 right-4 z-50 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg border border-white/20"
                >
                  <div className="flex items-center space-x-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>🗺️ Dragging Map</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Enhanced Alert Management Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="absolute top-[250px] left-5 w-[420px] bg-white/95 backdrop-blur-md text-zinc-900 shadow-2xl rounded-2xl border border-white/30 overflow-hidden z-40"
        >
          {/* Panel Header */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <AlertHeaderCard lat={lat} lng={lng}/>
            <div className="flex flex-col items-center pt-2">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`w-3 h-3 rounded-full ${
                    receivedAlerts.length > 0 ? 'bg-red-500' : 'bg-green-500'
                  }`}
                />

                <h2 className="text-lg font-bold">Emergency Alerts</h2>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                  {receivedAlerts.length} Active
                </span>
              </div>
              <AlertIndicator threat={receivedAlerts.some(alert => alert.status !== 'RESOLVED')} />
            </div>
          </div>

          {/* Alerts Content */}
          <div className="p-6 max-h-[calc(100vh-280px)] overflow-y-auto">
            {receivedAlerts.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12 text-gray-500"
              >
                <motion.div 
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-6xl mb-4"
                >
                  📭
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">No Active Alerts</h3>
                <p className="text-sm opacity-75">Emergency alerts will appear here when civilians report incidents</p>
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mt-4 text-xs text-blue-500"
                >
                  Monitoring for {userRole} emergencies...
                </motion.div>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {receivedAlerts.map((alert, index) => (
                    <motion.div
                      key={`${alert.id}-${alert.timeStamp}-${index}`}
                      initial={{ opacity: 0, x: 50, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, x: 0, scale: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50, scale: 0.9, y: -20 }}
                      transition={{ 
                        duration: 0.6, 
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 100
                      }}
                      className={`p-5 rounded-xl border-l-4 shadow-lg hover:shadow-xl transition-all duration-300 ${
                        (typeof alert.priority === 'string' && alert.priority === 'HIGH') || alert.priority === 3 
                          ? 'border-red-500 bg-gradient-to-r from-red-50 to-red-100' :
                        (typeof alert.priority === 'string' && alert.priority === 'MEDIUM') || alert.priority === 2 
                          ? 'border-yellow-500 bg-gradient-to-r from-yellow-50 to-yellow-100' :
                          'border-green-500 bg-gradient-to-r from-green-50 to-green-100'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-lg">
                              {alert.type === 'CRIME' ? '🚔' : 
                               alert.type === 'FIRE' ? '🔥' : 
                               alert.type === 'MEDICAL' ? '🚑' : '⚠️'}
                            </span>
                            <h3 className="font-bold text-gray-800">{alert.type} Emergency</h3>
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                              (typeof alert.priority === 'string' && alert.priority === 'HIGH') || alert.priority === 3
                                ? 'bg-red-200 text-red-800' :
                              (typeof alert.priority === 'string' && alert.priority === 'MEDIUM') || alert.priority === 2
                                ? 'bg-yellow-200 text-yellow-800' :
                                'bg-green-200 text-green-800'
                            }`}>
                              {typeof alert.priority === 'string' ? alert.priority : 
                               alert.priority === 3 ? 'HIGH' : 
                               alert.priority === 2 ? 'MEDIUM' : 'LOW'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                          <p className="text-xs text-gray-500">
                            📍 {alert.location[0]?.lat?.toFixed(4)}, {alert.location[0]?.long?.toFixed(4)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            🕐 {new Date(alert.timeStamp).toLocaleString()}
                          </p>
                          
                          {/* Countdown Timer for auto-disappear alerts */}
                          {alert.autoDisappearAt && alert.status === 'REPORTED' && (
                            <div className="mt-2">
                              <CountdownTimer alert={alert} />
                            </div>
                          )}
                          
                          {/* Persistent Alert Indicator */}
                          {alert.status === 'IN_PROCESS' && (
                            <div className="mt-2">
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                              >
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                  className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full"
                                />
                                <span>Persistent Alert - Will stay until resolved</span>
                              </motion.div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                          (typeof alert.status === 'string' && alert.status === 'REPORTED') 
                            ? 'bg-yellow-200 text-yellow-800' :
                          (typeof alert.status === 'string' && alert.status === 'IN_PROCESS') 
                            ? 'bg-blue-200 text-blue-800' :
                            'bg-green-200 text-green-800'
                        }`}>
                          {alert.status === 'IN_PROCESS' ? '🔄 IN PROGRESS' : alert.status}
                        </span>
                        
                        <div className="flex space-x-2">
                          {(typeof alert.status === 'string' && alert.status === 'REPORTED') && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setShowTimer(false);
                                handleUpdateAlertStatus(alert.id, 'IN_PROCESS');
                              }}
                              className="px-3 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                              Start Response
                            </motion.button>
                          )}
                          {(typeof alert.status === 'string' && alert.status === 'IN_PROCESS') && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setIstreat(false);
                                handleUpdateAlertStatus(alert.id, 'RESOLVED')
                              }}
                              className="px-3 py-1 text-xs bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                              Resolve
                            </motion.button>
                          )}
                          {(typeof alert.status === 'string' && alert.status === 'REPORTED') && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleCancelAlert(alert.id)}
                              className="px-3 py-1 text-xs bg-red-500 text-white rounded-lg"
                            >
                              Cancel 
                            </motion.button>
                          )}
                        </div>
                      </div>

                      {/* Enhanced Slider for alert updates */}
                      {isUpdatingAlert && updatingAlertId === alert.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
                        >
                          <div className="flex items-center space-x-3 mb-3">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"
                            />
                            <span className="text-sm font-medium text-blue-700">Updating Alert Status...</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <motion.div
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
                              style={{ width: `${sliderValue}%` }}
                              transition={{ duration: 0.1 }}
                            />
                          </div>
                          <p className="text-xs text-blue-600 mt-2 text-center">{Math.round(sliderValue)}% Complete</p>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>

        {/* Enhanced Alert Details Modal */}
        <AnimatePresence>
          {selectedAlert && showAlertDetails && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-200"
              >
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Alert Details</h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowAlertDetails(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ✕
                  </motion.button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">
                      {selectedAlert.type === 'CRIME' ? '🚔' : 
                       selectedAlert.type === 'FIRE' ? '🔥' : 
                       selectedAlert.type === 'MEDICAL' ? '🚑' : '⚠️'}
                    </span>
                    <div>
                      <label className="font-semibold text-gray-600">Type:</label>
                      <p className="text-gray-800 font-medium">{selectedAlert.type}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="font-semibold text-gray-600">Description:</label>
                    <p className="text-gray-800">{selectedAlert.description}</p>
                  </div>
                  
                  <div>
                    <label className="font-semibold text-gray-600">Priority:</label>
                    <p className={`font-medium ${
                      (typeof selectedAlert.priority === 'string' && selectedAlert.priority === 'HIGH') || selectedAlert.priority === 3 ? 'text-red-600' :
                      (typeof selectedAlert.priority === 'string' && selectedAlert.priority === 'MEDIUM') || selectedAlert.priority === 2 ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {typeof selectedAlert.priority === 'string' ? selectedAlert.priority : 
                       selectedAlert.priority === 3 ? 'HIGH' : 
                       selectedAlert.priority === 2 ? 'MEDIUM' : 'LOW'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="font-semibold text-gray-600">Status:</label>
                    <p className="text-gray-800">{selectedAlert.status}</p>
                  </div>
                  
                  <div>
                    <label className="font-semibold text-gray-600">Location:</label>
                    <p className="text-gray-800">
                      📍 {selectedAlert.location[0]?.lat?.toFixed(4)}, {selectedAlert.location[0]?.long?.toFixed(4)}
                    </p>
                  </div>
                  
                  <div>
                    <label className="font-semibold text-gray-600">Reported:</label>
                    <p className="text-gray-800">🕐 {new Date(selectedAlert.timeStamp).toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-8">
                  {(typeof selectedAlert.status === 'string' && selectedAlert.status === 'REPORTED') && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        handleUpdateAlertStatus(selectedAlert.id, 'IN_PROCESS');
                        setShowAlertDetails(false);
                      }}
                      className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                    >
                      Start Response
                    </motion.button>
                  )}
                  {(typeof selectedAlert.status === 'string' && selectedAlert.status === 'IN_PROCESS') && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        handleUpdateAlertStatus(selectedAlert.id, 'RESOLVED');
                        setShowAlertDetails(false);
                      }}
                      className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
                    >
                      Mark Resolved
                    </motion.button>
                  )}
                  {(typeof selectedAlert.status === 'string' && selectedAlert.status === 'REPORTED') && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        handleCancelAlert(selectedAlert.id);
                        setShowAlertDetails(false);
                      }}
                      className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors font-medium animate-pulse-red"
                    >
                      Cancel Alert
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAlertDetails(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                  >
                    Close
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Enhanced Bottom Navigation Bar */}
        {/* Bottom Navigation Bar */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-[300px] bg-white/20 backdrop-blur-md text-zinc-900 shadow-lg border border-gray-200 rounded-full z-40">
          {showAlertModel && (
            <div className="px-6 py-1">
              <div className="flex justify-between items-center">
                {/* Notification Button */}
                <button className="group relative p-3 rounded-full bg-white/50 hover:bg-blue-50/80 transition-all duration-300 transform hover:scale-105 hover:shadow-md border border-gray-200/50">
                  <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                    </svg>

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

