import crypto from 'crypto';

import { CourierProvider } from './courier-provider.interface.js';

export class BlueDartProvider extends CourierProvider {
  constructor({ config = {} } = {}) {
    super({ name: 'BlueDart Express', code: 'BLUEDART', config });
    this.licenseKey = config.licenseKey || process.env.BLUEDART_LICENSE_KEY || null;
    this.loginId = config.loginId || process.env.BLUEDART_LOGIN_ID || null;
    this.mode = config.mode || (this.licenseKey ? 'live' : 'mock');
  }

  createShipment({ destinationAddress, weightKg = 0.5 }) {
    const randomHex = crypto.randomBytes(4).toString('hex').toUpperCase();
    const trackingNumber = `BLU-AWB-${Date.now().toString(36).toUpperCase()}-${randomHex}`;
    return Promise.resolve({
      trackingNumber,
      labelUrl: `https://api.bluedart.com/labels/${trackingNumber}.pdf`,
      estimatedDeliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      courierMetadata: {
        awbNo: trackingNumber,
        serviceType: 'APEX',
        provider: 'BLUEDART',
        destinationPin: destinationAddress?.postalCode || '560001',
        mode: this.mode,
        weightKg,
      },
    });
  }

  generateLabel(trackingNumber) {
    return Promise.resolve({
      labelUrl: `https://api.bluedart.com/labels/${trackingNumber}.pdf`,
      labelFormat: 'PDF',
    });
  }

  getTrackingStatus(_trackingNumber) {
    return Promise.resolve({
      status: 'IN_TRANSIT',
      statusDetails: 'Shipment connected to BlueDart Express Hub',
      checkpoints: [
        {
          timestamp: new Date(),
          location: 'Mumbai Air Express Hub',
          activity: 'Processed and Manifested',
        },
      ],
      deliveredAt: null,
    });
  }

  schedulePickup({ pickupDate = new Date(), packageCount = 1 }) {
    const pickupId = `BLU-PKP-${Date.now().toString(36).toUpperCase()}`;
    return Promise.resolve({
      pickupId,
      scheduledDate: new Date(pickupDate),
      courierCode: 'BLUEDART',
      packageCount,
    });
  }

  cancelShipment(trackingNumber) {
    return Promise.resolve({
      cancelled: true,
      message: `BlueDart shipment '${trackingNumber}' successfully cancelled`,
    });
  }
}
