"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUpSocketServer = void 0;
const ws_1 = require("ws");
const producer_1 = require("./kafka/producer");
const consumer_1 = require("./kafka/consumer");
const init_1 = require("./redis/init");
const db_1 = require("../db/db");
const client_1 = require("@prisma/client");
const alert_protocol_1 = require("../lib/alert-protocol");
const clients = new Map();
const roleClients = new Map();
const setUpSocketServer = (server) => {
    const wss = new ws_1.WebSocketServer({ noServer: true });
    server.on("upgrade", (req, socket, head) => {
        const connectionInfo = (0, alert_protocol_1.parseUpgradeRequestUrl)(req.url);
        if (!connectionInfo) {
            socket.destroy();
            return;
        }
        wss.handleUpgrade(req, socket, head, (ws) => {
            wss.emit("connection", ws, connectionInfo.userId, connectionInfo.userRole);
        });
    });
    wss.on("connection", (socket, userId, userRole) => {
        clients.set(userId, socket);
        if (!roleClients.has(userRole)) {
            roleClients.set(userRole, new Set());
        }
        roleClients.get(userRole)?.add(socket);
        socket.send(JSON.stringify({
            type: `welcome ${userId}`,
            message: `Connected to Emergency Alert WS`,
        }));
        if (userRole !== "CIVILIAN") {
            sendPendingAlerts(socket, userRole);
        }
        socket.on("message", async (messages) => {
            try {
                const data = JSON.parse(messages.toString());
                if (data.type === "NEW_ALERT") {
                    const alert = data.payload;
                    if (!(0, alert_protocol_1.isValidAlertPriority)(alert.priority)) {
                        socket.send(JSON.stringify({
                            type: "error",
                            message: "Invalid priority value",
                        }));
                        return;
                    }
                    const fullAlert = { ...alert, reportedBy: userId };
                    if (producer_1.producer) {
                        try {
                            await producer_1.producer.send({
                                topic: "emergency-alerts",
                                messages: [
                                    {
                                        key: "alert",
                                        value: JSON.stringify(fullAlert),
                                    },
                                ],
                            });
                        }
                        catch (error) {
                            console.log('Kafka not available, storing alert directly to database');
                            await init_1.redisClient.set(`alert:${fullAlert.id}`, JSON.stringify(fullAlert));
                            try {
                                const createAlert = await db_1.prismaClient.emergency.create({
                                    data: {
                                        type: fullAlert.type,
                                        reportedBy: fullAlert.reportedBy,
                                        status: fullAlert.status,
                                        assignedTo: fullAlert.assignedTo,
                                        description: fullAlert.description,
                                        priority: fullAlert.priority,
                                        location: {
                                            create: {
                                                lat: fullAlert.location.lat,
                                                long: fullAlert.location.long,
                                            },
                                        },
                                    },
                                });
                                console.log("Alert created directly in DB (Kafka failed):", createAlert);
                                if (fullAlert.priority === "HIGH") {
                                    console.log("Broadcasting HIGH_PRIORITY_ALERT to all clients");
                                    broadcast({ type: "HIGH_PRIORITY_ALERT", payload: createAlert });
                                }
                                console.log(`Broadcasting ${fullAlert.type} alert to ${fullAlert.assignedTo} role`);
                                roleBroadcast(fullAlert.assignedTo, {
                                    type: fullAlert.type,
                                    payload: {
                                        ...createAlert,
                                        location: [
                                            {
                                                lat: fullAlert.location.lat,
                                                long: fullAlert.location.long,
                                            },
                                        ],
                                    },
                                });
                            }
                            catch (dbError) {
                                console.error("Failed to save alert directly to database after Kafka failure:", dbError);
                            }
                        }
                    }
                    else {
                        console.log('Kafka producer not available, storing alert directly to database');
                        await init_1.redisClient.set(`alert:${fullAlert.id}`, JSON.stringify(fullAlert));
                        try {
                            const createAlert = await db_1.prismaClient.emergency.create({
                                data: {
                                    type: fullAlert.type,
                                    reportedBy: fullAlert.reportedBy,
                                    status: fullAlert.status,
                                    assignedTo: fullAlert.assignedTo,
                                    description: fullAlert.description,
                                    priority: fullAlert.priority,
                                    location: {
                                        create: {
                                            lat: fullAlert.location.lat,
                                            long: fullAlert.location.long,
                                        },
                                    },
                                },
                            });
                            console.log("Alert created directly in DB:", createAlert);
                            if (fullAlert.priority === "HIGH") {
                                console.log("Broadcasting HIGH_PRIORITY_ALERT to all clients");
                                broadcast({ type: "HIGH_PRIORITY_ALERT", payload: createAlert });
                            }
                            console.log(`Broadcasting ${fullAlert.type} alert to ${fullAlert.assignedTo} role`);
                            roleBroadcast(fullAlert.assignedTo, {
                                type: fullAlert.type,
                                payload: {
                                    ...createAlert,
                                    location: [
                                        {
                                            lat: fullAlert.location.lat,
                                            long: fullAlert.location.long,
                                        },
                                    ],
                                },
                            });
                        }
                        catch (dbError) {
                            console.error("Failed to save alert directly to database:", dbError);
                        }
                    }
                    socket.send(JSON.stringify({
                        type: "success",
                        message: "Emergency alert sent successfully",
                    }));
                }
                if (data.type === "UPDATE_ALERT_STATUS") {
                    const { alertId, newStatus } = data.payload;
                    if (!(0, alert_protocol_1.isValidStatusReport)(newStatus)) {
                        socket.send(JSON.stringify({
                            type: "error",
                            message: `Invalid status. Must be one of: ${Object.values(client_1.StatusReport).join(",")}`,
                        }));
                        return;
                    }
                    try {
                        const updatedAlert = await updateAlertStatus(alertId, newStatus);
                        await init_1.redisClient.set(`alert:${alertId}`, JSON.stringify(updatedAlert));
                        broadcast({ type: "ALERT_UPDATED", payload: updatedAlert });
                        socket.send(JSON.stringify({
                            type: "success",
                            message: `Alert ${alertId} updated to ${newStatus}`,
                        }));
                    }
                    catch (error) {
                        socket.send(JSON.stringify({
                            type: "error",
                            message: "Failed to update alert",
                        }));
                    }
                }
                if (data.type === "CANCEL_ALERT") {
                    const { alertId } = data.payload;
                    try {
                        const cancelledAlert = await cancelAlert(alertId);
                        await init_1.redisClient.del(`alert:${alertId}`);
                        broadcast({ type: "ALERT_CANCELLED", payload: cancelledAlert });
                        socket.send(JSON.stringify({
                            type: "success",
                            message: `Alert ${alertId} cancelled successfully`,
                        }));
                    }
                    catch (error) {
                        socket.send(JSON.stringify({
                            type: "error",
                            message: "Failed to cancel alert",
                        }));
                    }
                }
            }
            catch (err) {
                socket.send(JSON.stringify({
                    type: "error",
                    message: "Invalid message format",
                }));
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
    });
    function broadcast(data) {
        const payload = JSON.stringify(data);
        wss.clients.forEach((client) => {
            if (client.readyState === ws_1.WebSocket.OPEN) {
                client.send(payload);
            }
        });
    }
    function roleBroadcast(role, data) {
        const payload = JSON.stringify(data);
        const sockets = roleClients.get(role);
        if (!sockets) {
            return;
        }
        sockets.forEach((client) => {
            if (client.readyState === ws_1.WebSocket.OPEN) {
                client.send(payload);
            }
        });
    }
    const updateAlertStatus = async (alertId, newStatus) => {
        try {
            const updated = await db_1.prismaClient.emergency.update({
                where: { id: alertId },
                data: {
                    status: { set: newStatus },
                },
            });
            return updated;
        }
        catch (err) {
            throw err;
        }
    };
    const cancelAlert = async (alertId) => {
        try {
            const cancelled = await db_1.prismaClient.emergency.update({
                where: { id: alertId },
                data: {
                    status: client_1.StatusReport.RESOLVED,
                },
            });
            return cancelled;
        }
        catch (err) {
            throw err;
        }
    };
    const sendPendingAlerts = async (socket, userRole) => {
        try {
            const pendingAlerts = await db_1.prismaClient.emergency.findMany({
                where: {
                    status: client_1.StatusReport.IN_PROCESS,
                    assignedTo: userRole,
                },
                include: {
                    location: true,
                },
            });
            if (pendingAlerts.length > 0) {
                pendingAlerts.forEach((alert) => {
                    const alertWithLocation = {
                        ...alert,
                        location: alert.location.map((loc) => ({
                            lat: loc.lat,
                            long: loc.long,
                        })),
                        receivedAt: Date.now(),
                        autoDisappearAt: null,
                    };
                    socket.send(JSON.stringify({
                        type: alert.type,
                        payload: alertWithLocation,
                    }));
                });
            }
        }
        catch (err) {
            console.error("Failed to send pending alerts:", err);
        }
    };
    let kafkaAvailable = false;
    (async () => {
        try {
            if (!producer_1.producer || !consumer_1.consumer) {
                console.log('Kafka not available - no valid credentials provided');
                return;
            }
            await producer_1.producer.connect();
            await consumer_1.consumer.connect();
            try {
                await consumer_1.consumer.subscribe({
                    topic: "emergency-alerts",
                    fromBeginning: true,
                });
                await consumer_1.consumer.subscribe({ topic: "alert-updates" });
            }
            catch (subscribeError) {
                if (subscribeError.type === 'TOPIC_AUTHORIZATION_FAILED') {
                    console.log('Topic subscription failed - topics may not exist or insufficient permissions');
                    console.log('Application will continue without Kafka consumer');
                    return;
                }
                throw subscribeError;
            }
            await consumer_1.consumer.run({
                eachMessage: async ({ message, topic }) => {
                    if (!message.value)
                        return;
                    const alert = JSON.parse(message.value.toString());
                    if (topic === "emergency-alerts") {
                        try {
                            console.log("Processing emergency alert:", alert);
                            await init_1.redisClient.set(`alert:${alert.id}`, JSON.stringify(alert));
                            const createAlert = await db_1.prismaClient.emergency.create({
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
                            if (alert.priority === "HIGH") {
                                console.log("Broadcasting HIGH_PRIORITY_ALERT to all clients");
                                broadcast({ type: "HIGH_PRIORITY_ALERT", payload: createAlert });
                            }
                            console.log(`Broadcasting ${alert.type} alert to ${alert.assignedTo} role`);
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
                        }
                        catch (error) {
                            console.error("Failed to store alert:", error);
                        }
                    }
                    if (topic === "alert-updates") {
                        try {
                            console.log("entered updates");
                            const { id, newStatus } = JSON.parse(message.value.toString());
                            const updated = await db_1.prismaClient.emergency.update({
                                where: { id },
                                data: { status: newStatus },
                            });
                            console.log("Prisma update successful:", updated);
                            await init_1.redisClient.set(`alert:${id}`, JSON.stringify(updated));
                            broadcast({ type: "ALERT_UPDATED", payload: updated });
                        }
                        catch (error) {
                            console.error("Prisma update failed:", error);
                        }
                    }
                },
            });
            kafkaAvailable = true;
            console.log('Kafka consumer initialized successfully');
        }
        catch (error) {
            console.log('Kafka not available, continuing without Kafka');
            console.error('Kafka error:', error);
        }
    })();
};
exports.setUpSocketServer = setUpSocketServer;
