import { WebSocket, WebSocketServer } from "ws";
import { Server as httpServer } from "http";
import { producer } from "./kafka/producer";
import { consumer } from "./kafka/consumer";
import { redisClient } from "./redis/init";
import { prismaClient } from "../db/db";
import { StatusReport } from "@prisma/client";

const clients = new Map<string, WebSocket>();
const roleClients = new Map<string, Set<WebSocket>>();

export const setUpSocketServer = (server: httpServer) => {
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (req, socket, head) => {
    const userId = req.url?.split("/")[1] as string;
    const userRole = req.url?.split("/?")[1] as string;
    if (!userId || !userRole) {
      socket.destroy();
      return;
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, userId, userRole);
    });
  });

  wss.on(
    "connection",
    (socket: WebSocket, userId: string, userRole: string) => {
      console.log(`🔌 New connection: userId=${userId}, userRole=${userRole}`);

      clients.set(userId, socket);
      if (!roleClients.has(userRole)) {
        roleClients.set(userRole, new Set<WebSocket>());
        console.log(`📝 Created new role group for: ${userRole}`);
      }
      roleClients.get(userRole)?.add(socket);
      console.log(`✅ Added client to role group: ${userRole}`);
      console.log(
        `📊 Total clients for role ${userRole}: ${
          roleClients.get(userRole)?.size
        }`
      );

      socket.send(
        JSON.stringify({
          type: `welcome ${userId}`,
          message: `Connected to Emergency Alert WS`,
        })
      );

      // Send pending alerts from database to dashboard users
      if (userId.includes('dashboard')) {
        sendPendingAlerts(socket, userRole);
      }

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
            const fullAlert = { ...alert, reportedBy: userId };
            await producer.send({
              topic: "emergency-alerts",
              messages: [
                {
                  key: "alert",
                  value: JSON.stringify(fullAlert),
                },
              ],
            });

            // Send success response to client
            socket.send(
              JSON.stringify({
                type: "success",
                message: "Emergency alert sent successfully",
              })
            );
          }
          if (data.type === "UPDATE_ALERT_STATUS") {
            const { alertId, newStatus } = data.payload;
            if (!Object.values(StatusReport).includes(newStatus)) {
              socket.send(
                JSON.stringify({
                  type: "error",
                  message: `Invalid status. Must be one of: ${Object.values(
                    StatusReport
                  ).join(",")}`,
                })
              );
              return;
            }

            try {
              const updatedAlert = await updateAlertStatus(alertId, newStatus);
              await redisClient.set(
                `alert:${alertId}`,
                JSON.stringify(updatedAlert)
              );
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
          if (data.type === "CANCEL_ALERT") {
            const { alertId } = data.payload;
            try {
              const cancelledAlert = await cancelAlert(alertId);
              await redisClient.del(`alert:${alertId}`);
              broadcast({ type: "ALERT_CANCELLED", payload: cancelledAlert });
              socket.send(
                JSON.stringify({
                  type: "success",
                  message: `Alert ${alertId} cancelled successfully`,
                })
              );
            } catch (error) {
              socket.send(
                JSON.stringify({
                  type: "error",
                  message: "Failed to cancel alert",
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
      socket.on("close", () => {
        roleClients.forEach((sockets, role) => {
          sockets.delete(socket);
          if (sockets.size === 0) {
            roleClients.delete(role);
          }
        });
      });
    }
  );
  function broadcast(data: any) {
    const payload = JSON.stringify(data);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }
  function roleBroadcast(role: string, data: any) {
    const payload = JSON.stringify(data);
    const sockets = roleClients.get(role);

    console.log(`🔍 RoleBroadcast called for role: ${role}`);
    console.log(`🔍 Available roles: ${Array.from(roleClients.keys())}`);
    console.log(`🔍 Sockets for role ${role}:`, sockets ? sockets.size : 0);

    if (!sockets) {
      console.log(`❌ No sockets found for role: ${role}`);
      return;
    }

    let sentCount = 0;
    sockets.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
        sentCount++;
        console.log(`✅ Sent alert to ${role} client`);
      } else {
        console.log(`❌ Client not ready, state: ${client.readyState}`);
      }
    });

    console.log(`📊 Sent alert to ${sentCount} ${role} clients`);
  }
  const updateAlertStatus = async (
    alertId: string,
    newStatus: StatusReport
  ) => {
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
  const cancelAlert = async (alertId: string) => {
    try {
      const cancelled = await prismaClient.emergency.update({
        where: { id: alertId },
        data: {
          status: StatusReport.RESOLVED, // Use RESOLVED instead of CANCELLED
        },
      });
      return cancelled;
    } catch (err) {
      throw err;
    }
  };
  const sendPendingAlerts = async (socket: WebSocket, userRole: string) => {
    try {
      // Fetch alerts that are IN_PROCESS (pending) for the specific role
      const pendingAlerts = await prismaClient.emergency.findMany({
        where: {
          status: StatusReport.IN_PROCESS,
          assignedTo: userRole as any, // Type assertion for UserRole
        },
        include: {
          location: true,
        },
      });

      if (pendingAlerts.length > 0) {
        console.log(`📋 Sending ${pendingAlerts.length} pending alerts to ${userRole} dashboard`);
        
        // Send each pending alert individually
        pendingAlerts.forEach((alert) => {
          const alertWithLocation = {
            ...alert,
            location: alert.location.map(loc => ({
              lat: loc.lat,
              long: loc.long,
            })),
          };
          
          socket.send(
            JSON.stringify({
              type: alert.type, // Send as the alert type (CRIME, FIRE, etc.)
              payload: alertWithLocation,
            })
          );
        });
      }
    } catch (err) {
      console.error("Failed to send pending alerts:", err);
    }
  };
  (async () => {
    await producer.connect();
    await consumer.connect();
    await consumer.subscribe({
      topic: "emergency-alerts",
      fromBeginning: true,
    });
    await consumer.subscribe({ topic: "alert-updates" });

    await consumer.run({
      eachMessage: async ({ message, topic }) => {
        if (!message.value) return;
        const alert = JSON.parse(message.value.toString());

        if (topic === "emergency-alerts") {
          try {
            console.log("Processing emergency alert:", alert);
            await redisClient.set(`alert:${alert.id}`, JSON.stringify(alert));

            const createAlert = await prismaClient.emergency.create({
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

            console.log("Alert created in DB:", createAlert);

            // Send high priority broadcast to all clients
            if (alert.priority === "HIGH") {
              console.log("Broadcasting HIGH_PRIORITY_ALERT to all clients");
              broadcast({ type: "HIGH_PRIORITY_ALERT", payload: createAlert });
            }

            // Send role-specific alert
            console.log(
              `Broadcasting ${alert.type} alert to ${alert.assignedTo} role`
            );
            roleBroadcast(alert.assignedTo, {
              type: alert.type,
              payload: {
                ...createAlert,
                location: [
                  {
                    lat: alert.location.lat,
                    long: alert.location.long,
                  },
                ],
              },
            });
          } catch (error) {
            console.error("Failed to store alert:", error);
          }
        }

        if (topic === "alert-updates") {
          try {
            console.log("entered updates");

            const { id, newStatus } = JSON.parse(message.value.toString());

            const updated = await prismaClient.emergency.update({
              where: { id },
              data: { status: newStatus },
            });
            console.log("Prisma update successful:", updated);
            await redisClient.set(`alert:${id}`, JSON.stringify(updated));
            broadcast({ type: "ALERT_UPDATED", payload: updated });
          } catch (error) {
            console.error("Prisma update failed:", error);
          }
        }
      },
    });
  })();
};
