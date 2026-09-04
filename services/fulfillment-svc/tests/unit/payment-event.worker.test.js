import { jest } from '@jest/globals';
import { PaymentEventWorker } from '../../src/workers/payment-event.worker.js';
import { ValidationError, EventTypes } from '@ecommerce/shared';

describe('PaymentEventWorker Unit Tests (Phase 4D)', () => {
  let worker;
  let mockReservationService;
  let mockShipmentService;
  let mockReservationRepo;
  let mockShipmentRepo;

  beforeEach(() => {
    mockReservationService = {
      commitReservation: jest.fn().mockResolvedValue({ id: 'res-1', status: 'COMMITTED', user_id: 'user-1' }),
      releaseReservation: jest.fn().mockResolvedValue({ id: 'res-1', status: 'RELEASED' }),
    };

    mockShipmentService = {
      allocateAndCreateShipment: jest.fn().mockResolvedValue([{ id: 'shp-1', status: 'ALLOCATED' }]),
    };

    mockReservationRepo = {
      findByReservationKey: jest.fn(),
    };

    mockShipmentRepo = {
      findByOrderId: jest.fn().mockResolvedValue([]),
    };

    worker = new PaymentEventWorker({
      reservationService: mockReservationService,
      shipmentService: mockShipmentService,
      reservationRepo: mockReservationRepo,
      shipmentRepo: mockShipmentRepo,
      consumerName: 'test-payment-worker',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should commit reservation and allocate shipment on payment.captured event', async () => {
    mockReservationRepo.findByReservationKey.mockResolvedValue({
      id: 'res-100',
      status: 'HELD',
      user_id: 'user-1',
    });

    const res = await worker.processEvent({
      eventId: 'evt-pay-cap-1',
      eventType: EventTypes.PAYMENT_CAPTURED,
      payload: {
        orderId: 'ord-100',
        userId: 'user-1',
        shippingAddress: { city: 'Bangalore' },
        items: [{ sku: 'SKU-A', quantity: 1 }],
      },
    });

    expect(res.status).toBe('PROCESSED');
    expect(mockReservationService.commitReservation).toHaveBeenCalledWith('res-100');
    expect(mockShipmentService.allocateAndCreateShipment).toHaveBeenCalledWith(
      expect.objectContaining({
        orderId: 'ord-100',
        userId: 'user-1',
      }),
    );
  });

  it('should not create duplicate shipments if shipments already exist for order', async () => {
    mockReservationRepo.findByReservationKey.mockResolvedValue({
      id: 'res-100',
      status: 'COMMITTED',
      user_id: 'user-1',
    });
    mockShipmentRepo.findByOrderId.mockResolvedValue([{ id: 'existing-shp' }]);

    const res = await worker.processEvent({
      eventId: 'evt-pay-cap-dup',
      eventType: EventTypes.PAYMENT_CAPTURED,
      payload: { orderId: 'ord-100' },
    });

    expect(res.status).toBe('PROCESSED');
    expect(res.result.status).toBe('ALREADY_ALLOCATED');
    expect(mockShipmentService.allocateAndCreateShipment).not.toHaveBeenCalled();
  });

  it('should release reservation on payment.failed event if reservation is HELD', async () => {
    mockReservationRepo.findByReservationKey.mockResolvedValue({
      id: 'res-100',
      status: 'HELD',
    });

    const res = await worker.processEvent({
      eventId: 'evt-pay-fail-1',
      eventType: EventTypes.PAYMENT_FAILED,
      payload: { orderId: 'ord-100' },
    });

    expect(res.status).toBe('PROCESSED');
    expect(mockReservationService.releaseReservation).toHaveBeenCalledWith(
      'res-100',
      'Payment failed for checkout order',
    );
  });

  it('should throw ValidationError on malformed payment event', async () => {
    await expect(worker.processEvent({})).rejects.toThrow(ValidationError);
  });
});
