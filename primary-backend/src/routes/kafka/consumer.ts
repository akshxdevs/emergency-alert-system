import { Kafka } from "kafkajs";

const kafkaBrokers = process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'];

const kafka = new Kafka({
    clientId:'emergency-alert-service',
    brokers: kafkaBrokers,
});

export const consumer = kafka.consumer({groupId:'alert-group'});

export const initializeConsumer = async () => {
    try {
        await consumer.connect();
        console.log('✅ Connected to Kafka consumer');
    } catch (error) {
        console.log('⚠️ Kafka consumer not available, continuing without Kafka');
    }
};