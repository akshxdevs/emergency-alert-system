"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeConsumer = exports.consumer = void 0;
const kafkajs_1 = require("kafkajs");
const config_1 = require("../../config");
const kafkaBrokers = config_1.KAFKA_BROKERS;
const saslMechanism = config_1.KAFKA_SASL_MECHANISM;
const kafkaUsername = config_1.KAFKA_USERNAME;
const kafkaPassword = config_1.KAFKA_PASSWORD;
const hasValidCredentials = Boolean(kafkaBrokers.length && kafkaUsername && kafkaPassword);
let kafka = null;
let consumerInstance = null;
if (hasValidCredentials) {
    const username = kafkaUsername;
    const password = kafkaPassword;
    kafka = new kafkajs_1.Kafka({
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
exports.consumer = consumerInstance;
const initializeConsumer = async () => {
    if (!exports.consumer) {
        console.log('Kafka consumer not available - no valid credentials provided');
        return;
    }
    try {
        await exports.consumer.connect();
        console.log('Connected to RedPanda Kafka consumer');
    }
    catch (error) {
        console.log('RedPanda Kafka consumer not available, continuing without Kafka');
        console.error('Kafka consumer error:', error);
    }
};
exports.initializeConsumer = initializeConsumer;
