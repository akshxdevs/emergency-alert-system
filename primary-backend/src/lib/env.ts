type EnvMap = Record<string, string | undefined>;

function requireEnv(env: EnvMap, key: string): string {
  const value = env[key]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

function parsePort(rawPort: string | undefined): number {
  if (!rawPort) {
    return 5000;
  }

  const port = Number.parseInt(rawPort, 10);
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error(`Invalid PORT value: ${rawPort}`);
  }

  return port;
}

export interface BackendConfig {
  port: number;
  databaseUrl: string;
  jwtSecret: string;
  redisUrl: string;
  kafkaBrokers: string[];
  kafkaSaslMechanism: "scram-sha-256" | "scram-sha-512";
  kafkaUsername?: string;
  kafkaPassword?: string;
}

export function createBackendConfig(env: EnvMap = process.env): BackendConfig {
  const kafkaSaslMechanism =
    env.KAFKA_SASL_MECHANISM === "scram-sha-512"
      ? "scram-sha-512"
      : "scram-sha-256";

  return {
    port: parsePort(env.PORT),
    databaseUrl: requireEnv(env, "DATABASE_URL"),
    jwtSecret: requireEnv(env, "JWT_SECRET"),
    redisUrl: requireEnv(env, "REDIS_URL"),
    kafkaBrokers: (env.KAFKA_BROKERS ?? "")
      .split(",")
      .map((broker) => broker.trim())
      .filter(Boolean),
    kafkaSaslMechanism,
    kafkaUsername: env.KAFKA_USERNAME?.trim() || undefined,
    kafkaPassword: env.KAFKA_PASSWORD?.trim() || undefined,
  };
}
