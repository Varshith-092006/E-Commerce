/**
 * Enterprise Prometheus-compatible Metrics Engine (Zero-dependency, High Performance)
 */

class Counter {
  constructor({ name, help, labelNames = [] }) {
    this.name = name;
    this.help = help;
    this.labelNames = labelNames;
    this.values = new Map();
  }

  _getLabelKey(labels = {}) {
    if (this.labelNames.length === 0) {
      return '';
    }
    return this.labelNames.map((k) => `${k}="${labels[k] ?? ''}"`).join(',');
  }

  inc(labels = {}, value = 1) {
    if (value < 0) {
      throw new Error('Counter can only be incremented with non-negative value');
    }
    const key = this._getLabelKey(labels);
    const current = this.values.get(key) || 0;
    this.values.set(key, current + value);
  }

  reset() {
    this.values.clear();
  }

  toPrometheusString() {
    const lines = [`# HELP ${this.name} ${this.help}`, `# TYPE ${this.name} counter`];
    if (this.values.size === 0 && this.labelNames.length === 0) {
      lines.push(`${this.name} 0`);
      return lines.join('\n');
    }
    for (const [labelStr, val] of this.values.entries()) {
      if (labelStr) {
        lines.push(`${this.name}{${labelStr}} ${val}`);
      } else {
        lines.push(`${this.name} ${val}`);
      }
    }
    return lines.join('\n');
  }
}

class Gauge {
  constructor({ name, help, labelNames = [] }) {
    this.name = name;
    this.help = help;
    this.labelNames = labelNames;
    this.values = new Map();
  }

  _getLabelKey(labels = {}) {
    if (this.labelNames.length === 0) {
      return '';
    }
    return this.labelNames.map((k) => `${k}="${labels[k] ?? ''}"`).join(',');
  }

  set(labels = {}, value) {
    const key = this._getLabelKey(labels);
    this.values.set(key, Number(value) || 0);
  }

  inc(labels = {}, value = 1) {
    const key = this._getLabelKey(labels);
    const current = this.values.get(key) || 0;
    this.values.set(key, current + value);
  }

  dec(labels = {}, value = 1) {
    const key = this._getLabelKey(labels);
    const current = this.values.get(key) || 0;
    this.values.set(key, current - value);
  }

  reset() {
    this.values.clear();
  }

  toPrometheusString() {
    const lines = [`# HELP ${this.name} ${this.help}`, `# TYPE ${this.name} gauge`];
    if (this.values.size === 0 && this.labelNames.length === 0) {
      lines.push(`${this.name} 0`);
      return lines.join('\n');
    }
    for (const [labelStr, val] of this.values.entries()) {
      if (labelStr) {
        lines.push(`${this.name}{${labelStr}} ${val}`);
      } else {
        lines.push(`${this.name} ${val}`);
      }
    }
    return lines.join('\n');
  }
}

class Histogram {
  constructor({
    name,
    help,
    labelNames = [],
    buckets = [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  }) {
    this.name = name;
    this.help = help;
    this.labelNames = labelNames;
    this.buckets = [...buckets].sort((a, b) => a - b);
    this.data = new Map();
  }

  _getLabelKey(labels = {}) {
    if (this.labelNames.length === 0) {
      return '';
    }
    return this.labelNames.map((k) => `${k}="${labels[k] ?? ''}"`).join(',');
  }

  observe(labels = {}, value) {
    const num = Number(value);
    if (isNaN(num)) {
      return;
    }
    const key = this._getLabelKey(labels);

    if (!this.data.has(key)) {
      const bucketCounts = new Map();
      for (const b of this.buckets) {
        bucketCounts.set(b, 0);
      }
      this.data.set(key, {
        sum: 0,
        count: 0,
        bucketCounts,
      });
    }

    const entry = this.data.get(key);
    entry.sum += num;
    entry.count += 1;

    for (const b of this.buckets) {
      if (num <= b) {
        entry.bucketCounts.set(b, entry.bucketCounts.get(b) + 1);
      }
    }
  }

  reset() {
    this.data.clear();
  }

  toPrometheusString() {
    const lines = [`# HELP ${this.name} ${this.help}`, `# TYPE ${this.name} histogram`];

    for (const [labelStr, entry] of this.data.entries()) {
      for (const b of this.buckets) {
        const bucketLabels = labelStr ? `${labelStr},le="${b}"` : `le="${b}"`;
        lines.push(`${this.name}_bucket{${bucketLabels}} ${entry.bucketCounts.get(b)}`);
      }
      const infLabels = labelStr ? `${labelStr},le="+Inf"` : `le="+Inf"`;
      lines.push(`${this.name}_bucket{${infLabels}} ${entry.count}`);
      const baseLabels = labelStr ? `{${labelStr}}` : '';
      lines.push(`${this.name}_sum${baseLabels} ${entry.sum}`);
      lines.push(`${this.name}_count${baseLabels} ${entry.count}`);
    }

    return lines.join('\n');
  }
}

export class MetricsRegistry {
  constructor() {
    this.metrics = new Map();
    this._initializeStandardMetrics();
  }

