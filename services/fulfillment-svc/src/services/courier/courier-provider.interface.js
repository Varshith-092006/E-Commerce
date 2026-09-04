/**
 * Abstract Base Class for Courier Provider Adapters
 */
export class CourierProvider {
  constructor({ name, code, config = {} } = {}) {
    if (new.target === CourierProvider) {
      throw new TypeError('Cannot construct CourierProvider abstract instances directly');
    }
    this.name = name;
    this.code = code;
    this.config = config;
  }

  /**
   * Registers/creates a shipment manifest with the carrier
   */
  createShipment(_params) {
    return Promise.reject(new Error('Method createShipment() must be implemented'));
  }

  /**
   * Generates shipping label document / URL
   */
  generateLabel(_trackingNumber) {
    return Promise.reject(new Error('Method generateLabel() must be implemented'));
  }

  /**
   * Queries real-time tracking status from carrier
   */
  getTrackingStatus(_trackingNumber) {
    return Promise.reject(new Error('Method getTrackingStatus() must be implemented'));
  }

  /**
   * Schedules a reverse or forward pickup
   */
  schedulePickup(_params) {
    return Promise.reject(new Error('Method schedulePickup() must be implemented'));
  }

  /**
   * Cancels a registered shipment with the carrier
   */
  cancelShipment(_trackingNumber) {
    return Promise.reject(new Error('Method cancelShipment() must be implemented'));
  }
}
