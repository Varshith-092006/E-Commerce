import { describe, it, expect, beforeEach } from '@jest/globals';
import { EmailProvider } from '../../src/services/providers/email.provider.js';
import { SmsProvider } from '../../src/services/providers/sms.provider.js';

describe('P1-6 & P1-7 Email and SMS Provider Adapters', () => {
  describe('EmailProvider', () => {
    let emailProvider;

    beforeEach(() => {
      process.env.NODE_ENV = 'test';
      emailProvider = new EmailProvider();
    });

    it('should dispatch emails in mock mode during test execution', async () => {
      const res = await emailProvider.send({
        recipient: 'buyer@example.com',
        subject: 'Order Confirmed',
        content: '<p>Thank you!</p>',
      });

      expect(res.success).toBe(true);
      expect(res._mock).toBe(true);
      expect(res.providerMessageId).toMatch(/^mock_email_/);
      expect(emailProvider.getSentEmails()).toHaveLength(1);
    });

    it('should reject invalid recipient emails immediately', async () => {
      const res = await emailProvider.send({
        recipient: 'invalid-email-string',
        subject: 'Test',
        content: 'Hello',
      });

      expect(res.success).toBe(false);
      expect(res.errorReason).toContain('Invalid recipient');
    });
  });

  describe('SmsProvider', () => {
    let smsProvider;

    beforeEach(() => {
      process.env.NODE_ENV = 'test';
      smsProvider = new SmsProvider();
    });

    it('should dispatch SMS in mock mode during test execution', async () => {
      const res = await smsProvider.send({
        recipient: '+919876543210',
        content: 'Your OTP is 123456',
      });

      expect(res.success).toBe(true);
      expect(res._mock).toBe(true);
      expect(res.providerMessageId).toMatch(/^mock_sms_/);
      expect(smsProvider.getSentSmsList()).toHaveLength(1);
    });

    it('should reject invalid phone numbers immediately', async () => {
      const res = await smsProvider.send({
        recipient: '123',
        content: 'Short number',
      });

      expect(res.success).toBe(false);
      expect(res.errorReason).toContain('Invalid recipient phone number');
    });
  });
});
