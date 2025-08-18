import { useEffect, useState, useCallback } from "react";
import { BACKEND_URL, WS_URL } from "../../../config";

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
  receivedAt?: number;
  autoDisappearAt?: number | null;
}

export const useEmergencySocket = (userId: string, userRole: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [receivedAlerts, setReceivedAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}/${userId}/?${userRole}`);
    ws.onopen = () => {};

    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);

      if (data.type === "error") {
        alert(`Error: ${data.message}`);
      }

      if (data.type === "success") {
        alert(`Success: ${data.message}`);
      }

      if (data.type === "welcome") {}

      // Handle role-specific alerts
      if (data.type === "CRIME" && userRole === "POLICE") {
        handleIncomingAlert(data.payload, "🚔 Police Alert", "New crime incident reported");
      }
      
      if (data.type === "FIRE" && userRole === "FIRE") {
        handleIncomingAlert(data.payload, "🚒 Fire Alert", "New fire emergency reported");
      }
      
      if (data.type === "MEDICAL" && userRole === "MEDICAL") {
        handleIncomingAlert(data.payload, "🚑 Medical Alert", "New medical emergency reported");
      }
      
      if (data.type === "ACCIDENT" && userRole === "POLICE") {
        handleIncomingAlert(data.payload, "🚨 Accident Alert", "New accident reported");
      }

      if (data.type === "HIGH_PRIORITY_ALERT") {
        handleIncomingAlert(data.payload, "🚨 HIGH PRIORITY ALERT", "Critical emergency reported");
      }
      
      if (data.type === "UPDATE_ALERT_STATUS") {
        handleAlertUpdate(data.payload);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    ws.onclose = () => {};

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [userId, userRole]);

  const handleIncomingAlert = useCallback((payload: Alert, title: string, message: string) => {
    setReceivedAlerts(prev => {
      const existingAlert = prev.find(alert => alert.id === payload.id);
      if (existingAlert) {
        return prev;
      }
      
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const filteredAlerts = prev.filter(alert => {
        const alertTime = new Date(alert.timeStamp);
        return alertTime > twentyFourHoursAgo;
      });
      
      const newAlerts = [payload, ...filteredAlerts];
      
      if (newAlerts.length > 50) {
        newAlerts.splice(50);
      }
      
      return newAlerts;
    });
    
    showAlertNotification(title, message, payload);
  }, []);

  const handleAlertUpdate = useCallback((payload: Alert) => {
    setReceivedAlerts(prev => 
      prev.map(alert => 
        alert.id === payload.id ? payload : alert
      )
    );
    
    showAlertNotification("📝 Status Update", "Alert status updated", payload);
  }, []);

  const showAlertNotification = (title: string, message: string, payload: Alert) => {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm';
    notification.innerHTML = `
      <div class="flex items-center space-x-2">
        <div class="text-xl">${title}</div>
      </div>
      <div class="mt-2 text-sm">${message}</div>
      <div class="mt-2 text-xs opacity-75">
        Location: ${payload.location?.[0]?.lat?.toFixed(4)}, ${payload.location?.[0]?.long?.toFixed(4)}
      </div>
      <div class="mt-2 text-xs opacity-75">
        Priority: ${typeof payload.priority === 'string' ? payload.priority : payload.priority === 3 ? 'HIGH' : payload.priority === 2 ? 'MEDIUM' : 'LOW'}
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 10000);
    
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/favicon.ico'
      });
    }
  };

  const sendEmergency = (alert: any) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error("Socket not open");
      return;
    }
    socket.send(
      JSON.stringify({
        type: "NEW_ALERT",
        payload: alert,
      })
    );
  };
  
  const sendEmergencyUpdate = (alert: any) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error("Socket not open");
      return;
    }
    console.log(alert);
    socket.send(
      JSON.stringify({
        type: "UPDATE_ALERT_STATUS",
        payload: alert,
      })
    );
  };
  
  return { 
    sendEmergency, 
    sendEmergencyUpdate, 
    receivedAlerts, 
    setReceivedAlerts 
  };
};

