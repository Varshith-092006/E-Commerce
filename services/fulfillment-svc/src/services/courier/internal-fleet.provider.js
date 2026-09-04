import crypto from 'crypto';

import { CourierProvider } from './courier-provider.interface.js';

export class InternalFleetProvider extends CourierProvider {
  constructor({ config = {} } = {}) {
    super({ name: 'Internal Fleet Logistics', code: 'INTERNAL_FLEET', config });
  }

  createShipment({ shipmentNumber, destinationAddress, weightKg = 1.0 }) {
    const randomHex = crypto.randomBytes(4).toString('hex').toUpperCase();
    const trackingNumber = `INT-TRK-${Date.now().toString(36).toUpperCase()}-${randomHex}`;
    const estimatedDeliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    return Promise.resolve({
      trackingNumber,
      labelUrl: `https://labels.internal-fleet.ecommerce.local/${trackingNumber}.pdf`,
      estimatedDeliveryDate,
      courierMetadata: {
        provider: 'INTERNAL_FLEET',
        shipmentNumber,
        weightKg,
        destinationCity: destinationAddress?.city || 'Local',
      },
    });
  }

  generateLabel(trackingNumber) {
    return Promise.resolve({
      labelUrl: `https://labels.internal-fleet.ecommerce.local/${trackingNumber}.pdf`,
      labelFormat: 'PDF',
    });
  }

  getTrackingStatus(_trackingNumber) {
    return Promise.resolve({
      status: 'IN_TRANSIT',
      statusDetails: 'Package is in transit with internal delivery partner',
      checkpoints: [
        {
          timestamp: new Date(),
          location: 'Central Fulfillment Center',
          activity: 'Shipment dispatched from hub',
        },
      ],
      deliveredAt: null,
    });
  }

  schedulePickup({ pickupDate = new Date(), packageCount = 1 }) {
    const pickupId = `INT-PKP-${Date.now().toString(36).toUpperCase()}`;
    return Promise.resolve({
      pickupId,
      scheduledDate: new Date(pickupDate),
      courierCode: 'INTERNAL_FLEET',
      packageCount,
    });
  }

  cancelShipment(trackingNumber) {
    return Promise.resolve({
      cancelled: true,
      message: `Internal fleet shipment '${trackingNumber}' successfully cancelled`,
    });
  }
}
