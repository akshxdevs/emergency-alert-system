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
const admin_1 = require("./routes/kafka/admin");
const producer_1 = require("./routes/kafka/producer");
const consumer_1 = require("./routes/kafka/consumer");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/v1/user", user_1.userRouter);
const server = http_1.default.createServer(app);
(0, socket_1.setUpSocketServer)(server);
// Initialize RedPanda Kafka connections
const initializeKafka = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, admin_1.initializeAdmin)();
    yield (0, producer_1.initializeProducer)();
    yield (0, consumer_1.initializeConsumer)();
});
server.listen(config_1.PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`ws & http server running on port:${config_1.PORT}`);
    yield initializeKafka();
}));
