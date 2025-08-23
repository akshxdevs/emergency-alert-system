"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeAdmin = exports.admin = void 0;
const kafkajs_1 = require("kafkajs");
const kafkaBrokers = ((_a = process.env.KAFKA_BROKERS) === null || _a === void 0 ? void 0 : _a.split(',')) || ['d2ka4bpmodb6qsnjj8e0.any.ap-south-1.mpx.prd.cloud.redpanda.com:9092'];
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
const initializeAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.admin.connect();
        console.log('Connected to RedPanda Kafka admin');
        // Create emergency alert topics
        yield exports.admin.createTopics({
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
        yield exports.admin.disconnect();
    }
    catch (error) {
        console.log('RedPanda Kafka admin not available');
        console.error('Kafka admin error:', error);
    }
});
exports.initializeAdmin = initializeAdmin;
