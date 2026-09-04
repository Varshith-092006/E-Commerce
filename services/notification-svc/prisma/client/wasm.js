
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

exports.Prisma.NotificationScalarFieldEnum = {
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

exports.Prisma.NotificationPreferenceScalarFieldEnum = {
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

exports.Prisma.NotificationTemplateScalarFieldEnum = {
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

exports.Prisma.ProcessedEventScalarFieldEnum = {
  id: 'id',
  event_id: 'event_id',
  consumer_group: 'consumer_group',
  event_type: 'event_type',
  processed_at: 'processed_at'
};

exports.Prisma.KafkaDlqRecordScalarFieldEnum = {
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

exports.Prisma.NotificationOutboxScalarFieldEnum = {
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

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.NotificationChannel = exports.$Enums.NotificationChannel = {
  EMAIL: 'EMAIL',
  SMS: 'SMS',
  IN_APP: 'IN_APP',
  PUSH: 'PUSH'
};

exports.NotificationCategory = exports.$Enums.NotificationCategory = {
  ORDERS: 'ORDERS',
  PAYMENTS: 'PAYMENTS',
  ACCOUNT: 'ACCOUNT',
  MARKETING: 'MARKETING'
};

exports.NotificationStatus = exports.$Enums.NotificationStatus = {
  PENDING: 'PENDING',
  SENT: 'SENT',
  FAILED: 'FAILED'
};

exports.KafkaDlqStatus = exports.$Enums.KafkaDlqStatus = {
  DEAD_LETTERED: 'DEAD_LETTERED',
  REPLAYED: 'REPLAYED',
  IGNORED: 'IGNORED'
};

exports.NotificationOutboxStatus = exports.$Enums.NotificationOutboxStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SENT: 'SENT',
  FAILED: 'FAILED',
  DLQ: 'DLQ'
};

exports.Prisma.ModelName = {
  Notification: 'Notification',
  NotificationPreference: 'NotificationPreference',
  NotificationTemplate: 'NotificationTemplate',
  ProcessedEvent: 'ProcessedEvent',
  KafkaDlqRecord: 'KafkaDlqRecord',
  NotificationOutbox: 'NotificationOutbox'
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
