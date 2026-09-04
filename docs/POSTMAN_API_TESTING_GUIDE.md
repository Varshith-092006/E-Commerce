# COMPLETE POSTMAN API TESTING GUIDE

> **Repository Source-of-Truth**: Generated directly from the active codebase across `gateway`, `identity-svc`, `catalog-svc`, `order-svc`, `payment-svc`, `fulfillment-svc`, `notification-svc`, and `@ecommerce/shared`.

---

## 1. POSTMAN ENVIRONMENT SPECIFICATION

Create a Postman Environment (e.g., `E-Commerce Local Mesh`) and define the following variables:

| Variable | Initial Value | Description / Origin / Usage |
| :--- | :--- | :--- |
| `baseUrl` | `http://localhost:4000` | Gateway Public URL (all client requests target this base) |
| `adminToken` | *(Set after Step 0)* | JWT for user with `ADMIN` role |
| `customerEmail` | `customer_test@example.com` | Customer login email |
| `customerPassword` | `Password123!` | Customer password |
| `customerToken` | *(Set after Step 2)* | Bearer Access Token for customer |
| `customerRefreshToken`| *(Set after Step 2)* | Refresh Token returned in Login JSON response |
| `customerId` | *(Set after Step 1)* | Customer User UUID |
| `customerOtp` | *(Set after Step 1)* | OTP returned in register response (used to verify) |
| `addressId` | *(Set after Step 4)* | Customer Delivery Address UUID |
| `sellerEmail` | `seller_test@example.com` | Seller login email |
| `sellerPassword` | `Password123!` | Seller password |
| `sellerToken` | *(Set after Step 7)* | Bearer Access Token for seller |
| `sellerRefreshToken` | *(Set after Step 7)* | Refresh Token returned in Seller Login response |
| `sellerUserId` | *(Set after Step 5)* | Seller User UUID |
| `sellerId` | *(Set after Step 5)* | Seller Profile UUID |
| `sellerOtp` | *(Set after Step 5)* | Seller verification OTP |
| `logisticsEmail` | `courier_test@example.com` | Courier / Logistics user email |
| `logisticsPassword` | `Password123!` | Logistics user password |
| `logisticsToken` | *(Set after Step 8)* | Bearer Access Token with `COURIER` or `LOGISTICS` role |
| `categoryId` | *(Set after Step 9)* | Category UUID |
| `productId` | *(Set after Step 10)*| Product UUID |
| `productSku` | `APEX-PROD-001` | Product Stock Keeping Unit |
| `warehouseId` | *(Set after Step 11)*| Warehouse UUID |
| `warehouseCode` | `WH-NORTH-01` | Unique Warehouse Code |
| `inventoryId` | *(Set after Step 12)*| Inventory record UUID |
| `cartItemId` | *(Set after Step 13)*| Cart Item UUID |
| `paymentId` | *(Set after Step 15)*| Internal Payment record UUID |
| `razorpayOrderId` | *(Set after Step 15)*| Upstream / Mock Razorpay Order ID |
| `razorpayPaymentId`| *(Set after Step 16)*| Upstream / Mock Razorpay Payment ID |
| `razorpaySignature`| *(Set after Step 16)*| Valid HMAC-SHA256 signature |
| `orderId` | *(Set after Step 17)*| Order record UUID |
| `orderNumber` | *(Set after Step 17)*| Order Reference String (`ORD-YYYYMMDD-XXXXXX`) |
| `trackingNumber` | *(Set after Step 20)*| AWB Tracking number generated on dispatch |
| `returnId` | *(Set after Step 23)*| Reverse Logistics Return UUID |
| `returnTrackingNumber`| *(Set after Step 24)*| Reverse Logistics Tracking Number |
| `refundId` | *(Set after Step 27)*| Refund record UUID |

---

## 2. GATEWAY ARCHITECTURE & HEADER RULES

### Gateway Anti-Spoofing & Internal Header Injection
The Gateway running at `http://localhost:4000` strictly implements anti-spoofing security (`services/gateway/src/app.js`):
1. **Client Headers Stripped**: If you manually supply `x-user-id`, `x-user-role`, `x-user-email`, `x-seller-id`, or `x-internal-gateway-secret`, the Gateway **deletes them immediately**.
2. **Gateway Verified JWT Extraction**: When `Authorization: Bearer <token>` is sent, Gateway decodes the signed token and automatically injects:
   - `x-user-id: <decoded.sub>`
   - `x-user-role: <decoded.role>`
   - `x-user-email: <decoded.email>`
   - `x-seller-id: <decoded.sellerId>`
   - `x-internal-gateway-secret: <INTERNAL_GATEWAY_SECRET>` (dev mesh secret: `ecom_internal_mesh_secret_2026`)
   - `x-request-id`, `x-trace-id`, `x-span-id` (Distributed tracing correlation)

### Client Request Header Rules:
- **MANUALLY SEND**:
  - `Content-Type: application/json`
  - `Authorization: Bearer {{token}}` (when authenticated)
  - `Idempotency-Key: <unique-uuid-or-string>` (min 16 chars, required on Order creation)
- **DO NOT SEND TO GATEWAY**:
  - `x-internal-gateway-secret` (Gateway strips this)
  - `x-user-id`, `x-user-role`, `x-seller-id` (Gateway strips this)

---

## 3. PRIMARY BUSINESS FLOW (HAPPY PATH)

```
Customer Register (with OTP)
       ↓
Verify Customer & Login (Save customerToken)
       ↓
Create Delivery Address (Save addressId)
       ↓
Register Seller Profile (Save sellerId & sellerUserId)
       ↓
Verify Seller & Admin Approves Seller
       ↓
Login Seller (Save sellerToken with sellerId)
       ↓
Create Logistics/Courier User (Admin assigns role → Save logisticsToken)
       ↓
Create Category (Admin → Save categoryId)
       ↓
Create Product (Seller → Save productId & SKU)
       ↓
Create Warehouse (Admin → Save warehouseId)
       ↓
Stock Intake (Admin or Seller → Save inventoryId)
       ↓
Add to Cart & View Cart (Customer)
       ↓
Calculate Checkout (Customer)
       ↓
Initiate Payment (Customer → Save paymentId & razorpayOrderId)
       ↓
Verify Payment (Customer → Transitions to AUTHORIZED)
       ↓
Create Order (Customer with Idempotency-Key → Save orderId, status: PLACED)
       ↓
Seller Confirm Order (Seller → status: CONFIRMED)
       ↓
Seller Process Order (Seller → status: PROCESSING)
       ↓
Seller Ship Order (Seller → status: SHIPPED, records AWB trackingNumber)
       ↓
Mark Out for Delivery (Courier/Logistics → status: OUT_FOR_DELIVERY)
       ↓
Mark Delivered (Courier/Logistics → status: DELIVERED with Proof of Delivery)
       ↓
Request Return (Customer → fulfillment-svc, status: REQUESTED, Save returnId)
       ↓
Schedule Return Pickup (Logistics → status: PICKUP_SCHEDULED, Save returnTrackingNumber)
       ↓
Record Proof of Pickup (Logistics → status: PICKED_UP)
       ↓
Receive at Warehouse (Logistics → status: RECEIVED_AT_WAREHOUSE)
       ↓
Quality Inspection / QC (Logistics → grade: PASS, status: COMPLETED)
       ↓
Restock (AUTOMATIC during QC: destination warehouse stock incremented)
       ↓
Automatic Refund (AUTOMATIC via Kafka: return.completed → payment-svc executes refund)
       ↓
Verify Refund Status (Customer / Admin checks GET payment status)
```

---

### STEP 0 — PRE-REQUISITE: ADMIN LOGIN
To perform administrative actions (approving sellers, creating warehouses, creating categories), acquire an Admin token.

**Purpose**: Acquire platform administrative bearer token.  
**Method**: `POST`  
**Full URL**: `{{baseUrl}}/api/v1/auth/login`  
**Authentication**: None  
**Headers**:
```http
Content-Type: application/json
```
**Request Body**:
```json
{
  "email": "admin@ecommerce.com",
  "password": "AdminPassword123!"
}
```
**Expected Status**: `200 OK`  
**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "c7a6e118-2e3b-4835-9610-d123456789ab",
      "email": "admin@ecommerce.com",
      "role": "ADMIN",
      "isVerified": true
    },
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "4a7c..."
  }
}
```
**Postman Test Script / Variable Extraction**:
```javascript
pm.environment.set("adminToken", pm.response.json().data.accessToken);
```

---

### STEP 1 — CUSTOMER REGISTRATION
**Purpose**: Registers a new customer account and generates a 6-digit OTP in development.  
**Method**: `POST`  
**Full URL**: `{{baseUrl}}/api/v1/auth/register`  
**Authentication**: None  
**Headers**:
```http
Content-Type: application/json
```
**Request Body**:
```json
{
  "email": "customer_test@example.com",
  "password": "Password123!",
  "firstName": "Rahul",
  "lastName": "Sharma",
  "phone": "+919876543210"
}
```
**Expected Status**: `201 Created`  
**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "e4b6c3d2-8f1a-4d7e-9c0b-123456789abc",
      "email": "customer_test@example.com",
      "firstName": "Rahul",
      "lastName": "Sharma",
      "role": "CUSTOMER",
      "isVerified": false
    },
    "otp": "839201"
  }
}
```
**Postman Test Script / Variable Extraction**:
```javascript
const res = pm.response.json();
pm.environment.set("customerId", res.data.user.id);
pm.environment.set("customerOtp", res.data.otp);
pm.environment.set("customerEmail", res.data.user.email);
```

---

### STEP 1B — VERIFY CUSTOMER EMAIL
**Purpose**: Verifies customer email using the OTP generated during registration.  
**Method**: `POST`  
**Full URL**: `{{baseUrl}}/api/v1/auth/verify`  
**Authentication**: None  
**Headers**:
```http
Content-Type: application/json
```
**Request Body**:
```json
{
  "email": "{{customerEmail}}",
  "otp": "{{customerOtp}}"
}
```
**Expected Status**: `200 OK`  
**Response**:
```json
{
  "success": true,
  "data": {
    "message": "Account successfully verified"
  }
}
```

---

