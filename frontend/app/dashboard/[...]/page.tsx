"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import RoleHeader from "../../Components/Dashboard/RoleHeader";
import AlertPanel from "../../Components/Dashboard/AlertPanel";
import BottomNavigation from "../../Components/Dashboard/BottomNavigation";
import { DashboardSocketComponent } from "../../Components/Sockets/SocketComponenet";

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

const validRoles = ["police", "fire", "medical"];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const urlRole = Array.isArray(params) ? params[0] : params?.role;
  const userId = Array.isArray(params) ? params[1] : params?.userId;

  const determineRole = (urlRole: string): string => {
    const roleMap: { [key: string]: string } = {
      police: "POLICE",
      fire: "FIRE",
      medical: "MEDICAL",
    };
    return roleMap[urlRole] || "POLICE";
  };

  const determinedRole = determineRole(urlRole as string);

  useEffect(() => {
    if (!validRoles.includes(urlRole as string)) {
      return;
    }

    if (determinedRole && !validRoles.includes(determinedRole.toLowerCase())) {
      return;
    }

    if (status === "loading") return;

    if (!session?.user?.id) {
      return;
    }

    setIsLoading(false);
  }, [session, status, urlRole, determinedRole]);

  const handleAlertReceived = (alert: any) => {
    const convertedAlert: Alert = {
      id: alert.id,
      type: alert.type,
      reportedBy: alert.reportedBy,
      status: alert.status,
      assignedTo: alert.assignedTo || "",
      timeStamp: alert.createdAt || new Date().toISOString(),
      description: alert.description,
      priority: alert.priority,
      location: Array.isArray(alert.location) ? alert.location : [alert.location],
      autoDisappearAt: null
    };
    setAlerts(prev => [convertedAlert, ...prev]);
  };

  const handleAlertUpdate = (alertId: string, newStatus: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: newStatus }
          : alert
      )
    );
  };

  const handleAlertCancel = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const updateAlertStatus = (alertId: string, newStatus: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: newStatus }
          : alert
      )
    );
  };

  const cancelAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!session?.user?.id) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <p>Please sign in to access the dashboard</p>
        </div>
      </div>
    );
  }

  if (!validRoles.includes(urlRole as string)) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <p>Invalid role</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <DashboardSocketComponent
        userId={session.user.id}
        userRole={determinedRole}
        onAlertReceived={handleAlertReceived}
        onAlertUpdate={handleAlertUpdate}
        onAlertCancel={handleAlertCancel}
      />
      
      <RoleHeader 
        userRole={determinedRole} 
        receivedAlerts={alerts}
      />
      
      <AlertPanel 
        receivedAlerts={alerts}
        userRole={determinedRole}
        onUpdateStatus={updateAlertStatus}
        onCancelAlert={cancelAlert}
        onShowLocation={() => {}}
        onShareToMaps={() => {}}
        onViewDetails={() => {}}
        isUpdatingAlert={false}
        updatingAlertId={null}
        sliderValue={0}
        CountdownTimer={() => null}
      />
      
      <BottomNavigation 
        showAlertModel={true}
        isNotificationAvailable={false}
        lat={null}
        lng={null}
        isMapDragging={false}
        onLocationButtonClick={() => {}}
        onClearMarker={() => {}}
        onClearLocation={() => {}}
      />
    </div>
  );
}

