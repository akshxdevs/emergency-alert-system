import http from "http";
import express from "express";
import cors from "cors";
import { PORT } from "./config";
import { setUpSocketServer } from "./routes/socket";
import { userRouter } from "./routes/user";
import { initializeProducer } from "./routes/kafka/producer";
import { initializeConsumer } from "./routes/kafka/consumer";

// Suppress KafkaJS partitioner warning
process.env.KAFKAJS_NO_PARTITIONER_WARNING = "1";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/user", userRouter);

const server = http.createServer(app);
setUpSocketServer(server);

// Initialize RedPanda Kafka connections
const initializeKafka = async () => {
    await initializeProducer();
    await initializeConsumer();
};

server.listen(PORT, async () => {
    console.log(`ws & http server running on port:${PORT}`);
    await initializeKafka();
});