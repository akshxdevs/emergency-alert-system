import { Kafka } from "kafkajs";

const kafkaBrokers = process.env.KAFKA_BROKERS?.split(',') || ['d2ka4bpmodb6qsnjj8e0.any.ap-south-1.mpx.prd.cloud.redpanda.com:9092'];

const saslMechanism = process.env.KAFKA_SASL_MECHANISM || 'scram-sha-256';

// Only create Kafka instance if credentials are provided
const kafkaUsername = process.env.KAFKA_USERNAME;
const kafkaPassword = process.env.KAFKA_PASSWORD;

// Check if credentials are properly set (not placeholder values)
const hasValidCredentials = kafkaUsername && 
                           kafkaPassword && 
                           kafkaUsername !== 'your_username' && 
                           kafkaPassword !== 'your_password';

let kafka: Kafka | null = null;
let consumerInstance: any = null;

if (hasValidCredentials) {
    kafka = new Kafka({
        clientId: 'emergency-alert-service',
        brokers: kafkaBrokers,
        ssl: {},
        sasl: saslMechanism === 'scram-sha-256' 
            ? {
                mechanism: 'scram-sha-256',
                username: kafkaUsername,
                password: kafkaPassword
            }
            : {
                mechanism: 'scram-sha-512',
                username: kafkaUsername,
                password: kafkaPassword
            }
    });
    consumerInstance = kafka.consumer({ groupId: 'alert-group' });
}

export const consumer = consumerInstance;

export const initializeConsumer = async () => {
    if (!consumer) {
        console.log('Kafka consumer not available - no valid credentials provided');
        return;
    }
    
    try {
        await consumer.connect();
        console.log('Connected to RedPanda Kafka consumer');
    } catch (error) {
        console.log('RedPanda Kafka consumer not available, continuing without Kafka');
        console.error('Kafka consumer error:', error);
    }
};