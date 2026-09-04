import { createLogger } from '@ecommerce/shared';

const logger = createLogger({ service: 'notification-svc:email-provider' });

/**
 * Determines the operating mode for the email provider:
 *
 * - MOCK:        NODE_ENV=test OR SMTP_MOCK=true
 *               No real network calls. Stores sent emails in memory.
 *
 * - LIVE:        SMTP credentials are configured (SMTP_HOST + SMTP_USER + SMTP_PASS)
 *               Uses nodemailer to send real email via SMTP.
 *               Fails clearly if credentials are misconfigured.
 *
 * - MISCONFIGURED: NODE_ENV=production + missing credentials
 *               Provider fails with a clear error rather than silently
 *               claiming success for emails that were never sent.
 */
function resolveMode() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const smtpMock = process.env.SMTP_MOCK === 'true';

  if (nodeEnv === 'test' || smtpMock) {
    return 'MOCK';
  }

  const hasCredentials = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

  if (hasCredentials) {
    return 'LIVE';
  }

  if (nodeEnv === 'production') {
    return 'MISCONFIGURED';
  }

  // Development without credentials — warn and use mock
  return 'MOCK_WARN';
}

export class EmailProvider {
  constructor({
    host = process.env.SMTP_HOST,
    port = parseInt(process.env.SMTP_PORT || '587', 10),
    secure = process.env.SMTP_SECURE === 'true',
    user = process.env.SMTP_USER,
    pass = process.env.SMTP_PASS,
    from = process.env.SMTP_FROM || 'no-reply@ecommerce.local',
    timeoutMs = parseInt(process.env.SMTP_TIMEOUT_MS || '10000', 10),
  } = {}) {
    this.host = host;
    this.port = port;
    this.secure = secure;
    this.user = user;
    this.pass = pass;
    this.from = from;
    this.timeoutMs = timeoutMs;
    this.mode = resolveMode();
    this.sentEmails = []; // In-memory audit log for mock/test mode
    this._transporter = null;

    if (this.mode === 'MOCK_WARN') {
      logger.warn(
        'EmailProvider: SMTP credentials not configured. Using mock mode. ' +
          'Set SMTP_HOST, SMTP_USER, SMTP_PASS for real email dispatch.',
      );
    }

    if (this.mode === 'MISCONFIGURED') {
      logger.error(
        'EmailProvider: SMTP credentials are REQUIRED in production. ' +
          'Set SMTP_HOST, SMTP_USER, SMTP_PASS environment variables. ' +
          'All email dispatch attempts will fail until credentials are configured.',
      );
    }
  }

  /**
   * Lazily initializes the nodemailer transporter.
   * Only created when mode is LIVE.
   */
  async _getTransporter() {
    if (this._transporter) {
      return this._transporter;
    }

    // Dynamic import — nodemailer is optional when in mock mode
    const nodemailer = await import('nodemailer');

    this._transporter = nodemailer.default.createTransport({
      host: this.host,
      port: this.port,
      secure: this.secure,
      auth: {
        user: this.user,
        pass: this.pass,
      },
      // Connection pool for efficiency
      pool: true,
      maxConnections: 5,
      // Timeout
      connectionTimeout: this.timeoutMs,
      greetingTimeout: this.timeoutMs,
      socketTimeout: this.timeoutMs,
    });

    return this._transporter;
  }

  /**
   * Dispatches email to recipient.
   *
   * Returns normalized result:
   * { success: boolean, providerMessageId: string|null, errorReason: string|null, retryable: boolean }
   *
   * IMPORTANT: Never returns success: true if no real email was sent (in production mode).
   * Mock mode is explicit and requires SMTP_MOCK=true or NODE_ENV=test.
   */
  async send({ recipient, subject, content, metadata = {} }) {
    // Basic email format check
    if (!recipient || !recipient.includes('@')) {
      return {
        success: false,
        providerMessageId: null,
        errorReason: `Invalid recipient email address: "${recipient}"`,
        retryable: false,
      };
    }

    // ── MOCK mode: test environment or SMTP_MOCK=true ────────────────────────
    if (this.mode === 'MOCK' || this.mode === 'MOCK_WARN') {
      const providerMessageId = `mock_email_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
      this.sentEmails.push({
        recipient,
        subject,
        content,
        metadata,
        providerMessageId,
        sentAt: new Date(),
        mode: this.mode,
      });

      logger.debug(
        { recipient, subject, providerMessageId, mode: this.mode },
        'Email dispatched in mock mode',
      );

      return {
        success: true,
        providerMessageId,
        errorReason: null,
        retryable: false,
        _mock: true, // Hint to callers that this was not a real dispatch
      };
    }

    // ── MISCONFIGURED: fail clearly in production with missing credentials ───
    if (this.mode === 'MISCONFIGURED') {
      const errorReason =
        'Email provider not configured: SMTP_HOST, SMTP_USER, SMTP_PASS are required. ' +
        'No email was sent.';
      logger.error({ recipient, subject }, errorReason);
      return {
        success: false,
        providerMessageId: null,
        errorReason,
        retryable: false,
      };
    }

    // ── LIVE mode: real SMTP dispatch via nodemailer ─────────────────────────
    const start = Date.now();
    try {
      const transporter = await this._getTransporter();

      const info = await transporter.sendMail({
        from: this.from,
        to: recipient,
        subject: subject || '(No Subject)',
        html: content,
        // Pass metadata as custom headers for debugging
        headers: metadata?.requestId ? { 'X-Request-Id': metadata.requestId } : undefined,
      });

      const latencyMs = Date.now() - start;
      logger.info(
        { recipient, subject, messageId: info.messageId, latencyMs },
        'Email dispatched via SMTP',
      );

      return {
        success: true,
        providerMessageId: info.messageId,
        errorReason: null,
        retryable: false,
      };
    } catch (err) {
      const latencyMs = Date.now() - start;
      const isTransient = this._isTransientError(err);

      logger.error(
        { err: err.message, recipient, latencyMs, retryable: isTransient },
        'Failed to dispatch email via SMTP',
      );

      // Reset transporter on connection errors so it reconnects
      if (isTransient) {
        this._transporter = null;
      }

      return {
        success: false,
        providerMessageId: null,
        errorReason: err.message,
        retryable: isTransient,
      };
    }
  }

  /**
   * Determines if an SMTP error is transient and worth retrying.
   */
  _isTransientError(err) {
    const transientCodes = ['ECONNRESET', 'ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND', 'EHOSTUNREACH'];
    const transientStatusCodes = [421, 450, 451, 452]; // Temp SMTP failure codes

    if (transientCodes.includes(err.code)) {
      return true;
    }
    if (err.responseCode && transientStatusCodes.includes(err.responseCode)) {
      return true;
    }
    return false;
  }

  // ── Test/Mock helpers ─────────────────────────────────────────────────────

  getSentEmails() {
    return this.sentEmails;
  }

  clearSentEmails() {
    this.sentEmails = [];
  }

  getMode() {
    return this.mode;
  }
}
