import { Kafka, logLevel } from 'kafkajs';

import { logger as defaultLogger } from '../utils/logger.js';

export class KafkaClient {
  constructor({
    clientId = process.env.KAFKA_CLIENT_ID || 'ecommerce-platform',
    brokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    connectionTimeout = 10000,
    requestTimeout = 30000,
    retry = { initialRetryTime: 300, retries: 5 },
    logger = defaultLogger,
  } = {}) {
    this.clientId = clientId;
    this.brokers = brokers.map((b) => b.trim());
    this.logger = logger;
    this.isConnected = false;

    let ssl = undefined;
    if (process.env.KAFKA_SSL === 'true') {
      ssl = {
        rejectUnauthorized: process.env.KAFKA_SSL_REJECT_UNAUTHORIZED !== 'false',
      };
    }

    let sasl = undefined;
    if (process.env.KAFKA_SASL_USERNAME && process.env.KAFKA_SASL_PASSWORD) {
      const mechanism = (process.env.KAFKA_SASL_MECHANISM || 'plain').toLowerCase();
      sasl = {
        mechanism,
        username: process.env.KAFKA_SASL_USERNAME,
        password: process.env.KAFKA_SASL_PASSWORD,
      };
    }

    this.kafka = new Kafka({
      clientId: this.clientId,
      brokers: this.brokers,
      connectionTimeout,
      requestTimeout,
      retry,
      ssl,
      sasl,
      logLevel: logLevel.NOTHING,
    });
  }

  getKafkaInstance() {
    return this.kafka;
  }

  /**
   * Performs readiness check against broker cluster admin API
   */
  async checkHealth() {
    const admin = this.kafka.admin();
    try {
      await admin.connect();
      const clusterInfo = await admin.describeCluster();
      await admin.disconnect();
      return {
        status: 'up',
        clusterId: clusterInfo.clusterId,
        brokerCount: clusterInfo.brokers?.length || 0,
      };
    } catch (err) {
      this.logger.warn({ err: err.message }, 'Kafka cluster healthcheck failed');
      return {
        status: 'down',
        error: err.message,
      };
    }
  }
}

export const kafkaClient = new KafkaClient();