  _initializeStandardMetrics() {
    this.registerCounter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests processed',
      labelNames: ['service', 'method', 'route', 'status_code'],
    });

    this.registerHistogram({
      name: 'http_request_duration_seconds',
      help: 'HTTP request execution latency in seconds',
      labelNames: ['service', 'method', 'route', 'status_code'],
      buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
    });

    this.registerGauge({
      name: 'http_active_requests',
      help: 'Number of active in-flight HTTP requests',
      labelNames: ['service'],
    });

    this.registerCounter({
      name: 'outbox_events_total',
      help: 'Total number of transactional outbox events processed',
      labelNames: ['service', 'event_type', 'status'],
    });

    this.registerGauge({
      name: 'circuit_breaker_state',
      help: 'Circuit breaker state (0=CLOSED, 1=OPEN, 2=HALF_OPEN)',
      labelNames: ['service', 'breaker_name', 'state'],
    });

    this.registerHistogram({
      name: 'db_query_duration_seconds',
      help: 'Database query duration in seconds',
      labelNames: ['service', 'operation'],
      buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5],
    });

    // Kafka Metrics
    this.registerCounter({
      name: 'kafka_messages_produced_total',
      help: 'Total number of messages published to Kafka topics',
      labelNames: ['service', 'topic', 'event_type'],
    });

    this.registerCounter({
      name: 'kafka_messages_consumed_total',
      help: 'Total number of messages processed by Kafka consumer groups',
      labelNames: ['service', 'topic', 'event_type', 'consumer_group'],
    });

    this.registerCounter({
      name: 'kafka_consumer_errors_total',
      help: 'Total number of errors encountered during Kafka message consumption',
      labelNames: ['service', 'topic', 'consumer_group', 'error_type'],
    });

    this.registerGauge({
      name: 'kafka_consumer_lag',
      help: 'Estimated Kafka consumer lag per partition/group',
      labelNames: ['service', 'topic', 'consumer_group'],
    });

    this.registerCounter({
      name: 'kafka_dlq_messages_total',
      help: 'Total number of messages routed to Kafka Dead Letter Queue',
      labelNames: ['service', 'topic', 'consumer_group'],
    });

    this.registerHistogram({
      name: 'kafka_processing_duration_seconds',
      help: 'Kafka message execution processing duration in seconds',
      labelNames: ['service', 'topic', 'consumer_group'],
      buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
    });
  }

  registerCounter(options) {
    if (this.metrics.has(options.name)) {
      return this.metrics.get(options.name);
    }
    const metric = new Counter(options);
    this.metrics.set(options.name, metric);
    return metric;
  }

  registerGauge(options) {
    if (this.metrics.has(options.name)) {
      return this.metrics.get(options.name);
    }
    const metric = new Gauge(options);
    this.metrics.set(options.name, metric);
    return metric;
  }

  registerHistogram(options) {
    if (this.metrics.has(options.name)) {
      return this.metrics.get(options.name);
    }
    const metric = new Histogram(options);
    this.metrics.set(options.name, metric);
    return metric;
  }

  getMetric(name) {
    return this.metrics.get(name);
  }

  reset() {
    for (const metric of this.metrics.values()) {
      metric.reset();
    }
  }

  toPrometheusText() {
    const outputs = [];
    // Process default runtime metrics
    const mem = process.memoryUsage();
    outputs.push('# HELP process_resident_memory_bytes Resident memory size in bytes');
    outputs.push('# TYPE process_resident_memory_bytes gauge');
    outputs.push(`process_resident_memory_bytes ${mem.rss}`);

    outputs.push('# HELP process_heap_used_bytes Process heap used in bytes');
    outputs.push('# TYPE process_heap_used_bytes gauge');
    outputs.push(`process_heap_used_bytes ${mem.heapUsed}`);

    outputs.push('# HELP process_uptime_seconds The process uptime in seconds');
    outputs.push('# TYPE process_uptime_seconds gauge');
    outputs.push(`process_uptime_seconds ${process.uptime()}`);

    for (const metric of this.metrics.values()) {
      const metricStr = metric.toPrometheusString();
      if (metricStr) {
        outputs.push(metricStr);
      }
    }

    return outputs.join('\n\n') + '\n';
  }
}

export const metricsRegistry = new MetricsRegistry();

/**
 * Standard Express controller handler for /metrics endpoint
 */
export function metricsEndpoint(req, res) {
  try {
    const text = metricsRegistry.toPrometheusText();
    res.setHeader('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
    return res.status(200).send(text);
  } catch (err) {
    return res.status(500).send(`Error collecting metrics: ${err.message}`);
  }
}