### STEP 2 — CUSTOMER LOGIN
**Purpose**: Authenticate customer and obtain bearer access token and refresh token.  
**Method**: `POST`  
**Full URL**: `{{baseUrl}}/api/v1/auth/login`  
**Authentication**: None  
**Headers**:
```http
Content-Type: application/json
```
**Request Body**:
```json
{
  "email": "{{customerEmail}}",
  "password": "Password123!"
}
```
**Expected Status**: `200 OK`  
**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "e4b6c3d2-8f1a-4d7e-9c0b-123456789abc",
      "email": "customer_test@example.com",
      "firstName": "Rahul",
      "lastName": "Sharma",
      "role": "CUSTOMER",
      "isVerified": true,
      "seller": null
    },
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "8b512ef9e34a6a24719b024467d02894b9101c40"
  }
}
```
**Postman Test Script / Variable Extraction**:
```javascript
const res = pm.response.json();
pm.environment.set("customerToken", res.data.accessToken);
pm.environment.set("customerRefreshToken", res.data.refreshToken);
pm.environment.set("customerId", res.data.user.id);
```

---

### STEP 3 — GET CUSTOMER PROFILE (SELF-SERVICE)
**Purpose**: Verify token validity and inspect authenticated user details.  
**Method**: `GET`  
**Full URL**: `{{baseUrl}}/api/v1/users/me`  
**Authentication**: Bearer Token  
**Headers**:
```http
Authorization: Bearer {{customerToken}}
```
**Expected Status**: `200 OK`  
**Response**:
```json
{
  "success": true,
  "data": {
    "id": "e4b6c3d2-8f1a-4d7e-9c0b-123456789abc",
    "email": "customer_test@example.com",
    "firstName": "Rahul",
    "lastName": "Sharma",
    "phone": "+919876543210",
    "role": "CUSTOMER",
    "isVerified": true,
    "seller": null
  }
}
```

---

### STEP 4 — CREATE DELIVERY ADDRESS
**Purpose**: Saves a validated shipping address under the customer profile (first address automatically becomes `isDefault: true`).  
**Method**: `POST`  
**Full URL**: `{{baseUrl}}/api/v1/users/addresses`  
**Authentication**: Bearer Token  
**Authorization**: `CUSTOMER`  
**Headers**:
```http
Content-Type: application/json
Authorization: Bearer {{customerToken}}
```
**Request Body**:
```json
{
  "fullName": "Rahul Sharma",
  "phone": "+919876543210",
  "streetAddress": "Flat 402, Sunshine Heights, MG Road",
  "city": "Bengaluru",
  "state": "Karnataka",
  "postalCode": "560001",
  "country": "India",
  "isDefault": true
}
```
**Expected Status**: `201 Created`  
**Response**:
```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7a8b-9c0d-112233445566",
    "user_id": "e4b6c3d2-8f1a-4d7e-9c0b-123456789abc",
    "full_name": "Rahul Sharma",
    "phone": "+919876543210",
    "street_address": "Flat 402, Sunshine Heights, MG Road",
    "city": "Bengaluru",
    "state": "Karnataka",
    "postal_code": "560001",
    "country": "India",
    "is_default": true,
    "created_at": "2026-09-03T10:00:00.000Z"
  }
}
```
**Postman Test Script / Variable Extraction**:
```javascript
pm.environment.set("addressId", pm.response.json().data.id);
```

---

### STEP 5 — SELLER REGISTRATION
**Purpose**: Creates a new user with `SELLER` role and a linked Seller entity in `PENDING` verification status.  
**Method**: `POST`  
**Full URL**: `{{baseUrl}}/api/v1/auth/register-seller`  
**Authentication**: None  
**Headers**:
```http
Content-Type: application/json
```
**Request Body**:
```json
{
  "email": "seller_test@example.com",
  "password": "Password123!",
  "firstName": "Anil",
  "lastName": "Mehta",
  "phone": "+919811122233",
  "businessName": "Apex Retail Enterprises",
  "storeSlug": "apex-retail-hub",
  "gstin": "29AAAAA0000A1Z5",
  "pan": "AAAAA0000A",
  "businessAddress": "Plot 12, Industrial Area, Peenya, Bengaluru, KA 560058"
}
```
**Expected Status**: `201 Created`  
**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "d5e6f7a8-b9c0-1d2e-3f4a-5b6c7d8e9f0a",
      "email": "seller_test@example.com",
      "firstName": "Anil",
      "lastName": "Mehta",
      "role": "SELLER",
      "isVerified": false,
      "seller": {
        "id": "s1a2b3c4-d5e6-7f8a-9b0c-112233445566",
        "businessName": "Apex Retail Enterprises",
        "storeSlug": "apex-retail-hub",
        "status": "PENDING"
      }
    },
    "otp": "654321"
  }
}
```
**Postman Test Script / Variable Extraction**:
```javascript
const res = pm.response.json();
pm.environment.set("sellerUserId", res.data.user.id);
pm.environment.set("sellerId", res.data.user.seller.id);
pm.environment.set("sellerOtp", res.data.otp);
pm.environment.set("sellerEmail", res.data.user.email);
```

---

### STEP 5B — VERIFY SELLER EMAIL
**Method**: `POST`  
**Full URL**: `{{baseUrl}}/api/v1/auth/verify`  
**Headers**:
```http
Content-Type: application/json
```
**Request Body**:
```json
{
  "email": "{{sellerEmail}}",
  "otp": "{{sellerOtp}}"
}
```
**Expected Status**: `200 OK`

---

### STEP 6 — ADMIN APPROVES SELLER
**Purpose**: Admin updates the seller profile status from `PENDING` to `ACTIVE` (approving the seller and enabling product creation and order fulfillment).  
**Method**: `PATCH`  
**Full URL**: `{{baseUrl}}/api/v1/sellers/admin/{{sellerId}}/status`  
**Authentication**: Bearer Token  
**Authorization**: `ADMIN`  
**Headers**:
```http
Content-Type: application/json
Authorization: Bearer {{adminToken}}
```
**Path Parameters**:
- `id`: `{{sellerId}}`

**Request Body**:
```json
{
  "status": "ACTIVE"
}
```
**Allowed Status Enums**: `PENDING`, `ACTIVE`, `REJECTED`, `SUSPENDED` (Note: `APPROVED` is also accepted as an alias for `ACTIVE`)  
**Expected Status**: `200 OK`  
**Response**:
```json
{
  "success": true,
  "data": {
    "id": "s1a2b3c4-d5e6-7f8a-9b0c-112233445566",
    "user_id": "d5e6f7a8-b9c0-1d2e-3f4a-5b6c7d8e9f0a",
    "business_name": "Apex Retail Enterprises",
    "store_slug": "apex-retail-hub",
    "status": "ACTIVE",
    "rejection_reason": null
  }
}
```

---

