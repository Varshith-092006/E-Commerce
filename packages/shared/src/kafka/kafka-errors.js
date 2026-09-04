import { AppError } from '../errors/app-error.js';

export class KafkaError extends AppError {
  constructor(message = 'Kafka operational error', details = {}) {
    super({
      message,
      statusCode: 500,
      errorCode: 'KAFKA_ERROR',
      details,
      isOperational: true,
    });
  }
}

export class KafkaConnectionError extends KafkaError {
  constructor(message = 'Failed to connect to Kafka broker(s)', details = {}) {
    super(message, details);
    this.name = 'KafkaConnectionError';
    this.errorCode = 'KAFKA_CONNECTION_ERROR';
    this.isRetryable = true;
    this.retryable = true;
  }
}

export class KafkaPublishError extends KafkaError {
  constructor(message = 'Failed to produce event to Kafka topic', details = {}) {
    super(message, details);
    this.name = 'KafkaPublishError';
    this.errorCode = 'KAFKA_PUBLISH_ERROR';
    this.isRetryable = true;
    this.retryable = true;
  }
}

export class KafkaConsumerError extends KafkaError {
  constructor(message = 'Error processing Kafka message in consumer', details = {}) {
    super(message, details);
    this.name = 'KafkaConsumerError';
    this.errorCode = 'KAFKA_CONSUMER_ERROR';
  }
}
