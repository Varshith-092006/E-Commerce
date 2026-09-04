import { jest } from '@jest/globals';
import { OrderEventWorker } from '../../src/workers/order-event.worker.js';
import { ValidationError, EventTypes } from '@ecommerce/shared';

describe('OrderEventWorker Unit Tests (Phase 4D)', () => {
  let worker;
  let mockReservationService;
  let mockReservationRepo;

  beforeEach(() => {
    mockReservationService = {
      createReservation: jest.fn().mockResolvedValue({ id: 'res-1', status: 'HELD' }),
      releaseReservation: jest.fn().mockResolvedValue({ id: 'res-1', status: 'RELEASED' }),
    };

    mockReservationRepo = {
      findByReservationKey: jest.fn(),
    };

    worker = new OrderEventWorker({
      reservationService: mockReservationService,
      reservationRepo: mockReservationRepo,
      consumerName: 'test-order-worker',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should reserve inventory on order.placed event', async () => {
    const res = await worker.processEvent({
      eventId: 'evt-ord-1',
      eventType: EventTypes.ORDER_PLACED,
      payload: {
        orderId: 'ord-100',
        userId: 'cust-1',
        items: [{ sku: 'SKU-A', quantity: 2, productId: 'prod-1' }],
      },
    });

    expect(res.status).toBe('PROCESSED');
    expect(mockReservationService.createReservation).toHaveBeenCalledWith({
      userId: 'cust-1',
      orderId: 'ord-100',
      reservationKey: 'res_ord_ord-100',
      items: [{ sku: 'SKU-A', quantity: 2, productId: 'prod-1', sellerId: undefined, warehouseId: undefined }],
    });
  });

  it('should release inventory on order.cancelled event if reservation is HELD', async () => {
    mockReservationRepo.findByReservationKey.mockResolvedValue({
      id: 'res-100',
      status: 'HELD',
    });

    const res = await worker.processEvent({
      eventId: 'evt-ord-cancel',
      eventType: EventTypes.ORDER_CANCELLED,
      payload: { orderId: 'ord-100' },
    });

    expect(res.status).toBe('PROCESSED');
    expect(mockReservationService.releaseReservation).toHaveBeenCalledWith(
      'res-100',
      'Order cancelled by customer/system',
    );
  });

  it('should skip duplicate order events', async () => {
    await worker.processEvent({
      eventId: 'evt-dup-1',
      eventType: EventTypes.ORDER_PLACED,
      payload: { orderId: 'ord-1', userId: 'user-1', items: [] },
    });

    const res2 = await worker.processEvent({
      eventId: 'evt-dup-1',
      eventType: EventTypes.ORDER_PLACED,
      payload: { orderId: 'ord-1', userId: 'user-1', items: [] },
    });

    expect(res2.status).toBe('SKIPPED_DUPLICATE');
  });

  it('should throw ValidationError on malformed event', async () => {
    await expect(worker.processEvent(null)).rejects.toThrow(ValidationError);
  });
});