### STEP 7 — SELLER LOGIN
**Purpose**: Authenticate seller and obtain seller access token (with `sellerId` injected into JWT payload).  
**Method**: `POST`  
**Full URL**: `{{baseUrl}}/api/v1/auth/login`  
**Authentication**: None  
**Headers**:
```http
Content-Type: application/json
```
**Request Body**:
```json
{
  "email": "{{sellerEmail}}",
  "password": "Password123!"
}
```
**Expected Status**: `200 OK`  
**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "d5e6f7a8-b9c0-1d2e-3f4a-5b6c7d8e9f0a",
      "email": "seller_test@example.com",
      "role": "SELLER",
      "isVerified": true,
      "seller": {
        "id": "s1a2b3c4-d5e6-7f8a-9b0c-112233445566",
        "businessName": "Apex Retail Enterprises",
        "storeSlug": "apex-retail-hub",
        "status": "ACTIVE"
      }
    },
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "1a2b3c..."
  }
}
```
**Postman Test Script / Variable Extraction**:
```javascript
const res = pm.response.json();
pm.environment.set("sellerToken", res.data.accessToken);
pm.environment.set("sellerRefreshToken", res.data.refreshToken);
pm.environment.set("sellerId", res.data.user.seller.id);
```

---

### STEP 8 — CREATE LOGISTICS / COURIER AGENT
To execute last-mile delivery and reverse logistics pickup, create a courier user.

#### 8A. Register Courier User
**Method**: `POST`  
**Full URL**: `{{baseUrl}}/api/v1/auth/register`  
**Headers**:
```http
Content-Type: application/json
```
**Request Body**:
```json
{
  "email": "courier_test@example.com",
  "password": "Password123!",
  "firstName": "Vikram",
  "lastName": "Rathore",
  "phone": "+919844455566"
}
```
*(Verify email with OTP via `POST /api/v1/auth/verify`)*

#### 8B. Admin Assigns COURIER Role
**Method**: `PATCH`  
**Full URL**: `{{baseUrl}}/api/v1/users/admin/<courierUserId>/role`  
**Authentication**: Bearer Token  
**Authorization**: `ADMIN`  
**Headers**:
```http
Content-Type: application/json
Authorization: Bearer {{adminToken}}
```
**Request Body**:
```json
{
  "role": "COURIER",
  "reason": "Appointed regional last-mile delivery agent"
}
```
**Allowed Roles**: `CUSTOMER`, `SELLER`, `ADMIN`, `COURIER`, `LOGISTICS`  
**Expected Status**: `200 OK`

#### 8C. Login as Logistics/Courier
**Method**: `POST`  
**Full URL**: `{{baseUrl}}/api/v1/auth/login`  
**Headers**:
```http
Content-Type: application/json
```
**Request Body**:
```json
{
  "email": "courier_test@example.com",
  "password": "Password123!"
}
```
**Expected Status**: `200 OK`  
**Save Variable**:
```javascript
pm.environment.set("logisticsToken", pm.response.json().data.accessToken);
```

---

### STEP 9 — CREATE CATEGORY
**Purpose**: Creates a product category in catalog-svc.  
**Method**: `POST`  
**Full URL**: `{{baseUrl}}/api/v1/categories`  
**Authentication**: Bearer Token  
**Authorization**: `ADMIN`  
**Headers**:
```http
Content-Type: application/json
Authorization: Bearer {{adminToken}}
```
**Request Body**:
```json
{
  "name": "Consumer Electronics",
  "slug": "consumer-electronics",
  "description": "Smartphones, laptops, and premium audio",
  "parentId": null,
  "imageUrl": "https://cdn.ecommerce.com/categories/electronics.png",
  "isActive": true,
  "displayOrder": 1
}
```
**Expected Status**: `201 Created`  
**Response**:
```json
{
  "success": true,
  "data": {
    "id": "c1a2b3c4-d5e6-7f8a-9b0c-112233445566",
    "name": "Consumer Electronics",
    "slug": "consumer-electronics",
    "description": "Smartphones, laptops, and premium audio",
    "parent_id": null,
    "image_url": "https://cdn.ecommerce.com/categories/electronics.png",
    "is_active": true,
    "display_order": 1,
    "created_at": "2026-09-03T10:05:00.000Z"
  }
}
```
**Postman Test Script / Variable Extraction**:
```javascript
pm.environment.set("categoryId", pm.response.json().data.id);
```

---

### STEP 10 — CREATE PRODUCT
**Purpose**: Seller creates an active catalog product.  
**Method**: `POST`  
**Full URL**: `{{baseUrl}}/api/v1/seller/products`  
**Authentication**: Bearer Token  
**Authorization**: `SELLER`  
**Headers**:
```http
Content-Type: application/json
Authorization: Bearer {{sellerToken}}
```
**Request Body**:
```json
{
  "categoryId": "{{categoryId}}",
  "title": "Apex Noise Cancelling Wireless Headphones",
  "slug": "apex-wireless-headphones-anc",
  "description": "Premium 40mm drivers with active noise cancellation and 30-hour battery life",
  "brand": "ApexSound",
  "sku": "APEX-PROD-001",
  "price": 4999.00,
  "compareAtPrice": 7999.00,
  "status": "PUBLISHED",
  "isAvailable": true,
  "attributes": {
    "color": "Midnight Black",
    "connectivity": "Bluetooth 5.3",
    "warranty": "1 Year"
  }
}
```
**Expected Status**: `201 Created`  
**Response**:
```json
{
  "success": true,
  "data": {
    "id": "p1a2b3c4-d5e6-7f8a-9b0c-112233445566",
    "seller_id": "s1a2b3c4-d5e6-7f8a-9b0c-112233445566",
    "category_id": "c1a2b3c4-d5e6-7f8a-9b0c-112233445566",
    "title": "Apex Noise Cancelling Wireless Headphones",
    "slug": "apex-wireless-headphones-anc",
    "brand": "ApexSound",
    "sku": "APEX-PROD-001",
    "price": "4999",
    "compare_at_price": "7999",
    "status": "PUBLISHED",
    "is_available": true
  }
}
```
**Postman Test Script / Variable Extraction**:
```javascript
const res = pm.response.json();
pm.environment.set("productId", res.data.id);
pm.environment.set("productSku", res.data.sku);
```

---

### STEP 11 — CREATE WAREHOUSE
**Purpose**: Creates an active fulfillment center / warehouse.  
**Method**: `POST`  
**Full URL**: `{{baseUrl}}/api/v1/warehouses`  
**Authentication**: Bearer Token  
**Authorization**: `ADMIN`  
**Headers**:
```http
Content-Type: application/json
Authorization: Bearer {{adminToken}}
```
**Request Body**:
```json
{
  "code": "WH-NORTH-01",
  "name": "North Regional Fulfillment Center",
  "addressLine1": "Warehouse Complex 5, NH-8 Logistics Corridor",
  "addressLine2": "Sector 34",
  "city": "Gurugram",
  "state": "Haryana",
  "postalCode": "122001",
  "country": "IN",
  "isActive": true
}
```
**Expected Status**: `201 Created`  
**Response**:
```json
{
  "success": true,
  "data": {
    "id": "w1a2b3c4-d5e6-7f8a-9b0c-112233445566",
    "code": "WH-NORTH-01",
    "name": "North Regional Fulfillment Center",
    "address_line1": "Warehouse Complex 5, NH-8 Logistics Corridor",
    "city": "Gurugram",
    "state": "Haryana",
    "postal_code": "122001",
    "is_active": true
  }
}
```
**Postman Test Script / Variable Extraction**:
```javascript
pm.environment.set("warehouseId", pm.response.json().data.id);
```

---

### STEP 12 — INVENTORY / STOCK INTAKE
**Purpose**: Adds physical inventory for the product SKU to the warehouse.  
**Method**: `POST`  
**Full URL**: `{{baseUrl}}/api/v1/inventory/stock`  
**Authentication**: Bearer Token  
**Authorization**: `ADMIN` or `SELLER`  
**Headers**:
```http
Content-Type: application/json
Authorization: Bearer {{sellerToken}}
```
**Request Body**:
```json
{
  "productId": "{{productId}}",
  "sku": "{{productSku}}",
  "warehouseId": "{{warehouseId}}",
  "sellerId": "{{sellerId}}",
  "quantity": 100,
  "safetyStock": 5,
  "reorderThreshold": 10
}
```
**Expected Status**: `201 Created`  
**Response**:
```json
{
  "success": true,
  "data": {
    "id": "i1a2b3c4-d5e6-7f8a-9b0c-112233445566",
    "product_id": "p1a2b3c4-d5e6-7f8a-9b0c-112233445566",
    "sku": "APEX-PROD-001",
    "warehouse_id": "w1a2b3c4-d5e6-7f8a-9b0c-112233445566",
    "seller_id": "s1a2b3c4-d5e6-7f8a-9b0c-112233445566",
    "quantity_on_hand": 100,
    "quantity_reserved": 0,
    "safety_stock": 5,
    "reorder_threshold": 10,
    "is_active": true
  }
}
```
**Postman Test Script / Variable Extraction**:
```javascript
pm.environment.set("inventoryId", pm.response.json().data.id);
```

---

### STEP 13 — ADD ITEM TO CART
**Purpose**: Adds the product to the authenticated customer's server-side shopping cart.  
**Method**: `POST`  
**Full URL**: `{{baseUrl}}/api/v1/cart/items`  
**Authentication**: Bearer Token  
**Authorization**: `CUSTOMER`  
**Headers**:
```http
Content-Type: application/json
Authorization: Bearer {{customerToken}}
```
**Request Body**:
```json
{
  "productId": "{{productId}}",
  "quantity": 1
}
```
**Expected Status**: `200 OK`  
**Response**:
```json
{
  "success": true,
  "data": {
    "id": "cart-uuid",
    "user_id": "e4b6c3d2-8f1a-4d7e-9c0b-123456789abc",
    "items": [
      {
        "id": "item-uuid",
        "product_id": "p1a2b3c4-d5e6-7f8a-9b0c-112233445566",
        "seller_id": "s1a2b3c4-d5e6-7f8a-9b0c-112233445566",
        "title": "Apex Noise Cancelling Wireless Headphones",
        "unit_price": "4999.00",
        "quantity": 1,
        "subtotal": "4999.00"
      }
    ],
    "subtotal": "4999.00",
    "item_count": 1
  }
}
```
**Postman Test Script / Variable Extraction**:
```javascript
pm.environment.set("cartItemId", pm.response.json().data.items[0].id);
```

---

### STEP 14 — CALCULATE CHECKOUT
**Purpose**: Pre-calculates accurate subtotal, tax, shipping fees, and final grand total for the customer's cart or Buy Now selection.  
**Method**: `POST`  
**Full URL**: `{{baseUrl}}/api/v1/checkout/calculate`  
**Authentication**: Bearer Token  
**Authorization**: `CUSTOMER`  
**Headers**:
```http
Content-Type: application/json
Authorization: Bearer {{customerToken}}
```
**Request Body**:
```json
{
  "addressId": "{{addressId}}",
  "couponCode": null,
  "useCart": true
}
```
*(Note: If testing Buy Now without cart, pass `buyNowItem: { "productId": "{{productId}}", "quantity": 1 }` and omit `useCart`)*  
**Expected Status**: `200 OK`  
**Response**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "productId": "p1a2b3c4-d5e6-7f8a-9b0c-112233445566",
        "title": "Apex Noise Cancelling Wireless Headphones",
        "quantity": 1,
        "unitPrice": "4999.00",
        "subtotal": "4999.00"
      }
    ],
    "pricing": {
      "subtotal": "4999.00",
      "discount": "0.00",
      "taxableAmount": "4999.00",
      "taxRate": "0.08",
      "tax": "399.92",
      "shippingFee": "0.00",
      "freeShipping": true,
      "grandTotal": "5398.92"
    },
    "shippingAddress": {
      "id": "a1b2c3d4-e5f6-7a8b-9c0d-112233445566",
      "city": "Bengaluru",
      "postalCode": "560001"
    }
  }
}
```

---

### STEP 15 — INITIATE PAYMENT (PREPAID RAZORPAY)
**Purpose**: Creates an internal payment intent and an upstream/mock Razorpay order.  
**Method**: `POST`  
**Full URL**: `{{baseUrl}}/api/v1/payments/initiate`  
**Authentication**: Bearer Token  
**Authorization**: `CUSTOMER`  
**Headers**:
```http
Content-Type: application/json
Authorization: Bearer {{customerToken}}
```
**Request Body**:
```json
{
  "amount": "5398.92",
  "currency": "INR",
  "metadata": {
    "source": "checkout_flow"
  }
}
```
*(Note: In mock mode, currency can be `INR` or `USD`)*  
**Expected Status**: `200 OK`  
**Response**:
```json
{
  "success": true,
  "data": {
    "paymentId": "pay_11223344-5566-7788-99aa-bbccddeeff00",
    "razorpayOrderId": "order_mock_1a2b3c4d5e6f7a8b",
    "amount": "5398.92",
    "currency": "INR",
    "keyId": "rzp_test_ApexStoreMockKey2026"
  }
}
```
**Postman Test Script / Variable Extraction**:
```javascript
const res = pm.response.json();
pm.environment.set("paymentId", res.data.paymentId);
pm.environment.set("razorpayOrderId", res.data.razorpayOrderId);
```

---

### STEP 16 — VERIFY PAYMENT (SAFE TEST MODE)
**Purpose**: Cryptographically verifies payment signature and transitions payment status to `AUTHORIZED`.

#### Safe Test Mode & Local Mode Support:
The repository supports cryptographic HMAC-SHA256 verification in both `mock` and `live` modes (`services/payment-svc/src/lib/razorpay.js`):
- Key Secret: `process.env.RAZORPAY_KEY_SECRET` (default in dev: `mock_razorpay_secret_key_apex_2026`)
- Signature payload: `${razorpayOrderId}|${razorpayPaymentId}`
- HMAC Algorithm: `sha256`

