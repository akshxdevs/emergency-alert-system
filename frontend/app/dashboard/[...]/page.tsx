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
  }, []);

  UseAlertListener(userId, userRole, handleMessage);

  return (
    <div className="flex flex-col justify-center items-center h-screen text-black">
      <div className="p-10 bg-white">Listening for role: {userRole}</div>
      <p>{receivedAlert}</p>
    </div>
  );
}
