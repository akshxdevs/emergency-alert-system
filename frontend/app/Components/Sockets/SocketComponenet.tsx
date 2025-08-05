import { useEffect, useState, useCallback } from "react";

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
    const ws = new WebSocket(`ws://localhost:5000/${userId}/?${userRole}`);
    console.log(`Connecting as ${userRole} with userId: ${userId}`);
    
    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      console.log("Message from server:", data);

      if (data.type === "error") {
        alert(`Error: ${data.message}`);
      }

      if (data.type === "success") {
        alert(`Success: ${data.message}`);
      }

      if (data.type === "welcome") {
        console.log("Welcome message:", data.message);
      }

      // Handle role-specific alerts
      if (data.type === "CRIME" && userRole === "POLICE") {
        console.log("Police received CRIME alert:", data.payload);
        handleIncomingAlert(data.payload, "🚔 Police Alert", "New crime incident reported");
      }
      
      if (data.type === "FIRE" && userRole === "FIRE") {
        console.log("Fire received FIRE alert:", data.payload);
        handleIncomingAlert(data.payload, "🚒 Fire Alert", "New fire emergency reported");
      }
      
      if (data.type === "MEDICAL" && userRole === "MEDICAL") {
        console.log("Medical received MEDICAL alert:", data.payload);
        handleIncomingAlert(data.payload, "🚑 Medical Alert", "New medical emergency reported");
      }
      
      if (data.type === "ACCIDENT" && userRole === "POLICE") {
        console.log("Police received ACCIDENT alert:", data.payload);
        handleIncomingAlert(data.payload, "🚨 Accident Alert", "New accident reported");
      }

      if (data.type === "HIGH_PRIORITY_ALERT") {
        console.log("Received HIGH_PRIORITY_ALERT:", data.payload);
        handleIncomingAlert(data.payload, "🚨 HIGH PRIORITY ALERT", "Critical emergency reported");
      }
      
      if (data.type === "UPDATE_ALERT_STATUS") {
        console.log("Received UPDATE_ALERT_STATUS:", data.payload);
        handleAlertUpdate(data.payload);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [userId, userRole]);

  // Function to handle incoming alerts
  const handleIncomingAlert = useCallback((payload: Alert, title: string, message: string) => {
    console.log("Processing incoming alert:", payload);
    
    // Add to received alerts, but prevent duplicates
    setReceivedAlerts(prev => {
      // Check if alert already exists
      const existingAlert = prev.find(alert => alert.id === payload.id);
      if (existingAlert) {
        console.log("Alert already exists, skipping duplicate:", payload.id);
        return prev;
      }
      
      // Remove alerts older than 24 hours
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const filteredAlerts = prev.filter(alert => {
        const alertTime = new Date(alert.timeStamp);
        return alertTime > twentyFourHoursAgo;
      });
      
      const newAlerts = [payload, ...filteredAlerts];
      
      // Keep only the last 50 alerts to prevent memory issues
      if (newAlerts.length > 50) {
        newAlerts.splice(50);
      }
      
      console.log("Updated receivedAlerts:", newAlerts);
      return newAlerts;
    });
    
    // Show notification
    showAlertNotification(title, message, payload);
  }, []);

  // Function to handle alert updates
  const handleAlertUpdate = useCallback((payload: Alert) => {
    setReceivedAlerts(prev => 
      prev.map(alert => 
        alert.id === payload.id ? payload : alert
      )
    );
    
    showAlertNotification("📝 Status Update", "Alert status updated", payload);
  }, []);

  // Function to show alert notifications
  const showAlertNotification = (title: string, message: string, payload: Alert) => {
    // Create a custom notification
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
    
    // Remove notification after 10 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 10000);
    
    // Also show browser notification if available
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

// Dedicated hook for dashboard role-specific alerts
export const useDashboardSocket = (userId: string, userRole: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [receivedAlerts, setReceivedAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Only create socket if we have a valid userRole
    if (!userRole || !userId) {
      console.log("Dashboard: Skipping socket creation - missing userRole or userId");
      return;
    }

    // Create a unique userId for dashboard to avoid conflicts
    const dashboardUserId = `dashboard-${userRole}-${Date.now()}`;
    const ws = new WebSocket(`ws://localhost:5000/${dashboardUserId}/?${userRole}`);
    console.log(`Dashboard connecting as ${userRole} with userId: ${dashboardUserId}`);
    
    ws.onopen = () => {
      console.log("Dashboard WebSocket connected");
    };

    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      console.log("Dashboard received message:", data);

      if (data.type === "welcome") {
        console.log("Dashboard welcome message:", data.message);
      }

      // Handle role-specific alerts for dashboard
      if (data.type === "CRIME" && userRole === "POLICE") {
        console.log("Dashboard Police received CRIME alert:", data.payload);
        handleIncomingAlert(data.payload);
      }
      
      if (data.type === "FIRE" && userRole === "FIRE") {
        console.log("Dashboard Fire received FIRE alert:", data.payload);
        handleIncomingAlert(data.payload);
      }
      
      if (data.type === "MEDICAL" && userRole === "MEDICAL") {
        console.log("Dashboard Medical received MEDICAL alert:", data.payload);
        handleIncomingAlert(data.payload);
      }
      
      if (data.type === "ACCIDENT" && userRole === "POLICE") {
        console.log("Dashboard Police received ACCIDENT alert:", data.payload);
        handleIncomingAlert(data.payload);
      }

      if (data.type === "HIGH_PRIORITY_ALERT") {
        console.log("Dashboard received HIGH_PRIORITY_ALERT:", data.payload);
        handleIncomingAlert(data.payload);
      }
      
      if (data.type === "UPDATE_ALERT_STATUS") {
        console.log("Dashboard received UPDATE_ALERT_STATUS:", data.payload);
        handleAlertUpdate(data.payload);
      }
      if (data.type === "ALERT_CANCELLED") {
        console.log("Dashboard received ALERT_CANCELLED:", data.payload);
        handleAlertCancellation(data.payload);
      }
    };

    ws.onerror = (err) => {
      console.error("Dashboard WebSocket error:", err);
      console.error("Dashboard WebSocket URL was:", `ws://localhost:5000/${dashboardUserId}/?${userRole}`);
      console.error("Dashboard userId:", userId, "userRole:", userRole);
    };

    ws.onclose = (event) => {
      console.log("Dashboard WebSocket closed:", event.code, event.reason);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [userId, userRole]);

  // Function to handle incoming alerts for dashboard
  const handleIncomingAlert = useCallback((payload: Alert) => {
    console.log("Dashboard processing incoming alert:", payload);
    
    // Add to received alerts, but prevent duplicates
    setReceivedAlerts(prev => {
      // Check if alert already exists
      const existingAlert = prev.find(alert => alert.id === payload.id);
      if (existingAlert) {
        console.log("Dashboard: Alert already exists, skipping duplicate:", payload.id);
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
      console.log(`🔄 Updated alert ${payload.id} status to ${payload.status}`);
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
        console.log(`📋 Loading ${parsedAlerts.length} saved alerts for ${userRole}`);
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
        console.log(`🗑️ Cleared alerts for role: ${role}`);
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
            console.log(`⏰ Auto-removing alert: ${alert.id}`);
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
    console.log("Dashboard sending update:", alert);
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
    console.log("Dashboard sending cancel alert:", alertId);
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
