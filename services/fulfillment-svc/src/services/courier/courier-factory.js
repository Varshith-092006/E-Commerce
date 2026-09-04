import { DelhiveryProvider } from './delhivery.provider.js';
import { BlueDartProvider } from './bluedart.provider.js';
import { EkartProvider } from './ekart.provider.js';
import { InternalFleetProvider } from './internal-fleet.provider.js';
import { ShiprocketProvider } from './shiprocket.provider.js';

export class CourierProviderFactory {
  constructor({ customProviders = {} } = {}) {
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
   * Retrieves courier provider adapter for given courier code
   * @param {string} courierCode
   * @returns {import('./courier-provider.interface.js').CourierProvider}
   */
  getProvider(courierCode) {
    const normalized = (courierCode || 'INTERNAL_FLEET').toUpperCase();
    const provider = this.providers[normalized];
    if (!provider) {
      return this.providers.INTERNAL_FLEET;
    }
    return provider;
  }
}

export const courierProviderFactory = new CourierProviderFactory();