#### Postman Pre-request Script (Automated Test Signature Generator):
Add this in the **Pre-request Script** tab of Step 16:
```javascript
const orderId = pm.environment.get("razorpayOrderId");
const rzpPaymentId = "pay_mock_" + Math.random().toString(36).substring(2, 12);
pm.environment.set("razorpayPaymentId", rzpPaymentId);

// Compute HMAC-SHA256 signature using default dev secret
const secret = "mock_razorpay_secret_key_apex_2026";
const payload = `${orderId}|${rzpPaymentId}`;
const signature = CryptoJS.HmacSHA256(payload, secret).toString(CryptoJS.enc.Hex);
pm.environment.set("razorpaySignature", signature);
```

**Method**: `POST`  
**Full URL**: `{{baseUrl}}/api/v1/payments/verify`  
**Authentication**: Bearer Token  
**Authorization**: `CUSTOMER`  
**Headers**:
```http
Content-Type: application/json
Authorization: Bearer {{customerToken}}
```
**Request Body**:
```json
  {
    "paymentId": "{{paymentId}}",
    "razorpayOrderId": "{{razorpayOrderId}}",
    "razorpayPaymentId": "{{razorpayPaymentId}}",
    "razorpaySignature": "{{razorpaySignature}}"
  }
```
**Expected Status**: `200 OK`  
**Response**:
```json
{
  "success": true,
  "data": {
    "paymentId": "pay_11223344-5566-7788-99aa-bbccddeeff00",
    "status": "AUTHORIZED",
    "verified": true,
    "amount": "5898.82",
    "currency": "INR"
  }
}
```

---

### STEP 17 — CREATE ORDER
**Purpose**: Atomically creates order, reserves inventory, captures payment, clears cart, and records an `order.placed` outbox event.  
**Method**: `POST`  
**Full URL**: `{{baseUrl}}/api/v1/orders`  
**Authentication**: Bearer Token  
**Authorization**: `CUSTOMER`  
**Headers**:
```http
Content-Type: application/json
Authorization: Bearer {{customerToken}}
Idempotency-Key: postman-order-{{$guid}}
```
*(Header `Idempotency-Key` is strictly validated: must be a string between 16 and 255 characters)*

**Request Body**:
```json
{
  "addressId": "{{addressId}}",
  "paymentMethod": "PREPAID",
  "paymentId": "{{paymentId}}",
  "couponCode": null,
  "customerNotes": "Please ring the bell upon arrival"
}
```
*(For COD orders, pass `"paymentMethod": "COD"` and omit `paymentId`)*  
**Expected Status**: `201 Created`  
**Response**:
```json
{
  "success": true,
  "data": {
    "id": "ord_99887766-5544-3322-1100-aabbccddeeff",
    "order_number": "ORD-20260903-E5A7B9",
    "user_id": "e4b6c3d2-8f1a-4d7e-9c0b-123456789abc",
    "status": "PLACED",
    "payment_method": "PREPAID",
    "payment_id": "pay_11223344-5566-7788-99aa-bbccddeeff00",
    "total_amount": "5898.82",
    "items": [
      {
        "id": "oi_1",
        "product_id": "p1a2b3c4-d5e6-7f8a-9b0c-112233445566",
        "seller_id": "s1a2b3c4-d5e6-7f8a-9b0c-112233445566",
        "title": "Apex Noise Cancelling Wireless Headphones",
        "quantity": 1,
        "unit_price": "4999.00",
        "subtotal": "4999.00"
      }
    ],
    "created_at": "2026-09-03T10:15:00.000Z"
  }
}
```
**Postman Test Script / Variable Extraction**:
```javascript
const res = pm.response.json();
pm.environment.set("orderId", res.data.id);
pm.environment.set("orderNumber", res.data.order_number);
```

---

### STEP 18 — SELLER CONFIRMS ORDER
**Purpose**: Seller accepts and confirms the placed order (`PLACED` → `CONFIRMED`).  
**Method**: `POST`  
**Full URL**: `{{baseUrl}}/api/v1/orders/seller/orders/{{orderId}}/confirm`  
**Authentication**: Bearer Token  
**Authorization**: `SELLER` or `ADMIN`  
**Headers**:
```http
Content-Type: application/json
Authorization: Bearer {{sellerToken}}
```
**Path Parameters**:
- `id`: `{{orderId}}`

**Request Body**:
```json
{
  "reason": "Inventory verified and stock allocated for packing"
}
```
**Expected Status**: `200 OK`  
**Response**:
```json
{
  "success": true,
  "data": {
    "id": "ord_99887766-5544-3322-1100-aabbccddeeff",
    "orderNumber": "ORD-20260903-E5A7B9",
    "status": "CONFIRMED",
    "updatedAt": "2026-09-03T10:16:00.000Z"
  }
}
```

---

### STEP 19 — SELLER PROCESSES ORDER
**Purpose**: Seller marks order as being packed in warehouse (`CONFIRMED` → `PROCESSING`).  
**Method**: `POST`  
**Full URL**: `{{baseUrl}}/api/v1/orders/seller/orders/{{orderId}}/process`  
**Authentication**: Bearer Token  
**Authorization**: `SELLER` or `ADMIN`  
**Headers**:
```http
Content-Type: application/json
Authorization: Bearer {{sellerToken}}
```
**Path Parameters**:
- `id`: `{{orderId}}`

**Request Body**:
```json
{
  "reason": "Order packed, boxed, and labelled with barcode"
}
```
**Expected Status**: `200 OK`  
**Response**:
```json
{
  "success": true,
  "data": {
    "id": "ord_99887766-5544-3322-1100-aabbccddeeff",
    "orderNumber": "ORD-20260903-E5A7B9",
    "status": "PROCESSING",
    "updatedAt": "2026-09-03T10:18:00.000Z"
  }
}
```

---

### STEP 20 — SELLER SHIPS ORDER
**Purpose**: Seller hands over the packed parcel to courier and attaches tracking AWB (`PROCESSING` → `SHIPPED`).  
**Method**: `POST`  
**Full URL**: `{{baseUrl}}/api/v1/orders/seller/orders/{{orderId}}/ship`  
**Authentication**: Bearer Token  
**Authorization**: `SELLER` or `ADMIN`  
**Headers**:
```http
Content-Type: application/json
Authorization: Bearer {{sellerToken}}
```
**Path Parameters**:
- `id`: `{{orderId}}`

**Request Body**:
```json
{
  "courierName": "BlueDart Express",
  "trackingNumber": "BLUEDART-AWB-987654321",
  "reason": "Handed over to BlueDart courier agent"
}
```
*(Validation: `courierName` between 2–50 chars; `trackingNumber` between 6–50 chars)*  
**Expected Status**: `200 OK`  
**Response**:
```json
{
  "success": true,
  "data": {
    "id": "ord_99887766-5544-3322-1100-aabbccddeeff",
    "orderNumber": "ORD-20260903-E5A7B9",
    "status": "SHIPPED",
    "courierName": "BlueDart Express",
    "trackingNumber": "BLUEDART-AWB-987654321",
    "updatedAt": "2026-09-03T10:20:00.000Z"
  }
}
```
**Postman Test Script / Variable Extraction**:
```javascript
pm.environment.set("trackingNumber", pm.response.json().data.trackingNumber);
```

---

### STEP 21 — MARK OUT FOR DELIVERY
**Purpose**: Last-mile courier agent updates run-sheet to out for delivery (`SHIPPED` → `OUT_FOR_DELIVERY`).  
**Method**: `POST`  
**Full URL**: `{{baseUrl}}/api/v1/orders/logistics/orders/{{orderId}}/out-for-delivery`  
**Authentication**: Bearer Token  
**Authorization**: `COURIER`, `LOGISTICS`, or `ADMIN`  
**Headers**:
```http
Content-Type: application/json
Authorization: Bearer {{logisticsToken}}
```
**Path Parameters**:
- `id`: `{{orderId}}`

**Request Body**:
```json
{
  "deliveryAgentName": "Vikram Rathore",
  "deliveryAgentPhone": "+919844455566",
  "reason": "Dispatched for door delivery"
}
```
*(Validation: `deliveryAgentName` 2–100 chars; `deliveryAgentPhone` 5–30 chars)*  
**Expected Status**: `200 OK`  
**Response**:
```json
{
  "success": true,
  "data": {
    "id": "ord_99887766-5544-3322-1100-aabbccddeeff",
    "orderNumber": "ORD-20260903-E5A7B9",
    "status": "OUT_FOR_DELIVERY",
    "deliveryAgentName": "Vikram Rathore",
    "deliveryAgentPhone": "+919844455566",
    "updatedAt": "2026-09-03T10:25:00.000Z"
  }
}
```

---

### STEP 22 — MARK DELIVERED WITH PROOF OF DELIVERY (POD)
**Purpose**: Records successful handover to customer with verified POD (`OUT_FOR_DELIVERY` → `DELIVERED`).  
**Method**: `POST`  
**Full URL**: `{{baseUrl}}/api/v1/orders/logistics/orders/{{orderId}}/deliver`  
**Authentication**: Bearer Token  
**Authorization**: `COURIER`, `LOGISTICS`, or `ADMIN`  
**Headers**:
```http
Content-Type: application/json
Authorization: Bearer {{logisticsToken}}
```
**Path Parameters**:
- `id`: `{{orderId}}`

**Request Body**:
```json
  {
    "recipientName": "Rahul Sharma",
    "podReference": "POD-SIG-88776655",
    "deliveryNotes": "Delivered to recipient in person at doorstep",
    "codAmountCollected": null
  }
```
*(For COD orders, pass `"codAmountCollected": "5898.82"` to trigger COD settlement)*  
**Expected Status**: `200 OK`  
**Response**:
```json
{
  "success": true,
  "data": {
    "id": "ord_99887766-5544-3322-1100-aabbccddeeff",
    "orderNumber": "ORD-20260903-E5A7B9",
    "status": "DELIVERED",
    "deliveredAt": "2026-09-03T10:30:00.000Z",
    "podMetadata": {
      "recipientName": "Rahul Sharma",
      "podReference": "POD-SIG-88776655",
      "deliveryNotes": "Delivered to recipient in person at doorstep",
      "deliveredByRole": "COURIER",
      "deliveredByActorId": "courier-user-uuid"
    }
  }
}
```

---

