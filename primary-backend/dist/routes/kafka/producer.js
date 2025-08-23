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
exports.initializeProducer = exports.producer = void 0;
const kafkajs_1 = require("kafkajs");
const kafkaBrokers = ((_a = process.env.KAFKA_BROKERS) === null || _a === void 0 ? void 0 : _a.split(',')) || ['d2ka4bpmodb6qsnjj8e0.any.ap-south-1.mpx.prd.cloud.redpanda.com:9092'];
const saslMechanism = process.env.KAFKA_SASL_MECHANISM || 'scram-sha-256';
const kafka = new kafkajs_1.Kafka({
    clientId: 'emergency-alerts',
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
exports.producer = kafka.producer();
const initializeProducer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.producer.connect();
        console.log('Connected to RedPanda Kafka producer');
    }
    catch (error) {
        console.log('RedPanda Kafka producer not available, continuing without Kafka');
        console.error('Kafka producer error:', error);
    }
});
exports.initializeProducer = initializeProducer;
