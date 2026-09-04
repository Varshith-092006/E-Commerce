import request from 'supertest';
import { jest } from '@jest/globals';
import { createApp } from '../../src/app.js';
import { WarehouseController } from '../../src/controllers/warehouse.controller.js';
import { InventoryController } from '../../src/controllers/inventory.controller.js';
import { ReservationController } from '../../src/controllers/reservation.controller.js';

describe('Fulfillment Service API Integration Tests', () => {
  let app;
  let mockWarehouseService;
  let mockInventoryService;
  let mockReservationService;

  const trustedGatewaySecret =
    process.env.INTERNAL_GATEWAY_SECRET || 'ecom_internal_mesh_secret_2026';

  beforeEach(() => {
    mockWarehouseService = {
      createWarehouse: jest.fn(),
      updateWarehouse: jest.fn(),
      getWarehouseById: jest.fn(),
      listWarehouses: jest.fn(),
    };

    mockInventoryService = {
      intakeStock: jest.fn(),
      adjustStock: jest.fn(),
      checkStock: jest.fn(),
      listInventory: jest.fn(),
      createReservation: jest.fn(),
      commitReservation: jest.fn(),
      releaseReservation: jest.fn(),
      getReservationById: jest.fn(),
      getReservationByKey: jest.fn(),
      expireStaleReservations: jest.fn(),
    };

    mockReservationService = mockInventoryService;

    const warehouseController = new WarehouseController(mockWarehouseService);
    const inventoryController = new InventoryController(mockInventoryService);
    const reservationController = new ReservationController(mockReservationService);

    app = createApp({
      warehouseController,
      inventoryController,
      reservationController,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Warehouse Endpoints (/api/v1/fulfillment/warehouses)', () => {
    describe('POST /api/v1/fulfillment/warehouses', () => {
      it('should return 401 Unauthorized if no authentication provided', async () => {
        const res = await request(app)
          .post('/api/v1/fulfillment/warehouses')
          .send({ code: 'WH-BLR-01', name: 'Bangalore Hub' });

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.error.code).toBe('UNAUTHORIZED');
      });

      it('should return 403 Forbidden if user is CUSTOMER or SELLER', async () => {
        const res = await request(app)
          .post('/api/v1/fulfillment/warehouses')
          .set('x-internal-gateway-secret', trustedGatewaySecret)
          .set('x-user-id', 'seller-1')
          .set('x-user-role', 'SELLER')
          .send({ code: 'WH-BLR-01', name: 'Bangalore Hub' });

        expect(res.status).toBe(403);
        expect(res.body.success).toBe(false);
        expect(res.body.error.code).toBe('FORBIDDEN');
      });

      it('should return 201 Created when created by ADMIN', async () => {
        mockWarehouseService.createWarehouse.mockResolvedValue({
          id: 'wh-1',
          code: 'WH-BLR-01',
          name: 'Bangalore Hub',
          is_active: true,
        });

        const res = await request(app)
          .post('/api/v1/fulfillment/warehouses')
          .set('x-internal-gateway-secret', trustedGatewaySecret)
          .set('x-user-id', 'admin-1')
          .set('x-user-role', 'ADMIN')
          .send({
            code: 'WH-BLR-01',
            name: 'Bangalore Hub',
            addressLine1: '123 Tech Park',
            city: 'Bangalore',
            state: 'Karnataka',
            postalCode: '560001',
          });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.code).toBe('WH-BLR-01');
      });
    });

    describe('GET /api/v1/fulfillment/warehouses', () => {
      it('should allow ADMIN and SELLER to list warehouses', async () => {
        mockWarehouseService.listWarehouses.mockResolvedValue({
          warehouses: [{ id: 'wh-1', code: 'WH-BLR-01' }],
          pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
        });

        const res = await request(app)
          .get('/api/v1/fulfillment/warehouses')
          .set('x-internal-gateway-secret', trustedGatewaySecret)
          .set('x-user-id', 'seller-1')
          .set('x-user-role', 'SELLER');

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveLength(1);
      });
    });
  });

  describe('Inventory Endpoints (/api/v1/fulfillment/inventory)', () => {
    describe('POST /api/v1/fulfillment/inventory/stock (Stock Intake)', () => {
      it('should return 403 Forbidden for CUSTOMER role', async () => {
        const res = await request(app)
          .post('/api/v1/fulfillment/inventory/stock')
          .set('x-internal-gateway-secret', trustedGatewaySecret)
          .set('x-user-id', 'cust-1')
          .set('x-user-role', 'CUSTOMER')
          .send({ productId: 'prod-1', sku: 'SKU-1', quantity: 10 });

        expect(res.status).toBe(403);
      });

      it('should allow SELLER to intake stock for permitted seller ID', async () => {
        mockInventoryService.intakeStock.mockResolvedValue({
          id: 'inv-1',
          product_id: 'prod-1',
          sku: 'SKU-SHIRT-L',
          quantity_on_hand: 50,
        });

        const res = await request(app)
          .post('/api/v1/fulfillment/inventory/stock')
          .set('x-internal-gateway-secret', trustedGatewaySecret)
          .set('x-user-id', 'seller-user-1')
          .set('x-user-role', 'SELLER')
          .set('x-seller-id', 'seller-uuid-1')
          .send({
            productId: 'prod-1',
            sku: 'SKU-SHIRT-L',
            warehouseId: 'wh-1',
            quantity: 50,
          });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.sku).toBe('SKU-SHIRT-L');
      });
    });

    describe('GET /api/v1/fulfillment/inventory/check (Stock Availability Check)', () => {
      it('should allow checking stock availability without requiring ADMIN/SELLER privileges', async () => {
        mockInventoryService.checkStock.mockResolvedValue([
          {
            sku: 'SKU-SHIRT-L',
            quantityOnHand: 50,
            quantityReserved: 5,
            availableQuantity: 45,
            isAvailable: true,
          },
        ]);

        const res = await request(app)
          .get('/api/v1/fulfillment/inventory/check?sku=SKU-SHIRT-L&quantity=2')
          .set('x-internal-gateway-secret', trustedGatewaySecret)
          .set('x-user-id', 'cust-1')
          .set('x-user-role', 'CUSTOMER');

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.availableQuantity).toBe(45);
      });
    });
  });

  describe('Reservation Endpoints (/api/v1/fulfillment/reservations)', () => {
    describe('POST /api/v1/fulfillment/reservations (Create Reservation)', () => {
      it('should create reservation and return 201 Created', async () => {
        mockReservationService.createReservation.mockResolvedValue({
          reservation: {
            id: 'res-1',
            reservation_key: 'key-123',
            user_id: 'cust-1',
            status: 'HELD',
          },
          isIdempotent: false,
        });

        const res = await request(app)
          .post('/api/v1/fulfillment/reservations')
          .set('x-internal-gateway-secret', trustedGatewaySecret)
          .set('x-user-id', 'cust-1')
          .set('x-user-role', 'CUSTOMER')
          .send({
            reservationKey: 'key-123',
            items: [{ sku: 'SKU-SHIRT-L', quantity: 2 }],
          });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.status).toBe('HELD');
      });

      it('should return 200 OK when request is idempotent duplicate', async () => {
        mockReservationService.createReservation.mockResolvedValue({
          reservation: {
            id: 'res-1',
            reservation_key: 'key-123',
            user_id: 'cust-1',
            status: 'HELD',
          },
          isIdempotent: true,
        });

        const res = await request(app)
          .post('/api/v1/fulfillment/reservations')
          .set('x-internal-gateway-secret', trustedGatewaySecret)
          .set('x-user-id', 'cust-1')
          .set('x-user-role', 'CUSTOMER')
          .send({
            reservationKey: 'key-123',
            items: [{ sku: 'SKU-SHIRT-L', quantity: 2 }],
          });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
      });
    });

    describe('POST /api/v1/fulfillment/reservations/:id/commit', () => {
      it('should commit reservation successfully', async () => {
        mockReservationService.commitReservation.mockResolvedValue({
          id: 'res-1',
          status: 'COMMITTED',
          committed_at: new Date().toISOString(),
        });

        const res = await request(app)
          .post('/api/v1/fulfillment/reservations/res-1/commit')
          .set('x-internal-gateway-secret', trustedGatewaySecret)
          .set('x-user-id', 'cust-1')
          .set('x-user-role', 'CUSTOMER');

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.status).toBe('COMMITTED');
      });
    });

    describe('POST /api/v1/fulfillment/reservations/:id/release', () => {
      it('should release reservation successfully', async () => {
        mockReservationService.releaseReservation.mockResolvedValue({
          id: 'res-1',
          status: 'RELEASED',
          released_at: new Date().toISOString(),
        });

        const res = await request(app)
          .post('/api/v1/fulfillment/reservations/res-1/release')
          .set('x-internal-gateway-secret', trustedGatewaySecret)
          .set('x-user-id', 'cust-1')
          .set('x-user-role', 'CUSTOMER')
          .send({ reason: 'ORDER_CANCELLED' });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.status).toBe('RELEASED');
      });
    });

    describe('GET /api/v1/fulfillment/reservations/by-key/:reservationKey', () => {
      it('should return reservation by key', async () => {
        mockReservationService.getReservationByKey.mockResolvedValue({
          id: 'res-1',
          reservation_key: 'key-123',
          status: 'HELD',
        });

        const res = await request(app)
          .get('/api/v1/fulfillment/reservations/by-key/key-123')
          .set('x-internal-gateway-secret', trustedGatewaySecret)
          .set('x-user-id', 'cust-1')
          .set('x-user-role', 'CUSTOMER');

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.reservation_key).toBe('key-123');
      });
    });

    describe('POST /api/v1/fulfillment/reservations/expire-sweeper', () => {
      it('should allow ADMIN to trigger expiry sweeper', async () => {
        mockReservationService.expireStaleReservations.mockResolvedValue({
          expiredCount: 3,
          expiredReservations: [],
        });

        const res = await request(app)
          .post('/api/v1/fulfillment/reservations/expire-sweeper')
          .set('x-internal-gateway-secret', trustedGatewaySecret)
          .set('x-user-id', 'admin-1')
          .set('x-user-role', 'ADMIN')
          .send({ limit: 50 });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.expiredCount).toBe(3);
      });

      it('should reject non-admin users from triggering expiry sweeper', async () => {
        const res = await request(app)
          .post('/api/v1/fulfillment/reservations/expire-sweeper')
          .set('x-internal-gateway-secret', trustedGatewaySecret)
          .set('x-user-id', 'cust-1')
          .set('x-user-role', 'CUSTOMER');

        expect(res.status).toBe(403);
      });
    });
  });
});
