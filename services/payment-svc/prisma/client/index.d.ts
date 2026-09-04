
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
 * Model Payment
 * 
 */
export type Payment = $Result.DefaultSelection<Prisma.$PaymentPayload>
/**
 * Model PaymentRefund
 * 
 */
export type PaymentRefund = $Result.DefaultSelection<Prisma.$PaymentRefundPayload>
/**
 * Model PaymentOutbox
 * 
 */
export type PaymentOutbox = $Result.DefaultSelection<Prisma.$PaymentOutboxPayload>
/**
 * Model ProcessedEvent
 * 
 */
export type ProcessedEvent = $Result.DefaultSelection<Prisma.$ProcessedEventPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const PaymentMethodType: {
  RAZORPAY: 'RAZORPAY',
  COD: 'COD'
};

export type PaymentMethodType = (typeof PaymentMethodType)[keyof typeof PaymentMethodType]


export const PaymentStatus: {
  INITIATED: 'INITIATED',
  AUTHORIZED: 'AUTHORIZED',
  CAPTURED: 'CAPTURED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
  COD_PENDING: 'COD_PENDING',
  COD_COLLECTED: 'COD_COLLECTED'
};

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus]


export const RefundStatus: {
  REQUESTED: 'REQUESTED',
  PROCESSING: 'PROCESSING',
  PROCESSED: 'PROCESSED',
  FAILED: 'FAILED'
};

export type RefundStatus = (typeof RefundStatus)[keyof typeof RefundStatus]


export const OutboxStatus: {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  PROCESSED: 'PROCESSED',
  PUBLISHED: 'PUBLISHED',
  FAILED: 'FAILED'
};

export type OutboxStatus = (typeof OutboxStatus)[keyof typeof OutboxStatus]

}

export type PaymentMethodType = $Enums.PaymentMethodType

export const PaymentMethodType: typeof $Enums.PaymentMethodType

export type PaymentStatus = $Enums.PaymentStatus

export const PaymentStatus: typeof $Enums.PaymentStatus

export type RefundStatus = $Enums.RefundStatus

export const RefundStatus: typeof $Enums.RefundStatus

export type OutboxStatus = $Enums.OutboxStatus

