-- CreateEnum
CREATE TYPE "ShipmentStatus" AS ENUM ('ALLOCATED', 'PACKED', 'DISPATCHED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED_DELIVERY', 'RETURNED_TO_ORIGIN', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CourierCode" AS ENUM ('DELHIVERY', 'BLUEDART', 'SHIPROCKET', 'EKART', 'INTERNAL_FLEET');

-- CreateTable
CREATE TABLE "shipments" (
    "id" UUID NOT NULL,
    "shipment_number" VARCHAR(50) NOT NULL,
    "order_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "warehouse_id" UUID NOT NULL,
    "reservation_id" UUID,
    "status" "ShipmentStatus" NOT NULL DEFAULT 'ALLOCATED',
    "courier_code" "CourierCode" NOT NULL DEFAULT 'INTERNAL_FLEET',
    "tracking_number" VARCHAR(100),
    "shipping_address" JSONB NOT NULL,
    "label_url" VARCHAR(500),
    "manifest_id" VARCHAR(100),
    "estimated_delivery" TIMESTAMPTZ,
    "dispatched_at" TIMESTAMPTZ,
    "delivered_at" TIMESTAMPTZ,
    "delivery_notes" TEXT,
    "pod_signature" VARCHAR(500),
    "pod_received_by" VARCHAR(100),
    "pod_received_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "shipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipment_items" (
    "id" UUID NOT NULL,
    "shipment_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "sku" VARCHAR(100) NOT NULL,
    "seller_id" UUID,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(12,2),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "shipment_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tracking_updates" (
    "id" UUID NOT NULL,
    "shipment_id" UUID NOT NULL,
    "status" "ShipmentStatus" NOT NULL,
    "location" VARCHAR(100),
    "description" VARCHAR(255) NOT NULL,
    "recorded_by" UUID,
    "recorded_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tracking_updates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shipments_shipment_number_key" ON "shipments"("shipment_number");
CREATE UNIQUE INDEX "shipments_tracking_number_key" ON "shipments"("tracking_number");
CREATE INDEX "shipments_order_id_idx" ON "shipments"("order_id");
CREATE INDEX "shipments_user_id_idx" ON "shipments"("user_id");
CREATE INDEX "shipments_warehouse_id_idx" ON "shipments"("warehouse_id");
CREATE INDEX "shipments_reservation_id_idx" ON "shipments"("reservation_id");
CREATE INDEX "shipments_status_idx" ON "shipments"("status");
CREATE INDEX "shipments_tracking_number_idx" ON "shipments"("tracking_number");
CREATE INDEX "shipments_created_at_idx" ON "shipments"("created_at");

-- CreateIndex
CREATE INDEX "shipment_items_shipment_id_idx" ON "shipment_items"("shipment_id");
CREATE INDEX "shipment_items_product_id_idx" ON "shipment_items"("product_id");
CREATE INDEX "shipment_items_sku_idx" ON "shipment_items"("sku");
CREATE INDEX "shipment_items_seller_id_idx" ON "shipment_items"("seller_id");

-- CreateIndex
CREATE INDEX "tracking_updates_shipment_id_recorded_at_idx" ON "tracking_updates"("shipment_id", "recorded_at");

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment_items" ADD CONSTRAINT "shipment_items_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracking_updates" ADD CONSTRAINT "tracking_updates_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
