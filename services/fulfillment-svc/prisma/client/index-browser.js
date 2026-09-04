
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.WarehouseScalarFieldEnum = {
  id: 'id',
  code: 'code',
  name: 'name',
  address_line1: 'address_line1',
  address_line2: 'address_line2',
  city: 'city',
  state: 'state',
  postal_code: 'postal_code',
  country: 'country',
  is_active: 'is_active',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.InventoryItemScalarFieldEnum = {
  id: 'id',
  product_id: 'product_id',
  sku: 'sku',
  seller_id: 'seller_id',
  warehouse_id: 'warehouse_id',
  quantity_on_hand: 'quantity_on_hand',
  quantity_reserved: 'quantity_reserved',
  quantity_allocated: 'quantity_allocated',
  safety_stock: 'safety_stock',
  reorder_threshold: 'reorder_threshold',
  version: 'version',
  is_active: 'is_active',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.InventoryReservationScalarFieldEnum = {
  id: 'id',
  reservation_key: 'reservation_key',
  user_id: 'user_id',
  order_id: 'order_id',
  status: 'status',
  expires_at: 'expires_at',
  committed_at: 'committed_at',
  released_at: 'released_at',
  expired_at: 'expired_at',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.ReservationItemScalarFieldEnum = {
  id: 'id',
  reservation_id: 'reservation_id',
  inventory_item_id: 'inventory_item_id',
  product_id: 'product_id',
  sku: 'sku',
  quantity: 'quantity',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.ShipmentScalarFieldEnum = {
  id: 'id',
  shipment_number: 'shipment_number',
  order_id: 'order_id',
  user_id: 'user_id',
  warehouse_id: 'warehouse_id',
  reservation_id: 'reservation_id',
  status: 'status',
  courier_code: 'courier_code',
  tracking_number: 'tracking_number',
  shipping_address: 'shipping_address',
  label_url: 'label_url',
  manifest_id: 'manifest_id',
  estimated_delivery: 'estimated_delivery',
  dispatched_at: 'dispatched_at',
  delivered_at: 'delivered_at',
  delivery_notes: 'delivery_notes',
  pod_signature: 'pod_signature',
  pod_received_by: 'pod_received_by',
  pod_received_at: 'pod_received_at',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.ShipmentItemScalarFieldEnum = {
  id: 'id',
  shipment_id: 'shipment_id',
  product_id: 'product_id',
  sku: 'sku',
  seller_id: 'seller_id',
  quantity: 'quantity',
  unit_price: 'unit_price',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.TrackingUpdateScalarFieldEnum = {
  id: 'id',
  shipment_id: 'shipment_id',
  status: 'status',
  location: 'location',
  description: 'description',
  recorded_by: 'recorded_by',
  recorded_at: 'recorded_at'
};

exports.Prisma.ReturnPickupScalarFieldEnum = {
  id: 'id',
  return_number: 'return_number',
  order_id: 'order_id',
  user_id: 'user_id',
  warehouse_id: 'warehouse_id',
  status: 'status',
  courier_code: 'courier_code',
  return_tracking_number: 'return_tracking_number',
  pickup_address: 'pickup_address',
  scheduled_pickup_date: 'scheduled_pickup_date',
  picked_up_at: 'picked_up_at',
  received_at: 'received_at',
  completed_at: 'completed_at',
  pop_signature: 'pop_signature',
  pop_received_by: 'pop_received_by',
  cancellation_reason: 'cancellation_reason',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.ReturnItemScalarFieldEnum = {
  id: 'id',
  return_pickup_id: 'return_pickup_id',
  product_id: 'product_id',
  sku: 'sku',
  seller_id: 'seller_id',
  quantity: 'quantity',
  reason: 'reason',
  inspection_grade: 'inspection_grade',
  inspection_notes: 'inspection_notes',
  is_restocked: 'is_restocked',
  restocked_at: 'restocked_at',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.ReturnTrackingUpdateScalarFieldEnum = {
  id: 'id',
  return_pickup_id: 'return_pickup_id',
  status: 'status',
  location: 'location',
  description: 'description',
  recorded_by: 'recorded_by',
  recorded_at: 'recorded_at'
};

exports.Prisma.FulfillmentOutboxScalarFieldEnum = {
  id: 'id',
  event_type: 'event_type',
  aggregate_type: 'aggregate_type',
  aggregate_id: 'aggregate_id',
  payload: 'payload',
  status: 'status',
  retry_count: 'retry_count',
  max_retries: 'max_retries',
  next_retry_at: 'next_retry_at',
  locked_at: 'locked_at',
  locked_by: 'locked_by',
  last_error: 'last_error',
  created_at: 'created_at',
  processed_at: 'processed_at'
};

exports.Prisma.ProcessedEventScalarFieldEnum = {
  id: 'id',
  event_id: 'event_id',
  consumer_group: 'consumer_group',
  event_type: 'event_type',
  processed_at: 'processed_at'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.ReservationStatus = exports.$Enums.ReservationStatus = {
  HELD: 'HELD',
  COMMITTED: 'COMMITTED',
  RELEASED: 'RELEASED',
  EXPIRED: 'EXPIRED'
};

exports.ShipmentStatus = exports.$Enums.ShipmentStatus = {
  ALLOCATED: 'ALLOCATED',
  PACKED: 'PACKED',
  DISPATCHED: 'DISPATCHED',
  IN_TRANSIT: 'IN_TRANSIT',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  FAILED_DELIVERY: 'FAILED_DELIVERY',
  RETURNED_TO_ORIGIN: 'RETURNED_TO_ORIGIN',
  CANCELLED: 'CANCELLED'
};

exports.CourierCode = exports.$Enums.CourierCode = {
  DELHIVERY: 'DELHIVERY',
  BLUEDART: 'BLUEDART',
  SHIPROCKET: 'SHIPROCKET',
  EKART: 'EKART',
  INTERNAL_FLEET: 'INTERNAL_FLEET'
};

exports.ReturnPickupStatus = exports.$Enums.ReturnPickupStatus = {
  REQUESTED: 'REQUESTED',
  PICKUP_SCHEDULED: 'PICKUP_SCHEDULED',
  OUT_FOR_PICKUP: 'OUT_FOR_PICKUP',
  PICKED_UP: 'PICKED_UP',
  IN_TRANSIT: 'IN_TRANSIT',
  RECEIVED_AT_WAREHOUSE: 'RECEIVED_AT_WAREHOUSE',
  INSPECTED: 'INSPECTED',
  COMPLETED: 'COMPLETED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED'
};

exports.InspectionGrade = exports.$Enums.InspectionGrade = {
  PASS: 'PASS',
  DAMAGED: 'DAMAGED',
  DEFECTIVE: 'DEFECTIVE',
  WRONG_ITEM: 'WRONG_ITEM',
  MISSING_ACCESSORIES: 'MISSING_ACCESSORIES'
};

exports.OutboxStatus = exports.$Enums.OutboxStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  PROCESSED: 'PROCESSED',
  PUBLISHED: 'PUBLISHED',
  FAILED: 'FAILED'
};

exports.Prisma.ModelName = {
  Warehouse: 'Warehouse',
  InventoryItem: 'InventoryItem',
  InventoryReservation: 'InventoryReservation',
  ReservationItem: 'ReservationItem',
  Shipment: 'Shipment',
  ShipmentItem: 'ShipmentItem',
  TrackingUpdate: 'TrackingUpdate',
  ReturnPickup: 'ReturnPickup',
  ReturnItem: 'ReturnItem',
  ReturnTrackingUpdate: 'ReturnTrackingUpdate',
  FulfillmentOutbox: 'FulfillmentOutbox',
  ProcessedEvent: 'ProcessedEvent'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
