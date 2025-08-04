"use client";
import { useEmergencySocket } from "@/app/Components/Sockets/SocketComponenet";
import { UseAlertListener } from "@/app/Components/Sockets/UseAlertListener";
import { useParams } from "next/navigation";
import { useState, useCallback } from "react";

export default function AlertListener() {
  const params = useParams();
  const userId: string = params[""]?.[0] || "";
  const userRole: string = params[""]?.[1] || "";
  const [receivedAlert, setReceivedAlert] = useState<string>("");
  const { sendEmergencyUpdate } = useEmergencySocket(userId,userRole);
  
  const handleMessage = useCallback((data: any) => {
    console.log("Received:", data.payload);
    if (data.type === "HIGH_PRIORITY_ALERT") {
      alert("HIGH PRIORITY ALERT: " + JSON.stringify(data.payload));
    }
    if (data.type === "UPDATE_ALERT_STATUS") {
      console.log("UPDATE_ALERT_STATUS:", data.payload);
    }
    setReceivedAlert(JSON.stringify(data.payload));
    console.log(parsedAlert.id);
    
    console.log(receivedAlert);
  }, []);
  UseAlertListener(userId, userRole, handleMessage);
  const parsedAlert = JSON.parse(receivedAlert || "{}");
  console.log(parsedAlert.type);  

  const handleUpdateAlert = () => {
    console.log(parsedAlert.id);
    const updateAlertPayload = {
      alertId:parsedAlert.id || "000fe115-5862-4fa0-9a16-2a4b1729deae",
      newStatus: "IN_PROCESS"
    };
    sendEmergencyUpdate(updateAlertPayload);

    console.log("Emergency Update Confirmed!"); 
  }

  return <div>
    
  </div>
}
