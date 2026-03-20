const WebSocket = require("ws");

const socket = new WebSocket("ws://localhost:5000/user123/?POLICE");

socket.onopen = () => {
  console.log("✅ Connected to WebSocket server");

  const alert = {
    id: "alert-001",
    type: "CRIME",
    reportedBy: "user123",
    assignedTo: "POLICE",
    status: "REPORTED",
    priority: "HIGH",
    timeStamp: new Date().toISOString(),
    description: "Suspicious activity spotted",
    location: {
      lat: 28.6139,
      long: 77.2090,
    },
  };

  socket.send(JSON.stringify({
    type: "NEW_ALERT",
    payload: alert,
  }));
};

socket.onmessage = (msg) => {
  const data = JSON.parse(msg.data);
  console.log("📡 Incoming message:", data);
};
