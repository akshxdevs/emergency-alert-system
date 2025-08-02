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

  return (
    <div className="flex flex-col justify-center items-center h-screen text-black">
      <div className="p-10 bg-white">Listening for role: {userRole.toLocaleUpperCase()==="POLICE" ? "👮🏻" : userRole.toLocaleUpperCase() === "MEDICAl" ? "🧑‍⚕️" : "🧑🏻‍🚒"}
        <p>{receivedAlert}</p>
        <div className="flex justify-between gap-3 border">
        <div className="p-5">
          <h1>Emergency Type: {parsedAlert.type || ""}</h1>
          <h2>Priority: {parsedAlert.priority || ""}</h2>
          <p>Description: {parsedAlert.description || ""}</p> 
          <p>ReportedBy : {parsedAlert.reportedBy || ""}</p>
        </div>
          <div className="flex py-5">
            <div className="py-2 my-6">
              <button className="border p-1 border-gray-900 rounded-md mx-2" onClick={()=>{
                handleUpdateAlert();
              }}>✅</button>
            </div>
            <div className="py-2 my-6">
              <button className="border p-1 border-gray-900 rounded-md mx-2">❌</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
