# Production Edge Security & Ingress Architecture
**Phase 9: Edge Hardening, Ingress Protection & Security Invariants**
*Document Version:* 1.0.0  
*Evaluation Date:* 2026-09-07  
*Status:* PASS WITH LIMITATIONS

---

## 1. Executive Overview
The edge ingress layer serves as the frontline perimeter protecting the e-commerce microservices platform. This document defines:
1. The **Local Development Edge** topology currently running in Docker Compose.
2. The **Target Production Cloud Architecture** with enterprise Cloud WAF, DDoS mitigation, and High Availability (HA) gateway routing.
3. The cryptographic TLS certificate lifecycle and protocol policies.
4. Access logging and SIEM integration standards ensuring zero credential leakage.
5. Ingress boundaries for request sizes, timeouts, and rate limits.

---

## 2. Ingress Topology Comparison

### Local Development Architecture (Current)
```
[Client / Browser]
       │ (Port 80 HTTP / Port 443 HTTPS)
       ▼
[ecommerce-nginx (Nginx 1.25 Alpine)]
       │
       ├─► Port 80: 301 Permanent Redirect to HTTPS (Port 443)
       ├─► Port 443: TLS Termination (Self-Signed Dev Certs)
       │    ├─► Strip Spoofed Internal Headers (X-Internal-Gateway-Secret, X-User-*)
       │    ├─► Inject OWASP Security Headers (nosniff, SAMEORIGIN, HSTS, Permissions-Policy)
       │    ├─► Enforce Request Body Limit (10MB) & Rate Limiting (50r/s burst=100)
       │    └─► Stream SSE Notifications Unbuffered (/api/v1/notifications/stream)
       │
       ▼
[ecommerce-gateway (Express API Gateway - Port 4000)]
       │ (Authentication, JWT Verification, Load Shedding, Rate Limiting)
       │
       ├──► identity-svc (4001)
       ├──► catalog-svc  (4002)
       ├──► order-svc    (4003)
       ├──► payment-svc  (4004)
       ├──► fulfillment-svc (4005)
       └──► notification-svc (4006)
```

### Target Production Cloud Architecture
```
[Global Clients / Attackers]
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│ Cloudflare / AWS CloudFront (Global CDN Edge)           │
│ - Layer 3/4 Volumetric DDoS Mitigation (Anycast)         │
│ - TLS 1.3 Termination with Automated Managed Certs       │
│ - Edge Caching for Static Assets & Storefront Frontends │
└──────────────────────────┬───────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│ Cloud WAF (AWS WAF / Cloudflare WAF / Cloud Armor)       │
│ - Managed Rule Sets (OWASP Top 10, SQLi, XSS, Bad Bots)  │
│ - IP Reputation, Geo-Blocking & Anomaly Detection        │
│ - Adaptive L7 Rate Limiting                              │
└──────────────────────────┬───────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│ Cloud Load Balancer (AWS Application Load Balancer - ALB)│
│ - Multi-AZ Target Groups across Private Subnets          │
│ - Mutual TLS (mTLS) or VPC Peering to Container Ingress  │
└──────────────────────────┬───────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│ Ingress Controller (Nginx / Envoy / Traefik in EKS/ECS)  │
│ - Internal Header Sanitization                           │
│ - Long-lived SSE Connection Management                   │
│ - Dynamic Service Discovery Routing                      │
└──────────────────────────┬───────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│ API Gateway Cluster (Replicated Express/Node Gateways)   │
│ - Horizontal Pod Autoscaling (HPA)                       │
│ - Stateless JWT Auth & Redis-backed Token Revocation     │
│ - Centralized Distributed Tracing (W3C traceparent)      │
└──────────────────────────┬───────────────────────────────┘
                           │
                           ▼
[Backend Microservices & Databases (Private Isolated Subnet)]
```

---

## 3. TLS Protocol Policy & Certificate Lifecycle

### Supported & Disallowed Protocols
| Protocol | Production Policy | Local Environment Status | Notes |
|:---------|:------------------|:-------------------------|:------|
| **SSLv2 / SSLv3** | **PROHIBITED** | Disabled | Insecure; vulnerable to POODLE and padding oracle attacks. |
| **TLS 1.0** | **PROHIBITED** | Disabled | Deprecated by PCI DSS 3.2 and RFC 8996. |
| **TLS 1.1** | **PROHIBITED** | Disabled | Deprecated by RFC 8996; weak cryptographic primitives. |
| **TLS 1.2** | **PERMITTED** | Supported | Enforced with strong ECDHE forward-secret ciphers. |
| **TLS 1.3** | **PREFERRED** | Supported | Modern, zero round-trip handshake with optimal cipher security. |

### Production Certificate Automation Strategy
1. **Automated ACME / Let's Encrypt:**
   - Use `certbot` or Kubernetes `cert-manager` with DNS-01 or HTTP-01 challenges.
   - Automated 60-day renewal cycle with zero downtime.
2. **Cloud Managed Certificates (AWS ACM / GCP Certificate Manager):**
   - Automatically provisions and renews SSL/TLS certificates for CloudFront, ALBs, and Cloud WAFs.
   - Eliminates private key exposure to host containers.
