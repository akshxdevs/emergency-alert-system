"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUpSocketServer = void 0;
const ws_1 = require("ws");
const producer_1 = require("./kafka/producer");
const consumer_1 = require("./kafka/consumer");
const init_1 = require("./redis/init");
const db_1 = require("../db/db");
const client_1 = require("@prisma/client");
const clients = new Map();
const roleClients = new Map();
const setUpSocketServer = (server) => {
    const wss = new ws_1.WebSocketServer({ noServer: true });
    server.on("upgrade", (req, socket, head) => {
        var _a, _b;
        const userId = (_a = req.url) === null || _a === void 0 ? void 0 : _a.split("/")[1];
        const userRole = (_b = req.url) === null || _b === void 0 ? void 0 : _b.split("/?")[1];
        if (!userId || !userRole) {
            socket.destroy();
            return;
        }
        wss.handleUpgrade(req, socket, head, (ws) => {
            wss.emit("connection", ws, userId, userRole);
        });
    });
    wss.on("connection", (socket, userId, userRole) => {
        var _a, _b;
        console.log(`🔌 New connection: userId=${userId}, userRole=${userRole}`);
        clients.set(userId, socket);
        if (!roleClients.has(userRole)) {
            roleClients.set(userRole, new Set());
            console.log(`📝 Created new role group for: ${userRole}`);
        }
        (_a = roleClients.get(userRole)) === null || _a === void 0 ? void 0 : _a.add(socket);
        console.log(`✅ Added client to role group: ${userRole}`);
        console.log(`📊 Total clients for role ${userRole}: ${(_b = roleClients.get(userRole)) === null || _b === void 0 ? void 0 : _b.size}`);
        socket.send(JSON.stringify({
            type: `welcome ${userId}`,
            message: `Connected to Emergency Alert WS`,
        }));
        if (userId.includes('dashboard')) {
            sendPendingAlerts(socket, userRole);
        }
        socket.on("message", (messages) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const data = JSON.parse(messages.toString());
                if (data.type === "NEW_ALERT") {
                    const alert = data.payload;
                    const allowedPriorities = ["LOW", "MEDIUM", "HIGH"];
                    if (!allowedPriorities.includes(alert.priority)) {
                        socket.send(JSON.stringify({
                            type: "error",
                            message: "Invalid priority value",
                        }));
                        return;
                    }
                    const fullAlert = Object.assign(Object.assign({}, alert), { reportedBy: userId });
                    try {
                        yield producer_1.producer.send({
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
                        console.log('⚠️ Kafka not available, storing alert directly');
                        yield init_1.redisClient.set(`alert:${fullAlert.id}`, JSON.stringify(fullAlert));
                    }
                    socket.send(JSON.stringify({
                        type: "success",
                        message: "Emergency alert sent successfully",
                    }));
                }
                if (data.type === "UPDATE_ALERT_STATUS") {
                    const { alertId, newStatus } = data.payload;
                    if (!Object.values(client_1.StatusReport).includes(newStatus)) {
                        socket.send(JSON.stringify({
                            type: "error",
                            message: `Invalid status. Must be one of: ${Object.values(client_1.StatusReport).join(",")}`,
                        }));
                        return;
                    }
                    try {
                        const updatedAlert = yield updateAlertStatus(alertId, newStatus);
                        yield init_1.redisClient.set(`alert:${alertId}`, JSON.stringify(updatedAlert));
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
                        const cancelledAlert = yield cancelAlert(alertId);
                        yield init_1.redisClient.del(`alert:${alertId}`);
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
        }));
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
        console.log(`🔍 RoleBroadcast called for role: ${role}`);
        console.log(`🔍 Available roles: ${Array.from(roleClients.keys())}`);
        console.log(`🔍 Sockets for role ${role}:`, sockets ? sockets.size : 0);
        if (!sockets) {
            console.log(`❌ No sockets found for role: ${role}`);
            return;
        }
        let sentCount = 0;
        sockets.forEach((client) => {
            if (client.readyState === ws_1.WebSocket.OPEN) {
                client.send(payload);
                sentCount++;
                console.log(`✅ Sent alert to ${role} client`);
            }
            else {
                console.log(`❌ Client not ready, state: ${client.readyState}`);
            }
        });
        console.log(`📊 Sent alert to ${sentCount} ${role} clients`);
    }
    const updateAlertStatus = (alertId, newStatus) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const updated = yield db_1.prismaClient.emergency.update({
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
    });
    const cancelAlert = (alertId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const cancelled = yield db_1.prismaClient.emergency.update({
                where: { id: alertId },
                data: {
                    status: client_1.StatusReport.RESOLVED, // Use RESOLVED instead of CANCELLED
                },
            });
            return cancelled;
        }
        catch (err) {
            throw err;
        }
    });
    const sendPendingAlerts = (socket, userRole) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const pendingAlerts = yield db_1.prismaClient.emergency.findMany({
                where: {
                    status: client_1.StatusReport.IN_PROCESS,
                    assignedTo: userRole, // Type assertion for UserRole
                },
                include: {
                    location: true,
                },
            });
            if (pendingAlerts.length > 0) {
                console.log(`📋 Sending ${pendingAlerts.length} pending alerts to ${userRole} dashboard`);
                pendingAlerts.forEach((alert) => {
                    const alertWithLocation = Object.assign(Object.assign({}, alert), { location: alert.location.map(loc => ({
                            lat: loc.lat,
                            long: loc.long,
                        })), receivedAt: Date.now(), autoDisappearAt: null });
                    socket.send(JSON.stringify({
                        type: alert.type, // Send as the alert type (CRIME, FIRE, etc.)
                        payload: alertWithLocation,
                    }));
                });
            }
            else {
                console.log(`📋 No pending alerts found for ${userRole} dashboard`);
            }
        }
        catch (err) {
            console.error("Failed to send pending alerts:", err);
        }
    });
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield producer_1.producer.connect();
            yield consumer_1.consumer.connect();
            yield consumer_1.consumer.subscribe({
                topic: "emergency-alerts",
                fromBeginning: true,
            });
            yield consumer_1.consumer.subscribe({ topic: "alert-updates" });
            yield consumer_1.consumer.run({
                eachMessage: (_a) => __awaiter(void 0, [_a], void 0, function* ({ message, topic }) {
                    if (!message.value)
                        return;
                    const alert = JSON.parse(message.value.toString());
                    if (topic === "emergency-alerts") {
                        try {
                            console.log("Processing emergency alert:", alert);
                            yield init_1.redisClient.set(`alert:${alert.id}`, JSON.stringify(alert));
                            const createAlert = yield db_1.prismaClient.emergency.create({
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
                                payload: Object.assign(Object.assign({}, createAlert), { location: [
                                        {
                                            lat: alert.location.lat,
                                            long: alert.location.long,
                                        },
                                    ] }),
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
                            const updated = yield db_1.prismaClient.emergency.update({
                                where: { id },
                                data: { status: newStatus },
                            });
                            console.log("Prisma update successful:", updated);
                            yield init_1.redisClient.set(`alert:${id}`, JSON.stringify(updated));
                            broadcast({ type: "ALERT_UPDATED", payload: updated });
                        }
                        catch (error) {
                            console.error("Prisma update failed:", error);
                        }
                    }
                }),
            });
        }
        catch (error) {
            console.log('⚠️ Kafka not available, continuing without Kafka');
        }
    }))();
};
exports.setUpSocketServer = setUpSocketServer;
