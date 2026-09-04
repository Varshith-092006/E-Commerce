import request from 'supertest';
import { jest } from '@jest/globals';
import { createApp } from '../../src/app.js';
import { ReturnPickupController } from '../../src/controllers/return-pickup.controller.js';

describe('Return Pickup API Integration Tests (Phase 4C)', () => {
  let app;
  let mockReturnService;

  const trustedGatewaySecret =
    process.env.INTERNAL_GATEWAY_SECRET || 'ecom_internal_mesh_secret_2026';

  beforeEach(() => {
    mockReturnService = {
      requestReturnPickup: jest.fn(),
      schedulePickup: jest.fn(),
      recordProofOfPickup: jest.fn(),
      updateTrackingCheckpoint: jest.fn(),
      receiveAtWarehouse: jest.fn(),
      inspectAndRestock: jest.fn(),
      getTrackingTimeline: jest.fn(),
      getReturnById: jest.fn(),
      listReturns: jest.fn(),
    };

    const returnPickupController = new ReturnPickupController(mockReturnService);
    app = createApp({ returnPickupController });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/fulfillment/returns (Create Return Pickup)', () => {
    it('should return 401 Unauthorized if unauthenticated', async () => {
      const res = await request(app)
        .post('/api/v1/fulfillment/returns')
        .send({ orderId: 'ord-1' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should create return pickup and return 201 Created for CUSTOMER', async () => {
      mockReturnService.requestReturnPickup.mockResolvedValue({
        id: 'ret-1',
        return_number: 'RET-20260825-001',
        status: 'REQUESTED',
      });

      const res = await request(app)
        .post('/api/v1/fulfillment/returns')
        .set('x-internal-gateway-secret', trustedGatewaySecret)
        .set('x-user-id', 'cust-1')
        .set('x-user-role', 'CUSTOMER')
        .send({
          orderId: 'ord-1',
          pickupAddress: { city: 'Bangalore' },
          items: [{ sku: 'SKU-SHIRT', quantity: 1 }],
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('ret-1');
    });
  });

  describe('POST /api/v1/fulfillment/returns/:id/schedule', () => {
    it('should schedule pickup and return 200 OK for LOGISTICS', async () => {
      mockReturnService.schedulePickup.mockResolvedValue({
        id: 'ret-1',
        status: 'PICKUP_SCHEDULED',
        return_tracking_number: 'RET-TRK-DELHIVERY-001',
      });

      const res = await request(app)
        .post('/api/v1/fulfillment/returns/ret-1/schedule')
        .set('x-internal-gateway-secret', trustedGatewaySecret)
        .set('x-user-id', 'logistics-1')
        .set('x-user-role', 'LOGISTICS')
        .send({ courierCode: 'DELHIVERY' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('PICKUP_SCHEDULED');
    });
  });

  describe('POST /api/v1/fulfillment/returns/:id/pickup (POP)', () => {
    it('should record proof of pickup and return 200 OK for COURIER', async () => {
      mockReturnService.recordProofOfPickup.mockResolvedValue({
        id: 'ret-1',
        status: 'PICKED_UP',
        pop_signature: 'POP-SIG',
      });

      const res = await request(app)
        .post('/api/v1/fulfillment/returns/ret-1/pickup')
        .set('x-internal-gateway-secret', trustedGatewaySecret)
        .set('x-user-id', 'courier-1')
        .set('x-user-role', 'COURIER')
        .send({ signature: 'POP-SIG', receivedBy: 'Agent Joe' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('PICKED_UP');
    });
  });

  describe('POST /api/v1/fulfillment/returns/:id/receive', () => {
    it('should record warehouse receipt and return 200 OK for ADMIN', async () => {
      mockReturnService.receiveAtWarehouse.mockResolvedValue({
        id: 'ret-1',
        status: 'RECEIVED_AT_WAREHOUSE',
      });

      const res = await request(app)
        .post('/api/v1/fulfillment/returns/ret-1/receive')
        .set('x-internal-gateway-secret', trustedGatewaySecret)
        .set('x-user-id', 'admin-1')
        .set('x-user-role', 'ADMIN');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('RECEIVED_AT_WAREHOUSE');
    });
  });

  describe('POST /api/v1/fulfillment/returns/:id/inspect (QC & Restock)', () => {
    it('should inspect items, restock PASS items, and return 200 OK', async () => {
      mockReturnService.inspectAndRestock.mockResolvedValue({
        id: 'ret-1',
        status: 'COMPLETED',
      });

      const res = await request(app)
        .post('/api/v1/fulfillment/returns/ret-1/inspect')
        .set('x-internal-gateway-secret', trustedGatewaySecret)
        .set('x-user-id', 'logistics-1')
        .set('x-user-role', 'LOGISTICS')
        .send({
          inspections: [{ sku: 'SKU-SHIRT', grade: 'PASS' }],
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('COMPLETED');
    });
  });

  describe('GET /api/v1/fulfillment/returns/tracking/:trackingNumber (Public Timeline)', () => {
    it('should return tracking timeline publicly', async () => {
      mockReturnService.getTrackingTimeline.mockResolvedValue({
        returnTrackingNumber: 'RET-TRK-001',
        status: 'IN_TRANSIT',
        trackingUpdates: [{ status: 'PICKED_UP', description: 'Item picked up' }],
      });

      const res = await request(app).get(
        '/api/v1/fulfillment/returns/tracking/RET-TRK-001',
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.returnTrackingNumber).toBe('RET-TRK-001');
    });
  });

  describe('GET /api/v1/fulfillment/returns/:id', () => {
    it('should return return details for authorized owner', async () => {
      mockReturnService.getReturnById.mockResolvedValue({
        id: 'ret-1',
        return_number: 'RET-001',
      });

      const res = await request(app)
        .get('/api/v1/fulfillment/returns/ret-1')
        .set('x-internal-gateway-secret', trustedGatewaySecret)
        .set('x-user-id', 'cust-1')
        .set('x-user-role', 'CUSTOMER');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.return_number).toBe('RET-001');
    });
  });

  describe('GET /api/v1/fulfillment/returns', () => {
    it('should list returns with pagination', async () => {
      mockReturnService.listReturns.mockResolvedValue({
        returns: [{ id: 'ret-1' }],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
      });

      const res = await request(app)
        .get('/api/v1/fulfillment/returns')
        .set('x-internal-gateway-secret', trustedGatewaySecret)
        .set('x-user-id', 'admin-1')
        .set('x-user-role', 'ADMIN');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
    });
  });
});
