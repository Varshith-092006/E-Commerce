import {
  CourierProviderFactory,
  DelhiveryProvider,
  BlueDartProvider,
  EkartProvider,
  InternalFleetProvider,
} from '../../src/services/courier/index.js';

describe('Courier Provider Adapter Architecture', () => {
  let factory;

  beforeEach(() => {
    factory = new CourierProviderFactory();
  });

  test('factory returns correct provider based on courier code', () => {
    expect(factory.getProvider('DELHIVERY')).toBeInstanceOf(DelhiveryProvider);
    expect(factory.getProvider('BLUEDART')).toBeInstanceOf(BlueDartProvider);
    expect(factory.getProvider('EKART')).toBeInstanceOf(EkartProvider);
    expect(factory.getProvider('INTERNAL_FLEET')).toBeInstanceOf(InternalFleetProvider);
    expect(factory.getProvider('UNKNOWN_CARRIER')).toBeInstanceOf(InternalFleetProvider); // Fallback
  });

  test('InternalFleetProvider generates internal tracking number, label URL, and schedules pickup', async () => {
    const provider = new InternalFleetProvider();
    const shipment = await provider.createShipment({
      shipmentNumber: 'SHP-100',
      destinationAddress: { city: 'Mumbai' },
    });

    expect(shipment.trackingNumber).toMatch(/^INT-TRK-/);
    expect(shipment.labelUrl).toContain(shipment.trackingNumber);
    expect(shipment.courierMetadata.provider).toBe('INTERNAL_FLEET');

    const pickup = await provider.schedulePickup({ packageCount: 2 });
    expect(pickup.pickupId).toMatch(/^INT-PKP-/);

    const cancel = await provider.cancelShipment(shipment.trackingNumber);
    expect(cancel.cancelled).toBe(true);
  });

  test('DelhiveryProvider generates waybill and label in structured mock mode', async () => {
    const provider = new DelhiveryProvider({ config: { mode: 'mock' } });
    const shipment = await provider.createShipment({
      shipmentNumber: 'SHP-DEL-1',
      destinationAddress: { city: 'New Delhi', postalCode: '110001' },
    });

    expect(shipment.trackingNumber).toMatch(/^DEL-TRK-/);
    expect(shipment.courierMetadata.provider).toBe('DELHIVERY');

    const tracking = await provider.getTrackingStatus(shipment.trackingNumber);
    expect(tracking.status).toBe('IN_TRANSIT');
    expect(tracking.checkpoints.length).toBeGreaterThan(0);
  });

  test('BlueDartProvider generates AWB and Apex service metadata', async () => {
    const provider = new BlueDartProvider({ config: { mode: 'mock' } });
    const shipment = await provider.createShipment({
      destinationAddress: { postalCode: '560001' },
    });

    expect(shipment.trackingNumber).toMatch(/^BLU-AWB-/);
    expect(shipment.courierMetadata.serviceType).toBe('APEX');
  });

  test('EkartProvider generates tracking ID and hub routing', async () => {
    const provider = new EkartProvider({ config: { mode: 'mock' } });
    const shipment = await provider.createShipment({
      destinationAddress: { city: 'Bangalore' },
    });

    expect(shipment.trackingNumber).toMatch(/^EKT-TRK-/);
    expect(shipment.courierMetadata.provider).toBe('EKART');
  });
});
