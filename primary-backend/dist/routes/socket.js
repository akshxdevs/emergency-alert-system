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
        var _a;
        clients.set(userId, socket);
        if (!roleClients.has(userRole)) {
            roleClients.set(userRole, new Set());
        }
        (_a = roleClients.get(userRole)) === null || _a === void 0 ? void 0 : _a.add(socket);
        socket.send(JSON.stringify({
            type: `welcome ${userId}`,
            message: `Connected to Emergency Alert WS`,
        }));
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
        if (!sockets)
            return;
        sockets.forEach((client) => {
            if (client.readyState === ws_1.WebSocket.OPEN) {
                client.send(payload);
            }
        });
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
    (() => __awaiter(void 0, void 0, void 0, function* () {
        yield producer_1.producer.connect();
        yield consumer_1.consumer.connect();
        yield consumer_1.consumer.subscribe({ topic: "emergency-alerts", fromBeginning: true });
        yield consumer_1.consumer.subscribe({ topic: 'alert-updates' });
        yield consumer_1.consumer.run({
            eachMessage: (_a) => __awaiter(void 0, [_a], void 0, function* ({ message, topic }) {
                if (!message.value)
                    return;
                const alert = JSON.parse(message.value.toString());
                if (topic === "emergency-alerts") {
                    try {
                        yield init_1.redisClient.set(`alert:${alert.id}`, JSON.stringify(alert));
                        yield db_1.prismaClient.emergency.create({
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
                    }
                    catch (error) {
                        console.error("Failed to store alert:", error);
                    }
                    if (alert.priority === "HIGH") {
                        broadcast({ type: "HIGH_PRIORITY_ALERT", payload: alert });
                    }
                    roleBroadcast(alert.assignedTo, { type: alert.type, payload: alert });
                }
                if (topic === "alert-updates") {
                    const { id, newStatus } = JSON.parse(message.value.toString());
                    const updated = yield db_1.prismaClient.emergency.update({
                        where: { id },
                        data: { status: newStatus },
                    });
                    yield init_1.redisClient.set(`alert:${id}`, JSON.stringify(updated));
                    broadcast({ type: "ALERT_UPDATED", payload: updated });
                }
            }),
        });
    }))();
};
exports.setUpSocketServer = setUpSocketServer;