3. **Internal mTLS via HashiCorp Vault / Service Mesh:**
   - Short-lived X.509 certificates (24–72 hour validity) for microservice-to-microservice mutual authentication (mTLS) via Istio, Linkerd, or Consul.

---

## 4. HTTP Security Headers Specification

Every HTTPS response terminated at the Nginx edge injects the following OWASP-recommended headers:

```nginx
# Prevent clickjacking by restricting iframe framing to same origin
add_header X-Frame-Options "SAMEORIGIN" always;

# Block legacy MIME-type sniffing
add_header X-Content-Type-Options "nosniff" always;

# Legacy browser XSS filter activation
add_header X-XSS-Protection "1; mode=block" always;

# Referrer privacy: send full referrer only to same origin; origin only to cross-origin HTTPS
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# Enforce HTTPS for 1 year and include all subdomains
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

# Restrict sensitive browser hardware APIs
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
```

---

## 5. Request Boundaries & Slow-Client Protection

| Parameter | Value | Rationale |
|:----------|:------|:----------|
| `client_max_body_size` | `10M` | Accommodates bulk product catalog updates and receipt uploads while blocking memory exhaustion. |
| `client_body_buffer_size` | `128k` | Balances memory usage with high-throughput POST bodies. |
| `client_header_buffer_size` | `1k` | Sufficient for standard HTTP headers. |
| `large_client_header_buffers` | `4 8k` | Allows cookies and JWT authorization headers up to 8KB while blocking header-flooding attacks. |
| `client_header_timeout` | `15s` | Mitigates **Slowloris** attacks by timing out sluggish header transmission. |
| `client_body_timeout` | `15s` | Mitigates slow-POST attacks. |
| `send_timeout` | `15s` | Reclaims resources from stalled client connections. |
| `keepalive_timeout` | `65s` | Optimizes TCP connection reuse without stranding worker connections. |

---

## 6. Rate Limiting & Connection Quotas

### Status Code Semantics
- **HTTP 429 (Too Many Requests):** Used exclusively for rate-limiting and connection-quota enforcement. It signals that the client has exceeded its permitted request budget.
- **HTTP 503 (Service Unavailable):** Reserved strictly for application-layer load shedding, downstream outage, or server capacity exhaustion.

### Ingress Configuration
```nginx
# IP-based connection limit (maximum 50 concurrent connections per client IP)
limit_conn_zone $binary_remote_addr zone=conn_limit_per_ip:10m;
limit_conn_status 429;

# IP-based request rate limit (50 requests/sec with burst buffer of 100)
limit_req_zone $binary_remote_addr zone=req_limit_per_ip:10m rate=50r/s;
limit_req_status 429;
```

---

## 7. Structured Access Logging & Credential Redaction

Nginx access logs are emitted in high-performance structured JSON:
```nginx
log_format json_analytics escape=json '{'
  '"time_local":"$time_iso8601",'
  '"remote_addr":"$remote_addr",'
  '"request_method":"$request_method",'
  '"request_uri":"$request_uri",'
  '"status":$status,'
  '"body_bytes_sent":$body_bytes_sent,'
  '"request_time":$request_time,'
  '"upstream_response_time":"$upstream_response_time",'
  '"upstream_status":"$upstream_status",'
  '"http_referrer":"$http_referer",'
  '"http_user_agent":"$http_user_agent",'
  '"request_id":"$http_x_request_id"'
'}';
```

### Sensitive Data Redaction Policies
To maintain compliance with PCI DSS and GDPR, the following fields are **strictly prohibited** from raw access logs:
- `Authorization: Bearer <token>`
- `Cookie: session=...`
- `password`, `secret`, `api_key`, `token` in query strings or payloads.
The shared utility [`sanitizeAccessLogEntry()`](file:///c:/Users/The%20Mighty%20King/Desktop/E-Commerce/ecommerce-platform/packages/shared/src/utils/edge-hardening-planning.js) masks all matching occurrences with `[REDACTED]`.

---

## 8. Real-Time Streaming (SSE) Ingress Protection

The notification streaming endpoint (`/api/v1/notifications/stream`) requires special edge handling to maintain open HTTP connections:
1. **Unbuffered Streaming:** `proxy_buffering off;` and `proxy_cache off;` prevent Nginx from caching notification events.
2. **Chunked Encoding Bypassed:** `chunked_transfer_encoding off;` preserves standard Server-Sent Events framing.
3. **Long Keepalive Timeout:** `proxy_read_timeout 3600s;` keeps idle event streams open for up to 1 hour without premature disconnection.

---

## 9. Known Limitations & Acceptance Status

> [!NOTE]
> **Acceptance Verdict: PASS WITH LIMITATIONS**
> - **Pass:** Ingress Nginx configuration validates successfully, HTTP->HTTPS redirection functions, OWASP security headers are present, rate limiting returns HTTP 429, oversized payloads return HTTP 413, and sensitive credentials are excluded from structured logs.
> - **Limitations:** Cloud-based Anycast DDoS mitigation (Cloudflare / AWS Shield) and cloud WAF inspection rules cannot be physically run inside local Docker Compose and are documented here as production cloud edge requirements.
