import { createLogger } from '@ecommerce/shared';

const logger = createLogger({ service: 'notification-svc:sms-provider' });

/**
 * Determines the operating mode for the SMS provider:
 *
 * - MOCK:          NODE_ENV=test OR SMS_MOCK=true
 *                 No real network calls. Stores sent SMS in memory.
 *
 * - LIVE:          Twilio credentials configured (TWILIO_ACCOUNT_SID + TWILIO_AUTH_TOKEN + TWILIO_FROM_NUMBER)
 *                 Uses Twilio SDK to send real SMS.
 *
 * - MISCONFIGURED: NODE_ENV=production + missing credentials
 *                 Provider fails with a clear error (never claims false success).
 */
function resolveMode() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const smsMock = process.env.SMS_MOCK === 'true';

  if (nodeEnv === 'test' || smsMock) {
    return 'MOCK';
  }

  const hasCredentials =
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_FROM_NUMBER;

  if (hasCredentials) {
    return 'LIVE';
  }

  if (nodeEnv === 'production') {
    return 'MISCONFIGURED';
  }

  // Development without credentials — warn and use mock
  return 'MOCK_WARN';
}

export class SmsProvider {
  constructor({
    accountSid = process.env.TWILIO_ACCOUNT_SID,
    authToken = process.env.TWILIO_AUTH_TOKEN,
    fromNumber = process.env.TWILIO_FROM_NUMBER,
    timeoutMs = parseInt(process.env.SMS_TIMEOUT_MS || '10000', 10),
  } = {}) {
    this.accountSid = accountSid;
    this.authToken = authToken;
    this.fromNumber = fromNumber;
    this.timeoutMs = timeoutMs;
    this.mode = resolveMode();
    this.sentSmsList = []; // In-memory audit log for mock/test mode
    this._twilioClient = null;

    if (this.mode === 'MOCK_WARN') {
      logger.warn(
        'SmsProvider: Twilio credentials not configured. Using mock mode. ' +
          'Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER for real SMS dispatch.',
      );
    }

    if (this.mode === 'MISCONFIGURED') {
      logger.error(
        'SmsProvider: Twilio credentials are REQUIRED in production. ' +
          'Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER. ' +
          'All SMS dispatch attempts will fail until credentials are configured.',
      );
    }
  }

  /**
   * Lazily initializes the Twilio client.
   * Only called in LIVE mode.
   */
  async _getTwilioClient() {
    if (this._twilioClient) {
      return this._twilioClient;
    }

    const twilio = await import('twilio');
    this._twilioClient = twilio.default(this.accountSid, this.authToken);
    return this._twilioClient;
  }

  /**
   * Dispatches SMS to recipient.
   *
   * Returns normalized result:
   * { success: boolean, providerMessageId: string|null, errorReason: string|null, retryable: boolean }
   *
   * IMPORTANT: Never returns success: true if no real SMS was sent (in production mode).
   */
  async send({ recipient, content, metadata = {} }) {
    // Basic phone number validation
    if (!recipient || recipient.trim().length < 8) {
      return {
        success: false,
        providerMessageId: null,
        errorReason: `Invalid recipient phone number: "${recipient}"`,
        retryable: false,
      };
    }

    // ── MOCK mode ────────────────────────────────────────────────────────────
    if (this.mode === 'MOCK' || this.mode === 'MOCK_WARN') {
      const providerMessageId = `mock_sms_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
      this.sentSmsList.push({
        recipient,
        content,
        metadata,
        providerMessageId,
        sentAt: new Date(),
        mode: this.mode,
      });

      logger.debug(
        { recipient, providerMessageId, mode: this.mode },
        'SMS dispatched in mock mode',
      );

      return {
        success: true,
        providerMessageId,
        errorReason: null,
        retryable: false,
        _mock: true, // Hint: not a real SMS
      };
    }

    // ── MISCONFIGURED: fail clearly in production ────────────────────────────
    if (this.mode === 'MISCONFIGURED') {
      const errorReason =
        'SMS provider not configured: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER required. ' +
        'No SMS was sent.';
      logger.error({ recipient }, errorReason);
      return {
        success: false,
        providerMessageId: null,
        errorReason,
        retryable: false,
      };
    }

    // ── LIVE mode: real Twilio dispatch ──────────────────────────────────────
    const start = Date.now();
    try {
      const client = await this._getTwilioClient();

      const message = await client.messages.create({
        body: content,
        from: this.fromNumber,
        to: recipient,
      });

      const latencyMs = Date.now() - start;
      logger.info(
        { recipient, sid: message.sid, status: message.status, latencyMs },
        'SMS dispatched via Twilio',
      );

      return {
        success: true,
        providerMessageId: message.sid,
        errorReason: null,
        retryable: false,
      };
    } catch (err) {
      const latencyMs = Date.now() - start;
      const isTransient = this._isTransientError(err);

      logger.error(
        { err: err.message, errCode: err.code, recipient, latencyMs, retryable: isTransient },
        'Failed to dispatch SMS via Twilio',
      );

      return {
        success: false,
        providerMessageId: null,
        errorReason: err.message,
        retryable: isTransient,
      };
    }
  }

  /**
   * Determines if a Twilio error is transient and worth retrying.
   * Twilio error codes: https://www.twilio.com/docs/api/errors
   */
  _isTransientError(err) {
    // Network errors
    if (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT' || err.code === 'ENOTFOUND') {
      return true;
    }
    // Twilio error codes for transient failures (rate limits, service unavailable)
    const transientTwilioCodes = [429, 20429, 30008, 30009];
    if (err.status && transientTwilioCodes.includes(err.status)) {
      return true;
    }
    if (err.code && transientTwilioCodes.includes(err.code)) {
      return true;
    }
    return false;
  }

  // ── Test/Mock helpers ─────────────────────────────────────────────────────

  getSentSmsList() {
    return this.sentSmsList;
  }

  clearSentSmsList() {
    this.sentSmsList = [];
  }

  getMode() {
    return this.mode;
  }
}
