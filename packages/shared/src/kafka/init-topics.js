import { logger } from '../utils/logger.js';

import { kafkaClient } from './kafka-client.js';
import { KafkaTopics } from './kafka-topics.js';

export async function initializeKafkaTopics({
  numPartitions = parseInt(process.env.KAFKA_TOPIC_PARTITIONS || '3', 10),
  replicationFactor = parseInt(process.env.KAFKA_TOPIC_REPLICATION_FACTOR || '1', 10),
} = {}) {
  const kafka = kafkaClient.getKafkaInstance();
  const admin = kafka.admin();

  try {
    await admin.connect();
    logger.info('Connected admin client for Kafka topic initialization');

    const existingTopics = await admin.listTopics();
    const topicsToCreate = [];

    const topicConfigList = [
      { topic: KafkaTopics.ORDER_EVENTS, numPartitions, replicationFactor },
      { topic: KafkaTopics.PAYMENT_EVENTS, numPartitions, replicationFactor },
      { topic: KafkaTopics.FULFILLMENT_EVENTS, numPartitions, replicationFactor },
      { topic: KafkaTopics.NOTIFICATION_EVENTS, numPartitions, replicationFactor },
      { topic: KafkaTopics.DEAD_LETTER_EVENTS, numPartitions, replicationFactor },
      { topic: KafkaTopics.REVIEW_EVENTS, numPartitions, replicationFactor },
    ];

    for (const item of topicConfigList) {
      if (!existingTopics.includes(item.topic)) {
        topicsToCreate.push({
          topic: item.topic,
          numPartitions: item.numPartitions,
          replicationFactor: item.replicationFactor,
          configEntries: [
            { name: 'cleanup.policy', value: 'delete' },
            { name: 'retention.ms', value: '604800000' }, // 7 days
          ],
        });
      }
    }

    if (topicsToCreate.length > 0) {
      await admin.createTopics({
        topics: topicsToCreate,
        waitForLeaders: true,
      });
      logger.info(
        { createdCount: topicsToCreate.length, topics: topicsToCreate.map((t) => t.topic) },
        'Successfully initialized Kafka topics',
      );
    } else {
      logger.info('All required Kafka topics already exist');
    }

    await admin.disconnect();
    return { success: true, createdCount: topicsToCreate.length };
  } catch (err) {
    logger.warn({ err: err.message }, 'Failed to initialize Kafka topics; skipping auto-creation');
    try {
      await admin.disconnect();
    } catch (discErr) {
      // ignore
    }
    return { success: false, error: err.message };
  }
}