### STEP 23 — CREATE RETURN REQUEST
**Purpose**: Customer initiates reverse logistics return for the delivered order.  
**Gateway Route Verification**: Proxied to `fulfillment-svc` at `/api/v1/returns` (`services/gateway/src/app.js:239`).  
**Method**: `POST`  
**Full URL**: `{{baseUrl}}/api/v1/returns`  
**Authentication**: Bearer Token  
**Authorization**: `CUSTOMER` or `ADMIN`  
**Headers**:
```http
Content-Type: application/json
Authorization: Bearer {{customerToken}}
```
**Request Body**:
```json
{
  "orderId": "{{orderId}}",
  "warehouseId": "{{warehouseId}}",
  "pickupAddress": {
    "fullName": "Rahul Sharma",
    "phone": "+919876543210",
    "streetAddress": "Flat 402, Sunshine Heights, MG Road",
    "city": "Bengaluru",
    "state": "Karnataka",
    "postalCode": "560001"
  },
  "items": [
    {
      "productId": "{{productId}}",
      "sku": "{{productSku}}",
      "sellerId": "{{sellerId}}",
      "quantity": 1,
      "reason": "Size or fit issue, requesting replacement or refund"
    }
  ],
  "courierCode": "INTERNAL_FLEET"
}
```
**Allowed `courierCode` values**: `DELHIVERY`, `BLUEDART`, `SHIPROCKET`, `EKART`, `INTERNAL_FLEET`  
**Expected Status**: `201 Created`  
**Response**:
```json
{
  "success": true,
  "data": {
    "id": "ret_44556677-8899-0011-2233-445566778899",
    "return_number": "RET-20260903-AB12CD",
    "order_id": "ord_99887766-5544-3322-1100-aabbccddeeff",
    "user_id": "e4b6c3d2-8f1a-4d7e-9c0b-123456789abc",
    "warehouse_id": "w1a2b3c4-d5e6-7f8a-9b0c-112233445566",
    "status": "REQUESTED",
    "courier_code": "INTERNAL_FLEET",
    "created_at": "2026-09-03T10:35:00.000Z"
  }
}
```
**Postman Test Script / Variable Extraction**:
```javascript
pm.environment.set("returnId", pm.response.json().data.id);
```

---

### STEP 24 — SCHEDULE RETURN PICKUP
**Purpose**: Logistics schedules door pickup and generates a reverse tracking number (`REQUESTED` → `PICKUP_SCHEDULED`).  
**Method**: `POST`  
**Full URL**: `{{baseUrl}}/api/v1/returns/{{returnId}}/schedule`  
**Authentication**: Bearer Token  
**Authorization**: `COURIER`, `LOGISTICS`, or `ADMIN`  
**Headers**:
```http
Content-Type: application/json
Authorization: Bearer {{logisticsToken}}
```
**Path Parameters**:
- `id`: `{{returnId}}`

**Request Body**:
```json
{
  "courierCode": "INTERNAL_FLEET",
  "returnTrackingNumber": "RET-TRK-IF-20260903-8899",
  "scheduledDate": "2026-09-04T10:00:00.000Z"
}
```
**Expected Status**: `200 OK`  
**Response**:
```json
{
  "success": true,
  "data": {
    "id": "ret_44556677-8899-0011-2233-445566778899",
    "status": "PICKUP_SCHEDULED",
    "return_tracking_number": "RET-TRK-IF-20260903-8899",
    "scheduled_date": "2026-09-04T10:00:00.000Z"
  }
}
```
**Postman Test Script / Variable Extraction**:
```javascript
pm.environment.set("returnTrackingNumber", pm.response.json().data.return_tracking_number);
```

---

### STEP 24B — RECORD PROOF OF PICKUP
**Purpose**: Courier collects the parcel at customer's doorstep (`PICKUP_SCHEDULED` → `PICKED_UP`).  
**Method**: `POST`  
**Full URL**: `{{baseUrl}}/api/v1/returns/{{returnId}}/pickup`  
**Authentication**: Bearer Token  
**Authorization**: `COURIER`, `LOGISTICS`, or `ADMIN`  
**Headers**:
```http
Content-Type: application/json
Authorization: Bearer {{logisticsToken}}
```
**Request Body**:
```json
{
  "signature": "SIG-CUSTOMER-RAHUL",
  "receivedBy": "Vikram Rathore",
  "location": "Bengaluru Doorstep"
}
```
**Expected Status**: `200 OK`  
**Response**:
```json
{
  "success": true,
  "data": {
    "id": "ret_44556677-8899-0011-2233-445566778899",
    "status": "PICKED_UP",
    "picked_up_at": "2026-09-03T10:40:00.000Z"
  }
}
```

---

### STEP 24C — RECEIVE RETURN AT WAREHOUSE
**Purpose**: Inward intake scan when package arrives at destination warehouse (`PICKED_UP` → `RECEIVED_AT_WAREHOUSE`).  
**Method**: `POST`  
**Full URL**: `{{baseUrl}}/api/v1/returns/{{returnId}}/receive`  
**Authentication**: Bearer Token  
**Authorization**: `LOGISTICS` or `ADMIN`  
**Headers**:
```http
Content-Type: application/json
Authorization: Bearer {{logisticsToken}}
```
**Request Body**:
```json
{
  "location": "Gurugram Warehouse Intake Dock 2",
  "notes": "Original packaging intact, seal undamaged"
}
```
**Expected Status**: `200 OK`  
**Response**:
```json
{
  "success": true,
  "data": {
    "id": "ret_44556677-8899-0011-2233-445566778899",
    "status": "RECEIVED_AT_WAREHOUSE",
    "received_at": "2026-09-03T10:45:00.000Z"
  }
}
```

---

### STEP 25 — QUALITY INSPECTION (QC) & RESTOCKING
**Purpose**: Inspects returned goods, grades quality, records result, and triggers automatic actions.  
**Code Reference**: `services/fulfillment-svc/src/services/return-pickup.service.js:416-565`

#### Valid Inspection Grades:
- `PASS` → **Eligible for Restock & Full Refund**
- `DAMAGED` → No restock, partial/no refund based on policy
- `DEFECTIVE` → Quarantine, return to vendor
- `WRONG_ITEM` → Rejection
- `MISSING_ACCESSORIES` → Partial deduction

**Method**: `POST`  
**Full URL**: `{{baseUrl}}/api/v1/returns/{{returnId}}/inspect`  
**Authentication**: Bearer Token  
**Authorization**: `LOGISTICS` or `ADMIN`  
**Headers**:
```http
Content-Type: application/json
Authorization: Bearer {{logisticsToken}}
```
**Request Body**:
```json
{
  "inspections": [
    {
      "sku": "{{productSku}}",
      "grade": "PASS",
      "notes": "Item brand new, all accessories and tags present"
    }
  ],
  "inspectionNotes": "Inspection verified by warehouse QC supervisor"
}
```
**Expected Status**: `200 OK`  
**Response**:
```json
{
  "success": true,
  "data": {
    "id": "ret_44556677-8899-0011-2233-445566778899",
    "status": "COMPLETED",
    "completed_at": "2026-09-03T10:50:00.000Z",
    "items": [
      {
        "sku": "APEX-PROD-001",
        "inspection_grade": "PASS",
        "is_restocked": true,
        "restocked_at": "2026-09-03T10:50:00.000Z"
      }
    ]
  }
}
```

---

### STEP 26 — RESTOCK BEHAVIOR
**No separate Postman call is required.**

#### Code Verification:
In `services/fulfillment-svc/src/services/return-pickup.service.js` lines 457–489:
During the execution of `inspectAndRestock()`, when an item receives `grade: "PASS"`, the method atomically:
1. Queries `inventoryRepo.findByWarehouseAndSku(warehouseId, sku)`
2. Calls `adjustStock()` with `quantityOnHandDelta: +item.quantity`
3. Sets `is_restocked: true` and `restocked_at: now` on the return item record
4. Emits `inventory.adjusted` outbox event to Kafka

---

### STEP 27 — AUTOMATIC REFUND VIA KAFKA
**No manual refund request is required.**

#### Code Verification & Event Sequence:
1. `fulfillment-svc` completes inspection → persists `return.completed` in `FulfillmentOutbox` table.
2. `FulfillmentOutboxWorker` polls outbox → publishes event to Kafka topic `ecommerce.fulfillment-events`.
3. `payment-svc` Kafka consumer group `payment-return-group` (`services/payment-svc/src/workers/payment-return-consumer.js`) consumes `return.completed`.
4. Consumer invokes `ReturnRefundWorker.processEvent()` with durable deduplication in `ProcessedEvent` table.
5. Invokes `ReturnRefundService.processReturnRefund()`:
   - For Razorpay prepaid payments: Calls `razorpayProvider.refund()` and transitions payment status to `REFUNDED`.
   - For COD payments: Records a completed cash refund voucher with status `PROCESSED`.
   - Emits `payment.refunded` event to Kafka topic `ecommerce.payment-events`.

#### Verification Endpoint (Check Refund Status):
Call this endpoint in Postman to verify the refund executed successfully:

**Method**: `GET`  
**Full URL**: `{{baseUrl}}/api/v1/payments/{{paymentId}}`  
**Authentication**: Bearer Token  
**Authorization**: `CUSTOMER` (owns payment) or `ADMIN`  
**Headers**:
```http
Authorization: Bearer {{customerToken}}
```
**Path Parameters**:
- `id`: `{{paymentId}}`

**Expected Status**: `200 OK`  
**Expected Response**:
```json
{
  "success": true,
  "data": {
    "id": "{{paymentId}}",
    "order_id": "{{orderId}}",
    "status": "REFUNDED",
    "amount": "5898.82",
    "currency": "INR",
    "payment_method": "RAZORPAY",
    "refunds": [
      {
        "id": "ref_99001122-3344-5566-7788-9900aabbccdd",
        "payment_id": "{{paymentId}}",
        "order_id": "{{orderId}}",
        "amount": "5898.82",
        "currency": "INR",
        "status": "PROCESSED",
        "razorpay_refund_id": "rfnd_mock_1a2b3c4d",
        "reason": "Return Completed (RET-20260903-AB12CD)"
      }
    ]
  }
}
```
**Postman Test Script / Variable Extraction**:
```javascript
const refunds = pm.response.json().data.refunds;
if (refunds && refunds.length > 0) {
  pm.environment.set("refundId", refunds[0].id);
}
```

