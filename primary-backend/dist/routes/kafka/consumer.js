"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consumer = void 0;
const kafkajs_1 = require("kafkajs");
const kafka = new kafkajs_1.Kafka({
    clientId: 'emergency-alert-service',
    brokers: ['localhost:9092']
});
exports.consumer = kafka.consumer({ groupId: 'alert-group' });
