import { Kafka } from "kafkajs";
import {
    KAFKA_BROKERS,
    KAFKA_PASSWORD,
    KAFKA_SASL_MECHANISM,
    KAFKA_USERNAME,
} from "../../config";

const kafkaBrokers = KAFKA_BROKERS;
const saslMechanism = KAFKA_SASL_MECHANISM;
const kafkaUsername = KAFKA_USERNAME;
const kafkaPassword = KAFKA_PASSWORD;
const hasValidCredentials = Boolean(kafkaBrokers.length && kafkaUsername && kafkaPassword);

let kafka: Kafka | null = null;
let consumerInstance: any = null;

if (hasValidCredentials) {
    const username = kafkaUsername as string;
    const password = kafkaPassword as string;

    kafka = new Kafka({
        clientId: 'emergency-alert-service',
        brokers: kafkaBrokers,
        ssl: {},
        sasl: saslMechanism === 'scram-sha-256' 
            ? {
                mechanism: 'scram-sha-256',
                username,
                password
            }
            : {
                mechanism: 'scram-sha-512',
                username,
                password
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
