"use client";
import { UseAlertListener } from "@/app/Components/UseAlertListener";
import { useParams } from "next/navigation";
import { useState, useCallback } from "react";

export default function AlertListener() {
  const params = useParams();
  const userId: string = params[""]?.[0] || "";
  const userRole: string = params[""]?.[1] || "";
  const [receivedAlert, setReceivedAlert] = useState<string>("");
  const handleMessage = useCallback((data: any) => {
    console.log("Received:", data.payload);
    if (data.type === "HIGH_PRIORITY_ALERT") {
      alert("HIGH PRIORITY ALERT: " + JSON.stringify(data.payload));
    }
    if (data.type === "ALERT_UPDATED") {
      console.log("ALERT UPDATED:", data.payload);
    }
    setReceivedAlert(JSON.stringify(data.payload));
    console.log(receivedAlert);
  }, []);
  UseAlertListener(userId, userRole, handleMessage);
  const parsedAlert = JSON.parse(receivedAlert || "{}");
  console.log(parsedAlert.type);  
  return (
    <div className="flex flex-col justify-center items-center h-screen text-black">
      <div className="p-10 bg-white">Listening for role: {userRole === "police" || "POLICE" ? "👮🏻" : "NO ONE"}
        <p>{receivedAlert}</p>
        <div className="flex justify-between gap-3 border">
        <div className="p-5">
          <h1>Emergency Type: {parsedAlert.type || "asdasdasd"}</h1>
          <h2>Priority: {parsedAlert.priority || "adsasdasdads"}</h2>
          <p>Description: {parsedAlert.description || "Asdsadasdasd"}</p> 
          <p>ReportedBy : {parsedAlert.reportedBy || "adfadsfadfadsf"}</p>
        </div>
          <div className="flex py-5">
            <div className="py-2 my-6">
              <button className="border p-1 border-gray-900 rounded-md mx-2">✅</button>
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
