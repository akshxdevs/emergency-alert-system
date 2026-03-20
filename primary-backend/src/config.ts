import dotenv from "dotenv";
import { createBackendConfig } from "./lib/env";

dotenv.config();

const backendConfig = createBackendConfig();

export const PORT = backendConfig.port;
export const DATABASE_URL = backendConfig.databaseUrl;
export const JWT_SECRET = backendConfig.jwtSecret;
export const REDIS_URL = backendConfig.redisUrl;
export const KAFKA_BROKERS = backendConfig.kafkaBrokers;
export const KAFKA_SASL_MECHANISM = backendConfig.kafkaSaslMechanism;
export const KAFKA_USERNAME = backendConfig.kafkaUsername;
export const KAFKA_PASSWORD = backendConfig.kafkaPassword;