export const useDashboardSocket = (userId: string, userRole: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [receivedAlerts, setReceivedAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    if (!userRole || !userId) {
      return;
    }

    const dashboardUserId = `dashboard-${userRole}-${Date.now()}`;
    const ws = new WebSocket(`${WS_URL}/${dashboardUserId}/?${userRole}`);
    
    ws.onopen = () => {};

    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);

      if (data.type === "welcome") {}

      // Handle role-specific alerts for dashboard
      if (data.type === "CRIME" && userRole === "POLICE") {
        handleIncomingAlert(data.payload);
      }
      
      if (data.type === "FIRE" && userRole === "FIRE") {
        handleIncomingAlert(data.payload);
      }
      
      if (data.type === "MEDICAL" && userRole === "MEDICAL") {
        handleIncomingAlert(data.payload);
      }
      
      if (data.type === "ACCIDENT" && userRole === "POLICE") {
        handleIncomingAlert(data.payload);
      }

      if (data.type === "HIGH_PRIORITY_ALERT") {
        handleIncomingAlert(data.payload);
      }
      
      if (data.type === "UPDATE_ALERT_STATUS") {
        handleAlertUpdate(data.payload);
      }
      if (data.type === "ALERT_CANCELLED") {
        handleAlertCancellation(data.payload);
      }
    };

    ws.onerror = (err) => {
      console.error("Dashboard WebSocket error:", err);
              console.error("Dashboard WebSocket URL was:", `${WS_URL}/${dashboardUserId}/?${userRole}`);
      console.error("Dashboard userId:", userId, "userRole:", userRole);
    };

    ws.onclose = (event) => {};

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [userId, userRole]);

  const handleIncomingAlert = useCallback((payload: Alert) => {
    setReceivedAlerts(prev => {
      const existingAlert = prev.find(alert => alert.id === payload.id);
      if (existingAlert) {
        return prev;
      }
      
      // Add timestamp for auto-disappear functionality
      const alertWithTimestamp = {
        ...payload,
        receivedAt: Date.now(),
        autoDisappearAt: Date.now() + (2 * 60 * 1000) // 2 minutes from now
      };
      
      // Remove alerts older than 24 hours
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const filteredAlerts = prev.filter(alert => {
        const alertTime = new Date(alert.timeStamp);
        return alertTime > twentyFourHoursAgo;
      });
      
      const newAlerts = [alertWithTimestamp, ...filteredAlerts];
      
      // Keep only the last 50 alerts to prevent memory issues
      if (newAlerts.length > 50) {
        newAlerts.splice(50);
      }
      
      // Save to localStorage
      localStorage.setItem(`dashboard-alerts-${userRole}`, JSON.stringify(newAlerts));
      
      console.log("Dashboard updated receivedAlerts:", newAlerts);
      return newAlerts;
    });
  }, [userRole]);

  // Function to handle alert updates for dashboard
  const handleAlertUpdate = useCallback((payload: Alert) => {
    setReceivedAlerts(prev => {
      const updated = prev.map(alert => 
        alert.id === payload.id 
          ? { 
              ...payload, 
              receivedAt: alert.receivedAt, 
              autoDisappearAt: payload.status === 'IN_PROCESS' ? null : alert.autoDisappearAt 
            } 
          : alert
      );
      
      // Save to localStorage
      localStorage.setItem(`dashboard-alerts-${userRole}`, JSON.stringify(updated));
      return updated;
    });
  }, [userRole]);

  // Function to handle alert cancellation for dashboard
  const handleAlertCancellation = useCallback((payload: Alert) => {
    setReceivedAlerts(prev => {
      const filtered = prev.filter(alert => alert.id !== payload.id);
      
      // Save to localStorage
      localStorage.setItem(`dashboard-alerts-${userRole}`, JSON.stringify(filtered));
      return filtered;
    });
  }, [userRole]);

  // Load alerts from localStorage on mount
  useEffect(() => {
    const savedAlerts = localStorage.getItem(`dashboard-alerts-${userRole}`);
    if (savedAlerts) {
      try {
        const parsedAlerts = JSON.parse(savedAlerts);
        setReceivedAlerts(parsedAlerts);
      } catch (error) {
        console.error("Error loading saved alerts:", error);
        localStorage.removeItem(`dashboard-alerts-${userRole}`);
      }
    }
  }, [userRole]);

  // Clear alerts from other roles when role changes
  useEffect(() => {
    const roles = ["POLICE", "FIRE", "MEDICAL"];
    roles.forEach(role => {
      if (role !== userRole) {
        localStorage.removeItem(`dashboard-alerts-${role}`);
      }
    });
  }, [userRole]);

  // Auto-disappear timer for new alerts
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setReceivedAlerts(prev => {
        const filtered = prev.filter(alert => {
          // Keep IN_PROCESS alerts until resolved
          if (alert.status === 'IN_PROCESS') {
            return true;
          }
          
          // Remove alerts that have passed their auto-disappear time
          if (alert.autoDisappearAt && now > alert.autoDisappearAt) {
            return false;
          }
          
          return true;
        });
        
        // Save to localStorage
        localStorage.setItem(`dashboard-alerts-${userRole}`, JSON.stringify(filtered));
        return filtered;
      });
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [userRole]);

  const sendEmergencyUpdate = (alert: any) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error("Dashboard Socket not open");
      return;
    }
    socket.send(
      JSON.stringify({
        type: "UPDATE_ALERT_STATUS",
        payload: alert,
      })
    );
  };

  const sendCancelAlert = (alertId: string) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error("Dashboard Socket not open");
      return;
    }
    socket.send(
      JSON.stringify({
        type: "CANCEL_ALERT",
        payload: { alertId },
      })
    );
  };
  
  return { 
    sendEmergencyUpdate, 
    receivedAlerts, 
    setReceivedAlerts,
    sendCancelAlert
  };
};
