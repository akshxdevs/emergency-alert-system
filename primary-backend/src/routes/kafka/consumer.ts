import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId:'emergency-alert-service',
    brokers: ['localhost:9092'],
  });

export const consumer = kafka.consumer({groupId:'alert-group'});