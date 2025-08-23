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

let redpanda: Kafka | null = null;
let adminInstance: any = null;

if (hasValidCredentials) {
    redpanda = new Kafka({
        clientId: 'emergency-alert-admin',
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
    adminInstance = redpanda.admin();
}

export const admin = adminInstance;

export const initializeAdmin = async () => {
    if (!admin) {
        console.log('⚠️ Kafka admin not available - no valid credentials provided');
        return;
    }
    
    try {
        await admin.connect();
        console.log('✅ Connected to RedPanda Kafka admin');
        
        // Create emergency alert topics
        await admin.createTopics({
            topics: [
                {
                    topic: 'emergency-alerts',
                    numPartitions: 1,
                    replicationFactor: -1
                },
                {
                    topic: 'alert-notifications',
                    numPartitions: 1,
                    replicationFactor: -1
                }
            ]
        });
        
        console.log('✅ Created emergency alert topics');
        await admin.disconnect();
    } catch (error) {
        console.log('❌ RedPanda Kafka admin not available');
        console.error('Kafka admin error:', error);
    }
}; 