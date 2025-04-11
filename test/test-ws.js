// test-socket.ts
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("✅ Connected:", socket.id);
  socket.send("Hello from client!");
});

socket.on("message", (data) => {
  console.log("📨 Message from server:", data);
});

socket.on("disconnect", () => {
  console.log("❌ Disconnected from server");
});
