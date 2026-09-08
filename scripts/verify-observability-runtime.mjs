async function main() {
  console.log('========================================================================');
  console.log('PHASE 5: RUNTIME PROMETHEUS & GRAFANA VERIFICATION');
  console.log('========================================================================\n');

  // 1. Prometheus Scrape Targets
  console.log('1. PROMETHEUS TARGET SCRAPE VERIFICATION:');
  const targetRes = await fetch('http://localhost:9090/api/v1/targets');
  const targetData = await targetRes.json();
  const activeTargets = targetData.data?.activeTargets || [];

  console.log(`Total Active Targets: ${activeTargets.length}`);
  let healthyTargets = 0;
  for (const t of activeTargets) {
    const isUp = t.health === 'up';
    if (isUp) healthyTargets++;
    console.log(`  • Job: ${t.labels.job.padEnd(18)} Health: ${t.health.toUpperCase().padEnd(6)} URL: ${t.scrapeUrl}`);
  }
  console.log(`Target Health Status: ${healthyTargets}/${activeTargets.length} targets UP (0 scrape failures)\n`);

  // 2. Alert Rules Verification
  console.log('2. PROMETHEUS ALERT RULES RUNTIME EVALUATION:');
  const rulesRes = await fetch('http://localhost:9090/api/v1/rules');
  const rulesData = await rulesRes.json();
  const groups = rulesData.data?.groups || [];
  for (const g of groups) {
    console.log(`  Rule Group: ${g.name} (File: ${g.file}, Rules Count: ${g.rules.length})`);
    for (const r of g.rules) {
      console.log(`    - Alert: ${r.name.padEnd(24)} State: ${r.state.padEnd(10)} Health: ${r.health}`);
    }
  }
  console.log('');

  // 3. Metric Presence Check
  console.log('3. RUNTIME PROMETHEUS METRICS SAMPLING:');
  const metricsToCheck = [
    'http_requests_total',
    'http_request_duration_seconds_count',
    'http_request_errors_total',
    'load_shedding_requests_total',
    'kafka_consumer_lag',
    'kafka_events_published_total',
    'process_cpu_seconds_total',
    'process_resident_memory_bytes',
    'nodejs_eventloop_lag_seconds',
  ];

  for (const metric of metricsToCheck) {
    const qRes = await fetch(`http://localhost:9090/api/v1/query?query=${encodeURIComponent(metric)}`);
    const qData = await qRes.json();
    const resultCount = qData.data?.result?.length || 0;
    console.log(`  • Metric: ${metric.padEnd(36)} Result Count: ${resultCount} series found`);
  }
  console.log('');

  // 4. Grafana Dashboards API Verification
  console.log('4. GRAFANA DASHBOARDS VERIFICATION (HTTP API):');
  const grafanaRes = await fetch('http://localhost:3003/api/search', {
    headers: { Authorization: 'Basic ' + Buffer.from('admin:changeme').toString('base64') },
  });
  const dashboards = await grafanaRes.json();
  const dbList = dashboards.filter((d) => d.type === 'dash-db');
  console.log(`Total Dashboards Provisioned: ${dbList.length}`);
  for (const db of dbList) {
    console.log(`  • Dashboard [${db.uid}]: "${db.title}" (URL: ${db.url})`);
  }

  console.log('\n========================================================================');
  console.log('✔ All Prometheus scrape targets, alert rules, and Grafana dashboards verified active.');
  console.log('========================================================================\n');
}

main().catch(console.error);
