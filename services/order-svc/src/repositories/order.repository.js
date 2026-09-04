import { BusinessRuleError } from '@ecommerce/shared';

import { prisma as defaultPrisma } from '../lib/prisma.js';
import { OrderStateMachineService } from '../services/order-state-machine.service.js';

export class OrderRepository {
  constructor(prismaClient = defaultPrisma) {
    this.prisma = prismaClient;
  }

  /**
   * Generates a unique order number like ORD-20260824-A1B2C3
   */
  generateOrderNumber() {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
    return `ORD-${dateStr}-${randomHex}`;
  }

  /**
   * Atomic PostgreSQL transaction creating Order, Items, Initial History, Outbox, and clearing Cart.
   */
  async createOrderAtomic({
    orderData,
    itemsData,
    outboxPayload,
    clearCartUserId = null,
    idempotencyUpdate = null,
  }) {
    const created = await this.prisma.$transaction(
      async (tx) => {
        // 1. Create Parent Order
        const order = await tx.order.create({
          data: {
            order_number: orderData.order_number || this.generateOrderNumber(),
            user_id: orderData.user_id,
            status: 'PLACED',
            payment_method: orderData.payment_method,
            payment_id: orderData.payment_id || null,
            shipping_address: orderData.shipping_address,
            pricing_snapshot: orderData.pricing_snapshot,
            coupon_code: orderData.coupon_code || null,
            discount_amount: orderData.discount_amount || 0.0,
            total_amount: orderData.total_amount,
            customer_notes: orderData.customer_notes || null,
          },
        });

        // 2. Create Child Order Items
        const createdItems = [];
        for (const item of itemsData) {
          const orderItem = await tx.orderItem.create({
            data: {
              order_id: order.id,
              product_id: item.product_id,
              seller_id: item.seller_id,
              title: item.title,
              unit_price: item.unit_price,
              quantity: item.quantity,
              subtotal: item.subtotal,
              image_url: item.image_url || null,
              status: 'PLACED',
            },
          });
          createdItems.push(orderItem);
        }

        // 3. Create Initial OrderStatusHistory Record (from NULL -> PLACED)
        const initialHistory = await tx.orderStatusHistory.create({
          data: {
            order_id: order.id,
            from_status: null,
            to_status: 'PLACED',
            changed_by: orderData.user_id,
            actor_role: 'CUSTOMER',
            reason: 'ORDER_PLACED',
          },
        });

        // 4. Create Transactional Outbox Event
        await tx.orderOutbox.create({
          data: {
            event_type: 'order.placed',
            aggregate_type: 'Order',
            aggregate_id: order.id,
            payload: {
              eventId: outboxPayload.eventId,
              eventType: 'order.placed',
              aggregateType: 'Order',
              aggregateId: order.id,
              occurredAt: new Date().toISOString(),
              version: '1.0',
              payload: {
                ...outboxPayload,
                orderId: order.id,
                orderNumber: order.order_number,
                items: createdItems.map((i) => ({
                  id: i.id,
                  productId: i.product_id,
                  sellerId: i.seller_id,
                  title: i.title,
                  unitPrice: i.unit_price,
                  quantity: i.quantity,
                  subtotal: i.subtotal,
                })),
              },
            },
            status: 'PENDING',
          },
        });

        // 5. Atomically Clear Cart (if cart checkout)
        if (clearCartUserId) {
          const userCart = await tx.cart.findUnique({
            where: { user_id: clearCartUserId },
          });
          if (userCart) {
            await tx.cartItem.deleteMany({
              where: { cart_id: userCart.id },
            });
          }
        }

        const fullOrder = {
          ...order,
          items: createdItems,
          status_history: [initialHistory],
        };

        // 6. Update Idempotency Record to COMPLETED
        if (idempotencyUpdate) {
          await tx.idempotencyRecord.update({
            where: {
              user_id_idempotency_key: {
                user_id: idempotencyUpdate.userId,
                idempotency_key: idempotencyUpdate.idempotencyKey,
              },
            },
            data: {
              status: 'COMPLETED',
              order_id: order.id,
              response_payload: fullOrder,
              completed_at: new Date(),
            },
          });
        }

        return fullOrder;
      },
      {
        maxWait: 15000,
        timeout: 30000,
      },
    );

    return created;
  }

