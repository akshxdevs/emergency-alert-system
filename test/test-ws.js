const socket = new WebSocket("ws://localhost:3000/user123");

socket.onopen = () => {
  console.log("✅ Connected to WebSocket server");

  const alert = {
    id: "alert-001",
    type: "CRIME",
    reportedBy: "user123",
    assignedTo: "POLICE",
    status: "REPORT",
    timeStamp: new Date().toISOString(),
    description: "🚨 Suspicious activity spotted!"
  };

  socket.send(JSON.stringify(alert));
};

socket.onmessage = (msg) => {
  const data = JSON.parse(msg.data);
  console.log("📡 Incoming message:", data);
};
