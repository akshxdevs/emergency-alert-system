"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeProducer = exports.producer = void 0;
const kafkajs_1 = require("kafkajs");
const kafkaBrokers = process.env.KAFKA_BROKERS?.split(',') || ['d2ka4bpmodb6qsnjj8e0.any.ap-south-1.mpx.prd.cloud.redpanda.com:9092'];
const saslMechanism = process.env.KAFKA_SASL_MECHANISM || 'scram-sha-256';
// Only create Kafka instance if credentials are provided
const kafkaUsername = process.env.KAFKA_USERNAME;
const kafkaPassword = process.env.KAFKA_PASSWORD;
const kafka = new kafkajs_1.Kafka({
    clientId: 'emergency-alerts',
    brokers: kafkaBrokers,
    ssl: {},
    sasl: kafkaUsername && kafkaPassword ? (saslMechanism === 'scram-sha-256'
        ? {
            mechanism: 'scram-sha-256',
            username: kafkaUsername,
            password: kafkaPassword
        }
        : {
            mechanism: 'scram-sha-512',
            username: kafkaUsername,
            password: kafkaPassword
        }) : undefined
});
exports.producer = kafka.producer();
const initializeProducer = async () => {
    try {
        await exports.producer.connect();
        console.log('Connected to RedPanda Kafka producer');
    }
    catch (error) {
        console.log('RedPanda Kafka producer not available, continuing without Kafka');
        console.error('Kafka producer error:', error);
    }
};
exports.initializeProducer = initializeProducer;
