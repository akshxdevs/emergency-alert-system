"use client";
import { useEffect, useRef, useState } from "react";
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
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const maxReconnectAttempts = 5;

  const handleIncomingAlert = (alert: Alert, title: string, message: string) => {
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
  };

  const handleMessage = (data: any) => {
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
    } catch (error) {
      // Handle parsing error silently
    }
  };

  const connectWebSocket = () => {
    if (reconnectAttempts >= maxReconnectAttempts) {
      return;
    }

    try {
      const ws = new WebSocket(`${WS_URL}/${userId}/?${userRole}`);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setReconnectAttempts(0);
      };

      ws.onmessage = (event) => {
        handleMessage(event.data);
      };

      ws.onclose = () => {
        setIsConnected(false);
        setTimeout(() => {
          setReconnectAttempts(prev => prev + 1);
          connectWebSocket();
        }, 3000);
      };

      ws.onerror = () => {
        setIsConnected(false);
      };
    } catch (error) {
      setIsConnected(false);
    }
  };

  const sendMessage = (message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  const updateAlertStatus = (alertId: string, newStatus: string) => {
    sendMessage({
      type: "UPDATE_ALERT_STATUS",
      payload: {
        alertId,
        newStatus,
      },
    });
  };

  const cancelAlert = (alertId: string) => {
    sendMessage({
      type: "CANCEL_ALERT",
      payload: {
        alertId,
      },
    });
  };

  const reportEmergency = (alert: any) => {
    sendMessage({
      type: "REPORT_EMERGENCY",
      payload: alert,
    });
  };

  useEffect(() => {
    if (session?.user?.id && userRole) {
      connectWebSocket();
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [session?.user?.id, userRole]);

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
  onAlertReceived?: (alert: Alert) => void;
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
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [receivedAlerts, setReceivedAlerts] = useState<Alert[]>([]);
  const maxReconnectAttempts = 5;

  const handleIncomingAlert = (alert: Alert, title: string, message: string) => {
    setReceivedAlerts(prev => [...prev, alert]);
    
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
  };

  const handleMessage = (data: any) => {
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
    } catch (error) {
      // Handle parsing error silently
    }
  };

  const connectWebSocket = () => {
    if (reconnectAttempts >= maxReconnectAttempts) {
      return;
    }

    try {
      const dashboardUserId = userId;
      const ws = new WebSocket(`${WS_URL}/${dashboardUserId}/?${userRole}`);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setReconnectAttempts(0);
      };

      ws.onmessage = (event) => {
        handleMessage(event.data);
      };

      ws.onclose = () => {
        setIsConnected(false);
        setTimeout(() => {
          setReconnectAttempts(prev => prev + 1);
          connectWebSocket();
        }, 3000);
      };

      ws.onerror = () => {
        setIsConnected(false);
      };
    } catch (error) {
      setIsConnected(false);
    }
  };

  const sendMessage = (message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  const updateAlertStatus = (alertId: string, newStatus: string) => {
    sendMessage({
      type: "UPDATE_ALERT_STATUS",
      payload: {
        alertId,
        newStatus,
      },
    });
  };

  const cancelAlert = (alertId: string) => {
    sendMessage({
      type: "CANCEL_ALERT",
      payload: {
        alertId,
      },
    });
  };

  const loadSavedAlerts = async () => {
    try {
      const savedAlerts = localStorage.getItem(`alerts_${userId}`);
      if (savedAlerts) {
        const parsedAlerts = JSON.parse(savedAlerts);
        setReceivedAlerts(parsedAlerts);
      }
    } catch (error) {
      // Handle error silently
    }
  };

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
  }, [session?.user?.id, userRole]);

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
