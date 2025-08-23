"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeAdmin = exports.admin = void 0;
const kafkajs_1 = require("kafkajs");
const kafkaBrokers = process.env.KAFKA_BROKERS?.split(',') || ['d2ka4bpmodb6qsnjj8e0.any.ap-south-1.mpx.prd.cloud.redpanda.com:9092'];
const saslMechanism = process.env.KAFKA_SASL_MECHANISM || 'scram-sha-256';
const redpanda = new kafkajs_1.Kafka({
    clientId: 'emergency-alert-admin',
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
exports.admin = redpanda.admin();
const initializeAdmin = async () => {
    try {
        await exports.admin.connect();
        console.log('Connected to RedPanda Kafka admin');
        // Create emergency alert topics
        await exports.admin.createTopics({
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
        console.log('Created emergency alert topics');
        await exports.admin.disconnect();
    }
    catch (error) {
        console.log('RedPanda Kafka admin not available');
        console.error('Kafka admin error:', error);
    }
};
exports.initializeAdmin = initializeAdmin;
