import { WebSocket, WebSocketServer } from "ws";
import { Server as httpServer } from "http";
import { producer } from "./kafka/producer";
import { consumer } from "./kafka/consumer";
import { redisClient } from "./redis/init";
import { prismaClient } from "../db/db";
import { StatusReport } from "@prisma/client";

const clients = new Map<string, WebSocket>();

export const setUpSocketServer = (server: httpServer) => {
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (req, socket, head) => {
    const userId = req.url?.split("/")[1] as string;
    if (!userId) {
      socket.destroy();
      return;
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, userId);
    });
  });

  wss.on("connection", (socket: WebSocket, userId: string) => {
    clients.set(userId, socket);

    socket.send(
      JSON.stringify({
        type: "welcome",
        message: "Connected to Emergency Alert WS",
      })
    );

    socket.on("message", async (messages) => {
      try {
        const data = JSON.parse(messages.toString());

        if (data.type === "NEW_ALERT") {
          const alert = data.payload;
          const allowedPriorities = ["LOW", "MEDIUM", "HIGH"];
          if (!allowedPriorities.includes(alert.priority)) {
            socket.send(
              JSON.stringify({
                type: "error",
                message: "Invalid priority value",
              })
            );
            return;
          }
          const fullAlert = {
            ...alert,
            reportedBy:userId,
          };
          await producer.send({
            topic: "emergency-alerts",
            messages: [
              {
                key: "alert",
                value: JSON.stringify(fullAlert),
              },
            ],
          });
        }

        if (data.type === "UPDATE_ALERT_STATUS") {
          const { alertId, newStatus } = data.payload;

          if (!Object.values(StatusReport).includes(newStatus)) {
            socket.send(
              JSON.stringify({
                type: "error",
                message: `Invalid status. Must be one of: ${Object.values(StatusReport).join(",")}`,
              })
            );
            return;
          }

          try {
            const updatedAlert = await updateAlertStatus(alertId, newStatus);
            await redisClient.set(`alert:${alertId}`, JSON.stringify(updatedAlert));
            broadcast({ type: "ALERT_UPDATED", payload: updatedAlert });
            socket.send(
              JSON.stringify({
                type: "success",
                message: `Alert ${alertId} updated to ${newStatus}`,
              })
            );
          } catch (error) {
            socket.send(
              JSON.stringify({
                type: "error",
                message: "Failed to update alert",
              })
            );
          }
        }
      } catch (err) {
        socket.send(
          JSON.stringify({
            type: "error",
            message: "Invalid message format",
          })
        );
      }
    });
  });

  function broadcast(data: any) {
    const payload = JSON.stringify(data);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }

  const updateAlertStatus = async (alertId: string, newStatus: StatusReport) => {
    try {
      const updated = await prismaClient.emergency.update({
        where: { id: alertId },
        data: {
          status: { set: newStatus },
        },
      });
      return updated;
    } catch (err) {
      throw err;
    }
  };

  (async () => {
    await producer.connect();
    await consumer.connect();
    await consumer.subscribe({ topic: "emergency-alerts", fromBeginning: true });
    await consumer.subscribe({ topic: 'alert-updates' });

    await consumer.run({
      eachMessage: async ({ message ,topic}) => {
        if (!message.value) return;
        const alert = JSON.parse(message.value.toString());
        if (topic === "emergency-alerts") {
          try {
            await redisClient.set(`alert:${alert.id}`, JSON.stringify(alert));
  
            await prismaClient.emergency.create({
              data: {
                type: alert.type,
                reportedBy: alert.reportedBy,
                status: alert.status,
                assignedTo: alert.assignedTo,
                description: alert.description,
                priority: alert.priority,
                location: {
                  create: {
                    lat: alert.location.lat,
                    long: alert.location.long,
                  },
                },
              },
            });
          } catch (error) {
            console.error("Failed to store alert:", error);
          }
  
          if (alert.priority === "HIGH") {
            broadcast({ type: "HIGH_PRIORITY_ALERT", payload: alert });
          }
        }
        if (topic === "alert-updates") {
          const { id, newStatus } = JSON.parse(message.value.toString());
    
          const updated = await prismaClient.emergency.update({
            where: { id },
            data: { status: newStatus },
          });
    
          await redisClient.set(`alert:${id}`, JSON.stringify(updated));
          broadcast({ type: "ALERT_UPDATED", payload: updated });
        }
      },
    });
  })();
};
