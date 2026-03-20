"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KAFKA_PASSWORD = exports.KAFKA_USERNAME = exports.KAFKA_SASL_MECHANISM = exports.KAFKA_BROKERS = exports.REDIS_URL = exports.JWT_SECRET = exports.DATABASE_URL = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const env_1 = require("./lib/env");
dotenv_1.default.config();
const backendConfig = (0, env_1.createBackendConfig)();
exports.PORT = backendConfig.port;
exports.DATABASE_URL = backendConfig.databaseUrl;
exports.JWT_SECRET = backendConfig.jwtSecret;
exports.REDIS_URL = backendConfig.redisUrl;
exports.KAFKA_BROKERS = backendConfig.kafkaBrokers;
exports.KAFKA_SASL_MECHANISM = backendConfig.kafkaSaslMechanism;
exports.KAFKA_USERNAME = backendConfig.kafkaUsername;
exports.KAFKA_PASSWORD = backendConfig.kafkaPassword;
