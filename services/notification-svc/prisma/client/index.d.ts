
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
 * Model Notification
 * 
 */
export type Notification = $Result.DefaultSelection<Prisma.$NotificationPayload>
/**
 * Model NotificationPreference
 * 
 */
export type NotificationPreference = $Result.DefaultSelection<Prisma.$NotificationPreferencePayload>
/**
 * Model NotificationTemplate
 * 
 */
export type NotificationTemplate = $Result.DefaultSelection<Prisma.$NotificationTemplatePayload>
/**
 * Model ProcessedEvent
 * 
 */
export type ProcessedEvent = $Result.DefaultSelection<Prisma.$ProcessedEventPayload>
/**
 * Model KafkaDlqRecord
 * 
 */
export type KafkaDlqRecord = $Result.DefaultSelection<Prisma.$KafkaDlqRecordPayload>
/**
 * Model NotificationOutbox
 * 
 */
export type NotificationOutbox = $Result.DefaultSelection<Prisma.$NotificationOutboxPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const NotificationChannel: {
  EMAIL: 'EMAIL',
  SMS: 'SMS',
  IN_APP: 'IN_APP',
  PUSH: 'PUSH'
};

export type NotificationChannel = (typeof NotificationChannel)[keyof typeof NotificationChannel]


export const NotificationCategory: {
  ORDERS: 'ORDERS',
  PAYMENTS: 'PAYMENTS',
  ACCOUNT: 'ACCOUNT',
  MARKETING: 'MARKETING'
};

export type NotificationCategory = (typeof NotificationCategory)[keyof typeof NotificationCategory]


export const NotificationStatus: {
  PENDING: 'PENDING',
  SENT: 'SENT',
  FAILED: 'FAILED'
};

export type NotificationStatus = (typeof NotificationStatus)[keyof typeof NotificationStatus]


export const KafkaDlqStatus: {
  DEAD_LETTERED: 'DEAD_LETTERED',
  REPLAYED: 'REPLAYED',
  IGNORED: 'IGNORED'
};

export type KafkaDlqStatus = (typeof KafkaDlqStatus)[keyof typeof KafkaDlqStatus]


export const NotificationOutboxStatus: {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SENT: 'SENT',
  FAILED: 'FAILED',
  DLQ: 'DLQ'
};

export type NotificationOutboxStatus = (typeof NotificationOutboxStatus)[keyof typeof NotificationOutboxStatus]

}

export type NotificationChannel = $Enums.NotificationChannel

export const NotificationChannel: typeof $Enums.NotificationChannel

export type NotificationCategory = $Enums.NotificationCategory

export const NotificationCategory: typeof $Enums.NotificationCategory

export type NotificationStatus = $Enums.NotificationStatus

export const NotificationStatus: typeof $Enums.NotificationStatus

export type KafkaDlqStatus = $Enums.KafkaDlqStatus

export const KafkaDlqStatus: typeof $Enums.KafkaDlqStatus

export type NotificationOutboxStatus = $Enums.NotificationOutboxStatus