export const OutboxStatus: typeof $Enums.OutboxStatus

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Payments
 * const payments = await prisma.payment.findMany()
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
   * // Fetch zero or more Payments
   * const payments = await prisma.payment.findMany()
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
   * `prisma.payment`: Exposes CRUD operations for the **Payment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Payments
    * const payments = await prisma.payment.findMany()
    * ```
    */
  get payment(): Prisma.PaymentDelegate<ExtArgs>;

  /**
   * `prisma.paymentRefund`: Exposes CRUD operations for the **PaymentRefund** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PaymentRefunds
    * const paymentRefunds = await prisma.paymentRefund.findMany()
    * ```
    */
  get paymentRefund(): Prisma.PaymentRefundDelegate<ExtArgs>;

  /**
   * `prisma.paymentOutbox`: Exposes CRUD operations for the **PaymentOutbox** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PaymentOutboxes
    * const paymentOutboxes = await prisma.paymentOutbox.findMany()
    * ```
    */
  get paymentOutbox(): Prisma.PaymentOutboxDelegate<ExtArgs>;

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
    Payment: 'Payment',
    PaymentRefund: 'PaymentRefund',
    PaymentOutbox: 'PaymentOutbox',
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
      modelProps: "payment" | "paymentRefund" | "paymentOutbox" | "processedEvent"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Payment: {
        payload: Prisma.$PaymentPayload<ExtArgs>
        fields: Prisma.PaymentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PaymentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PaymentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          findFirst: {
            args: Prisma.PaymentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PaymentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          findMany: {
            args: Prisma.PaymentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          create: {
            args: Prisma.PaymentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          createMany: {
            args: Prisma.PaymentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PaymentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          delete: {
            args: Prisma.PaymentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          update: {
            args: Prisma.PaymentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          deleteMany: {
            args: Prisma.PaymentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PaymentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PaymentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          aggregate: {
            args: Prisma.PaymentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayment>
          }
          groupBy: {
            args: Prisma.PaymentGroupByArgs<ExtArgs>
            result: $Utils.Optional<PaymentGroupByOutputType>[]
          }
          count: {
            args: Prisma.PaymentCountArgs<ExtArgs>
            result: $Utils.Optional<PaymentCountAggregateOutputType> | number
          }
        }
      }
      PaymentRefund: {
        payload: Prisma.$PaymentRefundPayload<ExtArgs>
        fields: Prisma.PaymentRefundFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PaymentRefundFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentRefundPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PaymentRefundFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentRefundPayload>
          }
          findFirst: {
            args: Prisma.PaymentRefundFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentRefundPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PaymentRefundFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentRefundPayload>
          }
          findMany: {
            args: Prisma.PaymentRefundFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentRefundPayload>[]
          }
          create: {
            args: Prisma.PaymentRefundCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentRefundPayload>
          }
          createMany: {
            args: Prisma.PaymentRefundCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PaymentRefundCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentRefundPayload>[]
          }
          delete: {
            args: Prisma.PaymentRefundDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentRefundPayload>
          }
          update: {
            args: Prisma.PaymentRefundUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentRefundPayload>
          }
          deleteMany: {
            args: Prisma.PaymentRefundDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PaymentRefundUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PaymentRefundUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentRefundPayload>
          }
          aggregate: {
            args: Prisma.PaymentRefundAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePaymentRefund>
          }
          groupBy: {
            args: Prisma.PaymentRefundGroupByArgs<ExtArgs>
            result: $Utils.Optional<PaymentRefundGroupByOutputType>[]
          }
          count: {
            args: Prisma.PaymentRefundCountArgs<ExtArgs>
            result: $Utils.Optional<PaymentRefundCountAggregateOutputType> | number
          }
        }
      }
      PaymentOutbox: {
        payload: Prisma.$PaymentOutboxPayload<ExtArgs>
        fields: Prisma.PaymentOutboxFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PaymentOutboxFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentOutboxPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PaymentOutboxFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentOutboxPayload>
          }
          findFirst: {
            args: Prisma.PaymentOutboxFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentOutboxPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PaymentOutboxFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentOutboxPayload>
          }
          findMany: {
            args: Prisma.PaymentOutboxFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentOutboxPayload>[]
          }
          create: {
            args: Prisma.PaymentOutboxCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentOutboxPayload>
          }
          createMany: {
            args: Prisma.PaymentOutboxCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PaymentOutboxCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentOutboxPayload>[]
          }
          delete: {
            args: Prisma.PaymentOutboxDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentOutboxPayload>
          }
          update: {
            args: Prisma.PaymentOutboxUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentOutboxPayload>
          }
          deleteMany: {
            args: Prisma.PaymentOutboxDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PaymentOutboxUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PaymentOutboxUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentOutboxPayload>
          }
          aggregate: {
            args: Prisma.PaymentOutboxAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePaymentOutbox>
          }
          groupBy: {
            args: Prisma.PaymentOutboxGroupByArgs<ExtArgs>
            result: $Utils.Optional<PaymentOutboxGroupByOutputType>[]
          }
          count: {
            args: Prisma.PaymentOutboxCountArgs<ExtArgs>
            result: $Utils.Optional<PaymentOutboxCountAggregateOutputType> | number
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
   * Count Type PaymentCountOutputType
   */

  export type PaymentCountOutputType = {
    refunds: number
  }

  export type PaymentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    refunds?: boolean | PaymentCountOutputTypeCountRefundsArgs
  }

  // Custom InputTypes
  /**
   * PaymentCountOutputType without action
   */
  export type PaymentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentCountOutputType
     */
    select?: PaymentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PaymentCountOutputType without action
   */
  export type PaymentCountOutputTypeCountRefundsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentRefundWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Payment
   */

  export type AggregatePayment = {
    _count: PaymentCountAggregateOutputType | null
    _avg: PaymentAvgAggregateOutputType | null
    _sum: PaymentSumAggregateOutputType | null
    _min: PaymentMinAggregateOutputType | null
    _max: PaymentMaxAggregateOutputType | null
  }

  export type PaymentAvgAggregateOutputType = {
    amount: Decimal | null
  }

  export type PaymentSumAggregateOutputType = {
    amount: Decimal | null
  }

  export type PaymentMinAggregateOutputType = {
    id: string | null
    user_id: string | null
    order_id: string | null
    payment_method: $Enums.PaymentMethodType | null
    status: $Enums.PaymentStatus | null
    amount: Decimal | null
    currency: string | null
    razorpay_order_id: string | null
    razorpay_payment_id: string | null
    razorpay_signature: string | null
    failure_reason: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type PaymentMaxAggregateOutputType = {
    id: string | null
    user_id: string | null
    order_id: string | null
    payment_method: $Enums.PaymentMethodType | null
    status: $Enums.PaymentStatus | null
    amount: Decimal | null
    currency: string | null
    razorpay_order_id: string | null
    razorpay_payment_id: string | null
    razorpay_signature: string | null
    failure_reason: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type PaymentCountAggregateOutputType = {
    id: number
    user_id: number
    order_id: number
    payment_method: number
    status: number
    amount: number
    currency: number
    razorpay_order_id: number
    razorpay_payment_id: number
    razorpay_signature: number
    failure_reason: number
    metadata: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type PaymentAvgAggregateInputType = {
    amount?: true
  }

  export type PaymentSumAggregateInputType = {
    amount?: true
  }

  export type PaymentMinAggregateInputType = {
    id?: true
    user_id?: true
    order_id?: true
    payment_method?: true
    status?: true
    amount?: true
    currency?: true
    razorpay_order_id?: true
    razorpay_payment_id?: true
    razorpay_signature?: true
    failure_reason?: true
    created_at?: true
    updated_at?: true
  }

  export type PaymentMaxAggregateInputType = {
    id?: true
    user_id?: true
    order_id?: true
    payment_method?: true
    status?: true
    amount?: true
    currency?: true
    razorpay_order_id?: true
    razorpay_payment_id?: true
    razorpay_signature?: true
    failure_reason?: true
    created_at?: true
    updated_at?: true
  }

  export type PaymentCountAggregateInputType = {
    id?: true
    user_id?: true
    order_id?: true
    payment_method?: true
    status?: true
    amount?: true
    currency?: true
    razorpay_order_id?: true
    razorpay_payment_id?: true
    razorpay_signature?: true
    failure_reason?: true
    metadata?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type PaymentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payment to aggregate.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Payments
    **/
    _count?: true | PaymentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PaymentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PaymentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PaymentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PaymentMaxAggregateInputType
  }

  export type GetPaymentAggregateType<T extends PaymentAggregateArgs> = {
        [P in keyof T & keyof AggregatePayment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayment[P]>
      : GetScalarType<T[P], AggregatePayment[P]>
  }




  export type PaymentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
    orderBy?: PaymentOrderByWithAggregationInput | PaymentOrderByWithAggregationInput[]
    by: PaymentScalarFieldEnum[] | PaymentScalarFieldEnum
    having?: PaymentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PaymentCountAggregateInputType | true
    _avg?: PaymentAvgAggregateInputType
    _sum?: PaymentSumAggregateInputType
    _min?: PaymentMinAggregateInputType
    _max?: PaymentMaxAggregateInputType
  }

  export type PaymentGroupByOutputType = {
    id: string
    user_id: string
    order_id: string | null
    payment_method: $Enums.PaymentMethodType
    status: $Enums.PaymentStatus
    amount: Decimal
    currency: string
    razorpay_order_id: string | null
    razorpay_payment_id: string | null
    razorpay_signature: string | null
    failure_reason: string | null
    metadata: JsonValue | null
    created_at: Date
    updated_at: Date
    _count: PaymentCountAggregateOutputType | null
    _avg: PaymentAvgAggregateOutputType | null
    _sum: PaymentSumAggregateOutputType | null
    _min: PaymentMinAggregateOutputType | null
    _max: PaymentMaxAggregateOutputType | null
  }

  type GetPaymentGroupByPayload<T extends PaymentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PaymentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PaymentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PaymentGroupByOutputType[P]>
            : GetScalarType<T[P], PaymentGroupByOutputType[P]>
        }
      >
    >


  export type PaymentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    order_id?: boolean
    payment_method?: boolean
    status?: boolean
    amount?: boolean
    currency?: boolean
    razorpay_order_id?: boolean
    razorpay_payment_id?: boolean
    razorpay_signature?: boolean
    failure_reason?: boolean
    metadata?: boolean
    created_at?: boolean
    updated_at?: boolean
    refunds?: boolean | Payment$refundsArgs<ExtArgs>
    _count?: boolean | PaymentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    order_id?: boolean
    payment_method?: boolean
    status?: boolean
    amount?: boolean
    currency?: boolean
    razorpay_order_id?: boolean
    razorpay_payment_id?: boolean
    razorpay_signature?: boolean
    failure_reason?: boolean
    metadata?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectScalar = {
    id?: boolean
    user_id?: boolean
    order_id?: boolean
    payment_method?: boolean
    status?: boolean
    amount?: boolean
    currency?: boolean
    razorpay_order_id?: boolean
    razorpay_payment_id?: boolean
    razorpay_signature?: boolean
    failure_reason?: boolean
    metadata?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type PaymentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    refunds?: boolean | Payment$refundsArgs<ExtArgs>
    _count?: boolean | PaymentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PaymentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PaymentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Payment"
    objects: {
      refunds: Prisma.$PaymentRefundPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      user_id: string
      order_id: string | null
      payment_method: $Enums.PaymentMethodType
      status: $Enums.PaymentStatus
      amount: Prisma.Decimal
      currency: string
      razorpay_order_id: string | null
      razorpay_payment_id: string | null
      razorpay_signature: string | null
      failure_reason: string | null
      metadata: Prisma.JsonValue | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["payment"]>
    composites: {}
  }

  type PaymentGetPayload<S extends boolean | null | undefined | PaymentDefaultArgs> = $Result.GetResult<Prisma.$PaymentPayload, S>

  type PaymentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PaymentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PaymentCountAggregateInputType | true
    }

  export interface PaymentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Payment'], meta: { name: 'Payment' } }
    /**
     * Find zero or one Payment that matches the filter.
     * @param {PaymentFindUniqueArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PaymentFindUniqueArgs>(args: SelectSubset<T, PaymentFindUniqueArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Payment that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PaymentFindUniqueOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PaymentFindUniqueOrThrowArgs>(args: SelectSubset<T, PaymentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Payment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PaymentFindFirstArgs>(args?: SelectSubset<T, PaymentFindFirstArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Payment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PaymentFindFirstOrThrowArgs>(args?: SelectSubset<T, PaymentFindFirstOrThrowArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Payments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Payments
     * const payments = await prisma.payment.findMany()
     * 
     * // Get first 10 Payments
     * const payments = await prisma.payment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const paymentWithIdOnly = await prisma.payment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PaymentFindManyArgs>(args?: SelectSubset<T, PaymentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Payment.
     * @param {PaymentCreateArgs} args - Arguments to create a Payment.
     * @example
     * // Create one Payment
     * const Payment = await prisma.payment.create({
     *   data: {
     *     // ... data to create a Payment
     *   }
     * })
     * 
     */
    create<T extends PaymentCreateArgs>(args: SelectSubset<T, PaymentCreateArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Payments.
     * @param {PaymentCreateManyArgs} args - Arguments to create many Payments.
     * @example
     * // Create many Payments
     * const payment = await prisma.payment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PaymentCreateManyArgs>(args?: SelectSubset<T, PaymentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Payments and returns the data saved in the database.
     * @param {PaymentCreateManyAndReturnArgs} args - Arguments to create many Payments.
     * @example
     * // Create many Payments
     * const payment = await prisma.payment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Payments and only return the `id`
     * const paymentWithIdOnly = await prisma.payment.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PaymentCreateManyAndReturnArgs>(args?: SelectSubset<T, PaymentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Payment.
     * @param {PaymentDeleteArgs} args - Arguments to delete one Payment.
     * @example
     * // Delete one Payment
     * const Payment = await prisma.payment.delete({
     *   where: {
     *     // ... filter to delete one Payment
     *   }
     * })
     * 
     */
    delete<T extends PaymentDeleteArgs>(args: SelectSubset<T, PaymentDeleteArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Payment.
     * @param {PaymentUpdateArgs} args - Arguments to update one Payment.
     * @example
     * // Update one Payment
     * const payment = await prisma.payment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PaymentUpdateArgs>(args: SelectSubset<T, PaymentUpdateArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Payments.
     * @param {PaymentDeleteManyArgs} args - Arguments to filter Payments to delete.
     * @example
     * // Delete a few Payments
     * const { count } = await prisma.payment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PaymentDeleteManyArgs>(args?: SelectSubset<T, PaymentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Payments
     * const payment = await prisma.payment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PaymentUpdateManyArgs>(args: SelectSubset<T, PaymentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Payment.
     * @param {PaymentUpsertArgs} args - Arguments to update or create a Payment.
     * @example
     * // Update or create a Payment
     * const payment = await prisma.payment.upsert({
     *   create: {
     *     // ... data to create a Payment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Payment we want to update
     *   }
     * })
     */
    upsert<T extends PaymentUpsertArgs>(args: SelectSubset<T, PaymentUpsertArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentCountArgs} args - Arguments to filter Payments to count.
     * @example
     * // Count the number of Payments
     * const count = await prisma.payment.count({
     *   where: {
     *     // ... the filter for the Payments we want to count
     *   }
     * })
    **/
    count<T extends PaymentCountArgs>(
      args?: Subset<T, PaymentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PaymentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PaymentAggregateArgs>(args: Subset<T, PaymentAggregateArgs>): Prisma.PrismaPromise<GetPaymentAggregateType<T>>

    /**
     * Group by Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentGroupByArgs} args - Group by arguments.
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
      T extends PaymentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PaymentGroupByArgs['orderBy'] }
        : { orderBy?: PaymentGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PaymentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaymentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Payment model
   */
  readonly fields: PaymentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Payment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PaymentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    refunds<T extends Payment$refundsArgs<ExtArgs> = {}>(args?: Subset<T, Payment$refundsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentRefundPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Payment model
   */ 
  interface PaymentFieldRefs {
    readonly id: FieldRef<"Payment", 'String'>
    readonly user_id: FieldRef<"Payment", 'String'>
    readonly order_id: FieldRef<"Payment", 'String'>
    readonly payment_method: FieldRef<"Payment", 'PaymentMethodType'>
    readonly status: FieldRef<"Payment", 'PaymentStatus'>
    readonly amount: FieldRef<"Payment", 'Decimal'>
    readonly currency: FieldRef<"Payment", 'String'>
    readonly razorpay_order_id: FieldRef<"Payment", 'String'>
    readonly razorpay_payment_id: FieldRef<"Payment", 'String'>
    readonly razorpay_signature: FieldRef<"Payment", 'String'>
    readonly failure_reason: FieldRef<"Payment", 'String'>
    readonly metadata: FieldRef<"Payment", 'Json'>
    readonly created_at: FieldRef<"Payment", 'DateTime'>
    readonly updated_at: FieldRef<"Payment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Payment findUnique
   */
  export type PaymentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment findUniqueOrThrow
   */
  export type PaymentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment findFirst
   */
  export type PaymentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment findFirstOrThrow
   */
  export type PaymentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment findMany
   */
  export type PaymentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payments to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment create
   */
  export type PaymentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The data needed to create a Payment.
     */
    data: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>
  }

  /**
   * Payment createMany
   */
  export type PaymentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Payments.
     */
    data: PaymentCreateManyInput | PaymentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Payment createManyAndReturn
   */
  export type PaymentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Payments.
     */
    data: PaymentCreateManyInput | PaymentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Payment update
   */
  export type PaymentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The data needed to update a Payment.
     */
    data: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>
    /**
     * Choose, which Payment to update.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment updateMany
   */
  export type PaymentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Payments.
     */
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyInput>
    /**
     * Filter which Payments to update
     */
    where?: PaymentWhereInput
  }

  /**
   * Payment upsert
   */
  export type PaymentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The filter to search for the Payment to update in case it exists.
     */
    where: PaymentWhereUniqueInput
    /**
     * In case the Payment found by the `where` argument doesn't exist, create a new Payment with this data.
     */
    create: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>
    /**
     * In case the Payment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>
  }

  /**
   * Payment delete
   */
  export type PaymentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter which Payment to delete.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment deleteMany
   */
  export type PaymentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payments to delete
     */
    where?: PaymentWhereInput
  }

  /**
   * Payment.refunds
   */
  export type Payment$refundsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentRefund
     */
    select?: PaymentRefundSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentRefundInclude<ExtArgs> | null
    where?: PaymentRefundWhereInput
    orderBy?: PaymentRefundOrderByWithRelationInput | PaymentRefundOrderByWithRelationInput[]
    cursor?: PaymentRefundWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PaymentRefundScalarFieldEnum | PaymentRefundScalarFieldEnum[]
  }

  /**
   * Payment without action
   */
  export type PaymentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
  }


  /**
   * Model PaymentRefund
   */

  export type AggregatePaymentRefund = {
    _count: PaymentRefundCountAggregateOutputType | null
    _avg: PaymentRefundAvgAggregateOutputType | null
    _sum: PaymentRefundSumAggregateOutputType | null
    _min: PaymentRefundMinAggregateOutputType | null
    _max: PaymentRefundMaxAggregateOutputType | null
  }

  export type PaymentRefundAvgAggregateOutputType = {
    amount: Decimal | null
  }

  export type PaymentRefundSumAggregateOutputType = {
    amount: Decimal | null
  }

  export type PaymentRefundMinAggregateOutputType = {
    id: string | null
    payment_id: string | null
    order_id: string | null
    amount: Decimal | null
    currency: string | null
    razorpay_refund_id: string | null
    reason: string | null
    status: $Enums.RefundStatus | null
    failure_reason: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type PaymentRefundMaxAggregateOutputType = {
    id: string | null
    payment_id: string | null
    order_id: string | null
    amount: Decimal | null
    currency: string | null
    razorpay_refund_id: string | null
    reason: string | null
    status: $Enums.RefundStatus | null
    failure_reason: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type PaymentRefundCountAggregateOutputType = {
    id: number
    payment_id: number
    order_id: number
    amount: number
    currency: number
    razorpay_refund_id: number
    reason: number
    status: number
    failure_reason: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type PaymentRefundAvgAggregateInputType = {
    amount?: true
  }

  export type PaymentRefundSumAggregateInputType = {
    amount?: true
  }

  export type PaymentRefundMinAggregateInputType = {
    id?: true
    payment_id?: true
    order_id?: true
    amount?: true
    currency?: true
    razorpay_refund_id?: true
    reason?: true
    status?: true
    failure_reason?: true
    created_at?: true
    updated_at?: true
  }

  export type PaymentRefundMaxAggregateInputType = {
    id?: true
    payment_id?: true
    order_id?: true
    amount?: true
    currency?: true
    razorpay_refund_id?: true
    reason?: true
    status?: true
    failure_reason?: true
    created_at?: true
    updated_at?: true
  }

  export type PaymentRefundCountAggregateInputType = {
    id?: true
    payment_id?: true
    order_id?: true
    amount?: true
    currency?: true
    razorpay_refund_id?: true
    reason?: true
    status?: true
    failure_reason?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type PaymentRefundAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PaymentRefund to aggregate.
     */
    where?: PaymentRefundWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentRefunds to fetch.
     */
    orderBy?: PaymentRefundOrderByWithRelationInput | PaymentRefundOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PaymentRefundWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentRefunds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentRefunds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PaymentRefunds
    **/
    _count?: true | PaymentRefundCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PaymentRefundAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PaymentRefundSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PaymentRefundMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PaymentRefundMaxAggregateInputType
  }

  export type GetPaymentRefundAggregateType<T extends PaymentRefundAggregateArgs> = {
        [P in keyof T & keyof AggregatePaymentRefund]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePaymentRefund[P]>
      : GetScalarType<T[P], AggregatePaymentRefund[P]>
  }




  export type PaymentRefundGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentRefundWhereInput
    orderBy?: PaymentRefundOrderByWithAggregationInput | PaymentRefundOrderByWithAggregationInput[]
    by: PaymentRefundScalarFieldEnum[] | PaymentRefundScalarFieldEnum
    having?: PaymentRefundScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PaymentRefundCountAggregateInputType | true
    _avg?: PaymentRefundAvgAggregateInputType
    _sum?: PaymentRefundSumAggregateInputType
    _min?: PaymentRefundMinAggregateInputType
    _max?: PaymentRefundMaxAggregateInputType
  }

  export type PaymentRefundGroupByOutputType = {
    id: string
    payment_id: string
    order_id: string
    amount: Decimal
    currency: string
    razorpay_refund_id: string | null
    reason: string | null
    status: $Enums.RefundStatus
    failure_reason: string | null
    created_at: Date
    updated_at: Date
    _count: PaymentRefundCountAggregateOutputType | null
    _avg: PaymentRefundAvgAggregateOutputType | null
    _sum: PaymentRefundSumAggregateOutputType | null
    _min: PaymentRefundMinAggregateOutputType | null
    _max: PaymentRefundMaxAggregateOutputType | null
  }

  type GetPaymentRefundGroupByPayload<T extends PaymentRefundGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PaymentRefundGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PaymentRefundGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PaymentRefundGroupByOutputType[P]>
            : GetScalarType<T[P], PaymentRefundGroupByOutputType[P]>
        }
      >
    >


  export type PaymentRefundSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    payment_id?: boolean
    order_id?: boolean
    amount?: boolean
    currency?: boolean
    razorpay_refund_id?: boolean
    reason?: boolean
    status?: boolean
    failure_reason?: boolean
    created_at?: boolean
    updated_at?: boolean
    payment?: boolean | PaymentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["paymentRefund"]>

  export type PaymentRefundSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    payment_id?: boolean
    order_id?: boolean
    amount?: boolean
    currency?: boolean
    razorpay_refund_id?: boolean
    reason?: boolean
    status?: boolean
    failure_reason?: boolean
    created_at?: boolean
    updated_at?: boolean
    payment?: boolean | PaymentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["paymentRefund"]>

  export type PaymentRefundSelectScalar = {
    id?: boolean
    payment_id?: boolean
    order_id?: boolean
    amount?: boolean
    currency?: boolean
    razorpay_refund_id?: boolean
    reason?: boolean
    status?: boolean
    failure_reason?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type PaymentRefundInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    payment?: boolean | PaymentDefaultArgs<ExtArgs>
  }
  export type PaymentRefundIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    payment?: boolean | PaymentDefaultArgs<ExtArgs>
  }

  export type $PaymentRefundPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PaymentRefund"
    objects: {
      payment: Prisma.$PaymentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      payment_id: string
      order_id: string
      amount: Prisma.Decimal
      currency: string
      razorpay_refund_id: string | null
      reason: string | null
      status: $Enums.RefundStatus
      failure_reason: string | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["paymentRefund"]>
    composites: {}
  }

  type PaymentRefundGetPayload<S extends boolean | null | undefined | PaymentRefundDefaultArgs> = $Result.GetResult<Prisma.$PaymentRefundPayload, S>

  type PaymentRefundCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PaymentRefundFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PaymentRefundCountAggregateInputType | true
    }

  export interface PaymentRefundDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PaymentRefund'], meta: { name: 'PaymentRefund' } }
    /**
     * Find zero or one PaymentRefund that matches the filter.
     * @param {PaymentRefundFindUniqueArgs} args - Arguments to find a PaymentRefund
     * @example
     * // Get one PaymentRefund
     * const paymentRefund = await prisma.paymentRefund.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PaymentRefundFindUniqueArgs>(args: SelectSubset<T, PaymentRefundFindUniqueArgs<ExtArgs>>): Prisma__PaymentRefundClient<$Result.GetResult<Prisma.$PaymentRefundPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PaymentRefund that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PaymentRefundFindUniqueOrThrowArgs} args - Arguments to find a PaymentRefund
     * @example
     * // Get one PaymentRefund
     * const paymentRefund = await prisma.paymentRefund.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PaymentRefundFindUniqueOrThrowArgs>(args: SelectSubset<T, PaymentRefundFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PaymentRefundClient<$Result.GetResult<Prisma.$PaymentRefundPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PaymentRefund that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentRefundFindFirstArgs} args - Arguments to find a PaymentRefund
     * @example
     * // Get one PaymentRefund
     * const paymentRefund = await prisma.paymentRefund.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PaymentRefundFindFirstArgs>(args?: SelectSubset<T, PaymentRefundFindFirstArgs<ExtArgs>>): Prisma__PaymentRefundClient<$Result.GetResult<Prisma.$PaymentRefundPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PaymentRefund that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentRefundFindFirstOrThrowArgs} args - Arguments to find a PaymentRefund
     * @example
     * // Get one PaymentRefund
     * const paymentRefund = await prisma.paymentRefund.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PaymentRefundFindFirstOrThrowArgs>(args?: SelectSubset<T, PaymentRefundFindFirstOrThrowArgs<ExtArgs>>): Prisma__PaymentRefundClient<$Result.GetResult<Prisma.$PaymentRefundPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PaymentRefunds that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentRefundFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PaymentRefunds
     * const paymentRefunds = await prisma.paymentRefund.findMany()
     * 
     * // Get first 10 PaymentRefunds
     * const paymentRefunds = await prisma.paymentRefund.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const paymentRefundWithIdOnly = await prisma.paymentRefund.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PaymentRefundFindManyArgs>(args?: SelectSubset<T, PaymentRefundFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentRefundPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PaymentRefund.
     * @param {PaymentRefundCreateArgs} args - Arguments to create a PaymentRefund.
     * @example
     * // Create one PaymentRefund
     * const PaymentRefund = await prisma.paymentRefund.create({
     *   data: {
     *     // ... data to create a PaymentRefund
     *   }
     * })
     * 
     */
    create<T extends PaymentRefundCreateArgs>(args: SelectSubset<T, PaymentRefundCreateArgs<ExtArgs>>): Prisma__PaymentRefundClient<$Result.GetResult<Prisma.$PaymentRefundPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PaymentRefunds.
     * @param {PaymentRefundCreateManyArgs} args - Arguments to create many PaymentRefunds.
     * @example
     * // Create many PaymentRefunds
     * const paymentRefund = await prisma.paymentRefund.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PaymentRefundCreateManyArgs>(args?: SelectSubset<T, PaymentRefundCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PaymentRefunds and returns the data saved in the database.
     * @param {PaymentRefundCreateManyAndReturnArgs} args - Arguments to create many PaymentRefunds.
     * @example
     * // Create many PaymentRefunds
     * const paymentRefund = await prisma.paymentRefund.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PaymentRefunds and only return the `id`
     * const paymentRefundWithIdOnly = await prisma.paymentRefund.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PaymentRefundCreateManyAndReturnArgs>(args?: SelectSubset<T, PaymentRefundCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentRefundPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PaymentRefund.
     * @param {PaymentRefundDeleteArgs} args - Arguments to delete one PaymentRefund.
     * @example
     * // Delete one PaymentRefund
     * const PaymentRefund = await prisma.paymentRefund.delete({
     *   where: {
     *     // ... filter to delete one PaymentRefund
     *   }
     * })
     * 
     */
    delete<T extends PaymentRefundDeleteArgs>(args: SelectSubset<T, PaymentRefundDeleteArgs<ExtArgs>>): Prisma__PaymentRefundClient<$Result.GetResult<Prisma.$PaymentRefundPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PaymentRefund.
     * @param {PaymentRefundUpdateArgs} args - Arguments to update one PaymentRefund.
     * @example
     * // Update one PaymentRefund
     * const paymentRefund = await prisma.paymentRefund.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PaymentRefundUpdateArgs>(args: SelectSubset<T, PaymentRefundUpdateArgs<ExtArgs>>): Prisma__PaymentRefundClient<$Result.GetResult<Prisma.$PaymentRefundPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PaymentRefunds.
     * @param {PaymentRefundDeleteManyArgs} args - Arguments to filter PaymentRefunds to delete.
     * @example
     * // Delete a few PaymentRefunds
     * const { count } = await prisma.paymentRefund.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PaymentRefundDeleteManyArgs>(args?: SelectSubset<T, PaymentRefundDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PaymentRefunds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentRefundUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PaymentRefunds
     * const paymentRefund = await prisma.paymentRefund.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PaymentRefundUpdateManyArgs>(args: SelectSubset<T, PaymentRefundUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PaymentRefund.
     * @param {PaymentRefundUpsertArgs} args - Arguments to update or create a PaymentRefund.
     * @example
     * // Update or create a PaymentRefund
     * const paymentRefund = await prisma.paymentRefund.upsert({
     *   create: {
     *     // ... data to create a PaymentRefund
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PaymentRefund we want to update
     *   }
     * })
     */
    upsert<T extends PaymentRefundUpsertArgs>(args: SelectSubset<T, PaymentRefundUpsertArgs<ExtArgs>>): Prisma__PaymentRefundClient<$Result.GetResult<Prisma.$PaymentRefundPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PaymentRefunds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentRefundCountArgs} args - Arguments to filter PaymentRefunds to count.
     * @example
     * // Count the number of PaymentRefunds
     * const count = await prisma.paymentRefund.count({
     *   where: {
     *     // ... the filter for the PaymentRefunds we want to count
     *   }
     * })
    **/
    count<T extends PaymentRefundCountArgs>(
      args?: Subset<T, PaymentRefundCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PaymentRefundCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PaymentRefund.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentRefundAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PaymentRefundAggregateArgs>(args: Subset<T, PaymentRefundAggregateArgs>): Prisma.PrismaPromise<GetPaymentRefundAggregateType<T>>

    /**
     * Group by PaymentRefund.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentRefundGroupByArgs} args - Group by arguments.
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
      T extends PaymentRefundGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PaymentRefundGroupByArgs['orderBy'] }
        : { orderBy?: PaymentRefundGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PaymentRefundGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaymentRefundGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PaymentRefund model
   */
  readonly fields: PaymentRefundFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PaymentRefund.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PaymentRefundClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    payment<T extends PaymentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PaymentDefaultArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the PaymentRefund model
   */ 
  interface PaymentRefundFieldRefs {
    readonly id: FieldRef<"PaymentRefund", 'String'>
    readonly payment_id: FieldRef<"PaymentRefund", 'String'>
    readonly order_id: FieldRef<"PaymentRefund", 'String'>
    readonly amount: FieldRef<"PaymentRefund", 'Decimal'>
    readonly currency: FieldRef<"PaymentRefund", 'String'>
    readonly razorpay_refund_id: FieldRef<"PaymentRefund", 'String'>
    readonly reason: FieldRef<"PaymentRefund", 'String'>
    readonly status: FieldRef<"PaymentRefund", 'RefundStatus'>
    readonly failure_reason: FieldRef<"PaymentRefund", 'String'>
    readonly created_at: FieldRef<"PaymentRefund", 'DateTime'>
    readonly updated_at: FieldRef<"PaymentRefund", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PaymentRefund findUnique
   */
  export type PaymentRefundFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentRefund
     */
    select?: PaymentRefundSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentRefundInclude<ExtArgs> | null
    /**
     * Filter, which PaymentRefund to fetch.
     */
    where: PaymentRefundWhereUniqueInput
  }

  /**
   * PaymentRefund findUniqueOrThrow
   */
  export type PaymentRefundFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentRefund
     */
    select?: PaymentRefundSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentRefundInclude<ExtArgs> | null
    /**
     * Filter, which PaymentRefund to fetch.
     */
    where: PaymentRefundWhereUniqueInput
  }

  /**
   * PaymentRefund findFirst
   */
  export type PaymentRefundFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentRefund
     */
    select?: PaymentRefundSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentRefundInclude<ExtArgs> | null
    /**
     * Filter, which PaymentRefund to fetch.
     */
    where?: PaymentRefundWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentRefunds to fetch.
     */
    orderBy?: PaymentRefundOrderByWithRelationInput | PaymentRefundOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PaymentRefunds.
     */
    cursor?: PaymentRefundWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentRefunds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentRefunds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PaymentRefunds.
     */
    distinct?: PaymentRefundScalarFieldEnum | PaymentRefundScalarFieldEnum[]
  }

  /**
   * PaymentRefund findFirstOrThrow
   */
  export type PaymentRefundFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentRefund
     */
    select?: PaymentRefundSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentRefundInclude<ExtArgs> | null
    /**
     * Filter, which PaymentRefund to fetch.
     */
    where?: PaymentRefundWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentRefunds to fetch.
     */
    orderBy?: PaymentRefundOrderByWithRelationInput | PaymentRefundOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PaymentRefunds.
     */
    cursor?: PaymentRefundWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentRefunds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentRefunds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PaymentRefunds.
     */
    distinct?: PaymentRefundScalarFieldEnum | PaymentRefundScalarFieldEnum[]
  }

  /**
   * PaymentRefund findMany
   */
  export type PaymentRefundFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentRefund
     */
    select?: PaymentRefundSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentRefundInclude<ExtArgs> | null
    /**
     * Filter, which PaymentRefunds to fetch.
     */
    where?: PaymentRefundWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentRefunds to fetch.
     */
    orderBy?: PaymentRefundOrderByWithRelationInput | PaymentRefundOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PaymentRefunds.
     */
    cursor?: PaymentRefundWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentRefunds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentRefunds.
     */
    skip?: number
    distinct?: PaymentRefundScalarFieldEnum | PaymentRefundScalarFieldEnum[]
  }

  /**
   * PaymentRefund create
   */
  export type PaymentRefundCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentRefund
     */
    select?: PaymentRefundSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentRefundInclude<ExtArgs> | null
    /**
     * The data needed to create a PaymentRefund.
     */
    data: XOR<PaymentRefundCreateInput, PaymentRefundUncheckedCreateInput>
  }

  /**
   * PaymentRefund createMany
   */
  export type PaymentRefundCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PaymentRefunds.
     */
    data: PaymentRefundCreateManyInput | PaymentRefundCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PaymentRefund createManyAndReturn
   */
  export type PaymentRefundCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentRefund
     */
    select?: PaymentRefundSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PaymentRefunds.
     */
    data: PaymentRefundCreateManyInput | PaymentRefundCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentRefundIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PaymentRefund update
   */
  export type PaymentRefundUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentRefund
     */
    select?: PaymentRefundSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentRefundInclude<ExtArgs> | null
    /**
     * The data needed to update a PaymentRefund.
     */
    data: XOR<PaymentRefundUpdateInput, PaymentRefundUncheckedUpdateInput>
    /**
     * Choose, which PaymentRefund to update.
     */
    where: PaymentRefundWhereUniqueInput
  }

  /**
   * PaymentRefund updateMany
   */
  export type PaymentRefundUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PaymentRefunds.
     */
    data: XOR<PaymentRefundUpdateManyMutationInput, PaymentRefundUncheckedUpdateManyInput>
    /**
     * Filter which PaymentRefunds to update
     */
    where?: PaymentRefundWhereInput
  }

  /**
   * PaymentRefund upsert
   */
  export type PaymentRefundUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentRefund
     */
    select?: PaymentRefundSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentRefundInclude<ExtArgs> | null
    /**
     * The filter to search for the PaymentRefund to update in case it exists.
     */
    where: PaymentRefundWhereUniqueInput
    /**
     * In case the PaymentRefund found by the `where` argument doesn't exist, create a new PaymentRefund with this data.
     */
    create: XOR<PaymentRefundCreateInput, PaymentRefundUncheckedCreateInput>
    /**
     * In case the PaymentRefund was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PaymentRefundUpdateInput, PaymentRefundUncheckedUpdateInput>
  }

  /**
   * PaymentRefund delete
   */
  export type PaymentRefundDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentRefund
     */
    select?: PaymentRefundSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentRefundInclude<ExtArgs> | null
    /**
     * Filter which PaymentRefund to delete.
     */
    where: PaymentRefundWhereUniqueInput
  }

  /**
   * PaymentRefund deleteMany
   */
  export type PaymentRefundDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PaymentRefunds to delete
     */
    where?: PaymentRefundWhereInput
  }

  /**
   * PaymentRefund without action
   */
  export type PaymentRefundDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentRefund
     */
    select?: PaymentRefundSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentRefundInclude<ExtArgs> | null
  }


  /**
   * Model PaymentOutbox
   */

  export type AggregatePaymentOutbox = {
    _count: PaymentOutboxCountAggregateOutputType | null
    _avg: PaymentOutboxAvgAggregateOutputType | null
    _sum: PaymentOutboxSumAggregateOutputType | null
    _min: PaymentOutboxMinAggregateOutputType | null
    _max: PaymentOutboxMaxAggregateOutputType | null
  }

  export type PaymentOutboxAvgAggregateOutputType = {
    retry_count: number | null
    max_retries: number | null
  }

  export type PaymentOutboxSumAggregateOutputType = {
    retry_count: number | null
    max_retries: number | null
  }

  export type PaymentOutboxMinAggregateOutputType = {
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

  export type PaymentOutboxMaxAggregateOutputType = {
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

  export type PaymentOutboxCountAggregateOutputType = {
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


  export type PaymentOutboxAvgAggregateInputType = {
    retry_count?: true
    max_retries?: true
  }

  export type PaymentOutboxSumAggregateInputType = {
    retry_count?: true
    max_retries?: true
  }

  export type PaymentOutboxMinAggregateInputType = {
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

  export type PaymentOutboxMaxAggregateInputType = {
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

  export type PaymentOutboxCountAggregateInputType = {
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

  export type PaymentOutboxAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PaymentOutbox to aggregate.
     */
    where?: PaymentOutboxWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentOutboxes to fetch.
     */
    orderBy?: PaymentOutboxOrderByWithRelationInput | PaymentOutboxOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PaymentOutboxWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentOutboxes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentOutboxes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PaymentOutboxes
    **/
    _count?: true | PaymentOutboxCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PaymentOutboxAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PaymentOutboxSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PaymentOutboxMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PaymentOutboxMaxAggregateInputType
  }

  export type GetPaymentOutboxAggregateType<T extends PaymentOutboxAggregateArgs> = {
        [P in keyof T & keyof AggregatePaymentOutbox]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePaymentOutbox[P]>
      : GetScalarType<T[P], AggregatePaymentOutbox[P]>
  }




  export type PaymentOutboxGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentOutboxWhereInput
    orderBy?: PaymentOutboxOrderByWithAggregationInput | PaymentOutboxOrderByWithAggregationInput[]
    by: PaymentOutboxScalarFieldEnum[] | PaymentOutboxScalarFieldEnum
    having?: PaymentOutboxScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PaymentOutboxCountAggregateInputType | true
    _avg?: PaymentOutboxAvgAggregateInputType
    _sum?: PaymentOutboxSumAggregateInputType
    _min?: PaymentOutboxMinAggregateInputType
    _max?: PaymentOutboxMaxAggregateInputType
  }

  export type PaymentOutboxGroupByOutputType = {
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
    _count: PaymentOutboxCountAggregateOutputType | null
    _avg: PaymentOutboxAvgAggregateOutputType | null
    _sum: PaymentOutboxSumAggregateOutputType | null
    _min: PaymentOutboxMinAggregateOutputType | null
    _max: PaymentOutboxMaxAggregateOutputType | null
  }

  type GetPaymentOutboxGroupByPayload<T extends PaymentOutboxGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PaymentOutboxGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PaymentOutboxGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PaymentOutboxGroupByOutputType[P]>
            : GetScalarType<T[P], PaymentOutboxGroupByOutputType[P]>
        }
      >
    >


  export type PaymentOutboxSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
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
  }, ExtArgs["result"]["paymentOutbox"]>

  export type PaymentOutboxSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
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
  }, ExtArgs["result"]["paymentOutbox"]>

  export type PaymentOutboxSelectScalar = {
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


  export type $PaymentOutboxPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PaymentOutbox"
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
    }, ExtArgs["result"]["paymentOutbox"]>
    composites: {}
  }

  type PaymentOutboxGetPayload<S extends boolean | null | undefined | PaymentOutboxDefaultArgs> = $Result.GetResult<Prisma.$PaymentOutboxPayload, S>

  type PaymentOutboxCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PaymentOutboxFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PaymentOutboxCountAggregateInputType | true
    }

  export interface PaymentOutboxDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PaymentOutbox'], meta: { name: 'PaymentOutbox' } }
    /**
     * Find zero or one PaymentOutbox that matches the filter.
     * @param {PaymentOutboxFindUniqueArgs} args - Arguments to find a PaymentOutbox
     * @example
     * // Get one PaymentOutbox
     * const paymentOutbox = await prisma.paymentOutbox.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PaymentOutboxFindUniqueArgs>(args: SelectSubset<T, PaymentOutboxFindUniqueArgs<ExtArgs>>): Prisma__PaymentOutboxClient<$Result.GetResult<Prisma.$PaymentOutboxPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PaymentOutbox that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PaymentOutboxFindUniqueOrThrowArgs} args - Arguments to find a PaymentOutbox
     * @example
     * // Get one PaymentOutbox
     * const paymentOutbox = await prisma.paymentOutbox.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PaymentOutboxFindUniqueOrThrowArgs>(args: SelectSubset<T, PaymentOutboxFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PaymentOutboxClient<$Result.GetResult<Prisma.$PaymentOutboxPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PaymentOutbox that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentOutboxFindFirstArgs} args - Arguments to find a PaymentOutbox
     * @example
     * // Get one PaymentOutbox
     * const paymentOutbox = await prisma.paymentOutbox.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PaymentOutboxFindFirstArgs>(args?: SelectSubset<T, PaymentOutboxFindFirstArgs<ExtArgs>>): Prisma__PaymentOutboxClient<$Result.GetResult<Prisma.$PaymentOutboxPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PaymentOutbox that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentOutboxFindFirstOrThrowArgs} args - Arguments to find a PaymentOutbox
     * @example
     * // Get one PaymentOutbox
     * const paymentOutbox = await prisma.paymentOutbox.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PaymentOutboxFindFirstOrThrowArgs>(args?: SelectSubset<T, PaymentOutboxFindFirstOrThrowArgs<ExtArgs>>): Prisma__PaymentOutboxClient<$Result.GetResult<Prisma.$PaymentOutboxPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PaymentOutboxes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentOutboxFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PaymentOutboxes
     * const paymentOutboxes = await prisma.paymentOutbox.findMany()
     * 
     * // Get first 10 PaymentOutboxes
     * const paymentOutboxes = await prisma.paymentOutbox.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const paymentOutboxWithIdOnly = await prisma.paymentOutbox.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PaymentOutboxFindManyArgs>(args?: SelectSubset<T, PaymentOutboxFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentOutboxPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PaymentOutbox.
     * @param {PaymentOutboxCreateArgs} args - Arguments to create a PaymentOutbox.
     * @example
     * // Create one PaymentOutbox
     * const PaymentOutbox = await prisma.paymentOutbox.create({
     *   data: {
     *     // ... data to create a PaymentOutbox
     *   }
     * })
     * 
     */
    create<T extends PaymentOutboxCreateArgs>(args: SelectSubset<T, PaymentOutboxCreateArgs<ExtArgs>>): Prisma__PaymentOutboxClient<$Result.GetResult<Prisma.$PaymentOutboxPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PaymentOutboxes.
     * @param {PaymentOutboxCreateManyArgs} args - Arguments to create many PaymentOutboxes.
     * @example
     * // Create many PaymentOutboxes
     * const paymentOutbox = await prisma.paymentOutbox.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PaymentOutboxCreateManyArgs>(args?: SelectSubset<T, PaymentOutboxCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PaymentOutboxes and returns the data saved in the database.
     * @param {PaymentOutboxCreateManyAndReturnArgs} args - Arguments to create many PaymentOutboxes.
     * @example
     * // Create many PaymentOutboxes
     * const paymentOutbox = await prisma.paymentOutbox.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PaymentOutboxes and only return the `id`
     * const paymentOutboxWithIdOnly = await prisma.paymentOutbox.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PaymentOutboxCreateManyAndReturnArgs>(args?: SelectSubset<T, PaymentOutboxCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentOutboxPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PaymentOutbox.
     * @param {PaymentOutboxDeleteArgs} args - Arguments to delete one PaymentOutbox.
     * @example
     * // Delete one PaymentOutbox
     * const PaymentOutbox = await prisma.paymentOutbox.delete({
     *   where: {
     *     // ... filter to delete one PaymentOutbox
     *   }
     * })
     * 
     */
    delete<T extends PaymentOutboxDeleteArgs>(args: SelectSubset<T, PaymentOutboxDeleteArgs<ExtArgs>>): Prisma__PaymentOutboxClient<$Result.GetResult<Prisma.$PaymentOutboxPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PaymentOutbox.
     * @param {PaymentOutboxUpdateArgs} args - Arguments to update one PaymentOutbox.
     * @example
     * // Update one PaymentOutbox
     * const paymentOutbox = await prisma.paymentOutbox.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PaymentOutboxUpdateArgs>(args: SelectSubset<T, PaymentOutboxUpdateArgs<ExtArgs>>): Prisma__PaymentOutboxClient<$Result.GetResult<Prisma.$PaymentOutboxPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PaymentOutboxes.
     * @param {PaymentOutboxDeleteManyArgs} args - Arguments to filter PaymentOutboxes to delete.
     * @example
     * // Delete a few PaymentOutboxes
     * const { count } = await prisma.paymentOutbox.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PaymentOutboxDeleteManyArgs>(args?: SelectSubset<T, PaymentOutboxDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PaymentOutboxes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentOutboxUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PaymentOutboxes
     * const paymentOutbox = await prisma.paymentOutbox.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PaymentOutboxUpdateManyArgs>(args: SelectSubset<T, PaymentOutboxUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PaymentOutbox.
     * @param {PaymentOutboxUpsertArgs} args - Arguments to update or create a PaymentOutbox.
     * @example
     * // Update or create a PaymentOutbox
     * const paymentOutbox = await prisma.paymentOutbox.upsert({
     *   create: {
     *     // ... data to create a PaymentOutbox
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PaymentOutbox we want to update
     *   }
     * })
     */
    upsert<T extends PaymentOutboxUpsertArgs>(args: SelectSubset<T, PaymentOutboxUpsertArgs<ExtArgs>>): Prisma__PaymentOutboxClient<$Result.GetResult<Prisma.$PaymentOutboxPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PaymentOutboxes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentOutboxCountArgs} args - Arguments to filter PaymentOutboxes to count.
     * @example
     * // Count the number of PaymentOutboxes
     * const count = await prisma.paymentOutbox.count({
     *   where: {
     *     // ... the filter for the PaymentOutboxes we want to count
     *   }
     * })
    **/
    count<T extends PaymentOutboxCountArgs>(
      args?: Subset<T, PaymentOutboxCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PaymentOutboxCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PaymentOutbox.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentOutboxAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PaymentOutboxAggregateArgs>(args: Subset<T, PaymentOutboxAggregateArgs>): Prisma.PrismaPromise<GetPaymentOutboxAggregateType<T>>

    /**
     * Group by PaymentOutbox.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentOutboxGroupByArgs} args - Group by arguments.
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
      T extends PaymentOutboxGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PaymentOutboxGroupByArgs['orderBy'] }
        : { orderBy?: PaymentOutboxGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PaymentOutboxGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaymentOutboxGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PaymentOutbox model
   */
  readonly fields: PaymentOutboxFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PaymentOutbox.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PaymentOutboxClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the PaymentOutbox model
   */ 
  interface PaymentOutboxFieldRefs {
    readonly id: FieldRef<"PaymentOutbox", 'String'>
    readonly event_type: FieldRef<"PaymentOutbox", 'String'>
    readonly aggregate_type: FieldRef<"PaymentOutbox", 'String'>
    readonly aggregate_id: FieldRef<"PaymentOutbox", 'String'>
    readonly payload: FieldRef<"PaymentOutbox", 'Json'>
    readonly status: FieldRef<"PaymentOutbox", 'OutboxStatus'>
    readonly retry_count: FieldRef<"PaymentOutbox", 'Int'>
    readonly max_retries: FieldRef<"PaymentOutbox", 'Int'>
    readonly next_retry_at: FieldRef<"PaymentOutbox", 'DateTime'>
    readonly locked_at: FieldRef<"PaymentOutbox", 'DateTime'>
    readonly locked_by: FieldRef<"PaymentOutbox", 'String'>
    readonly last_error: FieldRef<"PaymentOutbox", 'String'>
    readonly created_at: FieldRef<"PaymentOutbox", 'DateTime'>
    readonly processed_at: FieldRef<"PaymentOutbox", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PaymentOutbox findUnique
   */
  export type PaymentOutboxFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentOutbox
     */
    select?: PaymentOutboxSelect<ExtArgs> | null
    /**
     * Filter, which PaymentOutbox to fetch.
     */
    where: PaymentOutboxWhereUniqueInput
  }

  /**
   * PaymentOutbox findUniqueOrThrow
   */
  export type PaymentOutboxFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentOutbox
     */
    select?: PaymentOutboxSelect<ExtArgs> | null
    /**
     * Filter, which PaymentOutbox to fetch.
     */
    where: PaymentOutboxWhereUniqueInput
  }

  /**
   * PaymentOutbox findFirst
   */
  export type PaymentOutboxFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentOutbox
     */
    select?: PaymentOutboxSelect<ExtArgs> | null
    /**
     * Filter, which PaymentOutbox to fetch.
     */
    where?: PaymentOutboxWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentOutboxes to fetch.
     */
    orderBy?: PaymentOutboxOrderByWithRelationInput | PaymentOutboxOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PaymentOutboxes.
     */
    cursor?: PaymentOutboxWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentOutboxes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentOutboxes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PaymentOutboxes.
     */
    distinct?: PaymentOutboxScalarFieldEnum | PaymentOutboxScalarFieldEnum[]
  }

  /**
   * PaymentOutbox findFirstOrThrow
   */
  export type PaymentOutboxFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentOutbox
     */
    select?: PaymentOutboxSelect<ExtArgs> | null
    /**
     * Filter, which PaymentOutbox to fetch.
     */
    where?: PaymentOutboxWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentOutboxes to fetch.
     */
    orderBy?: PaymentOutboxOrderByWithRelationInput | PaymentOutboxOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PaymentOutboxes.
     */
    cursor?: PaymentOutboxWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentOutboxes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentOutboxes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PaymentOutboxes.
     */
    distinct?: PaymentOutboxScalarFieldEnum | PaymentOutboxScalarFieldEnum[]
  }

  /**
   * PaymentOutbox findMany
   */
  export type PaymentOutboxFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentOutbox
     */
    select?: PaymentOutboxSelect<ExtArgs> | null
    /**
     * Filter, which PaymentOutboxes to fetch.
     */
    where?: PaymentOutboxWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentOutboxes to fetch.
     */
    orderBy?: PaymentOutboxOrderByWithRelationInput | PaymentOutboxOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PaymentOutboxes.
     */
    cursor?: PaymentOutboxWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentOutboxes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentOutboxes.
     */
    skip?: number
    distinct?: PaymentOutboxScalarFieldEnum | PaymentOutboxScalarFieldEnum[]
  }

  /**
   * PaymentOutbox create
   */
  export type PaymentOutboxCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentOutbox
     */
    select?: PaymentOutboxSelect<ExtArgs> | null
    /**
     * The data needed to create a PaymentOutbox.
     */
    data: XOR<PaymentOutboxCreateInput, PaymentOutboxUncheckedCreateInput>
  }

  /**
   * PaymentOutbox createMany
   */
  export type PaymentOutboxCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PaymentOutboxes.
     */
    data: PaymentOutboxCreateManyInput | PaymentOutboxCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PaymentOutbox createManyAndReturn
   */
  export type PaymentOutboxCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentOutbox
     */
    select?: PaymentOutboxSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PaymentOutboxes.
     */
    data: PaymentOutboxCreateManyInput | PaymentOutboxCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PaymentOutbox update
   */
  export type PaymentOutboxUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentOutbox
     */
    select?: PaymentOutboxSelect<ExtArgs> | null
    /**
     * The data needed to update a PaymentOutbox.
     */
    data: XOR<PaymentOutboxUpdateInput, PaymentOutboxUncheckedUpdateInput>
    /**
     * Choose, which PaymentOutbox to update.
     */
    where: PaymentOutboxWhereUniqueInput
  }

  /**
   * PaymentOutbox updateMany
   */
  export type PaymentOutboxUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PaymentOutboxes.
     */
    data: XOR<PaymentOutboxUpdateManyMutationInput, PaymentOutboxUncheckedUpdateManyInput>
    /**
     * Filter which PaymentOutboxes to update
     */
    where?: PaymentOutboxWhereInput
  }

  /**
   * PaymentOutbox upsert
   */
  export type PaymentOutboxUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentOutbox
     */
    select?: PaymentOutboxSelect<ExtArgs> | null
    /**
     * The filter to search for the PaymentOutbox to update in case it exists.
     */
    where: PaymentOutboxWhereUniqueInput
    /**
     * In case the PaymentOutbox found by the `where` argument doesn't exist, create a new PaymentOutbox with this data.
     */
    create: XOR<PaymentOutboxCreateInput, PaymentOutboxUncheckedCreateInput>
    /**
     * In case the PaymentOutbox was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PaymentOutboxUpdateInput, PaymentOutboxUncheckedUpdateInput>
  }

  /**
   * PaymentOutbox delete
   */
  export type PaymentOutboxDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentOutbox
     */
    select?: PaymentOutboxSelect<ExtArgs> | null
    /**
     * Filter which PaymentOutbox to delete.
     */
    where: PaymentOutboxWhereUniqueInput
  }

  /**
   * PaymentOutbox deleteMany
   */
  export type PaymentOutboxDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PaymentOutboxes to delete
     */
    where?: PaymentOutboxWhereInput
  }

  /**
   * PaymentOutbox without action
   */
  export type PaymentOutboxDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentOutbox
     */
    select?: PaymentOutboxSelect<ExtArgs> | null
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


  export const PaymentScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    order_id: 'order_id',
    payment_method: 'payment_method',
    status: 'status',
    amount: 'amount',
    currency: 'currency',
    razorpay_order_id: 'razorpay_order_id',
    razorpay_payment_id: 'razorpay_payment_id',
    razorpay_signature: 'razorpay_signature',
    failure_reason: 'failure_reason',
    metadata: 'metadata',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type PaymentScalarFieldEnum = (typeof PaymentScalarFieldEnum)[keyof typeof PaymentScalarFieldEnum]


  export const PaymentRefundScalarFieldEnum: {
    id: 'id',
    payment_id: 'payment_id',
    order_id: 'order_id',
    amount: 'amount',
    currency: 'currency',
    razorpay_refund_id: 'razorpay_refund_id',
    reason: 'reason',
    status: 'status',
    failure_reason: 'failure_reason',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type PaymentRefundScalarFieldEnum = (typeof PaymentRefundScalarFieldEnum)[keyof typeof PaymentRefundScalarFieldEnum]


  export const PaymentOutboxScalarFieldEnum: {
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

  export type PaymentOutboxScalarFieldEnum = (typeof PaymentOutboxScalarFieldEnum)[keyof typeof PaymentOutboxScalarFieldEnum]


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


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


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
   * Reference to a field of type 'PaymentMethodType'
   */
  export type EnumPaymentMethodTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentMethodType'>
    


  /**
   * Reference to a field of type 'PaymentMethodType[]'
   */
  export type ListEnumPaymentMethodTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentMethodType[]'>
    


  /**
   * Reference to a field of type 'PaymentStatus'
   */
  export type EnumPaymentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentStatus'>
    


  /**
   * Reference to a field of type 'PaymentStatus[]'
   */
  export type ListEnumPaymentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentStatus[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'RefundStatus'
   */
  export type EnumRefundStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RefundStatus'>
    


  /**
   * Reference to a field of type 'RefundStatus[]'
   */
  export type ListEnumRefundStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RefundStatus[]'>
    


  /**
   * Reference to a field of type 'OutboxStatus'
   */
  export type EnumOutboxStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OutboxStatus'>
    


  /**
   * Reference to a field of type 'OutboxStatus[]'
   */
  export type ListEnumOutboxStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OutboxStatus[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


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


  export type PaymentWhereInput = {
    AND?: PaymentWhereInput | PaymentWhereInput[]
    OR?: PaymentWhereInput[]
    NOT?: PaymentWhereInput | PaymentWhereInput[]
    id?: UuidFilter<"Payment"> | string
    user_id?: UuidFilter<"Payment"> | string
    order_id?: UuidNullableFilter<"Payment"> | string | null
    payment_method?: EnumPaymentMethodTypeFilter<"Payment"> | $Enums.PaymentMethodType
    status?: EnumPaymentStatusFilter<"Payment"> | $Enums.PaymentStatus
    amount?: DecimalFilter<"Payment"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"Payment"> | string
    razorpay_order_id?: StringNullableFilter<"Payment"> | string | null
    razorpay_payment_id?: StringNullableFilter<"Payment"> | string | null
    razorpay_signature?: StringNullableFilter<"Payment"> | string | null
    failure_reason?: StringNullableFilter<"Payment"> | string | null
    metadata?: JsonNullableFilter<"Payment">
    created_at?: DateTimeFilter<"Payment"> | Date | string
    updated_at?: DateTimeFilter<"Payment"> | Date | string
    refunds?: PaymentRefundListRelationFilter
  }

  export type PaymentOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrder
    order_id?: SortOrderInput | SortOrder
    payment_method?: SortOrder
    status?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    razorpay_order_id?: SortOrderInput | SortOrder
    razorpay_payment_id?: SortOrderInput | SortOrder
    razorpay_signature?: SortOrderInput | SortOrder
    failure_reason?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    refunds?: PaymentRefundOrderByRelationAggregateInput
  }

  export type PaymentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    razorpay_order_id?: string
    razorpay_payment_id?: string
    AND?: PaymentWhereInput | PaymentWhereInput[]
    OR?: PaymentWhereInput[]
    NOT?: PaymentWhereInput | PaymentWhereInput[]
    user_id?: UuidFilter<"Payment"> | string
    order_id?: UuidNullableFilter<"Payment"> | string | null
    payment_method?: EnumPaymentMethodTypeFilter<"Payment"> | $Enums.PaymentMethodType
    status?: EnumPaymentStatusFilter<"Payment"> | $Enums.PaymentStatus
    amount?: DecimalFilter<"Payment"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"Payment"> | string
    razorpay_signature?: StringNullableFilter<"Payment"> | string | null
    failure_reason?: StringNullableFilter<"Payment"> | string | null
    metadata?: JsonNullableFilter<"Payment">
    created_at?: DateTimeFilter<"Payment"> | Date | string
    updated_at?: DateTimeFilter<"Payment"> | Date | string
    refunds?: PaymentRefundListRelationFilter
  }, "id" | "razorpay_order_id" | "razorpay_payment_id">

  export type PaymentOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrder
    order_id?: SortOrderInput | SortOrder
    payment_method?: SortOrder
    status?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    razorpay_order_id?: SortOrderInput | SortOrder
    razorpay_payment_id?: SortOrderInput | SortOrder
    razorpay_signature?: SortOrderInput | SortOrder
    failure_reason?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: PaymentCountOrderByAggregateInput
    _avg?: PaymentAvgOrderByAggregateInput
    _max?: PaymentMaxOrderByAggregateInput
    _min?: PaymentMinOrderByAggregateInput
    _sum?: PaymentSumOrderByAggregateInput
  }

  export type PaymentScalarWhereWithAggregatesInput = {
    AND?: PaymentScalarWhereWithAggregatesInput | PaymentScalarWhereWithAggregatesInput[]
    OR?: PaymentScalarWhereWithAggregatesInput[]
    NOT?: PaymentScalarWhereWithAggregatesInput | PaymentScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Payment"> | string
    user_id?: UuidWithAggregatesFilter<"Payment"> | string
    order_id?: UuidNullableWithAggregatesFilter<"Payment"> | string | null
    payment_method?: EnumPaymentMethodTypeWithAggregatesFilter<"Payment"> | $Enums.PaymentMethodType
    status?: EnumPaymentStatusWithAggregatesFilter<"Payment"> | $Enums.PaymentStatus
    amount?: DecimalWithAggregatesFilter<"Payment"> | Decimal | DecimalJsLike | number | string
    currency?: StringWithAggregatesFilter<"Payment"> | string
    razorpay_order_id?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    razorpay_payment_id?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    razorpay_signature?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    failure_reason?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"Payment">
    created_at?: DateTimeWithAggregatesFilter<"Payment"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Payment"> | Date | string
  }

  export type PaymentRefundWhereInput = {
    AND?: PaymentRefundWhereInput | PaymentRefundWhereInput[]
    OR?: PaymentRefundWhereInput[]
    NOT?: PaymentRefundWhereInput | PaymentRefundWhereInput[]
    id?: UuidFilter<"PaymentRefund"> | string
    payment_id?: UuidFilter<"PaymentRefund"> | string
    order_id?: UuidFilter<"PaymentRefund"> | string
    amount?: DecimalFilter<"PaymentRefund"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"PaymentRefund"> | string
    razorpay_refund_id?: StringNullableFilter<"PaymentRefund"> | string | null
    reason?: StringNullableFilter<"PaymentRefund"> | string | null
    status?: EnumRefundStatusFilter<"PaymentRefund"> | $Enums.RefundStatus
    failure_reason?: StringNullableFilter<"PaymentRefund"> | string | null
    created_at?: DateTimeFilter<"PaymentRefund"> | Date | string
    updated_at?: DateTimeFilter<"PaymentRefund"> | Date | string
    payment?: XOR<PaymentRelationFilter, PaymentWhereInput>
  }

  export type PaymentRefundOrderByWithRelationInput = {
    id?: SortOrder
    payment_id?: SortOrder
    order_id?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    razorpay_refund_id?: SortOrderInput | SortOrder
    reason?: SortOrderInput | SortOrder
    status?: SortOrder
    failure_reason?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    payment?: PaymentOrderByWithRelationInput
  }

  export type PaymentRefundWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    razorpay_refund_id?: string
    payment_id_order_id?: PaymentRefundPayment_idOrder_idCompoundUniqueInput
    AND?: PaymentRefundWhereInput | PaymentRefundWhereInput[]
    OR?: PaymentRefundWhereInput[]
    NOT?: PaymentRefundWhereInput | PaymentRefundWhereInput[]
    payment_id?: UuidFilter<"PaymentRefund"> | string
    order_id?: UuidFilter<"PaymentRefund"> | string
    amount?: DecimalFilter<"PaymentRefund"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"PaymentRefund"> | string
    reason?: StringNullableFilter<"PaymentRefund"> | string | null
    status?: EnumRefundStatusFilter<"PaymentRefund"> | $Enums.RefundStatus
    failure_reason?: StringNullableFilter<"PaymentRefund"> | string | null
    created_at?: DateTimeFilter<"PaymentRefund"> | Date | string
    updated_at?: DateTimeFilter<"PaymentRefund"> | Date | string
    payment?: XOR<PaymentRelationFilter, PaymentWhereInput>
  }, "id" | "razorpay_refund_id" | "payment_id_order_id">

  export type PaymentRefundOrderByWithAggregationInput = {
    id?: SortOrder
    payment_id?: SortOrder
    order_id?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    razorpay_refund_id?: SortOrderInput | SortOrder
    reason?: SortOrderInput | SortOrder
    status?: SortOrder
    failure_reason?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: PaymentRefundCountOrderByAggregateInput
    _avg?: PaymentRefundAvgOrderByAggregateInput
    _max?: PaymentRefundMaxOrderByAggregateInput
    _min?: PaymentRefundMinOrderByAggregateInput
    _sum?: PaymentRefundSumOrderByAggregateInput
  }

  export type PaymentRefundScalarWhereWithAggregatesInput = {
    AND?: PaymentRefundScalarWhereWithAggregatesInput | PaymentRefundScalarWhereWithAggregatesInput[]
    OR?: PaymentRefundScalarWhereWithAggregatesInput[]
    NOT?: PaymentRefundScalarWhereWithAggregatesInput | PaymentRefundScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"PaymentRefund"> | string
    payment_id?: UuidWithAggregatesFilter<"PaymentRefund"> | string
    order_id?: UuidWithAggregatesFilter<"PaymentRefund"> | string
    amount?: DecimalWithAggregatesFilter<"PaymentRefund"> | Decimal | DecimalJsLike | number | string
    currency?: StringWithAggregatesFilter<"PaymentRefund"> | string
    razorpay_refund_id?: StringNullableWithAggregatesFilter<"PaymentRefund"> | string | null
    reason?: StringNullableWithAggregatesFilter<"PaymentRefund"> | string | null
    status?: EnumRefundStatusWithAggregatesFilter<"PaymentRefund"> | $Enums.RefundStatus
    failure_reason?: StringNullableWithAggregatesFilter<"PaymentRefund"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"PaymentRefund"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"PaymentRefund"> | Date | string
  }

  export type PaymentOutboxWhereInput = {
    AND?: PaymentOutboxWhereInput | PaymentOutboxWhereInput[]
    OR?: PaymentOutboxWhereInput[]
    NOT?: PaymentOutboxWhereInput | PaymentOutboxWhereInput[]
    id?: UuidFilter<"PaymentOutbox"> | string
    event_type?: StringFilter<"PaymentOutbox"> | string
    aggregate_type?: StringFilter<"PaymentOutbox"> | string
    aggregate_id?: UuidFilter<"PaymentOutbox"> | string
    payload?: JsonFilter<"PaymentOutbox">
    status?: EnumOutboxStatusFilter<"PaymentOutbox"> | $Enums.OutboxStatus
    retry_count?: IntFilter<"PaymentOutbox"> | number
    max_retries?: IntFilter<"PaymentOutbox"> | number
    next_retry_at?: DateTimeNullableFilter<"PaymentOutbox"> | Date | string | null
    locked_at?: DateTimeNullableFilter<"PaymentOutbox"> | Date | string | null
    locked_by?: StringNullableFilter<"PaymentOutbox"> | string | null
    last_error?: StringNullableFilter<"PaymentOutbox"> | string | null
    created_at?: DateTimeFilter<"PaymentOutbox"> | Date | string
    processed_at?: DateTimeNullableFilter<"PaymentOutbox"> | Date | string | null
  }

  export type PaymentOutboxOrderByWithRelationInput = {
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

  export type PaymentOutboxWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PaymentOutboxWhereInput | PaymentOutboxWhereInput[]
    OR?: PaymentOutboxWhereInput[]
    NOT?: PaymentOutboxWhereInput | PaymentOutboxWhereInput[]
    event_type?: StringFilter<"PaymentOutbox"> | string
    aggregate_type?: StringFilter<"PaymentOutbox"> | string
    aggregate_id?: UuidFilter<"PaymentOutbox"> | string
    payload?: JsonFilter<"PaymentOutbox">
    status?: EnumOutboxStatusFilter<"PaymentOutbox"> | $Enums.OutboxStatus
    retry_count?: IntFilter<"PaymentOutbox"> | number
    max_retries?: IntFilter<"PaymentOutbox"> | number
    next_retry_at?: DateTimeNullableFilter<"PaymentOutbox"> | Date | string | null
    locked_at?: DateTimeNullableFilter<"PaymentOutbox"> | Date | string | null
    locked_by?: StringNullableFilter<"PaymentOutbox"> | string | null
    last_error?: StringNullableFilter<"PaymentOutbox"> | string | null
    created_at?: DateTimeFilter<"PaymentOutbox"> | Date | string
    processed_at?: DateTimeNullableFilter<"PaymentOutbox"> | Date | string | null
  }, "id">

  export type PaymentOutboxOrderByWithAggregationInput = {
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
    _count?: PaymentOutboxCountOrderByAggregateInput
    _avg?: PaymentOutboxAvgOrderByAggregateInput
    _max?: PaymentOutboxMaxOrderByAggregateInput
    _min?: PaymentOutboxMinOrderByAggregateInput
    _sum?: PaymentOutboxSumOrderByAggregateInput
  }

  export type PaymentOutboxScalarWhereWithAggregatesInput = {
    AND?: PaymentOutboxScalarWhereWithAggregatesInput | PaymentOutboxScalarWhereWithAggregatesInput[]
    OR?: PaymentOutboxScalarWhereWithAggregatesInput[]
    NOT?: PaymentOutboxScalarWhereWithAggregatesInput | PaymentOutboxScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"PaymentOutbox"> | string
    event_type?: StringWithAggregatesFilter<"PaymentOutbox"> | string
    aggregate_type?: StringWithAggregatesFilter<"PaymentOutbox"> | string
    aggregate_id?: UuidWithAggregatesFilter<"PaymentOutbox"> | string
    payload?: JsonWithAggregatesFilter<"PaymentOutbox">
    status?: EnumOutboxStatusWithAggregatesFilter<"PaymentOutbox"> | $Enums.OutboxStatus
    retry_count?: IntWithAggregatesFilter<"PaymentOutbox"> | number
    max_retries?: IntWithAggregatesFilter<"PaymentOutbox"> | number
    next_retry_at?: DateTimeNullableWithAggregatesFilter<"PaymentOutbox"> | Date | string | null
    locked_at?: DateTimeNullableWithAggregatesFilter<"PaymentOutbox"> | Date | string | null
    locked_by?: StringNullableWithAggregatesFilter<"PaymentOutbox"> | string | null
    last_error?: StringNullableWithAggregatesFilter<"PaymentOutbox"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"PaymentOutbox"> | Date | string
    processed_at?: DateTimeNullableWithAggregatesFilter<"PaymentOutbox"> | Date | string | null
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

  export type PaymentCreateInput = {
    id?: string
    user_id: string
    order_id?: string | null
    payment_method?: $Enums.PaymentMethodType
    status?: $Enums.PaymentStatus
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    razorpay_order_id?: string | null
    razorpay_payment_id?: string | null
    razorpay_signature?: string | null
    failure_reason?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
    refunds?: PaymentRefundCreateNestedManyWithoutPaymentInput
  }

  export type PaymentUncheckedCreateInput = {
    id?: string
    user_id: string
    order_id?: string | null
    payment_method?: $Enums.PaymentMethodType
    status?: $Enums.PaymentStatus
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    razorpay_order_id?: string | null
    razorpay_payment_id?: string | null
    razorpay_signature?: string | null
    failure_reason?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
    refunds?: PaymentRefundUncheckedCreateNestedManyWithoutPaymentInput
  }

  export type PaymentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    order_id?: NullableStringFieldUpdateOperationsInput | string | null
    payment_method?: EnumPaymentMethodTypeFieldUpdateOperationsInput | $Enums.PaymentMethodType
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    razorpay_order_id?: NullableStringFieldUpdateOperationsInput | string | null
    razorpay_payment_id?: NullableStringFieldUpdateOperationsInput | string | null
    razorpay_signature?: NullableStringFieldUpdateOperationsInput | string | null
    failure_reason?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    refunds?: PaymentRefundUpdateManyWithoutPaymentNestedInput
  }

  export type PaymentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    order_id?: NullableStringFieldUpdateOperationsInput | string | null
    payment_method?: EnumPaymentMethodTypeFieldUpdateOperationsInput | $Enums.PaymentMethodType
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    razorpay_order_id?: NullableStringFieldUpdateOperationsInput | string | null
    razorpay_payment_id?: NullableStringFieldUpdateOperationsInput | string | null
    razorpay_signature?: NullableStringFieldUpdateOperationsInput | string | null
    failure_reason?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    refunds?: PaymentRefundUncheckedUpdateManyWithoutPaymentNestedInput
  }

  export type PaymentCreateManyInput = {
    id?: string
    user_id: string
    order_id?: string | null
    payment_method?: $Enums.PaymentMethodType
    status?: $Enums.PaymentStatus
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    razorpay_order_id?: string | null
    razorpay_payment_id?: string | null
    razorpay_signature?: string | null
    failure_reason?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type PaymentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    order_id?: NullableStringFieldUpdateOperationsInput | string | null
    payment_method?: EnumPaymentMethodTypeFieldUpdateOperationsInput | $Enums.PaymentMethodType
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    razorpay_order_id?: NullableStringFieldUpdateOperationsInput | string | null
    razorpay_payment_id?: NullableStringFieldUpdateOperationsInput | string | null
    razorpay_signature?: NullableStringFieldUpdateOperationsInput | string | null
    failure_reason?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    order_id?: NullableStringFieldUpdateOperationsInput | string | null
    payment_method?: EnumPaymentMethodTypeFieldUpdateOperationsInput | $Enums.PaymentMethodType
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    razorpay_order_id?: NullableStringFieldUpdateOperationsInput | string | null
    razorpay_payment_id?: NullableStringFieldUpdateOperationsInput | string | null
    razorpay_signature?: NullableStringFieldUpdateOperationsInput | string | null
    failure_reason?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentRefundCreateInput = {
    id?: string
    order_id: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    razorpay_refund_id?: string | null
    reason?: string | null
    status?: $Enums.RefundStatus
    failure_reason?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    payment: PaymentCreateNestedOneWithoutRefundsInput
  }

  export type PaymentRefundUncheckedCreateInput = {
    id?: string
    payment_id: string
    order_id: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    razorpay_refund_id?: string | null
    reason?: string | null
    status?: $Enums.RefundStatus
    failure_reason?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type PaymentRefundUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    order_id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    razorpay_refund_id?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumRefundStatusFieldUpdateOperationsInput | $Enums.RefundStatus
    failure_reason?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    payment?: PaymentUpdateOneRequiredWithoutRefundsNestedInput
  }

  export type PaymentRefundUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    payment_id?: StringFieldUpdateOperationsInput | string
    order_id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    razorpay_refund_id?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumRefundStatusFieldUpdateOperationsInput | $Enums.RefundStatus
    failure_reason?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentRefundCreateManyInput = {
    id?: string
    payment_id: string
    order_id: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    razorpay_refund_id?: string | null
    reason?: string | null
    status?: $Enums.RefundStatus
    failure_reason?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type PaymentRefundUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    order_id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    razorpay_refund_id?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumRefundStatusFieldUpdateOperationsInput | $Enums.RefundStatus
    failure_reason?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentRefundUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    payment_id?: StringFieldUpdateOperationsInput | string
    order_id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    razorpay_refund_id?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumRefundStatusFieldUpdateOperationsInput | $Enums.RefundStatus
    failure_reason?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentOutboxCreateInput = {
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

  export type PaymentOutboxUncheckedCreateInput = {
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

  export type PaymentOutboxUpdateInput = {
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

  export type PaymentOutboxUncheckedUpdateInput = {
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

  export type PaymentOutboxCreateManyInput = {
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

  export type PaymentOutboxUpdateManyMutationInput = {
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

  export type PaymentOutboxUncheckedUpdateManyInput = {
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

  export type EnumPaymentMethodTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethodType | EnumPaymentMethodTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentMethodType[] | ListEnumPaymentMethodTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentMethodType[] | ListEnumPaymentMethodTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentMethodTypeFilter<$PrismaModel> | $Enums.PaymentMethodType
  }

  export type EnumPaymentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusFilter<$PrismaModel> | $Enums.PaymentStatus
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
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
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
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

  export type PaymentRefundListRelationFilter = {
    every?: PaymentRefundWhereInput
    some?: PaymentRefundWhereInput
    none?: PaymentRefundWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type PaymentRefundOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PaymentCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    order_id?: SortOrder
    payment_method?: SortOrder
    status?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    razorpay_order_id?: SortOrder
    razorpay_payment_id?: SortOrder
    razorpay_signature?: SortOrder
    failure_reason?: SortOrder
    metadata?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type PaymentAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type PaymentMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    order_id?: SortOrder
    payment_method?: SortOrder
    status?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    razorpay_order_id?: SortOrder
    razorpay_payment_id?: SortOrder
    razorpay_signature?: SortOrder
    failure_reason?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type PaymentMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    order_id?: SortOrder
    payment_method?: SortOrder
    status?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    razorpay_order_id?: SortOrder
    razorpay_payment_id?: SortOrder
    razorpay_signature?: SortOrder
    failure_reason?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type PaymentSumOrderByAggregateInput = {
    amount?: SortOrder
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

  export type EnumPaymentMethodTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethodType | EnumPaymentMethodTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentMethodType[] | ListEnumPaymentMethodTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentMethodType[] | ListEnumPaymentMethodTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentMethodTypeWithAggregatesFilter<$PrismaModel> | $Enums.PaymentMethodType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentMethodTypeFilter<$PrismaModel>
    _max?: NestedEnumPaymentMethodTypeFilter<$PrismaModel>
  }

  export type EnumPaymentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel> | $Enums.PaymentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentStatusFilter<$PrismaModel>
    _max?: NestedEnumPaymentStatusFilter<$PrismaModel>
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
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
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
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
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
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

  export type EnumRefundStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.RefundStatus | EnumRefundStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RefundStatus[] | ListEnumRefundStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.RefundStatus[] | ListEnumRefundStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumRefundStatusFilter<$PrismaModel> | $Enums.RefundStatus
  }

  export type PaymentRelationFilter = {
    is?: PaymentWhereInput
    isNot?: PaymentWhereInput
  }

  export type PaymentRefundPayment_idOrder_idCompoundUniqueInput = {
    payment_id: string
    order_id: string
  }

  export type PaymentRefundCountOrderByAggregateInput = {
    id?: SortOrder
    payment_id?: SortOrder
    order_id?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    razorpay_refund_id?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    failure_reason?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type PaymentRefundAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type PaymentRefundMaxOrderByAggregateInput = {
    id?: SortOrder
    payment_id?: SortOrder
    order_id?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    razorpay_refund_id?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    failure_reason?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type PaymentRefundMinOrderByAggregateInput = {
    id?: SortOrder
    payment_id?: SortOrder
    order_id?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    razorpay_refund_id?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    failure_reason?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type PaymentRefundSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type EnumRefundStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RefundStatus | EnumRefundStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RefundStatus[] | ListEnumRefundStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.RefundStatus[] | ListEnumRefundStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumRefundStatusWithAggregatesFilter<$PrismaModel> | $Enums.RefundStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRefundStatusFilter<$PrismaModel>
    _max?: NestedEnumRefundStatusFilter<$PrismaModel>
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

  export type EnumOutboxStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.OutboxStatus | EnumOutboxStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OutboxStatus[] | ListEnumOutboxStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OutboxStatus[] | ListEnumOutboxStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOutboxStatusFilter<$PrismaModel> | $Enums.OutboxStatus
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

  export type PaymentOutboxCountOrderByAggregateInput = {
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

  export type PaymentOutboxAvgOrderByAggregateInput = {
    retry_count?: SortOrder
    max_retries?: SortOrder
  }

  export type PaymentOutboxMaxOrderByAggregateInput = {
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

  export type PaymentOutboxMinOrderByAggregateInput = {
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

  export type PaymentOutboxSumOrderByAggregateInput = {
    retry_count?: SortOrder
    max_retries?: SortOrder
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

  export type EnumOutboxStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OutboxStatus | EnumOutboxStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OutboxStatus[] | ListEnumOutboxStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OutboxStatus[] | ListEnumOutboxStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOutboxStatusWithAggregatesFilter<$PrismaModel> | $Enums.OutboxStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOutboxStatusFilter<$PrismaModel>
    _max?: NestedEnumOutboxStatusFilter<$PrismaModel>
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

  export type PaymentRefundCreateNestedManyWithoutPaymentInput = {
    create?: XOR<PaymentRefundCreateWithoutPaymentInput, PaymentRefundUncheckedCreateWithoutPaymentInput> | PaymentRefundCreateWithoutPaymentInput[] | PaymentRefundUncheckedCreateWithoutPaymentInput[]
    connectOrCreate?: PaymentRefundCreateOrConnectWithoutPaymentInput | PaymentRefundCreateOrConnectWithoutPaymentInput[]
    createMany?: PaymentRefundCreateManyPaymentInputEnvelope
    connect?: PaymentRefundWhereUniqueInput | PaymentRefundWhereUniqueInput[]
  }

  export type PaymentRefundUncheckedCreateNestedManyWithoutPaymentInput = {
    create?: XOR<PaymentRefundCreateWithoutPaymentInput, PaymentRefundUncheckedCreateWithoutPaymentInput> | PaymentRefundCreateWithoutPaymentInput[] | PaymentRefundUncheckedCreateWithoutPaymentInput[]
    connectOrCreate?: PaymentRefundCreateOrConnectWithoutPaymentInput | PaymentRefundCreateOrConnectWithoutPaymentInput[]
    createMany?: PaymentRefundCreateManyPaymentInputEnvelope
    connect?: PaymentRefundWhereUniqueInput | PaymentRefundWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumPaymentMethodTypeFieldUpdateOperationsInput = {
    set?: $Enums.PaymentMethodType
  }

  export type EnumPaymentStatusFieldUpdateOperationsInput = {
    set?: $Enums.PaymentStatus
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type PaymentRefundUpdateManyWithoutPaymentNestedInput = {
    create?: XOR<PaymentRefundCreateWithoutPaymentInput, PaymentRefundUncheckedCreateWithoutPaymentInput> | PaymentRefundCreateWithoutPaymentInput[] | PaymentRefundUncheckedCreateWithoutPaymentInput[]
    connectOrCreate?: PaymentRefundCreateOrConnectWithoutPaymentInput | PaymentRefundCreateOrConnectWithoutPaymentInput[]
    upsert?: PaymentRefundUpsertWithWhereUniqueWithoutPaymentInput | PaymentRefundUpsertWithWhereUniqueWithoutPaymentInput[]
    createMany?: PaymentRefundCreateManyPaymentInputEnvelope
    set?: PaymentRefundWhereUniqueInput | PaymentRefundWhereUniqueInput[]
    disconnect?: PaymentRefundWhereUniqueInput | PaymentRefundWhereUniqueInput[]
    delete?: PaymentRefundWhereUniqueInput | PaymentRefundWhereUniqueInput[]
    connect?: PaymentRefundWhereUniqueInput | PaymentRefundWhereUniqueInput[]
    update?: PaymentRefundUpdateWithWhereUniqueWithoutPaymentInput | PaymentRefundUpdateWithWhereUniqueWithoutPaymentInput[]
    updateMany?: PaymentRefundUpdateManyWithWhereWithoutPaymentInput | PaymentRefundUpdateManyWithWhereWithoutPaymentInput[]
    deleteMany?: PaymentRefundScalarWhereInput | PaymentRefundScalarWhereInput[]
  }

  export type PaymentRefundUncheckedUpdateManyWithoutPaymentNestedInput = {
    create?: XOR<PaymentRefundCreateWithoutPaymentInput, PaymentRefundUncheckedCreateWithoutPaymentInput> | PaymentRefundCreateWithoutPaymentInput[] | PaymentRefundUncheckedCreateWithoutPaymentInput[]
    connectOrCreate?: PaymentRefundCreateOrConnectWithoutPaymentInput | PaymentRefundCreateOrConnectWithoutPaymentInput[]
    upsert?: PaymentRefundUpsertWithWhereUniqueWithoutPaymentInput | PaymentRefundUpsertWithWhereUniqueWithoutPaymentInput[]
    createMany?: PaymentRefundCreateManyPaymentInputEnvelope
    set?: PaymentRefundWhereUniqueInput | PaymentRefundWhereUniqueInput[]
    disconnect?: PaymentRefundWhereUniqueInput | PaymentRefundWhereUniqueInput[]
    delete?: PaymentRefundWhereUniqueInput | PaymentRefundWhereUniqueInput[]
    connect?: PaymentRefundWhereUniqueInput | PaymentRefundWhereUniqueInput[]
    update?: PaymentRefundUpdateWithWhereUniqueWithoutPaymentInput | PaymentRefundUpdateWithWhereUniqueWithoutPaymentInput[]
    updateMany?: PaymentRefundUpdateManyWithWhereWithoutPaymentInput | PaymentRefundUpdateManyWithWhereWithoutPaymentInput[]
    deleteMany?: PaymentRefundScalarWhereInput | PaymentRefundScalarWhereInput[]
  }

  export type PaymentCreateNestedOneWithoutRefundsInput = {
    create?: XOR<PaymentCreateWithoutRefundsInput, PaymentUncheckedCreateWithoutRefundsInput>
    connectOrCreate?: PaymentCreateOrConnectWithoutRefundsInput
    connect?: PaymentWhereUniqueInput
  }

  export type EnumRefundStatusFieldUpdateOperationsInput = {
    set?: $Enums.RefundStatus
  }

  export type PaymentUpdateOneRequiredWithoutRefundsNestedInput = {
    create?: XOR<PaymentCreateWithoutRefundsInput, PaymentUncheckedCreateWithoutRefundsInput>
    connectOrCreate?: PaymentCreateOrConnectWithoutRefundsInput
    upsert?: PaymentUpsertWithoutRefundsInput
    connect?: PaymentWhereUniqueInput
    update?: XOR<XOR<PaymentUpdateToOneWithWhereWithoutRefundsInput, PaymentUpdateWithoutRefundsInput>, PaymentUncheckedUpdateWithoutRefundsInput>
  }

  export type EnumOutboxStatusFieldUpdateOperationsInput = {
    set?: $Enums.OutboxStatus
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
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

  export type NestedEnumPaymentMethodTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethodType | EnumPaymentMethodTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentMethodType[] | ListEnumPaymentMethodTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentMethodType[] | ListEnumPaymentMethodTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentMethodTypeFilter<$PrismaModel> | $Enums.PaymentMethodType
  }

  export type NestedEnumPaymentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusFilter<$PrismaModel> | $Enums.PaymentStatus
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
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

  export type NestedEnumPaymentMethodTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethodType | EnumPaymentMethodTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentMethodType[] | ListEnumPaymentMethodTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentMethodType[] | ListEnumPaymentMethodTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentMethodTypeWithAggregatesFilter<$PrismaModel> | $Enums.PaymentMethodType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentMethodTypeFilter<$PrismaModel>
    _max?: NestedEnumPaymentMethodTypeFilter<$PrismaModel>
  }

  export type NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel> | $Enums.PaymentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentStatusFilter<$PrismaModel>
    _max?: NestedEnumPaymentStatusFilter<$PrismaModel>
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
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
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
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

  export type NestedEnumRefundStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.RefundStatus | EnumRefundStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RefundStatus[] | ListEnumRefundStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.RefundStatus[] | ListEnumRefundStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumRefundStatusFilter<$PrismaModel> | $Enums.RefundStatus
  }

  export type NestedEnumRefundStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RefundStatus | EnumRefundStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RefundStatus[] | ListEnumRefundStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.RefundStatus[] | ListEnumRefundStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumRefundStatusWithAggregatesFilter<$PrismaModel> | $Enums.RefundStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRefundStatusFilter<$PrismaModel>
    _max?: NestedEnumRefundStatusFilter<$PrismaModel>
  }

  export type NestedEnumOutboxStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.OutboxStatus | EnumOutboxStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OutboxStatus[] | ListEnumOutboxStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OutboxStatus[] | ListEnumOutboxStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOutboxStatusFilter<$PrismaModel> | $Enums.OutboxStatus
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

  export type NestedEnumOutboxStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OutboxStatus | EnumOutboxStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OutboxStatus[] | ListEnumOutboxStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OutboxStatus[] | ListEnumOutboxStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOutboxStatusWithAggregatesFilter<$PrismaModel> | $Enums.OutboxStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOutboxStatusFilter<$PrismaModel>
    _max?: NestedEnumOutboxStatusFilter<$PrismaModel>
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

  export type PaymentRefundCreateWithoutPaymentInput = {
    id?: string
    order_id: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    razorpay_refund_id?: string | null
    reason?: string | null
    status?: $Enums.RefundStatus
    failure_reason?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type PaymentRefundUncheckedCreateWithoutPaymentInput = {
    id?: string
    order_id: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    razorpay_refund_id?: string | null
    reason?: string | null
    status?: $Enums.RefundStatus
    failure_reason?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type PaymentRefundCreateOrConnectWithoutPaymentInput = {
    where: PaymentRefundWhereUniqueInput
    create: XOR<PaymentRefundCreateWithoutPaymentInput, PaymentRefundUncheckedCreateWithoutPaymentInput>
  }

  export type PaymentRefundCreateManyPaymentInputEnvelope = {
    data: PaymentRefundCreateManyPaymentInput | PaymentRefundCreateManyPaymentInput[]
    skipDuplicates?: boolean
  }

  export type PaymentRefundUpsertWithWhereUniqueWithoutPaymentInput = {
    where: PaymentRefundWhereUniqueInput
    update: XOR<PaymentRefundUpdateWithoutPaymentInput, PaymentRefundUncheckedUpdateWithoutPaymentInput>
    create: XOR<PaymentRefundCreateWithoutPaymentInput, PaymentRefundUncheckedCreateWithoutPaymentInput>
  }

  export type PaymentRefundUpdateWithWhereUniqueWithoutPaymentInput = {
    where: PaymentRefundWhereUniqueInput
    data: XOR<PaymentRefundUpdateWithoutPaymentInput, PaymentRefundUncheckedUpdateWithoutPaymentInput>
  }

  export type PaymentRefundUpdateManyWithWhereWithoutPaymentInput = {
    where: PaymentRefundScalarWhereInput
    data: XOR<PaymentRefundUpdateManyMutationInput, PaymentRefundUncheckedUpdateManyWithoutPaymentInput>
  }

  export type PaymentRefundScalarWhereInput = {
    AND?: PaymentRefundScalarWhereInput | PaymentRefundScalarWhereInput[]
    OR?: PaymentRefundScalarWhereInput[]
    NOT?: PaymentRefundScalarWhereInput | PaymentRefundScalarWhereInput[]
    id?: UuidFilter<"PaymentRefund"> | string
    payment_id?: UuidFilter<"PaymentRefund"> | string
    order_id?: UuidFilter<"PaymentRefund"> | string
    amount?: DecimalFilter<"PaymentRefund"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"PaymentRefund"> | string
    razorpay_refund_id?: StringNullableFilter<"PaymentRefund"> | string | null
    reason?: StringNullableFilter<"PaymentRefund"> | string | null
    status?: EnumRefundStatusFilter<"PaymentRefund"> | $Enums.RefundStatus
    failure_reason?: StringNullableFilter<"PaymentRefund"> | string | null
    created_at?: DateTimeFilter<"PaymentRefund"> | Date | string
    updated_at?: DateTimeFilter<"PaymentRefund"> | Date | string
  }

  export type PaymentCreateWithoutRefundsInput = {
    id?: string
    user_id: string
    order_id?: string | null
    payment_method?: $Enums.PaymentMethodType
    status?: $Enums.PaymentStatus
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    razorpay_order_id?: string | null
    razorpay_payment_id?: string | null
    razorpay_signature?: string | null
    failure_reason?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type PaymentUncheckedCreateWithoutRefundsInput = {
    id?: string
    user_id: string
    order_id?: string | null
    payment_method?: $Enums.PaymentMethodType
    status?: $Enums.PaymentStatus
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    razorpay_order_id?: string | null
    razorpay_payment_id?: string | null
    razorpay_signature?: string | null
    failure_reason?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type PaymentCreateOrConnectWithoutRefundsInput = {
    where: PaymentWhereUniqueInput
    create: XOR<PaymentCreateWithoutRefundsInput, PaymentUncheckedCreateWithoutRefundsInput>
  }

  export type PaymentUpsertWithoutRefundsInput = {
    update: XOR<PaymentUpdateWithoutRefundsInput, PaymentUncheckedUpdateWithoutRefundsInput>
    create: XOR<PaymentCreateWithoutRefundsInput, PaymentUncheckedCreateWithoutRefundsInput>
    where?: PaymentWhereInput
  }

  export type PaymentUpdateToOneWithWhereWithoutRefundsInput = {
    where?: PaymentWhereInput
    data: XOR<PaymentUpdateWithoutRefundsInput, PaymentUncheckedUpdateWithoutRefundsInput>
  }

  export type PaymentUpdateWithoutRefundsInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    order_id?: NullableStringFieldUpdateOperationsInput | string | null
    payment_method?: EnumPaymentMethodTypeFieldUpdateOperationsInput | $Enums.PaymentMethodType
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    razorpay_order_id?: NullableStringFieldUpdateOperationsInput | string | null
    razorpay_payment_id?: NullableStringFieldUpdateOperationsInput | string | null
    razorpay_signature?: NullableStringFieldUpdateOperationsInput | string | null
    failure_reason?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentUncheckedUpdateWithoutRefundsInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    order_id?: NullableStringFieldUpdateOperationsInput | string | null
    payment_method?: EnumPaymentMethodTypeFieldUpdateOperationsInput | $Enums.PaymentMethodType
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    razorpay_order_id?: NullableStringFieldUpdateOperationsInput | string | null
    razorpay_payment_id?: NullableStringFieldUpdateOperationsInput | string | null
    razorpay_signature?: NullableStringFieldUpdateOperationsInput | string | null
    failure_reason?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentRefundCreateManyPaymentInput = {
    id?: string
    order_id: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    razorpay_refund_id?: string | null
    reason?: string | null
    status?: $Enums.RefundStatus
    failure_reason?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type PaymentRefundUpdateWithoutPaymentInput = {
    id?: StringFieldUpdateOperationsInput | string
    order_id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    razorpay_refund_id?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumRefundStatusFieldUpdateOperationsInput | $Enums.RefundStatus
    failure_reason?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentRefundUncheckedUpdateWithoutPaymentInput = {
    id?: StringFieldUpdateOperationsInput | string
    order_id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    razorpay_refund_id?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumRefundStatusFieldUpdateOperationsInput | $Enums.RefundStatus
    failure_reason?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentRefundUncheckedUpdateManyWithoutPaymentInput = {
    id?: StringFieldUpdateOperationsInput | string
    order_id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    razorpay_refund_id?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumRefundStatusFieldUpdateOperationsInput | $Enums.RefundStatus
    failure_reason?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use PaymentCountOutputTypeDefaultArgs instead
     */
    export type PaymentCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PaymentCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PaymentDefaultArgs instead
     */
    export type PaymentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PaymentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PaymentRefundDefaultArgs instead
     */
    export type PaymentRefundArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PaymentRefundDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PaymentOutboxDefaultArgs instead
     */
    export type PaymentOutboxArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PaymentOutboxDefaultArgs<ExtArgs>
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