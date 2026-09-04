
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Warehouse
 * 
 */
export type Warehouse = $Result.DefaultSelection<Prisma.$WarehousePayload>
/**
 * Model InventoryItem
 * 
 */
export type InventoryItem = $Result.DefaultSelection<Prisma.$InventoryItemPayload>
/**
 * Model InventoryReservation
 * 
 */
export type InventoryReservation = $Result.DefaultSelection<Prisma.$InventoryReservationPayload>
/**
 * Model ReservationItem
 * 
 */
export type ReservationItem = $Result.DefaultSelection<Prisma.$ReservationItemPayload>
/**
 * Model Shipment
 * 
 */
export type Shipment = $Result.DefaultSelection<Prisma.$ShipmentPayload>
/**
 * Model ShipmentItem
 * 
 */
export type ShipmentItem = $Result.DefaultSelection<Prisma.$ShipmentItemPayload>
/**
 * Model TrackingUpdate
 * 
 */
export type TrackingUpdate = $Result.DefaultSelection<Prisma.$TrackingUpdatePayload>
/**
 * Model ReturnPickup
 * 
 */
export type ReturnPickup = $Result.DefaultSelection<Prisma.$ReturnPickupPayload>
/**
 * Model ReturnItem
 * 
 */
export type ReturnItem = $Result.DefaultSelection<Prisma.$ReturnItemPayload>
/**
 * Model ReturnTrackingUpdate
 * 
 */
export type ReturnTrackingUpdate = $Result.DefaultSelection<Prisma.$ReturnTrackingUpdatePayload>
/**
 * Model FulfillmentOutbox
 * 
 */
export type FulfillmentOutbox = $Result.DefaultSelection<Prisma.$FulfillmentOutboxPayload>
/**
 * Model ProcessedEvent
 * 
 */
export type ProcessedEvent = $Result.DefaultSelection<Prisma.$ProcessedEventPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const ReservationStatus: {
  HELD: 'HELD',
  COMMITTED: 'COMMITTED',
  RELEASED: 'RELEASED',
  EXPIRED: 'EXPIRED'
};

export type ReservationStatus = (typeof ReservationStatus)[keyof typeof ReservationStatus]


export const ShipmentStatus: {
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

export type ShipmentStatus = (typeof ShipmentStatus)[keyof typeof ShipmentStatus]


export const CourierCode: {
  DELHIVERY: 'DELHIVERY',
  BLUEDART: 'BLUEDART',
  SHIPROCKET: 'SHIPROCKET',
  EKART: 'EKART',
  INTERNAL_FLEET: 'INTERNAL_FLEET'
};

export type CourierCode = (typeof CourierCode)[keyof typeof CourierCode]


export const ReturnPickupStatus: {
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

export type ReturnPickupStatus = (typeof ReturnPickupStatus)[keyof typeof ReturnPickupStatus]


export const InspectionGrade: {
  PASS: 'PASS',
  DAMAGED: 'DAMAGED',
  DEFECTIVE: 'DEFECTIVE',
  WRONG_ITEM: 'WRONG_ITEM',
  MISSING_ACCESSORIES: 'MISSING_ACCESSORIES'
};

export type InspectionGrade = (typeof InspectionGrade)[keyof typeof InspectionGrade]


export const OutboxStatus: {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  PROCESSED: 'PROCESSED',
  PUBLISHED: 'PUBLISHED',
  FAILED: 'FAILED'
};

export type OutboxStatus = (typeof OutboxStatus)[keyof typeof OutboxStatus]

}

export type ReservationStatus = $Enums.ReservationStatus

export const ReservationStatus: typeof $Enums.ReservationStatus

export type ShipmentStatus = $Enums.ShipmentStatus

export const ShipmentStatus: typeof $Enums.ShipmentStatus

export type CourierCode = $Enums.CourierCode

export const CourierCode: typeof $Enums.CourierCode

export type ReturnPickupStatus = $Enums.ReturnPickupStatus

export const ReturnPickupStatus: typeof $Enums.ReturnPickupStatus

export type InspectionGrade = $Enums.InspectionGrade

export const InspectionGrade: typeof $Enums.InspectionGrade

export type OutboxStatus = $Enums.OutboxStatus

export const OutboxStatus: typeof $Enums.OutboxStatus

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Warehouses
 * const warehouses = await prisma.warehouse.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Warehouses
   * const warehouses = await prisma.warehouse.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.warehouse`: Exposes CRUD operations for the **Warehouse** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Warehouses
    * const warehouses = await prisma.warehouse.findMany()
    * ```
    */
  get warehouse(): Prisma.WarehouseDelegate<ExtArgs>;

  /**
   * `prisma.inventoryItem`: Exposes CRUD operations for the **InventoryItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InventoryItems
    * const inventoryItems = await prisma.inventoryItem.findMany()
    * ```
    */
  get inventoryItem(): Prisma.InventoryItemDelegate<ExtArgs>;

  /**
   * `prisma.inventoryReservation`: Exposes CRUD operations for the **InventoryReservation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InventoryReservations
    * const inventoryReservations = await prisma.inventoryReservation.findMany()
    * ```
    */
  get inventoryReservation(): Prisma.InventoryReservationDelegate<ExtArgs>;

  /**
   * `prisma.reservationItem`: Exposes CRUD operations for the **ReservationItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ReservationItems
    * const reservationItems = await prisma.reservationItem.findMany()
    * ```
    */
  get reservationItem(): Prisma.ReservationItemDelegate<ExtArgs>;

  /**
   * `prisma.shipment`: Exposes CRUD operations for the **Shipment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Shipments
    * const shipments = await prisma.shipment.findMany()
    * ```
    */
  get shipment(): Prisma.ShipmentDelegate<ExtArgs>;

  /**
   * `prisma.shipmentItem`: Exposes CRUD operations for the **ShipmentItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ShipmentItems
    * const shipmentItems = await prisma.shipmentItem.findMany()
    * ```
    */
  get shipmentItem(): Prisma.ShipmentItemDelegate<ExtArgs>;

  /**
   * `prisma.trackingUpdate`: Exposes CRUD operations for the **TrackingUpdate** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TrackingUpdates
    * const trackingUpdates = await prisma.trackingUpdate.findMany()
    * ```
    */
  get trackingUpdate(): Prisma.TrackingUpdateDelegate<ExtArgs>;

  /**
   * `prisma.returnPickup`: Exposes CRUD operations for the **ReturnPickup** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ReturnPickups
    * const returnPickups = await prisma.returnPickup.findMany()
    * ```
    */
  get returnPickup(): Prisma.ReturnPickupDelegate<ExtArgs>;

  /**
   * `prisma.returnItem`: Exposes CRUD operations for the **ReturnItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ReturnItems
    * const returnItems = await prisma.returnItem.findMany()
    * ```
    */
  get returnItem(): Prisma.ReturnItemDelegate<ExtArgs>;

  /**
   * `prisma.returnTrackingUpdate`: Exposes CRUD operations for the **ReturnTrackingUpdate** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ReturnTrackingUpdates
    * const returnTrackingUpdates = await prisma.returnTrackingUpdate.findMany()
    * ```
    */
  get returnTrackingUpdate(): Prisma.ReturnTrackingUpdateDelegate<ExtArgs>;

  /**
   * `prisma.fulfillmentOutbox`: Exposes CRUD operations for the **FulfillmentOutbox** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FulfillmentOutboxes
    * const fulfillmentOutboxes = await prisma.fulfillmentOutbox.findMany()
    * ```
    */
  get fulfillmentOutbox(): Prisma.FulfillmentOutboxDelegate<ExtArgs>;

  /**
   * `prisma.processedEvent`: Exposes CRUD operations for the **ProcessedEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProcessedEvents
    * const processedEvents = await prisma.processedEvent.findMany()
    * ```
    */
  get processedEvent(): Prisma.ProcessedEventDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
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

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "warehouse" | "inventoryItem" | "inventoryReservation" | "reservationItem" | "shipment" | "shipmentItem" | "trackingUpdate" | "returnPickup" | "returnItem" | "returnTrackingUpdate" | "fulfillmentOutbox" | "processedEvent"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Warehouse: {
        payload: Prisma.$WarehousePayload<ExtArgs>
        fields: Prisma.WarehouseFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WarehouseFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WarehousePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WarehouseFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WarehousePayload>
          }
          findFirst: {
            args: Prisma.WarehouseFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WarehousePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WarehouseFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WarehousePayload>
          }
          findMany: {
            args: Prisma.WarehouseFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WarehousePayload>[]
          }
          create: {
            args: Prisma.WarehouseCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WarehousePayload>
          }
          createMany: {
            args: Prisma.WarehouseCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WarehouseCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WarehousePayload>[]
          }
          delete: {
            args: Prisma.WarehouseDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WarehousePayload>
          }
          update: {
            args: Prisma.WarehouseUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WarehousePayload>
          }
          deleteMany: {
            args: Prisma.WarehouseDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WarehouseUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.WarehouseUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WarehousePayload>
          }
          aggregate: {
            args: Prisma.WarehouseAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWarehouse>
          }
          groupBy: {
            args: Prisma.WarehouseGroupByArgs<ExtArgs>
            result: $Utils.Optional<WarehouseGroupByOutputType>[]
          }
          count: {
            args: Prisma.WarehouseCountArgs<ExtArgs>
            result: $Utils.Optional<WarehouseCountAggregateOutputType> | number
          }
        }
      }
      InventoryItem: {
        payload: Prisma.$InventoryItemPayload<ExtArgs>
        fields: Prisma.InventoryItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InventoryItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InventoryItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryItemPayload>
          }
          findFirst: {
            args: Prisma.InventoryItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InventoryItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryItemPayload>
          }
          findMany: {
            args: Prisma.InventoryItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryItemPayload>[]
          }
          create: {
            args: Prisma.InventoryItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryItemPayload>
          }
          createMany: {
            args: Prisma.InventoryItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InventoryItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryItemPayload>[]
          }
          delete: {
            args: Prisma.InventoryItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryItemPayload>
          }
          update: {
            args: Prisma.InventoryItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryItemPayload>
          }
          deleteMany: {
            args: Prisma.InventoryItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InventoryItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InventoryItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryItemPayload>
          }
          aggregate: {
            args: Prisma.InventoryItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInventoryItem>
          }
          groupBy: {
            args: Prisma.InventoryItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<InventoryItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.InventoryItemCountArgs<ExtArgs>
            result: $Utils.Optional<InventoryItemCountAggregateOutputType> | number
          }
        }
      }
      InventoryReservation: {
        payload: Prisma.$InventoryReservationPayload<ExtArgs>
        fields: Prisma.InventoryReservationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InventoryReservationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryReservationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InventoryReservationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryReservationPayload>
          }
          findFirst: {
            args: Prisma.InventoryReservationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryReservationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InventoryReservationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryReservationPayload>
          }
          findMany: {
            args: Prisma.InventoryReservationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryReservationPayload>[]
          }
          create: {
            args: Prisma.InventoryReservationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryReservationPayload>
          }
          createMany: {
            args: Prisma.InventoryReservationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InventoryReservationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryReservationPayload>[]
          }
          delete: {
            args: Prisma.InventoryReservationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryReservationPayload>
          }
          update: {
            args: Prisma.InventoryReservationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryReservationPayload>
          }
          deleteMany: {
            args: Prisma.InventoryReservationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InventoryReservationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InventoryReservationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryReservationPayload>
          }
          aggregate: {
            args: Prisma.InventoryReservationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInventoryReservation>
          }
          groupBy: {
            args: Prisma.InventoryReservationGroupByArgs<ExtArgs>
            result: $Utils.Optional<InventoryReservationGroupByOutputType>[]
          }
          count: {
            args: Prisma.InventoryReservationCountArgs<ExtArgs>
            result: $Utils.Optional<InventoryReservationCountAggregateOutputType> | number
          }
        }
      }
      ReservationItem: {
        payload: Prisma.$ReservationItemPayload<ExtArgs>
        fields: Prisma.ReservationItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReservationItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReservationItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationItemPayload>
          }
          findFirst: {
            args: Prisma.ReservationItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReservationItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationItemPayload>
          }
          findMany: {
            args: Prisma.ReservationItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationItemPayload>[]
          }
          create: {
            args: Prisma.ReservationItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationItemPayload>
          }
          createMany: {
            args: Prisma.ReservationItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReservationItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationItemPayload>[]
          }
          delete: {
            args: Prisma.ReservationItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationItemPayload>
          }
          update: {
            args: Prisma.ReservationItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationItemPayload>
          }
          deleteMany: {
            args: Prisma.ReservationItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReservationItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ReservationItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationItemPayload>
          }
          aggregate: {
            args: Prisma.ReservationItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReservationItem>
          }
          groupBy: {
            args: Prisma.ReservationItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReservationItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReservationItemCountArgs<ExtArgs>
            result: $Utils.Optional<ReservationItemCountAggregateOutputType> | number
          }
        }
      }
      Shipment: {
        payload: Prisma.$ShipmentPayload<ExtArgs>
        fields: Prisma.ShipmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ShipmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ShipmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentPayload>
          }
          findFirst: {
            args: Prisma.ShipmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ShipmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentPayload>
          }
          findMany: {
            args: Prisma.ShipmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentPayload>[]
          }
          create: {
            args: Prisma.ShipmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentPayload>
          }
          createMany: {
            args: Prisma.ShipmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ShipmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentPayload>[]
          }
          delete: {
            args: Prisma.ShipmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentPayload>
          }
          update: {
            args: Prisma.ShipmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentPayload>
          }
          deleteMany: {
            args: Prisma.ShipmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ShipmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ShipmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentPayload>
          }
          aggregate: {
            args: Prisma.ShipmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateShipment>
          }
          groupBy: {
            args: Prisma.ShipmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<ShipmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.ShipmentCountArgs<ExtArgs>
            result: $Utils.Optional<ShipmentCountAggregateOutputType> | number
          }
        }
      }
      ShipmentItem: {
        payload: Prisma.$ShipmentItemPayload<ExtArgs>
        fields: Prisma.ShipmentItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ShipmentItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ShipmentItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentItemPayload>
          }
          findFirst: {
            args: Prisma.ShipmentItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ShipmentItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentItemPayload>
          }
          findMany: {
            args: Prisma.ShipmentItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentItemPayload>[]
          }
          create: {
            args: Prisma.ShipmentItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentItemPayload>
          }
          createMany: {
            args: Prisma.ShipmentItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ShipmentItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentItemPayload>[]
          }
          delete: {
            args: Prisma.ShipmentItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentItemPayload>
          }
          update: {
            args: Prisma.ShipmentItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentItemPayload>
          }
          deleteMany: {
            args: Prisma.ShipmentItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ShipmentItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ShipmentItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentItemPayload>
          }
          aggregate: {
            args: Prisma.ShipmentItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateShipmentItem>
          }
          groupBy: {
            args: Prisma.ShipmentItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<ShipmentItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.ShipmentItemCountArgs<ExtArgs>
            result: $Utils.Optional<ShipmentItemCountAggregateOutputType> | number
          }
        }
      }
      TrackingUpdate: {
        payload: Prisma.$TrackingUpdatePayload<ExtArgs>
        fields: Prisma.TrackingUpdateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TrackingUpdateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackingUpdatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TrackingUpdateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackingUpdatePayload>
          }
          findFirst: {
            args: Prisma.TrackingUpdateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackingUpdatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TrackingUpdateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackingUpdatePayload>
          }
          findMany: {
            args: Prisma.TrackingUpdateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackingUpdatePayload>[]
          }
          create: {
            args: Prisma.TrackingUpdateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackingUpdatePayload>
          }
          createMany: {
            args: Prisma.TrackingUpdateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TrackingUpdateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackingUpdatePayload>[]
          }
          delete: {
            args: Prisma.TrackingUpdateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackingUpdatePayload>
          }
          update: {
            args: Prisma.TrackingUpdateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackingUpdatePayload>
          }
          deleteMany: {
            args: Prisma.TrackingUpdateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TrackingUpdateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TrackingUpdateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackingUpdatePayload>
          }
          aggregate: {
            args: Prisma.TrackingUpdateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTrackingUpdate>
          }
          groupBy: {
            args: Prisma.TrackingUpdateGroupByArgs<ExtArgs>
            result: $Utils.Optional<TrackingUpdateGroupByOutputType>[]
          }
          count: {
            args: Prisma.TrackingUpdateCountArgs<ExtArgs>
            result: $Utils.Optional<TrackingUpdateCountAggregateOutputType> | number
          }
        }
      }
      ReturnPickup: {
        payload: Prisma.$ReturnPickupPayload<ExtArgs>
        fields: Prisma.ReturnPickupFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReturnPickupFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnPickupPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReturnPickupFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnPickupPayload>
          }
          findFirst: {
            args: Prisma.ReturnPickupFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnPickupPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReturnPickupFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnPickupPayload>
          }
          findMany: {
            args: Prisma.ReturnPickupFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnPickupPayload>[]
          }
          create: {
            args: Prisma.ReturnPickupCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnPickupPayload>
          }
          createMany: {
            args: Prisma.ReturnPickupCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReturnPickupCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnPickupPayload>[]
          }
          delete: {
            args: Prisma.ReturnPickupDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnPickupPayload>
          }
          update: {
            args: Prisma.ReturnPickupUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnPickupPayload>
          }
          deleteMany: {
            args: Prisma.ReturnPickupDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReturnPickupUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ReturnPickupUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnPickupPayload>
          }
          aggregate: {
            args: Prisma.ReturnPickupAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReturnPickup>
          }
          groupBy: {
            args: Prisma.ReturnPickupGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReturnPickupGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReturnPickupCountArgs<ExtArgs>
            result: $Utils.Optional<ReturnPickupCountAggregateOutputType> | number
          }
        }
      }
      ReturnItem: {
        payload: Prisma.$ReturnItemPayload<ExtArgs>
        fields: Prisma.ReturnItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReturnItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReturnItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnItemPayload>
          }
          findFirst: {
            args: Prisma.ReturnItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReturnItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnItemPayload>
          }
          findMany: {
            args: Prisma.ReturnItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnItemPayload>[]
          }
          create: {
            args: Prisma.ReturnItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnItemPayload>
          }
          createMany: {
            args: Prisma.ReturnItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReturnItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnItemPayload>[]
          }
          delete: {
            args: Prisma.ReturnItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnItemPayload>
          }
          update: {
            args: Prisma.ReturnItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnItemPayload>
          }
          deleteMany: {
            args: Prisma.ReturnItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReturnItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ReturnItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnItemPayload>
          }
          aggregate: {
            args: Prisma.ReturnItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReturnItem>
          }
          groupBy: {
            args: Prisma.ReturnItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReturnItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReturnItemCountArgs<ExtArgs>
            result: $Utils.Optional<ReturnItemCountAggregateOutputType> | number
          }
        }
      }
      ReturnTrackingUpdate: {
        payload: Prisma.$ReturnTrackingUpdatePayload<ExtArgs>
        fields: Prisma.ReturnTrackingUpdateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReturnTrackingUpdateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnTrackingUpdatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReturnTrackingUpdateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnTrackingUpdatePayload>
          }
          findFirst: {
            args: Prisma.ReturnTrackingUpdateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnTrackingUpdatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReturnTrackingUpdateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnTrackingUpdatePayload>
          }
          findMany: {
            args: Prisma.ReturnTrackingUpdateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnTrackingUpdatePayload>[]
          }
          create: {
            args: Prisma.ReturnTrackingUpdateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnTrackingUpdatePayload>
          }
          createMany: {
            args: Prisma.ReturnTrackingUpdateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReturnTrackingUpdateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnTrackingUpdatePayload>[]
          }
          delete: {
            args: Prisma.ReturnTrackingUpdateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnTrackingUpdatePayload>
          }
          update: {
            args: Prisma.ReturnTrackingUpdateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnTrackingUpdatePayload>
          }
          deleteMany: {
            args: Prisma.ReturnTrackingUpdateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReturnTrackingUpdateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ReturnTrackingUpdateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReturnTrackingUpdatePayload>
          }
          aggregate: {
            args: Prisma.ReturnTrackingUpdateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReturnTrackingUpdate>
          }
          groupBy: {
            args: Prisma.ReturnTrackingUpdateGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReturnTrackingUpdateGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReturnTrackingUpdateCountArgs<ExtArgs>
            result: $Utils.Optional<ReturnTrackingUpdateCountAggregateOutputType> | number
          }
        }
      }
      FulfillmentOutbox: {
        payload: Prisma.$FulfillmentOutboxPayload<ExtArgs>
        fields: Prisma.FulfillmentOutboxFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FulfillmentOutboxFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FulfillmentOutboxPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FulfillmentOutboxFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FulfillmentOutboxPayload>
          }
          findFirst: {
            args: Prisma.FulfillmentOutboxFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FulfillmentOutboxPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FulfillmentOutboxFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FulfillmentOutboxPayload>
          }
          findMany: {
            args: Prisma.FulfillmentOutboxFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FulfillmentOutboxPayload>[]
          }
          create: {
            args: Prisma.FulfillmentOutboxCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FulfillmentOutboxPayload>
          }
          createMany: {
            args: Prisma.FulfillmentOutboxCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FulfillmentOutboxCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FulfillmentOutboxPayload>[]
          }
          delete: {
            args: Prisma.FulfillmentOutboxDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FulfillmentOutboxPayload>
          }
          update: {
            args: Prisma.FulfillmentOutboxUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FulfillmentOutboxPayload>
          }
          deleteMany: {
            args: Prisma.FulfillmentOutboxDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FulfillmentOutboxUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.FulfillmentOutboxUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FulfillmentOutboxPayload>
          }
          aggregate: {
            args: Prisma.FulfillmentOutboxAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFulfillmentOutbox>
          }
          groupBy: {
            args: Prisma.FulfillmentOutboxGroupByArgs<ExtArgs>
            result: $Utils.Optional<FulfillmentOutboxGroupByOutputType>[]
          }
          count: {
            args: Prisma.FulfillmentOutboxCountArgs<ExtArgs>
            result: $Utils.Optional<FulfillmentOutboxCountAggregateOutputType> | number
          }
        }
      }
      ProcessedEvent: {
        payload: Prisma.$ProcessedEventPayload<ExtArgs>
        fields: Prisma.ProcessedEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProcessedEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessedEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProcessedEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessedEventPayload>
          }
          findFirst: {
            args: Prisma.ProcessedEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessedEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProcessedEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessedEventPayload>
          }
          findMany: {
            args: Prisma.ProcessedEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessedEventPayload>[]
          }
          create: {
            args: Prisma.ProcessedEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessedEventPayload>
          }
          createMany: {
            args: Prisma.ProcessedEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProcessedEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessedEventPayload>[]
          }
          delete: {
            args: Prisma.ProcessedEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessedEventPayload>
          }
          update: {
            args: Prisma.ProcessedEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessedEventPayload>
          }
          deleteMany: {
            args: Prisma.ProcessedEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProcessedEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProcessedEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessedEventPayload>
          }
          aggregate: {
            args: Prisma.ProcessedEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProcessedEvent>
          }
          groupBy: {
            args: Prisma.ProcessedEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProcessedEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProcessedEventCountArgs<ExtArgs>
            result: $Utils.Optional<ProcessedEventCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type WarehouseCountOutputType
   */

  export type WarehouseCountOutputType = {
    inventory_items: number
    shipments: number
    return_pickups: number
  }

  export type WarehouseCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    inventory_items?: boolean | WarehouseCountOutputTypeCountInventory_itemsArgs
    shipments?: boolean | WarehouseCountOutputTypeCountShipmentsArgs
    return_pickups?: boolean | WarehouseCountOutputTypeCountReturn_pickupsArgs
  }

  // Custom InputTypes
  /**
   * WarehouseCountOutputType without action
   */
  export type WarehouseCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WarehouseCountOutputType
     */
    select?: WarehouseCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * WarehouseCountOutputType without action
   */
  export type WarehouseCountOutputTypeCountInventory_itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InventoryItemWhereInput
  }

  /**
   * WarehouseCountOutputType without action
   */
  export type WarehouseCountOutputTypeCountShipmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShipmentWhereInput
  }

  /**
   * WarehouseCountOutputType without action
   */
  export type WarehouseCountOutputTypeCountReturn_pickupsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReturnPickupWhereInput
  }


  /**
   * Count Type InventoryItemCountOutputType
   */

  export type InventoryItemCountOutputType = {
    reservation_items: number
  }

  export type InventoryItemCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reservation_items?: boolean | InventoryItemCountOutputTypeCountReservation_itemsArgs
  }

  // Custom InputTypes
  /**
   * InventoryItemCountOutputType without action
   */
  export type InventoryItemCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItemCountOutputType
     */
    select?: InventoryItemCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * InventoryItemCountOutputType without action
   */
  export type InventoryItemCountOutputTypeCountReservation_itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReservationItemWhereInput
  }


  /**
   * Count Type InventoryReservationCountOutputType
   */

  export type InventoryReservationCountOutputType = {
    items: number
  }

  export type InventoryReservationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | InventoryReservationCountOutputTypeCountItemsArgs
  }

  // Custom InputTypes
  /**
   * InventoryReservationCountOutputType without action
   */
  export type InventoryReservationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryReservationCountOutputType
     */
    select?: InventoryReservationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * InventoryReservationCountOutputType without action
   */
  export type InventoryReservationCountOutputTypeCountItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReservationItemWhereInput
  }


  /**
   * Count Type ShipmentCountOutputType
   */

  export type ShipmentCountOutputType = {
    items: number
    tracking_updates: number
  }

  export type ShipmentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | ShipmentCountOutputTypeCountItemsArgs
    tracking_updates?: boolean | ShipmentCountOutputTypeCountTracking_updatesArgs
  }

  // Custom InputTypes
  /**
   * ShipmentCountOutputType without action
   */
  export type ShipmentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentCountOutputType
     */
    select?: ShipmentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ShipmentCountOutputType without action
   */
  export type ShipmentCountOutputTypeCountItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShipmentItemWhereInput
  }

  /**
   * ShipmentCountOutputType without action
   */
  export type ShipmentCountOutputTypeCountTracking_updatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TrackingUpdateWhereInput
  }


  /**
   * Count Type ReturnPickupCountOutputType
   */

  export type ReturnPickupCountOutputType = {
    items: number
    tracking_updates: number
  }

  export type ReturnPickupCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | ReturnPickupCountOutputTypeCountItemsArgs
    tracking_updates?: boolean | ReturnPickupCountOutputTypeCountTracking_updatesArgs
  }

  // Custom InputTypes
  /**
   * ReturnPickupCountOutputType without action
   */
  export type ReturnPickupCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnPickupCountOutputType
     */
    select?: ReturnPickupCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ReturnPickupCountOutputType without action
   */
  export type ReturnPickupCountOutputTypeCountItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReturnItemWhereInput
  }

  /**
   * ReturnPickupCountOutputType without action
   */
  export type ReturnPickupCountOutputTypeCountTracking_updatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReturnTrackingUpdateWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Warehouse
   */

  export type AggregateWarehouse = {
    _count: WarehouseCountAggregateOutputType | null
    _min: WarehouseMinAggregateOutputType | null
    _max: WarehouseMaxAggregateOutputType | null
  }

  export type WarehouseMinAggregateOutputType = {
    id: string | null
    code: string | null
    name: string | null
    address_line1: string | null
    address_line2: string | null
    city: string | null
    state: string | null
    postal_code: string | null
    country: string | null
    is_active: boolean | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type WarehouseMaxAggregateOutputType = {
    id: string | null
    code: string | null
    name: string | null
    address_line1: string | null
    address_line2: string | null
    city: string | null
    state: string | null
    postal_code: string | null
    country: string | null
    is_active: boolean | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type WarehouseCountAggregateOutputType = {
    id: number
    code: number
    name: number
    address_line1: number
    address_line2: number
    city: number
    state: number
    postal_code: number
    country: number
    is_active: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type WarehouseMinAggregateInputType = {
    id?: true
    code?: true
    name?: true
    address_line1?: true
    address_line2?: true
    city?: true
    state?: true
    postal_code?: true
    country?: true
    is_active?: true
    created_at?: true
    updated_at?: true
  }

  export type WarehouseMaxAggregateInputType = {
    id?: true
    code?: true
    name?: true
    address_line1?: true
    address_line2?: true
    city?: true
    state?: true
    postal_code?: true
    country?: true
    is_active?: true
    created_at?: true
    updated_at?: true
  }

  export type WarehouseCountAggregateInputType = {
    id?: true
    code?: true
    name?: true
    address_line1?: true
    address_line2?: true
    city?: true
    state?: true
    postal_code?: true
    country?: true
    is_active?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type WarehouseAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Warehouse to aggregate.
     */
    where?: WarehouseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Warehouses to fetch.
     */
    orderBy?: WarehouseOrderByWithRelationInput | WarehouseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WarehouseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Warehouses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Warehouses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Warehouses
    **/
    _count?: true | WarehouseCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WarehouseMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WarehouseMaxAggregateInputType
  }

  export type GetWarehouseAggregateType<T extends WarehouseAggregateArgs> = {
        [P in keyof T & keyof AggregateWarehouse]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWarehouse[P]>
      : GetScalarType<T[P], AggregateWarehouse[P]>
  }




  export type WarehouseGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WarehouseWhereInput
    orderBy?: WarehouseOrderByWithAggregationInput | WarehouseOrderByWithAggregationInput[]
    by: WarehouseScalarFieldEnum[] | WarehouseScalarFieldEnum
    having?: WarehouseScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WarehouseCountAggregateInputType | true
    _min?: WarehouseMinAggregateInputType
    _max?: WarehouseMaxAggregateInputType
  }

  export type WarehouseGroupByOutputType = {
    id: string
    code: string
    name: string
    address_line1: string
    address_line2: string | null
    city: string
    state: string
    postal_code: string
    country: string
    is_active: boolean
    created_at: Date
    updated_at: Date
    _count: WarehouseCountAggregateOutputType | null
    _min: WarehouseMinAggregateOutputType | null
    _max: WarehouseMaxAggregateOutputType | null
  }

  type GetWarehouseGroupByPayload<T extends WarehouseGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WarehouseGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WarehouseGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WarehouseGroupByOutputType[P]>
            : GetScalarType<T[P], WarehouseGroupByOutputType[P]>
        }
      >
    >


  export type WarehouseSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    address_line1?: boolean
    address_line2?: boolean
    city?: boolean
    state?: boolean
    postal_code?: boolean
    country?: boolean
    is_active?: boolean
    created_at?: boolean
    updated_at?: boolean
    inventory_items?: boolean | Warehouse$inventory_itemsArgs<ExtArgs>
    shipments?: boolean | Warehouse$shipmentsArgs<ExtArgs>
    return_pickups?: boolean | Warehouse$return_pickupsArgs<ExtArgs>
    _count?: boolean | WarehouseCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["warehouse"]>

  export type WarehouseSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    address_line1?: boolean
    address_line2?: boolean
    city?: boolean
    state?: boolean
    postal_code?: boolean
    country?: boolean
    is_active?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["warehouse"]>

  export type WarehouseSelectScalar = {
    id?: boolean
    code?: boolean
    name?: boolean
    address_line1?: boolean
    address_line2?: boolean
    city?: boolean
    state?: boolean
    postal_code?: boolean
    country?: boolean
    is_active?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type WarehouseInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    inventory_items?: boolean | Warehouse$inventory_itemsArgs<ExtArgs>
    shipments?: boolean | Warehouse$shipmentsArgs<ExtArgs>
    return_pickups?: boolean | Warehouse$return_pickupsArgs<ExtArgs>
    _count?: boolean | WarehouseCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type WarehouseIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $WarehousePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Warehouse"
    objects: {
      inventory_items: Prisma.$InventoryItemPayload<ExtArgs>[]
      shipments: Prisma.$ShipmentPayload<ExtArgs>[]
      return_pickups: Prisma.$ReturnPickupPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      code: string
      name: string
      address_line1: string
      address_line2: string | null
      city: string
      state: string
      postal_code: string
      country: string
      is_active: boolean
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["warehouse"]>
    composites: {}
  }

  type WarehouseGetPayload<S extends boolean | null | undefined | WarehouseDefaultArgs> = $Result.GetResult<Prisma.$WarehousePayload, S>

  type WarehouseCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<WarehouseFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: WarehouseCountAggregateInputType | true
    }

  export interface WarehouseDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Warehouse'], meta: { name: 'Warehouse' } }
    /**
     * Find zero or one Warehouse that matches the filter.
     * @param {WarehouseFindUniqueArgs} args - Arguments to find a Warehouse
     * @example
     * // Get one Warehouse
     * const warehouse = await prisma.warehouse.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WarehouseFindUniqueArgs>(args: SelectSubset<T, WarehouseFindUniqueArgs<ExtArgs>>): Prisma__WarehouseClient<$Result.GetResult<Prisma.$WarehousePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Warehouse that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {WarehouseFindUniqueOrThrowArgs} args - Arguments to find a Warehouse
     * @example
     * // Get one Warehouse
     * const warehouse = await prisma.warehouse.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WarehouseFindUniqueOrThrowArgs>(args: SelectSubset<T, WarehouseFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WarehouseClient<$Result.GetResult<Prisma.$WarehousePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Warehouse that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WarehouseFindFirstArgs} args - Arguments to find a Warehouse
     * @example
     * // Get one Warehouse
     * const warehouse = await prisma.warehouse.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WarehouseFindFirstArgs>(args?: SelectSubset<T, WarehouseFindFirstArgs<ExtArgs>>): Prisma__WarehouseClient<$Result.GetResult<Prisma.$WarehousePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Warehouse that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WarehouseFindFirstOrThrowArgs} args - Arguments to find a Warehouse
     * @example
     * // Get one Warehouse
     * const warehouse = await prisma.warehouse.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WarehouseFindFirstOrThrowArgs>(args?: SelectSubset<T, WarehouseFindFirstOrThrowArgs<ExtArgs>>): Prisma__WarehouseClient<$Result.GetResult<Prisma.$WarehousePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Warehouses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WarehouseFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Warehouses
     * const warehouses = await prisma.warehouse.findMany()
     * 
     * // Get first 10 Warehouses
     * const warehouses = await prisma.warehouse.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const warehouseWithIdOnly = await prisma.warehouse.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WarehouseFindManyArgs>(args?: SelectSubset<T, WarehouseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WarehousePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Warehouse.
     * @param {WarehouseCreateArgs} args - Arguments to create a Warehouse.
     * @example
     * // Create one Warehouse
     * const Warehouse = await prisma.warehouse.create({
     *   data: {
     *     // ... data to create a Warehouse
     *   }
     * })
     * 
     */
    create<T extends WarehouseCreateArgs>(args: SelectSubset<T, WarehouseCreateArgs<ExtArgs>>): Prisma__WarehouseClient<$Result.GetResult<Prisma.$WarehousePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Warehouses.
     * @param {WarehouseCreateManyArgs} args - Arguments to create many Warehouses.
     * @example
     * // Create many Warehouses
     * const warehouse = await prisma.warehouse.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WarehouseCreateManyArgs>(args?: SelectSubset<T, WarehouseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Warehouses and returns the data saved in the database.
     * @param {WarehouseCreateManyAndReturnArgs} args - Arguments to create many Warehouses.
     * @example
     * // Create many Warehouses
     * const warehouse = await prisma.warehouse.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Warehouses and only return the `id`
     * const warehouseWithIdOnly = await prisma.warehouse.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WarehouseCreateManyAndReturnArgs>(args?: SelectSubset<T, WarehouseCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WarehousePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Warehouse.
     * @param {WarehouseDeleteArgs} args - Arguments to delete one Warehouse.
     * @example
     * // Delete one Warehouse
     * const Warehouse = await prisma.warehouse.delete({
     *   where: {
     *     // ... filter to delete one Warehouse
     *   }
     * })
     * 
     */
    delete<T extends WarehouseDeleteArgs>(args: SelectSubset<T, WarehouseDeleteArgs<ExtArgs>>): Prisma__WarehouseClient<$Result.GetResult<Prisma.$WarehousePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Warehouse.
     * @param {WarehouseUpdateArgs} args - Arguments to update one Warehouse.
     * @example
     * // Update one Warehouse
     * const warehouse = await prisma.warehouse.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WarehouseUpdateArgs>(args: SelectSubset<T, WarehouseUpdateArgs<ExtArgs>>): Prisma__WarehouseClient<$Result.GetResult<Prisma.$WarehousePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Warehouses.
     * @param {WarehouseDeleteManyArgs} args - Arguments to filter Warehouses to delete.
     * @example
     * // Delete a few Warehouses
     * const { count } = await prisma.warehouse.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WarehouseDeleteManyArgs>(args?: SelectSubset<T, WarehouseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Warehouses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WarehouseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Warehouses
     * const warehouse = await prisma.warehouse.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WarehouseUpdateManyArgs>(args: SelectSubset<T, WarehouseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Warehouse.
     * @param {WarehouseUpsertArgs} args - Arguments to update or create a Warehouse.
     * @example
     * // Update or create a Warehouse
     * const warehouse = await prisma.warehouse.upsert({
     *   create: {
     *     // ... data to create a Warehouse
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Warehouse we want to update
     *   }
     * })
     */
    upsert<T extends WarehouseUpsertArgs>(args: SelectSubset<T, WarehouseUpsertArgs<ExtArgs>>): Prisma__WarehouseClient<$Result.GetResult<Prisma.$WarehousePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Warehouses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WarehouseCountArgs} args - Arguments to filter Warehouses to count.
     * @example
     * // Count the number of Warehouses
     * const count = await prisma.warehouse.count({
     *   where: {
     *     // ... the filter for the Warehouses we want to count
     *   }
     * })
    **/
    count<T extends WarehouseCountArgs>(
      args?: Subset<T, WarehouseCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WarehouseCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Warehouse.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WarehouseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WarehouseAggregateArgs>(args: Subset<T, WarehouseAggregateArgs>): Prisma.PrismaPromise<GetWarehouseAggregateType<T>>

    /**
     * Group by Warehouse.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WarehouseGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WarehouseGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WarehouseGroupByArgs['orderBy'] }
        : { orderBy?: WarehouseGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WarehouseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWarehouseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Warehouse model
   */
  readonly fields: WarehouseFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Warehouse.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WarehouseClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    inventory_items<T extends Warehouse$inventory_itemsArgs<ExtArgs> = {}>(args?: Subset<T, Warehouse$inventory_itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "findMany"> | Null>
    shipments<T extends Warehouse$shipmentsArgs<ExtArgs> = {}>(args?: Subset<T, Warehouse$shipmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShipmentPayload<ExtArgs>, T, "findMany"> | Null>
    return_pickups<T extends Warehouse$return_pickupsArgs<ExtArgs> = {}>(args?: Subset<T, Warehouse$return_pickupsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReturnPickupPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Warehouse model
   */ 
  interface WarehouseFieldRefs {
    readonly id: FieldRef<"Warehouse", 'String'>
    readonly code: FieldRef<"Warehouse", 'String'>
    readonly name: FieldRef<"Warehouse", 'String'>
    readonly address_line1: FieldRef<"Warehouse", 'String'>
    readonly address_line2: FieldRef<"Warehouse", 'String'>
    readonly city: FieldRef<"Warehouse", 'String'>
    readonly state: FieldRef<"Warehouse", 'String'>
    readonly postal_code: FieldRef<"Warehouse", 'String'>
    readonly country: FieldRef<"Warehouse", 'String'>
    readonly is_active: FieldRef<"Warehouse", 'Boolean'>
    readonly created_at: FieldRef<"Warehouse", 'DateTime'>
    readonly updated_at: FieldRef<"Warehouse", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Warehouse findUnique
   */
  export type WarehouseFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warehouse
     */
    select?: WarehouseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WarehouseInclude<ExtArgs> | null
    /**
     * Filter, which Warehouse to fetch.
     */
    where: WarehouseWhereUniqueInput
  }

  /**
   * Warehouse findUniqueOrThrow
   */
  export type WarehouseFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warehouse
     */
    select?: WarehouseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WarehouseInclude<ExtArgs> | null
    /**
     * Filter, which Warehouse to fetch.
     */
    where: WarehouseWhereUniqueInput
  }

  /**
   * Warehouse findFirst
   */
  export type WarehouseFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warehouse
     */
    select?: WarehouseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WarehouseInclude<ExtArgs> | null
    /**
     * Filter, which Warehouse to fetch.
     */
    where?: WarehouseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Warehouses to fetch.
     */
    orderBy?: WarehouseOrderByWithRelationInput | WarehouseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Warehouses.
     */
    cursor?: WarehouseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Warehouses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Warehouses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Warehouses.
     */
    distinct?: WarehouseScalarFieldEnum | WarehouseScalarFieldEnum[]
  }

  /**
   * Warehouse findFirstOrThrow
   */
  export type WarehouseFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warehouse
     */
    select?: WarehouseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WarehouseInclude<ExtArgs> | null
    /**
     * Filter, which Warehouse to fetch.
     */
    where?: WarehouseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Warehouses to fetch.
     */
    orderBy?: WarehouseOrderByWithRelationInput | WarehouseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Warehouses.
     */
    cursor?: WarehouseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Warehouses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Warehouses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Warehouses.
     */
    distinct?: WarehouseScalarFieldEnum | WarehouseScalarFieldEnum[]
  }

  /**
   * Warehouse findMany
   */
  export type WarehouseFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warehouse
     */
    select?: WarehouseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WarehouseInclude<ExtArgs> | null
    /**
     * Filter, which Warehouses to fetch.
     */
    where?: WarehouseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Warehouses to fetch.
     */
    orderBy?: WarehouseOrderByWithRelationInput | WarehouseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Warehouses.
     */
    cursor?: WarehouseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Warehouses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Warehouses.
     */
    skip?: number
    distinct?: WarehouseScalarFieldEnum | WarehouseScalarFieldEnum[]
  }

  /**
   * Warehouse create
   */
  export type WarehouseCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warehouse
     */
    select?: WarehouseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WarehouseInclude<ExtArgs> | null
    /**
     * The data needed to create a Warehouse.
     */
    data: XOR<WarehouseCreateInput, WarehouseUncheckedCreateInput>
  }

  /**
   * Warehouse createMany
   */
  export type WarehouseCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Warehouses.
     */
    data: WarehouseCreateManyInput | WarehouseCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Warehouse createManyAndReturn
   */
  export type WarehouseCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warehouse
     */
    select?: WarehouseSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Warehouses.
     */
    data: WarehouseCreateManyInput | WarehouseCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Warehouse update
   */
  export type WarehouseUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warehouse
     */
    select?: WarehouseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WarehouseInclude<ExtArgs> | null
    /**
     * The data needed to update a Warehouse.
     */
    data: XOR<WarehouseUpdateInput, WarehouseUncheckedUpdateInput>
    /**
     * Choose, which Warehouse to update.
     */
    where: WarehouseWhereUniqueInput
  }

  /**
   * Warehouse updateMany
   */
  export type WarehouseUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Warehouses.
     */
    data: XOR<WarehouseUpdateManyMutationInput, WarehouseUncheckedUpdateManyInput>
    /**
     * Filter which Warehouses to update
     */
    where?: WarehouseWhereInput
  }

  /**
   * Warehouse upsert
   */
  export type WarehouseUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warehouse
     */
    select?: WarehouseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WarehouseInclude<ExtArgs> | null
    /**
     * The filter to search for the Warehouse to update in case it exists.
     */
    where: WarehouseWhereUniqueInput
    /**
     * In case the Warehouse found by the `where` argument doesn't exist, create a new Warehouse with this data.
     */
    create: XOR<WarehouseCreateInput, WarehouseUncheckedCreateInput>
    /**
     * In case the Warehouse was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WarehouseUpdateInput, WarehouseUncheckedUpdateInput>
  }

  /**
   * Warehouse delete
   */
  export type WarehouseDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warehouse
     */
    select?: WarehouseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WarehouseInclude<ExtArgs> | null
    /**
     * Filter which Warehouse to delete.
     */
    where: WarehouseWhereUniqueInput
  }

  /**
   * Warehouse deleteMany
   */
  export type WarehouseDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Warehouses to delete
     */
    where?: WarehouseWhereInput
  }

  /**
   * Warehouse.inventory_items
   */
  export type Warehouse$inventory_itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItem
     */
    select?: InventoryItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryItemInclude<ExtArgs> | null
    where?: InventoryItemWhereInput
    orderBy?: InventoryItemOrderByWithRelationInput | InventoryItemOrderByWithRelationInput[]
    cursor?: InventoryItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InventoryItemScalarFieldEnum | InventoryItemScalarFieldEnum[]
  }

  /**
   * Warehouse.shipments
   */
  export type Warehouse$shipmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipment
     */
    select?: ShipmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentInclude<ExtArgs> | null
    where?: ShipmentWhereInput
    orderBy?: ShipmentOrderByWithRelationInput | ShipmentOrderByWithRelationInput[]
    cursor?: ShipmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ShipmentScalarFieldEnum | ShipmentScalarFieldEnum[]
  }

  /**
   * Warehouse.return_pickups
   */
  export type Warehouse$return_pickupsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnPickup
     */
    select?: ReturnPickupSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnPickupInclude<ExtArgs> | null
    where?: ReturnPickupWhereInput
    orderBy?: ReturnPickupOrderByWithRelationInput | ReturnPickupOrderByWithRelationInput[]
    cursor?: ReturnPickupWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReturnPickupScalarFieldEnum | ReturnPickupScalarFieldEnum[]
  }

  /**
   * Warehouse without action
   */
  export type WarehouseDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warehouse
     */
    select?: WarehouseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WarehouseInclude<ExtArgs> | null
  }


  /**
   * Model InventoryItem
   */

  export type AggregateInventoryItem = {
    _count: InventoryItemCountAggregateOutputType | null
    _avg: InventoryItemAvgAggregateOutputType | null
    _sum: InventoryItemSumAggregateOutputType | null
    _min: InventoryItemMinAggregateOutputType | null
    _max: InventoryItemMaxAggregateOutputType | null
  }

  export type InventoryItemAvgAggregateOutputType = {
    quantity_on_hand: number | null
    quantity_reserved: number | null
    quantity_allocated: number | null
    safety_stock: number | null
    reorder_threshold: number | null
    version: number | null
  }

  export type InventoryItemSumAggregateOutputType = {
    quantity_on_hand: number | null
    quantity_reserved: number | null
    quantity_allocated: number | null
    safety_stock: number | null
    reorder_threshold: number | null
    version: number | null
  }

  export type InventoryItemMinAggregateOutputType = {
    id: string | null
    product_id: string | null
    sku: string | null
    seller_id: string | null
    warehouse_id: string | null
    quantity_on_hand: number | null
    quantity_reserved: number | null
    quantity_allocated: number | null
    safety_stock: number | null
    reorder_threshold: number | null
    version: number | null
    is_active: boolean | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type InventoryItemMaxAggregateOutputType = {
    id: string | null
    product_id: string | null
    sku: string | null
    seller_id: string | null
    warehouse_id: string | null
    quantity_on_hand: number | null
    quantity_reserved: number | null
    quantity_allocated: number | null
    safety_stock: number | null
    reorder_threshold: number | null
    version: number | null
    is_active: boolean | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type InventoryItemCountAggregateOutputType = {
    id: number
    product_id: number
    sku: number
    seller_id: number
    warehouse_id: number
    quantity_on_hand: number
    quantity_reserved: number
    quantity_allocated: number
    safety_stock: number
    reorder_threshold: number
    version: number
    is_active: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type InventoryItemAvgAggregateInputType = {
    quantity_on_hand?: true
    quantity_reserved?: true
    quantity_allocated?: true
    safety_stock?: true
    reorder_threshold?: true
    version?: true
  }

  export type InventoryItemSumAggregateInputType = {
    quantity_on_hand?: true
    quantity_reserved?: true
    quantity_allocated?: true
    safety_stock?: true
    reorder_threshold?: true
    version?: true
  }

  export type InventoryItemMinAggregateInputType = {
    id?: true
    product_id?: true
    sku?: true
    seller_id?: true
    warehouse_id?: true
    quantity_on_hand?: true
    quantity_reserved?: true
    quantity_allocated?: true
    safety_stock?: true
    reorder_threshold?: true
    version?: true
    is_active?: true
    created_at?: true
    updated_at?: true
  }

  export type InventoryItemMaxAggregateInputType = {
    id?: true
    product_id?: true
    sku?: true
    seller_id?: true
    warehouse_id?: true
    quantity_on_hand?: true
    quantity_reserved?: true
    quantity_allocated?: true
    safety_stock?: true
    reorder_threshold?: true
    version?: true
    is_active?: true
    created_at?: true
    updated_at?: true
  }

  export type InventoryItemCountAggregateInputType = {
    id?: true
    product_id?: true
    sku?: true
    seller_id?: true
    warehouse_id?: true
    quantity_on_hand?: true
    quantity_reserved?: true
    quantity_allocated?: true
    safety_stock?: true
    reorder_threshold?: true
    version?: true
    is_active?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type InventoryItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InventoryItem to aggregate.
     */
    where?: InventoryItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryItems to fetch.
     */
    orderBy?: InventoryItemOrderByWithRelationInput | InventoryItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InventoryItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InventoryItems
    **/
    _count?: true | InventoryItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InventoryItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InventoryItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InventoryItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InventoryItemMaxAggregateInputType
  }

  export type GetInventoryItemAggregateType<T extends InventoryItemAggregateArgs> = {
        [P in keyof T & keyof AggregateInventoryItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInventoryItem[P]>
      : GetScalarType<T[P], AggregateInventoryItem[P]>
  }




  export type InventoryItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InventoryItemWhereInput
    orderBy?: InventoryItemOrderByWithAggregationInput | InventoryItemOrderByWithAggregationInput[]
    by: InventoryItemScalarFieldEnum[] | InventoryItemScalarFieldEnum
    having?: InventoryItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InventoryItemCountAggregateInputType | true
    _avg?: InventoryItemAvgAggregateInputType
    _sum?: InventoryItemSumAggregateInputType
    _min?: InventoryItemMinAggregateInputType
    _max?: InventoryItemMaxAggregateInputType
  }

  export type InventoryItemGroupByOutputType = {
    id: string
    product_id: string
    sku: string
    seller_id: string | null
    warehouse_id: string
    quantity_on_hand: number
    quantity_reserved: number
    quantity_allocated: number
    safety_stock: number
    reorder_threshold: number
    version: number
    is_active: boolean
    created_at: Date
    updated_at: Date
    _count: InventoryItemCountAggregateOutputType | null
    _avg: InventoryItemAvgAggregateOutputType | null
    _sum: InventoryItemSumAggregateOutputType | null
    _min: InventoryItemMinAggregateOutputType | null
    _max: InventoryItemMaxAggregateOutputType | null
  }

  type GetInventoryItemGroupByPayload<T extends InventoryItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InventoryItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InventoryItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InventoryItemGroupByOutputType[P]>
            : GetScalarType<T[P], InventoryItemGroupByOutputType[P]>
        }
      >
    >


  export type InventoryItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    product_id?: boolean
    sku?: boolean
    seller_id?: boolean
    warehouse_id?: boolean
    quantity_on_hand?: boolean
    quantity_reserved?: boolean
    quantity_allocated?: boolean
    safety_stock?: boolean
    reorder_threshold?: boolean
    version?: boolean
    is_active?: boolean
    created_at?: boolean
    updated_at?: boolean
    warehouse?: boolean | WarehouseDefaultArgs<ExtArgs>
    reservation_items?: boolean | InventoryItem$reservation_itemsArgs<ExtArgs>
    _count?: boolean | InventoryItemCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inventoryItem"]>

  export type InventoryItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    product_id?: boolean
    sku?: boolean
    seller_id?: boolean
    warehouse_id?: boolean
    quantity_on_hand?: boolean
    quantity_reserved?: boolean
    quantity_allocated?: boolean
    safety_stock?: boolean
    reorder_threshold?: boolean
    version?: boolean
    is_active?: boolean
    created_at?: boolean
    updated_at?: boolean
    warehouse?: boolean | WarehouseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inventoryItem"]>

  export type InventoryItemSelectScalar = {
    id?: boolean
    product_id?: boolean
    sku?: boolean
    seller_id?: boolean
    warehouse_id?: boolean
    quantity_on_hand?: boolean
    quantity_reserved?: boolean
    quantity_allocated?: boolean
    safety_stock?: boolean
    reorder_threshold?: boolean
    version?: boolean
    is_active?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type InventoryItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    warehouse?: boolean | WarehouseDefaultArgs<ExtArgs>
    reservation_items?: boolean | InventoryItem$reservation_itemsArgs<ExtArgs>
    _count?: boolean | InventoryItemCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type InventoryItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    warehouse?: boolean | WarehouseDefaultArgs<ExtArgs>
  }

  export type $InventoryItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InventoryItem"
    objects: {
      warehouse: Prisma.$WarehousePayload<ExtArgs>
      reservation_items: Prisma.$ReservationItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      product_id: string
      sku: string
      seller_id: string | null
      warehouse_id: string
      quantity_on_hand: number
      quantity_reserved: number
      quantity_allocated: number
      safety_stock: number
      reorder_threshold: number
      version: number
      is_active: boolean
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["inventoryItem"]>
    composites: {}
  }

  type InventoryItemGetPayload<S extends boolean | null | undefined | InventoryItemDefaultArgs> = $Result.GetResult<Prisma.$InventoryItemPayload, S>

  type InventoryItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<InventoryItemFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: InventoryItemCountAggregateInputType | true
    }

  export interface InventoryItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InventoryItem'], meta: { name: 'InventoryItem' } }
    /**
     * Find zero or one InventoryItem that matches the filter.
     * @param {InventoryItemFindUniqueArgs} args - Arguments to find a InventoryItem
     * @example
     * // Get one InventoryItem
     * const inventoryItem = await prisma.inventoryItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InventoryItemFindUniqueArgs>(args: SelectSubset<T, InventoryItemFindUniqueArgs<ExtArgs>>): Prisma__InventoryItemClient<$Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one InventoryItem that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {InventoryItemFindUniqueOrThrowArgs} args - Arguments to find a InventoryItem
     * @example
     * // Get one InventoryItem
     * const inventoryItem = await prisma.inventoryItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InventoryItemFindUniqueOrThrowArgs>(args: SelectSubset<T, InventoryItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InventoryItemClient<$Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first InventoryItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryItemFindFirstArgs} args - Arguments to find a InventoryItem
     * @example
     * // Get one InventoryItem
     * const inventoryItem = await prisma.inventoryItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InventoryItemFindFirstArgs>(args?: SelectSubset<T, InventoryItemFindFirstArgs<ExtArgs>>): Prisma__InventoryItemClient<$Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first InventoryItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryItemFindFirstOrThrowArgs} args - Arguments to find a InventoryItem
     * @example
     * // Get one InventoryItem
     * const inventoryItem = await prisma.inventoryItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InventoryItemFindFirstOrThrowArgs>(args?: SelectSubset<T, InventoryItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__InventoryItemClient<$Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more InventoryItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InventoryItems
     * const inventoryItems = await prisma.inventoryItem.findMany()
     * 
     * // Get first 10 InventoryItems
     * const inventoryItems = await prisma.inventoryItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const inventoryItemWithIdOnly = await prisma.inventoryItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InventoryItemFindManyArgs>(args?: SelectSubset<T, InventoryItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a InventoryItem.
     * @param {InventoryItemCreateArgs} args - Arguments to create a InventoryItem.
     * @example
     * // Create one InventoryItem
     * const InventoryItem = await prisma.inventoryItem.create({
     *   data: {
     *     // ... data to create a InventoryItem
     *   }
     * })
     * 
     */
    create<T extends InventoryItemCreateArgs>(args: SelectSubset<T, InventoryItemCreateArgs<ExtArgs>>): Prisma__InventoryItemClient<$Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many InventoryItems.
     * @param {InventoryItemCreateManyArgs} args - Arguments to create many InventoryItems.
     * @example
     * // Create many InventoryItems
     * const inventoryItem = await prisma.inventoryItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InventoryItemCreateManyArgs>(args?: SelectSubset<T, InventoryItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many InventoryItems and returns the data saved in the database.
     * @param {InventoryItemCreateManyAndReturnArgs} args - Arguments to create many InventoryItems.
     * @example
     * // Create many InventoryItems
     * const inventoryItem = await prisma.inventoryItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many InventoryItems and only return the `id`
     * const inventoryItemWithIdOnly = await prisma.inventoryItem.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InventoryItemCreateManyAndReturnArgs>(args?: SelectSubset<T, InventoryItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a InventoryItem.
     * @param {InventoryItemDeleteArgs} args - Arguments to delete one InventoryItem.
     * @example
     * // Delete one InventoryItem
     * const InventoryItem = await prisma.inventoryItem.delete({
     *   where: {
     *     // ... filter to delete one InventoryItem
     *   }
     * })
     * 
     */
    delete<T extends InventoryItemDeleteArgs>(args: SelectSubset<T, InventoryItemDeleteArgs<ExtArgs>>): Prisma__InventoryItemClient<$Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one InventoryItem.
     * @param {InventoryItemUpdateArgs} args - Arguments to update one InventoryItem.
     * @example
     * // Update one InventoryItem
     * const inventoryItem = await prisma.inventoryItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InventoryItemUpdateArgs>(args: SelectSubset<T, InventoryItemUpdateArgs<ExtArgs>>): Prisma__InventoryItemClient<$Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more InventoryItems.
     * @param {InventoryItemDeleteManyArgs} args - Arguments to filter InventoryItems to delete.
     * @example
     * // Delete a few InventoryItems
     * const { count } = await prisma.inventoryItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InventoryItemDeleteManyArgs>(args?: SelectSubset<T, InventoryItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InventoryItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InventoryItems
     * const inventoryItem = await prisma.inventoryItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InventoryItemUpdateManyArgs>(args: SelectSubset<T, InventoryItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one InventoryItem.
     * @param {InventoryItemUpsertArgs} args - Arguments to update or create a InventoryItem.
     * @example
     * // Update or create a InventoryItem
     * const inventoryItem = await prisma.inventoryItem.upsert({
     *   create: {
     *     // ... data to create a InventoryItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InventoryItem we want to update
     *   }
     * })
     */
    upsert<T extends InventoryItemUpsertArgs>(args: SelectSubset<T, InventoryItemUpsertArgs<ExtArgs>>): Prisma__InventoryItemClient<$Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of InventoryItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryItemCountArgs} args - Arguments to filter InventoryItems to count.
     * @example
     * // Count the number of InventoryItems
     * const count = await prisma.inventoryItem.count({
     *   where: {
     *     // ... the filter for the InventoryItems we want to count
     *   }
     * })
    **/
    count<T extends InventoryItemCountArgs>(
      args?: Subset<T, InventoryItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InventoryItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InventoryItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InventoryItemAggregateArgs>(args: Subset<T, InventoryItemAggregateArgs>): Prisma.PrismaPromise<GetInventoryItemAggregateType<T>>

    /**
     * Group by InventoryItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InventoryItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InventoryItemGroupByArgs['orderBy'] }
        : { orderBy?: InventoryItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InventoryItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInventoryItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InventoryItem model
   */
  readonly fields: InventoryItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InventoryItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InventoryItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    warehouse<T extends WarehouseDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WarehouseDefaultArgs<ExtArgs>>): Prisma__WarehouseClient<$Result.GetResult<Prisma.$WarehousePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    reservation_items<T extends InventoryItem$reservation_itemsArgs<ExtArgs> = {}>(args?: Subset<T, InventoryItem$reservation_itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReservationItemPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the InventoryItem model
   */ 
  interface InventoryItemFieldRefs {
    readonly id: FieldRef<"InventoryItem", 'String'>
    readonly product_id: FieldRef<"InventoryItem", 'String'>
    readonly sku: FieldRef<"InventoryItem", 'String'>
    readonly seller_id: FieldRef<"InventoryItem", 'String'>
    readonly warehouse_id: FieldRef<"InventoryItem", 'String'>
    readonly quantity_on_hand: FieldRef<"InventoryItem", 'Int'>
    readonly quantity_reserved: FieldRef<"InventoryItem", 'Int'>
    readonly quantity_allocated: FieldRef<"InventoryItem", 'Int'>
    readonly safety_stock: FieldRef<"InventoryItem", 'Int'>
    readonly reorder_threshold: FieldRef<"InventoryItem", 'Int'>
    readonly version: FieldRef<"InventoryItem", 'Int'>
    readonly is_active: FieldRef<"InventoryItem", 'Boolean'>
    readonly created_at: FieldRef<"InventoryItem", 'DateTime'>
    readonly updated_at: FieldRef<"InventoryItem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * InventoryItem findUnique
   */
  export type InventoryItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItem
     */
    select?: InventoryItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryItemInclude<ExtArgs> | null
    /**
     * Filter, which InventoryItem to fetch.
     */
    where: InventoryItemWhereUniqueInput
  }

  /**
   * InventoryItem findUniqueOrThrow
   */
  export type InventoryItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItem
     */
    select?: InventoryItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryItemInclude<ExtArgs> | null
    /**
     * Filter, which InventoryItem to fetch.
     */
    where: InventoryItemWhereUniqueInput
  }

  /**
   * InventoryItem findFirst
   */
  export type InventoryItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItem
     */
    select?: InventoryItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryItemInclude<ExtArgs> | null
    /**
     * Filter, which InventoryItem to fetch.
     */
    where?: InventoryItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryItems to fetch.
     */
    orderBy?: InventoryItemOrderByWithRelationInput | InventoryItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InventoryItems.
     */
    cursor?: InventoryItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InventoryItems.
     */
    distinct?: InventoryItemScalarFieldEnum | InventoryItemScalarFieldEnum[]
  }

  /**
   * InventoryItem findFirstOrThrow
   */
  export type InventoryItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItem
     */
    select?: InventoryItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryItemInclude<ExtArgs> | null
    /**
     * Filter, which InventoryItem to fetch.
     */
    where?: InventoryItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryItems to fetch.
     */
    orderBy?: InventoryItemOrderByWithRelationInput | InventoryItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InventoryItems.
     */
    cursor?: InventoryItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InventoryItems.
     */
    distinct?: InventoryItemScalarFieldEnum | InventoryItemScalarFieldEnum[]
  }

  /**
   * InventoryItem findMany
   */
  export type InventoryItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItem
     */
    select?: InventoryItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryItemInclude<ExtArgs> | null
    /**
     * Filter, which InventoryItems to fetch.
     */
    where?: InventoryItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryItems to fetch.
     */
    orderBy?: InventoryItemOrderByWithRelationInput | InventoryItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InventoryItems.
     */
    cursor?: InventoryItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryItems.
     */
    skip?: number
    distinct?: InventoryItemScalarFieldEnum | InventoryItemScalarFieldEnum[]
  }

  /**
   * InventoryItem create
   */
  export type InventoryItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItem
     */
    select?: InventoryItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryItemInclude<ExtArgs> | null
    /**
     * The data needed to create a InventoryItem.
     */
    data: XOR<InventoryItemCreateInput, InventoryItemUncheckedCreateInput>
  }

  /**
   * InventoryItem createMany
   */
  export type InventoryItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InventoryItems.
     */
    data: InventoryItemCreateManyInput | InventoryItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InventoryItem createManyAndReturn
   */
  export type InventoryItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItem
     */
    select?: InventoryItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many InventoryItems.
     */
    data: InventoryItemCreateManyInput | InventoryItemCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * InventoryItem update
   */
  export type InventoryItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItem
     */
    select?: InventoryItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryItemInclude<ExtArgs> | null
    /**
     * The data needed to update a InventoryItem.
     */
    data: XOR<InventoryItemUpdateInput, InventoryItemUncheckedUpdateInput>
    /**
     * Choose, which InventoryItem to update.
     */
    where: InventoryItemWhereUniqueInput
  }

  /**
   * InventoryItem updateMany
   */
  export type InventoryItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InventoryItems.
     */
    data: XOR<InventoryItemUpdateManyMutationInput, InventoryItemUncheckedUpdateManyInput>
    /**
     * Filter which InventoryItems to update
     */
    where?: InventoryItemWhereInput
  }

  /**
   * InventoryItem upsert
   */
  export type InventoryItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItem
     */
    select?: InventoryItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryItemInclude<ExtArgs> | null
    /**
     * The filter to search for the InventoryItem to update in case it exists.
     */
    where: InventoryItemWhereUniqueInput
    /**
     * In case the InventoryItem found by the `where` argument doesn't exist, create a new InventoryItem with this data.
     */
    create: XOR<InventoryItemCreateInput, InventoryItemUncheckedCreateInput>
    /**
     * In case the InventoryItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InventoryItemUpdateInput, InventoryItemUncheckedUpdateInput>
  }

  /**
   * InventoryItem delete
   */
  export type InventoryItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItem
     */
    select?: InventoryItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryItemInclude<ExtArgs> | null
    /**
     * Filter which InventoryItem to delete.
     */
    where: InventoryItemWhereUniqueInput
  }

  /**
   * InventoryItem deleteMany
   */
  export type InventoryItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InventoryItems to delete
     */
    where?: InventoryItemWhereInput
  }

  /**
   * InventoryItem.reservation_items
   */
  export type InventoryItem$reservation_itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReservationItem
     */
    select?: ReservationItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationItemInclude<ExtArgs> | null
    where?: ReservationItemWhereInput
    orderBy?: ReservationItemOrderByWithRelationInput | ReservationItemOrderByWithRelationInput[]
    cursor?: ReservationItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReservationItemScalarFieldEnum | ReservationItemScalarFieldEnum[]
  }

  /**
   * InventoryItem without action
   */
  export type InventoryItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItem
     */
    select?: InventoryItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryItemInclude<ExtArgs> | null
  }


  /**
   * Model InventoryReservation
   */

  export type AggregateInventoryReservation = {
    _count: InventoryReservationCountAggregateOutputType | null
    _min: InventoryReservationMinAggregateOutputType | null
    _max: InventoryReservationMaxAggregateOutputType | null
  }

  export type InventoryReservationMinAggregateOutputType = {
    id: string | null
    reservation_key: string | null
    user_id: string | null
    order_id: string | null
    status: $Enums.ReservationStatus | null
    expires_at: Date | null
    committed_at: Date | null
    released_at: Date | null
    expired_at: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type InventoryReservationMaxAggregateOutputType = {
    id: string | null
    reservation_key: string | null
    user_id: string | null
    order_id: string | null
    status: $Enums.ReservationStatus | null
    expires_at: Date | null
    committed_at: Date | null
    released_at: Date | null
    expired_at: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type InventoryReservationCountAggregateOutputType = {
    id: number
    reservation_key: number
    user_id: number
    order_id: number
    status: number
    expires_at: number
    committed_at: number
    released_at: number
    expired_at: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type InventoryReservationMinAggregateInputType = {
    id?: true
    reservation_key?: true
    user_id?: true
    order_id?: true
    status?: true
    expires_at?: true
    committed_at?: true
    released_at?: true
    expired_at?: true
    created_at?: true
    updated_at?: true
  }

  export type InventoryReservationMaxAggregateInputType = {
    id?: true
    reservation_key?: true
    user_id?: true
    order_id?: true
    status?: true
    expires_at?: true
    committed_at?: true
    released_at?: true
    expired_at?: true
    created_at?: true
    updated_at?: true
  }

  export type InventoryReservationCountAggregateInputType = {
    id?: true
    reservation_key?: true
    user_id?: true
    order_id?: true
    status?: true
    expires_at?: true
    committed_at?: true
    released_at?: true
    expired_at?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type InventoryReservationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InventoryReservation to aggregate.
     */
    where?: InventoryReservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryReservations to fetch.
     */
    orderBy?: InventoryReservationOrderByWithRelationInput | InventoryReservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InventoryReservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryReservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryReservations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InventoryReservations
    **/
    _count?: true | InventoryReservationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InventoryReservationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InventoryReservationMaxAggregateInputType
  }

  export type GetInventoryReservationAggregateType<T extends InventoryReservationAggregateArgs> = {
        [P in keyof T & keyof AggregateInventoryReservation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInventoryReservation[P]>
      : GetScalarType<T[P], AggregateInventoryReservation[P]>
  }




  export type InventoryReservationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InventoryReservationWhereInput
    orderBy?: InventoryReservationOrderByWithAggregationInput | InventoryReservationOrderByWithAggregationInput[]
    by: InventoryReservationScalarFieldEnum[] | InventoryReservationScalarFieldEnum
    having?: InventoryReservationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InventoryReservationCountAggregateInputType | true
    _min?: InventoryReservationMinAggregateInputType
    _max?: InventoryReservationMaxAggregateInputType
  }

  export type InventoryReservationGroupByOutputType = {
    id: string
    reservation_key: string
    user_id: string
    order_id: string | null
    status: $Enums.ReservationStatus
    expires_at: Date
    committed_at: Date | null
    released_at: Date | null
    expired_at: Date | null
    created_at: Date
    updated_at: Date
    _count: InventoryReservationCountAggregateOutputType | null
    _min: InventoryReservationMinAggregateOutputType | null
    _max: InventoryReservationMaxAggregateOutputType | null
  }

  type GetInventoryReservationGroupByPayload<T extends InventoryReservationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InventoryReservationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InventoryReservationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InventoryReservationGroupByOutputType[P]>
            : GetScalarType<T[P], InventoryReservationGroupByOutputType[P]>
        }
      >
    >


  export type InventoryReservationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reservation_key?: boolean
    user_id?: boolean
    order_id?: boolean
    status?: boolean
    expires_at?: boolean
    committed_at?: boolean
    released_at?: boolean
    expired_at?: boolean
    created_at?: boolean
    updated_at?: boolean
    items?: boolean | InventoryReservation$itemsArgs<ExtArgs>
    _count?: boolean | InventoryReservationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inventoryReservation"]>

  export type InventoryReservationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reservation_key?: boolean
    user_id?: boolean
    order_id?: boolean
    status?: boolean
    expires_at?: boolean
    committed_at?: boolean
    released_at?: boolean
    expired_at?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["inventoryReservation"]>

  export type InventoryReservationSelectScalar = {
    id?: boolean
    reservation_key?: boolean
    user_id?: boolean
    order_id?: boolean
    status?: boolean
    expires_at?: boolean
    committed_at?: boolean
    released_at?: boolean
    expired_at?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type InventoryReservationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | InventoryReservation$itemsArgs<ExtArgs>
    _count?: boolean | InventoryReservationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type InventoryReservationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $InventoryReservationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InventoryReservation"
    objects: {
      items: Prisma.$ReservationItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      reservation_key: string
      user_id: string
      order_id: string | null
      status: $Enums.ReservationStatus
      expires_at: Date
      committed_at: Date | null
      released_at: Date | null
      expired_at: Date | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["inventoryReservation"]>
    composites: {}
  }

  type InventoryReservationGetPayload<S extends boolean | null | undefined | InventoryReservationDefaultArgs> = $Result.GetResult<Prisma.$InventoryReservationPayload, S>

  type InventoryReservationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<InventoryReservationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: InventoryReservationCountAggregateInputType | true
    }

  export interface InventoryReservationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InventoryReservation'], meta: { name: 'InventoryReservation' } }
    /**
     * Find zero or one InventoryReservation that matches the filter.
     * @param {InventoryReservationFindUniqueArgs} args - Arguments to find a InventoryReservation
     * @example
     * // Get one InventoryReservation
     * const inventoryReservation = await prisma.inventoryReservation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InventoryReservationFindUniqueArgs>(args: SelectSubset<T, InventoryReservationFindUniqueArgs<ExtArgs>>): Prisma__InventoryReservationClient<$Result.GetResult<Prisma.$InventoryReservationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one InventoryReservation that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {InventoryReservationFindUniqueOrThrowArgs} args - Arguments to find a InventoryReservation
     * @example
     * // Get one InventoryReservation
     * const inventoryReservation = await prisma.inventoryReservation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InventoryReservationFindUniqueOrThrowArgs>(args: SelectSubset<T, InventoryReservationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InventoryReservationClient<$Result.GetResult<Prisma.$InventoryReservationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first InventoryReservation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryReservationFindFirstArgs} args - Arguments to find a InventoryReservation
     * @example
     * // Get one InventoryReservation
     * const inventoryReservation = await prisma.inventoryReservation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InventoryReservationFindFirstArgs>(args?: SelectSubset<T, InventoryReservationFindFirstArgs<ExtArgs>>): Prisma__InventoryReservationClient<$Result.GetResult<Prisma.$InventoryReservationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first InventoryReservation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryReservationFindFirstOrThrowArgs} args - Arguments to find a InventoryReservation
     * @example
     * // Get one InventoryReservation
     * const inventoryReservation = await prisma.inventoryReservation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InventoryReservationFindFirstOrThrowArgs>(args?: SelectSubset<T, InventoryReservationFindFirstOrThrowArgs<ExtArgs>>): Prisma__InventoryReservationClient<$Result.GetResult<Prisma.$InventoryReservationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more InventoryReservations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryReservationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InventoryReservations
     * const inventoryReservations = await prisma.inventoryReservation.findMany()
     * 
     * // Get first 10 InventoryReservations
     * const inventoryReservations = await prisma.inventoryReservation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const inventoryReservationWithIdOnly = await prisma.inventoryReservation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InventoryReservationFindManyArgs>(args?: SelectSubset<T, InventoryReservationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryReservationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a InventoryReservation.
     * @param {InventoryReservationCreateArgs} args - Arguments to create a InventoryReservation.
     * @example
     * // Create one InventoryReservation
     * const InventoryReservation = await prisma.inventoryReservation.create({
     *   data: {
     *     // ... data to create a InventoryReservation
     *   }
     * })
     * 
     */
    create<T extends InventoryReservationCreateArgs>(args: SelectSubset<T, InventoryReservationCreateArgs<ExtArgs>>): Prisma__InventoryReservationClient<$Result.GetResult<Prisma.$InventoryReservationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many InventoryReservations.
     * @param {InventoryReservationCreateManyArgs} args - Arguments to create many InventoryReservations.
     * @example
     * // Create many InventoryReservations
     * const inventoryReservation = await prisma.inventoryReservation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InventoryReservationCreateManyArgs>(args?: SelectSubset<T, InventoryReservationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many InventoryReservations and returns the data saved in the database.
     * @param {InventoryReservationCreateManyAndReturnArgs} args - Arguments to create many InventoryReservations.
     * @example
     * // Create many InventoryReservations
     * const inventoryReservation = await prisma.inventoryReservation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many InventoryReservations and only return the `id`
     * const inventoryReservationWithIdOnly = await prisma.inventoryReservation.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InventoryReservationCreateManyAndReturnArgs>(args?: SelectSubset<T, InventoryReservationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryReservationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a InventoryReservation.
     * @param {InventoryReservationDeleteArgs} args - Arguments to delete one InventoryReservation.
     * @example
     * // Delete one InventoryReservation
     * const InventoryReservation = await prisma.inventoryReservation.delete({
     *   where: {
     *     // ... filter to delete one InventoryReservation
     *   }
     * })
     * 
     */
    delete<T extends InventoryReservationDeleteArgs>(args: SelectSubset<T, InventoryReservationDeleteArgs<ExtArgs>>): Prisma__InventoryReservationClient<$Result.GetResult<Prisma.$InventoryReservationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one InventoryReservation.
     * @param {InventoryReservationUpdateArgs} args - Arguments to update one InventoryReservation.
     * @example
     * // Update one InventoryReservation
     * const inventoryReservation = await prisma.inventoryReservation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InventoryReservationUpdateArgs>(args: SelectSubset<T, InventoryReservationUpdateArgs<ExtArgs>>): Prisma__InventoryReservationClient<$Result.GetResult<Prisma.$InventoryReservationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more InventoryReservations.
     * @param {InventoryReservationDeleteManyArgs} args - Arguments to filter InventoryReservations to delete.
     * @example
     * // Delete a few InventoryReservations
     * const { count } = await prisma.inventoryReservation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InventoryReservationDeleteManyArgs>(args?: SelectSubset<T, InventoryReservationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InventoryReservations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryReservationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InventoryReservations
     * const inventoryReservation = await prisma.inventoryReservation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InventoryReservationUpdateManyArgs>(args: SelectSubset<T, InventoryReservationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one InventoryReservation.
     * @param {InventoryReservationUpsertArgs} args - Arguments to update or create a InventoryReservation.
     * @example
     * // Update or create a InventoryReservation
     * const inventoryReservation = await prisma.inventoryReservation.upsert({
     *   create: {
     *     // ... data to create a InventoryReservation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InventoryReservation we want to update
     *   }
     * })
     */
    upsert<T extends InventoryReservationUpsertArgs>(args: SelectSubset<T, InventoryReservationUpsertArgs<ExtArgs>>): Prisma__InventoryReservationClient<$Result.GetResult<Prisma.$InventoryReservationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of InventoryReservations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryReservationCountArgs} args - Arguments to filter InventoryReservations to count.
     * @example
     * // Count the number of InventoryReservations
     * const count = await prisma.inventoryReservation.count({
     *   where: {
     *     // ... the filter for the InventoryReservations we want to count
     *   }
     * })
    **/
    count<T extends InventoryReservationCountArgs>(
      args?: Subset<T, InventoryReservationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InventoryReservationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InventoryReservation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryReservationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InventoryReservationAggregateArgs>(args: Subset<T, InventoryReservationAggregateArgs>): Prisma.PrismaPromise<GetInventoryReservationAggregateType<T>>

    /**
     * Group by InventoryReservation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryReservationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InventoryReservationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InventoryReservationGroupByArgs['orderBy'] }
        : { orderBy?: InventoryReservationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InventoryReservationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInventoryReservationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InventoryReservation model
   */
  readonly fields: InventoryReservationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InventoryReservation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InventoryReservationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    items<T extends InventoryReservation$itemsArgs<ExtArgs> = {}>(args?: Subset<T, InventoryReservation$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReservationItemPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the InventoryReservation model
   */ 
  interface InventoryReservationFieldRefs {
    readonly id: FieldRef<"InventoryReservation", 'String'>
    readonly reservation_key: FieldRef<"InventoryReservation", 'String'>
    readonly user_id: FieldRef<"InventoryReservation", 'String'>
    readonly order_id: FieldRef<"InventoryReservation", 'String'>
    readonly status: FieldRef<"InventoryReservation", 'ReservationStatus'>
    readonly expires_at: FieldRef<"InventoryReservation", 'DateTime'>
    readonly committed_at: FieldRef<"InventoryReservation", 'DateTime'>
    readonly released_at: FieldRef<"InventoryReservation", 'DateTime'>
    readonly expired_at: FieldRef<"InventoryReservation", 'DateTime'>
    readonly created_at: FieldRef<"InventoryReservation", 'DateTime'>
    readonly updated_at: FieldRef<"InventoryReservation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * InventoryReservation findUnique
   */
  export type InventoryReservationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryReservation
     */
    select?: InventoryReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryReservationInclude<ExtArgs> | null
    /**
     * Filter, which InventoryReservation to fetch.
     */
    where: InventoryReservationWhereUniqueInput
  }

  /**
   * InventoryReservation findUniqueOrThrow
   */
  export type InventoryReservationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryReservation
     */
    select?: InventoryReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryReservationInclude<ExtArgs> | null
    /**
     * Filter, which InventoryReservation to fetch.
     */
    where: InventoryReservationWhereUniqueInput
  }

  /**
   * InventoryReservation findFirst
   */
  export type InventoryReservationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryReservation
     */
    select?: InventoryReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryReservationInclude<ExtArgs> | null
    /**
     * Filter, which InventoryReservation to fetch.
     */
    where?: InventoryReservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryReservations to fetch.
     */
    orderBy?: InventoryReservationOrderByWithRelationInput | InventoryReservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InventoryReservations.
     */
    cursor?: InventoryReservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryReservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryReservations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InventoryReservations.
     */
    distinct?: InventoryReservationScalarFieldEnum | InventoryReservationScalarFieldEnum[]
  }

  /**
   * InventoryReservation findFirstOrThrow
   */
  export type InventoryReservationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryReservation
     */
    select?: InventoryReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryReservationInclude<ExtArgs> | null
    /**
     * Filter, which InventoryReservation to fetch.
     */
    where?: InventoryReservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryReservations to fetch.
     */
    orderBy?: InventoryReservationOrderByWithRelationInput | InventoryReservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InventoryReservations.
     */
    cursor?: InventoryReservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryReservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryReservations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InventoryReservations.
     */
    distinct?: InventoryReservationScalarFieldEnum | InventoryReservationScalarFieldEnum[]
  }

  /**
   * InventoryReservation findMany
   */
  export type InventoryReservationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryReservation
     */
    select?: InventoryReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryReservationInclude<ExtArgs> | null
    /**
     * Filter, which InventoryReservations to fetch.
     */
    where?: InventoryReservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryReservations to fetch.
     */
    orderBy?: InventoryReservationOrderByWithRelationInput | InventoryReservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InventoryReservations.
     */
    cursor?: InventoryReservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryReservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryReservations.
     */
    skip?: number
    distinct?: InventoryReservationScalarFieldEnum | InventoryReservationScalarFieldEnum[]
  }

  /**
   * InventoryReservation create
   */
  export type InventoryReservationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryReservation
     */
    select?: InventoryReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryReservationInclude<ExtArgs> | null
    /**
     * The data needed to create a InventoryReservation.
     */
    data: XOR<InventoryReservationCreateInput, InventoryReservationUncheckedCreateInput>
  }

  /**
   * InventoryReservation createMany
   */
  export type InventoryReservationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InventoryReservations.
     */
    data: InventoryReservationCreateManyInput | InventoryReservationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InventoryReservation createManyAndReturn
   */
  export type InventoryReservationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryReservation
     */
    select?: InventoryReservationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many InventoryReservations.
     */
    data: InventoryReservationCreateManyInput | InventoryReservationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InventoryReservation update
   */
  export type InventoryReservationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryReservation
     */
    select?: InventoryReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryReservationInclude<ExtArgs> | null
    /**
     * The data needed to update a InventoryReservation.
     */
    data: XOR<InventoryReservationUpdateInput, InventoryReservationUncheckedUpdateInput>
    /**
     * Choose, which InventoryReservation to update.
     */
    where: InventoryReservationWhereUniqueInput
  }

  /**
   * InventoryReservation updateMany
   */
  export type InventoryReservationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InventoryReservations.
     */
    data: XOR<InventoryReservationUpdateManyMutationInput, InventoryReservationUncheckedUpdateManyInput>
    /**
     * Filter which InventoryReservations to update
     */
    where?: InventoryReservationWhereInput
  }

  /**
   * InventoryReservation upsert
   */
  export type InventoryReservationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryReservation
     */
    select?: InventoryReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryReservationInclude<ExtArgs> | null
    /**
     * The filter to search for the InventoryReservation to update in case it exists.
     */
    where: InventoryReservationWhereUniqueInput
    /**
     * In case the InventoryReservation found by the `where` argument doesn't exist, create a new InventoryReservation with this data.
     */
    create: XOR<InventoryReservationCreateInput, InventoryReservationUncheckedCreateInput>
    /**
     * In case the InventoryReservation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InventoryReservationUpdateInput, InventoryReservationUncheckedUpdateInput>
  }

  /**
   * InventoryReservation delete
   */
  export type InventoryReservationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryReservation
     */
    select?: InventoryReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryReservationInclude<ExtArgs> | null
    /**
     * Filter which InventoryReservation to delete.
     */
    where: InventoryReservationWhereUniqueInput
  }

  /**
   * InventoryReservation deleteMany
   */
  export type InventoryReservationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InventoryReservations to delete
     */
    where?: InventoryReservationWhereInput
  }

  /**
   * InventoryReservation.items
   */
  export type InventoryReservation$itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReservationItem
     */
    select?: ReservationItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationItemInclude<ExtArgs> | null
    where?: ReservationItemWhereInput
    orderBy?: ReservationItemOrderByWithRelationInput | ReservationItemOrderByWithRelationInput[]
    cursor?: ReservationItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReservationItemScalarFieldEnum | ReservationItemScalarFieldEnum[]
  }

  /**
   * InventoryReservation without action
   */
  export type InventoryReservationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryReservation
     */
    select?: InventoryReservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryReservationInclude<ExtArgs> | null
  }


  /**
   * Model ReservationItem
   */

  export type AggregateReservationItem = {
    _count: ReservationItemCountAggregateOutputType | null
    _avg: ReservationItemAvgAggregateOutputType | null
    _sum: ReservationItemSumAggregateOutputType | null
    _min: ReservationItemMinAggregateOutputType | null
    _max: ReservationItemMaxAggregateOutputType | null
  }

  export type ReservationItemAvgAggregateOutputType = {
    quantity: number | null
  }

  export type ReservationItemSumAggregateOutputType = {
    quantity: number | null
  }

  export type ReservationItemMinAggregateOutputType = {
    id: string | null
    reservation_id: string | null
    inventory_item_id: string | null
    product_id: string | null
    sku: string | null
    quantity: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ReservationItemMaxAggregateOutputType = {
    id: string | null
    reservation_id: string | null
    inventory_item_id: string | null
    product_id: string | null
    sku: string | null
    quantity: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ReservationItemCountAggregateOutputType = {
    id: number
    reservation_id: number
    inventory_item_id: number
    product_id: number
    sku: number
    quantity: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type ReservationItemAvgAggregateInputType = {
    quantity?: true
  }

  export type ReservationItemSumAggregateInputType = {
    quantity?: true
  }

  export type ReservationItemMinAggregateInputType = {
    id?: true
    reservation_id?: true
    inventory_item_id?: true
    product_id?: true
    sku?: true
    quantity?: true
    created_at?: true
    updated_at?: true
  }

  export type ReservationItemMaxAggregateInputType = {
    id?: true
    reservation_id?: true
    inventory_item_id?: true
    product_id?: true
    sku?: true
    quantity?: true
    created_at?: true
    updated_at?: true
  }

  export type ReservationItemCountAggregateInputType = {
    id?: true
    reservation_id?: true
    inventory_item_id?: true
    product_id?: true
    sku?: true
    quantity?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type ReservationItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReservationItem to aggregate.
     */
    where?: ReservationItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReservationItems to fetch.
     */
    orderBy?: ReservationItemOrderByWithRelationInput | ReservationItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReservationItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReservationItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReservationItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ReservationItems
    **/
    _count?: true | ReservationItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ReservationItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ReservationItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReservationItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReservationItemMaxAggregateInputType
  }

  export type GetReservationItemAggregateType<T extends ReservationItemAggregateArgs> = {
        [P in keyof T & keyof AggregateReservationItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReservationItem[P]>
      : GetScalarType<T[P], AggregateReservationItem[P]>
  }




  export type ReservationItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReservationItemWhereInput
    orderBy?: ReservationItemOrderByWithAggregationInput | ReservationItemOrderByWithAggregationInput[]
    by: ReservationItemScalarFieldEnum[] | ReservationItemScalarFieldEnum
    having?: ReservationItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReservationItemCountAggregateInputType | true
    _avg?: ReservationItemAvgAggregateInputType
    _sum?: ReservationItemSumAggregateInputType
    _min?: ReservationItemMinAggregateInputType
    _max?: ReservationItemMaxAggregateInputType
  }

  export type ReservationItemGroupByOutputType = {
    id: string
    reservation_id: string
    inventory_item_id: string
    product_id: string
    sku: string
    quantity: number
    created_at: Date
    updated_at: Date
    _count: ReservationItemCountAggregateOutputType | null
    _avg: ReservationItemAvgAggregateOutputType | null
    _sum: ReservationItemSumAggregateOutputType | null
    _min: ReservationItemMinAggregateOutputType | null
    _max: ReservationItemMaxAggregateOutputType | null
  }

  type GetReservationItemGroupByPayload<T extends ReservationItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReservationItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReservationItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReservationItemGroupByOutputType[P]>
            : GetScalarType<T[P], ReservationItemGroupByOutputType[P]>
        }
      >
    >


  export type ReservationItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reservation_id?: boolean
    inventory_item_id?: boolean
    product_id?: boolean
    sku?: boolean
    quantity?: boolean
    created_at?: boolean
    updated_at?: boolean
    reservation?: boolean | InventoryReservationDefaultArgs<ExtArgs>
    inventory_item?: boolean | InventoryItemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reservationItem"]>

  export type ReservationItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reservation_id?: boolean
    inventory_item_id?: boolean
    product_id?: boolean
    sku?: boolean
    quantity?: boolean
    created_at?: boolean
    updated_at?: boolean
    reservation?: boolean | InventoryReservationDefaultArgs<ExtArgs>
    inventory_item?: boolean | InventoryItemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reservationItem"]>

  export type ReservationItemSelectScalar = {
    id?: boolean
    reservation_id?: boolean
    inventory_item_id?: boolean
    product_id?: boolean
    sku?: boolean
    quantity?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type ReservationItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reservation?: boolean | InventoryReservationDefaultArgs<ExtArgs>
    inventory_item?: boolean | InventoryItemDefaultArgs<ExtArgs>
  }
  export type ReservationItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reservation?: boolean | InventoryReservationDefaultArgs<ExtArgs>
    inventory_item?: boolean | InventoryItemDefaultArgs<ExtArgs>
  }

  export type $ReservationItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ReservationItem"
    objects: {
      reservation: Prisma.$InventoryReservationPayload<ExtArgs>
      inventory_item: Prisma.$InventoryItemPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      reservation_id: string
      inventory_item_id: string
      product_id: string
      sku: string
      quantity: number
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["reservationItem"]>
    composites: {}
  }

  type ReservationItemGetPayload<S extends boolean | null | undefined | ReservationItemDefaultArgs> = $Result.GetResult<Prisma.$ReservationItemPayload, S>

  type ReservationItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ReservationItemFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ReservationItemCountAggregateInputType | true
    }

  export interface ReservationItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ReservationItem'], meta: { name: 'ReservationItem' } }
    /**
     * Find zero or one ReservationItem that matches the filter.
     * @param {ReservationItemFindUniqueArgs} args - Arguments to find a ReservationItem
     * @example
     * // Get one ReservationItem
     * const reservationItem = await prisma.reservationItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReservationItemFindUniqueArgs>(args: SelectSubset<T, ReservationItemFindUniqueArgs<ExtArgs>>): Prisma__ReservationItemClient<$Result.GetResult<Prisma.$ReservationItemPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ReservationItem that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ReservationItemFindUniqueOrThrowArgs} args - Arguments to find a ReservationItem
     * @example
     * // Get one ReservationItem
     * const reservationItem = await prisma.reservationItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReservationItemFindUniqueOrThrowArgs>(args: SelectSubset<T, ReservationItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReservationItemClient<$Result.GetResult<Prisma.$ReservationItemPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ReservationItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationItemFindFirstArgs} args - Arguments to find a ReservationItem
     * @example
     * // Get one ReservationItem
     * const reservationItem = await prisma.reservationItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReservationItemFindFirstArgs>(args?: SelectSubset<T, ReservationItemFindFirstArgs<ExtArgs>>): Prisma__ReservationItemClient<$Result.GetResult<Prisma.$ReservationItemPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ReservationItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationItemFindFirstOrThrowArgs} args - Arguments to find a ReservationItem
     * @example
     * // Get one ReservationItem
     * const reservationItem = await prisma.reservationItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReservationItemFindFirstOrThrowArgs>(args?: SelectSubset<T, ReservationItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReservationItemClient<$Result.GetResult<Prisma.$ReservationItemPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ReservationItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ReservationItems
     * const reservationItems = await prisma.reservationItem.findMany()
     * 
     * // Get first 10 ReservationItems
     * const reservationItems = await prisma.reservationItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reservationItemWithIdOnly = await prisma.reservationItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReservationItemFindManyArgs>(args?: SelectSubset<T, ReservationItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReservationItemPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ReservationItem.
     * @param {ReservationItemCreateArgs} args - Arguments to create a ReservationItem.
     * @example
     * // Create one ReservationItem
     * const ReservationItem = await prisma.reservationItem.create({
     *   data: {
     *     // ... data to create a ReservationItem
     *   }
     * })
     * 
     */
    create<T extends ReservationItemCreateArgs>(args: SelectSubset<T, ReservationItemCreateArgs<ExtArgs>>): Prisma__ReservationItemClient<$Result.GetResult<Prisma.$ReservationItemPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ReservationItems.
     * @param {ReservationItemCreateManyArgs} args - Arguments to create many ReservationItems.
     * @example
     * // Create many ReservationItems
     * const reservationItem = await prisma.reservationItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReservationItemCreateManyArgs>(args?: SelectSubset<T, ReservationItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ReservationItems and returns the data saved in the database.
     * @param {ReservationItemCreateManyAndReturnArgs} args - Arguments to create many ReservationItems.
     * @example
     * // Create many ReservationItems
     * const reservationItem = await prisma.reservationItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ReservationItems and only return the `id`
     * const reservationItemWithIdOnly = await prisma.reservationItem.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReservationItemCreateManyAndReturnArgs>(args?: SelectSubset<T, ReservationItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReservationItemPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ReservationItem.
     * @param {ReservationItemDeleteArgs} args - Arguments to delete one ReservationItem.
     * @example
     * // Delete one ReservationItem
     * const ReservationItem = await prisma.reservationItem.delete({
     *   where: {
     *     // ... filter to delete one ReservationItem
     *   }
     * })
     * 
     */
    delete<T extends ReservationItemDeleteArgs>(args: SelectSubset<T, ReservationItemDeleteArgs<ExtArgs>>): Prisma__ReservationItemClient<$Result.GetResult<Prisma.$ReservationItemPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ReservationItem.
     * @param {ReservationItemUpdateArgs} args - Arguments to update one ReservationItem.
     * @example
     * // Update one ReservationItem
     * const reservationItem = await prisma.reservationItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReservationItemUpdateArgs>(args: SelectSubset<T, ReservationItemUpdateArgs<ExtArgs>>): Prisma__ReservationItemClient<$Result.GetResult<Prisma.$ReservationItemPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ReservationItems.
     * @param {ReservationItemDeleteManyArgs} args - Arguments to filter ReservationItems to delete.
     * @example
     * // Delete a few ReservationItems
     * const { count } = await prisma.reservationItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReservationItemDeleteManyArgs>(args?: SelectSubset<T, ReservationItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ReservationItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ReservationItems
     * const reservationItem = await prisma.reservationItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReservationItemUpdateManyArgs>(args: SelectSubset<T, ReservationItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ReservationItem.
     * @param {ReservationItemUpsertArgs} args - Arguments to update or create a ReservationItem.
     * @example
     * // Update or create a ReservationItem
     * const reservationItem = await prisma.reservationItem.upsert({
     *   create: {
     *     // ... data to create a ReservationItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ReservationItem we want to update
     *   }
     * })
     */
    upsert<T extends ReservationItemUpsertArgs>(args: SelectSubset<T, ReservationItemUpsertArgs<ExtArgs>>): Prisma__ReservationItemClient<$Result.GetResult<Prisma.$ReservationItemPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ReservationItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationItemCountArgs} args - Arguments to filter ReservationItems to count.
     * @example
     * // Count the number of ReservationItems
     * const count = await prisma.reservationItem.count({
     *   where: {
     *     // ... the filter for the ReservationItems we want to count
     *   }
     * })
    **/
    count<T extends ReservationItemCountArgs>(
      args?: Subset<T, ReservationItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReservationItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ReservationItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReservationItemAggregateArgs>(args: Subset<T, ReservationItemAggregateArgs>): Prisma.PrismaPromise<GetReservationItemAggregateType<T>>

    /**
     * Group by ReservationItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReservationItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReservationItemGroupByArgs['orderBy'] }
        : { orderBy?: ReservationItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReservationItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReservationItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ReservationItem model
   */
  readonly fields: ReservationItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ReservationItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReservationItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    reservation<T extends InventoryReservationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InventoryReservationDefaultArgs<ExtArgs>>): Prisma__InventoryReservationClient<$Result.GetResult<Prisma.$InventoryReservationPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    inventory_item<T extends InventoryItemDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InventoryItemDefaultArgs<ExtArgs>>): Prisma__InventoryItemClient<$Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ReservationItem model
   */ 
  interface ReservationItemFieldRefs {
    readonly id: FieldRef<"ReservationItem", 'String'>
    readonly reservation_id: FieldRef<"ReservationItem", 'String'>
    readonly inventory_item_id: FieldRef<"ReservationItem", 'String'>
    readonly product_id: FieldRef<"ReservationItem", 'String'>
    readonly sku: FieldRef<"ReservationItem", 'String'>
    readonly quantity: FieldRef<"ReservationItem", 'Int'>
    readonly created_at: FieldRef<"ReservationItem", 'DateTime'>
    readonly updated_at: FieldRef<"ReservationItem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ReservationItem findUnique
   */
  export type ReservationItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReservationItem
     */
    select?: ReservationItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationItemInclude<ExtArgs> | null
    /**
     * Filter, which ReservationItem to fetch.
     */
    where: ReservationItemWhereUniqueInput
  }

  /**
   * ReservationItem findUniqueOrThrow
   */
  export type ReservationItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReservationItem
     */
    select?: ReservationItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationItemInclude<ExtArgs> | null
    /**
     * Filter, which ReservationItem to fetch.
     */
    where: ReservationItemWhereUniqueInput
  }

  /**
   * ReservationItem findFirst
   */
  export type ReservationItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReservationItem
     */
    select?: ReservationItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationItemInclude<ExtArgs> | null
    /**
     * Filter, which ReservationItem to fetch.
     */
    where?: ReservationItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReservationItems to fetch.
     */
    orderBy?: ReservationItemOrderByWithRelationInput | ReservationItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReservationItems.
     */
    cursor?: ReservationItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReservationItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReservationItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReservationItems.
     */
    distinct?: ReservationItemScalarFieldEnum | ReservationItemScalarFieldEnum[]
  }

  /**
   * ReservationItem findFirstOrThrow
   */
  export type ReservationItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReservationItem
     */
    select?: ReservationItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationItemInclude<ExtArgs> | null
    /**
     * Filter, which ReservationItem to fetch.
     */
    where?: ReservationItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReservationItems to fetch.
     */
    orderBy?: ReservationItemOrderByWithRelationInput | ReservationItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReservationItems.
     */
    cursor?: ReservationItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReservationItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReservationItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReservationItems.
     */
    distinct?: ReservationItemScalarFieldEnum | ReservationItemScalarFieldEnum[]
  }

  /**
   * ReservationItem findMany
   */
  export type ReservationItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReservationItem
     */
    select?: ReservationItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationItemInclude<ExtArgs> | null
    /**
     * Filter, which ReservationItems to fetch.
     */
    where?: ReservationItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReservationItems to fetch.
     */
    orderBy?: ReservationItemOrderByWithRelationInput | ReservationItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ReservationItems.
     */
    cursor?: ReservationItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReservationItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReservationItems.
     */
    skip?: number
    distinct?: ReservationItemScalarFieldEnum | ReservationItemScalarFieldEnum[]
  }

  /**
   * ReservationItem create
   */
  export type ReservationItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReservationItem
     */
    select?: ReservationItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationItemInclude<ExtArgs> | null
    /**
     * The data needed to create a ReservationItem.
     */
    data: XOR<ReservationItemCreateInput, ReservationItemUncheckedCreateInput>
  }

  /**
   * ReservationItem createMany
   */
  export type ReservationItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ReservationItems.
     */
    data: ReservationItemCreateManyInput | ReservationItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ReservationItem createManyAndReturn
   */
  export type ReservationItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReservationItem
     */
    select?: ReservationItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ReservationItems.
     */
    data: ReservationItemCreateManyInput | ReservationItemCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ReservationItem update
   */
  export type ReservationItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReservationItem
     */
    select?: ReservationItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationItemInclude<ExtArgs> | null
    /**
     * The data needed to update a ReservationItem.
     */
    data: XOR<ReservationItemUpdateInput, ReservationItemUncheckedUpdateInput>
    /**
     * Choose, which ReservationItem to update.
     */
    where: ReservationItemWhereUniqueInput
  }

  /**
   * ReservationItem updateMany
   */
  export type ReservationItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ReservationItems.
     */
    data: XOR<ReservationItemUpdateManyMutationInput, ReservationItemUncheckedUpdateManyInput>
    /**
     * Filter which ReservationItems to update
     */
    where?: ReservationItemWhereInput
  }

  /**
   * ReservationItem upsert
   */
  export type ReservationItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReservationItem
     */
    select?: ReservationItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationItemInclude<ExtArgs> | null
    /**
     * The filter to search for the ReservationItem to update in case it exists.
     */
    where: ReservationItemWhereUniqueInput
    /**
     * In case the ReservationItem found by the `where` argument doesn't exist, create a new ReservationItem with this data.
     */
    create: XOR<ReservationItemCreateInput, ReservationItemUncheckedCreateInput>
    /**
     * In case the ReservationItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReservationItemUpdateInput, ReservationItemUncheckedUpdateInput>
  }

  /**
   * ReservationItem delete
   */
  export type ReservationItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReservationItem
     */
    select?: ReservationItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationItemInclude<ExtArgs> | null
    /**
     * Filter which ReservationItem to delete.
     */
    where: ReservationItemWhereUniqueInput
  }

  /**
   * ReservationItem deleteMany
   */
  export type ReservationItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReservationItems to delete
     */
    where?: ReservationItemWhereInput
  }

  /**
   * ReservationItem without action
   */
  export type ReservationItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReservationItem
     */
    select?: ReservationItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservationItemInclude<ExtArgs> | null
  }


  /**
   * Model Shipment
   */

  export type AggregateShipment = {
    _count: ShipmentCountAggregateOutputType | null
    _min: ShipmentMinAggregateOutputType | null
    _max: ShipmentMaxAggregateOutputType | null
  }

  export type ShipmentMinAggregateOutputType = {
    id: string | null
    shipment_number: string | null
    order_id: string | null
    user_id: string | null
    warehouse_id: string | null
    reservation_id: string | null
    status: $Enums.ShipmentStatus | null
    courier_code: $Enums.CourierCode | null
    tracking_number: string | null
    label_url: string | null
    manifest_id: string | null
    estimated_delivery: Date | null
    dispatched_at: Date | null
    delivered_at: Date | null
    delivery_notes: string | null
    pod_signature: string | null
    pod_received_by: string | null
    pod_received_at: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ShipmentMaxAggregateOutputType = {
    id: string | null
    shipment_number: string | null
    order_id: string | null
    user_id: string | null
    warehouse_id: string | null
    reservation_id: string | null
    status: $Enums.ShipmentStatus | null
    courier_code: $Enums.CourierCode | null
    tracking_number: string | null
    label_url: string | null
    manifest_id: string | null
    estimated_delivery: Date | null
    dispatched_at: Date | null
    delivered_at: Date | null
    delivery_notes: string | null
    pod_signature: string | null
    pod_received_by: string | null
    pod_received_at: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ShipmentCountAggregateOutputType = {
    id: number
    shipment_number: number
    order_id: number
    user_id: number
    warehouse_id: number
    reservation_id: number
    status: number
    courier_code: number
    tracking_number: number
    shipping_address: number
    label_url: number
    manifest_id: number
    estimated_delivery: number
    dispatched_at: number
    delivered_at: number
    delivery_notes: number
    pod_signature: number
    pod_received_by: number
    pod_received_at: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type ShipmentMinAggregateInputType = {
    id?: true
    shipment_number?: true
    order_id?: true
    user_id?: true
    warehouse_id?: true
    reservation_id?: true
    status?: true
    courier_code?: true
    tracking_number?: true
    label_url?: true
    manifest_id?: true
    estimated_delivery?: true
    dispatched_at?: true
    delivered_at?: true
    delivery_notes?: true
    pod_signature?: true
    pod_received_by?: true
    pod_received_at?: true
    created_at?: true
    updated_at?: true
  }

  export type ShipmentMaxAggregateInputType = {
    id?: true
    shipment_number?: true
    order_id?: true
    user_id?: true
    warehouse_id?: true
    reservation_id?: true
    status?: true
    courier_code?: true
    tracking_number?: true
    label_url?: true
    manifest_id?: true
    estimated_delivery?: true
    dispatched_at?: true
    delivered_at?: true
    delivery_notes?: true
    pod_signature?: true
    pod_received_by?: true
    pod_received_at?: true
    created_at?: true
    updated_at?: true
  }

  export type ShipmentCountAggregateInputType = {
    id?: true
    shipment_number?: true
    order_id?: true
    user_id?: true
    warehouse_id?: true
    reservation_id?: true
    status?: true
    courier_code?: true
    tracking_number?: true
    shipping_address?: true
    label_url?: true
    manifest_id?: true
    estimated_delivery?: true
    dispatched_at?: true
    delivered_at?: true
    delivery_notes?: true
    pod_signature?: true
    pod_received_by?: true
    pod_received_at?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type ShipmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Shipment to aggregate.
     */
    where?: ShipmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Shipments to fetch.
     */
    orderBy?: ShipmentOrderByWithRelationInput | ShipmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ShipmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Shipments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Shipments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Shipments
    **/
    _count?: true | ShipmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ShipmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ShipmentMaxAggregateInputType
  }

  export type GetShipmentAggregateType<T extends ShipmentAggregateArgs> = {
        [P in keyof T & keyof AggregateShipment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateShipment[P]>
      : GetScalarType<T[P], AggregateShipment[P]>
  }




  export type ShipmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShipmentWhereInput
    orderBy?: ShipmentOrderByWithAggregationInput | ShipmentOrderByWithAggregationInput[]
    by: ShipmentScalarFieldEnum[] | ShipmentScalarFieldEnum
    having?: ShipmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ShipmentCountAggregateInputType | true
    _min?: ShipmentMinAggregateInputType
    _max?: ShipmentMaxAggregateInputType
  }

  export type ShipmentGroupByOutputType = {
    id: string
    shipment_number: string
    order_id: string
    user_id: string
    warehouse_id: string
    reservation_id: string | null
    status: $Enums.ShipmentStatus
    courier_code: $Enums.CourierCode
    tracking_number: string | null
    shipping_address: JsonValue
    label_url: string | null
    manifest_id: string | null
    estimated_delivery: Date | null
    dispatched_at: Date | null
    delivered_at: Date | null
    delivery_notes: string | null
    pod_signature: string | null
    pod_received_by: string | null
    pod_received_at: Date | null
    created_at: Date
    updated_at: Date
    _count: ShipmentCountAggregateOutputType | null
    _min: ShipmentMinAggregateOutputType | null
    _max: ShipmentMaxAggregateOutputType | null
  }

  type GetShipmentGroupByPayload<T extends ShipmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ShipmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ShipmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ShipmentGroupByOutputType[P]>
            : GetScalarType<T[P], ShipmentGroupByOutputType[P]>
        }
      >
    >


  export type ShipmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shipment_number?: boolean
    order_id?: boolean
    user_id?: boolean
    warehouse_id?: boolean
    reservation_id?: boolean
    status?: boolean
    courier_code?: boolean
    tracking_number?: boolean
    shipping_address?: boolean
    label_url?: boolean
    manifest_id?: boolean
    estimated_delivery?: boolean
    dispatched_at?: boolean
    delivered_at?: boolean
    delivery_notes?: boolean
    pod_signature?: boolean
    pod_received_by?: boolean
    pod_received_at?: boolean
    created_at?: boolean
    updated_at?: boolean
    warehouse?: boolean | WarehouseDefaultArgs<ExtArgs>
    items?: boolean | Shipment$itemsArgs<ExtArgs>
    tracking_updates?: boolean | Shipment$tracking_updatesArgs<ExtArgs>
    _count?: boolean | ShipmentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["shipment"]>

  export type ShipmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shipment_number?: boolean
    order_id?: boolean
    user_id?: boolean
    warehouse_id?: boolean
    reservation_id?: boolean
    status?: boolean
    courier_code?: boolean
    tracking_number?: boolean
    shipping_address?: boolean
    label_url?: boolean
    manifest_id?: boolean
    estimated_delivery?: boolean
    dispatched_at?: boolean
    delivered_at?: boolean
    delivery_notes?: boolean
    pod_signature?: boolean
    pod_received_by?: boolean
    pod_received_at?: boolean
    created_at?: boolean
    updated_at?: boolean
    warehouse?: boolean | WarehouseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["shipment"]>

  export type ShipmentSelectScalar = {
    id?: boolean
    shipment_number?: boolean
    order_id?: boolean
    user_id?: boolean
    warehouse_id?: boolean
    reservation_id?: boolean
    status?: boolean
    courier_code?: boolean
    tracking_number?: boolean
    shipping_address?: boolean
    label_url?: boolean
    manifest_id?: boolean
    estimated_delivery?: boolean
    dispatched_at?: boolean
    delivered_at?: boolean
    delivery_notes?: boolean
    pod_signature?: boolean
    pod_received_by?: boolean
    pod_received_at?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type ShipmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    warehouse?: boolean | WarehouseDefaultArgs<ExtArgs>
    items?: boolean | Shipment$itemsArgs<ExtArgs>
    tracking_updates?: boolean | Shipment$tracking_updatesArgs<ExtArgs>
    _count?: boolean | ShipmentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ShipmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    warehouse?: boolean | WarehouseDefaultArgs<ExtArgs>
  }

  export type $ShipmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Shipment"
    objects: {
      warehouse: Prisma.$WarehousePayload<ExtArgs>
      items: Prisma.$ShipmentItemPayload<ExtArgs>[]
      tracking_updates: Prisma.$TrackingUpdatePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      shipment_number: string
      order_id: string
      user_id: string
      warehouse_id: string
      reservation_id: string | null
      status: $Enums.ShipmentStatus
      courier_code: $Enums.CourierCode
      tracking_number: string | null
      shipping_address: Prisma.JsonValue
      label_url: string | null
      manifest_id: string | null
      estimated_delivery: Date | null
      dispatched_at: Date | null
      delivered_at: Date | null
      delivery_notes: string | null
      pod_signature: string | null
      pod_received_by: string | null
      pod_received_at: Date | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["shipment"]>
    composites: {}
  }

  type ShipmentGetPayload<S extends boolean | null | undefined | ShipmentDefaultArgs> = $Result.GetResult<Prisma.$ShipmentPayload, S>

  type ShipmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ShipmentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ShipmentCountAggregateInputType | true
    }

  export interface ShipmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Shipment'], meta: { name: 'Shipment' } }
    /**
     * Find zero or one Shipment that matches the filter.
     * @param {ShipmentFindUniqueArgs} args - Arguments to find a Shipment
     * @example
     * // Get one Shipment
     * const shipment = await prisma.shipment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ShipmentFindUniqueArgs>(args: SelectSubset<T, ShipmentFindUniqueArgs<ExtArgs>>): Prisma__ShipmentClient<$Result.GetResult<Prisma.$ShipmentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Shipment that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ShipmentFindUniqueOrThrowArgs} args - Arguments to find a Shipment
     * @example
     * // Get one Shipment
     * const shipment = await prisma.shipment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ShipmentFindUniqueOrThrowArgs>(args: SelectSubset<T, ShipmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ShipmentClient<$Result.GetResult<Prisma.$ShipmentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Shipment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentFindFirstArgs} args - Arguments to find a Shipment
     * @example
     * // Get one Shipment
     * const shipment = await prisma.shipment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ShipmentFindFirstArgs>(args?: SelectSubset<T, ShipmentFindFirstArgs<ExtArgs>>): Prisma__ShipmentClient<$Result.GetResult<Prisma.$ShipmentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Shipment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentFindFirstOrThrowArgs} args - Arguments to find a Shipment
     * @example
     * // Get one Shipment
     * const shipment = await prisma.shipment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ShipmentFindFirstOrThrowArgs>(args?: SelectSubset<T, ShipmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__ShipmentClient<$Result.GetResult<Prisma.$ShipmentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Shipments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Shipments
     * const shipments = await prisma.shipment.findMany()
     * 
     * // Get first 10 Shipments
     * const shipments = await prisma.shipment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const shipmentWithIdOnly = await prisma.shipment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ShipmentFindManyArgs>(args?: SelectSubset<T, ShipmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShipmentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Shipment.
     * @param {ShipmentCreateArgs} args - Arguments to create a Shipment.
     * @example
     * // Create one Shipment
     * const Shipment = await prisma.shipment.create({
     *   data: {
     *     // ... data to create a Shipment
     *   }
     * })
     * 
     */
    create<T extends ShipmentCreateArgs>(args: SelectSubset<T, ShipmentCreateArgs<ExtArgs>>): Prisma__ShipmentClient<$Result.GetResult<Prisma.$ShipmentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Shipments.
     * @param {ShipmentCreateManyArgs} args - Arguments to create many Shipments.
     * @example
     * // Create many Shipments
     * const shipment = await prisma.shipment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ShipmentCreateManyArgs>(args?: SelectSubset<T, ShipmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Shipments and returns the data saved in the database.
     * @param {ShipmentCreateManyAndReturnArgs} args - Arguments to create many Shipments.
     * @example
     * // Create many Shipments
     * const shipment = await prisma.shipment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Shipments and only return the `id`
     * const shipmentWithIdOnly = await prisma.shipment.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ShipmentCreateManyAndReturnArgs>(args?: SelectSubset<T, ShipmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShipmentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Shipment.
     * @param {ShipmentDeleteArgs} args - Arguments to delete one Shipment.
     * @example
     * // Delete one Shipment
     * const Shipment = await prisma.shipment.delete({
     *   where: {
     *     // ... filter to delete one Shipment
     *   }
     * })
     * 
     */
    delete<T extends ShipmentDeleteArgs>(args: SelectSubset<T, ShipmentDeleteArgs<ExtArgs>>): Prisma__ShipmentClient<$Result.GetResult<Prisma.$ShipmentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Shipment.
     * @param {ShipmentUpdateArgs} args - Arguments to update one Shipment.
     * @example
     * // Update one Shipment
     * const shipment = await prisma.shipment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ShipmentUpdateArgs>(args: SelectSubset<T, ShipmentUpdateArgs<ExtArgs>>): Prisma__ShipmentClient<$Result.GetResult<Prisma.$ShipmentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Shipments.
     * @param {ShipmentDeleteManyArgs} args - Arguments to filter Shipments to delete.
     * @example
     * // Delete a few Shipments
     * const { count } = await prisma.shipment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ShipmentDeleteManyArgs>(args?: SelectSubset<T, ShipmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Shipments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Shipments
     * const shipment = await prisma.shipment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ShipmentUpdateManyArgs>(args: SelectSubset<T, ShipmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Shipment.
     * @param {ShipmentUpsertArgs} args - Arguments to update or create a Shipment.
     * @example
     * // Update or create a Shipment
     * const shipment = await prisma.shipment.upsert({
     *   create: {
     *     // ... data to create a Shipment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Shipment we want to update
     *   }
     * })
     */
    upsert<T extends ShipmentUpsertArgs>(args: SelectSubset<T, ShipmentUpsertArgs<ExtArgs>>): Prisma__ShipmentClient<$Result.GetResult<Prisma.$ShipmentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Shipments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentCountArgs} args - Arguments to filter Shipments to count.
     * @example
     * // Count the number of Shipments
     * const count = await prisma.shipment.count({
     *   where: {
     *     // ... the filter for the Shipments we want to count
     *   }
     * })
    **/
    count<T extends ShipmentCountArgs>(
      args?: Subset<T, ShipmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ShipmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Shipment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ShipmentAggregateArgs>(args: Subset<T, ShipmentAggregateArgs>): Prisma.PrismaPromise<GetShipmentAggregateType<T>>

    /**
     * Group by Shipment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ShipmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ShipmentGroupByArgs['orderBy'] }
        : { orderBy?: ShipmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ShipmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetShipmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Shipment model
   */
  readonly fields: ShipmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Shipment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ShipmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    warehouse<T extends WarehouseDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WarehouseDefaultArgs<ExtArgs>>): Prisma__WarehouseClient<$Result.GetResult<Prisma.$WarehousePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    items<T extends Shipment$itemsArgs<ExtArgs> = {}>(args?: Subset<T, Shipment$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShipmentItemPayload<ExtArgs>, T, "findMany"> | Null>
    tracking_updates<T extends Shipment$tracking_updatesArgs<ExtArgs> = {}>(args?: Subset<T, Shipment$tracking_updatesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrackingUpdatePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Shipment model
   */ 
  interface ShipmentFieldRefs {
    readonly id: FieldRef<"Shipment", 'String'>
    readonly shipment_number: FieldRef<"Shipment", 'String'>
    readonly order_id: FieldRef<"Shipment", 'String'>
    readonly user_id: FieldRef<"Shipment", 'String'>
    readonly warehouse_id: FieldRef<"Shipment", 'String'>
    readonly reservation_id: FieldRef<"Shipment", 'String'>
    readonly status: FieldRef<"Shipment", 'ShipmentStatus'>
    readonly courier_code: FieldRef<"Shipment", 'CourierCode'>
    readonly tracking_number: FieldRef<"Shipment", 'String'>
    readonly shipping_address: FieldRef<"Shipment", 'Json'>
    readonly label_url: FieldRef<"Shipment", 'String'>
    readonly manifest_id: FieldRef<"Shipment", 'String'>
    readonly estimated_delivery: FieldRef<"Shipment", 'DateTime'>
    readonly dispatched_at: FieldRef<"Shipment", 'DateTime'>
    readonly delivered_at: FieldRef<"Shipment", 'DateTime'>
    readonly delivery_notes: FieldRef<"Shipment", 'String'>
    readonly pod_signature: FieldRef<"Shipment", 'String'>
    readonly pod_received_by: FieldRef<"Shipment", 'String'>
    readonly pod_received_at: FieldRef<"Shipment", 'DateTime'>
    readonly created_at: FieldRef<"Shipment", 'DateTime'>
    readonly updated_at: FieldRef<"Shipment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Shipment findUnique
   */
  export type ShipmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipment
     */
    select?: ShipmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentInclude<ExtArgs> | null
    /**
     * Filter, which Shipment to fetch.
     */
    where: ShipmentWhereUniqueInput
  }

  /**
   * Shipment findUniqueOrThrow
   */
  export type ShipmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipment
     */
    select?: ShipmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentInclude<ExtArgs> | null
    /**
     * Filter, which Shipment to fetch.
     */
    where: ShipmentWhereUniqueInput
  }

  /**
   * Shipment findFirst
   */
  export type ShipmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipment
     */
    select?: ShipmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentInclude<ExtArgs> | null
    /**
     * Filter, which Shipment to fetch.
     */
    where?: ShipmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Shipments to fetch.
     */
    orderBy?: ShipmentOrderByWithRelationInput | ShipmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Shipments.
     */
    cursor?: ShipmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Shipments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Shipments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Shipments.
     */
    distinct?: ShipmentScalarFieldEnum | ShipmentScalarFieldEnum[]
  }

  /**
   * Shipment findFirstOrThrow
   */
  export type ShipmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipment
     */
    select?: ShipmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentInclude<ExtArgs> | null
    /**
     * Filter, which Shipment to fetch.
     */
    where?: ShipmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Shipments to fetch.
     */
    orderBy?: ShipmentOrderByWithRelationInput | ShipmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Shipments.
     */
    cursor?: ShipmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Shipments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Shipments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Shipments.
     */
    distinct?: ShipmentScalarFieldEnum | ShipmentScalarFieldEnum[]
  }

  /**
   * Shipment findMany
   */
  export type ShipmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipment
     */
    select?: ShipmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentInclude<ExtArgs> | null
    /**
     * Filter, which Shipments to fetch.
     */
    where?: ShipmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Shipments to fetch.
     */
    orderBy?: ShipmentOrderByWithRelationInput | ShipmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Shipments.
     */
    cursor?: ShipmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Shipments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Shipments.
     */
    skip?: number
    distinct?: ShipmentScalarFieldEnum | ShipmentScalarFieldEnum[]
  }

  /**
   * Shipment create
   */
  export type ShipmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipment
     */
    select?: ShipmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentInclude<ExtArgs> | null
    /**
     * The data needed to create a Shipment.
     */
    data: XOR<ShipmentCreateInput, ShipmentUncheckedCreateInput>
  }

  /**
   * Shipment createMany
   */
  export type ShipmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Shipments.
     */
    data: ShipmentCreateManyInput | ShipmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Shipment createManyAndReturn
   */
  export type ShipmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipment
     */
    select?: ShipmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Shipments.
     */
    data: ShipmentCreateManyInput | ShipmentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Shipment update
   */
  export type ShipmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipment
     */
    select?: ShipmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentInclude<ExtArgs> | null
    /**
     * The data needed to update a Shipment.
     */
    data: XOR<ShipmentUpdateInput, ShipmentUncheckedUpdateInput>
    /**
     * Choose, which Shipment to update.
     */
    where: ShipmentWhereUniqueInput
  }

  /**
   * Shipment updateMany
   */
  export type ShipmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Shipments.
     */
    data: XOR<ShipmentUpdateManyMutationInput, ShipmentUncheckedUpdateManyInput>
    /**
     * Filter which Shipments to update
     */
    where?: ShipmentWhereInput
  }

  /**
   * Shipment upsert
   */
  export type ShipmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipment
     */
    select?: ShipmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentInclude<ExtArgs> | null
    /**
     * The filter to search for the Shipment to update in case it exists.
     */
    where: ShipmentWhereUniqueInput
    /**
     * In case the Shipment found by the `where` argument doesn't exist, create a new Shipment with this data.
     */
    create: XOR<ShipmentCreateInput, ShipmentUncheckedCreateInput>
    /**
     * In case the Shipment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ShipmentUpdateInput, ShipmentUncheckedUpdateInput>
  }

  /**
   * Shipment delete
   */
  export type ShipmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipment
     */
    select?: ShipmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentInclude<ExtArgs> | null
    /**
     * Filter which Shipment to delete.
     */
    where: ShipmentWhereUniqueInput
  }

  /**
   * Shipment deleteMany
   */
  export type ShipmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Shipments to delete
     */
    where?: ShipmentWhereInput
  }

  /**
   * Shipment.items
   */
  export type Shipment$itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentItem
     */
    select?: ShipmentItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentItemInclude<ExtArgs> | null
    where?: ShipmentItemWhereInput
    orderBy?: ShipmentItemOrderByWithRelationInput | ShipmentItemOrderByWithRelationInput[]
    cursor?: ShipmentItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ShipmentItemScalarFieldEnum | ShipmentItemScalarFieldEnum[]
  }

  /**
   * Shipment.tracking_updates
   */
  export type Shipment$tracking_updatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackingUpdate
     */
    select?: TrackingUpdateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackingUpdateInclude<ExtArgs> | null
    where?: TrackingUpdateWhereInput
    orderBy?: TrackingUpdateOrderByWithRelationInput | TrackingUpdateOrderByWithRelationInput[]
    cursor?: TrackingUpdateWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TrackingUpdateScalarFieldEnum | TrackingUpdateScalarFieldEnum[]
  }

  /**
   * Shipment without action
   */
  export type ShipmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipment
     */
    select?: ShipmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentInclude<ExtArgs> | null
  }


  /**
   * Model ShipmentItem
   */

  export type AggregateShipmentItem = {
    _count: ShipmentItemCountAggregateOutputType | null
    _avg: ShipmentItemAvgAggregateOutputType | null
    _sum: ShipmentItemSumAggregateOutputType | null
    _min: ShipmentItemMinAggregateOutputType | null
    _max: ShipmentItemMaxAggregateOutputType | null
  }

  export type ShipmentItemAvgAggregateOutputType = {
    quantity: number | null
    unit_price: Decimal | null
  }

  export type ShipmentItemSumAggregateOutputType = {
    quantity: number | null
    unit_price: Decimal | null
  }

  export type ShipmentItemMinAggregateOutputType = {
    id: string | null
    shipment_id: string | null
    product_id: string | null
    sku: string | null
    seller_id: string | null
    quantity: number | null
    unit_price: Decimal | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ShipmentItemMaxAggregateOutputType = {
    id: string | null
    shipment_id: string | null
    product_id: string | null
    sku: string | null
    seller_id: string | null
    quantity: number | null
    unit_price: Decimal | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ShipmentItemCountAggregateOutputType = {
    id: number
    shipment_id: number
    product_id: number
    sku: number
    seller_id: number
    quantity: number
    unit_price: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type ShipmentItemAvgAggregateInputType = {
    quantity?: true
    unit_price?: true
  }

  export type ShipmentItemSumAggregateInputType = {
    quantity?: true
    unit_price?: true
  }

  export type ShipmentItemMinAggregateInputType = {
    id?: true
    shipment_id?: true
    product_id?: true
    sku?: true
    seller_id?: true
    quantity?: true
    unit_price?: true
    created_at?: true
    updated_at?: true
  }

  export type ShipmentItemMaxAggregateInputType = {
    id?: true
    shipment_id?: true
    product_id?: true
    sku?: true
    seller_id?: true
    quantity?: true
    unit_price?: true
    created_at?: true
    updated_at?: true
  }

  export type ShipmentItemCountAggregateInputType = {
    id?: true
    shipment_id?: true
    product_id?: true
    sku?: true
    seller_id?: true
    quantity?: true
    unit_price?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type ShipmentItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ShipmentItem to aggregate.
     */
    where?: ShipmentItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShipmentItems to fetch.
     */
    orderBy?: ShipmentItemOrderByWithRelationInput | ShipmentItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ShipmentItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShipmentItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShipmentItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ShipmentItems
    **/
    _count?: true | ShipmentItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ShipmentItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ShipmentItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ShipmentItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ShipmentItemMaxAggregateInputType
  }

  export type GetShipmentItemAggregateType<T extends ShipmentItemAggregateArgs> = {
        [P in keyof T & keyof AggregateShipmentItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateShipmentItem[P]>
      : GetScalarType<T[P], AggregateShipmentItem[P]>
  }




  export type ShipmentItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShipmentItemWhereInput
    orderBy?: ShipmentItemOrderByWithAggregationInput | ShipmentItemOrderByWithAggregationInput[]
    by: ShipmentItemScalarFieldEnum[] | ShipmentItemScalarFieldEnum
    having?: ShipmentItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ShipmentItemCountAggregateInputType | true
    _avg?: ShipmentItemAvgAggregateInputType
    _sum?: ShipmentItemSumAggregateInputType
    _min?: ShipmentItemMinAggregateInputType
    _max?: ShipmentItemMaxAggregateInputType
  }

  export type ShipmentItemGroupByOutputType = {
    id: string
    shipment_id: string
    product_id: string
    sku: string
    seller_id: string | null
    quantity: number
    unit_price: Decimal | null
    created_at: Date
    updated_at: Date
    _count: ShipmentItemCountAggregateOutputType | null
    _avg: ShipmentItemAvgAggregateOutputType | null
    _sum: ShipmentItemSumAggregateOutputType | null
    _min: ShipmentItemMinAggregateOutputType | null
    _max: ShipmentItemMaxAggregateOutputType | null
  }

  type GetShipmentItemGroupByPayload<T extends ShipmentItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ShipmentItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ShipmentItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ShipmentItemGroupByOutputType[P]>
            : GetScalarType<T[P], ShipmentItemGroupByOutputType[P]>
        }
      >
    >


  export type ShipmentItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shipment_id?: boolean
    product_id?: boolean
    sku?: boolean
    seller_id?: boolean
    quantity?: boolean
    unit_price?: boolean
    created_at?: boolean
    updated_at?: boolean
    shipment?: boolean | ShipmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["shipmentItem"]>

  export type ShipmentItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shipment_id?: boolean
    product_id?: boolean
    sku?: boolean
    seller_id?: boolean
    quantity?: boolean
    unit_price?: boolean
    created_at?: boolean
    updated_at?: boolean
    shipment?: boolean | ShipmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["shipmentItem"]>

  export type ShipmentItemSelectScalar = {
    id?: boolean
    shipment_id?: boolean
    product_id?: boolean
    sku?: boolean
    seller_id?: boolean
    quantity?: boolean
    unit_price?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type ShipmentItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    shipment?: boolean | ShipmentDefaultArgs<ExtArgs>
  }
  export type ShipmentItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    shipment?: boolean | ShipmentDefaultArgs<ExtArgs>
  }

  export type $ShipmentItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ShipmentItem"
    objects: {
      shipment: Prisma.$ShipmentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      shipment_id: string
      product_id: string
      sku: string
      seller_id: string | null
      quantity: number
      unit_price: Prisma.Decimal | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["shipmentItem"]>
    composites: {}
  }

  type ShipmentItemGetPayload<S extends boolean | null | undefined | ShipmentItemDefaultArgs> = $Result.GetResult<Prisma.$ShipmentItemPayload, S>

  type ShipmentItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ShipmentItemFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ShipmentItemCountAggregateInputType | true
    }

  export interface ShipmentItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ShipmentItem'], meta: { name: 'ShipmentItem' } }
    /**
     * Find zero or one ShipmentItem that matches the filter.
     * @param {ShipmentItemFindUniqueArgs} args - Arguments to find a ShipmentItem
     * @example
     * // Get one ShipmentItem
     * const shipmentItem = await prisma.shipmentItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ShipmentItemFindUniqueArgs>(args: SelectSubset<T, ShipmentItemFindUniqueArgs<ExtArgs>>): Prisma__ShipmentItemClient<$Result.GetResult<Prisma.$ShipmentItemPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ShipmentItem that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ShipmentItemFindUniqueOrThrowArgs} args - Arguments to find a ShipmentItem
     * @example
     * // Get one ShipmentItem
     * const shipmentItem = await prisma.shipmentItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ShipmentItemFindUniqueOrThrowArgs>(args: SelectSubset<T, ShipmentItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ShipmentItemClient<$Result.GetResult<Prisma.$ShipmentItemPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ShipmentItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentItemFindFirstArgs} args - Arguments to find a ShipmentItem
     * @example
     * // Get one ShipmentItem
     * const shipmentItem = await prisma.shipmentItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ShipmentItemFindFirstArgs>(args?: SelectSubset<T, ShipmentItemFindFirstArgs<ExtArgs>>): Prisma__ShipmentItemClient<$Result.GetResult<Prisma.$ShipmentItemPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ShipmentItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentItemFindFirstOrThrowArgs} args - Arguments to find a ShipmentItem
     * @example
     * // Get one ShipmentItem
     * const shipmentItem = await prisma.shipmentItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ShipmentItemFindFirstOrThrowArgs>(args?: SelectSubset<T, ShipmentItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__ShipmentItemClient<$Result.GetResult<Prisma.$ShipmentItemPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ShipmentItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ShipmentItems
     * const shipmentItems = await prisma.shipmentItem.findMany()
     * 
     * // Get first 10 ShipmentItems
     * const shipmentItems = await prisma.shipmentItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const shipmentItemWithIdOnly = await prisma.shipmentItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ShipmentItemFindManyArgs>(args?: SelectSubset<T, ShipmentItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShipmentItemPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ShipmentItem.
     * @param {ShipmentItemCreateArgs} args - Arguments to create a ShipmentItem.
     * @example
     * // Create one ShipmentItem
     * const ShipmentItem = await prisma.shipmentItem.create({
     *   data: {
     *     // ... data to create a ShipmentItem
     *   }
     * })
     * 
     */
    create<T extends ShipmentItemCreateArgs>(args: SelectSubset<T, ShipmentItemCreateArgs<ExtArgs>>): Prisma__ShipmentItemClient<$Result.GetResult<Prisma.$ShipmentItemPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ShipmentItems.
     * @param {ShipmentItemCreateManyArgs} args - Arguments to create many ShipmentItems.
     * @example
     * // Create many ShipmentItems
     * const shipmentItem = await prisma.shipmentItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ShipmentItemCreateManyArgs>(args?: SelectSubset<T, ShipmentItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ShipmentItems and returns the data saved in the database.
     * @param {ShipmentItemCreateManyAndReturnArgs} args - Arguments to create many ShipmentItems.
     * @example
     * // Create many ShipmentItems
     * const shipmentItem = await prisma.shipmentItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ShipmentItems and only return the `id`
     * const shipmentItemWithIdOnly = await prisma.shipmentItem.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ShipmentItemCreateManyAndReturnArgs>(args?: SelectSubset<T, ShipmentItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShipmentItemPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ShipmentItem.
     * @param {ShipmentItemDeleteArgs} args - Arguments to delete one ShipmentItem.
     * @example
     * // Delete one ShipmentItem
     * const ShipmentItem = await prisma.shipmentItem.delete({
     *   where: {
     *     // ... filter to delete one ShipmentItem
     *   }
     * })
     * 
     */
    delete<T extends ShipmentItemDeleteArgs>(args: SelectSubset<T, ShipmentItemDeleteArgs<ExtArgs>>): Prisma__ShipmentItemClient<$Result.GetResult<Prisma.$ShipmentItemPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ShipmentItem.
     * @param {ShipmentItemUpdateArgs} args - Arguments to update one ShipmentItem.
     * @example
     * // Update one ShipmentItem
     * const shipmentItem = await prisma.shipmentItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ShipmentItemUpdateArgs>(args: SelectSubset<T, ShipmentItemUpdateArgs<ExtArgs>>): Prisma__ShipmentItemClient<$Result.GetResult<Prisma.$ShipmentItemPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ShipmentItems.
     * @param {ShipmentItemDeleteManyArgs} args - Arguments to filter ShipmentItems to delete.
     * @example
     * // Delete a few ShipmentItems
     * const { count } = await prisma.shipmentItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ShipmentItemDeleteManyArgs>(args?: SelectSubset<T, ShipmentItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ShipmentItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ShipmentItems
     * const shipmentItem = await prisma.shipmentItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ShipmentItemUpdateManyArgs>(args: SelectSubset<T, ShipmentItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ShipmentItem.
     * @param {ShipmentItemUpsertArgs} args - Arguments to update or create a ShipmentItem.
     * @example
     * // Update or create a ShipmentItem
     * const shipmentItem = await prisma.shipmentItem.upsert({
     *   create: {
     *     // ... data to create a ShipmentItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ShipmentItem we want to update
     *   }
     * })
     */
    upsert<T extends ShipmentItemUpsertArgs>(args: SelectSubset<T, ShipmentItemUpsertArgs<ExtArgs>>): Prisma__ShipmentItemClient<$Result.GetResult<Prisma.$ShipmentItemPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ShipmentItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentItemCountArgs} args - Arguments to filter ShipmentItems to count.
     * @example
     * // Count the number of ShipmentItems
     * const count = await prisma.shipmentItem.count({
     *   where: {
     *     // ... the filter for the ShipmentItems we want to count
     *   }
     * })
    **/
    count<T extends ShipmentItemCountArgs>(
      args?: Subset<T, ShipmentItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ShipmentItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ShipmentItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ShipmentItemAggregateArgs>(args: Subset<T, ShipmentItemAggregateArgs>): Prisma.PrismaPromise<GetShipmentItemAggregateType<T>>

    /**
     * Group by ShipmentItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ShipmentItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ShipmentItemGroupByArgs['orderBy'] }
        : { orderBy?: ShipmentItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ShipmentItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetShipmentItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ShipmentItem model
   */
  readonly fields: ShipmentItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ShipmentItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ShipmentItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    shipment<T extends ShipmentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ShipmentDefaultArgs<ExtArgs>>): Prisma__ShipmentClient<$Result.GetResult<Prisma.$ShipmentPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ShipmentItem model
   */ 
  interface ShipmentItemFieldRefs {
    readonly id: FieldRef<"ShipmentItem", 'String'>
    readonly shipment_id: FieldRef<"ShipmentItem", 'String'>
    readonly product_id: FieldRef<"ShipmentItem", 'String'>
    readonly sku: FieldRef<"ShipmentItem", 'String'>
    readonly seller_id: FieldRef<"ShipmentItem", 'String'>
    readonly quantity: FieldRef<"ShipmentItem", 'Int'>
    readonly unit_price: FieldRef<"ShipmentItem", 'Decimal'>
    readonly created_at: FieldRef<"ShipmentItem", 'DateTime'>
    readonly updated_at: FieldRef<"ShipmentItem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ShipmentItem findUnique
   */
  export type ShipmentItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentItem
     */
    select?: ShipmentItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentItemInclude<ExtArgs> | null
    /**
     * Filter, which ShipmentItem to fetch.
     */
    where: ShipmentItemWhereUniqueInput
  }

  /**
   * ShipmentItem findUniqueOrThrow
   */
  export type ShipmentItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentItem
     */
    select?: ShipmentItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentItemInclude<ExtArgs> | null
    /**
     * Filter, which ShipmentItem to fetch.
     */
    where: ShipmentItemWhereUniqueInput
  }

  /**
   * ShipmentItem findFirst
   */
  export type ShipmentItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentItem
     */
    select?: ShipmentItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentItemInclude<ExtArgs> | null
    /**
     * Filter, which ShipmentItem to fetch.
     */
    where?: ShipmentItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShipmentItems to fetch.
     */
    orderBy?: ShipmentItemOrderByWithRelationInput | ShipmentItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ShipmentItems.
     */
    cursor?: ShipmentItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShipmentItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShipmentItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ShipmentItems.
     */
    distinct?: ShipmentItemScalarFieldEnum | ShipmentItemScalarFieldEnum[]
  }

  /**
   * ShipmentItem findFirstOrThrow
   */
  export type ShipmentItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentItem
     */
    select?: ShipmentItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentItemInclude<ExtArgs> | null
    /**
     * Filter, which ShipmentItem to fetch.
     */
    where?: ShipmentItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShipmentItems to fetch.
     */
    orderBy?: ShipmentItemOrderByWithRelationInput | ShipmentItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ShipmentItems.
     */
    cursor?: ShipmentItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShipmentItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShipmentItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ShipmentItems.
     */
    distinct?: ShipmentItemScalarFieldEnum | ShipmentItemScalarFieldEnum[]
  }

  /**
   * ShipmentItem findMany
   */
  export type ShipmentItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentItem
     */
    select?: ShipmentItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentItemInclude<ExtArgs> | null
    /**
     * Filter, which ShipmentItems to fetch.
     */
    where?: ShipmentItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShipmentItems to fetch.
     */
    orderBy?: ShipmentItemOrderByWithRelationInput | ShipmentItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ShipmentItems.
     */
    cursor?: ShipmentItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShipmentItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShipmentItems.
     */
    skip?: number
    distinct?: ShipmentItemScalarFieldEnum | ShipmentItemScalarFieldEnum[]
  }

  /**
   * ShipmentItem create
   */
  export type ShipmentItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentItem
     */
    select?: ShipmentItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentItemInclude<ExtArgs> | null
    /**
     * The data needed to create a ShipmentItem.
     */
    data: XOR<ShipmentItemCreateInput, ShipmentItemUncheckedCreateInput>
  }

  /**
   * ShipmentItem createMany
   */
  export type ShipmentItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ShipmentItems.
     */
    data: ShipmentItemCreateManyInput | ShipmentItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ShipmentItem createManyAndReturn
   */
  export type ShipmentItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentItem
     */
    select?: ShipmentItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ShipmentItems.
     */
    data: ShipmentItemCreateManyInput | ShipmentItemCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ShipmentItem update
   */
  export type ShipmentItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentItem
     */
    select?: ShipmentItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentItemInclude<ExtArgs> | null
    /**
     * The data needed to update a ShipmentItem.
     */
    data: XOR<ShipmentItemUpdateInput, ShipmentItemUncheckedUpdateInput>
    /**
     * Choose, which ShipmentItem to update.
     */
    where: ShipmentItemWhereUniqueInput
  }

  /**
   * ShipmentItem updateMany
   */
  export type ShipmentItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ShipmentItems.
     */
    data: XOR<ShipmentItemUpdateManyMutationInput, ShipmentItemUncheckedUpdateManyInput>
    /**
     * Filter which ShipmentItems to update
     */
    where?: ShipmentItemWhereInput
  }

  /**
   * ShipmentItem upsert
   */
  export type ShipmentItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentItem
     */
    select?: ShipmentItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentItemInclude<ExtArgs> | null
    /**
     * The filter to search for the ShipmentItem to update in case it exists.
     */
    where: ShipmentItemWhereUniqueInput
    /**
     * In case the ShipmentItem found by the `where` argument doesn't exist, create a new ShipmentItem with this data.
     */
    create: XOR<ShipmentItemCreateInput, ShipmentItemUncheckedCreateInput>
    /**
     * In case the ShipmentItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ShipmentItemUpdateInput, ShipmentItemUncheckedUpdateInput>
  }

  /**
   * ShipmentItem delete
   */
  export type ShipmentItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentItem
     */
    select?: ShipmentItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentItemInclude<ExtArgs> | null
    /**
     * Filter which ShipmentItem to delete.
     */
    where: ShipmentItemWhereUniqueInput
  }

  /**
   * ShipmentItem deleteMany
   */
  export type ShipmentItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ShipmentItems to delete
     */
    where?: ShipmentItemWhereInput
  }

  /**
   * ShipmentItem without action
   */
  export type ShipmentItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentItem
     */
    select?: ShipmentItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentItemInclude<ExtArgs> | null
  }


  /**
   * Model TrackingUpdate
   */

  export type AggregateTrackingUpdate = {
    _count: TrackingUpdateCountAggregateOutputType | null
    _min: TrackingUpdateMinAggregateOutputType | null
    _max: TrackingUpdateMaxAggregateOutputType | null
  }

  export type TrackingUpdateMinAggregateOutputType = {
    id: string | null
    shipment_id: string | null
    status: $Enums.ShipmentStatus | null
    location: string | null
    description: string | null
    recorded_by: string | null
    recorded_at: Date | null
  }

  export type TrackingUpdateMaxAggregateOutputType = {
    id: string | null
    shipment_id: string | null
    status: $Enums.ShipmentStatus | null
    location: string | null
    description: string | null
    recorded_by: string | null
    recorded_at: Date | null
  }

  export type TrackingUpdateCountAggregateOutputType = {
    id: number
    shipment_id: number
    status: number
    location: number
    description: number
    recorded_by: number
    recorded_at: number
    _all: number
  }


  export type TrackingUpdateMinAggregateInputType = {
    id?: true
    shipment_id?: true
    status?: true
    location?: true
    description?: true
    recorded_by?: true
    recorded_at?: true
  }

  export type TrackingUpdateMaxAggregateInputType = {
    id?: true
    shipment_id?: true
    status?: true
    location?: true
    description?: true
    recorded_by?: true
    recorded_at?: true
  }

  export type TrackingUpdateCountAggregateInputType = {
    id?: true
    shipment_id?: true
    status?: true
    location?: true
    description?: true
    recorded_by?: true
    recorded_at?: true
    _all?: true
  }

  export type TrackingUpdateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TrackingUpdate to aggregate.
     */
    where?: TrackingUpdateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrackingUpdates to fetch.
     */
    orderBy?: TrackingUpdateOrderByWithRelationInput | TrackingUpdateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TrackingUpdateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrackingUpdates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrackingUpdates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TrackingUpdates
    **/
    _count?: true | TrackingUpdateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TrackingUpdateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TrackingUpdateMaxAggregateInputType
  }

  export type GetTrackingUpdateAggregateType<T extends TrackingUpdateAggregateArgs> = {
        [P in keyof T & keyof AggregateTrackingUpdate]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTrackingUpdate[P]>
      : GetScalarType<T[P], AggregateTrackingUpdate[P]>
  }




  export type TrackingUpdateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TrackingUpdateWhereInput
    orderBy?: TrackingUpdateOrderByWithAggregationInput | TrackingUpdateOrderByWithAggregationInput[]
    by: TrackingUpdateScalarFieldEnum[] | TrackingUpdateScalarFieldEnum
    having?: TrackingUpdateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TrackingUpdateCountAggregateInputType | true
    _min?: TrackingUpdateMinAggregateInputType
    _max?: TrackingUpdateMaxAggregateInputType
  }

  export type TrackingUpdateGroupByOutputType = {
    id: string
    shipment_id: string
    status: $Enums.ShipmentStatus
    location: string | null
    description: string
    recorded_by: string | null
    recorded_at: Date
    _count: TrackingUpdateCountAggregateOutputType | null
    _min: TrackingUpdateMinAggregateOutputType | null
    _max: TrackingUpdateMaxAggregateOutputType | null
  }

  type GetTrackingUpdateGroupByPayload<T extends TrackingUpdateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TrackingUpdateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TrackingUpdateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TrackingUpdateGroupByOutputType[P]>
            : GetScalarType<T[P], TrackingUpdateGroupByOutputType[P]>
        }
      >
    >


  export type TrackingUpdateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shipment_id?: boolean
    status?: boolean
    location?: boolean
    description?: boolean
    recorded_by?: boolean
    recorded_at?: boolean
    shipment?: boolean | ShipmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trackingUpdate"]>

  export type TrackingUpdateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shipment_id?: boolean
    status?: boolean
    location?: boolean
    description?: boolean
    recorded_by?: boolean
    recorded_at?: boolean
    shipment?: boolean | ShipmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trackingUpdate"]>

  export type TrackingUpdateSelectScalar = {
    id?: boolean
    shipment_id?: boolean
    status?: boolean
    location?: boolean
    description?: boolean
    recorded_by?: boolean
    recorded_at?: boolean
  }

  export type TrackingUpdateInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    shipment?: boolean | ShipmentDefaultArgs<ExtArgs>
  }
  export type TrackingUpdateIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    shipment?: boolean | ShipmentDefaultArgs<ExtArgs>
  }

  export type $TrackingUpdatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TrackingUpdate"
    objects: {
      shipment: Prisma.$ShipmentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      shipment_id: string
      status: $Enums.ShipmentStatus
      location: string | null
      description: string
      recorded_by: string | null
      recorded_at: Date
    }, ExtArgs["result"]["trackingUpdate"]>
    composites: {}
  }

  type TrackingUpdateGetPayload<S extends boolean | null | undefined | TrackingUpdateDefaultArgs> = $Result.GetResult<Prisma.$TrackingUpdatePayload, S>

  type TrackingUpdateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TrackingUpdateFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TrackingUpdateCountAggregateInputType | true
    }

  export interface TrackingUpdateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TrackingUpdate'], meta: { name: 'TrackingUpdate' } }
    /**
     * Find zero or one TrackingUpdate that matches the filter.
     * @param {TrackingUpdateFindUniqueArgs} args - Arguments to find a TrackingUpdate
     * @example
     * // Get one TrackingUpdate
     * const trackingUpdate = await prisma.trackingUpdate.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TrackingUpdateFindUniqueArgs>(args: SelectSubset<T, TrackingUpdateFindUniqueArgs<ExtArgs>>): Prisma__TrackingUpdateClient<$Result.GetResult<Prisma.$TrackingUpdatePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one TrackingUpdate that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TrackingUpdateFindUniqueOrThrowArgs} args - Arguments to find a TrackingUpdate
     * @example
     * // Get one TrackingUpdate
     * const trackingUpdate = await prisma.trackingUpdate.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TrackingUpdateFindUniqueOrThrowArgs>(args: SelectSubset<T, TrackingUpdateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TrackingUpdateClient<$Result.GetResult<Prisma.$TrackingUpdatePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first TrackingUpdate that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackingUpdateFindFirstArgs} args - Arguments to find a TrackingUpdate
     * @example
     * // Get one TrackingUpdate
     * const trackingUpdate = await prisma.trackingUpdate.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TrackingUpdateFindFirstArgs>(args?: SelectSubset<T, TrackingUpdateFindFirstArgs<ExtArgs>>): Prisma__TrackingUpdateClient<$Result.GetResult<Prisma.$TrackingUpdatePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first TrackingUpdate that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackingUpdateFindFirstOrThrowArgs} args - Arguments to find a TrackingUpdate
     * @example
     * // Get one TrackingUpdate
     * const trackingUpdate = await prisma.trackingUpdate.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TrackingUpdateFindFirstOrThrowArgs>(args?: SelectSubset<T, TrackingUpdateFindFirstOrThrowArgs<ExtArgs>>): Prisma__TrackingUpdateClient<$Result.GetResult<Prisma.$TrackingUpdatePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more TrackingUpdates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackingUpdateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TrackingUpdates
     * const trackingUpdates = await prisma.trackingUpdate.findMany()
     * 
     * // Get first 10 TrackingUpdates
     * const trackingUpdates = await prisma.trackingUpdate.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const trackingUpdateWithIdOnly = await prisma.trackingUpdate.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TrackingUpdateFindManyArgs>(args?: SelectSubset<T, TrackingUpdateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrackingUpdatePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a TrackingUpdate.
     * @param {TrackingUpdateCreateArgs} args - Arguments to create a TrackingUpdate.
     * @example
     * // Create one TrackingUpdate
     * const TrackingUpdate = await prisma.trackingUpdate.create({
     *   data: {
     *     // ... data to create a TrackingUpdate
     *   }
     * })
     * 
     */
    create<T extends TrackingUpdateCreateArgs>(args: SelectSubset<T, TrackingUpdateCreateArgs<ExtArgs>>): Prisma__TrackingUpdateClient<$Result.GetResult<Prisma.$TrackingUpdatePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many TrackingUpdates.
     * @param {TrackingUpdateCreateManyArgs} args - Arguments to create many TrackingUpdates.
     * @example
     * // Create many TrackingUpdates
     * const trackingUpdate = await prisma.trackingUpdate.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TrackingUpdateCreateManyArgs>(args?: SelectSubset<T, TrackingUpdateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TrackingUpdates and returns the data saved in the database.
     * @param {TrackingUpdateCreateManyAndReturnArgs} args - Arguments to create many TrackingUpdates.
     * @example
     * // Create many TrackingUpdates
     * const trackingUpdate = await prisma.trackingUpdate.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TrackingUpdates and only return the `id`
     * const trackingUpdateWithIdOnly = await prisma.trackingUpdate.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TrackingUpdateCreateManyAndReturnArgs>(args?: SelectSubset<T, TrackingUpdateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrackingUpdatePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a TrackingUpdate.
     * @param {TrackingUpdateDeleteArgs} args - Arguments to delete one TrackingUpdate.
     * @example
     * // Delete one TrackingUpdate
     * const TrackingUpdate = await prisma.trackingUpdate.delete({
     *   where: {
     *     // ... filter to delete one TrackingUpdate
     *   }
     * })
     * 
     */
    delete<T extends TrackingUpdateDeleteArgs>(args: SelectSubset<T, TrackingUpdateDeleteArgs<ExtArgs>>): Prisma__TrackingUpdateClient<$Result.GetResult<Prisma.$TrackingUpdatePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one TrackingUpdate.
     * @param {TrackingUpdateUpdateArgs} args - Arguments to update one TrackingUpdate.
     * @example
     * // Update one TrackingUpdate
     * const trackingUpdate = await prisma.trackingUpdate.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TrackingUpdateUpdateArgs>(args: SelectSubset<T, TrackingUpdateUpdateArgs<ExtArgs>>): Prisma__TrackingUpdateClient<$Result.GetResult<Prisma.$TrackingUpdatePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more TrackingUpdates.
     * @param {TrackingUpdateDeleteManyArgs} args - Arguments to filter TrackingUpdates to delete.
     * @example
     * // Delete a few TrackingUpdates
     * const { count } = await prisma.trackingUpdate.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TrackingUpdateDeleteManyArgs>(args?: SelectSubset<T, TrackingUpdateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TrackingUpdates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackingUpdateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TrackingUpdates
     * const trackingUpdate = await prisma.trackingUpdate.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TrackingUpdateUpdateManyArgs>(args: SelectSubset<T, TrackingUpdateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TrackingUpdate.
     * @param {TrackingUpdateUpsertArgs} args - Arguments to update or create a TrackingUpdate.
     * @example
     * // Update or create a TrackingUpdate
     * const trackingUpdate = await prisma.trackingUpdate.upsert({
     *   create: {
     *     // ... data to create a TrackingUpdate
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TrackingUpdate we want to update
     *   }
     * })
     */
    upsert<T extends TrackingUpdateUpsertArgs>(args: SelectSubset<T, TrackingUpdateUpsertArgs<ExtArgs>>): Prisma__TrackingUpdateClient<$Result.GetResult<Prisma.$TrackingUpdatePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of TrackingUpdates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackingUpdateCountArgs} args - Arguments to filter TrackingUpdates to count.
     * @example
     * // Count the number of TrackingUpdates
     * const count = await prisma.trackingUpdate.count({
     *   where: {
     *     // ... the filter for the TrackingUpdates we want to count
     *   }
     * })
    **/
    count<T extends TrackingUpdateCountArgs>(
      args?: Subset<T, TrackingUpdateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TrackingUpdateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TrackingUpdate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackingUpdateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TrackingUpdateAggregateArgs>(args: Subset<T, TrackingUpdateAggregateArgs>): Prisma.PrismaPromise<GetTrackingUpdateAggregateType<T>>

    /**
     * Group by TrackingUpdate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackingUpdateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TrackingUpdateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TrackingUpdateGroupByArgs['orderBy'] }
        : { orderBy?: TrackingUpdateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TrackingUpdateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTrackingUpdateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TrackingUpdate model
   */
  readonly fields: TrackingUpdateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TrackingUpdate.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TrackingUpdateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    shipment<T extends ShipmentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ShipmentDefaultArgs<ExtArgs>>): Prisma__ShipmentClient<$Result.GetResult<Prisma.$ShipmentPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TrackingUpdate model
   */ 
  interface TrackingUpdateFieldRefs {
    readonly id: FieldRef<"TrackingUpdate", 'String'>
    readonly shipment_id: FieldRef<"TrackingUpdate", 'String'>
    readonly status: FieldRef<"TrackingUpdate", 'ShipmentStatus'>
    readonly location: FieldRef<"TrackingUpdate", 'String'>
    readonly description: FieldRef<"TrackingUpdate", 'String'>
    readonly recorded_by: FieldRef<"TrackingUpdate", 'String'>
    readonly recorded_at: FieldRef<"TrackingUpdate", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TrackingUpdate findUnique
   */
  export type TrackingUpdateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackingUpdate
     */
    select?: TrackingUpdateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackingUpdateInclude<ExtArgs> | null
    /**
     * Filter, which TrackingUpdate to fetch.
     */
    where: TrackingUpdateWhereUniqueInput
  }

  /**
   * TrackingUpdate findUniqueOrThrow
   */
  export type TrackingUpdateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackingUpdate
     */
    select?: TrackingUpdateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackingUpdateInclude<ExtArgs> | null
    /**
     * Filter, which TrackingUpdate to fetch.
     */
    where: TrackingUpdateWhereUniqueInput
  }

  /**
   * TrackingUpdate findFirst
   */
  export type TrackingUpdateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackingUpdate
     */
    select?: TrackingUpdateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackingUpdateInclude<ExtArgs> | null
    /**
     * Filter, which TrackingUpdate to fetch.
     */
    where?: TrackingUpdateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrackingUpdates to fetch.
     */
    orderBy?: TrackingUpdateOrderByWithRelationInput | TrackingUpdateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TrackingUpdates.
     */
    cursor?: TrackingUpdateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrackingUpdates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrackingUpdates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrackingUpdates.
     */
    distinct?: TrackingUpdateScalarFieldEnum | TrackingUpdateScalarFieldEnum[]
  }

  /**
   * TrackingUpdate findFirstOrThrow
   */
  export type TrackingUpdateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackingUpdate
     */
    select?: TrackingUpdateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackingUpdateInclude<ExtArgs> | null
    /**
     * Filter, which TrackingUpdate to fetch.
     */
    where?: TrackingUpdateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrackingUpdates to fetch.
     */
    orderBy?: TrackingUpdateOrderByWithRelationInput | TrackingUpdateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TrackingUpdates.
     */
    cursor?: TrackingUpdateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrackingUpdates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrackingUpdates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrackingUpdates.
     */
    distinct?: TrackingUpdateScalarFieldEnum | TrackingUpdateScalarFieldEnum[]
  }

  /**
   * TrackingUpdate findMany
   */
  export type TrackingUpdateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackingUpdate
     */
    select?: TrackingUpdateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackingUpdateInclude<ExtArgs> | null
    /**
     * Filter, which TrackingUpdates to fetch.
     */
    where?: TrackingUpdateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrackingUpdates to fetch.
     */
    orderBy?: TrackingUpdateOrderByWithRelationInput | TrackingUpdateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TrackingUpdates.
     */
    cursor?: TrackingUpdateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrackingUpdates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrackingUpdates.
     */
    skip?: number
    distinct?: TrackingUpdateScalarFieldEnum | TrackingUpdateScalarFieldEnum[]
  }

  /**
   * TrackingUpdate create
   */
  export type TrackingUpdateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackingUpdate
     */
    select?: TrackingUpdateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackingUpdateInclude<ExtArgs> | null
    /**
     * The data needed to create a TrackingUpdate.
     */
    data: XOR<TrackingUpdateCreateInput, TrackingUpdateUncheckedCreateInput>
  }

  /**
   * TrackingUpdate createMany
   */
  export type TrackingUpdateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TrackingUpdates.
     */
    data: TrackingUpdateCreateManyInput | TrackingUpdateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TrackingUpdate createManyAndReturn
   */
  export type TrackingUpdateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackingUpdate
     */
    select?: TrackingUpdateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many TrackingUpdates.
     */
    data: TrackingUpdateCreateManyInput | TrackingUpdateCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackingUpdateIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TrackingUpdate update
   */
  export type TrackingUpdateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackingUpdate
     */
    select?: TrackingUpdateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackingUpdateInclude<ExtArgs> | null
    /**
     * The data needed to update a TrackingUpdate.
     */
    data: XOR<TrackingUpdateUpdateInput, TrackingUpdateUncheckedUpdateInput>
    /**
     * Choose, which TrackingUpdate to update.
     */
    where: TrackingUpdateWhereUniqueInput
  }

  /**
   * TrackingUpdate updateMany
   */
  export type TrackingUpdateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TrackingUpdates.
     */
    data: XOR<TrackingUpdateUpdateManyMutationInput, TrackingUpdateUncheckedUpdateManyInput>
    /**
     * Filter which TrackingUpdates to update
     */
    where?: TrackingUpdateWhereInput
  }

  /**
   * TrackingUpdate upsert
   */
  export type TrackingUpdateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackingUpdate
     */
    select?: TrackingUpdateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackingUpdateInclude<ExtArgs> | null
    /**
     * The filter to search for the TrackingUpdate to update in case it exists.
     */
    where: TrackingUpdateWhereUniqueInput
    /**
     * In case the TrackingUpdate found by the `where` argument doesn't exist, create a new TrackingUpdate with this data.
     */
    create: XOR<TrackingUpdateCreateInput, TrackingUpdateUncheckedCreateInput>
    /**
     * In case the TrackingUpdate was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TrackingUpdateUpdateInput, TrackingUpdateUncheckedUpdateInput>
  }

  /**
   * TrackingUpdate delete
   */
  export type TrackingUpdateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackingUpdate
     */
    select?: TrackingUpdateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackingUpdateInclude<ExtArgs> | null
    /**
     * Filter which TrackingUpdate to delete.
     */
    where: TrackingUpdateWhereUniqueInput
  }

  /**
   * TrackingUpdate deleteMany
   */
  export type TrackingUpdateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TrackingUpdates to delete
     */
    where?: TrackingUpdateWhereInput
  }

  /**
   * TrackingUpdate without action
   */
  export type TrackingUpdateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackingUpdate
     */
    select?: TrackingUpdateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackingUpdateInclude<ExtArgs> | null
  }


  /**
   * Model ReturnPickup
   */

  export type AggregateReturnPickup = {
    _count: ReturnPickupCountAggregateOutputType | null
    _min: ReturnPickupMinAggregateOutputType | null
    _max: ReturnPickupMaxAggregateOutputType | null
  }

  export type ReturnPickupMinAggregateOutputType = {
    id: string | null
    return_number: string | null
    order_id: string | null
    user_id: string | null
    warehouse_id: string | null
    status: $Enums.ReturnPickupStatus | null
    courier_code: $Enums.CourierCode | null
    return_tracking_number: string | null
    scheduled_pickup_date: Date | null
    picked_up_at: Date | null
    received_at: Date | null
    completed_at: Date | null
    pop_signature: string | null
    pop_received_by: string | null
    cancellation_reason: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ReturnPickupMaxAggregateOutputType = {
    id: string | null
    return_number: string | null
    order_id: string | null
    user_id: string | null
    warehouse_id: string | null
    status: $Enums.ReturnPickupStatus | null
    courier_code: $Enums.CourierCode | null
    return_tracking_number: string | null
    scheduled_pickup_date: Date | null
    picked_up_at: Date | null
    received_at: Date | null
    completed_at: Date | null
    pop_signature: string | null
    pop_received_by: string | null
    cancellation_reason: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ReturnPickupCountAggregateOutputType = {
    id: number
    return_number: number
    order_id: number
    user_id: number
    warehouse_id: number
    status: number
    courier_code: number
    return_tracking_number: number
    pickup_address: number
    scheduled_pickup_date: number
    picked_up_at: number
    received_at: number
    completed_at: number
    pop_signature: number
    pop_received_by: number
    cancellation_reason: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type ReturnPickupMinAggregateInputType = {
    id?: true
    return_number?: true
    order_id?: true
    user_id?: true
    warehouse_id?: true
    status?: true
    courier_code?: true
    return_tracking_number?: true
    scheduled_pickup_date?: true
    picked_up_at?: true
    received_at?: true
    completed_at?: true
    pop_signature?: true
    pop_received_by?: true
    cancellation_reason?: true
    created_at?: true
    updated_at?: true
  }

  export type ReturnPickupMaxAggregateInputType = {
    id?: true
    return_number?: true
    order_id?: true
    user_id?: true
    warehouse_id?: true
    status?: true
    courier_code?: true
    return_tracking_number?: true
    scheduled_pickup_date?: true
    picked_up_at?: true
    received_at?: true
    completed_at?: true
    pop_signature?: true
    pop_received_by?: true
    cancellation_reason?: true
    created_at?: true
    updated_at?: true
  }

  export type ReturnPickupCountAggregateInputType = {
    id?: true
    return_number?: true
    order_id?: true
    user_id?: true
    warehouse_id?: true
    status?: true
    courier_code?: true
    return_tracking_number?: true
    pickup_address?: true
    scheduled_pickup_date?: true
    picked_up_at?: true
    received_at?: true
    completed_at?: true
    pop_signature?: true
    pop_received_by?: true
    cancellation_reason?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type ReturnPickupAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReturnPickup to aggregate.
     */
    where?: ReturnPickupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReturnPickups to fetch.
     */
    orderBy?: ReturnPickupOrderByWithRelationInput | ReturnPickupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReturnPickupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReturnPickups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReturnPickups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ReturnPickups
    **/
    _count?: true | ReturnPickupCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReturnPickupMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReturnPickupMaxAggregateInputType
  }

  export type GetReturnPickupAggregateType<T extends ReturnPickupAggregateArgs> = {
        [P in keyof T & keyof AggregateReturnPickup]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReturnPickup[P]>
      : GetScalarType<T[P], AggregateReturnPickup[P]>
  }




  export type ReturnPickupGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReturnPickupWhereInput
    orderBy?: ReturnPickupOrderByWithAggregationInput | ReturnPickupOrderByWithAggregationInput[]
    by: ReturnPickupScalarFieldEnum[] | ReturnPickupScalarFieldEnum
    having?: ReturnPickupScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReturnPickupCountAggregateInputType | true
    _min?: ReturnPickupMinAggregateInputType
    _max?: ReturnPickupMaxAggregateInputType
  }

  export type ReturnPickupGroupByOutputType = {
    id: string
    return_number: string
    order_id: string
    user_id: string
    warehouse_id: string
    status: $Enums.ReturnPickupStatus
    courier_code: $Enums.CourierCode
    return_tracking_number: string | null
    pickup_address: JsonValue
    scheduled_pickup_date: Date | null
    picked_up_at: Date | null
    received_at: Date | null
    completed_at: Date | null
    pop_signature: string | null
    pop_received_by: string | null
    cancellation_reason: string | null
    created_at: Date
    updated_at: Date
    _count: ReturnPickupCountAggregateOutputType | null
    _min: ReturnPickupMinAggregateOutputType | null
    _max: ReturnPickupMaxAggregateOutputType | null
  }

  type GetReturnPickupGroupByPayload<T extends ReturnPickupGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReturnPickupGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReturnPickupGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReturnPickupGroupByOutputType[P]>
            : GetScalarType<T[P], ReturnPickupGroupByOutputType[P]>
        }
      >
    >


  export type ReturnPickupSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    return_number?: boolean
    order_id?: boolean
    user_id?: boolean
    warehouse_id?: boolean
    status?: boolean
    courier_code?: boolean
    return_tracking_number?: boolean
    pickup_address?: boolean
    scheduled_pickup_date?: boolean
    picked_up_at?: boolean
    received_at?: boolean
    completed_at?: boolean
    pop_signature?: boolean
    pop_received_by?: boolean
    cancellation_reason?: boolean
    created_at?: boolean
    updated_at?: boolean
    warehouse?: boolean | WarehouseDefaultArgs<ExtArgs>
    items?: boolean | ReturnPickup$itemsArgs<ExtArgs>
    tracking_updates?: boolean | ReturnPickup$tracking_updatesArgs<ExtArgs>
    _count?: boolean | ReturnPickupCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["returnPickup"]>

  export type ReturnPickupSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    return_number?: boolean
    order_id?: boolean
    user_id?: boolean
    warehouse_id?: boolean
    status?: boolean
    courier_code?: boolean
    return_tracking_number?: boolean
    pickup_address?: boolean
    scheduled_pickup_date?: boolean
    picked_up_at?: boolean
    received_at?: boolean
    completed_at?: boolean
    pop_signature?: boolean
    pop_received_by?: boolean
    cancellation_reason?: boolean
    created_at?: boolean
    updated_at?: boolean
    warehouse?: boolean | WarehouseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["returnPickup"]>

  export type ReturnPickupSelectScalar = {
    id?: boolean
    return_number?: boolean
    order_id?: boolean
    user_id?: boolean
    warehouse_id?: boolean
    status?: boolean
    courier_code?: boolean
    return_tracking_number?: boolean
    pickup_address?: boolean
    scheduled_pickup_date?: boolean
    picked_up_at?: boolean
    received_at?: boolean
    completed_at?: boolean
    pop_signature?: boolean
    pop_received_by?: boolean
    cancellation_reason?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type ReturnPickupInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    warehouse?: boolean | WarehouseDefaultArgs<ExtArgs>
    items?: boolean | ReturnPickup$itemsArgs<ExtArgs>
    tracking_updates?: boolean | ReturnPickup$tracking_updatesArgs<ExtArgs>
    _count?: boolean | ReturnPickupCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ReturnPickupIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    warehouse?: boolean | WarehouseDefaultArgs<ExtArgs>
  }

  export type $ReturnPickupPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ReturnPickup"
    objects: {
      warehouse: Prisma.$WarehousePayload<ExtArgs>
      items: Prisma.$ReturnItemPayload<ExtArgs>[]
      tracking_updates: Prisma.$ReturnTrackingUpdatePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      return_number: string
      order_id: string
      user_id: string
      warehouse_id: string
      status: $Enums.ReturnPickupStatus
      courier_code: $Enums.CourierCode
      return_tracking_number: string | null
      pickup_address: Prisma.JsonValue
      scheduled_pickup_date: Date | null
      picked_up_at: Date | null
      received_at: Date | null
      completed_at: Date | null
      pop_signature: string | null
      pop_received_by: string | null
      cancellation_reason: string | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["returnPickup"]>
    composites: {}
  }

  type ReturnPickupGetPayload<S extends boolean | null | undefined | ReturnPickupDefaultArgs> = $Result.GetResult<Prisma.$ReturnPickupPayload, S>

  type ReturnPickupCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ReturnPickupFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ReturnPickupCountAggregateInputType | true
    }

  export interface ReturnPickupDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ReturnPickup'], meta: { name: 'ReturnPickup' } }
    /**
     * Find zero or one ReturnPickup that matches the filter.
     * @param {ReturnPickupFindUniqueArgs} args - Arguments to find a ReturnPickup
     * @example
     * // Get one ReturnPickup
     * const returnPickup = await prisma.returnPickup.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReturnPickupFindUniqueArgs>(args: SelectSubset<T, ReturnPickupFindUniqueArgs<ExtArgs>>): Prisma__ReturnPickupClient<$Result.GetResult<Prisma.$ReturnPickupPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ReturnPickup that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ReturnPickupFindUniqueOrThrowArgs} args - Arguments to find a ReturnPickup
     * @example
     * // Get one ReturnPickup
     * const returnPickup = await prisma.returnPickup.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReturnPickupFindUniqueOrThrowArgs>(args: SelectSubset<T, ReturnPickupFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReturnPickupClient<$Result.GetResult<Prisma.$ReturnPickupPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ReturnPickup that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReturnPickupFindFirstArgs} args - Arguments to find a ReturnPickup
     * @example
     * // Get one ReturnPickup
     * const returnPickup = await prisma.returnPickup.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReturnPickupFindFirstArgs>(args?: SelectSubset<T, ReturnPickupFindFirstArgs<ExtArgs>>): Prisma__ReturnPickupClient<$Result.GetResult<Prisma.$ReturnPickupPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ReturnPickup that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReturnPickupFindFirstOrThrowArgs} args - Arguments to find a ReturnPickup
     * @example
     * // Get one ReturnPickup
     * const returnPickup = await prisma.returnPickup.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReturnPickupFindFirstOrThrowArgs>(args?: SelectSubset<T, ReturnPickupFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReturnPickupClient<$Result.GetResult<Prisma.$ReturnPickupPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ReturnPickups that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReturnPickupFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ReturnPickups
     * const returnPickups = await prisma.returnPickup.findMany()
     * 
     * // Get first 10 ReturnPickups
     * const returnPickups = await prisma.returnPickup.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const returnPickupWithIdOnly = await prisma.returnPickup.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReturnPickupFindManyArgs>(args?: SelectSubset<T, ReturnPickupFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReturnPickupPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ReturnPickup.
     * @param {ReturnPickupCreateArgs} args - Arguments to create a ReturnPickup.
     * @example
     * // Create one ReturnPickup
     * const ReturnPickup = await prisma.returnPickup.create({
     *   data: {
     *     // ... data to create a ReturnPickup
     *   }
     * })
     * 
     */
    create<T extends ReturnPickupCreateArgs>(args: SelectSubset<T, ReturnPickupCreateArgs<ExtArgs>>): Prisma__ReturnPickupClient<$Result.GetResult<Prisma.$ReturnPickupPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ReturnPickups.
     * @param {ReturnPickupCreateManyArgs} args - Arguments to create many ReturnPickups.
     * @example
     * // Create many ReturnPickups
     * const returnPickup = await prisma.returnPickup.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReturnPickupCreateManyArgs>(args?: SelectSubset<T, ReturnPickupCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ReturnPickups and returns the data saved in the database.
     * @param {ReturnPickupCreateManyAndReturnArgs} args - Arguments to create many ReturnPickups.
     * @example
     * // Create many ReturnPickups
     * const returnPickup = await prisma.returnPickup.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ReturnPickups and only return the `id`
     * const returnPickupWithIdOnly = await prisma.returnPickup.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReturnPickupCreateManyAndReturnArgs>(args?: SelectSubset<T, ReturnPickupCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReturnPickupPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ReturnPickup.
     * @param {ReturnPickupDeleteArgs} args - Arguments to delete one ReturnPickup.
     * @example
     * // Delete one ReturnPickup
     * const ReturnPickup = await prisma.returnPickup.delete({
     *   where: {
     *     // ... filter to delete one ReturnPickup
     *   }
     * })
     * 
     */
    delete<T extends ReturnPickupDeleteArgs>(args: SelectSubset<T, ReturnPickupDeleteArgs<ExtArgs>>): Prisma__ReturnPickupClient<$Result.GetResult<Prisma.$ReturnPickupPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ReturnPickup.
     * @param {ReturnPickupUpdateArgs} args - Arguments to update one ReturnPickup.
     * @example
     * // Update one ReturnPickup
     * const returnPickup = await prisma.returnPickup.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReturnPickupUpdateArgs>(args: SelectSubset<T, ReturnPickupUpdateArgs<ExtArgs>>): Prisma__ReturnPickupClient<$Result.GetResult<Prisma.$ReturnPickupPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ReturnPickups.
     * @param {ReturnPickupDeleteManyArgs} args - Arguments to filter ReturnPickups to delete.
     * @example
     * // Delete a few ReturnPickups
     * const { count } = await prisma.returnPickup.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReturnPickupDeleteManyArgs>(args?: SelectSubset<T, ReturnPickupDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ReturnPickups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReturnPickupUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ReturnPickups
     * const returnPickup = await prisma.returnPickup.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReturnPickupUpdateManyArgs>(args: SelectSubset<T, ReturnPickupUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ReturnPickup.
     * @param {ReturnPickupUpsertArgs} args - Arguments to update or create a ReturnPickup.
     * @example
     * // Update or create a ReturnPickup
     * const returnPickup = await prisma.returnPickup.upsert({
     *   create: {
     *     // ... data to create a ReturnPickup
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ReturnPickup we want to update
     *   }
     * })
     */
    upsert<T extends ReturnPickupUpsertArgs>(args: SelectSubset<T, ReturnPickupUpsertArgs<ExtArgs>>): Prisma__ReturnPickupClient<$Result.GetResult<Prisma.$ReturnPickupPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ReturnPickups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReturnPickupCountArgs} args - Arguments to filter ReturnPickups to count.
     * @example
     * // Count the number of ReturnPickups
     * const count = await prisma.returnPickup.count({
     *   where: {
     *     // ... the filter for the ReturnPickups we want to count
     *   }
     * })
    **/
    count<T extends ReturnPickupCountArgs>(
      args?: Subset<T, ReturnPickupCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReturnPickupCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ReturnPickup.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReturnPickupAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReturnPickupAggregateArgs>(args: Subset<T, ReturnPickupAggregateArgs>): Prisma.PrismaPromise<GetReturnPickupAggregateType<T>>

    /**
     * Group by ReturnPickup.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReturnPickupGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReturnPickupGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReturnPickupGroupByArgs['orderBy'] }
        : { orderBy?: ReturnPickupGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReturnPickupGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReturnPickupGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ReturnPickup model
   */
  readonly fields: ReturnPickupFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ReturnPickup.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReturnPickupClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    warehouse<T extends WarehouseDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WarehouseDefaultArgs<ExtArgs>>): Prisma__WarehouseClient<$Result.GetResult<Prisma.$WarehousePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    items<T extends ReturnPickup$itemsArgs<ExtArgs> = {}>(args?: Subset<T, ReturnPickup$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReturnItemPayload<ExtArgs>, T, "findMany"> | Null>
    tracking_updates<T extends ReturnPickup$tracking_updatesArgs<ExtArgs> = {}>(args?: Subset<T, ReturnPickup$tracking_updatesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReturnTrackingUpdatePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ReturnPickup model
   */ 
  interface ReturnPickupFieldRefs {
    readonly id: FieldRef<"ReturnPickup", 'String'>
    readonly return_number: FieldRef<"ReturnPickup", 'String'>
    readonly order_id: FieldRef<"ReturnPickup", 'String'>
    readonly user_id: FieldRef<"ReturnPickup", 'String'>
    readonly warehouse_id: FieldRef<"ReturnPickup", 'String'>
    readonly status: FieldRef<"ReturnPickup", 'ReturnPickupStatus'>
    readonly courier_code: FieldRef<"ReturnPickup", 'CourierCode'>
    readonly return_tracking_number: FieldRef<"ReturnPickup", 'String'>
    readonly pickup_address: FieldRef<"ReturnPickup", 'Json'>
    readonly scheduled_pickup_date: FieldRef<"ReturnPickup", 'DateTime'>
    readonly picked_up_at: FieldRef<"ReturnPickup", 'DateTime'>
    readonly received_at: FieldRef<"ReturnPickup", 'DateTime'>
    readonly completed_at: FieldRef<"ReturnPickup", 'DateTime'>
    readonly pop_signature: FieldRef<"ReturnPickup", 'String'>
    readonly pop_received_by: FieldRef<"ReturnPickup", 'String'>
    readonly cancellation_reason: FieldRef<"ReturnPickup", 'String'>
    readonly created_at: FieldRef<"ReturnPickup", 'DateTime'>
    readonly updated_at: FieldRef<"ReturnPickup", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ReturnPickup findUnique
   */
  export type ReturnPickupFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnPickup
     */
    select?: ReturnPickupSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnPickupInclude<ExtArgs> | null
    /**
     * Filter, which ReturnPickup to fetch.
     */
    where: ReturnPickupWhereUniqueInput
  }

  /**
   * ReturnPickup findUniqueOrThrow
   */
  export type ReturnPickupFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnPickup
     */
    select?: ReturnPickupSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnPickupInclude<ExtArgs> | null
    /**
     * Filter, which ReturnPickup to fetch.
     */
    where: ReturnPickupWhereUniqueInput
  }

  /**
   * ReturnPickup findFirst
   */
  export type ReturnPickupFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnPickup
     */
    select?: ReturnPickupSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnPickupInclude<ExtArgs> | null
    /**
     * Filter, which ReturnPickup to fetch.
     */
    where?: ReturnPickupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReturnPickups to fetch.
     */
    orderBy?: ReturnPickupOrderByWithRelationInput | ReturnPickupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReturnPickups.
     */
    cursor?: ReturnPickupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReturnPickups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReturnPickups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReturnPickups.
     */
    distinct?: ReturnPickupScalarFieldEnum | ReturnPickupScalarFieldEnum[]
  }

  /**
   * ReturnPickup findFirstOrThrow
   */
  export type ReturnPickupFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnPickup
     */
    select?: ReturnPickupSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnPickupInclude<ExtArgs> | null
    /**
     * Filter, which ReturnPickup to fetch.
     */
    where?: ReturnPickupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReturnPickups to fetch.
     */
    orderBy?: ReturnPickupOrderByWithRelationInput | ReturnPickupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReturnPickups.
     */
    cursor?: ReturnPickupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReturnPickups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReturnPickups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReturnPickups.
     */
    distinct?: ReturnPickupScalarFieldEnum | ReturnPickupScalarFieldEnum[]
  }

  /**
   * ReturnPickup findMany
   */
  export type ReturnPickupFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnPickup
     */
    select?: ReturnPickupSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnPickupInclude<ExtArgs> | null
    /**
     * Filter, which ReturnPickups to fetch.
     */
    where?: ReturnPickupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReturnPickups to fetch.
     */
    orderBy?: ReturnPickupOrderByWithRelationInput | ReturnPickupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ReturnPickups.
     */
    cursor?: ReturnPickupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReturnPickups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReturnPickups.
     */
    skip?: number
    distinct?: ReturnPickupScalarFieldEnum | ReturnPickupScalarFieldEnum[]
  }

  /**
   * ReturnPickup create
   */
  export type ReturnPickupCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnPickup
     */
    select?: ReturnPickupSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnPickupInclude<ExtArgs> | null
    /**
     * The data needed to create a ReturnPickup.
     */
    data: XOR<ReturnPickupCreateInput, ReturnPickupUncheckedCreateInput>
  }

  /**
   * ReturnPickup createMany
   */
  export type ReturnPickupCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ReturnPickups.
     */
    data: ReturnPickupCreateManyInput | ReturnPickupCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ReturnPickup createManyAndReturn
   */
  export type ReturnPickupCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnPickup
     */
    select?: ReturnPickupSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ReturnPickups.
     */
    data: ReturnPickupCreateManyInput | ReturnPickupCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnPickupIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ReturnPickup update
   */
  export type ReturnPickupUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnPickup
     */
    select?: ReturnPickupSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnPickupInclude<ExtArgs> | null
    /**
     * The data needed to update a ReturnPickup.
     */
    data: XOR<ReturnPickupUpdateInput, ReturnPickupUncheckedUpdateInput>
    /**
     * Choose, which ReturnPickup to update.
     */
    where: ReturnPickupWhereUniqueInput
  }

  /**
   * ReturnPickup updateMany
   */
  export type ReturnPickupUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ReturnPickups.
     */
    data: XOR<ReturnPickupUpdateManyMutationInput, ReturnPickupUncheckedUpdateManyInput>
    /**
     * Filter which ReturnPickups to update
     */
    where?: ReturnPickupWhereInput
  }

  /**
   * ReturnPickup upsert
   */
  export type ReturnPickupUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnPickup
     */
    select?: ReturnPickupSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnPickupInclude<ExtArgs> | null
    /**
     * The filter to search for the ReturnPickup to update in case it exists.
     */
    where: ReturnPickupWhereUniqueInput
    /**
     * In case the ReturnPickup found by the `where` argument doesn't exist, create a new ReturnPickup with this data.
     */
    create: XOR<ReturnPickupCreateInput, ReturnPickupUncheckedCreateInput>
    /**
     * In case the ReturnPickup was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReturnPickupUpdateInput, ReturnPickupUncheckedUpdateInput>
  }

  /**
   * ReturnPickup delete
   */
  export type ReturnPickupDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnPickup
     */
    select?: ReturnPickupSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnPickupInclude<ExtArgs> | null
    /**
     * Filter which ReturnPickup to delete.
     */
    where: ReturnPickupWhereUniqueInput
  }

  /**
   * ReturnPickup deleteMany
   */
  export type ReturnPickupDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReturnPickups to delete
     */
    where?: ReturnPickupWhereInput
  }

  /**
   * ReturnPickup.items
   */
  export type ReturnPickup$itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnItem
     */
    select?: ReturnItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnItemInclude<ExtArgs> | null
    where?: ReturnItemWhereInput
    orderBy?: ReturnItemOrderByWithRelationInput | ReturnItemOrderByWithRelationInput[]
    cursor?: ReturnItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReturnItemScalarFieldEnum | ReturnItemScalarFieldEnum[]
  }

  /**
   * ReturnPickup.tracking_updates
   */
  export type ReturnPickup$tracking_updatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnTrackingUpdate
     */
    select?: ReturnTrackingUpdateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnTrackingUpdateInclude<ExtArgs> | null
    where?: ReturnTrackingUpdateWhereInput
    orderBy?: ReturnTrackingUpdateOrderByWithRelationInput | ReturnTrackingUpdateOrderByWithRelationInput[]
    cursor?: ReturnTrackingUpdateWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReturnTrackingUpdateScalarFieldEnum | ReturnTrackingUpdateScalarFieldEnum[]
  }

  /**
   * ReturnPickup without action
   */
  export type ReturnPickupDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnPickup
     */
    select?: ReturnPickupSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnPickupInclude<ExtArgs> | null
  }


  /**
   * Model ReturnItem
   */

  export type AggregateReturnItem = {
    _count: ReturnItemCountAggregateOutputType | null
    _avg: ReturnItemAvgAggregateOutputType | null
    _sum: ReturnItemSumAggregateOutputType | null
    _min: ReturnItemMinAggregateOutputType | null
    _max: ReturnItemMaxAggregateOutputType | null
  }

  export type ReturnItemAvgAggregateOutputType = {
    quantity: number | null
  }

  export type ReturnItemSumAggregateOutputType = {
    quantity: number | null
  }

  export type ReturnItemMinAggregateOutputType = {
    id: string | null
    return_pickup_id: string | null
    product_id: string | null
    sku: string | null
    seller_id: string | null
    quantity: number | null
    reason: string | null
    inspection_grade: $Enums.InspectionGrade | null
    inspection_notes: string | null
    is_restocked: boolean | null
    restocked_at: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ReturnItemMaxAggregateOutputType = {
    id: string | null
    return_pickup_id: string | null
    product_id: string | null
    sku: string | null
    seller_id: string | null
    quantity: number | null
    reason: string | null
    inspection_grade: $Enums.InspectionGrade | null
    inspection_notes: string | null
    is_restocked: boolean | null
    restocked_at: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ReturnItemCountAggregateOutputType = {
    id: number
    return_pickup_id: number
    product_id: number
    sku: number
    seller_id: number
    quantity: number
    reason: number
    inspection_grade: number
    inspection_notes: number
    is_restocked: number
    restocked_at: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type ReturnItemAvgAggregateInputType = {
    quantity?: true
  }

  export type ReturnItemSumAggregateInputType = {
    quantity?: true
  }

  export type ReturnItemMinAggregateInputType = {
    id?: true
    return_pickup_id?: true
    product_id?: true
    sku?: true
    seller_id?: true
    quantity?: true
    reason?: true
    inspection_grade?: true
    inspection_notes?: true
    is_restocked?: true
    restocked_at?: true
    created_at?: true
    updated_at?: true
  }

  export type ReturnItemMaxAggregateInputType = {
    id?: true
    return_pickup_id?: true
    product_id?: true
    sku?: true
    seller_id?: true
    quantity?: true
    reason?: true
    inspection_grade?: true
    inspection_notes?: true
    is_restocked?: true
    restocked_at?: true
    created_at?: true
    updated_at?: true
  }

  export type ReturnItemCountAggregateInputType = {
    id?: true
    return_pickup_id?: true
    product_id?: true
    sku?: true
    seller_id?: true
    quantity?: true
    reason?: true
    inspection_grade?: true
    inspection_notes?: true
    is_restocked?: true
    restocked_at?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type ReturnItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReturnItem to aggregate.
     */
    where?: ReturnItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReturnItems to fetch.
     */
    orderBy?: ReturnItemOrderByWithRelationInput | ReturnItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReturnItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReturnItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReturnItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ReturnItems
    **/
    _count?: true | ReturnItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ReturnItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ReturnItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReturnItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReturnItemMaxAggregateInputType
  }

  export type GetReturnItemAggregateType<T extends ReturnItemAggregateArgs> = {
        [P in keyof T & keyof AggregateReturnItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReturnItem[P]>
      : GetScalarType<T[P], AggregateReturnItem[P]>
  }




  export type ReturnItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReturnItemWhereInput
    orderBy?: ReturnItemOrderByWithAggregationInput | ReturnItemOrderByWithAggregationInput[]
    by: ReturnItemScalarFieldEnum[] | ReturnItemScalarFieldEnum
    having?: ReturnItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReturnItemCountAggregateInputType | true
    _avg?: ReturnItemAvgAggregateInputType
    _sum?: ReturnItemSumAggregateInputType
    _min?: ReturnItemMinAggregateInputType
    _max?: ReturnItemMaxAggregateInputType
  }

  export type ReturnItemGroupByOutputType = {
    id: string
    return_pickup_id: string
    product_id: string
    sku: string
    seller_id: string | null
    quantity: number
    reason: string
    inspection_grade: $Enums.InspectionGrade | null
    inspection_notes: string | null
    is_restocked: boolean
    restocked_at: Date | null
    created_at: Date
    updated_at: Date
    _count: ReturnItemCountAggregateOutputType | null
    _avg: ReturnItemAvgAggregateOutputType | null
    _sum: ReturnItemSumAggregateOutputType | null
    _min: ReturnItemMinAggregateOutputType | null
    _max: ReturnItemMaxAggregateOutputType | null
  }

  type GetReturnItemGroupByPayload<T extends ReturnItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReturnItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReturnItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReturnItemGroupByOutputType[P]>
            : GetScalarType<T[P], ReturnItemGroupByOutputType[P]>
        }
      >
    >


  export type ReturnItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    return_pickup_id?: boolean
    product_id?: boolean
    sku?: boolean
    seller_id?: boolean
    quantity?: boolean
    reason?: boolean
    inspection_grade?: boolean
    inspection_notes?: boolean
    is_restocked?: boolean
    restocked_at?: boolean
    created_at?: boolean
    updated_at?: boolean
    return_pickup?: boolean | ReturnPickupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["returnItem"]>

  export type ReturnItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    return_pickup_id?: boolean
    product_id?: boolean
    sku?: boolean
    seller_id?: boolean
    quantity?: boolean
    reason?: boolean
    inspection_grade?: boolean
    inspection_notes?: boolean
    is_restocked?: boolean
    restocked_at?: boolean
    created_at?: boolean
    updated_at?: boolean
    return_pickup?: boolean | ReturnPickupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["returnItem"]>

  export type ReturnItemSelectScalar = {
    id?: boolean
    return_pickup_id?: boolean
    product_id?: boolean
    sku?: boolean
    seller_id?: boolean
    quantity?: boolean
    reason?: boolean
    inspection_grade?: boolean
    inspection_notes?: boolean
    is_restocked?: boolean
    restocked_at?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type ReturnItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    return_pickup?: boolean | ReturnPickupDefaultArgs<ExtArgs>
  }
  export type ReturnItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    return_pickup?: boolean | ReturnPickupDefaultArgs<ExtArgs>
  }

  export type $ReturnItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ReturnItem"
    objects: {
      return_pickup: Prisma.$ReturnPickupPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      return_pickup_id: string
      product_id: string
      sku: string
      seller_id: string | null
      quantity: number
      reason: string
      inspection_grade: $Enums.InspectionGrade | null
      inspection_notes: string | null
      is_restocked: boolean
      restocked_at: Date | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["returnItem"]>
    composites: {}
  }

  type ReturnItemGetPayload<S extends boolean | null | undefined | ReturnItemDefaultArgs> = $Result.GetResult<Prisma.$ReturnItemPayload, S>

  type ReturnItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ReturnItemFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ReturnItemCountAggregateInputType | true
    }

  export interface ReturnItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ReturnItem'], meta: { name: 'ReturnItem' } }
    /**
     * Find zero or one ReturnItem that matches the filter.
     * @param {ReturnItemFindUniqueArgs} args - Arguments to find a ReturnItem
     * @example
     * // Get one ReturnItem
     * const returnItem = await prisma.returnItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReturnItemFindUniqueArgs>(args: SelectSubset<T, ReturnItemFindUniqueArgs<ExtArgs>>): Prisma__ReturnItemClient<$Result.GetResult<Prisma.$ReturnItemPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ReturnItem that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ReturnItemFindUniqueOrThrowArgs} args - Arguments to find a ReturnItem
     * @example
     * // Get one ReturnItem
     * const returnItem = await prisma.returnItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReturnItemFindUniqueOrThrowArgs>(args: SelectSubset<T, ReturnItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReturnItemClient<$Result.GetResult<Prisma.$ReturnItemPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ReturnItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReturnItemFindFirstArgs} args - Arguments to find a ReturnItem
     * @example
     * // Get one ReturnItem
     * const returnItem = await prisma.returnItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReturnItemFindFirstArgs>(args?: SelectSubset<T, ReturnItemFindFirstArgs<ExtArgs>>): Prisma__ReturnItemClient<$Result.GetResult<Prisma.$ReturnItemPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ReturnItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReturnItemFindFirstOrThrowArgs} args - Arguments to find a ReturnItem
     * @example
     * // Get one ReturnItem
     * const returnItem = await prisma.returnItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReturnItemFindFirstOrThrowArgs>(args?: SelectSubset<T, ReturnItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReturnItemClient<$Result.GetResult<Prisma.$ReturnItemPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ReturnItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReturnItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ReturnItems
     * const returnItems = await prisma.returnItem.findMany()
     * 
     * // Get first 10 ReturnItems
     * const returnItems = await prisma.returnItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const returnItemWithIdOnly = await prisma.returnItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReturnItemFindManyArgs>(args?: SelectSubset<T, ReturnItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReturnItemPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ReturnItem.
     * @param {ReturnItemCreateArgs} args - Arguments to create a ReturnItem.
     * @example
     * // Create one ReturnItem
     * const ReturnItem = await prisma.returnItem.create({
     *   data: {
     *     // ... data to create a ReturnItem
     *   }
     * })
     * 
     */
    create<T extends ReturnItemCreateArgs>(args: SelectSubset<T, ReturnItemCreateArgs<ExtArgs>>): Prisma__ReturnItemClient<$Result.GetResult<Prisma.$ReturnItemPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ReturnItems.
     * @param {ReturnItemCreateManyArgs} args - Arguments to create many ReturnItems.
     * @example
     * // Create many ReturnItems
     * const returnItem = await prisma.returnItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReturnItemCreateManyArgs>(args?: SelectSubset<T, ReturnItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ReturnItems and returns the data saved in the database.
     * @param {ReturnItemCreateManyAndReturnArgs} args - Arguments to create many ReturnItems.
     * @example
     * // Create many ReturnItems
     * const returnItem = await prisma.returnItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ReturnItems and only return the `id`
     * const returnItemWithIdOnly = await prisma.returnItem.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReturnItemCreateManyAndReturnArgs>(args?: SelectSubset<T, ReturnItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReturnItemPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ReturnItem.
     * @param {ReturnItemDeleteArgs} args - Arguments to delete one ReturnItem.
     * @example
     * // Delete one ReturnItem
     * const ReturnItem = await prisma.returnItem.delete({
     *   where: {
     *     // ... filter to delete one ReturnItem
     *   }
     * })
     * 
     */
    delete<T extends ReturnItemDeleteArgs>(args: SelectSubset<T, ReturnItemDeleteArgs<ExtArgs>>): Prisma__ReturnItemClient<$Result.GetResult<Prisma.$ReturnItemPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ReturnItem.
     * @param {ReturnItemUpdateArgs} args - Arguments to update one ReturnItem.
     * @example
     * // Update one ReturnItem
     * const returnItem = await prisma.returnItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReturnItemUpdateArgs>(args: SelectSubset<T, ReturnItemUpdateArgs<ExtArgs>>): Prisma__ReturnItemClient<$Result.GetResult<Prisma.$ReturnItemPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ReturnItems.
     * @param {ReturnItemDeleteManyArgs} args - Arguments to filter ReturnItems to delete.
     * @example
     * // Delete a few ReturnItems
     * const { count } = await prisma.returnItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReturnItemDeleteManyArgs>(args?: SelectSubset<T, ReturnItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ReturnItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReturnItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ReturnItems
     * const returnItem = await prisma.returnItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReturnItemUpdateManyArgs>(args: SelectSubset<T, ReturnItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ReturnItem.
     * @param {ReturnItemUpsertArgs} args - Arguments to update or create a ReturnItem.
     * @example
     * // Update or create a ReturnItem
     * const returnItem = await prisma.returnItem.upsert({
     *   create: {
     *     // ... data to create a ReturnItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ReturnItem we want to update
     *   }
     * })
     */
    upsert<T extends ReturnItemUpsertArgs>(args: SelectSubset<T, ReturnItemUpsertArgs<ExtArgs>>): Prisma__ReturnItemClient<$Result.GetResult<Prisma.$ReturnItemPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ReturnItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReturnItemCountArgs} args - Arguments to filter ReturnItems to count.
     * @example
     * // Count the number of ReturnItems
     * const count = await prisma.returnItem.count({
     *   where: {
     *     // ... the filter for the ReturnItems we want to count
     *   }
     * })
    **/
    count<T extends ReturnItemCountArgs>(
      args?: Subset<T, ReturnItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReturnItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ReturnItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReturnItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReturnItemAggregateArgs>(args: Subset<T, ReturnItemAggregateArgs>): Prisma.PrismaPromise<GetReturnItemAggregateType<T>>

    /**
     * Group by ReturnItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReturnItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReturnItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReturnItemGroupByArgs['orderBy'] }
        : { orderBy?: ReturnItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReturnItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReturnItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ReturnItem model
   */
  readonly fields: ReturnItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ReturnItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReturnItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    return_pickup<T extends ReturnPickupDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ReturnPickupDefaultArgs<ExtArgs>>): Prisma__ReturnPickupClient<$Result.GetResult<Prisma.$ReturnPickupPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ReturnItem model
   */ 
  interface ReturnItemFieldRefs {
    readonly id: FieldRef<"ReturnItem", 'String'>
    readonly return_pickup_id: FieldRef<"ReturnItem", 'String'>
    readonly product_id: FieldRef<"ReturnItem", 'String'>
    readonly sku: FieldRef<"ReturnItem", 'String'>
    readonly seller_id: FieldRef<"ReturnItem", 'String'>
    readonly quantity: FieldRef<"ReturnItem", 'Int'>
    readonly reason: FieldRef<"ReturnItem", 'String'>
    readonly inspection_grade: FieldRef<"ReturnItem", 'InspectionGrade'>
    readonly inspection_notes: FieldRef<"ReturnItem", 'String'>
    readonly is_restocked: FieldRef<"ReturnItem", 'Boolean'>
    readonly restocked_at: FieldRef<"ReturnItem", 'DateTime'>
    readonly created_at: FieldRef<"ReturnItem", 'DateTime'>
    readonly updated_at: FieldRef<"ReturnItem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ReturnItem findUnique
   */
  export type ReturnItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnItem
     */
    select?: ReturnItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnItemInclude<ExtArgs> | null
    /**
     * Filter, which ReturnItem to fetch.
     */
    where: ReturnItemWhereUniqueInput
  }

  /**
   * ReturnItem findUniqueOrThrow
   */
  export type ReturnItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnItem
     */
    select?: ReturnItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnItemInclude<ExtArgs> | null
    /**
     * Filter, which ReturnItem to fetch.
     */
    where: ReturnItemWhereUniqueInput
  }

  /**
   * ReturnItem findFirst
   */
  export type ReturnItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnItem
     */
    select?: ReturnItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnItemInclude<ExtArgs> | null
    /**
     * Filter, which ReturnItem to fetch.
     */
    where?: ReturnItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReturnItems to fetch.
     */
    orderBy?: ReturnItemOrderByWithRelationInput | ReturnItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReturnItems.
     */
    cursor?: ReturnItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReturnItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReturnItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReturnItems.
     */
    distinct?: ReturnItemScalarFieldEnum | ReturnItemScalarFieldEnum[]
  }

  /**
   * ReturnItem findFirstOrThrow
   */
  export type ReturnItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnItem
     */
    select?: ReturnItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnItemInclude<ExtArgs> | null
    /**
     * Filter, which ReturnItem to fetch.
     */
    where?: ReturnItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReturnItems to fetch.
     */
    orderBy?: ReturnItemOrderByWithRelationInput | ReturnItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReturnItems.
     */
    cursor?: ReturnItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReturnItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReturnItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReturnItems.
     */
    distinct?: ReturnItemScalarFieldEnum | ReturnItemScalarFieldEnum[]
  }

  /**
   * ReturnItem findMany
   */
  export type ReturnItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnItem
     */
    select?: ReturnItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnItemInclude<ExtArgs> | null
    /**
     * Filter, which ReturnItems to fetch.
     */
    where?: ReturnItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReturnItems to fetch.
     */
    orderBy?: ReturnItemOrderByWithRelationInput | ReturnItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ReturnItems.
     */
    cursor?: ReturnItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReturnItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReturnItems.
     */
    skip?: number
    distinct?: ReturnItemScalarFieldEnum | ReturnItemScalarFieldEnum[]
  }

  /**
   * ReturnItem create
   */
  export type ReturnItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnItem
     */
    select?: ReturnItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnItemInclude<ExtArgs> | null
    /**
     * The data needed to create a ReturnItem.
     */
    data: XOR<ReturnItemCreateInput, ReturnItemUncheckedCreateInput>
  }

  /**
   * ReturnItem createMany
   */
  export type ReturnItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ReturnItems.
     */
    data: ReturnItemCreateManyInput | ReturnItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ReturnItem createManyAndReturn
   */
  export type ReturnItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnItem
     */
    select?: ReturnItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ReturnItems.
     */
    data: ReturnItemCreateManyInput | ReturnItemCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ReturnItem update
   */
  export type ReturnItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnItem
     */
    select?: ReturnItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnItemInclude<ExtArgs> | null
    /**
     * The data needed to update a ReturnItem.
     */
    data: XOR<ReturnItemUpdateInput, ReturnItemUncheckedUpdateInput>
    /**
     * Choose, which ReturnItem to update.
     */
    where: ReturnItemWhereUniqueInput
  }

  /**
   * ReturnItem updateMany
   */
  export type ReturnItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ReturnItems.
     */
    data: XOR<ReturnItemUpdateManyMutationInput, ReturnItemUncheckedUpdateManyInput>
    /**
     * Filter which ReturnItems to update
     */
    where?: ReturnItemWhereInput
  }

  /**
   * ReturnItem upsert
   */
  export type ReturnItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnItem
     */
    select?: ReturnItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnItemInclude<ExtArgs> | null
    /**
     * The filter to search for the ReturnItem to update in case it exists.
     */
    where: ReturnItemWhereUniqueInput
    /**
     * In case the ReturnItem found by the `where` argument doesn't exist, create a new ReturnItem with this data.
     */
    create: XOR<ReturnItemCreateInput, ReturnItemUncheckedCreateInput>
    /**
     * In case the ReturnItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReturnItemUpdateInput, ReturnItemUncheckedUpdateInput>
  }

  /**
   * ReturnItem delete
   */
  export type ReturnItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnItem
     */
    select?: ReturnItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnItemInclude<ExtArgs> | null
    /**
     * Filter which ReturnItem to delete.
     */
    where: ReturnItemWhereUniqueInput
  }

  /**
   * ReturnItem deleteMany
   */
  export type ReturnItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReturnItems to delete
     */
    where?: ReturnItemWhereInput
  }

  /**
   * ReturnItem without action
   */
  export type ReturnItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnItem
     */
    select?: ReturnItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnItemInclude<ExtArgs> | null
  }


  /**
   * Model ReturnTrackingUpdate
   */

  export type AggregateReturnTrackingUpdate = {
    _count: ReturnTrackingUpdateCountAggregateOutputType | null
    _min: ReturnTrackingUpdateMinAggregateOutputType | null
    _max: ReturnTrackingUpdateMaxAggregateOutputType | null
  }

  export type ReturnTrackingUpdateMinAggregateOutputType = {
    id: string | null
    return_pickup_id: string | null
    status: $Enums.ReturnPickupStatus | null
    location: string | null
    description: string | null
    recorded_by: string | null
    recorded_at: Date | null
  }

  export type ReturnTrackingUpdateMaxAggregateOutputType = {
    id: string | null
    return_pickup_id: string | null
    status: $Enums.ReturnPickupStatus | null
    location: string | null
    description: string | null
    recorded_by: string | null
    recorded_at: Date | null
  }

  export type ReturnTrackingUpdateCountAggregateOutputType = {
    id: number
    return_pickup_id: number
    status: number
    location: number
    description: number
    recorded_by: number
    recorded_at: number
    _all: number
  }


  export type ReturnTrackingUpdateMinAggregateInputType = {
    id?: true
    return_pickup_id?: true
    status?: true
    location?: true
    description?: true
    recorded_by?: true
    recorded_at?: true
  }

  export type ReturnTrackingUpdateMaxAggregateInputType = {
    id?: true
    return_pickup_id?: true
    status?: true
    location?: true
    description?: true
    recorded_by?: true
    recorded_at?: true
  }

  export type ReturnTrackingUpdateCountAggregateInputType = {
    id?: true
    return_pickup_id?: true
    status?: true
    location?: true
    description?: true
    recorded_by?: true
    recorded_at?: true
    _all?: true
  }

  export type ReturnTrackingUpdateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReturnTrackingUpdate to aggregate.
     */
    where?: ReturnTrackingUpdateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReturnTrackingUpdates to fetch.
     */
    orderBy?: ReturnTrackingUpdateOrderByWithRelationInput | ReturnTrackingUpdateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReturnTrackingUpdateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReturnTrackingUpdates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReturnTrackingUpdates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ReturnTrackingUpdates
    **/
    _count?: true | ReturnTrackingUpdateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReturnTrackingUpdateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReturnTrackingUpdateMaxAggregateInputType
  }

  export type GetReturnTrackingUpdateAggregateType<T extends ReturnTrackingUpdateAggregateArgs> = {
        [P in keyof T & keyof AggregateReturnTrackingUpdate]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReturnTrackingUpdate[P]>
      : GetScalarType<T[P], AggregateReturnTrackingUpdate[P]>
  }




  export type ReturnTrackingUpdateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReturnTrackingUpdateWhereInput
    orderBy?: ReturnTrackingUpdateOrderByWithAggregationInput | ReturnTrackingUpdateOrderByWithAggregationInput[]
    by: ReturnTrackingUpdateScalarFieldEnum[] | ReturnTrackingUpdateScalarFieldEnum
    having?: ReturnTrackingUpdateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReturnTrackingUpdateCountAggregateInputType | true
    _min?: ReturnTrackingUpdateMinAggregateInputType
    _max?: ReturnTrackingUpdateMaxAggregateInputType
  }

  export type ReturnTrackingUpdateGroupByOutputType = {
    id: string
    return_pickup_id: string
    status: $Enums.ReturnPickupStatus
    location: string | null
    description: string
    recorded_by: string | null
    recorded_at: Date
    _count: ReturnTrackingUpdateCountAggregateOutputType | null
    _min: ReturnTrackingUpdateMinAggregateOutputType | null
    _max: ReturnTrackingUpdateMaxAggregateOutputType | null
  }

  type GetReturnTrackingUpdateGroupByPayload<T extends ReturnTrackingUpdateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReturnTrackingUpdateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReturnTrackingUpdateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReturnTrackingUpdateGroupByOutputType[P]>
            : GetScalarType<T[P], ReturnTrackingUpdateGroupByOutputType[P]>
        }
      >
    >


  export type ReturnTrackingUpdateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    return_pickup_id?: boolean
    status?: boolean
    location?: boolean
    description?: boolean
    recorded_by?: boolean
    recorded_at?: boolean
    return_pickup?: boolean | ReturnPickupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["returnTrackingUpdate"]>

  export type ReturnTrackingUpdateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    return_pickup_id?: boolean
    status?: boolean
    location?: boolean
    description?: boolean
    recorded_by?: boolean
    recorded_at?: boolean
    return_pickup?: boolean | ReturnPickupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["returnTrackingUpdate"]>

  export type ReturnTrackingUpdateSelectScalar = {
    id?: boolean
    return_pickup_id?: boolean
    status?: boolean
    location?: boolean
    description?: boolean
    recorded_by?: boolean
    recorded_at?: boolean
  }

  export type ReturnTrackingUpdateInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    return_pickup?: boolean | ReturnPickupDefaultArgs<ExtArgs>
  }
  export type ReturnTrackingUpdateIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    return_pickup?: boolean | ReturnPickupDefaultArgs<ExtArgs>
  }

  export type $ReturnTrackingUpdatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ReturnTrackingUpdate"
    objects: {
      return_pickup: Prisma.$ReturnPickupPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      return_pickup_id: string
      status: $Enums.ReturnPickupStatus
      location: string | null
      description: string
      recorded_by: string | null
      recorded_at: Date
    }, ExtArgs["result"]["returnTrackingUpdate"]>
    composites: {}
  }

  type ReturnTrackingUpdateGetPayload<S extends boolean | null | undefined | ReturnTrackingUpdateDefaultArgs> = $Result.GetResult<Prisma.$ReturnTrackingUpdatePayload, S>

  type ReturnTrackingUpdateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ReturnTrackingUpdateFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ReturnTrackingUpdateCountAggregateInputType | true
    }

  export interface ReturnTrackingUpdateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ReturnTrackingUpdate'], meta: { name: 'ReturnTrackingUpdate' } }
    /**
     * Find zero or one ReturnTrackingUpdate that matches the filter.
     * @param {ReturnTrackingUpdateFindUniqueArgs} args - Arguments to find a ReturnTrackingUpdate
     * @example
     * // Get one ReturnTrackingUpdate
     * const returnTrackingUpdate = await prisma.returnTrackingUpdate.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReturnTrackingUpdateFindUniqueArgs>(args: SelectSubset<T, ReturnTrackingUpdateFindUniqueArgs<ExtArgs>>): Prisma__ReturnTrackingUpdateClient<$Result.GetResult<Prisma.$ReturnTrackingUpdatePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ReturnTrackingUpdate that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ReturnTrackingUpdateFindUniqueOrThrowArgs} args - Arguments to find a ReturnTrackingUpdate
     * @example
     * // Get one ReturnTrackingUpdate
     * const returnTrackingUpdate = await prisma.returnTrackingUpdate.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReturnTrackingUpdateFindUniqueOrThrowArgs>(args: SelectSubset<T, ReturnTrackingUpdateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReturnTrackingUpdateClient<$Result.GetResult<Prisma.$ReturnTrackingUpdatePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ReturnTrackingUpdate that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReturnTrackingUpdateFindFirstArgs} args - Arguments to find a ReturnTrackingUpdate
     * @example
     * // Get one ReturnTrackingUpdate
     * const returnTrackingUpdate = await prisma.returnTrackingUpdate.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReturnTrackingUpdateFindFirstArgs>(args?: SelectSubset<T, ReturnTrackingUpdateFindFirstArgs<ExtArgs>>): Prisma__ReturnTrackingUpdateClient<$Result.GetResult<Prisma.$ReturnTrackingUpdatePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ReturnTrackingUpdate that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReturnTrackingUpdateFindFirstOrThrowArgs} args - Arguments to find a ReturnTrackingUpdate
     * @example
     * // Get one ReturnTrackingUpdate
     * const returnTrackingUpdate = await prisma.returnTrackingUpdate.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReturnTrackingUpdateFindFirstOrThrowArgs>(args?: SelectSubset<T, ReturnTrackingUpdateFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReturnTrackingUpdateClient<$Result.GetResult<Prisma.$ReturnTrackingUpdatePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ReturnTrackingUpdates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReturnTrackingUpdateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ReturnTrackingUpdates
     * const returnTrackingUpdates = await prisma.returnTrackingUpdate.findMany()
     * 
     * // Get first 10 ReturnTrackingUpdates
     * const returnTrackingUpdates = await prisma.returnTrackingUpdate.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const returnTrackingUpdateWithIdOnly = await prisma.returnTrackingUpdate.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReturnTrackingUpdateFindManyArgs>(args?: SelectSubset<T, ReturnTrackingUpdateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReturnTrackingUpdatePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ReturnTrackingUpdate.
     * @param {ReturnTrackingUpdateCreateArgs} args - Arguments to create a ReturnTrackingUpdate.
     * @example
     * // Create one ReturnTrackingUpdate
     * const ReturnTrackingUpdate = await prisma.returnTrackingUpdate.create({
     *   data: {
     *     // ... data to create a ReturnTrackingUpdate
     *   }
     * })
     * 
     */
    create<T extends ReturnTrackingUpdateCreateArgs>(args: SelectSubset<T, ReturnTrackingUpdateCreateArgs<ExtArgs>>): Prisma__ReturnTrackingUpdateClient<$Result.GetResult<Prisma.$ReturnTrackingUpdatePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ReturnTrackingUpdates.
     * @param {ReturnTrackingUpdateCreateManyArgs} args - Arguments to create many ReturnTrackingUpdates.
     * @example
     * // Create many ReturnTrackingUpdates
     * const returnTrackingUpdate = await prisma.returnTrackingUpdate.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReturnTrackingUpdateCreateManyArgs>(args?: SelectSubset<T, ReturnTrackingUpdateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ReturnTrackingUpdates and returns the data saved in the database.
     * @param {ReturnTrackingUpdateCreateManyAndReturnArgs} args - Arguments to create many ReturnTrackingUpdates.
     * @example
     * // Create many ReturnTrackingUpdates
     * const returnTrackingUpdate = await prisma.returnTrackingUpdate.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ReturnTrackingUpdates and only return the `id`
     * const returnTrackingUpdateWithIdOnly = await prisma.returnTrackingUpdate.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReturnTrackingUpdateCreateManyAndReturnArgs>(args?: SelectSubset<T, ReturnTrackingUpdateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReturnTrackingUpdatePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ReturnTrackingUpdate.
     * @param {ReturnTrackingUpdateDeleteArgs} args - Arguments to delete one ReturnTrackingUpdate.
     * @example
     * // Delete one ReturnTrackingUpdate
     * const ReturnTrackingUpdate = await prisma.returnTrackingUpdate.delete({
     *   where: {
     *     // ... filter to delete one ReturnTrackingUpdate
     *   }
     * })
     * 
     */
    delete<T extends ReturnTrackingUpdateDeleteArgs>(args: SelectSubset<T, ReturnTrackingUpdateDeleteArgs<ExtArgs>>): Prisma__ReturnTrackingUpdateClient<$Result.GetResult<Prisma.$ReturnTrackingUpdatePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ReturnTrackingUpdate.
     * @param {ReturnTrackingUpdateUpdateArgs} args - Arguments to update one ReturnTrackingUpdate.
     * @example
     * // Update one ReturnTrackingUpdate
     * const returnTrackingUpdate = await prisma.returnTrackingUpdate.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReturnTrackingUpdateUpdateArgs>(args: SelectSubset<T, ReturnTrackingUpdateUpdateArgs<ExtArgs>>): Prisma__ReturnTrackingUpdateClient<$Result.GetResult<Prisma.$ReturnTrackingUpdatePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ReturnTrackingUpdates.
     * @param {ReturnTrackingUpdateDeleteManyArgs} args - Arguments to filter ReturnTrackingUpdates to delete.
     * @example
     * // Delete a few ReturnTrackingUpdates
     * const { count } = await prisma.returnTrackingUpdate.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReturnTrackingUpdateDeleteManyArgs>(args?: SelectSubset<T, ReturnTrackingUpdateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ReturnTrackingUpdates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReturnTrackingUpdateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ReturnTrackingUpdates
     * const returnTrackingUpdate = await prisma.returnTrackingUpdate.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReturnTrackingUpdateUpdateManyArgs>(args: SelectSubset<T, ReturnTrackingUpdateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ReturnTrackingUpdate.
     * @param {ReturnTrackingUpdateUpsertArgs} args - Arguments to update or create a ReturnTrackingUpdate.
     * @example
     * // Update or create a ReturnTrackingUpdate
     * const returnTrackingUpdate = await prisma.returnTrackingUpdate.upsert({
     *   create: {
     *     // ... data to create a ReturnTrackingUpdate
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ReturnTrackingUpdate we want to update
     *   }
     * })
     */
    upsert<T extends ReturnTrackingUpdateUpsertArgs>(args: SelectSubset<T, ReturnTrackingUpdateUpsertArgs<ExtArgs>>): Prisma__ReturnTrackingUpdateClient<$Result.GetResult<Prisma.$ReturnTrackingUpdatePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ReturnTrackingUpdates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReturnTrackingUpdateCountArgs} args - Arguments to filter ReturnTrackingUpdates to count.
     * @example
     * // Count the number of ReturnTrackingUpdates
     * const count = await prisma.returnTrackingUpdate.count({
     *   where: {
     *     // ... the filter for the ReturnTrackingUpdates we want to count
     *   }
     * })
    **/
    count<T extends ReturnTrackingUpdateCountArgs>(
      args?: Subset<T, ReturnTrackingUpdateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReturnTrackingUpdateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ReturnTrackingUpdate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReturnTrackingUpdateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReturnTrackingUpdateAggregateArgs>(args: Subset<T, ReturnTrackingUpdateAggregateArgs>): Prisma.PrismaPromise<GetReturnTrackingUpdateAggregateType<T>>

    /**
     * Group by ReturnTrackingUpdate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReturnTrackingUpdateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReturnTrackingUpdateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReturnTrackingUpdateGroupByArgs['orderBy'] }
        : { orderBy?: ReturnTrackingUpdateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReturnTrackingUpdateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReturnTrackingUpdateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ReturnTrackingUpdate model
   */
  readonly fields: ReturnTrackingUpdateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ReturnTrackingUpdate.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReturnTrackingUpdateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    return_pickup<T extends ReturnPickupDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ReturnPickupDefaultArgs<ExtArgs>>): Prisma__ReturnPickupClient<$Result.GetResult<Prisma.$ReturnPickupPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ReturnTrackingUpdate model
   */ 
  interface ReturnTrackingUpdateFieldRefs {
    readonly id: FieldRef<"ReturnTrackingUpdate", 'String'>
    readonly return_pickup_id: FieldRef<"ReturnTrackingUpdate", 'String'>
    readonly status: FieldRef<"ReturnTrackingUpdate", 'ReturnPickupStatus'>
    readonly location: FieldRef<"ReturnTrackingUpdate", 'String'>
    readonly description: FieldRef<"ReturnTrackingUpdate", 'String'>
    readonly recorded_by: FieldRef<"ReturnTrackingUpdate", 'String'>
    readonly recorded_at: FieldRef<"ReturnTrackingUpdate", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ReturnTrackingUpdate findUnique
   */
  export type ReturnTrackingUpdateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnTrackingUpdate
     */
    select?: ReturnTrackingUpdateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnTrackingUpdateInclude<ExtArgs> | null
    /**
     * Filter, which ReturnTrackingUpdate to fetch.
     */
    where: ReturnTrackingUpdateWhereUniqueInput
  }

  /**
   * ReturnTrackingUpdate findUniqueOrThrow
   */
  export type ReturnTrackingUpdateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnTrackingUpdate
     */
    select?: ReturnTrackingUpdateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnTrackingUpdateInclude<ExtArgs> | null
    /**
     * Filter, which ReturnTrackingUpdate to fetch.
     */
    where: ReturnTrackingUpdateWhereUniqueInput
  }

  /**
   * ReturnTrackingUpdate findFirst
   */
  export type ReturnTrackingUpdateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnTrackingUpdate
     */
    select?: ReturnTrackingUpdateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnTrackingUpdateInclude<ExtArgs> | null
    /**
     * Filter, which ReturnTrackingUpdate to fetch.
     */
    where?: ReturnTrackingUpdateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReturnTrackingUpdates to fetch.
     */
    orderBy?: ReturnTrackingUpdateOrderByWithRelationInput | ReturnTrackingUpdateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReturnTrackingUpdates.
     */
    cursor?: ReturnTrackingUpdateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReturnTrackingUpdates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReturnTrackingUpdates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReturnTrackingUpdates.
     */
    distinct?: ReturnTrackingUpdateScalarFieldEnum | ReturnTrackingUpdateScalarFieldEnum[]
  }

  /**
   * ReturnTrackingUpdate findFirstOrThrow
   */
  export type ReturnTrackingUpdateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnTrackingUpdate
     */
    select?: ReturnTrackingUpdateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnTrackingUpdateInclude<ExtArgs> | null
    /**
     * Filter, which ReturnTrackingUpdate to fetch.
     */
    where?: ReturnTrackingUpdateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReturnTrackingUpdates to fetch.
     */
    orderBy?: ReturnTrackingUpdateOrderByWithRelationInput | ReturnTrackingUpdateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReturnTrackingUpdates.
     */
    cursor?: ReturnTrackingUpdateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReturnTrackingUpdates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReturnTrackingUpdates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReturnTrackingUpdates.
     */
    distinct?: ReturnTrackingUpdateScalarFieldEnum | ReturnTrackingUpdateScalarFieldEnum[]
  }

  /**
   * ReturnTrackingUpdate findMany
   */
  export type ReturnTrackingUpdateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnTrackingUpdate
     */
    select?: ReturnTrackingUpdateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnTrackingUpdateInclude<ExtArgs> | null
    /**
     * Filter, which ReturnTrackingUpdates to fetch.
     */
    where?: ReturnTrackingUpdateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReturnTrackingUpdates to fetch.
     */
    orderBy?: ReturnTrackingUpdateOrderByWithRelationInput | ReturnTrackingUpdateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ReturnTrackingUpdates.
     */
    cursor?: ReturnTrackingUpdateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReturnTrackingUpdates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReturnTrackingUpdates.
     */
    skip?: number
    distinct?: ReturnTrackingUpdateScalarFieldEnum | ReturnTrackingUpdateScalarFieldEnum[]
  }

  /**
   * ReturnTrackingUpdate create
   */
  export type ReturnTrackingUpdateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnTrackingUpdate
     */
    select?: ReturnTrackingUpdateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnTrackingUpdateInclude<ExtArgs> | null
    /**
     * The data needed to create a ReturnTrackingUpdate.
     */
    data: XOR<ReturnTrackingUpdateCreateInput, ReturnTrackingUpdateUncheckedCreateInput>
  }

  /**
   * ReturnTrackingUpdate createMany
   */
  export type ReturnTrackingUpdateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ReturnTrackingUpdates.
     */
    data: ReturnTrackingUpdateCreateManyInput | ReturnTrackingUpdateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ReturnTrackingUpdate createManyAndReturn
   */
  export type ReturnTrackingUpdateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnTrackingUpdate
     */
    select?: ReturnTrackingUpdateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ReturnTrackingUpdates.
     */
    data: ReturnTrackingUpdateCreateManyInput | ReturnTrackingUpdateCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnTrackingUpdateIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ReturnTrackingUpdate update
   */
  export type ReturnTrackingUpdateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnTrackingUpdate
     */
    select?: ReturnTrackingUpdateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnTrackingUpdateInclude<ExtArgs> | null
    /**
     * The data needed to update a ReturnTrackingUpdate.
     */
    data: XOR<ReturnTrackingUpdateUpdateInput, ReturnTrackingUpdateUncheckedUpdateInput>
    /**
     * Choose, which ReturnTrackingUpdate to update.
     */
    where: ReturnTrackingUpdateWhereUniqueInput
  }

  /**
   * ReturnTrackingUpdate updateMany
   */
  export type ReturnTrackingUpdateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ReturnTrackingUpdates.
     */
    data: XOR<ReturnTrackingUpdateUpdateManyMutationInput, ReturnTrackingUpdateUncheckedUpdateManyInput>
    /**
     * Filter which ReturnTrackingUpdates to update
     */
    where?: ReturnTrackingUpdateWhereInput
  }

  /**
   * ReturnTrackingUpdate upsert
   */
  export type ReturnTrackingUpdateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnTrackingUpdate
     */
    select?: ReturnTrackingUpdateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnTrackingUpdateInclude<ExtArgs> | null
    /**
     * The filter to search for the ReturnTrackingUpdate to update in case it exists.
     */
    where: ReturnTrackingUpdateWhereUniqueInput
    /**
     * In case the ReturnTrackingUpdate found by the `where` argument doesn't exist, create a new ReturnTrackingUpdate with this data.
     */
    create: XOR<ReturnTrackingUpdateCreateInput, ReturnTrackingUpdateUncheckedCreateInput>
    /**
     * In case the ReturnTrackingUpdate was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReturnTrackingUpdateUpdateInput, ReturnTrackingUpdateUncheckedUpdateInput>
  }

  /**
   * ReturnTrackingUpdate delete
   */
  export type ReturnTrackingUpdateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnTrackingUpdate
     */
    select?: ReturnTrackingUpdateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnTrackingUpdateInclude<ExtArgs> | null
    /**
     * Filter which ReturnTrackingUpdate to delete.
     */
    where: ReturnTrackingUpdateWhereUniqueInput
  }

  /**
   * ReturnTrackingUpdate deleteMany
   */
  export type ReturnTrackingUpdateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReturnTrackingUpdates to delete
     */
    where?: ReturnTrackingUpdateWhereInput
  }

  /**
   * ReturnTrackingUpdate without action
   */
  export type ReturnTrackingUpdateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReturnTrackingUpdate
     */
    select?: ReturnTrackingUpdateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReturnTrackingUpdateInclude<ExtArgs> | null
  }


  /**
   * Model FulfillmentOutbox
   */

  export type AggregateFulfillmentOutbox = {
    _count: FulfillmentOutboxCountAggregateOutputType | null
    _avg: FulfillmentOutboxAvgAggregateOutputType | null
    _sum: FulfillmentOutboxSumAggregateOutputType | null
    _min: FulfillmentOutboxMinAggregateOutputType | null
    _max: FulfillmentOutboxMaxAggregateOutputType | null
  }

  export type FulfillmentOutboxAvgAggregateOutputType = {
    retry_count: number | null
    max_retries: number | null
  }

  export type FulfillmentOutboxSumAggregateOutputType = {
    retry_count: number | null
    max_retries: number | null
  }

  export type FulfillmentOutboxMinAggregateOutputType = {
    id: string | null
    event_type: string | null
    aggregate_type: string | null
    aggregate_id: string | null
    status: $Enums.OutboxStatus | null
    retry_count: number | null
    max_retries: number | null
    next_retry_at: Date | null
    locked_at: Date | null
    locked_by: string | null
    last_error: string | null
    created_at: Date | null
    processed_at: Date | null
  }

  export type FulfillmentOutboxMaxAggregateOutputType = {
    id: string | null
    event_type: string | null
    aggregate_type: string | null
    aggregate_id: string | null
    status: $Enums.OutboxStatus | null
    retry_count: number | null
    max_retries: number | null
    next_retry_at: Date | null
    locked_at: Date | null
    locked_by: string | null
    last_error: string | null
    created_at: Date | null
    processed_at: Date | null
  }

  export type FulfillmentOutboxCountAggregateOutputType = {
    id: number
    event_type: number
    aggregate_type: number
    aggregate_id: number
    payload: number
    status: number
    retry_count: number
    max_retries: number
    next_retry_at: number
    locked_at: number
    locked_by: number
    last_error: number
    created_at: number
    processed_at: number
    _all: number
  }


  export type FulfillmentOutboxAvgAggregateInputType = {
    retry_count?: true
    max_retries?: true
  }

  export type FulfillmentOutboxSumAggregateInputType = {
    retry_count?: true
    max_retries?: true
  }

  export type FulfillmentOutboxMinAggregateInputType = {
    id?: true
    event_type?: true
    aggregate_type?: true
    aggregate_id?: true
    status?: true
    retry_count?: true
    max_retries?: true
    next_retry_at?: true
    locked_at?: true
    locked_by?: true
    last_error?: true
    created_at?: true
    processed_at?: true
  }

  export type FulfillmentOutboxMaxAggregateInputType = {
    id?: true
    event_type?: true
    aggregate_type?: true
    aggregate_id?: true
    status?: true
    retry_count?: true
    max_retries?: true
    next_retry_at?: true
    locked_at?: true
    locked_by?: true
    last_error?: true
    created_at?: true
    processed_at?: true
  }

  export type FulfillmentOutboxCountAggregateInputType = {
    id?: true
    event_type?: true
    aggregate_type?: true
    aggregate_id?: true
    payload?: true
    status?: true
    retry_count?: true
    max_retries?: true
    next_retry_at?: true
    locked_at?: true
    locked_by?: true
    last_error?: true
    created_at?: true
    processed_at?: true
    _all?: true
  }

  export type FulfillmentOutboxAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FulfillmentOutbox to aggregate.
     */
    where?: FulfillmentOutboxWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FulfillmentOutboxes to fetch.
     */
    orderBy?: FulfillmentOutboxOrderByWithRelationInput | FulfillmentOutboxOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FulfillmentOutboxWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FulfillmentOutboxes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FulfillmentOutboxes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FulfillmentOutboxes
    **/
    _count?: true | FulfillmentOutboxCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FulfillmentOutboxAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FulfillmentOutboxSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FulfillmentOutboxMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FulfillmentOutboxMaxAggregateInputType
  }

  export type GetFulfillmentOutboxAggregateType<T extends FulfillmentOutboxAggregateArgs> = {
        [P in keyof T & keyof AggregateFulfillmentOutbox]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFulfillmentOutbox[P]>
      : GetScalarType<T[P], AggregateFulfillmentOutbox[P]>
  }




  export type FulfillmentOutboxGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FulfillmentOutboxWhereInput
    orderBy?: FulfillmentOutboxOrderByWithAggregationInput | FulfillmentOutboxOrderByWithAggregationInput[]
    by: FulfillmentOutboxScalarFieldEnum[] | FulfillmentOutboxScalarFieldEnum
    having?: FulfillmentOutboxScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FulfillmentOutboxCountAggregateInputType | true
    _avg?: FulfillmentOutboxAvgAggregateInputType
    _sum?: FulfillmentOutboxSumAggregateInputType
    _min?: FulfillmentOutboxMinAggregateInputType
    _max?: FulfillmentOutboxMaxAggregateInputType
  }

  export type FulfillmentOutboxGroupByOutputType = {
    id: string
    event_type: string
    aggregate_type: string
    aggregate_id: string
    payload: JsonValue
    status: $Enums.OutboxStatus
    retry_count: number
    max_retries: number
    next_retry_at: Date | null
    locked_at: Date | null
    locked_by: string | null
    last_error: string | null
    created_at: Date
    processed_at: Date | null
    _count: FulfillmentOutboxCountAggregateOutputType | null
    _avg: FulfillmentOutboxAvgAggregateOutputType | null
    _sum: FulfillmentOutboxSumAggregateOutputType | null
    _min: FulfillmentOutboxMinAggregateOutputType | null
    _max: FulfillmentOutboxMaxAggregateOutputType | null
  }

  type GetFulfillmentOutboxGroupByPayload<T extends FulfillmentOutboxGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FulfillmentOutboxGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FulfillmentOutboxGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FulfillmentOutboxGroupByOutputType[P]>
            : GetScalarType<T[P], FulfillmentOutboxGroupByOutputType[P]>
        }
      >
    >


  export type FulfillmentOutboxSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    event_type?: boolean
    aggregate_type?: boolean
    aggregate_id?: boolean
    payload?: boolean
    status?: boolean
    retry_count?: boolean
    max_retries?: boolean
    next_retry_at?: boolean
    locked_at?: boolean
    locked_by?: boolean
    last_error?: boolean
    created_at?: boolean
    processed_at?: boolean
  }, ExtArgs["result"]["fulfillmentOutbox"]>

  export type FulfillmentOutboxSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    event_type?: boolean
    aggregate_type?: boolean
    aggregate_id?: boolean
    payload?: boolean
    status?: boolean
    retry_count?: boolean
    max_retries?: boolean
    next_retry_at?: boolean
    locked_at?: boolean
    locked_by?: boolean
    last_error?: boolean
    created_at?: boolean
    processed_at?: boolean
  }, ExtArgs["result"]["fulfillmentOutbox"]>

  export type FulfillmentOutboxSelectScalar = {
    id?: boolean
    event_type?: boolean
    aggregate_type?: boolean
    aggregate_id?: boolean
    payload?: boolean
    status?: boolean
    retry_count?: boolean
    max_retries?: boolean
    next_retry_at?: boolean
    locked_at?: boolean
    locked_by?: boolean
    last_error?: boolean
    created_at?: boolean
    processed_at?: boolean
  }


  export type $FulfillmentOutboxPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FulfillmentOutbox"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      event_type: string
      aggregate_type: string
      aggregate_id: string
      payload: Prisma.JsonValue
      status: $Enums.OutboxStatus
      retry_count: number
      max_retries: number
      next_retry_at: Date | null
      locked_at: Date | null
      locked_by: string | null
      last_error: string | null
      created_at: Date
      processed_at: Date | null
    }, ExtArgs["result"]["fulfillmentOutbox"]>
    composites: {}
  }

  type FulfillmentOutboxGetPayload<S extends boolean | null | undefined | FulfillmentOutboxDefaultArgs> = $Result.GetResult<Prisma.$FulfillmentOutboxPayload, S>

  type FulfillmentOutboxCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<FulfillmentOutboxFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: FulfillmentOutboxCountAggregateInputType | true
    }

  export interface FulfillmentOutboxDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FulfillmentOutbox'], meta: { name: 'FulfillmentOutbox' } }
    /**
     * Find zero or one FulfillmentOutbox that matches the filter.
     * @param {FulfillmentOutboxFindUniqueArgs} args - Arguments to find a FulfillmentOutbox
     * @example
     * // Get one FulfillmentOutbox
     * const fulfillmentOutbox = await prisma.fulfillmentOutbox.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FulfillmentOutboxFindUniqueArgs>(args: SelectSubset<T, FulfillmentOutboxFindUniqueArgs<ExtArgs>>): Prisma__FulfillmentOutboxClient<$Result.GetResult<Prisma.$FulfillmentOutboxPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one FulfillmentOutbox that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {FulfillmentOutboxFindUniqueOrThrowArgs} args - Arguments to find a FulfillmentOutbox
     * @example
     * // Get one FulfillmentOutbox
     * const fulfillmentOutbox = await prisma.fulfillmentOutbox.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FulfillmentOutboxFindUniqueOrThrowArgs>(args: SelectSubset<T, FulfillmentOutboxFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FulfillmentOutboxClient<$Result.GetResult<Prisma.$FulfillmentOutboxPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first FulfillmentOutbox that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FulfillmentOutboxFindFirstArgs} args - Arguments to find a FulfillmentOutbox
     * @example
     * // Get one FulfillmentOutbox
     * const fulfillmentOutbox = await prisma.fulfillmentOutbox.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FulfillmentOutboxFindFirstArgs>(args?: SelectSubset<T, FulfillmentOutboxFindFirstArgs<ExtArgs>>): Prisma__FulfillmentOutboxClient<$Result.GetResult<Prisma.$FulfillmentOutboxPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first FulfillmentOutbox that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FulfillmentOutboxFindFirstOrThrowArgs} args - Arguments to find a FulfillmentOutbox
     * @example
     * // Get one FulfillmentOutbox
     * const fulfillmentOutbox = await prisma.fulfillmentOutbox.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FulfillmentOutboxFindFirstOrThrowArgs>(args?: SelectSubset<T, FulfillmentOutboxFindFirstOrThrowArgs<ExtArgs>>): Prisma__FulfillmentOutboxClient<$Result.GetResult<Prisma.$FulfillmentOutboxPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more FulfillmentOutboxes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FulfillmentOutboxFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FulfillmentOutboxes
     * const fulfillmentOutboxes = await prisma.fulfillmentOutbox.findMany()
     * 
     * // Get first 10 FulfillmentOutboxes
     * const fulfillmentOutboxes = await prisma.fulfillmentOutbox.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const fulfillmentOutboxWithIdOnly = await prisma.fulfillmentOutbox.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FulfillmentOutboxFindManyArgs>(args?: SelectSubset<T, FulfillmentOutboxFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FulfillmentOutboxPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a FulfillmentOutbox.
     * @param {FulfillmentOutboxCreateArgs} args - Arguments to create a FulfillmentOutbox.
     * @example
     * // Create one FulfillmentOutbox
     * const FulfillmentOutbox = await prisma.fulfillmentOutbox.create({
     *   data: {
     *     // ... data to create a FulfillmentOutbox
     *   }
     * })
     * 
     */
    create<T extends FulfillmentOutboxCreateArgs>(args: SelectSubset<T, FulfillmentOutboxCreateArgs<ExtArgs>>): Prisma__FulfillmentOutboxClient<$Result.GetResult<Prisma.$FulfillmentOutboxPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many FulfillmentOutboxes.
     * @param {FulfillmentOutboxCreateManyArgs} args - Arguments to create many FulfillmentOutboxes.
     * @example
     * // Create many FulfillmentOutboxes
     * const fulfillmentOutbox = await prisma.fulfillmentOutbox.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FulfillmentOutboxCreateManyArgs>(args?: SelectSubset<T, FulfillmentOutboxCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FulfillmentOutboxes and returns the data saved in the database.
     * @param {FulfillmentOutboxCreateManyAndReturnArgs} args - Arguments to create many FulfillmentOutboxes.
     * @example
     * // Create many FulfillmentOutboxes
     * const fulfillmentOutbox = await prisma.fulfillmentOutbox.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FulfillmentOutboxes and only return the `id`
     * const fulfillmentOutboxWithIdOnly = await prisma.fulfillmentOutbox.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FulfillmentOutboxCreateManyAndReturnArgs>(args?: SelectSubset<T, FulfillmentOutboxCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FulfillmentOutboxPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a FulfillmentOutbox.
     * @param {FulfillmentOutboxDeleteArgs} args - Arguments to delete one FulfillmentOutbox.
     * @example
     * // Delete one FulfillmentOutbox
     * const FulfillmentOutbox = await prisma.fulfillmentOutbox.delete({
     *   where: {
     *     // ... filter to delete one FulfillmentOutbox
     *   }
     * })
     * 
     */
    delete<T extends FulfillmentOutboxDeleteArgs>(args: SelectSubset<T, FulfillmentOutboxDeleteArgs<ExtArgs>>): Prisma__FulfillmentOutboxClient<$Result.GetResult<Prisma.$FulfillmentOutboxPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one FulfillmentOutbox.
     * @param {FulfillmentOutboxUpdateArgs} args - Arguments to update one FulfillmentOutbox.
     * @example
     * // Update one FulfillmentOutbox
     * const fulfillmentOutbox = await prisma.fulfillmentOutbox.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FulfillmentOutboxUpdateArgs>(args: SelectSubset<T, FulfillmentOutboxUpdateArgs<ExtArgs>>): Prisma__FulfillmentOutboxClient<$Result.GetResult<Prisma.$FulfillmentOutboxPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more FulfillmentOutboxes.
     * @param {FulfillmentOutboxDeleteManyArgs} args - Arguments to filter FulfillmentOutboxes to delete.
     * @example
     * // Delete a few FulfillmentOutboxes
     * const { count } = await prisma.fulfillmentOutbox.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FulfillmentOutboxDeleteManyArgs>(args?: SelectSubset<T, FulfillmentOutboxDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FulfillmentOutboxes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FulfillmentOutboxUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FulfillmentOutboxes
     * const fulfillmentOutbox = await prisma.fulfillmentOutbox.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FulfillmentOutboxUpdateManyArgs>(args: SelectSubset<T, FulfillmentOutboxUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one FulfillmentOutbox.
     * @param {FulfillmentOutboxUpsertArgs} args - Arguments to update or create a FulfillmentOutbox.
     * @example
     * // Update or create a FulfillmentOutbox
     * const fulfillmentOutbox = await prisma.fulfillmentOutbox.upsert({
     *   create: {
     *     // ... data to create a FulfillmentOutbox
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FulfillmentOutbox we want to update
     *   }
     * })
     */
    upsert<T extends FulfillmentOutboxUpsertArgs>(args: SelectSubset<T, FulfillmentOutboxUpsertArgs<ExtArgs>>): Prisma__FulfillmentOutboxClient<$Result.GetResult<Prisma.$FulfillmentOutboxPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of FulfillmentOutboxes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FulfillmentOutboxCountArgs} args - Arguments to filter FulfillmentOutboxes to count.
     * @example
     * // Count the number of FulfillmentOutboxes
     * const count = await prisma.fulfillmentOutbox.count({
     *   where: {
     *     // ... the filter for the FulfillmentOutboxes we want to count
     *   }
     * })
    **/
    count<T extends FulfillmentOutboxCountArgs>(
      args?: Subset<T, FulfillmentOutboxCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FulfillmentOutboxCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FulfillmentOutbox.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FulfillmentOutboxAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FulfillmentOutboxAggregateArgs>(args: Subset<T, FulfillmentOutboxAggregateArgs>): Prisma.PrismaPromise<GetFulfillmentOutboxAggregateType<T>>

    /**
     * Group by FulfillmentOutbox.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FulfillmentOutboxGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FulfillmentOutboxGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FulfillmentOutboxGroupByArgs['orderBy'] }
        : { orderBy?: FulfillmentOutboxGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FulfillmentOutboxGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFulfillmentOutboxGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FulfillmentOutbox model
   */
  readonly fields: FulfillmentOutboxFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FulfillmentOutbox.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FulfillmentOutboxClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FulfillmentOutbox model
   */ 
  interface FulfillmentOutboxFieldRefs {
    readonly id: FieldRef<"FulfillmentOutbox", 'String'>
    readonly event_type: FieldRef<"FulfillmentOutbox", 'String'>
    readonly aggregate_type: FieldRef<"FulfillmentOutbox", 'String'>
    readonly aggregate_id: FieldRef<"FulfillmentOutbox", 'String'>
    readonly payload: FieldRef<"FulfillmentOutbox", 'Json'>
    readonly status: FieldRef<"FulfillmentOutbox", 'OutboxStatus'>
    readonly retry_count: FieldRef<"FulfillmentOutbox", 'Int'>
    readonly max_retries: FieldRef<"FulfillmentOutbox", 'Int'>
    readonly next_retry_at: FieldRef<"FulfillmentOutbox", 'DateTime'>
    readonly locked_at: FieldRef<"FulfillmentOutbox", 'DateTime'>
    readonly locked_by: FieldRef<"FulfillmentOutbox", 'String'>
    readonly last_error: FieldRef<"FulfillmentOutbox", 'String'>
    readonly created_at: FieldRef<"FulfillmentOutbox", 'DateTime'>
    readonly processed_at: FieldRef<"FulfillmentOutbox", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FulfillmentOutbox findUnique
   */
  export type FulfillmentOutboxFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FulfillmentOutbox
     */
    select?: FulfillmentOutboxSelect<ExtArgs> | null
    /**
     * Filter, which FulfillmentOutbox to fetch.
     */
    where: FulfillmentOutboxWhereUniqueInput
  }

  /**
   * FulfillmentOutbox findUniqueOrThrow
   */
  export type FulfillmentOutboxFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FulfillmentOutbox
     */
    select?: FulfillmentOutboxSelect<ExtArgs> | null
    /**
     * Filter, which FulfillmentOutbox to fetch.
     */
    where: FulfillmentOutboxWhereUniqueInput
  }

  /**
   * FulfillmentOutbox findFirst
   */
  export type FulfillmentOutboxFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FulfillmentOutbox
     */
    select?: FulfillmentOutboxSelect<ExtArgs> | null
    /**
     * Filter, which FulfillmentOutbox to fetch.
     */
    where?: FulfillmentOutboxWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FulfillmentOutboxes to fetch.
     */
    orderBy?: FulfillmentOutboxOrderByWithRelationInput | FulfillmentOutboxOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FulfillmentOutboxes.
     */
    cursor?: FulfillmentOutboxWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FulfillmentOutboxes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FulfillmentOutboxes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FulfillmentOutboxes.
     */
    distinct?: FulfillmentOutboxScalarFieldEnum | FulfillmentOutboxScalarFieldEnum[]
  }

  /**
   * FulfillmentOutbox findFirstOrThrow
   */
  export type FulfillmentOutboxFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FulfillmentOutbox
     */
    select?: FulfillmentOutboxSelect<ExtArgs> | null
    /**
     * Filter, which FulfillmentOutbox to fetch.
     */
    where?: FulfillmentOutboxWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FulfillmentOutboxes to fetch.
     */
    orderBy?: FulfillmentOutboxOrderByWithRelationInput | FulfillmentOutboxOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FulfillmentOutboxes.
     */
    cursor?: FulfillmentOutboxWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FulfillmentOutboxes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FulfillmentOutboxes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FulfillmentOutboxes.
     */
    distinct?: FulfillmentOutboxScalarFieldEnum | FulfillmentOutboxScalarFieldEnum[]
  }

  /**
   * FulfillmentOutbox findMany
   */
  export type FulfillmentOutboxFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FulfillmentOutbox
     */
    select?: FulfillmentOutboxSelect<ExtArgs> | null
    /**
     * Filter, which FulfillmentOutboxes to fetch.
     */
    where?: FulfillmentOutboxWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FulfillmentOutboxes to fetch.
     */
    orderBy?: FulfillmentOutboxOrderByWithRelationInput | FulfillmentOutboxOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FulfillmentOutboxes.
     */
    cursor?: FulfillmentOutboxWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FulfillmentOutboxes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FulfillmentOutboxes.
     */
    skip?: number
    distinct?: FulfillmentOutboxScalarFieldEnum | FulfillmentOutboxScalarFieldEnum[]
  }

  /**
   * FulfillmentOutbox create
   */
  export type FulfillmentOutboxCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FulfillmentOutbox
     */
    select?: FulfillmentOutboxSelect<ExtArgs> | null
    /**
     * The data needed to create a FulfillmentOutbox.
     */
    data: XOR<FulfillmentOutboxCreateInput, FulfillmentOutboxUncheckedCreateInput>
  }

  /**
   * FulfillmentOutbox createMany
   */
  export type FulfillmentOutboxCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FulfillmentOutboxes.
     */
    data: FulfillmentOutboxCreateManyInput | FulfillmentOutboxCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FulfillmentOutbox createManyAndReturn
   */
  export type FulfillmentOutboxCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FulfillmentOutbox
     */
    select?: FulfillmentOutboxSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many FulfillmentOutboxes.
     */
    data: FulfillmentOutboxCreateManyInput | FulfillmentOutboxCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FulfillmentOutbox update
   */
  export type FulfillmentOutboxUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FulfillmentOutbox
     */
    select?: FulfillmentOutboxSelect<ExtArgs> | null
    /**
     * The data needed to update a FulfillmentOutbox.
     */
    data: XOR<FulfillmentOutboxUpdateInput, FulfillmentOutboxUncheckedUpdateInput>
    /**
     * Choose, which FulfillmentOutbox to update.
     */
    where: FulfillmentOutboxWhereUniqueInput
  }

  /**
   * FulfillmentOutbox updateMany
   */
  export type FulfillmentOutboxUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FulfillmentOutboxes.
     */
    data: XOR<FulfillmentOutboxUpdateManyMutationInput, FulfillmentOutboxUncheckedUpdateManyInput>
    /**
     * Filter which FulfillmentOutboxes to update
     */
    where?: FulfillmentOutboxWhereInput
  }

  /**
   * FulfillmentOutbox upsert
   */
  export type FulfillmentOutboxUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FulfillmentOutbox
     */
    select?: FulfillmentOutboxSelect<ExtArgs> | null
    /**
     * The filter to search for the FulfillmentOutbox to update in case it exists.
     */
    where: FulfillmentOutboxWhereUniqueInput
    /**
     * In case the FulfillmentOutbox found by the `where` argument doesn't exist, create a new FulfillmentOutbox with this data.
     */
    create: XOR<FulfillmentOutboxCreateInput, FulfillmentOutboxUncheckedCreateInput>
    /**
     * In case the FulfillmentOutbox was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FulfillmentOutboxUpdateInput, FulfillmentOutboxUncheckedUpdateInput>
  }

  /**
   * FulfillmentOutbox delete
   */
  export type FulfillmentOutboxDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FulfillmentOutbox
     */
    select?: FulfillmentOutboxSelect<ExtArgs> | null
    /**
     * Filter which FulfillmentOutbox to delete.
     */
    where: FulfillmentOutboxWhereUniqueInput
  }

  /**
   * FulfillmentOutbox deleteMany
   */
  export type FulfillmentOutboxDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FulfillmentOutboxes to delete
     */
    where?: FulfillmentOutboxWhereInput
  }

  /**
   * FulfillmentOutbox without action
   */
  export type FulfillmentOutboxDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FulfillmentOutbox
     */
    select?: FulfillmentOutboxSelect<ExtArgs> | null
  }


  /**
   * Model ProcessedEvent
   */

  export type AggregateProcessedEvent = {
    _count: ProcessedEventCountAggregateOutputType | null
    _min: ProcessedEventMinAggregateOutputType | null
    _max: ProcessedEventMaxAggregateOutputType | null
  }

  export type ProcessedEventMinAggregateOutputType = {
    id: string | null
    event_id: string | null
    consumer_group: string | null
    event_type: string | null
    processed_at: Date | null
  }

  export type ProcessedEventMaxAggregateOutputType = {
    id: string | null
    event_id: string | null
    consumer_group: string | null
    event_type: string | null
    processed_at: Date | null
  }

  export type ProcessedEventCountAggregateOutputType = {
    id: number
    event_id: number
    consumer_group: number
    event_type: number
    processed_at: number
    _all: number
  }


  export type ProcessedEventMinAggregateInputType = {
    id?: true
    event_id?: true
    consumer_group?: true
    event_type?: true
    processed_at?: true
  }

  export type ProcessedEventMaxAggregateInputType = {
    id?: true
    event_id?: true
    consumer_group?: true
    event_type?: true
    processed_at?: true
  }

  export type ProcessedEventCountAggregateInputType = {
    id?: true
    event_id?: true
    consumer_group?: true
    event_type?: true
    processed_at?: true
    _all?: true
  }

  export type ProcessedEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProcessedEvent to aggregate.
     */
    where?: ProcessedEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProcessedEvents to fetch.
     */
    orderBy?: ProcessedEventOrderByWithRelationInput | ProcessedEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProcessedEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProcessedEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProcessedEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProcessedEvents
    **/
    _count?: true | ProcessedEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProcessedEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProcessedEventMaxAggregateInputType
  }

  export type GetProcessedEventAggregateType<T extends ProcessedEventAggregateArgs> = {
        [P in keyof T & keyof AggregateProcessedEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProcessedEvent[P]>
      : GetScalarType<T[P], AggregateProcessedEvent[P]>
  }




  export type ProcessedEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProcessedEventWhereInput
    orderBy?: ProcessedEventOrderByWithAggregationInput | ProcessedEventOrderByWithAggregationInput[]
    by: ProcessedEventScalarFieldEnum[] | ProcessedEventScalarFieldEnum
    having?: ProcessedEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProcessedEventCountAggregateInputType | true
    _min?: ProcessedEventMinAggregateInputType
    _max?: ProcessedEventMaxAggregateInputType
  }

  export type ProcessedEventGroupByOutputType = {
    id: string
    event_id: string
    consumer_group: string
    event_type: string
    processed_at: Date
    _count: ProcessedEventCountAggregateOutputType | null
    _min: ProcessedEventMinAggregateOutputType | null
    _max: ProcessedEventMaxAggregateOutputType | null
  }

  type GetProcessedEventGroupByPayload<T extends ProcessedEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProcessedEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProcessedEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProcessedEventGroupByOutputType[P]>
            : GetScalarType<T[P], ProcessedEventGroupByOutputType[P]>
        }
      >
    >


  export type ProcessedEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    event_id?: boolean
    consumer_group?: boolean
    event_type?: boolean
    processed_at?: boolean
  }, ExtArgs["result"]["processedEvent"]>

  export type ProcessedEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    event_id?: boolean
    consumer_group?: boolean
    event_type?: boolean
    processed_at?: boolean
  }, ExtArgs["result"]["processedEvent"]>

  export type ProcessedEventSelectScalar = {
    id?: boolean
    event_id?: boolean
    consumer_group?: boolean
    event_type?: boolean
    processed_at?: boolean
  }


  export type $ProcessedEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProcessedEvent"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      event_id: string
      consumer_group: string
      event_type: string
      processed_at: Date
    }, ExtArgs["result"]["processedEvent"]>
    composites: {}
  }

  type ProcessedEventGetPayload<S extends boolean | null | undefined | ProcessedEventDefaultArgs> = $Result.GetResult<Prisma.$ProcessedEventPayload, S>

  type ProcessedEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ProcessedEventFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ProcessedEventCountAggregateInputType | true
    }

  export interface ProcessedEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProcessedEvent'], meta: { name: 'ProcessedEvent' } }
    /**
     * Find zero or one ProcessedEvent that matches the filter.
     * @param {ProcessedEventFindUniqueArgs} args - Arguments to find a ProcessedEvent
     * @example
     * // Get one ProcessedEvent
     * const processedEvent = await prisma.processedEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProcessedEventFindUniqueArgs>(args: SelectSubset<T, ProcessedEventFindUniqueArgs<ExtArgs>>): Prisma__ProcessedEventClient<$Result.GetResult<Prisma.$ProcessedEventPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ProcessedEvent that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ProcessedEventFindUniqueOrThrowArgs} args - Arguments to find a ProcessedEvent
     * @example
     * // Get one ProcessedEvent
     * const processedEvent = await prisma.processedEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProcessedEventFindUniqueOrThrowArgs>(args: SelectSubset<T, ProcessedEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProcessedEventClient<$Result.GetResult<Prisma.$ProcessedEventPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ProcessedEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessedEventFindFirstArgs} args - Arguments to find a ProcessedEvent
     * @example
     * // Get one ProcessedEvent
     * const processedEvent = await prisma.processedEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProcessedEventFindFirstArgs>(args?: SelectSubset<T, ProcessedEventFindFirstArgs<ExtArgs>>): Prisma__ProcessedEventClient<$Result.GetResult<Prisma.$ProcessedEventPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ProcessedEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessedEventFindFirstOrThrowArgs} args - Arguments to find a ProcessedEvent
     * @example
     * // Get one ProcessedEvent
     * const processedEvent = await prisma.processedEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProcessedEventFindFirstOrThrowArgs>(args?: SelectSubset<T, ProcessedEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProcessedEventClient<$Result.GetResult<Prisma.$ProcessedEventPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ProcessedEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessedEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProcessedEvents
     * const processedEvents = await prisma.processedEvent.findMany()
     * 
     * // Get first 10 ProcessedEvents
     * const processedEvents = await prisma.processedEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const processedEventWithIdOnly = await prisma.processedEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProcessedEventFindManyArgs>(args?: SelectSubset<T, ProcessedEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProcessedEventPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ProcessedEvent.
     * @param {ProcessedEventCreateArgs} args - Arguments to create a ProcessedEvent.
     * @example
     * // Create one ProcessedEvent
     * const ProcessedEvent = await prisma.processedEvent.create({
     *   data: {
     *     // ... data to create a ProcessedEvent
     *   }
     * })
     * 
     */
    create<T extends ProcessedEventCreateArgs>(args: SelectSubset<T, ProcessedEventCreateArgs<ExtArgs>>): Prisma__ProcessedEventClient<$Result.GetResult<Prisma.$ProcessedEventPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ProcessedEvents.
     * @param {ProcessedEventCreateManyArgs} args - Arguments to create many ProcessedEvents.
     * @example
     * // Create many ProcessedEvents
     * const processedEvent = await prisma.processedEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProcessedEventCreateManyArgs>(args?: SelectSubset<T, ProcessedEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProcessedEvents and returns the data saved in the database.
     * @param {ProcessedEventCreateManyAndReturnArgs} args - Arguments to create many ProcessedEvents.
     * @example
     * // Create many ProcessedEvents
     * const processedEvent = await prisma.processedEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProcessedEvents and only return the `id`
     * const processedEventWithIdOnly = await prisma.processedEvent.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProcessedEventCreateManyAndReturnArgs>(args?: SelectSubset<T, ProcessedEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProcessedEventPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ProcessedEvent.
     * @param {ProcessedEventDeleteArgs} args - Arguments to delete one ProcessedEvent.
     * @example
     * // Delete one ProcessedEvent
     * const ProcessedEvent = await prisma.processedEvent.delete({
     *   where: {
     *     // ... filter to delete one ProcessedEvent
     *   }
     * })
     * 
     */
    delete<T extends ProcessedEventDeleteArgs>(args: SelectSubset<T, ProcessedEventDeleteArgs<ExtArgs>>): Prisma__ProcessedEventClient<$Result.GetResult<Prisma.$ProcessedEventPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ProcessedEvent.
     * @param {ProcessedEventUpdateArgs} args - Arguments to update one ProcessedEvent.
     * @example
     * // Update one ProcessedEvent
     * const processedEvent = await prisma.processedEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProcessedEventUpdateArgs>(args: SelectSubset<T, ProcessedEventUpdateArgs<ExtArgs>>): Prisma__ProcessedEventClient<$Result.GetResult<Prisma.$ProcessedEventPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ProcessedEvents.
     * @param {ProcessedEventDeleteManyArgs} args - Arguments to filter ProcessedEvents to delete.
     * @example
     * // Delete a few ProcessedEvents
     * const { count } = await prisma.processedEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProcessedEventDeleteManyArgs>(args?: SelectSubset<T, ProcessedEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProcessedEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessedEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProcessedEvents
     * const processedEvent = await prisma.processedEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProcessedEventUpdateManyArgs>(args: SelectSubset<T, ProcessedEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ProcessedEvent.
     * @param {ProcessedEventUpsertArgs} args - Arguments to update or create a ProcessedEvent.
     * @example
     * // Update or create a ProcessedEvent
     * const processedEvent = await prisma.processedEvent.upsert({
     *   create: {
     *     // ... data to create a ProcessedEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProcessedEvent we want to update
     *   }
     * })
     */
    upsert<T extends ProcessedEventUpsertArgs>(args: SelectSubset<T, ProcessedEventUpsertArgs<ExtArgs>>): Prisma__ProcessedEventClient<$Result.GetResult<Prisma.$ProcessedEventPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ProcessedEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessedEventCountArgs} args - Arguments to filter ProcessedEvents to count.
     * @example
     * // Count the number of ProcessedEvents
     * const count = await prisma.processedEvent.count({
     *   where: {
     *     // ... the filter for the ProcessedEvents we want to count
     *   }
     * })
    **/
    count<T extends ProcessedEventCountArgs>(
      args?: Subset<T, ProcessedEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProcessedEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProcessedEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessedEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProcessedEventAggregateArgs>(args: Subset<T, ProcessedEventAggregateArgs>): Prisma.PrismaPromise<GetProcessedEventAggregateType<T>>

    /**
     * Group by ProcessedEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessedEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProcessedEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProcessedEventGroupByArgs['orderBy'] }
        : { orderBy?: ProcessedEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProcessedEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProcessedEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProcessedEvent model
   */
  readonly fields: ProcessedEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProcessedEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProcessedEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProcessedEvent model
   */ 
  interface ProcessedEventFieldRefs {
    readonly id: FieldRef<"ProcessedEvent", 'String'>
    readonly event_id: FieldRef<"ProcessedEvent", 'String'>
    readonly consumer_group: FieldRef<"ProcessedEvent", 'String'>
    readonly event_type: FieldRef<"ProcessedEvent", 'String'>
    readonly processed_at: FieldRef<"ProcessedEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProcessedEvent findUnique
   */
  export type ProcessedEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedEvent
     */
    select?: ProcessedEventSelect<ExtArgs> | null
    /**
     * Filter, which ProcessedEvent to fetch.
     */
    where: ProcessedEventWhereUniqueInput
  }

  /**
   * ProcessedEvent findUniqueOrThrow
   */
  export type ProcessedEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedEvent
     */
    select?: ProcessedEventSelect<ExtArgs> | null
    /**
     * Filter, which ProcessedEvent to fetch.
     */
    where: ProcessedEventWhereUniqueInput
  }

  /**
   * ProcessedEvent findFirst
   */
  export type ProcessedEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedEvent
     */
    select?: ProcessedEventSelect<ExtArgs> | null
    /**
     * Filter, which ProcessedEvent to fetch.
     */
    where?: ProcessedEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProcessedEvents to fetch.
     */
    orderBy?: ProcessedEventOrderByWithRelationInput | ProcessedEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProcessedEvents.
     */
    cursor?: ProcessedEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProcessedEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProcessedEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProcessedEvents.
     */
    distinct?: ProcessedEventScalarFieldEnum | ProcessedEventScalarFieldEnum[]
  }

  /**
   * ProcessedEvent findFirstOrThrow
   */
  export type ProcessedEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedEvent
     */
    select?: ProcessedEventSelect<ExtArgs> | null
    /**
     * Filter, which ProcessedEvent to fetch.
     */
    where?: ProcessedEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProcessedEvents to fetch.
     */
    orderBy?: ProcessedEventOrderByWithRelationInput | ProcessedEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProcessedEvents.
     */
    cursor?: ProcessedEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProcessedEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProcessedEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProcessedEvents.
     */
    distinct?: ProcessedEventScalarFieldEnum | ProcessedEventScalarFieldEnum[]
  }

  /**
   * ProcessedEvent findMany
   */
  export type ProcessedEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedEvent
     */
    select?: ProcessedEventSelect<ExtArgs> | null
    /**
     * Filter, which ProcessedEvents to fetch.
     */
    where?: ProcessedEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProcessedEvents to fetch.
     */
    orderBy?: ProcessedEventOrderByWithRelationInput | ProcessedEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProcessedEvents.
     */
    cursor?: ProcessedEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProcessedEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProcessedEvents.
     */
    skip?: number
    distinct?: ProcessedEventScalarFieldEnum | ProcessedEventScalarFieldEnum[]
  }

  /**
   * ProcessedEvent create
   */
  export type ProcessedEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedEvent
     */
    select?: ProcessedEventSelect<ExtArgs> | null
    /**
     * The data needed to create a ProcessedEvent.
     */
    data: XOR<ProcessedEventCreateInput, ProcessedEventUncheckedCreateInput>
  }

  /**
   * ProcessedEvent createMany
   */
  export type ProcessedEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProcessedEvents.
     */
    data: ProcessedEventCreateManyInput | ProcessedEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProcessedEvent createManyAndReturn
   */
  export type ProcessedEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedEvent
     */
    select?: ProcessedEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ProcessedEvents.
     */
    data: ProcessedEventCreateManyInput | ProcessedEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProcessedEvent update
   */
  export type ProcessedEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedEvent
     */
    select?: ProcessedEventSelect<ExtArgs> | null
    /**
     * The data needed to update a ProcessedEvent.
     */
    data: XOR<ProcessedEventUpdateInput, ProcessedEventUncheckedUpdateInput>
    /**
     * Choose, which ProcessedEvent to update.
     */
    where: ProcessedEventWhereUniqueInput
  }

  /**
   * ProcessedEvent updateMany
   */
  export type ProcessedEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProcessedEvents.
     */
    data: XOR<ProcessedEventUpdateManyMutationInput, ProcessedEventUncheckedUpdateManyInput>
    /**
     * Filter which ProcessedEvents to update
     */
    where?: ProcessedEventWhereInput
  }

  /**
   * ProcessedEvent upsert
   */
  export type ProcessedEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedEvent
     */
    select?: ProcessedEventSelect<ExtArgs> | null
    /**
     * The filter to search for the ProcessedEvent to update in case it exists.
     */
    where: ProcessedEventWhereUniqueInput
    /**
     * In case the ProcessedEvent found by the `where` argument doesn't exist, create a new ProcessedEvent with this data.
     */
    create: XOR<ProcessedEventCreateInput, ProcessedEventUncheckedCreateInput>
    /**
     * In case the ProcessedEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProcessedEventUpdateInput, ProcessedEventUncheckedUpdateInput>
  }

  /**
   * ProcessedEvent delete
   */
  export type ProcessedEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedEvent
     */
    select?: ProcessedEventSelect<ExtArgs> | null
    /**
     * Filter which ProcessedEvent to delete.
     */
    where: ProcessedEventWhereUniqueInput
  }

  /**
   * ProcessedEvent deleteMany
   */
  export type ProcessedEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProcessedEvents to delete
     */
    where?: ProcessedEventWhereInput
  }

  /**
   * ProcessedEvent without action
   */
  export type ProcessedEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessedEvent
     */
    select?: ProcessedEventSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const WarehouseScalarFieldEnum: {
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

  export type WarehouseScalarFieldEnum = (typeof WarehouseScalarFieldEnum)[keyof typeof WarehouseScalarFieldEnum]


  export const InventoryItemScalarFieldEnum: {
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

  export type InventoryItemScalarFieldEnum = (typeof InventoryItemScalarFieldEnum)[keyof typeof InventoryItemScalarFieldEnum]


  export const InventoryReservationScalarFieldEnum: {
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

  export type InventoryReservationScalarFieldEnum = (typeof InventoryReservationScalarFieldEnum)[keyof typeof InventoryReservationScalarFieldEnum]


  export const ReservationItemScalarFieldEnum: {
    id: 'id',
    reservation_id: 'reservation_id',
    inventory_item_id: 'inventory_item_id',
    product_id: 'product_id',
    sku: 'sku',
    quantity: 'quantity',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type ReservationItemScalarFieldEnum = (typeof ReservationItemScalarFieldEnum)[keyof typeof ReservationItemScalarFieldEnum]


  export const ShipmentScalarFieldEnum: {
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

  export type ShipmentScalarFieldEnum = (typeof ShipmentScalarFieldEnum)[keyof typeof ShipmentScalarFieldEnum]


  export const ShipmentItemScalarFieldEnum: {
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

  export type ShipmentItemScalarFieldEnum = (typeof ShipmentItemScalarFieldEnum)[keyof typeof ShipmentItemScalarFieldEnum]


  export const TrackingUpdateScalarFieldEnum: {
    id: 'id',
    shipment_id: 'shipment_id',
    status: 'status',
    location: 'location',
    description: 'description',
    recorded_by: 'recorded_by',
    recorded_at: 'recorded_at'
  };

  export type TrackingUpdateScalarFieldEnum = (typeof TrackingUpdateScalarFieldEnum)[keyof typeof TrackingUpdateScalarFieldEnum]


  export const ReturnPickupScalarFieldEnum: {
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

  export type ReturnPickupScalarFieldEnum = (typeof ReturnPickupScalarFieldEnum)[keyof typeof ReturnPickupScalarFieldEnum]


  export const ReturnItemScalarFieldEnum: {
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

  export type ReturnItemScalarFieldEnum = (typeof ReturnItemScalarFieldEnum)[keyof typeof ReturnItemScalarFieldEnum]


  export const ReturnTrackingUpdateScalarFieldEnum: {
    id: 'id',
    return_pickup_id: 'return_pickup_id',
    status: 'status',
    location: 'location',
    description: 'description',
    recorded_by: 'recorded_by',
    recorded_at: 'recorded_at'
  };

  export type ReturnTrackingUpdateScalarFieldEnum = (typeof ReturnTrackingUpdateScalarFieldEnum)[keyof typeof ReturnTrackingUpdateScalarFieldEnum]


  export const FulfillmentOutboxScalarFieldEnum: {
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

  export type FulfillmentOutboxScalarFieldEnum = (typeof FulfillmentOutboxScalarFieldEnum)[keyof typeof FulfillmentOutboxScalarFieldEnum]


  export const ProcessedEventScalarFieldEnum: {
    id: 'id',
    event_id: 'event_id',
    consumer_group: 'consumer_group',
    event_type: 'event_type',
    processed_at: 'processed_at'
  };

  export type ProcessedEventScalarFieldEnum = (typeof ProcessedEventScalarFieldEnum)[keyof typeof ProcessedEventScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'ReservationStatus'
   */
  export type EnumReservationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReservationStatus'>
    


  /**
   * Reference to a field of type 'ReservationStatus[]'
   */
  export type ListEnumReservationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReservationStatus[]'>
    


  /**
   * Reference to a field of type 'ShipmentStatus'
   */
  export type EnumShipmentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ShipmentStatus'>
    


  /**
   * Reference to a field of type 'ShipmentStatus[]'
   */
  export type ListEnumShipmentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ShipmentStatus[]'>
    


  /**
   * Reference to a field of type 'CourierCode'
   */
  export type EnumCourierCodeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CourierCode'>
    


  /**
   * Reference to a field of type 'CourierCode[]'
   */
  export type ListEnumCourierCodeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CourierCode[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'ReturnPickupStatus'
   */
  export type EnumReturnPickupStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReturnPickupStatus'>
    


  /**
   * Reference to a field of type 'ReturnPickupStatus[]'
   */
  export type ListEnumReturnPickupStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReturnPickupStatus[]'>
    


  /**
   * Reference to a field of type 'InspectionGrade'
   */
  export type EnumInspectionGradeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InspectionGrade'>
    


  /**
   * Reference to a field of type 'InspectionGrade[]'
   */
  export type ListEnumInspectionGradeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InspectionGrade[]'>
    


  /**
   * Reference to a field of type 'OutboxStatus'
   */
  export type EnumOutboxStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OutboxStatus'>
    


  /**
   * Reference to a field of type 'OutboxStatus[]'
   */
  export type ListEnumOutboxStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OutboxStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type WarehouseWhereInput = {
    AND?: WarehouseWhereInput | WarehouseWhereInput[]
    OR?: WarehouseWhereInput[]
    NOT?: WarehouseWhereInput | WarehouseWhereInput[]
    id?: UuidFilter<"Warehouse"> | string
    code?: StringFilter<"Warehouse"> | string
    name?: StringFilter<"Warehouse"> | string
    address_line1?: StringFilter<"Warehouse"> | string
    address_line2?: StringNullableFilter<"Warehouse"> | string | null
    city?: StringFilter<"Warehouse"> | string
    state?: StringFilter<"Warehouse"> | string
    postal_code?: StringFilter<"Warehouse"> | string
    country?: StringFilter<"Warehouse"> | string
    is_active?: BoolFilter<"Warehouse"> | boolean
    created_at?: DateTimeFilter<"Warehouse"> | Date | string
    updated_at?: DateTimeFilter<"Warehouse"> | Date | string
    inventory_items?: InventoryItemListRelationFilter
    shipments?: ShipmentListRelationFilter
    return_pickups?: ReturnPickupListRelationFilter
  }

  export type WarehouseOrderByWithRelationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    address_line1?: SortOrder
    address_line2?: SortOrderInput | SortOrder
    city?: SortOrder
    state?: SortOrder
    postal_code?: SortOrder
    country?: SortOrder
    is_active?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    inventory_items?: InventoryItemOrderByRelationAggregateInput
    shipments?: ShipmentOrderByRelationAggregateInput
    return_pickups?: ReturnPickupOrderByRelationAggregateInput
  }

  export type WarehouseWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    code?: string
    AND?: WarehouseWhereInput | WarehouseWhereInput[]
    OR?: WarehouseWhereInput[]
    NOT?: WarehouseWhereInput | WarehouseWhereInput[]
    name?: StringFilter<"Warehouse"> | string
    address_line1?: StringFilter<"Warehouse"> | string
    address_line2?: StringNullableFilter<"Warehouse"> | string | null
    city?: StringFilter<"Warehouse"> | string
    state?: StringFilter<"Warehouse"> | string
    postal_code?: StringFilter<"Warehouse"> | string
    country?: StringFilter<"Warehouse"> | string
    is_active?: BoolFilter<"Warehouse"> | boolean
    created_at?: DateTimeFilter<"Warehouse"> | Date | string
    updated_at?: DateTimeFilter<"Warehouse"> | Date | string
    inventory_items?: InventoryItemListRelationFilter
    shipments?: ShipmentListRelationFilter
    return_pickups?: ReturnPickupListRelationFilter
  }, "id" | "code">

  export type WarehouseOrderByWithAggregationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    address_line1?: SortOrder
    address_line2?: SortOrderInput | SortOrder
    city?: SortOrder
    state?: SortOrder
    postal_code?: SortOrder
    country?: SortOrder
    is_active?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: WarehouseCountOrderByAggregateInput
    _max?: WarehouseMaxOrderByAggregateInput
    _min?: WarehouseMinOrderByAggregateInput
  }

  export type WarehouseScalarWhereWithAggregatesInput = {
    AND?: WarehouseScalarWhereWithAggregatesInput | WarehouseScalarWhereWithAggregatesInput[]
    OR?: WarehouseScalarWhereWithAggregatesInput[]
    NOT?: WarehouseScalarWhereWithAggregatesInput | WarehouseScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Warehouse"> | string
    code?: StringWithAggregatesFilter<"Warehouse"> | string
    name?: StringWithAggregatesFilter<"Warehouse"> | string
    address_line1?: StringWithAggregatesFilter<"Warehouse"> | string
    address_line2?: StringNullableWithAggregatesFilter<"Warehouse"> | string | null
    city?: StringWithAggregatesFilter<"Warehouse"> | string
    state?: StringWithAggregatesFilter<"Warehouse"> | string
    postal_code?: StringWithAggregatesFilter<"Warehouse"> | string
    country?: StringWithAggregatesFilter<"Warehouse"> | string
    is_active?: BoolWithAggregatesFilter<"Warehouse"> | boolean
    created_at?: DateTimeWithAggregatesFilter<"Warehouse"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Warehouse"> | Date | string
  }

  export type InventoryItemWhereInput = {
    AND?: InventoryItemWhereInput | InventoryItemWhereInput[]
    OR?: InventoryItemWhereInput[]
    NOT?: InventoryItemWhereInput | InventoryItemWhereInput[]
    id?: UuidFilter<"InventoryItem"> | string
    product_id?: UuidFilter<"InventoryItem"> | string
    sku?: StringFilter<"InventoryItem"> | string
    seller_id?: UuidNullableFilter<"InventoryItem"> | string | null
    warehouse_id?: UuidFilter<"InventoryItem"> | string
    quantity_on_hand?: IntFilter<"InventoryItem"> | number
    quantity_reserved?: IntFilter<"InventoryItem"> | number
    quantity_allocated?: IntFilter<"InventoryItem"> | number
    safety_stock?: IntFilter<"InventoryItem"> | number
    reorder_threshold?: IntFilter<"InventoryItem"> | number
    version?: IntFilter<"InventoryItem"> | number
    is_active?: BoolFilter<"InventoryItem"> | boolean
    created_at?: DateTimeFilter<"InventoryItem"> | Date | string
    updated_at?: DateTimeFilter<"InventoryItem"> | Date | string
    warehouse?: XOR<WarehouseRelationFilter, WarehouseWhereInput>
    reservation_items?: ReservationItemListRelationFilter
  }

  export type InventoryItemOrderByWithRelationInput = {
    id?: SortOrder
    product_id?: SortOrder
    sku?: SortOrder
    seller_id?: SortOrderInput | SortOrder
    warehouse_id?: SortOrder
    quantity_on_hand?: SortOrder
    quantity_reserved?: SortOrder
    quantity_allocated?: SortOrder
    safety_stock?: SortOrder
    reorder_threshold?: SortOrder
    version?: SortOrder
    is_active?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    warehouse?: WarehouseOrderByWithRelationInput
    reservation_items?: ReservationItemOrderByRelationAggregateInput
  }

  export type InventoryItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    warehouse_id_sku?: InventoryItemWarehouse_idSkuCompoundUniqueInput
    AND?: InventoryItemWhereInput | InventoryItemWhereInput[]
    OR?: InventoryItemWhereInput[]
    NOT?: InventoryItemWhereInput | InventoryItemWhereInput[]
    product_id?: UuidFilter<"InventoryItem"> | string
    sku?: StringFilter<"InventoryItem"> | string
    seller_id?: UuidNullableFilter<"InventoryItem"> | string | null
    warehouse_id?: UuidFilter<"InventoryItem"> | string
    quantity_on_hand?: IntFilter<"InventoryItem"> | number
    quantity_reserved?: IntFilter<"InventoryItem"> | number
    quantity_allocated?: IntFilter<"InventoryItem"> | number
    safety_stock?: IntFilter<"InventoryItem"> | number
    reorder_threshold?: IntFilter<"InventoryItem"> | number
    version?: IntFilter<"InventoryItem"> | number
    is_active?: BoolFilter<"InventoryItem"> | boolean
    created_at?: DateTimeFilter<"InventoryItem"> | Date | string
    updated_at?: DateTimeFilter<"InventoryItem"> | Date | string
    warehouse?: XOR<WarehouseRelationFilter, WarehouseWhereInput>
    reservation_items?: ReservationItemListRelationFilter
  }, "id" | "warehouse_id_sku">

  export type InventoryItemOrderByWithAggregationInput = {
    id?: SortOrder
    product_id?: SortOrder
    sku?: SortOrder
    seller_id?: SortOrderInput | SortOrder
    warehouse_id?: SortOrder
    quantity_on_hand?: SortOrder
    quantity_reserved?: SortOrder
    quantity_allocated?: SortOrder
    safety_stock?: SortOrder
    reorder_threshold?: SortOrder
    version?: SortOrder
    is_active?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: InventoryItemCountOrderByAggregateInput
    _avg?: InventoryItemAvgOrderByAggregateInput
    _max?: InventoryItemMaxOrderByAggregateInput
    _min?: InventoryItemMinOrderByAggregateInput
    _sum?: InventoryItemSumOrderByAggregateInput
  }

  export type InventoryItemScalarWhereWithAggregatesInput = {
    AND?: InventoryItemScalarWhereWithAggregatesInput | InventoryItemScalarWhereWithAggregatesInput[]
    OR?: InventoryItemScalarWhereWithAggregatesInput[]
    NOT?: InventoryItemScalarWhereWithAggregatesInput | InventoryItemScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"InventoryItem"> | string
    product_id?: UuidWithAggregatesFilter<"InventoryItem"> | string
    sku?: StringWithAggregatesFilter<"InventoryItem"> | string
    seller_id?: UuidNullableWithAggregatesFilter<"InventoryItem"> | string | null
    warehouse_id?: UuidWithAggregatesFilter<"InventoryItem"> | string
    quantity_on_hand?: IntWithAggregatesFilter<"InventoryItem"> | number
    quantity_reserved?: IntWithAggregatesFilter<"InventoryItem"> | number
    quantity_allocated?: IntWithAggregatesFilter<"InventoryItem"> | number
    safety_stock?: IntWithAggregatesFilter<"InventoryItem"> | number
    reorder_threshold?: IntWithAggregatesFilter<"InventoryItem"> | number
    version?: IntWithAggregatesFilter<"InventoryItem"> | number
    is_active?: BoolWithAggregatesFilter<"InventoryItem"> | boolean
    created_at?: DateTimeWithAggregatesFilter<"InventoryItem"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"InventoryItem"> | Date | string
  }

  export type InventoryReservationWhereInput = {
    AND?: InventoryReservationWhereInput | InventoryReservationWhereInput[]
    OR?: InventoryReservationWhereInput[]
    NOT?: InventoryReservationWhereInput | InventoryReservationWhereInput[]
    id?: UuidFilter<"InventoryReservation"> | string
    reservation_key?: StringFilter<"InventoryReservation"> | string
    user_id?: UuidFilter<"InventoryReservation"> | string
    order_id?: UuidNullableFilter<"InventoryReservation"> | string | null
    status?: EnumReservationStatusFilter<"InventoryReservation"> | $Enums.ReservationStatus
    expires_at?: DateTimeFilter<"InventoryReservation"> | Date | string
    committed_at?: DateTimeNullableFilter<"InventoryReservation"> | Date | string | null
    released_at?: DateTimeNullableFilter<"InventoryReservation"> | Date | string | null
    expired_at?: DateTimeNullableFilter<"InventoryReservation"> | Date | string | null
    created_at?: DateTimeFilter<"InventoryReservation"> | Date | string
    updated_at?: DateTimeFilter<"InventoryReservation"> | Date | string
    items?: ReservationItemListRelationFilter
  }

  export type InventoryReservationOrderByWithRelationInput = {
    id?: SortOrder
    reservation_key?: SortOrder
    user_id?: SortOrder
    order_id?: SortOrderInput | SortOrder
    status?: SortOrder
    expires_at?: SortOrder
    committed_at?: SortOrderInput | SortOrder
    released_at?: SortOrderInput | SortOrder
    expired_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    items?: ReservationItemOrderByRelationAggregateInput
  }

  export type InventoryReservationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    reservation_key?: string
    AND?: InventoryReservationWhereInput | InventoryReservationWhereInput[]
    OR?: InventoryReservationWhereInput[]
    NOT?: InventoryReservationWhereInput | InventoryReservationWhereInput[]
    user_id?: UuidFilter<"InventoryReservation"> | string
    order_id?: UuidNullableFilter<"InventoryReservation"> | string | null
    status?: EnumReservationStatusFilter<"InventoryReservation"> | $Enums.ReservationStatus
    expires_at?: DateTimeFilter<"InventoryReservation"> | Date | string
    committed_at?: DateTimeNullableFilter<"InventoryReservation"> | Date | string | null
    released_at?: DateTimeNullableFilter<"InventoryReservation"> | Date | string | null
    expired_at?: DateTimeNullableFilter<"InventoryReservation"> | Date | string | null
    created_at?: DateTimeFilter<"InventoryReservation"> | Date | string
    updated_at?: DateTimeFilter<"InventoryReservation"> | Date | string
    items?: ReservationItemListRelationFilter
  }, "id" | "reservation_key">

  export type InventoryReservationOrderByWithAggregationInput = {
    id?: SortOrder
    reservation_key?: SortOrder
    user_id?: SortOrder
    order_id?: SortOrderInput | SortOrder
    status?: SortOrder
    expires_at?: SortOrder
    committed_at?: SortOrderInput | SortOrder
    released_at?: SortOrderInput | SortOrder
    expired_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: InventoryReservationCountOrderByAggregateInput
    _max?: InventoryReservationMaxOrderByAggregateInput
    _min?: InventoryReservationMinOrderByAggregateInput
  }

  export type InventoryReservationScalarWhereWithAggregatesInput = {
    AND?: InventoryReservationScalarWhereWithAggregatesInput | InventoryReservationScalarWhereWithAggregatesInput[]
    OR?: InventoryReservationScalarWhereWithAggregatesInput[]
    NOT?: InventoryReservationScalarWhereWithAggregatesInput | InventoryReservationScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"InventoryReservation"> | string
    reservation_key?: StringWithAggregatesFilter<"InventoryReservation"> | string
    user_id?: UuidWithAggregatesFilter<"InventoryReservation"> | string
    order_id?: UuidNullableWithAggregatesFilter<"InventoryReservation"> | string | null
    status?: EnumReservationStatusWithAggregatesFilter<"InventoryReservation"> | $Enums.ReservationStatus
    expires_at?: DateTimeWithAggregatesFilter<"InventoryReservation"> | Date | string
    committed_at?: DateTimeNullableWithAggregatesFilter<"InventoryReservation"> | Date | string | null
    released_at?: DateTimeNullableWithAggregatesFilter<"InventoryReservation"> | Date | string | null
    expired_at?: DateTimeNullableWithAggregatesFilter<"InventoryReservation"> | Date | string | null
    created_at?: DateTimeWithAggregatesFilter<"InventoryReservation"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"InventoryReservation"> | Date | string
  }

  export type ReservationItemWhereInput = {
    AND?: ReservationItemWhereInput | ReservationItemWhereInput[]
    OR?: ReservationItemWhereInput[]
    NOT?: ReservationItemWhereInput | ReservationItemWhereInput[]
    id?: UuidFilter<"ReservationItem"> | string
    reservation_id?: UuidFilter<"ReservationItem"> | string
    inventory_item_id?: UuidFilter<"ReservationItem"> | string
    product_id?: UuidFilter<"ReservationItem"> | string
    sku?: StringFilter<"ReservationItem"> | string
    quantity?: IntFilter<"ReservationItem"> | number
    created_at?: DateTimeFilter<"ReservationItem"> | Date | string
    updated_at?: DateTimeFilter<"ReservationItem"> | Date | string
    reservation?: XOR<InventoryReservationRelationFilter, InventoryReservationWhereInput>
    inventory_item?: XOR<InventoryItemRelationFilter, InventoryItemWhereInput>
  }

  export type ReservationItemOrderByWithRelationInput = {
    id?: SortOrder
    reservation_id?: SortOrder
    inventory_item_id?: SortOrder
    product_id?: SortOrder
    sku?: SortOrder
    quantity?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    reservation?: InventoryReservationOrderByWithRelationInput
    inventory_item?: InventoryItemOrderByWithRelationInput
  }

  export type ReservationItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    reservation_id_inventory_item_id?: ReservationItemReservation_idInventory_item_idCompoundUniqueInput
    AND?: ReservationItemWhereInput | ReservationItemWhereInput[]
    OR?: ReservationItemWhereInput[]
    NOT?: ReservationItemWhereInput | ReservationItemWhereInput[]
    reservation_id?: UuidFilter<"ReservationItem"> | string
    inventory_item_id?: UuidFilter<"ReservationItem"> | string
    product_id?: UuidFilter<"ReservationItem"> | string
    sku?: StringFilter<"ReservationItem"> | string
    quantity?: IntFilter<"ReservationItem"> | number
    created_at?: DateTimeFilter<"ReservationItem"> | Date | string
    updated_at?: DateTimeFilter<"ReservationItem"> | Date | string
    reservation?: XOR<InventoryReservationRelationFilter, InventoryReservationWhereInput>
    inventory_item?: XOR<InventoryItemRelationFilter, InventoryItemWhereInput>
  }, "id" | "reservation_id_inventory_item_id">

  export type ReservationItemOrderByWithAggregationInput = {
    id?: SortOrder
    reservation_id?: SortOrder
    inventory_item_id?: SortOrder
    product_id?: SortOrder
    sku?: SortOrder
    quantity?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: ReservationItemCountOrderByAggregateInput
    _avg?: ReservationItemAvgOrderByAggregateInput
    _max?: ReservationItemMaxOrderByAggregateInput
    _min?: ReservationItemMinOrderByAggregateInput
    _sum?: ReservationItemSumOrderByAggregateInput
  }

  export type ReservationItemScalarWhereWithAggregatesInput = {
    AND?: ReservationItemScalarWhereWithAggregatesInput | ReservationItemScalarWhereWithAggregatesInput[]
    OR?: ReservationItemScalarWhereWithAggregatesInput[]
    NOT?: ReservationItemScalarWhereWithAggregatesInput | ReservationItemScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ReservationItem"> | string
    reservation_id?: UuidWithAggregatesFilter<"ReservationItem"> | string
    inventory_item_id?: UuidWithAggregatesFilter<"ReservationItem"> | string
    product_id?: UuidWithAggregatesFilter<"ReservationItem"> | string
    sku?: StringWithAggregatesFilter<"ReservationItem"> | string
    quantity?: IntWithAggregatesFilter<"ReservationItem"> | number
    created_at?: DateTimeWithAggregatesFilter<"ReservationItem"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"ReservationItem"> | Date | string
  }

  export type ShipmentWhereInput = {
    AND?: ShipmentWhereInput | ShipmentWhereInput[]
    OR?: ShipmentWhereInput[]
    NOT?: ShipmentWhereInput | ShipmentWhereInput[]
    id?: UuidFilter<"Shipment"> | string
    shipment_number?: StringFilter<"Shipment"> | string
    order_id?: UuidFilter<"Shipment"> | string
    user_id?: UuidFilter<"Shipment"> | string
    warehouse_id?: UuidFilter<"Shipment"> | string
    reservation_id?: UuidNullableFilter<"Shipment"> | string | null
    status?: EnumShipmentStatusFilter<"Shipment"> | $Enums.ShipmentStatus
    courier_code?: EnumCourierCodeFilter<"Shipment"> | $Enums.CourierCode
    tracking_number?: StringNullableFilter<"Shipment"> | string | null
    shipping_address?: JsonFilter<"Shipment">
    label_url?: StringNullableFilter<"Shipment"> | string | null
    manifest_id?: StringNullableFilter<"Shipment"> | string | null
    estimated_delivery?: DateTimeNullableFilter<"Shipment"> | Date | string | null
    dispatched_at?: DateTimeNullableFilter<"Shipment"> | Date | string | null
    delivered_at?: DateTimeNullableFilter<"Shipment"> | Date | string | null
    delivery_notes?: StringNullableFilter<"Shipment"> | string | null
    pod_signature?: StringNullableFilter<"Shipment"> | string | null
    pod_received_by?: StringNullableFilter<"Shipment"> | string | null
    pod_received_at?: DateTimeNullableFilter<"Shipment"> | Date | string | null
    created_at?: DateTimeFilter<"Shipment"> | Date | string
    updated_at?: DateTimeFilter<"Shipment"> | Date | string
    warehouse?: XOR<WarehouseRelationFilter, WarehouseWhereInput>
    items?: ShipmentItemListRelationFilter
    tracking_updates?: TrackingUpdateListRelationFilter
  }

  export type ShipmentOrderByWithRelationInput = {
    id?: SortOrder
    shipment_number?: SortOrder
    order_id?: SortOrder
    user_id?: SortOrder
    warehouse_id?: SortOrder
    reservation_id?: SortOrderInput | SortOrder
    status?: SortOrder
    courier_code?: SortOrder
    tracking_number?: SortOrderInput | SortOrder
    shipping_address?: SortOrder
    label_url?: SortOrderInput | SortOrder
    manifest_id?: SortOrderInput | SortOrder
    estimated_delivery?: SortOrderInput | SortOrder
    dispatched_at?: SortOrderInput | SortOrder
    delivered_at?: SortOrderInput | SortOrder
    delivery_notes?: SortOrderInput | SortOrder
    pod_signature?: SortOrderInput | SortOrder
    pod_received_by?: SortOrderInput | SortOrder
    pod_received_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    warehouse?: WarehouseOrderByWithRelationInput
    items?: ShipmentItemOrderByRelationAggregateInput
    tracking_updates?: TrackingUpdateOrderByRelationAggregateInput
  }

  export type ShipmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    shipment_number?: string
    tracking_number?: string
    AND?: ShipmentWhereInput | ShipmentWhereInput[]
    OR?: ShipmentWhereInput[]
    NOT?: ShipmentWhereInput | ShipmentWhereInput[]
    order_id?: UuidFilter<"Shipment"> | string
    user_id?: UuidFilter<"Shipment"> | string
    warehouse_id?: UuidFilter<"Shipment"> | string
    reservation_id?: UuidNullableFilter<"Shipment"> | string | null
    status?: EnumShipmentStatusFilter<"Shipment"> | $Enums.ShipmentStatus
    courier_code?: EnumCourierCodeFilter<"Shipment"> | $Enums.CourierCode
    shipping_address?: JsonFilter<"Shipment">
    label_url?: StringNullableFilter<"Shipment"> | string | null
    manifest_id?: StringNullableFilter<"Shipment"> | string | null
    estimated_delivery?: DateTimeNullableFilter<"Shipment"> | Date | string | null
    dispatched_at?: DateTimeNullableFilter<"Shipment"> | Date | string | null
    delivered_at?: DateTimeNullableFilter<"Shipment"> | Date | string | null
    delivery_notes?: StringNullableFilter<"Shipment"> | string | null
    pod_signature?: StringNullableFilter<"Shipment"> | string | null
    pod_received_by?: StringNullableFilter<"Shipment"> | string | null
    pod_received_at?: DateTimeNullableFilter<"Shipment"> | Date | string | null
    created_at?: DateTimeFilter<"Shipment"> | Date | string
    updated_at?: DateTimeFilter<"Shipment"> | Date | string
    warehouse?: XOR<WarehouseRelationFilter, WarehouseWhereInput>
    items?: ShipmentItemListRelationFilter
    tracking_updates?: TrackingUpdateListRelationFilter
  }, "id" | "shipment_number" | "tracking_number">

  export type ShipmentOrderByWithAggregationInput = {
    id?: SortOrder
    shipment_number?: SortOrder
    order_id?: SortOrder
    user_id?: SortOrder
    warehouse_id?: SortOrder
    reservation_id?: SortOrderInput | SortOrder
    status?: SortOrder
    courier_code?: SortOrder
    tracking_number?: SortOrderInput | SortOrder
    shipping_address?: SortOrder
    label_url?: SortOrderInput | SortOrder
    manifest_id?: SortOrderInput | SortOrder
    estimated_delivery?: SortOrderInput | SortOrder
    dispatched_at?: SortOrderInput | SortOrder
    delivered_at?: SortOrderInput | SortOrder
    delivery_notes?: SortOrderInput | SortOrder
    pod_signature?: SortOrderInput | SortOrder
    pod_received_by?: SortOrderInput | SortOrder
    pod_received_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: ShipmentCountOrderByAggregateInput
    _max?: ShipmentMaxOrderByAggregateInput
    _min?: ShipmentMinOrderByAggregateInput
  }

  export type ShipmentScalarWhereWithAggregatesInput = {
    AND?: ShipmentScalarWhereWithAggregatesInput | ShipmentScalarWhereWithAggregatesInput[]
    OR?: ShipmentScalarWhereWithAggregatesInput[]
    NOT?: ShipmentScalarWhereWithAggregatesInput | ShipmentScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Shipment"> | string
    shipment_number?: StringWithAggregatesFilter<"Shipment"> | string
    order_id?: UuidWithAggregatesFilter<"Shipment"> | string
    user_id?: UuidWithAggregatesFilter<"Shipment"> | string
    warehouse_id?: UuidWithAggregatesFilter<"Shipment"> | string
    reservation_id?: UuidNullableWithAggregatesFilter<"Shipment"> | string | null
    status?: EnumShipmentStatusWithAggregatesFilter<"Shipment"> | $Enums.ShipmentStatus
    courier_code?: EnumCourierCodeWithAggregatesFilter<"Shipment"> | $Enums.CourierCode
    tracking_number?: StringNullableWithAggregatesFilter<"Shipment"> | string | null
    shipping_address?: JsonWithAggregatesFilter<"Shipment">
    label_url?: StringNullableWithAggregatesFilter<"Shipment"> | string | null
    manifest_id?: StringNullableWithAggregatesFilter<"Shipment"> | string | null
    estimated_delivery?: DateTimeNullableWithAggregatesFilter<"Shipment"> | Date | string | null
    dispatched_at?: DateTimeNullableWithAggregatesFilter<"Shipment"> | Date | string | null
    delivered_at?: DateTimeNullableWithAggregatesFilter<"Shipment"> | Date | string | null
    delivery_notes?: StringNullableWithAggregatesFilter<"Shipment"> | string | null
    pod_signature?: StringNullableWithAggregatesFilter<"Shipment"> | string | null
    pod_received_by?: StringNullableWithAggregatesFilter<"Shipment"> | string | null
    pod_received_at?: DateTimeNullableWithAggregatesFilter<"Shipment"> | Date | string | null
    created_at?: DateTimeWithAggregatesFilter<"Shipment"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Shipment"> | Date | string
  }

  export type ShipmentItemWhereInput = {
    AND?: ShipmentItemWhereInput | ShipmentItemWhereInput[]
    OR?: ShipmentItemWhereInput[]
    NOT?: ShipmentItemWhereInput | ShipmentItemWhereInput[]
    id?: UuidFilter<"ShipmentItem"> | string
    shipment_id?: UuidFilter<"ShipmentItem"> | string
    product_id?: UuidFilter<"ShipmentItem"> | string
    sku?: StringFilter<"ShipmentItem"> | string
    seller_id?: UuidNullableFilter<"ShipmentItem"> | string | null
    quantity?: IntFilter<"ShipmentItem"> | number
    unit_price?: DecimalNullableFilter<"ShipmentItem"> | Decimal | DecimalJsLike | number | string | null
    created_at?: DateTimeFilter<"ShipmentItem"> | Date | string
    updated_at?: DateTimeFilter<"ShipmentItem"> | Date | string
    shipment?: XOR<ShipmentRelationFilter, ShipmentWhereInput>
  }

  export type ShipmentItemOrderByWithRelationInput = {
    id?: SortOrder
    shipment_id?: SortOrder
    product_id?: SortOrder
    sku?: SortOrder
    seller_id?: SortOrderInput | SortOrder
    quantity?: SortOrder
    unit_price?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    shipment?: ShipmentOrderByWithRelationInput
  }

  export type ShipmentItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ShipmentItemWhereInput | ShipmentItemWhereInput[]
    OR?: ShipmentItemWhereInput[]
    NOT?: ShipmentItemWhereInput | ShipmentItemWhereInput[]
    shipment_id?: UuidFilter<"ShipmentItem"> | string
    product_id?: UuidFilter<"ShipmentItem"> | string
    sku?: StringFilter<"ShipmentItem"> | string
    seller_id?: UuidNullableFilter<"ShipmentItem"> | string | null
    quantity?: IntFilter<"ShipmentItem"> | number
    unit_price?: DecimalNullableFilter<"ShipmentItem"> | Decimal | DecimalJsLike | number | string | null
    created_at?: DateTimeFilter<"ShipmentItem"> | Date | string
    updated_at?: DateTimeFilter<"ShipmentItem"> | Date | string
    shipment?: XOR<ShipmentRelationFilter, ShipmentWhereInput>
  }, "id">

  export type ShipmentItemOrderByWithAggregationInput = {
    id?: SortOrder
    shipment_id?: SortOrder
    product_id?: SortOrder
    sku?: SortOrder
    seller_id?: SortOrderInput | SortOrder
    quantity?: SortOrder
    unit_price?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: ShipmentItemCountOrderByAggregateInput
    _avg?: ShipmentItemAvgOrderByAggregateInput
    _max?: ShipmentItemMaxOrderByAggregateInput
    _min?: ShipmentItemMinOrderByAggregateInput
    _sum?: ShipmentItemSumOrderByAggregateInput
  }

  export type ShipmentItemScalarWhereWithAggregatesInput = {
    AND?: ShipmentItemScalarWhereWithAggregatesInput | ShipmentItemScalarWhereWithAggregatesInput[]
    OR?: ShipmentItemScalarWhereWithAggregatesInput[]
    NOT?: ShipmentItemScalarWhereWithAggregatesInput | ShipmentItemScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ShipmentItem"> | string
    shipment_id?: UuidWithAggregatesFilter<"ShipmentItem"> | string
    product_id?: UuidWithAggregatesFilter<"ShipmentItem"> | string
    sku?: StringWithAggregatesFilter<"ShipmentItem"> | string
    seller_id?: UuidNullableWithAggregatesFilter<"ShipmentItem"> | string | null
    quantity?: IntWithAggregatesFilter<"ShipmentItem"> | number
    unit_price?: DecimalNullableWithAggregatesFilter<"ShipmentItem"> | Decimal | DecimalJsLike | number | string | null
    created_at?: DateTimeWithAggregatesFilter<"ShipmentItem"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"ShipmentItem"> | Date | string
  }

  export type TrackingUpdateWhereInput = {
    AND?: TrackingUpdateWhereInput | TrackingUpdateWhereInput[]
    OR?: TrackingUpdateWhereInput[]
    NOT?: TrackingUpdateWhereInput | TrackingUpdateWhereInput[]
    id?: UuidFilter<"TrackingUpdate"> | string
    shipment_id?: UuidFilter<"TrackingUpdate"> | string
    status?: EnumShipmentStatusFilter<"TrackingUpdate"> | $Enums.ShipmentStatus
    location?: StringNullableFilter<"TrackingUpdate"> | string | null
    description?: StringFilter<"TrackingUpdate"> | string
    recorded_by?: UuidNullableFilter<"TrackingUpdate"> | string | null
    recorded_at?: DateTimeFilter<"TrackingUpdate"> | Date | string
    shipment?: XOR<ShipmentRelationFilter, ShipmentWhereInput>
  }

  export type TrackingUpdateOrderByWithRelationInput = {
    id?: SortOrder
    shipment_id?: SortOrder
    status?: SortOrder
    location?: SortOrderInput | SortOrder
    description?: SortOrder
    recorded_by?: SortOrderInput | SortOrder
    recorded_at?: SortOrder
    shipment?: ShipmentOrderByWithRelationInput
  }

  export type TrackingUpdateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TrackingUpdateWhereInput | TrackingUpdateWhereInput[]
    OR?: TrackingUpdateWhereInput[]
    NOT?: TrackingUpdateWhereInput | TrackingUpdateWhereInput[]
    shipment_id?: UuidFilter<"TrackingUpdate"> | string
    status?: EnumShipmentStatusFilter<"TrackingUpdate"> | $Enums.ShipmentStatus
    location?: StringNullableFilter<"TrackingUpdate"> | string | null
    description?: StringFilter<"TrackingUpdate"> | string
    recorded_by?: UuidNullableFilter<"TrackingUpdate"> | string | null
    recorded_at?: DateTimeFilter<"TrackingUpdate"> | Date | string
    shipment?: XOR<ShipmentRelationFilter, ShipmentWhereInput>
  }, "id">

  export type TrackingUpdateOrderByWithAggregationInput = {
    id?: SortOrder
    shipment_id?: SortOrder
    status?: SortOrder
    location?: SortOrderInput | SortOrder
    description?: SortOrder
    recorded_by?: SortOrderInput | SortOrder
    recorded_at?: SortOrder
    _count?: TrackingUpdateCountOrderByAggregateInput
    _max?: TrackingUpdateMaxOrderByAggregateInput
    _min?: TrackingUpdateMinOrderByAggregateInput
  }

  export type TrackingUpdateScalarWhereWithAggregatesInput = {
    AND?: TrackingUpdateScalarWhereWithAggregatesInput | TrackingUpdateScalarWhereWithAggregatesInput[]
    OR?: TrackingUpdateScalarWhereWithAggregatesInput[]
    NOT?: TrackingUpdateScalarWhereWithAggregatesInput | TrackingUpdateScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"TrackingUpdate"> | string
    shipment_id?: UuidWithAggregatesFilter<"TrackingUpdate"> | string
    status?: EnumShipmentStatusWithAggregatesFilter<"TrackingUpdate"> | $Enums.ShipmentStatus
    location?: StringNullableWithAggregatesFilter<"TrackingUpdate"> | string | null
    description?: StringWithAggregatesFilter<"TrackingUpdate"> | string
    recorded_by?: UuidNullableWithAggregatesFilter<"TrackingUpdate"> | string | null
    recorded_at?: DateTimeWithAggregatesFilter<"TrackingUpdate"> | Date | string
  }

  export type ReturnPickupWhereInput = {
    AND?: ReturnPickupWhereInput | ReturnPickupWhereInput[]
    OR?: ReturnPickupWhereInput[]
    NOT?: ReturnPickupWhereInput | ReturnPickupWhereInput[]
    id?: UuidFilter<"ReturnPickup"> | string
    return_number?: StringFilter<"ReturnPickup"> | string
    order_id?: UuidFilter<"ReturnPickup"> | string
    user_id?: UuidFilter<"ReturnPickup"> | string
    warehouse_id?: UuidFilter<"ReturnPickup"> | string
    status?: EnumReturnPickupStatusFilter<"ReturnPickup"> | $Enums.ReturnPickupStatus
    courier_code?: EnumCourierCodeFilter<"ReturnPickup"> | $Enums.CourierCode
    return_tracking_number?: StringNullableFilter<"ReturnPickup"> | string | null
    pickup_address?: JsonFilter<"ReturnPickup">
    scheduled_pickup_date?: DateTimeNullableFilter<"ReturnPickup"> | Date | string | null
    picked_up_at?: DateTimeNullableFilter<"ReturnPickup"> | Date | string | null
    received_at?: DateTimeNullableFilter<"ReturnPickup"> | Date | string | null
    completed_at?: DateTimeNullableFilter<"ReturnPickup"> | Date | string | null
    pop_signature?: StringNullableFilter<"ReturnPickup"> | string | null
    pop_received_by?: StringNullableFilter<"ReturnPickup"> | string | null
    cancellation_reason?: StringNullableFilter<"ReturnPickup"> | string | null
    created_at?: DateTimeFilter<"ReturnPickup"> | Date | string
    updated_at?: DateTimeFilter<"ReturnPickup"> | Date | string
    warehouse?: XOR<WarehouseRelationFilter, WarehouseWhereInput>
    items?: ReturnItemListRelationFilter
    tracking_updates?: ReturnTrackingUpdateListRelationFilter
  }

  export type ReturnPickupOrderByWithRelationInput = {
    id?: SortOrder
    return_number?: SortOrder
    order_id?: SortOrder
    user_id?: SortOrder
    warehouse_id?: SortOrder
    status?: SortOrder
    courier_code?: SortOrder
    return_tracking_number?: SortOrderInput | SortOrder
    pickup_address?: SortOrder
    scheduled_pickup_date?: SortOrderInput | SortOrder
    picked_up_at?: SortOrderInput | SortOrder
    received_at?: SortOrderInput | SortOrder
    completed_at?: SortOrderInput | SortOrder
    pop_signature?: SortOrderInput | SortOrder
    pop_received_by?: SortOrderInput | SortOrder
    cancellation_reason?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    warehouse?: WarehouseOrderByWithRelationInput
    items?: ReturnItemOrderByRelationAggregateInput
    tracking_updates?: ReturnTrackingUpdateOrderByRelationAggregateInput
  }

  export type ReturnPickupWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    return_number?: string
    return_tracking_number?: string
    AND?: ReturnPickupWhereInput | ReturnPickupWhereInput[]
    OR?: ReturnPickupWhereInput[]
    NOT?: ReturnPickupWhereInput | ReturnPickupWhereInput[]
    order_id?: UuidFilter<"ReturnPickup"> | string
    user_id?: UuidFilter<"ReturnPickup"> | string
    warehouse_id?: UuidFilter<"ReturnPickup"> | string
    status?: EnumReturnPickupStatusFilter<"ReturnPickup"> | $Enums.ReturnPickupStatus
    courier_code?: EnumCourierCodeFilter<"ReturnPickup"> | $Enums.CourierCode
    pickup_address?: JsonFilter<"ReturnPickup">
    scheduled_pickup_date?: DateTimeNullableFilter<"ReturnPickup"> | Date | string | null
    picked_up_at?: DateTimeNullableFilter<"ReturnPickup"> | Date | string | null
    received_at?: DateTimeNullableFilter<"ReturnPickup"> | Date | string | null
    completed_at?: DateTimeNullableFilter<"ReturnPickup"> | Date | string | null
    pop_signature?: StringNullableFilter<"ReturnPickup"> | string | null
    pop_received_by?: StringNullableFilter<"ReturnPickup"> | string | null
    cancellation_reason?: StringNullableFilter<"ReturnPickup"> | string | null
    created_at?: DateTimeFilter<"ReturnPickup"> | Date | string
    updated_at?: DateTimeFilter<"ReturnPickup"> | Date | string
    warehouse?: XOR<WarehouseRelationFilter, WarehouseWhereInput>
    items?: ReturnItemListRelationFilter
    tracking_updates?: ReturnTrackingUpdateListRelationFilter
  }, "id" | "return_number" | "return_tracking_number">

  export type ReturnPickupOrderByWithAggregationInput = {
    id?: SortOrder
    return_number?: SortOrder
    order_id?: SortOrder
    user_id?: SortOrder
    warehouse_id?: SortOrder
    status?: SortOrder
    courier_code?: SortOrder
    return_tracking_number?: SortOrderInput | SortOrder
    pickup_address?: SortOrder
    scheduled_pickup_date?: SortOrderInput | SortOrder
    picked_up_at?: SortOrderInput | SortOrder
    received_at?: SortOrderInput | SortOrder
    completed_at?: SortOrderInput | SortOrder
    pop_signature?: SortOrderInput | SortOrder
    pop_received_by?: SortOrderInput | SortOrder
    cancellation_reason?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: ReturnPickupCountOrderByAggregateInput
    _max?: ReturnPickupMaxOrderByAggregateInput
    _min?: ReturnPickupMinOrderByAggregateInput
  }

  export type ReturnPickupScalarWhereWithAggregatesInput = {
    AND?: ReturnPickupScalarWhereWithAggregatesInput | ReturnPickupScalarWhereWithAggregatesInput[]
    OR?: ReturnPickupScalarWhereWithAggregatesInput[]
    NOT?: ReturnPickupScalarWhereWithAggregatesInput | ReturnPickupScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ReturnPickup"> | string
    return_number?: StringWithAggregatesFilter<"ReturnPickup"> | string
    order_id?: UuidWithAggregatesFilter<"ReturnPickup"> | string
    user_id?: UuidWithAggregatesFilter<"ReturnPickup"> | string
    warehouse_id?: UuidWithAggregatesFilter<"ReturnPickup"> | string
    status?: EnumReturnPickupStatusWithAggregatesFilter<"ReturnPickup"> | $Enums.ReturnPickupStatus
    courier_code?: EnumCourierCodeWithAggregatesFilter<"ReturnPickup"> | $Enums.CourierCode
    return_tracking_number?: StringNullableWithAggregatesFilter<"ReturnPickup"> | string | null
    pickup_address?: JsonWithAggregatesFilter<"ReturnPickup">
    scheduled_pickup_date?: DateTimeNullableWithAggregatesFilter<"ReturnPickup"> | Date | string | null
    picked_up_at?: DateTimeNullableWithAggregatesFilter<"ReturnPickup"> | Date | string | null
    received_at?: DateTimeNullableWithAggregatesFilter<"ReturnPickup"> | Date | string | null
    completed_at?: DateTimeNullableWithAggregatesFilter<"ReturnPickup"> | Date | string | null
    pop_signature?: StringNullableWithAggregatesFilter<"ReturnPickup"> | string | null
    pop_received_by?: StringNullableWithAggregatesFilter<"ReturnPickup"> | string | null
    cancellation_reason?: StringNullableWithAggregatesFilter<"ReturnPickup"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"ReturnPickup"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"ReturnPickup"> | Date | string
  }

  export type ReturnItemWhereInput = {
    AND?: ReturnItemWhereInput | ReturnItemWhereInput[]
    OR?: ReturnItemWhereInput[]
    NOT?: ReturnItemWhereInput | ReturnItemWhereInput[]
    id?: UuidFilter<"ReturnItem"> | string
    return_pickup_id?: UuidFilter<"ReturnItem"> | string
    product_id?: UuidFilter<"ReturnItem"> | string
    sku?: StringFilter<"ReturnItem"> | string
    seller_id?: UuidNullableFilter<"ReturnItem"> | string | null
    quantity?: IntFilter<"ReturnItem"> | number
    reason?: StringFilter<"ReturnItem"> | string
    inspection_grade?: EnumInspectionGradeNullableFilter<"ReturnItem"> | $Enums.InspectionGrade | null
    inspection_notes?: StringNullableFilter<"ReturnItem"> | string | null
    is_restocked?: BoolFilter<"ReturnItem"> | boolean
    restocked_at?: DateTimeNullableFilter<"ReturnItem"> | Date | string | null
    created_at?: DateTimeFilter<"ReturnItem"> | Date | string
    updated_at?: DateTimeFilter<"ReturnItem"> | Date | string
    return_pickup?: XOR<ReturnPickupRelationFilter, ReturnPickupWhereInput>
  }

  export type ReturnItemOrderByWithRelationInput = {
    id?: SortOrder
    return_pickup_id?: SortOrder
    product_id?: SortOrder
    sku?: SortOrder
    seller_id?: SortOrderInput | SortOrder
    quantity?: SortOrder
    reason?: SortOrder
    inspection_grade?: SortOrderInput | SortOrder
    inspection_notes?: SortOrderInput | SortOrder
    is_restocked?: SortOrder
    restocked_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    return_pickup?: ReturnPickupOrderByWithRelationInput
  }

  export type ReturnItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ReturnItemWhereInput | ReturnItemWhereInput[]
    OR?: ReturnItemWhereInput[]
    NOT?: ReturnItemWhereInput | ReturnItemWhereInput[]
    return_pickup_id?: UuidFilter<"ReturnItem"> | string
    product_id?: UuidFilter<"ReturnItem"> | string
    sku?: StringFilter<"ReturnItem"> | string
    seller_id?: UuidNullableFilter<"ReturnItem"> | string | null
    quantity?: IntFilter<"ReturnItem"> | number
    reason?: StringFilter<"ReturnItem"> | string
    inspection_grade?: EnumInspectionGradeNullableFilter<"ReturnItem"> | $Enums.InspectionGrade | null
    inspection_notes?: StringNullableFilter<"ReturnItem"> | string | null
    is_restocked?: BoolFilter<"ReturnItem"> | boolean
    restocked_at?: DateTimeNullableFilter<"ReturnItem"> | Date | string | null
    created_at?: DateTimeFilter<"ReturnItem"> | Date | string
    updated_at?: DateTimeFilter<"ReturnItem"> | Date | string
    return_pickup?: XOR<ReturnPickupRelationFilter, ReturnPickupWhereInput>
  }, "id">

  export type ReturnItemOrderByWithAggregationInput = {
    id?: SortOrder
    return_pickup_id?: SortOrder
    product_id?: SortOrder
    sku?: SortOrder
    seller_id?: SortOrderInput | SortOrder
    quantity?: SortOrder
    reason?: SortOrder
    inspection_grade?: SortOrderInput | SortOrder
    inspection_notes?: SortOrderInput | SortOrder
    is_restocked?: SortOrder
    restocked_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: ReturnItemCountOrderByAggregateInput
    _avg?: ReturnItemAvgOrderByAggregateInput
    _max?: ReturnItemMaxOrderByAggregateInput
    _min?: ReturnItemMinOrderByAggregateInput
    _sum?: ReturnItemSumOrderByAggregateInput
  }

  export type ReturnItemScalarWhereWithAggregatesInput = {
    AND?: ReturnItemScalarWhereWithAggregatesInput | ReturnItemScalarWhereWithAggregatesInput[]
    OR?: ReturnItemScalarWhereWithAggregatesInput[]
    NOT?: ReturnItemScalarWhereWithAggregatesInput | ReturnItemScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ReturnItem"> | string
    return_pickup_id?: UuidWithAggregatesFilter<"ReturnItem"> | string
    product_id?: UuidWithAggregatesFilter<"ReturnItem"> | string
    sku?: StringWithAggregatesFilter<"ReturnItem"> | string
    seller_id?: UuidNullableWithAggregatesFilter<"ReturnItem"> | string | null
    quantity?: IntWithAggregatesFilter<"ReturnItem"> | number
    reason?: StringWithAggregatesFilter<"ReturnItem"> | string
    inspection_grade?: EnumInspectionGradeNullableWithAggregatesFilter<"ReturnItem"> | $Enums.InspectionGrade | null
    inspection_notes?: StringNullableWithAggregatesFilter<"ReturnItem"> | string | null
    is_restocked?: BoolWithAggregatesFilter<"ReturnItem"> | boolean
    restocked_at?: DateTimeNullableWithAggregatesFilter<"ReturnItem"> | Date | string | null
    created_at?: DateTimeWithAggregatesFilter<"ReturnItem"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"ReturnItem"> | Date | string
  }

  export type ReturnTrackingUpdateWhereInput = {
    AND?: ReturnTrackingUpdateWhereInput | ReturnTrackingUpdateWhereInput[]
    OR?: ReturnTrackingUpdateWhereInput[]
    NOT?: ReturnTrackingUpdateWhereInput | ReturnTrackingUpdateWhereInput[]
    id?: UuidFilter<"ReturnTrackingUpdate"> | string
    return_pickup_id?: UuidFilter<"ReturnTrackingUpdate"> | string
    status?: EnumReturnPickupStatusFilter<"ReturnTrackingUpdate"> | $Enums.ReturnPickupStatus
    location?: StringNullableFilter<"ReturnTrackingUpdate"> | string | null
    description?: StringFilter<"ReturnTrackingUpdate"> | string
    recorded_by?: UuidNullableFilter<"ReturnTrackingUpdate"> | string | null
    recorded_at?: DateTimeFilter<"ReturnTrackingUpdate"> | Date | string
    return_pickup?: XOR<ReturnPickupRelationFilter, ReturnPickupWhereInput>
  }

  export type ReturnTrackingUpdateOrderByWithRelationInput = {
    id?: SortOrder
    return_pickup_id?: SortOrder
    status?: SortOrder
    location?: SortOrderInput | SortOrder
    description?: SortOrder
    recorded_by?: SortOrderInput | SortOrder
    recorded_at?: SortOrder
    return_pickup?: ReturnPickupOrderByWithRelationInput
  }

  export type ReturnTrackingUpdateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ReturnTrackingUpdateWhereInput | ReturnTrackingUpdateWhereInput[]
    OR?: ReturnTrackingUpdateWhereInput[]
    NOT?: ReturnTrackingUpdateWhereInput | ReturnTrackingUpdateWhereInput[]
    return_pickup_id?: UuidFilter<"ReturnTrackingUpdate"> | string
    status?: EnumReturnPickupStatusFilter<"ReturnTrackingUpdate"> | $Enums.ReturnPickupStatus
    location?: StringNullableFilter<"ReturnTrackingUpdate"> | string | null
    description?: StringFilter<"ReturnTrackingUpdate"> | string
    recorded_by?: UuidNullableFilter<"ReturnTrackingUpdate"> | string | null
    recorded_at?: DateTimeFilter<"ReturnTrackingUpdate"> | Date | string
    return_pickup?: XOR<ReturnPickupRelationFilter, ReturnPickupWhereInput>
  }, "id">

  export type ReturnTrackingUpdateOrderByWithAggregationInput = {
    id?: SortOrder
    return_pickup_id?: SortOrder
    status?: SortOrder
    location?: SortOrderInput | SortOrder
    description?: SortOrder
    recorded_by?: SortOrderInput | SortOrder
    recorded_at?: SortOrder
    _count?: ReturnTrackingUpdateCountOrderByAggregateInput
    _max?: ReturnTrackingUpdateMaxOrderByAggregateInput
    _min?: ReturnTrackingUpdateMinOrderByAggregateInput
  }

  export type ReturnTrackingUpdateScalarWhereWithAggregatesInput = {
    AND?: ReturnTrackingUpdateScalarWhereWithAggregatesInput | ReturnTrackingUpdateScalarWhereWithAggregatesInput[]
    OR?: ReturnTrackingUpdateScalarWhereWithAggregatesInput[]
    NOT?: ReturnTrackingUpdateScalarWhereWithAggregatesInput | ReturnTrackingUpdateScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ReturnTrackingUpdate"> | string
    return_pickup_id?: UuidWithAggregatesFilter<"ReturnTrackingUpdate"> | string
    status?: EnumReturnPickupStatusWithAggregatesFilter<"ReturnTrackingUpdate"> | $Enums.ReturnPickupStatus
    location?: StringNullableWithAggregatesFilter<"ReturnTrackingUpdate"> | string | null
    description?: StringWithAggregatesFilter<"ReturnTrackingUpdate"> | string
    recorded_by?: UuidNullableWithAggregatesFilter<"ReturnTrackingUpdate"> | string | null
    recorded_at?: DateTimeWithAggregatesFilter<"ReturnTrackingUpdate"> | Date | string
  }

  export type FulfillmentOutboxWhereInput = {
    AND?: FulfillmentOutboxWhereInput | FulfillmentOutboxWhereInput[]
    OR?: FulfillmentOutboxWhereInput[]
    NOT?: FulfillmentOutboxWhereInput | FulfillmentOutboxWhereInput[]
    id?: UuidFilter<"FulfillmentOutbox"> | string
    event_type?: StringFilter<"FulfillmentOutbox"> | string
    aggregate_type?: StringFilter<"FulfillmentOutbox"> | string
    aggregate_id?: UuidFilter<"FulfillmentOutbox"> | string
    payload?: JsonFilter<"FulfillmentOutbox">
    status?: EnumOutboxStatusFilter<"FulfillmentOutbox"> | $Enums.OutboxStatus
    retry_count?: IntFilter<"FulfillmentOutbox"> | number
    max_retries?: IntFilter<"FulfillmentOutbox"> | number
    next_retry_at?: DateTimeNullableFilter<"FulfillmentOutbox"> | Date | string | null
    locked_at?: DateTimeNullableFilter<"FulfillmentOutbox"> | Date | string | null
    locked_by?: StringNullableFilter<"FulfillmentOutbox"> | string | null
    last_error?: StringNullableFilter<"FulfillmentOutbox"> | string | null
    created_at?: DateTimeFilter<"FulfillmentOutbox"> | Date | string
    processed_at?: DateTimeNullableFilter<"FulfillmentOutbox"> | Date | string | null
  }

  export type FulfillmentOutboxOrderByWithRelationInput = {
    id?: SortOrder
    event_type?: SortOrder
    aggregate_type?: SortOrder
    aggregate_id?: SortOrder
    payload?: SortOrder
    status?: SortOrder
    retry_count?: SortOrder
    max_retries?: SortOrder
    next_retry_at?: SortOrderInput | SortOrder
    locked_at?: SortOrderInput | SortOrder
    locked_by?: SortOrderInput | SortOrder
    last_error?: SortOrderInput | SortOrder
    created_at?: SortOrder
    processed_at?: SortOrderInput | SortOrder
  }

  export type FulfillmentOutboxWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: FulfillmentOutboxWhereInput | FulfillmentOutboxWhereInput[]
    OR?: FulfillmentOutboxWhereInput[]
    NOT?: FulfillmentOutboxWhereInput | FulfillmentOutboxWhereInput[]
    event_type?: StringFilter<"FulfillmentOutbox"> | string
    aggregate_type?: StringFilter<"FulfillmentOutbox"> | string
    aggregate_id?: UuidFilter<"FulfillmentOutbox"> | string
    payload?: JsonFilter<"FulfillmentOutbox">
    status?: EnumOutboxStatusFilter<"FulfillmentOutbox"> | $Enums.OutboxStatus
    retry_count?: IntFilter<"FulfillmentOutbox"> | number
    max_retries?: IntFilter<"FulfillmentOutbox"> | number
    next_retry_at?: DateTimeNullableFilter<"FulfillmentOutbox"> | Date | string | null
    locked_at?: DateTimeNullableFilter<"FulfillmentOutbox"> | Date | string | null
    locked_by?: StringNullableFilter<"FulfillmentOutbox"> | string | null
    last_error?: StringNullableFilter<"FulfillmentOutbox"> | string | null
    created_at?: DateTimeFilter<"FulfillmentOutbox"> | Date | string
    processed_at?: DateTimeNullableFilter<"FulfillmentOutbox"> | Date | string | null
  }, "id">

  export type FulfillmentOutboxOrderByWithAggregationInput = {
    id?: SortOrder
    event_type?: SortOrder
    aggregate_type?: SortOrder
    aggregate_id?: SortOrder
    payload?: SortOrder
    status?: SortOrder
    retry_count?: SortOrder
    max_retries?: SortOrder
    next_retry_at?: SortOrderInput | SortOrder
    locked_at?: SortOrderInput | SortOrder
    locked_by?: SortOrderInput | SortOrder
    last_error?: SortOrderInput | SortOrder
    created_at?: SortOrder
    processed_at?: SortOrderInput | SortOrder
    _count?: FulfillmentOutboxCountOrderByAggregateInput
    _avg?: FulfillmentOutboxAvgOrderByAggregateInput
    _max?: FulfillmentOutboxMaxOrderByAggregateInput
    _min?: FulfillmentOutboxMinOrderByAggregateInput
    _sum?: FulfillmentOutboxSumOrderByAggregateInput
  }

  export type FulfillmentOutboxScalarWhereWithAggregatesInput = {
    AND?: FulfillmentOutboxScalarWhereWithAggregatesInput | FulfillmentOutboxScalarWhereWithAggregatesInput[]
    OR?: FulfillmentOutboxScalarWhereWithAggregatesInput[]
    NOT?: FulfillmentOutboxScalarWhereWithAggregatesInput | FulfillmentOutboxScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"FulfillmentOutbox"> | string
    event_type?: StringWithAggregatesFilter<"FulfillmentOutbox"> | string
    aggregate_type?: StringWithAggregatesFilter<"FulfillmentOutbox"> | string
    aggregate_id?: UuidWithAggregatesFilter<"FulfillmentOutbox"> | string
    payload?: JsonWithAggregatesFilter<"FulfillmentOutbox">
    status?: EnumOutboxStatusWithAggregatesFilter<"FulfillmentOutbox"> | $Enums.OutboxStatus
    retry_count?: IntWithAggregatesFilter<"FulfillmentOutbox"> | number
    max_retries?: IntWithAggregatesFilter<"FulfillmentOutbox"> | number
    next_retry_at?: DateTimeNullableWithAggregatesFilter<"FulfillmentOutbox"> | Date | string | null
    locked_at?: DateTimeNullableWithAggregatesFilter<"FulfillmentOutbox"> | Date | string | null
    locked_by?: StringNullableWithAggregatesFilter<"FulfillmentOutbox"> | string | null
    last_error?: StringNullableWithAggregatesFilter<"FulfillmentOutbox"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"FulfillmentOutbox"> | Date | string
    processed_at?: DateTimeNullableWithAggregatesFilter<"FulfillmentOutbox"> | Date | string | null
  }

  export type ProcessedEventWhereInput = {
    AND?: ProcessedEventWhereInput | ProcessedEventWhereInput[]
    OR?: ProcessedEventWhereInput[]
    NOT?: ProcessedEventWhereInput | ProcessedEventWhereInput[]
    id?: UuidFilter<"ProcessedEvent"> | string
    event_id?: StringFilter<"ProcessedEvent"> | string
    consumer_group?: StringFilter<"ProcessedEvent"> | string
    event_type?: StringFilter<"ProcessedEvent"> | string
    processed_at?: DateTimeFilter<"ProcessedEvent"> | Date | string
  }

  export type ProcessedEventOrderByWithRelationInput = {
    id?: SortOrder
    event_id?: SortOrder
    consumer_group?: SortOrder
    event_type?: SortOrder
    processed_at?: SortOrder
  }

  export type ProcessedEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    consumer_group_event_id?: ProcessedEventConsumer_groupEvent_idCompoundUniqueInput
    AND?: ProcessedEventWhereInput | ProcessedEventWhereInput[]
    OR?: ProcessedEventWhereInput[]
    NOT?: ProcessedEventWhereInput | ProcessedEventWhereInput[]
    event_id?: StringFilter<"ProcessedEvent"> | string
    consumer_group?: StringFilter<"ProcessedEvent"> | string
    event_type?: StringFilter<"ProcessedEvent"> | string
    processed_at?: DateTimeFilter<"ProcessedEvent"> | Date | string
  }, "id" | "consumer_group_event_id">

  export type ProcessedEventOrderByWithAggregationInput = {
    id?: SortOrder
    event_id?: SortOrder
    consumer_group?: SortOrder
    event_type?: SortOrder
    processed_at?: SortOrder
    _count?: ProcessedEventCountOrderByAggregateInput
    _max?: ProcessedEventMaxOrderByAggregateInput
    _min?: ProcessedEventMinOrderByAggregateInput
  }

  export type ProcessedEventScalarWhereWithAggregatesInput = {
    AND?: ProcessedEventScalarWhereWithAggregatesInput | ProcessedEventScalarWhereWithAggregatesInput[]
    OR?: ProcessedEventScalarWhereWithAggregatesInput[]
    NOT?: ProcessedEventScalarWhereWithAggregatesInput | ProcessedEventScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ProcessedEvent"> | string
    event_id?: StringWithAggregatesFilter<"ProcessedEvent"> | string
    consumer_group?: StringWithAggregatesFilter<"ProcessedEvent"> | string
    event_type?: StringWithAggregatesFilter<"ProcessedEvent"> | string
    processed_at?: DateTimeWithAggregatesFilter<"ProcessedEvent"> | Date | string
  }

  export type WarehouseCreateInput = {
    id?: string
    code: string
    name: string
    address_line1: string
    address_line2?: string | null
    city: string
    state: string
    postal_code: string
    country?: string
    is_active?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    inventory_items?: InventoryItemCreateNestedManyWithoutWarehouseInput
    shipments?: ShipmentCreateNestedManyWithoutWarehouseInput
    return_pickups?: ReturnPickupCreateNestedManyWithoutWarehouseInput
  }

  export type WarehouseUncheckedCreateInput = {
    id?: string
    code: string
    name: string
    address_line1: string
    address_line2?: string | null
    city: string
    state: string
    postal_code: string
    country?: string
    is_active?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    inventory_items?: InventoryItemUncheckedCreateNestedManyWithoutWarehouseInput
    shipments?: ShipmentUncheckedCreateNestedManyWithoutWarehouseInput
    return_pickups?: ReturnPickupUncheckedCreateNestedManyWithoutWarehouseInput
  }

  export type WarehouseUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address_line1?: StringFieldUpdateOperationsInput | string
    address_line2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    postal_code?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    inventory_items?: InventoryItemUpdateManyWithoutWarehouseNestedInput
    shipments?: ShipmentUpdateManyWithoutWarehouseNestedInput
    return_pickups?: ReturnPickupUpdateManyWithoutWarehouseNestedInput
  }

  export type WarehouseUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address_line1?: StringFieldUpdateOperationsInput | string
    address_line2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    postal_code?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    inventory_items?: InventoryItemUncheckedUpdateManyWithoutWarehouseNestedInput
    shipments?: ShipmentUncheckedUpdateManyWithoutWarehouseNestedInput
    return_pickups?: ReturnPickupUncheckedUpdateManyWithoutWarehouseNestedInput
  }

  export type WarehouseCreateManyInput = {
    id?: string
    code: string
    name: string
    address_line1: string
    address_line2?: string | null
    city: string
    state: string
    postal_code: string
    country?: string
    is_active?: boolean
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type WarehouseUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address_line1?: StringFieldUpdateOperationsInput | string
    address_line2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    postal_code?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WarehouseUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address_line1?: StringFieldUpdateOperationsInput | string
    address_line2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    postal_code?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryItemCreateInput = {
    id?: string
    product_id: string
    sku: string
    seller_id?: string | null
    quantity_on_hand?: number
    quantity_reserved?: number
    quantity_allocated?: number
    safety_stock?: number
    reorder_threshold?: number
    version?: number
    is_active?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    warehouse: WarehouseCreateNestedOneWithoutInventory_itemsInput
    reservation_items?: ReservationItemCreateNestedManyWithoutInventory_itemInput
  }

  export type InventoryItemUncheckedCreateInput = {
    id?: string
    product_id: string
    sku: string
    seller_id?: string | null
    warehouse_id: string
    quantity_on_hand?: number
    quantity_reserved?: number
    quantity_allocated?: number
    safety_stock?: number
    reorder_threshold?: number
    version?: number
    is_active?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    reservation_items?: ReservationItemUncheckedCreateNestedManyWithoutInventory_itemInput
  }

  export type InventoryItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    product_id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    seller_id?: NullableStringFieldUpdateOperationsInput | string | null
    quantity_on_hand?: IntFieldUpdateOperationsInput | number
    quantity_reserved?: IntFieldUpdateOperationsInput | number
    quantity_allocated?: IntFieldUpdateOperationsInput | number
    safety_stock?: IntFieldUpdateOperationsInput | number
    reorder_threshold?: IntFieldUpdateOperationsInput | number
    version?: IntFieldUpdateOperationsInput | number
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    warehouse?: WarehouseUpdateOneRequiredWithoutInventory_itemsNestedInput
    reservation_items?: ReservationItemUpdateManyWithoutInventory_itemNestedInput
  }

  export type InventoryItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    product_id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    seller_id?: NullableStringFieldUpdateOperationsInput | string | null
    warehouse_id?: StringFieldUpdateOperationsInput | string
    quantity_on_hand?: IntFieldUpdateOperationsInput | number
    quantity_reserved?: IntFieldUpdateOperationsInput | number
    quantity_allocated?: IntFieldUpdateOperationsInput | number
    safety_stock?: IntFieldUpdateOperationsInput | number
    reorder_threshold?: IntFieldUpdateOperationsInput | number
    version?: IntFieldUpdateOperationsInput | number
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reservation_items?: ReservationItemUncheckedUpdateManyWithoutInventory_itemNestedInput
  }

  export type InventoryItemCreateManyInput = {
    id?: string
    product_id: string
    sku: string
    seller_id?: string | null
    warehouse_id: string
    quantity_on_hand?: number
    quantity_reserved?: number
    quantity_allocated?: number
    safety_stock?: number
    reorder_threshold?: number
    version?: number
    is_active?: boolean
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type InventoryItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    product_id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    seller_id?: NullableStringFieldUpdateOperationsInput | string | null
    quantity_on_hand?: IntFieldUpdateOperationsInput | number
    quantity_reserved?: IntFieldUpdateOperationsInput | number
    quantity_allocated?: IntFieldUpdateOperationsInput | number
    safety_stock?: IntFieldUpdateOperationsInput | number
    reorder_threshold?: IntFieldUpdateOperationsInput | number
    version?: IntFieldUpdateOperationsInput | number
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    product_id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    seller_id?: NullableStringFieldUpdateOperationsInput | string | null
    warehouse_id?: StringFieldUpdateOperationsInput | string
    quantity_on_hand?: IntFieldUpdateOperationsInput | number
    quantity_reserved?: IntFieldUpdateOperationsInput | number
    quantity_allocated?: IntFieldUpdateOperationsInput | number
    safety_stock?: IntFieldUpdateOperationsInput | number
    reorder_threshold?: IntFieldUpdateOperationsInput | number
    version?: IntFieldUpdateOperationsInput | number
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryReservationCreateInput = {
    id?: string
    reservation_key: string
    user_id: string
    order_id?: string | null
    status?: $Enums.ReservationStatus
    expires_at: Date | string
    committed_at?: Date | string | null
    released_at?: Date | string | null
    expired_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    items?: ReservationItemCreateNestedManyWithoutReservationInput
  }

  export type InventoryReservationUncheckedCreateInput = {
    id?: string
    reservation_key: string
    user_id: string
    order_id?: string | null
    status?: $Enums.ReservationStatus
    expires_at: Date | string
    committed_at?: Date | string | null
    released_at?: Date | string | null
    expired_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    items?: ReservationItemUncheckedCreateNestedManyWithoutReservationInput
  }

  export type InventoryReservationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    reservation_key?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    order_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    committed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    released_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expired_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: ReservationItemUpdateManyWithoutReservationNestedInput
  }

  export type InventoryReservationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    reservation_key?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    order_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    committed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    released_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expired_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: ReservationItemUncheckedUpdateManyWithoutReservationNestedInput
  }

  export type InventoryReservationCreateManyInput = {
    id?: string
    reservation_key: string
    user_id: string
    order_id?: string | null
    status?: $Enums.ReservationStatus
    expires_at: Date | string
    committed_at?: Date | string | null
    released_at?: Date | string | null
    expired_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type InventoryReservationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    reservation_key?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    order_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    committed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    released_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expired_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryReservationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    reservation_key?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    order_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    committed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    released_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expired_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReservationItemCreateInput = {
    id?: string
    product_id: string
    sku: string
    quantity: number
    created_at?: Date | string
    updated_at?: Date | string
    reservation: InventoryReservationCreateNestedOneWithoutItemsInput
    inventory_item: InventoryItemCreateNestedOneWithoutReservation_itemsInput
  }

  export type ReservationItemUncheckedCreateInput = {
    id?: string
    reservation_id: string
    inventory_item_id: string
    product_id: string
    sku: string
    quantity: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ReservationItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    product_id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reservation?: InventoryReservationUpdateOneRequiredWithoutItemsNestedInput
    inventory_item?: InventoryItemUpdateOneRequiredWithoutReservation_itemsNestedInput
  }

  export type ReservationItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    reservation_id?: StringFieldUpdateOperationsInput | string
    inventory_item_id?: StringFieldUpdateOperationsInput | string
    product_id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReservationItemCreateManyInput = {
    id?: string
    reservation_id: string
    inventory_item_id: string
    product_id: string
    sku: string
    quantity: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ReservationItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    product_id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReservationItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    reservation_id?: StringFieldUpdateOperationsInput | string
    inventory_item_id?: StringFieldUpdateOperationsInput | string
    product_id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShipmentCreateInput = {
    id?: string
    shipment_number: string
    order_id: string
    user_id: string
    reservation_id?: string | null
    status?: $Enums.ShipmentStatus
    courier_code?: $Enums.CourierCode
    tracking_number?: string | null
    shipping_address: JsonNullValueInput | InputJsonValue
    label_url?: string | null
    manifest_id?: string | null
    estimated_delivery?: Date | string | null
    dispatched_at?: Date | string | null
    delivered_at?: Date | string | null
    delivery_notes?: string | null
    pod_signature?: string | null
    pod_received_by?: string | null
    pod_received_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    warehouse: WarehouseCreateNestedOneWithoutShipmentsInput
    items?: ShipmentItemCreateNestedManyWithoutShipmentInput
    tracking_updates?: TrackingUpdateCreateNestedManyWithoutShipmentInput
  }

  export type ShipmentUncheckedCreateInput = {
    id?: string
    shipment_number: string
    order_id: string
    user_id: string
    warehouse_id: string
    reservation_id?: string | null
    status?: $Enums.ShipmentStatus
    courier_code?: $Enums.CourierCode
    tracking_number?: string | null
    shipping_address: JsonNullValueInput | InputJsonValue
    label_url?: string | null
    manifest_id?: string | null
    estimated_delivery?: Date | string | null
    dispatched_at?: Date | string | null
    delivered_at?: Date | string | null
    delivery_notes?: string | null
    pod_signature?: string | null
    pod_received_by?: string | null
    pod_received_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    items?: ShipmentItemUncheckedCreateNestedManyWithoutShipmentInput
    tracking_updates?: TrackingUpdateUncheckedCreateNestedManyWithoutShipmentInput
  }

  export type ShipmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    shipment_number?: StringFieldUpdateOperationsInput | string
    order_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    reservation_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumShipmentStatusFieldUpdateOperationsInput | $Enums.ShipmentStatus
    courier_code?: EnumCourierCodeFieldUpdateOperationsInput | $Enums.CourierCode
    tracking_number?: NullableStringFieldUpdateOperationsInput | string | null
    shipping_address?: JsonNullValueInput | InputJsonValue
    label_url?: NullableStringFieldUpdateOperationsInput | string | null
    manifest_id?: NullableStringFieldUpdateOperationsInput | string | null
    estimated_delivery?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dispatched_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    delivered_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    delivery_notes?: NullableStringFieldUpdateOperationsInput | string | null
    pod_signature?: NullableStringFieldUpdateOperationsInput | string | null
    pod_received_by?: NullableStringFieldUpdateOperationsInput | string | null
    pod_received_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    warehouse?: WarehouseUpdateOneRequiredWithoutShipmentsNestedInput
    items?: ShipmentItemUpdateManyWithoutShipmentNestedInput
    tracking_updates?: TrackingUpdateUpdateManyWithoutShipmentNestedInput
  }

  export type ShipmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    shipment_number?: StringFieldUpdateOperationsInput | string
    order_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    warehouse_id?: StringFieldUpdateOperationsInput | string
    reservation_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumShipmentStatusFieldUpdateOperationsInput | $Enums.ShipmentStatus
    courier_code?: EnumCourierCodeFieldUpdateOperationsInput | $Enums.CourierCode
    tracking_number?: NullableStringFieldUpdateOperationsInput | string | null
    shipping_address?: JsonNullValueInput | InputJsonValue
    label_url?: NullableStringFieldUpdateOperationsInput | string | null
    manifest_id?: NullableStringFieldUpdateOperationsInput | string | null
    estimated_delivery?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dispatched_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    delivered_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    delivery_notes?: NullableStringFieldUpdateOperationsInput | string | null
    pod_signature?: NullableStringFieldUpdateOperationsInput | string | null
    pod_received_by?: NullableStringFieldUpdateOperationsInput | string | null
    pod_received_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: ShipmentItemUncheckedUpdateManyWithoutShipmentNestedInput
    tracking_updates?: TrackingUpdateUncheckedUpdateManyWithoutShipmentNestedInput
  }

  export type ShipmentCreateManyInput = {
    id?: string
    shipment_number: string
    order_id: string
    user_id: string
    warehouse_id: string
    reservation_id?: string | null
    status?: $Enums.ShipmentStatus
    courier_code?: $Enums.CourierCode
    tracking_number?: string | null
    shipping_address: JsonNullValueInput | InputJsonValue
    label_url?: string | null
    manifest_id?: string | null
    estimated_delivery?: Date | string | null
    dispatched_at?: Date | string | null
    delivered_at?: Date | string | null
    delivery_notes?: string | null
    pod_signature?: string | null
    pod_received_by?: string | null
    pod_received_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ShipmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    shipment_number?: StringFieldUpdateOperationsInput | string
    order_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    reservation_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumShipmentStatusFieldUpdateOperationsInput | $Enums.ShipmentStatus
    courier_code?: EnumCourierCodeFieldUpdateOperationsInput | $Enums.CourierCode
    tracking_number?: NullableStringFieldUpdateOperationsInput | string | null
    shipping_address?: JsonNullValueInput | InputJsonValue
    label_url?: NullableStringFieldUpdateOperationsInput | string | null
    manifest_id?: NullableStringFieldUpdateOperationsInput | string | null
    estimated_delivery?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dispatched_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    delivered_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    delivery_notes?: NullableStringFieldUpdateOperationsInput | string | null
    pod_signature?: NullableStringFieldUpdateOperationsInput | string | null
    pod_received_by?: NullableStringFieldUpdateOperationsInput | string | null
    pod_received_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShipmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    shipment_number?: StringFieldUpdateOperationsInput | string
    order_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    warehouse_id?: StringFieldUpdateOperationsInput | string
    reservation_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumShipmentStatusFieldUpdateOperationsInput | $Enums.ShipmentStatus
    courier_code?: EnumCourierCodeFieldUpdateOperationsInput | $Enums.CourierCode
    tracking_number?: NullableStringFieldUpdateOperationsInput | string | null
    shipping_address?: JsonNullValueInput | InputJsonValue
    label_url?: NullableStringFieldUpdateOperationsInput | string | null
    manifest_id?: NullableStringFieldUpdateOperationsInput | string | null
    estimated_delivery?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dispatched_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    delivered_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    delivery_notes?: NullableStringFieldUpdateOperationsInput | string | null
    pod_signature?: NullableStringFieldUpdateOperationsInput | string | null
    pod_received_by?: NullableStringFieldUpdateOperationsInput | string | null
    pod_received_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShipmentItemCreateInput = {
    id?: string
    product_id: string
    sku: string
    seller_id?: string | null
    quantity: number
    unit_price?: Decimal | DecimalJsLike | number | string | null
    created_at?: Date | string
    updated_at?: Date | string
    shipment: ShipmentCreateNestedOneWithoutItemsInput
  }

  export type ShipmentItemUncheckedCreateInput = {
    id?: string
    shipment_id: string
    product_id: string
    sku: string
    seller_id?: string | null
    quantity: number
    unit_price?: Decimal | DecimalJsLike | number | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ShipmentItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    product_id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    seller_id?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    unit_price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    shipment?: ShipmentUpdateOneRequiredWithoutItemsNestedInput
  }

  export type ShipmentItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    shipment_id?: StringFieldUpdateOperationsInput | string
    product_id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    seller_id?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    unit_price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShipmentItemCreateManyInput = {
    id?: string
    shipment_id: string
    product_id: string
    sku: string
    seller_id?: string | null
    quantity: number
    unit_price?: Decimal | DecimalJsLike | number | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ShipmentItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    product_id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    seller_id?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    unit_price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShipmentItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    shipment_id?: StringFieldUpdateOperationsInput | string
    product_id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    seller_id?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    unit_price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrackingUpdateCreateInput = {
    id?: string
    status: $Enums.ShipmentStatus
    location?: string | null
    description: string
    recorded_by?: string | null
    recorded_at?: Date | string
    shipment: ShipmentCreateNestedOneWithoutTracking_updatesInput
  }

  export type TrackingUpdateUncheckedCreateInput = {
    id?: string
    shipment_id: string
    status: $Enums.ShipmentStatus
    location?: string | null
    description: string
    recorded_by?: string | null
    recorded_at?: Date | string
  }

  export type TrackingUpdateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumShipmentStatusFieldUpdateOperationsInput | $Enums.ShipmentStatus
    location?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    recorded_by?: NullableStringFieldUpdateOperationsInput | string | null
    recorded_at?: DateTimeFieldUpdateOperationsInput | Date | string
    shipment?: ShipmentUpdateOneRequiredWithoutTracking_updatesNestedInput
  }

  export type TrackingUpdateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    shipment_id?: StringFieldUpdateOperationsInput | string
    status?: EnumShipmentStatusFieldUpdateOperationsInput | $Enums.ShipmentStatus
    location?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    recorded_by?: NullableStringFieldUpdateOperationsInput | string | null
    recorded_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrackingUpdateCreateManyInput = {
    id?: string
    shipment_id: string
    status: $Enums.ShipmentStatus
    location?: string | null
    description: string
    recorded_by?: string | null
    recorded_at?: Date | string
  }

  export type TrackingUpdateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumShipmentStatusFieldUpdateOperationsInput | $Enums.ShipmentStatus
    location?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    recorded_by?: NullableStringFieldUpdateOperationsInput | string | null
    recorded_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrackingUpdateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    shipment_id?: StringFieldUpdateOperationsInput | string
    status?: EnumShipmentStatusFieldUpdateOperationsInput | $Enums.ShipmentStatus
    location?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    recorded_by?: NullableStringFieldUpdateOperationsInput | string | null
    recorded_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReturnPickupCreateInput = {
    id?: string
    return_number: string
    order_id: string
    user_id: string
    status?: $Enums.ReturnPickupStatus
    courier_code?: $Enums.CourierCode
    return_tracking_number?: string | null
    pickup_address: JsonNullValueInput | InputJsonValue
    scheduled_pickup_date?: Date | string | null
    picked_up_at?: Date | string | null
    received_at?: Date | string | null
    completed_at?: Date | string | null
    pop_signature?: string | null
    pop_received_by?: string | null
    cancellation_reason?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    warehouse: WarehouseCreateNestedOneWithoutReturn_pickupsInput
    items?: ReturnItemCreateNestedManyWithoutReturn_pickupInput
    tracking_updates?: ReturnTrackingUpdateCreateNestedManyWithoutReturn_pickupInput
  }

  export type ReturnPickupUncheckedCreateInput = {
    id?: string
    return_number: string
    order_id: string
    user_id: string
    warehouse_id: string
    status?: $Enums.ReturnPickupStatus
    courier_code?: $Enums.CourierCode
    return_tracking_number?: string | null
    pickup_address: JsonNullValueInput | InputJsonValue
    scheduled_pickup_date?: Date | string | null
    picked_up_at?: Date | string | null
    received_at?: Date | string | null
    completed_at?: Date | string | null
    pop_signature?: string | null
    pop_received_by?: string | null
    cancellation_reason?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    items?: ReturnItemUncheckedCreateNestedManyWithoutReturn_pickupInput
    tracking_updates?: ReturnTrackingUpdateUncheckedCreateNestedManyWithoutReturn_pickupInput
  }

  export type ReturnPickupUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    return_number?: StringFieldUpdateOperationsInput | string
    order_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    status?: EnumReturnPickupStatusFieldUpdateOperationsInput | $Enums.ReturnPickupStatus
    courier_code?: EnumCourierCodeFieldUpdateOperationsInput | $Enums.CourierCode
    return_tracking_number?: NullableStringFieldUpdateOperationsInput | string | null
    pickup_address?: JsonNullValueInput | InputJsonValue
    scheduled_pickup_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    picked_up_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    received_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pop_signature?: NullableStringFieldUpdateOperationsInput | string | null
    pop_received_by?: NullableStringFieldUpdateOperationsInput | string | null
    cancellation_reason?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    warehouse?: WarehouseUpdateOneRequiredWithoutReturn_pickupsNestedInput
    items?: ReturnItemUpdateManyWithoutReturn_pickupNestedInput
    tracking_updates?: ReturnTrackingUpdateUpdateManyWithoutReturn_pickupNestedInput
  }

  export type ReturnPickupUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    return_number?: StringFieldUpdateOperationsInput | string
    order_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    warehouse_id?: StringFieldUpdateOperationsInput | string
    status?: EnumReturnPickupStatusFieldUpdateOperationsInput | $Enums.ReturnPickupStatus
    courier_code?: EnumCourierCodeFieldUpdateOperationsInput | $Enums.CourierCode
    return_tracking_number?: NullableStringFieldUpdateOperationsInput | string | null
    pickup_address?: JsonNullValueInput | InputJsonValue
    scheduled_pickup_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    picked_up_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    received_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pop_signature?: NullableStringFieldUpdateOperationsInput | string | null
    pop_received_by?: NullableStringFieldUpdateOperationsInput | string | null
    cancellation_reason?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: ReturnItemUncheckedUpdateManyWithoutReturn_pickupNestedInput
    tracking_updates?: ReturnTrackingUpdateUncheckedUpdateManyWithoutReturn_pickupNestedInput
  }

  export type ReturnPickupCreateManyInput = {
    id?: string
    return_number: string
    order_id: string
    user_id: string
    warehouse_id: string
    status?: $Enums.ReturnPickupStatus
    courier_code?: $Enums.CourierCode
    return_tracking_number?: string | null
    pickup_address: JsonNullValueInput | InputJsonValue
    scheduled_pickup_date?: Date | string | null
    picked_up_at?: Date | string | null
    received_at?: Date | string | null
    completed_at?: Date | string | null
    pop_signature?: string | null
    pop_received_by?: string | null
    cancellation_reason?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ReturnPickupUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    return_number?: StringFieldUpdateOperationsInput | string
    order_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    status?: EnumReturnPickupStatusFieldUpdateOperationsInput | $Enums.ReturnPickupStatus
    courier_code?: EnumCourierCodeFieldUpdateOperationsInput | $Enums.CourierCode
    return_tracking_number?: NullableStringFieldUpdateOperationsInput | string | null
    pickup_address?: JsonNullValueInput | InputJsonValue
    scheduled_pickup_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    picked_up_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    received_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pop_signature?: NullableStringFieldUpdateOperationsInput | string | null
    pop_received_by?: NullableStringFieldUpdateOperationsInput | string | null
    cancellation_reason?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReturnPickupUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    return_number?: StringFieldUpdateOperationsInput | string
    order_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    warehouse_id?: StringFieldUpdateOperationsInput | string
    status?: EnumReturnPickupStatusFieldUpdateOperationsInput | $Enums.ReturnPickupStatus
    courier_code?: EnumCourierCodeFieldUpdateOperationsInput | $Enums.CourierCode
    return_tracking_number?: NullableStringFieldUpdateOperationsInput | string | null
    pickup_address?: JsonNullValueInput | InputJsonValue
    scheduled_pickup_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    picked_up_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    received_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pop_signature?: NullableStringFieldUpdateOperationsInput | string | null
    pop_received_by?: NullableStringFieldUpdateOperationsInput | string | null
    cancellation_reason?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReturnItemCreateInput = {
    id?: string
    product_id: string
    sku: string
    seller_id?: string | null
    quantity: number
    reason: string
    inspection_grade?: $Enums.InspectionGrade | null
    inspection_notes?: string | null
    is_restocked?: boolean
    restocked_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    return_pickup: ReturnPickupCreateNestedOneWithoutItemsInput
  }

  export type ReturnItemUncheckedCreateInput = {
    id?: string
    return_pickup_id: string
    product_id: string
    sku: string
    seller_id?: string | null
    quantity: number
    reason: string
    inspection_grade?: $Enums.InspectionGrade | null
    inspection_notes?: string | null
    is_restocked?: boolean
    restocked_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ReturnItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    product_id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    seller_id?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    reason?: StringFieldUpdateOperationsInput | string
    inspection_grade?: NullableEnumInspectionGradeFieldUpdateOperationsInput | $Enums.InspectionGrade | null
    inspection_notes?: NullableStringFieldUpdateOperationsInput | string | null
    is_restocked?: BoolFieldUpdateOperationsInput | boolean
    restocked_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    return_pickup?: ReturnPickupUpdateOneRequiredWithoutItemsNestedInput
  }

  export type ReturnItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    return_pickup_id?: StringFieldUpdateOperationsInput | string
    product_id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    seller_id?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    reason?: StringFieldUpdateOperationsInput | string
    inspection_grade?: NullableEnumInspectionGradeFieldUpdateOperationsInput | $Enums.InspectionGrade | null
    inspection_notes?: NullableStringFieldUpdateOperationsInput | string | null
    is_restocked?: BoolFieldUpdateOperationsInput | boolean
    restocked_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReturnItemCreateManyInput = {
    id?: string
    return_pickup_id: string
    product_id: string
    sku: string
    seller_id?: string | null
    quantity: number
    reason: string
    inspection_grade?: $Enums.InspectionGrade | null
    inspection_notes?: string | null
    is_restocked?: boolean
    restocked_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ReturnItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    product_id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    seller_id?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    reason?: StringFieldUpdateOperationsInput | string
    inspection_grade?: NullableEnumInspectionGradeFieldUpdateOperationsInput | $Enums.InspectionGrade | null
    inspection_notes?: NullableStringFieldUpdateOperationsInput | string | null
    is_restocked?: BoolFieldUpdateOperationsInput | boolean
    restocked_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReturnItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    return_pickup_id?: StringFieldUpdateOperationsInput | string
    product_id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    seller_id?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    reason?: StringFieldUpdateOperationsInput | string
    inspection_grade?: NullableEnumInspectionGradeFieldUpdateOperationsInput | $Enums.InspectionGrade | null
    inspection_notes?: NullableStringFieldUpdateOperationsInput | string | null
    is_restocked?: BoolFieldUpdateOperationsInput | boolean
    restocked_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReturnTrackingUpdateCreateInput = {
    id?: string
    status: $Enums.ReturnPickupStatus
    location?: string | null
    description: string
    recorded_by?: string | null
    recorded_at?: Date | string
    return_pickup: ReturnPickupCreateNestedOneWithoutTracking_updatesInput
  }

  export type ReturnTrackingUpdateUncheckedCreateInput = {
    id?: string
    return_pickup_id: string
    status: $Enums.ReturnPickupStatus
    location?: string | null
    description: string
    recorded_by?: string | null
    recorded_at?: Date | string
  }

  export type ReturnTrackingUpdateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumReturnPickupStatusFieldUpdateOperationsInput | $Enums.ReturnPickupStatus
    location?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    recorded_by?: NullableStringFieldUpdateOperationsInput | string | null
    recorded_at?: DateTimeFieldUpdateOperationsInput | Date | string
    return_pickup?: ReturnPickupUpdateOneRequiredWithoutTracking_updatesNestedInput
  }

  export type ReturnTrackingUpdateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    return_pickup_id?: StringFieldUpdateOperationsInput | string
    status?: EnumReturnPickupStatusFieldUpdateOperationsInput | $Enums.ReturnPickupStatus
    location?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    recorded_by?: NullableStringFieldUpdateOperationsInput | string | null
    recorded_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReturnTrackingUpdateCreateManyInput = {
    id?: string
    return_pickup_id: string
    status: $Enums.ReturnPickupStatus
    location?: string | null
    description: string
    recorded_by?: string | null
    recorded_at?: Date | string
  }

  export type ReturnTrackingUpdateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumReturnPickupStatusFieldUpdateOperationsInput | $Enums.ReturnPickupStatus
    location?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    recorded_by?: NullableStringFieldUpdateOperationsInput | string | null
    recorded_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReturnTrackingUpdateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    return_pickup_id?: StringFieldUpdateOperationsInput | string
    status?: EnumReturnPickupStatusFieldUpdateOperationsInput | $Enums.ReturnPickupStatus
    location?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    recorded_by?: NullableStringFieldUpdateOperationsInput | string | null
    recorded_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FulfillmentOutboxCreateInput = {
    id?: string
    event_type: string
    aggregate_type?: string
    aggregate_id: string
    payload: JsonNullValueInput | InputJsonValue
    status?: $Enums.OutboxStatus
    retry_count?: number
    max_retries?: number
    next_retry_at?: Date | string | null
    locked_at?: Date | string | null
    locked_by?: string | null
    last_error?: string | null
    created_at?: Date | string
    processed_at?: Date | string | null
  }

  export type FulfillmentOutboxUncheckedCreateInput = {
    id?: string
    event_type: string
    aggregate_type?: string
    aggregate_id: string
    payload: JsonNullValueInput | InputJsonValue
    status?: $Enums.OutboxStatus
    retry_count?: number
    max_retries?: number
    next_retry_at?: Date | string | null
    locked_at?: Date | string | null
    locked_by?: string | null
    last_error?: string | null
    created_at?: Date | string
    processed_at?: Date | string | null
  }

  export type FulfillmentOutboxUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    event_type?: StringFieldUpdateOperationsInput | string
    aggregate_type?: StringFieldUpdateOperationsInput | string
    aggregate_id?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    status?: EnumOutboxStatusFieldUpdateOperationsInput | $Enums.OutboxStatus
    retry_count?: IntFieldUpdateOperationsInput | number
    max_retries?: IntFieldUpdateOperationsInput | number
    next_retry_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    locked_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    locked_by?: NullableStringFieldUpdateOperationsInput | string | null
    last_error?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    processed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type FulfillmentOutboxUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    event_type?: StringFieldUpdateOperationsInput | string
    aggregate_type?: StringFieldUpdateOperationsInput | string
    aggregate_id?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    status?: EnumOutboxStatusFieldUpdateOperationsInput | $Enums.OutboxStatus
    retry_count?: IntFieldUpdateOperationsInput | number
    max_retries?: IntFieldUpdateOperationsInput | number
    next_retry_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    locked_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    locked_by?: NullableStringFieldUpdateOperationsInput | string | null
    last_error?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    processed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type FulfillmentOutboxCreateManyInput = {
    id?: string
    event_type: string
    aggregate_type?: string
    aggregate_id: string
    payload: JsonNullValueInput | InputJsonValue
    status?: $Enums.OutboxStatus
    retry_count?: number
    max_retries?: number
    next_retry_at?: Date | string | null
    locked_at?: Date | string | null
    locked_by?: string | null
    last_error?: string | null
    created_at?: Date | string
    processed_at?: Date | string | null
  }

  export type FulfillmentOutboxUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    event_type?: StringFieldUpdateOperationsInput | string
    aggregate_type?: StringFieldUpdateOperationsInput | string
    aggregate_id?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    status?: EnumOutboxStatusFieldUpdateOperationsInput | $Enums.OutboxStatus
    retry_count?: IntFieldUpdateOperationsInput | number
    max_retries?: IntFieldUpdateOperationsInput | number
    next_retry_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    locked_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    locked_by?: NullableStringFieldUpdateOperationsInput | string | null
    last_error?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    processed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type FulfillmentOutboxUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    event_type?: StringFieldUpdateOperationsInput | string
    aggregate_type?: StringFieldUpdateOperationsInput | string
    aggregate_id?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    status?: EnumOutboxStatusFieldUpdateOperationsInput | $Enums.OutboxStatus
    retry_count?: IntFieldUpdateOperationsInput | number
    max_retries?: IntFieldUpdateOperationsInput | number
    next_retry_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    locked_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    locked_by?: NullableStringFieldUpdateOperationsInput | string | null
    last_error?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    processed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ProcessedEventCreateInput = {
    id?: string
    event_id: string
    consumer_group: string
    event_type: string
    processed_at?: Date | string
  }

  export type ProcessedEventUncheckedCreateInput = {
    id?: string
    event_id: string
    consumer_group: string
    event_type: string
    processed_at?: Date | string
  }

  export type ProcessedEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    event_id?: StringFieldUpdateOperationsInput | string
    consumer_group?: StringFieldUpdateOperationsInput | string
    event_type?: StringFieldUpdateOperationsInput | string
    processed_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProcessedEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    event_id?: StringFieldUpdateOperationsInput | string
    consumer_group?: StringFieldUpdateOperationsInput | string
    event_type?: StringFieldUpdateOperationsInput | string
    processed_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProcessedEventCreateManyInput = {
    id?: string
    event_id: string
    consumer_group: string
    event_type: string
    processed_at?: Date | string
  }

  export type ProcessedEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    event_id?: StringFieldUpdateOperationsInput | string
    consumer_group?: StringFieldUpdateOperationsInput | string
    event_type?: StringFieldUpdateOperationsInput | string
    processed_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProcessedEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    event_id?: StringFieldUpdateOperationsInput | string
    consumer_group?: StringFieldUpdateOperationsInput | string
    event_type?: StringFieldUpdateOperationsInput | string
    processed_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type InventoryItemListRelationFilter = {
    every?: InventoryItemWhereInput
    some?: InventoryItemWhereInput
    none?: InventoryItemWhereInput
  }

  export type ShipmentListRelationFilter = {
    every?: ShipmentWhereInput
    some?: ShipmentWhereInput
    none?: ShipmentWhereInput
  }

  export type ReturnPickupListRelationFilter = {
    every?: ReturnPickupWhereInput
    some?: ReturnPickupWhereInput
    none?: ReturnPickupWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type InventoryItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ShipmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ReturnPickupOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WarehouseCountOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    address_line1?: SortOrder
    address_line2?: SortOrder
    city?: SortOrder
    state?: SortOrder
    postal_code?: SortOrder
    country?: SortOrder
    is_active?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type WarehouseMaxOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    address_line1?: SortOrder
    address_line2?: SortOrder
    city?: SortOrder
    state?: SortOrder
    postal_code?: SortOrder
    country?: SortOrder
    is_active?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type WarehouseMinOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    address_line1?: SortOrder
    address_line2?: SortOrder
    city?: SortOrder
    state?: SortOrder
    postal_code?: SortOrder
    country?: SortOrder
    is_active?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type WarehouseRelationFilter = {
    is?: WarehouseWhereInput
    isNot?: WarehouseWhereInput
  }

  export type ReservationItemListRelationFilter = {
    every?: ReservationItemWhereInput
    some?: ReservationItemWhereInput
    none?: ReservationItemWhereInput
  }

  export type ReservationItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InventoryItemWarehouse_idSkuCompoundUniqueInput = {
    warehouse_id: string
    sku: string
  }

  export type InventoryItemCountOrderByAggregateInput = {
    id?: SortOrder
    product_id?: SortOrder
    sku?: SortOrder
    seller_id?: SortOrder
    warehouse_id?: SortOrder
    quantity_on_hand?: SortOrder
    quantity_reserved?: SortOrder
    quantity_allocated?: SortOrder
    safety_stock?: SortOrder
    reorder_threshold?: SortOrder
    version?: SortOrder
    is_active?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type InventoryItemAvgOrderByAggregateInput = {
    quantity_on_hand?: SortOrder
    quantity_reserved?: SortOrder
    quantity_allocated?: SortOrder
    safety_stock?: SortOrder
    reorder_threshold?: SortOrder
    version?: SortOrder
  }

  export type InventoryItemMaxOrderByAggregateInput = {
    id?: SortOrder
    product_id?: SortOrder
    sku?: SortOrder
    seller_id?: SortOrder
    warehouse_id?: SortOrder
    quantity_on_hand?: SortOrder
    quantity_reserved?: SortOrder
    quantity_allocated?: SortOrder
    safety_stock?: SortOrder
    reorder_threshold?: SortOrder
    version?: SortOrder
    is_active?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type InventoryItemMinOrderByAggregateInput = {
    id?: SortOrder
    product_id?: SortOrder
    sku?: SortOrder
    seller_id?: SortOrder
    warehouse_id?: SortOrder
    quantity_on_hand?: SortOrder
    quantity_reserved?: SortOrder
    quantity_allocated?: SortOrder
    safety_stock?: SortOrder
    reorder_threshold?: SortOrder
    version?: SortOrder
    is_active?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type InventoryItemSumOrderByAggregateInput = {
    quantity_on_hand?: SortOrder
    quantity_reserved?: SortOrder
    quantity_allocated?: SortOrder
    safety_stock?: SortOrder
    reorder_threshold?: SortOrder
    version?: SortOrder
  }

  export type UuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumReservationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ReservationStatus | EnumReservationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReservationStatus[] | ListEnumReservationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReservationStatus[] | ListEnumReservationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReservationStatusFilter<$PrismaModel> | $Enums.ReservationStatus
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type InventoryReservationCountOrderByAggregateInput = {
    id?: SortOrder
    reservation_key?: SortOrder
    user_id?: SortOrder
    order_id?: SortOrder
    status?: SortOrder
    expires_at?: SortOrder
    committed_at?: SortOrder
    released_at?: SortOrder
    expired_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type InventoryReservationMaxOrderByAggregateInput = {
    id?: SortOrder
    reservation_key?: SortOrder
    user_id?: SortOrder
    order_id?: SortOrder
    status?: SortOrder
    expires_at?: SortOrder
    committed_at?: SortOrder
    released_at?: SortOrder
    expired_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type InventoryReservationMinOrderByAggregateInput = {
    id?: SortOrder
    reservation_key?: SortOrder
    user_id?: SortOrder
    order_id?: SortOrder
    status?: SortOrder
    expires_at?: SortOrder
    committed_at?: SortOrder
    released_at?: SortOrder
    expired_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type EnumReservationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReservationStatus | EnumReservationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReservationStatus[] | ListEnumReservationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReservationStatus[] | ListEnumReservationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReservationStatusWithAggregatesFilter<$PrismaModel> | $Enums.ReservationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReservationStatusFilter<$PrismaModel>
    _max?: NestedEnumReservationStatusFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type InventoryReservationRelationFilter = {
    is?: InventoryReservationWhereInput
    isNot?: InventoryReservationWhereInput
  }

  export type InventoryItemRelationFilter = {
    is?: InventoryItemWhereInput
    isNot?: InventoryItemWhereInput
  }

  export type ReservationItemReservation_idInventory_item_idCompoundUniqueInput = {
    reservation_id: string
    inventory_item_id: string
  }

  export type ReservationItemCountOrderByAggregateInput = {
    id?: SortOrder
    reservation_id?: SortOrder
    inventory_item_id?: SortOrder
    product_id?: SortOrder
    sku?: SortOrder
    quantity?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ReservationItemAvgOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type ReservationItemMaxOrderByAggregateInput = {
    id?: SortOrder
    reservation_id?: SortOrder
    inventory_item_id?: SortOrder
    product_id?: SortOrder
    sku?: SortOrder
    quantity?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ReservationItemMinOrderByAggregateInput = {
    id?: SortOrder
    reservation_id?: SortOrder
    inventory_item_id?: SortOrder
    product_id?: SortOrder
    sku?: SortOrder
    quantity?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ReservationItemSumOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type EnumShipmentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ShipmentStatus | EnumShipmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ShipmentStatus[] | ListEnumShipmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ShipmentStatus[] | ListEnumShipmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumShipmentStatusFilter<$PrismaModel> | $Enums.ShipmentStatus
  }

  export type EnumCourierCodeFilter<$PrismaModel = never> = {
    equals?: $Enums.CourierCode | EnumCourierCodeFieldRefInput<$PrismaModel>
    in?: $Enums.CourierCode[] | ListEnumCourierCodeFieldRefInput<$PrismaModel>
    notIn?: $Enums.CourierCode[] | ListEnumCourierCodeFieldRefInput<$PrismaModel>
    not?: NestedEnumCourierCodeFilter<$PrismaModel> | $Enums.CourierCode
  }
  export type JsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ShipmentItemListRelationFilter = {
    every?: ShipmentItemWhereInput
    some?: ShipmentItemWhereInput
    none?: ShipmentItemWhereInput
  }

  export type TrackingUpdateListRelationFilter = {
    every?: TrackingUpdateWhereInput
    some?: TrackingUpdateWhereInput
    none?: TrackingUpdateWhereInput
  }

  export type ShipmentItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TrackingUpdateOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ShipmentCountOrderByAggregateInput = {
    id?: SortOrder
    shipment_number?: SortOrder
    order_id?: SortOrder
    user_id?: SortOrder
    warehouse_id?: SortOrder
    reservation_id?: SortOrder
    status?: SortOrder
    courier_code?: SortOrder
    tracking_number?: SortOrder
    shipping_address?: SortOrder
    label_url?: SortOrder
    manifest_id?: SortOrder
    estimated_delivery?: SortOrder
    dispatched_at?: SortOrder
    delivered_at?: SortOrder
    delivery_notes?: SortOrder
    pod_signature?: SortOrder
    pod_received_by?: SortOrder
    pod_received_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ShipmentMaxOrderByAggregateInput = {
    id?: SortOrder
    shipment_number?: SortOrder
    order_id?: SortOrder
    user_id?: SortOrder
    warehouse_id?: SortOrder
    reservation_id?: SortOrder
    status?: SortOrder
    courier_code?: SortOrder
    tracking_number?: SortOrder
    label_url?: SortOrder
    manifest_id?: SortOrder
    estimated_delivery?: SortOrder
    dispatched_at?: SortOrder
    delivered_at?: SortOrder
    delivery_notes?: SortOrder
    pod_signature?: SortOrder
    pod_received_by?: SortOrder
    pod_received_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ShipmentMinOrderByAggregateInput = {
    id?: SortOrder
    shipment_number?: SortOrder
    order_id?: SortOrder
    user_id?: SortOrder
    warehouse_id?: SortOrder
    reservation_id?: SortOrder
    status?: SortOrder
    courier_code?: SortOrder
    tracking_number?: SortOrder
    label_url?: SortOrder
    manifest_id?: SortOrder
    estimated_delivery?: SortOrder
    dispatched_at?: SortOrder
    delivered_at?: SortOrder
    delivery_notes?: SortOrder
    pod_signature?: SortOrder
    pod_received_by?: SortOrder
    pod_received_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type EnumShipmentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ShipmentStatus | EnumShipmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ShipmentStatus[] | ListEnumShipmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ShipmentStatus[] | ListEnumShipmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumShipmentStatusWithAggregatesFilter<$PrismaModel> | $Enums.ShipmentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumShipmentStatusFilter<$PrismaModel>
    _max?: NestedEnumShipmentStatusFilter<$PrismaModel>
  }

  export type EnumCourierCodeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CourierCode | EnumCourierCodeFieldRefInput<$PrismaModel>
    in?: $Enums.CourierCode[] | ListEnumCourierCodeFieldRefInput<$PrismaModel>
    notIn?: $Enums.CourierCode[] | ListEnumCourierCodeFieldRefInput<$PrismaModel>
    not?: NestedEnumCourierCodeWithAggregatesFilter<$PrismaModel> | $Enums.CourierCode
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCourierCodeFilter<$PrismaModel>
    _max?: NestedEnumCourierCodeFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type ShipmentRelationFilter = {
    is?: ShipmentWhereInput
    isNot?: ShipmentWhereInput
  }

  export type ShipmentItemCountOrderByAggregateInput = {
    id?: SortOrder
    shipment_id?: SortOrder
    product_id?: SortOrder
    sku?: SortOrder
    seller_id?: SortOrder
    quantity?: SortOrder
    unit_price?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ShipmentItemAvgOrderByAggregateInput = {
    quantity?: SortOrder
    unit_price?: SortOrder
  }

  export type ShipmentItemMaxOrderByAggregateInput = {
    id?: SortOrder
    shipment_id?: SortOrder
    product_id?: SortOrder
    sku?: SortOrder
    seller_id?: SortOrder
    quantity?: SortOrder
    unit_price?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ShipmentItemMinOrderByAggregateInput = {
    id?: SortOrder
    shipment_id?: SortOrder
    product_id?: SortOrder
    sku?: SortOrder
    seller_id?: SortOrder
    quantity?: SortOrder
    unit_price?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ShipmentItemSumOrderByAggregateInput = {
    quantity?: SortOrder
    unit_price?: SortOrder
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type TrackingUpdateCountOrderByAggregateInput = {
    id?: SortOrder
    shipment_id?: SortOrder
    status?: SortOrder
    location?: SortOrder
    description?: SortOrder
    recorded_by?: SortOrder
    recorded_at?: SortOrder
  }

  export type TrackingUpdateMaxOrderByAggregateInput = {
    id?: SortOrder
    shipment_id?: SortOrder
    status?: SortOrder
    location?: SortOrder
    description?: SortOrder
    recorded_by?: SortOrder
    recorded_at?: SortOrder
  }

  export type TrackingUpdateMinOrderByAggregateInput = {
    id?: SortOrder
    shipment_id?: SortOrder
    status?: SortOrder
    location?: SortOrder
    description?: SortOrder
    recorded_by?: SortOrder
    recorded_at?: SortOrder
  }

  export type EnumReturnPickupStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ReturnPickupStatus | EnumReturnPickupStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReturnPickupStatus[] | ListEnumReturnPickupStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReturnPickupStatus[] | ListEnumReturnPickupStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReturnPickupStatusFilter<$PrismaModel> | $Enums.ReturnPickupStatus
  }

  export type ReturnItemListRelationFilter = {
    every?: ReturnItemWhereInput
    some?: ReturnItemWhereInput
    none?: ReturnItemWhereInput
  }

  export type ReturnTrackingUpdateListRelationFilter = {
    every?: ReturnTrackingUpdateWhereInput
    some?: ReturnTrackingUpdateWhereInput
    none?: ReturnTrackingUpdateWhereInput
  }

  export type ReturnItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ReturnTrackingUpdateOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ReturnPickupCountOrderByAggregateInput = {
    id?: SortOrder
    return_number?: SortOrder
    order_id?: SortOrder
    user_id?: SortOrder
    warehouse_id?: SortOrder
    status?: SortOrder
    courier_code?: SortOrder
    return_tracking_number?: SortOrder
    pickup_address?: SortOrder
    scheduled_pickup_date?: SortOrder
    picked_up_at?: SortOrder
    received_at?: SortOrder
    completed_at?: SortOrder
    pop_signature?: SortOrder
    pop_received_by?: SortOrder
    cancellation_reason?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ReturnPickupMaxOrderByAggregateInput = {
    id?: SortOrder
    return_number?: SortOrder
    order_id?: SortOrder
    user_id?: SortOrder
    warehouse_id?: SortOrder
    status?: SortOrder
    courier_code?: SortOrder
    return_tracking_number?: SortOrder
    scheduled_pickup_date?: SortOrder
    picked_up_at?: SortOrder
    received_at?: SortOrder
    completed_at?: SortOrder
    pop_signature?: SortOrder
    pop_received_by?: SortOrder
    cancellation_reason?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ReturnPickupMinOrderByAggregateInput = {
    id?: SortOrder
    return_number?: SortOrder
    order_id?: SortOrder
    user_id?: SortOrder
    warehouse_id?: SortOrder
    status?: SortOrder
    courier_code?: SortOrder
    return_tracking_number?: SortOrder
    scheduled_pickup_date?: SortOrder
    picked_up_at?: SortOrder
    received_at?: SortOrder
    completed_at?: SortOrder
    pop_signature?: SortOrder
    pop_received_by?: SortOrder
    cancellation_reason?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type EnumReturnPickupStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReturnPickupStatus | EnumReturnPickupStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReturnPickupStatus[] | ListEnumReturnPickupStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReturnPickupStatus[] | ListEnumReturnPickupStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReturnPickupStatusWithAggregatesFilter<$PrismaModel> | $Enums.ReturnPickupStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReturnPickupStatusFilter<$PrismaModel>
    _max?: NestedEnumReturnPickupStatusFilter<$PrismaModel>
  }

  export type EnumInspectionGradeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.InspectionGrade | EnumInspectionGradeFieldRefInput<$PrismaModel> | null
    in?: $Enums.InspectionGrade[] | ListEnumInspectionGradeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.InspectionGrade[] | ListEnumInspectionGradeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumInspectionGradeNullableFilter<$PrismaModel> | $Enums.InspectionGrade | null
  }

  export type ReturnPickupRelationFilter = {
    is?: ReturnPickupWhereInput
    isNot?: ReturnPickupWhereInput
  }

  export type ReturnItemCountOrderByAggregateInput = {
    id?: SortOrder
    return_pickup_id?: SortOrder
    product_id?: SortOrder
    sku?: SortOrder
    seller_id?: SortOrder
    quantity?: SortOrder
    reason?: SortOrder
    inspection_grade?: SortOrder
    inspection_notes?: SortOrder
    is_restocked?: SortOrder
    restocked_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ReturnItemAvgOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type ReturnItemMaxOrderByAggregateInput = {
    id?: SortOrder
    return_pickup_id?: SortOrder
    product_id?: SortOrder
    sku?: SortOrder
    seller_id?: SortOrder
    quantity?: SortOrder
    reason?: SortOrder
    inspection_grade?: SortOrder
    inspection_notes?: SortOrder
    is_restocked?: SortOrder
    restocked_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ReturnItemMinOrderByAggregateInput = {
    id?: SortOrder
    return_pickup_id?: SortOrder
    product_id?: SortOrder
    sku?: SortOrder
    seller_id?: SortOrder
    quantity?: SortOrder
    reason?: SortOrder
    inspection_grade?: SortOrder
    inspection_notes?: SortOrder
    is_restocked?: SortOrder
    restocked_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ReturnItemSumOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type EnumInspectionGradeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InspectionGrade | EnumInspectionGradeFieldRefInput<$PrismaModel> | null
    in?: $Enums.InspectionGrade[] | ListEnumInspectionGradeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.InspectionGrade[] | ListEnumInspectionGradeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumInspectionGradeNullableWithAggregatesFilter<$PrismaModel> | $Enums.InspectionGrade | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumInspectionGradeNullableFilter<$PrismaModel>
    _max?: NestedEnumInspectionGradeNullableFilter<$PrismaModel>
  }

  export type ReturnTrackingUpdateCountOrderByAggregateInput = {
    id?: SortOrder
    return_pickup_id?: SortOrder
    status?: SortOrder
    location?: SortOrder
    description?: SortOrder
    recorded_by?: SortOrder
    recorded_at?: SortOrder
  }

  export type ReturnTrackingUpdateMaxOrderByAggregateInput = {
    id?: SortOrder
    return_pickup_id?: SortOrder
    status?: SortOrder
    location?: SortOrder
    description?: SortOrder
    recorded_by?: SortOrder
    recorded_at?: SortOrder
  }

  export type ReturnTrackingUpdateMinOrderByAggregateInput = {
    id?: SortOrder
    return_pickup_id?: SortOrder
    status?: SortOrder
    location?: SortOrder
    description?: SortOrder
    recorded_by?: SortOrder
    recorded_at?: SortOrder
  }

  export type EnumOutboxStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.OutboxStatus | EnumOutboxStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OutboxStatus[] | ListEnumOutboxStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OutboxStatus[] | ListEnumOutboxStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOutboxStatusFilter<$PrismaModel> | $Enums.OutboxStatus
  }

  export type FulfillmentOutboxCountOrderByAggregateInput = {
    id?: SortOrder
    event_type?: SortOrder
    aggregate_type?: SortOrder
    aggregate_id?: SortOrder
    payload?: SortOrder
    status?: SortOrder
    retry_count?: SortOrder
    max_retries?: SortOrder
    next_retry_at?: SortOrder
    locked_at?: SortOrder
    locked_by?: SortOrder
    last_error?: SortOrder
    created_at?: SortOrder
    processed_at?: SortOrder
  }

  export type FulfillmentOutboxAvgOrderByAggregateInput = {
    retry_count?: SortOrder
    max_retries?: SortOrder
  }

  export type FulfillmentOutboxMaxOrderByAggregateInput = {
    id?: SortOrder
    event_type?: SortOrder
    aggregate_type?: SortOrder
    aggregate_id?: SortOrder
    status?: SortOrder
    retry_count?: SortOrder
    max_retries?: SortOrder
    next_retry_at?: SortOrder
    locked_at?: SortOrder
    locked_by?: SortOrder
    last_error?: SortOrder
    created_at?: SortOrder
    processed_at?: SortOrder
  }

  export type FulfillmentOutboxMinOrderByAggregateInput = {
    id?: SortOrder
    event_type?: SortOrder
    aggregate_type?: SortOrder
    aggregate_id?: SortOrder
    status?: SortOrder
    retry_count?: SortOrder
    max_retries?: SortOrder
    next_retry_at?: SortOrder
    locked_at?: SortOrder
    locked_by?: SortOrder
    last_error?: SortOrder
    created_at?: SortOrder
    processed_at?: SortOrder
  }

  export type FulfillmentOutboxSumOrderByAggregateInput = {
    retry_count?: SortOrder
    max_retries?: SortOrder
  }

  export type EnumOutboxStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OutboxStatus | EnumOutboxStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OutboxStatus[] | ListEnumOutboxStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OutboxStatus[] | ListEnumOutboxStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOutboxStatusWithAggregatesFilter<$PrismaModel> | $Enums.OutboxStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOutboxStatusFilter<$PrismaModel>
    _max?: NestedEnumOutboxStatusFilter<$PrismaModel>
  }

  export type ProcessedEventConsumer_groupEvent_idCompoundUniqueInput = {
    consumer_group: string
    event_id: string
  }

  export type ProcessedEventCountOrderByAggregateInput = {
    id?: SortOrder
    event_id?: SortOrder
    consumer_group?: SortOrder
    event_type?: SortOrder
    processed_at?: SortOrder
  }

  export type ProcessedEventMaxOrderByAggregateInput = {
    id?: SortOrder
    event_id?: SortOrder
    consumer_group?: SortOrder
    event_type?: SortOrder
    processed_at?: SortOrder
  }

  export type ProcessedEventMinOrderByAggregateInput = {
    id?: SortOrder
    event_id?: SortOrder
    consumer_group?: SortOrder
    event_type?: SortOrder
    processed_at?: SortOrder
  }

  export type InventoryItemCreateNestedManyWithoutWarehouseInput = {
    create?: XOR<InventoryItemCreateWithoutWarehouseInput, InventoryItemUncheckedCreateWithoutWarehouseInput> | InventoryItemCreateWithoutWarehouseInput[] | InventoryItemUncheckedCreateWithoutWarehouseInput[]
    connectOrCreate?: InventoryItemCreateOrConnectWithoutWarehouseInput | InventoryItemCreateOrConnectWithoutWarehouseInput[]
    createMany?: InventoryItemCreateManyWarehouseInputEnvelope
    connect?: InventoryItemWhereUniqueInput | InventoryItemWhereUniqueInput[]
  }

  export type ShipmentCreateNestedManyWithoutWarehouseInput = {
    create?: XOR<ShipmentCreateWithoutWarehouseInput, ShipmentUncheckedCreateWithoutWarehouseInput> | ShipmentCreateWithoutWarehouseInput[] | ShipmentUncheckedCreateWithoutWarehouseInput[]
    connectOrCreate?: ShipmentCreateOrConnectWithoutWarehouseInput | ShipmentCreateOrConnectWithoutWarehouseInput[]
    createMany?: ShipmentCreateManyWarehouseInputEnvelope
    connect?: ShipmentWhereUniqueInput | ShipmentWhereUniqueInput[]
  }

  export type ReturnPickupCreateNestedManyWithoutWarehouseInput = {
    create?: XOR<ReturnPickupCreateWithoutWarehouseInput, ReturnPickupUncheckedCreateWithoutWarehouseInput> | ReturnPickupCreateWithoutWarehouseInput[] | ReturnPickupUncheckedCreateWithoutWarehouseInput[]
    connectOrCreate?: ReturnPickupCreateOrConnectWithoutWarehouseInput | ReturnPickupCreateOrConnectWithoutWarehouseInput[]
    createMany?: ReturnPickupCreateManyWarehouseInputEnvelope
    connect?: ReturnPickupWhereUniqueInput | ReturnPickupWhereUniqueInput[]
  }

  export type InventoryItemUncheckedCreateNestedManyWithoutWarehouseInput = {
    create?: XOR<InventoryItemCreateWithoutWarehouseInput, InventoryItemUncheckedCreateWithoutWarehouseInput> | InventoryItemCreateWithoutWarehouseInput[] | InventoryItemUncheckedCreateWithoutWarehouseInput[]
    connectOrCreate?: InventoryItemCreateOrConnectWithoutWarehouseInput | InventoryItemCreateOrConnectWithoutWarehouseInput[]
    createMany?: InventoryItemCreateManyWarehouseInputEnvelope
    connect?: InventoryItemWhereUniqueInput | InventoryItemWhereUniqueInput[]
  }

  export type ShipmentUncheckedCreateNestedManyWithoutWarehouseInput = {
    create?: XOR<ShipmentCreateWithoutWarehouseInput, ShipmentUncheckedCreateWithoutWarehouseInput> | ShipmentCreateWithoutWarehouseInput[] | ShipmentUncheckedCreateWithoutWarehouseInput[]
    connectOrCreate?: ShipmentCreateOrConnectWithoutWarehouseInput | ShipmentCreateOrConnectWithoutWarehouseInput[]
    createMany?: ShipmentCreateManyWarehouseInputEnvelope
    connect?: ShipmentWhereUniqueInput | ShipmentWhereUniqueInput[]
  }

  export type ReturnPickupUncheckedCreateNestedManyWithoutWarehouseInput = {
    create?: XOR<ReturnPickupCreateWithoutWarehouseInput, ReturnPickupUncheckedCreateWithoutWarehouseInput> | ReturnPickupCreateWithoutWarehouseInput[] | ReturnPickupUncheckedCreateWithoutWarehouseInput[]
    connectOrCreate?: ReturnPickupCreateOrConnectWithoutWarehouseInput | ReturnPickupCreateOrConnectWithoutWarehouseInput[]
    createMany?: ReturnPickupCreateManyWarehouseInputEnvelope
    connect?: ReturnPickupWhereUniqueInput | ReturnPickupWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type InventoryItemUpdateManyWithoutWarehouseNestedInput = {
    create?: XOR<InventoryItemCreateWithoutWarehouseInput, InventoryItemUncheckedCreateWithoutWarehouseInput> | InventoryItemCreateWithoutWarehouseInput[] | InventoryItemUncheckedCreateWithoutWarehouseInput[]
    connectOrCreate?: InventoryItemCreateOrConnectWithoutWarehouseInput | InventoryItemCreateOrConnectWithoutWarehouseInput[]
    upsert?: InventoryItemUpsertWithWhereUniqueWithoutWarehouseInput | InventoryItemUpsertWithWhereUniqueWithoutWarehouseInput[]
    createMany?: InventoryItemCreateManyWarehouseInputEnvelope
    set?: InventoryItemWhereUniqueInput | InventoryItemWhereUniqueInput[]
    disconnect?: InventoryItemWhereUniqueInput | InventoryItemWhereUniqueInput[]
    delete?: InventoryItemWhereUniqueInput | InventoryItemWhereUniqueInput[]
    connect?: InventoryItemWhereUniqueInput | InventoryItemWhereUniqueInput[]
    update?: InventoryItemUpdateWithWhereUniqueWithoutWarehouseInput | InventoryItemUpdateWithWhereUniqueWithoutWarehouseInput[]
    updateMany?: InventoryItemUpdateManyWithWhereWithoutWarehouseInput | InventoryItemUpdateManyWithWhereWithoutWarehouseInput[]
    deleteMany?: InventoryItemScalarWhereInput | InventoryItemScalarWhereInput[]
  }

  export type ShipmentUpdateManyWithoutWarehouseNestedInput = {
    create?: XOR<ShipmentCreateWithoutWarehouseInput, ShipmentUncheckedCreateWithoutWarehouseInput> | ShipmentCreateWithoutWarehouseInput[] | ShipmentUncheckedCreateWithoutWarehouseInput[]
    connectOrCreate?: ShipmentCreateOrConnectWithoutWarehouseInput | ShipmentCreateOrConnectWithoutWarehouseInput[]
    upsert?: ShipmentUpsertWithWhereUniqueWithoutWarehouseInput | ShipmentUpsertWithWhereUniqueWithoutWarehouseInput[]
    createMany?: ShipmentCreateManyWarehouseInputEnvelope
    set?: ShipmentWhereUniqueInput | ShipmentWhereUniqueInput[]
    disconnect?: ShipmentWhereUniqueInput | ShipmentWhereUniqueInput[]
    delete?: ShipmentWhereUniqueInput | ShipmentWhereUniqueInput[]
    connect?: ShipmentWhereUniqueInput | ShipmentWhereUniqueInput[]
    update?: ShipmentUpdateWithWhereUniqueWithoutWarehouseInput | ShipmentUpdateWithWhereUniqueWithoutWarehouseInput[]
    updateMany?: ShipmentUpdateManyWithWhereWithoutWarehouseInput | ShipmentUpdateManyWithWhereWithoutWarehouseInput[]
    deleteMany?: ShipmentScalarWhereInput | ShipmentScalarWhereInput[]
  }

  export type ReturnPickupUpdateManyWithoutWarehouseNestedInput = {
    create?: XOR<ReturnPickupCreateWithoutWarehouseInput, ReturnPickupUncheckedCreateWithoutWarehouseInput> | ReturnPickupCreateWithoutWarehouseInput[] | ReturnPickupUncheckedCreateWithoutWarehouseInput[]
    connectOrCreate?: ReturnPickupCreateOrConnectWithoutWarehouseInput | ReturnPickupCreateOrConnectWithoutWarehouseInput[]
    upsert?: ReturnPickupUpsertWithWhereUniqueWithoutWarehouseInput | ReturnPickupUpsertWithWhereUniqueWithoutWarehouseInput[]
    createMany?: ReturnPickupCreateManyWarehouseInputEnvelope
    set?: ReturnPickupWhereUniqueInput | ReturnPickupWhereUniqueInput[]
    disconnect?: ReturnPickupWhereUniqueInput | ReturnPickupWhereUniqueInput[]
    delete?: ReturnPickupWhereUniqueInput | ReturnPickupWhereUniqueInput[]
    connect?: ReturnPickupWhereUniqueInput | ReturnPickupWhereUniqueInput[]
    update?: ReturnPickupUpdateWithWhereUniqueWithoutWarehouseInput | ReturnPickupUpdateWithWhereUniqueWithoutWarehouseInput[]
    updateMany?: ReturnPickupUpdateManyWithWhereWithoutWarehouseInput | ReturnPickupUpdateManyWithWhereWithoutWarehouseInput[]
    deleteMany?: ReturnPickupScalarWhereInput | ReturnPickupScalarWhereInput[]
  }

  export type InventoryItemUncheckedUpdateManyWithoutWarehouseNestedInput = {
    create?: XOR<InventoryItemCreateWithoutWarehouseInput, InventoryItemUncheckedCreateWithoutWarehouseInput> | InventoryItemCreateWithoutWarehouseInput[] | InventoryItemUncheckedCreateWithoutWarehouseInput[]
    connectOrCreate?: InventoryItemCreateOrConnectWithoutWarehouseInput | InventoryItemCreateOrConnectWithoutWarehouseInput[]
    upsert?: InventoryItemUpsertWithWhereUniqueWithoutWarehouseInput | InventoryItemUpsertWithWhereUniqueWithoutWarehouseInput[]
    createMany?: InventoryItemCreateManyWarehouseInputEnvelope
    set?: InventoryItemWhereUniqueInput | InventoryItemWhereUniqueInput[]
    disconnect?: InventoryItemWhereUniqueInput | InventoryItemWhereUniqueInput[]
    delete?: InventoryItemWhereUniqueInput | InventoryItemWhereUniqueInput[]
    connect?: InventoryItemWhereUniqueInput | InventoryItemWhereUniqueInput[]
    update?: InventoryItemUpdateWithWhereUniqueWithoutWarehouseInput | InventoryItemUpdateWithWhereUniqueWithoutWarehouseInput[]
    updateMany?: InventoryItemUpdateManyWithWhereWithoutWarehouseInput | InventoryItemUpdateManyWithWhereWithoutWarehouseInput[]
    deleteMany?: InventoryItemScalarWhereInput | InventoryItemScalarWhereInput[]
  }

  export type ShipmentUncheckedUpdateManyWithoutWarehouseNestedInput = {
    create?: XOR<ShipmentCreateWithoutWarehouseInput, ShipmentUncheckedCreateWithoutWarehouseInput> | ShipmentCreateWithoutWarehouseInput[] | ShipmentUncheckedCreateWithoutWarehouseInput[]
    connectOrCreate?: ShipmentCreateOrConnectWithoutWarehouseInput | ShipmentCreateOrConnectWithoutWarehouseInput[]
    upsert?: ShipmentUpsertWithWhereUniqueWithoutWarehouseInput | ShipmentUpsertWithWhereUniqueWithoutWarehouseInput[]
    createMany?: ShipmentCreateManyWarehouseInputEnvelope
    set?: ShipmentWhereUniqueInput | ShipmentWhereUniqueInput[]
    disconnect?: ShipmentWhereUniqueInput | ShipmentWhereUniqueInput[]
    delete?: ShipmentWhereUniqueInput | ShipmentWhereUniqueInput[]
    connect?: ShipmentWhereUniqueInput | ShipmentWhereUniqueInput[]
    update?: ShipmentUpdateWithWhereUniqueWithoutWarehouseInput | ShipmentUpdateWithWhereUniqueWithoutWarehouseInput[]
    updateMany?: ShipmentUpdateManyWithWhereWithoutWarehouseInput | ShipmentUpdateManyWithWhereWithoutWarehouseInput[]
    deleteMany?: ShipmentScalarWhereInput | ShipmentScalarWhereInput[]
  }

  export type ReturnPickupUncheckedUpdateManyWithoutWarehouseNestedInput = {
    create?: XOR<ReturnPickupCreateWithoutWarehouseInput, ReturnPickupUncheckedCreateWithoutWarehouseInput> | ReturnPickupCreateWithoutWarehouseInput[] | ReturnPickupUncheckedCreateWithoutWarehouseInput[]
    connectOrCreate?: ReturnPickupCreateOrConnectWithoutWarehouseInput | ReturnPickupCreateOrConnectWithoutWarehouseInput[]
    upsert?: ReturnPickupUpsertWithWhereUniqueWithoutWarehouseInput | ReturnPickupUpsertWithWhereUniqueWithoutWarehouseInput[]
    createMany?: ReturnPickupCreateManyWarehouseInputEnvelope
    set?: ReturnPickupWhereUniqueInput | ReturnPickupWhereUniqueInput[]
    disconnect?: ReturnPickupWhereUniqueInput | ReturnPickupWhereUniqueInput[]
    delete?: ReturnPickupWhereUniqueInput | ReturnPickupWhereUniqueInput[]
    connect?: ReturnPickupWhereUniqueInput | ReturnPickupWhereUniqueInput[]
    update?: ReturnPickupUpdateWithWhereUniqueWithoutWarehouseInput | ReturnPickupUpdateWithWhereUniqueWithoutWarehouseInput[]
    updateMany?: ReturnPickupUpdateManyWithWhereWithoutWarehouseInput | ReturnPickupUpdateManyWithWhereWithoutWarehouseInput[]
    deleteMany?: ReturnPickupScalarWhereInput | ReturnPickupScalarWhereInput[]
  }

  export type WarehouseCreateNestedOneWithoutInventory_itemsInput = {
    create?: XOR<WarehouseCreateWithoutInventory_itemsInput, WarehouseUncheckedCreateWithoutInventory_itemsInput>
    connectOrCreate?: WarehouseCreateOrConnectWithoutInventory_itemsInput
    connect?: WarehouseWhereUniqueInput
  }

  export type ReservationItemCreateNestedManyWithoutInventory_itemInput = {
    create?: XOR<ReservationItemCreateWithoutInventory_itemInput, ReservationItemUncheckedCreateWithoutInventory_itemInput> | ReservationItemCreateWithoutInventory_itemInput[] | ReservationItemUncheckedCreateWithoutInventory_itemInput[]
    connectOrCreate?: ReservationItemCreateOrConnectWithoutInventory_itemInput | ReservationItemCreateOrConnectWithoutInventory_itemInput[]
    createMany?: ReservationItemCreateManyInventory_itemInputEnvelope
    connect?: ReservationItemWhereUniqueInput | ReservationItemWhereUniqueInput[]
  }

  export type ReservationItemUncheckedCreateNestedManyWithoutInventory_itemInput = {
    create?: XOR<ReservationItemCreateWithoutInventory_itemInput, ReservationItemUncheckedCreateWithoutInventory_itemInput> | ReservationItemCreateWithoutInventory_itemInput[] | ReservationItemUncheckedCreateWithoutInventory_itemInput[]
    connectOrCreate?: ReservationItemCreateOrConnectWithoutInventory_itemInput | ReservationItemCreateOrConnectWithoutInventory_itemInput[]
    createMany?: ReservationItemCreateManyInventory_itemInputEnvelope
    connect?: ReservationItemWhereUniqueInput | ReservationItemWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type WarehouseUpdateOneRequiredWithoutInventory_itemsNestedInput = {
    create?: XOR<WarehouseCreateWithoutInventory_itemsInput, WarehouseUncheckedCreateWithoutInventory_itemsInput>
    connectOrCreate?: WarehouseCreateOrConnectWithoutInventory_itemsInput
    upsert?: WarehouseUpsertWithoutInventory_itemsInput
    connect?: WarehouseWhereUniqueInput
    update?: XOR<XOR<WarehouseUpdateToOneWithWhereWithoutInventory_itemsInput, WarehouseUpdateWithoutInventory_itemsInput>, WarehouseUncheckedUpdateWithoutInventory_itemsInput>
  }

  export type ReservationItemUpdateManyWithoutInventory_itemNestedInput = {
    create?: XOR<ReservationItemCreateWithoutInventory_itemInput, ReservationItemUncheckedCreateWithoutInventory_itemInput> | ReservationItemCreateWithoutInventory_itemInput[] | ReservationItemUncheckedCreateWithoutInventory_itemInput[]
    connectOrCreate?: ReservationItemCreateOrConnectWithoutInventory_itemInput | ReservationItemCreateOrConnectWithoutInventory_itemInput[]
    upsert?: ReservationItemUpsertWithWhereUniqueWithoutInventory_itemInput | ReservationItemUpsertWithWhereUniqueWithoutInventory_itemInput[]
    createMany?: ReservationItemCreateManyInventory_itemInputEnvelope
    set?: ReservationItemWhereUniqueInput | ReservationItemWhereUniqueInput[]
    disconnect?: ReservationItemWhereUniqueInput | ReservationItemWhereUniqueInput[]
    delete?: ReservationItemWhereUniqueInput | ReservationItemWhereUniqueInput[]
    connect?: ReservationItemWhereUniqueInput | ReservationItemWhereUniqueInput[]
    update?: ReservationItemUpdateWithWhereUniqueWithoutInventory_itemInput | ReservationItemUpdateWithWhereUniqueWithoutInventory_itemInput[]
    updateMany?: ReservationItemUpdateManyWithWhereWithoutInventory_itemInput | ReservationItemUpdateManyWithWhereWithoutInventory_itemInput[]
    deleteMany?: ReservationItemScalarWhereInput | ReservationItemScalarWhereInput[]
  }

  export type ReservationItemUncheckedUpdateManyWithoutInventory_itemNestedInput = {
    create?: XOR<ReservationItemCreateWithoutInventory_itemInput, ReservationItemUncheckedCreateWithoutInventory_itemInput> | ReservationItemCreateWithoutInventory_itemInput[] | ReservationItemUncheckedCreateWithoutInventory_itemInput[]
    connectOrCreate?: ReservationItemCreateOrConnectWithoutInventory_itemInput | ReservationItemCreateOrConnectWithoutInventory_itemInput[]
    upsert?: ReservationItemUpsertWithWhereUniqueWithoutInventory_itemInput | ReservationItemUpsertWithWhereUniqueWithoutInventory_itemInput[]
    createMany?: ReservationItemCreateManyInventory_itemInputEnvelope
    set?: ReservationItemWhereUniqueInput | ReservationItemWhereUniqueInput[]
    disconnect?: ReservationItemWhereUniqueInput | ReservationItemWhereUniqueInput[]
    delete?: ReservationItemWhereUniqueInput | ReservationItemWhereUniqueInput[]
    connect?: ReservationItemWhereUniqueInput | ReservationItemWhereUniqueInput[]
    update?: ReservationItemUpdateWithWhereUniqueWithoutInventory_itemInput | ReservationItemUpdateWithWhereUniqueWithoutInventory_itemInput[]
    updateMany?: ReservationItemUpdateManyWithWhereWithoutInventory_itemInput | ReservationItemUpdateManyWithWhereWithoutInventory_itemInput[]
    deleteMany?: ReservationItemScalarWhereInput | ReservationItemScalarWhereInput[]
  }

  export type ReservationItemCreateNestedManyWithoutReservationInput = {
    create?: XOR<ReservationItemCreateWithoutReservationInput, ReservationItemUncheckedCreateWithoutReservationInput> | ReservationItemCreateWithoutReservationInput[] | ReservationItemUncheckedCreateWithoutReservationInput[]
    connectOrCreate?: ReservationItemCreateOrConnectWithoutReservationInput | ReservationItemCreateOrConnectWithoutReservationInput[]
    createMany?: ReservationItemCreateManyReservationInputEnvelope
    connect?: ReservationItemWhereUniqueInput | ReservationItemWhereUniqueInput[]
  }

  export type ReservationItemUncheckedCreateNestedManyWithoutReservationInput = {
    create?: XOR<ReservationItemCreateWithoutReservationInput, ReservationItemUncheckedCreateWithoutReservationInput> | ReservationItemCreateWithoutReservationInput[] | ReservationItemUncheckedCreateWithoutReservationInput[]
    connectOrCreate?: ReservationItemCreateOrConnectWithoutReservationInput | ReservationItemCreateOrConnectWithoutReservationInput[]
    createMany?: ReservationItemCreateManyReservationInputEnvelope
    connect?: ReservationItemWhereUniqueInput | ReservationItemWhereUniqueInput[]
  }

  export type EnumReservationStatusFieldUpdateOperationsInput = {
    set?: $Enums.ReservationStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type ReservationItemUpdateManyWithoutReservationNestedInput = {
    create?: XOR<ReservationItemCreateWithoutReservationInput, ReservationItemUncheckedCreateWithoutReservationInput> | ReservationItemCreateWithoutReservationInput[] | ReservationItemUncheckedCreateWithoutReservationInput[]
    connectOrCreate?: ReservationItemCreateOrConnectWithoutReservationInput | ReservationItemCreateOrConnectWithoutReservationInput[]
    upsert?: ReservationItemUpsertWithWhereUniqueWithoutReservationInput | ReservationItemUpsertWithWhereUniqueWithoutReservationInput[]
    createMany?: ReservationItemCreateManyReservationInputEnvelope
    set?: ReservationItemWhereUniqueInput | ReservationItemWhereUniqueInput[]
    disconnect?: ReservationItemWhereUniqueInput | ReservationItemWhereUniqueInput[]
    delete?: ReservationItemWhereUniqueInput | ReservationItemWhereUniqueInput[]
    connect?: ReservationItemWhereUniqueInput | ReservationItemWhereUniqueInput[]
    update?: ReservationItemUpdateWithWhereUniqueWithoutReservationInput | ReservationItemUpdateWithWhereUniqueWithoutReservationInput[]
    updateMany?: ReservationItemUpdateManyWithWhereWithoutReservationInput | ReservationItemUpdateManyWithWhereWithoutReservationInput[]
    deleteMany?: ReservationItemScalarWhereInput | ReservationItemScalarWhereInput[]
  }

  export type ReservationItemUncheckedUpdateManyWithoutReservationNestedInput = {
    create?: XOR<ReservationItemCreateWithoutReservationInput, ReservationItemUncheckedCreateWithoutReservationInput> | ReservationItemCreateWithoutReservationInput[] | ReservationItemUncheckedCreateWithoutReservationInput[]
    connectOrCreate?: ReservationItemCreateOrConnectWithoutReservationInput | ReservationItemCreateOrConnectWithoutReservationInput[]
    upsert?: ReservationItemUpsertWithWhereUniqueWithoutReservationInput | ReservationItemUpsertWithWhereUniqueWithoutReservationInput[]
    createMany?: ReservationItemCreateManyReservationInputEnvelope
    set?: ReservationItemWhereUniqueInput | ReservationItemWhereUniqueInput[]
    disconnect?: ReservationItemWhereUniqueInput | ReservationItemWhereUniqueInput[]
    delete?: ReservationItemWhereUniqueInput | ReservationItemWhereUniqueInput[]
    connect?: ReservationItemWhereUniqueInput | ReservationItemWhereUniqueInput[]
    update?: ReservationItemUpdateWithWhereUniqueWithoutReservationInput | ReservationItemUpdateWithWhereUniqueWithoutReservationInput[]
    updateMany?: ReservationItemUpdateManyWithWhereWithoutReservationInput | ReservationItemUpdateManyWithWhereWithoutReservationInput[]
    deleteMany?: ReservationItemScalarWhereInput | ReservationItemScalarWhereInput[]
  }

  export type InventoryReservationCreateNestedOneWithoutItemsInput = {
    create?: XOR<InventoryReservationCreateWithoutItemsInput, InventoryReservationUncheckedCreateWithoutItemsInput>
    connectOrCreate?: InventoryReservationCreateOrConnectWithoutItemsInput
    connect?: InventoryReservationWhereUniqueInput
  }

  export type InventoryItemCreateNestedOneWithoutReservation_itemsInput = {
    create?: XOR<InventoryItemCreateWithoutReservation_itemsInput, InventoryItemUncheckedCreateWithoutReservation_itemsInput>
    connectOrCreate?: InventoryItemCreateOrConnectWithoutReservation_itemsInput
    connect?: InventoryItemWhereUniqueInput
  }

  export type InventoryReservationUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<InventoryReservationCreateWithoutItemsInput, InventoryReservationUncheckedCreateWithoutItemsInput>
    connectOrCreate?: InventoryReservationCreateOrConnectWithoutItemsInput
    upsert?: InventoryReservationUpsertWithoutItemsInput
    connect?: InventoryReservationWhereUniqueInput
    update?: XOR<XOR<InventoryReservationUpdateToOneWithWhereWithoutItemsInput, InventoryReservationUpdateWithoutItemsInput>, InventoryReservationUncheckedUpdateWithoutItemsInput>
  }

  export type InventoryItemUpdateOneRequiredWithoutReservation_itemsNestedInput = {
    create?: XOR<InventoryItemCreateWithoutReservation_itemsInput, InventoryItemUncheckedCreateWithoutReservation_itemsInput>
    connectOrCreate?: InventoryItemCreateOrConnectWithoutReservation_itemsInput
    upsert?: InventoryItemUpsertWithoutReservation_itemsInput
    connect?: InventoryItemWhereUniqueInput
    update?: XOR<XOR<InventoryItemUpdateToOneWithWhereWithoutReservation_itemsInput, InventoryItemUpdateWithoutReservation_itemsInput>, InventoryItemUncheckedUpdateWithoutReservation_itemsInput>
  }

  export type WarehouseCreateNestedOneWithoutShipmentsInput = {
    create?: XOR<WarehouseCreateWithoutShipmentsInput, WarehouseUncheckedCreateWithoutShipmentsInput>
    connectOrCreate?: WarehouseCreateOrConnectWithoutShipmentsInput
    connect?: WarehouseWhereUniqueInput
  }

  export type ShipmentItemCreateNestedManyWithoutShipmentInput = {
    create?: XOR<ShipmentItemCreateWithoutShipmentInput, ShipmentItemUncheckedCreateWithoutShipmentInput> | ShipmentItemCreateWithoutShipmentInput[] | ShipmentItemUncheckedCreateWithoutShipmentInput[]
    connectOrCreate?: ShipmentItemCreateOrConnectWithoutShipmentInput | ShipmentItemCreateOrConnectWithoutShipmentInput[]
    createMany?: ShipmentItemCreateManyShipmentInputEnvelope
    connect?: ShipmentItemWhereUniqueInput | ShipmentItemWhereUniqueInput[]
  }

  export type TrackingUpdateCreateNestedManyWithoutShipmentInput = {
    create?: XOR<TrackingUpdateCreateWithoutShipmentInput, TrackingUpdateUncheckedCreateWithoutShipmentInput> | TrackingUpdateCreateWithoutShipmentInput[] | TrackingUpdateUncheckedCreateWithoutShipmentInput[]
    connectOrCreate?: TrackingUpdateCreateOrConnectWithoutShipmentInput | TrackingUpdateCreateOrConnectWithoutShipmentInput[]
    createMany?: TrackingUpdateCreateManyShipmentInputEnvelope
    connect?: TrackingUpdateWhereUniqueInput | TrackingUpdateWhereUniqueInput[]
  }

  export type ShipmentItemUncheckedCreateNestedManyWithoutShipmentInput = {
    create?: XOR<ShipmentItemCreateWithoutShipmentInput, ShipmentItemUncheckedCreateWithoutShipmentInput> | ShipmentItemCreateWithoutShipmentInput[] | ShipmentItemUncheckedCreateWithoutShipmentInput[]
    connectOrCreate?: ShipmentItemCreateOrConnectWithoutShipmentInput | ShipmentItemCreateOrConnectWithoutShipmentInput[]
    createMany?: ShipmentItemCreateManyShipmentInputEnvelope
    connect?: ShipmentItemWhereUniqueInput | ShipmentItemWhereUniqueInput[]
  }

  export type TrackingUpdateUncheckedCreateNestedManyWithoutShipmentInput = {
    create?: XOR<TrackingUpdateCreateWithoutShipmentInput, TrackingUpdateUncheckedCreateWithoutShipmentInput> | TrackingUpdateCreateWithoutShipmentInput[] | TrackingUpdateUncheckedCreateWithoutShipmentInput[]
    connectOrCreate?: TrackingUpdateCreateOrConnectWithoutShipmentInput | TrackingUpdateCreateOrConnectWithoutShipmentInput[]
    createMany?: TrackingUpdateCreateManyShipmentInputEnvelope
    connect?: TrackingUpdateWhereUniqueInput | TrackingUpdateWhereUniqueInput[]
  }

  export type EnumShipmentStatusFieldUpdateOperationsInput = {
    set?: $Enums.ShipmentStatus
  }

  export type EnumCourierCodeFieldUpdateOperationsInput = {
    set?: $Enums.CourierCode
  }

  export type WarehouseUpdateOneRequiredWithoutShipmentsNestedInput = {
    create?: XOR<WarehouseCreateWithoutShipmentsInput, WarehouseUncheckedCreateWithoutShipmentsInput>
    connectOrCreate?: WarehouseCreateOrConnectWithoutShipmentsInput
    upsert?: WarehouseUpsertWithoutShipmentsInput
    connect?: WarehouseWhereUniqueInput
    update?: XOR<XOR<WarehouseUpdateToOneWithWhereWithoutShipmentsInput, WarehouseUpdateWithoutShipmentsInput>, WarehouseUncheckedUpdateWithoutShipmentsInput>
  }

  export type ShipmentItemUpdateManyWithoutShipmentNestedInput = {
    create?: XOR<ShipmentItemCreateWithoutShipmentInput, ShipmentItemUncheckedCreateWithoutShipmentInput> | ShipmentItemCreateWithoutShipmentInput[] | ShipmentItemUncheckedCreateWithoutShipmentInput[]
    connectOrCreate?: ShipmentItemCreateOrConnectWithoutShipmentInput | ShipmentItemCreateOrConnectWithoutShipmentInput[]
    upsert?: ShipmentItemUpsertWithWhereUniqueWithoutShipmentInput | ShipmentItemUpsertWithWhereUniqueWithoutShipmentInput[]
    createMany?: ShipmentItemCreateManyShipmentInputEnvelope
    set?: ShipmentItemWhereUniqueInput | ShipmentItemWhereUniqueInput[]
    disconnect?: ShipmentItemWhereUniqueInput | ShipmentItemWhereUniqueInput[]
    delete?: ShipmentItemWhereUniqueInput | ShipmentItemWhereUniqueInput[]
    connect?: ShipmentItemWhereUniqueInput | ShipmentItemWhereUniqueInput[]
    update?: ShipmentItemUpdateWithWhereUniqueWithoutShipmentInput | ShipmentItemUpdateWithWhereUniqueWithoutShipmentInput[]
    updateMany?: ShipmentItemUpdateManyWithWhereWithoutShipmentInput | ShipmentItemUpdateManyWithWhereWithoutShipmentInput[]
    deleteMany?: ShipmentItemScalarWhereInput | ShipmentItemScalarWhereInput[]
  }

  export type TrackingUpdateUpdateManyWithoutShipmentNestedInput = {
    create?: XOR<TrackingUpdateCreateWithoutShipmentInput, TrackingUpdateUncheckedCreateWithoutShipmentInput> | TrackingUpdateCreateWithoutShipmentInput[] | TrackingUpdateUncheckedCreateWithoutShipmentInput[]
    connectOrCreate?: TrackingUpdateCreateOrConnectWithoutShipmentInput | TrackingUpdateCreateOrConnectWithoutShipmentInput[]
    upsert?: TrackingUpdateUpsertWithWhereUniqueWithoutShipmentInput | TrackingUpdateUpsertWithWhereUniqueWithoutShipmentInput[]
    createMany?: TrackingUpdateCreateManyShipmentInputEnvelope
    set?: TrackingUpdateWhereUniqueInput | TrackingUpdateWhereUniqueInput[]
    disconnect?: TrackingUpdateWhereUniqueInput | TrackingUpdateWhereUniqueInput[]
    delete?: TrackingUpdateWhereUniqueInput | TrackingUpdateWhereUniqueInput[]
    connect?: TrackingUpdateWhereUniqueInput | TrackingUpdateWhereUniqueInput[]
    update?: TrackingUpdateUpdateWithWhereUniqueWithoutShipmentInput | TrackingUpdateUpdateWithWhereUniqueWithoutShipmentInput[]
    updateMany?: TrackingUpdateUpdateManyWithWhereWithoutShipmentInput | TrackingUpdateUpdateManyWithWhereWithoutShipmentInput[]
    deleteMany?: TrackingUpdateScalarWhereInput | TrackingUpdateScalarWhereInput[]
  }

  export type ShipmentItemUncheckedUpdateManyWithoutShipmentNestedInput = {
    create?: XOR<ShipmentItemCreateWithoutShipmentInput, ShipmentItemUncheckedCreateWithoutShipmentInput> | ShipmentItemCreateWithoutShipmentInput[] | ShipmentItemUncheckedCreateWithoutShipmentInput[]
    connectOrCreate?: ShipmentItemCreateOrConnectWithoutShipmentInput | ShipmentItemCreateOrConnectWithoutShipmentInput[]
    upsert?: ShipmentItemUpsertWithWhereUniqueWithoutShipmentInput | ShipmentItemUpsertWithWhereUniqueWithoutShipmentInput[]
    createMany?: ShipmentItemCreateManyShipmentInputEnvelope
    set?: ShipmentItemWhereUniqueInput | ShipmentItemWhereUniqueInput[]
    disconnect?: ShipmentItemWhereUniqueInput | ShipmentItemWhereUniqueInput[]
    delete?: ShipmentItemWhereUniqueInput | ShipmentItemWhereUniqueInput[]
    connect?: ShipmentItemWhereUniqueInput | ShipmentItemWhereUniqueInput[]
    update?: ShipmentItemUpdateWithWhereUniqueWithoutShipmentInput | ShipmentItemUpdateWithWhereUniqueWithoutShipmentInput[]
    updateMany?: ShipmentItemUpdateManyWithWhereWithoutShipmentInput | ShipmentItemUpdateManyWithWhereWithoutShipmentInput[]
    deleteMany?: ShipmentItemScalarWhereInput | ShipmentItemScalarWhereInput[]
  }

  export type TrackingUpdateUncheckedUpdateManyWithoutShipmentNestedInput = {
    create?: XOR<TrackingUpdateCreateWithoutShipmentInput, TrackingUpdateUncheckedCreateWithoutShipmentInput> | TrackingUpdateCreateWithoutShipmentInput[] | TrackingUpdateUncheckedCreateWithoutShipmentInput[]
    connectOrCreate?: TrackingUpdateCreateOrConnectWithoutShipmentInput | TrackingUpdateCreateOrConnectWithoutShipmentInput[]
    upsert?: TrackingUpdateUpsertWithWhereUniqueWithoutShipmentInput | TrackingUpdateUpsertWithWhereUniqueWithoutShipmentInput[]
    createMany?: TrackingUpdateCreateManyShipmentInputEnvelope
    set?: TrackingUpdateWhereUniqueInput | TrackingUpdateWhereUniqueInput[]
    disconnect?: TrackingUpdateWhereUniqueInput | TrackingUpdateWhereUniqueInput[]
    delete?: TrackingUpdateWhereUniqueInput | TrackingUpdateWhereUniqueInput[]
    connect?: TrackingUpdateWhereUniqueInput | TrackingUpdateWhereUniqueInput[]
    update?: TrackingUpdateUpdateWithWhereUniqueWithoutShipmentInput | TrackingUpdateUpdateWithWhereUniqueWithoutShipmentInput[]
    updateMany?: TrackingUpdateUpdateManyWithWhereWithoutShipmentInput | TrackingUpdateUpdateManyWithWhereWithoutShipmentInput[]
    deleteMany?: TrackingUpdateScalarWhereInput | TrackingUpdateScalarWhereInput[]
  }

  export type ShipmentCreateNestedOneWithoutItemsInput = {
    create?: XOR<ShipmentCreateWithoutItemsInput, ShipmentUncheckedCreateWithoutItemsInput>
    connectOrCreate?: ShipmentCreateOrConnectWithoutItemsInput
    connect?: ShipmentWhereUniqueInput
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type ShipmentUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<ShipmentCreateWithoutItemsInput, ShipmentUncheckedCreateWithoutItemsInput>
    connectOrCreate?: ShipmentCreateOrConnectWithoutItemsInput
    upsert?: ShipmentUpsertWithoutItemsInput
    connect?: ShipmentWhereUniqueInput
    update?: XOR<XOR<ShipmentUpdateToOneWithWhereWithoutItemsInput, ShipmentUpdateWithoutItemsInput>, ShipmentUncheckedUpdateWithoutItemsInput>
  }

  export type ShipmentCreateNestedOneWithoutTracking_updatesInput = {
    create?: XOR<ShipmentCreateWithoutTracking_updatesInput, ShipmentUncheckedCreateWithoutTracking_updatesInput>
    connectOrCreate?: ShipmentCreateOrConnectWithoutTracking_updatesInput
    connect?: ShipmentWhereUniqueInput
  }

  export type ShipmentUpdateOneRequiredWithoutTracking_updatesNestedInput = {
    create?: XOR<ShipmentCreateWithoutTracking_updatesInput, ShipmentUncheckedCreateWithoutTracking_updatesInput>
    connectOrCreate?: ShipmentCreateOrConnectWithoutTracking_updatesInput
    upsert?: ShipmentUpsertWithoutTracking_updatesInput
    connect?: ShipmentWhereUniqueInput
    update?: XOR<XOR<ShipmentUpdateToOneWithWhereWithoutTracking_updatesInput, ShipmentUpdateWithoutTracking_updatesInput>, ShipmentUncheckedUpdateWithoutTracking_updatesInput>
  }

  export type WarehouseCreateNestedOneWithoutReturn_pickupsInput = {
    create?: XOR<WarehouseCreateWithoutReturn_pickupsInput, WarehouseUncheckedCreateWithoutReturn_pickupsInput>
    connectOrCreate?: WarehouseCreateOrConnectWithoutReturn_pickupsInput
    connect?: WarehouseWhereUniqueInput
  }

  export type ReturnItemCreateNestedManyWithoutReturn_pickupInput = {
    create?: XOR<ReturnItemCreateWithoutReturn_pickupInput, ReturnItemUncheckedCreateWithoutReturn_pickupInput> | ReturnItemCreateWithoutReturn_pickupInput[] | ReturnItemUncheckedCreateWithoutReturn_pickupInput[]
    connectOrCreate?: ReturnItemCreateOrConnectWithoutReturn_pickupInput | ReturnItemCreateOrConnectWithoutReturn_pickupInput[]
    createMany?: ReturnItemCreateManyReturn_pickupInputEnvelope
    connect?: ReturnItemWhereUniqueInput | ReturnItemWhereUniqueInput[]
  }

  export type ReturnTrackingUpdateCreateNestedManyWithoutReturn_pickupInput = {
    create?: XOR<ReturnTrackingUpdateCreateWithoutReturn_pickupInput, ReturnTrackingUpdateUncheckedCreateWithoutReturn_pickupInput> | ReturnTrackingUpdateCreateWithoutReturn_pickupInput[] | ReturnTrackingUpdateUncheckedCreateWithoutReturn_pickupInput[]
    connectOrCreate?: ReturnTrackingUpdateCreateOrConnectWithoutReturn_pickupInput | ReturnTrackingUpdateCreateOrConnectWithoutReturn_pickupInput[]
    createMany?: ReturnTrackingUpdateCreateManyReturn_pickupInputEnvelope
    connect?: ReturnTrackingUpdateWhereUniqueInput | ReturnTrackingUpdateWhereUniqueInput[]
  }

  export type ReturnItemUncheckedCreateNestedManyWithoutReturn_pickupInput = {
    create?: XOR<ReturnItemCreateWithoutReturn_pickupInput, ReturnItemUncheckedCreateWithoutReturn_pickupInput> | ReturnItemCreateWithoutReturn_pickupInput[] | ReturnItemUncheckedCreateWithoutReturn_pickupInput[]
    connectOrCreate?: ReturnItemCreateOrConnectWithoutReturn_pickupInput | ReturnItemCreateOrConnectWithoutReturn_pickupInput[]
    createMany?: ReturnItemCreateManyReturn_pickupInputEnvelope
    connect?: ReturnItemWhereUniqueInput | ReturnItemWhereUniqueInput[]
  }

  export type ReturnTrackingUpdateUncheckedCreateNestedManyWithoutReturn_pickupInput = {
    create?: XOR<ReturnTrackingUpdateCreateWithoutReturn_pickupInput, ReturnTrackingUpdateUncheckedCreateWithoutReturn_pickupInput> | ReturnTrackingUpdateCreateWithoutReturn_pickupInput[] | ReturnTrackingUpdateUncheckedCreateWithoutReturn_pickupInput[]
    connectOrCreate?: ReturnTrackingUpdateCreateOrConnectWithoutReturn_pickupInput | ReturnTrackingUpdateCreateOrConnectWithoutReturn_pickupInput[]
    createMany?: ReturnTrackingUpdateCreateManyReturn_pickupInputEnvelope
    connect?: ReturnTrackingUpdateWhereUniqueInput | ReturnTrackingUpdateWhereUniqueInput[]
  }

  export type EnumReturnPickupStatusFieldUpdateOperationsInput = {
    set?: $Enums.ReturnPickupStatus
  }

  export type WarehouseUpdateOneRequiredWithoutReturn_pickupsNestedInput = {
    create?: XOR<WarehouseCreateWithoutReturn_pickupsInput, WarehouseUncheckedCreateWithoutReturn_pickupsInput>
    connectOrCreate?: WarehouseCreateOrConnectWithoutReturn_pickupsInput
    upsert?: WarehouseUpsertWithoutReturn_pickupsInput
    connect?: WarehouseWhereUniqueInput
    update?: XOR<XOR<WarehouseUpdateToOneWithWhereWithoutReturn_pickupsInput, WarehouseUpdateWithoutReturn_pickupsInput>, WarehouseUncheckedUpdateWithoutReturn_pickupsInput>
  }

  export type ReturnItemUpdateManyWithoutReturn_pickupNestedInput = {
    create?: XOR<ReturnItemCreateWithoutReturn_pickupInput, ReturnItemUncheckedCreateWithoutReturn_pickupInput> | ReturnItemCreateWithoutReturn_pickupInput[] | ReturnItemUncheckedCreateWithoutReturn_pickupInput[]
    connectOrCreate?: ReturnItemCreateOrConnectWithoutReturn_pickupInput | ReturnItemCreateOrConnectWithoutReturn_pickupInput[]
    upsert?: ReturnItemUpsertWithWhereUniqueWithoutReturn_pickupInput | ReturnItemUpsertWithWhereUniqueWithoutReturn_pickupInput[]
    createMany?: ReturnItemCreateManyReturn_pickupInputEnvelope
    set?: ReturnItemWhereUniqueInput | ReturnItemWhereUniqueInput[]
    disconnect?: ReturnItemWhereUniqueInput | ReturnItemWhereUniqueInput[]
    delete?: ReturnItemWhereUniqueInput | ReturnItemWhereUniqueInput[]
    connect?: ReturnItemWhereUniqueInput | ReturnItemWhereUniqueInput[]
    update?: ReturnItemUpdateWithWhereUniqueWithoutReturn_pickupInput | ReturnItemUpdateWithWhereUniqueWithoutReturn_pickupInput[]
    updateMany?: ReturnItemUpdateManyWithWhereWithoutReturn_pickupInput | ReturnItemUpdateManyWithWhereWithoutReturn_pickupInput[]
    deleteMany?: ReturnItemScalarWhereInput | ReturnItemScalarWhereInput[]
  }

  export type ReturnTrackingUpdateUpdateManyWithoutReturn_pickupNestedInput = {
    create?: XOR<ReturnTrackingUpdateCreateWithoutReturn_pickupInput, ReturnTrackingUpdateUncheckedCreateWithoutReturn_pickupInput> | ReturnTrackingUpdateCreateWithoutReturn_pickupInput[] | ReturnTrackingUpdateUncheckedCreateWithoutReturn_pickupInput[]
    connectOrCreate?: ReturnTrackingUpdateCreateOrConnectWithoutReturn_pickupInput | ReturnTrackingUpdateCreateOrConnectWithoutReturn_pickupInput[]
    upsert?: ReturnTrackingUpdateUpsertWithWhereUniqueWithoutReturn_pickupInput | ReturnTrackingUpdateUpsertWithWhereUniqueWithoutReturn_pickupInput[]
    createMany?: ReturnTrackingUpdateCreateManyReturn_pickupInputEnvelope
    set?: ReturnTrackingUpdateWhereUniqueInput | ReturnTrackingUpdateWhereUniqueInput[]
    disconnect?: ReturnTrackingUpdateWhereUniqueInput | ReturnTrackingUpdateWhereUniqueInput[]
    delete?: ReturnTrackingUpdateWhereUniqueInput | ReturnTrackingUpdateWhereUniqueInput[]
    connect?: ReturnTrackingUpdateWhereUniqueInput | ReturnTrackingUpdateWhereUniqueInput[]
    update?: ReturnTrackingUpdateUpdateWithWhereUniqueWithoutReturn_pickupInput | ReturnTrackingUpdateUpdateWithWhereUniqueWithoutReturn_pickupInput[]
    updateMany?: ReturnTrackingUpdateUpdateManyWithWhereWithoutReturn_pickupInput | ReturnTrackingUpdateUpdateManyWithWhereWithoutReturn_pickupInput[]
    deleteMany?: ReturnTrackingUpdateScalarWhereInput | ReturnTrackingUpdateScalarWhereInput[]
  }

  export type ReturnItemUncheckedUpdateManyWithoutReturn_pickupNestedInput = {
    create?: XOR<ReturnItemCreateWithoutReturn_pickupInput, ReturnItemUncheckedCreateWithoutReturn_pickupInput> | ReturnItemCreateWithoutReturn_pickupInput[] | ReturnItemUncheckedCreateWithoutReturn_pickupInput[]
    connectOrCreate?: ReturnItemCreateOrConnectWithoutReturn_pickupInput | ReturnItemCreateOrConnectWithoutReturn_pickupInput[]
    upsert?: ReturnItemUpsertWithWhereUniqueWithoutReturn_pickupInput | ReturnItemUpsertWithWhereUniqueWithoutReturn_pickupInput[]
    createMany?: ReturnItemCreateManyReturn_pickupInputEnvelope
    set?: ReturnItemWhereUniqueInput | ReturnItemWhereUniqueInput[]
    disconnect?: ReturnItemWhereUniqueInput | ReturnItemWhereUniqueInput[]
    delete?: ReturnItemWhereUniqueInput | ReturnItemWhereUniqueInput[]
    connect?: ReturnItemWhereUniqueInput | ReturnItemWhereUniqueInput[]
    update?: ReturnItemUpdateWithWhereUniqueWithoutReturn_pickupInput | ReturnItemUpdateWithWhereUniqueWithoutReturn_pickupInput[]
    updateMany?: ReturnItemUpdateManyWithWhereWithoutReturn_pickupInput | ReturnItemUpdateManyWithWhereWithoutReturn_pickupInput[]
    deleteMany?: ReturnItemScalarWhereInput | ReturnItemScalarWhereInput[]
  }

  export type ReturnTrackingUpdateUncheckedUpdateManyWithoutReturn_pickupNestedInput = {
    create?: XOR<ReturnTrackingUpdateCreateWithoutReturn_pickupInput, ReturnTrackingUpdateUncheckedCreateWithoutReturn_pickupInput> | ReturnTrackingUpdateCreateWithoutReturn_pickupInput[] | ReturnTrackingUpdateUncheckedCreateWithoutReturn_pickupInput[]
    connectOrCreate?: ReturnTrackingUpdateCreateOrConnectWithoutReturn_pickupInput | ReturnTrackingUpdateCreateOrConnectWithoutReturn_pickupInput[]
    upsert?: ReturnTrackingUpdateUpsertWithWhereUniqueWithoutReturn_pickupInput | ReturnTrackingUpdateUpsertWithWhereUniqueWithoutReturn_pickupInput[]
    createMany?: ReturnTrackingUpdateCreateManyReturn_pickupInputEnvelope
    set?: ReturnTrackingUpdateWhereUniqueInput | ReturnTrackingUpdateWhereUniqueInput[]
    disconnect?: ReturnTrackingUpdateWhereUniqueInput | ReturnTrackingUpdateWhereUniqueInput[]
    delete?: ReturnTrackingUpdateWhereUniqueInput | ReturnTrackingUpdateWhereUniqueInput[]
    connect?: ReturnTrackingUpdateWhereUniqueInput | ReturnTrackingUpdateWhereUniqueInput[]
    update?: ReturnTrackingUpdateUpdateWithWhereUniqueWithoutReturn_pickupInput | ReturnTrackingUpdateUpdateWithWhereUniqueWithoutReturn_pickupInput[]
    updateMany?: ReturnTrackingUpdateUpdateManyWithWhereWithoutReturn_pickupInput | ReturnTrackingUpdateUpdateManyWithWhereWithoutReturn_pickupInput[]
    deleteMany?: ReturnTrackingUpdateScalarWhereInput | ReturnTrackingUpdateScalarWhereInput[]
  }

  export type ReturnPickupCreateNestedOneWithoutItemsInput = {
    create?: XOR<ReturnPickupCreateWithoutItemsInput, ReturnPickupUncheckedCreateWithoutItemsInput>
    connectOrCreate?: ReturnPickupCreateOrConnectWithoutItemsInput
    connect?: ReturnPickupWhereUniqueInput
  }

  export type NullableEnumInspectionGradeFieldUpdateOperationsInput = {
    set?: $Enums.InspectionGrade | null
  }

  export type ReturnPickupUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<ReturnPickupCreateWithoutItemsInput, ReturnPickupUncheckedCreateWithoutItemsInput>
    connectOrCreate?: ReturnPickupCreateOrConnectWithoutItemsInput
    upsert?: ReturnPickupUpsertWithoutItemsInput
    connect?: ReturnPickupWhereUniqueInput
    update?: XOR<XOR<ReturnPickupUpdateToOneWithWhereWithoutItemsInput, ReturnPickupUpdateWithoutItemsInput>, ReturnPickupUncheckedUpdateWithoutItemsInput>
  }

  export type ReturnPickupCreateNestedOneWithoutTracking_updatesInput = {
    create?: XOR<ReturnPickupCreateWithoutTracking_updatesInput, ReturnPickupUncheckedCreateWithoutTracking_updatesInput>
    connectOrCreate?: ReturnPickupCreateOrConnectWithoutTracking_updatesInput
    connect?: ReturnPickupWhereUniqueInput
  }

  export type ReturnPickupUpdateOneRequiredWithoutTracking_updatesNestedInput = {
    create?: XOR<ReturnPickupCreateWithoutTracking_updatesInput, ReturnPickupUncheckedCreateWithoutTracking_updatesInput>
    connectOrCreate?: ReturnPickupCreateOrConnectWithoutTracking_updatesInput
    upsert?: ReturnPickupUpsertWithoutTracking_updatesInput
    connect?: ReturnPickupWhereUniqueInput
    update?: XOR<XOR<ReturnPickupUpdateToOneWithWhereWithoutTracking_updatesInput, ReturnPickupUpdateWithoutTracking_updatesInput>, ReturnPickupUncheckedUpdateWithoutTracking_updatesInput>
  }

  export type EnumOutboxStatusFieldUpdateOperationsInput = {
    set?: $Enums.OutboxStatus
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedUuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type NestedUuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumReservationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ReservationStatus | EnumReservationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReservationStatus[] | ListEnumReservationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReservationStatus[] | ListEnumReservationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReservationStatusFilter<$PrismaModel> | $Enums.ReservationStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumReservationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReservationStatus | EnumReservationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReservationStatus[] | ListEnumReservationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReservationStatus[] | ListEnumReservationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReservationStatusWithAggregatesFilter<$PrismaModel> | $Enums.ReservationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReservationStatusFilter<$PrismaModel>
    _max?: NestedEnumReservationStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumShipmentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ShipmentStatus | EnumShipmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ShipmentStatus[] | ListEnumShipmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ShipmentStatus[] | ListEnumShipmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumShipmentStatusFilter<$PrismaModel> | $Enums.ShipmentStatus
  }

  export type NestedEnumCourierCodeFilter<$PrismaModel = never> = {
    equals?: $Enums.CourierCode | EnumCourierCodeFieldRefInput<$PrismaModel>
    in?: $Enums.CourierCode[] | ListEnumCourierCodeFieldRefInput<$PrismaModel>
    notIn?: $Enums.CourierCode[] | ListEnumCourierCodeFieldRefInput<$PrismaModel>
    not?: NestedEnumCourierCodeFilter<$PrismaModel> | $Enums.CourierCode
  }

  export type NestedEnumShipmentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ShipmentStatus | EnumShipmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ShipmentStatus[] | ListEnumShipmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ShipmentStatus[] | ListEnumShipmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumShipmentStatusWithAggregatesFilter<$PrismaModel> | $Enums.ShipmentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumShipmentStatusFilter<$PrismaModel>
    _max?: NestedEnumShipmentStatusFilter<$PrismaModel>
  }

  export type NestedEnumCourierCodeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CourierCode | EnumCourierCodeFieldRefInput<$PrismaModel>
    in?: $Enums.CourierCode[] | ListEnumCourierCodeFieldRefInput<$PrismaModel>
    notIn?: $Enums.CourierCode[] | ListEnumCourierCodeFieldRefInput<$PrismaModel>
    not?: NestedEnumCourierCodeWithAggregatesFilter<$PrismaModel> | $Enums.CourierCode
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCourierCodeFilter<$PrismaModel>
    _max?: NestedEnumCourierCodeFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedEnumReturnPickupStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ReturnPickupStatus | EnumReturnPickupStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReturnPickupStatus[] | ListEnumReturnPickupStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReturnPickupStatus[] | ListEnumReturnPickupStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReturnPickupStatusFilter<$PrismaModel> | $Enums.ReturnPickupStatus
  }

  export type NestedEnumReturnPickupStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReturnPickupStatus | EnumReturnPickupStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReturnPickupStatus[] | ListEnumReturnPickupStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReturnPickupStatus[] | ListEnumReturnPickupStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReturnPickupStatusWithAggregatesFilter<$PrismaModel> | $Enums.ReturnPickupStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReturnPickupStatusFilter<$PrismaModel>
    _max?: NestedEnumReturnPickupStatusFilter<$PrismaModel>
  }

  export type NestedEnumInspectionGradeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.InspectionGrade | EnumInspectionGradeFieldRefInput<$PrismaModel> | null
    in?: $Enums.InspectionGrade[] | ListEnumInspectionGradeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.InspectionGrade[] | ListEnumInspectionGradeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumInspectionGradeNullableFilter<$PrismaModel> | $Enums.InspectionGrade | null
  }

  export type NestedEnumInspectionGradeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InspectionGrade | EnumInspectionGradeFieldRefInput<$PrismaModel> | null
    in?: $Enums.InspectionGrade[] | ListEnumInspectionGradeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.InspectionGrade[] | ListEnumInspectionGradeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumInspectionGradeNullableWithAggregatesFilter<$PrismaModel> | $Enums.InspectionGrade | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumInspectionGradeNullableFilter<$PrismaModel>
    _max?: NestedEnumInspectionGradeNullableFilter<$PrismaModel>
  }

  export type NestedEnumOutboxStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.OutboxStatus | EnumOutboxStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OutboxStatus[] | ListEnumOutboxStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OutboxStatus[] | ListEnumOutboxStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOutboxStatusFilter<$PrismaModel> | $Enums.OutboxStatus
  }

  export type NestedEnumOutboxStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OutboxStatus | EnumOutboxStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OutboxStatus[] | ListEnumOutboxStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OutboxStatus[] | ListEnumOutboxStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOutboxStatusWithAggregatesFilter<$PrismaModel> | $Enums.OutboxStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOutboxStatusFilter<$PrismaModel>
    _max?: NestedEnumOutboxStatusFilter<$PrismaModel>
  }

  export type InventoryItemCreateWithoutWarehouseInput = {
    id?: string
    product_id: string
    sku: string
    seller_id?: string | null
    quantity_on_hand?: number
    quantity_reserved?: number
    quantity_allocated?: number
    safety_stock?: number
    reorder_threshold?: number
    version?: number
    is_active?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    reservation_items?: ReservationItemCreateNestedManyWithoutInventory_itemInput
  }

  export type InventoryItemUncheckedCreateWithoutWarehouseInput = {
    id?: string
    product_id: string
    sku: string
    seller_id?: string | null
    quantity_on_hand?: number
    quantity_reserved?: number
    quantity_allocated?: number
    safety_stock?: number
    reorder_threshold?: number
    version?: number
    is_active?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    reservation_items?: ReservationItemUncheckedCreateNestedManyWithoutInventory_itemInput
  }

  export type InventoryItemCreateOrConnectWithoutWarehouseInput = {
    where: InventoryItemWhereUniqueInput
    create: XOR<InventoryItemCreateWithoutWarehouseInput, InventoryItemUncheckedCreateWithoutWarehouseInput>
  }

  export type InventoryItemCreateManyWarehouseInputEnvelope = {
    data: InventoryItemCreateManyWarehouseInput | InventoryItemCreateManyWarehouseInput[]
    skipDuplicates?: boolean
  }

  export type ShipmentCreateWithoutWarehouseInput = {
    id?: string
    shipment_number: string
    order_id: string
    user_id: string
    reservation_id?: string | null
    status?: $Enums.ShipmentStatus
    courier_code?: $Enums.CourierCode
    tracking_number?: string | null
    shipping_address: JsonNullValueInput | InputJsonValue
    label_url?: string | null
    manifest_id?: string | null
    estimated_delivery?: Date | string | null
    dispatched_at?: Date | string | null
    delivered_at?: Date | string | null
    delivery_notes?: string | null
    pod_signature?: string | null
    pod_received_by?: string | null
    pod_received_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    items?: ShipmentItemCreateNestedManyWithoutShipmentInput
    tracking_updates?: TrackingUpdateCreateNestedManyWithoutShipmentInput
  }

  export type ShipmentUncheckedCreateWithoutWarehouseInput = {
    id?: string
    shipment_number: string
    order_id: string
    user_id: string
    reservation_id?: string | null
    status?: $Enums.ShipmentStatus
    courier_code?: $Enums.CourierCode
    tracking_number?: string | null
    shipping_address: JsonNullValueInput | InputJsonValue
    label_url?: string | null
    manifest_id?: string | null
    estimated_delivery?: Date | string | null
    dispatched_at?: Date | string | null
    delivered_at?: Date | string | null
    delivery_notes?: string | null
    pod_signature?: string | null
    pod_received_by?: string | null
    pod_received_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    items?: ShipmentItemUncheckedCreateNestedManyWithoutShipmentInput
    tracking_updates?: TrackingUpdateUncheckedCreateNestedManyWithoutShipmentInput
  }

  export type ShipmentCreateOrConnectWithoutWarehouseInput = {
    where: ShipmentWhereUniqueInput
    create: XOR<ShipmentCreateWithoutWarehouseInput, ShipmentUncheckedCreateWithoutWarehouseInput>
  }

  export type ShipmentCreateManyWarehouseInputEnvelope = {
    data: ShipmentCreateManyWarehouseInput | ShipmentCreateManyWarehouseInput[]
    skipDuplicates?: boolean
  }

  export type ReturnPickupCreateWithoutWarehouseInput = {
    id?: string
    return_number: string
    order_id: string
    user_id: string
    status?: $Enums.ReturnPickupStatus
    courier_code?: $Enums.CourierCode
    return_tracking_number?: string | null
    pickup_address: JsonNullValueInput | InputJsonValue
    scheduled_pickup_date?: Date | string | null
    picked_up_at?: Date | string | null
    received_at?: Date | string | null
    completed_at?: Date | string | null
    pop_signature?: string | null
    pop_received_by?: string | null
    cancellation_reason?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    items?: ReturnItemCreateNestedManyWithoutReturn_pickupInput
    tracking_updates?: ReturnTrackingUpdateCreateNestedManyWithoutReturn_pickupInput
  }

  export type ReturnPickupUncheckedCreateWithoutWarehouseInput = {
    id?: string
    return_number: string
    order_id: string
    user_id: string
    status?: $Enums.ReturnPickupStatus
    courier_code?: $Enums.CourierCode
    return_tracking_number?: string | null
    pickup_address: JsonNullValueInput | InputJsonValue
    scheduled_pickup_date?: Date | string | null
    picked_up_at?: Date | string | null
    received_at?: Date | string | null
    completed_at?: Date | string | null
    pop_signature?: string | null
    pop_received_by?: string | null
    cancellation_reason?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    items?: ReturnItemUncheckedCreateNestedManyWithoutReturn_pickupInput
    tracking_updates?: ReturnTrackingUpdateUncheckedCreateNestedManyWithoutReturn_pickupInput
  }

  export type ReturnPickupCreateOrConnectWithoutWarehouseInput = {
    where: ReturnPickupWhereUniqueInput
    create: XOR<ReturnPickupCreateWithoutWarehouseInput, ReturnPickupUncheckedCreateWithoutWarehouseInput>
  }

  export type ReturnPickupCreateManyWarehouseInputEnvelope = {
    data: ReturnPickupCreateManyWarehouseInput | ReturnPickupCreateManyWarehouseInput[]
    skipDuplicates?: boolean
  }

  export type InventoryItemUpsertWithWhereUniqueWithoutWarehouseInput = {
    where: InventoryItemWhereUniqueInput
    update: XOR<InventoryItemUpdateWithoutWarehouseInput, InventoryItemUncheckedUpdateWithoutWarehouseInput>
    create: XOR<InventoryItemCreateWithoutWarehouseInput, InventoryItemUncheckedCreateWithoutWarehouseInput>
  }

  export type InventoryItemUpdateWithWhereUniqueWithoutWarehouseInput = {
    where: InventoryItemWhereUniqueInput
    data: XOR<InventoryItemUpdateWithoutWarehouseInput, InventoryItemUncheckedUpdateWithoutWarehouseInput>
  }

  export type InventoryItemUpdateManyWithWhereWithoutWarehouseInput = {
    where: InventoryItemScalarWhereInput
    data: XOR<InventoryItemUpdateManyMutationInput, InventoryItemUncheckedUpdateManyWithoutWarehouseInput>
  }

  export type InventoryItemScalarWhereInput = {
    AND?: InventoryItemScalarWhereInput | InventoryItemScalarWhereInput[]
    OR?: InventoryItemScalarWhereInput[]
    NOT?: InventoryItemScalarWhereInput | InventoryItemScalarWhereInput[]
    id?: UuidFilter<"InventoryItem"> | string
    product_id?: UuidFilter<"InventoryItem"> | string
    sku?: StringFilter<"InventoryItem"> | string
    seller_id?: UuidNullableFilter<"InventoryItem"> | string | null
    warehouse_id?: UuidFilter<"InventoryItem"> | string
    quantity_on_hand?: IntFilter<"InventoryItem"> | number
    quantity_reserved?: IntFilter<"InventoryItem"> | number
    quantity_allocated?: IntFilter<"InventoryItem"> | number
    safety_stock?: IntFilter<"InventoryItem"> | number
    reorder_threshold?: IntFilter<"InventoryItem"> | number
    version?: IntFilter<"InventoryItem"> | number
    is_active?: BoolFilter<"InventoryItem"> | boolean
    created_at?: DateTimeFilter<"InventoryItem"> | Date | string
    updated_at?: DateTimeFilter<"InventoryItem"> | Date | string
  }

  export type ShipmentUpsertWithWhereUniqueWithoutWarehouseInput = {
    where: ShipmentWhereUniqueInput
    update: XOR<ShipmentUpdateWithoutWarehouseInput, ShipmentUncheckedUpdateWithoutWarehouseInput>
    create: XOR<ShipmentCreateWithoutWarehouseInput, ShipmentUncheckedCreateWithoutWarehouseInput>
  }

  export type ShipmentUpdateWithWhereUniqueWithoutWarehouseInput = {
    where: ShipmentWhereUniqueInput
    data: XOR<ShipmentUpdateWithoutWarehouseInput, ShipmentUncheckedUpdateWithoutWarehouseInput>
  }

  export type ShipmentUpdateManyWithWhereWithoutWarehouseInput = {
    where: ShipmentScalarWhereInput
    data: XOR<ShipmentUpdateManyMutationInput, ShipmentUncheckedUpdateManyWithoutWarehouseInput>
  }

  export type ShipmentScalarWhereInput = {
    AND?: ShipmentScalarWhereInput | ShipmentScalarWhereInput[]
    OR?: ShipmentScalarWhereInput[]
    NOT?: ShipmentScalarWhereInput | ShipmentScalarWhereInput[]
    id?: UuidFilter<"Shipment"> | string
    shipment_number?: StringFilter<"Shipment"> | string
    order_id?: UuidFilter<"Shipment"> | string
    user_id?: UuidFilter<"Shipment"> | string
    warehouse_id?: UuidFilter<"Shipment"> | string
    reservation_id?: UuidNullableFilter<"Shipment"> | string | null
    status?: EnumShipmentStatusFilter<"Shipment"> | $Enums.ShipmentStatus
    courier_code?: EnumCourierCodeFilter<"Shipment"> | $Enums.CourierCode
    tracking_number?: StringNullableFilter<"Shipment"> | string | null
    shipping_address?: JsonFilter<"Shipment">
    label_url?: StringNullableFilter<"Shipment"> | string | null
    manifest_id?: StringNullableFilter<"Shipment"> | string | null
    estimated_delivery?: DateTimeNullableFilter<"Shipment"> | Date | string | null
    dispatched_at?: DateTimeNullableFilter<"Shipment"> | Date | string | null
    delivered_at?: DateTimeNullableFilter<"Shipment"> | Date | string | null
    delivery_notes?: StringNullableFilter<"Shipment"> | string | null
    pod_signature?: StringNullableFilter<"Shipment"> | string | null
    pod_received_by?: StringNullableFilter<"Shipment"> | string | null
    pod_received_at?: DateTimeNullableFilter<"Shipment"> | Date | string | null
    created_at?: DateTimeFilter<"Shipment"> | Date | string
    updated_at?: DateTimeFilter<"Shipment"> | Date | string
  }

  export type ReturnPickupUpsertWithWhereUniqueWithoutWarehouseInput = {
    where: ReturnPickupWhereUniqueInput
    update: XOR<ReturnPickupUpdateWithoutWarehouseInput, ReturnPickupUncheckedUpdateWithoutWarehouseInput>
    create: XOR<ReturnPickupCreateWithoutWarehouseInput, ReturnPickupUncheckedCreateWithoutWarehouseInput>
  }

  export type ReturnPickupUpdateWithWhereUniqueWithoutWarehouseInput = {
    where: ReturnPickupWhereUniqueInput
    data: XOR<ReturnPickupUpdateWithoutWarehouseInput, ReturnPickupUncheckedUpdateWithoutWarehouseInput>
  }

  export type ReturnPickupUpdateManyWithWhereWithoutWarehouseInput = {
    where: ReturnPickupScalarWhereInput
    data: XOR<ReturnPickupUpdateManyMutationInput, ReturnPickupUncheckedUpdateManyWithoutWarehouseInput>
  }

  export type ReturnPickupScalarWhereInput = {
    AND?: ReturnPickupScalarWhereInput | ReturnPickupScalarWhereInput[]
    OR?: ReturnPickupScalarWhereInput[]
    NOT?: ReturnPickupScalarWhereInput | ReturnPickupScalarWhereInput[]
    id?: UuidFilter<"ReturnPickup"> | string
    return_number?: StringFilter<"ReturnPickup"> | string
    order_id?: UuidFilter<"ReturnPickup"> | string
    user_id?: UuidFilter<"ReturnPickup"> | string
    warehouse_id?: UuidFilter<"ReturnPickup"> | string
    status?: EnumReturnPickupStatusFilter<"ReturnPickup"> | $Enums.ReturnPickupStatus
    courier_code?: EnumCourierCodeFilter<"ReturnPickup"> | $Enums.CourierCode
    return_tracking_number?: StringNullableFilter<"ReturnPickup"> | string | null
    pickup_address?: JsonFilter<"ReturnPickup">
    scheduled_pickup_date?: DateTimeNullableFilter<"ReturnPickup"> | Date | string | null
    picked_up_at?: DateTimeNullableFilter<"ReturnPickup"> | Date | string | null
    received_at?: DateTimeNullableFilter<"ReturnPickup"> | Date | string | null
    completed_at?: DateTimeNullableFilter<"ReturnPickup"> | Date | string | null
    pop_signature?: StringNullableFilter<"ReturnPickup"> | string | null
    pop_received_by?: StringNullableFilter<"ReturnPickup"> | string | null
    cancellation_reason?: StringNullableFilter<"ReturnPickup"> | string | null
    created_at?: DateTimeFilter<"ReturnPickup"> | Date | string
    updated_at?: DateTimeFilter<"ReturnPickup"> | Date | string
  }

  export type WarehouseCreateWithoutInventory_itemsInput = {
    id?: string
    code: string
    name: string
    address_line1: string
    address_line2?: string | null
    city: string
    state: string
    postal_code: string
    country?: string
    is_active?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    shipments?: ShipmentCreateNestedManyWithoutWarehouseInput
    return_pickups?: ReturnPickupCreateNestedManyWithoutWarehouseInput
  }

  export type WarehouseUncheckedCreateWithoutInventory_itemsInput = {
    id?: string
    code: string
    name: string
    address_line1: string
    address_line2?: string | null
    city: string
    state: string
    postal_code: string
    country?: string
    is_active?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    shipments?: ShipmentUncheckedCreateNestedManyWithoutWarehouseInput
    return_pickups?: ReturnPickupUncheckedCreateNestedManyWithoutWarehouseInput
  }

  export type WarehouseCreateOrConnectWithoutInventory_itemsInput = {
    where: WarehouseWhereUniqueInput
    create: XOR<WarehouseCreateWithoutInventory_itemsInput, WarehouseUncheckedCreateWithoutInventory_itemsInput>
  }

  export type ReservationItemCreateWithoutInventory_itemInput = {
    id?: string
    product_id: string
    sku: string
    quantity: number
    created_at?: Date | string
    updated_at?: Date | string
    reservation: InventoryReservationCreateNestedOneWithoutItemsInput
  }

  export type ReservationItemUncheckedCreateWithoutInventory_itemInput = {
    id?: string
    reservation_id: string
    product_id: string
    sku: string
    quantity: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ReservationItemCreateOrConnectWithoutInventory_itemInput = {
    where: ReservationItemWhereUniqueInput
    create: XOR<ReservationItemCreateWithoutInventory_itemInput, ReservationItemUncheckedCreateWithoutInventory_itemInput>
  }

  export type ReservationItemCreateManyInventory_itemInputEnvelope = {
    data: ReservationItemCreateManyInventory_itemInput | ReservationItemCreateManyInventory_itemInput[]
    skipDuplicates?: boolean
  }

  export type WarehouseUpsertWithoutInventory_itemsInput = {
    update: XOR<WarehouseUpdateWithoutInventory_itemsInput, WarehouseUncheckedUpdateWithoutInventory_itemsInput>
    create: XOR<WarehouseCreateWithoutInventory_itemsInput, WarehouseUncheckedCreateWithoutInventory_itemsInput>
    where?: WarehouseWhereInput
  }

  export type WarehouseUpdateToOneWithWhereWithoutInventory_itemsInput = {
    where?: WarehouseWhereInput
    data: XOR<WarehouseUpdateWithoutInventory_itemsInput, WarehouseUncheckedUpdateWithoutInventory_itemsInput>
  }

  export type WarehouseUpdateWithoutInventory_itemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address_line1?: StringFieldUpdateOperationsInput | string
    address_line2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    postal_code?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    shipments?: ShipmentUpdateManyWithoutWarehouseNestedInput
    return_pickups?: ReturnPickupUpdateManyWithoutWarehouseNestedInput
  }

  export type WarehouseUncheckedUpdateWithoutInventory_itemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address_line1?: StringFieldUpdateOperationsInput | string
    address_line2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    postal_code?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    shipments?: ShipmentUncheckedUpdateManyWithoutWarehouseNestedInput
    return_pickups?: ReturnPickupUncheckedUpdateManyWithoutWarehouseNestedInput
  }

  export type ReservationItemUpsertWithWhereUniqueWithoutInventory_itemInput = {
    where: ReservationItemWhereUniqueInput
    update: XOR<ReservationItemUpdateWithoutInventory_itemInput, ReservationItemUncheckedUpdateWithoutInventory_itemInput>
    create: XOR<ReservationItemCreateWithoutInventory_itemInput, ReservationItemUncheckedCreateWithoutInventory_itemInput>
  }

  export type ReservationItemUpdateWithWhereUniqueWithoutInventory_itemInput = {
    where: ReservationItemWhereUniqueInput
    data: XOR<ReservationItemUpdateWithoutInventory_itemInput, ReservationItemUncheckedUpdateWithoutInventory_itemInput>
  }

  export type ReservationItemUpdateManyWithWhereWithoutInventory_itemInput = {
    where: ReservationItemScalarWhereInput
    data: XOR<ReservationItemUpdateManyMutationInput, ReservationItemUncheckedUpdateManyWithoutInventory_itemInput>
  }

  export type ReservationItemScalarWhereInput = {
    AND?: ReservationItemScalarWhereInput | ReservationItemScalarWhereInput[]
    OR?: ReservationItemScalarWhereInput[]
    NOT?: ReservationItemScalarWhereInput | ReservationItemScalarWhereInput[]
    id?: UuidFilter<"ReservationItem"> | string
    reservation_id?: UuidFilter<"ReservationItem"> | string
    inventory_item_id?: UuidFilter<"ReservationItem"> | string
    product_id?: UuidFilter<"ReservationItem"> | string
    sku?: StringFilter<"ReservationItem"> | string
    quantity?: IntFilter<"ReservationItem"> | number
    created_at?: DateTimeFilter<"ReservationItem"> | Date | string
    updated_at?: DateTimeFilter<"ReservationItem"> | Date | string
  }

  export type ReservationItemCreateWithoutReservationInput = {
    id?: string
    product_id: string
    sku: string
    quantity: number
    created_at?: Date | string
    updated_at?: Date | string
    inventory_item: InventoryItemCreateNestedOneWithoutReservation_itemsInput
  }

  export type ReservationItemUncheckedCreateWithoutReservationInput = {
    id?: string
    inventory_item_id: string
    product_id: string
    sku: string
    quantity: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ReservationItemCreateOrConnectWithoutReservationInput = {
    where: ReservationItemWhereUniqueInput
    create: XOR<ReservationItemCreateWithoutReservationInput, ReservationItemUncheckedCreateWithoutReservationInput>
  }

  export type ReservationItemCreateManyReservationInputEnvelope = {
    data: ReservationItemCreateManyReservationInput | ReservationItemCreateManyReservationInput[]
    skipDuplicates?: boolean
  }

  export type ReservationItemUpsertWithWhereUniqueWithoutReservationInput = {
    where: ReservationItemWhereUniqueInput
    update: XOR<ReservationItemUpdateWithoutReservationInput, ReservationItemUncheckedUpdateWithoutReservationInput>
    create: XOR<ReservationItemCreateWithoutReservationInput, ReservationItemUncheckedCreateWithoutReservationInput>
  }

  export type ReservationItemUpdateWithWhereUniqueWithoutReservationInput = {
    where: ReservationItemWhereUniqueInput
    data: XOR<ReservationItemUpdateWithoutReservationInput, ReservationItemUncheckedUpdateWithoutReservationInput>
  }

  export type ReservationItemUpdateManyWithWhereWithoutReservationInput = {
    where: ReservationItemScalarWhereInput
    data: XOR<ReservationItemUpdateManyMutationInput, ReservationItemUncheckedUpdateManyWithoutReservationInput>
  }

  export type InventoryReservationCreateWithoutItemsInput = {
    id?: string
    reservation_key: string
    user_id: string
    order_id?: string | null
    status?: $Enums.ReservationStatus
    expires_at: Date | string
    committed_at?: Date | string | null
    released_at?: Date | string | null
    expired_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type InventoryReservationUncheckedCreateWithoutItemsInput = {
    id?: string
    reservation_key: string
    user_id: string
    order_id?: string | null
    status?: $Enums.ReservationStatus
    expires_at: Date | string
    committed_at?: Date | string | null
    released_at?: Date | string | null
    expired_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type InventoryReservationCreateOrConnectWithoutItemsInput = {
    where: InventoryReservationWhereUniqueInput
    create: XOR<InventoryReservationCreateWithoutItemsInput, InventoryReservationUncheckedCreateWithoutItemsInput>
  }

  export type InventoryItemCreateWithoutReservation_itemsInput = {
    id?: string
    product_id: string
    sku: string
    seller_id?: string | null
    quantity_on_hand?: number
    quantity_reserved?: number
    quantity_allocated?: number
    safety_stock?: number
    reorder_threshold?: number
    version?: number
    is_active?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    warehouse: WarehouseCreateNestedOneWithoutInventory_itemsInput
  }

  export type InventoryItemUncheckedCreateWithoutReservation_itemsInput = {
    id?: string
    product_id: string
    sku: string
    seller_id?: string | null
    warehouse_id: string
    quantity_on_hand?: number
    quantity_reserved?: number
    quantity_allocated?: number
    safety_stock?: number
    reorder_threshold?: number
    version?: number
    is_active?: boolean
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type InventoryItemCreateOrConnectWithoutReservation_itemsInput = {
    where: InventoryItemWhereUniqueInput
    create: XOR<InventoryItemCreateWithoutReservation_itemsInput, InventoryItemUncheckedCreateWithoutReservation_itemsInput>
  }

  export type InventoryReservationUpsertWithoutItemsInput = {
    update: XOR<InventoryReservationUpdateWithoutItemsInput, InventoryReservationUncheckedUpdateWithoutItemsInput>
    create: XOR<InventoryReservationCreateWithoutItemsInput, InventoryReservationUncheckedCreateWithoutItemsInput>
    where?: InventoryReservationWhereInput
  }

  export type InventoryReservationUpdateToOneWithWhereWithoutItemsInput = {
    where?: InventoryReservationWhereInput
    data: XOR<InventoryReservationUpdateWithoutItemsInput, InventoryReservationUncheckedUpdateWithoutItemsInput>
  }

  export type InventoryReservationUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    reservation_key?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    order_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    committed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    released_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expired_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryReservationUncheckedUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    reservation_key?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    order_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    committed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    released_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expired_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryItemUpsertWithoutReservation_itemsInput = {
    update: XOR<InventoryItemUpdateWithoutReservation_itemsInput, InventoryItemUncheckedUpdateWithoutReservation_itemsInput>
    create: XOR<InventoryItemCreateWithoutReservation_itemsInput, InventoryItemUncheckedCreateWithoutReservation_itemsInput>
    where?: InventoryItemWhereInput
  }

  export type InventoryItemUpdateToOneWithWhereWithoutReservation_itemsInput = {
    where?: InventoryItemWhereInput
    data: XOR<InventoryItemUpdateWithoutReservation_itemsInput, InventoryItemUncheckedUpdateWithoutReservation_itemsInput>
  }

  export type InventoryItemUpdateWithoutReservation_itemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    product_id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    seller_id?: NullableStringFieldUpdateOperationsInput | string | null
    quantity_on_hand?: IntFieldUpdateOperationsInput | number
    quantity_reserved?: IntFieldUpdateOperationsInput | number
    quantity_allocated?: IntFieldUpdateOperationsInput | number
    safety_stock?: IntFieldUpdateOperationsInput | number
    reorder_threshold?: IntFieldUpdateOperationsInput | number
    version?: IntFieldUpdateOperationsInput | number
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    warehouse?: WarehouseUpdateOneRequiredWithoutInventory_itemsNestedInput
  }

  export type InventoryItemUncheckedUpdateWithoutReservation_itemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    product_id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    seller_id?: NullableStringFieldUpdateOperationsInput | string | null
    warehouse_id?: StringFieldUpdateOperationsInput | string
    quantity_on_hand?: IntFieldUpdateOperationsInput | number
    quantity_reserved?: IntFieldUpdateOperationsInput | number
    quantity_allocated?: IntFieldUpdateOperationsInput | number
    safety_stock?: IntFieldUpdateOperationsInput | number
    reorder_threshold?: IntFieldUpdateOperationsInput | number
    version?: IntFieldUpdateOperationsInput | number
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WarehouseCreateWithoutShipmentsInput = {
    id?: string
    code: string
    name: string
    address_line1: string
    address_line2?: string | null
    city: string
    state: string
    postal_code: string
    country?: string
    is_active?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    inventory_items?: InventoryItemCreateNestedManyWithoutWarehouseInput
    return_pickups?: ReturnPickupCreateNestedManyWithoutWarehouseInput
  }

  export type WarehouseUncheckedCreateWithoutShipmentsInput = {
    id?: string
    code: string
    name: string
    address_line1: string
    address_line2?: string | null
    city: string
    state: string
    postal_code: string
    country?: string
    is_active?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    inventory_items?: InventoryItemUncheckedCreateNestedManyWithoutWarehouseInput
    return_pickups?: ReturnPickupUncheckedCreateNestedManyWithoutWarehouseInput
  }

  export type WarehouseCreateOrConnectWithoutShipmentsInput = {
    where: WarehouseWhereUniqueInput
    create: XOR<WarehouseCreateWithoutShipmentsInput, WarehouseUncheckedCreateWithoutShipmentsInput>
  }

  export type ShipmentItemCreateWithoutShipmentInput = {
    id?: string
    product_id: string
    sku: string
    seller_id?: string | null
    quantity: number
    unit_price?: Decimal | DecimalJsLike | number | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ShipmentItemUncheckedCreateWithoutShipmentInput = {
    id?: string
    product_id: string
    sku: string
    seller_id?: string | null
    quantity: number
    unit_price?: Decimal | DecimalJsLike | number | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ShipmentItemCreateOrConnectWithoutShipmentInput = {
    where: ShipmentItemWhereUniqueInput
    create: XOR<ShipmentItemCreateWithoutShipmentInput, ShipmentItemUncheckedCreateWithoutShipmentInput>
  }

  export type ShipmentItemCreateManyShipmentInputEnvelope = {
    data: ShipmentItemCreateManyShipmentInput | ShipmentItemCreateManyShipmentInput[]
    skipDuplicates?: boolean
  }

  export type TrackingUpdateCreateWithoutShipmentInput = {
    id?: string
    status: $Enums.ShipmentStatus
    location?: string | null
    description: string
    recorded_by?: string | null
    recorded_at?: Date | string
  }

  export type TrackingUpdateUncheckedCreateWithoutShipmentInput = {
    id?: string
    status: $Enums.ShipmentStatus
    location?: string | null
    description: string
    recorded_by?: string | null
    recorded_at?: Date | string
  }

  export type TrackingUpdateCreateOrConnectWithoutShipmentInput = {
    where: TrackingUpdateWhereUniqueInput
    create: XOR<TrackingUpdateCreateWithoutShipmentInput, TrackingUpdateUncheckedCreateWithoutShipmentInput>
  }

  export type TrackingUpdateCreateManyShipmentInputEnvelope = {
    data: TrackingUpdateCreateManyShipmentInput | TrackingUpdateCreateManyShipmentInput[]
    skipDuplicates?: boolean
  }

  export type WarehouseUpsertWithoutShipmentsInput = {
    update: XOR<WarehouseUpdateWithoutShipmentsInput, WarehouseUncheckedUpdateWithoutShipmentsInput>
    create: XOR<WarehouseCreateWithoutShipmentsInput, WarehouseUncheckedCreateWithoutShipmentsInput>
    where?: WarehouseWhereInput
  }

  export type WarehouseUpdateToOneWithWhereWithoutShipmentsInput = {
    where?: WarehouseWhereInput
    data: XOR<WarehouseUpdateWithoutShipmentsInput, WarehouseUncheckedUpdateWithoutShipmentsInput>
  }

  export type WarehouseUpdateWithoutShipmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address_line1?: StringFieldUpdateOperationsInput | string
    address_line2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    postal_code?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    inventory_items?: InventoryItemUpdateManyWithoutWarehouseNestedInput
    return_pickups?: ReturnPickupUpdateManyWithoutWarehouseNestedInput
  }

  export type WarehouseUncheckedUpdateWithoutShipmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address_line1?: StringFieldUpdateOperationsInput | string
    address_line2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    postal_code?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    inventory_items?: InventoryItemUncheckedUpdateManyWithoutWarehouseNestedInput
    return_pickups?: ReturnPickupUncheckedUpdateManyWithoutWarehouseNestedInput
  }

  export type ShipmentItemUpsertWithWhereUniqueWithoutShipmentInput = {
    where: ShipmentItemWhereUniqueInput
    update: XOR<ShipmentItemUpdateWithoutShipmentInput, ShipmentItemUncheckedUpdateWithoutShipmentInput>
    create: XOR<ShipmentItemCreateWithoutShipmentInput, ShipmentItemUncheckedCreateWithoutShipmentInput>
  }

  export type ShipmentItemUpdateWithWhereUniqueWithoutShipmentInput = {
    where: ShipmentItemWhereUniqueInput
    data: XOR<ShipmentItemUpdateWithoutShipmentInput, ShipmentItemUncheckedUpdateWithoutShipmentInput>
  }

  export type ShipmentItemUpdateManyWithWhereWithoutShipmentInput = {
    where: ShipmentItemScalarWhereInput
    data: XOR<ShipmentItemUpdateManyMutationInput, ShipmentItemUncheckedUpdateManyWithoutShipmentInput>
  }

  export type ShipmentItemScalarWhereInput = {
    AND?: ShipmentItemScalarWhereInput | ShipmentItemScalarWhereInput[]
    OR?: ShipmentItemScalarWhereInput[]
    NOT?: ShipmentItemScalarWhereInput | ShipmentItemScalarWhereInput[]
    id?: UuidFilter<"ShipmentItem"> | string
    shipment_id?: UuidFilter<"ShipmentItem"> | string
    product_id?: UuidFilter<"ShipmentItem"> | string
    sku?: StringFilter<"ShipmentItem"> | string
    seller_id?: UuidNullableFilter<"ShipmentItem"> | string | null
    quantity?: IntFilter<"ShipmentItem"> | number
    unit_price?: DecimalNullableFilter<"ShipmentItem"> | Decimal | DecimalJsLike | number | string | null
    created_at?: DateTimeFilter<"ShipmentItem"> | Date | string
    updated_at?: DateTimeFilter<"ShipmentItem"> | Date | string
  }

  export type TrackingUpdateUpsertWithWhereUniqueWithoutShipmentInput = {
    where: TrackingUpdateWhereUniqueInput
    update: XOR<TrackingUpdateUpdateWithoutShipmentInput, TrackingUpdateUncheckedUpdateWithoutShipmentInput>
    create: XOR<TrackingUpdateCreateWithoutShipmentInput, TrackingUpdateUncheckedCreateWithoutShipmentInput>
  }

  export type TrackingUpdateUpdateWithWhereUniqueWithoutShipmentInput = {
    where: TrackingUpdateWhereUniqueInput
    data: XOR<TrackingUpdateUpdateWithoutShipmentInput, TrackingUpdateUncheckedUpdateWithoutShipmentInput>
  }

  export type TrackingUpdateUpdateManyWithWhereWithoutShipmentInput = {
    where: TrackingUpdateScalarWhereInput
    data: XOR<TrackingUpdateUpdateManyMutationInput, TrackingUpdateUncheckedUpdateManyWithoutShipmentInput>
  }

  export type TrackingUpdateScalarWhereInput = {
    AND?: TrackingUpdateScalarWhereInput | TrackingUpdateScalarWhereInput[]
    OR?: TrackingUpdateScalarWhereInput[]
    NOT?: TrackingUpdateScalarWhereInput | TrackingUpdateScalarWhereInput[]
    id?: UuidFilter<"TrackingUpdate"> | string
    shipment_id?: UuidFilter<"TrackingUpdate"> | string
    status?: EnumShipmentStatusFilter<"TrackingUpdate"> | $Enums.ShipmentStatus
    location?: StringNullableFilter<"TrackingUpdate"> | string | null
    description?: StringFilter<"TrackingUpdate"> | string
    recorded_by?: UuidNullableFilter<"TrackingUpdate"> | string | null
    recorded_at?: DateTimeFilter<"TrackingUpdate"> | Date | string
  }

  export type ShipmentCreateWithoutItemsInput = {
    id?: string
    shipment_number: string
    order_id: string
    user_id: string
    reservation_id?: string | null
    status?: $Enums.ShipmentStatus
    courier_code?: $Enums.CourierCode
    tracking_number?: string | null
    shipping_address: JsonNullValueInput | InputJsonValue
    label_url?: string | null
    manifest_id?: string | null
    estimated_delivery?: Date | string | null
    dispatched_at?: Date | string | null
    delivered_at?: Date | string | null
    delivery_notes?: string | null
    pod_signature?: string | null
    pod_received_by?: string | null
    pod_received_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    warehouse: WarehouseCreateNestedOneWithoutShipmentsInput
    tracking_updates?: TrackingUpdateCreateNestedManyWithoutShipmentInput
  }

  export type ShipmentUncheckedCreateWithoutItemsInput = {
    id?: string
    shipment_number: string
    order_id: string
    user_id: string
    warehouse_id: string
    reservation_id?: string | null
    status?: $Enums.ShipmentStatus
    courier_code?: $Enums.CourierCode
    tracking_number?: string | null
    shipping_address: JsonNullValueInput | InputJsonValue
    label_url?: string | null
    manifest_id?: string | null
    estimated_delivery?: Date | string | null
    dispatched_at?: Date | string | null
    delivered_at?: Date | string | null
    delivery_notes?: string | null
    pod_signature?: string | null
    pod_received_by?: string | null
    pod_received_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    tracking_updates?: TrackingUpdateUncheckedCreateNestedManyWithoutShipmentInput
  }

  export type ShipmentCreateOrConnectWithoutItemsInput = {
    where: ShipmentWhereUniqueInput
    create: XOR<ShipmentCreateWithoutItemsInput, ShipmentUncheckedCreateWithoutItemsInput>
  }

  export type ShipmentUpsertWithoutItemsInput = {
    update: XOR<ShipmentUpdateWithoutItemsInput, ShipmentUncheckedUpdateWithoutItemsInput>
    create: XOR<ShipmentCreateWithoutItemsInput, ShipmentUncheckedCreateWithoutItemsInput>
    where?: ShipmentWhereInput
  }

  export type ShipmentUpdateToOneWithWhereWithoutItemsInput = {
    where?: ShipmentWhereInput
    data: XOR<ShipmentUpdateWithoutItemsInput, ShipmentUncheckedUpdateWithoutItemsInput>
  }

  export type ShipmentUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    shipment_number?: StringFieldUpdateOperationsInput | string
    order_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    reservation_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumShipmentStatusFieldUpdateOperationsInput | $Enums.ShipmentStatus
    courier_code?: EnumCourierCodeFieldUpdateOperationsInput | $Enums.CourierCode
    tracking_number?: NullableStringFieldUpdateOperationsInput | string | null
    shipping_address?: JsonNullValueInput | InputJsonValue
    label_url?: NullableStringFieldUpdateOperationsInput | string | null
    manifest_id?: NullableStringFieldUpdateOperationsInput | string | null
    estimated_delivery?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dispatched_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    delivered_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    delivery_notes?: NullableStringFieldUpdateOperationsInput | string | null
    pod_signature?: NullableStringFieldUpdateOperationsInput | string | null
    pod_received_by?: NullableStringFieldUpdateOperationsInput | string | null
    pod_received_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    warehouse?: WarehouseUpdateOneRequiredWithoutShipmentsNestedInput
    tracking_updates?: TrackingUpdateUpdateManyWithoutShipmentNestedInput
  }

  export type ShipmentUncheckedUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    shipment_number?: StringFieldUpdateOperationsInput | string
    order_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    warehouse_id?: StringFieldUpdateOperationsInput | string
    reservation_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumShipmentStatusFieldUpdateOperationsInput | $Enums.ShipmentStatus
    courier_code?: EnumCourierCodeFieldUpdateOperationsInput | $Enums.CourierCode
    tracking_number?: NullableStringFieldUpdateOperationsInput | string | null
    shipping_address?: JsonNullValueInput | InputJsonValue
    label_url?: NullableStringFieldUpdateOperationsInput | string | null
    manifest_id?: NullableStringFieldUpdateOperationsInput | string | null
    estimated_delivery?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dispatched_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    delivered_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    delivery_notes?: NullableStringFieldUpdateOperationsInput | string | null
    pod_signature?: NullableStringFieldUpdateOperationsInput | string | null
    pod_received_by?: NullableStringFieldUpdateOperationsInput | string | null
    pod_received_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    tracking_updates?: TrackingUpdateUncheckedUpdateManyWithoutShipmentNestedInput
  }

  export type ShipmentCreateWithoutTracking_updatesInput = {
    id?: string
    shipment_number: string
    order_id: string
    user_id: string
    reservation_id?: string | null
    status?: $Enums.ShipmentStatus
    courier_code?: $Enums.CourierCode
    tracking_number?: string | null
    shipping_address: JsonNullValueInput | InputJsonValue
    label_url?: string | null
    manifest_id?: string | null
    estimated_delivery?: Date | string | null
    dispatched_at?: Date | string | null
    delivered_at?: Date | string | null
    delivery_notes?: string | null
    pod_signature?: string | null
    pod_received_by?: string | null
    pod_received_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    warehouse: WarehouseCreateNestedOneWithoutShipmentsInput
    items?: ShipmentItemCreateNestedManyWithoutShipmentInput
  }

  export type ShipmentUncheckedCreateWithoutTracking_updatesInput = {
    id?: string
    shipment_number: string
    order_id: string
    user_id: string
    warehouse_id: string
    reservation_id?: string | null
    status?: $Enums.ShipmentStatus
    courier_code?: $Enums.CourierCode
    tracking_number?: string | null
    shipping_address: JsonNullValueInput | InputJsonValue
    label_url?: string | null
    manifest_id?: string | null
    estimated_delivery?: Date | string | null
    dispatched_at?: Date | string | null
    delivered_at?: Date | string | null
    delivery_notes?: string | null
    pod_signature?: string | null
    pod_received_by?: string | null
    pod_received_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    items?: ShipmentItemUncheckedCreateNestedManyWithoutShipmentInput
  }

  export type ShipmentCreateOrConnectWithoutTracking_updatesInput = {
    where: ShipmentWhereUniqueInput
    create: XOR<ShipmentCreateWithoutTracking_updatesInput, ShipmentUncheckedCreateWithoutTracking_updatesInput>
  }

  export type ShipmentUpsertWithoutTracking_updatesInput = {
    update: XOR<ShipmentUpdateWithoutTracking_updatesInput, ShipmentUncheckedUpdateWithoutTracking_updatesInput>
    create: XOR<ShipmentCreateWithoutTracking_updatesInput, ShipmentUncheckedCreateWithoutTracking_updatesInput>
    where?: ShipmentWhereInput
  }

  export type ShipmentUpdateToOneWithWhereWithoutTracking_updatesInput = {
    where?: ShipmentWhereInput
    data: XOR<ShipmentUpdateWithoutTracking_updatesInput, ShipmentUncheckedUpdateWithoutTracking_updatesInput>
  }

  export type ShipmentUpdateWithoutTracking_updatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    shipment_number?: StringFieldUpdateOperationsInput | string
    order_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    reservation_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumShipmentStatusFieldUpdateOperationsInput | $Enums.ShipmentStatus
    courier_code?: EnumCourierCodeFieldUpdateOperationsInput | $Enums.CourierCode
    tracking_number?: NullableStringFieldUpdateOperationsInput | string | null
    shipping_address?: JsonNullValueInput | InputJsonValue
    label_url?: NullableStringFieldUpdateOperationsInput | string | null
    manifest_id?: NullableStringFieldUpdateOperationsInput | string | null
    estimated_delivery?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dispatched_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    delivered_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    delivery_notes?: NullableStringFieldUpdateOperationsInput | string | null
    pod_signature?: NullableStringFieldUpdateOperationsInput | string | null
    pod_received_by?: NullableStringFieldUpdateOperationsInput | string | null
    pod_received_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    warehouse?: WarehouseUpdateOneRequiredWithoutShipmentsNestedInput
    items?: ShipmentItemUpdateManyWithoutShipmentNestedInput
  }

  export type ShipmentUncheckedUpdateWithoutTracking_updatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    shipment_number?: StringFieldUpdateOperationsInput | string
    order_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    warehouse_id?: StringFieldUpdateOperationsInput | string
    reservation_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumShipmentStatusFieldUpdateOperationsInput | $Enums.ShipmentStatus
    courier_code?: EnumCourierCodeFieldUpdateOperationsInput | $Enums.CourierCode
    tracking_number?: NullableStringFieldUpdateOperationsInput | string | null
    shipping_address?: JsonNullValueInput | InputJsonValue
    label_url?: NullableStringFieldUpdateOperationsInput | string | null
    manifest_id?: NullableStringFieldUpdateOperationsInput | string | null
    estimated_delivery?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dispatched_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    delivered_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    delivery_notes?: NullableStringFieldUpdateOperationsInput | string | null
    pod_signature?: NullableStringFieldUpdateOperationsInput | string | null
    pod_received_by?: NullableStringFieldUpdateOperationsInput | string | null
    pod_received_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: ShipmentItemUncheckedUpdateManyWithoutShipmentNestedInput
  }

  export type WarehouseCreateWithoutReturn_pickupsInput = {
    id?: string
    code: string
    name: string
    address_line1: string
    address_line2?: string | null
    city: string
    state: string
    postal_code: string
    country?: string
    is_active?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    inventory_items?: InventoryItemCreateNestedManyWithoutWarehouseInput
    shipments?: ShipmentCreateNestedManyWithoutWarehouseInput
  }

  export type WarehouseUncheckedCreateWithoutReturn_pickupsInput = {
    id?: string
    code: string
    name: string
    address_line1: string
    address_line2?: string | null
    city: string
    state: string
    postal_code: string
    country?: string
    is_active?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    inventory_items?: InventoryItemUncheckedCreateNestedManyWithoutWarehouseInput
    shipments?: ShipmentUncheckedCreateNestedManyWithoutWarehouseInput
  }

  export type WarehouseCreateOrConnectWithoutReturn_pickupsInput = {
    where: WarehouseWhereUniqueInput
    create: XOR<WarehouseCreateWithoutReturn_pickupsInput, WarehouseUncheckedCreateWithoutReturn_pickupsInput>
  }

  export type ReturnItemCreateWithoutReturn_pickupInput = {
    id?: string
    product_id: string
    sku: string
    seller_id?: string | null
    quantity: number
    reason: string
    inspection_grade?: $Enums.InspectionGrade | null
    inspection_notes?: string | null
    is_restocked?: boolean
    restocked_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ReturnItemUncheckedCreateWithoutReturn_pickupInput = {
    id?: string
    product_id: string
    sku: string
    seller_id?: string | null
    quantity: number
    reason: string
    inspection_grade?: $Enums.InspectionGrade | null
    inspection_notes?: string | null
    is_restocked?: boolean
    restocked_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ReturnItemCreateOrConnectWithoutReturn_pickupInput = {
    where: ReturnItemWhereUniqueInput
    create: XOR<ReturnItemCreateWithoutReturn_pickupInput, ReturnItemUncheckedCreateWithoutReturn_pickupInput>
  }

  export type ReturnItemCreateManyReturn_pickupInputEnvelope = {
    data: ReturnItemCreateManyReturn_pickupInput | ReturnItemCreateManyReturn_pickupInput[]
    skipDuplicates?: boolean
  }

  export type ReturnTrackingUpdateCreateWithoutReturn_pickupInput = {
    id?: string
    status: $Enums.ReturnPickupStatus
    location?: string | null
    description: string
    recorded_by?: string | null
    recorded_at?: Date | string
  }

  export type ReturnTrackingUpdateUncheckedCreateWithoutReturn_pickupInput = {
    id?: string
    status: $Enums.ReturnPickupStatus
    location?: string | null
    description: string
    recorded_by?: string | null
    recorded_at?: Date | string
  }

  export type ReturnTrackingUpdateCreateOrConnectWithoutReturn_pickupInput = {
    where: ReturnTrackingUpdateWhereUniqueInput
    create: XOR<ReturnTrackingUpdateCreateWithoutReturn_pickupInput, ReturnTrackingUpdateUncheckedCreateWithoutReturn_pickupInput>
  }

  export type ReturnTrackingUpdateCreateManyReturn_pickupInputEnvelope = {
    data: ReturnTrackingUpdateCreateManyReturn_pickupInput | ReturnTrackingUpdateCreateManyReturn_pickupInput[]
    skipDuplicates?: boolean
  }

  export type WarehouseUpsertWithoutReturn_pickupsInput = {
    update: XOR<WarehouseUpdateWithoutReturn_pickupsInput, WarehouseUncheckedUpdateWithoutReturn_pickupsInput>
    create: XOR<WarehouseCreateWithoutReturn_pickupsInput, WarehouseUncheckedCreateWithoutReturn_pickupsInput>
    where?: WarehouseWhereInput
  }

  export type WarehouseUpdateToOneWithWhereWithoutReturn_pickupsInput = {
    where?: WarehouseWhereInput
    data: XOR<WarehouseUpdateWithoutReturn_pickupsInput, WarehouseUncheckedUpdateWithoutReturn_pickupsInput>
  }

  export type WarehouseUpdateWithoutReturn_pickupsInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address_line1?: StringFieldUpdateOperationsInput | string
    address_line2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    postal_code?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    inventory_items?: InventoryItemUpdateManyWithoutWarehouseNestedInput
    shipments?: ShipmentUpdateManyWithoutWarehouseNestedInput
  }

  export type WarehouseUncheckedUpdateWithoutReturn_pickupsInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address_line1?: StringFieldUpdateOperationsInput | string
    address_line2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    postal_code?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    inventory_items?: InventoryItemUncheckedUpdateManyWithoutWarehouseNestedInput
    shipments?: ShipmentUncheckedUpdateManyWithoutWarehouseNestedInput
  }

  export type ReturnItemUpsertWithWhereUniqueWithoutReturn_pickupInput = {
    where: ReturnItemWhereUniqueInput
    update: XOR<ReturnItemUpdateWithoutReturn_pickupInput, ReturnItemUncheckedUpdateWithoutReturn_pickupInput>
    create: XOR<ReturnItemCreateWithoutReturn_pickupInput, ReturnItemUncheckedCreateWithoutReturn_pickupInput>
  }

  export type ReturnItemUpdateWithWhereUniqueWithoutReturn_pickupInput = {
    where: ReturnItemWhereUniqueInput
    data: XOR<ReturnItemUpdateWithoutReturn_pickupInput, ReturnItemUncheckedUpdateWithoutReturn_pickupInput>
  }

  export type ReturnItemUpdateManyWithWhereWithoutReturn_pickupInput = {
    where: ReturnItemScalarWhereInput
    data: XOR<ReturnItemUpdateManyMutationInput, ReturnItemUncheckedUpdateManyWithoutReturn_pickupInput>
  }

  export type ReturnItemScalarWhereInput = {
    AND?: ReturnItemScalarWhereInput | ReturnItemScalarWhereInput[]
    OR?: ReturnItemScalarWhereInput[]
    NOT?: ReturnItemScalarWhereInput | ReturnItemScalarWhereInput[]
    id?: UuidFilter<"ReturnItem"> | string
    return_pickup_id?: UuidFilter<"ReturnItem"> | string
    product_id?: UuidFilter<"ReturnItem"> | string
    sku?: StringFilter<"ReturnItem"> | string
    seller_id?: UuidNullableFilter<"ReturnItem"> | string | null
    quantity?: IntFilter<"ReturnItem"> | number
    reason?: StringFilter<"ReturnItem"> | string
    inspection_grade?: EnumInspectionGradeNullableFilter<"ReturnItem"> | $Enums.InspectionGrade | null
    inspection_notes?: StringNullableFilter<"ReturnItem"> | string | null
    is_restocked?: BoolFilter<"ReturnItem"> | boolean
    restocked_at?: DateTimeNullableFilter<"ReturnItem"> | Date | string | null
    created_at?: DateTimeFilter<"ReturnItem"> | Date | string
    updated_at?: DateTimeFilter<"ReturnItem"> | Date | string
  }

  export type ReturnTrackingUpdateUpsertWithWhereUniqueWithoutReturn_pickupInput = {
    where: ReturnTrackingUpdateWhereUniqueInput
    update: XOR<ReturnTrackingUpdateUpdateWithoutReturn_pickupInput, ReturnTrackingUpdateUncheckedUpdateWithoutReturn_pickupInput>
    create: XOR<ReturnTrackingUpdateCreateWithoutReturn_pickupInput, ReturnTrackingUpdateUncheckedCreateWithoutReturn_pickupInput>
  }

  export type ReturnTrackingUpdateUpdateWithWhereUniqueWithoutReturn_pickupInput = {
    where: ReturnTrackingUpdateWhereUniqueInput
    data: XOR<ReturnTrackingUpdateUpdateWithoutReturn_pickupInput, ReturnTrackingUpdateUncheckedUpdateWithoutReturn_pickupInput>
  }

  export type ReturnTrackingUpdateUpdateManyWithWhereWithoutReturn_pickupInput = {
    where: ReturnTrackingUpdateScalarWhereInput
    data: XOR<ReturnTrackingUpdateUpdateManyMutationInput, ReturnTrackingUpdateUncheckedUpdateManyWithoutReturn_pickupInput>
  }

  export type ReturnTrackingUpdateScalarWhereInput = {
    AND?: ReturnTrackingUpdateScalarWhereInput | ReturnTrackingUpdateScalarWhereInput[]
    OR?: ReturnTrackingUpdateScalarWhereInput[]
    NOT?: ReturnTrackingUpdateScalarWhereInput | ReturnTrackingUpdateScalarWhereInput[]
    id?: UuidFilter<"ReturnTrackingUpdate"> | string
    return_pickup_id?: UuidFilter<"ReturnTrackingUpdate"> | string
    status?: EnumReturnPickupStatusFilter<"ReturnTrackingUpdate"> | $Enums.ReturnPickupStatus
    location?: StringNullableFilter<"ReturnTrackingUpdate"> | string | null
    description?: StringFilter<"ReturnTrackingUpdate"> | string
    recorded_by?: UuidNullableFilter<"ReturnTrackingUpdate"> | string | null
    recorded_at?: DateTimeFilter<"ReturnTrackingUpdate"> | Date | string
  }

  export type ReturnPickupCreateWithoutItemsInput = {
    id?: string
    return_number: string
    order_id: string
    user_id: string
    status?: $Enums.ReturnPickupStatus
    courier_code?: $Enums.CourierCode
    return_tracking_number?: string | null
    pickup_address: JsonNullValueInput | InputJsonValue
    scheduled_pickup_date?: Date | string | null
    picked_up_at?: Date | string | null
    received_at?: Date | string | null
    completed_at?: Date | string | null
    pop_signature?: string | null
    pop_received_by?: string | null
    cancellation_reason?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    warehouse: WarehouseCreateNestedOneWithoutReturn_pickupsInput
    tracking_updates?: ReturnTrackingUpdateCreateNestedManyWithoutReturn_pickupInput
  }

  export type ReturnPickupUncheckedCreateWithoutItemsInput = {
    id?: string
    return_number: string
    order_id: string
    user_id: string
    warehouse_id: string
    status?: $Enums.ReturnPickupStatus
    courier_code?: $Enums.CourierCode
    return_tracking_number?: string | null
    pickup_address: JsonNullValueInput | InputJsonValue
    scheduled_pickup_date?: Date | string | null
    picked_up_at?: Date | string | null
    received_at?: Date | string | null
    completed_at?: Date | string | null
    pop_signature?: string | null
    pop_received_by?: string | null
    cancellation_reason?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    tracking_updates?: ReturnTrackingUpdateUncheckedCreateNestedManyWithoutReturn_pickupInput
  }

  export type ReturnPickupCreateOrConnectWithoutItemsInput = {
    where: ReturnPickupWhereUniqueInput
    create: XOR<ReturnPickupCreateWithoutItemsInput, ReturnPickupUncheckedCreateWithoutItemsInput>
  }

  export type ReturnPickupUpsertWithoutItemsInput = {
    update: XOR<ReturnPickupUpdateWithoutItemsInput, ReturnPickupUncheckedUpdateWithoutItemsInput>
    create: XOR<ReturnPickupCreateWithoutItemsInput, ReturnPickupUncheckedCreateWithoutItemsInput>
    where?: ReturnPickupWhereInput
  }

  export type ReturnPickupUpdateToOneWithWhereWithoutItemsInput = {
    where?: ReturnPickupWhereInput
    data: XOR<ReturnPickupUpdateWithoutItemsInput, ReturnPickupUncheckedUpdateWithoutItemsInput>
  }

  export type ReturnPickupUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    return_number?: StringFieldUpdateOperationsInput | string
    order_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    status?: EnumReturnPickupStatusFieldUpdateOperationsInput | $Enums.ReturnPickupStatus
    courier_code?: EnumCourierCodeFieldUpdateOperationsInput | $Enums.CourierCode
    return_tracking_number?: NullableStringFieldUpdateOperationsInput | string | null
    pickup_address?: JsonNullValueInput | InputJsonValue
    scheduled_pickup_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    picked_up_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    received_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pop_signature?: NullableStringFieldUpdateOperationsInput | string | null
    pop_received_by?: NullableStringFieldUpdateOperationsInput | string | null
    cancellation_reason?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    warehouse?: WarehouseUpdateOneRequiredWithoutReturn_pickupsNestedInput
    tracking_updates?: ReturnTrackingUpdateUpdateManyWithoutReturn_pickupNestedInput
  }

  export type ReturnPickupUncheckedUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    return_number?: StringFieldUpdateOperationsInput | string
    order_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    warehouse_id?: StringFieldUpdateOperationsInput | string
    status?: EnumReturnPickupStatusFieldUpdateOperationsInput | $Enums.ReturnPickupStatus
    courier_code?: EnumCourierCodeFieldUpdateOperationsInput | $Enums.CourierCode
    return_tracking_number?: NullableStringFieldUpdateOperationsInput | string | null
    pickup_address?: JsonNullValueInput | InputJsonValue
    scheduled_pickup_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    picked_up_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    received_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pop_signature?: NullableStringFieldUpdateOperationsInput | string | null
    pop_received_by?: NullableStringFieldUpdateOperationsInput | string | null
    cancellation_reason?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    tracking_updates?: ReturnTrackingUpdateUncheckedUpdateManyWithoutReturn_pickupNestedInput
  }

  export type ReturnPickupCreateWithoutTracking_updatesInput = {
    id?: string
    return_number: string
    order_id: string
    user_id: string
    status?: $Enums.ReturnPickupStatus
    courier_code?: $Enums.CourierCode
    return_tracking_number?: string | null
    pickup_address: JsonNullValueInput | InputJsonValue
    scheduled_pickup_date?: Date | string | null
    picked_up_at?: Date | string | null
    received_at?: Date | string | null
    completed_at?: Date | string | null
    pop_signature?: string | null
    pop_received_by?: string | null
    cancellation_reason?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    warehouse: WarehouseCreateNestedOneWithoutReturn_pickupsInput
    items?: ReturnItemCreateNestedManyWithoutReturn_pickupInput
  }

  export type ReturnPickupUncheckedCreateWithoutTracking_updatesInput = {
    id?: string
    return_number: string
    order_id: string
    user_id: string
    warehouse_id: string
    status?: $Enums.ReturnPickupStatus
    courier_code?: $Enums.CourierCode
    return_tracking_number?: string | null
    pickup_address: JsonNullValueInput | InputJsonValue
    scheduled_pickup_date?: Date | string | null
    picked_up_at?: Date | string | null
    received_at?: Date | string | null
    completed_at?: Date | string | null
    pop_signature?: string | null
    pop_received_by?: string | null
    cancellation_reason?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    items?: ReturnItemUncheckedCreateNestedManyWithoutReturn_pickupInput
  }

  export type ReturnPickupCreateOrConnectWithoutTracking_updatesInput = {
    where: ReturnPickupWhereUniqueInput
    create: XOR<ReturnPickupCreateWithoutTracking_updatesInput, ReturnPickupUncheckedCreateWithoutTracking_updatesInput>
  }

  export type ReturnPickupUpsertWithoutTracking_updatesInput = {
    update: XOR<ReturnPickupUpdateWithoutTracking_updatesInput, ReturnPickupUncheckedUpdateWithoutTracking_updatesInput>
    create: XOR<ReturnPickupCreateWithoutTracking_updatesInput, ReturnPickupUncheckedCreateWithoutTracking_updatesInput>
    where?: ReturnPickupWhereInput
  }

  export type ReturnPickupUpdateToOneWithWhereWithoutTracking_updatesInput = {
    where?: ReturnPickupWhereInput
    data: XOR<ReturnPickupUpdateWithoutTracking_updatesInput, ReturnPickupUncheckedUpdateWithoutTracking_updatesInput>
  }

  export type ReturnPickupUpdateWithoutTracking_updatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    return_number?: StringFieldUpdateOperationsInput | string
    order_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    status?: EnumReturnPickupStatusFieldUpdateOperationsInput | $Enums.ReturnPickupStatus
    courier_code?: EnumCourierCodeFieldUpdateOperationsInput | $Enums.CourierCode
    return_tracking_number?: NullableStringFieldUpdateOperationsInput | string | null
    pickup_address?: JsonNullValueInput | InputJsonValue
    scheduled_pickup_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    picked_up_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    received_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pop_signature?: NullableStringFieldUpdateOperationsInput | string | null
    pop_received_by?: NullableStringFieldUpdateOperationsInput | string | null
    cancellation_reason?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    warehouse?: WarehouseUpdateOneRequiredWithoutReturn_pickupsNestedInput
    items?: ReturnItemUpdateManyWithoutReturn_pickupNestedInput
  }

  export type ReturnPickupUncheckedUpdateWithoutTracking_updatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    return_number?: StringFieldUpdateOperationsInput | string
    order_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    warehouse_id?: StringFieldUpdateOperationsInput | string
    status?: EnumReturnPickupStatusFieldUpdateOperationsInput | $Enums.ReturnPickupStatus
    courier_code?: EnumCourierCodeFieldUpdateOperationsInput | $Enums.CourierCode
    return_tracking_number?: NullableStringFieldUpdateOperationsInput | string | null
    pickup_address?: JsonNullValueInput | InputJsonValue
    scheduled_pickup_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    picked_up_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    received_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pop_signature?: NullableStringFieldUpdateOperationsInput | string | null
    pop_received_by?: NullableStringFieldUpdateOperationsInput | string | null
    cancellation_reason?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: ReturnItemUncheckedUpdateManyWithoutReturn_pickupNestedInput
  }

  export type InventoryItemCreateManyWarehouseInput = {
    id?: string
    product_id: string
    sku: string
    seller_id?: string | null
    quantity_on_hand?: number
    quantity_reserved?: number
    quantity_allocated?: number
    safety_stock?: number
    reorder_threshold?: number
    version?: number
    is_active?: boolean
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ShipmentCreateManyWarehouseInput = {
    id?: string
    shipment_number: string
    order_id: string
    user_id: string
    reservation_id?: string | null
    status?: $Enums.ShipmentStatus
    courier_code?: $Enums.CourierCode
    tracking_number?: string | null
    shipping_address: JsonNullValueInput | InputJsonValue
    label_url?: string | null
    manifest_id?: string | null
    estimated_delivery?: Date | string | null
    dispatched_at?: Date | string | null
    delivered_at?: Date | string | null
    delivery_notes?: string | null
    pod_signature?: string | null
    pod_received_by?: string | null
    pod_received_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ReturnPickupCreateManyWarehouseInput = {
    id?: string
    return_number: string
    order_id: string
    user_id: string
    status?: $Enums.ReturnPickupStatus
    courier_code?: $Enums.CourierCode
    return_tracking_number?: string | null
    pickup_address: JsonNullValueInput | InputJsonValue
    scheduled_pickup_date?: Date | string | null
    picked_up_at?: Date | string | null
    received_at?: Date | string | null
    completed_at?: Date | string | null
    pop_signature?: string | null
    pop_received_by?: string | null
    cancellation_reason?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type InventoryItemUpdateWithoutWarehouseInput = {
    id?: StringFieldUpdateOperationsInput | string
    product_id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    seller_id?: NullableStringFieldUpdateOperationsInput | string | null
    quantity_on_hand?: IntFieldUpdateOperationsInput | number
    quantity_reserved?: IntFieldUpdateOperationsInput | number
    quantity_allocated?: IntFieldUpdateOperationsInput | number
    safety_stock?: IntFieldUpdateOperationsInput | number
    reorder_threshold?: IntFieldUpdateOperationsInput | number
    version?: IntFieldUpdateOperationsInput | number
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reservation_items?: ReservationItemUpdateManyWithoutInventory_itemNestedInput
  }

  export type InventoryItemUncheckedUpdateWithoutWarehouseInput = {
    id?: StringFieldUpdateOperationsInput | string
    product_id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    seller_id?: NullableStringFieldUpdateOperationsInput | string | null
    quantity_on_hand?: IntFieldUpdateOperationsInput | number
    quantity_reserved?: IntFieldUpdateOperationsInput | number
    quantity_allocated?: IntFieldUpdateOperationsInput | number
    safety_stock?: IntFieldUpdateOperationsInput | number
    reorder_threshold?: IntFieldUpdateOperationsInput | number
    version?: IntFieldUpdateOperationsInput | number
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reservation_items?: ReservationItemUncheckedUpdateManyWithoutInventory_itemNestedInput
  }

  export type InventoryItemUncheckedUpdateManyWithoutWarehouseInput = {
    id?: StringFieldUpdateOperationsInput | string
    product_id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    seller_id?: NullableStringFieldUpdateOperationsInput | string | null
    quantity_on_hand?: IntFieldUpdateOperationsInput | number
    quantity_reserved?: IntFieldUpdateOperationsInput | number
    quantity_allocated?: IntFieldUpdateOperationsInput | number
    safety_stock?: IntFieldUpdateOperationsInput | number
    reorder_threshold?: IntFieldUpdateOperationsInput | number
    version?: IntFieldUpdateOperationsInput | number
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShipmentUpdateWithoutWarehouseInput = {
    id?: StringFieldUpdateOperationsInput | string
    shipment_number?: StringFieldUpdateOperationsInput | string
    order_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    reservation_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumShipmentStatusFieldUpdateOperationsInput | $Enums.ShipmentStatus
    courier_code?: EnumCourierCodeFieldUpdateOperationsInput | $Enums.CourierCode
    tracking_number?: NullableStringFieldUpdateOperationsInput | string | null
    shipping_address?: JsonNullValueInput | InputJsonValue
    label_url?: NullableStringFieldUpdateOperationsInput | string | null
    manifest_id?: NullableStringFieldUpdateOperationsInput | string | null
    estimated_delivery?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dispatched_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    delivered_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    delivery_notes?: NullableStringFieldUpdateOperationsInput | string | null
    pod_signature?: NullableStringFieldUpdateOperationsInput | string | null
    pod_received_by?: NullableStringFieldUpdateOperationsInput | string | null
    pod_received_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: ShipmentItemUpdateManyWithoutShipmentNestedInput
    tracking_updates?: TrackingUpdateUpdateManyWithoutShipmentNestedInput
  }

  export type ShipmentUncheckedUpdateWithoutWarehouseInput = {
    id?: StringFieldUpdateOperationsInput | string
    shipment_number?: StringFieldUpdateOperationsInput | string
    order_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    reservation_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumShipmentStatusFieldUpdateOperationsInput | $Enums.ShipmentStatus
    courier_code?: EnumCourierCodeFieldUpdateOperationsInput | $Enums.CourierCode
    tracking_number?: NullableStringFieldUpdateOperationsInput | string | null
    shipping_address?: JsonNullValueInput | InputJsonValue
    label_url?: NullableStringFieldUpdateOperationsInput | string | null
    manifest_id?: NullableStringFieldUpdateOperationsInput | string | null
    estimated_delivery?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dispatched_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    delivered_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    delivery_notes?: NullableStringFieldUpdateOperationsInput | string | null
    pod_signature?: NullableStringFieldUpdateOperationsInput | string | null
    pod_received_by?: NullableStringFieldUpdateOperationsInput | string | null
    pod_received_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: ShipmentItemUncheckedUpdateManyWithoutShipmentNestedInput
    tracking_updates?: TrackingUpdateUncheckedUpdateManyWithoutShipmentNestedInput
  }

  export type ShipmentUncheckedUpdateManyWithoutWarehouseInput = {
    id?: StringFieldUpdateOperationsInput | string
    shipment_number?: StringFieldUpdateOperationsInput | string
    order_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    reservation_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumShipmentStatusFieldUpdateOperationsInput | $Enums.ShipmentStatus
    courier_code?: EnumCourierCodeFieldUpdateOperationsInput | $Enums.CourierCode
    tracking_number?: NullableStringFieldUpdateOperationsInput | string | null
    shipping_address?: JsonNullValueInput | InputJsonValue
    label_url?: NullableStringFieldUpdateOperationsInput | string | null
    manifest_id?: NullableStringFieldUpdateOperationsInput | string | null
    estimated_delivery?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dispatched_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    delivered_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    delivery_notes?: NullableStringFieldUpdateOperationsInput | string | null
    pod_signature?: NullableStringFieldUpdateOperationsInput | string | null
    pod_received_by?: NullableStringFieldUpdateOperationsInput | string | null
    pod_received_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReturnPickupUpdateWithoutWarehouseInput = {
    id?: StringFieldUpdateOperationsInput | string
    return_number?: StringFieldUpdateOperationsInput | string
    order_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    status?: EnumReturnPickupStatusFieldUpdateOperationsInput | $Enums.ReturnPickupStatus
    courier_code?: EnumCourierCodeFieldUpdateOperationsInput | $Enums.CourierCode
    return_tracking_number?: NullableStringFieldUpdateOperationsInput | string | null
    pickup_address?: JsonNullValueInput | InputJsonValue
    scheduled_pickup_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    picked_up_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    received_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pop_signature?: NullableStringFieldUpdateOperationsInput | string | null
    pop_received_by?: NullableStringFieldUpdateOperationsInput | string | null
    cancellation_reason?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: ReturnItemUpdateManyWithoutReturn_pickupNestedInput
    tracking_updates?: ReturnTrackingUpdateUpdateManyWithoutReturn_pickupNestedInput
  }

  export type ReturnPickupUncheckedUpdateWithoutWarehouseInput = {
    id?: StringFieldUpdateOperationsInput | string
    return_number?: StringFieldUpdateOperationsInput | string
    order_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    status?: EnumReturnPickupStatusFieldUpdateOperationsInput | $Enums.ReturnPickupStatus
    courier_code?: EnumCourierCodeFieldUpdateOperationsInput | $Enums.CourierCode
    return_tracking_number?: NullableStringFieldUpdateOperationsInput | string | null
    pickup_address?: JsonNullValueInput | InputJsonValue
    scheduled_pickup_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    picked_up_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    received_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pop_signature?: NullableStringFieldUpdateOperationsInput | string | null
    pop_received_by?: NullableStringFieldUpdateOperationsInput | string | null
    cancellation_reason?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: ReturnItemUncheckedUpdateManyWithoutReturn_pickupNestedInput
    tracking_updates?: ReturnTrackingUpdateUncheckedUpdateManyWithoutReturn_pickupNestedInput
  }

  export type ReturnPickupUncheckedUpdateManyWithoutWarehouseInput = {
    id?: StringFieldUpdateOperationsInput | string
    return_number?: StringFieldUpdateOperationsInput | string
    order_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    status?: EnumReturnPickupStatusFieldUpdateOperationsInput | $Enums.ReturnPickupStatus
    courier_code?: EnumCourierCodeFieldUpdateOperationsInput | $Enums.CourierCode
    return_tracking_number?: NullableStringFieldUpdateOperationsInput | string | null
    pickup_address?: JsonNullValueInput | InputJsonValue
    scheduled_pickup_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    picked_up_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    received_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pop_signature?: NullableStringFieldUpdateOperationsInput | string | null
    pop_received_by?: NullableStringFieldUpdateOperationsInput | string | null
    cancellation_reason?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReservationItemCreateManyInventory_itemInput = {
    id?: string
    reservation_id: string
    product_id: string
    sku: string
    quantity: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ReservationItemUpdateWithoutInventory_itemInput = {
    id?: StringFieldUpdateOperationsInput | string
    product_id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reservation?: InventoryReservationUpdateOneRequiredWithoutItemsNestedInput
  }

  export type ReservationItemUncheckedUpdateWithoutInventory_itemInput = {
    id?: StringFieldUpdateOperationsInput | string
    reservation_id?: StringFieldUpdateOperationsInput | string
    product_id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReservationItemUncheckedUpdateManyWithoutInventory_itemInput = {
    id?: StringFieldUpdateOperationsInput | string
    reservation_id?: StringFieldUpdateOperationsInput | string
    product_id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReservationItemCreateManyReservationInput = {
    id?: string
    inventory_item_id: string
    product_id: string
    sku: string
    quantity: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ReservationItemUpdateWithoutReservationInput = {
    id?: StringFieldUpdateOperationsInput | string
    product_id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    inventory_item?: InventoryItemUpdateOneRequiredWithoutReservation_itemsNestedInput
  }

  export type ReservationItemUncheckedUpdateWithoutReservationInput = {
    id?: StringFieldUpdateOperationsInput | string
    inventory_item_id?: StringFieldUpdateOperationsInput | string
    product_id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReservationItemUncheckedUpdateManyWithoutReservationInput = {
    id?: StringFieldUpdateOperationsInput | string
    inventory_item_id?: StringFieldUpdateOperationsInput | string
    product_id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShipmentItemCreateManyShipmentInput = {
    id?: string
    product_id: string
    sku: string
    seller_id?: string | null
    quantity: number
    unit_price?: Decimal | DecimalJsLike | number | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type TrackingUpdateCreateManyShipmentInput = {
    id?: string
    status: $Enums.ShipmentStatus
    location?: string | null
    description: string
    recorded_by?: string | null
    recorded_at?: Date | string
  }

  export type ShipmentItemUpdateWithoutShipmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    product_id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    seller_id?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    unit_price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShipmentItemUncheckedUpdateWithoutShipmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    product_id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    seller_id?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    unit_price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShipmentItemUncheckedUpdateManyWithoutShipmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    product_id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    seller_id?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    unit_price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrackingUpdateUpdateWithoutShipmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumShipmentStatusFieldUpdateOperationsInput | $Enums.ShipmentStatus
    location?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    recorded_by?: NullableStringFieldUpdateOperationsInput | string | null
    recorded_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrackingUpdateUncheckedUpdateWithoutShipmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumShipmentStatusFieldUpdateOperationsInput | $Enums.ShipmentStatus
    location?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    recorded_by?: NullableStringFieldUpdateOperationsInput | string | null
    recorded_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrackingUpdateUncheckedUpdateManyWithoutShipmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumShipmentStatusFieldUpdateOperationsInput | $Enums.ShipmentStatus
    location?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    recorded_by?: NullableStringFieldUpdateOperationsInput | string | null
    recorded_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReturnItemCreateManyReturn_pickupInput = {
    id?: string
    product_id: string
    sku: string
    seller_id?: string | null
    quantity: number
    reason: string
    inspection_grade?: $Enums.InspectionGrade | null
    inspection_notes?: string | null
    is_restocked?: boolean
    restocked_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ReturnTrackingUpdateCreateManyReturn_pickupInput = {
    id?: string
    status: $Enums.ReturnPickupStatus
    location?: string | null
    description: string
    recorded_by?: string | null
    recorded_at?: Date | string
  }

  export type ReturnItemUpdateWithoutReturn_pickupInput = {
    id?: StringFieldUpdateOperationsInput | string
    product_id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    seller_id?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    reason?: StringFieldUpdateOperationsInput | string
    inspection_grade?: NullableEnumInspectionGradeFieldUpdateOperationsInput | $Enums.InspectionGrade | null
    inspection_notes?: NullableStringFieldUpdateOperationsInput | string | null
    is_restocked?: BoolFieldUpdateOperationsInput | boolean
    restocked_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReturnItemUncheckedUpdateWithoutReturn_pickupInput = {
    id?: StringFieldUpdateOperationsInput | string
    product_id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    seller_id?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    reason?: StringFieldUpdateOperationsInput | string
    inspection_grade?: NullableEnumInspectionGradeFieldUpdateOperationsInput | $Enums.InspectionGrade | null
    inspection_notes?: NullableStringFieldUpdateOperationsInput | string | null
    is_restocked?: BoolFieldUpdateOperationsInput | boolean
    restocked_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReturnItemUncheckedUpdateManyWithoutReturn_pickupInput = {
    id?: StringFieldUpdateOperationsInput | string
    product_id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    seller_id?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    reason?: StringFieldUpdateOperationsInput | string
    inspection_grade?: NullableEnumInspectionGradeFieldUpdateOperationsInput | $Enums.InspectionGrade | null
    inspection_notes?: NullableStringFieldUpdateOperationsInput | string | null
    is_restocked?: BoolFieldUpdateOperationsInput | boolean
    restocked_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReturnTrackingUpdateUpdateWithoutReturn_pickupInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumReturnPickupStatusFieldUpdateOperationsInput | $Enums.ReturnPickupStatus
    location?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    recorded_by?: NullableStringFieldUpdateOperationsInput | string | null
    recorded_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReturnTrackingUpdateUncheckedUpdateWithoutReturn_pickupInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumReturnPickupStatusFieldUpdateOperationsInput | $Enums.ReturnPickupStatus
    location?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    recorded_by?: NullableStringFieldUpdateOperationsInput | string | null
    recorded_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReturnTrackingUpdateUncheckedUpdateManyWithoutReturn_pickupInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumReturnPickupStatusFieldUpdateOperationsInput | $Enums.ReturnPickupStatus
    location?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    recorded_by?: NullableStringFieldUpdateOperationsInput | string | null
    recorded_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use WarehouseCountOutputTypeDefaultArgs instead
     */
    export type WarehouseCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = WarehouseCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use InventoryItemCountOutputTypeDefaultArgs instead
     */
    export type InventoryItemCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InventoryItemCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use InventoryReservationCountOutputTypeDefaultArgs instead
     */
    export type InventoryReservationCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InventoryReservationCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ShipmentCountOutputTypeDefaultArgs instead
     */
    export type ShipmentCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ShipmentCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ReturnPickupCountOutputTypeDefaultArgs instead
     */
    export type ReturnPickupCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ReturnPickupCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use WarehouseDefaultArgs instead
     */
    export type WarehouseArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = WarehouseDefaultArgs<ExtArgs>
    /**
     * @deprecated Use InventoryItemDefaultArgs instead
     */
    export type InventoryItemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InventoryItemDefaultArgs<ExtArgs>
    /**
     * @deprecated Use InventoryReservationDefaultArgs instead
     */
    export type InventoryReservationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InventoryReservationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ReservationItemDefaultArgs instead
     */
    export type ReservationItemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ReservationItemDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ShipmentDefaultArgs instead
     */
    export type ShipmentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ShipmentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ShipmentItemDefaultArgs instead
     */
    export type ShipmentItemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ShipmentItemDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TrackingUpdateDefaultArgs instead
     */
    export type TrackingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TrackingUpdateDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ReturnPickupDefaultArgs instead
     */
    export type ReturnPickupArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ReturnPickupDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ReturnItemDefaultArgs instead
     */
    export type ReturnItemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ReturnItemDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ReturnTrackingUpdateDefaultArgs instead
     */
    export type ReturnTrackingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ReturnTrackingUpdateDefaultArgs<ExtArgs>
    /**
     * @deprecated Use FulfillmentOutboxDefaultArgs instead
     */
    export type FulfillmentOutboxArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = FulfillmentOutboxDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProcessedEventDefaultArgs instead
     */
    export type ProcessedEventArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProcessedEventDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}