export const NotificationOutboxStatus: typeof $Enums.NotificationOutboxStatus

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Notifications
 * const notifications = await prisma.notification.findMany()
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
   * // Fetch zero or more Notifications
   * const notifications = await prisma.notification.findMany()
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
   * `prisma.notification`: Exposes CRUD operations for the **Notification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Notifications
    * const notifications = await prisma.notification.findMany()
    * ```
    */
  get notification(): Prisma.NotificationDelegate<ExtArgs>;

  /**
   * `prisma.notificationPreference`: Exposes CRUD operations for the **NotificationPreference** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more NotificationPreferences
    * const notificationPreferences = await prisma.notificationPreference.findMany()
    * ```
    */
  get notificationPreference(): Prisma.NotificationPreferenceDelegate<ExtArgs>;

  /**
   * `prisma.notificationTemplate`: Exposes CRUD operations for the **NotificationTemplate** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more NotificationTemplates
    * const notificationTemplates = await prisma.notificationTemplate.findMany()
    * ```
    */
  get notificationTemplate(): Prisma.NotificationTemplateDelegate<ExtArgs>;

  /**
   * `prisma.processedEvent`: Exposes CRUD operations for the **ProcessedEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProcessedEvents
    * const processedEvents = await prisma.processedEvent.findMany()
    * ```
    */
  get processedEvent(): Prisma.ProcessedEventDelegate<ExtArgs>;

  /**
   * `prisma.kafkaDlqRecord`: Exposes CRUD operations for the **KafkaDlqRecord** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more KafkaDlqRecords
    * const kafkaDlqRecords = await prisma.kafkaDlqRecord.findMany()
    * ```
    */
  get kafkaDlqRecord(): Prisma.KafkaDlqRecordDelegate<ExtArgs>;

  /**
   * `prisma.notificationOutbox`: Exposes CRUD operations for the **NotificationOutbox** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more NotificationOutboxes
    * const notificationOutboxes = await prisma.notificationOutbox.findMany()
    * ```
    */
  get notificationOutbox(): Prisma.NotificationOutboxDelegate<ExtArgs>;
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
    Notification: 'Notification',
    NotificationPreference: 'NotificationPreference',
    NotificationTemplate: 'NotificationTemplate',
    ProcessedEvent: 'ProcessedEvent',
    KafkaDlqRecord: 'KafkaDlqRecord',
    NotificationOutbox: 'NotificationOutbox'
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
      modelProps: "notification" | "notificationPreference" | "notificationTemplate" | "processedEvent" | "kafkaDlqRecord" | "notificationOutbox"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Notification: {
        payload: Prisma.$NotificationPayload<ExtArgs>
        fields: Prisma.NotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findFirst: {
            args: Prisma.NotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findMany: {
            args: Prisma.NotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          create: {
            args: Prisma.NotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          createMany: {
            args: Prisma.NotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NotificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          delete: {
            args: Prisma.NotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          update: {
            args: Prisma.NotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          deleteMany: {
            args: Prisma.NotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.NotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          aggregate: {
            args: Prisma.NotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotification>
          }
          groupBy: {
            args: Prisma.NotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationCountAggregateOutputType> | number
          }
        }
      }
      NotificationPreference: {
        payload: Prisma.$NotificationPreferencePayload<ExtArgs>
        fields: Prisma.NotificationPreferenceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationPreferenceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPreferencePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationPreferenceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPreferencePayload>
          }
          findFirst: {
            args: Prisma.NotificationPreferenceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPreferencePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationPreferenceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPreferencePayload>
          }
          findMany: {
            args: Prisma.NotificationPreferenceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPreferencePayload>[]
          }
          create: {
            args: Prisma.NotificationPreferenceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPreferencePayload>
          }
          createMany: {
            args: Prisma.NotificationPreferenceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NotificationPreferenceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPreferencePayload>[]
          }
          delete: {
            args: Prisma.NotificationPreferenceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPreferencePayload>
          }
          update: {
            args: Prisma.NotificationPreferenceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPreferencePayload>
          }
          deleteMany: {
            args: Prisma.NotificationPreferenceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationPreferenceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.NotificationPreferenceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPreferencePayload>
          }
          aggregate: {
            args: Prisma.NotificationPreferenceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotificationPreference>
          }
          groupBy: {
            args: Prisma.NotificationPreferenceGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationPreferenceGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationPreferenceCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationPreferenceCountAggregateOutputType> | number
          }
        }
      }
      NotificationTemplate: {
        payload: Prisma.$NotificationTemplatePayload<ExtArgs>
        fields: Prisma.NotificationTemplateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationTemplateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationTemplatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationTemplateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationTemplatePayload>
          }
          findFirst: {
            args: Prisma.NotificationTemplateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationTemplatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationTemplateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationTemplatePayload>
          }
          findMany: {
            args: Prisma.NotificationTemplateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationTemplatePayload>[]
          }
          create: {
            args: Prisma.NotificationTemplateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationTemplatePayload>
          }
          createMany: {
            args: Prisma.NotificationTemplateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NotificationTemplateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationTemplatePayload>[]
          }
          delete: {
            args: Prisma.NotificationTemplateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationTemplatePayload>
          }
          update: {
            args: Prisma.NotificationTemplateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationTemplatePayload>
          }
          deleteMany: {
            args: Prisma.NotificationTemplateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationTemplateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.NotificationTemplateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationTemplatePayload>
          }
          aggregate: {
            args: Prisma.NotificationTemplateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotificationTemplate>
          }
          groupBy: {
            args: Prisma.NotificationTemplateGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationTemplateGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationTemplateCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationTemplateCountAggregateOutputType> | number
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
      KafkaDlqRecord: {
        payload: Prisma.$KafkaDlqRecordPayload<ExtArgs>
        fields: Prisma.KafkaDlqRecordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.KafkaDlqRecordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KafkaDlqRecordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.KafkaDlqRecordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KafkaDlqRecordPayload>
          }
          findFirst: {
            args: Prisma.KafkaDlqRecordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KafkaDlqRecordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.KafkaDlqRecordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KafkaDlqRecordPayload>
          }
          findMany: {
            args: Prisma.KafkaDlqRecordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KafkaDlqRecordPayload>[]
          }
          create: {
            args: Prisma.KafkaDlqRecordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KafkaDlqRecordPayload>
          }
          createMany: {
            args: Prisma.KafkaDlqRecordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.KafkaDlqRecordCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KafkaDlqRecordPayload>[]
          }
          delete: {
            args: Prisma.KafkaDlqRecordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KafkaDlqRecordPayload>
          }
          update: {
            args: Prisma.KafkaDlqRecordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KafkaDlqRecordPayload>
          }
          deleteMany: {
            args: Prisma.KafkaDlqRecordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.KafkaDlqRecordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.KafkaDlqRecordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KafkaDlqRecordPayload>
          }
          aggregate: {
            args: Prisma.KafkaDlqRecordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateKafkaDlqRecord>
          }
          groupBy: {
            args: Prisma.KafkaDlqRecordGroupByArgs<ExtArgs>
            result: $Utils.Optional<KafkaDlqRecordGroupByOutputType>[]
          }
          count: {
            args: Prisma.KafkaDlqRecordCountArgs<ExtArgs>
            result: $Utils.Optional<KafkaDlqRecordCountAggregateOutputType> | number
          }
        }
      }
      NotificationOutbox: {
        payload: Prisma.$NotificationOutboxPayload<ExtArgs>
        fields: Prisma.NotificationOutboxFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationOutboxFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationOutboxPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationOutboxFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationOutboxPayload>
          }
          findFirst: {
            args: Prisma.NotificationOutboxFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationOutboxPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationOutboxFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationOutboxPayload>
          }
          findMany: {
            args: Prisma.NotificationOutboxFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationOutboxPayload>[]
          }
          create: {
            args: Prisma.NotificationOutboxCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationOutboxPayload>
          }
          createMany: {
            args: Prisma.NotificationOutboxCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NotificationOutboxCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationOutboxPayload>[]
          }
          delete: {
            args: Prisma.NotificationOutboxDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationOutboxPayload>
          }
          update: {
            args: Prisma.NotificationOutboxUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationOutboxPayload>
          }
          deleteMany: {
            args: Prisma.NotificationOutboxDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationOutboxUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.NotificationOutboxUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationOutboxPayload>
          }
          aggregate: {
            args: Prisma.NotificationOutboxAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotificationOutbox>
          }
          groupBy: {
            args: Prisma.NotificationOutboxGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationOutboxGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationOutboxCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationOutboxCountAggregateOutputType> | number
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
   * Models
   */

  /**
   * Model Notification
   */

  export type AggregateNotification = {
    _count: NotificationCountAggregateOutputType | null
    _avg: NotificationAvgAggregateOutputType | null
    _sum: NotificationSumAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  export type NotificationAvgAggregateOutputType = {
    template_version: number | null
    attempt_count: number | null
  }

  export type NotificationSumAggregateOutputType = {
    template_version: number | null
    attempt_count: number | null
  }

  export type NotificationMinAggregateOutputType = {
    id: string | null
    user_id: string | null
    idempotency_key: string | null
    event_id: string | null
    source_service: string | null
    template_code: string | null
    template_version: number | null
    channel: $Enums.NotificationChannel | null
    category: $Enums.NotificationCategory | null
    recipient: string | null
    subject: string | null
    content: string | null
    status: $Enums.NotificationStatus | null
    error_reason: string | null
    provider_message_id: string | null
    attempt_count: number | null
    last_attempted_at: Date | null
    is_read: boolean | null
    read_at: Date | null
    sent_at: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type NotificationMaxAggregateOutputType = {
    id: string | null
    user_id: string | null
    idempotency_key: string | null
    event_id: string | null
    source_service: string | null
    template_code: string | null
    template_version: number | null
    channel: $Enums.NotificationChannel | null
    category: $Enums.NotificationCategory | null
    recipient: string | null
    subject: string | null
    content: string | null
    status: $Enums.NotificationStatus | null
    error_reason: string | null
    provider_message_id: string | null
    attempt_count: number | null
    last_attempted_at: Date | null
    is_read: boolean | null
    read_at: Date | null
    sent_at: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type NotificationCountAggregateOutputType = {
    id: number
    user_id: number
    idempotency_key: number
    event_id: number
    source_service: number
    template_code: number
    template_version: number
    channel: number
    category: number
    recipient: number
    subject: number
    content: number
    metadata: number
    status: number
    error_reason: number
    provider_message_id: number
    attempt_count: number
    last_attempted_at: number
    is_read: number
    read_at: number
    sent_at: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type NotificationAvgAggregateInputType = {
    template_version?: true
    attempt_count?: true
  }

  export type NotificationSumAggregateInputType = {
    template_version?: true
    attempt_count?: true
  }

  export type NotificationMinAggregateInputType = {
    id?: true
    user_id?: true
    idempotency_key?: true
    event_id?: true
    source_service?: true
    template_code?: true
    template_version?: true
    channel?: true
    category?: true
    recipient?: true
    subject?: true
    content?: true
    status?: true
    error_reason?: true
    provider_message_id?: true
    attempt_count?: true
    last_attempted_at?: true
    is_read?: true
    read_at?: true
    sent_at?: true
    created_at?: true
    updated_at?: true
  }

  export type NotificationMaxAggregateInputType = {
    id?: true
    user_id?: true
    idempotency_key?: true
    event_id?: true
    source_service?: true
    template_code?: true
    template_version?: true
    channel?: true
    category?: true
    recipient?: true
    subject?: true
    content?: true
    status?: true
    error_reason?: true
    provider_message_id?: true
    attempt_count?: true
    last_attempted_at?: true
    is_read?: true
    read_at?: true
    sent_at?: true
    created_at?: true
    updated_at?: true
  }

  export type NotificationCountAggregateInputType = {
    id?: true
    user_id?: true
    idempotency_key?: true
    event_id?: true
    source_service?: true
    template_code?: true
    template_version?: true
    channel?: true
    category?: true
    recipient?: true
    subject?: true
    content?: true
    metadata?: true
    status?: true
    error_reason?: true
    provider_message_id?: true
    attempt_count?: true
    last_attempted_at?: true
    is_read?: true
    read_at?: true
    sent_at?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type NotificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notification to aggregate.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Notifications
    **/
    _count?: true | NotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: NotificationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: NotificationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationMaxAggregateInputType
  }

  export type GetNotificationAggregateType<T extends NotificationAggregateArgs> = {
        [P in keyof T & keyof AggregateNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotification[P]>
      : GetScalarType<T[P], AggregateNotification[P]>
  }




  export type NotificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithAggregationInput | NotificationOrderByWithAggregationInput[]
    by: NotificationScalarFieldEnum[] | NotificationScalarFieldEnum
    having?: NotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationCountAggregateInputType | true
    _avg?: NotificationAvgAggregateInputType
    _sum?: NotificationSumAggregateInputType
    _min?: NotificationMinAggregateInputType
    _max?: NotificationMaxAggregateInputType
  }

  export type NotificationGroupByOutputType = {
    id: string
    user_id: string
    idempotency_key: string | null
    event_id: string | null
    source_service: string | null
    template_code: string
    template_version: number
    channel: $Enums.NotificationChannel
    category: $Enums.NotificationCategory
    recipient: string
    subject: string | null
    content: string
    metadata: JsonValue | null
    status: $Enums.NotificationStatus
    error_reason: string | null
    provider_message_id: string | null
    attempt_count: number
    last_attempted_at: Date | null
    is_read: boolean
    read_at: Date | null
    sent_at: Date | null
    created_at: Date
    updated_at: Date
    _count: NotificationCountAggregateOutputType | null
    _avg: NotificationAvgAggregateOutputType | null
    _sum: NotificationSumAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  type GetNotificationGroupByPayload<T extends NotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationGroupByOutputType[P]>
        }
      >
    >


  export type NotificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    idempotency_key?: boolean
    event_id?: boolean
    source_service?: boolean
    template_code?: boolean
    template_version?: boolean
    channel?: boolean
    category?: boolean
    recipient?: boolean
    subject?: boolean
    content?: boolean
    metadata?: boolean
    status?: boolean
    error_reason?: boolean
    provider_message_id?: boolean
    attempt_count?: boolean
    last_attempted_at?: boolean
    is_read?: boolean
    read_at?: boolean
    sent_at?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    idempotency_key?: boolean
    event_id?: boolean
    source_service?: boolean
    template_code?: boolean
    template_version?: boolean
    channel?: boolean
    category?: boolean
    recipient?: boolean
    subject?: boolean
    content?: boolean
    metadata?: boolean
    status?: boolean
    error_reason?: boolean
    provider_message_id?: boolean
    attempt_count?: boolean
    last_attempted_at?: boolean
    is_read?: boolean
    read_at?: boolean
    sent_at?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectScalar = {
    id?: boolean
    user_id?: boolean
    idempotency_key?: boolean
    event_id?: boolean
    source_service?: boolean
    template_code?: boolean
    template_version?: boolean
    channel?: boolean
    category?: boolean
    recipient?: boolean
    subject?: boolean
    content?: boolean
    metadata?: boolean
    status?: boolean
    error_reason?: boolean
    provider_message_id?: boolean
    attempt_count?: boolean
    last_attempted_at?: boolean
    is_read?: boolean
    read_at?: boolean
    sent_at?: boolean
    created_at?: boolean
    updated_at?: boolean
  }


  export type $NotificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Notification"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      user_id: string
      idempotency_key: string | null
      event_id: string | null
      source_service: string | null
      template_code: string
      template_version: number
      channel: $Enums.NotificationChannel
      category: $Enums.NotificationCategory
      recipient: string
      subject: string | null
      content: string
      metadata: Prisma.JsonValue | null
      status: $Enums.NotificationStatus
      error_reason: string | null
      provider_message_id: string | null
      attempt_count: number
      last_attempted_at: Date | null
      is_read: boolean
      read_at: Date | null
      sent_at: Date | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["notification"]>
    composites: {}
  }

  type NotificationGetPayload<S extends boolean | null | undefined | NotificationDefaultArgs> = $Result.GetResult<Prisma.$NotificationPayload, S>

  type NotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<NotificationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: NotificationCountAggregateInputType | true
    }

  export interface NotificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Notification'], meta: { name: 'Notification' } }
    /**
     * Find zero or one Notification that matches the filter.
     * @param {NotificationFindUniqueArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationFindUniqueArgs>(args: SelectSubset<T, NotificationFindUniqueArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Notification that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {NotificationFindUniqueOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Notification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationFindFirstArgs>(args?: SelectSubset<T, NotificationFindFirstArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Notification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Notifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Notifications
     * const notifications = await prisma.notification.findMany()
     * 
     * // Get first 10 Notifications
     * const notifications = await prisma.notification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationWithIdOnly = await prisma.notification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationFindManyArgs>(args?: SelectSubset<T, NotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Notification.
     * @param {NotificationCreateArgs} args - Arguments to create a Notification.
     * @example
     * // Create one Notification
     * const Notification = await prisma.notification.create({
     *   data: {
     *     // ... data to create a Notification
     *   }
     * })
     * 
     */
    create<T extends NotificationCreateArgs>(args: SelectSubset<T, NotificationCreateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Notifications.
     * @param {NotificationCreateManyArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationCreateManyArgs>(args?: SelectSubset<T, NotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Notifications and returns the data saved in the database.
     * @param {NotificationCreateManyAndReturnArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NotificationCreateManyAndReturnArgs>(args?: SelectSubset<T, NotificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Notification.
     * @param {NotificationDeleteArgs} args - Arguments to delete one Notification.
     * @example
     * // Delete one Notification
     * const Notification = await prisma.notification.delete({
     *   where: {
     *     // ... filter to delete one Notification
     *   }
     * })
     * 
     */
    delete<T extends NotificationDeleteArgs>(args: SelectSubset<T, NotificationDeleteArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Notification.
     * @param {NotificationUpdateArgs} args - Arguments to update one Notification.
     * @example
     * // Update one Notification
     * const notification = await prisma.notification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationUpdateArgs>(args: SelectSubset<T, NotificationUpdateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Notifications.
     * @param {NotificationDeleteManyArgs} args - Arguments to filter Notifications to delete.
     * @example
     * // Delete a few Notifications
     * const { count } = await prisma.notification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationDeleteManyArgs>(args?: SelectSubset<T, NotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationUpdateManyArgs>(args: SelectSubset<T, NotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Notification.
     * @param {NotificationUpsertArgs} args - Arguments to update or create a Notification.
     * @example
     * // Update or create a Notification
     * const notification = await prisma.notification.upsert({
     *   create: {
     *     // ... data to create a Notification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Notification we want to update
     *   }
     * })
     */
    upsert<T extends NotificationUpsertArgs>(args: SelectSubset<T, NotificationUpsertArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationCountArgs} args - Arguments to filter Notifications to count.
     * @example
     * // Count the number of Notifications
     * const count = await prisma.notification.count({
     *   where: {
     *     // ... the filter for the Notifications we want to count
     *   }
     * })
    **/
    count<T extends NotificationCountArgs>(
      args?: Subset<T, NotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends NotificationAggregateArgs>(args: Subset<T, NotificationAggregateArgs>): Prisma.PrismaPromise<GetNotificationAggregateType<T>>

    /**
     * Group by Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationGroupByArgs} args - Group by arguments.
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
      T extends NotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationGroupByArgs['orderBy'] }
        : { orderBy?: NotificationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, NotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Notification model
   */
  readonly fields: NotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Notification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the Notification model
   */ 
  interface NotificationFieldRefs {
    readonly id: FieldRef<"Notification", 'String'>
    readonly user_id: FieldRef<"Notification", 'String'>
    readonly idempotency_key: FieldRef<"Notification", 'String'>
    readonly event_id: FieldRef<"Notification", 'String'>
    readonly source_service: FieldRef<"Notification", 'String'>
    readonly template_code: FieldRef<"Notification", 'String'>
    readonly template_version: FieldRef<"Notification", 'Int'>
    readonly channel: FieldRef<"Notification", 'NotificationChannel'>
    readonly category: FieldRef<"Notification", 'NotificationCategory'>
    readonly recipient: FieldRef<"Notification", 'String'>
    readonly subject: FieldRef<"Notification", 'String'>
    readonly content: FieldRef<"Notification", 'String'>
    readonly metadata: FieldRef<"Notification", 'Json'>
    readonly status: FieldRef<"Notification", 'NotificationStatus'>
    readonly error_reason: FieldRef<"Notification", 'String'>
    readonly provider_message_id: FieldRef<"Notification", 'String'>
    readonly attempt_count: FieldRef<"Notification", 'Int'>
    readonly last_attempted_at: FieldRef<"Notification", 'DateTime'>
    readonly is_read: FieldRef<"Notification", 'Boolean'>
    readonly read_at: FieldRef<"Notification", 'DateTime'>
    readonly sent_at: FieldRef<"Notification", 'DateTime'>
    readonly created_at: FieldRef<"Notification", 'DateTime'>
    readonly updated_at: FieldRef<"Notification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Notification findUnique
   */
  export type NotificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findUniqueOrThrow
   */
  export type NotificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findFirst
   */
  export type NotificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findFirstOrThrow
   */
  export type NotificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findMany
   */
  export type NotificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Filter, which Notifications to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification create
   */
  export type NotificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * The data needed to create a Notification.
     */
    data: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
  }

  /**
   * Notification createMany
   */
  export type NotificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Notification createManyAndReturn
   */
  export type NotificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Notification update
   */
  export type NotificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * The data needed to update a Notification.
     */
    data: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
    /**
     * Choose, which Notification to update.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification updateMany
   */
  export type NotificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
  }

  /**
   * Notification upsert
   */
  export type NotificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * The filter to search for the Notification to update in case it exists.
     */
    where: NotificationWhereUniqueInput
    /**
     * In case the Notification found by the `where` argument doesn't exist, create a new Notification with this data.
     */
    create: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
    /**
     * In case the Notification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
  }

  /**
   * Notification delete
   */
  export type NotificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Filter which Notification to delete.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification deleteMany
   */
  export type NotificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notifications to delete
     */
    where?: NotificationWhereInput
  }

  /**
   * Notification without action
   */
  export type NotificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
  }


  /**
   * Model NotificationPreference
   */

  export type AggregateNotificationPreference = {
    _count: NotificationPreferenceCountAggregateOutputType | null
    _min: NotificationPreferenceMinAggregateOutputType | null
    _max: NotificationPreferenceMaxAggregateOutputType | null
  }

  export type NotificationPreferenceMinAggregateOutputType = {
    id: string | null
    user_id: string | null
    email_enabled: boolean | null
    sms_enabled: boolean | null
    in_app_enabled: boolean | null
    orders_email: boolean | null
    orders_sms: boolean | null
    payments_email: boolean | null
    payments_sms: boolean | null
    marketing_email: boolean | null
    marketing_sms: boolean | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type NotificationPreferenceMaxAggregateOutputType = {
    id: string | null
    user_id: string | null
    email_enabled: boolean | null
    sms_enabled: boolean | null
    in_app_enabled: boolean | null
    orders_email: boolean | null
    orders_sms: boolean | null
    payments_email: boolean | null
    payments_sms: boolean | null
    marketing_email: boolean | null
    marketing_sms: boolean | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type NotificationPreferenceCountAggregateOutputType = {
    id: number
    user_id: number
    email_enabled: number
    sms_enabled: number
    in_app_enabled: number
    orders_email: number
    orders_sms: number
    payments_email: number
    payments_sms: number
    marketing_email: number
    marketing_sms: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type NotificationPreferenceMinAggregateInputType = {
    id?: true
    user_id?: true
    email_enabled?: true
    sms_enabled?: true
    in_app_enabled?: true
    orders_email?: true
    orders_sms?: true
    payments_email?: true
    payments_sms?: true
    marketing_email?: true
    marketing_sms?: true
    created_at?: true
    updated_at?: true
  }

  export type NotificationPreferenceMaxAggregateInputType = {
    id?: true
    user_id?: true
    email_enabled?: true
    sms_enabled?: true
    in_app_enabled?: true
    orders_email?: true
    orders_sms?: true
    payments_email?: true
    payments_sms?: true
    marketing_email?: true
    marketing_sms?: true
    created_at?: true
    updated_at?: true
  }

  export type NotificationPreferenceCountAggregateInputType = {
    id?: true
    user_id?: true
    email_enabled?: true
    sms_enabled?: true
    in_app_enabled?: true
    orders_email?: true
    orders_sms?: true
    payments_email?: true
    payments_sms?: true
    marketing_email?: true
    marketing_sms?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type NotificationPreferenceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NotificationPreference to aggregate.
     */
    where?: NotificationPreferenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationPreferences to fetch.
     */
    orderBy?: NotificationPreferenceOrderByWithRelationInput | NotificationPreferenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationPreferenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationPreferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationPreferences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned NotificationPreferences
    **/
    _count?: true | NotificationPreferenceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationPreferenceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationPreferenceMaxAggregateInputType
  }

  export type GetNotificationPreferenceAggregateType<T extends NotificationPreferenceAggregateArgs> = {
        [P in keyof T & keyof AggregateNotificationPreference]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotificationPreference[P]>
      : GetScalarType<T[P], AggregateNotificationPreference[P]>
  }




  export type NotificationPreferenceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationPreferenceWhereInput
    orderBy?: NotificationPreferenceOrderByWithAggregationInput | NotificationPreferenceOrderByWithAggregationInput[]
    by: NotificationPreferenceScalarFieldEnum[] | NotificationPreferenceScalarFieldEnum
    having?: NotificationPreferenceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationPreferenceCountAggregateInputType | true
    _min?: NotificationPreferenceMinAggregateInputType
    _max?: NotificationPreferenceMaxAggregateInputType
  }

  export type NotificationPreferenceGroupByOutputType = {
    id: string
    user_id: string
    email_enabled: boolean
    sms_enabled: boolean
    in_app_enabled: boolean
    orders_email: boolean
    orders_sms: boolean
    payments_email: boolean
    payments_sms: boolean
    marketing_email: boolean
    marketing_sms: boolean
    created_at: Date
    updated_at: Date
    _count: NotificationPreferenceCountAggregateOutputType | null
    _min: NotificationPreferenceMinAggregateOutputType | null
    _max: NotificationPreferenceMaxAggregateOutputType | null
  }

  type GetNotificationPreferenceGroupByPayload<T extends NotificationPreferenceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationPreferenceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationPreferenceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationPreferenceGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationPreferenceGroupByOutputType[P]>
        }
      >
    >


  export type NotificationPreferenceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    email_enabled?: boolean
    sms_enabled?: boolean
    in_app_enabled?: boolean
    orders_email?: boolean
    orders_sms?: boolean
    payments_email?: boolean
    payments_sms?: boolean
    marketing_email?: boolean
    marketing_sms?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["notificationPreference"]>

  export type NotificationPreferenceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    email_enabled?: boolean
    sms_enabled?: boolean
    in_app_enabled?: boolean
    orders_email?: boolean
    orders_sms?: boolean
    payments_email?: boolean
    payments_sms?: boolean
    marketing_email?: boolean
    marketing_sms?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["notificationPreference"]>

  export type NotificationPreferenceSelectScalar = {
    id?: boolean
    user_id?: boolean
    email_enabled?: boolean
    sms_enabled?: boolean
    in_app_enabled?: boolean
    orders_email?: boolean
    orders_sms?: boolean
    payments_email?: boolean
    payments_sms?: boolean
    marketing_email?: boolean
    marketing_sms?: boolean
    created_at?: boolean
    updated_at?: boolean
  }


  export type $NotificationPreferencePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "NotificationPreference"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      user_id: string
      email_enabled: boolean
      sms_enabled: boolean
      in_app_enabled: boolean
      orders_email: boolean
      orders_sms: boolean
      payments_email: boolean
      payments_sms: boolean
      marketing_email: boolean
      marketing_sms: boolean
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["notificationPreference"]>
    composites: {}
  }

  type NotificationPreferenceGetPayload<S extends boolean | null | undefined | NotificationPreferenceDefaultArgs> = $Result.GetResult<Prisma.$NotificationPreferencePayload, S>

  type NotificationPreferenceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<NotificationPreferenceFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: NotificationPreferenceCountAggregateInputType | true
    }

  export interface NotificationPreferenceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['NotificationPreference'], meta: { name: 'NotificationPreference' } }
    /**
     * Find zero or one NotificationPreference that matches the filter.
     * @param {NotificationPreferenceFindUniqueArgs} args - Arguments to find a NotificationPreference
     * @example
     * // Get one NotificationPreference
     * const notificationPreference = await prisma.notificationPreference.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationPreferenceFindUniqueArgs>(args: SelectSubset<T, NotificationPreferenceFindUniqueArgs<ExtArgs>>): Prisma__NotificationPreferenceClient<$Result.GetResult<Prisma.$NotificationPreferencePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one NotificationPreference that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {NotificationPreferenceFindUniqueOrThrowArgs} args - Arguments to find a NotificationPreference
     * @example
     * // Get one NotificationPreference
     * const notificationPreference = await prisma.notificationPreference.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationPreferenceFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationPreferenceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationPreferenceClient<$Result.GetResult<Prisma.$NotificationPreferencePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first NotificationPreference that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationPreferenceFindFirstArgs} args - Arguments to find a NotificationPreference
     * @example
     * // Get one NotificationPreference
     * const notificationPreference = await prisma.notificationPreference.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationPreferenceFindFirstArgs>(args?: SelectSubset<T, NotificationPreferenceFindFirstArgs<ExtArgs>>): Prisma__NotificationPreferenceClient<$Result.GetResult<Prisma.$NotificationPreferencePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first NotificationPreference that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationPreferenceFindFirstOrThrowArgs} args - Arguments to find a NotificationPreference
     * @example
     * // Get one NotificationPreference
     * const notificationPreference = await prisma.notificationPreference.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationPreferenceFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationPreferenceFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationPreferenceClient<$Result.GetResult<Prisma.$NotificationPreferencePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more NotificationPreferences that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationPreferenceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NotificationPreferences
     * const notificationPreferences = await prisma.notificationPreference.findMany()
     * 
     * // Get first 10 NotificationPreferences
     * const notificationPreferences = await prisma.notificationPreference.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationPreferenceWithIdOnly = await prisma.notificationPreference.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationPreferenceFindManyArgs>(args?: SelectSubset<T, NotificationPreferenceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPreferencePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a NotificationPreference.
     * @param {NotificationPreferenceCreateArgs} args - Arguments to create a NotificationPreference.
     * @example
     * // Create one NotificationPreference
     * const NotificationPreference = await prisma.notificationPreference.create({
     *   data: {
     *     // ... data to create a NotificationPreference
     *   }
     * })
     * 
     */
    create<T extends NotificationPreferenceCreateArgs>(args: SelectSubset<T, NotificationPreferenceCreateArgs<ExtArgs>>): Prisma__NotificationPreferenceClient<$Result.GetResult<Prisma.$NotificationPreferencePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many NotificationPreferences.
     * @param {NotificationPreferenceCreateManyArgs} args - Arguments to create many NotificationPreferences.
     * @example
     * // Create many NotificationPreferences
     * const notificationPreference = await prisma.notificationPreference.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationPreferenceCreateManyArgs>(args?: SelectSubset<T, NotificationPreferenceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many NotificationPreferences and returns the data saved in the database.
     * @param {NotificationPreferenceCreateManyAndReturnArgs} args - Arguments to create many NotificationPreferences.
     * @example
     * // Create many NotificationPreferences
     * const notificationPreference = await prisma.notificationPreference.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many NotificationPreferences and only return the `id`
     * const notificationPreferenceWithIdOnly = await prisma.notificationPreference.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NotificationPreferenceCreateManyAndReturnArgs>(args?: SelectSubset<T, NotificationPreferenceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPreferencePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a NotificationPreference.
     * @param {NotificationPreferenceDeleteArgs} args - Arguments to delete one NotificationPreference.
     * @example
     * // Delete one NotificationPreference
     * const NotificationPreference = await prisma.notificationPreference.delete({
     *   where: {
     *     // ... filter to delete one NotificationPreference
     *   }
     * })
     * 
     */
    delete<T extends NotificationPreferenceDeleteArgs>(args: SelectSubset<T, NotificationPreferenceDeleteArgs<ExtArgs>>): Prisma__NotificationPreferenceClient<$Result.GetResult<Prisma.$NotificationPreferencePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one NotificationPreference.
     * @param {NotificationPreferenceUpdateArgs} args - Arguments to update one NotificationPreference.
     * @example
     * // Update one NotificationPreference
     * const notificationPreference = await prisma.notificationPreference.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationPreferenceUpdateArgs>(args: SelectSubset<T, NotificationPreferenceUpdateArgs<ExtArgs>>): Prisma__NotificationPreferenceClient<$Result.GetResult<Prisma.$NotificationPreferencePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more NotificationPreferences.
     * @param {NotificationPreferenceDeleteManyArgs} args - Arguments to filter NotificationPreferences to delete.
     * @example
     * // Delete a few NotificationPreferences
     * const { count } = await prisma.notificationPreference.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationPreferenceDeleteManyArgs>(args?: SelectSubset<T, NotificationPreferenceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NotificationPreferences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationPreferenceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NotificationPreferences
     * const notificationPreference = await prisma.notificationPreference.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationPreferenceUpdateManyArgs>(args: SelectSubset<T, NotificationPreferenceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one NotificationPreference.
     * @param {NotificationPreferenceUpsertArgs} args - Arguments to update or create a NotificationPreference.
     * @example
     * // Update or create a NotificationPreference
     * const notificationPreference = await prisma.notificationPreference.upsert({
     *   create: {
     *     // ... data to create a NotificationPreference
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NotificationPreference we want to update
     *   }
     * })
     */
    upsert<T extends NotificationPreferenceUpsertArgs>(args: SelectSubset<T, NotificationPreferenceUpsertArgs<ExtArgs>>): Prisma__NotificationPreferenceClient<$Result.GetResult<Prisma.$NotificationPreferencePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of NotificationPreferences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationPreferenceCountArgs} args - Arguments to filter NotificationPreferences to count.
     * @example
     * // Count the number of NotificationPreferences
     * const count = await prisma.notificationPreference.count({
     *   where: {
     *     // ... the filter for the NotificationPreferences we want to count
     *   }
     * })
    **/
    count<T extends NotificationPreferenceCountArgs>(
      args?: Subset<T, NotificationPreferenceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationPreferenceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a NotificationPreference.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationPreferenceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends NotificationPreferenceAggregateArgs>(args: Subset<T, NotificationPreferenceAggregateArgs>): Prisma.PrismaPromise<GetNotificationPreferenceAggregateType<T>>

    /**
     * Group by NotificationPreference.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationPreferenceGroupByArgs} args - Group by arguments.
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
      T extends NotificationPreferenceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationPreferenceGroupByArgs['orderBy'] }
        : { orderBy?: NotificationPreferenceGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, NotificationPreferenceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationPreferenceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the NotificationPreference model
   */
  readonly fields: NotificationPreferenceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for NotificationPreference.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationPreferenceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the NotificationPreference model
   */ 
  interface NotificationPreferenceFieldRefs {
    readonly id: FieldRef<"NotificationPreference", 'String'>
    readonly user_id: FieldRef<"NotificationPreference", 'String'>
    readonly email_enabled: FieldRef<"NotificationPreference", 'Boolean'>
    readonly sms_enabled: FieldRef<"NotificationPreference", 'Boolean'>
    readonly in_app_enabled: FieldRef<"NotificationPreference", 'Boolean'>
    readonly orders_email: FieldRef<"NotificationPreference", 'Boolean'>
    readonly orders_sms: FieldRef<"NotificationPreference", 'Boolean'>
    readonly payments_email: FieldRef<"NotificationPreference", 'Boolean'>
    readonly payments_sms: FieldRef<"NotificationPreference", 'Boolean'>
    readonly marketing_email: FieldRef<"NotificationPreference", 'Boolean'>
    readonly marketing_sms: FieldRef<"NotificationPreference", 'Boolean'>
    readonly created_at: FieldRef<"NotificationPreference", 'DateTime'>
    readonly updated_at: FieldRef<"NotificationPreference", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * NotificationPreference findUnique
   */
  export type NotificationPreferenceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationPreference
     */
    select?: NotificationPreferenceSelect<ExtArgs> | null
    /**
     * Filter, which NotificationPreference to fetch.
     */
    where: NotificationPreferenceWhereUniqueInput
  }

  /**
   * NotificationPreference findUniqueOrThrow
   */
  export type NotificationPreferenceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationPreference
     */
    select?: NotificationPreferenceSelect<ExtArgs> | null
    /**
     * Filter, which NotificationPreference to fetch.
     */
    where: NotificationPreferenceWhereUniqueInput
  }

  /**
   * NotificationPreference findFirst
   */
  export type NotificationPreferenceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationPreference
     */
    select?: NotificationPreferenceSelect<ExtArgs> | null
    /**
     * Filter, which NotificationPreference to fetch.
     */
    where?: NotificationPreferenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationPreferences to fetch.
     */
    orderBy?: NotificationPreferenceOrderByWithRelationInput | NotificationPreferenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NotificationPreferences.
     */
    cursor?: NotificationPreferenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationPreferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationPreferences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NotificationPreferences.
     */
    distinct?: NotificationPreferenceScalarFieldEnum | NotificationPreferenceScalarFieldEnum[]
  }

  /**
   * NotificationPreference findFirstOrThrow
   */
  export type NotificationPreferenceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationPreference
     */
    select?: NotificationPreferenceSelect<ExtArgs> | null
    /**
     * Filter, which NotificationPreference to fetch.
     */
    where?: NotificationPreferenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationPreferences to fetch.
     */
    orderBy?: NotificationPreferenceOrderByWithRelationInput | NotificationPreferenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NotificationPreferences.
     */
    cursor?: NotificationPreferenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationPreferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationPreferences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NotificationPreferences.
     */
    distinct?: NotificationPreferenceScalarFieldEnum | NotificationPreferenceScalarFieldEnum[]
  }

  /**
   * NotificationPreference findMany
   */
  export type NotificationPreferenceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationPreference
     */
    select?: NotificationPreferenceSelect<ExtArgs> | null
    /**
     * Filter, which NotificationPreferences to fetch.
     */
    where?: NotificationPreferenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationPreferences to fetch.
     */
    orderBy?: NotificationPreferenceOrderByWithRelationInput | NotificationPreferenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing NotificationPreferences.
     */
    cursor?: NotificationPreferenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationPreferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationPreferences.
     */
    skip?: number
    distinct?: NotificationPreferenceScalarFieldEnum | NotificationPreferenceScalarFieldEnum[]
  }

  /**
   * NotificationPreference create
   */
  export type NotificationPreferenceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationPreference
     */
    select?: NotificationPreferenceSelect<ExtArgs> | null
    /**
     * The data needed to create a NotificationPreference.
     */
    data: XOR<NotificationPreferenceCreateInput, NotificationPreferenceUncheckedCreateInput>
  }

  /**
   * NotificationPreference createMany
   */
  export type NotificationPreferenceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many NotificationPreferences.
     */
    data: NotificationPreferenceCreateManyInput | NotificationPreferenceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NotificationPreference createManyAndReturn
   */
  export type NotificationPreferenceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationPreference
     */
    select?: NotificationPreferenceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many NotificationPreferences.
     */
    data: NotificationPreferenceCreateManyInput | NotificationPreferenceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NotificationPreference update
   */
  export type NotificationPreferenceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationPreference
     */
    select?: NotificationPreferenceSelect<ExtArgs> | null
    /**
     * The data needed to update a NotificationPreference.
     */
    data: XOR<NotificationPreferenceUpdateInput, NotificationPreferenceUncheckedUpdateInput>
    /**
     * Choose, which NotificationPreference to update.
     */
    where: NotificationPreferenceWhereUniqueInput
  }

  /**
   * NotificationPreference updateMany
   */
  export type NotificationPreferenceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update NotificationPreferences.
     */
    data: XOR<NotificationPreferenceUpdateManyMutationInput, NotificationPreferenceUncheckedUpdateManyInput>
    /**
     * Filter which NotificationPreferences to update
     */
    where?: NotificationPreferenceWhereInput
  }

  /**
   * NotificationPreference upsert
   */
  export type NotificationPreferenceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationPreference
     */
    select?: NotificationPreferenceSelect<ExtArgs> | null
    /**
     * The filter to search for the NotificationPreference to update in case it exists.
     */
    where: NotificationPreferenceWhereUniqueInput
    /**
     * In case the NotificationPreference found by the `where` argument doesn't exist, create a new NotificationPreference with this data.
     */
    create: XOR<NotificationPreferenceCreateInput, NotificationPreferenceUncheckedCreateInput>
    /**
     * In case the NotificationPreference was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationPreferenceUpdateInput, NotificationPreferenceUncheckedUpdateInput>
  }

  /**
   * NotificationPreference delete
   */
  export type NotificationPreferenceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationPreference
     */
    select?: NotificationPreferenceSelect<ExtArgs> | null
    /**
     * Filter which NotificationPreference to delete.
     */
    where: NotificationPreferenceWhereUniqueInput
  }

  /**
   * NotificationPreference deleteMany
   */
  export type NotificationPreferenceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NotificationPreferences to delete
     */
    where?: NotificationPreferenceWhereInput
  }

  /**
   * NotificationPreference without action
   */
  export type NotificationPreferenceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationPreference
     */
    select?: NotificationPreferenceSelect<ExtArgs> | null
  }


  /**
   * Model NotificationTemplate
   */

  export type AggregateNotificationTemplate = {
    _count: NotificationTemplateCountAggregateOutputType | null
    _avg: NotificationTemplateAvgAggregateOutputType | null
    _sum: NotificationTemplateSumAggregateOutputType | null
    _min: NotificationTemplateMinAggregateOutputType | null
    _max: NotificationTemplateMaxAggregateOutputType | null
  }

  export type NotificationTemplateAvgAggregateOutputType = {
    version: number | null
  }

  export type NotificationTemplateSumAggregateOutputType = {
    version: number | null
  }

  export type NotificationTemplateMinAggregateOutputType = {
    id: string | null
    code: string | null
    channel: $Enums.NotificationChannel | null
    version: number | null
    subject: string | null
    body: string | null
    is_active: boolean | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type NotificationTemplateMaxAggregateOutputType = {
    id: string | null
    code: string | null
    channel: $Enums.NotificationChannel | null
    version: number | null
    subject: string | null
    body: string | null
    is_active: boolean | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type NotificationTemplateCountAggregateOutputType = {
    id: number
    code: number
    channel: number
    version: number
    subject: number
    body: number
    is_active: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type NotificationTemplateAvgAggregateInputType = {
    version?: true
  }

  export type NotificationTemplateSumAggregateInputType = {
    version?: true
  }

  export type NotificationTemplateMinAggregateInputType = {
    id?: true
    code?: true
    channel?: true
    version?: true
    subject?: true
    body?: true
    is_active?: true
    created_at?: true
    updated_at?: true
  }

  export type NotificationTemplateMaxAggregateInputType = {
    id?: true
    code?: true
    channel?: true
    version?: true
    subject?: true
    body?: true
    is_active?: true
    created_at?: true
    updated_at?: true
  }

  export type NotificationTemplateCountAggregateInputType = {
    id?: true
    code?: true
    channel?: true
    version?: true
    subject?: true
    body?: true
    is_active?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type NotificationTemplateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NotificationTemplate to aggregate.
     */
    where?: NotificationTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationTemplates to fetch.
     */
    orderBy?: NotificationTemplateOrderByWithRelationInput | NotificationTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned NotificationTemplates
    **/
    _count?: true | NotificationTemplateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: NotificationTemplateAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: NotificationTemplateSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationTemplateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationTemplateMaxAggregateInputType
  }

  export type GetNotificationTemplateAggregateType<T extends NotificationTemplateAggregateArgs> = {
        [P in keyof T & keyof AggregateNotificationTemplate]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotificationTemplate[P]>
      : GetScalarType<T[P], AggregateNotificationTemplate[P]>
  }




  export type NotificationTemplateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationTemplateWhereInput
    orderBy?: NotificationTemplateOrderByWithAggregationInput | NotificationTemplateOrderByWithAggregationInput[]
    by: NotificationTemplateScalarFieldEnum[] | NotificationTemplateScalarFieldEnum
    having?: NotificationTemplateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationTemplateCountAggregateInputType | true
    _avg?: NotificationTemplateAvgAggregateInputType
    _sum?: NotificationTemplateSumAggregateInputType
    _min?: NotificationTemplateMinAggregateInputType
    _max?: NotificationTemplateMaxAggregateInputType
  }

  export type NotificationTemplateGroupByOutputType = {
    id: string
    code: string
    channel: $Enums.NotificationChannel
    version: number
    subject: string | null
    body: string
    is_active: boolean
    created_at: Date
    updated_at: Date
    _count: NotificationTemplateCountAggregateOutputType | null
    _avg: NotificationTemplateAvgAggregateOutputType | null
    _sum: NotificationTemplateSumAggregateOutputType | null
    _min: NotificationTemplateMinAggregateOutputType | null
    _max: NotificationTemplateMaxAggregateOutputType | null
  }

  type GetNotificationTemplateGroupByPayload<T extends NotificationTemplateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationTemplateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationTemplateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationTemplateGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationTemplateGroupByOutputType[P]>
        }
      >
    >


  export type NotificationTemplateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    channel?: boolean
    version?: boolean
    subject?: boolean
    body?: boolean
    is_active?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["notificationTemplate"]>

  export type NotificationTemplateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    channel?: boolean
    version?: boolean
    subject?: boolean
    body?: boolean
    is_active?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["notificationTemplate"]>

  export type NotificationTemplateSelectScalar = {
    id?: boolean
    code?: boolean
    channel?: boolean
    version?: boolean
    subject?: boolean
    body?: boolean
    is_active?: boolean
    created_at?: boolean
    updated_at?: boolean
  }


  export type $NotificationTemplatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "NotificationTemplate"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      code: string
      channel: $Enums.NotificationChannel
      version: number
      subject: string | null
      body: string
      is_active: boolean
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["notificationTemplate"]>
    composites: {}
  }

  type NotificationTemplateGetPayload<S extends boolean | null | undefined | NotificationTemplateDefaultArgs> = $Result.GetResult<Prisma.$NotificationTemplatePayload, S>

  type NotificationTemplateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<NotificationTemplateFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: NotificationTemplateCountAggregateInputType | true
    }

  export interface NotificationTemplateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['NotificationTemplate'], meta: { name: 'NotificationTemplate' } }
    /**
     * Find zero or one NotificationTemplate that matches the filter.
     * @param {NotificationTemplateFindUniqueArgs} args - Arguments to find a NotificationTemplate
     * @example
     * // Get one NotificationTemplate
     * const notificationTemplate = await prisma.notificationTemplate.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationTemplateFindUniqueArgs>(args: SelectSubset<T, NotificationTemplateFindUniqueArgs<ExtArgs>>): Prisma__NotificationTemplateClient<$Result.GetResult<Prisma.$NotificationTemplatePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one NotificationTemplate that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {NotificationTemplateFindUniqueOrThrowArgs} args - Arguments to find a NotificationTemplate
     * @example
     * // Get one NotificationTemplate
     * const notificationTemplate = await prisma.notificationTemplate.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationTemplateFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationTemplateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationTemplateClient<$Result.GetResult<Prisma.$NotificationTemplatePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first NotificationTemplate that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationTemplateFindFirstArgs} args - Arguments to find a NotificationTemplate
     * @example
     * // Get one NotificationTemplate
     * const notificationTemplate = await prisma.notificationTemplate.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationTemplateFindFirstArgs>(args?: SelectSubset<T, NotificationTemplateFindFirstArgs<ExtArgs>>): Prisma__NotificationTemplateClient<$Result.GetResult<Prisma.$NotificationTemplatePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first NotificationTemplate that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationTemplateFindFirstOrThrowArgs} args - Arguments to find a NotificationTemplate
     * @example
     * // Get one NotificationTemplate
     * const notificationTemplate = await prisma.notificationTemplate.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationTemplateFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationTemplateFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationTemplateClient<$Result.GetResult<Prisma.$NotificationTemplatePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more NotificationTemplates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationTemplateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NotificationTemplates
     * const notificationTemplates = await prisma.notificationTemplate.findMany()
     * 
     * // Get first 10 NotificationTemplates
     * const notificationTemplates = await prisma.notificationTemplate.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationTemplateWithIdOnly = await prisma.notificationTemplate.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationTemplateFindManyArgs>(args?: SelectSubset<T, NotificationTemplateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationTemplatePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a NotificationTemplate.
     * @param {NotificationTemplateCreateArgs} args - Arguments to create a NotificationTemplate.
     * @example
     * // Create one NotificationTemplate
     * const NotificationTemplate = await prisma.notificationTemplate.create({
     *   data: {
     *     // ... data to create a NotificationTemplate
     *   }
     * })
     * 
     */
    create<T extends NotificationTemplateCreateArgs>(args: SelectSubset<T, NotificationTemplateCreateArgs<ExtArgs>>): Prisma__NotificationTemplateClient<$Result.GetResult<Prisma.$NotificationTemplatePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many NotificationTemplates.
     * @param {NotificationTemplateCreateManyArgs} args - Arguments to create many NotificationTemplates.
     * @example
     * // Create many NotificationTemplates
     * const notificationTemplate = await prisma.notificationTemplate.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationTemplateCreateManyArgs>(args?: SelectSubset<T, NotificationTemplateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many NotificationTemplates and returns the data saved in the database.
     * @param {NotificationTemplateCreateManyAndReturnArgs} args - Arguments to create many NotificationTemplates.
     * @example
     * // Create many NotificationTemplates
     * const notificationTemplate = await prisma.notificationTemplate.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many NotificationTemplates and only return the `id`
     * const notificationTemplateWithIdOnly = await prisma.notificationTemplate.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NotificationTemplateCreateManyAndReturnArgs>(args?: SelectSubset<T, NotificationTemplateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationTemplatePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a NotificationTemplate.
     * @param {NotificationTemplateDeleteArgs} args - Arguments to delete one NotificationTemplate.
     * @example
     * // Delete one NotificationTemplate
     * const NotificationTemplate = await prisma.notificationTemplate.delete({
     *   where: {
     *     // ... filter to delete one NotificationTemplate
     *   }
     * })
     * 
     */
    delete<T extends NotificationTemplateDeleteArgs>(args: SelectSubset<T, NotificationTemplateDeleteArgs<ExtArgs>>): Prisma__NotificationTemplateClient<$Result.GetResult<Prisma.$NotificationTemplatePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one NotificationTemplate.
     * @param {NotificationTemplateUpdateArgs} args - Arguments to update one NotificationTemplate.
     * @example
     * // Update one NotificationTemplate
     * const notificationTemplate = await prisma.notificationTemplate.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationTemplateUpdateArgs>(args: SelectSubset<T, NotificationTemplateUpdateArgs<ExtArgs>>): Prisma__NotificationTemplateClient<$Result.GetResult<Prisma.$NotificationTemplatePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more NotificationTemplates.
     * @param {NotificationTemplateDeleteManyArgs} args - Arguments to filter NotificationTemplates to delete.
     * @example
     * // Delete a few NotificationTemplates
     * const { count } = await prisma.notificationTemplate.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationTemplateDeleteManyArgs>(args?: SelectSubset<T, NotificationTemplateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NotificationTemplates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationTemplateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NotificationTemplates
     * const notificationTemplate = await prisma.notificationTemplate.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationTemplateUpdateManyArgs>(args: SelectSubset<T, NotificationTemplateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one NotificationTemplate.
     * @param {NotificationTemplateUpsertArgs} args - Arguments to update or create a NotificationTemplate.
     * @example
     * // Update or create a NotificationTemplate
     * const notificationTemplate = await prisma.notificationTemplate.upsert({
     *   create: {
     *     // ... data to create a NotificationTemplate
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NotificationTemplate we want to update
     *   }
     * })
     */
    upsert<T extends NotificationTemplateUpsertArgs>(args: SelectSubset<T, NotificationTemplateUpsertArgs<ExtArgs>>): Prisma__NotificationTemplateClient<$Result.GetResult<Prisma.$NotificationTemplatePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of NotificationTemplates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationTemplateCountArgs} args - Arguments to filter NotificationTemplates to count.
     * @example
     * // Count the number of NotificationTemplates
     * const count = await prisma.notificationTemplate.count({
     *   where: {
     *     // ... the filter for the NotificationTemplates we want to count
     *   }
     * })
    **/
    count<T extends NotificationTemplateCountArgs>(
      args?: Subset<T, NotificationTemplateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationTemplateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a NotificationTemplate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationTemplateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends NotificationTemplateAggregateArgs>(args: Subset<T, NotificationTemplateAggregateArgs>): Prisma.PrismaPromise<GetNotificationTemplateAggregateType<T>>

    /**
     * Group by NotificationTemplate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationTemplateGroupByArgs} args - Group by arguments.
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
      T extends NotificationTemplateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationTemplateGroupByArgs['orderBy'] }
        : { orderBy?: NotificationTemplateGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, NotificationTemplateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationTemplateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the NotificationTemplate model
   */
  readonly fields: NotificationTemplateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for NotificationTemplate.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationTemplateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the NotificationTemplate model
   */ 
  interface NotificationTemplateFieldRefs {
    readonly id: FieldRef<"NotificationTemplate", 'String'>
    readonly code: FieldRef<"NotificationTemplate", 'String'>
    readonly channel: FieldRef<"NotificationTemplate", 'NotificationChannel'>
    readonly version: FieldRef<"NotificationTemplate", 'Int'>
    readonly subject: FieldRef<"NotificationTemplate", 'String'>
    readonly body: FieldRef<"NotificationTemplate", 'String'>
    readonly is_active: FieldRef<"NotificationTemplate", 'Boolean'>
    readonly created_at: FieldRef<"NotificationTemplate", 'DateTime'>
    readonly updated_at: FieldRef<"NotificationTemplate", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * NotificationTemplate findUnique
   */
  export type NotificationTemplateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationTemplate
     */
    select?: NotificationTemplateSelect<ExtArgs> | null
    /**
     * Filter, which NotificationTemplate to fetch.
     */
    where: NotificationTemplateWhereUniqueInput
  }

  /**
   * NotificationTemplate findUniqueOrThrow
   */
  export type NotificationTemplateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationTemplate
     */
    select?: NotificationTemplateSelect<ExtArgs> | null
    /**
     * Filter, which NotificationTemplate to fetch.
     */
    where: NotificationTemplateWhereUniqueInput
  }

  /**
   * NotificationTemplate findFirst
   */
  export type NotificationTemplateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationTemplate
     */
    select?: NotificationTemplateSelect<ExtArgs> | null
    /**
     * Filter, which NotificationTemplate to fetch.
     */
    where?: NotificationTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationTemplates to fetch.
     */
    orderBy?: NotificationTemplateOrderByWithRelationInput | NotificationTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NotificationTemplates.
     */
    cursor?: NotificationTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NotificationTemplates.
     */
    distinct?: NotificationTemplateScalarFieldEnum | NotificationTemplateScalarFieldEnum[]
  }

  /**
   * NotificationTemplate findFirstOrThrow
   */
  export type NotificationTemplateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationTemplate
     */
    select?: NotificationTemplateSelect<ExtArgs> | null
    /**
     * Filter, which NotificationTemplate to fetch.
     */
    where?: NotificationTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationTemplates to fetch.
     */
    orderBy?: NotificationTemplateOrderByWithRelationInput | NotificationTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NotificationTemplates.
     */
    cursor?: NotificationTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NotificationTemplates.
     */
    distinct?: NotificationTemplateScalarFieldEnum | NotificationTemplateScalarFieldEnum[]
  }

  /**
   * NotificationTemplate findMany
   */
  export type NotificationTemplateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationTemplate
     */
    select?: NotificationTemplateSelect<ExtArgs> | null
    /**
     * Filter, which NotificationTemplates to fetch.
     */
    where?: NotificationTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationTemplates to fetch.
     */
    orderBy?: NotificationTemplateOrderByWithRelationInput | NotificationTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing NotificationTemplates.
     */
    cursor?: NotificationTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationTemplates.
     */
    skip?: number
    distinct?: NotificationTemplateScalarFieldEnum | NotificationTemplateScalarFieldEnum[]
  }

  /**
   * NotificationTemplate create
   */
  export type NotificationTemplateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationTemplate
     */
    select?: NotificationTemplateSelect<ExtArgs> | null
    /**
     * The data needed to create a NotificationTemplate.
     */
    data: XOR<NotificationTemplateCreateInput, NotificationTemplateUncheckedCreateInput>
  }

  /**
   * NotificationTemplate createMany
   */
  export type NotificationTemplateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many NotificationTemplates.
     */
    data: NotificationTemplateCreateManyInput | NotificationTemplateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NotificationTemplate createManyAndReturn
   */
  export type NotificationTemplateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationTemplate
     */
    select?: NotificationTemplateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many NotificationTemplates.
     */
    data: NotificationTemplateCreateManyInput | NotificationTemplateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NotificationTemplate update
   */
  export type NotificationTemplateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationTemplate
     */
    select?: NotificationTemplateSelect<ExtArgs> | null
    /**
     * The data needed to update a NotificationTemplate.
     */
    data: XOR<NotificationTemplateUpdateInput, NotificationTemplateUncheckedUpdateInput>
    /**
     * Choose, which NotificationTemplate to update.
     */
    where: NotificationTemplateWhereUniqueInput
  }

  /**
   * NotificationTemplate updateMany
   */
  export type NotificationTemplateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update NotificationTemplates.
     */
    data: XOR<NotificationTemplateUpdateManyMutationInput, NotificationTemplateUncheckedUpdateManyInput>
    /**
     * Filter which NotificationTemplates to update
     */
    where?: NotificationTemplateWhereInput
  }

  /**
   * NotificationTemplate upsert
   */
  export type NotificationTemplateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationTemplate
     */
    select?: NotificationTemplateSelect<ExtArgs> | null
    /**
     * The filter to search for the NotificationTemplate to update in case it exists.
     */
    where: NotificationTemplateWhereUniqueInput
    /**
     * In case the NotificationTemplate found by the `where` argument doesn't exist, create a new NotificationTemplate with this data.
     */
    create: XOR<NotificationTemplateCreateInput, NotificationTemplateUncheckedCreateInput>
    /**
     * In case the NotificationTemplate was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationTemplateUpdateInput, NotificationTemplateUncheckedUpdateInput>
  }

  /**
   * NotificationTemplate delete
   */
  export type NotificationTemplateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationTemplate
     */
    select?: NotificationTemplateSelect<ExtArgs> | null
    /**
     * Filter which NotificationTemplate to delete.
     */
    where: NotificationTemplateWhereUniqueInput
  }

  /**
   * NotificationTemplate deleteMany
   */
  export type NotificationTemplateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NotificationTemplates to delete
     */
    where?: NotificationTemplateWhereInput
  }

  /**
   * NotificationTemplate without action
   */
  export type NotificationTemplateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationTemplate
     */
    select?: NotificationTemplateSelect<ExtArgs> | null
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
   * Model KafkaDlqRecord
   */

  export type AggregateKafkaDlqRecord = {
    _count: KafkaDlqRecordCountAggregateOutputType | null
    _avg: KafkaDlqRecordAvgAggregateOutputType | null
    _sum: KafkaDlqRecordSumAggregateOutputType | null
    _min: KafkaDlqRecordMinAggregateOutputType | null
    _max: KafkaDlqRecordMaxAggregateOutputType | null
  }

  export type KafkaDlqRecordAvgAggregateOutputType = {
    original_partition: number | null
  }

  export type KafkaDlqRecordSumAggregateOutputType = {
    original_partition: number | null
  }

  export type KafkaDlqRecordMinAggregateOutputType = {
    id: string | null
    event_id: string | null
    event_type: string | null
    original_topic: string | null
    original_partition: number | null
    original_offset: string | null
    consumer_group: string | null
    failure_reason: string | null
    error_message: string | null
    status: $Enums.KafkaDlqStatus | null
    replayed_topic: string | null
    replayed_at: Date | null
    replayed_by: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type KafkaDlqRecordMaxAggregateOutputType = {
    id: string | null
    event_id: string | null
    event_type: string | null
    original_topic: string | null
    original_partition: number | null
    original_offset: string | null
    consumer_group: string | null
    failure_reason: string | null
    error_message: string | null
    status: $Enums.KafkaDlqStatus | null
    replayed_topic: string | null
    replayed_at: Date | null
    replayed_by: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type KafkaDlqRecordCountAggregateOutputType = {
    id: number
    event_id: number
    event_type: number
    original_topic: number
    original_partition: number
    original_offset: number
    consumer_group: number
    failure_reason: number
    error_message: number
    payload: number
    status: number
    replayed_topic: number
    replayed_at: number
    replayed_by: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type KafkaDlqRecordAvgAggregateInputType = {
    original_partition?: true
  }

  export type KafkaDlqRecordSumAggregateInputType = {
    original_partition?: true
  }

  export type KafkaDlqRecordMinAggregateInputType = {
    id?: true
    event_id?: true
    event_type?: true
    original_topic?: true
    original_partition?: true
    original_offset?: true
    consumer_group?: true
    failure_reason?: true
    error_message?: true
    status?: true
    replayed_topic?: true
    replayed_at?: true
    replayed_by?: true
    created_at?: true
    updated_at?: true
  }

  export type KafkaDlqRecordMaxAggregateInputType = {
    id?: true
    event_id?: true
    event_type?: true
    original_topic?: true
    original_partition?: true
    original_offset?: true
    consumer_group?: true
    failure_reason?: true
    error_message?: true
    status?: true
    replayed_topic?: true
    replayed_at?: true
    replayed_by?: true
    created_at?: true
    updated_at?: true
  }

  export type KafkaDlqRecordCountAggregateInputType = {
    id?: true
    event_id?: true
    event_type?: true
    original_topic?: true
    original_partition?: true
    original_offset?: true
    consumer_group?: true
    failure_reason?: true
    error_message?: true
    payload?: true
    status?: true
    replayed_topic?: true
    replayed_at?: true
    replayed_by?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type KafkaDlqRecordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KafkaDlqRecord to aggregate.
     */
    where?: KafkaDlqRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KafkaDlqRecords to fetch.
     */
    orderBy?: KafkaDlqRecordOrderByWithRelationInput | KafkaDlqRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: KafkaDlqRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KafkaDlqRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KafkaDlqRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned KafkaDlqRecords
    **/
    _count?: true | KafkaDlqRecordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: KafkaDlqRecordAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: KafkaDlqRecordSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: KafkaDlqRecordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: KafkaDlqRecordMaxAggregateInputType
  }

  export type GetKafkaDlqRecordAggregateType<T extends KafkaDlqRecordAggregateArgs> = {
        [P in keyof T & keyof AggregateKafkaDlqRecord]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateKafkaDlqRecord[P]>
      : GetScalarType<T[P], AggregateKafkaDlqRecord[P]>
  }




  export type KafkaDlqRecordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KafkaDlqRecordWhereInput
    orderBy?: KafkaDlqRecordOrderByWithAggregationInput | KafkaDlqRecordOrderByWithAggregationInput[]
    by: KafkaDlqRecordScalarFieldEnum[] | KafkaDlqRecordScalarFieldEnum
    having?: KafkaDlqRecordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: KafkaDlqRecordCountAggregateInputType | true
    _avg?: KafkaDlqRecordAvgAggregateInputType
    _sum?: KafkaDlqRecordSumAggregateInputType
    _min?: KafkaDlqRecordMinAggregateInputType
    _max?: KafkaDlqRecordMaxAggregateInputType
  }

  export type KafkaDlqRecordGroupByOutputType = {
    id: string
    event_id: string
    event_type: string
    original_topic: string
    original_partition: number
    original_offset: string
    consumer_group: string
    failure_reason: string | null
    error_message: string | null
    payload: JsonValue
    status: $Enums.KafkaDlqStatus
    replayed_topic: string | null
    replayed_at: Date | null
    replayed_by: string | null
    created_at: Date
    updated_at: Date
    _count: KafkaDlqRecordCountAggregateOutputType | null
    _avg: KafkaDlqRecordAvgAggregateOutputType | null
    _sum: KafkaDlqRecordSumAggregateOutputType | null
    _min: KafkaDlqRecordMinAggregateOutputType | null
    _max: KafkaDlqRecordMaxAggregateOutputType | null
  }

  type GetKafkaDlqRecordGroupByPayload<T extends KafkaDlqRecordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<KafkaDlqRecordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof KafkaDlqRecordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], KafkaDlqRecordGroupByOutputType[P]>
            : GetScalarType<T[P], KafkaDlqRecordGroupByOutputType[P]>
        }
      >
    >


  export type KafkaDlqRecordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    event_id?: boolean
    event_type?: boolean
    original_topic?: boolean
    original_partition?: boolean
    original_offset?: boolean
    consumer_group?: boolean
    failure_reason?: boolean
    error_message?: boolean
    payload?: boolean
    status?: boolean
    replayed_topic?: boolean
    replayed_at?: boolean
    replayed_by?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["kafkaDlqRecord"]>

  export type KafkaDlqRecordSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    event_id?: boolean
    event_type?: boolean
    original_topic?: boolean
    original_partition?: boolean
    original_offset?: boolean
    consumer_group?: boolean
    failure_reason?: boolean
    error_message?: boolean
    payload?: boolean
    status?: boolean
    replayed_topic?: boolean
    replayed_at?: boolean
    replayed_by?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["kafkaDlqRecord"]>

  export type KafkaDlqRecordSelectScalar = {
    id?: boolean
    event_id?: boolean
    event_type?: boolean
    original_topic?: boolean
    original_partition?: boolean
    original_offset?: boolean
    consumer_group?: boolean
    failure_reason?: boolean
    error_message?: boolean
    payload?: boolean
    status?: boolean
    replayed_topic?: boolean
    replayed_at?: boolean
    replayed_by?: boolean
    created_at?: boolean
    updated_at?: boolean
  }


  export type $KafkaDlqRecordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "KafkaDlqRecord"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      event_id: string
      event_type: string
      original_topic: string
      original_partition: number
      original_offset: string
      consumer_group: string
      failure_reason: string | null
      error_message: string | null
      payload: Prisma.JsonValue
      status: $Enums.KafkaDlqStatus
      replayed_topic: string | null
      replayed_at: Date | null
      replayed_by: string | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["kafkaDlqRecord"]>
    composites: {}
  }

  type KafkaDlqRecordGetPayload<S extends boolean | null | undefined | KafkaDlqRecordDefaultArgs> = $Result.GetResult<Prisma.$KafkaDlqRecordPayload, S>

  type KafkaDlqRecordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<KafkaDlqRecordFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: KafkaDlqRecordCountAggregateInputType | true
    }

  export interface KafkaDlqRecordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['KafkaDlqRecord'], meta: { name: 'KafkaDlqRecord' } }
    /**
     * Find zero or one KafkaDlqRecord that matches the filter.
     * @param {KafkaDlqRecordFindUniqueArgs} args - Arguments to find a KafkaDlqRecord
     * @example
     * // Get one KafkaDlqRecord
     * const kafkaDlqRecord = await prisma.kafkaDlqRecord.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends KafkaDlqRecordFindUniqueArgs>(args: SelectSubset<T, KafkaDlqRecordFindUniqueArgs<ExtArgs>>): Prisma__KafkaDlqRecordClient<$Result.GetResult<Prisma.$KafkaDlqRecordPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one KafkaDlqRecord that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {KafkaDlqRecordFindUniqueOrThrowArgs} args - Arguments to find a KafkaDlqRecord
     * @example
     * // Get one KafkaDlqRecord
     * const kafkaDlqRecord = await prisma.kafkaDlqRecord.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends KafkaDlqRecordFindUniqueOrThrowArgs>(args: SelectSubset<T, KafkaDlqRecordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__KafkaDlqRecordClient<$Result.GetResult<Prisma.$KafkaDlqRecordPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first KafkaDlqRecord that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KafkaDlqRecordFindFirstArgs} args - Arguments to find a KafkaDlqRecord
     * @example
     * // Get one KafkaDlqRecord
     * const kafkaDlqRecord = await prisma.kafkaDlqRecord.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends KafkaDlqRecordFindFirstArgs>(args?: SelectSubset<T, KafkaDlqRecordFindFirstArgs<ExtArgs>>): Prisma__KafkaDlqRecordClient<$Result.GetResult<Prisma.$KafkaDlqRecordPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first KafkaDlqRecord that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KafkaDlqRecordFindFirstOrThrowArgs} args - Arguments to find a KafkaDlqRecord
     * @example
     * // Get one KafkaDlqRecord
     * const kafkaDlqRecord = await prisma.kafkaDlqRecord.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends KafkaDlqRecordFindFirstOrThrowArgs>(args?: SelectSubset<T, KafkaDlqRecordFindFirstOrThrowArgs<ExtArgs>>): Prisma__KafkaDlqRecordClient<$Result.GetResult<Prisma.$KafkaDlqRecordPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more KafkaDlqRecords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KafkaDlqRecordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all KafkaDlqRecords
     * const kafkaDlqRecords = await prisma.kafkaDlqRecord.findMany()
     * 
     * // Get first 10 KafkaDlqRecords
     * const kafkaDlqRecords = await prisma.kafkaDlqRecord.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const kafkaDlqRecordWithIdOnly = await prisma.kafkaDlqRecord.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends KafkaDlqRecordFindManyArgs>(args?: SelectSubset<T, KafkaDlqRecordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KafkaDlqRecordPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a KafkaDlqRecord.
     * @param {KafkaDlqRecordCreateArgs} args - Arguments to create a KafkaDlqRecord.
     * @example
     * // Create one KafkaDlqRecord
     * const KafkaDlqRecord = await prisma.kafkaDlqRecord.create({
     *   data: {
     *     // ... data to create a KafkaDlqRecord
     *   }
     * })
     * 
     */
    create<T extends KafkaDlqRecordCreateArgs>(args: SelectSubset<T, KafkaDlqRecordCreateArgs<ExtArgs>>): Prisma__KafkaDlqRecordClient<$Result.GetResult<Prisma.$KafkaDlqRecordPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many KafkaDlqRecords.
     * @param {KafkaDlqRecordCreateManyArgs} args - Arguments to create many KafkaDlqRecords.
     * @example
     * // Create many KafkaDlqRecords
     * const kafkaDlqRecord = await prisma.kafkaDlqRecord.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends KafkaDlqRecordCreateManyArgs>(args?: SelectSubset<T, KafkaDlqRecordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many KafkaDlqRecords and returns the data saved in the database.
     * @param {KafkaDlqRecordCreateManyAndReturnArgs} args - Arguments to create many KafkaDlqRecords.
     * @example
     * // Create many KafkaDlqRecords
     * const kafkaDlqRecord = await prisma.kafkaDlqRecord.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many KafkaDlqRecords and only return the `id`
     * const kafkaDlqRecordWithIdOnly = await prisma.kafkaDlqRecord.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends KafkaDlqRecordCreateManyAndReturnArgs>(args?: SelectSubset<T, KafkaDlqRecordCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KafkaDlqRecordPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a KafkaDlqRecord.
     * @param {KafkaDlqRecordDeleteArgs} args - Arguments to delete one KafkaDlqRecord.
     * @example
     * // Delete one KafkaDlqRecord
     * const KafkaDlqRecord = await prisma.kafkaDlqRecord.delete({
     *   where: {
     *     // ... filter to delete one KafkaDlqRecord
     *   }
     * })
     * 
     */
    delete<T extends KafkaDlqRecordDeleteArgs>(args: SelectSubset<T, KafkaDlqRecordDeleteArgs<ExtArgs>>): Prisma__KafkaDlqRecordClient<$Result.GetResult<Prisma.$KafkaDlqRecordPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one KafkaDlqRecord.
     * @param {KafkaDlqRecordUpdateArgs} args - Arguments to update one KafkaDlqRecord.
     * @example
     * // Update one KafkaDlqRecord
     * const kafkaDlqRecord = await prisma.kafkaDlqRecord.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends KafkaDlqRecordUpdateArgs>(args: SelectSubset<T, KafkaDlqRecordUpdateArgs<ExtArgs>>): Prisma__KafkaDlqRecordClient<$Result.GetResult<Prisma.$KafkaDlqRecordPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more KafkaDlqRecords.
     * @param {KafkaDlqRecordDeleteManyArgs} args - Arguments to filter KafkaDlqRecords to delete.
     * @example
     * // Delete a few KafkaDlqRecords
     * const { count } = await prisma.kafkaDlqRecord.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends KafkaDlqRecordDeleteManyArgs>(args?: SelectSubset<T, KafkaDlqRecordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KafkaDlqRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KafkaDlqRecordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many KafkaDlqRecords
     * const kafkaDlqRecord = await prisma.kafkaDlqRecord.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends KafkaDlqRecordUpdateManyArgs>(args: SelectSubset<T, KafkaDlqRecordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one KafkaDlqRecord.
     * @param {KafkaDlqRecordUpsertArgs} args - Arguments to update or create a KafkaDlqRecord.
     * @example
     * // Update or create a KafkaDlqRecord
     * const kafkaDlqRecord = await prisma.kafkaDlqRecord.upsert({
     *   create: {
     *     // ... data to create a KafkaDlqRecord
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the KafkaDlqRecord we want to update
     *   }
     * })
     */
    upsert<T extends KafkaDlqRecordUpsertArgs>(args: SelectSubset<T, KafkaDlqRecordUpsertArgs<ExtArgs>>): Prisma__KafkaDlqRecordClient<$Result.GetResult<Prisma.$KafkaDlqRecordPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of KafkaDlqRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KafkaDlqRecordCountArgs} args - Arguments to filter KafkaDlqRecords to count.
     * @example
     * // Count the number of KafkaDlqRecords
     * const count = await prisma.kafkaDlqRecord.count({
     *   where: {
     *     // ... the filter for the KafkaDlqRecords we want to count
     *   }
     * })
    **/
    count<T extends KafkaDlqRecordCountArgs>(
      args?: Subset<T, KafkaDlqRecordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], KafkaDlqRecordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a KafkaDlqRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KafkaDlqRecordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends KafkaDlqRecordAggregateArgs>(args: Subset<T, KafkaDlqRecordAggregateArgs>): Prisma.PrismaPromise<GetKafkaDlqRecordAggregateType<T>>

    /**
     * Group by KafkaDlqRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KafkaDlqRecordGroupByArgs} args - Group by arguments.
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
      T extends KafkaDlqRecordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: KafkaDlqRecordGroupByArgs['orderBy'] }
        : { orderBy?: KafkaDlqRecordGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, KafkaDlqRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetKafkaDlqRecordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the KafkaDlqRecord model
   */
  readonly fields: KafkaDlqRecordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for KafkaDlqRecord.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__KafkaDlqRecordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the KafkaDlqRecord model
   */ 
  interface KafkaDlqRecordFieldRefs {
    readonly id: FieldRef<"KafkaDlqRecord", 'String'>
    readonly event_id: FieldRef<"KafkaDlqRecord", 'String'>
    readonly event_type: FieldRef<"KafkaDlqRecord", 'String'>
    readonly original_topic: FieldRef<"KafkaDlqRecord", 'String'>
    readonly original_partition: FieldRef<"KafkaDlqRecord", 'Int'>
    readonly original_offset: FieldRef<"KafkaDlqRecord", 'String'>
    readonly consumer_group: FieldRef<"KafkaDlqRecord", 'String'>
    readonly failure_reason: FieldRef<"KafkaDlqRecord", 'String'>
    readonly error_message: FieldRef<"KafkaDlqRecord", 'String'>
    readonly payload: FieldRef<"KafkaDlqRecord", 'Json'>
    readonly status: FieldRef<"KafkaDlqRecord", 'KafkaDlqStatus'>
    readonly replayed_topic: FieldRef<"KafkaDlqRecord", 'String'>
    readonly replayed_at: FieldRef<"KafkaDlqRecord", 'DateTime'>
    readonly replayed_by: FieldRef<"KafkaDlqRecord", 'String'>
    readonly created_at: FieldRef<"KafkaDlqRecord", 'DateTime'>
    readonly updated_at: FieldRef<"KafkaDlqRecord", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * KafkaDlqRecord findUnique
   */
  export type KafkaDlqRecordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KafkaDlqRecord
     */
    select?: KafkaDlqRecordSelect<ExtArgs> | null
    /**
     * Filter, which KafkaDlqRecord to fetch.
     */
    where: KafkaDlqRecordWhereUniqueInput
  }

  /**
   * KafkaDlqRecord findUniqueOrThrow
   */
  export type KafkaDlqRecordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KafkaDlqRecord
     */
    select?: KafkaDlqRecordSelect<ExtArgs> | null
    /**
     * Filter, which KafkaDlqRecord to fetch.
     */
    where: KafkaDlqRecordWhereUniqueInput
  }

  /**
   * KafkaDlqRecord findFirst
   */
  export type KafkaDlqRecordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KafkaDlqRecord
     */
    select?: KafkaDlqRecordSelect<ExtArgs> | null
    /**
     * Filter, which KafkaDlqRecord to fetch.
     */
    where?: KafkaDlqRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KafkaDlqRecords to fetch.
     */
    orderBy?: KafkaDlqRecordOrderByWithRelationInput | KafkaDlqRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KafkaDlqRecords.
     */
    cursor?: KafkaDlqRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KafkaDlqRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KafkaDlqRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KafkaDlqRecords.
     */
    distinct?: KafkaDlqRecordScalarFieldEnum | KafkaDlqRecordScalarFieldEnum[]
  }

  /**
   * KafkaDlqRecord findFirstOrThrow
   */
  export type KafkaDlqRecordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KafkaDlqRecord
     */
    select?: KafkaDlqRecordSelect<ExtArgs> | null
    /**
     * Filter, which KafkaDlqRecord to fetch.
     */
    where?: KafkaDlqRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KafkaDlqRecords to fetch.
     */
    orderBy?: KafkaDlqRecordOrderByWithRelationInput | KafkaDlqRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KafkaDlqRecords.
     */
    cursor?: KafkaDlqRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KafkaDlqRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KafkaDlqRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KafkaDlqRecords.
     */
    distinct?: KafkaDlqRecordScalarFieldEnum | KafkaDlqRecordScalarFieldEnum[]
  }

  /**
   * KafkaDlqRecord findMany
   */
  export type KafkaDlqRecordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KafkaDlqRecord
     */
    select?: KafkaDlqRecordSelect<ExtArgs> | null
    /**
     * Filter, which KafkaDlqRecords to fetch.
     */
    where?: KafkaDlqRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KafkaDlqRecords to fetch.
     */
    orderBy?: KafkaDlqRecordOrderByWithRelationInput | KafkaDlqRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing KafkaDlqRecords.
     */
    cursor?: KafkaDlqRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KafkaDlqRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KafkaDlqRecords.
     */
    skip?: number
    distinct?: KafkaDlqRecordScalarFieldEnum | KafkaDlqRecordScalarFieldEnum[]
  }

  /**
   * KafkaDlqRecord create
   */
  export type KafkaDlqRecordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KafkaDlqRecord
     */
    select?: KafkaDlqRecordSelect<ExtArgs> | null
    /**
     * The data needed to create a KafkaDlqRecord.
     */
    data: XOR<KafkaDlqRecordCreateInput, KafkaDlqRecordUncheckedCreateInput>
  }

  /**
   * KafkaDlqRecord createMany
   */
  export type KafkaDlqRecordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many KafkaDlqRecords.
     */
    data: KafkaDlqRecordCreateManyInput | KafkaDlqRecordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * KafkaDlqRecord createManyAndReturn
   */
  export type KafkaDlqRecordCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KafkaDlqRecord
     */
    select?: KafkaDlqRecordSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many KafkaDlqRecords.
     */
    data: KafkaDlqRecordCreateManyInput | KafkaDlqRecordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * KafkaDlqRecord update
   */
  export type KafkaDlqRecordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KafkaDlqRecord
     */
    select?: KafkaDlqRecordSelect<ExtArgs> | null
    /**
     * The data needed to update a KafkaDlqRecord.
     */
    data: XOR<KafkaDlqRecordUpdateInput, KafkaDlqRecordUncheckedUpdateInput>
    /**
     * Choose, which KafkaDlqRecord to update.
     */
    where: KafkaDlqRecordWhereUniqueInput
  }

  /**
   * KafkaDlqRecord updateMany
   */
  export type KafkaDlqRecordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update KafkaDlqRecords.
     */
    data: XOR<KafkaDlqRecordUpdateManyMutationInput, KafkaDlqRecordUncheckedUpdateManyInput>
    /**
     * Filter which KafkaDlqRecords to update
     */
    where?: KafkaDlqRecordWhereInput
  }

  /**
   * KafkaDlqRecord upsert
   */
  export type KafkaDlqRecordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KafkaDlqRecord
     */
    select?: KafkaDlqRecordSelect<ExtArgs> | null
    /**
     * The filter to search for the KafkaDlqRecord to update in case it exists.
     */
    where: KafkaDlqRecordWhereUniqueInput
    /**
     * In case the KafkaDlqRecord found by the `where` argument doesn't exist, create a new KafkaDlqRecord with this data.
     */
    create: XOR<KafkaDlqRecordCreateInput, KafkaDlqRecordUncheckedCreateInput>
    /**
     * In case the KafkaDlqRecord was found with the provided `where` argument, update it with this data.
     */
    update: XOR<KafkaDlqRecordUpdateInput, KafkaDlqRecordUncheckedUpdateInput>
  }

  /**
   * KafkaDlqRecord delete
   */
  export type KafkaDlqRecordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KafkaDlqRecord
     */
    select?: KafkaDlqRecordSelect<ExtArgs> | null
    /**
     * Filter which KafkaDlqRecord to delete.
     */
    where: KafkaDlqRecordWhereUniqueInput
  }

  /**
   * KafkaDlqRecord deleteMany
   */
  export type KafkaDlqRecordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KafkaDlqRecords to delete
     */
    where?: KafkaDlqRecordWhereInput
  }

  /**
   * KafkaDlqRecord without action
   */
  export type KafkaDlqRecordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KafkaDlqRecord
     */
    select?: KafkaDlqRecordSelect<ExtArgs> | null
  }


  /**
   * Model NotificationOutbox
   */

  export type AggregateNotificationOutbox = {
    _count: NotificationOutboxCountAggregateOutputType | null
    _avg: NotificationOutboxAvgAggregateOutputType | null
    _sum: NotificationOutboxSumAggregateOutputType | null
    _min: NotificationOutboxMinAggregateOutputType | null
    _max: NotificationOutboxMaxAggregateOutputType | null
  }

  export type NotificationOutboxAvgAggregateOutputType = {
    retry_count: number | null
    max_retries: number | null
  }

  export type NotificationOutboxSumAggregateOutputType = {
    retry_count: number | null
    max_retries: number | null
  }

  export type NotificationOutboxMinAggregateOutputType = {
    id: string | null
    notification_id: string | null
    user_id: string | null
    channel: $Enums.NotificationChannel | null
    recipient: string | null
    subject: string | null
    content: string | null
    idempotency_key: string | null
    status: $Enums.NotificationOutboxStatus | null
    retry_count: number | null
    max_retries: number | null
    next_retry_at: Date | null
    locked_at: Date | null
    locked_by: string | null
    last_error: string | null
    provider_message_id: string | null
    created_at: Date | null
    sent_at: Date | null
  }

  export type NotificationOutboxMaxAggregateOutputType = {
    id: string | null
    notification_id: string | null
    user_id: string | null
    channel: $Enums.NotificationChannel | null
    recipient: string | null
    subject: string | null
    content: string | null
    idempotency_key: string | null
    status: $Enums.NotificationOutboxStatus | null
    retry_count: number | null
    max_retries: number | null
    next_retry_at: Date | null
    locked_at: Date | null
    locked_by: string | null
    last_error: string | null
    provider_message_id: string | null
    created_at: Date | null
    sent_at: Date | null
  }

  export type NotificationOutboxCountAggregateOutputType = {
    id: number
    notification_id: number
    user_id: number
    channel: number
    recipient: number
    subject: number
    content: number
    idempotency_key: number
    status: number
    retry_count: number
    max_retries: number
    next_retry_at: number
    locked_at: number
    locked_by: number
    last_error: number
    provider_message_id: number
    created_at: number
    sent_at: number
    _all: number
  }


  export type NotificationOutboxAvgAggregateInputType = {
    retry_count?: true
    max_retries?: true
  }

  export type NotificationOutboxSumAggregateInputType = {
    retry_count?: true
    max_retries?: true
  }

  export type NotificationOutboxMinAggregateInputType = {
    id?: true
    notification_id?: true
    user_id?: true
    channel?: true
    recipient?: true
    subject?: true
    content?: true
    idempotency_key?: true
    status?: true
    retry_count?: true
    max_retries?: true
    next_retry_at?: true
    locked_at?: true
    locked_by?: true
    last_error?: true
    provider_message_id?: true
    created_at?: true
    sent_at?: true
  }

  export type NotificationOutboxMaxAggregateInputType = {
    id?: true
    notification_id?: true
    user_id?: true
    channel?: true
    recipient?: true
    subject?: true
    content?: true
    idempotency_key?: true
    status?: true
    retry_count?: true
    max_retries?: true
    next_retry_at?: true
    locked_at?: true
    locked_by?: true
    last_error?: true
    provider_message_id?: true
    created_at?: true
    sent_at?: true
  }

  export type NotificationOutboxCountAggregateInputType = {
    id?: true
    notification_id?: true
    user_id?: true
    channel?: true
    recipient?: true
    subject?: true
    content?: true
    idempotency_key?: true
    status?: true
    retry_count?: true
    max_retries?: true
    next_retry_at?: true
    locked_at?: true
    locked_by?: true
    last_error?: true
    provider_message_id?: true
    created_at?: true
    sent_at?: true
    _all?: true
  }

  export type NotificationOutboxAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NotificationOutbox to aggregate.
     */
    where?: NotificationOutboxWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationOutboxes to fetch.
     */
    orderBy?: NotificationOutboxOrderByWithRelationInput | NotificationOutboxOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationOutboxWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationOutboxes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationOutboxes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned NotificationOutboxes
    **/
    _count?: true | NotificationOutboxCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: NotificationOutboxAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: NotificationOutboxSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationOutboxMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationOutboxMaxAggregateInputType
  }

  export type GetNotificationOutboxAggregateType<T extends NotificationOutboxAggregateArgs> = {
        [P in keyof T & keyof AggregateNotificationOutbox]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotificationOutbox[P]>
      : GetScalarType<T[P], AggregateNotificationOutbox[P]>
  }




  export type NotificationOutboxGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationOutboxWhereInput
    orderBy?: NotificationOutboxOrderByWithAggregationInput | NotificationOutboxOrderByWithAggregationInput[]
    by: NotificationOutboxScalarFieldEnum[] | NotificationOutboxScalarFieldEnum
    having?: NotificationOutboxScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationOutboxCountAggregateInputType | true
    _avg?: NotificationOutboxAvgAggregateInputType
    _sum?: NotificationOutboxSumAggregateInputType
    _min?: NotificationOutboxMinAggregateInputType
    _max?: NotificationOutboxMaxAggregateInputType
  }

  export type NotificationOutboxGroupByOutputType = {
    id: string
    notification_id: string
    user_id: string
    channel: $Enums.NotificationChannel
    recipient: string
    subject: string | null
    content: string
    idempotency_key: string | null
    status: $Enums.NotificationOutboxStatus
    retry_count: number
    max_retries: number
    next_retry_at: Date | null
    locked_at: Date | null
    locked_by: string | null
    last_error: string | null
    provider_message_id: string | null
    created_at: Date
    sent_at: Date | null
    _count: NotificationOutboxCountAggregateOutputType | null
    _avg: NotificationOutboxAvgAggregateOutputType | null
    _sum: NotificationOutboxSumAggregateOutputType | null
    _min: NotificationOutboxMinAggregateOutputType | null
    _max: NotificationOutboxMaxAggregateOutputType | null
  }

  type GetNotificationOutboxGroupByPayload<T extends NotificationOutboxGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationOutboxGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationOutboxGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationOutboxGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationOutboxGroupByOutputType[P]>
        }
      >
    >


  export type NotificationOutboxSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    notification_id?: boolean
    user_id?: boolean
    channel?: boolean
    recipient?: boolean
    subject?: boolean
    content?: boolean
    idempotency_key?: boolean
    status?: boolean
    retry_count?: boolean
    max_retries?: boolean
    next_retry_at?: boolean
    locked_at?: boolean
    locked_by?: boolean
    last_error?: boolean
    provider_message_id?: boolean
    created_at?: boolean
    sent_at?: boolean
  }, ExtArgs["result"]["notificationOutbox"]>

  export type NotificationOutboxSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    notification_id?: boolean
    user_id?: boolean
    channel?: boolean
    recipient?: boolean
    subject?: boolean
    content?: boolean
    idempotency_key?: boolean
    status?: boolean
    retry_count?: boolean
    max_retries?: boolean
    next_retry_at?: boolean
    locked_at?: boolean
    locked_by?: boolean
    last_error?: boolean
    provider_message_id?: boolean
    created_at?: boolean
    sent_at?: boolean
  }, ExtArgs["result"]["notificationOutbox"]>

  export type NotificationOutboxSelectScalar = {
    id?: boolean
    notification_id?: boolean
    user_id?: boolean
    channel?: boolean
    recipient?: boolean
    subject?: boolean
    content?: boolean
    idempotency_key?: boolean
    status?: boolean
    retry_count?: boolean
    max_retries?: boolean
    next_retry_at?: boolean
    locked_at?: boolean
    locked_by?: boolean
    last_error?: boolean
    provider_message_id?: boolean
    created_at?: boolean
    sent_at?: boolean
  }


  export type $NotificationOutboxPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "NotificationOutbox"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      notification_id: string
      user_id: string
      channel: $Enums.NotificationChannel
      recipient: string
      subject: string | null
      content: string
      idempotency_key: string | null
      status: $Enums.NotificationOutboxStatus
      retry_count: number
      max_retries: number
      next_retry_at: Date | null
      locked_at: Date | null
      locked_by: string | null
      last_error: string | null
      provider_message_id: string | null
      created_at: Date
      sent_at: Date | null
    }, ExtArgs["result"]["notificationOutbox"]>
    composites: {}
  }

  type NotificationOutboxGetPayload<S extends boolean | null | undefined | NotificationOutboxDefaultArgs> = $Result.GetResult<Prisma.$NotificationOutboxPayload, S>

  type NotificationOutboxCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<NotificationOutboxFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: NotificationOutboxCountAggregateInputType | true
    }

  export interface NotificationOutboxDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['NotificationOutbox'], meta: { name: 'NotificationOutbox' } }
    /**
     * Find zero or one NotificationOutbox that matches the filter.
     * @param {NotificationOutboxFindUniqueArgs} args - Arguments to find a NotificationOutbox
     * @example
     * // Get one NotificationOutbox
     * const notificationOutbox = await prisma.notificationOutbox.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationOutboxFindUniqueArgs>(args: SelectSubset<T, NotificationOutboxFindUniqueArgs<ExtArgs>>): Prisma__NotificationOutboxClient<$Result.GetResult<Prisma.$NotificationOutboxPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one NotificationOutbox that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {NotificationOutboxFindUniqueOrThrowArgs} args - Arguments to find a NotificationOutbox
     * @example
     * // Get one NotificationOutbox
     * const notificationOutbox = await prisma.notificationOutbox.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationOutboxFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationOutboxFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationOutboxClient<$Result.GetResult<Prisma.$NotificationOutboxPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first NotificationOutbox that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationOutboxFindFirstArgs} args - Arguments to find a NotificationOutbox
     * @example
     * // Get one NotificationOutbox
     * const notificationOutbox = await prisma.notificationOutbox.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationOutboxFindFirstArgs>(args?: SelectSubset<T, NotificationOutboxFindFirstArgs<ExtArgs>>): Prisma__NotificationOutboxClient<$Result.GetResult<Prisma.$NotificationOutboxPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first NotificationOutbox that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationOutboxFindFirstOrThrowArgs} args - Arguments to find a NotificationOutbox
     * @example
     * // Get one NotificationOutbox
     * const notificationOutbox = await prisma.notificationOutbox.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationOutboxFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationOutboxFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationOutboxClient<$Result.GetResult<Prisma.$NotificationOutboxPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more NotificationOutboxes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationOutboxFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NotificationOutboxes
     * const notificationOutboxes = await prisma.notificationOutbox.findMany()
     * 
     * // Get first 10 NotificationOutboxes
     * const notificationOutboxes = await prisma.notificationOutbox.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationOutboxWithIdOnly = await prisma.notificationOutbox.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationOutboxFindManyArgs>(args?: SelectSubset<T, NotificationOutboxFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationOutboxPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a NotificationOutbox.
     * @param {NotificationOutboxCreateArgs} args - Arguments to create a NotificationOutbox.
     * @example
     * // Create one NotificationOutbox
     * const NotificationOutbox = await prisma.notificationOutbox.create({
     *   data: {
     *     // ... data to create a NotificationOutbox
     *   }
     * })
     * 
     */
    create<T extends NotificationOutboxCreateArgs>(args: SelectSubset<T, NotificationOutboxCreateArgs<ExtArgs>>): Prisma__NotificationOutboxClient<$Result.GetResult<Prisma.$NotificationOutboxPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many NotificationOutboxes.
     * @param {NotificationOutboxCreateManyArgs} args - Arguments to create many NotificationOutboxes.
     * @example
     * // Create many NotificationOutboxes
     * const notificationOutbox = await prisma.notificationOutbox.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationOutboxCreateManyArgs>(args?: SelectSubset<T, NotificationOutboxCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many NotificationOutboxes and returns the data saved in the database.
     * @param {NotificationOutboxCreateManyAndReturnArgs} args - Arguments to create many NotificationOutboxes.
     * @example
     * // Create many NotificationOutboxes
     * const notificationOutbox = await prisma.notificationOutbox.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many NotificationOutboxes and only return the `id`
     * const notificationOutboxWithIdOnly = await prisma.notificationOutbox.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NotificationOutboxCreateManyAndReturnArgs>(args?: SelectSubset<T, NotificationOutboxCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationOutboxPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a NotificationOutbox.
     * @param {NotificationOutboxDeleteArgs} args - Arguments to delete one NotificationOutbox.
     * @example
     * // Delete one NotificationOutbox
     * const NotificationOutbox = await prisma.notificationOutbox.delete({
     *   where: {
     *     // ... filter to delete one NotificationOutbox
     *   }
     * })
     * 
     */
    delete<T extends NotificationOutboxDeleteArgs>(args: SelectSubset<T, NotificationOutboxDeleteArgs<ExtArgs>>): Prisma__NotificationOutboxClient<$Result.GetResult<Prisma.$NotificationOutboxPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one NotificationOutbox.
     * @param {NotificationOutboxUpdateArgs} args - Arguments to update one NotificationOutbox.
     * @example
     * // Update one NotificationOutbox
     * const notificationOutbox = await prisma.notificationOutbox.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationOutboxUpdateArgs>(args: SelectSubset<T, NotificationOutboxUpdateArgs<ExtArgs>>): Prisma__NotificationOutboxClient<$Result.GetResult<Prisma.$NotificationOutboxPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more NotificationOutboxes.
     * @param {NotificationOutboxDeleteManyArgs} args - Arguments to filter NotificationOutboxes to delete.
     * @example
     * // Delete a few NotificationOutboxes
     * const { count } = await prisma.notificationOutbox.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationOutboxDeleteManyArgs>(args?: SelectSubset<T, NotificationOutboxDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NotificationOutboxes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationOutboxUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NotificationOutboxes
     * const notificationOutbox = await prisma.notificationOutbox.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationOutboxUpdateManyArgs>(args: SelectSubset<T, NotificationOutboxUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one NotificationOutbox.
     * @param {NotificationOutboxUpsertArgs} args - Arguments to update or create a NotificationOutbox.
     * @example
     * // Update or create a NotificationOutbox
     * const notificationOutbox = await prisma.notificationOutbox.upsert({
     *   create: {
     *     // ... data to create a NotificationOutbox
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NotificationOutbox we want to update
     *   }
     * })
     */
    upsert<T extends NotificationOutboxUpsertArgs>(args: SelectSubset<T, NotificationOutboxUpsertArgs<ExtArgs>>): Prisma__NotificationOutboxClient<$Result.GetResult<Prisma.$NotificationOutboxPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of NotificationOutboxes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationOutboxCountArgs} args - Arguments to filter NotificationOutboxes to count.
     * @example
     * // Count the number of NotificationOutboxes
     * const count = await prisma.notificationOutbox.count({
     *   where: {
     *     // ... the filter for the NotificationOutboxes we want to count
     *   }
     * })
    **/
    count<T extends NotificationOutboxCountArgs>(
      args?: Subset<T, NotificationOutboxCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationOutboxCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a NotificationOutbox.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationOutboxAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends NotificationOutboxAggregateArgs>(args: Subset<T, NotificationOutboxAggregateArgs>): Prisma.PrismaPromise<GetNotificationOutboxAggregateType<T>>

    /**
     * Group by NotificationOutbox.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationOutboxGroupByArgs} args - Group by arguments.
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
      T extends NotificationOutboxGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationOutboxGroupByArgs['orderBy'] }
        : { orderBy?: NotificationOutboxGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, NotificationOutboxGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationOutboxGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the NotificationOutbox model
   */
  readonly fields: NotificationOutboxFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for NotificationOutbox.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationOutboxClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the NotificationOutbox model
   */ 
  interface NotificationOutboxFieldRefs {
    readonly id: FieldRef<"NotificationOutbox", 'String'>
    readonly notification_id: FieldRef<"NotificationOutbox", 'String'>
    readonly user_id: FieldRef<"NotificationOutbox", 'String'>
    readonly channel: FieldRef<"NotificationOutbox", 'NotificationChannel'>
    readonly recipient: FieldRef<"NotificationOutbox", 'String'>
    readonly subject: FieldRef<"NotificationOutbox", 'String'>
    readonly content: FieldRef<"NotificationOutbox", 'String'>
    readonly idempotency_key: FieldRef<"NotificationOutbox", 'String'>
    readonly status: FieldRef<"NotificationOutbox", 'NotificationOutboxStatus'>
    readonly retry_count: FieldRef<"NotificationOutbox", 'Int'>
    readonly max_retries: FieldRef<"NotificationOutbox", 'Int'>
    readonly next_retry_at: FieldRef<"NotificationOutbox", 'DateTime'>
    readonly locked_at: FieldRef<"NotificationOutbox", 'DateTime'>
    readonly locked_by: FieldRef<"NotificationOutbox", 'String'>
    readonly last_error: FieldRef<"NotificationOutbox", 'String'>
    readonly provider_message_id: FieldRef<"NotificationOutbox", 'String'>
    readonly created_at: FieldRef<"NotificationOutbox", 'DateTime'>
    readonly sent_at: FieldRef<"NotificationOutbox", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * NotificationOutbox findUnique
   */
  export type NotificationOutboxFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationOutbox
     */
    select?: NotificationOutboxSelect<ExtArgs> | null
    /**
     * Filter, which NotificationOutbox to fetch.
     */
    where: NotificationOutboxWhereUniqueInput
  }

  /**
   * NotificationOutbox findUniqueOrThrow
   */
  export type NotificationOutboxFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationOutbox
     */
    select?: NotificationOutboxSelect<ExtArgs> | null
    /**
     * Filter, which NotificationOutbox to fetch.
     */
    where: NotificationOutboxWhereUniqueInput
  }

  /**
   * NotificationOutbox findFirst
   */
  export type NotificationOutboxFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationOutbox
     */
    select?: NotificationOutboxSelect<ExtArgs> | null
    /**
     * Filter, which NotificationOutbox to fetch.
     */
    where?: NotificationOutboxWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationOutboxes to fetch.
     */
    orderBy?: NotificationOutboxOrderByWithRelationInput | NotificationOutboxOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NotificationOutboxes.
     */
    cursor?: NotificationOutboxWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationOutboxes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationOutboxes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NotificationOutboxes.
     */
    distinct?: NotificationOutboxScalarFieldEnum | NotificationOutboxScalarFieldEnum[]
  }

  /**
   * NotificationOutbox findFirstOrThrow
   */
  export type NotificationOutboxFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationOutbox
     */
    select?: NotificationOutboxSelect<ExtArgs> | null
    /**
     * Filter, which NotificationOutbox to fetch.
     */
    where?: NotificationOutboxWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationOutboxes to fetch.
     */
    orderBy?: NotificationOutboxOrderByWithRelationInput | NotificationOutboxOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NotificationOutboxes.
     */
    cursor?: NotificationOutboxWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationOutboxes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationOutboxes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NotificationOutboxes.
     */
    distinct?: NotificationOutboxScalarFieldEnum | NotificationOutboxScalarFieldEnum[]
  }

  /**
   * NotificationOutbox findMany
   */
  export type NotificationOutboxFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationOutbox
     */
    select?: NotificationOutboxSelect<ExtArgs> | null
    /**
     * Filter, which NotificationOutboxes to fetch.
     */
    where?: NotificationOutboxWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationOutboxes to fetch.
     */
    orderBy?: NotificationOutboxOrderByWithRelationInput | NotificationOutboxOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing NotificationOutboxes.
     */
    cursor?: NotificationOutboxWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationOutboxes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationOutboxes.
     */
    skip?: number
    distinct?: NotificationOutboxScalarFieldEnum | NotificationOutboxScalarFieldEnum[]
  }

  /**
   * NotificationOutbox create
   */
  export type NotificationOutboxCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationOutbox
     */
    select?: NotificationOutboxSelect<ExtArgs> | null
    /**
     * The data needed to create a NotificationOutbox.
     */
    data: XOR<NotificationOutboxCreateInput, NotificationOutboxUncheckedCreateInput>
  }

  /**
   * NotificationOutbox createMany
   */
  export type NotificationOutboxCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many NotificationOutboxes.
     */
    data: NotificationOutboxCreateManyInput | NotificationOutboxCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NotificationOutbox createManyAndReturn
   */
  export type NotificationOutboxCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationOutbox
     */
    select?: NotificationOutboxSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many NotificationOutboxes.
     */
    data: NotificationOutboxCreateManyInput | NotificationOutboxCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NotificationOutbox update
   */
  export type NotificationOutboxUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationOutbox
     */
    select?: NotificationOutboxSelect<ExtArgs> | null
    /**
     * The data needed to update a NotificationOutbox.
     */
    data: XOR<NotificationOutboxUpdateInput, NotificationOutboxUncheckedUpdateInput>
    /**
     * Choose, which NotificationOutbox to update.
     */
    where: NotificationOutboxWhereUniqueInput
  }

  /**
   * NotificationOutbox updateMany
   */
  export type NotificationOutboxUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update NotificationOutboxes.
     */
    data: XOR<NotificationOutboxUpdateManyMutationInput, NotificationOutboxUncheckedUpdateManyInput>
    /**
     * Filter which NotificationOutboxes to update
     */
    where?: NotificationOutboxWhereInput
  }

  /**
   * NotificationOutbox upsert
   */
  export type NotificationOutboxUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationOutbox
     */
    select?: NotificationOutboxSelect<ExtArgs> | null
    /**
     * The filter to search for the NotificationOutbox to update in case it exists.
     */
    where: NotificationOutboxWhereUniqueInput
    /**
     * In case the NotificationOutbox found by the `where` argument doesn't exist, create a new NotificationOutbox with this data.
     */
    create: XOR<NotificationOutboxCreateInput, NotificationOutboxUncheckedCreateInput>
    /**
     * In case the NotificationOutbox was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationOutboxUpdateInput, NotificationOutboxUncheckedUpdateInput>
  }

  /**
   * NotificationOutbox delete
   */
  export type NotificationOutboxDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationOutbox
     */
    select?: NotificationOutboxSelect<ExtArgs> | null
    /**
     * Filter which NotificationOutbox to delete.
     */
    where: NotificationOutboxWhereUniqueInput
  }

  /**
   * NotificationOutbox deleteMany
   */
  export type NotificationOutboxDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NotificationOutboxes to delete
     */
    where?: NotificationOutboxWhereInput
  }

  /**
   * NotificationOutbox without action
   */
  export type NotificationOutboxDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationOutbox
     */
    select?: NotificationOutboxSelect<ExtArgs> | null
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


  export const NotificationScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    idempotency_key: 'idempotency_key',
    event_id: 'event_id',
    source_service: 'source_service',
    template_code: 'template_code',
    template_version: 'template_version',
    channel: 'channel',
    category: 'category',
    recipient: 'recipient',
    subject: 'subject',
    content: 'content',
    metadata: 'metadata',
    status: 'status',
    error_reason: 'error_reason',
    provider_message_id: 'provider_message_id',
    attempt_count: 'attempt_count',
    last_attempted_at: 'last_attempted_at',
    is_read: 'is_read',
    read_at: 'read_at',
    sent_at: 'sent_at',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum]


  export const NotificationPreferenceScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    email_enabled: 'email_enabled',
    sms_enabled: 'sms_enabled',
    in_app_enabled: 'in_app_enabled',
    orders_email: 'orders_email',
    orders_sms: 'orders_sms',
    payments_email: 'payments_email',
    payments_sms: 'payments_sms',
    marketing_email: 'marketing_email',
    marketing_sms: 'marketing_sms',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type NotificationPreferenceScalarFieldEnum = (typeof NotificationPreferenceScalarFieldEnum)[keyof typeof NotificationPreferenceScalarFieldEnum]


  export const NotificationTemplateScalarFieldEnum: {
    id: 'id',
    code: 'code',
    channel: 'channel',
    version: 'version',
    subject: 'subject',
    body: 'body',
    is_active: 'is_active',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type NotificationTemplateScalarFieldEnum = (typeof NotificationTemplateScalarFieldEnum)[keyof typeof NotificationTemplateScalarFieldEnum]


  export const ProcessedEventScalarFieldEnum: {
    id: 'id',
    event_id: 'event_id',
    consumer_group: 'consumer_group',
    event_type: 'event_type',
    processed_at: 'processed_at'
  };

  export type ProcessedEventScalarFieldEnum = (typeof ProcessedEventScalarFieldEnum)[keyof typeof ProcessedEventScalarFieldEnum]


  export const KafkaDlqRecordScalarFieldEnum: {
    id: 'id',
    event_id: 'event_id',
    event_type: 'event_type',
    original_topic: 'original_topic',
    original_partition: 'original_partition',
    original_offset: 'original_offset',
    consumer_group: 'consumer_group',
    failure_reason: 'failure_reason',
    error_message: 'error_message',
    payload: 'payload',
    status: 'status',
    replayed_topic: 'replayed_topic',
    replayed_at: 'replayed_at',
    replayed_by: 'replayed_by',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type KafkaDlqRecordScalarFieldEnum = (typeof KafkaDlqRecordScalarFieldEnum)[keyof typeof KafkaDlqRecordScalarFieldEnum]


  export const NotificationOutboxScalarFieldEnum: {
    id: 'id',
    notification_id: 'notification_id',
    user_id: 'user_id',
    channel: 'channel',
    recipient: 'recipient',
    subject: 'subject',
    content: 'content',
    idempotency_key: 'idempotency_key',
    status: 'status',
    retry_count: 'retry_count',
    max_retries: 'max_retries',
    next_retry_at: 'next_retry_at',
    locked_at: 'locked_at',
    locked_by: 'locked_by',
    last_error: 'last_error',
    provider_message_id: 'provider_message_id',
    created_at: 'created_at',
    sent_at: 'sent_at'
  };

  export type NotificationOutboxScalarFieldEnum = (typeof NotificationOutboxScalarFieldEnum)[keyof typeof NotificationOutboxScalarFieldEnum]


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
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'NotificationChannel'
   */
  export type EnumNotificationChannelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationChannel'>
    


  /**
   * Reference to a field of type 'NotificationChannel[]'
   */
  export type ListEnumNotificationChannelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationChannel[]'>
    


  /**
   * Reference to a field of type 'NotificationCategory'
   */
  export type EnumNotificationCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationCategory'>
    


  /**
   * Reference to a field of type 'NotificationCategory[]'
   */
  export type ListEnumNotificationCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationCategory[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'NotificationStatus'
   */
  export type EnumNotificationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationStatus'>
    


  /**
   * Reference to a field of type 'NotificationStatus[]'
   */
  export type ListEnumNotificationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationStatus[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'KafkaDlqStatus'
   */
  export type EnumKafkaDlqStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'KafkaDlqStatus'>
    


  /**
   * Reference to a field of type 'KafkaDlqStatus[]'
   */
  export type ListEnumKafkaDlqStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'KafkaDlqStatus[]'>
    


  /**
   * Reference to a field of type 'NotificationOutboxStatus'
   */
  export type EnumNotificationOutboxStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationOutboxStatus'>
    


  /**
   * Reference to a field of type 'NotificationOutboxStatus[]'
   */
  export type ListEnumNotificationOutboxStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationOutboxStatus[]'>
    


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


  export type NotificationWhereInput = {
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    id?: UuidFilter<"Notification"> | string
    user_id?: UuidFilter<"Notification"> | string
    idempotency_key?: StringNullableFilter<"Notification"> | string | null
    event_id?: StringNullableFilter<"Notification"> | string | null
    source_service?: StringNullableFilter<"Notification"> | string | null
    template_code?: StringFilter<"Notification"> | string
    template_version?: IntFilter<"Notification"> | number
    channel?: EnumNotificationChannelFilter<"Notification"> | $Enums.NotificationChannel
    category?: EnumNotificationCategoryFilter<"Notification"> | $Enums.NotificationCategory
    recipient?: StringFilter<"Notification"> | string
    subject?: StringNullableFilter<"Notification"> | string | null
    content?: StringFilter<"Notification"> | string
    metadata?: JsonNullableFilter<"Notification">
    status?: EnumNotificationStatusFilter<"Notification"> | $Enums.NotificationStatus
    error_reason?: StringNullableFilter<"Notification"> | string | null
    provider_message_id?: StringNullableFilter<"Notification"> | string | null
    attempt_count?: IntFilter<"Notification"> | number
    last_attempted_at?: DateTimeNullableFilter<"Notification"> | Date | string | null
    is_read?: BoolFilter<"Notification"> | boolean
    read_at?: DateTimeNullableFilter<"Notification"> | Date | string | null
    sent_at?: DateTimeNullableFilter<"Notification"> | Date | string | null
    created_at?: DateTimeFilter<"Notification"> | Date | string
    updated_at?: DateTimeFilter<"Notification"> | Date | string
  }

  export type NotificationOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrder
    idempotency_key?: SortOrderInput | SortOrder
    event_id?: SortOrderInput | SortOrder
    source_service?: SortOrderInput | SortOrder
    template_code?: SortOrder
    template_version?: SortOrder
    channel?: SortOrder
    category?: SortOrder
    recipient?: SortOrder
    subject?: SortOrderInput | SortOrder
    content?: SortOrder
    metadata?: SortOrderInput | SortOrder
    status?: SortOrder
    error_reason?: SortOrderInput | SortOrder
    provider_message_id?: SortOrderInput | SortOrder
    attempt_count?: SortOrder
    last_attempted_at?: SortOrderInput | SortOrder
    is_read?: SortOrder
    read_at?: SortOrderInput | SortOrder
    sent_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type NotificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    user_id_channel_idempotency_key?: NotificationUser_idChannelIdempotency_keyCompoundUniqueInput
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    user_id?: UuidFilter<"Notification"> | string
    idempotency_key?: StringNullableFilter<"Notification"> | string | null
    event_id?: StringNullableFilter<"Notification"> | string | null
    source_service?: StringNullableFilter<"Notification"> | string | null
    template_code?: StringFilter<"Notification"> | string
    template_version?: IntFilter<"Notification"> | number
    channel?: EnumNotificationChannelFilter<"Notification"> | $Enums.NotificationChannel
    category?: EnumNotificationCategoryFilter<"Notification"> | $Enums.NotificationCategory
    recipient?: StringFilter<"Notification"> | string
    subject?: StringNullableFilter<"Notification"> | string | null
    content?: StringFilter<"Notification"> | string
    metadata?: JsonNullableFilter<"Notification">
    status?: EnumNotificationStatusFilter<"Notification"> | $Enums.NotificationStatus
    error_reason?: StringNullableFilter<"Notification"> | string | null
    provider_message_id?: StringNullableFilter<"Notification"> | string | null
    attempt_count?: IntFilter<"Notification"> | number
    last_attempted_at?: DateTimeNullableFilter<"Notification"> | Date | string | null
    is_read?: BoolFilter<"Notification"> | boolean
    read_at?: DateTimeNullableFilter<"Notification"> | Date | string | null
    sent_at?: DateTimeNullableFilter<"Notification"> | Date | string | null
    created_at?: DateTimeFilter<"Notification"> | Date | string
    updated_at?: DateTimeFilter<"Notification"> | Date | string
  }, "id" | "user_id_channel_idempotency_key">

  export type NotificationOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrder
    idempotency_key?: SortOrderInput | SortOrder
    event_id?: SortOrderInput | SortOrder
    source_service?: SortOrderInput | SortOrder
    template_code?: SortOrder
    template_version?: SortOrder
    channel?: SortOrder
    category?: SortOrder
    recipient?: SortOrder
    subject?: SortOrderInput | SortOrder
    content?: SortOrder
    metadata?: SortOrderInput | SortOrder
    status?: SortOrder
    error_reason?: SortOrderInput | SortOrder
    provider_message_id?: SortOrderInput | SortOrder
    attempt_count?: SortOrder
    last_attempted_at?: SortOrderInput | SortOrder
    is_read?: SortOrder
    read_at?: SortOrderInput | SortOrder
    sent_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: NotificationCountOrderByAggregateInput
    _avg?: NotificationAvgOrderByAggregateInput
    _max?: NotificationMaxOrderByAggregateInput
    _min?: NotificationMinOrderByAggregateInput
    _sum?: NotificationSumOrderByAggregateInput
  }

  export type NotificationScalarWhereWithAggregatesInput = {
    AND?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    OR?: NotificationScalarWhereWithAggregatesInput[]
    NOT?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Notification"> | string
    user_id?: UuidWithAggregatesFilter<"Notification"> | string
    idempotency_key?: StringNullableWithAggregatesFilter<"Notification"> | string | null
    event_id?: StringNullableWithAggregatesFilter<"Notification"> | string | null
    source_service?: StringNullableWithAggregatesFilter<"Notification"> | string | null
    template_code?: StringWithAggregatesFilter<"Notification"> | string
    template_version?: IntWithAggregatesFilter<"Notification"> | number
    channel?: EnumNotificationChannelWithAggregatesFilter<"Notification"> | $Enums.NotificationChannel
    category?: EnumNotificationCategoryWithAggregatesFilter<"Notification"> | $Enums.NotificationCategory
    recipient?: StringWithAggregatesFilter<"Notification"> | string
    subject?: StringNullableWithAggregatesFilter<"Notification"> | string | null
    content?: StringWithAggregatesFilter<"Notification"> | string
    metadata?: JsonNullableWithAggregatesFilter<"Notification">
    status?: EnumNotificationStatusWithAggregatesFilter<"Notification"> | $Enums.NotificationStatus
    error_reason?: StringNullableWithAggregatesFilter<"Notification"> | string | null
    provider_message_id?: StringNullableWithAggregatesFilter<"Notification"> | string | null
    attempt_count?: IntWithAggregatesFilter<"Notification"> | number
    last_attempted_at?: DateTimeNullableWithAggregatesFilter<"Notification"> | Date | string | null
    is_read?: BoolWithAggregatesFilter<"Notification"> | boolean
    read_at?: DateTimeNullableWithAggregatesFilter<"Notification"> | Date | string | null
    sent_at?: DateTimeNullableWithAggregatesFilter<"Notification"> | Date | string | null
    created_at?: DateTimeWithAggregatesFilter<"Notification"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Notification"> | Date | string
  }

  export type NotificationPreferenceWhereInput = {
    AND?: NotificationPreferenceWhereInput | NotificationPreferenceWhereInput[]
    OR?: NotificationPreferenceWhereInput[]
    NOT?: NotificationPreferenceWhereInput | NotificationPreferenceWhereInput[]
    id?: UuidFilter<"NotificationPreference"> | string
    user_id?: UuidFilter<"NotificationPreference"> | string
    email_enabled?: BoolFilter<"NotificationPreference"> | boolean
    sms_enabled?: BoolFilter<"NotificationPreference"> | boolean
    in_app_enabled?: BoolFilter<"NotificationPreference"> | boolean
    orders_email?: BoolFilter<"NotificationPreference"> | boolean
    orders_sms?: BoolFilter<"NotificationPreference"> | boolean
    payments_email?: BoolFilter<"NotificationPreference"> | boolean
    payments_sms?: BoolFilter<"NotificationPreference"> | boolean
    marketing_email?: BoolFilter<"NotificationPreference"> | boolean
    marketing_sms?: BoolFilter<"NotificationPreference"> | boolean
    created_at?: DateTimeFilter<"NotificationPreference"> | Date | string
    updated_at?: DateTimeFilter<"NotificationPreference"> | Date | string
  }

  export type NotificationPreferenceOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrder
    email_enabled?: SortOrder
    sms_enabled?: SortOrder
    in_app_enabled?: SortOrder
    orders_email?: SortOrder
    orders_sms?: SortOrder
    payments_email?: SortOrder
    payments_sms?: SortOrder
    marketing_email?: SortOrder
    marketing_sms?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type NotificationPreferenceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    user_id?: string
    AND?: NotificationPreferenceWhereInput | NotificationPreferenceWhereInput[]
    OR?: NotificationPreferenceWhereInput[]
    NOT?: NotificationPreferenceWhereInput | NotificationPreferenceWhereInput[]
    email_enabled?: BoolFilter<"NotificationPreference"> | boolean
    sms_enabled?: BoolFilter<"NotificationPreference"> | boolean
    in_app_enabled?: BoolFilter<"NotificationPreference"> | boolean
    orders_email?: BoolFilter<"NotificationPreference"> | boolean
    orders_sms?: BoolFilter<"NotificationPreference"> | boolean
    payments_email?: BoolFilter<"NotificationPreference"> | boolean
    payments_sms?: BoolFilter<"NotificationPreference"> | boolean
    marketing_email?: BoolFilter<"NotificationPreference"> | boolean
    marketing_sms?: BoolFilter<"NotificationPreference"> | boolean
    created_at?: DateTimeFilter<"NotificationPreference"> | Date | string
    updated_at?: DateTimeFilter<"NotificationPreference"> | Date | string
  }, "id" | "user_id">

  export type NotificationPreferenceOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrder
    email_enabled?: SortOrder
    sms_enabled?: SortOrder
    in_app_enabled?: SortOrder
    orders_email?: SortOrder
    orders_sms?: SortOrder
    payments_email?: SortOrder
    payments_sms?: SortOrder
    marketing_email?: SortOrder
    marketing_sms?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: NotificationPreferenceCountOrderByAggregateInput
    _max?: NotificationPreferenceMaxOrderByAggregateInput
    _min?: NotificationPreferenceMinOrderByAggregateInput
  }

  export type NotificationPreferenceScalarWhereWithAggregatesInput = {
    AND?: NotificationPreferenceScalarWhereWithAggregatesInput | NotificationPreferenceScalarWhereWithAggregatesInput[]
    OR?: NotificationPreferenceScalarWhereWithAggregatesInput[]
    NOT?: NotificationPreferenceScalarWhereWithAggregatesInput | NotificationPreferenceScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"NotificationPreference"> | string
    user_id?: UuidWithAggregatesFilter<"NotificationPreference"> | string
    email_enabled?: BoolWithAggregatesFilter<"NotificationPreference"> | boolean
    sms_enabled?: BoolWithAggregatesFilter<"NotificationPreference"> | boolean
    in_app_enabled?: BoolWithAggregatesFilter<"NotificationPreference"> | boolean
    orders_email?: BoolWithAggregatesFilter<"NotificationPreference"> | boolean
    orders_sms?: BoolWithAggregatesFilter<"NotificationPreference"> | boolean
    payments_email?: BoolWithAggregatesFilter<"NotificationPreference"> | boolean
    payments_sms?: BoolWithAggregatesFilter<"NotificationPreference"> | boolean
    marketing_email?: BoolWithAggregatesFilter<"NotificationPreference"> | boolean
    marketing_sms?: BoolWithAggregatesFilter<"NotificationPreference"> | boolean
    created_at?: DateTimeWithAggregatesFilter<"NotificationPreference"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"NotificationPreference"> | Date | string
  }

  export type NotificationTemplateWhereInput = {
    AND?: NotificationTemplateWhereInput | NotificationTemplateWhereInput[]
    OR?: NotificationTemplateWhereInput[]
    NOT?: NotificationTemplateWhereInput | NotificationTemplateWhereInput[]
    id?: UuidFilter<"NotificationTemplate"> | string
    code?: StringFilter<"NotificationTemplate"> | string
    channel?: EnumNotificationChannelFilter<"NotificationTemplate"> | $Enums.NotificationChannel
    version?: IntFilter<"NotificationTemplate"> | number
    subject?: StringNullableFilter<"NotificationTemplate"> | string | null
    body?: StringFilter<"NotificationTemplate"> | string
    is_active?: BoolFilter<"NotificationTemplate"> | boolean
    created_at?: DateTimeFilter<"NotificationTemplate"> | Date | string
    updated_at?: DateTimeFilter<"NotificationTemplate"> | Date | string
  }

  export type NotificationTemplateOrderByWithRelationInput = {
    id?: SortOrder
    code?: SortOrder
    channel?: SortOrder
    version?: SortOrder
    subject?: SortOrderInput | SortOrder
    body?: SortOrder
    is_active?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type NotificationTemplateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    code_channel_version?: NotificationTemplateCodeChannelVersionCompoundUniqueInput
    AND?: NotificationTemplateWhereInput | NotificationTemplateWhereInput[]
    OR?: NotificationTemplateWhereInput[]
    NOT?: NotificationTemplateWhereInput | NotificationTemplateWhereInput[]
    code?: StringFilter<"NotificationTemplate"> | string
    channel?: EnumNotificationChannelFilter<"NotificationTemplate"> | $Enums.NotificationChannel
    version?: IntFilter<"NotificationTemplate"> | number
    subject?: StringNullableFilter<"NotificationTemplate"> | string | null
    body?: StringFilter<"NotificationTemplate"> | string
    is_active?: BoolFilter<"NotificationTemplate"> | boolean
    created_at?: DateTimeFilter<"NotificationTemplate"> | Date | string
    updated_at?: DateTimeFilter<"NotificationTemplate"> | Date | string
  }, "id" | "code_channel_version">

  export type NotificationTemplateOrderByWithAggregationInput = {
    id?: SortOrder
    code?: SortOrder
    channel?: SortOrder
    version?: SortOrder
    subject?: SortOrderInput | SortOrder
    body?: SortOrder
    is_active?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: NotificationTemplateCountOrderByAggregateInput
    _avg?: NotificationTemplateAvgOrderByAggregateInput
    _max?: NotificationTemplateMaxOrderByAggregateInput
    _min?: NotificationTemplateMinOrderByAggregateInput
    _sum?: NotificationTemplateSumOrderByAggregateInput
  }

  export type NotificationTemplateScalarWhereWithAggregatesInput = {
    AND?: NotificationTemplateScalarWhereWithAggregatesInput | NotificationTemplateScalarWhereWithAggregatesInput[]
    OR?: NotificationTemplateScalarWhereWithAggregatesInput[]
    NOT?: NotificationTemplateScalarWhereWithAggregatesInput | NotificationTemplateScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"NotificationTemplate"> | string
    code?: StringWithAggregatesFilter<"NotificationTemplate"> | string
    channel?: EnumNotificationChannelWithAggregatesFilter<"NotificationTemplate"> | $Enums.NotificationChannel
    version?: IntWithAggregatesFilter<"NotificationTemplate"> | number
    subject?: StringNullableWithAggregatesFilter<"NotificationTemplate"> | string | null
    body?: StringWithAggregatesFilter<"NotificationTemplate"> | string
    is_active?: BoolWithAggregatesFilter<"NotificationTemplate"> | boolean
    created_at?: DateTimeWithAggregatesFilter<"NotificationTemplate"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"NotificationTemplate"> | Date | string
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

  export type KafkaDlqRecordWhereInput = {
    AND?: KafkaDlqRecordWhereInput | KafkaDlqRecordWhereInput[]
    OR?: KafkaDlqRecordWhereInput[]
    NOT?: KafkaDlqRecordWhereInput | KafkaDlqRecordWhereInput[]
    id?: UuidFilter<"KafkaDlqRecord"> | string
    event_id?: StringFilter<"KafkaDlqRecord"> | string
    event_type?: StringFilter<"KafkaDlqRecord"> | string
    original_topic?: StringFilter<"KafkaDlqRecord"> | string
    original_partition?: IntFilter<"KafkaDlqRecord"> | number
    original_offset?: StringFilter<"KafkaDlqRecord"> | string
    consumer_group?: StringFilter<"KafkaDlqRecord"> | string
    failure_reason?: StringNullableFilter<"KafkaDlqRecord"> | string | null
    error_message?: StringNullableFilter<"KafkaDlqRecord"> | string | null
    payload?: JsonFilter<"KafkaDlqRecord">
    status?: EnumKafkaDlqStatusFilter<"KafkaDlqRecord"> | $Enums.KafkaDlqStatus
    replayed_topic?: StringNullableFilter<"KafkaDlqRecord"> | string | null
    replayed_at?: DateTimeNullableFilter<"KafkaDlqRecord"> | Date | string | null
    replayed_by?: StringNullableFilter<"KafkaDlqRecord"> | string | null
    created_at?: DateTimeFilter<"KafkaDlqRecord"> | Date | string
    updated_at?: DateTimeFilter<"KafkaDlqRecord"> | Date | string
  }

  export type KafkaDlqRecordOrderByWithRelationInput = {
    id?: SortOrder
    event_id?: SortOrder
    event_type?: SortOrder
    original_topic?: SortOrder
    original_partition?: SortOrder
    original_offset?: SortOrder
    consumer_group?: SortOrder
    failure_reason?: SortOrderInput | SortOrder
    error_message?: SortOrderInput | SortOrder
    payload?: SortOrder
    status?: SortOrder
    replayed_topic?: SortOrderInput | SortOrder
    replayed_at?: SortOrderInput | SortOrder
    replayed_by?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type KafkaDlqRecordWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    consumer_group_original_topic_original_partition_original_offset?: KafkaDlqRecordConsumer_groupOriginal_topicOriginal_partitionOriginal_offsetCompoundUniqueInput
    AND?: KafkaDlqRecordWhereInput | KafkaDlqRecordWhereInput[]
    OR?: KafkaDlqRecordWhereInput[]
    NOT?: KafkaDlqRecordWhereInput | KafkaDlqRecordWhereInput[]
    event_id?: StringFilter<"KafkaDlqRecord"> | string
    event_type?: StringFilter<"KafkaDlqRecord"> | string
    original_topic?: StringFilter<"KafkaDlqRecord"> | string
    original_partition?: IntFilter<"KafkaDlqRecord"> | number
    original_offset?: StringFilter<"KafkaDlqRecord"> | string
    consumer_group?: StringFilter<"KafkaDlqRecord"> | string
    failure_reason?: StringNullableFilter<"KafkaDlqRecord"> | string | null
    error_message?: StringNullableFilter<"KafkaDlqRecord"> | string | null
    payload?: JsonFilter<"KafkaDlqRecord">
    status?: EnumKafkaDlqStatusFilter<"KafkaDlqRecord"> | $Enums.KafkaDlqStatus
    replayed_topic?: StringNullableFilter<"KafkaDlqRecord"> | string | null
    replayed_at?: DateTimeNullableFilter<"KafkaDlqRecord"> | Date | string | null
    replayed_by?: StringNullableFilter<"KafkaDlqRecord"> | string | null
    created_at?: DateTimeFilter<"KafkaDlqRecord"> | Date | string
    updated_at?: DateTimeFilter<"KafkaDlqRecord"> | Date | string
  }, "id" | "consumer_group_original_topic_original_partition_original_offset">

  export type KafkaDlqRecordOrderByWithAggregationInput = {
    id?: SortOrder
    event_id?: SortOrder
    event_type?: SortOrder
    original_topic?: SortOrder
    original_partition?: SortOrder
    original_offset?: SortOrder
    consumer_group?: SortOrder
    failure_reason?: SortOrderInput | SortOrder
    error_message?: SortOrderInput | SortOrder
    payload?: SortOrder
    status?: SortOrder
    replayed_topic?: SortOrderInput | SortOrder
    replayed_at?: SortOrderInput | SortOrder
    replayed_by?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: KafkaDlqRecordCountOrderByAggregateInput
    _avg?: KafkaDlqRecordAvgOrderByAggregateInput
    _max?: KafkaDlqRecordMaxOrderByAggregateInput
    _min?: KafkaDlqRecordMinOrderByAggregateInput
    _sum?: KafkaDlqRecordSumOrderByAggregateInput
  }

  export type KafkaDlqRecordScalarWhereWithAggregatesInput = {
    AND?: KafkaDlqRecordScalarWhereWithAggregatesInput | KafkaDlqRecordScalarWhereWithAggregatesInput[]
    OR?: KafkaDlqRecordScalarWhereWithAggregatesInput[]
    NOT?: KafkaDlqRecordScalarWhereWithAggregatesInput | KafkaDlqRecordScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"KafkaDlqRecord"> | string
    event_id?: StringWithAggregatesFilter<"KafkaDlqRecord"> | string
    event_type?: StringWithAggregatesFilter<"KafkaDlqRecord"> | string
    original_topic?: StringWithAggregatesFilter<"KafkaDlqRecord"> | string
    original_partition?: IntWithAggregatesFilter<"KafkaDlqRecord"> | number
    original_offset?: StringWithAggregatesFilter<"KafkaDlqRecord"> | string
    consumer_group?: StringWithAggregatesFilter<"KafkaDlqRecord"> | string
    failure_reason?: StringNullableWithAggregatesFilter<"KafkaDlqRecord"> | string | null
    error_message?: StringNullableWithAggregatesFilter<"KafkaDlqRecord"> | string | null
    payload?: JsonWithAggregatesFilter<"KafkaDlqRecord">
    status?: EnumKafkaDlqStatusWithAggregatesFilter<"KafkaDlqRecord"> | $Enums.KafkaDlqStatus
    replayed_topic?: StringNullableWithAggregatesFilter<"KafkaDlqRecord"> | string | null
    replayed_at?: DateTimeNullableWithAggregatesFilter<"KafkaDlqRecord"> | Date | string | null
    replayed_by?: StringNullableWithAggregatesFilter<"KafkaDlqRecord"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"KafkaDlqRecord"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"KafkaDlqRecord"> | Date | string
  }

  export type NotificationOutboxWhereInput = {
    AND?: NotificationOutboxWhereInput | NotificationOutboxWhereInput[]
    OR?: NotificationOutboxWhereInput[]
    NOT?: NotificationOutboxWhereInput | NotificationOutboxWhereInput[]
    id?: UuidFilter<"NotificationOutbox"> | string
    notification_id?: UuidFilter<"NotificationOutbox"> | string
    user_id?: UuidFilter<"NotificationOutbox"> | string
    channel?: EnumNotificationChannelFilter<"NotificationOutbox"> | $Enums.NotificationChannel
    recipient?: StringFilter<"NotificationOutbox"> | string
    subject?: StringNullableFilter<"NotificationOutbox"> | string | null
    content?: StringFilter<"NotificationOutbox"> | string
    idempotency_key?: StringNullableFilter<"NotificationOutbox"> | string | null
    status?: EnumNotificationOutboxStatusFilter<"NotificationOutbox"> | $Enums.NotificationOutboxStatus
    retry_count?: IntFilter<"NotificationOutbox"> | number
    max_retries?: IntFilter<"NotificationOutbox"> | number
    next_retry_at?: DateTimeNullableFilter<"NotificationOutbox"> | Date | string | null
    locked_at?: DateTimeNullableFilter<"NotificationOutbox"> | Date | string | null
    locked_by?: StringNullableFilter<"NotificationOutbox"> | string | null
    last_error?: StringNullableFilter<"NotificationOutbox"> | string | null
    provider_message_id?: StringNullableFilter<"NotificationOutbox"> | string | null
    created_at?: DateTimeFilter<"NotificationOutbox"> | Date | string
    sent_at?: DateTimeNullableFilter<"NotificationOutbox"> | Date | string | null
  }

  export type NotificationOutboxOrderByWithRelationInput = {
    id?: SortOrder
    notification_id?: SortOrder
    user_id?: SortOrder
    channel?: SortOrder
    recipient?: SortOrder
    subject?: SortOrderInput | SortOrder
    content?: SortOrder
    idempotency_key?: SortOrderInput | SortOrder
    status?: SortOrder
    retry_count?: SortOrder
    max_retries?: SortOrder
    next_retry_at?: SortOrderInput | SortOrder
    locked_at?: SortOrderInput | SortOrder
    locked_by?: SortOrderInput | SortOrder
    last_error?: SortOrderInput | SortOrder
    provider_message_id?: SortOrderInput | SortOrder
    created_at?: SortOrder
    sent_at?: SortOrderInput | SortOrder
  }

  export type NotificationOutboxWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NotificationOutboxWhereInput | NotificationOutboxWhereInput[]
    OR?: NotificationOutboxWhereInput[]
    NOT?: NotificationOutboxWhereInput | NotificationOutboxWhereInput[]
    notification_id?: UuidFilter<"NotificationOutbox"> | string
    user_id?: UuidFilter<"NotificationOutbox"> | string
    channel?: EnumNotificationChannelFilter<"NotificationOutbox"> | $Enums.NotificationChannel
    recipient?: StringFilter<"NotificationOutbox"> | string
    subject?: StringNullableFilter<"NotificationOutbox"> | string | null
    content?: StringFilter<"NotificationOutbox"> | string
    idempotency_key?: StringNullableFilter<"NotificationOutbox"> | string | null
    status?: EnumNotificationOutboxStatusFilter<"NotificationOutbox"> | $Enums.NotificationOutboxStatus
    retry_count?: IntFilter<"NotificationOutbox"> | number
    max_retries?: IntFilter<"NotificationOutbox"> | number
    next_retry_at?: DateTimeNullableFilter<"NotificationOutbox"> | Date | string | null
    locked_at?: DateTimeNullableFilter<"NotificationOutbox"> | Date | string | null
    locked_by?: StringNullableFilter<"NotificationOutbox"> | string | null
    last_error?: StringNullableFilter<"NotificationOutbox"> | string | null
    provider_message_id?: StringNullableFilter<"NotificationOutbox"> | string | null
    created_at?: DateTimeFilter<"NotificationOutbox"> | Date | string
    sent_at?: DateTimeNullableFilter<"NotificationOutbox"> | Date | string | null
  }, "id">

  export type NotificationOutboxOrderByWithAggregationInput = {
    id?: SortOrder
    notification_id?: SortOrder
    user_id?: SortOrder
    channel?: SortOrder
    recipient?: SortOrder
    subject?: SortOrderInput | SortOrder
    content?: SortOrder
    idempotency_key?: SortOrderInput | SortOrder
    status?: SortOrder
    retry_count?: SortOrder
    max_retries?: SortOrder
    next_retry_at?: SortOrderInput | SortOrder
    locked_at?: SortOrderInput | SortOrder
    locked_by?: SortOrderInput | SortOrder
    last_error?: SortOrderInput | SortOrder
    provider_message_id?: SortOrderInput | SortOrder
    created_at?: SortOrder
    sent_at?: SortOrderInput | SortOrder
    _count?: NotificationOutboxCountOrderByAggregateInput
    _avg?: NotificationOutboxAvgOrderByAggregateInput
    _max?: NotificationOutboxMaxOrderByAggregateInput
    _min?: NotificationOutboxMinOrderByAggregateInput
    _sum?: NotificationOutboxSumOrderByAggregateInput
  }

  export type NotificationOutboxScalarWhereWithAggregatesInput = {
    AND?: NotificationOutboxScalarWhereWithAggregatesInput | NotificationOutboxScalarWhereWithAggregatesInput[]
    OR?: NotificationOutboxScalarWhereWithAggregatesInput[]
    NOT?: NotificationOutboxScalarWhereWithAggregatesInput | NotificationOutboxScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"NotificationOutbox"> | string
    notification_id?: UuidWithAggregatesFilter<"NotificationOutbox"> | string
    user_id?: UuidWithAggregatesFilter<"NotificationOutbox"> | string
    channel?: EnumNotificationChannelWithAggregatesFilter<"NotificationOutbox"> | $Enums.NotificationChannel
    recipient?: StringWithAggregatesFilter<"NotificationOutbox"> | string
    subject?: StringNullableWithAggregatesFilter<"NotificationOutbox"> | string | null
    content?: StringWithAggregatesFilter<"NotificationOutbox"> | string
    idempotency_key?: StringNullableWithAggregatesFilter<"NotificationOutbox"> | string | null
    status?: EnumNotificationOutboxStatusWithAggregatesFilter<"NotificationOutbox"> | $Enums.NotificationOutboxStatus
    retry_count?: IntWithAggregatesFilter<"NotificationOutbox"> | number
    max_retries?: IntWithAggregatesFilter<"NotificationOutbox"> | number
    next_retry_at?: DateTimeNullableWithAggregatesFilter<"NotificationOutbox"> | Date | string | null
    locked_at?: DateTimeNullableWithAggregatesFilter<"NotificationOutbox"> | Date | string | null
    locked_by?: StringNullableWithAggregatesFilter<"NotificationOutbox"> | string | null
    last_error?: StringNullableWithAggregatesFilter<"NotificationOutbox"> | string | null
    provider_message_id?: StringNullableWithAggregatesFilter<"NotificationOutbox"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"NotificationOutbox"> | Date | string
    sent_at?: DateTimeNullableWithAggregatesFilter<"NotificationOutbox"> | Date | string | null
  }

  export type NotificationCreateInput = {
    id?: string
    user_id: string
    idempotency_key?: string | null
    event_id?: string | null
    source_service?: string | null
    template_code: string
    template_version?: number
    channel: $Enums.NotificationChannel
    category?: $Enums.NotificationCategory
    recipient: string
    subject?: string | null
    content: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    status?: $Enums.NotificationStatus
    error_reason?: string | null
    provider_message_id?: string | null
    attempt_count?: number
    last_attempted_at?: Date | string | null
    is_read?: boolean
    read_at?: Date | string | null
    sent_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type NotificationUncheckedCreateInput = {
    id?: string
    user_id: string
    idempotency_key?: string | null
    event_id?: string | null
    source_service?: string | null
    template_code: string
    template_version?: number
    channel: $Enums.NotificationChannel
    category?: $Enums.NotificationCategory
    recipient: string
    subject?: string | null
    content: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    status?: $Enums.NotificationStatus
    error_reason?: string | null
    provider_message_id?: string | null
    attempt_count?: number
    last_attempted_at?: Date | string | null
    is_read?: boolean
    read_at?: Date | string | null
    sent_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type NotificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    idempotency_key?: NullableStringFieldUpdateOperationsInput | string | null
    event_id?: NullableStringFieldUpdateOperationsInput | string | null
    source_service?: NullableStringFieldUpdateOperationsInput | string | null
    template_code?: StringFieldUpdateOperationsInput | string
    template_version?: IntFieldUpdateOperationsInput | number
    channel?: EnumNotificationChannelFieldUpdateOperationsInput | $Enums.NotificationChannel
    category?: EnumNotificationCategoryFieldUpdateOperationsInput | $Enums.NotificationCategory
    recipient?: StringFieldUpdateOperationsInput | string
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumNotificationStatusFieldUpdateOperationsInput | $Enums.NotificationStatus
    error_reason?: NullableStringFieldUpdateOperationsInput | string | null
    provider_message_id?: NullableStringFieldUpdateOperationsInput | string | null
    attempt_count?: IntFieldUpdateOperationsInput | number
    last_attempted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_read?: BoolFieldUpdateOperationsInput | boolean
    read_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sent_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    idempotency_key?: NullableStringFieldUpdateOperationsInput | string | null
    event_id?: NullableStringFieldUpdateOperationsInput | string | null
    source_service?: NullableStringFieldUpdateOperationsInput | string | null
    template_code?: StringFieldUpdateOperationsInput | string
    template_version?: IntFieldUpdateOperationsInput | number
    channel?: EnumNotificationChannelFieldUpdateOperationsInput | $Enums.NotificationChannel
    category?: EnumNotificationCategoryFieldUpdateOperationsInput | $Enums.NotificationCategory
    recipient?: StringFieldUpdateOperationsInput | string
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumNotificationStatusFieldUpdateOperationsInput | $Enums.NotificationStatus
    error_reason?: NullableStringFieldUpdateOperationsInput | string | null
    provider_message_id?: NullableStringFieldUpdateOperationsInput | string | null
    attempt_count?: IntFieldUpdateOperationsInput | number
    last_attempted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_read?: BoolFieldUpdateOperationsInput | boolean
    read_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sent_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateManyInput = {
    id?: string
    user_id: string
    idempotency_key?: string | null
    event_id?: string | null
    source_service?: string | null
    template_code: string
    template_version?: number
    channel: $Enums.NotificationChannel
    category?: $Enums.NotificationCategory
    recipient: string
    subject?: string | null
    content: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    status?: $Enums.NotificationStatus
    error_reason?: string | null
    provider_message_id?: string | null
    attempt_count?: number
    last_attempted_at?: Date | string | null
    is_read?: boolean
    read_at?: Date | string | null
    sent_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type NotificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    idempotency_key?: NullableStringFieldUpdateOperationsInput | string | null
    event_id?: NullableStringFieldUpdateOperationsInput | string | null
    source_service?: NullableStringFieldUpdateOperationsInput | string | null
    template_code?: StringFieldUpdateOperationsInput | string
    template_version?: IntFieldUpdateOperationsInput | number
    channel?: EnumNotificationChannelFieldUpdateOperationsInput | $Enums.NotificationChannel
    category?: EnumNotificationCategoryFieldUpdateOperationsInput | $Enums.NotificationCategory
    recipient?: StringFieldUpdateOperationsInput | string
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumNotificationStatusFieldUpdateOperationsInput | $Enums.NotificationStatus
    error_reason?: NullableStringFieldUpdateOperationsInput | string | null
    provider_message_id?: NullableStringFieldUpdateOperationsInput | string | null
    attempt_count?: IntFieldUpdateOperationsInput | number
    last_attempted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_read?: BoolFieldUpdateOperationsInput | boolean
    read_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sent_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    idempotency_key?: NullableStringFieldUpdateOperationsInput | string | null
    event_id?: NullableStringFieldUpdateOperationsInput | string | null
    source_service?: NullableStringFieldUpdateOperationsInput | string | null
    template_code?: StringFieldUpdateOperationsInput | string
    template_version?: IntFieldUpdateOperationsInput | number
    channel?: EnumNotificationChannelFieldUpdateOperationsInput | $Enums.NotificationChannel
    category?: EnumNotificationCategoryFieldUpdateOperationsInput | $Enums.NotificationCategory
    recipient?: StringFieldUpdateOperationsInput | string
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumNotificationStatusFieldUpdateOperationsInput | $Enums.NotificationStatus
    error_reason?: NullableStringFieldUpdateOperationsInput | string | null
    provider_message_id?: NullableStringFieldUpdateOperationsInput | string | null
    attempt_count?: IntFieldUpdateOperationsInput | number
    last_attempted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_read?: BoolFieldUpdateOperationsInput | boolean
    read_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sent_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationPreferenceCreateInput = {
    id?: string
    user_id: string
    email_enabled?: boolean
    sms_enabled?: boolean
    in_app_enabled?: boolean
    orders_email?: boolean
    orders_sms?: boolean
    payments_email?: boolean
    payments_sms?: boolean
    marketing_email?: boolean
    marketing_sms?: boolean
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type NotificationPreferenceUncheckedCreateInput = {
    id?: string
    user_id: string
    email_enabled?: boolean
    sms_enabled?: boolean
    in_app_enabled?: boolean
    orders_email?: boolean
    orders_sms?: boolean
    payments_email?: boolean
    payments_sms?: boolean
    marketing_email?: boolean
    marketing_sms?: boolean
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type NotificationPreferenceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    email_enabled?: BoolFieldUpdateOperationsInput | boolean
    sms_enabled?: BoolFieldUpdateOperationsInput | boolean
    in_app_enabled?: BoolFieldUpdateOperationsInput | boolean
    orders_email?: BoolFieldUpdateOperationsInput | boolean
    orders_sms?: BoolFieldUpdateOperationsInput | boolean
    payments_email?: BoolFieldUpdateOperationsInput | boolean
    payments_sms?: BoolFieldUpdateOperationsInput | boolean
    marketing_email?: BoolFieldUpdateOperationsInput | boolean
    marketing_sms?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationPreferenceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    email_enabled?: BoolFieldUpdateOperationsInput | boolean
    sms_enabled?: BoolFieldUpdateOperationsInput | boolean
    in_app_enabled?: BoolFieldUpdateOperationsInput | boolean
    orders_email?: BoolFieldUpdateOperationsInput | boolean
    orders_sms?: BoolFieldUpdateOperationsInput | boolean
    payments_email?: BoolFieldUpdateOperationsInput | boolean
    payments_sms?: BoolFieldUpdateOperationsInput | boolean
    marketing_email?: BoolFieldUpdateOperationsInput | boolean
    marketing_sms?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationPreferenceCreateManyInput = {
    id?: string
    user_id: string
    email_enabled?: boolean
    sms_enabled?: boolean
    in_app_enabled?: boolean
    orders_email?: boolean
    orders_sms?: boolean
    payments_email?: boolean
    payments_sms?: boolean
    marketing_email?: boolean
    marketing_sms?: boolean
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type NotificationPreferenceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    email_enabled?: BoolFieldUpdateOperationsInput | boolean
    sms_enabled?: BoolFieldUpdateOperationsInput | boolean
    in_app_enabled?: BoolFieldUpdateOperationsInput | boolean
    orders_email?: BoolFieldUpdateOperationsInput | boolean
    orders_sms?: BoolFieldUpdateOperationsInput | boolean
    payments_email?: BoolFieldUpdateOperationsInput | boolean
    payments_sms?: BoolFieldUpdateOperationsInput | boolean
    marketing_email?: BoolFieldUpdateOperationsInput | boolean
    marketing_sms?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationPreferenceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    email_enabled?: BoolFieldUpdateOperationsInput | boolean
    sms_enabled?: BoolFieldUpdateOperationsInput | boolean
    in_app_enabled?: BoolFieldUpdateOperationsInput | boolean
    orders_email?: BoolFieldUpdateOperationsInput | boolean
    orders_sms?: BoolFieldUpdateOperationsInput | boolean
    payments_email?: BoolFieldUpdateOperationsInput | boolean
    payments_sms?: BoolFieldUpdateOperationsInput | boolean
    marketing_email?: BoolFieldUpdateOperationsInput | boolean
    marketing_sms?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationTemplateCreateInput = {
    id?: string
    code: string
    channel: $Enums.NotificationChannel
    version?: number
    subject?: string | null
    body: string
    is_active?: boolean
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type NotificationTemplateUncheckedCreateInput = {
    id?: string
    code: string
    channel: $Enums.NotificationChannel
    version?: number
    subject?: string | null
    body: string
    is_active?: boolean
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type NotificationTemplateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    channel?: EnumNotificationChannelFieldUpdateOperationsInput | $Enums.NotificationChannel
    version?: IntFieldUpdateOperationsInput | number
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    body?: StringFieldUpdateOperationsInput | string
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationTemplateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    channel?: EnumNotificationChannelFieldUpdateOperationsInput | $Enums.NotificationChannel
    version?: IntFieldUpdateOperationsInput | number
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    body?: StringFieldUpdateOperationsInput | string
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationTemplateCreateManyInput = {
    id?: string
    code: string
    channel: $Enums.NotificationChannel
    version?: number
    subject?: string | null
    body: string
    is_active?: boolean
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type NotificationTemplateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    channel?: EnumNotificationChannelFieldUpdateOperationsInput | $Enums.NotificationChannel
    version?: IntFieldUpdateOperationsInput | number
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    body?: StringFieldUpdateOperationsInput | string
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationTemplateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    channel?: EnumNotificationChannelFieldUpdateOperationsInput | $Enums.NotificationChannel
    version?: IntFieldUpdateOperationsInput | number
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    body?: StringFieldUpdateOperationsInput | string
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type KafkaDlqRecordCreateInput = {
    id?: string
    event_id: string
    event_type: string
    original_topic: string
    original_partition: number
    original_offset: string
    consumer_group: string
    failure_reason?: string | null
    error_message?: string | null
    payload: JsonNullValueInput | InputJsonValue
    status?: $Enums.KafkaDlqStatus
    replayed_topic?: string | null
    replayed_at?: Date | string | null
    replayed_by?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type KafkaDlqRecordUncheckedCreateInput = {
    id?: string
    event_id: string
    event_type: string
    original_topic: string
    original_partition: number
    original_offset: string
    consumer_group: string
    failure_reason?: string | null
    error_message?: string | null
    payload: JsonNullValueInput | InputJsonValue
    status?: $Enums.KafkaDlqStatus
    replayed_topic?: string | null
    replayed_at?: Date | string | null
    replayed_by?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type KafkaDlqRecordUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    event_id?: StringFieldUpdateOperationsInput | string
    event_type?: StringFieldUpdateOperationsInput | string
    original_topic?: StringFieldUpdateOperationsInput | string
    original_partition?: IntFieldUpdateOperationsInput | number
    original_offset?: StringFieldUpdateOperationsInput | string
    consumer_group?: StringFieldUpdateOperationsInput | string
    failure_reason?: NullableStringFieldUpdateOperationsInput | string | null
    error_message?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: JsonNullValueInput | InputJsonValue
    status?: EnumKafkaDlqStatusFieldUpdateOperationsInput | $Enums.KafkaDlqStatus
    replayed_topic?: NullableStringFieldUpdateOperationsInput | string | null
    replayed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    replayed_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KafkaDlqRecordUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    event_id?: StringFieldUpdateOperationsInput | string
    event_type?: StringFieldUpdateOperationsInput | string
    original_topic?: StringFieldUpdateOperationsInput | string
    original_partition?: IntFieldUpdateOperationsInput | number
    original_offset?: StringFieldUpdateOperationsInput | string
    consumer_group?: StringFieldUpdateOperationsInput | string
    failure_reason?: NullableStringFieldUpdateOperationsInput | string | null
    error_message?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: JsonNullValueInput | InputJsonValue
    status?: EnumKafkaDlqStatusFieldUpdateOperationsInput | $Enums.KafkaDlqStatus
    replayed_topic?: NullableStringFieldUpdateOperationsInput | string | null
    replayed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    replayed_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KafkaDlqRecordCreateManyInput = {
    id?: string
    event_id: string
    event_type: string
    original_topic: string
    original_partition: number
    original_offset: string
    consumer_group: string
    failure_reason?: string | null
    error_message?: string | null
    payload: JsonNullValueInput | InputJsonValue
    status?: $Enums.KafkaDlqStatus
    replayed_topic?: string | null
    replayed_at?: Date | string | null
    replayed_by?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type KafkaDlqRecordUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    event_id?: StringFieldUpdateOperationsInput | string
    event_type?: StringFieldUpdateOperationsInput | string
    original_topic?: StringFieldUpdateOperationsInput | string
    original_partition?: IntFieldUpdateOperationsInput | number
    original_offset?: StringFieldUpdateOperationsInput | string
    consumer_group?: StringFieldUpdateOperationsInput | string
    failure_reason?: NullableStringFieldUpdateOperationsInput | string | null
    error_message?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: JsonNullValueInput | InputJsonValue
    status?: EnumKafkaDlqStatusFieldUpdateOperationsInput | $Enums.KafkaDlqStatus
    replayed_topic?: NullableStringFieldUpdateOperationsInput | string | null
    replayed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    replayed_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KafkaDlqRecordUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    event_id?: StringFieldUpdateOperationsInput | string
    event_type?: StringFieldUpdateOperationsInput | string
    original_topic?: StringFieldUpdateOperationsInput | string
    original_partition?: IntFieldUpdateOperationsInput | number
    original_offset?: StringFieldUpdateOperationsInput | string
    consumer_group?: StringFieldUpdateOperationsInput | string
    failure_reason?: NullableStringFieldUpdateOperationsInput | string | null
    error_message?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: JsonNullValueInput | InputJsonValue
    status?: EnumKafkaDlqStatusFieldUpdateOperationsInput | $Enums.KafkaDlqStatus
    replayed_topic?: NullableStringFieldUpdateOperationsInput | string | null
    replayed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    replayed_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationOutboxCreateInput = {
    id?: string
    notification_id: string
    user_id: string
    channel: $Enums.NotificationChannel
    recipient: string
    subject?: string | null
    content: string
    idempotency_key?: string | null
    status?: $Enums.NotificationOutboxStatus
    retry_count?: number
    max_retries?: number
    next_retry_at?: Date | string | null
    locked_at?: Date | string | null
    locked_by?: string | null
    last_error?: string | null
    provider_message_id?: string | null
    created_at?: Date | string
    sent_at?: Date | string | null
  }

  export type NotificationOutboxUncheckedCreateInput = {
    id?: string
    notification_id: string
    user_id: string
    channel: $Enums.NotificationChannel
    recipient: string
    subject?: string | null
    content: string
    idempotency_key?: string | null
    status?: $Enums.NotificationOutboxStatus
    retry_count?: number
    max_retries?: number
    next_retry_at?: Date | string | null
    locked_at?: Date | string | null
    locked_by?: string | null
    last_error?: string | null
    provider_message_id?: string | null
    created_at?: Date | string
    sent_at?: Date | string | null
  }

  export type NotificationOutboxUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    notification_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    channel?: EnumNotificationChannelFieldUpdateOperationsInput | $Enums.NotificationChannel
    recipient?: StringFieldUpdateOperationsInput | string
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    idempotency_key?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumNotificationOutboxStatusFieldUpdateOperationsInput | $Enums.NotificationOutboxStatus
    retry_count?: IntFieldUpdateOperationsInput | number
    max_retries?: IntFieldUpdateOperationsInput | number
    next_retry_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    locked_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    locked_by?: NullableStringFieldUpdateOperationsInput | string | null
    last_error?: NullableStringFieldUpdateOperationsInput | string | null
    provider_message_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    sent_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type NotificationOutboxUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    notification_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    channel?: EnumNotificationChannelFieldUpdateOperationsInput | $Enums.NotificationChannel
    recipient?: StringFieldUpdateOperationsInput | string
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    idempotency_key?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumNotificationOutboxStatusFieldUpdateOperationsInput | $Enums.NotificationOutboxStatus
    retry_count?: IntFieldUpdateOperationsInput | number
    max_retries?: IntFieldUpdateOperationsInput | number
    next_retry_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    locked_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    locked_by?: NullableStringFieldUpdateOperationsInput | string | null
    last_error?: NullableStringFieldUpdateOperationsInput | string | null
    provider_message_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    sent_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type NotificationOutboxCreateManyInput = {
    id?: string
    notification_id: string
    user_id: string
    channel: $Enums.NotificationChannel
    recipient: string
    subject?: string | null
    content: string
    idempotency_key?: string | null
    status?: $Enums.NotificationOutboxStatus
    retry_count?: number
    max_retries?: number
    next_retry_at?: Date | string | null
    locked_at?: Date | string | null
    locked_by?: string | null
    last_error?: string | null
    provider_message_id?: string | null
    created_at?: Date | string
    sent_at?: Date | string | null
  }

  export type NotificationOutboxUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    notification_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    channel?: EnumNotificationChannelFieldUpdateOperationsInput | $Enums.NotificationChannel
    recipient?: StringFieldUpdateOperationsInput | string
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    idempotency_key?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumNotificationOutboxStatusFieldUpdateOperationsInput | $Enums.NotificationOutboxStatus
    retry_count?: IntFieldUpdateOperationsInput | number
    max_retries?: IntFieldUpdateOperationsInput | number
    next_retry_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    locked_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    locked_by?: NullableStringFieldUpdateOperationsInput | string | null
    last_error?: NullableStringFieldUpdateOperationsInput | string | null
    provider_message_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    sent_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type NotificationOutboxUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    notification_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    channel?: EnumNotificationChannelFieldUpdateOperationsInput | $Enums.NotificationChannel
    recipient?: StringFieldUpdateOperationsInput | string
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    idempotency_key?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumNotificationOutboxStatusFieldUpdateOperationsInput | $Enums.NotificationOutboxStatus
    retry_count?: IntFieldUpdateOperationsInput | number
    max_retries?: IntFieldUpdateOperationsInput | number
    next_retry_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    locked_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    locked_by?: NullableStringFieldUpdateOperationsInput | string | null
    last_error?: NullableStringFieldUpdateOperationsInput | string | null
    provider_message_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    sent_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
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

  export type EnumNotificationChannelFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationChannel | EnumNotificationChannelFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationChannel[] | ListEnumNotificationChannelFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationChannel[] | ListEnumNotificationChannelFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationChannelFilter<$PrismaModel> | $Enums.NotificationChannel
  }

  export type EnumNotificationCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationCategory | EnumNotificationCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationCategory[] | ListEnumNotificationCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationCategory[] | ListEnumNotificationCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationCategoryFilter<$PrismaModel> | $Enums.NotificationCategory
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

  export type EnumNotificationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationStatus | EnumNotificationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationStatus[] | ListEnumNotificationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationStatus[] | ListEnumNotificationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationStatusFilter<$PrismaModel> | $Enums.NotificationStatus
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

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type NotificationUser_idChannelIdempotency_keyCompoundUniqueInput = {
    user_id: string
    channel: $Enums.NotificationChannel
    idempotency_key: string
  }

  export type NotificationCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    idempotency_key?: SortOrder
    event_id?: SortOrder
    source_service?: SortOrder
    template_code?: SortOrder
    template_version?: SortOrder
    channel?: SortOrder
    category?: SortOrder
    recipient?: SortOrder
    subject?: SortOrder
    content?: SortOrder
    metadata?: SortOrder
    status?: SortOrder
    error_reason?: SortOrder
    provider_message_id?: SortOrder
    attempt_count?: SortOrder
    last_attempted_at?: SortOrder
    is_read?: SortOrder
    read_at?: SortOrder
    sent_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type NotificationAvgOrderByAggregateInput = {
    template_version?: SortOrder
    attempt_count?: SortOrder
  }

  export type NotificationMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    idempotency_key?: SortOrder
    event_id?: SortOrder
    source_service?: SortOrder
    template_code?: SortOrder
    template_version?: SortOrder
    channel?: SortOrder
    category?: SortOrder
    recipient?: SortOrder
    subject?: SortOrder
    content?: SortOrder
    status?: SortOrder
    error_reason?: SortOrder
    provider_message_id?: SortOrder
    attempt_count?: SortOrder
    last_attempted_at?: SortOrder
    is_read?: SortOrder
    read_at?: SortOrder
    sent_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type NotificationMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    idempotency_key?: SortOrder
    event_id?: SortOrder
    source_service?: SortOrder
    template_code?: SortOrder
    template_version?: SortOrder
    channel?: SortOrder
    category?: SortOrder
    recipient?: SortOrder
    subject?: SortOrder
    content?: SortOrder
    status?: SortOrder
    error_reason?: SortOrder
    provider_message_id?: SortOrder
    attempt_count?: SortOrder
    last_attempted_at?: SortOrder
    is_read?: SortOrder
    read_at?: SortOrder
    sent_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type NotificationSumOrderByAggregateInput = {
    template_version?: SortOrder
    attempt_count?: SortOrder
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

  export type EnumNotificationChannelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationChannel | EnumNotificationChannelFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationChannel[] | ListEnumNotificationChannelFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationChannel[] | ListEnumNotificationChannelFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationChannelWithAggregatesFilter<$PrismaModel> | $Enums.NotificationChannel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNotificationChannelFilter<$PrismaModel>
    _max?: NestedEnumNotificationChannelFilter<$PrismaModel>
  }

  export type EnumNotificationCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationCategory | EnumNotificationCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationCategory[] | ListEnumNotificationCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationCategory[] | ListEnumNotificationCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationCategoryWithAggregatesFilter<$PrismaModel> | $Enums.NotificationCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNotificationCategoryFilter<$PrismaModel>
    _max?: NestedEnumNotificationCategoryFilter<$PrismaModel>
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

  export type EnumNotificationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationStatus | EnumNotificationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationStatus[] | ListEnumNotificationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationStatus[] | ListEnumNotificationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationStatusWithAggregatesFilter<$PrismaModel> | $Enums.NotificationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNotificationStatusFilter<$PrismaModel>
    _max?: NestedEnumNotificationStatusFilter<$PrismaModel>
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

  export type NotificationPreferenceCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    email_enabled?: SortOrder
    sms_enabled?: SortOrder
    in_app_enabled?: SortOrder
    orders_email?: SortOrder
    orders_sms?: SortOrder
    payments_email?: SortOrder
    payments_sms?: SortOrder
    marketing_email?: SortOrder
    marketing_sms?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type NotificationPreferenceMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    email_enabled?: SortOrder
    sms_enabled?: SortOrder
    in_app_enabled?: SortOrder
    orders_email?: SortOrder
    orders_sms?: SortOrder
    payments_email?: SortOrder
    payments_sms?: SortOrder
    marketing_email?: SortOrder
    marketing_sms?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type NotificationPreferenceMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    email_enabled?: SortOrder
    sms_enabled?: SortOrder
    in_app_enabled?: SortOrder
    orders_email?: SortOrder
    orders_sms?: SortOrder
    payments_email?: SortOrder
    payments_sms?: SortOrder
    marketing_email?: SortOrder
    marketing_sms?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type NotificationTemplateCodeChannelVersionCompoundUniqueInput = {
    code: string
    channel: $Enums.NotificationChannel
    version: number
  }

  export type NotificationTemplateCountOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    channel?: SortOrder
    version?: SortOrder
    subject?: SortOrder
    body?: SortOrder
    is_active?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type NotificationTemplateAvgOrderByAggregateInput = {
    version?: SortOrder
  }

  export type NotificationTemplateMaxOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    channel?: SortOrder
    version?: SortOrder
    subject?: SortOrder
    body?: SortOrder
    is_active?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type NotificationTemplateMinOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    channel?: SortOrder
    version?: SortOrder
    subject?: SortOrder
    body?: SortOrder
    is_active?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type NotificationTemplateSumOrderByAggregateInput = {
    version?: SortOrder
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

  export type EnumKafkaDlqStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.KafkaDlqStatus | EnumKafkaDlqStatusFieldRefInput<$PrismaModel>
    in?: $Enums.KafkaDlqStatus[] | ListEnumKafkaDlqStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.KafkaDlqStatus[] | ListEnumKafkaDlqStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumKafkaDlqStatusFilter<$PrismaModel> | $Enums.KafkaDlqStatus
  }

  export type KafkaDlqRecordConsumer_groupOriginal_topicOriginal_partitionOriginal_offsetCompoundUniqueInput = {
    consumer_group: string
    original_topic: string
    original_partition: number
    original_offset: string
  }

  export type KafkaDlqRecordCountOrderByAggregateInput = {
    id?: SortOrder
    event_id?: SortOrder
    event_type?: SortOrder
    original_topic?: SortOrder
    original_partition?: SortOrder
    original_offset?: SortOrder
    consumer_group?: SortOrder
    failure_reason?: SortOrder
    error_message?: SortOrder
    payload?: SortOrder
    status?: SortOrder
    replayed_topic?: SortOrder
    replayed_at?: SortOrder
    replayed_by?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type KafkaDlqRecordAvgOrderByAggregateInput = {
    original_partition?: SortOrder
  }

  export type KafkaDlqRecordMaxOrderByAggregateInput = {
    id?: SortOrder
    event_id?: SortOrder
    event_type?: SortOrder
    original_topic?: SortOrder
    original_partition?: SortOrder
    original_offset?: SortOrder
    consumer_group?: SortOrder
    failure_reason?: SortOrder
    error_message?: SortOrder
    status?: SortOrder
    replayed_topic?: SortOrder
    replayed_at?: SortOrder
    replayed_by?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type KafkaDlqRecordMinOrderByAggregateInput = {
    id?: SortOrder
    event_id?: SortOrder
    event_type?: SortOrder
    original_topic?: SortOrder
    original_partition?: SortOrder
    original_offset?: SortOrder
    consumer_group?: SortOrder
    failure_reason?: SortOrder
    error_message?: SortOrder
    status?: SortOrder
    replayed_topic?: SortOrder
    replayed_at?: SortOrder
    replayed_by?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type KafkaDlqRecordSumOrderByAggregateInput = {
    original_partition?: SortOrder
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

  export type EnumKafkaDlqStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.KafkaDlqStatus | EnumKafkaDlqStatusFieldRefInput<$PrismaModel>
    in?: $Enums.KafkaDlqStatus[] | ListEnumKafkaDlqStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.KafkaDlqStatus[] | ListEnumKafkaDlqStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumKafkaDlqStatusWithAggregatesFilter<$PrismaModel> | $Enums.KafkaDlqStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumKafkaDlqStatusFilter<$PrismaModel>
    _max?: NestedEnumKafkaDlqStatusFilter<$PrismaModel>
  }

  export type EnumNotificationOutboxStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationOutboxStatus | EnumNotificationOutboxStatusFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationOutboxStatus[] | ListEnumNotificationOutboxStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationOutboxStatus[] | ListEnumNotificationOutboxStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationOutboxStatusFilter<$PrismaModel> | $Enums.NotificationOutboxStatus
  }

  export type NotificationOutboxCountOrderByAggregateInput = {
    id?: SortOrder
    notification_id?: SortOrder
    user_id?: SortOrder
    channel?: SortOrder
    recipient?: SortOrder
    subject?: SortOrder
    content?: SortOrder
    idempotency_key?: SortOrder
    status?: SortOrder
    retry_count?: SortOrder
    max_retries?: SortOrder
    next_retry_at?: SortOrder
    locked_at?: SortOrder
    locked_by?: SortOrder
    last_error?: SortOrder
    provider_message_id?: SortOrder
    created_at?: SortOrder
    sent_at?: SortOrder
  }

  export type NotificationOutboxAvgOrderByAggregateInput = {
    retry_count?: SortOrder
    max_retries?: SortOrder
  }

  export type NotificationOutboxMaxOrderByAggregateInput = {
    id?: SortOrder
    notification_id?: SortOrder
    user_id?: SortOrder
    channel?: SortOrder
    recipient?: SortOrder
    subject?: SortOrder
    content?: SortOrder
    idempotency_key?: SortOrder
    status?: SortOrder
    retry_count?: SortOrder
    max_retries?: SortOrder
    next_retry_at?: SortOrder
    locked_at?: SortOrder
    locked_by?: SortOrder
    last_error?: SortOrder
    provider_message_id?: SortOrder
    created_at?: SortOrder
    sent_at?: SortOrder
  }

  export type NotificationOutboxMinOrderByAggregateInput = {
    id?: SortOrder
    notification_id?: SortOrder
    user_id?: SortOrder
    channel?: SortOrder
    recipient?: SortOrder
    subject?: SortOrder
    content?: SortOrder
    idempotency_key?: SortOrder
    status?: SortOrder
    retry_count?: SortOrder
    max_retries?: SortOrder
    next_retry_at?: SortOrder
    locked_at?: SortOrder
    locked_by?: SortOrder
    last_error?: SortOrder
    provider_message_id?: SortOrder
    created_at?: SortOrder
    sent_at?: SortOrder
  }

  export type NotificationOutboxSumOrderByAggregateInput = {
    retry_count?: SortOrder
    max_retries?: SortOrder
  }

  export type EnumNotificationOutboxStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationOutboxStatus | EnumNotificationOutboxStatusFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationOutboxStatus[] | ListEnumNotificationOutboxStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationOutboxStatus[] | ListEnumNotificationOutboxStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationOutboxStatusWithAggregatesFilter<$PrismaModel> | $Enums.NotificationOutboxStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNotificationOutboxStatusFilter<$PrismaModel>
    _max?: NestedEnumNotificationOutboxStatusFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumNotificationChannelFieldUpdateOperationsInput = {
    set?: $Enums.NotificationChannel
  }

  export type EnumNotificationCategoryFieldUpdateOperationsInput = {
    set?: $Enums.NotificationCategory
  }

  export type EnumNotificationStatusFieldUpdateOperationsInput = {
    set?: $Enums.NotificationStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type EnumKafkaDlqStatusFieldUpdateOperationsInput = {
    set?: $Enums.KafkaDlqStatus
  }

  export type EnumNotificationOutboxStatusFieldUpdateOperationsInput = {
    set?: $Enums.NotificationOutboxStatus
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

  export type NestedEnumNotificationChannelFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationChannel | EnumNotificationChannelFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationChannel[] | ListEnumNotificationChannelFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationChannel[] | ListEnumNotificationChannelFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationChannelFilter<$PrismaModel> | $Enums.NotificationChannel
  }

  export type NestedEnumNotificationCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationCategory | EnumNotificationCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationCategory[] | ListEnumNotificationCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationCategory[] | ListEnumNotificationCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationCategoryFilter<$PrismaModel> | $Enums.NotificationCategory
  }

  export type NestedEnumNotificationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationStatus | EnumNotificationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationStatus[] | ListEnumNotificationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationStatus[] | ListEnumNotificationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationStatusFilter<$PrismaModel> | $Enums.NotificationStatus
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

  export type NestedEnumNotificationChannelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationChannel | EnumNotificationChannelFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationChannel[] | ListEnumNotificationChannelFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationChannel[] | ListEnumNotificationChannelFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationChannelWithAggregatesFilter<$PrismaModel> | $Enums.NotificationChannel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNotificationChannelFilter<$PrismaModel>
    _max?: NestedEnumNotificationChannelFilter<$PrismaModel>
  }

  export type NestedEnumNotificationCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationCategory | EnumNotificationCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationCategory[] | ListEnumNotificationCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationCategory[] | ListEnumNotificationCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationCategoryWithAggregatesFilter<$PrismaModel> | $Enums.NotificationCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNotificationCategoryFilter<$PrismaModel>
    _max?: NestedEnumNotificationCategoryFilter<$PrismaModel>
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

  export type NestedEnumNotificationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationStatus | EnumNotificationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationStatus[] | ListEnumNotificationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationStatus[] | ListEnumNotificationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationStatusWithAggregatesFilter<$PrismaModel> | $Enums.NotificationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNotificationStatusFilter<$PrismaModel>
    _max?: NestedEnumNotificationStatusFilter<$PrismaModel>
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

  export type NestedEnumKafkaDlqStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.KafkaDlqStatus | EnumKafkaDlqStatusFieldRefInput<$PrismaModel>
    in?: $Enums.KafkaDlqStatus[] | ListEnumKafkaDlqStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.KafkaDlqStatus[] | ListEnumKafkaDlqStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumKafkaDlqStatusFilter<$PrismaModel> | $Enums.KafkaDlqStatus
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

  export type NestedEnumKafkaDlqStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.KafkaDlqStatus | EnumKafkaDlqStatusFieldRefInput<$PrismaModel>
    in?: $Enums.KafkaDlqStatus[] | ListEnumKafkaDlqStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.KafkaDlqStatus[] | ListEnumKafkaDlqStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumKafkaDlqStatusWithAggregatesFilter<$PrismaModel> | $Enums.KafkaDlqStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumKafkaDlqStatusFilter<$PrismaModel>
    _max?: NestedEnumKafkaDlqStatusFilter<$PrismaModel>
  }

  export type NestedEnumNotificationOutboxStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationOutboxStatus | EnumNotificationOutboxStatusFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationOutboxStatus[] | ListEnumNotificationOutboxStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationOutboxStatus[] | ListEnumNotificationOutboxStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationOutboxStatusFilter<$PrismaModel> | $Enums.NotificationOutboxStatus
  }

  export type NestedEnumNotificationOutboxStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationOutboxStatus | EnumNotificationOutboxStatusFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationOutboxStatus[] | ListEnumNotificationOutboxStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationOutboxStatus[] | ListEnumNotificationOutboxStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationOutboxStatusWithAggregatesFilter<$PrismaModel> | $Enums.NotificationOutboxStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNotificationOutboxStatusFilter<$PrismaModel>
    _max?: NestedEnumNotificationOutboxStatusFilter<$PrismaModel>
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use NotificationDefaultArgs instead
     */
    export type NotificationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = NotificationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use NotificationPreferenceDefaultArgs instead
     */
    export type NotificationPreferenceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = NotificationPreferenceDefaultArgs<ExtArgs>
    /**
     * @deprecated Use NotificationTemplateDefaultArgs instead
     */
    export type NotificationTemplateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = NotificationTemplateDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProcessedEventDefaultArgs instead
     */
    export type ProcessedEventArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProcessedEventDefaultArgs<ExtArgs>
    /**
     * @deprecated Use KafkaDlqRecordDefaultArgs instead
     */
    export type KafkaDlqRecordArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = KafkaDlqRecordDefaultArgs<ExtArgs>
    /**
     * @deprecated Use NotificationOutboxDefaultArgs instead
     */
    export type NotificationOutboxArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = NotificationOutboxDefaultArgs<ExtArgs>

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