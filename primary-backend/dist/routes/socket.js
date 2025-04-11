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
const init_1 = require("./redis/init");
const producer_1 = require("./kafka/producer");
const consumer_1 = require("./kafka/consumer");
const clients = new Map();
const setUpSocketServer = (server) => {
    const wss = new ws_1.WebSocketServer({ noServer: true });
    server.on('upgrade', (req, socket, head) => {
        var _a;
        const query = (_a = req.url) === null || _a === void 0 ? void 0 : _a.split("/")[1];
        const userId = query;
        if (!userId)
            return socket.destroy;
        wss.handleUpgrade(req, socket, head, (ws) => {
            wss.emit('connection', ws, userId);
        });
    });
    wss.on('connection', (socket, userId) => __awaiter(void 0, void 0, void 0, function* () {
        clients.set(userId, socket);
        console.log(`UserId: ${userId} Connected!`);
        const pending = yield init_1.redisClient.lrange(`message:${userId}`, 0, -1);
        pending.forEach((message) => socket.send(message));
        init_1.redisClient.del(`message:${userId}`);
        socket.on('message', (data) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { to, text } = JSON.parse(data.toString());
                const message = { from: userId, to, text };
                yield producer_1.producer.send({
                    topic: "chat-room",
                    messages: [{ value: JSON.stringify(message) }]
                });
            }
            catch (err) {
                console.error("Invalid message format:", err);
            }
        }));
        socket.on("close", () => {
            clients.delete(userId);
            console.log(`User disconnected: ${userId}`);
        });
    }));
    (() => __awaiter(void 0, void 0, void 0, function* () {
        yield producer_1.producer.connect();
        yield consumer_1.consumer.connect();
        yield consumer_1.consumer.subscribe({ topic: "chat-room", fromBeginning: false });
        yield consumer_1.consumer.run({
            eachMessage: (_a) => __awaiter(void 0, [_a], void 0, function* ({ message }) {
                if (!message.value)
                    return;
                const { from, to, text } = JSON.parse(message.value.toString());
                const payload = JSON.stringify({ from, text });
                const reciver = clients.get(to);
                if (reciver && reciver.readyState === ws_1.WebSocket.OPEN) {
                    reciver.send(payload);
                    console.log(`Message form ${from} Delivered to ${to}`);
                }
                else {
                    yield init_1.redisClient.rpush(`message:${to}`, payload);
                    console.log(`Message is Stored for user ${to}!!`);
                }
            })
        });
    }))();
};
exports.setUpSocketServer = setUpSocketServer;
