import request from 'supertest';
import { jest } from '@jest/globals';
import { createApp } from '../../src/app.js';
import { ShipmentController } from '../../src/controllers/shipment.controller.js';

describe('Shipment API Integration Tests (Phase 4B)', () => {
  let app;
  let mockShipmentService;

  const trustedGatewaySecret =
    process.env.INTERNAL_GATEWAY_SECRET || 'ecom_internal_mesh_secret_2026';

  beforeEach(() => {
    mockShipmentService = {
      allocateAndCreateShipment: jest.fn(),
      packShipment: jest.fn(),
      dispatchShipment: jest.fn(),
      updateTrackingCheckpoint: jest.fn(),
      completeDelivery: jest.fn(),
      getTrackingTimeline: jest.fn(),
      getShipmentById: jest.fn(),
      listShipments: jest.fn(),
    };

    const shipmentController = new ShipmentController(mockShipmentService);
    app = createApp({ shipmentController });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/fulfillment/shipments/allocate (Multi-Warehouse Allocation)', () => {
    it('should return 401 Unauthorized if unauthenticated', async () => {
      const res = await request(app)
        .post('/api/v1/fulfillment/shipments/allocate')
        .send({ orderId: 'ord-1' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should return 403 Forbidden for CUSTOMER role', async () => {
      const res = await request(app)
        .post('/api/v1/fulfillment/shipments/allocate')
        .set('x-internal-gateway-secret', trustedGatewaySecret)
        .set('x-user-id', 'cust-1')
        .set('x-user-role', 'CUSTOMER')
        .send({ orderId: 'ord-1' });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });

    it('should allocate shipments and return 201 Created for ADMIN', async () => {
      mockShipmentService.allocateAndCreateShipment.mockResolvedValue([
        {
          id: 'shp-1',
          shipment_number: 'SHP-20260825-001',
          order_id: 'ord-1',
          status: 'ALLOCATED',
        },
      ]);

      const res = await request(app)
        .post('/api/v1/fulfillment/shipments/allocate')
        .set('x-internal-gateway-secret', trustedGatewaySecret)
        .set('x-user-id', 'admin-1')
        .set('x-user-role', 'ADMIN')
        .send({
          orderId: 'ord-1',
          userId: 'cust-1',
          reservationId: 'res-1',
          shippingAddress: { city: 'Bangalore' },
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
    });
  });

  describe('POST /api/v1/fulfillment/shipments/:id/pack', () => {
    it('should allow ADMIN / LOGISTICS / SELLER to pack shipment and return 200 OK', async () => {
      mockShipmentService.packShipment.mockResolvedValue({
        id: 'shp-1',
        status: 'PACKED',
      });

      const res = await request(app)
        .post('/api/v1/fulfillment/shipments/shp-1/pack')
        .set('x-internal-gateway-secret', trustedGatewaySecret)
        .set('x-user-id', 'logistics-1')
        .set('x-user-role', 'LOGISTICS');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('PACKED');
    });
  });

  describe('POST /api/v1/fulfillment/shipments/:id/dispatch', () => {
    it('should dispatch shipment with courier and return 200 OK', async () => {
      mockShipmentService.dispatchShipment.mockResolvedValue({
        id: 'shp-1',
        status: 'DISPATCHED',
        courier_code: 'DELHIVERY',
        tracking_number: 'TRK-DELHIVERY-001',
      });

      const res = await request(app)
        .post('/api/v1/fulfillment/shipments/shp-1/dispatch')
        .set('x-internal-gateway-secret', trustedGatewaySecret)
        .set('x-user-id', 'admin-1')
        .set('x-user-role', 'ADMIN')
        .send({ courierCode: 'DELHIVERY' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('DISPATCHED');
      expect(res.body.data.tracking_number).toBe('TRK-DELHIVERY-001');
    });
  });

  describe('POST /api/v1/fulfillment/shipments/:id/track (Tracking Checkpoint)', () => {
    it('should update checkpoint and return 200 OK', async () => {
      mockShipmentService.updateTrackingCheckpoint.mockResolvedValue({
        id: 'shp-1',
        status: 'IN_TRANSIT',
      });

      const res = await request(app)
        .post('/api/v1/fulfillment/shipments/shp-1/track')
        .set('x-internal-gateway-secret', trustedGatewaySecret)
        .set('x-user-id', 'courier-1')
        .set('x-user-role', 'COURIER')
        .send({
          status: 'IN_TRANSIT',
          location: 'Hub 1',
          description: 'In transit to destination',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('IN_TRANSIT');
    });
  });

  describe('POST /api/v1/fulfillment/shipments/:id/deliver (Proof of Delivery)', () => {
    it('should record POD and mark DELIVERED', async () => {
      mockShipmentService.completeDelivery.mockResolvedValue({
        id: 'shp-1',
        status: 'DELIVERED',
        pod_received_by: 'Bob',
      });

      const res = await request(app)
        .post('/api/v1/fulfillment/shipments/shp-1/deliver')
        .set('x-internal-gateway-secret', trustedGatewaySecret)
        .set('x-user-id', 'courier-1')
        .set('x-user-role', 'COURIER')
        .send({
          recipientName: 'Bob',
          signature: 'SIG-123',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('DELIVERED');
    });
  });

  describe('GET /api/v1/fulfillment/shipments/tracking/:trackingNumber (Public/Customer Tracking)', () => {
    it('should return tracking timeline without requiring credentials', async () => {
      mockShipmentService.getTrackingTimeline.mockResolvedValue({
        trackingNumber: 'TRK-DELHIVERY-001',
        status: 'IN_TRANSIT',
        trackingUpdates: [{ status: 'DISPATCHED', description: 'Dispatched' }],
      });

      const res = await request(app).get(
        '/api/v1/fulfillment/shipments/tracking/TRK-DELHIVERY-001',
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.trackingNumber).toBe('TRK-DELHIVERY-001');
    });
  });

  describe('GET /api/v1/fulfillment/shipments/:id', () => {
    it('should return shipment details for authenticated user', async () => {
      mockShipmentService.getShipmentById.mockResolvedValue({
        id: 'shp-1',
        shipment_number: 'SHP-001',
        order_id: 'ord-1',
      });

      const res = await request(app)
        .get('/api/v1/fulfillment/shipments/shp-1')
        .set('x-internal-gateway-secret', trustedGatewaySecret)
        .set('x-user-id', 'cust-1')
        .set('x-user-role', 'CUSTOMER');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.shipment_number).toBe('SHP-001');
    });
  });

  describe('GET /api/v1/fulfillment/shipments', () => {
    it('should list shipments with pagination', async () => {
      mockShipmentService.listShipments.mockResolvedValue({
        shipments: [{ id: 'shp-1' }],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
      });

      const res = await request(app)
        .get('/api/v1/fulfillment/shipments')
        .set('x-internal-gateway-secret', trustedGatewaySecret)
        .set('x-user-id', 'admin-1')
        .set('x-user-role', 'ADMIN');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
    });
  });
});
