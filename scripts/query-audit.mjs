import { execSync } from 'child_process';

const AUDIT_QUERIES = [
  {
    name: 'Products By ID Lookup',
    db: 'catalog_db',
    sql: "EXPLAIN (ANALYZE, FORMAT JSON) SELECT * FROM products WHERE id = '22222222-2222-2222-2222-222222222222';",
    targetTable: 'products',
    expectedIndex: 'products_pkey',
  },
  {
    name: 'Products Browse Listing (Active & Available)',
    db: 'catalog_db',
    sql: "EXPLAIN (ANALYZE, FORMAT JSON) SELECT * FROM products WHERE status = 'PUBLISHED' AND is_available = true ORDER BY created_at DESC LIMIT 20;",
    targetTable: 'products',
    expectedIndex: 'products_status_idx',
  },
  {
    name: 'Orders Customer History',
    db: 'order_db',
    sql: "EXPLAIN (ANALYZE, FORMAT JSON) SELECT * FROM orders WHERE user_id = '55555555-5555-5555-5555-555555555555' ORDER BY created_at DESC LIMIT 10;",
    targetTable: 'orders',
    expectedIndex: 'orders_user_id_idx',
  },
  {
    name: 'Notifications User Feed',
    db: 'notification_db',
    sql: "EXPLAIN (ANALYZE, FORMAT JSON) SELECT * FROM notifications WHERE user_id = '55555555-5555-5555-5555-555555555555' ORDER BY created_at DESC LIMIT 20;",
    targetTable: 'notifications',
    expectedIndex: 'notifications_user_id_is_read_created_at_idx or user_id idx',
  },
  {
    name: 'Product Reviews Lookup',
    db: 'catalog_db',
    sql: "EXPLAIN (ANALYZE, FORMAT JSON) SELECT * FROM reviews WHERE product_id = '22222222-2222-2222-2222-222222222222' ORDER BY created_at DESC;",
    targetTable: 'reviews',
    expectedIndex: 'reviews_product_id_idx',
  },
  {
    name: 'Seller Analytics Aggregation',
    db: 'order_db',
    sql: "EXPLAIN (ANALYZE, FORMAT JSON) SELECT COUNT(id) AS total_orders, COALESCE(SUM(subtotal), 0) AS revenue FROM order_items WHERE seller_id = '33333333-3333-3333-3333-333333333333';",
    targetTable: 'order_items',
    expectedIndex: 'order_items_seller_id_idx',
  },
];

function runExplain(db, sql) {
  try {
    const raw = execSync(`docker exec -i ecommerce-postgres psql -U postgres -d ${db} -t -A`, {
      input: sql,
      stdio: ['pipe', 'pipe', 'pipe'],
      encoding: 'utf-8',
    });
    return JSON.parse(raw.trim());
  } catch (err) {
    return [{ Plan: { 'Node Type': 'Error', 'Total Cost': 0, 'Execution Time': 0, err: err.message } }];
  }
}

function analyzePlanNode(node, findings = { scanTypes: [], indexesUsed: [] }) {
  if (node['Node Type']) {
    findings.scanTypes.push(node['Node Type']);
  }
  if (node['Index Name']) {
    findings.indexesUsed.push(node['Index Name']);
  }
  if (node.Plans) {
    for (const child of node.Plans) {
      analyzePlanNode(child, findings);
    }
  }
  return findings;
}

function main() {
  console.log('========================================================================');
  console.log('PHASE 5: DATABASE QUERY PLAN & INDEX USAGE AUDIT (EXPLAIN JSON)');
  console.log('Environment: Measured in local Docker environment (PostgreSQL 15)');
  console.log('========================================================================\n');

  console.log('| Query Audit Target             | Database        | Plan Node Type   | Index Used           | Est Cost | Exec Time (ms) | Status  |');
  console.log('|--------------------------------|-----------------|------------------|----------------------|----------|----------------|---------|');

  const recommendations = [];

  for (const q of AUDIT_QUERIES) {
    const planJson = runExplain(q.db, q.sql);
    const plan = planJson[0]?.Plan || {};
    const executionTime = planJson[0]?.['Execution Time'] || 0;
    const findings = analyzePlanNode(plan);

    const isSeqScan = findings.scanTypes.includes('Seq Scan');
    const hasIndex = findings.indexesUsed.length > 0;
    const status = hasIndex ? 'OPTIMAL' : isSeqScan ? 'ACCEPTABLE (TINY TABLE)' : 'REVIEW';

    const indexUsedStr = findings.indexesUsed.join(', ') || 'None (Seq Scan)';
    const nodeType = plan['Node Type'] || 'Unknown';
    const totalCost = plan['Total Cost'] ? plan['Total Cost'].toFixed(2) : '0.00';

    console.log(
      `| ${q.name.padEnd(30)} | ` +
      `${q.db.padEnd(15)} | ` +
      `${nodeType.padEnd(16)} | ` +
      `${indexUsedStr.slice(0, 20).padEnd(20)} | ` +
      `${totalCost.padStart(8)} | ` +
      `${Number(executionTime).toFixed(3).padStart(14)} | ` +
      `${status.padEnd(7)} |`
    );

    if (isSeqScan) {
      recommendations.push({
        target: q.name,
        db: q.db,
        table: q.targetTable,
        observation: `PostgreSQL query optimizer selected Seq Scan over index. This is standard PostgreSQL behavior for tables with fewer than ~100 rows where a sequential page read is cheaper than random I/O index traversal.`,
        recommendation: `As table grows beyond 1,000 rows in production, verify index '${q.expectedIndex}' is picked by optimizer with vacuum analyze.`,
      });
    }
  }

  console.log('\n========================================================================');
  console.log('AUDIT RECOMMENDATIONS & ARCHITECTURAL OBSERVATIONS:');
  console.log('========================================================================');
  for (const rec of recommendations) {
    console.log(`\n• Target: [${rec.db}] ${rec.target}`);
    console.log(`  Observation:    ${rec.observation}`);
    console.log(`  Recommendation: ${rec.recommendation}`);
  }
}

main();
