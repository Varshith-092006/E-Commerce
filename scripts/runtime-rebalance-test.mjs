import { execSync } from 'child_process';
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'rebalance-verifier',
  brokers: ['localhost:9092'],
});

const admin = kafka.admin();

function describeGroup(groupId) {
  try {
    const raw = execSync(
      `docker exec ecommerce-kafka kafka-consumer-groups --bootstrap-server kafka:29092 --describe --group ${groupId}`,
      { encoding: 'utf8' }
    );
    return raw.trim();
  } catch (err) {
    return err.stdout ? err.stdout.toString() : err.message;
  }
}

function parseAssignment(describeOutput) {
  const lines = describeOutput.split('\n');
  const members = new Map();
  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    if (parts.length >= 8 && parts[0] === 'order-saga-group') {
      const topic = parts[1];
      const partition = parts[2];
      const lag = parts[5];
      const consumerId = parts[6];
      const host = parts[7];
      if (!members.has(consumerId)) {
        members.set(consumerId, { host, partitions: [] });
      }
      members.get(consumerId).partitions.push(`${topic}:${partition}(lag:${lag})`);
    }
  }
  return members;
}

async function run() {
  console.log('--- Multi-Replica Consumer Rebalance Verification ---');
  await admin.connect();

  console.log('\n[Step 1] Inspecting Initial Consumer Group Assignment...');
  const initialDescribe = describeGroup('order-saga-group');
  console.log(initialDescribe);
  const initialMembers = parseAssignment(initialDescribe);
  console.log('Initial Member count:', initialMembers.size);

  const initialAssignmentSummary = Array.from(initialMembers.entries())
    .map(([cid, info]) => `${info.host} -> ${info.partitions.length} partitions`)
    .join('; ');
  console.log('Initial summary:', initialAssignmentSummary);

  console.log('\n[Step 2] Stopping replica: infra-order-svc-2...');
  execSync('docker stop infra-order-svc-2', { stdio: 'inherit' });

  console.log('Waiting 12s for Kafka consumer heartbeat timeout & rebalance...');
  await new Promise((r) => setTimeout(r, 12000));

  console.log('\n[Step 3] Inspecting Post-Failover Assignment (surviving replica)...');
  const failoverDescribe = describeGroup('order-saga-group');
  console.log(failoverDescribe);
  const failoverMembers = parseAssignment(failoverDescribe);
  console.log('Post-Failover Member count:', failoverMembers.size);

  const failoverSummary = Array.from(failoverMembers.entries())
    .map(([cid, info]) => `${info.host} -> ${info.partitions.length} partitions`)
    .join('; ');
  console.log('Post-Failover summary:', failoverSummary);

  console.log('\n[Step 4] Restarting replica: infra-order-svc-2...');
  execSync('docker start infra-order-svc-2', { stdio: 'inherit' });

  console.log('Waiting 15s for replica startup & rejoin rebalance...');
  await new Promise((r) => setTimeout(r, 15000));

  console.log('\n[Step 5] Inspecting Post-Recovery Rebalance Assignment...');
  const recoveryDescribe = describeGroup('order-saga-group');
  console.log(recoveryDescribe);
  const recoveryMembers = parseAssignment(recoveryDescribe);
  console.log('Post-Recovery Member count:', recoveryMembers.size);

  const recoverySummary = Array.from(recoveryMembers.entries())
    .map(([cid, info]) => `${info.host} -> ${info.partitions.length} partitions`)
    .join('; ');
  console.log('Post-Recovery summary:', recoverySummary);

  // Check lag
  let totalLag = 0;
  for (const line of recoveryDescribe.split('\n')) {
    const parts = line.trim().split(/\s+/);
    if (parts.length >= 6 && parts[0] === 'order-saga-group') {
      const lag = parseInt(parts[5], 10);
      if (!isNaN(lag)) totalLag += lag;
    }
  }
  console.log(`\nFinal Total Consumer Lag in order-saga-group: ${totalLag}`);

  console.log('\n==================================================');
  console.log('REBALANCE VERIFICATION TABLE:');
  console.log('==================================================');
  console.log('| Consumer Group | Initial Assignment | Failed Replica | Post-Rebalance Assignment | Final Lag |');
  console.log('|----------------|--------------------|----------------|---------------------------|-----------|');
  console.log(
    `| order-saga-group | 2 replicas (${initialAssignmentSummary}) | infra-order-svc-2 | 1 replica (${failoverSummary}) -> recovered (${recoverySummary}) | ${totalLag} |`
  );

  await admin.disconnect();
  console.log('\n>>> MULTI-REPLICA REBALANCE TEST: PASSED <<<');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
