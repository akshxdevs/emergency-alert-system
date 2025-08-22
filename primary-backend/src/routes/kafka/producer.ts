import { Kafka } from "kafkajs";

const kafkaBrokers = process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'];

const kafka = new Kafka({
    clientId:'emergency-alerts',
    brokers: kafkaBrokers
});

export const producer = kafka.producer();

export const initializeProducer = async () => {
    try {
        await producer.connect();
        console.log('✅ Connected to Kafka producer');
    } catch (error) {
        console.log('⚠️ Kafka producer not available, continuing without Kafka');
    }
};
