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
let producerInstance: any = null;

if (hasValidCredentials) {
    const username = kafkaUsername as string;
    const password = kafkaPassword as string;

    kafka = new Kafka({
        clientId: 'emergency-alerts',
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
    producerInstance = kafka.producer();
}

export const producer = producerInstance;

export const initializeProducer = async () => {
    if (!producer) {
        console.log('Kafka producer not available - no valid credentials provided');
        return;
    }
    
    try {
        await producer.connect();
        console.log('Connected to RedPanda Kafka producer');
    } catch (error) {
        console.log('RedPanda Kafka producer not available, continuing without Kafka');
        console.error('Kafka producer error:', error);
    }
};
