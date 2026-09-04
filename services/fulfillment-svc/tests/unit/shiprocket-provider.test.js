import { describe, it, expect, beforeEach } from '@jest/globals';
import { ShiprocketProvider } from '../../src/services/courier/shiprocket.provider.js';
import { courierProviderFactory } from '../../src/services/courier/courier-factory.js';

describe('P1-8 Shiprocket Courier Provider Adapter', () => {
  let provider;

  beforeEach(() => {
    provider = new ShiprocketProvider();
  });

  it('should be registered in CourierProviderFactory', () => {
    const fetched = courierProviderFactory.getProvider('SHIPROCKET');
    expect(fetched).toBeInstanceOf(ShiprocketProvider);
    expect(fetched.code).toBe('SHIPROCKET');
  });

  it('should generate mock shipment in development/test environment without credentials', async () => {
    const res = await provider.createShipment({
      shipmentNumber: 'SHP-TEST-001',
      originAddress: { postalCode: '110001' },
      destinationAddress: { postalCode: '560001', name: 'John Doe' },
      weightKg: 1.2,
    });

    expect(res.trackingNumber).toMatch(/^SRT-TRK-/);
    expect(res.courierMetadata.provider).toBe('SHIPROCKET');
    expect(res.courierMetadata.mode).toBe('mock');
  });

  it('should support tracking query in mock mode', async () => {
    const tracking = await provider.getTrackingStatus('SRT-TRK-12345');
    expect(tracking.status).toBe('IN_TRANSIT');
    expect(tracking.provider).toBe('SHIPROCKET');
    expect(tracking._mock).toBe(true);
  });

  it('should support cancellation in mock mode', async () => {
    const cancelRes = await provider.cancelShipment('SRT-TRK-12345');
    expect(cancelRes.cancelled).toBe(true);
    expect(cancelRes._mock).toBe(true);
  });
});
