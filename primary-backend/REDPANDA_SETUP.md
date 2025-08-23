# RedPanda Kafka Integration Setup

This guide explains how to configure your emergency alert system to use RedPanda Kafka.

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# RedPanda Kafka Configuration
KAFKA_BROKERS=d2ka4bpmodb6qsnjj8e0.any.ap-south-1.mpx.prd.cloud.redpanda.com:9092
KAFKA_SASL_MECHANISM=scram-sha-256
KAFKA_USERNAME=your_redpanda_username
KAFKA_PASSWORD=your_redpanda_password
```

## Configuration Details

- **KAFKA_BROKERS**: RedPanda broker URL (default: your provided RedPanda endpoint)
- **KAFKA_SASL_MECHANISM**: Authentication mechanism (scram-sha-256 or scram-sha-512)
- **KAFKA_USERNAME**: Your RedPanda username
- **KAFKA_PASSWORD**: Your RedPanda password

## Topics Created

The system automatically creates the following topics:
- `emergency-alerts`: For emergency alert messages
- `alert-notifications`: For alert notifications

## Features

- **SSL Encryption**: All connections use SSL for security
- **SASL Authentication**: SCRAM-SHA-256/512 authentication
- **Automatic Topic Creation**: Topics are created on startup if they don't exist
- **Error Handling**: Graceful fallback if Kafka is unavailable

## Usage

The Kafka integration is automatically initialized when the server starts. The system will:

1. Connect to RedPanda using the provided credentials
2. Create necessary topics
3. Initialize producer and consumer connections
4. Log connection status

## Troubleshooting

If you see "RedPanda Kafka not available" messages:
1. Check your environment variables
2. Verify your RedPanda credentials
3. Ensure the broker URL is correct
4. Check network connectivity to RedPanda 