  /**
   * Concurrency-safe atomic status transition with row-locking and history recording
   */
  async transitionOrderStatusAtomic({
    orderId,
    targetStatus,
    actorId,
    actorRole,
    reason = null,
    shippingData = null,
    deliveryAgentData = null,
    deliveryData = null,
  }) {
    const result = await this.prisma.$transaction(
      async (tx) => {
        // 1. Fetch current order with items
        const order = await tx.order.findUnique({
          where: { id: orderId },
          include: {
            items: true,
            status_history: { orderBy: [{ created_at: 'asc' }, { id: 'asc' }] },
          },
        });

        if (!order) {
          return { notFound: true };
        }

        // Idempotency: If already in target status, return existing order without creating duplicate records
        if (order.status === targetStatus) {
          return {
            order,
            alreadyInState: true,
            idempotent: true,
          };
        }

        // 2. Validate transition with centralized state machine service
        const validation = OrderStateMachineService.validateTransition({
          currentStatus: order.status,
          targetStatus,
          actorId,
          actorRole,
          order,
          reason,
        });

        // 3. Update Order
        const updateData = {
          status: targetStatus,
        };

        if (targetStatus === 'CANCELLED') {
          updateData.cancellation_reason = validation.reason;
          updateData.cancelled_at = new Date();
          updateData.cancelled_by = actorId;
        } else if (targetStatus === 'SHIPPED' && shippingData) {
          updateData.courier_name = shippingData.courierName;
          updateData.tracking_number = shippingData.trackingNumber;
          updateData.shipped_at = new Date();
          updateData.dispatched_by = actorId;
        } else if (targetStatus === 'OUT_FOR_DELIVERY' && deliveryAgentData) {
          updateData.delivery_agent_name = deliveryAgentData.deliveryAgentName;
          updateData.delivery_agent_phone = deliveryAgentData.deliveryAgentPhone;
        } else if (targetStatus === 'DELIVERED') {
          updateData.delivered_at = new Date();
          updateData.pod_metadata = deliveryData || {};
        }

        await tx.order.update({
          where: { id: orderId },
          data: updateData,
        });

        // 4. Update OrderItems if CANCELLED
        if (targetStatus === 'CANCELLED') {
          await tx.orderItem.updateMany({
            where: { order_id: orderId },
            data: { status: 'CANCELLED' },
          });
        } else if (targetStatus === 'DELIVERED') {
          await tx.orderItem.updateMany({
            where: { order_id: orderId },
            data: { status: 'DELIVERED' },
          });
        }

        // 5. Append to OrderStatusHistory
        const historyEntry = await tx.orderStatusHistory.create({
          data: {
            order_id: orderId,
            from_status: order.status,
            to_status: targetStatus,
            changed_by: actorId,
            actor_role: validation.actorRole,
            reason: validation.reason,
          },
        });

        // 6. Insert OrderOutbox Event
        let eventType = 'order.status_updated';
        if (targetStatus === 'CANCELLED') {
          eventType = 'order.cancelled';
        } else if (targetStatus === 'SHIPPED') {
          eventType = 'order.shipped';
        } else if (targetStatus === 'DELIVERED') {
          eventType = 'order.delivered';
        }

        const outboxEventPayload = {
          orderId,
          orderNumber: order.order_number,
          userId: order.user_id,
          fromStatus: order.status,
          toStatus: targetStatus,
          paymentMethod: order.payment_method,
          paymentId: order.payment_id,
          totalAmount: order.total_amount,
          reason: validation.reason,
          changedBy: actorId,
          actorRole: validation.actorRole,
        };

        if (targetStatus === 'SHIPPED' && shippingData) {
          outboxEventPayload.courierName = shippingData.courierName;
          outboxEventPayload.trackingNumber = shippingData.trackingNumber;
          outboxEventPayload.shippedAt = updateData.shipped_at;
        } else if (targetStatus === 'OUT_FOR_DELIVERY' && deliveryAgentData) {
          outboxEventPayload.deliveryAgentName = deliveryAgentData.deliveryAgentName;
          outboxEventPayload.deliveryAgentPhone = deliveryAgentData.deliveryAgentPhone;
        } else if (targetStatus === 'DELIVERED') {
          outboxEventPayload.deliveredAt = updateData.delivered_at;
          outboxEventPayload.podMetadata = updateData.pod_metadata;
        }

        await tx.orderOutbox.create({
          data: {
            event_type: eventType,
            aggregate_type: 'Order',
            aggregate_id: orderId,
            payload: {
              eventId: crypto.randomUUID ? crypto.randomUUID() : `evt_${Date.now()}`,
              eventType,
              aggregateType: 'Order',
              aggregateId: orderId,
              occurredAt: new Date().toISOString(),
              version: '1.0',
              payload: outboxEventPayload,
            },
            status: 'PENDING',
          },
        });

        const fullOrder = await tx.order.findUnique({
          where: { id: orderId },
          include: {
            items: { orderBy: { created_at: 'asc' } },
            status_history: { orderBy: [{ created_at: 'asc' }, { id: 'asc' }] },
          },
        });

        return {
          order: fullOrder,
          previousStatus: order.status,
          alreadyInState: false,
          idempotent: false,
          historyEntry,
        };
      },
      {
        maxWait: 15000,
        timeout: 30000,
      },
    );

    return result;
  }

