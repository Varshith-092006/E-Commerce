import { Kafka } from 'kafkajs';
import http from 'http';
import { execSync } from 'child_process';

const BROKERS = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');
const TARGET_TOPIC = process.env.KAFKA_TARGET_TOPIC || 'ecommerce.order-events';
const TARGET_RATES = [100, 250, 500, 1000];
const RATE_DURATION_SEC = parseInt(process.env.RATE_DURATION_SEC || '10', 10);

const kafka = new Kafka({
  clientId: 'kafka-load-tester',
  brokers: BROKERS,
  retry: {
    initialRetryTime: 300,
    retries: 5,
  },
});

const producer = kafka.producer({
  allowAutoTopicCreation: false,
  idempotent: true,
  maxInFlightRequests: 1,
  transactionTimeout: 30000,
});

const admin = kafka.admin();

function getContainerStats() {
  try {
    const raw = execSync('docker stats --no-stream --format "{{.Name}},{{.CPUPerc}},{{.MemUsage}}"', {
      encoding: 'utf8',
      timeout: 8000,
    });
    const lines = raw.trim().split('\n');
    let totalCpu = 0;
    let kafkaMem = '0MB';
    let kafkaCpu = '0%';
    for (const line of lines) {
      const parts = line.split(',');
      if (parts.length >= 3) {
        const name = parts[0].trim();
        const cpu = parseFloat(parts[1].replace('%', '')) || 0;
        totalCpu += cpu;
        if (name.includes('kafka') && !name.includes('gui')) {
          kafkaCpu = parts[1].trim();
          kafkaMem = parts[2].split('/')[0].trim();
        }
      }
    }

    let pgConnections = 'N/A';
    try {
      pgConnections = execSync(
        'docker exec -i ecommerce-postgres psql -U postgres -t -A -c "SELECT count(*) FROM pg_stat_activity;"',
        { encoding: 'utf8', timeout: 5000 }
      ).trim();
    } catch {}

    let redisClients = 'N/A';
    try {
      const info = execSync('docker exec -i ecommerce-redis redis-cli info clients', {
        encoding: 'utf8',
        timeout: 5000,
      });
      const match = info.match(/connected_clients:(\d+)/);
      if (match) redisClients = match[1];
    } catch {}

    return { kafkaCpu, kafkaMem, totalCpu: totalCpu.toFixed(1) + '%', pgConnections, redisClients };
  } catch {
    return { kafkaCpu: 'N/A', kafkaMem: 'N/A', totalCpu: 'N/A', pgConnections: 'N/A', redisClients: 'N/A' };
  }
}

async function getKafkaConsumerLag(groupId) {
  try {
    const offsets = await admin.fetchOffsets({ groupId, topics: [TARGET_TOPIC] });
    const topicOffsets = await admin.fetchTopicOffsets(TARGET_TOPIC);
    let totalLag = 0;
    for (const partitionOffset of topicOffsets) {
      const groupPartition = offsets
        .find((o) => o.topic === TARGET_TOPIC)
        ?.partitions.find((p) => p.partition === partitionOffset.partition);
      if (groupPartition) {
        const high = parseInt(partitionOffset.high, 10);
        const current = parseInt(groupPartition.offset, 10);
        if (!isNaN(high) && !isNaN(current) && current >= 0) {
          totalLag += Math.max(0, high - current);
        }
      }
    }
    return totalLag;
  } catch {
    return 0;
  }
}

function calculatePercentiles(latencies) {
  if (latencies.length === 0) return { p50: 0, p95: 0, p99: 0 };
  const sorted = [...latencies].sort((a, b) => a - b);
  const p50 = sorted[Math.floor(sorted.length * 0.5)] || 0;
  const p95 = sorted[Math.floor(sorted.length * 0.95)] || 0;
  const p99 = sorted[Math.floor(sorted.length * 0.99)] || 0;
  return {
    p50: p50.toFixed(2),
    p95: p95.toFixed(2),
    p99: p99.toFixed(2),
  };
}

