import { RazorpayProvider } from '../../src/lib/razorpay.js';

describe('Razorpay Provider Hardening & Mode Validation', () => {
  test('throws error when live mode is configured without credentials', () => {
    expect(() => {
      new RazorpayProvider({
        mode: 'live',
        keyId: null,
        keySecret: null,
      });
    }).toThrow(/Razorpay live credentials .* are required when PAYMENT_PROVIDER_MODE is live/i);
  });

  test('successfully initializes in mock mode without live credentials', async () => {
    const provider = new RazorpayProvider({
      mode: 'mock',
      keyId: null,
      keySecret: null,
    });

    const order = await provider.createOrder({ amountInPaise: 50000 });
    expect(order.id).toMatch(/^order_mock_/);
    expect(order.amount).toBe(50000);

    const refund = await provider.refundPayment({
      razorpayPaymentId: 'pay_123',
      amountInPaise: 50000,
    });
    expect(refund.id).toMatch(/^rfnd_mock_/);
    expect(refund.status).toBe('processed');
  });

  test('timing-safe signature verification rejects invalid or tampered signatures', () => {
    const provider = new RazorpayProvider({
      mode: 'mock',
      keySecret: 'secret_key_123',
    });

    const isValid = provider.verifyPaymentSignature({
      razorpayOrderId: 'order_123',
      razorpayPaymentId: 'pay_123',
      razorpaySignature: 'invalid_signature_hash',
      secret: 'secret_key_123',
    });

    expect(isValid).toBe(false);
  });
});
