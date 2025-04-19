import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId:'emergency-alerts',
    brokers:['localhost:9092']
});

export const producer = kafka.producer();
