"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeProducer = exports.producer = void 0;
const kafkajs_1 = require("kafkajs");
const config_1 = require("../../config");
const kafkaBrokers = config_1.KAFKA_BROKERS;
const saslMechanism = config_1.KAFKA_SASL_MECHANISM;
const kafkaUsername = config_1.KAFKA_USERNAME;
const kafkaPassword = config_1.KAFKA_PASSWORD;
const hasValidCredentials = Boolean(kafkaBrokers.length && kafkaUsername && kafkaPassword);
let kafka = null;
let producerInstance = null;
if (hasValidCredentials) {
    const username = kafkaUsername;
    const password = kafkaPassword;
    kafka = new kafkajs_1.Kafka({
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
exports.producer = producerInstance;
const initializeProducer = async () => {
    if (!exports.producer) {
        console.log('Kafka producer not available - no valid credentials provided');
        return;
    }
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
