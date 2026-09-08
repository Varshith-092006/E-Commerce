import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'ordering-tester',
  brokers: ['localhost:9092'],
  retry: { retries: 5 },
});

const producer = kafka.producer({
  allowAutoTopicCreation: false,
  idempotent: true,
  maxInFlightRequests: 1,
});

const groupId = `ordering-test-group-${Date.now()}`;
const consumer = kafka.consumer({ groupId });

async function run() {
  console.log('Connecting producer and consumer...');
  await producer.connect();
  await consumer.connect();

  const TOPIC = 'ecommerce.order-events';
  await consumer.subscribe({ topic: TOPIC, fromBeginning: true });

  const receivedSingleOrder = [];
  const partitionMap = new Map();

  let joinedResolve;
  const joinedPromise = new Promise((resolve) => {
    joinedResolve = resolve;
  });

  consumer.on(consumer.events.GROUP_JOIN, (e) => {
    console.log('Consumer group joined partitions:', e.payload.memberAssignment);
    joinedResolve();
  });

  const testOrderId = `order-ordering-${Date.now()}`;

  consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const val = JSON.parse(message.value.toString());
        if (val.aggregateId === testOrderId) {
          receivedSingleOrder.push({
            eventType: val.eventType,
            partition,
            offset: message.offset,
            key: message.key?.toString(),
          });
        }
        if (val.aggregateId && val.aggregateId.startsWith('order-dist-')) {
          partitionMap.set(val.aggregateId, partition);
        }
      } catch (e) {
        // Ignore other messages on topic
      }
    },
  });

  console.log('Waiting for consumer to join group...');
  await joinedPromise;
  console.log('Consumer group ready. Resetting tracking buffers...');
  receivedSingleOrder.length = 0;
  partitionMap.clear();

  // 1. Send sequential events for testOrderId
  console.log(`Sending sequential events for ${testOrderId}...`);
  const sequence = [
    'order.created',
    'order.confirmed',
    'payment.authorized',
    'payment.captured',
    'fulfillment.started',
  ];

  const publishedMeta = [];
  for (const eventType of sequence) {
    const meta = await producer.send({
      topic: TOPIC,
      messages: [
        {
          key: testOrderId,
          value: JSON.stringify({
            eventId: `evt-${Date.now()}-${eventType}`,
            eventType,
            eventVersion: 1,
            aggregateType: 'order',
            aggregateId: testOrderId,
            occurredAt: new Date().toISOString(),
            payload: { orderId: testOrderId, step: eventType },
          }),
        },
      ],
    });
    publishedMeta.push({
      eventType,
      partition: meta[0].partition,
      baseOffset: meta[0].baseOffset,
    });
  }

  // 2. Send concurrent events for 10 different orders
  console.log('Sending events for 10 different orders to verify distribution...');
  const differentOrders = Array.from({ length: 10 }, (_, i) => `order-dist-${i}`);
  for (const orderId of differentOrders) {
    await producer.send({
      topic: TOPIC,
      messages: [
        {
          key: orderId,
          value: JSON.stringify({
            eventId: `evt-${Date.now()}-${orderId}`,
            eventType: 'order.created',
            eventVersion: 1,
            aggregateType: 'order',
            aggregateId: orderId,
            occurredAt: new Date().toISOString(),
            payload: { orderId },
          }),
        },
      ],
    });
  }

  // Wait for all messages to be received
  const deadline = Date.now() + 8000;
  while (
    (receivedSingleOrder.length < sequence.length || partitionMap.size < differentOrders.length) &&
    Date.now() < deadline
  ) {
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log('\n--- Ordering Verification Results ---');
  console.log('Published order-123 metadata:', JSON.stringify(publishedMeta, null, 2));
  console.log('Received order-123 sequence:', JSON.stringify(receivedSingleOrder, null, 2));

  // Check same partition
  const singlePartition = publishedMeta[0].partition;
  const allSamePartition = publishedMeta.every((m) => m.partition === singlePartition);
  console.log(`All order-123 events published to partition ${singlePartition}: ${allSamePartition}`);

  // Check monotonic offsets
  let strictlyIncreasing = true;
  for (let i = 1; i < publishedMeta.length; i++) {
    if (BigInt(publishedMeta[i].baseOffset) <= BigInt(publishedMeta[i - 1].baseOffset)) {
      strictlyIncreasing = false;
    }
  }
  console.log(`Offsets strictly increasing: ${strictlyIncreasing}`);

  // Check consumer received exact sequence
  const receivedSequence = receivedSingleOrder.map((r) => r.eventType);
  const sequenceMatches = JSON.stringify(sequence) === JSON.stringify(receivedSequence);
  console.log(`Received sequence matches published sequence: ${sequenceMatches}`);

  // Check partition distribution across different orders
  const uniquePartitionsUsed = new Set(partitionMap.values());
  console.log(`Different orders distributed across partitions:`, Array.from(uniquePartitionsUsed));
  const multiPartition = uniquePartitionsUsed.size > 1;
  console.log(`Multi-partition distribution achieved: ${multiPartition} (${uniquePartitionsUsed.size} partitions)`);

  await consumer.disconnect();
  await producer.disconnect();

  if (allSamePartition && strictlyIncreasing && sequenceMatches && multiPartition) {
    console.log('\n>>> EVENT ORDERING TEST: PASSED <<<');
    process.exit(0);
  } else {
    console.error('\n>>> EVENT ORDERING TEST: FAILED <<<');
    process.exit(1);
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