---

### Step 29: Create Product Review & Event-Driven Rating Aggregation

**Purpose**: Submit a verified customer review for a purchased product. Review creation atomically records the review, enqueues an outbox event, publishes `review.created` to Kafka, and triggers the catalog review consumer to recalculate `average_rating` and `rating_count`.  
**Method**: `POST`  
**Full URL**: `{{baseUrl}}/api/v1/reviews`  
**Authentication**: Bearer Token  
**Authorization**: `CUSTOMER` or `ADMIN`  
**Headers**:
```http
Authorization: Bearer {{customerToken}}
Content-Type: application/json
```
**Request Body**:
```json
{
  "productId": "{{productId}}",
  "rating": 5,
  "title": "Exceptional Quality Shirt",
  "comment": "Fabric quality is superior, stitched well, and fits perfectly as described."
}
```
**Expected Status**: `201 Created`  
**Expected Response**:
```json
{
  "success": true,
  "data": {
    "id": "rev-1001-uuid",
    "product_id": "{{productId}}",
    "user_id": "{{customerId}}",
    "rating": 5,
    "title": "Exceptional Quality Shirt",
    "comment": "Fabric quality is superior, stitched well, and fits perfectly as described.",
    "is_published": true
  },
  "meta": {
    "requestId": "req_rev_001"
  }
}
```
**Postman Test Script / Variable Extraction**:
```javascript
const res = pm.response.json();
if (res.data && res.data.id) {
  pm.environment.set("reviewId", res.data.id);
}
```

---

### Step 29B: Verify Product Rating Recalculation

**Purpose**: Verify that the product's `average_rating` and `rating_count` were recalculated automatically by the Kafka event consumer without manual intervention.  
**Method**: `GET`  
**Full URL**: `{{baseUrl}}/api/v1/products/{{productId}}`  
**Authentication**: None  
**Headers**: None  
**Expected Status**: `200 OK`  
**Expected Response**:
```json
{
  "success": true,
  "data": {
    "id": "{{productId}}",
    "title": "Classic Oxford Cotton Shirt",
    "average_rating": "5.00",
    "rating_count": 1,
    "status": "PUBLISHED"
  }
}
```

---

### Step 30: Seller Sales Analytics — Overview

**Purpose**: Retrieve real-time sales overview metrics scoped strictly to the authenticated seller based on actual order and payment transactions.  
**Method**: `GET`  
**Full URL**: `{{baseUrl}}/api/v1/seller/analytics/overview?startDate=2026-01-01&endDate=2026-12-31`  
**Authentication**: Bearer Token  
**Authorization**: `SELLER`  
**Headers**:
```http
Authorization: Bearer {{sellerToken}}
```
**Query Parameters**:
- `startDate` (optional, ISO date): `2026-01-01`
- `endDate` (optional, ISO date): `2026-12-31`

**Expected Status**: `200 OK`  
**Expected Response**:
```json
{
  "success": true,
  "data": {
    "totalRevenue": 5898.82,
    "totalOrders": 1,
    "totalUnitsSold": 1,
    "averageOrderValue": 5898.82,
    "ordersByStatus": {
      "PLACED": 0,
      "CONFIRMED": 0,
      "PROCESSING": 0,
      "SHIPPED": 0,
      "OUT_FOR_DELIVERY": 0,
      "DELIVERED": 1,
      "CANCELLED": 0
    },
    "cancelledRevenue": 0,
    "dateRange": {
      "startDate": "2026-01-01",
      "endDate": "2026-12-31"
    }
  }
}
```

---

### Step 31: Seller Sales Analytics — Revenue Timeline

**Purpose**: Fetch historical sales and revenue grouped by interval (`day` or `month`) for interactive charts and graphs.  
**Method**: `GET`  
**Full URL**: `{{baseUrl}}/api/v1/seller/analytics/timeline?interval=day`  
**Authentication**: Bearer Token  
**Authorization**: `SELLER`  
**Headers**:
```http
Authorization: Bearer {{sellerToken}}
```
**Query Parameters**:
- `interval`: `day` (or `month`)

**Expected Status**: `200 OK`  
**Expected Response**:
```json
{
  "success": true,
  "data": {
    "interval": "day",
    "timeline": [
      {
        "date": "2026-09-04",
        "revenue": 5898.82,
        "unitsSold": 1,
        "orderCount": 1
      }
    ],
    "totalPoints": 1
  }
}
```

---

### Step 32: Seller Sales Analytics — Top-Selling Products

**Purpose**: Retrieve ranked top-performing products by revenue and units sold directly aggregated from database items.  
**Method**: `GET`  
**Full URL**: `{{baseUrl}}/api/v1/seller/analytics/top-products?limit=5`  
**Authentication**: Bearer Token  
**Authorization**: `SELLER`  
**Headers**:
```http
Authorization: Bearer {{sellerToken}}
```
**Query Parameters**:
- `limit`: `5`

**Expected Status**: `200 OK`  
**Expected Response**:
```json
{
  "success": true,
  "data": [
    {
      "productId": "{{productId}}",
      "title": "Classic Oxford Cotton Shirt",
      "unitsSold": 1,
      "totalRevenue": 5898.82
    }
  ]
}
```

---

### Step 33: Admin Platform KPI Command Center Aggregation

**Purpose**: Single-call Gateway aggregation endpoint fetching real-time platform metrics across all downstream microservices (Identity, Catalog, Order, Payment, Fulfillment, Notification) with 60-second Redis caching and partial-failure fallback.  
**Method**: `GET`  
**Full URL**: `{{baseUrl}}/api/v1/admin/dashboard/summary`  
**Authentication**: Bearer Token  
**Authorization**: `ADMIN`  
**Headers**:
```http
Authorization: Bearer {{adminToken}}
```
**Expected Status**: `200 OK`  
**Expected Response**:
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalOrders": 1,
      "totalRevenue": 5898.82,
      "averageOrderValue": 5898.82,
      "totalUsers": 3,
      "activeUsers": 3,
      "totalSellers": 1,
      "pendingSellerApplications": 0,
      "activeOrders": 0,
      "totalReturns": 1,
      "lowStockAlertsCount": 0
    },
    "orders": {
      "statusBreakdown": { "DELIVERED": 1 },
      "totalOrders": 1,
      "totalRevenue": 5898.82
    },
    "payments": {
      "capturedCount": 1,
      "totalCapturedAmount": 5898.82,
      "failedCount": 0,
      "refundedCount": 1,
      "totalRefundedAmount": 5898.82
    },
    "returns": {
      "totalReturns": 1,
      "statusBreakdown": { "COMPLETED": 1 }
    },
    "serviceHealth": {
      "identity": "healthy",
      "catalog": "healthy",
      "order": "healthy",
      "payment": "healthy",
      "fulfillment": "healthy",
      "notification": "healthy"
    },
    "generatedAt": "2026-09-04T19:30:00.000Z"
  }
}
```

---

### Step 34: Reverse Logistics Rate Limiting Protection (429 Verification)

**Purpose**: Prove that return creation (`POST /api/v1/returns`) enforces strict user-aware Redis rate limiting (maximum 5 requests per minute) and rejects excessive abuse with `429 Too Many Requests`.  
**Method**: `POST`  
**Full URL**: `{{baseUrl}}/api/v1/returns`  
**Authentication**: Bearer Token  
**Authorization**: `CUSTOMER`  
**Headers**:
```http
Authorization: Bearer {{customerToken}}
Content-Type: application/json
```
**Execution**: Send 6 requests rapidly.  
**Expected Status**: `429 Too Many Requests` (on 6th request)  
**Expected Response**:
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests, please slow down",
    "details": {
      "retryAfter": 60
    }
  }
}
```
**Response Headers Verified**:
- `X-RateLimit-Limit`: `5`
- `X-RateLimit-Remaining`: `0`
- `Retry-After`: Reset duration in seconds

---

---

## 4. REAL-TIME NOTIFICATIONS (SERVER-SENT EVENTS)

**Purpose**: Stream live order, shipment, and payment notifications to the connected client.  
**Route**: `GET /api/v1/notifications/stream` (`services/notification-svc/src/routes/notification.routes.js:104`)

### How to Test SSE in Postman:
1. Open a new request tab in Postman.
2. Set Method to `GET`.
3. Set URL to `{{baseUrl}}/api/v1/notifications/stream`.
4. Under **Headers**, add:
   ```http
   Authorization: Bearer {{customerToken}}
   Accept: text/event-stream
   Cache-Control: no-cache
   ```
   *(Note: You can also test in a browser or curl with `?token={{customerToken}}`)*
5. Click **Send**.
6. Postman will keep the connection open and render streamed events in real time.
7. **When to start**: Launch this SSE connection **before Step 17 (Create Order)** so you can observe incoming live events as the order transitions through `PLACED` → `CONFIRMED` → `SHIPPED` → `DELIVERED` → `RETURN_COMPLETED`.

**Stream Output Example**:
```http
event: connected
data: {"connectionId":"conn_abc123","timestamp":"2026-09-03T10:14:00.000Z"}

event: notification
data: {"id":"notif_1","type":"ORDER_PLACED","title":"Order Placed","message":"Your order ORD-20260903-E5A7B9 has been placed successfully."}

event: notification
data: {"id":"notif_2","type":"SHIPMENT_SHIPPED","title":"Order Shipped","message":"Your parcel has been handed to BlueDart Express."}
```

---

## 5. AUTOMATIC KAFKA EVENT EVENT-DRIVEN SAGA

