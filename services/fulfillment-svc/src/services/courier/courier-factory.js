import { courierBulkhead } from '@ecommerce/shared';

import { DelhiveryProvider } from './delhivery.provider.js';
import { BlueDartProvider } from './bluedart.provider.js';
import { EkartProvider } from './ekart.provider.js';
import { InternalFleetProvider } from './internal-fleet.provider.js';
import { ShiprocketProvider } from './shiprocket.provider.js';

export class CourierProviderFactory {
  constructor({ customProviders = {}, bulkhead = courierBulkhead } = {}) {
    this.bulkhead = bulkhead;
    this.providers = {
      DELHIVERY: new DelhiveryProvider(),
      BLUEDART: new BlueDartProvider(),
      EKART: new EkartProvider(),
      INTERNAL_FLEET: new InternalFleetProvider(),
      SHIPROCKET: new ShiprocketProvider(),
      ...customProviders,
    };
  }

  /**
   * Retrieves courier provider adapter for given courier code protected by Bulkhead
   * @param {string} courierCode
   * @returns {import('./courier-provider.interface.js').CourierProvider}
   */
  getProvider(courierCode) {
    const normalized = (courierCode || 'INTERNAL_FLEET').toUpperCase();
    const rawProvider = this.providers[normalized] || this.providers.INTERNAL_FLEET;

    // Internal fleet doesn't require external courier bulkhead protection
    if (normalized === 'INTERNAL_FLEET') {
      return rawProvider;
    }

    // Wrap async API methods in bulkhead execution
    const bulkhead = this.bulkhead;
    return new Proxy(rawProvider, {
      get(target, prop, receiver) {
        const val = Reflect.get(target, prop, receiver);
        if (typeof val === 'function') {
          return function (...args) {
            return bulkhead.execute(() => val.apply(target, args));
          };
        }
        return val;
      },
    });
  }
}

export const courierProviderFactory = new CourierProviderFactory();
