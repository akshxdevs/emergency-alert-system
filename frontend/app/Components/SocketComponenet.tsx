import { useEffect, useState } from "react";

export const useEmergencySocket = (userId: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:3000/${userId}`);
    console.log(userId);
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

      if (data.type === "HIGH_PRIORITY_ALERT") {
        alert("HIGH PRIORITY ALERT: " + JSON.stringify(data.payload));
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
  }, [userId]);

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

  return { sendEmergency };
};
