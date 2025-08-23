"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const socket_1 = require("./routes/socket");
const user_1 = require("./routes/user");
const producer_1 = require("./routes/kafka/producer");
const consumer_1 = require("./routes/kafka/consumer");
// Suppress KafkaJS partitioner warning
process.env.KAFKAJS_NO_PARTITIONER_WARNING = "1";
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/v1/user", user_1.userRouter);
const server = http_1.default.createServer(app);
(0, socket_1.setUpSocketServer)(server);
// Initialize RedPanda Kafka connections
const initializeKafka = async () => {
    await (0, producer_1.initializeProducer)();
    await (0, consumer_1.initializeConsumer)();
};
server.listen(config_1.PORT, async () => {
    console.log(`ws & http server running on port:${config_1.PORT}`);
    await initializeKafka();
});
