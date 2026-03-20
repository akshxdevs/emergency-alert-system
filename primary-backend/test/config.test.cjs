const test = require("node:test");
const assert = require("node:assert/strict");

const { createBackendConfig } = require("../dist/lib/env.js");

test("createBackendConfig reads required values", () => {
  const config = createBackendConfig({
    PORT: "5050",
    DATABASE_URL: "postgresql://db",
    JWT_SECRET: "secret",
    REDIS_URL: "redis://localhost:6379",
    KAFKA_BROKERS: "broker-1:9092,broker-2:9092",
  });

  assert.equal(config.port, 5050);
  assert.equal(config.databaseUrl, "postgresql://db");
  assert.equal(config.jwtSecret, "secret");
  assert.equal(config.redisUrl, "redis://localhost:6379");
  assert.deepEqual(config.kafkaBrokers, ["broker-1:9092", "broker-2:9092"]);
});

test("createBackendConfig fails when required values are missing", () => {
  assert.throws(
    () =>
      createBackendConfig({
        PORT: "5000",
        DATABASE_URL: "postgresql://db",
        REDIS_URL: "redis://localhost:6379",
      }),
    /JWT_SECRET/
  );
});

test("createBackendConfig rejects invalid port values", () => {
  assert.throws(
    () =>
      createBackendConfig({
        PORT: "abc",
        DATABASE_URL: "postgresql://db",
        JWT_SECRET: "secret",
        REDIS_URL: "redis://localhost:6379",
      }),
    /Invalid PORT/
  );
});
