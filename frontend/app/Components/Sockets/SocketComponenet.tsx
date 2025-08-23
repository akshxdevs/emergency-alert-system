"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { WS_URL } from "../../../config";

interface Alert {
  id: string;
  type: string;
  status: string;
  priority: string;
  description: string;
  reportedBy: string;
  assignedTo: string;
  location: {
    lat: number;
    long: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface SocketComponentProps {
  userId: string;
  userRole: string;
  onAlertReceived?: (alert: Alert) => void;
  onAlertUpdate?: (alertId: string, newStatus: string) => void;
  onAlertCancel?: (alertId: string) => void;
}

export default function SocketComponent({
  userId,
  userRole,
  onAlertReceived,
  onAlertUpdate,
  onAlertCancel,
}: SocketComponentProps) {
  const { data: session } = useSession();
  const wsRef = useRef<WebSocket | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const maxReconnectAttempts = 5;

  const handleIncomingAlert = useCallback((alert: Alert, title: string, message: string) => {
    if (onAlertReceived) {
      onAlertReceived(alert);
    }

    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body: message,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
      });
    }
  }, [onAlertReceived]);

  const handleMessage = useCallback((data: string) => {
    try {
      const parsedData = JSON.parse(data);
      
      switch (parsedData.type) {
        case "EMERGENCY_ALERT":
          handleIncomingAlert(parsedData.payload, "Police Alert", "New crime incident reported");
          break;
        case "FIRE_ALERT":
          handleIncomingAlert(parsedData.payload, "Fire Alert", "New fire emergency reported");
          break;
        case "MEDICAL_ALERT":
          handleIncomingAlert(parsedData.payload, "Medical Alert", "New medical emergency reported");
          break;
        case "ALERT_UPDATED":
          if (onAlertUpdate) {
            onAlertUpdate(parsedData.payload.id, parsedData.payload.status);
          }
          break;
        case "ALERT_CANCELLED":
          if (onAlertCancel) {
            onAlertCancel(parsedData.payload.id);
          }
          break;
        default:
          break;
      }
    } catch {
    }
  }, [handleIncomingAlert, onAlertUpdate, onAlertCancel]);

  const connectWebSocket = useCallback(() => {
    if (reconnectAttempts >= maxReconnectAttempts) {
      return;
    }

    try {
      const ws = new WebSocket(`${WS_URL}/${userId}/?${userRole}`);
      wsRef.current = ws;

      ws.onopen = () => {
        setReconnectAttempts(0);
      };

      ws.onmessage = (event) => {
        handleMessage(event.data);
      };

      ws.onclose = () => {
        setTimeout(() => {
          setReconnectAttempts(prev => prev + 1);
          connectWebSocket();
        }, 3000);
      };

      ws.onerror = () => {
      };
    } catch {
    }
  }, [userId, userRole, reconnectAttempts, maxReconnectAttempts, handleMessage]);

  useEffect(() => {
    if (session?.user?.id && userRole) {
      connectWebSocket();
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [session?.user?.id, userRole, connectWebSocket]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  return null;
}

interface DashboardSocketComponentProps {
  userId: string;
  userRole: string;
  onAlertReceived?: (alert: Record<string, unknown>) => void;
  onAlertUpdate?: (alertId: string, newStatus: string) => void;
  onAlertCancel?: (alertId: string) => void;
}

export function DashboardSocketComponent({
  userId,
  userRole,
  onAlertReceived,
  onAlertUpdate,
  onAlertCancel,
}: DashboardSocketComponentProps) {
  const { data: session } = useSession();
  const wsRef = useRef<WebSocket | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [receivedAlerts, setReceivedAlerts] = useState<Alert[]>([]);
  const maxReconnectAttempts = 5;

  const handleIncomingAlert = useCallback((alert: Alert, title: string, message: string) => {
    setReceivedAlerts(prev => [...prev, alert]);
    
    if (onAlertReceived) {
      onAlertReceived(alert as unknown as Record<string, unknown>);
    }

    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body: message,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
      });
    }
  }, [onAlertReceived]);

  const handleMessage = useCallback((data: string) => {
    try {
      const parsedData = JSON.parse(data);
      
      switch (parsedData.type) {
        case "EMERGENCY_ALERT":
          handleIncomingAlert(parsedData.payload, "Police Alert", "New crime incident reported");
          break;
        case "FIRE_ALERT":
          handleIncomingAlert(parsedData.payload, "Fire Alert", "New fire emergency reported");
          break;
        case "MEDICAL_ALERT":
          handleIncomingAlert(parsedData.payload, "Medical Alert", "New medical emergency reported");
          break;
        case "ALERT_UPDATED":
          setReceivedAlerts(prev => 
            prev.map(alert => 
              alert.id === parsedData.payload.id 
                ? { ...alert, status: parsedData.payload.status }
                : alert
            )
          );
          if (onAlertUpdate) {
            onAlertUpdate(parsedData.payload.id, parsedData.payload.status);
          }
          break;
        case "ALERT_CANCELLED":
          setReceivedAlerts(prev => 
            prev.filter(alert => alert.id !== parsedData.payload.id)
          );
          if (onAlertCancel) {
            onAlertCancel(parsedData.payload.id);
          }
          break;
        default:
          break;
      }
    } catch {
    }
  }, [handleIncomingAlert, onAlertUpdate, onAlertCancel]);

  const connectWebSocket = useCallback(() => {
    if (reconnectAttempts >= maxReconnectAttempts) {
      return;
    }

    try {
      const dashboardUserId = userId;
      const ws = new WebSocket(`${WS_URL}/${dashboardUserId}/?${userRole}`);
      wsRef.current = ws;

      ws.onopen = () => {
        setReconnectAttempts(0);
      };

      ws.onmessage = (event) => {
        handleMessage(event.data);
      };

      ws.onclose = () => {
        setTimeout(() => {
          setReconnectAttempts(prev => prev + 1);
          connectWebSocket();
        }, 3000);
      };

      ws.onerror = () => {
      };
    } catch {
    }
  }, [userId, userRole, reconnectAttempts, maxReconnectAttempts, handleMessage]);

  const loadSavedAlerts = useCallback(async () => {
    try {
      const savedAlerts = localStorage.getItem(`alerts_${userId}`);
      if (savedAlerts) {
        const parsedAlerts = JSON.parse(savedAlerts);
        setReceivedAlerts(parsedAlerts);
      }
    } catch {
    }
  }, [userId]);

  useEffect(() => {
    if (session?.user?.id && userRole) {
      connectWebSocket();
      loadSavedAlerts();
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [session?.user?.id, userRole, connectWebSocket, loadSavedAlerts]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(`alerts_${userId}`, JSON.stringify(receivedAlerts));
  }, [receivedAlerts, userId]);

  return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useEmergencySocket = (_userId: string, _userRole: string) => {
  const sendMessage = useCallback((message: Record<string, unknown>) => {
    console.log('Sending emergency message:', message);
  }, []);

  const sendEmergency = useCallback((alert: Record<string, unknown>) => {
    sendMessage({
      type: "REPORT_EMERGENCY",
      payload: alert,
    });
  }, [sendMessage]);

  return { sendEmergency };
};