  buildWhereClause({ userId, userRole = 'CUSTOMER', statuses = [], search = null }) {
    const whereClause = {};

    // 1. Role Scoping
    if (userRole === 'CUSTOMER') {
      whereClause.user_id = userId;
    } else if (userRole === 'SELLER') {
      whereClause.items = {
        some: { seller_id: userId },
      };
    }

    // 2. Multi-Status Filtering
    if (statuses && Array.isArray(statuses) && statuses.length > 0) {
      whereClause.status = { in: statuses };
    }

    // 3. Search on Immutable Snapshots (order_number or OrderItem.title)
    if (search && typeof search === 'string' && search.trim().length >= 2) {
      const cleanSearch = search.trim().substring(0, 100);
      whereClause.OR = [
        {
          order_number: {
            contains: cleanSearch,
            mode: 'insensitive',
          },
        },
        {
          items: {
            some: {
              title: {
                contains: cleanSearch,
                mode: 'insensitive',
              },
            },
          },
        },
      ];
    }

    return whereClause;
  }

  async findById(id, tx = this.prisma) {
    const order = await tx.order.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: { created_at: 'asc' },
        },
        status_history: {
          orderBy: [{ created_at: 'asc' }, { id: 'asc' }],
        },
      },
    });
    return order;
  }

  async findOrders(
    { userId, userRole = 'CUSTOMER', statuses = [], search = null, skip = 0, take = 20 } = {},
    tx = this.prisma,
  ) {
    const whereClause = this.buildWhereClause({ userId, userRole, statuses, search });

    const orders = await tx.order.findMany({
      where: whereClause,
      include: {
        items: {
          take: 5,
          orderBy: { created_at: 'asc' },
        },
      },
      orderBy: { created_at: 'desc' },
      skip,
      take,
    });
    return orders;
  }

  async countOrders(
    { userId, userRole = 'CUSTOMER', statuses = [], search = null } = {},
    tx = this.prisma,
  ) {
    const whereClause = this.buildWhereClause({ userId, userRole, statuses, search });
    const count = await tx.order.count({
      where: whereClause,
    });
    return count;
  }

  async findSellerOrders(
    { sellerId, userRole = 'SELLER', statuses = [], search = null, skip = 0, take = 20 } = {},
    tx = this.prisma,
  ) {
    const whereClause = this.buildWhereClause({
      userId: sellerId,
      userRole,
      statuses,
      search,
    });

    const orders = await tx.order.findMany({
      where: whereClause,
      include: {
        items: {
          orderBy: { created_at: 'asc' },
        },
      },
      orderBy: { created_at: 'desc' },
      skip,
      take,
    });

    // If SELLER, filter items to only those belonging to this seller
    return orders.map((order) => {
      const sellerItems =
        userRole === 'SELLER'
          ? (order.items || []).filter((item) => item.seller_id === sellerId)
          : order.items || [];

      return {
        ...order,
        sellerItems,
        sellerItemsCount: sellerItems.length,
      };
    });
  }

  async countSellerOrders(
    { sellerId, userRole = 'SELLER', statuses = [], search = null } = {},
    tx = this.prisma,
  ) {
    const whereClause = this.buildWhereClause({
      userId: sellerId,
      userRole,
      statuses,
      search,
    });
    const count = await tx.order.count({
      where: whereClause,
    });
    return count;
  }

  /**
   * Phase 2H: Atomically increments delivery attempt counter and records history
   */
  async recordDeliveryAttemptAtomic({ orderId, actorId, actorRole, reason }) {
    const result = await this.prisma.$transaction(
      async (tx) => {
        const order = await tx.order.findUnique({
          where: { id: orderId },
        });

        if (!order) {
          return { notFound: true };
        }

        if (order.status !== 'OUT_FOR_DELIVERY') {
          throw new BusinessRuleError(
            `Cannot record delivery attempt for order in '${order.status}' status. Order must be 'OUT_FOR_DELIVERY'.`,
          );
        }

        const updated = await tx.order.update({
          where: { id: orderId },
          data: {
            delivery_attempts: { increment: 1 },
          },
        });

        const historyEntry = await tx.orderStatusHistory.create({
          data: {
            order_id: orderId,
            from_status: 'OUT_FOR_DELIVERY',
            to_status: 'OUT_FOR_DELIVERY',
            changed_by: actorId,
            actor_role: actorRole,
            reason: reason || 'Delivery attempt failed / customer unavailable',
          },
        });

        return {
          order: updated,
          historyEntry,
        };
      },
      {
        maxWait: 15000,
        timeout: 30000,
      },
    );

    return result;
  }

  /**
   * Phase 2H: Logistics listing queries
   */
  async findLogisticsOrders(
    { statuses = ['SHIPPED', 'OUT_FOR_DELIVERY'], search = null, skip = 0, take = 20 } = {},
    tx = this.prisma,
  ) {
    const whereClause = {};
    if (statuses && statuses.length > 0) {
      whereClause.status = { in: statuses };
    }

    if (search && typeof search === 'string' && search.trim().length > 0) {
      const term = search.trim();
      whereClause.OR = [
        { order_number: { contains: term, mode: 'insensitive' } },
        { tracking_number: { contains: term, mode: 'insensitive' } },
        { courier_name: { contains: term, mode: 'insensitive' } },
        { delivery_agent_name: { contains: term, mode: 'insensitive' } },
        {
          items: {
            some: {
              title: { contains: term, mode: 'insensitive' },
            },
          },
        },
      ];
    }

    return await tx.order.findMany({
      where: whereClause,
      include: {
        items: { orderBy: { created_at: 'asc' } },
        status_history: { orderBy: [{ created_at: 'asc' }, { id: 'asc' }] },
      },
      orderBy: { updated_at: 'desc' },
      skip,
      take,
    });
  }

  async countLogisticsOrders(
    { statuses = ['SHIPPED', 'OUT_FOR_DELIVERY'], search = null } = {},
    tx = this.prisma,
  ) {
    const whereClause = {};
    if (statuses && statuses.length > 0) {
      whereClause.status = { in: statuses };
    }

    if (search && typeof search === 'string' && search.trim().length > 0) {
      const term = search.trim();
      whereClause.OR = [
        { order_number: { contains: term, mode: 'insensitive' } },
        { tracking_number: { contains: term, mode: 'insensitive' } },
        { courier_name: { contains: term, mode: 'insensitive' } },
        { delivery_agent_name: { contains: term, mode: 'insensitive' } },
        {
          items: {
            some: {
              title: { contains: term, mode: 'insensitive' },
            },
          },
        },
      ];
    }

    return await tx.order.count({ where: whereClause });
  }

  // Backward compatibility helpers
  async findByUserId(userId, { skip = 0, take = 20 } = {}, tx = this.prisma) {
    return await this.findOrders({ userId, userRole: 'CUSTOMER', skip, take }, tx);
  }

  async countByUserId(userId, tx = this.prisma) {
    return await this.countOrders({ userId, userRole: 'CUSTOMER' }, tx);
  }

  // ── Phase 2: Seller Sales Analytics ──────────────────────────────────────
  async getSellerAnalyticsOverview({ sellerId, startDate, endDate }, tx = this.prisma) {
    const dateFilter = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate);
    }

    const activeItemsWhere = {
      seller_id: sellerId,
      order: {
        status: { not: 'CANCELLED' },
        ...(Object.keys(dateFilter).length > 0 ? { created_at: dateFilter } : {}),
      },
    };

    const [activeAggregation, activeOrders, allSellerItems] = await Promise.all([
      tx.orderItem.aggregate({
        where: activeItemsWhere,
        _sum: {
          subtotal: true,
          quantity: true,
        },
      }),
      tx.orderItem.findMany({
        where: activeItemsWhere,
        distinct: ['order_id'],
        select: { order_id: true },
      }),
      tx.orderItem.findMany({
        where: {
          seller_id: sellerId,
          ...(Object.keys(dateFilter).length > 0 ? { order: { created_at: dateFilter } } : {}),
        },
        select: {
          subtotal: true,
          quantity: true,
          order: { select: { status: true } },
        },
      }),
    ]);

    const totalOrders = activeOrders.length;
    const totalRevenue = Number(Number(activeAggregation._sum.subtotal || 0).toFixed(2));
    const totalUnitsSold = Number(activeAggregation._sum.quantity || 0);
    const averageOrderValue = totalOrders > 0 ? Number((totalRevenue / totalOrders).toFixed(2)) : 0;

    const ordersByStatus = {
      PLACED: 0,
      CONFIRMED: 0,
      PROCESSING: 0,
      SHIPPED: 0,
      OUT_FOR_DELIVERY: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    };
    let cancelledRevenue = 0;

    for (const item of allSellerItems) {
      const status = item.order?.status;
      if (status && ordersByStatus[status] !== undefined) {
        ordersByStatus[status] += 1;
        if (status === 'CANCELLED') {
          cancelledRevenue += Number(item.subtotal || 0);
        }
      }
    }

    return {
      totalRevenue,
      totalOrders,
      totalUnitsSold,
      averageOrderValue,
      ordersByStatus,
      cancelledRevenue: Number(cancelledRevenue.toFixed(2)),
      dateRange: {
        startDate: startDate || null,
        endDate: endDate || null,
      },
    };
  }

  async getSellerRevenueTimeline(
    { sellerId, startDate, endDate, interval = 'day' },
    tx = this.prisma,
  ) {
    const dateFilter = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate);
    }

    const activeItemsWhere = {
      seller_id: sellerId,
      order: {
        status: { not: 'CANCELLED' },
        ...(Object.keys(dateFilter).length > 0 ? { created_at: dateFilter } : {}),
      },
    };

    const items = await tx.orderItem.findMany({
      where: activeItemsWhere,
      select: {
        subtotal: true,
        quantity: true,
        created_at: true,
        order_id: true,
      },
      orderBy: { created_at: 'asc' },
    });

    const buckets = {};
    for (const item of items) {
      const d = new Date(item.created_at);
      let key;
      if (interval === 'month') {
        key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      } else {
        key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      }

      if (!buckets[key]) {
        buckets[key] = { date: key, revenue: 0, unitsSold: 0, orderIds: new Set() };
      }
      buckets[key].revenue += Number(item.subtotal || 0);
      buckets[key].unitsSold += item.quantity || 0;
      buckets[key].orderIds.add(item.order_id);
    }

    const timeline = Object.values(buckets).map((b) => ({
      date: b.date,
      revenue: Number(b.revenue.toFixed(2)),
      unitsSold: b.unitsSold,
      orderCount: b.orderIds.size,
    }));

    return {
      interval,
      timeline,
      totalPoints: timeline.length,
    };
  }

  async getSellerTopProducts({ sellerId, startDate, endDate, limit = 10 }, tx = this.prisma) {
    const dateFilter = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate);
    }

    const activeItemsWhere = {
      seller_id: sellerId,
      order: {
        status: { not: 'CANCELLED' },
        ...(Object.keys(dateFilter).length > 0 ? { created_at: dateFilter } : {}),
      },
    };

    const topProducts = await tx.orderItem.groupBy({
      by: ['product_id', 'title'],
      where: activeItemsWhere,
      _sum: {
        quantity: true,
        subtotal: true,
      },
      orderBy: {
        _sum: {
          subtotal: 'desc',
        },
      },
      take: limit,
    });

    return topProducts.map((p) => ({
      productId: p.product_id,
      title: p.title,
      unitsSold: p._sum.quantity || 0,
      totalRevenue: Number((p._sum.subtotal || 0).toFixed(2)),
    }));
  }
}

export const orderRepository = new OrderRepository();