| Stage | Triggering Action | Service | Source Database & Outbox | Kafka Topic | Event Type | Consumer Group | Downstream Service & Effect |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | Create Order | `order-svc` | `order_db` (`OrderOutbox`) | `ecommerce.order-events` | `order.placed` | `fulfillment-order-group` | `fulfillment-svc`: Creates picking allocation / reservation |
| **2** | Create Order | `order-svc` | `order_db` (`OrderOutbox`) | `ecommerce.order-events` | `order.placed` | `notification-group` | `notification-svc`: Renders email & pushes SSE event to customer |
| **3** | Settle COD / Deliver | `order-svc` | `order_db` (`OrderOutbox`) | `ecommerce.order-events` | `order.delivered` | `notification-group` | `notification-svc`: Pushes delivery confirmation SMS/SSE |
| **4** | Return Requested | `fulfillment-svc` | `fulfillment_db` (`FulfillmentOutbox`) | `ecommerce.fulfillment-events`| `return.requested` | `notification-group` | `notification-svc`: Notifies customer that pickup will be scheduled |
| **5** | Return Received | `fulfillment-svc` | `fulfillment_db` (`FulfillmentOutbox`) | `ecommerce.fulfillment-events`| `return.received` | `notification-group` | `notification-svc`: Notifies customer parcel reached hub |
| **6** | QC Complete | `fulfillment-svc` | `fulfillment_db` (`FulfillmentOutbox`) | `ecommerce.fulfillment-events`| `return.completed` | `payment-return-group` | `payment-svc`: Consumes event, verifies idempotency, triggers Razorpay refund |
| **7** | Restock (QC PASS) | `fulfillment-svc` | `fulfillment_db` (`FulfillmentOutbox`) | `ecommerce.fulfillment-events`| `inventory.adjusted` | `catalog-group` | Updates search index / product stock badge |
| **8** | Refund Executed | `payment-svc` | `payment_db` (`PaymentOutbox`) | `ecommerce.payment-events` | `payment.refunded` | `notification-group` | `notification-svc`: Sends refund receipt notification |

---

## 6. FAILURE & RESILIENCY TESTS

### 1. Invalid Login Credentials
- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/v1/auth/login`
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "email": "{{customerEmail}}",
    "password": "WrongPassword999!"
  }
  ```
- **Expected Status**: `401 Unauthorized`
- **Expected Response**:
  ```json
  {
    "success": false,
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Invalid email or password"
    }
  }
  ```

---

### 2. Missing JWT on Protected Route
- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/v1/cart/items`
- **Headers**: `Content-Type: application/json` *(No Authorization header)*
- **Body**: `{"productId": "{{productId}}", "quantity": 1}`
- **Expected Status**: `401 Unauthorized`
- **Expected Response**:
  ```json
  {
    "success": false,
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Authentication required to access cart"
    }
  }
  ```

---

### 3. Invalid / Malformed JWT
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/v1/users/me`
- **Headers**: `Authorization: Bearer invalid.jwt.token.string`
- **Expected Status**: `401 Unauthorized`
- **Expected Response**:
  ```json
  {
    "success": false,
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Invalid or expired token"
    }
  }
  ```

---

### 4. Unauthorized Role (Customer Attempts Admin Operation)
- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/v1/warehouses`
- **Headers**:
  ```http
  Content-Type: application/json
  Authorization: Bearer {{customerToken}}
  ```
- **Body**: `{"code": "WH-HACK", "name": "Fake", "city": "Delhi"}`
- **Expected Status**: `403 Forbidden`
- **Expected Response**:
  ```json
  {
    "success": false,
    "error": {
      "code": "FORBIDDEN",
      "message": "Admin privileges required"
    }
  }
  ```

---

### 5. Invalid Order State Transition (Skip States)
- **Purpose**: Test state machine enforcement by attempting to mark a `PLACED` order directly as `DELIVERED`.
- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/v1/orders/logistics/orders/{{orderId}}/deliver`
- **Headers**:
  ```http
  Content-Type: application/json
  Authorization: Bearer {{logisticsToken}}
  ```
- **Body**:
  ```json
  {
    "recipientName": "Rahul Sharma",
    "podReference": "POD-ILLEGAL-JUMP"
  }
  ```
- **Expected Status**: `422 Unprocessable Entity` (or `400 Bad Request`)
- **Expected Response**:
  ```json
  {
    "success": false,
    "error": {
      "code": "BUSINESS_RULE_ERROR",
      "message": "Invalid order status transition from 'PLACED' to 'DELIVERED'"
    }
  }
  ```

---

### 6. Duplicate Idempotency-Key with Different Payload
- **Purpose**: Ensures order creation detects payload tampering on an existing key.
- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/v1/orders`
- **Headers**:
  ```http
  Content-Type: application/json
  Authorization: Bearer {{customerToken}}
  Idempotency-Key: postman-order-fixed-key-12345
  ```
- **First Call Body**: `{"addressId": "{{addressId}}", "paymentMethod": "COD"}` *(Returns 201)*
- **Second Call Body with Different Notes**:
  ```json
  {
    "addressId": "{{addressId}}",
    "paymentMethod": "COD",
    "customerNotes": "Changed my mind"
  }
  ```
- **Expected Status**: `409 Conflict`
- **Expected Response**:
  ```json
  {
    "success": false,
    "error": {
      "code": "IDEMPOTENCY_KEY_REUSED",
      "message": "Idempotency key has already been used for a different request payload"
    }
  }
  ```

---

### 7. Cryptographic Payment Verification Failure
- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/v1/payments/verify`
- **Headers**:
  ```http
  Content-Type: application/json
  Authorization: Bearer {{customerToken}}
  ```
- **Body**:
  ```json
  {
    "paymentId": "{{paymentId}}",
    "razorpayOrderId": "{{razorpayOrderId}}",
    "razorpayPaymentId": "pay_fake_123",
    "razorpaySignature": "bad_forged_hmac_signature_0000000000"
  }
  ```
- **Expected Status**: `403 Forbidden`
- **Expected Response**:
  ```json
  {
    "success": false,
    "error": {
      "code": "FORBIDDEN",
      "message": "Invalid payment signature. Payment authorization rejected."
    }
  }
  ```
- **Database Effect**: Payment record transitions to `FAILED` status with failure reason recorded.

---

### 8. Out of Stock / Stock Shortage during Allocation
- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/v1/inventory/check`
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "items": [
      {
        "sku": "{{productSku}}",
        "requestedQuantity": 99999
      }
    ]
  }
  ```
- **Expected Status**: `200 OK`
- **Expected Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "sku": "APEX-PROD-001",
        "requestedQuantity": 99999,
        "availableQuantity": 100,
        "inStock": false
      }
    ]
  }
  ```

---

### 9. Return on Non-Delivered Order
- **Purpose**: Attempting to request a return on an order that is still in `PLACED` or `SHIPPED` status.
- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/v1/returns`
- **Headers**:
  ```http
  Content-Type: application/json
  Authorization: Bearer {{customerToken}}
  ```
- **Body**:
  ```json
  {
    "orderId": "<undelivered-order-id>",
    "pickupAddress": {"streetAddress": "Test", "city": "Delhi", "postalCode": "110001"},
    "items": [{"sku": "{{productSku}}", "quantity": 1}]
  }
  ```
- **Expected Status**: `400 Bad Request` or `422 Unprocessable Entity`
- **Expected Response**:
  ```json
  {
    "success": false,
    "error": {
      "code": "BUSINESS_RULE_ERROR",
      "message": "Cannot request return: Order is not in DELIVERED status"
    }
  }
  ```

---

### 10. Invalid QC Grade
- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/v1/returns/{{returnId}}/inspect`
- **Headers**:
  ```http
  Content-Type: application/json
  Authorization: Bearer {{logisticsToken}}
  ```
- **Body**:
  ```json
  {
    "inspections": [
      {
        "sku": "{{productSku}}",
        "grade": "EXCELLENT_CONDITION"
      }
    ]
  }
  ```
- **Expected Status**: `400 Bad Request`
- **Expected Response**:
  ```json
  {
    "success": false,
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Invalid inspection grade 'EXCELLENT_CONDITION'. Allowed: PASS, DAMAGED, DEFECTIVE, WRONG_ITEM, MISSING_ACCESSORIES"
    }
  }
  ```

---

### 11. Rate Limiting Protection (Auth Login Brute Force)
- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/v1/auth/login`
- **Headers**: `Content-Type: application/json`
- **Action**: Fire 15 consecutive requests in less than 60 seconds with rapid runner.
- **Expected Status**: `429 Too Many Requests`
- **Expected Response**:
  ```json
  {
    "success": false,
    "error": {
      "code": "TOO_MANY_REQUESTS",
      "message": "Too many requests from this IP, please try again after a moment"
    }
  }
  ```

---

### 12. Notification DLQ Inspection & Replay
- **Query DLQ**: `GET {{baseUrl}}/api/v1/notifications/admin/kafka/dlq`
  - **Headers**: `Authorization: Bearer {{adminToken}}`
  - **Expected Status**: `200 OK`
- **Replay DLQ**: `POST {{baseUrl}}/api/v1/notifications/admin/kafka/dlq/<dlqId>/replay`
  - **Headers**: `Authorization: Bearer {{adminToken}}`
  - **Expected Status**: `200 OK`

---

## 7. POSTMAN COLLECTION STRUCTURE

Organize your Postman Collection folders as follows:

```
├── 01 Auth
│   ├── 01 Admin Login
│   ├── 02 Register Customer
│   ├── 03 Verify Customer Email
│   ├── 04 Login Customer
│   └── 05 Get Customer Profile (Me)
├── 02 Address
│   ├── 01 Create Customer Address
│   └── 02 List Customer Addresses
├── 03 Seller
│   ├── 01 Register Seller
│   ├── 02 Verify Seller Email
│   ├── 03 Admin Approve Seller
│   └── 04 Login Seller
├── 04 Courier & Logistics Setup
│   ├── 01 Register Courier User
│   ├── 02 Admin Assign COURIER Role
│   └── 03 Login Courier
├── 05 Catalog
│   ├── 01 Admin Create Category
│   ├── 02 Seller Create Product
│   └── 03 Public Browse Products
├── 06 Warehouse & Inventory
│   ├── 01 Admin Create Warehouse
│   ├── 02 Stock Intake (Add Inventory)
│   └── 03 Check Stock
├── 07 Cart
│   ├── 01 Add Item to Cart
│   └── 02 Get Cart
├── 08 Checkout
│   └── 01 Calculate Checkout
├── 09 Payment
│   ├── 01 Initiate Prepaid Payment
│   └── 02 Verify Payment Signature (Safe HMAC Pre-request)
├── 10 Order Placement
│   ├── 01 Create Order (with Idempotency-Key)
│   └── 02 Get Order Details
├── 11 Seller Fulfillment
│   ├── 01 Seller Confirm Order
│   ├── 02 Seller Process Order
│   └── 03 Seller Ship Order (AWB Tracking)
├── 12 Logistics & Last-Mile Delivery
│   ├── 01 Mark Out for Delivery
│   └── 02 Mark Delivered (POD)
├── 13 Reverse Logistics (Returns)
│   ├── 01 Request Return
│   ├── 02 Schedule Return Pickup
│   ├── 03 Record Proof of Pickup
│   ├── 04 Receive Return at Warehouse
│   └── 05 Quality Inspection & Restock
├── 14 Refund Verification
│   └── 01 Get Payment Status & Verify Automatic Refund
├── 15 Real-time Notifications
│   └── 01 Stream Notifications (SSE)
└── 16 Failure & Resiliency Tests
    ├── 01 Invalid Login
    ├── 02 Missing JWT
    ├── 03 Unauthorized Role Access
    ├── 04 Invalid State Machine Transition
    ├── 05 Duplicate Idempotency Key Conflict
    ├── 06 Cryptographic Payment Verification Failure
    ├── 07 Return on Unfinished Order
    └── 08 Invalid QC Grade
```

