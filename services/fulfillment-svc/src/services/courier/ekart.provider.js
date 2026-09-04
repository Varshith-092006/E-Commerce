import crypto from 'crypto';

import { CourierProvider } from './courier-provider.interface.js';

export class EkartProvider extends CourierProvider {
  constructor({ config = {} } = {}) {
    super({ name: 'Ekart Logistics', code: 'EKART', config });
    this.merchantId = config.merchantId || process.env.EKART_MERCHANT_ID || null;
    this.mode = config.mode || (this.merchantId ? 'live' : 'mock');
  }

  createShipment({ destinationAddress, weightKg = 0.5 }) {
    const randomHex = crypto.randomBytes(4).toString('hex').toUpperCase();
    const trackingNumber = `EKT-TRK-${Date.now().toString(36).toUpperCase()}-${randomHex}`;
    return Promise.resolve({
      trackingNumber,
      labelUrl: `https://logistics.ekart.in/labels/${trackingNumber}.pdf`,
      estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      courierMetadata: {
        trackingId: trackingNumber,
        provider: 'EKART',
        mode: this.mode,
        destinationHub: destinationAddress?.city || 'EKART_CENTRAL',
        weightKg,
      },
    });
  }

  generateLabel(trackingNumber) {
    return Promise.resolve({
      labelUrl: `https://logistics.ekart.in/labels/${trackingNumber}.pdf`,
      labelFormat: 'PDF',
    });
  }

  getTrackingStatus(_trackingNumber) {
    return Promise.resolve({
      status: 'IN_TRANSIT',
      statusDetails: 'Package moving through Ekart sorting facility',
      checkpoints: [
        {
          timestamp: new Date(),
          location: 'Bangalore Mother Hub',
          activity: 'Bagged and Sorted',
        },
      ],
      deliveredAt: null,
    });
  }

  schedulePickup({ pickupDate = new Date(), packageCount = 1 }) {
    const pickupId = `EKT-PKP-${Date.now().toString(36).toUpperCase()}`;
    return Promise.resolve({
      pickupId,
      scheduledDate: new Date(pickupDate),
      courierCode: 'EKART',
      packageCount,
    });
  }

  cancelShipment(trackingNumber) {
    return Promise.resolve({
      cancelled: true,
      message: `Ekart shipment '${trackingNumber}' cancelled`,
    });
  }
}
