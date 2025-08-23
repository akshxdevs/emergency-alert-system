"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeProducer = exports.producer = void 0;
const kafkajs_1 = require("kafkajs");
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
let kafka = null;
let producerInstance = null;
if (hasValidCredentials) {
    kafka = new kafkajs_1.Kafka({
        clientId: 'emergency-alerts',
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
    producerInstance = kafka.producer();
}
exports.producer = producerInstance;
const initializeProducer = async () => {
    if (!exports.producer) {
        console.log('⚠️ Kafka producer not available - no valid credentials provided');
        return;
    }
    try {
        await exports.producer.connect();
        console.log('✅ Connected to RedPanda Kafka producer');
    }
    catch (error) {
        console.log('❌ RedPanda Kafka producer not available, continuing without Kafka');
        console.error('Kafka producer error:', error);
    }
};
exports.initializeProducer = initializeProducer;
