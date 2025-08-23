"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeAdmin = exports.admin = void 0;
const kafkajs_1 = require("kafkajs");
const kafkaBrokers = process.env.KAFKA_BROKERS?.split(',') || ['d2ka4bpmodb6qsnjj8e0.any.ap-south-1.mpx.prd.cloud.redpanda.com:9092'];
const saslMechanism = process.env.KAFKA_SASL_MECHANISM || 'scram-sha-256';
const kafkaUsername = process.env.KAFKA_USERNAME;
const kafkaPassword = process.env.KAFKA_PASSWORD;
const hasValidCredentials = kafkaUsername &&
    kafkaPassword &&
    kafkaUsername !== 'your_username' &&
    kafkaPassword !== 'your_password';
let redpanda = null;
let adminInstance = null;
if (hasValidCredentials) {
    redpanda = new kafkajs_1.Kafka({
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
exports.admin = adminInstance;
const initializeAdmin = async () => {
    if (!exports.admin) {
        console.log('⚠️ Kafka admin not available - no valid credentials provided');
        return;
    }
    try {
        await exports.admin.connect();
        console.log('Connected to RedPanda Kafka admin');
        // Try to create emergency alert topics (optional - may fail due to permissions)
        try {
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
        }
        catch (topicError) {
            if (topicError.type === 'TOPIC_AUTHORIZATION_FAILED') {
                console.log('Topic creation failed - topics may already exist or insufficient permissions');
                console.log('Application will continue using existing topics');
            }
            else {
                console.log('Topic creation failed:', topicError.message);
            }
        }
        await exports.admin.disconnect();
    }
    catch (error) {
        console.log('RedPanda Kafka admin not available');
        console.error('Kafka admin error:', error);
    }
};
exports.initializeAdmin = initializeAdmin;