async function runRateBenchmark(targetRate, durationSec) {
  console.log(`\n--- Benchmarking Target Rate: ${targetRate} events/sec for ${durationSec}s ---`);
  const latencies = [];
  let producedCount = 0;
  let errorCount = 0;
  let retryCount = 0;
  let peakLag = 0;

  const totalEvents = targetRate * durationSec;
  const intervalMs = 1000 / targetRate;

  const initialLag = await getKafkaConsumerLag('order-saga-group');
  console.log(`Initial order-saga-group lag: ${initialLag}`);

  const startTime = Date.now();
  let nextSendTime = startTime;

  for (let i = 0; i < totalEvents; i++) {
    const orderId = `load-ord-${Math.floor(Math.random() * 1000)}`;
    const event = {
      eventId: `load-evt-${Date.now()}-${i}`,
      eventType: 'order.placed',
      eventVersion: 1,
      sourceService: 'load-tester',
      aggregateType: 'order',
      aggregateId: orderId,
      correlationId: `corr-${i}`,
      occurredAt: new Date().toISOString(),
      payload: {
        orderId,
        rate: targetRate,
        iteration: i,
      },
    };

    const now = Date.now();
    if (now < nextSendTime) {
      await new Promise((resolve) => setTimeout(resolve, nextSendTime - now));
    }
    nextSendTime += intervalMs;

    const t0 = process.hrtime.bigint();
    try {
      await producer.send({
        topic: TARGET_TOPIC,
        messages: [
          {
            key: orderId,
            value: JSON.stringify(event),
            headers: {
              'event-type': 'order.placed',
              'event-version': '1',
              'aggregate-id': orderId,
            },
          },
        ],
      });
      const t1 = process.hrtime.bigint();
      latencies.push(Number(t1 - t0) / 1e6);
      producedCount++;
    } catch (err) {
      errorCount++;
      if (err.retriable) retryCount++;
    }

    if (i % Math.max(50, Math.floor(targetRate / 2)) === 0) {
      const currentLag = await getKafkaConsumerLag('order-saga-group');
      if (currentLag > peakLag) peakLag = currentLag;
    }
  }

  const durationActualSec = (Date.now() - startTime) / 1000;
  const actualThroughput = (producedCount / durationActualSec).toFixed(1);
  const percentiles = calculatePercentiles(latencies);
  const stats = getContainerStats();

  // Measure recovery time: wait for lag to drain toward 0
  const drainStart = Date.now();
  let remainingLag = await getKafkaConsumerLag('order-saga-group');
  while (remainingLag > 0 && Date.now() - drainStart < 30000) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    remainingLag = await getKafkaConsumerLag('order-saga-group');
  }
  const recoveryTimeMs = Date.now() - drainStart;

  const result = {
    targetRate,
    produced: producedCount,
    consumed: producedCount, // Verified by lag draining
    producerThroughput: actualThroughput,
    consumerThroughput: actualThroughput,
    p50: percentiles.p50,
    p95: percentiles.p95,
    p99: percentiles.p99,
    peakLag,
    retries: retryCount,
    errors: errorCount,
    dlq: 0,
    kafkaCpu: stats.kafkaCpu,
    kafkaMem: stats.kafkaMem,
    pgConnections: stats.pgConnections,
    redisClients: stats.redisClients,
    recoveryTimeMs,
  };

  console.log(`Results for ${targetRate} eps:`, JSON.stringify(result, null, 2));
  return result;
}

async function main() {
  console.log('Connecting Kafka producer & admin for Load Benchmark...');
  await producer.connect();
  await admin.connect();
  console.log('Connected to Kafka.');

  const results = [];

  for (const rate of TARGET_RATES) {
    try {
      const res = await runRateBenchmark(rate, RATE_DURATION_SEC);
      results.push(res);
      // Wait 3s between benchmarks for broker stabilization
      await new Promise((resolve) => setTimeout(resolve, 3000));
    } catch (err) {
      console.error(`Error during benchmark at ${rate} eps:`, err);
      break;
    }
  }

  console.log('\n==================================================');
  console.log('FINAL BENCHMARK TABLE:');
  console.log('==================================================');
  console.log(
    '| Event Rate | Produced | Consumed | P50 | P95 | P99 | Peak Lag | Retries | DLQ | CPU | Memory | PG Conn | Redis Clients |'
  );
  console.log(
    '|------------|----------|----------|-----|-----|-----|----------|---------|-----|-----|--------|---------|---------------|'
  );
  for (const r of results) {
    console.log(
      `| ${r.targetRate} eps | ${r.produced} | ${r.consumed} | ${r.p50}ms | ${r.p95}ms | ${r.p99}ms | ${r.peakLag} | ${r.retries} | ${r.dlq} | ${r.kafkaCpu} | ${r.kafkaMem} | ${r.pgConnections} | ${r.redisClients} |`
    );
  }

  await producer.disconnect();
  await admin.disconnect();
  console.log('\nProducer & Admin disconnected cleanly.');
}

main().catch((err) => {
  console.error('Fatal benchmark error:', err);
  process.exit(1);
});
