import { Kafka } from "kafkajs";

const kafkaBrokers = process.env.KAFKA_BROKERS?.split(',') || ['d2ka4bpmodb6qsnjj8e0.any.ap-south-1.mpx.prd.cloud.redpanda.com:9092'];

const saslMechanism = process.env.KAFKA_SASL_MECHANISM || 'scram-sha-256';

const kafka = new Kafka({
    clientId: 'emergency-alert-service',
    brokers: kafkaBrokers,
    ssl: {},
    sasl: saslMechanism === 'scram-sha-256' 
        ? {
            mechanism: 'scram-sha-256',
            username: process.env.KAFKA_USERNAME || '',
            password: process.env.KAFKA_PASSWORD || ''
        }
        : {
            mechanism: 'scram-sha-512',
            username: process.env.KAFKA_USERNAME || '',
            password: process.env.KAFKA_PASSWORD || ''
        }
});

export const consumer = kafka.consumer({ groupId: 'alert-group' });

export const initializeConsumer = async () => {
    try {
        await consumer.connect();
        console.log('✅ Connected to RedPanda Kafka consumer');
    } catch (error) {
        console.log('⚠️ RedPanda Kafka consumer not available, continuing without Kafka');
        console.error('Kafka consumer error:', error);
    }
};