---

## 8. SINGLE-PAGE ENDPOINT CHEAT SHEET

| Step | Endpoint Path | Method | Auth / Role | Key Headers | Body Summary | Environment Variable Saved | Expected Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **0** | `/api/v1/auth/login` | `POST` | None | `Content-Type: application/json` | `{"email": "admin@ecommerce.com", "password": "..."}` | `adminToken` | `200` |
| **1** | `/api/v1/auth/register` | `POST` | None | `Content-Type: application/json` | `{"email": "...", "firstName": "...", "password": "..."}` | `customerId`, `customerOtp` | `201` |
| **1B**| `/api/v1/auth/verify` | `POST` | None | `Content-Type: application/json` | `{"email": "...", "otp": "..."}` | — | `200` |
| **2** | `/api/v1/auth/login` | `POST` | None | `Content-Type: application/json` | `{"email": "...", "password": "..."}` | `customerToken`, `customerRefreshToken` | `200` |
| **3** | `/api/v1/users/me` | `GET` | `CUSTOMER` | `Authorization: Bearer {{customerToken}}` | None | — | `200` |
| **4** | `/api/v1/users/addresses` | `POST` | `CUSTOMER` | `Authorization: Bearer {{customerToken}}` | `{"fullName": "...", "streetAddress": "...", "postalCode": "..."}` | `addressId` | `201` |
| **5** | `/api/v1/auth/register-seller` | `POST` | None | `Content-Type: application/json` | `{"businessName": "...", "storeSlug": "...", "gstin": "..."}` | `sellerUserId`, `sellerId`, `sellerOtp` | `201` |
| **5B**| `/api/v1/auth/verify` | `POST` | None | `Content-Type: application/json` | `{"email": "{{sellerEmail}}", "otp": "{{sellerOtp}}"}` | — | `200` |
| **6** | `/api/v1/sellers/admin/{{sellerId}}/status` | `PATCH` | `ADMIN` | `Authorization: Bearer {{adminToken}}` | `{"status": "ACTIVE"}` | — | `200` |
| **7** | `/api/v1/auth/login` | `POST` | None | `Content-Type: application/json` | `{"email": "{{sellerEmail}}", "password": "..."}` | `sellerToken` | `200` |
| **8A**| `/api/v1/auth/register` | `POST` | None | `Content-Type: application/json` | `{"email": "{{logisticsEmail}}", ...}` | `courierUserId`, `courierOtp` | `201` |
| **8B**| `/api/v1/users/admin/{{courierUserId}}/role` | `PATCH` | `ADMIN` | `Authorization: Bearer {{adminToken}}` | `{"role": "COURIER"}` | — | `200` |
| **8C**| `/api/v1/auth/login` | `POST` | None | `Content-Type: application/json` | `{"email": "{{logisticsEmail}}", ...}` | `logisticsToken` | `200` |
| **9** | `/api/v1/categories` | `POST` | `ADMIN` | `Authorization: Bearer {{adminToken}}` | `{"name": "...", "slug": "...", "isActive": true}` | `categoryId` | `201` |
| **10**| `/api/v1/seller/products` | `POST` | `SELLER` | `Authorization: Bearer {{sellerToken}}` | `{"categoryId": "...", "title": "...", "sku": "...", "price": ...}` | `productId`, `productSku` | `201` |
| **11**| `/api/v1/warehouses` | `POST` | `ADMIN` | `Authorization: Bearer {{adminToken}}` | `{"code": "...", "name": "...", "city": "...", "postalCode": "..."}` | `warehouseId` | `201` |
| **12**| `/api/v1/inventory/stock` | `POST` | `ADMIN`/`SELLER` | `Authorization: Bearer {{sellerToken}}` | `{"productId": "...", "sku": "...", "warehouseId": "...", "quantity": 100}` | `inventoryId` | `201` |
| **13**| `/api/v1/cart/items` | `POST` | `CUSTOMER` | `Authorization: Bearer {{customerToken}}` | `{"productId": "{{productId}}", "quantity": 1}` | `cartItemId` | `200` |
| **14**| `/api/v1/checkout/calculate` | `POST` | `CUSTOMER` | `Authorization: Bearer {{customerToken}}` | `{"addressId": "{{addressId}}", "useCart": true}` | — | `200` |
| **15**| `/api/v1/payments/initiate` | `POST` | `CUSTOMER` | `Authorization: Bearer {{customerToken}}` | `{"amount": "5898.82", "currency": "INR"}` | `paymentId`, `razorpayOrderId` | `200` |
| **16**| `/api/v1/payments/verify` | `POST` | `CUSTOMER` | `Authorization: Bearer {{customerToken}}` | `{"paymentId": "...", "razorpayOrderId": "...", "razorpaySignature": "..."}` | `razorpayPaymentId` | `200` |
| **17**| `/api/v1/orders` | `POST` | `CUSTOMER` | `Authorization: Bearer {{customerToken}}`<br>`Idempotency-Key: postman-order-{{$guid}}` | `{"addressId": "...", "paymentMethod": "PREPAID", "paymentId": "..."}` | `orderId`, `orderNumber` | `201` |
| **18**| `/api/v1/orders/seller/orders/{{orderId}}/confirm` | `POST` | `SELLER` | `Authorization: Bearer {{sellerToken}}` | `{"reason": "Inventory verified"}` | — | `200` |
| **19**| `/api/v1/orders/seller/orders/{{orderId}}/process` | `POST` | `SELLER` | `Authorization: Bearer {{sellerToken}}` | `{"reason": "Order packed"}` | — | `200` |
| **20**| `/api/v1/orders/seller/orders/{{orderId}}/ship` | `POST` | `SELLER` | `Authorization: Bearer {{sellerToken}}` | `{"courierName": "...", "trackingNumber": "..."}` | `trackingNumber` | `200` |
| **21**| `/api/v1/orders/logistics/orders/{{orderId}}/out-for-delivery` | `POST` | `COURIER` | `Authorization: Bearer {{logisticsToken}}` | `{"deliveryAgentName": "...", "deliveryAgentPhone": "..."}` | — | `200` |
| **22**| `/api/v1/orders/logistics/orders/{{orderId}}/deliver` | `POST` | `COURIER` | `Authorization: Bearer {{logisticsToken}}` | `{"recipientName": "...", "podReference": "..."}` | — | `200` |
| **23**| `/api/v1/returns` | `POST` | `CUSTOMER` | `Authorization: Bearer {{customerToken}}` | `{"orderId": "...", "warehouseId": "...", "items": [...], "pickupAddress": {...}}` | `returnId` | `201` |
| **24**| `/api/v1/returns/{{returnId}}/schedule` | `POST` | `COURIER` | `Authorization: Bearer {{logisticsToken}}` | `{"courierCode": "...", "returnTrackingNumber": "..."}` | `returnTrackingNumber` | `200` |
| **24B**| `/api/v1/returns/{{returnId}}/pickup` | `POST` | `COURIER` | `Authorization: Bearer {{logisticsToken}}` | `{"signature": "...", "receivedBy": "..."}` | — | `200` |
| **24C**| `/api/v1/returns/{{returnId}}/receive` | `POST` | `LOGISTICS` | `Authorization: Bearer {{logisticsToken}}` | `{"location": "...", "notes": "..."}` | — | `200` |
| **25**| `/api/v1/returns/{{returnId}}/inspect` | `POST` | `LOGISTICS` | `Authorization: Bearer {{logisticsToken}}` | `{"inspections": [{"sku": "...", "grade": "PASS"}]}` | — | `200` |
| **26**| *Restock* | — | — | **No separate Postman call required** (Automatic inside Step 25) | — | — | — |
| **27**| *Refund* | — | — | **No manual refund request required** (Triggered by Kafka) | — | — | — |
| **27B**| `/api/v1/payments/{{paymentId}}` | `GET` | `CUSTOMER` | `Authorization: Bearer {{customerToken}}` | None | `refundId` | `200` |
| **28**| `/api/v1/notifications/stream` | `GET` | `CUSTOMER` | `Authorization: Bearer {{customerToken}}`<br>`Accept: text/event-stream` | None (SSE Stream) | — | `200` |
| **29**| `/api/v1/reviews` | `POST` | `CUSTOMER` | `Authorization: Bearer {{customerToken}}` | `{"productId": "{{productId}}", "rating": 5, "title": "...", "comment": "..."}` | `reviewId` | `201` |
| **29B**| `/api/v1/products/{{productId}}` | `GET` | None | None | None (Verify `average_rating` & `rating_count`) | — | `200` |
| **30**| `/api/v1/seller/analytics/overview` | `GET` | `SELLER` | `Authorization: Bearer {{sellerToken}}` | None (Query: `?startDate=...&endDate=...`) | — | `200` |
| **31**| `/api/v1/seller/analytics/timeline` | `GET` | `SELLER` | `Authorization: Bearer {{sellerToken}}` | None (Query: `?interval=day`) | — | `200` |
| **32**| `/api/v1/seller/analytics/top-products` | `GET` | `SELLER` | `Authorization: Bearer {{sellerToken}}` | None (Query: `?limit=5`) | — | `200` |
| **33**| `/api/v1/admin/dashboard/summary` | `GET` | `ADMIN` | `Authorization: Bearer {{adminToken}}` | None (Aggregates GMV, Orders, Users, Payments, Returns, DLQ, Health) | — | `200` |
| **34**| `/api/v1/returns` (Excessive > 5) | `POST` | `CUSTOMER` | `Authorization: Bearer {{customerToken}}` | `{"orderId": "..."}` | — | `429` |
