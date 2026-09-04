import { jest } from '@jest/globals';
import { EventTypes } from '@ecommerce/shared';
import { orderEventWorker } from '../../../fulfillment-svc/src/workers/order-event.worker.js';
import { paymentEventWorker } from '../../../fulfillment-svc/src/workers/payment-event.worker.js';
import { returnRefundWorker } from '../../../payment-svc/src/workers/return-refund.worker.js';
import { orderSagaWorker } from '../../src/workers/order-saga.worker.js';
import { notificationEventWorker } from '../../../notification-svc/src/workers/notification-event.worker.js';

describe('End-to-End Post-Purchase Saga & Event Orchestration (Phase 4D)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    orderSagaWorker.processedEvents?.clear();
    orderEventWorker.processedEvents?.clear();
    paymentEventWorker.processedEvents?.clear();
    returnRefundWorker.processedEvents?.clear();
    if (returnRefundWorker?.processedEventRepo) {
      jest.spyOn(returnRefundWorker.processedEventRepo, 'checkAndMark').mockResolvedValue({ alreadyProcessed: false });
    }
    if (typeof orderSagaWorker.isProcessed === 'function') {
      jest.spyOn(orderSagaWorker, 'isProcessed').mockResolvedValue(false);
    }
    if (typeof orderEventWorker.isProcessed === 'function') {
      jest.spyOn(orderEventWorker, 'isProcessed').mockResolvedValue(false);
    }
    if (typeof paymentEventWorker.isProcessed === 'function') {
      jest.spyOn(paymentEventWorker, 'isProcessed').mockResolvedValue(false);
    }
    if (notificationEventWorker?.idempotencyService) {
      jest.spyOn(notificationEventWorker.idempotencyService, 'isProcessed').mockResolvedValue(false);
    }
  });

  it('should execute complete happy path: order.placed -> payment.captured -> shipment.shipped -> shipment.delivered -> return.completed -> payment.refunded', async () => {
    // 1. Mock fulfillment reservation & shipment services
    const mockCreatedReservation = { id: 'res-e2e-1', status: 'HELD', user_id: 'user-e2e' };
    jest
      .spyOn(orderEventWorker.reservationService, 'createReservation')
      .mockResolvedValue(mockCreatedReservation);

    // Step 1: Order Placed -> Fulfillment reserves inventory
    const orderPlacedEvent = {
      eventId: 'evt-e2e-order-placed',
      eventType: EventTypes.ORDER_PLACED,
      payload: {
        orderId: 'ord-e2e-1',
        userId: 'user-e2e',
        orderNumber: 'ORD-E2E-1',
        totalAmount: 1999,
        items: [{ sku: 'SKU-SHIRT', quantity: 1, productId: 'prod-1' }],
      },
    };

    const res1 = await orderEventWorker.processEvent(orderPlacedEvent);
    expect(res1.status).toBe('PROCESSED');
    expect(orderEventWorker.reservationService.createReservation).toHaveBeenCalled();

    // Step 2: Payment Captured -> Fulfillment commits reservation & creates shipment
    jest
      .spyOn(paymentEventWorker.reservationRepo, 'findByReservationKey')
      .mockResolvedValue({ id: 'res-e2e-1', status: 'HELD', user_id: 'user-e2e' });
    jest
      .spyOn(paymentEventWorker.shipmentRepo, 'findByOrderId')
      .mockResolvedValue([]);
    jest
      .spyOn(paymentEventWorker.reservationService, 'commitReservation')
      .mockResolvedValue({ id: 'res-e2e-1', status: 'COMMITTED', user_id: 'user-e2e' });
    jest
      .spyOn(paymentEventWorker.shipmentService, 'allocateAndCreateShipment')
      .mockResolvedValue([
        {
          id: 'shp-e2e-1',
          shipment_number: 'SHP-E2E-1',
          tracking_number: 'TRK-E2E-1',
          status: 'ALLOCATED',
        },
      ]);

    const paymentCapturedEvent = {
      eventId: 'evt-e2e-pay-cap',
      eventType: EventTypes.PAYMENT_CAPTURED,
      payload: {
        orderId: 'ord-e2e-1',
        userId: 'user-e2e',
        amount: '1999.00',
        shippingAddress: { city: 'Bangalore' },
        items: [{ sku: 'SKU-SHIRT', quantity: 1 }],
      },
    };

    const res2 = await paymentEventWorker.processEvent(paymentCapturedEvent);
    expect(res2.status).toBe('PROCESSED');
    expect(paymentEventWorker.reservationService.commitReservation).toHaveBeenCalledWith('res-e2e-1');
    expect(paymentEventWorker.shipmentService.allocateAndCreateShipment).toHaveBeenCalled();

    // Step 3: Shipment Shipped -> Order becomes SHIPPED & Notification sent
    jest.spyOn(orderSagaWorker.orderSagaService.orderRepo, 'findById').mockResolvedValue({
      id: 'ord-e2e-1',
      status: 'PROCESSING',
    });
    jest.spyOn(orderSagaWorker.orderSagaService.orderRepo, 'transitionOrderStatusAtomic').mockResolvedValue({
      order: { id: 'ord-e2e-1', status: 'SHIPPED' },
      idempotent: false,
    });
    jest
      .spyOn(notificationEventWorker.notificationService, 'dispatchNotification')
      .mockResolvedValue({ dispatches: [{ channel: 'EMAIL', status: 'SENT' }] });

    const shipmentShippedEvent = {
      eventId: 'evt-e2e-ship-shipped',
      eventType: EventTypes.SHIPMENT_SHIPPED,
      payload: {
        orderId: 'ord-e2e-1',
        userId: 'user-e2e',
        shipmentNumber: 'SHP-E2E-1',
        trackingNumber: 'TRK-E2E-1',
        courierCode: 'DELHIVERY',
      },
    };

    const res3a = await orderSagaWorker.processEvent(shipmentShippedEvent);
    const res3b = await notificationEventWorker.processEvent(shipmentShippedEvent);

    expect(res3a.status).toBe('PROCESSED');
    expect(res3b.status).toBe('PROCESSED');
    expect(orderSagaWorker.orderSagaService.orderRepo.transitionOrderStatusAtomic).toHaveBeenCalledWith(
      expect.objectContaining({ targetStatus: 'SHIPPED' }),
    );
    expect(notificationEventWorker.notificationService.dispatchNotification).toHaveBeenCalledWith(
      expect.objectContaining({ templateCode: 'order.shipped' }),
    );

    // Step 4: Shipment Delivered -> Order becomes DELIVERED & Notification sent
    jest.spyOn(orderSagaWorker.orderSagaService.orderRepo, 'findById').mockResolvedValue({
      id: 'ord-e2e-1',
      status: 'SHIPPED',
    });
    jest.spyOn(orderSagaWorker.orderSagaService.orderRepo, 'transitionOrderStatusAtomic').mockResolvedValue({
      order: { id: 'ord-e2e-1', status: 'DELIVERED' },
      idempotent: false,
    });

    const shipmentDeliveredEvent = {
      eventId: 'evt-e2e-ship-del',
      eventType: EventTypes.SHIPMENT_DELIVERED,
      payload: {
        orderId: 'ord-e2e-1',
        userId: 'user-e2e',
        shipmentNumber: 'SHP-E2E-1',
        podReceivedBy: 'Customer Alice',
      },
    };

    const res4a = await orderSagaWorker.processEvent(shipmentDeliveredEvent);
    const res4b = await notificationEventWorker.processEvent(shipmentDeliveredEvent);

    expect(res4a.status).toBe('PROCESSED');
    expect(res4b.status).toBe('PROCESSED');
    expect(orderSagaWorker.orderSagaService.orderRepo.transitionOrderStatusAtomic).toHaveBeenCalledWith(
      expect.objectContaining({ targetStatus: 'DELIVERED' }),
    );
    expect(notificationEventWorker.notificationService.dispatchNotification).toHaveBeenCalledWith(
      expect.objectContaining({ templateCode: 'order.delivered' }),
    );

    // Step 5: Return Completed -> Payment Refund Worker triggers refund & Notification sent
    jest.spyOn(returnRefundWorker.returnRefundService, 'processReturnRefund').mockResolvedValue({
      refundId: 'ref-e2e-1',
      paymentId: 'pay-e2e-1',
      orderId: 'ord-e2e-1',
      amount: '1999.00',
      status: 'PROCESSED',
      idempotent: false,
    });

    const returnCompletedEvent = {
      eventId: 'evt-e2e-ret-comp',
      eventType: EventTypes.RETURN_COMPLETED,
      payload: {
        orderId: 'ord-e2e-1',
        userId: 'user-e2e',
        returnId: 'ret-e2e-1',
        returnNumber: 'RET-E2E-1',
        amount: '1999.00',
      },
    };

    const res5a = await returnRefundWorker.processEvent(returnCompletedEvent);
    const res5b = await orderSagaWorker.processEvent(returnCompletedEvent);
    const res5c = await notificationEventWorker.processEvent(returnCompletedEvent);

    expect(res5a.status).toBe('PROCESSED');
    expect(res5b.status).toBe('PROCESSED');
    expect(res5c.status).toBe('PROCESSED');
    expect(returnRefundWorker.returnRefundService.processReturnRefund).toHaveBeenCalledWith(
      expect.objectContaining({
        returnId: 'ret-e2e-1',
        orderId: 'ord-e2e-1',
      }),
    );
  });

  it('should execute payment failure flow: order.placed -> payment.failed -> reservation released', async () => {
    // 1. Order Placed
    jest
      .spyOn(orderEventWorker.reservationService, 'createReservation')
      .mockResolvedValue({ id: 'res-fail-1', status: 'HELD' });

    await orderEventWorker.processEvent({
      eventId: 'evt-fail-placed',
      eventType: EventTypes.ORDER_PLACED,
      payload: {
        orderId: 'ord-fail-1',
        userId: 'user-fail',
        items: [{ sku: 'SKU-FAIL', quantity: 1 }],
      },
    });

    // 2. Payment Failed -> Release reservation
    jest
      .spyOn(paymentEventWorker.reservationRepo, 'findByReservationKey')
      .mockResolvedValue({ id: 'res-fail-1', status: 'HELD' });
    jest
      .spyOn(paymentEventWorker.reservationService, 'releaseReservation')
      .mockResolvedValue({ id: 'res-fail-1', status: 'RELEASED' });

    const res = await paymentEventWorker.processEvent({
      eventId: 'evt-fail-pay',
      eventType: EventTypes.PAYMENT_FAILED,
      payload: {
        orderId: 'ord-fail-1',
        userId: 'user-fail',
        failureReason: 'Insufficient funds',
      },
    });

    expect(res.status).toBe('PROCESSED');
    expect(paymentEventWorker.reservationService.releaseReservation).toHaveBeenCalledWith(
      'res-fail-1',
      'Payment failed for checkout order',
    );
  });
});
